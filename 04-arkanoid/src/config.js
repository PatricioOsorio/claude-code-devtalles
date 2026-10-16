export const W = 480,
  H = 640;

export const HUD_H = 56;

export const PADDLE = { w: 96, h: 14, speed: 6, bottomOffset: 48, maxBounceAngle: Math.PI / 3 };
export const BALL = { r: 6, launchVx: 3, launchVy: -4 };

export const COLORS = ['red', 'yellow', 'cyan', 'magenta', 'hotpink', 'green']; // top to bottom
export const BRICK = { w: 42, h: 20, gap: 4, rows: 6, cols: 10, top: HUD_H + 40, points: 10 };

export const LIVES = 3;

export const SOUND = {
  volume: 0.5, // 0..1, applied to every effect
  files: {
    bounce: 'assets/sounds/ball-bounce.mp3',
    break: 'assets/sounds/break-sound.mp3',
  },
};

export const LEVEL = {
  baseRows: 2, // rows at level 1
  rowsPerLevel: 1, // added rows per level, capped at BRICK.rows
  baseDensity: 0.6, // chance a cell has a brick at level 1
  densityPerLevel: 0.05, // added per level, capped at 1
  bannerFrames: 90, // ~1.5 s
};

export const FX_COLORS = {
  red: '#ff4d6d',
  yellow: '#ffd23f',
  cyan: '#2ee6ff',
  magenta: '#d94dff',
  hotpink: '#ff5fb8',
  green: '#4dff88',
};

export const FX = {
  burstCount: 14, // particles per brick; /3 with reduced motion
  trailLength: 12,
  shakeBrick: 2, // px amplitude
  shakeLife: 10,
  flashPaddle: 0.12, // max alpha, kept low on purpose
  bloomScale: 0.25, // offscreen size relative to the canvas
  bloomStrength: 0.8,
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
