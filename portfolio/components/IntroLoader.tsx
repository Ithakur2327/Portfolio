"use client";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

// useEffect fires *after* the browser has already painted, which left a
// window — small, but very real on a page this heavy (WebGL avatar canvas,
// hero layout, fonts) — between "#intro-shell gets removed" and "this
// component's own overlay actually commits to the DOM". The browser would
// paint whatever landed in that gap, which was the real hero flashing
// unblurred for a frame or few. That flash is what made the intro look like
// it played twice: the static pre-hydration shell, then a glimpse of the
// live page, then this component's animated hub starting fresh on top.
// useLayoutEffect runs synchronously before paint, so the shell's removal
// and this component's first real render land in the exact same frame —
// no gap for the browser to paint in between. (SSR has no DOM/paint to
// worry about, so it just falls back to the ordinary effect there.)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * IntroLoader — one-time landing sequence.
 *
 * Timeline (total = 2.8s):
 *   0ms      — centered squircle avatar + 3 loading dots fade/scale in,
 *              over a frosted glass-blur backdrop
 *   0-1500ms — "loading" hold (dots pulse, avatar breathes)
 *   1500ms   — dots + hub fade out, avatar detaches and FLIES from its
 *              centered spot to the exact rect of the real hero avatar
 *              (position/size/radius captured live via getBoundingClientRect,
 *              so it lands pixel-perfect regardless of viewport size). The
 *              flight itself is a 0.8s CSS transition (see .intro-flip-avatar
 *              below) — FLIGHT_MS below is kept just slightly ahead of that
 *              so the "landed" swap fires the instant it actually arrives,
 *              never after a dead, stuck-looking pause.
 *   2400ms   — avatar has landed: the flying clone snaps out and the real
 *              WebGL hero avatar (which was hidden under `html.intro-active`,
 *              see globals.css) snaps in at the exact same instant — an
 *              instant swap, not a crossfade, since by then they occupy the
 *              identical rect. The nav's corner avatar is revealed via the
 *              `intro:complete` event at the same moment.
 *   2800ms   — overlay fully unmounts
 *
 * A tiny inline script in layout.tsx paints a static placeholder version of
 * this same hub (behind id="intro-shell") the instant HTML parsing reaches
 * <body>, before React/JS has hydrated — that's what stops the real hero
 * section from ever flashing on screen first. This component hands off from
 * that placeholder to itself on mount (see the `intro-shell` removal below),
 * synchronously (useLayoutEffect, not useEffect) so the swap lands in the
 * same painted frame as the shell's removal — otherwise the hero peeks
 * through for a frame in between and the hand-off reads as two intros.
 *
 * Runs once per browser session (sessionStorage) and is skipped instantly
 * for prefers-reduced-motion. `introHasRunThisPageLoad` below is an extra,
 * in-memory guard on top of sessionStorage: it guarantees the animated
 * sequence can only ever execute once per page load no matter why this
 * effect happens to fire again (belt-and-suspenders against the "intro
 * plays a second time" glitch).
 */

const SESSION_KEY = "introPlayed:v1";
const LOADING_MS = 1500; // shortened per request (was 3300, itself up from an original 1300)
const FLIGHT_MS = 900; // must stay just ahead of the 0.8s CSS flight transition, not far past it
const SETTLE_MS = 400;

let introHasRunThisPageLoad = false;

declare global {
  interface Window {
    // Set by the inline shell script in app/layout.tsx the instant the
    // shell's animations start — read below to phase-sync this
    // component's own copies of those animations.
    __introAnimStart?: number;
  }
}

type Phase = "loading" | "opening" | "landed" | "done";

// Given how long (ms) it's been since the shell's animations started, and
// an animation's own cycle length (+ any stagger it starts with, e.g. the
// dots), returns a negative animation-delay string that resumes the new
// element's copy of that animation at the exact same point in its cycle —
// so swapping shell -> React element never restarts it from 0.
function syncDelay(offsetMs: number, cycleMs: number, staggerMs = 0): string {
  const elapsed = offsetMs - staggerMs;
  const mod = ((elapsed % cycleMs) + cycleMs) % cycleMs;
  return `-${mod}ms`;
}

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

// FLIP-style transform, computed once start+end are both known. The box
// itself is laid out ONCE at the END rect and never touched again — only
// `transform` (translate + scale) and `border-radius` change over the
// course of the flight. transform is compositor-only (no layout, no
// repaint of surrounding content), which is what actually buys the
// smooth/120fps feel; animating top/left/width/height directly (the old
// approach) forces a full layout recalculation on every single frame,
// which is what read as choppy — especially on a page this heavy.
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
  // How far (in ms) into the shell's animations we are at the moment this
  // component takes over — used to give this element's own ring/breathe/
  // dot animations a negative animation-delay so they continue in the
  // same phase the shell was in, instead of restarting from 0deg/1x/etc.
  const animOffsetRef = useRef(0);

  useIsomorphicLayoutEffect(() => {
    // Hand off from (and remove) the synchronous pre-hydration placeholder
    // painted by the inline script in layout.tsx — from this point on, this
    // component owns the overlay. Doing this in a layout effect means the
    // removal below and the setMounted(true) further down commit together,
    // before the browser paints either change.
    document.getElementById("intro-shell")?.remove();

    // Drops the scroll lock, tells the rest of the app the intro is over,
    // and — critically — forces phase to "done" so this component's own
    // render can never keep showing a stray overlay. Without that last
    // step, an instance whose earlier invocation had already set
    // mounted=true (e.g. Strict Mode's dev-only mount→cleanup→mount
    // replay, or a Fast Refresh remount while developing) would bail out
    // of *scheduling new timers* here but keep rendering its last-known
    // phase forever — the exact "intro flashes and then comes back/gets
    // stuck" glitch this guards against.
    const bail = () => {
      document.documentElement.classList.remove("intro-active");
      window.dispatchEvent(new Event("intro:complete"));
      setPhase("done");
    };

    if (introHasRunThisPageLoad) {
      // The full sequence already ran once during this page's lifetime —
      // never replay it, no matter why this effect fired again.
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
    const introStart = window.__introAnimStart;
    animOffsetRef.current =
      typeof introStart === "number" ? performance.now() - introStart : 0;
    setMounted(true);

    const t1 = setTimeout(() => {
      // Fired here rather than at landing — gives Avatar.tsx (see its own
      // introDone gate) a full FLIGHT_MS/SETTLE_MS head start to compile
      // its shader and load textures before it's actually revealed, while
      // still not running during the loading hold above, which is where
      // that work was contending with the ring's spin for main-thread
      // frames.
      window.dispatchEvent(new Event("intro:flightStart"));

      const target = document.getElementById("hero-avatar-anchor");
      const hubAvatar = hubAvatarRef.current;

      if (!target || !hubAvatar) {
        // No hero to fly to (e.g. deep-linked route) — just dissolve.
        setNoTarget(true);
        setPhase("opening");
        return;
      }

      // Read both ends of the flight up front — the box is laid out ONCE
      // at `end` and never re-laid-out again; everything in between is
      // just a transform, computed from these two fixed rects.
      const start = readRect(hubAvatar);
      const end = readRect(target);
      const scaleX = start.width / end.width;
      const scaleY = start.height / end.height;
      setEndRect(end);
      setTransform(flipTransform(start, end));
      setRadius(start.radius);
      setImgCounterScale(`scale(${1 / scaleX}, ${1 / scaleY})`);
      setPhase("opening");

      // Double rAF so the browser commits the "start" transform as a real
      // painted frame before we change it to identity — this is what makes
      // the transition actually animate instead of snapping straight there.
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
      // If this effect is torn down before the sequence actually reached
      // "landed" (a genuine unmount mid-flight, not just Strict Mode's
      // replay — that case already called bail() above), never leave the
      // page stuck with scroll locked and the hero avatar hidden
      // underneath a dead overlay.
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
             restarting. The breathing continues from wherever the shell's
             own breathing cycle was (negative delay applied inline, see
             render below) rather than restarting from 0 — restarting would
             have shown up as a visible jump in scale right at hand-off. */
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
          /* Negative delay (set via --ring-delay custom property, since a
             pseudo-element can't take an inline style directly) so this
             picks up mid-rotation exactly where the shell's own ring left
             off, instead of restarting from 0deg. Without this, the swap
             from shell -> here was a visible snap backward — it read as
             the ring "sticking" for a beat and then spinning a second
             time from scratch. */
          animation-delay: var(--ring-delay, 0s);
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
          <div
            className="intro-hub-avatar"
            ref={hubAvatarRef}
            style={{ animationDelay: syncDelay(animOffsetRef.current, 1800) }}
          >
            <div
              className="intro-hub-ring"
              style={
                {
                  "--ring-delay": syncDelay(animOffsetRef.current, 1100),
                } as CSSProperties
              }
            />
            <div className="intro-hub-imgwrap">
              {/* eslint-disable-next-line @next/next/no-img-element -- reuses the already-preloaded avatar URL from layout.tsx */}
              <img src={src} alt="" />
            </div>
          </div>
          <div className="intro-dots">
            <span style={{ animationDelay: syncDelay(animOffsetRef.current, 1000, 0) }} />
            <span style={{ animationDelay: syncDelay(animOffsetRef.current, 1000, 150) }} />
            <span style={{ animationDelay: syncDelay(animOffsetRef.current, 1000, 300) }} />
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