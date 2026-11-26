import { useState } from 'react';
import { useWorkspaceStore } from '@/core/store/workspace';

export function ReasonChoices() {
  const reject = useWorkspaceStore((state) => state.reject);
  const [showExplanation, setShowExplanation] = useState(false);
  return (
    <section aria-label="Decision" className="border-t border-border bg-background px-4 py-3">
      <p className="ui-label mb-2">Your decision</p>
      <div className="grid grid-cols-2 gap-1">
        <button
          type="button"
          onClick={reject}
          className="h-11 bg-destructive px-3 text-left text-sm font-medium text-white"
        >
          Reject{' '}
          <span
            aria-hidden="true"
            className="float-right bg-amber-100 px-1 font-mono text-xs font-normal text-black"
          >
            +1 Credit
          </span>
        </button>
        <div
          className="relative"
          onMouseEnter={() => setShowExplanation(true)}
          onMouseLeave={() => setShowExplanation(false)}
        >
          <button
            type="button"
            aria-disabled="true"
            aria-describedby="interview-explanation"
            onFocus={() => setShowExplanation(true)}
            onBlur={() => setShowExplanation(false)}
            className="h-11 w-full bg-[#7d9f8a] px-3 text-sm font-medium text-white"
          >
            Invite to interview
          </button>
          <span
            id="interview-explanation"
            role="tooltip"
            className={`absolute bottom-full left-0 z-10 w-64 border border-border bg-card p-2 text-sm ${showExplanation ? '' : 'sr-only'}`}
          >
            The candidate does not meet the role requirements.
          </span>
        </div>
      </div>
    </section>
  );
}
