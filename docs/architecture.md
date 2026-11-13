# Talent.OS Project Structure

Version 1, November 8, 2026. This document describes the target structure for current work: where code belongs and how it should be grouped. It is a living guide, not an immutable contract. If practice reveals a better approach, discuss significant deviations and update the document when appropriate.

Before changing code, agents should consider this document, the [glossary](../GLOSSARY.md), and relevant [ADRs](./adr/). A small local deviation does not block work; an issue that changes an architectural decision should be discussed explicitly.

## 1. Stack and Principles

Talent.OS is a single browser SPA in one package, with no monorepo or server-side application.

- React, TypeScript, Vite, Zustand, Tailwind CSS 4, and pnpm.
- TypeScript uses `strict` and `noUncheckedIndexedAccess`.
- Imports from `src/` use the `@/` alias, configured consistently for TypeScript and Vite.
- Oxlint and Prettier check the code; Vitest tests modules and components with Testing Library, and Playwright tests browser scenarios.
- Zod, persistence, and a seeded RNG are not added in advance; revisit them when a concrete need arises.

`strict`, the core stack, and the `@/` alias are configured in the repository.
`noUncheckedIndexedAccess` is an agreed target setting that is not yet present in the current configuration.

The application has one source of truth in Zustand. Store independent facts and compute values that can be derived unambiguously. Apply each coherent game action as one state transition; view modules render the slices they need.

Keep game content separate from rules. Rules and calculations do not depend on React. Reusable UI primitives receive data through props; composition-level view modules may read the store selectors they need.

## 2. Target Structure

This is an example of how code may be grouped, not a requirement to create every file immediately. Names and internal organization can be refined during implementation.

```text
src/
  main.tsx                 # application entry point
  App.tsx                  # root React component
  content/                 # authored game content and catalogs
  core/
    config/                # shared technical configuration
    engine/                # pure game and presentation calculations
    store/                 # shared Zustand store
  ui/                      # reusable visual primitives
  views/
    workspace/             # workspace composition and camera presentation
    room/                  # physical Room and its contents
    monitor/               # Monitor body and Screen composition
    application-review/    # Vacancy, Application and Reasons
    shop/                  # Shop presentation
  upgrades/                # Upgrade modules, introduced as needed
  global.css               # global styles, Tailwind and design tokens
e2e/                       # Playwright scenarios
spec/                      # material not yet adapted for runtime use
docs/
  adr/
```

The exact contents of `content/`, `core/`, and `views/` follow the product's actual needs. Do not create empty folders or a separate file for every type or function in advance.

## 3. Where Code Belongs

### `content/`

This contains authored data that the game actually uses: Candidate profiles, the Vacancy and its requirements, Reason copy, the Upgrade catalog, names, descriptions, prices, and ordering. Content describes the game's material; it does not implement behavior.

`spec/` contains design material and data that has not yet been adapted. A file's presence in `spec/` does not make it a runtime source. Explicitly adapt material needed by the game to the current domain and move or connect it as runtime content; do not maintain two conflicting active sources.

### `core/config/`

This may contain shared technical constants, such as Room and Screen dimensions, slot rectangles, z-order, or shared transition durations. Reason and Upgrade copy is content, not technical configuration.

Not every number belongs in configuration. Centralize shared invariants, values from the layout specification, and parameters that need to change together. Keep local stylistic values beside the component that uses them.

### `core/engine/`

This contains pure calculations without React, the DOM, or direct writes to Zustand: Rejection and purchase rules, rewards, selection of the next Candidate, derived values, and camera and placement calculations. It is one place for calculation logic to start, not a requirement to put everything in one file. Group related functions; extract a separate module when a distinct responsibility emerges.

Calculations accept the data they need and return a result. If randomness becomes part of the rules, make it controllable in tests; add a separate seeded RNG only for a concrete need.

### `core/store/`

One Zustand store contains logically separated parts for run state and workspace state. The store calls rules from `core/engine/` and records a coherent next state. This is one store, not one undifferentiated collection of fields.

View modules may subscribe to the store slices they need. Do not duplicate values that can be derived unambiguously from a source of truth. For example, compute camera scale, available Shop cards, and derived counts rather than storing them separately.

A Rejection updates Credits, the count, and the current Application in one coherent transition; views render their part of the new state. A later slice that introduces the Talent Pool can add membership to that same transition, but the first visual slice does not retain rejected Applications. Components do not call one another to synchronize these changes.

Express persistent game consequences through state. Do not add a global event bus or an `onReject`-style callback for every Upgrade in advance. If a one-off visual effect appears, choose the simplest explicit mechanism in the view layer; game rules do not call React components.

### `views/` and `ui/`

`views/` contains the application’s React views, grouped by responsibility:

- `workspace/` composes the Room, Shop, and development controls, and handles camera presentation;
- `room/` renders the physical Room and its contents;
- `monitor/` renders the Monitor body and the composition of its Screen;
- `application-review/` renders the Vacancy, current Application, and Reasons as part of the Screen;
- `shop/` renders the Shop.

These folders group related code; they do not have to mirror the rendered component tree. Views may compose one another, but should avoid cyclic dependencies. The Room and Screen compositions show the same game state.

`ui/` is for reusable visual primitives. They receive data and handlers through props and do not read the game store. A view may be a composition-level module with enough scope to represent a coherent part of the interface. Split it when a part has independent meaning, changes independently, is reused, or is difficult to verify in place—not just because of its line count.

### Upgrades

Place Upgrade-specific modules in `upgrades/` when they are implemented. An Upgrade may have presentation on the Screen, in the Room, or on the Monitor. Keep the shared Upgrade catalog in runtime content; purchases go through a shared game action, and rules and views derive their consequences from the existing state.

Upgrade modules do not subscribe to game actions, mutate the store through their own callbacks, or import one another. Add separate modules, entry points, or generators only when a concrete need emerges.

## 4. Modules, Types, and Dependencies

- Group code by coherent responsibility, not by a “one type or function per file” rule.
- Keep a type beside the module that defines its meaning. Do not move props or local types into a shared folder without a need.
- Do not create `lib/`, a separate `hooks/`, or a central `types/` folder in advance. Promote a helper or hook when it is genuinely reused.
- Dependency guidance is architectural advice, not an automatically enforced import matrix. Game calculations do not depend on React, view modules use the game modules they need, and `ui/` primitives remain independent of the store.
- Avoid cyclic imports. Add a public entry point only when it provides a clear external interface for a module.

## 5. Styles and Checks

Tailwind classes are the primary way to style a local view or UI primitive. One global CSS file contains the Tailwind entry point, base styles, and genuinely shared rules. Add other CSS files only for a distinct shared theme or styles that are awkward to manage locally.

### shadcn/ui, design tokens, and fonts

Use shadcn/ui as a source of accessible, adaptable primitives, not as a requirement to build every
domain surface from a generic component. Domain compositions own their structure and visual
identity; use a shadcn primitive when its semantics and behavior fit, and adapt its styles to the
product.

Keep concrete palette values in CSS custom properties, map them to semantic shadcn roles, and expose
those roles as Tailwind utilities through Tailwind v4's `@theme inline`. Components should use role
utilities such as background, card, foreground, border, and muted text instead of repeating hex
values. Keep a branded accent separate when its meaning differs from shadcn's semantic `accent`
surface/state color.

Bundle application fonts locally with Fontsource packages and import their CSS once from the Vite
entry point. Map type roles to Tailwind font-family tokens in `@theme inline`; do not add runtime
font-CDN dependencies. Use Fontsource's default unicode-range CSS unless measurements or a concrete
localization requirement justify custom subsets or preload hints.

- `pnpm check` is the baseline local check for TypeScript, Oxlint, Vitest, and formatting.
- `pnpm run build` checks the production build.
- Unit tests live beside the code they test; Playwright tests live in `e2e/`.
- For accessibility, add axe-core scans integrated with Playwright for key screens and keyboard scenarios. Manually check screen-reader behavior for significant changes. An automated scan does not prove full conformance to a standard.
- Review UI changes in a browser. Consider screenshot regression tests after key scenes stabilize, rather than for every UI change.
- Add further testing tools only for a concrete need.

Game persistence and Zod are outside the current scope. If persistence, import, or another runtime boundary for untrusted data appears, decide on the format and validation separately.

## 6. Documentation and Evolution

Use the terms in [GLOSSARY.md](../GLOSSARY.md) in code and tests. Record architectural decisions that are hard to reverse and would surprise a future reader in `docs/adr/`; keep small, reversible decisions in this living guide or in the code.

This document describes the current direction, not every future Slice, Finale, or Upgrade. Add folders, infrastructure, and mechanisms when implemented behavior needs them.
