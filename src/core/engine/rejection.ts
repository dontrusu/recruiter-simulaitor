export type ReasonKind = 'precise' | 'generic';

export type RunState = {
  credits: number;
  rejected: number;
  applicationIndex: number;
};

export const reasonReward = (kind: ReasonKind) => (kind === 'precise' ? 12 : 3);

export function rejectApplication(
  run: RunState,
  kind: ReasonKind,
  applicationCount: number,
): RunState {
  return {
    credits: run.credits + reasonReward(kind),
    rejected: run.rejected + 1,
    applicationIndex: (run.applicationIndex + 1) % applicationCount,
  };
}
