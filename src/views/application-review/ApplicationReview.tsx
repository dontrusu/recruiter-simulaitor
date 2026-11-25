import { CandidateCard } from './CandidateCard';
import { ReasonChoices } from './ReasonChoices';
import { VacancyPanel } from './VacancyPanel';

export function ApplicationReview() {
  return (
    <div className="flex flex-1 items-center justify-center py-5">
      <div className="w-[560px] border-2 border-foreground bg-card shadow-[4px_4px_0_var(--foreground)]">
        <div className="border-b border-border px-4 py-1 font-mono text-xs text-muted-foreground">
          Talent.OS / Application review
        </div>
        <VacancyPanel />
        <CandidateCard />
        <ReasonChoices />
      </div>
    </div>
  );
}
