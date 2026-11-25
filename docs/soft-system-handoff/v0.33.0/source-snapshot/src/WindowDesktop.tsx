import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Button, Icon, Select, Tooltip } from "@talent-os/design-system";
import { UpgradeIcon } from "./UpgradeIcon";
import {
  windowSlots,
  windowUpgradeNames,
  type WindowKind,
} from "./windowSlots";
import { ReviewTools } from "./ReviewPanel";
import {
  activateWindow,
  emptyDesktop,
  openWindow,
  type DesktopState,
} from "./windowState";

type WindowActions = {
  state: DesktopState;
  add: (kind: WindowKind) => void;
  activate: (id: number) => void;
};
const DesktopContext = createContext<WindowActions | null>(null);
export function useWindowDesktop() {
  const value = useContext(DesktopContext);
  if (!value) throw new Error("Window controls require a desktop.");
  return value;
}

export function WindowDesktop({
  kinds,
  children,
}: {
  kinds: WindowKind[];
  children: ReactNode;
}) {
  const [state, setState] = useState(() =>
    kinds.reduce((previous, kind) => {
      const slot = windowSlots.find((slot) => slot.kind === kind)!;
      return openWindow(previous, kind, slot.id, slot.label);
    }, emptyDesktop()),
  );
  const add = (kind: WindowKind) => {
    const slot = windowSlots.find((slot) => slot.kind === kind)!;
    setState((previous) => openWindow(previous, kind, slot.id, slot.label));
  };
  return (
    <DesktopContext.Provider
      value={{
        state,
        add,
        activate: (id) => setState((previous) => activateWindow(previous, id)),
      }}
    >
      <ReviewTools>
        <DesktopTools kinds={kinds} />
      </ReviewTools>
      {children}
      {kinds.length > 0 && <Taskbar hasActivity={kinds.includes("inbox")} />}
    </DesktopContext.Provider>
  );
}

function DesktopTools({ kinds }: { kinds: WindowKind[] }) {
  const { state, add } = useWindowDesktop();
  const [kind, setKind] = useState<WindowKind>(kinds[0] ?? "music");
  if (!kinds.length) return null;
  const slot = windowSlots.find((slot) => slot.kind === kind)!;
  const visible = state.windows.filter(
    (window) => window.slot === slot.id,
  ).length;
  return (
    <section
      className="stack-review"
      aria-label="Перевірка накопичення вікон"
      lang="uk"
    >
      <div>
        <span className="eyebrow">Перевірка накопичення</span>
        <span className="muted">Тестові копії вікон · без покупок</span>
      </div>
      <Select
        label="Слот для перевірки"
        value={kind}
        options={windowSlots
          .filter((slot) => kinds.includes(slot.kind))
          .map((slot) => ({
            value: slot.kind,
            label: `${slot.id} · ${slot.label}`,
          }))}
        onChange={(event) => {
          const selected = kinds.find((kind) => kind === event.target.value);
          if (selected) setKind(selected);
        }}
      />
      <Button variant="secondary" onClick={() => add(kind)}>
        <Icon name="plus" />
        Додати вікно
      </Button>
      <span className="stack-count">
        {slot.id}: {visible} відкрито
      </span>
    </section>
  );
}

function Taskbar({ hasActivity }: { hasActivity: boolean }) {
  const [clock, setClock] = useState(() => new Date());
  useEffect(() => {
    const timer = setInterval(() => setClock(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);
  const { state, activate } = useWindowDesktop();
  const inbox = state.windows.find((window) => window.kind === "inbox");
  return (
    <>
      <nav className="desktop-taskbar" aria-label="Taskbar">
        <span className="taskbar-brand">Talent.OS</span>
        <div className="taskbar-windows" role="group" aria-label="Open windows">
          {[...state.windows]
            .sort((a, b) => a.id - b.id)
            .map((window) => (
              <Button
                key={window.id}
                id={`taskbar-window-${window.id}`}
                variant="ghost"
                size="sm"
                className="taskbar-window"
                aria-pressed={state.activeId === window.id}
                aria-label={`Show ${window.title}`}
                onClick={() => activate(window.id)}
              >
                <UpgradeIcon name={windowUpgradeNames[window.kind]} />
                <span>{window.title}</span>
                <span className="taskbar-state">{window.slot}</span>
              </Button>
            ))}
        </div>
        <div className="desktop-tray" role="group" aria-label="System tray">
          {hasActivity && (
            <Tooltip label="Activity: 96% · fictional preview">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Activity: 96 percent"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M2 12Q12-2 22 12Q12 26 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                <span>96%</span>
              </Button>
            </Tooltip>
          )}
          {inbox && (
            <Button
              variant="ghost"
              size="sm"
              aria-label="Open inbox from tray"
              onClick={() => activate(inbox.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M3 5h18v14H3zM3 5l9 8 9-8" />
              </svg>
              <span>1</span>
            </Button>
          )}
          <span className="tray-sound">Sound off</span>
          <time aria-label="Local time" dateTime={clock.toISOString()}>
            {clock.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </time>
        </div>
      </nav>
      <p className="window-feedback" role="status" aria-live="polite">
        {state.message}
      </p>
    </>
  );
}
