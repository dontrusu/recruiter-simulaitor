import { SCREEN_RECT } from '../engine/camera';

/** Width of the beige bezel around the screen, in room pixels. */
export const MONITOR_BEZEL = 40;

/** The y where the wall meets the desk surface. */
export const DESK_LINE = 700;

/** The physical monitor body: the screen rect grown by the bezel on every side. */
export const MONITOR_RECT = {
  x: SCREEN_RECT.x - MONITOR_BEZEL,
  y: SCREEN_RECT.y - MONITOR_BEZEL,
  w: SCREEN_RECT.w + MONITOR_BEZEL * 2,
  h: SCREEN_RECT.h + MONITOR_BEZEL * 2,
} as const;
