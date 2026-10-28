export type CameraState = 'A' | 'B';

/** Logical size of the room canvas. */
export const ROOM_WIDTH = 1600;
export const ROOM_HEIGHT = 900;

/** The 800×600 screen inside the monitor bezel, in room coordinates. */
export const SCREEN_RECT = { x: 400, y: 150, w: 800, h: 600 } as const;

/** The monitor centre, which is the room's centre and the camera's origin. */
export const MONITOR_CENTER = { x: 800, y: 450 } as const;

/** Fixed chrome. Neither the top bar nor the shop scales with the room. */
export const TOP_BAR_HEIGHT = 48;
export const SHOP_WIDTH = 300;

const ROOM_SCALE_MIN = 0.65;
const ROOM_SCALE_MAX = 1.5;

export type StageSize = { width: number; height: number };

/**
 * The box the room is transformed inside: the window minus the fixed chrome.
 * The scaling formulas call these `Ws` and `Hs`. They never go negative.
 */
export function stageSize(viewportW: number, viewportH: number, shopVisible: boolean): StageSize {
  return {
    width: Math.max(0, viewportW - (shopVisible ? SHOP_WIDTH : 0)),
    height: Math.max(0, viewportH - TOP_BAR_HEIGHT),
  };
}

/**
 * State A fits the monitor screen into the stage, so the room is cropped around it.
 * State B fits the whole room and is clamped between the floor and the ceiling.
 */
export function scaleForCamera(
  cameraState: CameraState,
  viewportW: number,
  viewportH: number,
  shopVisible: boolean,
): number {
  const { width, height } = stageSize(viewportW, viewportH, shopVisible);
  if (cameraState === 'A') {
    return Math.min(width / SCREEN_RECT.w, height / SCREEN_RECT.h);
  }
  const fit = Math.min(width / ROOM_WIDTH, height / ROOM_HEIGHT);
  return Math.min(ROOM_SCALE_MAX, Math.max(ROOM_SCALE_MIN, fit));
}

/**
 * Moves the room so its monitor centre sits at the centre of the stage box.
 * `stageW` and `stageH` are the stage box dimensions, not the raw window dimensions.
 */
export function transformCSS(stageW: number, stageH: number, scale: number): string {
  const x = stageW / 2 - MONITOR_CENTER.x;
  const y = stageH / 2 - MONITOR_CENTER.y;
  return `translate(${x}px, ${y}px) scale(${scale})`;
}

/** State A hides everything outside the screen rectangle; state B shows the whole room. */
export function clipForCamera(cameraState: CameraState): string | null {
  if (cameraState === 'B') return null;
  const top = SCREEN_RECT.y;
  const right = ROOM_WIDTH - (SCREEN_RECT.x + SCREEN_RECT.w);
  const bottom = ROOM_HEIGHT - (SCREEN_RECT.y + SCREEN_RECT.h);
  return `inset(${top}px ${right}px ${bottom}px ${SCREEN_RECT.x}px)`;
}
