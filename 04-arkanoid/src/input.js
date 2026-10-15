export function createInput(canvas) {
  const held = new Set();
  let mouseX = null;
  let launchRequested = false;

  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) launchRequested = true;
    }
    held.add(e.code);
  });
  window.addEventListener('keyup', (e) => held.delete(e.code));
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
  });

  canvas.addEventListener('click', () => {
    launchRequested = true;
  });

  return {
    // -1, 0 or 1; both keys held cancel out
    axis() {
      const left = held.has('ArrowLeft') || held.has('KeyA');
      const right = held.has('ArrowRight') || held.has('KeyD');
      return Number(right) - Number(left);
    },
    // Returns the last mouse x once, so keyboard can take over afterwards
    takeMouseX() {
      const x = mouseX;
      mouseX = null;
      return x;
    },
    // True once per Space press or click
    takeLaunch() {
      const requested = launchRequested;
      launchRequested = false;
      return requested;
    },
  };
}
