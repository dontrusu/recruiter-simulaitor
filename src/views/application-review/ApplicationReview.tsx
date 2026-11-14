import { CandidateCard } from './CandidateCard';
import { ReasonChoices } from './ReasonChoices';
import { VacancyPanel } from './VacancyPanel';

export function ApplicationReview() {
  return (
    <div className="grid flex-1 grid-cols-[280px_minmax(0,1fr)_300px] gap-10 px-[88px] pb-12 pt-5">
      <VacancyPanel />
      <CandidateCard />
      <ReasonChoices />
    </div>
  );
}
