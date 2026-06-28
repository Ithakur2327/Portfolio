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
      if (!document.startViewTransition) switchTheme();
      else document.startViewTransition(switchTheme);
    },
  };
}
