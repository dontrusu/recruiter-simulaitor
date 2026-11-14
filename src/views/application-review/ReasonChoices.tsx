import { useState } from 'react';
import { applications, type Reason } from '@/content/screen-content';
import { reasonReward } from '@/core/engine/rejection';
import { useWorkspaceStore } from '@/core/store/workspace';
import { ReasonButton } from './ReasonButton';

export function ReasonChoices() {
  const index = useWorkspaceStore((state) => state.run.applicationIndex);
  const reject = useWorkspaceStore((state) => state.reject);
  const application = applications[index] ?? applications[0];
  const [status, setStatus] = useState('');

  function chooseReason(reason: Reason) {
    reject(reason.kind);
    const nextIndex = useWorkspaceStore.getState().run.applicationIndex;
    const next = applications[nextIndex] ?? applications[0];
    setStatus(
      `Rejection recorded. +${reasonReward(reason.kind)} EC. Next Candidate: ${next.name}.`,
    );
  }

  return (
    <section aria-labelledby="reason-heading" className="pt-6">
      <h2
        id="reason-heading"
        className="font-mono text-xs uppercase tracking-[0.14em] text-muted-foreground"
      >
        Choose a reason
      </h2>
      <ol aria-label="Reason choices" className="mt-5 space-y-3">
        {application.reasons.map((reason, slot) => (
          <li key={slot}>
            <ReasonButton reason={reason} onClick={() => chooseReason(reason)} />
          </li>
        ))}
      </ol>
      <p className="mt-7 font-serif text-[17px] italic leading-snug text-muted-foreground">
        Precise pays more. Generic is faster.
        <br />
        Nobody’s checking.
      </p>
      <p
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="mt-5 min-h-12 font-mono text-xs leading-relaxed text-muted-foreground"
      >
        {status}
      </p>
    </section>
  );
}
