import { useEffect, useState } from 'react';

export function Taskbar() {
  const [clock, setClock] = useState(() => new Date());
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
      <div role="group" aria-label="Open windows" className="flex-1" />
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
