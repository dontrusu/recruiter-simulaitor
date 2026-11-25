import type { Stage } from "./UpgradeWindows";

const early = ["Culture Fit Oracle", "Buzzword Bingo"];

export const roomUpgrades: Record<Stage, string[]> = {
  start: [],
  mid: early,
  chaos: [
    ...early,
    "Kevin the Succulent",
    "Brewtus the Coffee Machine",
    "Fairness Certificate",
    "Org Chart",
    "Mandatory Fun Cannon",
    "Swag Lootbox",
    "Headcount",
    "Mouse Jiggler Duck",
  ],
};
