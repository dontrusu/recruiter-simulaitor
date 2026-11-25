import { useState, type ReactNode, type ComponentProps } from "react";
import { Button, Dialog } from "@talent-os/design-system";
import { Sprite } from "./PixelArt";
import { roomUpgrades } from "./roomUpgrades";
import type { Stage } from "./UpgradeWindows";

const buzzwords = [
  "Synergy",
  "Bandwidth",
  "Circle back",
  "Pivot",
  "Free",
  "Leverage",
  "Alignment",
  "Ideate",
  "Deep dive",
];

function Bingo({ marked }: { marked: boolean }) {
  return (
    <div className="bingo-grid">
      {buzzwords.map((word) => (
        <span
          key={word}
          className={word === "Circle back" && marked ? "marked" : ""}
        >
          {word}
        </span>
      ))}
    </div>
  );
}

function OrgChart({
  hasCoffee,
  hasPlant,
}: {
  hasCoffee: boolean;
  hasPlant: boolean;
}) {
  return (
    <div className="room-org-tree">
      <b>VP of Vibes</b>
      <div>
        <span>{hasPlant ? "Head of Kevin" : "People Ops"}</span>
        <span>{hasCoffee ? "Chief Coffee Officer" : "Facilities"}</span>
      </div>
      <b>Interview Ivan</b>
    </div>
  );
}

function PropButton({
  name,
  kind,
  children,
  ...props
}: ComponentProps<"button"> & { name: string; kind: string }) {
  return (
    <Button
      {...props}
      className={`room-prop prop-${kind}`}
      variant="ghost"
      aria-label={name}
    >
      <span className="room-prop-art" aria-hidden="true">
        {children}
      </span>
    </Button>
  );
}

function InspectProp({
  title,
  kind,
  description,
  art,
  children,
}: {
  title: string;
  kind: string;
  description: string;
  art: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Dialog
      trigger={
        <PropButton name={title} kind={kind}>
          {art}
        </PropButton>
      }
      title={title}
      description={description}
    >
      {children}
    </Dialog>
  );
}

const confetti = Array.from({ length: 18 }, (_, index) => ({
  x: ((index * 73) % 550) + 170,
  y: -160 + ((index * 47) % 245),
  color: [
    "var(--room-gold)",
    "var(--soft-chrome)",
    "var(--soft-pink)",
    "var(--soft-blue)",
  ][index % 4],
}));

function OracleBall({ consultation }: { consultation: number }) {
  return (
    <span
      className="oracle-art"
      key={consultation}
      data-consulted={consultation > 0}
    >
      <span className="oracle-ball">
        <span className="oracle-mist" />
        <b>{consultation ? "×" : "8"}</b>
      </span>
      <span className="oracle-foot" />
    </span>
  );
}

export function Room({
  active,
  stage,
  bingoMarked,
  onConsult,
}: {
  active: boolean;
  stage: Stage;
  bingoMarked: boolean;
  onConsult: () => void;
}) {
  const [cleaned, setCleaned] = useState(false);
  const [watered, setWatered] = useState(false);
  const [confettiVisible, setConfettiVisible] = useState(false);
  const [boxOpen, setBoxOpen] = useState(false);
  const [consultation, setConsultation] = useState(0);
  const installed = roomUpgrades[stage];
  const has = (name: string) => installed.includes(name);

  return (
    <section
      className="room-set"
      aria-label="Recruiter’s room"
      hidden={!active}
      lang="en"
    >
      <div className="room-wall-panels" aria-hidden="true" />
      <div className="room-desk" aria-hidden="true" />
      <svg className="room-cables" viewBox="0 0 1600 900" aria-hidden="true">
        <path d="M421 693C451 786 372 848 237 821S145 774 121 747M1184 696C1158 779 1188 838 1324 817S1412 781 1420 749M802 765c24 43 53 67 207 78" />
      </svg>
      <svg className="room-lights" viewBox="0 0 1600 160" aria-hidden="true">
        <path
          className="light-wire"
          d="M0 48Q180 142 400 78T800 66T1200 85T1600 35"
        />
        {[
          [110, 91],
          [210, 102],
          [320, 98],
          [445, 66],
          [550, 46],
          [650, 43],
          [755, 56],
          [855, 82],
          [960, 101],
          [1065, 101],
          [1170, 91],
          [1275, 61],
          [1380, 40],
          [1485, 35],
        ].map(([x, y]) => (
          <g key={x} transform={`translate(${x} ${y})`}>
            <circle className="light-glow" cy="20" r="26" />
            <path
              className="light-bulb"
              d="M-5 7H5V12H8V23H5V27H-5V23H-8V12H-5Z"
            />
            <rect className="light-socket" x="-4" y="0" width="8" height="9" />
          </g>
        ))}
      </svg>
      <div className="room-stand" aria-hidden="true" />
      <div className="room-base" aria-hidden="true" />
      <div className="room-monitor" aria-hidden="true">
        <span className="monitor-name">Talent.OS</span>
        <span className="monitor-power" />
      </div>
      <div className="room-keyboard" aria-hidden="true">
        <div className="room-keys" />
        <i />
      </div>
      <div className="room-mouse" aria-hidden="true" />
      <div className="room-papers" aria-hidden="true">
        <Sprite kind="cup" />
      </div>

      {stage === "chaos" && (
        <div className="room-notes" aria-hidden="true">
          <span>
            call
            <br />
            Dasha
          </span>
          <span>
            desk
            <br />
            B-114?
          </span>
        </div>
      )}
      {has("Buzzword Bingo") && (
        <InspectProp
          title="Buzzword Bingo"
          kind="bingo"
          description={
            bingoMarked
              ? "Circle back is marked. The meeting can continue."
              : "The bingo card is waiting for its next office buzzword."
          }
          art={
            <>
              <strong>Buzzword Bingo</strong>
              <Bingo marked={bingoMarked} />
            </>
          }
        >
          <Bingo marked={bingoMarked} />
        </InspectProp>
      )}
      {has("Culture Fit Oracle") && (
        <InspectProp
          title="Culture Fit Oracle"
          kind="oracle"
          description="A deeply human decision, delegated to a ball."
          art={<OracleBall consultation={consultation} />}
        >
          <div className="oracle-consultation">
            <div className="oracle-preview" aria-hidden="true">
              <OracleBall consultation={consultation} />
            </div>
            <div className="oracle-answer-space">
              {consultation > 0 ? (
                <div className="oracle-answer" key={consultation}>
                  <span className="eyebrow">
                    Oracle verdict · #{consultation}
                  </span>
                  <p>
                    Reply hazy.
                    <br />
                    <strong>Not a culture fit.</strong>
                  </p>
                  <span className="oracle-reward">
                    +1 point · Rejection sent
                  </span>
                </div>
              ) : (
                <p className="muted">
                  The ball is ready to evaluate another human.
                </p>
              )}
            </div>
            <Button
              onClick={() => {
                setConsultation((previous) => previous + 1);
                onConsult();
              }}
            >
              Consult Oracle · +1 point
            </Button>
          </div>
        </InspectProp>
      )}
      {has("Kevin the Succulent") && (
        <InspectProp
          title="Kevin the Succulent"
          kind="kevin"
          description={
            watered
              ? "Kevin has been watered. Dasha would approve."
              : "“Water me.” — Dasha (restructured)"
          }
          art={
            <>
              <Sprite kind="plant" />
              <i className="kevin-tag">Water me</i>
            </>
          }
        >
          <Button onClick={() => setWatered(true)} disabled={watered}>
            {watered ? "Watered" : "Water Kevin"}
          </Button>
        </InspectProp>
      )}
      {has("Brewtus the Coffee Machine") && (
        <InspectProp
          title="Brewtus the Coffee Machine"
          kind="coffee"
          description={
            cleaned
              ? "The smoke has cleared. Oat milk is still unavailable."
              : "“Please clean after yourself.” — Facilities"
          }
          art={
            <>
              {!cleaned && (
                <span className="coffee-steam">
                  <i />
                  <i />
                  <i />
                </span>
              )}
              <span className="coffee-machine">
                <b>BREWTUS</b>
                <span className="coffee-face">•‿•</span>
                <span className="coffee-bay">
                  <Sprite kind="cup" />
                </span>
              </span>
            </>
          }
        >
          <Button onClick={() => setCleaned(true)} disabled={cleaned}>
            {cleaned ? "Cleaned" : "Clean machine"}
          </Button>
        </InspectProp>
      )}
      {has("Org Chart") && (
        <InspectProp
          title="Org Chart"
          kind="org"
          description="HR has assigned a title to everything on the desk."
          art={
            <>
              <header>ORG CHART</header>
              <OrgChart
                hasCoffee={has("Brewtus the Coffee Machine")}
                hasPlant={has("Kevin the Succulent")}
              />
            </>
          }
        >
          <OrgChart
            hasCoffee={has("Brewtus the Coffee Machine")}
            hasPlant={has("Kevin the Succulent")}
          />
        </InspectProp>
      )}
      {has("Fairness Certificate") && (
        <InspectProp
          title="Fairness Certificate"
          kind="audit"
          description="In the game’s fictional audit, all candidates are rejected at an equal rate."
          art={
            <>
              <strong>Bias Audit</strong>
              <b className="audit-seal">✓</b>
              <span>Passed</span>
            </>
          }
        />
      )}
      {has("Mandatory Fun Cannon") && (
        <PropButton
          name={
            confettiVisible ? "Clear confetti" : "Fire Mandatory Fun Cannon"
          }
          kind="cannon"
          onClick={() => setConfettiVisible(!confettiVisible)}
        >
          {confettiVisible && (
            <span className="room-confetti">
              {confetti.map(({ x, y, color }) => (
                <i key={x} style={{ left: x, top: y, background: color }} />
              ))}
            </span>
          )}
          <span className="cannon-barrel">
            <i />
          </span>
          <span className="cannon-base" />
        </PropButton>
      )}
      {has("Swag Lootbox") && (
        <InspectProp
          title="Swag Lootbox"
          kind="swag"
          description={
            boxOpen
              ? "You found a company mug. Integrity, Innovation, Synergy."
              : "A complimentary sample from the office swag catalog."
          }
          art={
            <span className={`swag-box${boxOpen ? " swag-open" : ""}`}>
              <i />
              {boxOpen && <Sprite kind="cup" />}
            </span>
          }
        >
          <Button onClick={() => setBoxOpen(true)} disabled={boxOpen}>
            {boxOpen ? "Sample opened" : "Open sample"}
          </Button>
        </InspectProp>
      )}
      {has("Headcount") && (
        <InspectProp
          title="Headcount"
          kind="egg"
          description="Pending Finance approval. The egg has a crack. Finance has a process."
          art={
            <span className="room-egg">
              <i />
            </span>
          }
        />
      )}
      {has("Mouse Jiggler Duck") && (
        <InspectProp
          title="Mouse Jiggler Duck"
          kind="duck"
          description="The rubber duck has one job: making the workspace look occupied. Its second cursor appears on the Screen."
          art={<Sprite kind="duck" />}
        />
      )}
    </section>
  );
}
