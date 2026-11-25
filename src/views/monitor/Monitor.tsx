import type { ReactNode } from 'react';
import { SCREEN_RECT } from '@/core/engine/camera';

/** Physical monitor and the live Screen in its 800×500 aperture. */
export function Monitor({
  children,
  width,
  height,
}: {
  children?: ReactNode;
  width: number;
  height: number;
}) {
  return (
    <>
      <div className="room-stand" aria-hidden="true" />
      <div className="room-base" aria-hidden="true" />
      <div className="room-monitor" aria-hidden="true">
        <span className="monitor-name">Talent.OS</span>
        <span className="monitor-power" />
      </div>
      <div
        className="absolute z-2 overflow-hidden bg-background"
        style={{
          left: SCREEN_RECT.x,
          top: SCREEN_RECT.y,
          width: width / 2,
          height: height / 2,
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            transformOrigin: 'top left',
            transform: 'scale(0.5)',
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
}
