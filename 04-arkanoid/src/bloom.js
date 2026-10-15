import { W, H, FX } from './config.js';

const small = document.createElement('canvas');
small.width = Math.max(1, Math.round(W * FX.bloomScale));
small.height = Math.max(1, Math.round(H * FX.bloomScale));
const smallCtx = small.getContext('2d');
smallCtx.imageSmoothingQuality = 'high';

// Downscale the canvas, then stretch it back additively: the upscale's
// interpolation is the blur. Call before drawing HUD so text stays sharp.
export function applyBloom(ctx) {
  if (FX.bloomStrength <= 0) return;
  smallCtx.drawImage(ctx.canvas, 0, 0, small.width, small.height);
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = FX.bloomStrength;
  ctx.drawImage(small, 0, 0, W, H);
  ctx.restore();
}
