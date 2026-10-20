"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export function useReveal<T extends HTMLElement = HTMLElement>(threshold = 0.08) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setMounted(true);
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(true);
      return;
    }

    const context = gsap.context(() => {
      gsap.set(el, { autoAlpha: 0, y: 100 });
      const tween = gsap.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        paused: true,
        clearProps: "opacity,transform,visibility",
      });

      ScrollTrigger.create({
        trigger: el,
        start: `top ${(1 - threshold) * 100}%`,
        once: true,
        onEnter: () => {
          setVisible(true);
          tween.play();
        },
      });
    }, el);

    return () => context.revert();
  }, [threshold]);

  return {
    ref,
    revealClass: !mounted ? "" : visible ? "reveal visible" : "reveal",
    visible,
  };
}