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
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(t === "dark" ? [30, 10, 15] : [15, 8, 30]);
    }

    const switchTheme = () => {
      setThemeState(t);
      applyTheme(t);
      localStorage.setItem("theme", t);
    };

  
    if (!document.startViewTransition) {
      switchTheme();
    } else {
      document.startViewTransition(switchTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);