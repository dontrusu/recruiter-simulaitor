# Cut the screen into a monitor shell of named zones, and put the seam at the run state

The screen is one module — the workspace — and its entire interface is the run state it is handed;
the seam sits there, not at a rejection event. The shell's contents are fixed by the placement
specification (v1, 23 October 2026): a room of 1600×900 holding a monitor whose screen is 800×600,
and inside that screen a main Talent.OS window, eight named slots around it (L1–L3, R1–R3, T1,
B1), the Talent Pool band and the taskbar. Slots are named, closed, and carry exact rectangles.
The stacking policy — a second window offsets by (12, 12), depth up to three, the fourth
collapsing the oldest into a taskbar button — is per-slot implementation detail, not the screen's
structure.

We chose this over adopting the slot grid as the screen's interface for three reasons. Slice 1 has
exactly one growth event — the Talent Pool band appearing on purchase — so nothing can overflow
yet. An open zone set makes each caller learn zone names, ranking and placement policy while the
work behind it stays a CSS grid, which is shallow: callers pay for the interface and maintainers
gain no locality. And under a stacking reading the Talent Pool band would land on the candidate
card, breaking the non-occlusion rule that §5 and ticket 02 both hold, so the band is reserved in
the frame instead of stacked into it. The same offset-and-rotation policy stays reachable inside
any slot when the later layers arrive, and the pool band can become the ocean without the
interface changing.

The shop is not on that screen. It is a fixed 300px column beside the scene, and the scene's scale
formula subtracts it; the HUD is a fixed 48px band. Both are in pixels and do not scale with the
scene. The upgrade catalog's "Windows column" is not the shop: it is slots R1–R3 on the screen,
and the shop sits outside the monitor entirely. The catalog and the placement specification
therefore do not conflict — the catalog names the surfaces on which Upgrades land, and the
placement specification gives those surfaces rectangles.

The two camera states are one scene at two zoom factors, not two scenes: state A is `min(Ws/800,
Hs/600)` centred on the monitor, state B is the room scale, and the transition between them is
1500ms. Which state applies is a pure function of progress — whether a physical Upgrade has been
bought — so it is a presentation projection over the run state like every other view fact, and it
needs no event either. Slice 1 builds both states, and buying Culture Fit Oracle is what reveals
the room: §9's camera transition is a presentation consequence of progress rather than the
Oracle's mechanic, so it does not contradict the Slice 1 constraint that the Oracle is purchased
without behaviour — the Magic 8-Ball stays out, the room comes in. Slice 1 therefore ships the
room's base only: wall, desk and monitor body, with no desk, wall or front-desk objects, since
those belong to Upgrades beyond the first three.

For the same reason there is no `onReject(candidate, reason)` seam, and this is now the deliberate
verdict rather than only a scope reading. Slice 1 has no would-be subscriber: Smart Reject is a
hint on the reason buttons, the Talent Pool is the set of rejected Candidates already in the run
state, and Culture Fit Oracle is purchased without behaviour. The upgrade this Slice exists to
test, Smart Reject, is a pull ("which Reason do I use most often?") that a rejection event cannot
express, so building an event now would mean one adapter satisfying an interface that nothing
varies across. Ticket 13's "maps naturally to the Zustand store's existing reducer pattern" is the
reducer reading, and it is the one we took: a Rejection is a pure transition that already carries
its Credits, Rejection count and Talent Pool membership, and the screen reads them.

Where the documents disagree with each other we follow Slice 1's §5 as the authoritative Slice 1
text — it is the later document, it declares itself authoritative for this Slice, and it defers
architecture to a session like this one. Its three column widths are superseded by the placement
specification's room and screen geometry, which is newer still and more specific; ticket 12's
"slot-grid screen framework" phrasing is superseded for the screen, while the refactor-in-place
half of that decision stands.

## Consequences

The workspace stays shallow on purpose: it takes the run state and dispatches its own actions, and
the depth callers pay for lives in the run model, where precise and generic reasons, Mismatch,
Credits, the three-Upgrade order, Smart Reject's most-used Reason and Talent Pool membership are
derived and tested.

The room is a second coordinate space nested inside the screen's, and the scaling rule makes them
one system rather than two: the scene scales about the monitor's centre, the chrome around it does
not, so the engine that draws the room and the engine that draws the screen must not both claim
the viewport. Below scale 0.65 the scene is cropped about that same centre, which is the only
reason the room can be promised at 1366×768.

The monitor frame puts a ceiling on the pool, and the placement specification answers the question
this ADR left open: the Finale is specified to break the frame — the band grows to full screen
height, the water spills past the bezel and fills the room. Breaking the frame is therefore the
decision, not the fallback, and it costs nothing at the interface because it is a change of
presentation over existing state.

Growth inside a slot stays cheap. A new named slot is an interface change and gets treated as one
— that is the price of keeping what a caller must know small. The first slice that adds several
independent reactions to a Rejection (letters, #wins, Humbled & Honored, the Eye) is the slice
that earns a real seam, and it should arrive as derived projections over the run state rather than
as a publication event, so transitions stay pure and total as ADR-0001 requires.
