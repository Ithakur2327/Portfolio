"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Section entrance: fade in + rise 100px, 0.8s, ease-out-cubic — the exact
 * motion the old GSAP/ScrollTrigger version produced, done with one
 * IntersectionObserver and CSS transitions (`.reveal` in globals.css).
 *
 * The classes are toggled straight on the element, NOT through React state:
 * a section used to re-render its whole subtree (heatmaps, skill chips, …)
 * every time it revealed. Now nothing re-renders. Once the entrance has played
 * the classes are removed, so the section keeps no transform / will-change.
 *
 * Only pass `trackVisible` if the component needs the boolean (it triggers one
 * re-render when the section becomes visible).
 */
export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.08, trackVisible = false) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (trackVisible) setVisible(true);
      return;
    }

    el.classList.add("reveal");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.classList.add("visible");
        if (trackVisible) setVisible(true);
        timer = setTimeout(() => el.classList.remove("reveal", "visible"), 900);
      },
      { rootMargin: `0px 0px -${threshold * 100}% 0px` },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
      el.classList.remove("reveal", "visible");
    };
  }, [threshold, trackVisible]);

  // Kept for API compatibility — classes are applied imperatively above.
  return { ref, revealClass: "" as const, visible };
}