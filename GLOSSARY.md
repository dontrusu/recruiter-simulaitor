# Talent.OS

A satirical game about corporate recruiting: the player reviews strong candidates against an
increasingly absurd vacancy and rejects every one of them. This glossary is the canonical
vocabulary of the game's world and progression — use these terms in issues, design notes, tests,
and code. It is a glossary and nothing else: no technical decisions, no numbers, no layout.

## Language

### People and the opening

**Candidate**:
A person who has submitted one or more Applications to the Vacancy. The same Candidate can return
with a new Application and additional experience — Oleg is the canonical example.
_Avoid_: Applicant, user, subject

**Application**:
A single submission by a Candidate to the Vacancy. A repeat appearance by the same Candidate is a
new Application, not a return from the Talent Pool.

**Vacancy**:
The single role the player is recruiting for. It begins plausible and bloats as requirements are
added to it; one candidate is reviewed against it at a time.

**Mismatch**:
The one specific gap between a Candidate's experience and the Vacancy's requirements. Each
Application has exactly one, and it is what makes a Reason precise or generic.

### Review and rejection

**Rejection**:
Ending a candidate's review with a stated corporate reason. It is the only decision the player can
reach — nobody is ever hired.
_Avoid_: Closing, declining, refusing

**Reason**:
The stated cause of a rejection. Reasons are the game's core choice, and there are only two kinds.

**Precise reason**:
A Reason that names the current Application's Mismatch, using the same skill or requirement. Pays
the most Credits.

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
_Avoid_: Milestone, iteration, sprint

**Finale**:
The game's ending, in which the vacancy freezes and an unending candidate arrives. Deferred until a
working game exists.
_Avoid_: Ending, win state, game over

### Physical surfaces

**Room**:
The physical office around the monitor: wall, desk, and objects that sit on or hang from them.
_Avoid_: Scene, stage, background

**Monitor**:
The physical CRT sitting on the desk. Its bezel frames the Screen, and its body overlaps the desk
surface.
_Avoid_: Display, device, terminal

**Screen**:
The game interface shown inside the Monitor bezel. It is a separate visual surface nested inside
the Room.
_Avoid_: Display, viewport, canvas

**Slot**:
A named place on a game surface where an Upgrade can appear.
_Avoid_: Zone, position, cell

**Shop**:
A purchase panel for Upgrade cards, separate from the Room and Monitor.
_Avoid_: Store, market, vendor panel

**Taskbar**:
The bar at the bottom of the Screen that holds the Start button, window buttons, tray icons, and
the clock.
_Avoid_: Dock, status bar, footer