import { describe, expect, it } from 'vitest';
import { applyFeedbackAction, feedbackCue } from './action-outcome';
import * as engine from './game/engine';

describe('feedback action outcomes', () => {
  it('reports the completed rejection and its actual manual reward', () => {
    const before = engine.createGame('rejection');
    const outcome = applyFeedbackAction(before, { kind: 'reject' });

    expect(outcome.activity).toEqual({
      kind: 'reject',
      name: before.candidate.name,
      role: before.candidate.role,
      reward: outcome.game.income.manual - before.income.manual,
    });
    expect(feedbackCue(outcome)).toBe('reject');
  });

  it('gives a terminal rejection only ending feedback', () => {
    const before = {
      ...engine.createGame('burnout'),
      owned: ['U33'] as engine.GameState['owned'],
      latePressure: 27.9,
    };
    const outcome = applyFeedbackAction(before, { kind: 'reject' });

    expect(outcome.game.ending).toBe('burnout');
    expect(outcome.activity).toBeNull();
    expect(outcome.notice).toEqual({ kind: 'ending', ending: 'burnout' });
    expect(feedbackCue(outcome)).toBe('ending');
    expect(feedbackCue(applyFeedbackAction(outcome.game, { kind: 'tick', ms: 250 }))).toBeNull();
  });

  it('reports a new load warning from a tick', () => {
    const before = {
      ...engine.createGame('warning'),
      owned: ['U33'] as engine.GameState['owned'],
      latePressure: 7.9,
    };
    const outcome = applyFeedbackAction(before, { kind: 'tick', ms: 1000 });

    expect(outcome.game.ending).toBeNull();
    expect(outcome.activity).toBeNull();
    expect(outcome.notice).toEqual({ kind: 'warning', levels: [80] });
    expect(feedbackCue(outcome)).toBe('warning');
  });

  it('reports accepted purchases and leaves declined actions silent', () => {
    const before = engine.createGame('purchase');
    const declined = applyFeedbackAction(before, { kind: 'purchase', id: 'U01' });
    expect(declined.game).toBe(before);
    expect(declined.activity).toBeNull();
    expect(feedbackCue(declined)).toBeNull();

    const funded = { ...before, credits: 3 };
    const bought = applyFeedbackAction(funded, { kind: 'purchase', id: 'U01' });
    expect(bought.activity).toEqual({ kind: 'purchase', id: 'U01' });
    expect(feedbackCue(bought)).toBe('purchase');
  });
});
