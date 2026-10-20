import { describe, expect, it } from 'vitest';
import * as g from './engine';
import { deskItems, deskCost, deskBaseRate } from './desk';
import { upgrades } from './config';

function ready() {
  return {
    ...g.createGame('desk'),
    credits: 100000,
    owned: upgrades.slice(0, 25).map((u) => u.id),
    nextEventAt: Infinity,
    nextAppealAt: Infinity,
  };
}
describe('desk investments', () => {
  it('requires unlocks and funds, charges the displayed cost, and caps producer levels', () => {
    const fresh = { ...g.createGame('locked'), credits: 10000 };
    expect(g.buyDesk(fresh, 'printer')).toBe(fresh);
    let s = ready();
    const item = deskItems[0];
    const workflowCount = s.owned.length;
    for (let level = 0; level < 5; level++) {
      const poor = { ...s, credits: deskCost(item, level) - 1 };
      expect(g.buyDesk(poor, 'printer')).toBe(poor);
      const next = g.buyDesk(s, 'printer');
      expect(s.credits - next.credits).toBe(deskCost(item, level));
      expect(next.spent - s.spent).toBe(deskCost(item, level));
      expect(next.desk.printer).toBe(level + 1);
      s = next;
    }
    expect(g.buyDesk(s, 'printer')).toBe(s);
    expect(s.owned.length).toBe(workflowCount);
  });
  it('pays passive income without decisions, including during an appeal', () => {
    let s = g.buyDesk(ready(), 'printer');
    s = { ...s, owned: ['U01'], events: [] };
    s = g.triggerEvent(s, 'exception');
    const next = g.tick(s, 10000);
    expect(next.income.passive).toBe(7);
    expect(next.manualRejects).toBe(0);
    expect(next.automaticRejects).toBe(0);
    expect(next.candidate).toBe(s.candidate);
  });
  it('applies a one-time dividend exactly once to current and future producers', () => {
    let s = g.buyDesk(ready(), 'printer');
    const before = deskBaseRate(s.desk);
    s = g.buyDesk(s, 'solar');
    expect(deskBaseRate(s.desk)).toBeCloseTo(before * 1.25);
    expect(g.buyDesk(s, 'solar')).toBe(s);
    s = g.buyDesk(s, 'coffee');
    expect(deskBaseRate(s.desk)).toBeCloseTo((0.7 + 2.6) * 1.25);
  });
  it('doubles desk income for the exact burst interval and enforces recharge', () => {
    const base = g.tick(
      g.operateStation(
        { ...g.buyDesk(ready(), 'coffee'), owned: [], events: [], elapsedMs: 350 },
        { type: 'brew-start' },
      ),
      2000,
    );
    const boosted = g.operateStation(base, { type: 'brew-release' });
    expect(g.operateStation(boosted, { type: 'brew-start' })).toBe(boosted);
    const normal = g.tick(base, 20000);
    const burst = g.tick(boosted, 20000);
    expect(burst.income.passive - normal.income.passive).toBeCloseTo(39, 0);
    expect(g.deskIncomeRate(burst)).toBeCloseTo(2.6);
    expect(g.operateStation(burst, { type: 'brew-start' })).toBe(burst);
    const recharged = g.tick(burst, 40000);
    expect(g.operateStation(recharged, { type: 'brew-start' }).operations.brew.startedAt).toBe(
      recharged.elapsedMs,
    );
    let split = boosted;
    for (let i = 0; i < 80; i++) split = g.tick(split, 250);
    expect(split.income.passive).toBe(burst.income.passive);
    expect(split.passiveFraction).toBeCloseTo(burst.passiveFraction);
  });
  it('extends future bursts with the capacitor and freezes all desk actions outside play', () => {
    let s = g.buyDesk(g.buyDesk(ready(), 'coffee'), 'capacitor');
    s = g.operateStation(g.tick(g.operateStation(s, { type: 'brew-start' }), 2000), {
      type: 'brew-release',
    });
    expect(s.boostUntil).toBe(s.elapsedMs + 25000);
    for (const status of ['paused', 'confirming', 'summary'] as const) {
      const stopped = { ...s, status };
      expect(g.tick(stopped, 60000)).toBe(stopped);
      expect(g.buyDesk(stopped, 'printer')).toBe(stopped);
      expect(g.operateStation(stopped, { type: 'brew-start' })).toBe(stopped);
    }
    expect(g.createGame('reset').desk).toEqual({});
    expect(g.createGame('reset').boostUntil).toBe(0);
  });
});
