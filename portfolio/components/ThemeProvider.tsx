"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { playThemeToggleSound } from "../lib/soundcn/sounds";

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
  root.style.colorScheme = t;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const resolved: Theme = stored === "light" ? "light" : "dark";
    setThemeState(resolved);
    applyTheme(resolved);
  }, []);

  const setTheme = (t: Theme) => {
    // Two-tone directional sound: going dark = lower, going light = higher
    playThemeToggleSound(t === "dark");

    if (typeof document !== "undefined" &&
        typeof (document as any).startViewTransition === "function") {
      (document as any).startViewTransition(() => {
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