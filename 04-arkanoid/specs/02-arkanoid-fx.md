# SPEC 02 — Arkanoid neon FX

> **Status:** Implemented
> **Depends on:** SPEC 01
> **Date:** 2026-10-15
> **Objective:** Give the game a neon/synthwave look with canvas 2D effects (particles, ball trail, additive glow, parallax background, screen shake, bloom pass and vignette) that respect `prefers-reduced-motion`.

## Scope

**In:**

- `src/fx.js`: effects state (particles, ball trail, shake, flash) and its per-frame update; no drawing.
- `src/background.js`: static-cost background layer (pre-rendered nebula, drifting starfield and perspective grid) drawn behind the bricks.
- `src/bloom.js`: bloom pass using an offscreen canvas (downscale, upscale, composite with `lighter`).
- Particle burst in the brick color when a brick is destroyed.
- Ball trail and additive glow on ball and paddle.
- Screen shake on life lost and a small shake on brick break; short white flash on paddle hit.
- Vignette over the playfield.
- Bloom applied to the game layer (background, bricks, paddle, ball, particles); HUD and end screens are drawn after it so text stays crisp.
- `prefers-reduced-motion: reduce` disables shake, flash and trail, shrinks particle counts and freezes the background.
- `game.js` emits events (`brickBroken`, `paddleHit`, `lifeLost`) to `fx`; `bounceOffPaddle` returns a boolean so the paddle hit is detectable.

**Out of scope (for future specs):**

- WebGL shaders (CRT curvature, chromatic aberration).
- Sound effects (`assets/sounds/*` stay unused); audio will reuse the same three events.
- Brick explosion animation with `EXPLOSION_FRAMES` (stay unused).
- In-game toggle or settings menu for effects.
- New gameplay: power-ups, levels, multi-hit bricks.
- Rendering at `devicePixelRatio` resolution.

## Data model

```js
// src/config.js (new constants)
const FX_COLORS = {
  red: '#ff4d6d',
  yellow: '#ffd23f',
  cyan: '#2ee6ff',
  magenta: '#d94dff',
  hotpink: '#ff5fb8',
  green: '#4dff88',
};
const FX = {
  burstCount: 14, // particles per brick; /3 with reduced motion
  trailLength: 12,
  shakeBrick: 2, // px amplitude
  shakeLife: 10,
  flashPaddle: 0.12, // max alpha, kept low on purpose
  bloomScale: 0.25, // offscreen size relative to the canvas
  bloomStrength: 0.8,
};

// src/fx.js
const fx = {
  particles: [], // { x, y, vx, vy, life, maxLife, size, color }
  trail: [], // { x, y } last FX.trailLength ball positions
  shake: 0, // current amplitude in px, decays each frame
  flash: 0, // 0..FX.flashPaddle, decays each frame
  reducedMotion: false, // mirrors matchMedia('(prefers-reduced-motion: reduce)')
};
```

Conventions:

- Game state from SPEC 01 is not modified; `fx` is a separate object owned by `game.js`.
- Colors are hex strings keyed by the brick `color` name.
- Time-based effects (background drift, flash blink) use `performance.now()`; particles and shake step per frame like the rest of the game.

## Implementation plan

1. Add `FX_COLORS` and `FX` to `src/config.js`, create `src/fx.js` (`createFx`, `updateFx`, `emit` helpers), make `bounceOffPaddle` return a boolean, and create/update `fx` in `game.js`. Manual test: game plays exactly as before, no console errors.
2. Emit `brickBroken` from `game.js`; spawn the particle burst in `fx.js` and draw particles with `lighter` in `renderer.js`. Manual test: breaking a brick shows colored particles that fade.
3. Record ball positions into `fx.trail`; draw the trail and a pre-rendered radial-gradient glow under the ball and paddle. Manual test: ball leaves a fading trail; ball and paddle glow.
4. Add shake (brick break, life lost) and paddle-hit flash: `render` wraps the game layer in `ctx.translate` with the current shake and draws the flash overlay. Manual test: losing a life shakes the canvas; paddle hit flashes briefly.
5. Create `src/background.js` (nebula, starfield with two parallax speeds and perspective grid) and draw it first in `render`. Manual test: stars drift, grid is visible behind bricks.
6. Create `src/bloom.js`; render the game layer to an offscreen canvas, downscale by `FX.bloomScale`, composite back with `lighter` at `FX.bloomStrength`, then draw HUD and end screens on top. Manual test: bright elements bleed light; HUD text stays sharp.
7. Add vignette and `prefers-reduced-motion` handling (`matchMedia` read at start plus `change` listener): no shake/flash/trail, burst count `/3`, background frozen. Manual test: toggle the OS setting or DevTools rendering emulation, effects reduce without reloading.

## Acceptance criteria

- [ ] Loading the page through a static server shows the game with the new look and no console errors.
- [ ] Destroying a brick spawns particles in that brick's color that disappear within 1 second.
- [ ] The ball leaves a trail of `FX.trailLength` positions that fades while the ball moves, and the trail is empty while the ball is attached to the paddle.
- [ ] Losing a life shakes the canvas and the shake decays to 0 within 500 ms.
- [ ] A paddle hit flashes the screen with alpha never above `FX.flashPaddle`.
- [ ] The background has nebula, stars and a grid, and they move while the phase is `playing`.
- [ ] HUD text and end-screen text are not blurred by the bloom pass.
- [ ] With `prefers-reduced-motion: reduce` there is no shake, no flash, no trail, and the background is static; gameplay is unchanged.
- [ ] Score, lives, high score, win and game over behave as in SPEC 01.
- [ ] Chrome DevTools Performance shows at least 55 fps on desktop during play with the bloom pass active.
- [ ] If `matchMedia` is unavailable the game still runs with full effects.

## Decisions

- **Yes:** canvas 2D only, no dependencies. Covers most of the visual impact without a new architecture layer.
- **No:** WebGL shader pass. Deferred by the user; its own spec if CRT/aberration is wanted.
- **Yes:** bloom by offscreen downscale + upscale instead of `shadowBlur` or `ctx.filter`. `shadowBlur` per sprite is costly with 60 bricks and `ctx.filter` is not available in every browser.
- **Yes:** bloom applied before HUD and end screens. Keeps text readable.
- **Yes:** particles only on brick break, not `EXPLOSION_FRAMES`. Pixel-art frames clash with the neon look; frames stay available for later.
- **No:** sound in this spec. SPEC 01 deferred it and it is a separate concern; events from step 1 allow plugging it in later.
- **Yes:** `prefers-reduced-motion` respected with no extra UI. Cheap accessibility win; flashes are also capped at alpha 0.12.
- **No:** in-game FX toggle. Not requested; revisit if the bloom hurts performance on low-end devices.
- **Yes:** `fx` state separate from game state. Rendering-only data never leaks into game logic.
- **Yes:** new files `src/fx.js`, `src/background.js`, `src/bloom.js`. One responsibility per file, as in SPEC 01.

## Risks

| Risk                                         | Mitigation                                                                                         |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Bloom pass drops FPS on low-end devices      | `FX.bloomScale` is a single constant; lower it or set `FX.bloomStrength` to 0 to disable the pass. |
| Flashes or shake bother photosensitive users | Flash alpha capped at 0.12; reduced-motion removes shake and flash entirely.                       |
| Canvas scaled by CSS makes glow look blurry  | Accepted; `devicePixelRatio` rendering is explicitly out of scope.                                 |
| Additive blending washes out bright sprites  | Tune `FX.bloomStrength` while testing; the game layer is drawn normally before the additive pass.  |

## What is **not** in this spec

- WebGL shaders or CRT effects.
- Sound effects or music.
- `EXPLOSION_FRAMES` animation.
- Settings menu or FX toggle.
- New gameplay mechanics.

Each one of those, if it lands, goes in its own spec.
