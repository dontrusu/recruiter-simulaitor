import { upgrades } from "./content";

export function availableUpgrades(
  points: number,
  installed: ReadonlySet<string>,
) {
  const remaining = upgrades.filter((upgrade) => !installed.has(upgrade.name));
  return remaining.filter(
    (upgrade, index) => index === 0 || upgrade.cost <= points,
  );
}
