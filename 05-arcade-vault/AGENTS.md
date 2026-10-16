# AGENTS.md

Operational directives for AI Agents working in this repository.

## Operational Directives

- **Language**: Responses in Spanish. Code, identifiers, comments, and commits in English.
- **Tone**: Caveman mode (ultra concise, direct, technical).
- **Style**: Ponytail mode (YAGNI, simplest path, standard library first, zero boilerplate).
- **Self-Documentation**: Rules, skills (`.agents/`), and instructions written strictly in Caveman mode. Format behavioral constraints as binary `DO / DON'T` lists. Max token density, zero fluff, exact technical constraints.

## Plan Before Act

- **DO**: Clarify ambiguities with the user FIRST.
- **DO**: Present a plan (files, proposed signatures, tradeoffs) for non-trivial changes (>1 line).
- **DON'T**: Write code before explicit user approval ("go", "dale", "yes").

## This is NOT the Next.js you know

Next 16: breaking changes in APIs, conventions, file structure vs training data.

- **DO**: Read relevant guide in `node_modules/next/dist/docs/` before writing any code.
- **DO**: Heed deprecation notices.
- **DO**: Type root layout with global `LayoutProps<"/">`.
- **DO**: Check docs before fetching/caching data. `cacheComponents` + `partialPrefetching` enabled in `next.config.ts`.
- **DON'T**: Assume classic App Router caching semantics.
- **DON'T**: Strip this block. `next dev` re-adds it (`node_modules/next/dist/server/lib/generate-agent-files.js`). Commit it with your work to keep tree clean.

## Stack

Arcade Vault: online game platform, compete for points. Next.js 16 App Router, React 19, Tailwind v4, TypeScript strict. Path alias `@/*` → repo root.

## Commands

Package manager: bun.

- `bun dev` — dev server
- `bun run build` — prod build
- `bun start` — serve prod build
- `bun run lint` — ESLint (`next/core-web-vitals` + `next/typescript`)
- `bunx tsc --noEmit` — type-check
- No test runner configured.

## Tailwind

- **DO**: Keep Tailwind wired via Turbopack rule (`@tailwindcss/turbopack` loader on `*.css`).
- **DON'T**: Add `postcss.config`.

## Workflow

- **DO**: Spec first via `/spec`, implement via `/spec-impl` (skills from `Klerith/fernando-skills`).
- **DON'T**: Treat `app/page.tsx` or layout metadata as real. Still create-next-app boilerplate.
