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
 * and never touches it until the very moment flight begins. That's a
 * deliberate change from an earlier version, which had React re-create an
 * identical-looking hub on mount and hand off from the shell to that copy
 * immediately — meaning the ring/avatar/dots got recreated (and their CSS
 * animations restarted, phase-synced or not) right as this heavy page was
 * doing the bulk of its hydration work, which is what was actually causing
 * the ring to visibly stutter. Now that hand-off happens exactly once, at
 * flight time, by which point hydration has had the whole loading hold to
 * finish — much less main-thread contention at the one moment it matters.
 *
 * Timeline (total ≈ 1.85s):
 *   0ms     — shell's breathing avatar + spinning ring + pulsing dots are
 *             already on screen (painted before React even hydrates)
 *   0-900ms — loading hold; untouched shell animations only
 *   900ms   — this component reads the shell avatar's live rect, removes
 *             the shell, and mounts a flying clone at that exact rect —
 *             synchronously, same frame, so there's no gap where the shell
 *             is gone but nothing has replaced it. The clone then
 *             transitions (top/left/width/height/border-radius, a plain
 *             0.6s CSS transition) to the real hero avatar's rect.
 *   1600ms  — landed: the flying clone fades out (~160ms) as the real
 *             WebGL hero avatar fades in at the exact same rect — a very
 *             short crossfade, not an instant cut, since a flat photo and
 *             a live WebGL render can differ enough in shading to "pop"
 *             on a hard swap. `intro:complete` fires here too.
 *   1850ms  — overlay fully unmounts
 *
 * Runs once per browser session (sessionStorage) and is skipped instantly
 * for prefers-reduced-motion. `introHasRunThisPageLoad` below is an extra,
 * in-memory guard on top of sessionStorage: it guarantees the animated
 * sequence can only ever execute once per page load no matter why this
 * effect happens to fire again (belt-and-suspenders against the "intro
 * plays a second time" glitch).
 */

const SESSION_KEY = "introPlayed:v1";
const LOADING_MS = 900; // shortened per request, across all devices — was 1500/3300/1300 over earlier iterations
const FLIGHT_MS = 700; // must stay just ahead of the 0.6s CSS flight transition, not far past it
const SETTLE_MS = 250;

let introHasRunThisPageLoad = false;

type Phase = "loading" | "opening" | "landed" | "done";
type Rect = { top: number; left: number; width: number; height: number; radius: string };

function readRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  return { top: r.top, left: r.left, width: r.width, height: r.height, radius: cs.borderRadius };
}

export function IntroLoader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("loading");
  const [flightRect, setFlightRect] = useState<Rect | null>(null);
  const [exiting, setExiting] = useState(false);
  const [noTarget, setNoTarget] = useState(false);
  const isDarkRef = useRef(true);

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
        // somehow already gone — just dissolve.
        document.getElementById("intro-shell")?.remove();
        setNoTarget(true);
        setPhase("opening");
        requestAnimationFrame(() => requestAnimationFrame(() => setExiting(true)));
        return;
      }

      // Read the shell avatar's live rect, THEN remove the shell — both
      // in this same synchronous tick, so there's no frame where neither
      // the shell nor its replacement is on screen.
      const start = readRect(shellAvatar);
      document.getElementById("intro-shell")?.remove();
      setFlightRect(start);
      setPhase("opening");

      // Double rAF so the browser commits the "start" rect as a real
      // painted frame before we change it to the target values — this is
      // what makes the transition actually animate instead of snapping
      // straight there. The overlay's backdrop-fade (`exiting`) rides the
      // same two frames so it starts fading exactly as the flight starts,
      // not before — the first frame needs to still look identical to the
      // shell's own opaque blur, or the hand-off itself would flash.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setFlightRect(readRect(target));
          setExiting(true);
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
          background: color-mix(in srgb, var(--bg-base) 55%, transparent);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          pointer-events: none;
          transition: background-color 0.5s ease, backdrop-filter 0.5s ease,
                      -webkit-backdrop-filter 0.5s ease;
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
          /* Deliberately simple: animates top/left/width/height/border-
             radius directly. An earlier version tried to do this purely
             via "transform: scale()" for GPU purity, with an inverse
             scale on the inner <img> to stop it stretching — but nested
             transforms compose multiplicatively, and that inverse ended
             up cancelling the *entire* resize, not just the aspect
             distortion, so the photo rendered at ~full natural size the
             whole time it was supposed to be shrinking/growing (the
             "balloons up" bug). This version can't have that bug: the
             image is always literally 100% of a box whose real
             width/height is what's animating, so it's never anything but
             the correct size at every point in the flight.
             will-change primes the compositor layer ahead of time so the
             very first frame of the transition doesn't pay a mid-
             animation layer-creation cost. */
          will-change: top, left, width, height, border-radius;
          transition:
            top 0.6s cubic-bezier(0.16,1,0.3,1),
            left 0.6s cubic-bezier(0.16,1,0.3,1),
            width 0.6s cubic-bezier(0.16,1,0.3,1),
            height 0.6s cubic-bezier(0.16,1,0.3,1),
            border-radius 0.6s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.6s ease,
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
        }

        @media (prefers-reduced-motion: reduce) {
          .intro-overlay, .intro-flip-avatar {
            transition: none !important;
          }
        }
      `}</style>

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
          {/* eslint-disable-next-line @next/next/no-img-element -- reuses the already-preloaded avatar URL from layout.tsx */}
          <img src={src} alt="" />
        </div>
      )}
    </div>
  );
}