import type { Reason } from '@/content/screen-content';
import { reasonReward } from '@/core/engine/rejection';
import { Button } from '@/ui/button';

type ReasonButtonProps = { reason: Reason; onClick: () => void };

export function ReasonButton({ reason, onClick }: ReasonButtonProps) {
  return (
    <Button
      type="button"
      variant={reason.kind === 'precise' ? 'default' : 'outline'}
      onClick={onClick}
      className={`h-auto min-h-[58px] w-full justify-between gap-4 whitespace-normal rounded-full border px-5 py-3 text-left font-sans text-base font-normal ${
        reason.kind === 'precise'
          ? 'border-foreground bg-foreground text-background hover:bg-foreground/90'
          : 'border-border bg-card text-foreground'
      }`}
    >
      <span className="leading-tight">{reason.text}</span>
      <strong className="shrink-0 font-mono text-sm text-brand">
        +{reasonReward(reason.kind)}
      </strong>
    </Button>
  );
}
