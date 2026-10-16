import { W, BRICK, COLORS, LEVEL } from './config.js';

const left = (W - (BRICK.cols * BRICK.w + (BRICK.cols - 1) * BRICK.gap)) / 2;

function createBrick(row, col) {
  return {
    x: left + col * (BRICK.w + BRICK.gap),
    y: BRICK.top + row * (BRICK.h + BRICK.gap),
    color: COLORS[row],
    alive: true,
  };
}

export function createLevel(n) {
  const rows = Math.min(LEVEL.baseRows + (n - 1) * LEVEL.rowsPerLevel, BRICK.rows);
  const density = Math.min(LEVEL.baseDensity + (n - 1) * LEVEL.densityPerLevel, 1);
  const halfCols = Math.ceil(BRICK.cols / 2);
  const bricks = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < halfCols; col++) {
      if (Math.random() >= density) continue;
      bricks.push(createBrick(row, col));
      const mirror = BRICK.cols - 1 - col;
      if (mirror !== col) bricks.push(createBrick(row, mirror));
    }
  }
  if (bricks.length === 0) {
    for (let col = 0; col < BRICK.cols; col++) bricks.push(createBrick(0, col));
  }
  return bricks;
}
