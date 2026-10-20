import { useGame } from '../store';
import { deskItems, deskCost, deskRate, deskMultiplier } from '../game/desk';
import { deskIncomeRate } from '../game/engine';
import { operationMultiplier } from '../game/operations';
import { Icon, machineIcon } from './Icon';
import { fmt } from './format';

export function DeskShop() {
  const game = useGame((s) => s.game);
  const actions = useGame.getState();
  const visible = deskItems.filter((item) => game.owned.length >= item.minOwned);
  const next = deskItems
    .filter((item) => item.minOwned > game.owned.length)
    .sort((a, b) => a.minOwned - b.minOwned)[0];
  return (
    <section className="desk-shop" aria-label="Machine workshop">
      <div className="workshop-intro">
        <span className="section-label">MACHINES YOU CAN PLAY</span>
        <strong>
          {deskIncomeRate(game).toFixed(1)} <small>EC / sec</small>
        </strong>
        <p>Each machine unlocks a different way to play. Upgrades grow its automatic income.</p>
      </div>
      {visible.map((item) => {
        const level = game.desk[item.id] ?? 0;
        const maxed = level === item.maxLevel;
        const cost = deskCost(item, level);
        const multiplier = deskMultiplier(game.desk) * operationMultiplier(game.operations);
        const gain = (deskRate(item, level + 1) - deskRate(item, level)) * multiplier;
        return (
          <article
            className={`desk-offer tone-${item.color} ${level ? 'desk-owned' : ''}`}
            key={item.id}
          >
            <div className="desk-offer-heading">
              <span className="object-icon">
                <Icon name={machineIcon(item.id)} />
              </span>
              <div>
                <small>
                  {item.maxLevel === 1
                    ? 'ONE-TIME PURCHASE'
                    : level
                      ? `LEVEL ${level} / ${item.maxLevel}`
                      : 'UPGRADEABLE PRODUCER'}
                </small>
                <h3>{item.name}</h3>
              </div>
            </div>
            <p>{item.description}</p>
            {item.rate > 0 && (
              <div className="producer-yield">
                <b>{(deskRate(item, level || 1) * multiplier).toFixed(1)} EC/s</b>
                <span>{level ? 'current output' : 'starting output'}</span>
              </div>
            )}
            {item.maxLevel > 1 && (
              <div className="level-pips" aria-label={`Level ${level} of ${item.maxLevel}`}>
                {Array.from({ length: item.maxLevel }, (_, i) => (
                  <i key={i} className={i < level ? 'filled' : ''} />
                ))}
              </div>
            )}
            <button
              aria-label={`${level ? 'Upgrade' : 'Buy'} ${item.name}`}
              disabled={maxed || game.credits < cost || game.status !== 'running'}
              onClick={() => actions.buyDesk(item.id)}
            >
              {maxed
                ? item.maxLevel === 1
                  ? 'Installed · permanent'
                  : 'Fully upgraded'
                : `${level ? 'Level up' : 'Buy'} · ${fmt(cost)} EC`}
            </button>
            {!maxed && item.rate > 0 && (
              <small className="next-yield">
                +{gain.toFixed(1)} EC/s · pays back in {Math.ceil(cost / gain)}s
              </small>
            )}
          </article>
        );
      })}
      {next && (
        <p className="workshop-unlock">
          <Icon name={machineIcon(next.id)} />
          {next.name} unlocks at {next.minOwned} system upgrades.{' '}
          {Math.max(0, next.minOwned - game.owned.length)} to go.
        </p>
      )}
    </section>
  );
}
