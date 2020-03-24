export function rAF(fn: FrameRequestCallback): number {
  if (typeof window !== 'undefined') {
    if (typeof window.requestAnimationFrame === 'function') {
      return window.requestAnimationFrame(fn);
    } else if (typeof window.webkitRequestAnimationFrame === 'function') {
      return window.webkitRequestAnimationFrame(fn);
    }
  }
  if (typeof fn === 'function') {
    fn(-1);
  }
  return -1;
}
