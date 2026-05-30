"use client";
import { useEffect, useRef, useState } from "react";

export function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // rootMargin: trigger 80px BEFORE element enters viewport
    // This gives the animation time to begin before user sees the element
    // Result: content feels instantly visible, never "pops in"
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          // Disconnect immediately — one-shot, no wasted observers
          obs.disconnect();
        }
      },
      {
        threshold,
        // Pre-trigger: start animation before element is fully in view
        rootMargin: "0px 0px -60px 0px",
      }
    );

    // Use requestIdleCallback to schedule observer setup off critical path
    // Falls back to setTimeout for Safari compatibility
    if ("requestIdleCallback" in window) {
      const id = (window as Window & { requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number })
        .requestIdleCallback(() => obs.observe(el), { timeout: 200 });
      return () => {
        (window as Window & { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(id);
        obs.disconnect();
      };
    } else {
      const id = setTimeout(() => obs.observe(el), 0);
      return () => {
        clearTimeout(id);
        obs.disconnect();
      };
    }
  }, [threshold]);

  return { ref, visible };
}
