import { useWorkspaceStore } from '../../store/workspace';

export function DevPanel() {
  const cameraState = useWorkspaceStore((state) => state.devCameraState);
  const toggleDevCameraState = useWorkspaceStore((state) => state.toggleDevCameraState);

  return (
    <div className="dev-panel pointer-events-none absolute right-4 bottom-4 z-50">
      <button
        type="button"
        onClick={toggleDevCameraState}
        className="pointer-events-auto rounded border border-[#485d61] bg-[#dde4e0]/90 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-[#1f2a2d] shadow-[0_4px_12px_rgba(26,38,41,0.18)] transition hover:bg-[#ebf2ee]"
      >
        Camera: {cameraState}
      </button>
    </div>
  );
}
