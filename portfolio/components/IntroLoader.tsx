"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// useEffect fires *after* the browser has already painted, which left a
// window — small, but very real on a page this heavy (WebGL avatar canvas,
// hero layout, fonts) — between "#intro-shell gets removed" and "this
// component's own overlay actually commits to the DOM". The browser would
// paint whatever landed in that gap, which was the real hero flashing
// unblurred for a frame or few. useLayoutEffect runs synchronously before
// paint, so the shell's removal and this component's first real render
// land in the exact same frame — no gap for the browser to paint in
// between. (SSR has no DOM/paint to worry about, so it just falls back to
// the ordinary effect there.)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * IntroLoader — one-time landing sequence.
 *
 * Architecture: the pre-hydration shell (a tiny inline script in
 * layout.tsx, id="intro-shell") owns the ENTIRE "loading" visual — the
 * breathing squircle avatar, its spinning gold/tiffany ring, and the
 * pulsing dots — for the full length of the loading hold. It's plain DOM
 * with plain CSS animations; this component doesn't render any copy of it
 * and never touches it until the very moment flight begins.
 *
 * Timeline:
 *   0ms        — shell's breathing avatar + spinning ring + pulsing dots
 *                are already on screen (painted before React hydrates)
 *   0-900ms    — loading hold; untouched shell animations only
 *   900ms      — this component reads the shell avatar's live rect, removes
 *                the shell, and mounts a flying clone at that exact rect —
 *                synchronously, same frame, so there's no gap where the
 *                shell is gone but nothing has replaced it. The clone then
 *                flies to the real hero avatar's rect.
 *   900+~550ms — landed: the instant the flight animation reports
 *                "finished", the clone is torn down and the real hero
 *                avatar is revealed in the SAME synchronous block — a hard
 *                cut, not a fade. `intro:complete` fires here too.
 *
 * ── Why the flight is animated the way it is (read this before touching it) ──
 * The flying clone's box is sized/positioned at its FINAL (hero) rect from
 * the moment it mounts, and NEVER changes size or position after that. All
 * the "movement" is a single CSS `transform: translate() scale()` that
 * starts at a value which makes the box *look* like it's still at the
 * shell's rect, then animates to `translate(0,0) scale(1,1)` — i.e. a
 * classic FLIP (First-Last-Invert-Play), driven by the Web Animations API
 * (`element.animate()`), not a CSS transition.
 *
 * Two very deliberate choices here, both fixing real production bugs:
 *
 * 1. ONLY `transform` is ever animated — never top/left/width/height/
 *    border-radius. Those are layout properties: animating them forces the
 *    browser to recompute layout and repaint on every single frame, which
 *    is what made the old version feel heavy, especially on mid/low-end
 *    phones. `transform` runs entirely on the compositor thread, so this
 *    is a genuinely free 60fps animation on any device. Border-radius is
 *    set once, statically, to the hero avatar's own radius — since the box
 *    is always hero-sized pre-transform, the corner rounding scales
 *    naturally as a side effect of the transform, with zero extra
 *    animation cost.
 *
 * 2. The animation is driven by `element.animate()`, not a CSS transition
 *    triggered by the old "set start state → double requestAnimationFrame
 *    → set end state" trick. That trick only works if the browser actually
 *    *paints* the start-state frame before the second rAF fires — under
 *    real conditions (low-end phones, backgrounded/throttled tabs, Android
 *    WebViews, Safari under load) that isn't reliable. When it silently
 *    failed, the element would just jump straight to its end state with no
 *    visible animation at all — which is exactly the "works on some
 *    devices, glitches/breaks on others" symptom. `element.animate()` is
 *    handed both keyframes up front; the browser guarantees it
 *    interpolates between them regardless of paint timing, so this now
 *    behaves identically everywhere.
 *
 * Landing is an intentional hard cut, not a crossfade: the flying clone
 * (a flat photo) is torn down and `intro-active` is removed (revealing the
 * real, un-transitioned `#hero-avatar-anchor` — see globals.css) inside the
 * exact same synchronous callback, so nothing fades in or out.
 *
 * Runs once per browser session (sessionStorage) and is skipped instantly
 * for prefers-reduced-motion. `introHasRunThisPageLoad` below is an extra,
 * in-memory guard on top of sessionStorage: it guarantees the animated
 * sequence can only ever execute once per page load no matter why this
 * effect happens to fire again (belt-and-suspenders against the "intro
 * plays a second time" glitch).
 */

const SESSION_KEY = "introPlayed:v1";
const LOADING_MS = 900; // loading hold before flight begins
const FLIGHT_MS = 550; // duration of the transform-only WAAPI flight
const BACKDROP_FADE_MS = 480; // overlay blur fade-out; finishes just before FLIGHT_MS so there's nothing left to abruptly cut when we unmount

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
  const animatedRef = useRef(false); // guards against re-triggering the flight (Strict Mode double-invoke, Fast Refresh, ref re-attach)

  useIsomorphicLayoutEffect(() => {
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
      // Safe even when no shell exists (e.g. it never got created because
      // the inline script itself already decided to skip) — removing a
      // missing element is a no-op.
      document.getElementById("intro-shell")?.remove();
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
    // intro-active is already applied by the inline shell script itself
    // (see layout.tsx) — re-adding it here is harmless/idempotent, kept
    // only as a safety net in case this effect ever runs without that
    // script having run first.
    document.documentElement.classList.add("intro-active");
    setMounted(true);

    const t1 = setTimeout(() => {
      // Fired here rather than at landing — gives Avatar.tsx (see its own
      // introDone gate) a head start to compile its shader and load
      // textures before it's actually revealed, while never running
      // during the loading hold above, which is where that work was
      // contending with the shell's ring for main-thread frames.
      window.dispatchEvent(new Event("intro:flightStart"));

      const shellAvatar = document.querySelector(".intro-shell-avatar");
      const target = document.getElementById("hero-avatar-anchor");

      if (!shellAvatar || !target) {
        // No hero to fly to (e.g. deep-linked route), or the shell was
        // somehow already gone — just dissolve the overlay.
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

      // Read both rects, THEN remove the shell — all in this same
      // synchronous tick, so there's no frame where neither the shell nor
      // its replacement is on screen. The target rect is captured now too
      // (not re-measured later) since nothing about the hero's layout
      // changes during the flight.
      const start = readRect(shellAvatar);
      const targetRect = readRect(target);
      document.getElementById("intro-shell")?.remove();
      setRects({ start, target: targetRect });
      setPhase("flying");
      // Backdrop fade-out rides the same tick the flight starts on, so the
      // glass blur is gone well before the avatar lands instead of being
      // abruptly cut when the overlay unmounts.
      setExiting(true);
    }, LOADING_MS);

    return () => {
      clearTimeout(t1);
      // If this effect is torn down before the sequence actually landed (a
      // genuine unmount mid-flight, not just Strict Mode's replay — that
      // case already called bail() above), never leave the page stuck
      // with scroll locked and the hero avatar hidden underneath a dead
      // overlay.
      document.documentElement.classList.remove("intro-active");
    };
  }, []);

  // Imperative flight — see the big comment block at the top of this file
  // for why this is transform-only and WAAPI-driven rather than a CSS
  // transition on layout properties.
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
      // Hard cut, deliberately: the flying clone (a flat photo) is removed
      // and the real hero avatar is revealed by dropping `intro-active`
      // (see globals.css — that rule has no transition) inside this one
      // synchronous callback, so the two happen on the exact same frame.
      // No opacity fade, no crossfade.
      document.documentElement.classList.remove("intro-active");
      window.dispatchEvent(new Event("intro:complete"));
      setPhase("done");
    };

    if (typeof el.animate !== "function") {
      // No Web Animations API support (only extremely old browsers) — skip
      // straight to landed rather than risk a broken/unsupported animation.
      land();
      return;
    }

    // Set the starting transform synchronously, in the same commit as the
    // element being inserted into the DOM (React ref callbacks fire before
    // the browser's next paint) — so the very first painted frame already
    // shows the clone at the shell's rect, never at its full hero size.
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
          {/* eslint-disable-next-line @next/next/no-img-element -- reuses the already-preloaded avatar URL from layout.tsx */}
          <img src={src} alt="" />
        </div>
      )}
    </div>
  );
}