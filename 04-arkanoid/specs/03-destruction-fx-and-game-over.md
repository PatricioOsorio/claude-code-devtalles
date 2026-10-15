# SPEC 03 — Destruction FX, ball loss and Game Over

> **Status:** Draft
> **Depends on:** SPEC 01, SPEC 02
> **Date:** 2026-10-15
> **Objective:** Replace the plain brick burst, the instant life loss and the static Game Over panel with neon shatter shards, a ball-loss explosion with a short pause, and an animated Game Over screen, all using depth layers (far/near parallax and drop shadows).

## Scope

**In:**

- Brick destruction: the brick splits into rotating neon shards with gravity plus an expanding shockwave ring in the brick color; the existing particle burst stays.
- Depth layers for FX: each shard/particle belongs to a `far` or `near` layer. `far` is drawn behind the bricks (smaller, slower, dimmer), `near` is drawn over ball and paddle (larger, faster, brighter).
- Soft drop shadows under bricks, paddle and ball.
- Ball loss: when the ball falls below the canvas it explodes at the bottom edge (red burst + shockwave + red edge flash), the ball is hidden and gameplay pauses for `FX.lostFrames` before the ball re-attaches (or Game Over shows).
- Game Over screen: scene darkens/desaturates, title enters with scale + fade, final score counts up, panel border pulses. Text stays outside the bloom pass.
- `prefers-reduced-motion: reduce`: fewer shards, no rotation, no shockwave rings, no shake, no flash, no scale/count-up animation on Game Over (final values shown immediately). The `lost` pause still applies because it is gameplay timing.
- `game.js` emits a new `ballLost` event to `fx`; the existing events stay.

**Out of scope (for future specs):**

- Win screen redesign (`drawEndScreen` keeps the current look for `won`).
- Sound effects (`assets/sounds/*` stay unused).
- `EXPLOSION_FRAMES` pixel-art animation.
- Slow-motion / time scaling of the game loop.
- Extra Game Over stats (bricks destroyed, play time) or a menu.
- Multi-ball (the game has a single ball; "balls falling" means the single ball and each life).
- In-game FX toggle, WebGL shaders, `devicePixelRatio` rendering.

## Data model

```js
// src/config.js (additions to FX)
const FX = {
  // ...existing keys from SPEC 02
  shardCount: 6, // per brick; /2 with reduced motion
  shardGravity: 0.18, // px/frame^2
  ringLife: 18, // frames
  ringMaxR: 40, // px
  farScale: 0.6, // size and speed multiplier of the far layer
  farAlpha: 0.5,
  shadowAlpha: 0.35,
  shadowOffset: 4, // px, straight down
  lostFrames: 36, // ~600 ms pause after the ball falls
  lostFlash: 0.18, // max alpha of the red edge flash, kept low on purpose
  overEnterFrames: 30, // title scale/fade-in; restart ignored until done
  overCountFrames: 60, // score count-up duration
};

// src/fx.js (additions to fx)
const fx = {
  // ...particles, trail, shake, flash, reducedMotion from SPEC 02
  // particles gain `layer: 'far' | 'near'`
  shards: [], // { x, y, vx, vy, rot, vr, w, h, life, maxLife, color, layer }
  rings: [], // { x, y, life, maxLife, color }
  edgeFlash: 0, // 0..FX.lostFlash, decays each frame
  overT: 0, // frames since phase became 'over'; 0 otherwise
};

// game.js (state additions)
state.phase; // + 'lost'
state.lostTimer; // frames left in the 'lost' pause
```

Conventions:

- The `lost` phase is the only gameplay-state change in this spec; everything else is rendering data in `fx`.
- Shard/particle layer is picked at spawn (50/50), never changes afterward.
- `far` layer size and speed are multiplied by `FX.farScale`, alpha by `FX.farAlpha`.
- Colors keep using `FX_COLORS`; ball-loss uses `#ff4d6d` (`FX_COLORS.red`).

## Implementation plan

1. Add the new `FX` keys to `src/config.js`, extend `createFx` with `shards`, `rings`, `edgeFlash`, `overT`, and add `layer` to particles. Manual test: game plays exactly as before, no console errors.
2. Brick shatter: spawn shards and a ring in the `brickBroken` handler, step them in `updateFx` (gravity, rotation, life), draw shards and rings with `lighter` in `renderer.js`. Manual test: breaking a brick shows spinning shards falling and a ring expanding.
3. Depth layers: draw `far` shards/particles before the bricks and `near` ones after ball and paddle; add drop shadows for bricks, paddle and ball. Manual test: some fragments pass behind the bricks, others in front of the ball; shadows visible under paddle and ball.
4. Ball loss: add `ballLost` event and `lost` phase with `lostTimer` in `game.js`; the handler spawns red burst, ring and `edgeFlash`; the ball is not drawn during `lost`; after `FX.lostFrames` go to `ready` (or `over` when lives are 0). Manual test: falling shows explosion, ~600 ms pause, then ball on paddle; last life leads to Game Over after the pause.
5. Game Over screen: `overT` increments while phase is `over`; render darken/desaturate, title scale + fade, score count-up and pulsing border; restart input ignored until `overT >= FX.overEnterFrames`. Manual test: Game Over animates in, score counts up, Space restarts only after the entrance.
6. Reduced motion: shard count `/2`, no rotation, no rings, no edge flash, Game Over shows final state immediately (`overEnterFrames` skipped). Manual test: toggle DevTools rendering emulation, effects reduce without reloading.

## Acceptance criteria

- [ ] Loading the page through a static server shows the game with no console errors.
- [ ] Destroying a brick spawns `FX.shardCount` shards in that brick's color and one ring; all of them disappear within 1 second.
- [ ] At least one fragment is drawn behind the bricks and at least one over the ball in the same burst (both layers are used).
- [ ] Bricks, paddle and ball render a drop shadow offset `FX.shadowOffset` px downward with alpha `FX.shadowAlpha`.
- [ ] When the ball falls below the canvas, a red burst and ring appear at the bottom edge and the ball is not visible during the pause.
- [ ] After the ball falls, input cannot launch the ball for `FX.lostFrames` frames; then the phase is `ready` with the ball on the paddle (or `over` if lives are 0).
- [ ] Red edge flash alpha never exceeds `FX.lostFlash`.
- [ ] Game Over title scales and fades in over `FX.overEnterFrames`, score counts up from 0 to the final value over `FX.overCountFrames`, and Space/click does not restart before the entrance ends.
- [ ] Game Over text and panel are not blurred by the bloom pass.
- [ ] With `prefers-reduced-motion: reduce` there are no rings, no rotation, no shake, no flash, and Game Over shows the final score immediately; gameplay is unchanged.
- [ ] Score, lives, high score and win behave as in SPEC 01; the Win screen looks as before.
- [ ] Chrome DevTools Performance shows at least 55 fps on desktop while breaking several bricks in a row with bloom active.

## Decisions

- **Yes:** neon shards + shockwave ring instead of `EXPLOSION_FRAMES`. Keeps the neon look from SPEC 02; frames stay available for later.
- **Yes:** shards are colored rects, not sprite slices. Cheap to draw additive with 60 bricks and no new sprite logic.
- **Yes:** two depth layers (far/near) with different size, speed and alpha. Fake parallax is cheap and gives depth without a 3D pipeline.
- **Yes:** drop shadows as simple dark shapes (`fillRect`/ellipse), not `shadowBlur`. `shadowBlur` per sprite is costly with 60 bricks (same reason as the bloom decision in SPEC 02).
- **Yes:** `lost` phase in game state with a frame timer. The pause must block launch input, so it is gameplay timing, not just rendering. This bends the "game state is not modified" convention of SPEC 02 in exactly one place.
- **No:** slow-motion. Needs a time-scale in the loop; the fixed pause gives most of the feedback.
- **Yes:** restart blocked during the Game Over entrance. Avoids skipping the screen by accident while mashing Space.
- **Yes:** Win screen untouched. Not requested; own spec if wanted.
- **Yes:** single ball. "Balls falling" is read as each life lost; multi-ball is a gameplay feature, not FX.
- **Yes:** reduced-motion keeps the `lost` pause. It is timing, not motion.

## Risks

| Risk                                                       | Mitigation                                                                                           |
| ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Many shards + particles + rings drop FPS during chain hits | Counts are constants in `FX`; ring and shard lifetimes are short; reduced motion cuts counts.         |
| Red edge flash and shake bother photosensitive users       | `lostFlash` capped at 0.18 and fades fast; reduced motion removes flash and shake.                   |
| Pause makes the game feel unresponsive                     | `lostFrames` is one constant (~600 ms); lower it if it feels long.                                   |
| Far-layer FX drawn behind bricks are hidden by opaque bricks | Intended: they appear in the gaps and as the bricks disappear; tune `farAlpha` while testing.       |

## What is **not** in this spec

- Win screen redesign.
- Sound or music.
- `EXPLOSION_FRAMES` animation.
- Slow-motion or time scaling.
- Multi-ball or any new gameplay.

Each one of those, if it lands, goes in its own spec.
