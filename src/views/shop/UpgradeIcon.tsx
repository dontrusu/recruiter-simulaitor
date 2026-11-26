import { Sprite, type SpriteKind } from './PixelArt';

const sprites: Record<string, SpriteKind> = {
  'Talent Pool': 'pool',
  'Lo-Fi Beats to Reject To': 'headphones',
  'Compassion Engine™': 'compassion',
  'Re: Your Application': 'reply',
  'Smart Reject': 'stamp',
  'Desktop Wallpaper': 'vacancy',
  'Office Color Pack': 'gift',
  'Culture Fit Oracle': 'orb',
  'Buzzword Bingo': 'bingo',
  'Open Role': 'vacancy',
  'JD Optimizer': 'optimizer',
  'Kevin the Succulent': 'plant',
  'Brewtus the Coffee Machine': 'cup',
  'Your AI Interviewer': 'robot',
  'The Funnel': 'funnel',
  'Fairness Certificate': 'certificate',
  'Org Chart': 'chart',
  '#wins Channel': 'trophy',
  'Humbled & Honored™': 'social',
  'Mandatory Fun Cannon': 'cannon',
  'Calm Corner': 'calm',
  'Swag Lootbox': 'gift',
  Headcount: 'headcount',
  'Productivity Eye': 'eye',
  'Mouse Jiggler Duck': 'duck',
  'Hot-Desk Roulette': 'desk',
};

const linePaths: Record<string, string> = {
  'Smart Reject': 'M5 7h14M15 3l4 4-4 4M19 17H5m4-4-4 4 4 4',
  'Talent Pool': 'M3 8c3-5 6 5 9 0s6 5 9 0M3 16c3-5 6 5 9 0s6 5 9 0',
  'Culture Fit Oracle':
    'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20M12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6M12 12a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  'Buzzword Bingo': 'M3 3h18v18H3zM9 3v18M15 3v18M3 9h18M3 15h18',
  'Open Role': 'M5 7h14v14H5zM9 7V3h6v4M9 12h6M9 16h4',
  'Desktop Wallpaper': 'M3 4h18v16H3zM4 17l5-5 3 3 3-4 5 6M8 8h.01',
  'Office Color Pack':
    'M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h3a5 5 0 0 0 0-10zM7 10h.01M10 6h.01M15 6h.01',
};

export function UpgradeIcon({ name, line = false }: { name: string; line?: boolean }) {
  if (line)
    return (
      <svg
        className="size-5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        <path d={linePaths[name] ?? linePaths['Open Role']} />
      </svg>
    );
  const sprite = sprites[name];
  return sprite ? (
    <span className="block size-5 shrink-0">
      <Sprite kind={sprite} />
    </span>
  ) : null;
}
