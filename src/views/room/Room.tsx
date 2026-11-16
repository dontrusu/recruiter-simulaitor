import type { ReactNode } from 'react';
import { ROOM_HEIGHT, ROOM_WIDTH } from '@/core/engine/camera';
import { DESK_LINE } from '@/core/config/room';
import { Monitor } from '@/views/monitor/Monitor';

const WALL = 'radial-gradient(ellipse at 50% 35%, var(--room-wall-light), var(--room-wall-shadow))';
const DESK =
  'repeating-linear-gradient(90deg, var(--desk-stripe) 0 3px, transparent 3px 9px), linear-gradient(var(--desk-light), var(--desk-shadow))';

type RoomProps = {
  /** The live Screen shared by both camera compositions. */
  children?: ReactNode;
};

/** The 1600×900 office: wall, desk surface and the monitor standing on it. */
export function Room({ children }: RoomProps) {
  return (
    <section
      aria-label="Room"
      className="absolute top-0 left-0 overflow-hidden font-sans"
      style={{ width: ROOM_WIDTH, height: ROOM_HEIGHT }}
    >
      <div className="absolute inset-0" style={{ zIndex: 0, background: WALL }} />
      <div
        className="absolute inset-x-0"
        style={{
          zIndex: 2,
          top: DESK_LINE,
          height: ROOM_HEIGHT - DESK_LINE,
          background: DESK,
          borderTop: '2px solid var(--desk-highlight)',
        }}
      />
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute z-2"
        style={{ left: 0, top: DESK_LINE }}
        width={ROOM_WIDTH}
        height={ROOM_HEIGHT - DESK_LINE}
        viewBox="0 0 1600 200"
        fill="none"
        stroke="var(--desk-grain)"
        strokeOpacity={0.25}
        strokeWidth={1.5}
      >
        <path d="M0 60C200 20 320 110 540 70S900 20 1100 80 1450 50 1600 90" />
        <path d="M0 130C260 100 380 170 640 140S1000 100 1250 150 1500 130 1600 160" />
        <path d="M0 180C300 160 500 200 800 185S1300 160 1600 190" />
      </svg>
      <Monitor>{children}</Monitor>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, var(--room-vignette))',
        }}
      />
    </section>
  );
}
