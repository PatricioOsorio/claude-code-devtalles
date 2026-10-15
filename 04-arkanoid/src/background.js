import { W, H, FX_COLORS } from './config.js';

const HORIZON = H * 0.5;
const GRID_ROWS = 10;
const GRID_SPEED = 0.0003; // grid rows per ms
const NEBULA_SPEED = 0.004; // px per ms, slower than the stars for depth
const LAYERS = [
  { count: 40, speed: 0.008, size: 1, alpha: 0.4 }, // px per ms
  { count: 20, speed: 0.02, size: 2, alpha: 0.8 },
];

// Fixed layout so the starfield doesn't reshuffle on every run of the same frame.
const stars = LAYERS.map((layer) =>
  Array.from({ length: layer.count }, (_, i) => ({
    x: (i * 97.13) % W,
    y: (i * 211.7) % H,
  })),
);

// Pre-rendered once; blobs repeat at y +/- H so the vertical scroll wraps seamlessly.
const nebula = (() => {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const g = c.getContext('2d');
  const blobs = [
    { x: 0.2, y: 0.25, r: 190, color: FX_COLORS.magenta },
    { x: 0.8, y: 0.55, r: 220, color: FX_COLORS.cyan },
    { x: 0.35, y: 0.85, r: 170, color: FX_COLORS.hotpink },
  ];
  for (const b of blobs) {
    for (const dy of [-H, 0, H]) {
      const x = b.x * W;
      const y = b.y * H + dy;
      const grad = g.createRadialGradient(x, y, 0, x, y, b.r);
      grad.addColorStop(0, b.color);
      grad.addColorStop(1, 'transparent');
      g.globalAlpha = 0.22;
      g.fillStyle = grad;
      g.fillRect(x - b.r, y - b.r, b.r * 2, b.r * 2);
    }
  }
  return c;
})();

let elapsed = 0;
let last = performance.now();

// Time only advances while `moving`, so the scene freezes outside of play.
export function drawBackground(ctx, moving) {
  const now = performance.now();
  if (moving) elapsed += now - last;
  last = now;

  ctx.fillStyle = '#0a0612';
  ctx.fillRect(0, 0, W, H);

  const y = (elapsed * NEBULA_SPEED) % H;
  ctx.drawImage(nebula, 0, y);
  ctx.drawImage(nebula, 0, y - H);

  drawGrid(ctx);
  LAYERS.forEach((layer, i) => drawStars(ctx, layer, stars[i]));
}

function drawGrid(ctx) {
  ctx.save();
  ctx.strokeStyle = FX_COLORS.magenta;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let k = -6; k <= 6; k++) {
    ctx.moveTo(W / 2, HORIZON);
    ctx.lineTo(W / 2 + k * (W / 4), H);
  }
  const shift = (elapsed * GRID_SPEED) % 1;
  for (let i = 0; i < GRID_ROWS; i++) {
    const p = (i + shift) / GRID_ROWS;
    const y = HORIZON + (H - HORIZON) * p * p;
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawStars(ctx, layer, points) {
  ctx.fillStyle = '#fff';
  ctx.globalAlpha = layer.alpha;
  for (const s of points) {
    const y = (s.y + elapsed * layer.speed) % H;
    ctx.fillRect(s.x, y, layer.size, layer.size);
  }
  ctx.globalAlpha = 1;
}
