# Talent.OS Project Structure

Version 1, November 8, 2026. This document describes the target structure for current work: where code belongs and how it should be grouped. It is a living guide, not an immutable contract. If practice reveals a better approach, discuss significant deviations and update the document when appropriate.

Before changing code, agents should consider this document, the [glossary](../GLOSSARY.md), and relevant [ADRs](./adr/). A small local deviation does not block work; an issue that changes an architectural decision should be discussed explicitly.

## 1. Stack and Principles

Talent.OS is a single browser SPA in one package, with no monorepo or server-side application.

- React, TypeScript, Vite, Zustand, Tailwind CSS 4, and pnpm.
- TypeScript uses `strict` and `noUncheckedIndexedAccess`.
- Imports from `src/` use the `@/` alias, configured consistently for TypeScript and Vite.
- Oxlint and Prettier check the code; Vitest tests modules, and Playwright tests browser scenarios.
- Zod, Testing Library, persistence, and a seeded RNG are not added in advance; revisit them when a concrete need arises.

`strict` and the core stack are already configured in the repository. `noUncheckedIndexedAccess` and `@/` are agreed target settings that are not yet present in the current configuration.

The application has one source of truth in Zustand. Store independent facts and compute values that can be derived unambiguously. Apply each coherent game action as one state transition; view modules render the slices they need.

Keep game content separate from rules. Rules and calculations do not depend on React. Reusable UI primitives receive data through props; composition-level view modules may read the store selectors they need.

## 2. Target Structure

This is an example of how code may be grouped, not a requirement to create every file immediately. Names and internal organization can be refined during implementation.

```text
src/
  main.tsx
  content/                # runtime content and catalog
  core/
    config/               # shared geometry and other technical constants
    engine/               # pure game and presentation calculations
    store.ts              # one Zustand store with logically separated state
  ui/                     # reusable primitives, independent of the store
  views/
    shell/                # browser-page shell, HUD, Shop, Stage
    scene/                # Room, Monitor, and physical room layers
    screen/               # windows and elements inside the monitor screen
  styles.css              # global styles, Tailwind, fonts, and base rules
e2e/                      # Playwright scenarios
spec/                     # material not yet adapted for runtime use
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

### `core/store.ts`

One Zustand store contains logically separated parts for run state and workspace state. The store calls rules from `core/engine/` and records a coherent next state. This is one store, not one undifferentiated collection of fields.

View modules may subscribe to the store slices they need. Do not duplicate values that can be derived unambiguously from a source of truth. For example, compute camera scale, available Shop cards, and derived counts rather than storing them separately.

A Rejection updates Credits, the count, and the current Application in one coherent transition; views render their part of the new state. A later slice that introduces the Talent Pool can add membership to that same transition, but the first visual slice does not retain rejected Applications. Components do not call one another to synchronize these changes.

Express persistent game consequences through state. Do not add a global event bus or an `onReject`-style callback for every Upgrade in advance. If a one-off visual effect appears, choose the simplest explicit mechanism in the view layer; game rules do not call React components.

### `views/` and `ui/`

`views/` contains React components for this application:

- `shell/` composes the page and its fixed browser-window areas;
- `scene/` contains the Room, Monitor, and physical scene elements;
- `screen/` contains windows and elements inside the monitor screen.

These subfolders reflect different interface areas and coordinate systems, but do not impose a strict global import order. Higher-level views may compose lower-level views; avoid reverse and cyclic dependencies.

`ui/` is for reusable visual primitives. They receive data and handlers through props and do not read the game store. A view may be a composition-level module with enough scope to represent a coherent part of the interface. Split it when a part has independent meaning, changes independently, is reused, or is difficult to verify in place—not just because of its line count.

### Upgrades

Start with a shared declarative Upgrade catalog in runtime content. Purchases go through a shared game action; rules and the interface derive their consequences from the existing state. A separate view module is needed only for an Upgrade with a unique presentation.

Upgrades do not subscribe to game actions or mutate the store through their own callbacks. Upgrade modules do not import one another. An entry point such as `index.ts` is useful when an Upgrade has a genuine public interface for the catalog; it is not required for every folder. Add a template and generator after a stable, repeated structure emerges.

## 4. Modules, Types, and Dependencies

- Group code by coherent responsibility, not by a “one type or function per file” rule.
- Keep a type beside the module that defines its meaning. Do not move props or local types into a shared folder without a need.
- Do not create `lib/`, a separate `hooks/`, or a central `types/` folder in advance. Promote a helper or hook when it is genuinely reused.
- Dependency guidance is architectural advice, not an automatically enforced import matrix. Game calculations do not depend on React, view modules use the game modules they need, and `ui/` primitives remain independent of the store.
- Avoid cyclic imports. Add a public entry point only when it provides a clear external interface for a module.

## 5. Styles and Checks

Tailwind classes are the primary way to style a local view or UI primitive. One global CSS file contains the Tailwind entry point, base styles, and genuinely shared rules. Add other CSS files only for a distinct shared theme or styles that are awkward to manage locally.

- `pnpm check` is the baseline local check for TypeScript, Oxlint, Vitest, and formatting.
- `pnpm run build` checks the production build.
- Unit tests live beside the code they test; Playwright tests live in `e2e/`.
- For accessibility, add axe-core scans integrated with Playwright for key screens and keyboard scenarios. Manually check screen-reader behavior for significant changes. An automated scan does not prove full conformance to a standard.
- Review UI changes in a browser. Consider screenshot regression tests after key scenes stabilize, rather than for every UI change.
- Add Testing Library or other testing tools only for a concrete need.

Game persistence and Zod are outside the current scope. If persistence, import, or another runtime boundary for untrusted data appears, decide on the format and validation separately.

## 6. Documentation and Evolution

Use the terms in [GLOSSARY.md](../GLOSSARY.md) in code and tests. Record architectural decisions that are hard to reverse and would surprise a future reader in `docs/adr/`; keep small, reversible decisions in this living guide or in the code.

This document describes the current direction, not every future Slice, Finale, or Upgrade. Add folders, infrastructure, and mechanisms when implemented behavior needs them.
