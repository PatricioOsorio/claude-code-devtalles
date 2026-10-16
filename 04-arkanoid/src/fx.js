import { FX, FX_COLORS } from './config.js';

// Rendering-only effects state. Never read by game logic.
const SHAKE_DECAY = 0.85;
const SHAKE_MIN = 0.1;
const FLASH_DECAY = 0.8;

function spawnBurst(fx, x, y, color) {
  const count = Math.round(fx.reducedMotion ? FX.burstCount / 3 : FX.burstCount);
  for (let i = 0; i < count; i++) {
    const layer = Math.random() < 0.5 ? 'far' : 'near';
    const scale = layer === 'far' ? FX.farScale : 1;
    const angle = Math.random() * Math.PI * 2;
    const speed = (1 + Math.random() * 3) * scale;
    const maxLife = 30 + Math.random() * 20;
    fx.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: maxLife,
      maxLife,
      size: (1.5 + Math.random() * 2) * scale,
      color,
      layer,
    });
  }
}

function spawnShards(fx, x, y, color) {
  const count = fx.reducedMotion ? FX.shardCount / 2 : FX.shardCount;
  for (let i = 0; i < count; i++) {
    const layer = Math.random() < 0.5 ? 'far' : 'near';
    const scale = layer === 'far' ? FX.farScale : 1;
    const angle = Math.random() * Math.PI * 2;
    const speed = (1.5 + Math.random() * 2.5) * scale;
    const maxLife = 30 + Math.random() * 15;
    fx.shards.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1,
      rot: Math.random() * Math.PI * 2,
      vr: fx.reducedMotion ? 0 : (Math.random() - 0.5) * 0.4,
      w: (5 + Math.random() * 4) * scale,
      h: (3 + Math.random() * 2) * scale,
      life: maxLife,
      maxLife,
      color,
      layer,
    });
  }
}

// Event name -> (fx, payload) => void. Filled in as effects land.
const handlers = {
  paddleHit(fx) {
    if (!fx.reducedMotion) fx.flash = FX.flashPaddle;
  },
  lifeLost(fx) {
    if (!fx.reducedMotion) fx.shake = FX.shakeLife;
  },
  ballLost(fx, { x, y }) {
    spawnBurst(fx, x, y, FX_COLORS.red);
    if (!fx.reducedMotion) {
      fx.rings.push({ x, y, life: FX.ringLife, maxLife: FX.ringLife, color: FX_COLORS.red });
    }
    if (!fx.reducedMotion) fx.edgeFlash = FX.lostFlash;
  },
  brickBroken(fx, { x, y, color }) {
    if (!fx.reducedMotion) fx.shake = Math.max(fx.shake, FX.shakeBrick);
    spawnBurst(fx, x, y, FX_COLORS[color]);
    spawnShards(fx, x, y, FX_COLORS[color]);
    if (!fx.reducedMotion) {
      fx.rings.push({ x, y, life: FX.ringLife, maxLife: FX.ringLife, color: FX_COLORS[color] });
    }
  },
};

export function createFx() {
  const fx = {
    particles: [],
    trail: [],
    shards: [],
    rings: [],
    shake: 0,
    flash: 0,
    edgeFlash: 0,
    overT: 0,
    levelT: 0,
    reducedMotion: false,
  };
  // Without matchMedia the game keeps full effects.
  const query = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (query) {
    fx.reducedMotion = query.matches;
    query.addEventListener('change', (e) => (fx.reducedMotion = e.matches));
  }
  return fx;
}

export function emit(fx, event, payload) {
  handlers[event]?.(fx, payload);
}

// The trail only exists while the ball is in flight.
export function trackBall(fx, ball, flying) {
  if (!flying || fx.reducedMotion) {
    fx.trail.length = 0;
    return;
  }
  fx.trail.push({ x: ball.x, y: ball.y });
  if (fx.trail.length > FX.trailLength) fx.trail.shift();
}

export function updateFx(fx) {
  fx.shake *= SHAKE_DECAY;
  if (fx.shake < SHAKE_MIN) fx.shake = 0;
  fx.flash *= FLASH_DECAY;
  fx.edgeFlash *= FLASH_DECAY;
  if (fx.reducedMotion) fx.shake = fx.flash = fx.edgeFlash = 0;

  for (const p of fx.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  }
  fx.particles = fx.particles.filter((p) => p.life > 0);

  for (const s of fx.shards) {
    s.vy += FX.shardGravity;
    s.x += s.vx;
    s.y += s.vy;
    s.rot += s.vr;
    s.life--;
  }
  fx.shards = fx.shards.filter((s) => s.life > 0);

  for (const r of fx.rings) r.life--;
  fx.rings = fx.rings.filter((r) => r.life > 0);
}
