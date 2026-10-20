import { useEffect, useRef, useState } from 'react';
import { useGame, devMode, type DevAction } from './store';
import { config, type Upgrade } from './game/config';
import { has } from './game/engine';
import { CandidateReview } from './components/CandidateReview';
import { WorldStage } from './components/WorldStage';
import { RequestInbox } from './components/RequestInbox';
import { UpgradePanel } from './components/UpgradePanel';
import { SessionDialogs } from './components/SessionDialogs';
import { GameHeader } from './components/GameHeader';
import { Icon } from './components/Icon';
import { clock, compact } from './components/format';

function DevPanel() {
  const dev = useGame((s) => s.dev);
  const actions = [
    'credits',
    'next',
    'automation',
    'final',
    'load:79',
    'load:89',
    'load:95',
    'event:choice',
    'event:interrupt',
    'event:sprint',
    'event:exception',
    'break',
    'burnout',
    'corporate',
  ] as const satisfies readonly DevAction[];
  return (
    <details className="dev-panel">
      <summary>Developer controls</summary>
      <div>
        {actions.map((action) => (
          <button key={action} onClick={() => dev(action)}>
            {action}
          </button>
        ))}
      </div>
      <small>Development preview only · every new session starts at one desk.</small>
    </details>
  );
}
export function App() {
  const game = useGame((s) => s.game);
  const actions = useGame.getState();
  const last = useRef(performance.now());
  const timer = useRef<number | undefined>(undefined);
  const [installed, setInstalled] = useState<Upgrade | null>(null);
  const blocking = game.events.some((e) => e.blocking);
  useEffect(() => {
    const interval = window.setInterval(() => {
      const now = performance.now();
      const delta = Math.min(1000, now - last.current);
      last.current = now;
      if (!document.hidden) useGame.getState().tick(delta);
    }, config.tickMs);
    const visibility = () => {
      last.current = performance.now();
      if (document.hidden) useGame.getState().pause();
      else useGame.getState().resume();
    };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  function purchase(upgrade: Upgrade) {
    if (actions.purchase(upgrade.id).activity?.kind !== 'purchase') return;
    setInstalled(upgrade);
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setInstalled(null), 2200);
  }
  function openRequests() {
    document
      .getElementById(blocking ? 'human-review' : 'requests')
      ?.scrollIntoView({ block: 'start' });
  }
  return (
    <div
      className="game-world world-expanded"
      data-paused={game.status !== 'running'}
    >
      <GameHeader />
      <div className="game-shell">
        <section className="chapter-heading" key={game.seed}>
          <div>
            <span className="eyebrow">01 / A NORMAL WORKING DAY</span>
            <h1>Just a few résumés.</h1>
            <p>A quiet morning. Three applications. How complicated could this get?</p>
          </div>
          <div className="chapter-progress">
            <span>Complete the handover</span>
            <div>
              <i
                style={{
                  width: `${Math.min(100, (game.owned.length / 35) * 100)}%`,
                }}
              />
            </div>
            <small>
              {game.owned.length}/35 systems · <span className="session-clock">{clock(game.elapsedMs)}</span>
            </small>
          </div>
        </section>
        {blocking && (
          <button className="human-alert" onClick={openRequests}>
            <Icon name="shield" />
            <span>
              One case needs a human decision.
              <small>Candidate automation is waiting. Your machines keep earning.</small>
            </span>
            <b>Review appeal ↓</b>
          </button>
        )}
        <div className="game-board">
          <main className="play-column">
            <WorldStage />
            <div className="review-and-requests" id="human-review">
              <CandidateReview />
              <RequestInbox />
            </div>
            <div className="run-ledger">
              <span>{game.manualRejects} human reviews</span>
              {has(game, 'U03') && (
                <span className="streak-ledger">{game.rejectionStreak} rejection streak</span>
              )}
              {game.automaticRejects > 0 && (
                <span>
                  {compact(game.automaticRejects)} automated applications
                </span>
              )}
              {game.events.length > 0 && (
                <button onClick={openRequests}>{game.events.length} requests ↓</button>
              )}
            </div>
          </main>
          <UpgradePanel onPurchase={purchase} />
        </div>
        <footer className="world-footer">
          <span>
            Every improvement is a small step towards something unreasonable.
          </span>
          <span>Talent.OS / 01</span>
        </footer>
      </div>
      {installed && game.status !== 'summary' && (
        <div className="system-installed" role="status" key={installed.id}>
          <Icon name={installed.id} />
          <span>
            <small>INSTALLED</small>
            {installed.name}
          </span>
        </div>
      )}
      <SessionDialogs />
      {devMode && <DevPanel />}
    </div>
  );
}
