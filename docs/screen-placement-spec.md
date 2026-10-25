# Talent.OS. Layout specification

Version 1, October 23, 2026. This document describes where each game element sits on screen, its size and layer, and how the scene scales. It is written for a human reader and for an AI assistant that will implement the interface.

## 1. How to read this document

- All sizes are in logical pixels unless stated otherwise. Coordinates are measured from the top left corner of the parent block.
- DECIDED means an agreed decision. ASSUMED means an assumption that can change. OPEN means no decision has been made yet.
- The document does not cover balance, prices, upgrade texts or game logic. It covers placement, layers and scaling.
- Identifiers (slot id, upgrade id) are in English and can go into code unchanged.

## 2. Game context

Talent.OS is a satirical recruiter desk simulator. The player reviews candidate cards and picks a corporate reason to reject each one. Nobody is ever hired. The only currency is Credits. Upgrades add new objects and windows to the screen and the desk, and together they build visual and audio chaos.

Base rejection loop. The screen shows a vacancy with requirements and a candidate card with one small mismatch. Under the card are three reason buttons, one precise and two generic. A click rejects the candidate, who goes into the Talent Pool, and the next one appears. The game fires the event `onReject(candidate, reason)`, which every upgrade subscribes to.

## 3. Key decisions

1. DECIDED. The game has one screen with no switching between spaces. The scene is built from layers: wall, desk with objects, and monitor.
2. DECIDED. A Windows XP style monitor sits at the center of the scene. All game windows live on its screen.
3. DECIDED. The main Talent.OS window sits at the center of the monitor screen. Additional windows surround it in eight slots.
4. DECIDED. The Talent Pool is a strip at the bottom of the monitor screen, above the taskbar.
5. DECIDED. The shop is a permanent block to the right of the scene. It shows up to four upgrade cards. There are no vendor emails.
6. DECIDED. The Credits counter sits in the top bar of the page, not on the taskbar.
7. DECIDED. The top bar and the shop have a fixed pixel size and do not scale with the scene.
8. DECIDED. At the start of the game only the monitor screen is visible. The room is revealed when the player buys the first physical object, Culture Fit Oracle.
9. ASSUMED. The monitor is a beige 4:3 CRT.
10. ASSUMED. The taskbar with tray icons stays.

## 4. Page and scaling

| Element | Size | Scales with the scene |
| --- | --- | --- |
| Top bar (HUD) | height 48 px, full window width | no |
| Shop block | width 300 px, height equals the rest of the window | no |
| Scene | the rest of the width and height | yes |

The scene has a logical size of 1600×900. It sits at the center of its container and scales with `transform: scale`, with the origin at the center of the monitor screen, which is the point (800, 450) in room coordinates.

Room scale formula. `Ws` is the window width minus 300 px when the shop is visible, or the full width when it is not visible yet. `Hs` is the window height minus 48 px.

`s_room = clamp(0.65, min(Ws / 1600, Hs / 900), 1.5)`

If `min(...)` is below 0.65, the floor applies and the edges of the room are cropped around the monitor center.

Examples. At 1920×1080, Ws is 1620, Hs is 1032 and the scale is 1.0125. At 1366×768, Ws is 1066, Hs is 720 and the scale is 0.666.

Base text size for the card and reason buttons is 18 logical px. At the 0.65 floor this is about 12 px, and it must never go lower. Text in the shop and the top bar has a fixed pixel size and does not depend on scale.

The target platform is desktop, with a minimum resolution of 1366×768. A mobile layout is out of scope.

When the shop appears, `Ws` changes, so the scale is recalculated with a 400 ms animation to avoid a jump.

## 5. Scene (room)

The coordinate origin is the top left corner of the room. Size 1600×900.

| Element | Geometry |
| --- | --- |
| Wall | the whole room, visible above the desk line |
| Desk line | y = 700 |
| Desk surface | y from 700 to 900 |
| Monitor body | x from 360 to 1240, y from 110 to 790, size 880×680 |
| Screen | x from 400 to 1200, y from 150 to 750, size 800×600 |
| Screen center | (800, 450) |

The monitor stands on the desk, so its bottom overlaps the desk surface. The bezel around the screen is 40 px on every side.

### 5.1. Wall slots

Paper items hang on the wall. Text on them is decorative. A click opens an enlarged view (see section 8).

| Slot | Item | x | y | w | h |
| --- | --- | --- | --- | --- | --- |
| W1 | buzzword\_bingo | 40 | 80 | 220 | 280 |
| W2 | org\_chart (board) | 1300 | 80 | 260 | 220 |
| W3 | fairness\_certificate (frame) | 1330 | 330 | 180 | 140 |

### 5.2. Desk slots

Objects stand on the desk line, and their bottom is never lower than y = 730.

| Slot | Item | x | y | w | h |
| --- | --- | --- | --- | --- | --- |
| D1 | brewtus\_coffee | 40 | 540 | 140 | 190 |
| D2 | kevin\_plant | 200 | 520 | 130 | 210 |
| D4 | culture\_oracle | 1270 | 610 | 100 | 120 |
| D5 | headcount\_egg | 1390 | 620 | 90 | 110 |
| D6 | jiggler\_duck | 1500 | 630 | 80 | 100 |
| F1 | fun\_cannon (front of desk) | 60 | 770 | 160 | 120 |
| F2 | swag\_lootbox (front of desk) | 1300 | 770 | 140 | 110 |
| F3 | swag\_overflow\_left | 240 | 760 | 100 | 130 |
| F4 | swag\_overflow\_right | 1460 | 760 | 120 | 130 |

Slot D3 is deliberately absent. The keyboard is decor with no interaction, at x 520, y 800, w 560, h 80.

The plant grows upward only, with sprite height from 60 to 260. At the last growth stage the foliage may reach x = 420, which is 20 px into the screen, and only within the area of slot L1. The foliage has `pointer-events: none` and never covers the main window.

### 5.3. Sticky notes on the monitor bezel

Notes of 40×40 are stuck to the bezel, each rotated between minus 8 and plus 8 degrees. The maximum is 8, at these anchors:

| Number | x | y |
| --- | --- | --- |
| 1 | 430 | 110 |
| 2 | 590 | 110 |
| 3 | 750 | 110 |
| 4 | 910 | 110 |
| 5 | 1070 | 110 |
| 6 | 360 | 300 |
| 7 | 360 | 460 |
| 8 | 1200 | 300 |

## 6. Monitor screen

The coordinate origin is the top left corner of the screen. Size 800×600.

| Zone | Geometry |
| --- | --- |
| Work area | y from 0 to 520, x from 0 to 800 |
| Talent Pool strip | y from 520 to 568, height 48, full width |
| Taskbar | y from 568 to 600, height 32, full width |

### 6.1. Main window

Talent.OS: x 180, y 90, size 440×340. This window always sits above every other window.

Internal layout in window coordinates. The title bar takes y from 0 to 24.

| Element | x | y | w | h |
| --- | --- | --- | --- | --- |
| vacancy\_panel | 8 | 32 | 126 | 200 |
| candidate\_card | 142 | 32 | 290 | 200 |
| reason\_buttons | 8 | 240 | 424 | 92 |

reason\_buttons holds three 424×28 buttons stacked with a 4 px gap. A line in the card fits about 28 characters at 18 px text. The requirement list in vacancy\_panel scrolls vertically with no visible scrollbar.

### 6.2. Slots around the main window

| Slot | x | y | w | h | Window |
| --- | --- | --- | --- | --- | --- |
| L1 | 8 | 8 | 164 | 160 | lofi\_player |
| L2 | 8 | 176 | 164 | 160 | calm\_corner |
| L3 | 8 | 344 | 164 | 160 | ai\_interviewer |
| R1 | 628 | 8 | 164 | 160 | wins\_channel |
| R2 | 628 | 176 | 164 | 160 | humbled\_honored |
| R3 | 628 | 344 | 164 | 160 | replies\_inbox |
| T1 | 180 | 8 | 440 | 74 | compassion\_engine |
| B1 | 180 | 438 | 440 | 74 | funnel |

A gap of 8 px remains between the slots and the main window.

### 6.3. Talent Pool

- The strip is docked above the taskbar, and windows do not cover it.
- A candidate avatar is 24×24. At most 60 sprites are shown at once. The rest are counted only in the `On file: N` counter at the right end of the strip.
- Each sprite has two CSS animations. A horizontal drift with an amplitude from 20 to 80 px and a period from 8 to 20 s. A vertical bob of plus or minus 2 px with a period from 2 to 4 s.
- Occasionally a random sprite raises a hand (a separate CSS class).
- The avatar is assembled from the parameters skinTone, hairStyle, hairColor, shirtColor, ringColor and accessory. The generator uses `candidate.id` as the seed. The same avatar is drawn at 96×96 on the card.
- Recurring characters (for example, Oleg) have a fixed look with the glasses accessory.
- The funnel sits in slot B1. Its spout is at the point (400, 512). A paper sprite falls vertically from the spout to y = 540, after which an avatar appears at that x and starts to drift.

### 6.4. Taskbar and tray

- Start: x from 0 to 96. A decorative button.
- Window buttons: x from 104 to 592. They mirror the open windows of the slots, with at most 6 visible. A click raises the window in its slot.
- Tray: x from 600 to 800. Icons are 20×20 with an 8 px gap, placed right to left from the clock. The clock is 56 wide and sits at the right edge.
- Tray icons. productivity\_eye (hover shows the Activity score) and compassion\_engine (a click opens the Warmth slider).
- Notification balloons appear above the tray and stack upward.
- Credits are not shown on the taskbar.

## 7. Layers (z-order)

Room layers from back to front.

1. Wall.
2. Wall items (W1 to W3).
3. Desk.
4. Desk items (D1 to D6).
5. Monitor body and bezel notes.
6. Monitor screen (a separate stacking context, screen layers are listed below).
7. Foreground. Plant foliage, F1 to F4, the keyboard.
8. Confetti overlay across the whole scene, `pointer-events: none`.
9. Detail views that the player opened.

Screen layers from back to front.

- s0. Wallpaper.
- s1. Pool strip and taskbar.
- s2. Windows in the eight slots.
- s3. Automatic popups (balloons, error dialogs).
- s4. The main Talent.OS window.
- s5. Fake cursor, `pointer-events: none`.
- s6. Finale overlay (frost, water), `pointer-events: none`.

## 8. Overflow and chaos rules

- Each slot has one window, assigned by the table in section 6.2. When a second window lands in a slot, it is offset by (12, 12) from the previous one. The stack is at most 3 deep. A fourth window minimizes the oldest one into a taskbar button.
- Desk slots take one item each. Extra items from the lootbox go into F3 and F4 with a random offset of plus or minus 12 px and a rotation of plus or minus 8 degrees. The maximum is 20 sprites, and the rest are counted only in the lootbox counter.
- Sticky notes on the monitor bezel are limited to 8.
- At most 3 balloons are visible. Each disappears on click or after 6 seconds and has no effect on gameplay.
- Automatic popups never cover the main window rectangle (screen x from 180 to 620, y from 90 to 430). Detail views that the player opened may cover it, because the player closes them by clicking outside or with the Close button.
- Hot-Desk Roulette swaps windows between slots L1, L2, L3, R1, R2, R3 and items between slots D1, D2, D4, D5, D6 once every N rejections. The transition takes 600 ms. Slots T1, B1, F1 to F4, W1 to W3 and the main window do not move. Window sizes do not change.
- Decorative layers above the main window have `pointer-events: none`.

## 9. Camera

- State A, screen. Scale `s_zoom = min(Ws / 800, Hs / 600)` with the origin at (800, 450). Only the monitor screen is visible, and the room is cropped. This state lasts until culture\_oracle is bought.
- State B, room. Scale `s_room` from section 4.
- Transition from A to B. 1500 ms, ease-in-out. It starts when culture\_oracle is bought. The top bar and the shop do not change.
- Finale, Hiring Freeze. The sequence is as follows. First, the windows frost over one by one and the sounds fade. Second, the pool strip grows to the full height of the screen over 4 s. Third, the water spills over the bezel and fills the room from the bottom up. Fourth, the last card, final\_candidate, appears on the water in the standard card component.

## 10. Top bar and shop

### 10.1. Top bar

Height 48 px, full window width. The Credits counter is on the left (24 px font). Next to it is `Rejected: N`. The right side holds an empty reserved spot for a news ticker (OPEN, not used in version 1). The style is the header of a corporate intranet.

### 10.2. Shop

- Width 300 px, padding 12, gap between cards 8.
- Up to four cards at once. A bought card disappears with an animation, and the next one from the queue slides into its place.
- A card has a minimum height of 104 px. On the left is a 48×48 sprite. On the right are the name, a slogan of up to 60 characters over two lines (13 px font), the price and a Buy button.
- The slogan names the problem the upgrade solves. For example, Too many clicks? Press Tab.
- A new card has a NEW badge. If Credits are below the price, the button is inactive.
- There is no panel before the first card. It slides in over 400 ms together with the first offer.
- The card order matches the Order column in section 11.

## 11. Upgrade placement

| Order | Id | Name | Surface | Slot or anchor | Note |
| --- | --- | --- | --- | --- | --- |
| 1 | smart\_reject | Smart Reject | main\_window | reason\_buttons | Gray Tab hint on the most frequent reason |
| 2 | talent\_pool | Talent Pool | screen\_band | pool\_band | On file counter |
| 3 | culture\_oracle | Culture Fit Oracle | desk | D4 | Triggers the camera transition from A to B |
| 4 | buzzword\_bingo | Buzzword Bingo | wall | W1 | A click opens an enlarged view |
| 5 | open\_role | Open Role | main\_window | vacancy\_panel | Counter of days open and reposts |
| 6 | jd\_optimizer | JD Optimizer | main\_window | vacancy\_panel | Appends requirements to the list |
| 7 | lofi\_player | Lo-Fi Beats to Reject To | screen\_window | L1 | Player window |
| 8 | kevin\_plant | Kevin the Succulent | desk | D2 | Grows upward only, foliage reaches x = 420 |
| 9 | brewtus\_coffee | Brewtus the Coffee Machine | desk | D1 | Smoke stays inside the slot |
| 10 | compassion\_engine | Compassion Engine | screen\_window | T1 | Warmth slider and a letter line, also a tray icon |
| 11 | ai\_interviewer | Your AI Interviewer | screen\_window | L3 | Two static avatars, subtitles |
| 12 | funnel | The Funnel | screen\_window | B1 | Spout at (400, 512) |
| 13 | fairness\_certificate | Fairness Certificate | wall | W3 | A click opens the report |
| 14 | org\_chart | Org Chart | wall | W2 | Grows with every upgrade |
| 15 | wins\_channel | #wins Channel | screen\_window | R1 | Feed of lines |
| 16 | humbled\_honored | Humbled and Honored | screen\_window | R2 | Feed of posts |
| 17 | fun\_cannon | Mandatory Fun Cannon | front\_desk | F1 | Confetti overlay, team photo window as an automatic popup |
| 18 | calm\_corner | Calm Corner | screen\_window | L2 | Breathing circle with subtitles |
| 19 | swag\_lootbox | Swag Lootbox | front\_desk | F2 | Items go into F3 and F4 |
| 20 | headcount\_egg | Headcount | desk | D5 | Three states |
| 21 | productivity\_eye | Productivity Eye | tray | tray\_icon | Hover shows the Activity score |
| 22 | jiggler\_duck | Mouse Jiggler Duck | desk | D6 | Fake cursor in layer s5 |
| 23 | hot\_desk | Hot-Desk Roulette | global | none | Reshuffle per the rules in section 8 |
| 24 | replies\_inbox | Re: Your Application | screen\_window | R3 | Balloons from the tray for new replies |
| 25 | hiring\_freeze | Hiring Freeze | global | none | Finale per section 9 |
| 26 | final\_candidate | Final card | main\_window | candidate\_card | Standard card component |

## 12. Configuration schema

Slots and placements are best kept as data rather than code.

```ts
type Rect = { x: number; y: number; w: number; h: number };

type Slot = {
  id: string;
  space: 'room' | 'screen';
  rect: Rect;
  reassignable: boolean; // whether it takes part in Hot-Desk Roulette
};

type Placement = {
  upgradeId: string;
  surface: 'main_window' | 'screen_band' | 'screen_window' | 'tray' | 'desk' | 'front_desk' | 'wall' | 'global';
  slotId?: string;
};

const slots: Slot[] = [
  { id: 'L1', space: 'screen', rect: { x: 8, y: 8, w: 164, h: 160 }, reassignable: true },
  { id: 'T1', space: 'screen', rect: { x: 180, y: 8, w: 440, h: 74 }, reassignable: false },
  { id: 'D2', space: 'room', rect: { x: 200, y: 520, w: 130, h: 210 }, reassignable: true },
];

const placements: Placement[] = [
  { upgradeId: 'lofi_player', surface: 'screen_window', slotId: 'L1' },
  { upgradeId: 'kevin_plant', surface: 'desk', slotId: 'D2' },
];
```

## 13. Invariants

- The main Talent.OS window always sits above every other window on the screen.
- The three reason buttons are always clickable. No decorative layer intercepts events on them.
- The top bar and the shop have a fixed pixel size and do not depend on the scene scale.
- Card text after scaling is never smaller than 12 px.
- Automatic popups never cover the main window.
- The pool shows at most 60 sprites, the shop at most 4 cards, and the monitor bezel at most 8 notes.
- Chaos is purely visual. It does not block the game and does not penalize the player.

## 14. Open questions

1. OPEN. A 4:3 CRT or a flat monitor. This document assumes a CRT. A flat monitor takes room away from the desk objects.
2. OPEN. The exact look of the finale, including whether the camera pulls back below the 0.65 scale floor.
3. OPEN. A news ticker in the top bar.
4. OPEN. Whether screen windows should be draggable. In version 1 the windows stay in fixed slots.
5. OPEN. A mobile layout. The room does not fit a vertical screen, so a separate scheme is needed.
6. OPEN. Wallpapers and window frames. The original Bliss image and the XP look belong to Microsoft, so a public game needs original painted assets in a similar style, without the Windows name.
7. OPEN. The size of the enlarged detail view for each wall and desk item.
