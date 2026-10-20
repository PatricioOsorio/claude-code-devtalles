# SPEC 02 — Home landing + About placeholder (mockups only)

> **Status:** Implemented
> **Depends on:** SPEC 01
> **Date:** 2026-10-19
> **Objective:** Add a landing page at `/` ported from `references/templates/home-about/home.jsx`, move the library to `/games`, and add an "Acerca de" nav entry pointing to a minimal "en construcción" page at `/about`.

## Why this spec exists

SPEC 01 made `/` the library. The prototype separates **Inicio** (landing) from **Biblioteca**. `/games/[id]` already hangs under `/games`, so the library moves to `/games` and `/` is freed for the landing.

## Scope

**In:**

- Route change: library moves from `/` to `/games` (`app/games/page.tsx`). `/` becomes the landing (`app/page.tsx`).
- Landing sections, static mock data, ported from `home.jsx`: hero (floating pixel silhouettes, 3-line title, subtitle, 2 CTAs, scroll hint), "¿POR QUÉ ARCADE VAULT?" (4 feature cards), "JUEGOS DISPONIBLES AHORA" (mini cards from `GAMES`), stats strip, "ACTIVIDAD EN VIVO" (ticker + top players), "PRECIOS" (single free plan), final CTA.
- `reveal` on scroll via a minimal client component using `IntersectionObserver`.
- Nav: new `Inicio` (`/`) and `Acerca de` (`/about`) links in desktop bar and mobile panel; `Biblioteca` now points to `/games`.
- `/about`: server page with kicker, title and "EN CONSTRUCCIÓN" text. Nothing else.
- Update existing links that mean "library": `app/games/[id]/page.tsx` (`VOLVER AL VAULT`), `components/play/player-shell.tsx`, `components/hall/hall-tabs.tsx`, `components/auth/auth-card.tsx` (`router.push`), `app/not-found.tsx` → `/games`.
- Components built with `/ui-component` (Tailwind v4 tokens, cva, `cn`), mobile-first, inverting the prototype's desktop-first CSS.
- Missing tokens/effects (silhouette float, hero title gradient lines, reveal) go to `theme.css`/`effects.css` first.

**Out of scope (for future specs):**

- Real "Acerca de" content: mission, highlights, divider banner, contact form (`about.jsx`).
- Real data for stats, live activity, top players, pricing. All hardcoded.
- Billing or plans logic; `EMPEZAR GRATIS` just links to `/auth`.
- Auth/user state. Nav still shows guest.
- Live ticker updates (no timers, no polling).
- Tests (no runner configured).

## Data model

Static constants inside the landing components. They are not shared, so they do not go in `lib/data.ts`. `GAMES` from SPEC 01 feeds the mini cards.

```ts
// components/home/*.tsx — local, typed, `I`-prefixed
interface IFeature {
  icon: 'gamepad' | 'free' | 'trophy' | 'rocket';
  title: string;
  desc: string;
  tone: ITone;
}
interface IActivityRow {
  player: string;
  game: string;
  score: number;
  ago: string;
  tone: ITone;
}
interface ITopPlayer {
  rank: number;
  name: string;
  score: number;
}
```

Notes:

- Values copied verbatim from `home.jsx` (4 features, activity rows, 5 top players). Stats and pricing copy read from the same file.
- Numbers formatted with `toLocaleString('es-ES')` — deterministic, safe for SSR/hydration.

## Implementation plan

Before step 1: read relevant guides in `node_modules/next/dist/docs/` (Next 16, `cacheComponents`, `PageProps`).

1. **Move library.** Create `app/games/page.tsx` with the current `app/page.tsx` content. Temporarily keep `app/page.tsx` as-is. Check: `/games` renders the library.
2. **Links + nav.** Repoint library links listed in Scope to `/games`. Nav: add `Inicio` (`/`), `Biblioteca` (`/games`), `Acerca de` (`/about`) in desktop and mobile. Active state: `Inicio` exact `/`; `Biblioteca` `startsWith('/games')` or `/play`; `Acerca de` `startsWith('/about')`. Logo links to `/`. Check: `bun dev`, only one link highlights per route, hamburger panel lists all entries.
3. **About placeholder.** `app/about/page.tsx` with kicker `▸ ACERCA DE`, title and `EN CONSTRUCCIÓN`. Check: `/about` returns 200 and shows the text.
4. **Landing tokens/effects.** Add silhouette float animation, hero line styles, reveal utility to `theme.css`/`effects.css`. Check: `bun dev` still runs, no visual change yet.
5. **Reveal.** `components/ui/reveal.tsx` (`"use client"`): wraps children, adds `in` state once intersecting, optional `delay` prop. Check: wrapped block fades in on scroll.
6. **Hero.** `components/home/hero.tsx` (+ `silhouettes.tsx` for the 8 SVGs). CTAs: `EXPLORAR JUEGOS` → `/games`, `CREAR CUENTA` → `/auth`, using `buttonVariants`. Check: renders at 375px and 1280px.
7. **Sections.** `components/home/` : `features.tsx`, `games-preview.tsx` (9 `GAMES` as mini cards → `/games/[id]`, `VER TODOS LOS JUEGOS →` → `/games`), `stats.tsx`, `activity.tsx` (`VER SALÓN →` → `/hall-of-fame`), `pricing.tsx` (`EMPEZAR GRATIS →` → `/auth`), `final-cta.tsx` (`INSERTAR MONEDA →` → `/games`). Shared `SectionHead` (kicker + title + rule) inline in the first file that needs it; extract on third use. Check: each section visible, links land on the right route.
8. **Compose `/`.** Replace `app/page.tsx` with the sections inside `Reveal`s. Update `metadata` only if the landing needs its own. Check: `/` shows landing, `/games` shows library.

Each step leaves `bun dev` runnable and is commitable alone.

## Acceptance criteria

- [ ] `bun run lint`, `bunx tsc --noEmit` and `bun run build` finish with zero errors.
- [ ] `/`, `/games`, `/about` return 200 and render without console errors; `/games/bloque-buster` still returns 200.
- [ ] `/` shows the 7 landing sections in prototype order; `/games` shows the library with 9 cards and working search/chips.
- [ ] `EXPLORAR JUEGOS`, `VER TODOS LOS JUEGOS →` and `INSERTAR MONEDA →` navigate to `/games`; `CREAR CUENTA` and `EMPEZAR GRATIS →` to `/auth`; `VER SALÓN →` to `/hall-of-fame`.
- [ ] Each landing mini card navigates to `/games/<id>`.
- [ ] Nav (desktop and mobile panel) lists `Inicio`, `Biblioteca`, `Salón de la Fama`, `Acerca de`; on `/` only `Inicio` is active, on `/games/bloque-buster` only `Biblioteca`, on `/about` only `Acerca de`.
- [ ] `/about` shows `EN CONSTRUCCIÓN` and no form or other sections.
- [ ] `VOLVER AL VAULT`, player game-over `VOLVER AL VAULT`, hall-of-fame back link, auth submit/guest and 404 link all land on `/games`.
- [ ] Sections below the hero start hidden and become visible when scrolled into view.
- [ ] No component uses `dark:`, `@apply`, raw hex/rgba (except SVG silhouette fills, matching one-off art exception), `.av-*` classes, or default exports (except Next route files).
- [ ] Every `interface`/`type` introduced is prefixed with `I`.
- [ ] `references/templates/` is unchanged (`git diff --stat references/` empty).
- [ ] Visual parity with `references/templates/home-about/arcade-vault-standalone.html` home checked at 375px and 1280px.

## Decisions

- **Yes:** landing at `/`, library at `/games`. Matches prototype's Inicio/Biblioteca split and the existing `/games/[id]` hierarchy.
- **No:** landing at `/games`. Would clash with `/games/[id]` and leave the library without a natural route.
- **Yes:** all 7 prototype sections, static data. User asked for the full mockup.
- **Yes:** `/about` as dedicated route with placeholder. Nav needs a real target; content is deferred.
- **Yes:** `Reveal` client component with `IntersectionObserver`. Parity with prototype; tiny and isolated. Alternative (CSS `animation-timeline: view()`) rejected: patchy browser support.
- **Yes:** landing data local to `components/home/`. Single consumer; promote to `lib/data.ts` on second use.
- **No:** reuse `GameCard` for the preview. Prototype `MiniCard` is a different, smaller layout; extract only if a third use appears.
- **No:** live ticker animation. Needs timers; belongs with real activity data.

## Risks

| Risk                                                                          | Mitigation                                                                                 |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Missed hardcoded `/` link leaves a user on the landing instead of the library | `grep -rn '"/"' app components` after step 2; acceptance criterion covers each flow.       |
| `reveal` hides content if JS fails or observer never fires                    | Hidden state applied only after mount; check at 375px that short pages still show content. |
| Floating silhouettes overlap hero text on mobile                              | Hide or shrink silhouettes below `md`; verify at 375px.                                    |
| Prototype CSS is desktop-first                                                | Mobile base first, `md:` for desktop.                                                      |
| `usePathname` active logic collides (`/` exact vs `startsWith`)               | `Inicio` uses strict equality only.                                                        |

## What is **not** in this spec

- Real "Acerca de" content or contact form.
- Real stats, activity, rankings or pricing data.
- Auth, billing, persistence, backend.
- Tests.

Each one of those, if it lands, goes in its own spec.
