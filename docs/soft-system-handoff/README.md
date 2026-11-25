# Soft System reference

`v0.33.0/soft-system.html` is the standalone export for Screen, Room, windows and
rejection feedback. Its README identifies each screenshot's viewport, state and limits;
the source snapshot includes the design tokens and licenses for the bundled fonts and
libraries. The capture scripts describe the original studio environment and are not
required to run the game.

`handoff-start-v0.1.0/preview.html` and its 1440×900 and 390×844 screenshots
are the separately approved reference for the neutral starting canvas, the complete
inert Shop row and empty Taskbar. Its example candidate and actions are not game rules.
Both exports are standalone and are not runtime dependencies of the game.

## Foundation slice comparison

Compared the game and approved start at 1440×900 in Chromium: both use a neutral
canvas, dark sans heading, compact monospace labels, and a centered, outlined review
window with a Vacancy above a white Application. The game retains its authored
Candidate and the existing three Reason choices and rewards until the next loop slice.
The old fixed side Shop, Screen geometry, footer, portrait and absent Taskbar remain
temporary differences for later slices; the review content and controls consequently
occupy different dimensions. The narrow-screen scaling, Room, window and motion states
are covered by their respective later slices rather than established by this comparison.
