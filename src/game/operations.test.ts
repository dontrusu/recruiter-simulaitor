import { describe, expect, it } from 'vitest';
import {
  createOperations,
  operate,
  tickOperations,
  probeTarget,
  operationMultiplier,
  connectedTiles,
  pipePorts,
} from './operations';
import * as g from './engine';
import { upgrades } from './config';

const machines = { printer: 1, coffee: 1, garden: 1, server: 1 };
describe('playable production systems', () => {
  it('requires a purchased machine for every activity', () => {
    const o = createOperations();
    for (const action of [
      { type: 'sort-start' },
      { type: 'brew-start' },
      { type: 'rotate', tile: 0 },
      { type: 'launch' },
      { type: 'aim', angle: 20, power: 60 },
    ] as const)
      expect(operate(o, action, 0, {}, 100).operations).toBe(o);
  });
  it('routes a full batch, rejects replayed cards and rewards accuracy', () => {
    let o = operate(createOperations(), { type: 'sort-start' }, 0, machines, 100).operations;
    const first = o.conveyor.packets[0];
    let total = 0;
    for (let i = 0; i < 5; i++) {
      const packet = o.conveyor.packets[0];
      const result = operate(
        o,
        { type: 'sort', packetId: packet.id, lane: packet.valid ? 'verified' : 'recycle' },
        1000 + i * 1000,
        machines,
        100,
      );
      total += result.reward;
      o = result.operations;
    }
    expect(o.conveyor.score).toBe(5);
    expect(total).toBe(150);
    expect(
      operate(o, { type: 'sort', packetId: first.id, lane: 'verified' }, 6000, machines, 100)
        .reward,
    ).toBe(0);
    expect(operate(o, { type: 'sort-start' }, 6000, machines, 100).operations).toBe(o);
    expect(
      operate(o, { type: 'sort-start' }, 20000, machines, 100).operations.conveyor.packets,
    ).toHaveLength(5);
  });
  it('handles mistakes and expired batches without inventing perfect rewards', () => {
    let o = operate(createOperations(), { type: 'sort-start' }, 0, machines, 100).operations;
    const first = o.conveyor.packets[0];
    o = operate(
      o,
      { type: 'sort', packetId: first.id, lane: first.valid ? 'recycle' : 'verified' },
      1000,
      machines,
      100,
    ).operations;
    expect(o.conveyor.score).toBe(0);
    const expired = tickOperations(o, 20000, 100);
    expect(expired.operations.conveyor.packets).toEqual([]);
    expect(expired.reward).toBe(0);
    expect(tickOperations(expired.operations, 21000, 100).reward).toBe(0);
  });
  it('uses hold duration for extraction and treats short, perfect and overflowing brews differently', () => {
    const started = operate(
      createOperations(),
      { type: 'brew-start' },
      1000,
      machines,
      100,
    ).operations;
    expect(operate(started, { type: 'brew-release' }, 2000, machines, 100).boostMs).toBe(0);
    const perfect = operate(started, { type: 'brew-release' }, 3000, machines, 100);
    expect(perfect.boostMs).toBe(15000);
    expect(
      operate(perfect.operations, { type: 'brew-start' }, 4000, machines, 100).operations,
    ).toBe(perfect.operations);
    expect(operate(started, { type: 'brew-release' }, 3800, machines, 100).boostMs).toBe(0);
    expect(tickOperations(started, 5000, 100).operations.brew.startedAt).toBeNull();
    expect(
      operate(started, { type: 'brew-release' }, 3000, { ...machines, capacitor: 1 }, 100).boostMs,
    ).toBe(25000);
  });
  it('requires an unbroken route, permanently expands production, and cannot pay the same network twice', () => {
    for (let revision = 0; revision < 2; revision++) {
      let o = createOperations();
      o = { ...o, grid: { ...o.grid, revision } };
      expect(connectedTiles(o).includes(5) && pipePorts(o, 5).includes(1)).toBe(false);
      let reward = 0;
      for (let tile = 0; tile < 9; tile++)
        for (let turns = 0; turns < 4 && o.grid.turns[tile] !== 0; turns++) {
          const result = operate(o, { type: 'rotate', tile }, 1000, machines, 100);
          o = result.operations;
          reward += result.reward;
        }
      expect(o.grid.solved).toBe(true);
      expect(o.grid.links).toBe(1);
      expect(reward).toBe(200);
      expect(operationMultiplier(o)).toBe(1.05);
      expect(operate(o, { type: 'rotate', tile: 0 }, 2000, machines, 100).operations).toBe(o);
      expect(operate(o, { type: 'grid-next' }, 2000, machines, 100).operations).toBe(o);
      expect(operate(o, { type: 'grid-next' }, 31000, machines, 100).operations.grid.solved).toBe(
        false,
      );
    }
  });
  it('freezes an aimed trajectory at launch, settles on arrival and rewards each new colony once', () => {
    let o = createOperations();
    const target = probeTarget(o, 5000);
    o = operate(o, { type: 'aim', ...target }, 1000, machines, 100).operations;
    o = operate(o, { type: 'launch' }, 1000, machines, 100).operations;
    expect(o.probe.flight?.hit).toBe(true);
    expect(operate(o, { type: 'aim', angle: 0, power: 20 }, 2000, machines, 100).operations).toBe(
      o,
    );
    expect(tickOperations(o, 4999, 100).reward).toBe(0);
    const landed = tickOperations(o, 5000, 100);
    expect(landed.reward).toBe(300);
    expect(landed.operations.probe.sectors).toBe(1);
    expect(operationMultiplier(landed.operations)).toBe(1.04);
    expect(tickOperations(landed.operations, 6000, 100).reward).toBe(0);
    const missed = operate(createOperations(), { type: 'launch' }, 1000, machines, 100).operations;
    expect(tickOperations(missed, 5000, 100).operations.probe.sectors).toBe(0);
    expect(
      operate(createOperations(), { type: 'aim', angle: NaN, power: 30 }, 0, machines, 100)
        .operations.probe.angle,
    ).toBe(0);
  });
  it('keeps operations within the game clock, records income and freezes on every terminal or paused state', () => {
    let s: g.GameState = {
      ...g.createGame('stations'),
      desk: machines,
      owned: upgrades.slice(0, 25).map((u) => u.id),
    };
    s = g.operateStation(s, { type: 'brew-start' });
    s = g.tick(s, 2000);
    s = g.operateStation(s, { type: 'brew-release' });
    expect(s.boostUntil).toBe(s.elapsedMs + 15000);
    for (const status of ['paused', 'confirming', 'summary'] as const) {
      const frozen = { ...s, status };
      expect(g.operateStation(frozen, { type: 'launch' })).toBe(frozen);
      expect(g.tick(frozen, 5000)).toBe(frozen);
    }
    expect(g.createGame('restart').operations.probe.sectors).toBe(0);
  });
  it('counts the number of automated rejections generated by automation', () => {
    const base = {
      ...g.createGame('scale'),
      owned: upgrades.slice(0, 32).map((u) => u.id),
      nextAppealAt: Infinity,
      nextEventAt: Infinity,
    };
    const next = g.tick(base, 1000);
    expect(next.automaticRejects).toBe(4);
    expect(next.income.automatic).toBe(48);
    expect(next.manualRejects).toBe(0);
  });
});
