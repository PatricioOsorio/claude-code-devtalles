export const W = 480,
  H = 640;

export const HUD_H = 56;

export const PADDLE = { w: 96, h: 14, speed: 6, bottomOffset: 48, maxBounceAngle: Math.PI / 3 };
export const BALL = { r: 6, launchVx: 3, launchVy: -4 };

export const COLORS = ['red', 'yellow', 'cyan', 'magenta', 'hotpink', 'green']; // top to bottom
export const BRICK = { w: 42, h: 20, gap: 4, rows: 6, cols: 10, top: HUD_H + 40, points: 10 };

export const LIVES = 3;

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
};
