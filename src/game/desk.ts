export type DeskId = 'printer' | 'coffee' | 'garden' | 'server' | 'solar' | 'capacitor';
export type DeskItem = {
  id: DeskId;
  name: string;
  description: string;
  cost: number;
  rate: number;
  maxLevel: number;
  minOwned: number;
  color: string;
};

export const deskItems: DeskItem[] = [
  {
    id: 'printer',
    name: 'Dispatch Conveyor',
    description:
      'A moving sorting line. Route signed applications, recycle bots, and build perfect batches. Earns automatically between rounds.',
    cost: 8,
    rate: 0.7,
    maxLevel: 5,
    minOwned: 1,
    color: 'mint',
  },
  {
    id: 'coffee',
    name: 'Coffee Reactor',
    description:
      'Hold to extract; release in the sweet spot. A perfect brew doubles machine output.',
    cost: 65,
    rate: 2.6,
    maxLevel: 5,
    minOwned: 5,
    color: 'amber',
  },
  {
    id: 'garden',
    name: 'Branch Network',
    description:
      'Rotate relays to connect new regions. Each solved network permanently grows your production.',
    cost: 420,
    rate: 8.5,
    maxLevel: 5,
    minOwned: 12,
    color: 'sage',
  },
  {
    id: 'server',
    name: 'Recruitment Probes',
    description:
      'Aim and launch miniature recruitment probes. Land on new worlds to expand your permanent production network.',
    cost: 1900,
    rate: 30,
    maxLevel: 5,
    minOwned: 24,
    color: 'blue',
  },
  {
    id: 'solar',
    name: 'Daylight Dividend',
    description: 'A permanent +25% to all desk income. The sun has joined payroll.',
    cost: 650,
    rate: 0,
    maxLevel: 1,
    minOwned: 10,
    color: 'amber',
  },
  {
    id: 'capacitor',
    name: 'Focus Capacitor',
    description: 'A perfect brew doubles production for 25s instead of 15s. Same 60s recharge.',
    cost: 2100,
    rate: 0,
    maxLevel: 1,
    minOwned: 18,
    color: 'blue',
  },
];

export type DeskLevels = Partial<Record<DeskId, number>>;
export const deskCost = (item: DeskItem, level: number) => Math.ceil(item.cost * 2.4 ** level);
export const deskRate = (item: DeskItem, level: number) =>
  level > 0 ? item.rate * 1.85 ** (level - 1) : 0;
export const deskMultiplier = (levels: DeskLevels) => (levels.solar ? 1.25 : 1);
export const deskBaseRate = (levels: DeskLevels) =>
  deskItems.reduce((sum, item) => sum + deskRate(item, levels[item.id] ?? 0), 0) *
  deskMultiplier(levels);
