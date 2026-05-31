"use client";
import { useEffect, useRef, useState } from "react";

export function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  // FIX: Start as `undefined` (not false) so server and client first render match.
  // Only after mount do we set actual visibility state.
  const [visible, setVisible] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // After mount: default to false, then observe
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
      {
        threshold,
        rootMargin: "0px 0px -60px 0px",
      }
    );

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

  // undefined = not yet mounted (SSR) → treat as visible=true so server HTML has no opacity/transform
  // false = mounted, not yet in view → animate from hidden
  // true = in view → animate to visible
  const isVisible = visible === undefined ? true : visible;

  return { ref, visible: isVisible };
}
