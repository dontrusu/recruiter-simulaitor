import { vacancy } from '@/content/screen-content';

export function VacancyPanel() {
  return (
    <section aria-label="Vacancy" className="pt-6">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
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
          <li key={requirement} className="flex items-center gap-3 text-lg">
            <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
            {requirement}
          </li>
        ))}
      </ul>
    </section>
  );
}
