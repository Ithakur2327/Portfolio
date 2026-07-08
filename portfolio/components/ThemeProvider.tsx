"use client";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
export type Theme = "dark" | "light";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      disableTransitionOnChange
      enableColorScheme
      storageKey="theme"
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  return {
    theme: (resolvedTheme ?? "dark") as Theme,
    setTheme: (t: Theme) => {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(t === "dark" ? [30, 10, 15] : [15, 8, 30]);
      }
      const switchTheme = () => setTheme(t);
      if (typeof document === "undefined" || !document.startViewTransition) {
        switchTheme();
        return;
      }
      const isMobile =
        typeof window !== "undefined" &&
        (window.matchMedia("(max-width: 860px)").matches ||
          window.matchMedia("(pointer: coarse)").matches);
      // Same view-transition as desktop everywhere now, just optimized for
      // mobile GPUs: pause every other running CSS animation for the
      // duration (marquees, lamp-beam flicker, etc. — that competition for
      // paint time was what made it feel heavy), and on mobile also drop
      // the fixed-layer backdrop-blur fade for the transition's duration,
      // since compositing blur while the browser is also capturing/playing
      // a full-page snapshot is the most expensive combination.
      const root = document.documentElement;
      root.classList.add("theme-transitioning");
      if (isMobile) root.classList.add("theme-transitioning-mobile");
      const transition = document.startViewTransition(switchTheme);
      transition.finished.finally(() => {
        root.classList.remove("theme-transitioning");
        root.classList.remove("theme-transitioning-mobile");
      });
    },
  };
}
