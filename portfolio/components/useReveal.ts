"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Section entrance: fade in + rise 100px, 0.8s, ease-out-cubic — the exact
 * motion the old GSAP/ScrollTrigger version produced, but done with one
 * IntersectionObserver and CSS transitions (`.reveal` in globals.css), so it
 * costs no scroll listeners, no JS animation loop and no layout reads. Once it
 * has played, the class is dropped so the section keeps no transform / layer.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.08) {
  const ref = useRef<T>(null);
  const [phase, setPhase] = useState<"ssr" | "hidden" | "visible" | "done">("ssr");

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }

    setPhase("hidden");
    let timer: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setPhase("visible");
        timer = setTimeout(() => setPhase("done"), 900);
      },
      { rootMargin: `0px 0px -${threshold * 100}% 0px` },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearTimeout(timer);
    };
  }, [threshold]);

  return {
    ref,
    revealClass: phase === "hidden" ? "reveal" : phase === "visible" ? "reveal visible" : "",
    visible: phase === "visible" || phase === "done",
  };
}