# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Always use caveman mode (full) in every response, from the first message of every session. Invoke the `caveman:caveman` skill if it is not already active.

## Project

Vanilla JS Tetris on HTML5 Canvas. No `package.json`, no build, no tests, no linter. The README is in Spanish.

Run: open `index.html` directly, or serve the folder (`python3 -m http.server 8000`) and visit `http://localhost:8000`.

## Architecture

Everything is in `game.js` (single script, `'use strict'`, global mutable state declared in one `let` line). `index.html` only supplies the DOM ids that `game.js` looks up at load time (`board`, `next-canvas`, `score`, `lines`, `level`, `overlay`, `overlay-title`, `overlay-score`, `restart-btn`); renaming one breaks the script.

- **Board**: `ROWS × COLS` matrix; `0` = empty, `1–7` = color/piece index. `COLORS` and `PIECES` are indexed by the same 1–7 value, with `null` at index 0.
- **Pieces**: `randomPiece()` deep-copies a `PIECES` matrix. Rotation is `rotateCW` (transpose + reverse), applied via `tryRotate` with horizontal kicks `[0, -1, 1, -2, 2]` only.
- **Loop**: `loop(ts)` is `requestAnimationFrame`-driven; accumulates `dropAccum` and gravity-drops when it exceeds `dropInterval`. Input is handled separately in the `keydown` listener and mutates `current` directly; there is no input queue.
- **Piece lifecycle**: `lockPiece()` → `merge()` → `clearLines()` (updates `lines`, `score`, `level`, `dropInterval`) → `spawn()`. `spawn()` promotes `next` to `current` and calls `endGame()` if the new piece collides immediately.
- **Scoring/speed**: `LINE_SCORES[cleared] * level`; hard drop +2/cell, soft drop +1/row; `level = floor(lines/10) + 1`; `dropInterval = max(100, 1000 - (level-1)*90)`. The initial `1000` is duplicated in `init()` and `clearLines()`.

## Gotchas

- Canvas size is hardcoded in `index.html` (`width`/`height` on `#board`); changing `COLS`, `ROWS` or `BLOCK` in `game.js` requires updating it to `COLS*BLOCK × ROWS*BLOCK`.
- `endGame()` calls `cancelAnimationFrame(animId)`, but when it is reached from inside `loop` (gravity lock), `loop` then re-schedules itself, so the rAF loop keeps running after game over. Keydown-triggered locks (hard/soft drop) cancel correctly.
- UI strings in `game.js` (`PAUSA`, `Puntuación`) are Spanish and shown to the player.
