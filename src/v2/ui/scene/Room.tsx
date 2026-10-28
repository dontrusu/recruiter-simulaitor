import type { ReactNode } from 'react';
import { ROOM_HEIGHT, ROOM_WIDTH } from '../../engine/camera';
import { DESK_LINE } from '../../config/room';
import { MonitorBody } from './MonitorBody';

const WALL = 'linear-gradient(180deg, #8c9a90 0%, #7d8c84 62%, #6b7a72 100%)';
const DESK = 'linear-gradient(180deg, #8a6a48 0%, #6f5136 18%, #4a3524 100%)';

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
          style={{ background: '#d8bb8c', opacity: 0.55 }}
        />
      </div>
      <MonitorBody>{children}</MonitorBody>
    </div>
  );
}
