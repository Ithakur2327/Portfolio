"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
const useIsomorphicLayoutEffect =
typeof window !== "undefined" ? useLayoutEffect : useEffect;

const SESSION_KEY = "introPlayed:v1";
const LOADING_MS = 900;
const FLIGHT_MS = 550; 
const BACKDROP_FADE_MS = 480; 

let introHasRunThisPageLoad = false;

type Phase = "loading" | "flying" | "done";
type Rect = { top: number; left: number; width: number; height: number; radius: string };

function readRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return { top: r.top, left: r.left, width: r.width, height: r.height, radius: cs.borderRadius };
}

export function IntroLoader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [rects, setRects] = useState<{ start: Rect; target: Rect } | null>(null);
  const [exiting, setExiting] = useState(false);
  const [noTarget, setNoTarget] = useState(false);
  const isDarkRef = useRef(true);
  const animatedRef = useRef(false); 

  useIsomorphicLayoutEffect(() => {
    const bail = () => {
      document.getElementById("intro-shell")?.remove();
      document.documentElement.classList.remove("intro-active");
      window.dispatchEvent(new Event("intro:complete"));
      setPhase("done");
    };

    if (introHasRunThisPageLoad) {
      bail();
      return;
    }

    let already = false;
    try {
      already = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (already || reduced) {
      introHasRunThisPageLoad = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      bail();
      return;
    }

    introHasRunThisPageLoad = true;
    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {}

    isDarkRef.current = document.documentElement.classList.contains("dark");
    document.documentElement.classList.add("intro-active");
    setMounted(true);

    const t1 = setTimeout(() => {
      window.dispatchEvent(new Event("intro:flightStart"));

      const shellAvatar = document.querySelector(".intro-shell-avatar");
      const target = document.getElementById("hero-avatar-anchor");

      if (!shellAvatar || !target) {
        document.getElementById("intro-shell")?.remove();
        setNoTarget(true);
        setPhase("flying");
        setExiting(true);
        setTimeout(() => {
          document.documentElement.classList.remove("intro-active");
          window.dispatchEvent(new Event("intro:complete"));
          setPhase("done");
        }, BACKDROP_FADE_MS);
        return;
      }
      const start = readRect(shellAvatar);
      const targetRect = readRect(target);
      document.getElementById("intro-shell")?.remove();
      setRects({ start, target: targetRect });
      setPhase("flying");
      setExiting(true);
    }, LOADING_MS);

    return () => {
      clearTimeout(t1);
      document.documentElement.classList.remove("intro-active");
    };
  }, []);

  const flightRef = (el: HTMLDivElement | null) => {
    if (!el || !rects || animatedRef.current) return;
    animatedRef.current = true;

    const { start, target } = rects;
    const dx = start.left - target.left;
    const dy = start.top - target.top;
    const sx = start.width / target.width;
    const sy = start.height / target.height;

    const fromTransform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
    const toTransform = "translate(0px, 0px) scale(1, 1)";

    const land = () => {
      document.documentElement.classList.remove("intro-active");
      window.dispatchEvent(new Event("intro:complete"));
      setPhase("done");
    };

    if (typeof el.animate !== "function") {
      land();
      return;
    }
    el.style.transform = fromTransform;

    const anim = el.animate(
      [{ transform: fromTransform }, { transform: toTransform }],
      { duration: FLIGHT_MS, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "forwards" },
    );
    anim.addEventListener("finish", land);
    anim.addEventListener("cancel", land);
  };

  if (!mounted || phase === "done" || phase === "loading") return null;

  const isDark = isDarkRef.current;
  const src = isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg";

  return (
    <div className={`intro-overlay${exiting ? " intro-overlay--exit" : ""}`} aria-hidden>
      <style suppressHydrationWarning>{`
        .intro-overlay {
          position: fixed; inset: 0; z-index: 100000;
          /* Matches #intro-shell's own backdrop exactly (see globals.css)
             so the very first frame this renders is visually identical to
             what the shell was already showing — the fade to transparent
             only starts once "exiting" flips true a frame later. */
          background: color-mix(in srgb, var(--bg-base) 45%, transparent);
          backdrop-filter: blur(14px) saturate(130%);
          -webkit-backdrop-filter: blur(14px) saturate(130%);
          pointer-events: none;
          transition: background-color ${BACKDROP_FADE_MS}ms ease, backdrop-filter ${BACKDROP_FADE_MS}ms ease,
                      -webkit-backdrop-filter ${BACKDROP_FADE_MS}ms ease;
        }
        .intro-overlay--exit {
          background: transparent;
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
        }

        .intro-flip-avatar {
          position: fixed;
          overflow: hidden;
          border: 1.5px solid var(--border);
          background: var(--bg-base);
          box-shadow: 0 12px 40px -8px rgba(0,0,0,0.35);
          /* Only transform ever animates (see the file-level comment for
             why) — top/left/width/height/border-radius are all set once,
             statically, to the hero avatar's own final rect and never
             touched again. transform-origin 0 0 matches how the
             translate/scale values below are computed. will-change primes
             the compositor layer ahead of time so the very first frame
             doesn't pay a mid-animation layer-creation cost. */
          transform-origin: 0 0;
          will-change: transform;
        }
        .intro-flip-avatar img {
          width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block;
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-overlay { transition: none !important; }
        }
      `}</style>

      {!noTarget && rects && phase === "flying" && (
        <div
          ref={flightRef}
          className="intro-flip-avatar"
          style={{
            top: rects.target.top,
            left: rects.target.left,
            width: rects.target.width,
            height: rects.target.height,
            borderRadius: rects.target.radius,
          }}
        >
          
          <img src={src} alt="" />
        </div>
      )}
    </div>
  );
}