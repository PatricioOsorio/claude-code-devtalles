export const W = 480,
  H = 640;

export const HUD_H = 56;

export const PADDLE = { w: 96, h: 14, speed: 6, bottomOffset: 48, maxBounceAngle: Math.PI / 3 };
export const BALL = { r: 6, launchVx: 3, launchVy: -4 };

export const COLORS = ['red', 'yellow', 'cyan', 'magenta', 'hotpink', 'green']; // top to bottom
export const BRICK = { w: 42, h: 20, gap: 4, rows: 6, cols: 10, top: HUD_H + 40, points: 10 };

export const LIVES = 3;
