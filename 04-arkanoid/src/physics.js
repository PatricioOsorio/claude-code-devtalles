import { W, HUD_H, PADDLE, BRICK } from './config.js';

// Returns true when the ball bounced off at least one wall.
export function bounceOffWalls(ball) {
  let bounced = false;
  if (ball.x - ball.r < 0) {
    ball.x = ball.r;
    ball.vx = Math.abs(ball.vx);
    bounced = true;
  } else if (ball.x + ball.r > W) {
    ball.x = W - ball.r;
    ball.vx = -Math.abs(ball.vx);
    bounced = true;
  }
  if (ball.y - ball.r < HUD_H) {
    ball.y = HUD_H + ball.r;
    ball.vy = Math.abs(ball.vy);
    bounced = true;
  }
  return bounced;
}

// Bounce angle grows with distance from paddle center; speed stays constant. Returns true on hit.
export function bounceOffPaddle(ball, paddle) {
  const hits =
    ball.vy > 0 &&
    ball.x + ball.r >= paddle.x &&
    ball.x - ball.r <= paddle.x + paddle.w &&
    ball.y + ball.r >= paddle.y &&
    ball.y - ball.r <= paddle.y + paddle.h;
  if (!hits) return false;

  const offset = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
  const angle = Math.max(-1, Math.min(1, offset)) * PADDLE.maxBounceAngle;
  const speed = Math.hypot(ball.vx, ball.vy);
  ball.vx = speed * Math.sin(angle);
  ball.vy = -speed * Math.cos(angle);
  ball.y = paddle.y - ball.r;
  return true;
}

// Reflects on the axis with the smaller penetration. Returns the hit brick, if any.
export function bounceOffBricks(ball, bricks) {
  for (const brick of bricks) {
    if (!brick.alive) continue;
    const nearestX = Math.max(brick.x, Math.min(ball.x, brick.x + BRICK.w));
    const nearestY = Math.max(brick.y, Math.min(ball.y, brick.y + BRICK.h));
    if (Math.hypot(ball.x - nearestX, ball.y - nearestY) >= ball.r) continue;

    const overlapX = Math.min(ball.x + ball.r - brick.x, brick.x + BRICK.w - (ball.x - ball.r));
    const overlapY = Math.min(ball.y + ball.r - brick.y, brick.y + BRICK.h - (ball.y - ball.r));
    if (overlapX < overlapY) ball.vx = -ball.vx;
    else ball.vy = -ball.vy;
    return brick;
  }
  return null;
}
