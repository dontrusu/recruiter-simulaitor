import type { ReactNode } from 'react';
import { useWorkspaceStore } from '@/core/store/workspace';
import { Sprite } from '@/views/shop/PixelArt';
import './preset-room.css';

function Prop({ kind, children }: { kind: string; children: ReactNode }) {
  return (
    <div className={`room-prop prop-${kind}`} aria-hidden="true">
      <span className="room-prop-art">{children}</span>
    </div>
  );
}

export function PresetRoom() {
  const preset = useWorkspaceStore((state) => state.preset);
  if (preset === 'start') return null;
  return (
    <>
      <Prop kind="bingo">
        <strong>Buzzword Bingo</strong>
        <span className="bingo-grid">
          {[
            'Synergy',
            'Bandwidth',
            'Circle back',
            'Pivot',
            'Free',
            'Leverage',
            'Alignment',
            'Ideate',
            'Deep dive',
          ].map((word) => (
            <span key={word}>{word}</span>
          ))}
        </span>
      </Prop>
      <Prop kind="oracle">
        <span className="oracle-art">
          <span className="oracle-ball">
            <b>8</b>
          </span>
          <span className="oracle-foot" />
        </span>
      </Prop>
      {preset === 'chaos' && (
        <>
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
          <Prop kind="kevin">
            <Sprite kind="plant" />
            <i className="kevin-tag">Water me</i>
          </Prop>
          <Prop kind="coffee">
            <span className="coffee-steam">
              <i />
              <i />
              <i />
            </span>
            <span className="coffee-machine">
              <b>BREWTUS</b>
              <span className="coffee-face">•‿•</span>
              <span className="coffee-bay">
                <Sprite kind="cup" />
              </span>
            </span>
          </Prop>
          <Prop kind="org">
            <header>ORG CHART</header>
            <span className="room-org-tree">
              <b>VP of Vibes</b>
              <span>Head of Kevin · Chief Coffee Officer</span>
              <b>Interview Ivan</b>
            </span>
          </Prop>
          <Prop kind="audit">
            <strong>Bias Audit</strong>
            <b className="audit-seal">✓</b>
            <span>Passed</span>
          </Prop>
          <Prop kind="cannon">
            <span className="cannon-barrel">
              <i />
            </span>
            <span className="cannon-base" />
          </Prop>
          <Prop kind="swag">
            <span className="swag-box">
              <i />
            </span>
          </Prop>
          <Prop kind="egg">
            <span className="room-egg">
              <i />
            </span>
          </Prop>
          <Prop kind="duck">
            <Sprite kind="duck" />
          </Prop>
        </>
      )}
    </>
  );
}
