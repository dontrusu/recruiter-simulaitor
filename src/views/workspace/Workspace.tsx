import { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/core/store/workspace';
import { cameraLayout, ROOM_HEIGHT, ROOM_WIDTH } from '@/core/engine/camera';
import { Room } from '@/views/room/Room';
import { MonitorScreen } from '@/views/monitor/MonitorScreen';
import { DevPanel } from './DevPanel';

const CAMERA_TRANSITION = 'transform 1500ms ease-in-out, clip-path 1500ms ease-in-out';

/** Composes the workspace and controls how the Room is framed. */
export function Workspace() {
  const isDev =
    import.meta.env.DEV &&
    new URLSearchParams(globalThis.location?.search ?? '').get('dev') === '1';
  const viewportW = useWorkspaceStore((state) => state.viewportW);
  const viewportH = useWorkspaceStore((state) => state.viewportH);
  const cameraState = useWorkspaceStore((state) => state.devCameraState);
  const setViewport = useWorkspaceStore((state) => state.setViewport);

  // Only a camera toggle animates; the first paint and every resize are instant.
  // Both flags are adjusted during render so they land in the same commit as the
  // transform they describe — an effect would apply the transition one commit late,
  // after the room has already jumped.
  const [motion, setMotion] = useState(false);
  const [colors, setColors] = useState(false);
  const [wallpaper, setWallpaper] = useState(false);
  const [seen, setSeen] = useState({ camera: cameraState, width: viewportW, height: viewportH });

  if (seen.width !== viewportW || seen.height !== viewportH) {
    setSeen({ ...seen, width: viewportW, height: viewportH });
    setMotion(false);
  } else if (seen.camera !== cameraState) {
    setSeen({ ...seen, camera: cameraState });
    setMotion(true);
  }

  useEffect(() => {
    const observer = new ResizeObserver(() => setViewport(window.innerWidth, window.innerHeight));
    observer.observe(document.documentElement);
    return () => observer.disconnect();
  }, [setViewport]);

  const { screenWidth, screenHeight, transform, clip } = cameraLayout(
    cameraState,
    viewportW,
    viewportH,
  );

  return (
    <div className="flex h-dvh w-screen overflow-hidden bg-background">
      <div className="relative min-w-0 flex-1">
        <div
          className="relative h-full w-full overflow-hidden"
          data-camera={cameraState}
          style={{ background: cameraState === 'Room' ? '#c6bdd1' : undefined }}
        >
          <div
            className="absolute top-0 left-0 motion-reduce:!transition-none"
            style={{
              width: ROOM_WIDTH,
              height: ROOM_HEIGHT,
              transform,
              transformOrigin: 'top left',
              // Room composition asks for no clip; `inset(0px)` keeps the reveal animatable.
              clipPath: clip,
              transition: motion ? CAMERA_TRANSITION : 'none',
            }}
            onTransitionEnd={(event) => {
              // Ignore children; only the room's own camera move ends the motion window.
              if (event.target === event.currentTarget) setMotion(false);
            }}
          >
            <Room screenWidth={screenWidth} screenHeight={screenHeight}>
              <MonitorScreen
                width={screenWidth}
                height={screenHeight}
                colors={isDev && colors}
                wallpaper={isDev && wallpaper}
              />
            </Room>
          </div>
        </div>
      </div>
      {isDev && (
        <DevPanel
          colors={colors}
          wallpaper={wallpaper}
          onColorsChange={setColors}
          onWallpaperChange={setWallpaper}
        />
      )}
    </div>
  );
}
