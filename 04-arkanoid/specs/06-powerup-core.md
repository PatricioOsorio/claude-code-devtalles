# SPEC 06 — Power-up core

> **Status:** Draft
> **Depends on:** SPEC 01, SPEC 03, SPEC 05
> **Date:** 2026-10-16
> **Objective:** Add the power-up infrastructure (random drops from broken bricks, paddle catch, per-type effect timers, HUD indicators and a multi-ball-ready `state.balls[]`) plus one reference power-up (`wide`) that proves the contract end to end.

## Why this spec exists

Wide/Shrink, Sticky, Laser, Multiball, Fireball, Slow/Fast, Chain Bomb, Shield and Combo are planned as three parallel specs (paddle, ball, world). If each one invents its own drop and timer system they will collide in `game.js`, `config.js` and `renderer.js`. This spec lands the shared contract first, on `main`, so the parallel specs only add entries to a registry.

It also replaces `state.ball` with `state.balls[]`. Multiball cannot exist without it, and doing the refactor here (with one ball, no behavior change) keeps it out of the parallel work.

## Scope

**In:**

- `state.ball` becomes `state.balls[]`; the run loses a life only when the last ball falls.
- New `src/powerups.js` with the registry `POWERUPS`, drop spawning, drop movement, catch detection and effect timers.
- Drops: each destroyed brick rolls `POWERUP.dropChance`; on success a capsule falls from the brick center at `POWERUP.fallSpeed` px/frame.
- Catch: a capsule touching the paddle activates its effect; a capsule below the canvas is discarded.
- Effects: `state.effects` holds one frame counter per active type. Several types can be active at once; catching an active type refreshes its timer and does not re-apply it.
- Reset rules: losing a life clears all effects and drops; clearing a level keeps effects and clears drops in flight; restart clears everything.
- Effects count down only while `phase === 'playing'`.
- Reference power-up `wide`: paddle width x1.5 for 600 frames.
- Capsule drawn on canvas (rounded rect, color, one letter), no spritesheet change.
- HUD: one mini capsule per active effect with a bar for the remaining time.
- Catch feedback with the existing FX system (`emit(fx, 'powerupCaught', ...)`: ring plus the paddle flash).
- Per-ball trail, shorter for extra balls, so visuals stay consistent with a bounded cost.

**Out of scope (for future specs):**

- Any power-up other than `wide` (paddle, ball and world groups each get their own spec).
- Sound for drops, catches or expirations (belongs to a sound spec).
- A per-frame `tick` hook in the registry; added when a real power-up needs it.
- Bad power-ups (Shrink) and weighted drop tables; the roll is uniform over `POWERUPS`.
- Bricks marked as carriers in `createLevel` and pity timers.
- Persisting anything about power-ups.
- Spawning extra balls (Multiball) and the cap enforcement; this spec only defines `BALL.maxCount`.

## Data model

```js
// src/config.js (additions)
export const BALL = { r: 6, launchVx: 3, launchVy: -4, maxCount: 6 }; // maxCount: upper bound for balls alive at once

export const POWERUP = {
  dropChance: 0.15, // per destroyed brick
  fallSpeed: 2, // px/frame
  w: 36, // capsule size
  h: 16,
};

// src/powerups.js
export const POWERUPS = {
  wide: {
    label: 'W', // letter drawn on the capsule and the HUD icon
    color: 'cyan', // key of FX_COLORS
    duration: 600, // frames (~10 s)
    apply(state) {}, // runs once when the effect starts
    expire(state) {}, // runs once when the timer ends or the effects are cleared
  },
};

// game.js (state changes)
state.balls; // [{ x, y, r, vx, vy }], replaces state.ball; always at least one ball
state.drops; // [{ x, y, id }], x/y = capsule center, id = key of POWERUPS
state.effects; // { [id]: framesLeft }, only active types are present

// src/fx.js (changes)
// trail moves from fx.trail to ball.trail: [{ x, y }] per ball, length FX.trailLength for balls[0], FX.trailLength / 2 for the rest.
```

Conventions:

- Passive effects (for example a fireball) are read by other modules as `state.effects.fireball > 0`; the registry only owns apply and expire.
- `apply` and `expire` mutate `state` and must be symmetric: after `expire` the state is as if the effect never happened. `wide` restores `PADDLE.w`, keeping the paddle center fixed.
- Adding a power-up is one new entry in `POWERUPS`, plus the code that reads its flag if it is passive. It requires no change to the drop, timer or HUD code.
- A new ball starts with `trail: []`.

## Implementation plan

1. Refactor `state.ball` into `state.balls[]` with a single ball. In `game.js`, loop over `balls` for movement, wall, paddle and brick collisions; `loseLife` runs when the array is empty after removing balls below the canvas; a fresh single ball is created for `ready` after a life is lost or a level is cleared. `physics.js` keeps its signatures. Manual test: the game plays exactly as before (launch, bounce, break, lose a life, clear a level, Game Over).
2. Move the trail into each ball: `trackBall` in `fx.js` takes a ball and stores `ball.trail`; `renderer.js` draws every ball with its trail and the glow. Manual test: the trail looks the same as before with one ball; in the console, pushing a second ball into `state.balls` shows it with a shorter trail.
3. Add `POWERUP` and `BALL.maxCount` to `src/config.js`, and create `src/powerups.js` with `POWERUPS` (only `wide`), `spawnDrop`, `updateDrops` (move, catch, discard) and `drawDrop` data helpers. Wire it in `game.js`: roll on brick break, update each frame in `playing`, clear drops on level clear and on `loseLife`. Draw capsules in `renderer.js`. Manual test: with `dropChance` temporarily set to 1, every broken brick drops a capsule that falls, disappears on the paddle or below the canvas.
4. Add `state.effects` with `activate(state, id)`, `tickEffects(state)` and `clearEffects(state)`; `wide` implements apply and expire. Catching a capsule activates its effect; the timer counts down only in `playing`; `loseLife` and restart clear everything; level clear keeps effects. Manual test: catching `W` widens the paddle for ~10 s, catching another during that time refreshes the timer without widening further, losing a life restores the width.
5. Feedback: `powerupCaught` event in `fx.js` (ring at the paddle in the effect color plus the existing paddle flash); HUD icon with a remaining-time bar per active effect in `renderer.js`. Manual test: catching shows the ring, the HUD icon appears and its bar drains; with `prefers-reduced-motion: reduce` the ring is skipped and the HUD still works.

## Acceptance criteria

- [ ] The page loads through a static server with no console errors.
- [ ] `state.ball` no longer exists; the game uses `state.balls` and always has at least one ball.
- [ ] With one ball, gameplay, scoring, level advance and Game Over behave as in SPEC 03 and SPEC 05.
- [ ] A life is lost only when the last ball in `state.balls` falls below the canvas.
- [ ] Each ball has its own trail; extra balls keep at most `FX.trailLength / 2` trail points.
- [ ] Each destroyed brick creates a drop with probability `POWERUP.dropChance` (with the value temporarily set to 1, every brick drops; with 0, none).
- [ ] A drop falls `POWERUP.fallSpeed` px per frame and is removed when it touches the paddle or leaves the canvas.
- [ ] Catching a `wide` drop makes `paddle.w` equal to `PADDLE.w * 1.5` and `state.effects.wide` equal to 600.
- [ ] Catching `wide` while it is active resets the counter to 600 and leaves `paddle.w` at `PADDLE.w * 1.5`.
- [ ] `state.effects.wide` decreases by 1 per frame only while `phase === 'playing'`.
- [ ] When the counter reaches 0 the key is removed from `state.effects` and `paddle.w` equals `PADDLE.w` again, with the same paddle center.
- [ ] Losing a life empties `state.effects` and `state.drops` and restores `paddle.w`.
- [ ] Clearing a level empties `state.drops` and keeps `state.effects`.
- [ ] Game Over and restart start with empty `effects` and `drops` and `paddle.w === PADDLE.w`.
- [ ] The paddle stays inside the canvas while widened, including at both walls.
- [ ] The HUD shows one icon per active effect and its bar drains with the counter.
- [ ] Catching a drop triggers the ring and flash; with `prefers-reduced-motion: reduce` the ring is not drawn.
- [ ] The high score still persists across reloads.
- [ ] Adding a second entry to `POWERUPS` makes it drop, activate, expire and show in the HUD without changing any other file.

## Decisions

- **Yes:** fixed `dropChance` per brick. Predictable and tunable in `config.js`; a pity timer adds state for a feel problem we do not have yet.
- **No:** carrier bricks marked by `createLevel`. Touches the brick shape and `levels.js`; deserves its own spec.
- **Yes:** independent timers per type in `state.effects`. Allows combos (for example wide plus fireball), which is where the fun is; "one at a time" would make the three parallel specs overwrite each other.
- **Yes:** re-catching an active type refreshes the timer and does not re-apply. Keeps `apply` and `expire` symmetric and avoids stacking bugs such as a paddle that grows twice.
- **No:** stacking durations or levels. Each power-up would have to define what stacking means.
- **Yes:** one reference power-up, `wide`. It is the smallest effect that exercises apply, expire, refresh and the HUD, and it lives in `main` before the parallel specs start, so the paddle spec extends it instead of conflicting with it.
- **No:** a debug-only test power-up. It would add a code path that exists only for testing.
- **Yes:** losing a life clears effects; clearing a level keeps them. Losing is a penalty and finishing a board fast is rewarded. Drops in flight are removed in both cases because they belong to the old board.
- **Yes:** timers run only in `playing`. Counting down during `ready` or `lost` would punish the player for pauses they do not control.
- **Yes:** `state.balls[]` in this spec with one ball. The refactor is mechanical, easy to verify against the existing behavior, and unblocks Multiball without it conflicting with other work.
- **Yes:** per-ball trail with a shorter trail for extra balls, and `BALL.maxCount = 6`. Cost grows linearly and is bounded (at most about 6 x 12 points); the bloom pass is one offscreen pass regardless of ball count.
- **No:** a single shared trail following `balls[0]`. Cheaper, but extra balls would look dead.
- **Yes:** no `tick` hook in the registry. Passive flags cover Fireball, Slow/Fast and Shield; an active per-frame hook is added on the third real use (probably Laser).
- **Yes:** canvas capsule plus existing FX, no sprite and no sound. The spritesheet has no power-up art and sound has its own spec.
- **Yes:** uniform roll over `POWERUPS`. Weights matter only when there is more than one entry.

## Risks

| Risk                                                                 | Mitigation                                                                                           |
| -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| The `balls[]` refactor breaks existing behavior                      | Step 1 is behavior-preserving with one ball and has its own manual test before anything new lands.   |
| Effect state left over after Game Over or a lost life                | `clearEffects` runs in `loseLife` and in `createState`; two acceptance criteria cover it.            |
| Widened paddle sticks out of the canvas                              | `expire` and the existing clamp use `paddle.w`; a criterion checks both walls.                       |
| Merge conflicts between the three follow-up specs in `game.js`       | The registry, drops, timers and HUD are in `main` already; follow-ups touch only their own entries.  |
| Trails of many balls hurt frame rate                                 | `BALL.maxCount` and half-length trails for extra balls bound the cost.                               |

## What is **not** in this spec

- Any power-up besides `wide`.
- Sound for power-ups.
- A per-frame `tick` hook, bad power-ups, weighted drops, carrier bricks or a pity timer.
- Spawning extra balls or enforcing `BALL.maxCount`.
- Persisting anything about power-ups.

Each one of those, if it lands, goes in its own spec.
