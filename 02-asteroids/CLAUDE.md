# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Asteroids arcade clone, pure HTML5 Canvas + vanilla ES6, no build tool, no dependencies, no tests. Everything lives in `game.js`; `index.html` only hosts the `<canvas>` and loads it.

## Running

Open `index.html` directly, or:

```bash
npx serve .
```

No lint/test/build scripts exist in this repo — nothing to run beyond opening the browser.

## Architecture

Single file (`game.js`), top to bottom:

- **Input**: `keys`/`justPressed` maps populated by `keydown`/`keyup` listeners; `pressed(code)` consumes a one-shot press (used for shooting/restart), `keys[code]` gives held state (rotation/thrust).
- **Entities** (`Bullet`, `Asteroid`, `Ship`, `Particle`): each has `update(dt)` and `draw()`. Movement wraps across canvas edges via `wrap(v, max)` — space is toroidal, all position updates go through it.
- **Asteroid sizing**: size is `1|2|3` (small/medium/large), indexing parallel arrays `RADII`, `SPEEDS`, `POINTS`. `split()` returns two asteroids one size down (empty at size 1).
- **Global mutable state**: `ship, bullets, asteroids, particles, score, lives, level, state` are module-level `let`s, not wrapped in a class/store. `state` is a string machine: `'playing' | 'dead' | 'gameover'`. `update(dt)` branches on `state` first thing.
- **Game flow**: `initGame()` (fresh run) vs `nextLevel()` (keep ship/score, respawn asteroids) vs `killShip()` (decrement lives, transition to `'dead'` or `'gameover'`). Level completion is detected by `asteroids.length === 0` at the end of `update`.
- **Collision**: brute-force O(n·m) pairwise `dist()` checks each frame (bullets×asteroids, ship×asteroids) — intentional given entity counts stay small.
- **Loop**: `requestAnimationFrame` loop at the bottom computes `dt` in seconds (clamped to 0.05 max) and calls `update(dt)` then `draw()` each frame. `initGame()` runs once at load before the loop starts.

When adding behavior, follow the existing pattern: add state to the relevant entity class's constructor, advance it in `update(dt)`, render it in `draw()`. Don't introduce a bundler, framework, or module split unless asked — the single-file no-dependency structure is deliberate.
