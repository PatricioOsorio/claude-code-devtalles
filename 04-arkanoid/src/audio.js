import { SOUND } from './config.js';

const sounds = {};
for (const [name, path] of Object.entries(SOUND.files)) {
  sounds[name] = new Audio(path);
  sounds[name].preload = 'auto';
}

// Clone per play: a single node cannot overlap with itself during chain hits.
export function playSound(name) {
  const node = sounds[name].cloneNode();
  node.volume = SOUND.volume;
  node.play().catch(() => {});
}
