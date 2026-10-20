import { useEffect, useRef, useState } from 'react';
import { useGame } from '../store';
import { deskIncomeRate, has } from '../game/engine';
import type { Station } from '../game/operations';
import { StationGame } from './StationGames';
import { Icon, machineIcon } from './Icon';
import { Cat } from './Cat';

const stations: { id: Station; name: string; verb: string }[] = [
  { id: 'printer', name: 'Dispatch line', verb: 'Sort & swipe' },
  { id: 'coffee', name: 'Coffee reactor', verb: 'Hold & release' },
  { id: 'garden', name: 'Branch network', verb: 'Rotate & connect' },
  { id: 'server', name: 'Recruitment probes', verb: 'Aim & launch' },
];
export function WorldStage() {
  const game = useGame((s) => s.game);
  const available = stations.filter((station) => game.desk[station.id]);
  const [selected, setSelected] = useState<Station>('printer');
  const installed = useRef<Station[]>([]);
  const signature = available.map((s) => s.id).join(',');
  useEffect(() => {
    const added = available.filter((s) => !installed.current.includes(s.id));
    if (added.length) setSelected(added[added.length - 1].id);
    installed.current = available.map((s) => s.id);
  }, [signature]);
  const active = available.find((s) => s.id === selected) ?? available[0];
  const feedback = game.operations.feedback;
  const freshFeedback =
    feedback && feedback.station === active?.id && game.elapsedMs - feedback.at < 7000;
  const gift = game.events.find((e) => e.source === 'U17');
  return (
    <section
      className={`world-stage station-${active ?? 'idle'}`}
      aria-label="Operations playground"
    >
      <div className="world-stage-top">
        <span>
          <i /> LIVE · OPERATIONS
        </span>
        <b>
          +{deskIncomeRate(game).toFixed(1)} EC/s <small>from your machines</small>
        </b>
      </div>
      {available.length > 0 && (
        <nav className="station-tabs" aria-label="Playable stations">
          {available.map((station) => (
            <button
              key={station.id}
              aria-pressed={active?.id === station.id}
              onClick={() => setSelected(station.id)}
            >
              <Icon name={machineIcon(station.id)} />
              <span>
                {station.name}
                <small>{station.verb}</small>
              </span>
              <b>Lv {game.desk[station.id]}</b>
            </button>
          ))}
        </nav>
      )}
      <div className="world-stage-content">
        {active ? (
          <StationGame key={active.id} station={active.id} />
        ) : (
          <div className="world-empty">
            <span className="eyebrow">YOUR NEXT BIG THING</span>
            <h3>A machine of your own.</h3>
            <p>
              Install a dispatch conveyor from the Workshop to start your first playable production
              line.
            </p>
          </div>
        )}
      </div>
      <div
        className={`station-feedback ${freshFeedback ? (feedback.success ? 'feedback-success' : 'feedback-miss') : ''} ${freshFeedback && feedback.success ? 'feedback-burst' : ''}`}
        role="status"
        key={freshFeedback ? feedback.id : 'idle'}
      >
        {freshFeedback ? (
          <>
            <Icon name={feedback.success ? 'capacitor' : 'coffee'} />
            <span>{feedback.message}</span>
            {feedback.reward > 0 && <b>+{feedback.reward} EC</b>}
          </>
        ) : (
          <>
            <i className="idle-light" />
            <span>
              Your machines keep earning while you play. Good decisions make them stronger.
            </span>
          </>
        )}
      </div>
      {has(game, 'U17') && (
        <div className="world-cat-lane">
          <div
            className="desktop-pet roaming-cat"
            aria-label="Desk companion walking along the shelf"
          >
            <span className="cat-direction">
              <Cat />
            </span>
          </div>
          {gift && (
            <button
              className="cat-gift"
              aria-label={`Collect cat gift: ${gift.reward} Credits`}
              onClick={() => useGame.getState().resolve(gift.id, 0)}
            >
              <Icon name="cat" />
              Found something for you · +{gift.reward}
            </button>
          )}
          <span className="cat-caption">
            Head of doing absolutely nothing.
          </span>
        </div>
      )}
    </section>
  );
}
