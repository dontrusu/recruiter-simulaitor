export type Rect = { x: number; y: number; w: number; h: number };

export type Slot = {
  id: string;
  space: 'room' | 'screen';
  rect: Rect;
  /** Whether the slot takes part in Hot-Desk Roulette. */
  reassignable: boolean;
};

export type Placement = {
  upgradeId: string;
  surface:
    | 'main_window'
    | 'screen_band'
    | 'screen_window'
    | 'tray'
    | 'desk'
    | 'front_desk'
    | 'wall'
    | 'global';
  slotId?: string;
};

export const slots: Slot[] = [
  // Screen slots around the main window
  { id: 'L1', space: 'screen', rect: { x: 8, y: 8, w: 164, h: 160 }, reassignable: true },
  { id: 'L2', space: 'screen', rect: { x: 8, y: 176, w: 164, h: 160 }, reassignable: true },
  { id: 'L3', space: 'screen', rect: { x: 8, y: 344, w: 164, h: 160 }, reassignable: true },
  { id: 'R1', space: 'screen', rect: { x: 628, y: 8, w: 164, h: 160 }, reassignable: true },
  { id: 'R2', space: 'screen', rect: { x: 628, y: 176, w: 164, h: 160 }, reassignable: true },
  { id: 'R3', space: 'screen', rect: { x: 628, y: 344, w: 164, h: 160 }, reassignable: true },
  { id: 'T1', space: 'screen', rect: { x: 180, y: 8, w: 440, h: 74 }, reassignable: false },
  { id: 'B1', space: 'screen', rect: { x: 180, y: 438, w: 440, h: 74 }, reassignable: false },

  // Wall slots
  { id: 'W1', space: 'room', rect: { x: 40, y: 80, w: 220, h: 280 }, reassignable: false },
  { id: 'W2', space: 'room', rect: { x: 1300, y: 80, w: 260, h: 220 }, reassignable: false },
  { id: 'W3', space: 'room', rect: { x: 1330, y: 330, w: 180, h: 140 }, reassignable: false },

  // Desk slots. D3 is deliberately absent.
  { id: 'D1', space: 'room', rect: { x: 40, y: 540, w: 140, h: 190 }, reassignable: true },
  { id: 'D2', space: 'room', rect: { x: 200, y: 520, w: 130, h: 210 }, reassignable: true },
  { id: 'D4', space: 'room', rect: { x: 1270, y: 610, w: 100, h: 120 }, reassignable: true },
  { id: 'D5', space: 'room', rect: { x: 1390, y: 620, w: 90, h: 110 }, reassignable: true },
  { id: 'D6', space: 'room', rect: { x: 1500, y: 630, w: 80, h: 100 }, reassignable: true },

  // Front-of-desk slots
  { id: 'F1', space: 'room', rect: { x: 60, y: 770, w: 160, h: 120 }, reassignable: false },
  { id: 'F2', space: 'room', rect: { x: 1300, y: 770, w: 140, h: 110 }, reassignable: false },
  { id: 'F3', space: 'room', rect: { x: 240, y: 760, w: 100, h: 130 }, reassignable: false },
  { id: 'F4', space: 'room', rect: { x: 1460, y: 760, w: 120, h: 130 }, reassignable: false },

  // Sticky-note anchors on the monitor bezel, anchored by top-left corner
  { id: 'N1', space: 'room', rect: { x: 430, y: 110, w: 40, h: 40 }, reassignable: false },
  { id: 'N2', space: 'room', rect: { x: 590, y: 110, w: 40, h: 40 }, reassignable: false },
  { id: 'N3', space: 'room', rect: { x: 750, y: 110, w: 40, h: 40 }, reassignable: false },
  { id: 'N4', space: 'room', rect: { x: 910, y: 110, w: 40, h: 40 }, reassignable: false },
  { id: 'N5', space: 'room', rect: { x: 1070, y: 110, w: 40, h: 40 }, reassignable: false },
  { id: 'N6', space: 'room', rect: { x: 360, y: 300, w: 40, h: 40 }, reassignable: false },
  { id: 'N7', space: 'room', rect: { x: 360, y: 460, w: 40, h: 40 }, reassignable: false },
  { id: 'N8', space: 'room', rect: { x: 1200, y: 300, w: 40, h: 40 }, reassignable: false },
];

export const placements: Placement[] = [
  { upgradeId: 'smart_reject', surface: 'main_window', slotId: 'reason_buttons' },
  { upgradeId: 'talent_pool', surface: 'screen_band', slotId: 'pool_band' },
  { upgradeId: 'culture_oracle', surface: 'desk', slotId: 'D4' },
  { upgradeId: 'buzzword_bingo', surface: 'wall', slotId: 'W1' },
  { upgradeId: 'open_role', surface: 'main_window', slotId: 'vacancy_panel' },
  { upgradeId: 'jd_optimizer', surface: 'main_window', slotId: 'vacancy_panel' },
  { upgradeId: 'lofi_player', surface: 'screen_window', slotId: 'L1' },
  { upgradeId: 'kevin_plant', surface: 'desk', slotId: 'D2' },
  { upgradeId: 'brewtus_coffee', surface: 'desk', slotId: 'D1' },
  { upgradeId: 'compassion_engine', surface: 'screen_window', slotId: 'T1' },
  { upgradeId: 'ai_interviewer', surface: 'screen_window', slotId: 'L3' },
  { upgradeId: 'funnel', surface: 'screen_window', slotId: 'B1' },
  { upgradeId: 'fairness_certificate', surface: 'wall', slotId: 'W3' },
  { upgradeId: 'org_chart', surface: 'wall', slotId: 'W2' },
  { upgradeId: 'wins_channel', surface: 'screen_window', slotId: 'R1' },
  { upgradeId: 'humbled_honored', surface: 'screen_window', slotId: 'R2' },
  { upgradeId: 'fun_cannon', surface: 'front_desk', slotId: 'F1' },
  { upgradeId: 'calm_corner', surface: 'screen_window', slotId: 'L2' },
  { upgradeId: 'swag_lootbox', surface: 'front_desk', slotId: 'F2' },
  { upgradeId: 'headcount_egg', surface: 'desk', slotId: 'D5' },
  { upgradeId: 'productivity_eye', surface: 'tray', slotId: 'tray_icon' },
  { upgradeId: 'jiggler_duck', surface: 'desk', slotId: 'D6' },
  { upgradeId: 'hot_desk', surface: 'global' },
  { upgradeId: 'replies_inbox', surface: 'screen_window', slotId: 'R3' },
  { upgradeId: 'hiring_freeze', surface: 'global' },
  { upgradeId: 'final_candidate', surface: 'main_window', slotId: 'candidate_card' },
];
