export function throttle(fn: any, delay: number) {
  let lastTime = 0;

  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastTime >= delay) {
      lastTime = now;
      fn(...args);
    }
  };
}
