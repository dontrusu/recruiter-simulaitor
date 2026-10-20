import { useGame } from '../store';
import { breakReady, load, passiveRate } from '../game/engine';
import { Icon } from './Icon';
import { fmt } from './format';

export function GameHeader() {
  const game = useGame((s) => s.game);
  const muted = useGame((s) => s.muted);
  const begin = useGame((s) => s.begin);
  const toggleMute = useGame((s) => s.toggleMute);
  const currentLoad = load(game);

  return (
    <header className="game-header">
      <a
        href="#"
        className="game-brand"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0 });
        }}
      >
        <Icon name="scan" />
        <span>
          Talent<span className="brand-dot">.</span>OS
          <small>a very normal working day</small>
          {game.owned.length > 0 && (
            <small className={`mobile-pressure ${currentLoad >= 80 ? 'is-danger' : ''}`}>
              System load {currentLoad}%
            </small>
          )}
        </span>
      </a>
      <div className="game-hud">
        <div className="hud-income">
          <span>PRODUCTION</span>
          <strong>
            +{passiveRate(game).toFixed(1)}
            <small> EC/s</small>
          </strong>
        </div>
        <div className="hud-wallet">
          <span>AVAILABLE</span>
          <strong>
            {fmt(game.credits)}
            <small> EC</small>
          </strong>
        </div>
        {game.owned.length > 0 && (
          <div className={`hud-load ${currentLoad >= 80 ? 'is-danger' : ''}`}>
            <span>SYSTEM LOAD</span>
            <strong>{currentLoad}%</strong>
            <i style={{ width: `${currentLoad}%` }} />
          </div>
        )}
        {breakReady(game) && (
          <button
            className="quick-break"
            aria-label="Open break confirmation"
            onClick={() => begin('break')}
          >
            Take a break ↗
          </button>
        )}
        <button
          className="sound-control"
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          onClick={toggleMute}
        >
          <Icon name="music" />
          <span>{muted ? 'Off' : 'On'}</span>
        </button>
      </div>
    </header>
  );
}
