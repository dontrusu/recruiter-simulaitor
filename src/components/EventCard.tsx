import { config } from '../game/config';
import { memo } from 'react';
import { useGame } from '../store';
import type { Event } from '../game/engine';
export const EventCard = memo(function EventCard({ event }: { event: Event }) {
  const resolve = useGame((s) => s.resolve);
  const remaining = useGame((s) =>
    event.expiresAt === null
      ? null
      : Math.max(0, Math.ceil((event.expiresAt - s.game.elapsedMs) / 1000)),
  );
  return (
    <article
      className={`event-card ${event.blocking ? 'blocking' : ''} ${event.protocol ? 'protocol' : ''}`}
      aria-label={`${event.template} event`}
    >
      <div className="event-top">
        <span>
          {event.source} · {event.template}
        </span>
        <strong>+{event.reward} EC</strong>
      </div>
      <h3>{event.title}</h3>
      <p>{event.detail}</p>
      {event.critical && !event.protocol && (
        <p className="risk-note">
          Expiry: +{config.finalMissPenalty}% Load. A reserved waiver prevents this penalty.
        </p>
      )}
      {event.template === 'sprint' ? (
        <div className="event-progress">
          <div
            className="meter"
            role="progressbar"
            aria-label={event.title}
            aria-valuenow={event.progress ?? 0}
            aria-valuemin={0}
            aria-valuemax={event.target}
          >
            <i style={{ width: `${((event.progress ?? 0) / (event.target ?? 1)) * 100}%` }} />
          </div>
          <small>
            {event.progress}/{event.target} reviews
          </small>
        </div>
      ) : (
        <div className="event-actions">
          {event.options?.map((option, index) => (
            <button key={option} onClick={() => resolve(event.id, index)}>
              {option}
            </button>
          ))}
        </div>
      )}
      <div className="event-footer">
        {remaining !== null ? (
          <span>{remaining}s remaining</span>
        ) : (
          <span>No timer · take your time</span>
        )}
        {event.best !== undefined && <span>Evidence bonus available</span>}
      </div>
    </article>
  );
});
