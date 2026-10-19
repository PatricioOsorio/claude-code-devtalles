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

## Types

- **DO**: Prefix every `interface` and `type` with `I` (`IButtonProps`, `IGameCardProps`).

## Styles

Tailwind v4 CSS-first. Tokens in `@theme`. Variants via cva. No BEM.

Wiring:

- **DO**: Keep Tailwind wired via Turbopack rule (`@tailwindcss/turbopack` loader on `*.css`).
- **DON'T**: Add `postcss.config`.

Layout (`app/styles/`, imported in `globals.css`):

- `theme.css` — tokens only (colors, glows, animations, fonts). Single source of truth.
- `base.css` — `@layer base` element defaults.
- `effects.css` — `@utility` / `@layer components` for what utilities can't express (pseudo-elements, masks, stacked gradients).
- `covers.css` — game cover art (`.cover-{slug}`), needs `::before/::after`.

Rules:

- **DO**: Add new color/shadow/animation as token in `theme.css` first, then use generated utility (`bg-surface-2`, `shadow-glow-cyan`, `animate-flicker`).
- **DO**: Use `cn()` from `@/lib/cn` for every `className` merge. Consumer `className` goes last.
- **DO**: Put repeated UI in `components/ui/` with `cva`. First use inline utilities, third use extract.
- **DO**: Use `@utility` for single-purpose style needing variants (`hover:`, `md:`). Use `@layer components` for multi-element/pseudo-element.
- **DO**: Reference tokens in raw CSS via `var(--color-*)`. Alpha via `color-mix(in oklab, var(--color-x) N%, transparent)`.
- **DO**: Mobile-first (`md:` up). `references/templates/styles.css` is desktop-first (`max-width`); invert when porting.
- **DO**: Load fonts via `next/font` in `app/layout.tsx`, bind in `@theme inline`.
- **DON'T**: BEM, semantic class soup (`.btn--primary`), or global component classes (`.av-*`).
- **DON'T**: `@apply`. Ask first.
- **DON'T**: Raw hex/rgba in components. Exception: one-off art in `covers.css`/`effects.css`.
- **DON'T**: Edit `references/templates/styles.css`. Read-only spec.
- **DON'T**: Use `dark:` variants. App is dark-only (`color-scheme: dark`).
- **DON'T**: Repeat same arbitrary value (`text-[9px]`) more than twice. Tokenize it.
- **DON'T**: Expect `tailwind-merge` to resolve custom tokens (`shadow-glow-*`, `text-shadow-neon-*`) against built-in `shadow-*`. Add `extendTailwindMerge` config when first real conflict appears.

## Workflow

- **DO**: Spec first via `/spec`, implement via `/spec-impl` (skills from `Klerith/fernando-skills`).
- **DON'T**: Treat `app/page.tsx` or layout metadata as real. Still create-next-app boilerplate.

## Skills

- **DO**: Use always the skill `/frontend-design` for all UX/UI work.
