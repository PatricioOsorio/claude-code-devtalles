import { FX, FX_COLORS } from './config.js';

// Rendering-only effects state. Never read by game logic.
const SHAKE_DECAY = 0.85;
const SHAKE_MIN = 0.1;
const FLASH_DECAY = 0.8;

// Event name -> (fx, payload) => void. Filled in as effects land.
const handlers = {
  paddleHit(fx) {
    if (!fx.reducedMotion) fx.flash = FX.flashPaddle;
  },
  lifeLost(fx) {
    if (!fx.reducedMotion) fx.shake = FX.shakeLife;
  },
  brickBroken(fx, { x, y, color }) {
    if (!fx.reducedMotion) fx.shake = Math.max(fx.shake, FX.shakeBrick);
    const count = Math.round(fx.reducedMotion ? FX.burstCount / 3 : FX.burstCount);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      const maxLife = 30 + Math.random() * 20;
      fx.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: maxLife,
        maxLife,
        size: 1.5 + Math.random() * 2,
        color: FX_COLORS[color],
      });
    }
  },
};

export function createFx() {
  const fx = { particles: [], trail: [], shake: 0, flash: 0, reducedMotion: false };
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
  if (fx.reducedMotion) fx.shake = fx.flash = 0;

  for (const p of fx.particles) {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
  }
  fx.particles = fx.particles.filter((p) => p.life > 0);
}
