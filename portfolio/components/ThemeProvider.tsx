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
      // Matches chanhdai's own theme-toggle-effect demo exactly: just call
      // startViewTransition directly, nothing else. No "pause every
      // animation on the page" hack — that used a `.theme-transitioning *`
      // selector, which forces the browser to recalculate style for every
      // single DOM node on every toggle. That forced-reflow cost, not the
      // view-transition animation itself, was the actual source of the lag.
      if (typeof document === "undefined" || !document.startViewTransition) {
        switchTheme();
        return;
      }
      document.startViewTransition(switchTheme);
    },
  };
}
