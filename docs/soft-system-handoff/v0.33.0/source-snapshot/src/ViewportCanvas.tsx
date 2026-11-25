import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { Button } from "@talent-os/design-system";

const ROOM = { width: 1600, height: 900 };
const MONITOR_SCREEN = { width: 1600, height: 1000 };

export function ViewportCanvas({
  children,
  room,
  showRoom,
  onOpenScreen,
}: {
  children: ReactNode;
  room: ReactNode;
  showRoom: boolean;
  onOpenScreen: () => void;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 1440, height: 900 });
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const screen = showRoom
    ? MONITOR_SCREEN
    : {
        width: Math.max(1120, size.width),
        height: Math.max(1000, size.height),
      };
  const screenScale = Math.min(
    size.width / screen.width,
    size.height / screen.height,
  );
  const roomScale = Math.min(
    size.width / ROOM.width,
    size.height / ROOM.height,
  );

  return (
    <div className="canvas-viewport" ref={frame}>
      <div
        className="view-stage"
        style={{ "--room-scale": roomScale } as CSSProperties}
      >
        {room}
        <div
          className="viewport-canvas"
          inert={showRoom}
          style={
            {
              width: screen.width,
              height: screen.height,
              "--view-scale": screenScale,
              "--canvas-height": `${screen.height}px`,
              "--canvas-width": `${screen.width}px`,
            } as CSSProperties
          }
        >
          {children}
        </div>
        {showRoom && (
          <Button
            className="room-monitor-target"
            onClick={onOpenScreen}
            variant="ghost"
          >
            <span>Open Screen ↗</span>
          </Button>
        )}
      </div>
    </div>
  );
}
