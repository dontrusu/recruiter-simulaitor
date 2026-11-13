import { useWorkspaceStore } from '@/core/store/workspace';

export function DevPanel() {
  const cameraState = useWorkspaceStore((state) => state.devCameraState);
  const toggleDevCameraState = useWorkspaceStore((state) => state.toggleDevCameraState);

  return (
    <div className="dev-panel pointer-events-none absolute right-4 bottom-4 z-50">
      <button
        type="button"
        onClick={toggleDevCameraState}
        className="pointer-events-auto rounded border border-border bg-card/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground shadow-[0_4px_12px_var(--paper-shadow)] transition hover:bg-background"
      >
        Camera: {cameraState}
      </button>
    </div>
  );
}
