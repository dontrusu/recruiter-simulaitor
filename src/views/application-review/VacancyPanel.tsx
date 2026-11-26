import { vacancy } from '@/content/screen-content';

export function VacancyPanel() {
  return (
    <section
      aria-label="Vacancy"
      className="grid grid-cols-2 gap-x-4 border-b border-border bg-background px-4 py-2"
    >
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
          Open role · 1 of 1
        </p>
        <h1 id="vacancy-title" className="mt-1 font-sans text-xl font-bold leading-tight">
          {vacancy.title}
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">Product team · Full time</p>
      </div>
      <ul className="border-l border-border pl-4">
        {vacancy.requirements.map((requirement) => (
          <li key={requirement} className="flex justify-between gap-2 text-sm leading-[1.25]">
            <span>{requirement.split(' · ')[0]}</span>
            <strong className="text-right">{requirement.split(' · ')[1]}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}
