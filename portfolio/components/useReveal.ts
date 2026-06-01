"use client";
import { useEffect, useRef, useState } from "react";

/**
 * PERMANENT HYDRATION FIX — v3
 *
 * Previous approaches failed because inline style values (opacity:0 vs "1")
 * differ between SSR string serialization and React client rendering.
 *
 * THE ACTUAL FIX:
 * Return a CSS className string instead of inline styles.
 * CSS classes exist identically on SSR and client — no mismatch possible.
 *
 * SSR:    className=""           → element has no reveal class → browser applies nothing
 * Mount:  className="reveal"     → element animates in via CSS
 * Inview: className="reveal visible" → element is fully visible
 *
 * The element starts with no class on SSR, so React sees the same
 * empty string on first client render → ZERO MISMATCH.
 */
export function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<"ssr" | "hidden" | "visible">("ssr");

  useEffect(() => {
    // After hydration: start hidden, then observe
    setState("hidden");
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
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
    // "ssr"     → no class  → no styles → matches SSR HTML exactly
    // "hidden"  → "reveal"         → opacity:0, translateY
    // "visible" → "reveal visible" → opacity:1, translateY(0)
    revealClass: state === "ssr" ? "" : state === "visible" ? "reveal visible" : "reveal",
    // For components that still need a boolean (Framer Motion animate prop)
    // SSR returns true so framer doesn't inject hidden initial styles
    visible: state !== "hidden",
  };
}