import { SCREEN_COMPOSITION_HEIGHT, SCREEN_COMPOSITION_WIDTH } from '@/core/engine/camera';

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
      <span className="font-mono text-xs leading-[inherit] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <strong
        className={`font-mono text-2xl leading-[inherit] font-bold ${branded ? 'text-brand' : ''}`}
      >
        {value}
      </strong>
    </div>
  );
}

export function MonitorScreen() {
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
        <div aria-label="Run counters" className="flex items-center gap-8">
          <Counter label="Rejected" value="14" />
          <Counter label="Credits" value="0085" branded />
        </div>
      </header>

      <ApplicationReview />

      <p className="mb-9 text-center font-mono text-[10px] tracking-[0.05em] text-muted-foreground">
        We’ll keep your CV on file for future opportunities.
      </p>
    </main>
  );
}
