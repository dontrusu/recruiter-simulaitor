import type { ReactNode } from 'react';
import { MONITOR_BEZEL, MONITOR_RECT } from '../../config/room';
import { SCREEN_RECT } from '../../engine/camera';
import { Screen } from './Screen';

const BODY = 'linear-gradient(160deg, #e8dfc6 0%, #ddd2b4 46%, #c7b995 100%)';

type MonitorBodyProps = {
  children?: ReactNode;
};

/** The beige CRT housing. Its screen child sits inside the bezel. */
export function MonitorBody({ children }: MonitorBodyProps) {
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
          background: 'linear-gradient(180deg, #cfc4a4, #b9ab88)',
        }}
      />
      <div
        className="absolute inset-0 rounded-[26px]"
        style={{
          zIndex: 1,
          background: BODY,
          boxShadow:
            'inset 0 2px 0 #f4ecd8, inset 0 -3px 10px #a5987a, 0 26px 44px rgba(0, 0, 0, 0.38)',
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
            boxShadow: 'inset 0 0 0 2px #b3a685, inset 0 0 18px rgba(0, 0, 0, 0.45)',
          }}
        />
        <Screen>{children}</Screen>
        <div
          className="absolute flex items-center justify-end gap-2"
          style={{
            left: MONITOR_BEZEL,
            right: MONITOR_BEZEL,
            top: SCREEN_RECT.h + MONITOR_BEZEL,
            height: MONITOR_BEZEL,
          }}
        >
          <span className="text-[10px] tracking-[0.3em] text-[#8d8064]">TALENT.OS</span>
          <span className="h-2 w-2 rounded-full bg-[#7fd48a] shadow-[0_0_6px_#7fd48a]" />
        </div>
      </div>
    </div>
  );
}
