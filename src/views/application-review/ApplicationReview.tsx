import { useWorkspaceStore } from '@/core/store/workspace';
import { CandidateCard } from './CandidateCard';
import { ReasonChoices } from './ReasonChoices';
import { VacancyPanel } from './VacancyPanel';
import { Meadow } from './Meadow';
import './rejection-feedback.css';

export function ApplicationReview({ wallpaper = false }: { wallpaper?: boolean }) {
  const rejected = useWorkspaceStore((state) => state.run.rejected);
  const index = useWorkspaceStore((state) => state.run.applicationIndex);
  const preset = useWorkspaceStore((state) => state.preset);
  return (
    <div className="relative flex min-h-0 flex-1 items-center justify-center py-5">
      {wallpaper && <Meadow />}
      <div
        className={`relative w-[560px] border-2 border-foreground bg-card shadow-[4px_4px_0_var(--foreground)] ${preset === 'start' ? '' : 'preset-review'}`}
      >
        <div className="review-window-bar border-b border-border px-3 py-1 font-mono text-xs font-semibold text-foreground">
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
