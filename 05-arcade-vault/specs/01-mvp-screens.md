# SPEC 01 — MVP screens (mockups only)

> **Status:** Implemented
> **Depends on:** None
> **Date:** 2026-10-19
> **Objective:** Port the five prototype screens in `references/templates/` (library, game detail, player, auth, hall of fame) to Next.js routes as static mockups with mock data and local UI state only.

## Why this spec exists

`app/page.tsx` is still create-next-app boilerplate. Only `components/ui/button.tsx` and `components/library/game-card.tsx` exist. This spec lands the full visual shell so later specs (real games, auth, persistence) plug into finished screens instead of designing UI and logic at once.

## Scope

**In:**

- Routes: `/`, `/games/[id]`, `/play/[id]`, `/auth`, `/hall-of-fame`.
- Shared shell in root layout: nav (desktop links + mobile slide-in panel), footer.
- Typed mock data in `lib/data.ts` (port of `references/templates/data.jsx`).
- Local UI state only (`useState`): library search + category chips, auth tab, hall-of-fame game tabs, mobile menu, player pause + game-over modal.
- Components built with `/ui-component` (Tailwind v4 tokens, cva, `cn`), design work through `/frontend-design`.
- Mobile-first port; prototype CSS is desktop-first (`max-width`), invert it.
- Replace boilerplate `metadata` in `app/layout.tsx` (`title`, `description`, `lang="es"`).

**Out of scope (for future specs):**

- Any playable game or game loop (no timers, no score ticking, no canvas).
- Real auth, sessions, OAuth buttons wiring, user state. Nav always shows guest (`Iniciar Sesión`).
- Persistence (`localStorage`, DB, API). Game-over "save score" persists nothing.
- "TU MEJOR MARCA" row in hall of fame (needs a user).
- Tilt-on-hover effect of the prototype card (existing `GameCard` hover is kept).
- i18n. UI copy is Spanish, hardcoded.
- Tests (no runner configured).

## Data model

New file `lib/data.ts`. Types prefixed `I`.

```ts
export type ITone = 'cyan' | 'magenta' | 'yellow' | 'green';

export interface IGame {
  id: string; // slug, used in /games/[id] and /play/[id]
  title: string;
  short: string;
  long: string;
  cat: Exclude<ICategory, 'TODOS'>;
  cover: string; // "cover-bricks", matches covers.css
  tone: ITone; // prototype field `color`
  best: number;
  plays: string; // pre-formatted, e.g. "12.4K"
}

export interface IScore {
  rank: number;
  name: string;
  score: number;
  date: string; // "DD/MM/2026"
}

export const CATS = ['TODOS', 'ARCADE', 'PUZZLE', 'SHOOTER', 'VERSUS'] as const;
export type ICategory = (typeof CATS)[number];

export const GAMES: IGame[]; // same 9 games as prototype
export function getGame(id: string): IGame | undefined;
export function seededScores(seed: number, count?: number): IScore[]; // deterministic, same algorithm as prototype
```

Notes:

- `GameCard` currently types `tone` as `"cyan" | "magenta" | "yellow"`. `"green"` games need `buttonVariants` to gain a `green` tone, or the card maps green to an existing one. Decide in step 3, token `--color-green` already exists.
- `seededScores` must stay deterministic so server render and client hydration match.

## Implementation plan

Before step 1: read the relevant guides in `node_modules/next/dist/docs/` (Next 16, `cacheComponents` enabled, `LayoutProps`/`PageProps` globals).

1. **Data.** Create `lib/data.ts` per the model above. Check: `bunx tsc --noEmit` passes.
2. **Shell.** Create `components/layout/nav.tsx` (`"use client"`, mobile panel state) and `components/layout/footer.tsx`. Wire both into `app/layout.tsx` with `<main>`. Update `metadata` and `lang="es"`. Add missing tokens/effects (`neon`, hero, backdrop) to `theme.css`/`effects.css` first if needed. Check: `bun dev`, every page shows nav + footer, hamburger opens/closes panel on mobile width, active link highlights by `usePathname`.
3. **Library `/`.** Replace `app/page.tsx` with hero + filters + grid. Search/chips live in a client component `components/library/library-filters.tsx`; grid reuses `GameCard`. Empty state "NO HAY RESULTADOS". Resolve `green` tone (see Data model notes). Check: filtering by text and chip works, 9 cards by default.
4. **Detail `/games/[id]`.** `app/games/[id]/page.tsx` with cover, tags, stat strip, actions (`JUGAR AHORA` → `/play/[id]`, `VOLVER AL VAULT` → `/`), leaderboard aside from `seededScores`. `generateStaticParams` from `GAMES`. Unknown id → `notFound()`. Check: card "Jugar" lands here; bad id gives 404.
5. **Auth `/auth`.** `app/auth/page.tsx` + `components/auth/auth-card.tsx` (client: tab `in`/`up`, email field only on `up`). Submit and guest button navigate to `/` (`useRouter`), no data kept. Social buttons inert. Check: tab switch toggles email field and CTA text.
6. **Hall of fame `/hall-of-fame`.** `app/hall-of-fame/page.tsx` + client `components/hall/hall-tabs.tsx`: game tabs, podium (2-1-3 layout), table with staggered row animation. Check: switching tab changes rows deterministically.
7. **Player `/play/[id]`.** `app/play/[id]/page.tsx` + client `components/play/player-shell.tsx`: HUD with fixed values (player `INVITADO`, score `0`, lives 3, level `01`), CRT frame with decorative arena, `PAUSA`/`REANUDAR` toggles overlay, `FIN` opens game-over modal (initials input, `GUARDAR PUNTUACIÓN` swaps to `▸ PUNTUACIÓN GUARDADA_` locally, `JUGAR DE NUEVO` closes modal, `VOLVER AL VAULT` → `/`), `SALIR` → `/games/[id]`. Check: full flow detail → play → game over → back works.
8. **Extractions.** Apply the third-use rule: only pull a primitive into `components/ui/` if it now appears three times (candidates: `chip`, text `input`). Otherwise leave inline.

Each step leaves `bun dev` runnable and is commitable alone.

## Acceptance criteria

- [ ] `bun run lint`, `bunx tsc --noEmit` and `bun run build` finish with zero errors.
- [ ] `/`, `/games/bloque-buster`, `/play/bloque-buster`, `/auth`, `/hall-of-fame` return 200 and render without console errors.
- [ ] `/games/does-not-exist` and `/play/does-not-exist` return 404.
- [ ] `app/page.tsx` contains no create-next-app boilerplate; `<title>` is not "Create Next App".
- [ ] Nav + footer appear on all five routes; below `md` the links collapse into the hamburger panel.
- [ ] Library: typing "caida" shows only CAÍDA-matching cards; chip `PUZZLE` shows only PUZZLE games; a query with no match shows `NO HAY RESULTADOS`.
- [ ] Clicking `Jugar` on any library card navigates to `/games/<id>`.
- [ ] Detail: leaderboard shows 10 rows with `#01`–`#03` styled distinctly; same rows on every reload of the same id.
- [ ] Auth: `CREAR CUENTA` tab shows the email field; `INICIAR SESIÓN` hides it; guest button lands on `/`.
- [ ] Hall of fame: podium shows ranks 02 / 01 / 03 in that visual order; changing tab changes the table.
- [ ] Player: `PAUSA` shows `EN PAUSA` overlay and button text becomes `REANUDAR`; `FIN` opens the modal showing the score `0`.
- [ ] No component uses `dark:`, `@apply`, raw hex/rgba, `.av-*` classes, or default exports (except Next route files).
- [ ] Every `interface`/`type` introduced is prefixed with `I`.
- [ ] `references/templates/` is unchanged (`git diff --stat references/` empty).
- [ ] Visual parity with `references/templates/Arcade Vault.html` checked at 375px and 1280px widths for each of the five screens.

## Decisions

- **Yes:** App Router routes (`/games/[id]`, `/play/[id]`, `/auth`, `/hall-of-fame`) over the prototype's hash-based SPA. Native Next navigation, shareable URLs, `next/link`.
- **Yes:** English route slugs, matching the already-existing `GameCard` link `/games/${id}`. UI copy stays Spanish.
- **Yes:** typed `lib/data.ts` shared by library, detail, player and hall. Avoids duplicating 9 games across pages.
- **Yes:** local `useState` for filters/tabs/menu/modal so hover/active/empty states can be reviewed.
- **Yes:** player screen included (frame + HUD + modal) as a pure mockup so the future game spec has a ready host.
- **Yes:** keep existing `GameCard` hover (translate + glow); skip the prototype's mouse-tilt JS. Explicit over clever.
- **No:** `localStorage` / `av_user` / `av_scores` from the prototype. Persistence belongs to a later spec.
- **No:** user-dependent UI (`TU MEJOR MARCA`, name in nav). No auth yet, nothing to base it on.
- **No:** hash-based routing, `React.Fragment`-style globals (`window.Nav`) from the prototype.
- **No:** extracting `ui/` primitives upfront. Third-use rule applies (step 8).
- **No:** tests. No runner configured; verification is lint + tsc + build + manual check.

## Risks

| Risk                                                                                               | Mitigation                                                                                                                                   |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Next 16 `cacheComponents` changes how dynamic route params and client hooks (`usePathname`) behave | Read `node_modules/next/dist/docs/` before step 2; `generateStaticParams` on `[id]` routes; verify with `bun run build`, not only `bun dev`. |
| `seededScores` mismatch between server and client render                                           | Pure deterministic function, called only in Server Components; passed as props to client components.                                         |
| `green` tone missing in `buttonVariants` / `GameCard`                                              | Resolved explicitly in step 3 before building the grid.                                                                                      |
| Prototype CSS is desktop-first, easy to port backwards                                             | Write mobile base styles first, `md:` for desktop; check at 375px and 1280px.                                                                |
| Prototype effects (CRT, podium, modal) need pseudo-elements Tailwind utilities can't express       | Put them in `@layer components` in `effects.css`, tokens in `theme.css` first.                                                               |

## What is **not** in this spec

- Any actual game, game loop, timers or score ticking.
- Real authentication or user state.
- Persistence of scores, users or settings.
- Backend / API / DB.
- Tests.

Each one of those, if it lands, goes in its own spec.
