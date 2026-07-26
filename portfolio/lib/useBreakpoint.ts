"use client";

/**
 * React hooks for reading the current viewport tier — one shared
 * `matchMedia`-based implementation instead of every component wiring
 * up its own `resize` listener with its own hardcoded pixel thresholds.
 *
 * All thresholds come from `lib/breakpoints.ts` (which in turn reads
 * `lib/breakpoints.json`), so these hooks automatically stay in sync
 * with every `@media` query in the app.
 */

import { useEffect, useState } from "react";
import { cond } from "./breakpoints";

/**
 * Subscribes to a media query and returns whether it currently matches.
 * SSR-safe: returns `false` on the server and during the first client
 * render (before hydration can read `window`), then updates on mount.
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const update = () => setMatches(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, [query]);

  return matches;
}

export function useIsMobile(): boolean {
  return useMediaQuery(cond.mobile);
}
export function useIsTablet(): boolean {
  return useMediaQuery(cond.tablet);
}
export function useIsLaptop(): boolean {
  return useMediaQuery(cond.laptop);
}
export function useIsDesktop(): boolean {
  return useMediaQuery(cond.desktop);
}
/** True when the nav should show its collapsed/compact layout. */
export function useIsNavCollapsed(): boolean {
  return useMediaQuery(cond.navCollapse);
}
/** True from laptop-width and up (mirrors the old `DESKTOP_QUERY` in ProjectsGrid). */
export function useIsLaptopUp(): boolean {
  return useMediaQuery(cond.laptopUp);
}