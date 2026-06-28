"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { flushSync } from "react-dom";

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

    const doc = document as unknown as {
      startViewTransition?: (cb: () => void) => void;
    };

    if (typeof doc.startViewTransition === "function") {
      // Browser captures OLD snapshot first (correct theme contrast for wipe)
      // flushSync forces React + DOM to update synchronously inside the callback
      // so browser captures NEW snapshot cleanly — no lag, no double-paint
      doc.startViewTransition(() => {
        flushSync(() => {
          setThemeState(t);
        });
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
