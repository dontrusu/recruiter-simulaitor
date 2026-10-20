import { useEffect, useRef, type ReactNode } from 'react';
export function Dialog({
  children,
  label,
  onCancel,
  className = '',
}: {
  children: ReactNode;
  label: string;
  onCancel?: () => void;
  className?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = ref.current!;
    dialog.showModal();
    return () => {
      dialog.close();
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={label}
      className={`game-dialog ${className}`}
      onKeyDown={(e) => {
        if (e.key !== 'Tab') return;
        const buttons = Array.from(
          ref.current!.querySelectorAll<HTMLElement>(
            'button:not(:disabled),[href],input,[tabindex="0"]',
          ),
        );
        const first = buttons[0];
        const last = buttons.at(-1);
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onCancel?.();
      }}
    >
      {children}
    </dialog>
  );
}
