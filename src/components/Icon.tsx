import type { ReactNode } from 'react';
import type { UpgradeId } from '../game/config';

const drawings: Record<string, ReactNode> = {
  network: (
    <>
      <path d="M6 6l12 0M6 6l0 12M6 18l12 0M18 6v12M6 6l12 12" />
      <circle cx="6" cy="6" r="3" fill="var(--surface, #eff5eb)" />
      <circle cx="18" cy="6" r="3" fill="var(--surface, #eff5eb)" />
      <circle cx="6" cy="18" r="3" fill="var(--surface, #eff5eb)" />
      <circle cx="18" cy="18" r="3" fill="var(--surface, #eff5eb)" />
    </>
  ),
  printer: (
    <>
      <path d="M7 9V3h10v6M7 17H4V9h16v8h-3" />
      <path d="M7 14h10v7H7zM10 17h4M10 19h3" />
      <circle cx="17" cy="12" r=".8" fill="currentColor" />
    </>
  ),
  coffee: (
    <>
      <path d="M5 9h12v7a5 5 0 0 1-5 5H10a5 5 0 0 1-5-5ZM17 10h1a3 3 0 0 1 0 6h-1M7 5V3M11 6V2M15 5V3" />
    </>
  ),
  garden: (
    <>
      <path d="M5 15h14l-2 6H7ZM12 15V8M12 11C4 11 5 4 5 4s7 0 7 7ZM12 8c0-6 7-6 7-6s1 6-7 6Z" />
    </>
  ),
  server: (
    <>
      <rect x="4" y="3" width="16" height="7" rx="2" />
      <rect x="4" y="14" width="16" height="7" rx="2" />
      <path d="M12 6h5M12 17h5M8 10v4M16 10v4" />
      <circle cx="7" cy="6.5" r="1" fill="currentColor" />
      <circle cx="7" cy="17.5" r="1" fill="currentColor" />
    </>
  ),
  solar: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2" />
    </>
  ),
  capacitor: <path d="m14 2-9 12h6l-1 8 9-12h-6z" />,
  scan: (
    <>
      <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M7 12l3 3 7-7" />
    </>
  ),
  chat: (
    <>
      <path d="M4 4h16v12H9l-5 4ZM8 8h8M8 12h5" />
    </>
  ),
  trophy: (
    <>
      <path d="M8 3h8v7a4 4 0 0 1-8 0ZM8 5H4v3c0 3 4 3 4 3M16 5h4v3c0 3-4 3-4 3M12 14v6M8 21h8" />
    </>
  ),
  brain: (
    <>
      <path d="M12 5c-4-5-10 2-6 5-5 3-1 10 4 8l2 2 2-2c5 2 9-5 4-8 4-3-2-10-6-5ZM12 5v15M6 10l3 2M18 10l-3 2" />
    </>
  ),
  music: (
    <>
      <path d="M9 18V5l11-2v13M9 9l11-2" />
      <ellipse cx="6" cy="18" rx="3" ry="3" />
      <ellipse cx="17" cy="16" rx="3" ry="3" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M7 3v5M17 3v5M3 11h18M7 15h3M14 15h3M7 18h3" />
    </>
  ),
  shield: (
    <>
      <path d="m12 2 8 4v6c0 5-8 10-8 10S4 17 4 12V6ZM8 12l3 3 5-6" />
    </>
  ),
  cat: (
    <>
      <path d="M4 11 3 3l7 4h4l7-4-1 8v5c0 7-16 7-16 0ZM9 12v1M15 12v1M11 16h2M2 15l5 1M17 16l5-1" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18M7 17v-5M12 17V8M17 17V4" />
    </>
  ),
  radar: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <path d="m12 12 7-7" />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  rocket: (
    <>
      <path d="M9 15C8 7 15 3 21 3c0 6-4 13-12 12ZM9 10H5l-3 7 7-2M14 15v4l-7 3 2-7M5 20l-2 1 1-2" />
      <circle cx="16" cy="8" r="2" />
    </>
  ),
};
export const machineIcon = (id: string) =>
  id === 'garden' ? 'network' : id === 'server' ? 'rocket' : id;
const upgradeIcons: Record<UpgradeId, string> = {
  U01: 'scan',
  U02: 'chat',
  U03: 'capacitor',
  U04: 'brain',
  U05: 'chart',
  U06: 'scan',
  U07: 'chat',
  U08: 'music',
  U09: 'trophy',
  U10: 'mail',
  U11: 'radar',
  U12: 'calendar',
  U13: 'scan',
  U14: 'mail',
  U15: 'brain',
  U16: 'server',
  U17: 'cat',
  U18: 'shield',
  U19: 'radar',
  U20: 'scan',
  U21: 'server',
  U22: 'rocket',
  U23: 'brain',
  U24: 'mail',
  U25: 'chart',
  U26: 'music',
  U27: 'shield',
  U28: 'garden',
  U29: 'rocket',
  U30: 'radar',
  U31: 'chart',
  U32: 'brain',
  U33: 'capacitor',
  U34: 'trophy',
  U35: 'server',
};
export function Icon({ name, className = '' }: { name: string; className?: string }) {
  return (
    <svg
      className={`game-icon ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {drawings[upgradeIcons[name as UpgradeId] ?? name] ?? drawings.scan}
    </svg>
  );
}
