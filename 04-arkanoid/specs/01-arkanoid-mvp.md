# SPEC 01 — Arkanoid MVP

> **Status:** Approved
> **Depends on:** None
> **Date:** 2026-10-15
> **Objective:** A playable single-level Arkanoid in plain HTML + CSS + JS canvas with paddle, ball, bricks, 3 lives, on-screen score and a persisted high score.

## Scope

**In:**

- `index.html` at project root, loading `assets/spritesheet.js` then `game.js`.
- Canvas 480x640 with paddle, ball, 6x10 brick grid (one color per row).
- Paddle control with keyboard (ArrowLeft/ArrowRight, A/D) and mouse (x position over canvas).
- Ball launch with Space or click; ball attached to paddle until launched.
- Collisions: walls, ceiling, paddle (bounce angle depends on hit offset), bricks (1 hit destroys).
- 3 lives; ball falling below the canvas costs one life and re-attaches the ball.
- On-screen HUD: score, lives, high score.
- Win screen (all bricks destroyed) and Game Over screen (0 lives); Space or click restarts.
- High score persisted in `localStorage`.

**Out of scope (for future specs):**

- Sound effects (`assets/sounds/*` stay unused).
- Brick explosion animation (`EXPLOSION_FRAMES` stay unused).
- Multiple levels, speed-up, power-ups, gray multi-hit bricks.
- Pause menu, start menu, touch controls.

## Data model

```js
const W = 480,
  H = 640;
const COLORS = ['red', 'yellow', 'cyan', 'magenta', 'hotpink', 'green']; // top to bottom
const BRICK = { w: 48, h: 24, rows: 6, cols: 10, top: 60 };

const state = {
  phase: 'ready', // 'ready' | 'playing' | 'won' | 'over'
  score: 0,
  lives: 3,
  highScore: 0, // mirrored from localStorage
  paddle: { x, y, w: 96, h: 14, speed: 6 },
  ball: { x, y, r: 6, vx, vy },
  bricks: [
    /* { x, y, color, alive } */
  ],
};
```

Conventions:

- Origin top-left, pixels, velocities in pixels/frame.
- 10 points per brick.
- `localStorage` key: `arkanoid:highScore:v1`, value is the integer as a string.

## Implementation plan

1. Create `index.html` (canvas, script tags) and `game.js` that calls `loadSpritesheet` and draws the paddle and ball. Manual test: open via static server, see both sprites.
2. Add game loop (`requestAnimationFrame`) and paddle movement with keyboard and mouse, clamped to canvas.
3. Add ball in `ready` phase attached to paddle; launch on Space/click; wall and ceiling bounce.
4. Add paddle collision with angle based on hit offset.
5. Build brick grid, draw it, add brick collision (destroy, +10 score, reflect ball).
6. Add lives: ball below canvas → `lives--`, re-attach; `lives === 0` → `over`.
7. Add win when no bricks alive → `won`; add end screens and restart on Space/click.
8. Add HUD and high score load/save in `localStorage` (guarded with try/catch).

## Acceptance criteria

- [ ] Opening `index.html` through a static server shows the canvas with paddle, ball and 60 bricks, no console errors.
- [ ] Arrow keys, A/D and mouse move the paddle and it never leaves the canvas.
- [ ] Ball stays on the paddle until Space or click.
- [ ] Ball bounces on left, right and top walls and on the paddle.
- [ ] Hitting the paddle edge sends the ball at a different angle than hitting its center.
- [ ] Destroying a brick removes it and adds exactly 10 to the score.
- [ ] Ball falling below the canvas reduces lives by 1 and re-attaches the ball to the paddle.
- [ ] With 0 lives the Game Over screen shows; Space or click starts a fresh game (score 0, lives 3, 60 bricks).
- [ ] Destroying all 60 bricks shows the Win screen.
- [ ] After a game with a score higher than the stored one, reloading the page shows that score as high score.
- [ ] Game works when `localStorage` throws (high score just does not persist).

## Decisions

- **Yes:** keyboard + mouse controls. Mouse is faster to play, keyboard is the fallback.
- **Yes:** 3 lives, single level. Smallest loop that is a complete game.
- **Yes:** one color per row, 1 hit per brick. No HP state needed.
- **Yes:** `localStorage` for high score with versioned key. No backend, trivial migration later.
- **Yes:** fixed 480x640 canvas, no resize logic. Keeps the MVP simple.
- **No:** sounds and explosion animation. Explicitly deferred by the user.
- **No:** gray multi-hit bricks. Needs HP state; goes in a later spec.
- **No:** ES modules or build step. Project uses plain global scripts like `assets/spritesheet.js`.

## Risks

| Risk                                        | Mitigation                                                       |
| ------------------------------------------- | ---------------------------------------------------------------- |
| Spritesheet fails when opened via `file://` | Document running with `python3 -m http.server`.                  |
| Ball tunnels through a brick at high speed  | Keep speed below brick height per frame (≤ 6 px/frame).          |
| `localStorage` unavailable                  | Wrap read/write in try/catch; fall back to in-memory high score. |

## What is **not** in this spec

- Sound, animations, power-ups.
- More than one level, gray bricks, speed progression.
- Menus, pause, touch controls.

Each one of those, if it lands, goes in its own spec.
