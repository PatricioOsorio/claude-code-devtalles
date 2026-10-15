# SPEC 04 — Sound effects

> **Status:** Approved
> **Depends on:** SPEC 01, SPEC 03
> **Date:** 2026-10-15
> **Objective:** Play `ball-bounce.mp3` when the ball bounces off a wall or the paddle and `break-sound.mp3` when a brick is destroyed, with minimal changes to `game.js`.

## Scope

**In:**

- New module `src/audio.js` that loads the two files in `assets/sounds/` and exposes `playSound(name)`.
- `ball-bounce.mp3` on every wall bounce (left, right, top) and every paddle bounce.
- `break-sound.mp3` on every brick destruction. A brick hit plays only this sound.
- `bounceOffWalls` returns `true` when it bounced, same contract as `bounceOffPaddle`.
- Fixed volume stored as a constant in `src/config.js`.
- Overlapping playback: a new sound can start while the previous one is still playing.

**Out of scope (for future specs):**

- Mute key, volume control or any audio UI.
- Sounds for ball loss, Game Over, win or launch.
- Background music.
- Web Audio API, pitch variation or spatial effects.
- Persisting any audio preference.

## Data model

```js
// src/config.js (addition)
export const SOUND = {
  volume: 0.5, // 0..1, applied to every effect
  files: {
    bounce: 'assets/sounds/ball-bounce.mp3',
    break: 'assets/sounds/break-sound.mp3',
  },
};
```

```js
// src/audio.js
// playSound('bounce' | 'break'): void
```

Conventions:

- Paths are relative to `index.html`, same rule as the spritesheet.
- Sound names are the keys of `SOUND.files`; no other names are accepted.
- `playSound` is fire-and-forget; game state never depends on it.

## Implementation plan

1. Add `SOUND` to `src/config.js`. Manual test: game plays exactly as before, no console errors.
2. Create `src/audio.js`: preload one `Audio` per entry of `SOUND.files`; `playSound` clones the preloaded node, sets `volume`, calls `play()` and ignores a rejected promise. Manual test: `playSound('bounce')` from the DevTools console after a click is audible.
3. Make `bounceOffWalls` return `true` when it bounced and `false` otherwise. Manual test: game plays exactly as before.
4. In `game.js`, import `playSound` and add one call next to each existing event: `bounce` beside `paddleHit` and on the `bounceOffWalls` result, `break` beside `brickBroken`. Manual test: hear bounce on walls and paddle, break on bricks.

## Acceptance criteria

- [ ] Loading the page through a static server shows the game with no console errors.
- [ ] Each wall bounce (left, right, top) plays `ball-bounce.mp3` exactly once.
- [ ] Each paddle bounce plays `ball-bounce.mp3` exactly once.
- [ ] Each destroyed brick plays `break-sound.mp3` exactly once and does not play `ball-bounce.mp3`.
- [ ] Two bricks broken in consecutive frames produce two audible sounds (no cut-off).
- [ ] No sound plays in `ready`, `lost`, `over` or `won` phases.
- [ ] Sounds play at `SOUND.volume`.
- [ ] If an audio file fails to load or `play()` is rejected, the game keeps running and the console shows no uncaught error.
- [ ] `game.js` diff only adds the import and the `playSound` calls (no restructuring).
- [ ] Score, lives, high score, FX and win/over behavior are unchanged from SPEC 01 and SPEC 03.

## Decisions

- **Yes:** dedicated `src/audio.js`. Keeps audio apart from FX (`fx.js` is visual and honors `reducedMotion`, which does not apply to sound).
- **Yes:** `playSound` calls placed next to the existing `emit` calls in `game.js`. Smallest possible diff while the levels feature edits the same file in parallel.
- **Yes:** `bounceOffWalls` returns a boolean. Matches `bounceOffPaddle`; avoids sign-comparison logic in `game.js`.
- **Yes:** brick hit plays only `break-sound`. One hit, one sound; stacking both would blur the mix.
- **Yes:** clone the preloaded `Audio` per play. A single node cannot overlap with itself, and chain hits are frequent.
- **Yes:** fixed volume, no mute. Out of scope; a toggle needs input and HUD changes.
- **No:** Web Audio API. Two short effects do not justify decoding buffers and gain nodes.
- **No:** unlock-on-first-gesture code. The first sound can only occur after the launch input, which is already a user gesture.

## Risks

| Risk                                          | Mitigation                                                                          |
| --------------------------------------------- | ----------------------------------------------------------------------------------- |
| Browser blocks playback before a user gesture | First sound happens after launch input; a rejected `play()` is ignored.             |
| Merge conflict with levels spec in `game.js`  | Only an import and single-line calls are added; no existing lines are rewritten.    |
| Many clones at once pile up during chain hits | Clones are short effects and garbage-collected after ending; no pooling until seen. |

## What is **not** in this spec

- Mute, volume control or audio UI.
- Sounds for ball loss, Game Over, win or launch.
- Music.
- Web Audio API or pitch variation.

Each one of those, if it lands, goes in its own spec.
