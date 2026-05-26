"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

const ThemeContext = createContext<{ theme: Theme; setTheme: (t: Theme, originX?: number, originY?: number) => void }>({
  theme: "dark",
  setTheme: () => {},
});

function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(t);
  root.setAttribute("data-theme", t);
  root.style.colorScheme = t;
  root.style.background = "";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted]  = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("theme") as Theme | null;
    const resolved: Theme = stored === "light" ? "light" : "dark";
    setThemeState(resolved);
    applyTheme(resolved);
  }, []);

  const setTheme = (t: Theme, originX?: number, originY?: number) => {
    /* Circular clip-path reveal from click origin */
    if (
      typeof document !== "undefined" &&
      typeof (document as any).startViewTransition === "function"
    ) {
      /* Set CSS vars for the origin so the keyframe knows where to expand from */
      const x = originX !== undefined ? originX : window.innerWidth - 44;
      const y = originY !== undefined ? originY : 26;
      document.documentElement.style.setProperty("--vt-origin-x", `${x}px`);
      document.documentElement.style.setProperty("--vt-origin-y", `${y}px`);

      const transition = (document as any).startViewTransition(() => {
        setThemeState(t);
        applyTheme(t);
        localStorage.setItem("theme", t);
      });
      transition.ready?.catch(() => {});
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
