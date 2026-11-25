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
      viewBox="0 0 160 180"
      className="w-[148px] shrink-0 border border-border"
    >
      <rect
        width="160"
        height="180"
        fill={index === 1 ? '#d8e5d8' : index === 2 ? '#ddd6ea' : '#dff4f2'}
      />
      {index === 1 && <path d="M32 155V70c0-48 96-48 96 0v85Z" fill="#362d2b" />}
      <path
        d="M16 180c4-37 27-58 64-58s60 21 64 58H16Z"
        fill={index === 1 ? '#6a526e' : index === 2 ? '#425b70' : '#25231e'}
      />
      <path d="M53 109c8 10 18 15 27 15s19-5 27-15l8 24-35 22-35-22 8-24Z" fill="#bd805e" />
      <ellipse cx="80" cy="73" rx="36" ry="43" fill={index === 2 ? '#bc805d' : '#e3a57d'} />
      <path
        d={
          index === 1
            ? 'M43 72c-2-35 12-52 37-52 30 0 40 21 37 52-12-4-23-20-27-31-10 13-29 23-47 25Z'
            : index === 2
              ? 'M44 62c0-36 15-46 36-46 25 0 38 15 38 46l-9-9-8 6-8-8-10 7-9-8-11 8-9-7Z'
              : 'M44 70c-4-31 13-50 37-50 27 0 39 18 36 49-9-5-16-15-19-24-14 14-32 21-54 21Z'
        }
        fill="#25231e"
      />
      <path d="M58 78h12m20 0h12" stroke="#28251f" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M73 99c5 4 10 4 15 0"
        fill="none"
        stroke="#28251f"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CandidateCard({ indexOverride }: { indexOverride?: number }) {
  const currentIndex = useWorkspaceStore((state) => state.run.applicationIndex);
  const index = indexOverride ?? currentIndex;
  const application = applications[index] ?? applications[0];
  return (
    <article aria-label="Current application" className="bg-card px-4 py-3">
      <div className="flex items-center justify-between pb-3 font-mono text-label uppercase text-muted-foreground">
        <p>
          Application #{application.number} · {application.status}
        </p>
        <span className="border border-border px-2">In review</span>
      </div>
      <div className="flex items-start gap-4">
        <CandidatePortrait name={application.name} index={index} />
        <div className="min-w-0 flex-1">
          <h2 className="font-sans text-[36px] font-bold leading-none tracking-[-0.03em]">
            {application.name}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{application.location}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt className="ui-label">React</dt>
              <dd className="font-bold">{formatExperience(application.reactMonths)}</dd>
            </div>
            <div>
              <dt className="ui-label">TypeScript</dt>
              <dd className="font-bold">{formatExperience(application.typescriptMonths)}</dd>
            </div>
            <div>
              <dt className="ui-label">Testing</dt>
              <dd className="font-bold">{application.testing}</dd>
            </div>
            <div>
              <dt className="ui-label">Accessibility</dt>
              <dd className="font-bold">{application.accessibility}</dd>
            </div>
            <div>
              <dt className="ui-label">Teams led</dt>
              <dd className="font-bold">{application.teamsLed}</dd>
            </div>
            <div>
              <dt className="ui-label">Last role</dt>
              <dd className="font-bold">{application.lastRole}</dd>
            </div>
            <div className="col-span-2">
              <dt className="ui-label">Fast learner</dt>
              <dd className="font-bold">{application.learning}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="mt-4 border-l-2 border-brand pl-4">
        <p className="ui-label">From the cover letter</p>
        <blockquote className="mt-1 font-serif text-[21px] italic leading-snug text-brand-text">
          “{application.coverLetter}”
        </blockquote>
      </div>
    </article>
  );
}
