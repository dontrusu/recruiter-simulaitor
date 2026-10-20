import { useEffect, useRef, useState } from 'react';
import { useGame } from '../store';
import {
  candidateDecisionAvailable,
  currentCandidate,
  has,
  load,
  manualReward,
} from '../game/engine';
import { config } from '../game/config';
import { EventCard } from './EventCard';

export function CandidateReview() {
  const game = useGame((s) => s.game);
  const actions = useGame.getState();
  const c = currentCandidate(game);
  const currentLoad = load(game);
  const final = has(game, 'U33');
  const blocker = game.events.find((e) => e.blocking);
  const ref = useRef<HTMLElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const sequence = useRef(0);
  const [rejectEffect, setRejectEffect] = useState<{
    sequence: number;
    name: string;
    role: string;
    reward: number;
  } | null>(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (blocker)
      ref.current
        ?.querySelector<HTMLButtonElement>('.blocking button')
        ?.focus({ preventScroll: true });
  }, [blocker?.id]);
  function handleReject() {
    const result = actions.reject();
    if (result.activity?.kind !== 'reject') {
      setRejectEffect(null);
      return;
    }
    setRejectEffect({ ...result.activity, sequence: ++sequence.current });
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setRejectEffect(null), 540);
  }
  return (
    <section className="review-workspace" ref={ref} aria-label="Human review">
      <div className="review-title">
        <div>
          <span className="eyebrow">ON YOUR DESK</span>
          <h2>Someone’s next chapter.</h2>
        </div>
        <span className="queue-pill" aria-label="Candidate number">
          #{String(game.candidateIndex + 1).padStart(3, '0')}
        </span>
      </div>
      {blocker && <EventCard event={blocker} />}
      <span className="sr-only" role="status">
        Now reviewing {c.name}, {c.role}.
      </span>
      <div className="candidate-stage">
        <section
          className="candidate-card candidate-enter"
          key={`candidate-${game.candidateIndex}`}
          aria-label="Current candidate"
        >
          <div className="candidate-top">
            <div className="avatar">
              {c.name
                .split(' ')
                .map((v) => v[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="section-label">
                {c.special ? 'SPECIAL REVIEW' : 'NEW APPLICATION'}
              </div>
              <h2>{c.name}</h2>
              <p>
                {c.seniority} {c.role} · {c.years} years · {c.location}
              </p>
            </div>
            {has(game, 'U01') && (
              <div className={`match `}>
                <strong>{c.match}%</strong>
                <small>ATS MATCH</small>
              </div>
            )}
          </div>
          {c.special && <div className="special-ribbon">HUMAN JUDGEMENT REQUIRED</div>}
          <p className="candidate-summary">{c.summary}</p>
          <p className="evidence">{c.evidence}</p>
          <div className={`skill-row ${has(game, 'U13') ? 'keyword-lens' : ''}`}>
            {c.skills.map((skill) => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
          {has(game, 'U06') && (
            <div className="profile-summary">
              <span>AI PROFILE SUMMARY</span>
              <p>
                {c.years} years in {c.role.toLowerCase()} · {c.skills.length} core skills evidenced
                · {c.location} availability
              </p>
            </div>
          )}
          {has(game, 'U04') && (
            <div className="concern">
              <b>MIRA'S CONCERN</b>
              <span>{c.concern}</span>
            </div>
          )}
        </section>
        {rejectEffect && (
          <div className="reject-ghost" key={`reject-${rejectEffect.sequence}`} aria-hidden="true">
            <div className="reject-ghost-profile">
              <span className="reject-ghost-avatar">
                {rejectEffect.name
                  .split(' ')
                  .map((v) => v[0])
                  .slice(0, 2)
                  .join('')}
              </span>
              <span>
                <strong>{rejectEffect.name}</strong>
                <small>{rejectEffect.role}</small>
              </span>
            </div>
            <b className="reject-stamp">REJECTED</b>
          </div>
        )}
        {rejectEffect && (
          <span
            className="reject-credits"
            key={`credits-${rejectEffect.sequence}`}
            aria-hidden="true"
          >
            +{rejectEffect.reward} EC
          </span>
        )}
      </div>
      <div className="decision-actions">
        <button
          className="reject-button"
          onClick={handleReject}
          disabled={!candidateDecisionAvailable(game, 'reject')}
        >
          Reject candidate <span>+{manualReward(game)} EC</span>
        </button>
        <button
          className="interview-button"
          disabled={!candidateDecisionAvailable(game, 'interview')}
          onClick={() => actions.begin('interview')}
        >
          Schedule interview
          <small>
            {!has(game, 'U12')
              ? 'Unlock with Team Calendar'
              : !c.interviewEligible
                ? 'Unavailable for this candidate'
                : 'Resets streak'}
          </small>
        </button>
      </div>
      {c.options && (
        <div className="special-options">
          {c.options
            .filter((o) => o.decision !== 'reject' && o.decision !== 'interview')
            .map((o) => (
              <button
                key={o.id}
                disabled={!candidateDecisionAvailable(game, 'reject')}
                onClick={() => actions.special(o.id)}
              >
                {o.label}
              </button>
            ))}
        </div>
      )}
      {final && currentLoad >= 90 && (
        <p className="risk-note" role="status">
          Each manual rejection now adds {config.riskyActionPenalty}% Load. Taking a break ends the
          session.
        </p>
      )}
    </section>
  );
}
