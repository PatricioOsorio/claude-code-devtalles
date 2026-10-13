'use strict';

const COLS = 10;
const ROWS = 20;
const BLOCK = 30;

const COLORS = [
  null,
  '#4dd0e1', // I - cyan
  '#ffd54f', // O - yellow
  '#ba68c8', // T - purple
  '#81c784', // S - green
  '#e57373', // Z - red
  '#90caf9', // J - pale blue
  '#ffb74d', // L - orange
  '#f06292', // + - pink
  '#4db6ac', // U - teal
  '#aed581', // Y - lime
  '#fff176', // single - light yellow
  '#a1887f', // hollow 3x3 - brown
  '#ff7043', // bomba - deep orange
  '#fff59d', // rayo - pale yellow
  '#ce93d8', // tinte - lilac
  '#bcaaa4', // gravedad - taupe
  '#80deea', // congelar - ice
];

function retroDraw(context, px, py, size, color) {
  context.fillStyle = color;
  context.fillRect(px + 1, py + 1, size - 2, size - 2);
  context.strokeStyle = blockEdge;
  context.lineWidth = 1;
  context.strokeRect(px + 1.5, py + 1.5, size - 3, size - 3);
  context.fillStyle = 'rgba(255,255,255,0.12)';
  context.fillRect(px + 1, py + 1, size - 2, 4);
}

// Each skin swaps both the palette (same 1-17 indexing as COLORS) and the block renderer.
const SKINS = {
  retro: { colors: COLORS, draw: retroDraw },
  neon: {
    colors: [
      null, '#00ffff', '#ffff00', '#ff00ff', '#39ff14', '#ff073a', '#4d4dff', '#ff9100', '#ff1493',
      '#00ffa2', '#b6ff00', '#fff700', '#c08a5a', '#ff5e00', '#faff72', '#d38bff', '#e0c3b8', '#7df9ff',
    ],
    draw(context, px, py, size, color) {
      // save/restore keeps glow and alpha changes from leaking into the icon text or later draws
      context.save();
      context.shadowColor = color;
      context.shadowBlur = 12;
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.strokeRect(px + 3, py + 3, size - 6, size - 6);
      context.fillStyle = color;
      context.globalAlpha *= 0.35;
      context.fillRect(px + 3, py + 3, size - 6, size - 6);
      context.restore();
    },
  },
  pastel: {
    colors: [
      null, '#b5ead7', '#fff1ba', '#d7bde2', '#c7f0c2', '#ffb7b2', '#bde0fe', '#ffd6a5', '#ffc8dd',
      '#a8e6cf', '#e2f0cb', '#fdffb6', '#e6ccb2', '#ffab91', '#fffacd', '#e0bbff', '#ddd0c8', '#caf0f8',
    ],
    draw(context, px, py, size, color) {
      context.fillStyle = color;
      context.beginPath();
      context.roundRect(px + 2, py + 2, size - 4, size - 4, size * 0.3);
      context.fill();
      context.fillStyle = 'rgba(255,255,255,0.35)';
      context.beginPath();
      context.roundRect(px + 5, py + 5, size - 10, size * 0.25, size * 0.1);
      context.fill();
    },
  },
  pixel: {
    colors: COLORS,
    draw(context, px, py, size, color) {
      context.fillStyle = color;
      context.fillRect(px, py, size, size);
      // 3px checker dither
      const t = 3;
      context.fillStyle = 'rgba(255,255,255,0.22)';
      for (let i = 0; i < size / t; i++) {
        for (let j = 0; j < size / t; j++) {
          if ((i + j) % 2) continue;
          context.fillRect(px + i * t, py + j * t, Math.min(t, size - i * t), Math.min(t, size - j * t));
        }
      }
      context.fillStyle = 'rgba(0,0,0,0.45)';
      context.fillRect(px, py + size - t, size, t);
      context.fillRect(px + size - t, py, t, size);
    },
  },
};

const PIECES = [
  null,
  [[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]], // I
  [[2,2],[2,2]],                               // O
  [[0,3,0],[3,3,3],[0,0,0]],                  // T
  [[0,4,4],[4,4,0],[0,0,0]],                  // S
  [[5,5,0],[0,5,5],[0,0,0]],                  // Z
  [[6,0,0],[6,6,6],[0,0,0]],                  // J
  [[0,0,7],[7,7,7],[0,0,0]],                  // L
  [[0,8,0],[8,8,8],[0,8,0]],                  // + (pentomino)
  [[9,0,9],[9,9,9],[0,0,0]],                  // U (pentomino)
  [[0,0,0,0],[10,10,10,10],[0,10,0,0],[0,0,0,0]], // Y (pentomino)
  [[11]],                                      // single (Tetris reward)
  [[12,12,12],[12,0,12],[12,12,12]],          // hollow 3x3 (challenge)
  [[13]],                                      // bomba
  [[14]],                                      // rayo
  [[15]],                                      // tinte
  [[16]],                                      // gravedad
  [[17]],                                      // congelar
];

const SINGLE = 11;
const SPECIAL_PIECES = [8, 9, 10, 12];
const SPECIAL_CHANCE = 0.1;

const BOMB = 13, LIGHTNING = 14, TINT = 15, GRAVITY = 16, FREEZE = 17;
const POWER_PIECES = [BOMB, LIGHTNING, TINT, GRAVITY, FREEZE];
const POWER_ICONS = { [BOMB]: 'B', [LIGHTNING]: 'R', [TINT]: 'T', [GRAVITY]: 'G', [FREEZE]: 'C' };
const POWER_EVERY = 5;
const FREEZE_MS = 5000;

const LINE_SCORES = [0, 100, 300, 500, 800];

const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const nextCanvas = document.getElementById('next-canvas');
const nextCtx = nextCanvas.getContext('2d');
const scoreEl = document.getElementById('score');
const linesEl = document.getElementById('lines');
const levelEl = document.getElementById('level');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayScore = document.getElementById('overlay-score');
const restartBtn = document.getElementById('restart-btn');
const themeBtn = document.getElementById('theme-btn');
const skinSelect = document.getElementById('skin-select');

const THEME_KEY = 'tetris-theme';
const SKIN_KEY = 'tetris-skin';
let gridColor, blockEdge;

let board, current, next, score, lines, level, paused, gameOver, lastTime, dropAccum, dropInterval, animId, freezeLeft, skin = SKINS.retro;

function createBoard() {
  return Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
}

function randomPiece() {
  if (Math.random() < SPECIAL_CHANCE) {
    return makePiece(SPECIAL_PIECES[Math.floor(Math.random() * SPECIAL_PIECES.length)]);
  }
  return makePiece(Math.floor(Math.random() * 7) + 1);
}

function makePiece(type) {
  const shape = PIECES[type].map(row => [...row]);
  return { type, shape, x: Math.floor(COLS / 2) - Math.floor(shape[0].length / 2), y: 0 };
}

function collide(shape, ox, oy) {
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = ox + c;
      const ny = oy + r;
      if (nx < 0 || nx >= COLS || ny >= ROWS) return true;
      if (ny >= 0 && board[ny][nx]) return true;
    }
  }
  return false;
}

function rotateCW(shape) {
  const rows = shape.length, cols = shape[0].length;
  const result = Array.from({ length: cols }, () => new Array(rows).fill(0));
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      result[c][rows - 1 - r] = shape[r][c];
  return result;
}

function tryRotate() {
  const rotated = rotateCW(current.shape);
  const kicks = [0, -1, 1, -2, 2];
  for (const kick of kicks) {
    if (!collide(rotated, current.x + kick, current.y)) {
      current.shape = rotated;
      current.x += kick;
      return;
    }
  }
}

function merge() {
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      if (current.shape[r][c])
        board[current.y + r][current.x + c] = current.shape[r][c];
}

function clearLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (board[r].every(v => v !== 0)) {
      board.splice(r, 1);
      board.unshift(new Array(COLS).fill(0));
      cleared++;
      r++;
    }
  }
  if (cleared) {
    lines += cleared;
    score += (LINE_SCORES[cleared] || 0) * level;
    level = Math.floor(lines / 10) + 1;
    dropInterval = Math.max(100, 1000 - (level - 1) * 90);
    updateHUD();
  }
  return cleared;
}

function ghostY() {
  let gy = current.y;
  while (!collide(current.shape, current.x, gy + 1)) gy++;
  return gy;
}

function hardDrop() {
  const gy = ghostY();
  score += (gy - current.y) * 2;
  current.y = gy;
  lockPiece();
}

function softDrop() {
  if (!collide(current.shape, current.x, current.y + 1)) {
    current.y++;
    score += 1;
    updateHUD();
  } else {
    lockPiece();
  }
}

function applyPower({ type, x, y }) {
  switch (type) {
    case BOMB:
      for (let r = Math.max(0, y - 1); r <= Math.min(ROWS - 1, y + 1); r++)
        for (let c = Math.max(0, x - 1); c <= Math.min(COLS - 1, x + 1); c++)
          board[r][c] = 0;
      break;
    case LIGHTNING:
      board[y].fill(0);
      for (let r = 0; r < ROWS; r++) board[r][x] = 0;
      break;
    case TINT: {
      // floor below means nothing to tint
      const color = y + 1 < ROWS ? board[y + 1][x] : 0;
      if (color)
        for (const row of board)
          for (let c = 0; c < COLS; c++) if (row[c] === color) row[c] = 0;
      break;
    }
    case GRAVITY:
      for (let c = 0; c < COLS; c++) {
        const col = board.map(row => row[c]).filter(v => v);
        for (let r = ROWS - 1; r >= 0; r--) board[r][c] = col.pop() || 0;
      }
      break;
    case FREEZE:
      freezeLeft = FREEZE_MS;
      break;
  }
}

function lockPiece() {
  const linesBefore = lines;
  if (POWER_PIECES.includes(current.type)) applyPower(current);
  else merge();
  const cleared = clearLines();
  const powerDue = Math.floor(lines / POWER_EVERY) > Math.floor(linesBefore / POWER_EVERY);
  // a Tetris reward wins over a power-up due on the same lock
  if (cleared === 4) spawn(SINGLE);
  else if (powerDue) spawn(POWER_PIECES[Math.floor(Math.random() * POWER_PIECES.length)]);
  else spawn();
}

function spawn(rewardType) {
  current = next;
  // rewards go in the next slot so the previewed piece stays honest
  next = rewardType ? makePiece(rewardType) : randomPiece();
  if (collide(current.shape, current.x, current.y)) {
    endGame();
  }
  drawNext();
}

function updateHUD() {
  scoreEl.textContent = score.toLocaleString();
  linesEl.textContent = lines;
  levelEl.textContent = level;
}

function drawBlock(context, x, y, colorIndex, size, alpha) {
  if (!colorIndex) return;
  context.globalAlpha = alpha ?? 1;
  skin.draw(context, x * size, y * size, size, skin.colors[colorIndex]);
  const icon = POWER_ICONS[colorIndex];
  if (icon) {
    context.fillStyle = '#000';
    context.font = `bold ${size * 0.6}px monospace`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(icon, x * size + size / 2, y * size + size / 2 + 1);
  }
  context.globalAlpha = 1;
}

function drawGrid() {
  ctx.strokeStyle = gridColor;
  ctx.lineWidth = 0.5;
  for (let c = 1; c < COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * BLOCK, 0);
    ctx.lineTo(c * BLOCK, ROWS * BLOCK);
    ctx.stroke();
  }
  for (let r = 1; r < ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * BLOCK);
    ctx.lineTo(COLS * BLOCK, r * BLOCK);
    ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  // board
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      drawBlock(ctx, c, r, board[r][c], BLOCK);

  // ghost
  const gy = ghostY();
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      if (current.shape[r][c])
        drawBlock(ctx, current.x + c, gy + r, current.shape[r][c], BLOCK, 0.2);

  // current piece
  for (let r = 0; r < current.shape.length; r++)
    for (let c = 0; c < current.shape[r].length; c++)
      drawBlock(ctx, current.x + c, current.y + r, current.shape[r][c], BLOCK);
}

function drawNext() {
  const NB = 30;
  nextCtx.clearRect(0, 0, nextCanvas.width, nextCanvas.height);
  const shape = next.shape;
  const offX = Math.floor((4 - shape[0].length) / 2);
  const offY = Math.floor((4 - shape.length) / 2);
  for (let r = 0; r < shape.length; r++)
    for (let c = 0; c < shape[r].length; c++)
      drawBlock(nextCtx, offX + c, offY + r, shape[r][c], NB);
}

function endGame() {
  gameOver = true;
  cancelAnimationFrame(animId);
  overlayTitle.textContent = 'GAME OVER';
  overlayScore.textContent = `Puntuación: ${score.toLocaleString()}`;
  overlay.classList.remove('hidden');
}

function togglePause() {
  if (gameOver) return;
  paused = !paused;
  if (!paused) {
    lastTime = performance.now();
    loop(lastTime);
  } else {
    cancelAnimationFrame(animId);
    overlayTitle.textContent = 'PAUSA';
    overlayScore.textContent = '';
    overlay.classList.remove('hidden');
  }
}

function loop(ts) {
  const dt = ts - lastTime;
  lastTime = ts;
  // counting down by dt (not wall clock) keeps the freeze honest across pauses
  if (freezeLeft > 0) freezeLeft -= dt;
  else dropAccum += dt;
  if (dropAccum >= dropInterval) {
    dropAccum = 0;
    if (!collide(current.shape, current.x, current.y + 1)) {
      current.y++;
    } else {
      lockPiece();
    }
  }
  draw();
  // endGame() can run inside this frame, where cancelAnimationFrame can't stop the next one
  if (!gameOver) animId = requestAnimationFrame(loop);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  themeBtn.textContent = theme === 'dark' ? '☀' : '☾';
  const styles = getComputedStyle(document.documentElement);
  gridColor = styles.getPropertyValue('--grid').trim();
  blockEdge = styles.getPropertyValue('--block-edge').trim();
  // redraw so paused / game-over frames pick up the new colors
  if (current) {
    draw();
    drawNext();
  }
}

function loadTheme() {
  let saved = null;
  try { saved = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }
  return saved === 'light' ? 'light' : 'dark';
}

function toggleTheme() {
  const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* storage unavailable */ }
  applyTheme(theme);
}

function applySkin(name) {
  skin = SKINS[name];
  document.documentElement.dataset.skin = name;
  skinSelect.value = name;
  if (current) {
    draw();
    drawNext();
  }
}

function loadSkin() {
  let saved = null;
  try { saved = localStorage.getItem(SKIN_KEY); } catch (e) { /* storage unavailable */ }
  return Object.hasOwn(SKINS, saved) ? saved : 'retro';
}

function init() {
  board = createBoard();
  score = 0;
  lines = 0;
  level = 1;
  paused = false;
  gameOver = false;
  dropInterval = 1000;
  dropAccum = 0;
  freezeLeft = 0;
  lastTime = performance.now();
  next = randomPiece();
  spawn();
  updateHUD();
  overlay.classList.add('hidden');
  cancelAnimationFrame(animId);
  animId = requestAnimationFrame(loop);
}

document.addEventListener('keydown', e => {
  if (e.target === skinSelect) return; // let the select own its keys while focused
  if (e.code === 'KeyP') { togglePause(); return; }
  if (paused || gameOver) return;
  switch (e.code) {
    case 'ArrowLeft':
      if (!collide(current.shape, current.x - 1, current.y)) current.x--;
      break;
    case 'ArrowRight':
      if (!collide(current.shape, current.x + 1, current.y)) current.x++;
      break;
    case 'ArrowDown':
      softDrop();
      break;
    case 'ArrowUp':
    case 'KeyX':
      tryRotate();
      break;
    case 'Space':
      e.preventDefault();
      hardDrop();
      break;
  }
  updateHUD();
});

restartBtn.addEventListener('click', init);
themeBtn.addEventListener('click', () => {
  toggleTheme();
  themeBtn.blur(); // keep Space/arrows from re-activating the button mid-game
});

skinSelect.addEventListener('change', () => {
  try { localStorage.setItem(SKIN_KEY, skinSelect.value); } catch (e) { /* storage unavailable */ }
  applySkin(skinSelect.value);
  skinSelect.blur(); // keep Space/arrows from changing the skin mid-game
});

applyTheme(loadTheme());
applySkin(loadSkin());

init();
