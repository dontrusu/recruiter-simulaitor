# Talent.OS. Layout specification

> Historical specification: the Soft System migration in [issue #26](https://github.com/dontrusu/recruiter-simulaitor/issues/26) supersedes its geometry, Reason controls, Shop, and window stacking rules.

Version 1, October 23, 2026. This document describes where each game element sits on screen, its size and layer, and how the scene scales. It is written for a human reader and for an AI assistant that will implement the interface.

For the current first visual slice, [issue #17](https://github.com/dontrusu/recruiter-simulaitor/issues/17)
and [ADR-0006](./adr/0006-visual-first-screen-and-room.md) are authoritative. The current geometry
and camera behavior below follow that slice. Sections explicitly marked deferred preserve ideas
for the evolved game; they are not requirements for the clean start composition.

## 1. How to read this document

- All sizes are in logical pixels unless stated otherwise. Coordinates are measured from the top left corner of the parent block.
- DECIDED means an agreed decision. ASSUMED means an assumption that can change. OPEN means no decision has been made yet.
- The document does not cover balance, prices, upgrade texts or game logic. It covers placement, layers and scaling.
- Identifiers (slot id, upgrade id) are in English and can go into code unchanged.

## 2. Game context

Talent.OS is a satirical recruiter desk simulator. The player reviews candidate cards and picks a corporate reason to reject each one. Nobody is ever hired. The only currency is Credits. Upgrades add new objects and windows to the screen and the desk, and together they build visual and audio chaos.

Base rejection loop. The Screen shows a Vacancy, one current Application, and three Reason
buttons: one precise and two generic. A Rejection updates Credits, Rejected, and the next
Application in one shared-store transition. The first slice does not retain rejected Applications
or implement Talent Pool behavior. Views read the run state; there is no global rejection event bus.

## 3. Key decisions

1. The Room and Screen are two presentations of one run. Switching changes only workspace state.
2. Fresh loads start in Screen composition. Only `?dev=1` exposes the development camera Button,
   labeled `Camera: Screen` or `Camera: Room`. The opt-in also works in a production build.
3. The clean Screen contains the Vacancy, current Application, Reasons, Rejected, and Credits.
   There is no outer HUD, Taskbar, Talent Pool band, vendor window, or evolved-game clutter.
4. The Shop is always visible as a fixed 300px column outside the transformed composition, with
   two inert previews: Smart Reject and Talent Pool.
5. Culture Fit Oracle purchases and normal-gameplay Room unlocking are deferred.
6. Room objects use the central CSS palette and semantic tokens; typography uses the shared
   Tailwind font roles. Base furniture can be axis-aligned placeholders.

## 4. Page and scaling

| Element | Logical size                     | Scaling                                        |
| ------- | -------------------------------- | ---------------------------------------------- |
| Shop    | 300px wide, full viewport height | fixed, outside the composition                 |
| Room    | 1600×900                         | uniform fit in the space beside the Shop       |
| Screen  | 1440×900                         | uniform fit into the Monitor's 800×500 opening |

`Ws` is the viewport width minus the fixed 300px Shop; `Hs` is the full viewport height.
The camera centers the Monitor at Room coordinates (800, 450).

- Screen composition: `s_screen = min(Ws / 800, Hs / 500)`.
- Room composition: `s_room = min(Ws / 1600, Hs / 900)`.
- No scale floor, maximum scale, minimum viewport width, or separate mobile layout is applied.
- Resizing updates the fit immediately. Development camera toggles animate over 1500ms.

At 1920×1080, Room scale is 1.0125. At 1366×768 it is 0.66625; at 1100×700 it is 0.5.
The 1440×900 Screen is composed once and fitted at 5/9 scale inside the Monitor in either view.
The Screen camera clips the surroundings at the Monitor opening; Room reveals the full canvas.

## 5. Scene (room)

The coordinate origin is the top left corner of the room. Size 1600×900.

| Element       | Geometry                                            |
| ------------- | --------------------------------------------------- |
| Wall          | the whole room, visible above the desk line         |
| Desk line     | y = 700                                             |
| Desk surface  | y from 700 to 900                                   |
| Monitor body  | x from 360 to 1240, y from 160 to 740, size 880×580 |
| Screen        | x from 400 to 1200, y from 200 to 700, size 800×500 |
| Screen center | (800, 450)                                          |

The monitor stands on the desk, so its bottom overlaps the desk surface. The bezel around the screen is 40 px on every side.

### 5.1. Wall slots (deferred)

Paper items hang on the wall. Text on them is decorative. A click opens an enlarged view (see section 8).

| Slot | Item                          | x    | y   | w   | h   |
| ---- | ----------------------------- | ---- | --- | --- | --- |
| W1   | buzzword\_bingo               | 40   | 80  | 220 | 280 |
| W2   | org\_chart (board)            | 1300 | 80  | 260 | 220 |
| W3   | fairness\_certificate (frame) | 1330 | 330 | 180 | 140 |

### 5.2. Desk slots (deferred)

Objects stand on the desk line, and their bottom is never lower than y = 730.

| Slot | Item                          | x    | y   | w   | h   |
| ---- | ----------------------------- | ---- | --- | --- | --- |
| D1   | brewtus\_coffee               | 40   | 540 | 140 | 190 |
| D2   | kevin\_plant                  | 200  | 520 | 130 | 210 |
| D4   | culture\_oracle               | 1270 | 610 | 100 | 120 |
| D5   | headcount\_egg                | 1390 | 620 | 90  | 110 |
| D6   | jiggler\_duck                 | 1500 | 630 | 80  | 100 |
| F1   | fun\_cannon (front of desk)   | 60   | 770 | 160 | 120 |
| F2   | swag\_lootbox (front of desk) | 1300 | 770 | 140 | 110 |
| F3   | swag\_overflow\_left          | 240  | 760 | 100 | 130 |
| F4   | swag\_overflow\_right         | 1460 | 760 | 120 | 130 |

Slot D3 is deliberately absent. The keyboard is decor with no interaction, at x 520, y 800, w 560, h 80.

The plant grows upward only, with sprite height from 60 to 260. At the last growth stage the foliage may reach x = 420, which is 20 px into the screen, and only within the area of slot L1. The foliage has `pointer-events: none` and never covers the main window.

### 5.3. Sticky notes on the monitor bezel (deferred)

Notes of 40×40 are stuck to the bezel, each rotated between minus 8 and plus 8 degrees. The maximum is 8, at these anchors:

| Number | x    | y   |
| ------ | ---- | --- |
| 1      | 430  | 110 |
| 2      | 590  | 110 |
| 3      | 750  | 110 |
| 4      | 910  | 110 |
| 5      | 1070 | 110 |
| 6      | 360  | 300 |
| 7      | 360  | 460 |
| 8      | 1200 | 300 |

## 6. Monitor Screen

The canonical Screen is 1440×900 and fills the 800×500 opening uniformly. Its header owns the
Credits and Rejected counters. The editorial review composition contains the Vacancy, Candidate
card, and three Reason buttons, followed by a bottom text note. There is no Taskbar or Talent Pool
band. Both camera compositions render this same live Screen, including Rejection feedback.

The earlier 800×600 window/slot grid is superseded. Additional windows, named Screen slots,
Talent Pool sprites, tray icons, and their placement need a new layout decision when implemented.
They must not reserve space or cover the clean review UI in this slice.

## 7. Evolved-game layers (deferred)

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

## 8. Overflow and chaos rules (deferred)

- Each slot has one window, assigned by the table in section 6.2. When a second window lands in a slot, it is offset by (12, 12) from the previous one. The stack is at most 3 deep. A fourth window minimizes the oldest one into a taskbar button.
- Desk slots take one item each. Extra items from the lootbox go into F3 and F4 with a random offset of plus or minus 12 px and a rotation of plus or minus 8 degrees. The maximum is 20 sprites, and the rest are counted only in the lootbox counter.
- Sticky notes on the monitor bezel are limited to 8.
- At most 3 balloons are visible. Each disappears on click or after 6 seconds and has no effect on gameplay.
- Automatic popups never cover the main window rectangle (screen x from 180 to 620, y from 90 to 430). Detail views that the player opened may cover it, because the player closes them by clicking outside or with the Close button.
- Hot-Desk Roulette swaps windows between slots L1, L2, L3, R1, R2, R3 and items between slots D1, D2, D4, D5, D6 once every N rejections. The transition takes 600 ms. Slots T1, B1, F1 to F4, W1 to W3 and the main window do not move. Window sizes do not change.
- Decorative layers above the main window have `pointer-events: none`.

## 9. Camera

`Screen` and `Room` use the calculations in section 4. The development-only opt-in changes camera
presentation without changing Candidate/Application, Vacancy, Rejected, or Credits. The Shop stays
outside the camera transform and clipping. Culture Fit Oracle unlocking and Finale camera effects
are deferred.

## 10. Screen counters and Shop

Credits and Rejected live in the scaled Screen header. There is no fixed outer TopBar.
The Shop remains a fixed 300px column for the full viewport height. Its two previews are static,
non-focusable, and non-activatable. Purchases, card queues, and effects are deferred.

## 11. Upgrade placement (deferred)

| Order | Id                    | Name                       | Surface        | Slot or anchor  | Note                                                      |
| ----- | --------------------- | -------------------------- | -------------- | --------------- | --------------------------------------------------------- |
| 1     | smart\_reject         | Smart Reject               | main\_window   | reason\_buttons | Gray Tab hint on the most frequent reason                 |
| 2     | talent\_pool          | Talent Pool                | screen\_band   | pool\_band      | On file counter                                           |
| 3     | culture\_oracle       | Culture Fit Oracle         | desk           | D4              | Triggers the camera transition from A to B                |
| 4     | buzzword\_bingo       | Buzzword Bingo             | wall           | W1              | A click opens an enlarged view                            |
| 5     | open\_role            | Open Role                  | main\_window   | vacancy\_panel  | Counter of days open and reposts                          |
| 6     | jd\_optimizer         | JD Optimizer               | main\_window   | vacancy\_panel  | Appends requirements to the list                          |
| 7     | lofi\_player          | Lo-Fi Beats to Reject To   | screen\_window | L1              | Player window                                             |
| 8     | kevin\_plant          | Kevin the Succulent        | desk           | D2              | Grows upward only, foliage reaches x = 420                |
| 9     | brewtus\_coffee       | Brewtus the Coffee Machine | desk           | D1              | Smoke stays inside the slot                               |
| 10    | compassion\_engine    | Compassion Engine          | screen\_window | T1              | Warmth slider and a letter line, also a tray icon         |
| 11    | ai\_interviewer       | Your AI Interviewer        | screen\_window | L3              | Two static avatars, subtitles                             |
| 12    | funnel                | The Funnel                 | screen\_window | B1              | Spout at (400, 512)                                       |
| 13    | fairness\_certificate | Fairness Certificate       | wall           | W3              | A click opens the report                                  |
| 14    | org\_chart            | Org Chart                  | wall           | W2              | Grows with every upgrade                                  |
| 15    | wins\_channel         | #wins Channel              | screen\_window | R1              | Feed of lines                                             |
| 16    | humbled\_honored      | Humbled and Honored        | screen\_window | R2              | Feed of posts                                             |
| 17    | fun\_cannon           | Mandatory Fun Cannon       | front\_desk    | F1              | Confetti overlay, team photo window as an automatic popup |
| 18    | calm\_corner          | Calm Corner                | screen\_window | L2              | Breathing circle with subtitles                           |
| 19    | swag\_lootbox         | Swag Lootbox               | front\_desk    | F2              | Items go into F3 and F4                                   |
| 20    | headcount\_egg        | Headcount                  | desk           | D5              | Three states                                              |
| 21    | productivity\_eye     | Productivity Eye           | tray           | tray\_icon      | Hover shows the Activity score                            |
| 22    | jiggler\_duck         | Mouse Jiggler Duck         | desk           | D6              | Fake cursor in layer s5                                   |
| 23    | hot\_desk             | Hot-Desk Roulette          | global         | none            | Reshuffle per the rules in section 8                      |
| 24    | replies\_inbox        | Re: Your Application       | screen\_window | R3              | Balloons from the tray for new replies                    |
| 25    | hiring\_freeze        | Hiring Freeze              | global         | none            | Finale per section 9                                      |
| 26    | final\_candidate      | Final card                 | main\_window   | candidate\_card | Standard card component                                   |

## 12. Configuration schema (deferred proposal)

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

- Screen and Room share one live Screen and one run state.
- The three Reason buttons remain clickable in both compositions.
- The Shop stays 300px wide outside camera transforms and clipping.
- Room and Screen proportions remain constant through resize and camera switches.
- No deferred Talent Pool, Taskbar, or Upgrade UI appears in the clean first slice.
- Decorative layers do not intercept input.

## 14. Open questions

1. OPEN. A 4:3 CRT or a flat monitor. This document assumes a CRT. A flat monitor takes room away from the desk objects.
2. OPEN. The exact look of the Finale and its camera behavior.
3. OPEN. A news ticker in the top bar.
4. OPEN. Whether screen windows should be draggable. In version 1 the windows stay in fixed slots.
5. OPEN. A mobile layout. The room does not fit a vertical screen, so a separate scheme is needed.
6. OPEN. Wallpapers and window frames. The original Bliss image and the XP look belong to Microsoft, so a public game needs original painted assets in a similar style, without the Windows name.
7. OPEN. The size of the enlarged detail view for each wall and desk item.
