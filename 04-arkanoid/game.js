import { W, H, PADDLE, BALL, BRICK, COLORS, LIVES, FX } from './src/config.js';
import { createInput } from './src/input.js';
import { bounceOffWalls, bounceOffPaddle, bounceOffBricks } from './src/physics.js';
import { loadHighScore, saveHighScore } from './src/storage.js';
import { createFx, updateFx, trackBall, emit } from './src/fx.js';
import { render } from './src/renderer.js';
import { loadSpritesheet } from './assets/spritesheet.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const input = createInput(canvas);

const paddleY = H - PADDLE.bottomOffset;

function createBricks() {
  const left = (W - (BRICK.cols * BRICK.w + (BRICK.cols - 1) * BRICK.gap)) / 2;
  const bricks = [];
  for (let row = 0; row < BRICK.rows; row++) {
    for (let col = 0; col < BRICK.cols; col++) {
      bricks.push({
        x: left + col * (BRICK.w + BRICK.gap),
        y: BRICK.top + row * (BRICK.h + BRICK.gap),
        color: COLORS[row],
        alive: true,
      });
    }
  }
  return bricks;
}

function createState(highScore) {
  return {
    phase: 'ready',
    lostTimer: 0,
    score: 0,
    lives: LIVES,
    highScore,
    bricks: createBricks(),
    paddle: { x: (W - PADDLE.w) / 2, y: paddleY, w: PADDLE.w, h: PADDLE.h, speed: PADDLE.speed },
    ball: { x: W / 2, y: paddleY - BALL.r, r: BALL.r, vx: 0, vy: 0 },
  };
}

let state = createState(loadHighScore());
const fx = createFx();

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function loseLife() {
  emit(fx, 'lifeLost');
  emit(fx, 'ballLost', { x: state.ball.x, y: H });
  state.lives--;
  state.ball.vx = 0;
  state.ball.vy = 0;
  state.phase = 'lost';
  state.lostTimer = FX.lostFrames;
}

function update() {
  updateFx(fx);
  trackBall(fx, state.ball, state.phase === 'playing');
  fx.overT = state.phase === 'over' ? fx.overT + 1 : 0;
  const { paddle } = state;
  const mouseX = input.takeMouseX();
  if (mouseX !== null) paddle.x = mouseX - paddle.w / 2;
  paddle.x += input.axis() * paddle.speed;
  paddle.x = clamp(paddle.x, 0, W - paddle.w);

  const { ball } = state;
  const launch = input.takeLaunch();
  if (state.phase === 'over' || state.phase === 'won') {
    // The Game Over entrance cannot be skipped by mashing Space.
    const entered = state.phase === 'won' || fx.reducedMotion || fx.overT >= FX.overEnterFrames;
    if (launch && entered) state = createState(state.highScore);
    return;
  }
  if (state.phase === 'lost') {
    // Launch input is consumed above and dropped here: no launch during the pause.
    if (--state.lostTimer === 0) state.phase = state.lives === 0 ? 'over' : 'ready';
    return;
  }
  if (state.phase === 'ready') {
    ball.x = paddle.x + paddle.w / 2;
    ball.y = paddle.y - ball.r;
    if (launch) {
      ball.vx = BALL.launchVx;
      ball.vy = BALL.launchVy;
      state.phase = 'playing';
    }
    return;
  }

  ball.x += ball.vx;
  ball.y += ball.vy;
  bounceOffWalls(ball);
  if (bounceOffPaddle(ball, paddle)) emit(fx, 'paddleHit');

  const hit = bounceOffBricks(ball, state.bricks);
  if (hit) {
    hit.alive = false;
    emit(fx, 'brickBroken', {
      x: hit.x + BRICK.w / 2,
      y: hit.y + BRICK.h / 2,
      color: hit.color,
    });
    state.score += BRICK.points;
    if (state.score > state.highScore) {
      state.highScore = state.score;
      saveHighScore(state.highScore);
    }
    if (state.bricks.every((b) => !b.alive)) {
      state.phase = 'won';
      return;
    }
  }

  if (ball.y - ball.r > H) loseLife();
}

function frame() {
  update();
  render(ctx, state, fx);
  requestAnimationFrame(frame);
}

loadSpritesheet(frame);
