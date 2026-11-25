import type { WindowKind, SlotId } from "./windowSlots";

export type DesktopWindow = {
  id: number;
  kind: WindowKind;
  slot: SlotId;
  title: string;
  number: number;
  openedAt: number;
  front: number;
};
export type DesktopState = {
  windows: DesktopWindow[];
  nextId: number;
  nextOrder: number;
  activeId: number | null;
  message: string;
};
export function emptyDesktop(): DesktopState {
  return { windows: [], nextId: 1, nextOrder: 1, activeId: null, message: "" };
}

export function openWindow(
  state: DesktopState,
  kind: WindowKind,
  slot: SlotId,
  title: string,
): DesktopState {
  const number =
    state.windows.filter((window) => window.kind === kind).length + 1;
  const item: DesktopWindow = {
    id: state.nextId,
    kind,
    slot,
    title: number === 1 ? title : `${title} · ${number}`,
    number,
    openedAt: state.nextOrder,
    front: state.nextOrder,
  };
  return {
    ...state,
    windows: [...state.windows, item],
    nextId: state.nextId + 1,
    nextOrder: state.nextOrder + 1,
    activeId: item.id,
    message: `${item.title} opened in ${slot}.`,
  };
}

export function activateWindow(state: DesktopState, id: number): DesktopState {
  if (
    state.activeId === id ||
    !state.windows.some((window) => window.id === id)
  )
    return state;
  return {
    ...state,
    activeId: id,
    nextOrder: state.nextOrder + 1,
    windows: state.windows.map((window) =>
      window.id === id ? { ...window, front: state.nextOrder } : window,
    ),
  };
}
