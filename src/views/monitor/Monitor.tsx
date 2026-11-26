import type { ReactNode } from 'react';
import { SCREEN_RECT } from '@/core/engine/camera';
import monitorFrame from './monitor-frame.svg';

/** Places the live Screen inside the monitor aperture. */
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
      <img
        src={monitorFrame}
        className="pointer-events-none absolute inset-0 h-full w-full"
        alt=""
      />
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
