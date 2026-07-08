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
      // Pause every other running CSS animation on the page for the
      // duration of the transition (infinite marquees, lamp-beam flicker,
      // etc.) — that's what made the original transition feel heavy. The
      // view-transition animation itself is untouched, so it looks exactly
      // the same, it's just no longer competing with a dozen other
      // animations for paint time.
      const root = document.documentElement;
      root.classList.add("theme-transitioning");
      const transition = document.startViewTransition(switchTheme);
      transition.finished.finally(() => {
        root.classList.remove("theme-transitioning");
      });
    },
  };
}
