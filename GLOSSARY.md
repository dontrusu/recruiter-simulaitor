# Talent.OS

A satirical game about corporate recruiting: the player reviews strong candidates against an
increasingly absurd vacancy and rejects every one of them. This glossary is the canonical
vocabulary of the game's world and progression — use these terms in issues, design notes, tests,
and code. It is a glossary and nothing else: no technical decisions, no numbers, no layout.

## Language

### People and the opening

**Candidate**:
A person who has applied to the vacancy. The same person can appear again and again as a fresh
applicant — Oleg is the canonical example, returning each time with slightly more experience.
_Avoid_: Applicant, user, subject

**Vacancy**:
The single role the player is recruiting for. It begins plausible and bloats as requirements are
added to it; one candidate is reviewed against it at a time.

**Mismatch**:
The one specific gap between a candidate's experience and the vacancy's requirements. Each
appearance has exactly one, and it is what makes a reason precise or generic.

### Review and rejection

**Rejection**:
Ending a candidate's review with a stated corporate reason. It is the only decision the player can
reach — nobody is ever hired.
_Avoid_: Closing, declining, refusing

**Reason**:
The stated cause of a rejection. Reasons are the game's core choice, and there are only two kinds.

**Precise reason**:
A reason that names the candidate's mismatch, using the same skill or requirement the mismatch is
about. Pays the most Credits.

**Generic reason**:
A corporate-sounding, unfalsifiable reason ("Not a culture fit"). Pays fewer Credits than a precise
reason. Choosing one is never punished — it only earns less.
_Avoid_: Vague reason, canned reason

**Rejection count**:
The running total of rejections, presented as corporate funnel health. It counts decisions, not
people: a candidate rejected twice counts twice.

**Praise**:
The congratulatory messages that treat the rejection count as good news. Baseline from the first
rejection — nothing has to be purchased for it to appear.

**Milestone**:
A round rejection count at which praise appears.

**Talent Pool**:
Where rejected candidates go. Their faces stay in the workspace, and a candidate can return from it
later with updated experience. It is the visual through-line of the game.
_Avoid_: Pool, backlog, archive, graveyard

### Economy

**Credits**:
The game's only currency, earned by rejecting candidates and spent on upgrades. Shown on screen as
"EC".
_Avoid_: Points, gold, money, currency

### Progression

**Upgrade**:
A purchased tool that changes how the player works. Upgrades arrive in a fixed order, and each one
answers a problem the previous one created.
_Avoid_: Item, perk, unlock, power-up

**Chain of band-aids**:
The progression model: every upgrade fixes the wound the previous "improvement" caused, so the
workspace accumulates remedies instead of getting better.

**Role drift**:
The slow change in the player's job — judge, then operator, then desk caretaker, then ritual
participant, then spectator. Earlier roles do not disappear; they sink under newer ones.
_Avoid_: Stages, levels, phases

**Slice**:
An implementation milestone defined by what it proves with a player, not by feature completeness.
Slice 1 is the manual rejection loop with Credits, Smart Reject, and Talent Pool.
_Avoid_: Milestone, iteration, sprint

**Finale**:
The game's ending, in which the vacancy freezes and an unending candidate arrives. Deferred until a
working game exists.
_Avoid_: Ending, win state, game over

### Physical surfaces

**Room**:
The physical office around the monitor: wall, desk, and objects that sit on or hang from them.
1600×900 logical pixels, scaled to fit the browser viewport.
_Avoid_: Scene, stage, background

**Monitor**:
The physical CRT sitting on the desk. Its bezel frames the Screen, and its body overlaps the desk
surface. Beige 4:3 CRT with a 40 px bezel on every side. Its geometry is x 360–1240, y 110–790.
_Avoid_: Display, device, terminal

**Screen**:
The 800×600 rectangle inside the Monitor bezel where all game windows and the Talent Pool live.
It is a separate coordinate space nested inside the Room. Its geometry is x 400–1200, y 150–750.
_Avoid_: Display, viewport, canvas

**Slot**:
A named, fixed rectangle on the Screen that holds one game window. Eight slots surround the main
Talent.OS window (L1–L3, R1–R3, T1, B1). Slots are closed by default and open when an Upgrade
lands in them.
_Avoid_: Zone, position, cell

**Shop**:
The 300 px-wide panel to the right of the Room. It shows up to four Upgrade cards and does not
scale with the Room. It is outside the Monitor entirely.
_Avoid_: Store, market, vendor panel

**Taskbar**:
The 32 px-high bar at the bottom of the Screen (y 568–600). It holds the Start button, window
buttons, tray icons, and the clock.
_Avoid_: Dock, status bar, footer