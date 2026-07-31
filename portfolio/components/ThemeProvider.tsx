"use client";
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes";
import { cond } from "@/lib/breakpoints";
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
      const switchTheme = () => setTheme(t);

      const supportsViewTransition = typeof document !== "undefined" && !!document.startViewTransition;
      const isSmallScreen = typeof window !== "undefined" && window.matchMedia(cond.tabletDown).matches;
      if (!supportsViewTransition || isSmallScreen) {
        switchTheme();
        return;
      }
      window.dispatchEvent(new Event("theme-transition-start"));
      const done = () => window.dispatchEvent(new Event("theme-transition-end"));
      const transition = document.startViewTransition(switchTheme);
      transition.finished.then(done, done);
    },
  };
}