import { Popover } from 'radix-ui';
import { SlidersHorizontal } from 'lucide-react';
import { useWorkspaceStore } from '@/core/store/workspace';
import { Button } from '@/ui/button';

type DevPanelProps = {
  colors: boolean;
  wallpaper: boolean;
  onColorsChange: (value: boolean) => void;
  onWallpaperChange: (value: boolean) => void;
};

export function DevPanel({ colors, wallpaper, onColorsChange, onWallpaperChange }: DevPanelProps) {
  const cameraState = useWorkspaceStore((state) => state.devCameraState);
  const toggleDevCameraState = useWorkspaceStore((state) => state.toggleDevCameraState);
  const preset = useWorkspaceStore((state) => state.preset);
  const setPreset = useWorkspaceStore((state) => state.setPreset);

  return (
    <div className="dev-panel pointer-events-none absolute inset-x-4 bottom-4 z-50 flex items-end justify-between">
      <Button
        type="button"
        variant="outline"
        size="xs"
        onClick={toggleDevCameraState}
        className="pointer-events-auto"
      >
        Camera: {cameraState}
      </Button>
      <Popover.Root>
        <Popover.Trigger asChild>
          <Button type="button" variant="outline" className="pointer-events-auto">
            <SlidersHorizontal aria-hidden="true" /> Макет
          </Button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            aria-label="Налаштування макета"
            side="top"
            align="end"
            sideOffset={8}
            className="z-[100] max-h-[min(80vh,480px)] w-[min(340px,calc(100vw-32px))] overflow-auto rounded border border-foreground bg-card p-4 text-foreground shadow-lg"
          >
            <p className="mb-3 font-mono text-xs uppercase tracking-wide">Design review / Макет</p>
            <label className="mb-4 flex flex-col gap-2 text-sm">
              Composition preset
              <select
                className="min-h-10 border border-foreground bg-background px-2"
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
            <div className="grid gap-2" role="group" aria-label="Візуальний перегляд">
              <Button
                type="button"
                variant="outline"
                aria-pressed={wallpaper}
                className="aria-pressed:bg-amber-100 aria-pressed:text-foreground"
                onClick={() => onWallpaperChange(!wallpaper)}
              >
                Перегляд: фон
              </Button>
              <Button
                type="button"
                variant="outline"
                aria-pressed={colors}
                className="aria-pressed:bg-amber-100 aria-pressed:text-foreground"
                onClick={() => onColorsChange(!colors)}
              >
                Перегляд: кольори
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Візуальний перегляд · Прогрес заявки зберігається
            </p>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
