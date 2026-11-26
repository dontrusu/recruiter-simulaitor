import type { ReactNode } from 'react';
import { Monitor } from '@/views/monitor/Monitor';
import { PresetRoom } from './PresetRoom';
import roomBackground from './room-background.svg';

/** The Room and its Monitor share one live Screen in both camera views. */
export function Room({
  children,
  screenWidth = 1600,
  screenHeight = 1000,
}: {
  children?: ReactNode;
  screenWidth?: number;
  screenHeight?: number;
}) {
  return (
    <section aria-label="Room" className="room-set absolute inset-0 isolate">
      <img
        src={roomBackground}
        className="pointer-events-none absolute inset-0 h-full w-full"
        alt=""
      />
      <Monitor width={screenWidth} height={screenHeight}>
        {children}
      </Monitor>
      <PresetRoom />
    </section>
  );
}
