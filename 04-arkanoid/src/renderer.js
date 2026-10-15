import { W, H, HUD_H, BRICK, FX, FX_COLORS } from './config.js';
import { applyBloom } from './bloom.js';
import { drawBackground } from './background.js';
import { drawSprite } from '../assets/spritesheet.js';

const FONT = 'system-ui, -apple-system, "Segoe UI", sans-serif';
const MAX_LIFE_ICONS = 5;

// Pre-rendered once: a radial gradient per frame per sprite would be wasteful.
const glow = createGlow(FX_COLORS.cyan);
const vignette = createVignette();

function createVignette() {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.75);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.6)');
  g.fillStyle = grad;
  g.fillRect(0, 0, W, H);
  return c;
}

function createGlow(color) {
  const size = 64;
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(1, 'transparent');
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function render(ctx, state, fx) {
  const { paddle, ball, bricks } = state;
  const ballVisible = state.phase !== 'lost';
  drawBackground(ctx, state.phase === 'playing' && !fx.reducedMotion);
  ctx.save();
  ctx.translate((Math.random() * 2 - 1) * fx.shake, (Math.random() * 2 - 1) * fx.shake);
  drawParticles(ctx, fx, 'far');
  drawShards(ctx, fx, 'far');
  ctx.save();
  ctx.globalAlpha = FX.shadowAlpha;
  ctx.fillStyle = '#000';
  const off = FX.shadowOffset;
  for (const brick of bricks) {
    if (brick.alive) ctx.fillRect(brick.x, brick.y + off, BRICK.w, BRICK.h);
  }
  ctx.fillRect(paddle.x, paddle.y + off, paddle.w, paddle.h);
  if (ballVisible) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y + off, ball.r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
  for (const brick of bricks) {
    if (brick.alive) drawSprite(ctx, `block_${brick.color}`, brick.x, brick.y, BRICK.w, BRICK.h);
  }
  drawGlow(ctx, paddle.x - 16, paddle.y - 14, paddle.w + 32, paddle.h + 28, 0.5);
  if (ballVisible) {
    drawGlow(ctx, ball.x - ball.r * 4, ball.y - ball.r * 4, ball.r * 8, ball.r * 8, 0.7);
    drawTrail(ctx, fx, ball.r);
  }
  drawSprite(ctx, 'paddle', paddle.x, paddle.y, paddle.w, paddle.h);
  if (ballVisible) {
    drawSprite(ctx, 'ball', ball.x - ball.r, ball.y - ball.r, ball.r * 2, ball.r * 2);
  }
  drawParticles(ctx, fx, 'near');
  drawShards(ctx, fx, 'near');
  drawRings(ctx, fx);
  ctx.restore();

  ctx.fillStyle = `rgba(255, 255, 255, ${fx.flash})`;
  ctx.fillRect(0, 0, W, H);

  if (fx.edgeFlash > 0.001) {
    ctx.save();
    ctx.globalAlpha = fx.edgeFlash;
    ctx.strokeStyle = FX_COLORS.red;
    ctx.lineWidth = 24;
    ctx.strokeRect(0, 0, W, H);
    ctx.restore();
  }

  applyBloom(ctx);
  ctx.drawImage(vignette, 0, 0);

  drawHud(ctx, state);

  if (state.phase === 'won') drawEndScreen(ctx, state, 'YOU WIN', '#4ade80');
  if (state.phase === 'over') {
    const still = fx.reducedMotion;
    const enter = still ? 1 : Math.min(fx.overT / FX.overEnterFrames, 1);
    const count = still ? 1 : Math.min(fx.overT / FX.overCountFrames, 1);
    drawEndScreen(ctx, state, 'GAME OVER', '#f87171', { enter, count, pulse: still ? 0 : fx.overT });
  }
}

function drawGlow(ctx, x, y, w, h, alpha) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = alpha;
  ctx.drawImage(glow, x, y, w, h);
  ctx.restore();
}

function drawTrail(ctx, { trail }, r) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  trail.forEach((p, i) => {
    const t = (i + 1) / FX.trailLength;
    ctx.globalAlpha = t * 0.5;
    ctx.drawImage(glow, p.x - r * 2 * t, p.y - r * 2 * t, r * 4 * t, r * 4 * t);
  });
  ctx.restore();
}

function layerAlpha(layer) {
  return layer === 'far' ? FX.farAlpha : 1;
}

function drawParticles(ctx, { particles }, layer) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const p of particles) {
    if (p.layer !== layer) continue;
    ctx.globalAlpha = (p.life / p.maxLife) * layerAlpha(layer);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
  ctx.restore();
}

function drawShards(ctx, { shards }, layer) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  for (const s of shards) {
    if (s.layer !== layer) continue;
    ctx.globalAlpha = (s.life / s.maxLife) * layerAlpha(layer);
    ctx.fillStyle = s.color;
    ctx.save();
    ctx.translate(s.x, s.y);
    ctx.rotate(s.rot);
    ctx.fillRect(-s.w / 2, -s.h / 2, s.w, s.h);
    ctx.restore();
  }
  ctx.restore();
}

function drawRings(ctx, { rings }) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.lineWidth = 2;
  for (const r of rings) {
    const t = 1 - r.life / r.maxLife;
    ctx.globalAlpha = 1 - t;
    ctx.strokeStyle = r.color;
    ctx.beginPath();
    ctx.arc(r.x, r.y, FX.ringMaxR * t, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.restore();
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

// `anim` is only passed by Game Over; the win screen keeps its static look.
function drawEndScreen(ctx, { score, highScore }, title, accent, anim = { enter: 1, count: 1 }) {
  const { enter, count, pulse } = anim;
  if (pulse !== undefined) {
    // 'saturation' blend with mid-gray desaturates whatever is already drawn.
    ctx.save();
    ctx.globalCompositeOperation = 'saturation';
    ctx.globalAlpha = enter;
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }
  ctx.fillStyle = `rgba(10, 12, 16, ${0.78 * enter})`;
  ctx.fillRect(0, 0, W, H);

  const pw = 340;
  const ph = 230;
  const px = (W - pw) / 2;
  const py = (H - ph) / 2;
  ctx.save();
  ctx.globalAlpha = enter;
  ctx.fillStyle = '#1b1f26';
  ctx.beginPath();
  ctx.roundRect(px, py, pw, ph, 16);
  ctx.fill();
  ctx.lineWidth = pulse === undefined ? 2 : 2 + 2 * (0.5 + 0.5 * Math.sin(pulse * 0.15));
  ctx.strokeStyle = accent;
  ctx.stroke();
  ctx.restore();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  ctx.save();
  const scale = 0.6 + 0.4 * enter;
  ctx.translate(W / 2, py + 70);
  ctx.scale(scale, scale);
  ctx.globalAlpha = enter;
  ctx.shadowColor = accent;
  ctx.shadowBlur = 24;
  ctx.fillStyle = accent;
  ctx.font = `800 44px ${FONT}`;
  ctx.fillText(title, 0, 0);
  ctx.restore();

  ctx.globalAlpha = enter;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = `600 12px ${FONT}`;
  ctx.fillText('F I N A L   S C O R E', W / 2, py + 108);
  ctx.fillStyle = '#fff';
  ctx.font = `700 40px ${FONT}`;
  ctx.fillText(String(Math.round(score * count)), W / 2, py + 150);

  if (score > 0 && score >= highScore) {
    ctx.fillStyle = '#fbbf24';
    ctx.font = `700 14px ${FONT}`;
    ctx.fillText('★ NEW HIGH SCORE ★', W / 2, py + 176);
  }

  const blink = 0.55 + 0.45 * Math.sin(performance.now() / 300);
  ctx.globalAlpha = blink * enter;
  ctx.fillStyle = '#fff';
  ctx.font = `600 15px ${FONT}`;
  ctx.fillText('Press SPACE or click to play again', W / 2, py + 208);
  ctx.globalAlpha = 1;
}
