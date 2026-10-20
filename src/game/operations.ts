import type { DeskLevels } from './desk';

export type Station = 'printer' | 'coffee' | 'garden' | 'server';
export type Packet = { id: number; valid: boolean; title: string; evidence: string };
export type Operations = {
  conveyor: {
    round: number;
    packets: Packet[];
    score: number;
    deadline: number;
    readyAt: number;
    streak: number;
  };
  brew: { startedAt: number | null; readyAt: number };
  grid: { turns: number[]; solved: boolean; revision: number; links: number; readyAt: number };
  probe: {
    angle: number;
    power: number;
    flight: null | {
      startedAt: number;
      arrivesAt: number;
      angle: number;
      power: number;
      hit: boolean;
      targetAngle: number;
      targetPower: number;
    };
    sectors: number;
    attempts: number;
    readyAt: number;
  };
  feedback: null | {
    id: number;
    station: Station;
    success: boolean;
    message: string;
    reward: number;
    at: number;
  };
  serial: number;
};
export type OperationAction =
  | { type: 'sort-start' }
  | { type: 'sort'; packetId: number; lane: 'verified' | 'recycle' }
  | { type: 'brew-start' }
  | { type: 'brew-release' }
  | { type: 'brew-cancel' }
  | { type: 'rotate'; tile: number }
  | { type: 'grid-next' }
  | { type: 'aim'; angle: number; power: number }
  | { type: 'launch' };
type Result = { operations: Operations; reward: number; boostMs: number };

// Pipe directions are N/E/S/W. Both layouts connect the inlet (3,W) to outlet (5,E).
const layouts = [
  [
    [1, 2],
    [2, 3],
    [0, 1],
    [0, 3],
    [0, 2],
    [1, 2],
    [1, 2],
    [0, 1],
    [0, 3],
  ],
  [
    [1, 2],
    [1, 2],
    [2, 3],
    [2, 3],
    [0, 2],
    [0, 1],
    [0, 1],
    [0, 3],
    [0, 3],
  ],
];
function shuffledTurns(revision: number) {
  return Array.from({ length: 9 }, (_, i) => (i * 3 + revision * 5 + 1) % 4);
}
export function createOperations(): Operations {
  return {
    conveyor: { round: 0, packets: [], score: 0, deadline: 0, readyAt: 0, streak: 0 },
    brew: { startedAt: null, readyAt: 0 },
    grid: { turns: shuffledTurns(0), solved: false, revision: 0, links: 0, readyAt: 0 },
    probe: { angle: 0, power: 65, flight: null, sectors: 0, attempts: 0, readyAt: 0 },
    feedback: null,
    serial: 0,
  };
}
export function pipePorts(operations: Operations, tile: number) {
  return layouts[operations.grid.revision % layouts.length][tile].map(
    (d) => (d + operations.grid.turns[tile]) % 4,
  );
}
export function connectedTiles(operations: Operations): number[] {
  if (!pipePorts(operations, 3).includes(3)) return [];
  const seen = new Set<number>([3]);
  const queue = [3];
  for (let i = 0; i < queue.length; i++) {
    const index = queue[i];
    for (const port of pipePorts(operations, index)) {
      const row = Math.floor(index / 3) + [-1, 0, 1, 0][port];
      const col = (index % 3) + [0, 1, 0, -1][port];
      const next = row * 3 + col;
      if (row < 0 || row > 2 || col < 0 || col > 2 || seen.has(next)) continue;
      if (pipePorts(operations, next).includes((port + 2) % 4)) {
        seen.add(next);
        queue.push(next);
      }
    }
  }
  return [...seen];
}
export function probeTarget(operations: Operations, now: number) {
  return {
    angle: (operations.probe.attempts * 137 + 45 + now / 260) % 360,
    power: 55 + ((operations.probe.attempts * 17) % 40),
  };
}
export const angleDistance = (a: number, b: number) => Math.abs(((a - b + 540) % 360) - 180);
export const brewFill = (operations: Operations, now: number) =>
  operations.brew.startedAt === null ? 0 : Math.min(100, (now - operations.brew.startedAt) / 30);
export const operationMultiplier = (operations: Operations) =>
  1 + Math.min(5, operations.grid.links) * 0.05 + Math.min(8, operations.probe.sectors) * 0.04;

function notice(
  o: Operations,
  station: Station,
  success: boolean,
  message: string,
  reward: number,
  now: number,
): Result {
  return {
    operations: {
      ...o,
      serial: o.serial + 1,
      feedback: { id: o.serial + 1, station, success, message, reward, at: now },
    },
    reward,
    boostMs: 0,
  };
}
function packets(round: number): Packet[] {
  return Array.from({ length: 5 }, (_, i) => {
    const valid = (round * 7 + i * 3) % 5 < 3;
    return {
      id: round * 5 + i,
      valid,
      title: [
        'Backend developer',
        'Product designer',
        'Senior spreadsheet',
        'Growth specialist',
        'Office philosopher',
      ][(i + round) % 5],
      evidence: valid
        ? 'SIGNED · HUMAN VERIFIED'
        : i % 2
          ? 'DUPLICATE · ALREADY PROCESSED'
          : 'BOT GENERATED · NO SIGNATURE',
    };
  });
}
export function operate(
  o: Operations,
  action: OperationAction,
  now: number,
  levels: DeskLevels,
  rewardBase: number,
): Result {
  const unchanged = { operations: o, reward: 0, boostMs: 0 };
  switch (action.type) {
    case 'sort-start': {
      if (!levels.printer || o.conveyor.packets.length || now < o.conveyor.readyAt)
        return unchanged;
      const round = o.conveyor.round + 1;
      return {
        ...unchanged,
        operations: {
          ...o,
          conveyor: {
            ...o.conveyor,
            round,
            packets: packets(round),
            score: 0,
            streak: 0,
            deadline: now + 20000,
          },
        },
      };
    }
    case 'sort': {
      const packet = o.conveyor.packets[0];
      if (!levels.printer || !packet || packet.id !== action.packetId || now >= o.conveyor.deadline)
        return unchanged;
      const correct = packet.valid === (action.lane === 'verified');
      const score = o.conveyor.score + Number(correct);
      const remaining = o.conveyor.packets.slice(1);
      const next = {
        ...o,
        conveyor: {
          ...o.conveyor,
          packets: remaining,
          score,
          streak: correct ? o.conveyor.streak + 1 : 0,
          readyAt: remaining.length ? 0 : now + 15000,
        },
      };
      const reward = remaining.length
        ? 0
        : Math.round(((rewardBase * score) / 5) * (score === 5 ? 1.5 : 1));
      return notice(
        next,
        'printer',
        correct,
        remaining.length
          ? correct
            ? 'Right lane. Keep the line moving.'
            : 'Wrong lane. That one escaped.'
          : `${score}/5 routed correctly.${score === 5 ? ' Perfect batch!' : ' Batch closed.'}`,
        reward,
        now,
      );
    }
    case 'brew-start':
      if (!levels.coffee || o.brew.startedAt !== null || now < o.brew.readyAt) return unchanged;
      return { ...unchanged, operations: { ...o, brew: { ...o.brew, startedAt: now } } };
    case 'brew-cancel':
      if (o.brew.startedAt === null) return unchanged;
      return { ...unchanged, operations: { ...o, brew: { ...o.brew, startedAt: null } } };
    case 'brew-release': {
      if (!levels.coffee || o.brew.startedAt === null) return unchanged;
      const fill = brewFill(o, now);
      const success = fill >= 58 && fill <= 83;
      const next = { ...o, brew: { startedAt: null, readyAt: now + (success ? 60000 : 4000) } };
      const result = notice(
        next,
        'coffee',
        success,
        success
          ? 'Perfect extraction. Production doubled.'
          : fill < 58
            ? 'Too soon. That is warm water.'
            : 'Overextracted. Even the machines refuse it.',
        0,
        now,
      );
      return { ...result, boostMs: success ? (levels.capacitor ? 25000 : 15000) : 0 };
    }
    case 'rotate': {
      if (
        !levels.garden ||
        o.grid.solved ||
        !Number.isInteger(action.tile) ||
        action.tile < 0 ||
        action.tile > 8
      )
        return unchanged;
      const turns = o.grid.turns.map((turn, i) => (i === action.tile ? (turn + 1) % 4 : turn));
      let next = { ...o, grid: { ...o.grid, turns } };
      if (!connectedTiles(next).includes(5) || !pipePorts(next, 5).includes(1))
        return { ...unchanged, operations: next };
      next = {
        ...next,
        grid: { ...next.grid, solved: true, links: next.grid.links + 1, readyAt: now + 30000 },
      };
      return notice(
        next,
        'garden',
        true,
        next.grid.links <= 5
          ? 'Region connected. Permanent desk output +5%.'
          : 'Network restored. Every connection is operating at capacity.',
        rewardBase * 2,
        now,
      );
    }
    case 'grid-next':
      if (!levels.garden || !o.grid.solved || now < o.grid.readyAt) return unchanged;
      return {
        ...unchanged,
        operations: {
          ...o,
          grid: {
            ...o.grid,
            solved: false,
            revision: o.grid.revision + 1,
            turns: shuffledTurns(o.grid.revision + 1),
          },
        },
      };
    case 'aim':
      if (
        !levels.server ||
        o.probe.flight ||
        !Number.isFinite(action.angle) ||
        !Number.isFinite(action.power)
      )
        return unchanged;
      return {
        ...unchanged,
        operations: {
          ...o,
          probe: {
            ...o.probe,
            angle: ((action.angle % 360) + 360) % 360,
            power: Math.max(20, Math.min(100, action.power)),
          },
        },
      };
    case 'launch': {
      if (!levels.server || o.probe.flight || now < o.probe.readyAt) return unchanged;
      const target = probeTarget(o, now + 4000);
      const hit =
        angleDistance(o.probe.angle, target.angle) <= 14 &&
        Math.abs(o.probe.power - target.power) <= 12;
      return {
        ...unchanged,
        operations: {
          ...o,
          probe: {
            ...o.probe,
            flight: {
              startedAt: now,
              arrivesAt: now + 4000,
              angle: o.probe.angle,
              power: o.probe.power,
              hit,
              targetAngle: target.angle,
              targetPower: target.power,
            },
          },
        },
      };
    }
  }
}
export function tickOperations(o: Operations, now: number, rewardBase: number): Result {
  let result: Result = { operations: o, reward: 0, boostMs: 0 };
  if (o.conveyor.packets.length && now >= o.conveyor.deadline) {
    result = notice(
      { ...o, conveyor: { ...o.conveyor, packets: [], readyAt: now + 5000 } },
      'printer',
      false,
      'The batch passed you by. Try another when you are ready.',
      Math.round((rewardBase * o.conveyor.score) / 5),
      now,
    );
  }
  const current = result.operations;
  if (current.probe.flight && now >= current.probe.flight.arrivesAt) {
    const success = current.probe.flight.hit;
    const next = {
      ...current,
      probe: {
        ...current.probe,
        flight: null,
        sectors: current.probe.sectors + Number(success),
        attempts: current.probe.attempts + 1,
        readyAt: now + (success ? 20000 : 3000),
      },
    };
    const landed = notice(
      next,
      'server',
      success,
      success
        ? current.probe.sectors < 8
          ? 'Probe landed. New branch online. Permanent output +4%.'
          : 'Another world connected. The network keeps expanding.'
        : 'Missed the orbit. Aim at the outlined landing zone.',
      success ? rewardBase * 3 : 0,
      now,
    );
    return { ...landed, reward: result.reward + landed.reward };
  }
  // An unattended brew times out instead of carrying through another session action.
  if (result.operations.brew.startedAt !== null && now - result.operations.brew.startedAt >= 4000) {
    const timed = notice(
      { ...result.operations, brew: { startedAt: null, readyAt: now + 4000 } },
      'coffee',
      false,
      'The cup overflowed. Release earlier next time.',
      0,
      now,
    );
    return { ...timed, reward: result.reward };
  }
  return result;
}
