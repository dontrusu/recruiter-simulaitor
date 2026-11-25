import { describe, expect, it } from "vitest";
import { availableUpgrades } from "./shopAvailability";

describe("shop availability", () => {
  it("shows the next upgrade when the first is already installed and points are zero", () => {
    const installed = new Set([
      "Smart Reject",
      "Talent Pool",
      "Lo-Fi Beats to Reject To",
      "Calm Corner",
    ]);
    expect(
      availableUpgrades(0, installed).map((upgrade) => upgrade.name),
    ).toEqual(["Desktop Wallpaper"]);
  });
  it("reveals additional upgrades only when affordable", () => {
    expect(
      availableUpgrades(20, new Set()).map((upgrade) => upgrade.name),
    ).toEqual(["Smart Reject", "Desktop Wallpaper"]);
  });
  it("hides installed upgrades even if they are affordable", () => {
    expect(
      availableUpgrades(40, new Set(["Desktop Wallpaper"])).map(
        (upgrade) => upgrade.name,
      ),
    ).toEqual(["Smart Reject", "Office Color Pack"]);
  });
});
