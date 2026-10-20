import type { OperationAction } from './game/operations';
import type { DeskId } from './game/desk';
import { create } from 'zustand';
import * as engine from './game/engine';
import { upgrades, type UpgradeId } from './game/config';
import { play, suspendAudio } from './audio';
import {
  applyFeedbackAction,
  feedbackCue,
  type ActionOutcome,
  type FeedbackAction,
} from './action-outcome';

const query = new URLSearchParams(location.search);
export const devMode = import.meta.env.DEV && query.get('dev') === '1';
const initialSeed = devMode ? (query.get('seed') ?? undefined) : undefined;
export type DevAction =
  | 'credits'
  | 'next'
  | 'automation'
  | 'final'
  | 'break'
  | 'burnout'
  | 'corporate'
  | 'department'
  | 'planet'
  | 'orbit'
  | 'cosmos'
  | `load:${number}`
  | `event:${engine.EventTemplate}`;

function eventTemplateForAction(action: DevAction): engine.EventTemplate | null {
  switch (action) {
    case 'event:choice':
      return 'choice';
    case 'event:interrupt':
      return 'interrupt';
    case 'event:sprint':
      return 'sprint';
    case 'event:exception':
      return 'exception';
    default:
      return null;
  }
}

type Store = {
  game: engine.GameState;
  muted: boolean;
  buyDesk: (id: DeskId) => void;
  operate: (action: OperationAction) => void;
  special: (id: string) => void;
  reject: () => ActionOutcome;
  interview: () => void;
  purchase: (id: UpgradeId) => ActionOutcome;
  resolve: (id: number, choice: number) => ActionOutcome;
  tick: (ms: number) => ActionOutcome;
  pause: () => void;
  resume: () => void;
  begin: (kind: 'interview' | 'break' | 'corporate') => void;
  cancel: () => void;
  confirm: () => ActionOutcome;
  restart: () => void;
  toggleMute: () => void;
  dev: (action: DevAction) => void;
};
function readMute() {
  try {
    return localStorage.getItem('talent-os-muted') === '1';
  } catch {
    return false;
  }
}
export const useGame = create<Store>((set, get) => {
  const dispatch = (action: FeedbackAction): ActionOutcome => {
    const current = get();
    const outcome = applyFeedbackAction(current.game, action);
    if (outcome.game !== current.game) {
      const cue = feedbackCue(outcome);
      if (cue) play(cue, current.muted);
      set({ game: outcome.game });
    }
    return outcome;
  };
  return {
    game: engine.createGame(initialSeed),
    muted: readMute(),
    buyDesk: (id) => {
      const current = get();
      const game = engine.buyDesk(current.game, id);
      if (game !== current.game) {
        play('purchase', current.muted);
        set({ game });
      }
    },
    operate: (action) => {
      const current = get();
      const game = engine.operateStation(current.game, action);
      if (game === current.game) return;
      if (game.operations.feedback !== current.game.operations.feedback)
        play(game.operations.feedback?.success ? 'resolve' : 'warning', current.muted);
      else if (action.type === 'launch') play('purchase', current.muted);
      set({ game });
    },
    special: (id) => set((s) => ({ game: engine.specialDecision(s.game, id) })),
    reject: () => dispatch({ kind: 'reject' }),
    interview: () => set((s) => ({ game: engine.interview(s.game) })),
    purchase: (id) => dispatch({ kind: 'purchase', id }),
    resolve: (id, choice) => dispatch({ kind: 'resolve', id, choice }),
    tick: (ms) => dispatch({ kind: 'tick', ms }),
    pause: () => {
      suspendAudio();
      set((s) => ({ game: engine.pause(s.game) }));
    },
    resume: () => set((s) => ({ game: engine.resume(s.game) })),
    begin: (kind) => set((s) => ({ game: engine.beginConfirmation(s.game, kind) })),
    cancel: () => set((s) => ({ game: engine.cancelConfirmation(s.game) })),
    confirm: () => dispatch({ kind: 'confirm' }),
    restart: () => set({ game: engine.createGame(devMode ? initialSeed : undefined) }),
    toggleMute: () => {
      const muted = !get().muted;
      if (muted) suspendAudio();
      try {
        localStorage.setItem('talent-os-muted', muted ? '1' : '0');
      } catch {}
      set({ muted });
    },
    dev: (action) => {
      if (!devMode) return;
      set((s) => {
        let game = s.game;
        if (game.status !== 'running') return {};
        if (action === 'credits')
          game = { ...game, credits: game.credits + 2500, earned: game.earned + 2500 };
        if (action === 'next') {
          const next = engine.offers(game)[0];
          if (next)
            game = engine.purchase(
              { ...game, credits: Math.max(game.credits, next.cost) },
              next.id,
            );
        }
        if (action === 'automation' || action === 'final') {
          const target = action === 'automation' ? 'U21' : 'U33';
          for (const u of upgrades) {
            if (game.owned.includes(target)) break;
            if (game.owned.includes(u.id)) continue;
            game = engine.purchase({ ...game, credits: Math.max(game.credits, u.cost) }, u.id);
          }
        }
        if (action.startsWith('load:'))
          game = { ...game, latePressure: Math.max(0, Number(action.slice(5)) - 72) };
        const eventTemplate = eventTemplateForAction(action);
        if (eventTemplate) game = engine.triggerEvent(game, eventTemplate);
        if (action === 'break') {
          game = {
            ...game,
            owned: [...new Set([...game.owned, 'U33', 'U34'])] as UpgradeId[],
            protocolStep: 1,
          };
          game = engine.commitEnding(game, 'break');
        }
        if (action === 'burnout') {
          game = {
            ...game,
            owned: [...new Set([...game.owned, 'U33'])] as UpgradeId[],
            latePressure: 28,
          };
          game = engine.commitEnding(game, 'burnout');
        }
        if (action === 'corporate') {
          game = { ...game, owned: upgrades.map((u) => u.id), protocolStep: 3 };
          game = engine.commitEnding(game, 'corporate');
        }
        return { game };
      });
    },
  };
});

// Development-only bridge keeps browser fixtures attached to the mounted store through HMR.
if (devMode) Object.assign(window, { __talentStore: useGame });
