import { useEffect } from 'react';
import { endingScenes } from '../content/ending-scenes';
import { useGame } from '../store';
import { load } from '../game/engine';
import { config } from '../game/config';
import { endingCopy } from '../content/events';
import { Dialog } from './Dialog';
import { fmt, clock } from './format';
export function SessionDialogs() {
  const game = useGame((s) => s.game);
  const actions = useGame.getState();
  const nearEnding = game.owned.length >= 28;
  useEffect(() => {
    if (!nearEnding) return;
    for (const scene of Object.values(endingScenes)) {
      const image = new Image();
      image.src = scene.image;
    }
  }, [nearEnding]);
  const currentLoad = load(game);
  const scene = game.ending ? endingScenes[game.ending] : null;
  return (
    <>
      {game.status === 'confirming' && (
        <Dialog label="confirm-title" onCancel={actions.cancel}>
          <div className="modal">
            <div className="section-label">CONFIRM DECISION</div>
            <h2 id="confirm-title">
              {game.confirmation === 'interview'
                ? 'Schedule this interview?'
                : game.confirmation === 'break'
                  ? 'Take a Break?'
                  : 'Enable full automation?'}
            </h2>
            <p>
              {game.confirmation === 'interview'
                ? 'This resets your rejection streak. No Credits arrive now; a delayed callback follows after four reviews.'
                : game.confirmation === 'break'
                  ? 'This ends the current session. Your workspace will finally be quiet.'
                  : `Spend ${fmt(config.e01Cost)} Credits and hand every decision to Talent.OS. Player controls will be removed.`}
            </p>
            <div className="modal-actions">
              <button onClick={actions.cancel}>Keep working</button>
              <button className="primary" onClick={actions.confirm}>
                Confirm
              </button>
            </div>
            <small className="paused-note">Active time is paused while you decide.</small>
          </div>
        </Dialog>
      )}
      {game.status === 'summary' && game.ending && scene && (
        <Dialog label="summary-title" className={`ending-${game.ending}`}>
          <div className="ending-panorama">
            <img className="ending-photo" src={scene.image} alt={scene.alt} />
            <div className="ending-photo-shade" />
            <div className="ending-scene-caption">
              <span>
                {game.ending === 'break'
                  ? 'OUT OF OFFICE'
                  : game.ending === 'burnout'
                    ? 'CONNECTION LOST'
                    : 'HUMAN INPUT: OPTIONAL'}
              </span>
              <p>{scene.caption}</p>
            </div>
            <a className="photo-credit" href={scene.source} target="_blank" rel="noreferrer">
              Photo: {scene.photographer}
            </a>
          </div>
          <div className="modal summary-modal">
            <div className="ending-symbol" aria-hidden="true">
              {game.ending === 'break' ? '☀' : game.ending === 'burnout' ? '◌' : '◈'}
            </div>
            <div className="section-label">{endingCopy[game.ending].label}</div>
            <h2 id="summary-title">{endingCopy[game.ending].title}</h2>
            <p className="ending-line">{endingCopy[game.ending].line}</p>
            <p>{endingCopy[game.ending].detail}</p>
            <div className="ending-income">
              {game.earned
                ? Math.round(((game.income.passive + game.income.automatic) / game.earned) * 100)
                : 0}
              % of your Credits arrived while your systems worked.
            </div>
            <div className="summary-stats">
              <span>
                <b>{clock(game.elapsedMs)}</b>
                <small>active time</small>
              </span>
              <span>
                <b>{fmt(game.manualRejects)}</b>
                <small>manual rejects</small>
              </span>
              <span>
                <b>{fmt(game.automaticRejects)}</b>
                <small>auto rejects</small>
              </span>
              <span>
                <b>{game.maxStreak}</b>
                <small>best streak</small>
              </span>
              <span>
                <b>{game.interviews}</b>
                <small>interviews</small>
              </span>
              <span>
                <b>{game.strongRejected}</b>
                <small>strong candidates rejected</small>
              </span>
              <span>
                <b>{fmt(game.earned)}</b>
                <small>Credits earned</small>
              </span>
              <span>
                <b>{fmt(game.spent)}</b>
                <small>Credits spent</small>
              </span>
              <span>
                <b>
                  {game.resolvedEvents}/{game.expiredEvents}
                </b>
                <small>events done / missed</small>
              </span>
              <span>
                <b>{game.owned.length}</b>
                <small>upgrades</small>
              </span>
              <span>
                <b>{currentLoad}%</b>
                <small>final Load</small>
              </span>
            </div>
            <button className="restart-button" onClick={actions.restart}>
              Start a fresh session
            </button>
            <small className="summary-footnote">
              A new desk. A new queue. Nothing carries over.
            </small>
          </div>
        </Dialog>
      )}
    </>
  );
}
