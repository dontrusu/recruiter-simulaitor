import { useWorkspaceStore } from '@/core/store/workspace';

import { ApplicationReview } from '@/views/application-review/ApplicationReview';
import { Shop } from '@/views/shop/Shop';
import { Taskbar } from './Taskbar';
import { PresetWindows } from './PresetWindows';
import './monitor-screen.css';
import './rejection-credit.css';

function Counter({
  label,
  value,
  branded = false,
}: {
  label: string;
  value: string;
  branded?: boolean;
}) {
  return (
    <div className={`flex items-baseline gap-1 ${branded ? 'flex-row-reverse' : ''}`}>
      <dt className="text-xs text-foreground">{label}</dt>
      <dd className={`relative font-sans font-bold ${branded ? 'text-[32px]' : 'text-xs'}`}>
        <span data-testid={`counter-${label.toLowerCase()}`}>{value}</span>
        {branded && Number(value) > 0 && (
          <span key={value} aria-hidden="true" className="rejection-credit">
            +1
          </span>
        )}
      </dd>
    </div>
  );
}

export function MonitorScreen({
  width,
  height,
  colors = false,
  wallpaper = false,
}: {
  width: number;
  height: number;
  colors?: boolean;
  wallpaper?: boolean;
}) {
  const credits = useWorkspaceStore((state) => state.run.credits);
  const rejected = useWorkspaceStore((state) => state.run.rejected);
  return (
    <main
      aria-label="Talent.OS Screen"
      data-screen-composition
      data-color-mode={colors ? 'color' : 'neutral'}
      className="absolute left-0 top-0 flex flex-col overflow-hidden border-2 border-foreground bg-background pt-2 font-sans text-foreground"
      style={{
        width,
        height,
      }}
    >
      <header className="grid h-[96px] shrink-0 grid-cols-[minmax(150px,1fr)_minmax(0,600px)_minmax(115px,1fr)] items-center gap-4 border-b-2 border-foreground px-3">
        <div>
          <span className="font-sans text-[32px] font-bold leading-[1.08] tracking-[-0.06em]">
            Talent.OS
          </span>
          <p className="mt-1 text-xs">Recruitment, as usual.</p>
          <p className="text-xs">
            <span aria-hidden="true" className="mr-1 inline-block h-2 w-2 bg-green-800" />1 open
            role · No upgrades installed
          </p>
        </div>
        <Shop colors={colors} />
        <dl className="flex flex-col items-end leading-tight">
          <Counter label="Credits" value={String(credits)} branded />
          <Counter label="rejected" value={String(rejected)} />
        </dl>
      </header>

      <ApplicationReview wallpaper={wallpaper} />
      <PresetWindows />

      <div aria-hidden="true" className="h-[51px] shrink-0" />
      <Taskbar />
    </main>
  );
}
