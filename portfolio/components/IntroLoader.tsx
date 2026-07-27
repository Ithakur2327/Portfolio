"use client";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;


const SESSION_KEY = "introPlayed:v1";
const LOADING_MS = 1300; // was 1300 — held 2s longer per request
const FLIGHT_MS = 900; // must stay just ahead of the 0.8s CSS flight transition, not far past it
const SETTLE_MS = 400;

let introHasRunThisPageLoad = false;

type Phase = "loading" | "opening" | "landed" | "done";

type Rect = { top: number; left: number; width: number; height: number; radius: string };

function readRect(el: Element, radius?: string): Rect {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return {
    top: r.top,
    left: r.left,
    width: r.width,
    height: r.height,
    radius: radius ?? cs.borderRadius,
  };
}

function flipTransform(from: Rect, to: Rect): string {
  const scaleX = from.width / to.width;
  const scaleY = from.height / to.height;
  const dx = from.left - to.left;
  const dy = from.top - to.top;
  return `translate3d(${dx}px, ${dy}px, 0) scale(${scaleX}, ${scaleY})`;
}

export function IntroLoader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [endRect, setEndRect] = useState<Rect | null>(null);
  const [transform, setTransform] = useState<string | null>(null);
  const [radius, setRadius] = useState<string | null>(null);
  const [imgCounterScale, setImgCounterScale] = useState<string | null>(null);
  const [noTarget, setNoTarget] = useState(false);
  const isDarkRef = useRef(true);
  const hubAvatarRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    document.getElementById("intro-shell")?.remove();

    const bail = () => {
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
      const target = document.getElementById("hero-avatar-anchor");
      const hubAvatar = hubAvatarRef.current;

      if (!target || !hubAvatar) {
        // No hero to fly to (e.g. deep-linked route) — just dissolve.
        setNoTarget(true);
        setPhase("opening");
        return;
      }

      const start = readRect(hubAvatar);
      const end = readRect(target);
      const scaleX = start.width / end.width;
      const scaleY = start.height / end.height;
      setEndRect(end);
      setTransform(flipTransform(start, end));
      setRadius(start.radius);
      setImgCounterScale(`scale(${1 / scaleX}, ${1 / scaleY})`);
      setPhase("opening");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransform("translate3d(0, 0, 0) scale(1, 1)");
          setRadius(end.radius);
          setImgCounterScale("scale(1, 1)");
        });
      });
    }, LOADING_MS);

    const t2 = setTimeout(() => {
      document.documentElement.classList.remove("intro-active");
      window.dispatchEvent(new Event("intro:complete"));
      setPhase("landed");
    }, LOADING_MS + FLIGHT_MS);

    const t3 = setTimeout(() => {
      setPhase("done");
    }, LOADING_MS + FLIGHT_MS + SETTLE_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.documentElement.classList.remove("intro-active");
    };
  }, []);

  if (!mounted || phase === "done") return null;

  const isDark = isDarkRef.current;
  const src = isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg";
  const opening = phase === "opening" || phase === "landed";

  return (
    <div
      className={`intro-overlay${opening ? " intro-overlay--exit" : ""}`}
      aria-hidden
    >
      <style suppressHydrationWarning>{`
        .intro-overlay {
          position: fixed; inset: 0; z-index: 100000;
          background: color-mix(in srgb, var(--bg-base) 55%, transparent);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          display: flex; align-items: center; justify-content: center;
          transition: background-color 0.6s ease, backdrop-filter 0.6s ease,
                      -webkit-backdrop-filter 0.6s ease;
        }
        .intro-overlay--exit {
          background: transparent;
          backdrop-filter: blur(0px);
          -webkit-backdrop-filter: blur(0px);
          pointer-events: none;
        }

        .intro-hub {
          display: flex; align-items: center; justify-content: center;
          gap: 16px;
          opacity: 1; transform: scale(1);
          transition: opacity 0.25s ease, transform 0.3s ease;
        }
        .intro-overlay--exit .intro-hub {
          opacity: 0; transform: scale(0.96);
        }

        .intro-hub-avatar {
          width: 84px; height: 84px; border-radius: 22px;
          position: relative;
          /* No entrance pop here on purpose — by the time this mounts, the
             avatar was already sitting on screen via #intro-shell (see
             globals.css), so popping it in again would look like the intro
             restarting. Only the continuous breathing carries over — no
             delay, so it doesn't visibly freeze for a beat right after the
             hand-off (the shell's own breathing has no delay either). */
          animation: intro-breathe 1.8s ease-in-out infinite;
        }
        @keyframes intro-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.035); }
        }

        .intro-hub-ring {
          position: absolute; inset: -4px; border-radius: 26px;
          overflow: hidden; z-index: 0; pointer-events: none;
        }
        .intro-hub-ring::before {
          content: ""; position: absolute; inset: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg, transparent 200deg,
            #0abab5 240deg, #d4af37 320deg, transparent 360deg
          );
          animation: intro-ring-spin 1.1s linear infinite;
          /* Promotes this to its own compositor layer ahead of time so the
             very first frame of the spin doesn't have to wait on the
             browser creating that layer mid-animation — that wait is what
             read as the ring "sticking" right at the start. */
          will-change: transform;
        }
        @keyframes intro-ring-spin { to { transform: rotate(360deg); } }

        .intro-hub-imgwrap {
          position: absolute; inset: 3px; border-radius: 19px;
          overflow: hidden; z-index: 1;
          border: 1.5px solid var(--border);
          background: var(--bg-base);
        }
        .intro-hub-imgwrap img {
          width: 100%; height: 100%; object-fit: cover; display: block;
        }

        .intro-dots {
          display: flex; align-items: center; gap: 6px;
          opacity: 1; transition: opacity 0.2s ease, transform 0.25s ease;
          /* Same reasoning as .intro-hub-avatar above — no entrance pop,
             the dots were already visible and pulsing in #intro-shell. */
        }
        .intro-overlay--exit .intro-dots {
          opacity: 0; transform: translateX(4px);
        }
        .intro-dots span {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--text-primary);
          animation: intro-dot-pulse 1s ease-in-out infinite;
        }
        .intro-dots span:nth-child(2) { animation-delay: 0.15s; }
        .intro-dots span:nth-child(3) { animation-delay: 0.3s; }
        @keyframes intro-dot-pulse {
          0%, 80%, 100% { opacity: 0.25; transform: scale(0.8); }
          40%           { opacity: 1;    transform: scale(1); }
        }

        .intro-flip-avatar {
          position: fixed;
          overflow: hidden;
          border: 1.5px solid var(--border);
          background: var(--bg-base);
          box-shadow: 0 12px 40px -8px rgba(0,0,0,0.35);
          transform-origin: top left;
          /* Only transform + border-radius animate during the flight —
             both are compositor/paint-only, never layout — so the browser
             never has to re-run layout on this heavy a page mid-flight.
             That's what buys the smooth/120fps feel; the box's actual
             top/left/width/height are set once (to the END rect) and
             never change again. */
          will-change: transform, border-radius;
          transition:
            transform 0.8s cubic-bezier(0.16,1,0.3,1),
            border-radius 0.8s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.8s ease,
            opacity 0.16s linear;
        }
        .intro-flip-avatar--landed {
          box-shadow: none;
          /* A very short (160ms) crossfade rather than an instant cut.
             Rects match exactly, so there's no travel/mismatch to hide —
             this purely smooths over the fact that the flying clone is a
             flat photo and the real hero avatar underneath is a live
             WebGL render, which can differ enough in shading/highlights
             that an instant swap reads as a visible "pop". The real hero
             avatar fades in over the same 0.16s (see #hero-avatar-anchor
             in globals.css) so the two cross rather than one cutting to
             the other. */
          opacity: 0;
        }
        .intro-flip-avatar img {
          width: 100%; height: 100%; object-fit: cover; object-position: center top; display: block;
          /* The box itself scales anisotropically (start/end aspect
             ratios can differ), so the image gets an inverse scale to
             counter that — otherwise the photo would visibly stretch/
             squash mid-flight instead of just resizing cleanly. */
          transform: var(--img-counter-scale, none);
          transform-origin: top left;
          will-change: transform;
          transition: transform 0.8s cubic-bezier(0.16,1,0.3,1);
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-overlay, .intro-hub, .intro-dots, .intro-flip-avatar {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>

      {(phase === "loading" || phase === "opening") && (
        <div className="intro-hub">
          <div className="intro-hub-avatar" ref={hubAvatarRef}>
            <div className="intro-hub-ring" />
            <div className="intro-hub-imgwrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- reuses the already-preloaded avatar URL from layout.tsx */}
              <img src={src} alt="" />
            </div>
          </div>
          <div className="intro-dots">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      {!noTarget && endRect && (phase === "opening" || phase === "landed") && (
        <div
          className={`intro-flip-avatar${phase === "landed" ? " intro-flip-avatar--landed" : ""}`}
          style={{
            top: endRect.top,
            left: endRect.left,
            width: endRect.width,
            height: endRect.height,
            borderRadius: radius ?? undefined,
            transform: transform ?? undefined,
            "--img-counter-scale": imgCounterScale ?? undefined,
          } as CSSProperties}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- same reasoning as above */}
          <img src={src} alt="" />
        </div>
      )}
    </div>
  );
}