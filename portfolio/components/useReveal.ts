"use client";
import { useEffect, useRef, useState } from "react";

/**
 * PERMANENT HYDRATION FIX
 *
 * Root cause: SSR renders `visible=true` (opacity:1, transform:none).
 * But on client, initial state was `false` (opacity:0, translateY) → MISMATCH.
 *
 * Fix: SSR always sees `undefined` → returns visible=true → no style diffs.
 * After hydration, sets to `false` → observer takes over. Zero mismatch.
 *
 * The key insight: `useState(undefined)` means server + first client render
 * both see `isVisible = true`. After mount, `setVisible(false)` runs in
 * useEffect (client only, never on server). This eliminates the mismatch.
 */
export function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    setVisible(false);
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );

    let rafId: number;
    if ("requestIdleCallback" in window) {
      const id = (window as unknown as { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback(() => obs.observe(el), { timeout: 200 });
      return () => {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        obs.disconnect();
      };
    } else {
      rafId = requestAnimationFrame(() => obs.observe(el));
      return () => {
        cancelAnimationFrame(rafId);
        obs.disconnect();
      };
    }
  }, [threshold]);

  // undefined = SSR / not yet mounted  → treat as visible (no transform applied)
  // false     = mounted, not in view   → hidden, ready to animate in
  // true      = in view                → fully visible
  const isVisible = visible === undefined ? true : visible;

  return { ref, visible: isVisible };
}
