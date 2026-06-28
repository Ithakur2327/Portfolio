"use client";
import { createContext, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    // Read persisted preference immediately on mount
    const stored = localStorage.getItem("theme") as Theme | null;
    const resolved: Theme = stored === "light" ? "light" : "dark";
    setThemeState(resolved);
    applyTheme(resolved);
  }, []);

  const setTheme = (t: Theme) => {
    // Haptic vibration feedback
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(t === "dark" ? [30, 10, 15] : [15, 8, 30]);
    }

    // Save & apply DOM immediately — before any transition starts
    // This ensures CSS vars flip at frame 0 with NO React re-render delay
    localStorage.setItem("theme", t);
    applyTheme(t);

    const vt = document as unknown as {
      startViewTransition?: (cb: () => void) => { ready: Promise<void> };
    };

    if (typeof vt.startViewTransition === "function") {
      // Kick off the wipe transition — DOM is already updated above,
      // so the "new" snapshot is captured immediately at 60/120fps
      vt.startViewTransition(() => {
        // React state update happens inside the transition callback so React
        // re-renders are batched with the transition paint — no double paint
        setThemeState(t);
      });
    } else {
      setThemeState(t);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
