type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/** Runs `cb` when the browser is idle (falls back to a short timeout). Returns a cancel function. */
export function whenIdle(cb: () => void, timeout = 1000): () => void {
  const w = window as IdleWindow;
  if (typeof w.requestIdleCallback === "function") {
    const h = w.requestIdleCallback(cb, { timeout });
    return () => w.cancelIdleCallback?.(h);
  }
  const h = setTimeout(cb, 80);
  return () => clearTimeout(h);
}