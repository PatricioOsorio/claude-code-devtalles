# SPEC 05 — Endless generated levels

> **Status:** Implemented
> **Depends on:** SPEC 01, SPEC 03
> **Date:** 2026-10-15
> **Objective:** Replace the single fixed brick grid with endless, randomly generated levels that advance when all bricks are cleared, keeping score and lives, with a `LEVEL n` HUD entry and a short level banner.

## Why this spec exists

SPEC 01 ends the game with a Win screen after one board. Endless generated levels remove that ending: the run only ends by Game Over (SPEC 03). The `won` phase and its screen become unreachable but are intentionally left in place, so this spec stays a small change in `game.js`.

## Scope

**In:**

- New `src/levels.js` with `createLevel(n)`, returning the `bricks` array for level `n` (moves the grid creation out of `game.js`).
- Random layout per level and per run (`Math.random`), mirrored left/right for a neat look.
- Difficulty by brick count only: more rows and higher density as `n` grows, capped at the SPEC 01 grid (`BRICK.rows` x `BRICK.cols`). No speed-up.
- Advance on clearing all bricks: `state.level++`, new bricks, ball re-attached to the paddle (`ready`). Score and lives carry over.
- Game Over and restart reset to level 1.
- HUD shows `LEVEL n`.
- Level banner `LEVEL n` for `LEVEL.bannerFrames` frames when a level starts, with no gameplay blocking.
- `prefers-reduced-motion: reduce`: banner shown without fade/scale (plain text, same duration).

**Out of scope (for future specs):**

- Fixed hand-designed levels, level select, or a final level.
- Speed-up of the ball or paddle changes per level.
- Multi-hit / indestructible bricks and power-ups.
- Deterministic / seeded generation and daily seeds.
- Per-level high score or persisting the reached level.
- Win screen redesign or removal (`won` stays as dead code).
- Sound for level changes (belongs to the sound spec).

## Data model

```js
// src/config.js (additions)
export const LEVEL = {
  baseRows: 2, // rows at level 1
  rowsPerLevel: 1, // added rows per level, capped at BRICK.rows
  baseDensity: 0.6, // chance a cell has a brick at level 1
  densityPerLevel: 0.05, // added per level, capped at 1
  bannerFrames: 90, // ~1.5 s
};

// game.js (state additions)
state.level; // 1-based, starts at 1, reset by createState
// src/fx.js (addition to fx)
fx.levelT; // frames since the current level started; drives the banner
```

Conventions:

- Brick shape is unchanged: `{ x, y, color, alive }`. Row `r` uses `COLORS[r]`, same as SPEC 01.
- `createLevel(n)` fills the top `min(baseRows + (n - 1) * rowsPerLevel, BRICK.rows)` rows only.
- Each cell of the left half is rolled against the density, then mirrored to the right half.
- A level always has at least one brick: if the roll produces none, the first row is filled.

## Implementation plan

1. Add `LEVEL` to `src/config.js` and create `src/levels.js` with `createLevel(n)`; move the position math of `createBricks` there. In `game.js` call `createLevel(1)` in `createState`. Manual test: game looks and plays like before, except the layout is partial (level 1 has 2 rows).
2. Add `state.level` and advance logic: when the last brick is destroyed, increment `state.level`, set `state.bricks = createLevel(state.level)`, zero the ball velocity and set `phase = 'ready'`, replacing the `won` assignment. Manual test: clearing the board shows a new layout with the ball on the paddle, score and lives kept.
3. HUD `LEVEL n` in `renderer.js`. Manual test: the number goes up after each cleared board and returns to 1 after Game Over restart.
4. Level banner: `fx.levelT` reset on level start, incremented per frame in `update`; `renderer.js` draws `LEVEL n` centered, fade-out over `LEVEL.bannerFrames`, outside the bloom pass. Manual test: banner appears at the start of each level and disappears by itself; with reduced motion it shows with no fade.

## Acceptance criteria

- [ ] The page loads through a static server with no console errors.
- [ ] Level 1 has `LEVEL.baseRows` rows and at least one brick.
- [ ] Clearing the last brick sets `state.level` to the previous value plus 1 and creates a new `bricks` array.
- [ ] After advancing, `state.phase` is `ready` and the ball sits on the paddle with `vx = vy = 0`.
- [ ] Score and lives are identical before and after a level change.
- [ ] No level has more than `BRICK.rows` rows or `BRICK.cols` columns, and every brick position is inside the canvas.
- [ ] Every generated layout is symmetric left/right.
- [ ] Every generated level has at least one alive brick.
- [ ] Ball speed (`BALL.launchVx`, `BALL.launchVy`) is the same on every level.
- [ ] After Game Over and restart, `state.level` is 1.
- [ ] The HUD shows `LEVEL n` matching `state.level`.
- [ ] The banner is visible for `LEVEL.bannerFrames` frames after each level start and the ball can be launched while it shows.
- [ ] The `YOU WIN` screen is never shown during normal play.
- [ ] Game Over screen and `lost` pause behave as in SPEC 03.
- [ ] The high score still persists across reloads.

## Decisions

- **Yes:** endless levels instead of a fixed set. The user asked for generative levels; it also removes the need to author layouts.
- **Yes:** `Math.random` per run. Chosen over a seeded PRNG: variety each run matters more than reproducibility here. Cost: bugs from a specific layout are hard to repro.
- **Yes:** mirror the left half. Random bricks alone look noisy; symmetry costs one loop.
- **Yes:** scale by rows and density with a cap. Predictable ceiling equal to the SPEC 01 grid; no balance work on ball speed.
- **No:** speed-up per level. Touches physics and `BALL`, and the parallel sound spec edits `game.js`; kept out to limit conflicts.
- **Yes:** score and lives carry over. A run is one continuous game ending at Game Over.
- **Yes:** `won` left as unreachable code. Removing it touches `renderer.js` and `game.js` more for no gameplay gain.
- **Yes:** banner is non-blocking. Gameplay timing stays untouched; only `ready` already waits for launch input.
- **Yes:** `createLevel` in its own file. `game.js` stays the coordinator, matching the one-responsibility layout from SPEC 01.
- **No:** level in `localStorage`. The run restarts at level 1, so there is nothing to resume.

## Risks

| Risk                                                       | Mitigation                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Bricks with a row of one lone cell look odd or unreachable | Rows are capped to the grid and mirrored; the ball bounces off walls, so all reachable.              |
| Merge conflicts in `game.js` with the parallel sound spec  | The change in `game.js` is limited to `createState`, the cleared-board branch and the `levelT` tick. |
| Level 1 with 2 rows feels too easy                         | `baseRows` and `baseDensity` are constants in `LEVEL`; tune while testing.                           |

## What is **not** in this spec

- Fixed levels, level select or a last level.
- Ball speed-up or any new brick type.
- Seeded generation.
- Sound for level changes.
- Win screen changes.

Each one of those, if it lands, goes in its own spec.
