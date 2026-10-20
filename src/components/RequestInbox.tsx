import { useState } from 'react';
import { useGame } from '../store';
import { EventCard } from './EventCard';
import { Icon } from './Icon';

export function RequestInbox() {
  const allEvents = useGame((s) => s.game.events);
  const events = allEvents.filter((e) => !e.blocking);
  const [open, setOpen] = useState(false);
  const mandatory = events.some((e) => e.protocol);
  if (!events.length) return null;
  return (
    <section className="request-inbox" id="requests" aria-label="Active work">
      <button
        className="inbox-toggle"
        aria-expanded={open || mandatory}
        onClick={() => setOpen(!open)}
      >
        <Icon name="mail" />
        <span>
          {mandatory ? 'Handover needs your attention' : 'Incoming requests'}
          <small>
            {events.length} waiting ·{' '}
            {mandatory ? 'required for the final handover' : 'optional bonuses'}
          </small>
        </span>
        <b>{open || mandatory ? '−' : '+'}</b>
      </button>
      {(open || mandatory) && (
        <div className="inbox-content">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </section>
  );
}
