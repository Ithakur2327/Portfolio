"use client";
import { useEffect, useRef, useState } from "react";

export function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    if ("requestIdleCallback" in window) {
      const handle = (window as unknown as {
        requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
      }).requestIdleCallback(() => obs.observe(el), { timeout: 200 });
      return () => {
        (window as unknown as { cancelIdleCallback: (id: number) => void })
          .cancelIdleCallback(handle);
        obs.disconnect();
      };
    } else {
      const raf = requestAnimationFrame(() => obs.observe(el));
      return () => { cancelAnimationFrame(raf); obs.disconnect(); };
    }
  }, [threshold]);

  return {
    ref,
    revealClass: !mounted ? "" : visible ? "reveal visible" : "reveal",
    visible,
  };
}