"use client";

import { useEffect, useState } from "react";
import { cond } from "./breakpoints";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

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
export function useIsNavCollapsed(): boolean {
  return useMediaQuery(cond.navCollapse);
}
export function useIsLaptopUp(): boolean {
  return useMediaQuery(cond.laptopUp);
}