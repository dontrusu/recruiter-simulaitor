import { useWorkspaceStore } from '@/core/store/workspace';
import { Button } from '@/ui/button';

export function DevPanel() {
  const cameraState = useWorkspaceStore((state) => state.devCameraState);
  const toggleDevCameraState = useWorkspaceStore((state) => state.toggleDevCameraState);
  const preset = useWorkspaceStore((state) => state.preset);
  const setPreset = useWorkspaceStore((state) => state.setPreset);

  return (
    <div className="dev-panel pointer-events-none absolute right-4 bottom-4 z-50">
      <label className="pointer-events-auto mr-2 bg-background text-foreground">
        Composition preset
        <select
          value={preset}
          onChange={(event) => {
            const value = event.target.value;
            if (value === 'start' || value === 'mid' || value === 'chaos') setPreset(value);
          }}
        >
          <option value="start">Player</option>
          <option value="mid">Early upgrades</option>
          <option value="chaos">Full chaos</option>
        </select>
      </label>
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
