import type { ReactNode } from 'react';
import { ROOM_HEIGHT, ROOM_WIDTH } from '@/core/engine/camera';
import { DESK_LINE } from '@/core/config/room';
import { Monitor } from '@/views/monitor/Monitor';

const WALL =
  'linear-gradient(180deg, var(--room-wall-light) 0%, var(--room-wall) 62%, var(--room-wall-shadow) 100%)';
const DESK =
  'linear-gradient(180deg, var(--desk-light) 0%, var(--desk) 18%, var(--desk-shadow) 100%)';

type RoomProps = {
  /** Screen content. The App assembly passes windows and slots here. */
  children?: ReactNode;
};

/** The 1600×900 office: wall, desk surface and the monitor standing on it. */
export function Room({ children }: RoomProps) {
  return (
    <div
      className="absolute top-0 left-0 overflow-hidden"
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
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-px"
          style={{ background: 'var(--desk-highlight)', opacity: 0.55 }}
        />
      </div>
      <Monitor>{children}</Monitor>
    </div>
  );
}
