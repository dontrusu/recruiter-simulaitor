# Talent.OS

A satirical game about recruiting — where nobody is ever hired.

You are a recruiter at Talent.OS, a corporate hiring platform. Candidates flood in.
They're qualified. They're passionate. They have cover letters. You review their
profiles against an increasingly absurd job description and pick a corporate reason
to reject them. Every single one.

The game explores what happens when helpful tools designed to make your job easier
accumulate into a chaotic, overstimulated workspace.

**Work in progress — Slice 1 (Core Loop) under design.**

See [design documents](.scratch/game-vision/) for the current specification.

## Stack

React 19 · TypeScript · Vite · Zustand

## Run

```bash
corepack enable pnpm
pnpm install
pnpm run dev
```

## Quality checks

```bash
pnpm check
pnpm run build
```

`pnpm check` runs TypeScript, Oxlint, Vitest, and Prettier. GitHub Actions runs
those checks, browser tests in Chromium/Firefox/WebKit, and production browser
tests on pushes and pull requests. The pre-commit hook runs Oxlint and Prettier
on staged files, runs the project TypeScript check when a TypeScript file is
staged, and runs the full Vitest suite on every commit. TypeScript checks the
configured project as a whole, since its checks depend on the project
configuration and related files.
