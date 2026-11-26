import { useEffect, useState } from 'react';
import { useWorkspaceStore } from '@/core/store/workspace';
import { windowsForPreset } from './PresetWindows';
import { UpgradeIcon } from '@/views/shop/UpgradeIcon';
import { Eye, Mail } from 'lucide-react';

export function Taskbar() {
  const [clock, setClock] = useState(() => new Date());
  const preset = useWorkspaceStore((state) => state.preset);
  const front = useWorkspaceStore((state) => state.frontWindow);
  const activate = useWorkspaceStore((state) => state.activateWindow);
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <nav
      aria-label="Taskbar"
      className="absolute right-4 bottom-12 left-4 flex h-[52px] items-center gap-4 border-2 border-foreground bg-background px-3 text-foreground"
    >
      <span className="text-xs font-semibold">Talent.OS</span>
      <div
        role="group"
        aria-label="Open windows"
        className="flex min-w-0 flex-1 gap-2 overflow-x-auto"
      >
        {windowsForPreset(preset).map((window) => (
          <button
            key={window.name}
            type="button"
            aria-pressed={front === window.name}
            onClick={() => activate(window.name)}
            className="h-[42px] shrink-0 border border-foreground px-2 text-xs"
          >
            <span className="inline-flex items-center gap-1">
              <UpgradeIcon name={window.upgrade} />
              <span className="flex flex-col items-center leading-tight">
                {window.name}
                <small>{window.slot}</small>
              </span>
            </span>
          </button>
        ))}
      </div>
      {preset !== 'start' && (
        <div
          aria-hidden="true"
          className="flex shrink-0 gap-1 border-l border-border pl-2 font-mono text-xs"
        >
          <span className="flex items-center gap-1 border border-foreground px-1 py-1">
            <Eye size={14} /> 96%
          </span>
          <span className="flex items-center gap-1 border border-foreground px-1 py-1">
            <Mail size={14} /> 1
          </span>
        </div>
      )}
      <time
        aria-label="Local time"
        dateTime={clock.toISOString()}
        className="font-mono text-[10px]"
      >
        {clock.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </time>
    </nav>
  );
}
