import { vacancy } from '@/content/screen-content';

export function VacancyPanel() {
  return (
    <section
      aria-label="Vacancy"
      className="grid grid-cols-2 gap-x-4 border-b border-border bg-background px-4 py-3"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Open role · 1 of 1
        </p>
        <h1 id="vacancy-title" className="mt-1 font-sans text-xl font-bold leading-tight">
          {vacancy.title}
        </h1>
      </div>
      <ul className="space-y-1 border-l border-border pl-4">
        {vacancy.requirements.map((requirement) => (
          <li key={requirement} className="text-sm">
            {requirement}
          </li>
        ))}
      </ul>
    </section>
  );
}
