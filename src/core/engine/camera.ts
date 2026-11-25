export type CameraState = 'Screen' | 'Room';

export const ROOM_WIDTH = 1600;
export const ROOM_HEIGHT = 900;
export const SCREEN_RECT = { x: 400, y: 200, w: 800, h: 500 } as const;

/** Fits either the full Room or the adaptive Screen into the viewport. */
export function cameraLayout(camera: CameraState, viewportW: number, viewportH: number) {
  const screenWidth = camera === 'Room' ? 1600 : Math.max(1120, viewportW);
  const screenHeight = camera === 'Room' ? 1000 : Math.max(1000, viewportH);
  const scale =
    camera === 'Room'
      ? Math.min(viewportW / ROOM_WIDTH, viewportH / ROOM_HEIGHT)
      : 2 * Math.min(viewportW / screenWidth, viewportH / screenHeight);
  const centerX = camera === 'Room' ? ROOM_WIDTH / 2 : SCREEN_RECT.x + screenWidth / 4;
  const centerY = camera === 'Room' ? ROOM_HEIGHT / 2 : SCREEN_RECT.y + screenHeight / 4;
  return {
    screenWidth,
    screenHeight,
    transform: `translate(${viewportW / 2 - centerX * scale}px, ${viewportH / 2 - centerY * scale}px) scale(${scale})`,
    clip:
      camera === 'Room'
        ? 'inset(0px)'
        : `inset(${SCREEN_RECT.y}px ${ROOM_WIDTH - SCREEN_RECT.x - screenWidth / 2}px ${ROOM_HEIGHT - SCREEN_RECT.y - screenHeight / 2}px ${SCREEN_RECT.x}px)`,
  };
}
