import { useRef, useState } from 'react';
import { useGame } from '../store';
import { brewFill, connectedTiles, pipePorts, probeTarget, type Station } from '../game/operations';
import { operationReward } from '../game/engine';
import { Icon } from './Icon';

function Conveyor() {
  const game = useGame((s) => s.game);
  const operate = useGame((s) => s.operate);
  const belt = game.operations.conveyor;
  const packet = belt.packets[0];
  const pointer = useRef<number | null>(null);
  const [dragX, setDragX] = useState(0);
  const [dispatch, setDispatch] = useState<{ id: number; lane: string; title: string } | null>(
    null,
  );
  const disabled = game.status !== 'running';
  function route(lane: 'verified' | 'recycle') {
    if (packet && !disabled) {
      setDispatch({ id: packet.id, lane, title: packet.title });
      setDragX(0);
      operate({ type: 'sort', packetId: packet.id, lane });
    }
  }
  return (
    <div className="station-game conveyor-game">
      <div className="station-instructions">
        <h3>Keep the good ones moving.</h3>
        <p>
          Swipe signed applications right. Send bots and duplicates left. Five cards, twenty
          seconds.
        </p>
      </div>
      <div
        className="conveyor-track"
        tabIndex={0}
        role="group"
        aria-label="Conveyor sorting controls"
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            e.preventDefault();
            route(e.key === 'ArrowLeft' ? 'recycle' : 'verified');
          }
        }}
      >
        <div className="belt-rollers" />
        {dispatch && (
          <span
            className={`dispatch-echo to-${dispatch.lane}`}
            key={dispatch.id}
            aria-hidden="true"
          >
            {dispatch.title}
            <Icon name={dispatch.lane === 'verified' ? 'scan' : 'mail'} />
          </span>
        )}
        {packet ? (
          <div
            className="sorting-card"
            key={packet.id}
            role="group"
            aria-label="Application on conveyor"
            style={
              dragX ? { transform: `translateX(${dragX}px) rotate(${dragX / 20}deg)` } : undefined
            }
            onPointerDown={(e) => {
              if (disabled) return;
              pointer.current = e.clientX;
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (pointer.current !== null) setDragX(e.clientX - pointer.current);
            }}
            onPointerUp={(e) => {
              if (pointer.current === null) return;
              const delta = e.clientX - pointer.current;
              pointer.current = null;
              setDragX(0);
              if (Math.abs(delta) > 35) route(delta > 0 ? 'verified' : 'recycle');
            }}
            onPointerCancel={() => {
              pointer.current = null;
              setDragX(0);
            }}
          >
            <Icon name="mail" />
            <span>APPLICATION {6 - belt.packets.length} / 5</span>
            <strong>{packet.title}</strong>
            <p className={packet.valid ? 'packet-valid' : 'packet-invalid'}>{packet.evidence}</p>
            <small>← drag to a lane →</small>
          </div>
        ) : (
          <div className="belt-idle">
            <Icon name="printer" />
            <p>The conveyor is ready for a new batch.</p>
          </div>
        )}
      </div>
      {packet ? (
        <>
          <div className="sorting-lanes">
            <button disabled={disabled} onClick={() => route('recycle')}>
              ← Recycle <small>Bots & duplicates</small>
            </button>
            <span>
              {Math.max(0, Math.ceil((belt.deadline - game.elapsedMs) / 1000))}s<br />
              <small>{belt.score} correct</small>
            </span>
            <button disabled={disabled} onClick={() => route('verified')}>
              Verified → <small>Signed applications</small>
            </button>
          </div>
          <p className="control-hint">
            Drag, use the two lanes, or focus the belt and press ← / →.
          </p>
        </>
      ) : (
        <button
          className="station-primary"
          disabled={disabled || game.elapsedMs < belt.readyAt}
          onClick={() => operate({ type: 'sort-start' })}
        >
          {game.elapsedMs < belt.readyAt
            ? `Next batch in ${Math.ceil((belt.readyAt - game.elapsedMs) / 1000)}s`
            : `Start batch · up to ${Math.round(operationReward(game) * 1.5)} EC`}
        </button>
      )}
    </div>
  );
}
function Coffee() {
  const game = useGame((s) => s.game);
  const operate = useGame((s) => s.operate);
  const fill = brewFill(game.operations, game.elapsedMs);
  const brewing = game.operations.brew.startedAt !== null;
  const cooling = Math.max(0, Math.ceil((game.operations.brew.readyAt - game.elapsedMs) / 1000));
  const disabled = game.status !== 'running' || cooling > 0;
  const start = () => operate({ type: 'brew-start' });
  const release = () => operate({ type: 'brew-release' });
  return (
    <div className={`station-game coffee-game ${brewing ? 'is-brewing' : ''}`}>
      <div className="station-instructions">
        <h3>A surprisingly delicate reactor.</h3>
        <p>
          Hold to extract. Release inside the gold band for {game.desk.capacitor ? 25 : 15} seconds
          of double production. Too much and it overflows.
        </p>
      </div>
      <div className="coffee-machine" aria-hidden="true">
        <div className="machine-top">
          <i />
          <span>HUMAN FUEL</span>
        </div>
        <div className="coffee-spout" />
        <div className="coffee-stream" />
        <div className="coffee-cup">
          <div className="coffee-liquid" style={{ height: `${fill}%` }} />
          <div className="cup-target" />
          <span>OVERTIME</span>
        </div>
        <div className="machine-tray" />
        <i className="coffee-steam" />
      </div>
      <div
        className="brew-meter"
        role="meter"
        aria-label="Extraction"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(fill)}
      >
        <i className="brew-sweet-spot" />
        <b style={{ left: `${fill}%` }} />
      </div>
      <button
        className="station-primary brew-button"
        disabled={disabled}
        aria-label="Hold to brew"
        aria-pressed={brewing}
        onPointerDown={(e) => {
          e.preventDefault();
          e.currentTarget.focus();
          e.currentTarget.setPointerCapture(e.pointerId);
          start();
        }}
        onPointerUp={release}
        onPointerCancel={() => operate({ type: 'brew-cancel' })}
        onLostPointerCapture={() => {
          if (brewing) operate({ type: 'brew-cancel' });
        }}
        onKeyDown={(e) => {
          if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            release();
          }
        }}
        onBlur={() => {
          if (brewing) operate({ type: 'brew-cancel' });
        }}
      >
        {cooling
          ? `Reactor cooling · ${cooling}s`
          : brewing
            ? 'Release in the gold band!'
            : 'Hold to brew'}
      </button>
      <p className="control-hint">Hold with your pointer, Space or Enter. Gold band: 58–83%.</p>
    </div>
  );
}
function Network() {
  const game = useGame((s) => s.game);
  const operate = useGame((s) => s.operate);
  const grid = game.operations.grid;
  const connected = connectedTiles(game.operations);
  const wait = Math.max(0, Math.ceil((grid.readyAt - game.elapsedMs) / 1000));
  const points = ['25 0', '50 25', '25 50', '0 25'];
  return (
    <div className={`station-game network-game ${grid.solved ? 'network-solved' : ''}`}>
      <div className="station-instructions">
        <h3>Connect the dots. Then the countries.</h3>
        <p>
          Rotate the relays to carry the signal from IN to OUT. Every new connection permanently
          increases production, up to +25%.
        </p>
      </div>
      <div className="routing-puzzle">
        <span className="grid-inlet">IN →</span>
        <div className="routing-grid" aria-label="Relay routing puzzle">
          {grid.turns.map((_, i) => (
            <button
              key={i}
              className={connected.includes(i) ? 'tile-powered' : ''}
              aria-label={`Rotate relay ${i + 1}`}
              disabled={grid.solved || game.status !== 'running'}
              onClick={() => operate({ type: 'rotate', tile: i })}
            >
              <svg viewBox="0 0 50 50" aria-hidden="true">
                {pipePorts(game.operations, i).map((port) => (
                  <path key={port} d={`M25 25L${points[port]}`} />
                ))}
                <circle cx="25" cy="25" r="5" />
              </svg>
              <small>{i + 1}</small>
            </button>
          ))}
        </div>
        <span className="grid-outlet">→ OUT</span>
      </div>
      {grid.solved ? (
        <button
          className="station-primary"
          disabled={wait > 0 || game.status !== 'running'}
          onClick={() => operate({ type: 'grid-next' })}
        >
          {wait ? `Region connected · next in ${wait}s` : 'Connect another region'}
        </button>
      ) : (
        <div className="station-readout">
          <b>{connected.length}/9 relays carrying signal</b>
          <span>
            {grid.links} regions connected · +{Math.min(5, grid.links) * 5}% output
          </span>
        </div>
      )}
    </div>
  );
}
export function targetPoint(angle: number, power: number) {
  const radians = (angle * Math.PI) / 180;
  return { x: 50 + Math.cos(radians) * power * 0.4, y: 50 + Math.sin(radians) * power * 0.4 };
}
function Probes() {
  const game = useGame((s) => s.game);
  const operate = useGame((s) => s.operate);
  const probe = game.operations.probe;
  const flight = probe.flight;
  const target = flight
    ? { angle: flight.targetAngle, power: flight.targetPower }
    : probeTarget(game.operations, game.elapsedMs + 4000);
  const goal = targetPoint(target.angle, target.power);
  const aim = targetPoint(probe.angle, probe.power);
  const progress = flight
    ? Math.min(1, (game.elapsedMs - flight.startedAt) / (flight.arrivesAt - flight.startedAt))
    : 0;
  const moving = targetPoint(flight?.angle ?? 0, (flight?.power ?? 0) * progress);
  const disabled = game.status !== 'running' || !!flight;
  const wait = Math.max(0, Math.ceil((probe.readyAt - game.elapsedMs) / 1000));
  function aimAt(e: React.PointerEvent<HTMLDivElement>) {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100 - 50;
    const y = ((e.clientY - rect.top) / rect.height) * 100 - 50;
    operate({
      type: 'aim',
      angle: (Math.atan2(y, x) * 180) / Math.PI,
      power: Math.hypot(x, y) / 0.4,
    });
  }
  return (
    <div className="station-game probe-game">
      <div className="station-instructions">
        <h3>Remote work. Extremely remote.</h3>
        <p>
          Aim at the gold landing zone, then launch. Angle and range both matter. A successful probe
          opens a permanent branch in space.
        </p>
      </div>
      <div className="probe-layout">
        <div
          className="probe-arena"
          aria-label="Probe navigation field"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            aimAt(e);
          }}
          onPointerMove={(e) => {
            if (e.buttons === 1) aimAt(e);
          }}
        >
          <svg viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="23" />
            <circle cx="50" cy="50" r="37" />
            <path d="M50 4V96M4 50H96" />
            <line className="probe-trajectory" x1="50" y1="50" x2={aim.x} y2={aim.y} />
            <circle className="probe-home" cx="50" cy="50" r="6" />
            <circle className="probe-target" cx={goal.x} cy={goal.y} r="5" />
            <circle className="probe-reticle" cx={aim.x} cy={aim.y} r="2" />
            {flight && <circle className="probe-vessel" cx={moving.x} cy={moving.y} r="2" />}
          </svg>
          <span className="probe-map-label">
            SECTOR {String(probe.attempts + 1).padStart(3, '0')}
          </span>
        </div>
        <div className="probe-controls">
          <label>
            Launch angle <output>{Math.round(probe.angle)}°</output>
            <input
              aria-label="Launch angle"
              type="range"
              min="0"
              max="359"
              value={probe.angle}
              disabled={disabled}
              onChange={(e) =>
                operate({ type: 'aim', angle: Number(e.target.value), power: probe.power })
              }
            />
          </label>
          <label>
            Engine range <output>{Math.round(probe.power)}%</output>
            <input
              aria-label="Engine range"
              type="range"
              min="20"
              max="100"
              value={probe.power}
              disabled={disabled}
              onChange={(e) =>
                operate({ type: 'aim', angle: probe.angle, power: Number(e.target.value) })
              }
            />
          </label>
          <button
            className="station-primary"
            disabled={disabled || wait > 0}
            onClick={() => operate({ type: 'launch' })}
          >
            {flight
              ? `In flight · ${Math.ceil((flight.arrivesAt - game.elapsedMs) / 1000)}s`
              : wait
                ? `Refuelling · ${wait}s`
                : 'Launch probe ↗'}
          </button>
          <small>
            {probe.sectors} colonies · +{Math.min(8, probe.sectors) * 4}% production
          </small>
        </div>
      </div>
      <p className="control-hint">
        Drag on the chart or adjust the sliders. The gold ring predicts the destination at arrival.
      </p>
    </div>
  );
}
export function StationGame({ station }: { station: Station }) {
  return station === 'printer' ? (
    <Conveyor />
  ) : station === 'coffee' ? (
    <Coffee />
  ) : station === 'garden' ? (
    <Network />
  ) : (
    <Probes />
  );
}
