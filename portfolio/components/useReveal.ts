"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Section entrance: replay the compositor-friendly CSS transition whenever
 * the section enters the viewport.
 *
 * The classes are toggled straight on the element, NOT through React state:
 * a section used to re-render its whole subtree (heatmaps, skill chips, …)
 * every time it revealed. Now nothing re-renders unless trackVisible is used.
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
    // Commit the hidden start state before observing; otherwise the first
    // observer callback can add .visible before the browser paints it.
    void getComputedStyle(el).opacity;
    let frame = 0;
    let finishTimer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(frame);
        if (finishTimer) clearTimeout(finishTimer);
        if (entry.isIntersecting) {
          frame = requestAnimationFrame(() => {
            el.classList.add("is-revealing", "visible");
            finishTimer = setTimeout(() => el.classList.remove("is-revealing"), 500);
          });
        } else {
          el.classList.add("is-revealing");
          el.classList.remove("visible");
          finishTimer = setTimeout(() => el.classList.remove("is-revealing"), 500);
        }
        if (trackVisible) setVisible(entry.isIntersecting);
      },
      { rootMargin: `0px 0px -${threshold * 100}% 0px` },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
      if (finishTimer) clearTimeout(finishTimer);
      el.classList.remove("reveal", "visible", "is-revealing");
    };
  }, [threshold, trackVisible]);

  // Kept for API compatibility — classes are applied imperatively above.
  return { ref, revealClass: "" as const, visible };
}