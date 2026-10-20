import { describe, it, expect } from 'vitest';
import * as g from './engine';
import { config, type UpgradeId } from './config';
import { candidateFor } from './content';
function buyTo(stop: UpgradeId = 'U35') {
  let s = g.createGame('test');
  for (let i = 0; i < 35; i++) {
    const u = g.offers(s)[0];
    if (!u) break;
    s = g.purchase({ ...s, credits: u.cost }, u.id);
    if (u.id === stop) break;
  }
  return s;
}
function clear(s: g.GameState) {
  for (const e of [...s.events])
    if (e.template !== 'sprint') s = g.resolveEvent(s, e.id, e.best ?? 0);
  return s;
}
function finishProtocol(s: g.GameState) {
  for (let i = 0; i < 120 && s.protocolStep < 3; i++) {
    s = clear(g.tick(s, 1000));
    if (s.events.some((e) => e.protocol && e.template === 'sprint')) s = g.reject(s);
  }
  return s;
}
describe('canonical game transitions', () => {
  it('starts with one offer and no persisted gameplay', () => {
    const s = g.createGame('seed');
    expect(g.offers(s).map((u) => u.id)).toEqual(['U01']);
    expect(s.credits).toBe(0);
    expect(s.candidate).toEqual(g.createGame('seed').candidate);
    expect(g.createGame().seed).not.toBe(g.createGame().seed);
  });
  it('keeps the current candidate unchanged when tools are purchased', () => {
    const s = g.createGame('stable');
    expect(g.purchase({ ...s, credits: 3 }, 'U01').candidate).toBe(s.candidate);
  });
  it('pays rejection, applies streak tiers and records source totals', () => {
    let s = buyTo('U03');
    s = clear(s);
    for (let i = 0; i < 10; i++) s = g.reject(s);
    expect(s.manualRejects).toBe(10);
    expect(g.multiplier(s)).toBe(1.25);
    expect(s.income.manual).toBeGreaterThan(0);
    expect(s.maxStreak).toBe(10);
  });
  it('permits every regular upgrade through valid offers exactly once', () => {
    let s = g.createGame('catalogue');
    for (let i = 0; i < 35; i++) {
      expect(g.offers(s).length).toBeGreaterThan(0);
      expect(g.offers(s).length).toBeLessThanOrEqual(3);
      const u = g.offers(s)[0];
      expect(g.purchase(s, u.id)).toBe(s);
      s = g.purchase({ ...s, credits: u.cost }, u.id);
      expect(g.purchase(s, u.id)).toBe(s);
      if (i === 32) expect(u.id).toBe('U33');
    }
    expect(s.owned).toHaveLength(35);
    expect(g.offers(s)).toEqual([]);
  });
  it('rejects out-of-order purchases and invalid event choices', () => {
    const s = g.createGame('invalid');
    expect(g.purchase({ ...s, credits: 1e6 }, 'U35').owned).toEqual([]);
    const e = g.triggerEvent(s, 'choice');
    expect(g.resolveEvent(e, e.events[0].id, NaN)).toBe(e);
    expect(g.resolveEvent(e, e.events[0].id, 0.5)).toBe(e);
  });
  it('interviews reset the streak, pay later, and never reduce Load', () => {
    let s = clear(buyTo('U12'));
    s = { ...s, candidate: { ...s.candidate, interviewEligible: true }, rejectionStreak: 30 };
    const before = s.credits;
    const load = g.load(s);
    s = g.interview(s);
    expect(s.credits).toBe(before);
    expect(s.rejectionStreak).toBe(0);
    expect(g.load(s)).toBe(load);
    for (let i = 0; i < 4; i++) s = g.reject(s);
    expect(s.interviewCallbacks).toHaveLength(0);
    expect(s.interviews).toBe(1);
    expect(s.prevention).toBe(1);
  });
  it('uses one eligibility rule for interviews and confirmations', () => {
    const base = g.createGame('eligibility');
    const withoutCalendar = {
      ...base,
      candidate: { ...base.candidate, interviewEligible: true },
    };
    expect(g.candidateDecisionAvailable(withoutCalendar, 'interview')).toBe(false);
    const ready = { ...withoutCalendar, owned: ['U12'] as UpgradeId[] };
    expect(g.candidateDecisionAvailable(ready, 'interview')).toBe(true);
    const confirming = g.beginConfirmation(ready, 'interview');
    expect(confirming.status).toBe('confirming');
    expect(g.candidateDecisionAvailable(confirming, 'interview')).toBe(false);
    expect(g.interview(confirming)).toBe(confirming);
  });
  it('applies interview story flags before selecting the next candidate', () => {
    const base = g.createGame('interview-story');
    const s: g.GameState = {
      ...base,
      owned: ['U12'],
      candidate: {
        ...base.candidate,
        special: true,
        specialId: 'authored-review',
        interviewEligible: true,
        options: [
          {
            id: 'interview',
            label: 'Schedule interview',
            decision: 'interview',
            followUp: 'Interview recorded.',
            flags: ['interview-recorded'],
          },
        ],
      },
    };
    const next = g.confirm(g.beginConfirmation(s, 'interview'));
    expect(next.flags).toContain('interview-recorded');
    expect(next.candidateIndex).toBe(s.candidateIndex + 1);
    expect(next.candidate).toEqual(
      candidateFor(next.seed, next.candidateIndex, next.owned, next.usedSpecials, next.flags),
    );
    expect(next.log[0]).toBe('Interview recorded.');
  });
  it('blocks throughput and candidate decisions with one untimed exception', () => {
    let s = clear(buyTo('U21'));
    s = g.triggerEvent(s, 'exception');
    s = g.triggerEvent(s, 'exception');
    expect(s.events.filter((e) => e.blocking)).toHaveLength(1);
    expect(g.reject(s)).toBe(s);
    s = g.tick(s, 5000);
    expect(s.automaticRejects).toBe(0);
    s = clear(s);
    s = g.tick(s, 1000);
    expect(s.automaticRejects).toBeGreaterThan(0);
    expect(s.rejectionStreak).toBe(0);
  });
  it('resolves sprint progress through manual decisions, never automation', () => {
    let s = clear(buyTo('U21'));
    s = { ...s, events: [] };
    s = g.triggerEvent(s, 'sprint');
    const e = s.events[0];
    s = g.tick(s, 1000);
    expect(s.events[0].progress).toBe(0);
    for (let i = 0; i < e.target!; i++) s = g.reject(s);
    expect(s.events.some((v) => v.id === e.id)).toBe(false);
  });
  it('prioritizes mandatory handover when optional slots are full', () => {
    let s = buyTo('U33');
    s = { ...s, events: [], protocolStep: 2 };
    s = g.triggerEvent(s, 'choice');
    s = g.triggerEvent(s, 'interrupt');
    s = g.triggerEvent(s, 'sprint');
    s = g.triggerEvent(s, 'sprint', true);
    expect(s.events.filter((e) => !e.blocking)).toHaveLength(3);
    expect(s.events.some((e) => e.protocol)).toBe(true);
  });
  it('caps concurrency and prevents duplicate sources', () => {
    let s = buyTo('U33');
    s = { ...s, events: [] };
    for (let i = 0; i < 20; i++) s = g.triggerEvent(s, i % 2 ? 'choice' : 'interrupt');
    expect(s.events.length).toBeLessThanOrEqual(3);
  });
  it('activates break after either certification or the first handover', () => {
    let s = buyTo('U33');
    expect(g.breakReady(s)).toBe(false);
    s = clear(g.tick(s, 3000));
    expect(s.protocolStep).toBe(1);
    expect(g.breakReady(s)).toBe(true);
    const certified = buyTo('U34');
    expect(certified.protocolStep).toBe(0);
    expect(g.breakReady(certified)).toBe(true);
  });
  it('pauses clock in a confirmation and freezes every ending atomically', () => {
    let s = buyTo('U34');
    s = g.beginConfirmation(s, 'break');
    expect(g.tick(s, 90000)).toBe(s);
    expect(g.reject(s)).toBe(s);
    s = g.confirm(s);
    expect(s.ending).toBe('break');
    expect(g.tick(s, 90000)).toBe(s);
    expect(g.commitEnding(s, 'corporate')).toBe(s);
    expect(g.purchase(s, 'U35')).toBe(s);
  });
  it('requires the full catalogue, protocol, credits and confirmation for E01', () => {
    let s = buyTo();
    expect(g.corporateReady(s)).toBe(false);
    s = finishProtocol(s);
    expect(s.protocolStep).toBe(3);
    s = clear(g.tick(s, Math.max(0, config.protocolDurationMs - (s.elapsedMs - s.finalStartedAt))));
    s = { ...s, credits: config.e01Cost };
    expect(g.corporateReady(s)).toBe(true);
    const before = s.spent;
    s = g.confirm(g.beginConfirmation(s, 'corporate'));
    expect(s.ending).toBe('corporate');
    expect(s.credits).toBe(0);
    expect(s.spent).toBe(before + 8000);
  });
  it('warns at 80, 90 and 96 then burns out at 100 only after U33', () => {
    const early = g.tick(g.createGame('safe'), 1000000);
    expect(early.ending).toBeNull();
    let s = buyTo('U33');
    s = g.tick(s, 240000);
    expect(s.ending).toBe('burnout');
    expect(s.warningsSeen).toEqual([80, 90, 96]);
    expect(g.load(s)).toBe(100);
  });
  it('uses active time only and ignores invalid deltas', () => {
    let s = buyTo('U21');
    s = g.pause(s);
    expect(g.tick(s, 120000)).toBe(s);
    s = g.resume(s);
    expect(g.tick(s, NaN)).toBe(s);
    expect(g.tick(s, Infinity)).toBe(s);
    expect(g.tick(s, -1)).toBe(s);
    expect(g.tick(s, 1000).elapsedMs).toBe(s.elapsedMs + 1000);
  });
  it('resolves evidence choices for a larger reward and stores the next decision bonus', () => {
    let s = g.triggerEvent(g.createGame('choice'), 'choice');
    const e = s.events[0];
    const good = g.resolveEvent(s, e.id, e.best!);
    const poor = g.resolveEvent(s, e.id, e.best === 0 ? 1 : 0);
    expect(good.credits).toBeGreaterThan(poor.credits);
    expect(good.decisionBonus).toBeGreaterThan(0);
    expect(g.reject(good).decisionBonus).toBe(0);
  });
  it('restarts with clean counters, flags, events and candidate identity', () => {
    const old = buyTo();
    const s = g.createGame('new');
    expect(s.owned).toEqual([]);
    expect(s.events).toEqual([]);
    expect(s.flags).toEqual([]);
    expect(s.seed).not.toBe(old.seed);
    expect(s.earned).toBe(0);
  });
  it('special options have code-owned effects and visible follow-up', () => {
    let s = clear(buyTo('U12'));
    for (let i = 0; i < 8 && !s.candidate.options; i++) s = g.reject(s);
    expect(s.candidate.options).toBeDefined();
    const option = s.candidate.options!.find((o) => o.decision !== 'interview')!;
    const next = g.specialDecision(s, option.id);
    expect(next.candidateIndex).toBe(s.candidateIndex + 1);
    expect(next.log[0]).toBe(option.followUp);
  });
  it('records a selected special rejection once', () => {
    const base = g.createGame('special-rejection');
    const s: g.GameState = {
      ...base,
      candidate: {
        ...base.candidate,
        options: [
          {
            id: 'reject',
            label: 'Reject candidate',
            decision: 'reject',
            followUp: 'Special rejection recorded.',
            flags: ['special-rejected'],
          },
        ],
      },
    };
    const next = g.specialDecision(s, 'reject');
    expect(next.flags).toEqual(['special-rejected']);
    expect(next.log.filter((entry) => entry === 'Special rejection recorded.')).toHaveLength(1);
  });
  it('agrees across scheduler chunk sizes', () => {
    const s = clear(buyTo('U21'));
    const whole = g.tick(s, 10000);
    let split = s;
    for (let i = 0; i < 10; i++) split = g.tick(split, 1000);
    expect(whole).toEqual(split);
  });
});
