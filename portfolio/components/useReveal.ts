"use client";
import { useEffect, useRef, useState } from "react";

/**
 * PERMANENT HYDRATION FIX — v4
 *
 * Root cause of all hydration errors in this codebase:
 *
 * The previous `visible: state !== "hidden"` returned TRUE during SSR
 * (when state === "ssr"). This caused Framer Motion to render components
 * with animate={opacity:1, y:0} on the server, but on the first client
 * render after hydration the state flipped to "hidden" → visible=false,
 * so Framer rendered animate={opacity:0.25, y:5}. The inline style objects
 * produced by Framer differ → React hydration mismatch.
 *
 * THE PERMANENT FIX:
 * 1. `visible` is always false until the IntersectionObserver fires.
 *    On SSR it's false. On first client render it's false. No mismatch.
 * 2. All Framer Motion components driven by `visible` MUST use
 *    `initial={false}` so Framer doesn't inject its own initial inline
 *    styles during SSR (those would also differ from client styles).
 * 3. `revealClass` still uses the CSS-class approach (SSR → "", client → "reveal"
 *    or "reveal visible") because CSS classes are identical on SSR and client —
 *    React never serializes class names as inline style attributes.
 *
 * Usage pattern for Framer Motion children:
 *   <motion.div
 *     initial={false}                        ← REQUIRED
 *     animate={visible ? {opacity:1} : {opacity:0}}
 *   />
 *
 * Never use `initial={{ opacity:0 }}` together with `animate={visible ? ... : ...}`
 * because Framer will inject those initial inline styles during SSR,
 * which won't match after the first client render changes `visible`.
 */
export function useReveal(threshold = 0.08) {
  const ref = useRef<HTMLElement>(null);
  // Start as false on both SSR and client → no mismatch
  const [visible, setVisible] = useState(false);
  // Separate mounted flag so revealClass can distinguish SSR vs hidden
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
    // SSR  → ""              (no styles, matches client's first render exactly)
    // mounted, not visible → "reveal"        (hidden state via CSS)
    // mounted + visible    → "reveal visible" (animated in via CSS)
    revealClass: !mounted ? "" : visible ? "reveal visible" : "reveal",
    // false on SSR and first client render → true only after IntersectionObserver
    // All Framer Motion components using this MUST have initial={false}
    visible,
  };
}