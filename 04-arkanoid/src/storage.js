const HIGH_SCORE_KEY = 'arkanoid:highScore:v1';

export function loadHighScore() {
  try {
    const value = parseInt(localStorage.getItem(HIGH_SCORE_KEY), 10);
    return Number.isNaN(value) ? 0 : value;
  } catch {
    return 0;
  }
}

export function saveHighScore(score) {
  try {
    localStorage.setItem(HIGH_SCORE_KEY, String(score));
  } catch {
    // Storage unavailable: high score lives in memory only.
  }
}
