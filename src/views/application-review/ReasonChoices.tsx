import { reasons } from '@/content/screen-content';

export function ReasonChoices() {
  return (
    <section aria-labelledby="reason-heading" className="pt-6">
      <h2
        id="reason-heading"
        className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground"
      >
        Choose a reason
      </h2>
      <ol aria-label="Reason choices" className="mt-5 space-y-3">
        {reasons.map((reason) => (
          <li
            key={reason.text}
            className={`flex min-h-[58px] items-center justify-between gap-4 rounded-full border px-5 ${
              reason.kind === 'precise'
                ? 'border-foreground bg-foreground text-background'
                : 'border-border bg-card text-foreground'
            }`}
          >
            <span className="text-base leading-tight">{reason.text}</span>
            <strong className="shrink-0 font-mono text-sm text-brand">+{reason.credits}</strong>
          </li>
        ))}
      </ol>
      <p className="mt-7 font-serif text-[17px] italic leading-snug text-muted-foreground">
        Precise pays more. Generic is faster.
        <br />
        Nobody’s checking.
      </p>
    </section>
  );
}
