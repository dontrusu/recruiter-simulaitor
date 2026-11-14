import { SCREEN_COMPOSITION_HEIGHT, SCREEN_COMPOSITION_WIDTH } from '@/core/engine/camera';

import { useWorkspaceStore } from '@/core/store/workspace';

import { ApplicationReview } from '@/views/application-review/ApplicationReview';

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
      <dd className={`font-mono text-2xl font-bold ${branded ? 'text-brand' : ''}`}>{value}</dd>
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
      <header className="mx-[88px] flex h-[112px] shrink-0 items-center justify-between border-b border-border">
        <div className="flex items-baseline gap-5">
          <span className="font-serif text-[34px] italic tracking-[-0.05em]">Talent.OS</span>
          <p className="font-mono text-label uppercase tracking-[0.16em] text-muted-foreground">
            Hiring desk · Build 1.0
          </p>
        </div>
        <dl className="flex items-center gap-8">
          <Counter label="Rejected" value={String(rejected)} />
          <Counter label="Credits" value={String(credits).padStart(4, '0')} branded />
        </dl>
      </header>

      <ApplicationReview />

      <p className="mb-9 text-center font-mono text-[10px] tracking-[0.05em] text-muted-foreground">
        We’ll keep your CV on file for future opportunities.
      </p>
    </main>
  );
}
