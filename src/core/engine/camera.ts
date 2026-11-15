export type CameraState = 'Screen' | 'Room';

/** Logical size of the room canvas. */
export const ROOM_WIDTH = 1600;
export const ROOM_HEIGHT = 900;

/** The physical 800×500 Screen inside the monitor bezel, in Room coordinates. */
export const SCREEN_RECT = { x: 400, y: 200, w: 800, h: 500 } as const;

/** The logical design canvas, scaled uniformly to the physical monitor Screen. */
export const SCREEN_COMPOSITION_WIDTH = 1440;
export const SCREEN_COMPOSITION_HEIGHT = 900;

/** The monitor centre, which is the room's centre and the camera's origin. */
export const MONITOR_CENTER = {
  x: SCREEN_RECT.x + SCREEN_RECT.w / 2,
  y: SCREEN_RECT.y + SCREEN_RECT.h / 2,
} as const;

/** The Shop is fixed-width and remains outside the scaled Room. */
export const SHOP_WIDTH = 300;

export type StageSize = { width: number; height: number };

/**
 * The box the Room is transformed inside: the viewport minus the fixed Shop.
 * The scaling formulas call these `Ws` and `Hs`. They never go negative.
 */
export function stageSize(viewportW: number, viewportH: number, shopVisible: boolean): StageSize {
  return {
    width: Math.max(0, viewportW - (shopVisible ? SHOP_WIDTH : 0)),
    height: Math.max(0, viewportH),
  };
}

/**
 * Screen composition fits the monitor screen into the stage, so the room is cropped around it.
 * Room composition fits the whole room.
 */
export function scaleForCamera(
  cameraState: CameraState,
  viewportW: number,
  viewportH: number,
  shopVisible: boolean,
): number {
  const { width, height } = stageSize(viewportW, viewportH, shopVisible);
  if (cameraState === 'Screen') {
    return Math.min(width / SCREEN_RECT.w, height / SCREEN_RECT.h);
  }
  return Math.min(width / ROOM_WIDTH, height / ROOM_HEIGHT);
}

/**
 * Moves the room so its monitor centre sits at the centre of the stage box.
 * `stageW` and `stageH` are the stage box dimensions, not the raw window dimensions.
 */
export function transformCSS(stageW: number, stageH: number, scale: number): string {
  const x = stageW / 2 - MONITOR_CENTER.x * scale;
  const y = stageH / 2 - MONITOR_CENTER.y * scale;
  return `translate(${x}px, ${y}px) scale(${scale})`;
}

/** Screen composition hides everything outside the screen rectangle; Room composition shows the whole room. */
export function clipForCamera(cameraState: CameraState): string | null {
  if (cameraState === 'Room') return null;
  const top = SCREEN_RECT.y;
  const right = ROOM_WIDTH - (SCREEN_RECT.x + SCREEN_RECT.w);
  const bottom = ROOM_HEIGHT - (SCREEN_RECT.y + SCREEN_RECT.h);
  return `inset(${top}px ${right}px ${bottom}px ${SCREEN_RECT.x}px)`;
}
