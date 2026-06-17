"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { playThemeToggleSound } from "../lib/soundcn/sounds";
import { useLowPerf } from "./PerfMode";

export type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme) => void }>({
  theme: "dark",
  setTheme: () => {},
});

function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(t);
  root.setAttribute("data-theme", t);
  // color-scheme: tells browser to use native dark/light scrollbars + form elements
  root.style.colorScheme = t;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const lowPerf = useLowPerf();

  useEffect(() => {
    // Read persisted preference immediately on mount
    const stored = localStorage.getItem("theme") as Theme | null;
    const resolved: Theme = stored === "light" ? "light" : "dark";
    setThemeState(resolved);
    applyTheme(resolved);
  }, []);

  const setTheme = (t: Theme) => {
    // Two-tone directional sound: going dark = lower, going light = higher
    playThemeToggleSound(t === "dark");
    // Haptic vibration feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(t === "dark" ? [30, 10, 15] : [15, 8, 30]);
    }

    // On struggling devices, skip the full-page View Transition snapshot —
    // it's the single most expensive part of a theme switch (the browser
    // screenshots the entire page through every blur/box-shadow layer
    // before it can wipe between them) and is what was showing up as a
    // sluggish, delayed-feeling toggle. The theme still switches instantly,
    // just without that snapshot+wipe animation.
    if (
      !lowPerf &&
      typeof document !== "undefined" &&
      typeof (document as unknown as { startViewTransition?: (cb: () => void) => void }).startViewTransition === "function"
    ) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        setThemeState(t);
        applyTheme(t);
        localStorage.setItem("theme", t);
      });
    } else {
      setThemeState(t);
      applyTheme(t);
      localStorage.setItem("theme", t);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
