import { describe, expect, it } from "vitest";
import { activateWindow, emptyDesktop, openWindow } from "./windowState";

describe("desktop windows", () => {
  it("keeps every window open when more than three share a slot", () => {
    let state = emptyDesktop();
    for (let i = 0; i < 6; i++)
      state = openWindow(state, "music", "L1", "Lo-Fi");
    expect(state.windows.map((window) => window.title)).toEqual([
      "Lo-Fi",
      "Lo-Fi · 2",
      "Lo-Fi · 3",
      "Lo-Fi · 4",
      "Lo-Fi · 5",
      "Lo-Fi · 6",
    ]);
    expect(new Set(state.windows.map((window) => window.id)).size).toBe(6);
  });

  it("brings an existing window to the front without removing any windows", () => {
    let state = emptyDesktop();
    state = openWindow(state, "music", "L1", "Lo-Fi");
    state = openWindow(state, "wins", "R1", "#wins");
    const first = state.windows[0].id;
    const next = activateWindow(state, first);
    expect(next.windows).toHaveLength(2);
    expect(next.activeId).toBe(first);
    expect(next.windows[0].front).toBeGreaterThan(next.windows[1].front);
  });
});
