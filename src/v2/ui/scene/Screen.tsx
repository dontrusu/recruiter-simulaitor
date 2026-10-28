import type { ReactNode } from 'react';
import { MONITOR_BEZEL } from '../../config/room';
import { SCREEN_RECT } from '../../engine/camera';

type ScreenProps = {
  children?: ReactNode;
};

/**
 * The 800×600 glass. It is its own stacking context, so every child positions
 * from the screen's top-left corner rather than the room's.
 */
export function Screen({ children }: ScreenProps) {
  return (
    <div
      className="absolute overflow-hidden"
      style={{
        zIndex: 1,
        left: MONITOR_BEZEL,
        top: MONITOR_BEZEL,
        width: SCREEN_RECT.w,
        height: SCREEN_RECT.h,
        isolation: 'isolate',
        background: '#2f6187',
        boxShadow: 'inset 0 0 32px rgba(0, 0, 0, 0.55)',
      }}
    >
      {children}
    </div>
  );
}
