import * as engine from './game/engine';
import type { UpgradeId } from './game/config';

export type FeedbackAction =
  | { kind: 'reject' }
  | { kind: 'purchase'; id: UpgradeId }
  | { kind: 'resolve'; id: number; choice: number }
  | { kind: 'tick'; ms: number }
  | { kind: 'confirm' };

export type Activity =
  | { kind: 'reject'; name: string; role: string; reward: number }
  | { kind: 'purchase'; id: UpgradeId }
  | { kind: 'resolve' }
  | null;

export type Notice =
  { kind: 'ending'; ending: engine.Ending } | { kind: 'warning'; levels: number[] } | null;

export type ActionOutcome = {
  game: engine.GameState;
  activity: Activity;
  notice: Notice;
};

export type FeedbackCue = 'reject' | 'purchase' | 'resolve' | 'warning' | 'ending' | null;

export function feedbackCue(outcome: ActionOutcome): FeedbackCue {
  if (outcome.notice?.kind === 'ending') return 'ending';
  if (outcome.notice?.kind === 'warning') return 'warning';
  return outcome.activity?.kind ?? null;
}

export function applyFeedbackAction(
  before: engine.GameState,
  action: FeedbackAction,
): ActionOutcome {
  let game: engine.GameState;
  switch (action.kind) {
    case 'reject':
      game = engine.reject(before);
      break;
    case 'purchase':
      game = engine.purchase(before, action.id);
      break;
    case 'resolve':
      game = engine.resolveEvent(before, action.id, action.choice);
      break;
    case 'tick':
      game = engine.tick(before, action.ms);
      break;
    case 'confirm':
      game = engine.confirm(before);
      break;
  }

  if (game === before) return { game, activity: null, notice: null };

  const notice: Notice =
    game.ending && !before.ending
      ? { kind: 'ending', ending: game.ending }
      : game.warningsSeen.length > before.warningsSeen.length
        ? {
            kind: 'warning',
            levels: game.warningsSeen.filter((level) => !before.warningsSeen.includes(level)),
          }
        : null;

  // A terminal transition goes straight to its ending; no action animation survives it.
  if (notice?.kind === 'ending') return { game, activity: null, notice };

  const activity: Activity =
    action.kind === 'reject'
      ? {
          kind: 'reject',
          name: before.candidate.name,
          role: before.candidate.role,
          reward: game.income.manual - before.income.manual,
        }
      : action.kind === 'purchase'
        ? { kind: 'purchase', id: action.id }
        : action.kind === 'resolve'
          ? { kind: 'resolve' }
          : null;

  return { game, activity, notice };
}
