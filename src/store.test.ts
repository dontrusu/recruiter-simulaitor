import { expect, it, vi } from 'vitest';
import { createGame, type GameState } from './game/engine';

vi.mock('./audio', () => ({ play: vi.fn(), suspendAudio: vi.fn() }));

it('plays the ending cue when a rejection causes burnout', async () => {
  vi.stubGlobal('location', { search: '' });
  const { play } = await import('./audio');
  const { useGame } = await import('./store');
  const game: GameState = {
    ...createGame('burnout-store'),
    owned: ['U33'],
    latePressure: 27.9,
  };
  useGame.setState({ game, muted: false });

  const outcome = useGame.getState().reject();

  expect(outcome.game.ending).toBe('burnout');
  expect(play).toHaveBeenCalledExactlyOnceWith('ending', false);
  vi.unstubAllGlobals();
});
