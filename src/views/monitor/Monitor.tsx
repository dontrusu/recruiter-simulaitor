import type { ReactNode } from 'react';
import { MONITOR_BEZEL, MONITOR_RECT } from '@/core/config/room';
import {
  SCREEN_COMPOSITION_HEIGHT,
  SCREEN_COMPOSITION_WIDTH,
  SCREEN_RECT,
} from '@/core/engine/camera';

const MONITOR_BODY_BACKGROUND = 'linear-gradient(var(--monitor-light), var(--monitor-shadow))';

type MonitorProps = {
  children?: ReactNode;
};

/** The dark monitor housing. Its screen child sits inside the bezel. */
export function Monitor({ children }: MonitorProps) {
  return (
    <div
      className="absolute z-5"
      style={{
        left: MONITOR_RECT.x,
        top: MONITOR_RECT.y,
        width: MONITOR_RECT.w,
        height: MONITOR_RECT.h,
      }}
    >
      {/* Stand: only the foot below the body is visible, the neck hides behind it. */}
      <div
        className="absolute z-0"
        style={{
          left: '50%',
          top: MONITOR_RECT.h - 4,
          width: 120,
          height: 70,
          transform: 'translateX(-50%)',
          background:
            'linear-gradient(90deg, var(--monitor-stand-left), var(--monitor-stand-light) 45%, var(--monitor-stand-right))',
        }}
      />
      <div
        className="absolute z-0 rounded-[50%]"
        style={{
          left: '50%',
          top: MONITOR_RECT.h + 52,
          width: 300,
          height: 22,
          transform: 'translateX(-50%)',
          background: 'linear-gradient(var(--monitor-base-light), var(--monitor-base-shadow))',
          boxShadow: '0 18px 20px var(--room-contact-shadow)',
        }}
      />
      <div
        className="absolute inset-0 z-1 rounded-[22px]"
        style={{
          background: MONITOR_BODY_BACKGROUND,
          boxShadow: '0 50px 90px var(--monitor-cast-shadow), inset 0 0 0 1px var(--monitor-edge)',
        }}
      >
        <div
          className="absolute isolate z-1 overflow-hidden bg-background"
          style={{
            left: MONITOR_BEZEL,
            top: MONITOR_BEZEL,
            width: SCREEN_RECT.w,
            height: SCREEN_RECT.h,
          }}
        >
          <div
            style={{
              width: SCREEN_COMPOSITION_WIDTH,
              height: SCREEN_COMPOSITION_HEIGHT,
              transformOrigin: 'top left',
              transform: `scale(${Math.min(SCREEN_RECT.w / SCREEN_COMPOSITION_WIDTH, SCREEN_RECT.h / SCREEN_COMPOSITION_HEIGHT)})`,
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
