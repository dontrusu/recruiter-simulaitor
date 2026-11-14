import { useWorkspaceStore } from '@/core/store/workspace';
import { Button } from '@/ui/button';

export function DevPanel() {
  const cameraState = useWorkspaceStore((state) => state.devCameraState);
  const toggleDevCameraState = useWorkspaceStore((state) => state.toggleDevCameraState);

  return (
    <div className="dev-panel pointer-events-none absolute right-4 bottom-4 z-50">
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={toggleDevCameraState}
        className="pointer-events-auto"
      >
        Camera: {cameraState}
      </Button>
    </div>
  );
}
