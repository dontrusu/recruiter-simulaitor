import { applications } from '@/content/screen-content';
import { useWorkspaceStore } from '@/core/store/workspace';

function formatExperience(months: number) {
  const years = Math.floor(months / 12);
  const remainder = months % 12;
  return remainder ? `${years} yrs ${remainder} mo` : `${years} yrs`;
}

function CandidatePortrait({ name, index }: { name: string; index: number }) {
  return (
    <svg
      role="img"
      aria-label={`Illustrated portrait of ${name}`}
      viewBox="0 0 180 200"
      className="w-[116px] shrink-0 border border-foreground"
    >
      <path fill="#dff4f2" d="M0 0h180v200H0z" />
      {index === 1 && (
        <path fill="#20211f" d="M42 132V62C36 5 141 1 143 61v72l-16-13V57L94 42 54 69v54z" />
      )}
      <path fill="#20211f" d="M19 200c3-45 32-63 70-63s69 18 73 63" />
      <path fill="#e8bf14" d="M73 116h37v42c-12 15-25 15-37 0z" />
      <path fill="#f7df35" d="M50 65c0-52 83-51 83 0v36c0 32-23 49-41 49-20 0-42-17-42-49z" />
      <path
        fill="#20211f"
        d={
          index === 1
            ? 'M42 116V62C36 5 141 1 143 61v72l-16-13V57L94 42 54 69v54z'
            : index === 2
              ? 'M45 80V55C44 12 133 8 140 57l-7 29-10-29-24 7-17-14-23 20-2 21z'
              : 'M45 80V54l13-9-7-17 26 6L89 18l15 13 24-3-3 16 16 11-8 31-10-29-24 7-17-14-23 20-2 21z'
        }
      />
      <g fill="none" stroke="#20211f" strokeWidth="3">
        <path d="M63 82h25v20H63zM101 82h25v20h-25zM88 88h13M69 122c13 7 27 7 39-1M94 97l-3 13h8" />
      </g>
      <path fill="none" stroke="#4c205d" strokeWidth="8" d="M43 92V67c0-61 98-61 98 0v24" />
      <rect fill="#4c205d" x="34" y="79" width="17" height="35" rx="8" />
      <rect fill="#4c205d" x="133" y="79" width="17" height="35" rx="8" />
    </svg>
  );
}

export function CandidateCard({ indexOverride }: { indexOverride?: number }) {
  const currentIndex = useWorkspaceStore((state) => state.run.applicationIndex);
  const index = indexOverride ?? currentIndex;
  const application = applications[index] ?? applications[0];
  return (
    <article aria-label="Current application" className="bg-card px-4 py-3">
      <div className="flex items-center justify-between pb-2 font-mono text-xs uppercase tracking-[0.065em] text-muted-foreground">
        <p>
          Application #{application.number} · {application.status}
        </p>
        <span className="border border-border px-2">In review</span>
      </div>
      <div className="flex items-start gap-4">
        <CandidatePortrait name={application.name} index={index} />
        <div className="min-w-0 flex-1">
          <h2 className="font-sans text-[40px] font-bold leading-[1.05] tracking-[-0.035em]">
            {application.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{application.location}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-base">
            <div>
              <dt className="font-mono text-xs uppercase text-muted-foreground">React</dt>
              <dd className="font-semibold">{formatExperience(application.reactMonths)}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase text-muted-foreground">TypeScript</dt>
              <dd className="font-semibold">{formatExperience(application.typescriptMonths)}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase text-muted-foreground">Testing</dt>
              <dd className="font-semibold">{application.testing}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase text-muted-foreground">Accessibility</dt>
              <dd className="font-semibold">{application.accessibility}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase text-muted-foreground">Teams led</dt>
              <dd className="font-semibold">{application.teamsLed}</dd>
            </div>
            <div>
              <dt className="font-mono text-xs uppercase text-muted-foreground">Last role</dt>
              <dd className="font-semibold">{application.lastRole}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-mono text-xs uppercase text-muted-foreground">Fast learner</dt>
              <dd className="font-semibold">{application.learning}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-4 border-l-2 border-brand pl-4">
        <p className="ui-label">From the cover letter</p>
        <blockquote className="mt-1 font-serif text-xl italic leading-[1.2] text-brand-text">
          “{application.coverLetter}”
        </blockquote>
      </div>
    </article>
  );
}
