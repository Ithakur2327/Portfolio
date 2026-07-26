"use client";
import { useEffect, useRef, useState } from "react";

/**
 * IntroLoader — one-time landing sequence.
 *
 * Timeline (total ≈ 1.7s, always < 2s):
 *   0ms     — centered avatar + 3 loading dots fade/scale in
 *   0-700ms — "loading" hold (dots pulse, avatar breathes)
 *   700ms   — dots + hub fade out, avatar detaches and FLIES from its
 *             centered spot to the exact rect of the real hero avatar
 *             (position/size/radius captured live via getBoundingClientRect,
 *             so it lands pixel-perfect regardless of viewport size)
 *   1500ms  — avatar has landed: the real WebGL hero avatar (which was
 *             invisible under `html.intro-active`) crossfades in, and the
 *             nav's corner avatar is revealed via the `intro:complete` event
 *   1720ms  — overlay fully unmounts
 *
 * Runs once per browser session (sessionStorage) and is skipped instantly
 * for prefers-reduced-motion.
 */

const SESSION_KEY = "introPlayed:v1";
const LOADING_MS = 700;
const FLIGHT_MS = 800;
const SETTLE_MS = 220;

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

export function IntroLoader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [flightRect, setFlightRect] = useState<Rect | null>(null);
  const [noTarget, setNoTarget] = useState(false);
  const isDarkRef = useRef(true);
  const hubAvatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let already = false;
    try {
      already = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {}
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (already || reduced) {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {}
      window.dispatchEvent(new Event("intro:complete"));
      return;
    }

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

      const start = readRect(hubAvatar, "50%");
      setFlightRect(start);
      setPhase("opening");

      // Double rAF so the browser commits the "start" rect as a real frame
      // before we change the target values — this is what makes the
      // transition actually animate instead of snapping straight there.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const end = readRect(target);
          setFlightRect(end);
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
          background: var(--bg-base);
          display: flex; align-items: center; justify-content: center;
          transition: background-color 0.6s ease;
        }
        .intro-overlay--exit {
          background-color: transparent;
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
          width: 84px; height: 84px; border-radius: 50%;
          position: relative;
          animation: intro-avatar-in 0.4s cubic-bezier(0.16,1,0.3,1) both,
                     intro-breathe 1.8s ease-in-out 0.4s infinite;
        }
        @keyframes intro-avatar-in {
          from { opacity: 0; transform: scale(0.8) translateY(6px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes intro-breathe {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.035); }
        }

        .intro-hub-ring {
          position: absolute; inset: -4px; border-radius: 50%;
          overflow: hidden; z-index: 0; pointer-events: none;
        }
        .intro-hub-ring::before {
          content: ""; position: absolute; inset: -50%;
          background: conic-gradient(
            from 0deg,
            transparent 0deg, transparent 240deg,
            var(--text-primary) 300deg, transparent 360deg
          );
          animation: intro-ring-spin 1.1s linear infinite;
        }
        @keyframes intro-ring-spin { to { transform: rotate(360deg); } }

        .intro-hub-imgwrap {
          position: absolute; inset: 3px; border-radius: 50%;
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
          animation: intro-avatar-in 0.4s cubic-bezier(0.16,1,0.3,1) 0.08s both;
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
          will-change: top, left, width, height, border-radius;
          transition:
            top 0.8s cubic-bezier(0.16,1,0.3,1),
            left 0.8s cubic-bezier(0.16,1,0.3,1),
            width 0.8s cubic-bezier(0.16,1,0.3,1),
            height 0.8s cubic-bezier(0.16,1,0.3,1),
            border-radius 0.8s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.8s ease,
            opacity 0.22s ease;
        }
        .intro-flip-avatar--landed {
          box-shadow: none;
          opacity: 0;
        }
        .intro-flip-avatar img {
          width: 100%; height: 100%; object-fit: cover; display: block;
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

      {!noTarget && flightRect && (phase === "opening" || phase === "landed") && (
        <div
          className={`intro-flip-avatar${phase === "landed" ? " intro-flip-avatar--landed" : ""}`}
          style={{
            top: flightRect.top,
            left: flightRect.left,
            width: flightRect.width,
            height: flightRect.height,
            borderRadius: flightRect.radius,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- same reasoning as above */}
          <img src={src} alt="" />
        </div>
      )}
    </div>
  );
}