# Replace the prototype engine in place

The existing prototype engine, store, and UI encode systems that the agreed direction removes —
staged roles, interviews, special actions, endings, and timed activities — so we refactor in place:
delete the superseded systems and replace them, keeping the React/TypeScript/Vite/Zustand stack,
the pure-transition approach, and the tests that still describe intended behaviour. We chose this
over building the new loop beside the old one because two live games in one repository would need a
compatibility layer and would leave obsolete rules readable as if they mattered. Only validated
rules and authored content are carried across.

## Consequences

The substitute is one code path with no fallback to the prototype: content, tests, and copy that
only served the removed systems are deleted with them rather than kept for reference. Finding
something valuable in the old behaviour is not a reason to keep it running — it is a reason to port
it deliberately.