import type { ReactNode } from 'react';
import { MONITOR_BEZEL, MONITOR_RECT } from '@/core/config/room';
import {
  SCREEN_COMPOSITION_HEIGHT,
  SCREEN_COMPOSITION_WIDTH,
  SCREEN_RECT,
} from '@/core/engine/camera';

const BODY =
  'linear-gradient(160deg, var(--monitor-light) 0%, var(--monitor) 46%, var(--monitor-shadow) 100%)';

type MonitorProps = {
  children?: ReactNode;
};

/** The beige CRT housing. Its screen child sits inside the bezel. */
export function Monitor({ children }: MonitorProps) {
  return (
    <div
      className="absolute"
      style={{
        zIndex: 5,
        left: MONITOR_RECT.x,
        top: MONITOR_RECT.y,
        width: MONITOR_RECT.w,
        height: MONITOR_RECT.h,
      }}
    >
      {/* Stand: only the foot below the body is visible, the neck hides behind it. */}
      <div
        className="absolute"
        style={{
          zIndex: 0,
          left: '50%',
          top: 580,
          width: 420,
          height: 160,
          transform: 'translateX(-50%)',
          clipPath: 'polygon(26% 0, 74% 0, 100% 100%, 0 100%)',
          background: 'linear-gradient(180deg, var(--monitor), var(--monitor-shadow))',
        }}
      />
      <div
        className="absolute inset-0 rounded-[26px]"
        style={{
          zIndex: 1,
          background: BODY,
          boxShadow:
            'inset 0 2px 0 var(--monitor-light), inset 0 -3px 10px var(--monitor-shadow), 0 26px 44px rgb(21 20 15 / 24%)',
        }}
      >
        {/* Recessed inner bezel around the glass. */}
        <div
          className="absolute rounded-[14px]"
          style={{
            left: MONITOR_BEZEL - 10,
            top: MONITOR_BEZEL - 10,
            width: SCREEN_RECT.w + 20,
            height: SCREEN_RECT.h + 20,
            boxShadow: 'inset 0 0 0 2px var(--monitor-bezel), inset 0 0 18px rgb(21 20 15 / 25%)',
          }}
        />
        <div
          className="absolute overflow-hidden bg-background"
          style={{
            zIndex: 1,
            left: MONITOR_BEZEL,
            top: MONITOR_BEZEL,
            width: SCREEN_RECT.w,
            height: SCREEN_RECT.h,
            isolation: 'isolate',
            boxShadow: 'inset 0 0 24px rgb(21 20 15 / 12%)',
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
        <div
          className="absolute flex items-center justify-end gap-2"
          style={{
            left: MONITOR_BEZEL,
            right: MONITOR_BEZEL,
            top: SCREEN_RECT.h + MONITOR_BEZEL,
            height: MONITOR_BEZEL,
          }}
        >
          <span className="text-[10px] tracking-[0.3em] text-[var(--monitor-label)]">
            TALENT.OS
          </span>
          <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_6px_var(--brand)]" />
        </div>
      </div>
    </div>
  );
}
