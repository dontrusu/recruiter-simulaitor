import { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Badge,
  Button,
  Dialog,
  Icon,
  Panel,
  Tooltip,
} from "@talent-os/design-system";
import "../../../brand-system/design-system/dist/styles.css";
import { applications, upgrades } from "./content";
import { availableUpgrades } from "./shopAvailability";
import {
  UpgradeWindows,
  TalentPool,
  stageUpgrades,
  stageWindowKinds,
  type Stage,
} from "./UpgradeWindows";
import "./styles.css";
import "./viewport.css";
import "./soft-system.css";
import "./room.css";
import "./rejection-feedback.css";
import { Meadow } from "./PixelArt";
import { UpgradeIcon } from "./UpgradeIcon";
import { SlotGuides } from "./windowSlots";
import { WindowDesktop } from "./WindowDesktop";
import { ReviewPanel } from "./ReviewPanel";
import { ViewportCanvas } from "./ViewportCanvas";
import { ReviewScene } from "./ReviewScene";
import { Room } from "./Room";
import { roomUpgrades } from "./roomUpgrades";

type Variant = "a" | "b";
type Upgrade = (typeof upgrades)[number];
type RejectionSource = "oracle";
type VisualUpgrade = "Desktop Wallpaper" | "Office Color Pack";

type Run = {
  credits: number;
  visualUpgrades: VisualUpgrade[];
  rejected: number;
  index: number;
  lastRejection: { reward: number; source?: RejectionSource } | null;
};

const initialRun: Run = {
  credits: 0,
  visualUpgrades: [],
  rejected: 0,
  index: 0,
  lastRejection: null,
};

function UpgradeDetail({
  upgrade,
  credits,
  onPurchase,
  hasColors,
}: {
  upgrade: Upgrade;
  credits: number;
  onPurchase: (upgrade: Upgrade) => void;
  hasColors: boolean;
}) {
  const visual =
    upgrade.name === "Desktop Wallpaper" ||
    upgrade.name === "Office Color Pack";
  const tile = (
    <Button
      variant="secondary"
      className="upgrade-tile"
      disabled={credits < upgrade.cost}
    >
      <UpgradeIcon name={upgrade.name} line={!hasColors} />
      <span>{upgrade.name}</span>
      <small>{upgrade.cost} pts</small>
    </Button>
  );
  if (credits < upgrade.cost) return tile;
  return (
    <Dialog
      trigger={tile}
      title={upgrade.name}
      description={upgrade.description}
    >
      <div className="detail-cost">
        <Badge>{upgrade.cost} points</Badge>
        <span>
          {credits >= upgrade.cost
            ? "Enough points"
            : `${upgrade.cost - credits} more points needed`}
        </span>
      </div>
      {visual ? (
        <Button onClick={() => onPurchase(upgrade)}>
          Buy for {upgrade.cost} points
        </Button>
      ) : (
        <p className="muted">
          Catalog preview. This upgrade is not purchasable yet.
        </p>
      )}
    </Dialog>
  );
}

function Shop({
  credits,
  installed,
  onPurchase,
  hasColors,
}: {
  credits: number;
  installed: ReadonlySet<string>;
  onPurchase: (upgrade: Upgrade) => void;
  hasColors: boolean;
}) {
  const available = availableUpgrades(credits, installed);
  return (
    <section className="shop" aria-label="Upgrade shop">
      <div className="shop-heading">
        <span className="eyebrow">Improve the process</span>
      </div>
      <div className="upgrade-row">
        {available.length === 0 && (
          <p className="shop-empty">No upgrades available yet.</p>
        )}
        {available.map((upgrade) => (
          <UpgradeDetail
            key={upgrade.name}
            upgrade={upgrade}
            credits={credits}
            onPurchase={onPurchase}
            hasColors={hasColors}
          />
        ))}
      </div>
    </section>
  );
}

function Portrait({ alternate }: { alternate: boolean }) {
  return (
    <svg
      className="portrait"
      viewBox="0 0 180 200"
      role="img"
      aria-label="Original geometric illustration of a fictional applicant"
    >
      <path className="portrait-bg" d="M0 0h180v200H0z" />
      <path
        className="portrait-shirt"
        d="M19 200c3-45 32-63 70-63s69 18 73 63"
      />
      <path className="portrait-skin" d="M73 116h37v42c-12 15-25 15-37 0z" />
      <path
        className="portrait-face"
        d="M50 65c0-52 83-51 83 0v36c0 32-23 49-41 49-20 0-42-17-42-49z"
      />
      <path
        className="portrait-hair"
        d={
          alternate
            ? "M42 116V62C36 5 141 1 143 61v72l-16-13V57L94 42 54 69v54z"
            : "M45 80V54l13-9-7-17 26 6L89 18l15 13 24-3-3 16 16 11-8 31-10-29-24 7-17-14-23 20-2 21z"
        }
      />
      <g className="portrait-lines" fill="none" strokeWidth="3">
        <path d="M63 82h25v20H63zM101 82h25v20h-25zM88 88h13M69 122c13 7 27 7 39-1M94 97l-3 13h8" />
      </g>
      <path
        className="portrait-headphones"
        fill="none"
        strokeWidth="8"
        d="M43 92V67c0-61 98-61 98 0v24"
      />
      <rect
        className="portrait-headphones"
        x="34"
        y="79"
        width="17"
        height="35"
        rx="8"
      />
      <rect
        className="portrait-headphones"
        x="133"
        y="79"
        width="17"
        height="35"
        rx="8"
      />
    </svg>
  );
}

function Vacancy() {
  return (
    <section className="vacancy" aria-labelledby="vacancy-title">
      <div>
        <span className="eyebrow">The open role</span>
        <h2 id="vacancy-title">
          Frontend
          <br className="role-break" /> Developer
        </h2>
        <span className="muted">Product team · Full time</span>
      </div>
      <div className="requirements">
        <span className="eyebrow">What we’re looking for</span>
        <ul>
          <li>
            <span>React</span>
            <strong>4+ years</strong>
          </li>
          <li>
            <span>TypeScript</span>
            <strong>2+ years</strong>
          </li>
          <li>
            <span>Testing</span>
            <strong>2+ years</strong>
          </li>
          <li>
            <span>Accessibility</span>
            <strong>Experience</strong>
          </li>
          <li>
            <span>Collaboration</span>
            <strong>Team player</strong>
          </li>
        </ul>
      </div>
      <p className="vacancy-note">
        The right person is out there.
        <br />
        The role will remain open.
      </p>
    </section>
  );
}

function ApplicationDetails({
  index,
  decorative = false,
}: {
  index: number;
  decorative?: boolean;
}) {
  const person = applications[index % applications.length];
  return (
    <>
      <div className="candidate-top">
        <span className="eyebrow">
          Application {String(index + 1).padStart(3, "0")}
        </span>
        <Badge>In review</Badge>
      </div>
      <div className="person">
        <div className="portrait-wrap">
          <Portrait alternate={index % applications.length === 1} />
          <span className="portrait-caption">A person, not a pipeline.</span>
        </div>
        <div className="person-details">
          <span className="eyebrow candidate-label">A new application</span>
          <h1 id={decorative ? undefined : "candidate-name"}>{person.name}</h1>
          <p className="location">
            {person.location} <span aria-hidden="true">/</span> {person.mode}
          </p>
          <dl className="facts">
            <div>
              <dt>React</dt>
              <dd>{person.react}</dd>
            </div>
            <div>
              <dt>TypeScript</dt>
              <dd>{person.typescript}</dd>
            </div>
            <div>
              <dt>Testing</dt>
              <dd>{person.testing}</dd>
            </div>
            <div>
              <dt>Accessibility</dt>
              <dd>{person.accessibility}</dd>
            </div>
            <div>
              <dt>Collaboration</dt>
              <dd>{person.collaboration}</dd>
            </div>
            <div>
              <dt>More skills</dt>
              <dd>{person.extra}</dd>
            </div>
          </dl>
        </div>
      </div>
      <div className="letter">
        <span className="eyebrow">From the cover letter</span>
        <blockquote>“{person.quote}”</blockquote>
      </div>
      <div className="application-bottom">
        <span>Application received</span>
        <span>Ready for your consideration</span>
      </div>
    </>
  );
}

function App() {
  const [variant, setVariant] = useState<Variant>(
    new URLSearchParams(location.search).get("variant") === "b" ? "b" : "a",
  );
  const [run, setRun] = useState(initialRun);
  const [rejectionMotion, setRejectionMotion] = useState(
    () => new URLSearchParams(location.search).get("motion") !== "off",
  );
  const [showRejectionImpact, setShowRejectionImpact] = useState(false);
  const [stage, setStage] = useState<Stage>(() => {
    const value = new URLSearchParams(location.search).get("stage");
    return value === "mid" || value === "chaos" ? value : "start";
  });
  const activeStage = variant === "a" ? stage : "start";
  const [camera, setCamera] = useState(() =>
    new URLSearchParams(location.search).get("view") === "room"
      ? "room"
      : "screen",
  );
  const [bingoMarked, setBingoMarked] = useState(false);
  const [roomSession, setRoomSession] = useState(0);
  const showRoom = camera === "room";
  const installed = new Set([
    ...stageUpgrades[activeStage],
    ...roomUpgrades[activeStage],
    ...run.visualUpgrades,
  ]);
  const hasWallpaper = run.visualUpgrades.includes("Desktop Wallpaper");
  const hasColors = run.visualUpgrades.includes("Office Color Pack");
  function purchaseUpgrade(upgrade: Upgrade) {
    if (
      upgrade.name !== "Desktop Wallpaper" &&
      upgrade.name !== "Office Color Pack"
    )
      return;
    const name: VisualUpgrade = upgrade.name;
    setRun((previous) => {
      if (
        previous.credits < upgrade.cost ||
        previous.visualUpgrades.includes(name)
      )
        return previous;
      return {
        ...previous,
        credits: previous.credits - upgrade.cost,
        visualUpgrades: [...previous.visualUpgrades, name],
      };
    });
  }
  function toggleVisualPreview(name: VisualUpgrade) {
    setRun((previous) => ({
      ...previous,
      visualUpgrades: previous.visualUpgrades.includes(name)
        ? previous.visualUpgrades.filter((item) => item !== name)
        : [...previous.visualUpgrades, name],
    }));
  }
  function chooseCamera(next: "screen" | "room") {
    setShowRejectionImpact(false);
    setCamera(next);
    const url = new URL(location.href);
    url.searchParams.set("view", next);
    history.replaceState(null, "", url);
    requestAnimationFrame(() =>
      document
        .getElementById(next === "room" ? "screen-camera" : "room-camera")
        ?.focus(),
    );
  }
  const [showSlots, setShowSlots] = useState(
    () => new URLSearchParams(location.search).get("slots") === "1",
  );
  const { lastRejection } = run;
  const rejectionNumber = String(run.rejected).padStart(3, "0");
  let feedback = roomSession
    ? "New session. The role is still open."
    : "Read the application. Keep the role open.";
  if (lastRejection) {
    const reward = `+${lastRejection.reward} points.`;
    feedback =
      lastRejection.source === "oracle"
        ? `Oracle: “Reply hazy. Not a culture fit.” ${reward} Rejection #${rejectionNumber} sent.`
        : `Rejection #${rejectionNumber} sent. ${reward} Next application opened.`;
  }
  function chooseVariant(next: Variant) {
    setShowRejectionImpact(false);
    setVariant(next);
    const url = new URL(location.href);
    url.searchParams.set("variant", next);
    history.replaceState(null, "", url);
  }
  function chooseStage(next: Stage) {
    setStage(next);
    setVariant("a");
    const url = new URL(location.href);
    url.searchParams.set("variant", "a");
    url.searchParams.set("stage", next);
    history.replaceState(null, "", url);
  }
  function reject(source?: RejectionSource) {
    setShowRejectionImpact(
      !showRoom &&
        rejectionMotion &&
        matchMedia("(prefers-reduced-motion: no-preference)").matches,
    );
    setRun((previous) => ({
      ...previous,
      credits: previous.credits + 1,
      rejected: previous.rejected + 1,
      index: previous.index + 1,
      lastRejection: { reward: 1, source },
    }));
  }
  const reasons = (
    <section className="decisions" aria-labelledby="decision-title">
      <div className="decision-heading">
        <span className="eyebrow">Your decision</span>
        {lastRejection && (
          <span className="rejection-receipt" aria-hidden="true">
            <span className="rejection-slip" key={run.rejected}>
              Rejection sent · #{rejectionNumber}
            </span>
          </span>
        )}
        <h2 id="decision-title">Review the application.</h2>
        <p>One click. Another closed loop.</p>
      </div>
      <div className="reason-list">
        <Button className="reason reject-action" onClick={() => reject()}>
          <span>Reject</span>
          <span className="reward">+1 point</span>
        </Button>
        <Tooltip label="The candidate does not meet the role requirements.">
          <Button className="reason interview-action" aria-disabled="true">
            Invite to interview
          </Button>
        </Tooltip>
      </div>
      <p className="decision-note">
        <Icon name="info" /> The interview is unavailable.
      </p>
    </section>
  );
  const candidate = (
    <article className="candidate" aria-labelledby="candidate-name">
      <ApplicationDetails index={run.index} />
      {showRejectionImpact && lastRejection && (
        <div className="application-exit" key={run.rejected} aria-hidden="true">
          <div
            className="application-exit-sheet"
            onAnimationEnd={(event) => {
              if (event.target === event.currentTarget)
                setShowRejectionImpact(false);
            }}
          >
            <ApplicationDetails index={run.index - 1} decorative />
            <div className="rejection-stamp">
              <span>Rejection sent</span>
              <small>Application {rejectionNumber} · Filed</small>
            </div>
          </div>
        </div>
      )}
    </article>
  );
  const reviewControls = (
    <>
      <div className="review-bar">
        <span>
          DESIGN REVIEW{" "}
          <span className="review-caption">/ Стартовий екран</span>
        </span>
        <div role="group" aria-label="Layout proposal">
          <Button
            size="sm"
            variant={variant === "a" ? "primary" : "ghost"}
            aria-pressed={variant === "a"}
            onClick={() => chooseVariant("a")}
          >
            A · Спільне вікно
          </Button>
          <Button
            size="sm"
            variant={variant === "b" ? "primary" : "ghost"}
            aria-pressed={variant === "b"}
            onClick={() => chooseVariant("b")}
          >
            B · Робочий стіл
          </Button>
        </div>
        <span className="review-meta">Fictional data · Local demo</span>
      </div>
      <div className="stage-controls" lang="uk">
        <span className="eyebrow">Композиція A · Розвиток гри</span>
        <div role="group" aria-label="Стан гри">
          {(
            [
              { value: "start", label: "Старт" },
              { value: "mid", label: "Кілька апгрейдів" },
              { value: "chaos", label: "Повний хаос" },
            ] as const
          ).map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant={
                variant === "a" && stage === item.value ? "primary" : "ghost"
              }
              aria-pressed={variant === "a" && stage === item.value}
              onClick={() => chooseStage(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
        <Button
          size="sm"
          variant={showSlots ? "secondary" : "ghost"}
          aria-pressed={showSlots}
          onClick={() => {
            const next = !showSlots;
            setShowSlots(next);
            const url = new URL(location.href);
            url.searchParams.set("slots", next ? "1" : "0");
            history.replaceState(null, "", url);
          }}
        >
          Межі слотів
        </Button>
        <span className="stage-explanation">
          Візуальні стани · Прогрес заявки зберігається
        </span>
      </div>
      <Button
        size="sm"
        variant="secondary"
        aria-pressed={rejectionMotion}
        onClick={() => {
          const next = !rejectionMotion;
          setRejectionMotion(next);
          setShowRejectionImpact(false);
          const url = new URL(location.href);
          if (next) url.searchParams.delete("motion");
          else url.searchParams.set("motion", "off");
          history.replaceState(null, "", url);
        }}
      >
        Анімація відмови
      </Button>
      <Dialog
        trigger={
          <Button className="shop-catalog-button" variant="secondary" size="sm">
            All upgrades <span className="count">{upgrades.length}</span>
          </Button>
        }
        title="A better process. One upgrade at a time."
        description="The complete upgrade catalog. Names and sample prices follow the project sources; descriptions are draft game copy."
      >
        <div className="catalog">
          {upgrades.map((upgrade, index) => (
            <article key={upgrade.name}>
              <span className="catalog-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="catalog-upgrade-name">
                  <UpgradeIcon name={upgrade.name} line={!hasColors} />
                  {upgrade.name}
                </h3>
                <p>{upgrade.description}</p>
              </div>
              <Badge>{upgrade.cost} pts</Badge>
            </article>
          ))}
        </div>
        <p className="muted">
          Hiring Freeze and the final candidate remain narrative end states,
          rather than shop items.
        </p>
      </Dialog>
      <Button
        variant="secondary"
        size="sm"
        aria-pressed={hasWallpaper}
        onClick={() => toggleVisualPreview("Desktop Wallpaper")}
      >
        Перегляд: фон
      </Button>
      <Button
        variant="secondary"
        size="sm"
        aria-pressed={hasColors}
        onClick={() => toggleVisualPreview("Office Color Pack")}
      >
        Перегляд: кольори
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setRun(initialRun);
          setShowRejectionImpact(false);
          setBingoMarked(false);
          setRoomSession((session) => session + 1);
        }}
      >
        <Icon name="reset" />
        Reset demo
      </Button>
    </>
  );
  return (
    <div
      className={`prototype variant-${variant} stage-${activeStage} camera-${camera} ${showSlots ? "slots-visible" : ""} ${hasColors ? "colors-enabled" : "colors-disabled"} ${hasWallpaper ? "wallpaper-enabled" : ""}`}
      data-rejection-motion={rejectionMotion ? "on" : "off"}
    >
      <ReviewPanel controls={reviewControls}>
        {showRoom ? (
          <header className="room-toolbar">
            <div className="room-view-controls">
              <Button
                id="screen-camera"
                variant="secondary"
                onClick={() => chooseCamera("screen")}
              >
                ← Screen
              </Button>
              <div className="room-heading">
                <h1>Room</h1>
                <span>
                  {roomUpgrades[activeStage].length} physical upgrades
                </span>
              </div>
            </div>
            <div
              className="room-stages"
              role="group"
              aria-label="Upgrade progress"
            >
              {(
                [
                  ["start", "Start"],
                  ["mid", "Early upgrades"],
                  ["chaos", "Full chaos"],
                ] as const
              ).map(([value, label]) => (
                <Button
                  key={value}
                  size="sm"
                  variant={activeStage === value ? "primary" : "secondary"}
                  aria-pressed={activeStage === value}
                  onClick={() => chooseStage(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
            <Shop
              credits={run.credits}
              installed={installed}
              onPurchase={purchaseUpgrade}
              hasColors={hasColors}
            />
            <p className="room-counters" aria-label="Run statistics">
              <b>{run.credits}</b> points <span>·</span> <b>{run.rejected}</b>{" "}
              rejected
            </p>
            <p className="room-status" role="status">
              {feedback}
            </p>
          </header>
        ) : (
          <Button
            id="room-camera"
            className="room-camera-launcher"
            variant="secondary"
            onClick={() => chooseCamera("room")}
          >
            Room ↗
          </Button>
        )}
        <ViewportCanvas
          showRoom={showRoom}
          onOpenScreen={() => chooseCamera("screen")}
          room={
            <Room
              key={roomSession}
              active={showRoom}
              stage={activeStage}
              bingoMarked={bingoMarked}
              onConsult={() => reject("oracle")}
            />
          }
        >
          <div className="workspace">
            <header className="masthead">
              <div className="brand">
                <span className="wordmark">Talent.OS</span>
                <span className="brand-caption">Recruitment, as usual.</span>
              </div>
              {!showRoom && (
                <Shop
                  credits={run.credits}
                  installed={installed}
                  onPurchase={purchaseUpgrade}
                  hasColors={hasColors}
                />
              )}
              <div className="scoreboard" aria-label="Run statistics">
                <div className="credit-total">
                  {lastRejection && (
                    <span
                      className="rejection-credit"
                      key={run.rejected}
                      aria-hidden="true"
                    >
                      +{lastRejection.reward}
                    </span>
                  )}
                  <strong>{run.credits}</strong>
                  <span>points</span>
                </div>
                <div className="score-details">
                  <span>
                    <b>{run.rejected}</b> rejected
                  </span>
                  <span>
                    <b>0</b> hires
                  </span>
                </div>
              </div>
            </header>
            <main>
              <div className="workspace-heading">
                <div>
                  <span className="eyebrow">Recruitment workspace</span>
                  <p>
                    {variant === "a"
                      ? "Good morning. The role is still open."
                      : "Review the application. Keep things moving."}
                  </p>
                </div>
                <span className="workspace-status">
                  <span className="status-square" aria-hidden="true" />1 open
                  role ·
                  {installed.size === 0
                    ? "No upgrades installed"
                    : `${installed.size} upgrades installed`}
                </span>
              </div>
              {variant === "a" ? (
                <WindowDesktop
                  key={activeStage}
                  kinds={stageWindowKinds[activeStage]}
                >
                  <ReviewScene>
                    {hasWallpaper && <Meadow />}
                    {showSlots && <SlotGuides />}
                    <div className="desk-margin">
                      <span className="vertical-note">
                        THE HUMAN RESOURCES DEPARTMENT
                      </span>
                    </div>
                    <section
                      className="review-window"
                      aria-label="Application review"
                    >
                      <div className="window-bar">
                        <span>Talent.OS / Application review</span>
                        <Icon name="grid" />
                      </div>
                      <Vacancy />
                      {candidate}
                      {reasons}
                    </section>
                    <aside className="side-note">
                      <span className="eyebrow">A note from HR</span>
                      <p>
                        Great people.
                        <br />
                        Difficult decisions.
                        <br />
                        <em>Same outcome.</em>
                      </p>
                      <span className="note-rule" />
                      <span className="muted">
                        Read carefully.
                        <br />
                        There’s a person in there.
                      </span>
                    </aside>
                    <UpgradeWindows
                      key={activeStage}
                      stage={activeStage}
                      rejected={run.rejected}
                    />
                  </ReviewScene>
                  <TalentPool stage={activeStage} rejected={run.rejected} />
                </WindowDesktop>
              ) : (
                <div className="composition-b">
                  <aside className="role-column">
                    <Vacancy />
                    <Panel title="Your desk is clear." eyebrow="For now">
                      <p>Every upgrade promises to make your job easier.</p>
                      <span className="muted">
                        Start with the person in front of you.
                      </span>
                    </Panel>
                  </aside>
                  {candidate}
                  {reasons}
                </div>
              )}
              <footer className="workspace-footer">
                <p role="status" aria-live="polite">
                  {feedback}
                </p>
              </footer>
            </main>
            <footer className="bottom-line">
              <span>Talent.OS · People operations</span>
              <span>Good systems. Questionable processes.</span>
              <span>All applicants are fictional.</span>
            </footer>
          </div>
        </ViewportCanvas>
      </ReviewPanel>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
