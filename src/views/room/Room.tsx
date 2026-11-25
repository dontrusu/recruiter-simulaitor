import type { ReactNode } from 'react';
import { Monitor } from '@/views/monitor/Monitor';
import './room.css';

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
    <section aria-label="Room" className="room-set">
      <div className="room-wall-panels" aria-hidden="true" />
      <div className="room-desk" aria-hidden="true" />
      <svg className="room-cables" viewBox="0 0 1600 900" aria-hidden="true">
        <path d="M421 693C451 786 372 848 237 821S145 774 121 747M1184 696C1158 779 1188 838 1324 817S1412 781 1420 749M802 765c24 43 53 67 207 78" />
      </svg>
      <svg className="room-lights" viewBox="0 0 1600 160" aria-hidden="true">
        <path className="light-wire" d="M0 48Q180 142 400 78T800 66T1200 85T1600 35" />
        {[
          [110, 91],
          [210, 102],
          [320, 98],
          [445, 66],
          [550, 46],
          [650, 43],
          [755, 56],
          [855, 82],
          [960, 101],
          [1065, 101],
          [1170, 91],
          [1275, 61],
          [1380, 40],
          [1485, 35],
        ].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <circle className="light-glow" cy="20" r="26" />
            <path className="light-bulb" d="M-5 7H5V12H8V23H5V27H-5V23H-8V12H-5Z" />
            <rect className="light-socket" x="-4" y="0" width="8" height="9" />
          </g>
        ))}
      </svg>
      <Monitor width={screenWidth} height={screenHeight}>
        {children}
      </Monitor>
      <div className="room-keyboard" aria-hidden="true">
        <div className="room-keys" />
        <i />
      </div>
      <div className="room-mouse" aria-hidden="true" />
      <div className="room-papers" aria-hidden="true">
        <svg className="sprite" viewBox="0 0 17 14" shapeRendering="crispEdges">
          {[
            '.....s....s......',
            '....s....s.......',
            '.....s....s......',
            '......s....s.....',
            '.................',
            '..dddddddddd.....',
            '..dccccccccd.dd..',
            '..dwwwwwwwwddwd..',
            '..dwwdwwdwwd.wd..',
            '..dwwwwwwwwddwd..',
            '..dwwwddwwwddd...',
            '...dwwwwwwd......',
            '....dddddd.......',
            '..ssssssssss.....',
          ].flatMap((row, y) =>
            [...row].flatMap((pixel, x) => {
              const colors: Record<string, string> = {
                d: '#252840',
                w: '#fff9e3',
                c: '#784e45',
                s: '#9a8d8f',
              };
              return pixel === '.' ? (
                []
              ) : (
                <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={colors[pixel]} />
              );
            }),
          )}
        </svg>
      </div>
    </section>
  );
}
