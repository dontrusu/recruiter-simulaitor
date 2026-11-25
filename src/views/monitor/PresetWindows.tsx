import { useWorkspaceStore } from '@/core/store/workspace';
import { UpgradeIcon } from '@/views/shop/UpgradeIcon';
import './preset-windows.css';

export const windows = [
  { name: 'Lo-Fi', slot: 'L1', upgrade: 'Lo-Fi Beats to Reject To' },
  { name: 'Calm Corner', slot: 'L2', upgrade: 'Calm Corner' },
  { name: 'AI Interviewer', slot: 'L3', upgrade: 'Your AI Interviewer' },
  { name: '#wins', slot: 'R1', upgrade: '#wins Channel' },
  { name: 'Compassion Engine', slot: 'R2', upgrade: 'Compassion Engine™' },
  { name: 'Humbled & Honored', slot: 'R3', upgrade: 'Humbled & Honored™' },
  { name: 'Inbox', slot: 'R4', upgrade: 'Re: Your Application' },
  { name: 'Funnel', slot: 'B1', upgrade: 'The Funnel' },
] as const;

type WindowName = (typeof windows)[number]['name'];
function Content({ name }: { name: WindowName }) {
  switch (name) {
    case 'Lo-Fi':
      return (
        <>
          <div className="track">
            <div className="album-art">
              head
              <br />
              count
              <br />
              <em>(pending)</em>
            </div>
            <div>
              <strong>Headcount (Pending)</strong>
              <p>Lo-Fi Unit</p>
            </div>
          </div>
          <div className="track-progress">
            <span />
          </div>
          <div className="track-time">
            <span>01:47</span>
            <span>03:28</span>
          </div>
          <small>Visual preview · Sound off</small>
        </>
      );
    case 'Calm Corner':
      return (
        <>
          <div className="calm-content">
            <span className="breathing-ring">Breathe</span>
            <p>
              Breathe in… the pipeline.
              <br />
              Breathe out… the headcount.
            </p>
          </div>
          <small>A moment of calm. Scheduled.</small>
        </>
      );
    case 'AI Interviewer':
      return (
        <>
          <div className="interview-faces">
            <span>
              <b>AI</b>Interview Ivan
            </span>
            <span>
              <b>OM</b>Applicant
            </span>
          </div>
          <p>“Great answer! Unfortunately, we’re looking for something more aligned.”</p>
          <small>Interview complete · Decision unchanged</small>
        </>
      );
    case '#wins':
      return (
        <>
          <p>
            <strong>Dasha</strong> <small>People operations</small>
          </p>
          <p className="channel-message">
            Another loop closed. The pipeline is ready. Vacancy still open.
          </p>
          <small>Celebrate 128 &nbsp; Support 17</small>
        </>
      );
    case 'Compassion Engine':
      return (
        <>
          <div className="warmth-label">
            Warmth <strong>68%</strong>
          </div>
          <div className="warmth-bar" />
          <div className="rejection-letter">
            <p>Hi there,</p>
            <p>
              We loved your energy and decided to proceed with candidates whose energy is slightly
              different.
            </p>
            <p>
              Stay in touch,
              <br />
              The people team
            </p>
          </div>
          <small>Human touch, automatically.</small>
        </>
      );
    case 'Humbled & Honored':
      return (
        <>
          <small>Talent.OS · Following</small>
          <p>
            Today I said no.
            <br />
            Here is what it taught me about leadership.
          </p>
          <small>128 thoughtful reactions</small>
        </>
      );
    case 'Inbox':
      return (
        <>
          <p>
            ● &nbsp; <strong>Oleg M.</strong>
            <br /> &nbsp; &nbsp; Hi, I now have 4 years of React. Would you reconsider?
          </p>
          <small>One unread conversation</small>
        </>
      );
    case 'Funnel':
      return (
        <div className="funnel-content">
          <svg viewBox="0 0 100 95" aria-hidden="true">
            <path d="M8 6h84L60 52v26L40 89V52z" />
          </svg>
          <div>
            <strong>Auto rejection</strong>
            <small>Hires: 0</small>
          </div>
        </div>
      );
  }
}
export function PresetWindows() {
  const preset = useWorkspaceStore((state) => state.preset);
  const front = useWorkspaceStore((state) => state.frontWindow);
  const activate = useWorkspaceStore((state) => state.activateWindow);
  if (preset === 'start') return null;
  const visible = preset === 'mid' ? windows.slice(0, 2) : windows;
  return (
    <div className="preset-windows" aria-label="Demonstration windows">
      {visible.map((window, index) => (
        <aside
          key={window.name}
          aria-label={window.name}
          className={`preset-window preset-${window.slot}`}
          style={{ zIndex: window.name === front ? 20 : index + 1 }}
          onPointerDown={() => activate(window.name)}
        >
          <header>
            <UpgradeIcon name={window.upgrade} />
            {window.name}
          </header>
          <div className="preset-body">
            <Content name={window.name} />
          </div>
        </aside>
      ))}
      <div className="preset-pool" aria-label="Talent Pool demonstration">
        <div>
          <strong>Talent Pool</strong>
          <small>0 on file · We’ll keep your CV.</small>
        </div>
        <div className="preset-pool-people" aria-hidden="true">
          {Array.from({ length: preset === 'chaos' ? 10 : 4 }, (_, index) => (
            <svg key={index} viewBox="0 0 64 60">
              <ellipse cx="32" cy="45" rx="29" ry="9" />
              <path d="M17 43c0-19 30-19 30 0" />
              <circle cx="32" cy="21" r="12" />
              <path d="M18 20Q14 5 29 5q21-3 18 20l-9-10-20 10z" />
            </svg>
          ))}
        </div>
        <em>
          Future opportunities.
          <br />
          Present company.
        </em>
      </div>
    </div>
  );
}
