import { application, vacancy, reasons } from '@/content/screen-content';

function VacancyPanel() {
  return (
    <section aria-label="Vacancy" className="pt-6">
      <p className="font-mono text-xs leading-[inherit] uppercase tracking-[0.14em] text-muted-foreground">
        Open role · 1 of 1
      </p>
      <h1
        id="vacancy-title"
        className="mt-5 font-serif text-[72px] leading-[0.91] tracking-[-0.06em]"
      >
        {vacancy.title}
      </h1>
      <div className="mt-8 h-px bg-border" />
      <ul className="mt-6 space-y-4">
        {vacancy.requirements.map((requirement) => (
          <li key={requirement} className="flex items-center gap-3 text-lg leading-[inherit]">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {requirement}
          </li>
        ))}
      </ul>
    </section>
  );
}

function CandidatePortrait() {
  return (
    <svg
      role="img"
      aria-label={`Illustrated portrait of ${application.name}`}
      viewBox="0 0 160 180"
      className="h-[166px] w-[148px] shrink-0"
    >
      <rect width="160" height="180" fill="var(--portrait-background)" />
      <path d="M16 180c4-37 27-58 64-58s60 21 64 58H16Z" fill="var(--portrait-shirt)" />
      <path
        d="M53 109c8 10 18 15 27 15s19-5 27-15l8 24-35 22-35-22 8-24Z"
        fill="var(--portrait-neck)"
      />
      <ellipse cx="80" cy="73" rx="36" ry="43" fill="var(--portrait-skin)" />
      <path
        d="M44 70c-4-31 13-50 37-50 27 0 39 18 36 49-9-5-16-15-19-24-14 14-32 21-54 21Z"
        fill="var(--portrait-hair)"
      />
      <path
        d="M58 78h12m20 0h12"
        stroke="var(--portrait-ink)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M73 99c5 4 10 4 15 0"
        fill="none"
        stroke="var(--portrait-ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CandidateCard() {
  return (
    <article
      aria-label="Current application"
      className="self-center border border-border bg-card p-8 shadow-[0_20px_40px_var(--paper-shadow)]"
    >
      <div className="flex items-center justify-between border-b border-border pb-5">
        <p className="font-mono text-label uppercase tracking-[0.1em] text-muted-foreground">
          {vacancy.title} · Application #{application.number}
        </p>
        <span className="rounded-full bg-secondary px-3 py-1 font-mono text-label font-bold uppercase tracking-[0.1em]">
          {application.status}
        </span>
      </div>

      <div className="flex items-center gap-6 py-6">
        <CandidatePortrait />
        <div>
          <h2 className="font-serif text-[42px] leading-[0.98] tracking-[-0.05em]">
            {application.name}
          </h2>
          <p className="mt-3 font-mono text-xs leading-[inherit] uppercase tracking-[0.1em] text-muted-foreground">
            {application.location}
          </p>
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-x-8 gap-y-5 border-y border-border py-6">
        <div>
          <dt className="font-mono text-label uppercase tracking-[0.12em] text-muted-foreground">
            React
          </dt>
          <dd className="mt-1 text-xl leading-[inherit]">{application.reactExperience}</dd>
        </div>
        <div>
          <dt className="font-mono text-label uppercase tracking-[0.12em] text-muted-foreground">
            TypeScript
          </dt>
          <dd className="mt-1 text-xl leading-[inherit]">{application.typescriptExperience}</dd>
        </div>
        <div>
          <dt className="font-mono text-label uppercase tracking-[0.12em] text-muted-foreground">
            Teams led
          </dt>
          <dd className="mt-1 text-xl leading-[inherit]">{application.teamsLed}</dd>
        </div>
        <div>
          <dt className="font-mono text-label uppercase tracking-[0.12em] text-muted-foreground">
            Last role
          </dt>
          <dd className="mt-1 text-xl leading-[inherit]">{application.lastRole}</dd>
        </div>
      </dl>

      <div className="pt-5">
        <p className="font-mono text-label uppercase tracking-[0.12em] text-muted-foreground">
          From the cover letter
        </p>
        <blockquote className="mt-3 border-l-2 border-brand pl-4 font-serif text-[21px] italic leading-snug">
          “{application.coverLetter}”
        </blockquote>
      </div>
    </article>
  );
}

function ReasonChoices() {
  return (
    <section aria-labelledby="reason-heading" className="pt-6">
      <h2
        id="reason-heading"
        className="font-mono text-xs leading-[inherit] uppercase tracking-[0.14em] text-muted-foreground"
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
            <strong className="shrink-0 font-mono text-[14px] text-brand">+{reason.credits}</strong>
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

export function ApplicationReview() {
  return (
    <div className="grid flex-1 grid-cols-[280px_minmax(0,1fr)_300px] gap-10 px-[88px] pb-12 pt-5">
      <VacancyPanel />
      <CandidateCard />
      <ReasonChoices />
    </div>
  );
}
