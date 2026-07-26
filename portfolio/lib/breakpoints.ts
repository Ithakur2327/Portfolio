/**
 * ════════════════════════════════════════════════════════════════════
 * RESPONSIVE BREAKPOINTS — import this everywhere instead of writing
 * a raw `@media (...)` or a hardcoded `window.innerWidth` check.
 * ════════════════════════════════════════════════════════════════════
 *
 * The actual numbers live in exactly one place: `lib/breakpoints.json`.
 * This file turns those numbers into:
 *   - ready-to-use `@media` strings for a component's inline <style>
 *     block (`mq.*`)
 *   - bare media *conditions*, for combining with e.g. orientation
 *     (`cond.*`)
 *   - a `useBreakpoint()` / `useMediaQuery()` React hook for any JS
 *     logic that needs to know the viewport tier (`useIsTablet()`,
 *     `useIsNavCollapsed()`, etc.)
 *   - Tailwind's `screens` config (see tailwind.config.ts)
 *
 * `app/globals.css` gets the same numbers through a small generated
 * file (`app/breakpoints.generated.css`, produced by
 * `scripts/generate-breakpoints-css.mjs` and re-run automatically by
 * the `predev` / `prebuild` npm scripts) — so that file never needs to
 * be edited by hand either.
 *
 * React hooks (`useIsTablet()`, `useIsNavCollapsed()`, etc.) live in
 * the sibling `lib/useBreakpoint.ts` file instead of here, so that
 * server components can import `BP`/`mq`/`cond` from this file without
 * being forced into the client bundle.
 *
 * ── HOW TO USE IN A COMPONENT'S <style> BLOCK ──────────────────────
 *
 *   import { mq } from "@/lib/breakpoints";
 *
 *   <style suppressHydrationWarning>{`
 *     .foo { font-size: 24px; }
 *
 *     ${mq.mobile} {          // phones only
 *       .foo { font-size: 18px; }
 *     }
 *
 *     ${mq.laptopUp} {        // laptop and above
 *       .foo { font-size: 28px; }
 *     }
 *   `}</style>
 *
 * ── HOW TO USE IN JS/TS LOGIC ───────────────────────────────────────
 *
 *   import { useIsTablet, useIsNavCollapsed } from "@/lib/useBreakpoint";
 *   const isTablet = useIsTablet();
 *
 * ── HOW TO CHANGE THE SCALE ─────────────────────────────────────────
 * Edit the numbers in `lib/breakpoints.json` only. Everything else —
 * this file, tailwind.config.ts, and globals.css — updates on the next
 * dev server restart / build with zero further changes required.
 */

import raw from "./breakpoints.json";

export const BP = {
  mobileTinyMax: raw.mobileTinyMax,
  mobileXxsMax: raw.mobileXxsMax,
  mobileXsMax: raw.mobileXsMax,
  navTinyMax: raw.navTinyMax,
  mobileSmMax: raw.mobileSmMax,
  mobileMax: raw.mobileMax,

  tabletMin: raw.tabletMin,
  tabletSplitMax: raw.tabletSplitMax,
  tabletSplitMin: raw.tabletSplitMin,
  navRoomyMax: raw.navRoomyMax,
  footerCompactMax: raw.footerCompactMax,
  navCollapseMax: raw.navCollapseMax,
  tabletMax: raw.tabletMax,

  laptopMin: raw.laptopMin,
  laptopNarrowMax: raw.laptopNarrowMax,
  laptopWideMin: raw.laptopWideMin,
  laptopWideMax: raw.laptopWideMax,

  desktopMin: raw.desktopMin,

  contentWideMin: raw.contentWideMin,
  wideGridMin: raw.wideGridMin,
} as const;

const B = BP;

function up(px: number) {
  return `(min-width: ${px}px)`;
}
function down(px: number) {
  return `(max-width: ${px}px)`;
}
function between(minPx: number, maxPx: number) {
  return `(min-width: ${minPx}px) and (max-width: ${maxPx}px)`;
}

/**
 * Bare media *conditions* (no `@media` prefix) — useful when you need
 * to combine a breakpoint with another condition, e.g. orientation or
 * hover capability:
 *   `@media ${cond.mobile} and (orientation: landscape) { ... }`
 */
export const cond = {
  // sub-mobile refinement tiers
  mobileTiny: down(B.mobileTinyMax),
  mobileXxs: between(B.mobileTinyMax + 1, B.mobileXxsMax),
  mobileXs: between(B.mobileXxsMax + 1, B.mobileXsMax),
  mobileSm: between(B.mobileXsMax + 1, B.mobileSmMax),

  // primary tiers
  mobile: down(B.mobileMax),
  navTiny: down(B.navTinyMax), // very narrow phones — shrinks the nav bar further
  tablet: between(B.tabletMin, B.tabletMax),
  tabletSplitDown: down(B.tabletSplitMax), // small tablets & below
  tabletSplitUp: up(B.tabletSplitMin), // large tablets & above
  navRoomy: between(B.tabletSplitMin, B.navRoomyMax), // tablet/narrow-laptop — nav gets extra breathing room
  tabletThroughLaptopNarrow: between(B.tabletMin, B.laptopNarrowMax), // the hero card's "tablet-scaled" design regime
  navCollapse: down(B.navCollapseMax), // nav is collapsed/compact
  navExpanded: up(B.navCollapseMax + 1), // nav shows full inline links
  laptop: between(B.laptopMin, B.laptopWideMax),
  laptopNarrow: between(B.laptopMin, B.laptopNarrowMax),
  laptopWide: between(B.laptopWideMin, B.laptopWideMax),
  desktop: up(B.desktopMin),

  // cumulative — the ones you'll use 90% of the time
  tabletUp: up(B.tabletMin), // tablet and above (everything above phones)
  tabletDown: down(B.tabletMax), // phones + tablets (everything below laptop)
  laptopUp: up(B.laptopMin), // laptop and above (everything above tablets)
  laptopDown: down(B.laptopWideMax), // everything below desktop
  laptopNarrowDown: down(B.laptopNarrowMax), // everything up to & incl. narrow laptop
  laptopWideUp: up(B.laptopWideMin), // wide laptop and above
  desktopUp: up(B.desktopMin),

  // one-off wide tiers
  contentWideUp: up(B.contentWideMin),
  wideGridUp: up(B.wideGridMin),

  // raw builders for one-off cases
  up,
  down,
  between,
} as const;

/** Full `@media (...)` strings, ready to drop straight into a template literal. */
export const mq = Object.fromEntries(
  Object.entries(cond)
    .filter(([, v]) => typeof v === "string")
    .map(([k, v]) => [k, `@media ${v}`])
) as Record<
  Exclude<keyof typeof cond, "up" | "down" | "between">,
  string
>;