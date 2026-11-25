import type { Reason } from '@/content/screen-content';
import { reasonReward } from '@/core/engine/rejection';
import { Button } from '@/ui/button';

type ReasonButtonProps = { reason: Reason; onClick: () => void };

export function ReasonButton({ reason, onClick }: ReasonButtonProps) {
  return (
    <Button
      type="button"
      data-testid={`reason-${reason.kind}`}
      variant={reason.kind === 'precise' ? 'default' : 'outline'}
      onClick={onClick}
      className={`h-auto min-h-[58px] w-full justify-between gap-2 whitespace-normal rounded-none border px-2 py-2 text-left font-sans text-sm font-normal ${
        reason.kind === 'precise'
          ? 'border-foreground bg-foreground text-background hover:bg-foreground/90'
          : 'border-border bg-card text-foreground'
      }`}
    >
      <span className="leading-tight">{reason.text}</span>
      <strong
        className={`shrink-0 font-mono text-sm ${reason.kind === 'precise' ? 'text-background' : 'text-brand-text'}`}
      >
        +{reasonReward(reason.kind)}
      </strong>
    </Button>
  );
}
