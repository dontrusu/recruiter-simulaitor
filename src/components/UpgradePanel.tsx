import { useState } from 'react';
import { DeskShop } from './DeskShop';
import { Icon } from './Icon';
import { useGame } from '../store';
import { has, offers, breakReady, corporateReady } from '../game/engine';
import { config, upgrades, type Upgrade } from '../game/config';
import { fmt } from './format';
export function UpgradePanel({ onPurchase }: { onPurchase: (upgrade: Upgrade) => void }) {
  const [tab, setTab] = useState<'workflow' | 'desk'>('workflow');
  const game = useGame((s) => s.game);
  const actions = useGame.getState();
  const available = offers(game);
  const final = has(game, 'U33');
  return (
    <aside className="right-panel" aria-label="Investments">
      <div className="shop-heading">
        <span className="eyebrow">BUILD SOMETHING BIGGER</span>
        <h2>Next investment</h2>
      </div>
      <div className="shop-tabs" aria-label="Upgrade categories">
        <button aria-pressed={tab === 'workflow'} onClick={() => setTab('workflow')}>
          Systems
        </button>
        <button aria-pressed={tab === 'desk'} onClick={() => setTab('desk')}>
          <Icon name="coffee" /> Workshop {game.owned.length > 0 && !game.desk.printer && <i />}
        </button>
      </div>
      {tab === 'workflow' && game.owned.length >= 1 && !game.desk.printer && (
        <button className="workshop-nudge" onClick={() => setTab('desk')}>
          <Icon name="printer" />
          <span>
            Build your first conveyor<small>A playable production line · 8 EC</small>
          </span>
          ↗
        </button>
      )}
      {tab === 'desk' ? (
        <DeskShop />
      ) : (
        <>
          <div className="right-heading">
            <span className="section-label">SYSTEM UPGRADES</span>
            <span>
              {game.owned.length}/{upgrades.length}
            </span>
          </div>
          <div className="offer-list">
            {available.map((u) => (
              <article className="offer" key={u.id}>
                <div className="offer-top">
                  <span className="offer-icon">
                    <Icon name={u.id} />
                  </span>
                  <small>ONE-TIME · {u.id}</small>
                </div>
                <h3>{u.name}</h3>
                <p>{u.description}</p>
                {game.credits < u.cost && (
                  <div className="purchase-progress">
                    <i style={{ width: `${Math.min(100, (game.credits / u.cost) * 100)}%` }} />
                    <small>{fmt(u.cost - game.credits)} EC to unlock</small>
                  </div>
                )}
                <button
                  disabled={game.credits < u.cost || game.status !== 'running'}
                  onClick={() => onPurchase(u)}
                >
                  Install · {fmt(u.cost)} EC
                </button>
              </article>
            ))}
            {!available.length && (
              <p className="empty-work">Every system installed. What is left for you?</p>
            )}
          </div>
        </>
      )}
      {final && (
        <div className="protocol-box">
          <div className="section-label">FINAL PROTOCOL</div>
          <strong>Handover {game.protocolStep}/3</strong>
          <p>
            {game.protocolStep < 3
              ? 'Complete the required tasks as they arrive.'
              : game.elapsedMs - game.finalStartedAt < config.protocolDurationMs
                ? `Observation period: ${Math.ceil((config.protocolDurationMs - game.elapsedMs + game.finalStartedAt) / 1000)}s. You can take a break now.`
                : 'Handover complete. Choose how this ends.'}
          </p>
          <button
            disabled={!breakReady(game) || game.status !== 'running'}
            onClick={() => actions.begin('break')}
          >
            Take a Break {!breakReady(game) && <small>· complete a handover or install U34</small>}
          </button>
          <button
            disabled={!corporateReady(game) || game.status !== 'running'}
            onClick={() => actions.begin('corporate')}
          >
            Enable Autonomous Talent Optimization <small>· {fmt(config.e01Cost)} EC</small>
          </button>
        </div>
      )}
      <div className="activity">
        <div className="section-label">ACTIVITY</div>
        {game.log.slice(0, 3).map((entry, index) => (
          <p key={`${index}-${entry}`}>{entry}</p>
        ))}
      </div>
    </aside>
  );
}
