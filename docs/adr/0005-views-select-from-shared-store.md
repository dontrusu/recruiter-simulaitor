# Let views select state from the shared store

ADR-0004 placed the workspace seam at a `RunState` passed into the workspace. We now choose one Zustand store with logical state slices, letting concrete `views/` read the selectors they need while reusable `ui/` primitives remain prop-driven; this avoids threading the same state through the view tree and fits the current single-application scale. This supersedes only ADR-0004's state-passing seam: its screen geometry and the decision against a global event bus remain in force, and game rules still update state through centralized transitions.
