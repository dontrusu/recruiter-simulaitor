import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { UpgradeIcon } from "./UpgradeIcon";
import { Button } from "@talent-os/design-system";
import { windowUpgradeNames, type WindowKind } from "./windowSlots";
import { useWindowDesktop } from "./WindowDesktop";

export type Stage = "start" | "mid" | "chaos";

export const stageUpgrades: Record<Stage, string[]> = {
  start: [],
  mid: [
    "Smart Reject",
    "Talent Pool",
    "Lo-Fi Beats to Reject To",
    "Calm Corner",
  ],
  chaos: [
    "Smart Reject",
    "Talent Pool",
    "Lo-Fi Beats to Reject To",
    "Calm Corner",
    "Compassion Engine™",
    "#wins Channel",
    "Humbled & Honored™",
    "Re: Your Application",
    "Your AI Interviewer",
    "The Funnel",
    "JD Optimizer",
    "Open Role",
    "Productivity Eye",
    "Mouse Jiggler Duck",
  ],
};

function VendorWindow({
  name,
  kind,
  children,
}: {
  name: string;
  kind: WindowKind;
  children: ReactNode;
}) {
  const { state, activate } = useWindowDesktop();
  const instances = state.windows
    .filter((window) => window.kind === kind)
    .sort((a, b) => a.openedAt - b.openedAt);
  return (
    <>
      {instances.map((window) => {
        const index = instances.findIndex((item) => item.id === window.id) % 3;
        const title = window.number === 1 ? name : `${name} · ${window.number}`;
        return (
          <aside
            key={window.id}
            id={`desktop-window-${window.id}`}
            className={`vendor-window slot-position vendor-${kind} ${state.activeId === window.id ? "is-active" : ""}`}
            data-slot={window.slot}
            aria-label={title}
            style={
              { "--stack-index": index, zIndex: window.front } as CSSProperties
            }
            onPointerDown={() => activate(window.id)}
            onFocusCapture={() => activate(window.id)}
          >
            <header className="vendor-header">
              <h2>
                <UpgradeIcon name={windowUpgradeNames[kind]} />
                {title}
              </h2>
            </header>
            <div
              className="vendor-body"
              tabIndex={kind === "funnel" ? undefined : 0}
              role={kind === "funnel" ? undefined : "group"}
              aria-label={kind === "funnel" ? undefined : `${title} content`}
            >
              {children}
            </div>
          </aside>
        );
      })}
    </>
  );
}

export const stageWindowKinds: Record<Stage, WindowKind[]> = {
  start: [],
  mid: ["music", "calm"],
  chaos: [
    "music",
    "calm",
    "interviewer",
    "wins",
    "compassion",
    "social",
    "inbox",
    "funnel",
  ],
};

function CompassionContent() {
  const [warmth, setWarmth] = useState(68);
  const warmthId = useId();
  return (
    <>
      <label className="warmth-label" htmlFor={warmthId}>
        Warmth <strong>{warmth}%</strong>
      </label>
      <input
        id={warmthId}
        type="range"
        min="0"
        max="100"
        value={warmth}
        onChange={(event) => setWarmth(+event.target.value)}
      />
      <div className="rejection-letter">
        <p>Hi there,</p>
        <p>
          {warmth > 70
            ? "We absolutely adored your energy. Sending our warmest wishes, but not an offer."
            : "We loved your energy and decided to proceed with candidates whose energy is slightly different."}
        </p>
        <p>
          Stay in touch,
          <br />
          The people team
        </p>
      </div>
      <span className="vendor-caption">Human touch, automatically.</span>
    </>
  );
}

export function UpgradeWindows({
  stage,
  rejected,
}: {
  stage: Stage;
  rejected: number;
}) {
  if (stage === "start") return null;
  return (
    <div className="upgrade-windows" aria-label="Installed upgrade windows">
      <VendorWindow name="Calm Corner" kind="calm">
        <div className="calm-content">
          <span className="breathing-ring">Breathe</span>
          <p>
            Breathe in… the pipeline.
            <br />
            Breathe out… the headcount.
          </p>
        </div>
        <span className="vendor-caption">A moment of calm. Scheduled.</span>
      </VendorWindow>
      <VendorWindow name="Lo-Fi Beats to Reject To" kind="music">
        <div className="track">
          <div className="album-art" aria-hidden="true">
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
        <div className="track-progress" aria-hidden="true">
          <span />
        </div>
        <div className="track-time">
          <span>01:47</span>
          <span>03:28</span>
        </div>
        <span className="vendor-caption">Visual preview · Sound off</span>
      </VendorWindow>
      {stage === "chaos" && (
        <>
          <VendorWindow name="Your AI Interviewer" kind="interviewer">
            <div className="interview-faces">
              <span>
                <b>AI</b>Interview Ivan
              </span>
              <span>
                <b>OM</b>Applicant
              </span>
            </div>
            <p>
              “Great answer! Unfortunately, we’re looking for something more
              aligned.”
            </p>
            <span className="vendor-caption">
              Interview complete · Decision unchanged
            </span>
          </VendorWindow>
          <VendorWindow name="Compassion Engine™" kind="compassion">
            <CompassionContent />
          </VendorWindow>
          <VendorWindow name="#wins" kind="wins">
            <p className="message-author">
              Dasha <span>People operations</span>
            </p>
            <p className="channel-message">
              Another loop closed.{" "}
              {rejected
                ? `${rejected} ${rejected === 1 ? "application" : "applications"} processed.`
                : "The pipeline is ready."}{" "}
              Vacancy still open.
            </p>
            <div className="reactions">
              <span>Celebrate 128</span>
              <span>Support 17</span>
            </div>
          </VendorWindow>
          <VendorWindow name="Humbled & Honored™" kind="social">
            <span className="eyebrow">Talent.OS · Following</span>
            <p>
              Today I said no.
              <br />
              Here is what it taught me about leadership.
            </p>
            <span className="vendor-caption">128 thoughtful reactions</span>
          </VendorWindow>
          <VendorWindow name="Re: Your Application" kind="inbox">
            <div className="inbox-message">
              <span className="unread-mark" aria-hidden="true" />
              <div>
                <strong>Oleg M.</strong>
                <p>Hi, I now have 4 years of React. Would you reconsider?</p>
              </div>
            </div>
            <span className="vendor-caption">One unread conversation</span>
          </VendorWindow>
          <VendorWindow name="The Funnel" kind="funnel">
            <svg viewBox="0 0 100 95" aria-hidden="true">
              <path d="M8 6h84L60 52v26L40 89V52z" />
            </svg>
            <div>
              <strong>Auto rejection</strong>
              <p>
                Applications in.
                <br />
                Decisions out.
              </p>
              <span className="eyebrow">Hires: 0</span>
            </div>
          </VendorWindow>
          <div className="second-cursor" aria-hidden="true">
            <svg viewBox="0 0 24 30">
              <path d="M2 2v23l6-7 6 11 5-3-6-10h9z" />
            </svg>
            <span>duck.exe</span>
          </div>
        </>
      )}
    </div>
  );
}

export function TalentPool({
  stage,
  rejected,
}: {
  stage: Stage;
  rejected: number;
}) {
  if (stage === "start") return null;
  return (
    <section className={`talent-pool pool-${stage}`} aria-label="Talent Pool">
      <div>
        <h2>
          <UpgradeIcon name="Talent Pool" />
          Talent Pool
        </h2>
        <p>{rejected} on file · We’ll keep your CV.</p>
      </div>
      <div className="pool-people" aria-hidden="true">
        {Array.from({ length: stage === "chaos" ? 10 : 4 }, (_, index) => (
          <svg key={index} viewBox="0 0 64 60">
            <ellipse cx="32" cy="45" rx="29" ry="9" />
            <path d="M17 43c0-19 30-19 30 0" />
            <circle cx="32" cy="21" r="12" />
            <path
              d={
                index % 2
                  ? "M19 23V12l12-7 15 9-2 12-6-9-17 9z"
                  : "M18 20Q14 5 29 5q21-3 18 20l-9-10-20 10z"
              }
            />
            <path d="M19 44h26" />
          </svg>
        ))}
      </div>
      <span className="pool-note">
        Future opportunities.
        <br />
        Present company.
      </span>
    </section>
  );
}
