export const windowSlots = [
  { id: "L1", kind: "music", label: "Lo-Fi", height: 260 },
  { id: "L2", kind: "calm", label: "Calm Corner", height: 190 },
  { id: "L3", kind: "interviewer", label: "AI Interviewer", height: 270 },
  { id: "R1", kind: "wins", label: "#wins", height: 250 },
  { id: "R2", kind: "compassion", label: "Compassion Engine", height: 260 },
  { id: "R3", kind: "social", label: "Humbled & Honored", height: 220 },
  { id: "R4", kind: "inbox", label: "Inbox", height: 190 },
  { id: "B1", kind: "funnel", label: "Funnel", height: 180 },
] as const;

export type WindowKind = (typeof windowSlots)[number]["kind"];
export type SlotId = (typeof windowSlots)[number]["id"];

export function SlotGuides() {
  return (
    <div className="slot-guides" aria-label="Схема слотів вікон" lang="uk">
      {windowSlots.map((slot) => (
        <div
          key={slot.id}
          className="slot-guide slot-position"
          data-slot={slot.id}
          style={{ minHeight: slot.height }}
        >
          <span className="slot-label">
            <b>{slot.id}</b> · {slot.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export const windowUpgradeNames: Record<WindowKind, string> = {
  music: "Lo-Fi Beats to Reject To",
  calm: "Calm Corner",
  interviewer: "Your AI Interviewer",
  wins: "#wins Channel",
  compassion: "Compassion Engine™",
  social: "Humbled & Honored™",
  inbox: "Re: Your Application",
  funnel: "The Funnel",
};
