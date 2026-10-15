import { W, H, HUD_H, BRICK } from './config.js';
import { drawSprite } from '../assets/spritesheet.js';

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const MAX_LIFE_ICONS = 5;

export function render(ctx, state) {
  const { paddle, ball, bricks } = state;
  ctx.clearRect(0, 0, W, H);
  for (const brick of bricks) {
    if (brick.alive) drawSprite(ctx, `block_${brick.color}`, brick.x, brick.y, BRICK.w, BRICK.h);
  }
  drawSprite(ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h);
  drawSprite(ctx, 'ball', ball.x - ball.r, ball.y - ball.r, ball.r * 2, ball.r * 2);

  drawHud(ctx, state);

  if (state.phase === 'won') drawEndScreen(ctx, state, 'YOU WIN', '#4ade80');
  if (state.phase === 'over') drawEndScreen(ctx, state, 'GAME OVER', '#f87171');
}

function drawHud(ctx, { score, highScore, lives }) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, W, HUD_H);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fillRect(0, HUD_H - 1, W, 1);

  const labelY = 20;
  const valueY = 44;
  const pad = 20;
  ctx.textBaseline = 'alphabetic';

  ctx.textAlign = 'left';
  hudLabel(ctx, 'SCORE', pad, labelY);
  hudValue(ctx, String(score).padStart(5, '0'), pad, valueY, '#fff');

  ctx.textAlign = 'center';
  hudLabel(ctx, 'HIGH', W / 2, labelY);
  hudValue(ctx, String(highScore).padStart(5, '0'), W / 2, valueY, '#fbbf24');

  ctx.textAlign = 'right';
  hudLabel(ctx, 'LIVES', W - pad, labelY);
  const size = 14;
  const step = size + 6;
  const shown = Math.min(lives, MAX_LIFE_ICONS);
  for (let i = 0; i < shown; i++) {
    drawSprite(ctx, 'ball', W - pad - size - i * step, valueY - size + 2, size, size);
  }
}

function hudLabel(ctx, text, x, y) {
  ctx.font = `600 11px ${FONT}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText(text.split('').join(' '), x, y);
}

function hudValue(ctx, text, x, y, color) {
  ctx.font = `700 22px ${FONT}`;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

function drawEndScreen(ctx, { score, highScore }, title, accent) {
  ctx.fillStyle = 'rgba(10, 12, 16, 0.78)';
  ctx.fillRect(0, 0, W, H);

  const pw = 340;
  const ph = 230;
  const px = (W - pw) / 2;
  const py = (H - ph) / 2;
  ctx.fillStyle = '#1b1f26';
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 16);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = accent;
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.save();
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;
  ctx.fillStyle = accent;
  ctx.font = `800 44px ${FONT}`;
  ctx.fillText(title, W / 2, py + 70);
  ctx.restore();

  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = `600 12px ${FONT}`;
  ctx.fillText('F I N A L   S C O R E', W / 2, py + 108);
  ctx.fillStyle = '#fff';
  ctx.font = `700 40px ${FONT}`;
  ctx.fillText(String(score), W / 2, py + 150);

  if (score > 0 && score >= highScore) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = `700 14px ${FONT}`;
    ctx.fillText('★ NEW HIGH SCORE ★', W / 2, py + 176);
  }

  const blink = 0.55 + 0.45 * Math.sin(performance.now() / 300);
  ctx.globalAlpha = blink;
  ctx.fillStyle = '#fff';
  ctx.font = `600 15px ${FONT}`;
  ctx.fillText('Press SPACE or click to play again', W / 2, py + 208);
  ctx.globalAlpha = 1;
}
