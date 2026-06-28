"use client";
import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  useCallback,
} from "react";

export type Theme = "dark" | "light";

interface ThemeCtx { theme: Theme; setTheme: (t: Theme) => void; }
const ThemeContext = createContext<ThemeCtx>({ theme: "dark", setTheme: () => {} });

/* ── DOM helpers ─────────────────────────────────────── */
function applyTheme(t: Theme) {
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(t);
  root.setAttribute("data-theme", t);
  root.style.colorScheme = t;
}

function readDOMTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

/* ── Tiny external store — zero React state ─────────────
   useSyncExternalStore reads directly from the DOM class.
   No useState → no React re-render on theme change.
   Components that call useTheme() will only re-render when
   the DOM class actually changes, and the update is
   batched with the View Transition snapshot. */
let _listeners: (() => void)[] = [];
function _notify() { _listeners.forEach(l => l()); }
function _subscribe(cb: () => void) {
  _listeners.push(cb);
  return () => { _listeners = _listeners.filter(l => l !== cb); };
}
function _getSnapshot() { return readDOMTheme(); }
function _getServerSnapshot(): Theme { return "dark"; }

/* ── Provider ────────────────────────────────────────── */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  /* Boot: read localStorage, apply to DOM before first paint */
  useEffect(() => {
    const stored = (localStorage.getItem("theme") as Theme | null) ?? "dark";
    applyTheme(stored);
    _notify();
  }, []);

  const setTheme = useCallback((t: Theme) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(t === "dark" ? [30, 10, 15] : [15, 8, 30]);
    }

    const switchTheme = () => {
      /* Kill all CSS transitions during swap — same as next-themes
         disableTransitionOnChange. Prevents every element tweening
         between old/new theme values which is the #1 source of lag. */
      document.documentElement.classList.add("transitioning");

      applyTheme(t);
      localStorage.setItem("theme", t);

      /* Notify store subscribers (useTheme consumers) — they re-render
         inside the View Transition callback so browser snapshots new
         frame cleanly with zero extra paint cycle. */
      _notify();

      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          document.documentElement.classList.remove("transitioning")
        )
      );
    };

    if (!document.startViewTransition) {
      switchTheme();
    } else {
      document.startViewTransition(switchTheme);
    }
  }, []);

  const theme = useSyncExternalStore(_subscribe, _getSnapshot, _getServerSnapshot);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);