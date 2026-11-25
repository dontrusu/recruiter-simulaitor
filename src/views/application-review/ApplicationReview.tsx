import { useWorkspaceStore } from '@/core/store/workspace';
import { CandidateCard } from './CandidateCard';
import { ReasonChoices } from './ReasonChoices';
import { VacancyPanel } from './VacancyPanel';

export function ApplicationReview() {
  const rejected = useWorkspaceStore((state) => state.run.rejected);
  const index = useWorkspaceStore((state) => state.run.applicationIndex);
  const preset = useWorkspaceStore((state) => state.preset);
  return (
    <div className="flex flex-1 items-center justify-center py-5">
      <div
        className={`w-[680px] border border-border bg-card shadow-[4px_4px_0_var(--paper-shadow)] ${preset === 'start' ? '' : 'preset-review'}`}
      >
        <div className="border-b border-border px-4 py-1 font-mono text-xs text-muted-foreground">
          Talent.OS / Application review
        </div>
        <VacancyPanel />
        <div className="relative overflow-hidden">
          <CandidateCard />
          {rejected > 0 && (
            <div key={rejected} className="rejection-exit" aria-hidden="true">
              <CandidateCard indexOverride={(index + 2) % 3} />
              <div className="rejection-stamp">
                Rejection sent<small>Application filed</small>
              </div>
            </div>
          )}
        </div>
        <ReasonChoices />
      </div>
    </div>
  );
}
