import { SCREEN_COMPOSITION_HEIGHT, SCREEN_COMPOSITION_WIDTH } from '@/core/engine/camera';

import { useWorkspaceStore } from '@/core/store/workspace';

import { ApplicationReview } from '@/views/application-review/ApplicationReview';
import { Shop } from '@/views/shop/Shop';
import { Taskbar } from './Taskbar';

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
    <div className="flex items-baseline gap-3">
      <dt className="font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </dt>
      <dd className={`relative font-mono text-2xl font-bold ${branded ? 'text-brand-text' : ''}`}>
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

export function MonitorScreen() {
  const credits = useWorkspaceStore((state) => state.run.credits);
  const rejected = useWorkspaceStore((state) => state.run.rejected);
  return (
    <main
      aria-label="Talent.OS Screen"
      data-screen-composition
      className="absolute left-0 top-0 flex flex-col overflow-hidden bg-background font-sans text-foreground"
      style={{
        width: SCREEN_COMPOSITION_WIDTH,
        height: SCREEN_COMPOSITION_HEIGHT,
      }}
    >
      <header className="mx-4 grid h-[96px] shrink-0 grid-cols-[minmax(150px,1fr)_minmax(0,660px)_minmax(115px,1fr)] items-center gap-4 border-b-2 border-foreground px-3">
        <div className="flex items-baseline gap-5">
          <span className="font-sans text-[34px] font-bold tracking-[-0.05em]">Talent.OS</span>
          <p className="font-mono text-label uppercase tracking-[0.16em] text-muted-foreground">
            Hiring desk · Build 1.0
          </p>
        </div>
        <Shop />
        <dl className="flex items-center justify-end gap-8">
          <Counter label="Rejected" value={String(rejected)} />
          <Counter label="Credits" value={String(credits).padStart(4, '0')} branded />
        </dl>
      </header>

      <ApplicationReview />

      <p className="mb-9 text-center font-mono text-[10px] tracking-[0.05em] text-muted-foreground">
        We’ll keep your CV on file for future opportunities.
      </p>
      <Taskbar />
    </main>
  );
}
