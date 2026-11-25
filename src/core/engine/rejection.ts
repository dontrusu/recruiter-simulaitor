export type RunState = {
  credits: number;
  rejected: number;
  applicationIndex: number;
};

export function rejectApplication(run: RunState, applicationCount: number): RunState {
  return {
    credits: run.credits + 1,
    rejected: run.rejected + 1,
    applicationIndex: (run.applicationIndex + 1) % applicationCount,
  };
}
