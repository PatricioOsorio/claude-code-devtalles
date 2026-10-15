# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## State

Arkanoid game in plain HTML + CSS + JavaScript (canvas). README says game is not implemented yet: only `assets/` exists. No `package.json`, no build, no lint, no tests. Run by opening `index.html` (to be created) in a browser, or via any static server (`python3 -m http.server`) since sprites load via `Image`.

## Assets

- `assets/spritesheet.js`: plain global script (no modules). Defines `SPRITES` (paddle, ball, `blocks.<color>`), `EXPLOSION_FRAMES` (4 frames per color, `EXPLOSION_DURATION = 150` ms), and helpers `loadSpritesheet(cb)`, `drawFrame(ctx, frame, x, y, w, h)`, `drawSprite(ctx, name, x, y, w, h)`. Block sprites use the `block_<color>` name. Must include via `<script>` before game code and call `loadSpritesheet` before drawing; draw helpers silently no-op until loaded.
- Spritesheet path is hardcoded as `assets/spritesheet-breakout.png`, relative to the HTML page, so `index.html` must live at project root.
- `assets/sounds/`: `ball-bounce.mp3`, `break-sound.mp3`.

## Spec-driven workflow

`/spec` and `/spec-impl` skills (in `.agents/skills/`, locked in `skills-lock.json`) drive features: specs go in `specs/` (numbered `NN-name`), `/spec-impl` implements an approved spec on a branch named after it. Both are manually invoked only.

## Language

Replies in Spanish; code, comments, docs, commits in English (see project/global instructions).
