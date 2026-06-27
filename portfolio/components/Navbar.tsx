"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { motion, useAnimation } from "motion/react";
import type { Transition, Variants } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { playThemeToggleSound } from "@/lib/soundcn/sounds";

/* ─────────────────────────────────────────────
   SECTION DATA — what appears in command menu
───────────────────────────────────────────── */
const PORTFOLIO_LINKS = [
  { label: "Home",            href: "#",               icon: "home"   },
  { label: "About",           href: "#about",          icon: "about"  },
  { label: "Stats",           href: "#stats",          icon: "chart"  },
  { label: "Skills",          href: "#skills",         icon: "layers" },
  { label: "Projects",        href: "#projects",       icon: "box"    },
  { label: "Certifications",  href: "#certifications", icon: "badge"  },
  { label: "Education",       href: "#education",      icon: "book"   },
  { label: "Contact",         href: "#contact",        icon: "mail"   },
];

/* ─────────────────────────────────────────────
   SMALL SVG ICONS for command menu items
───────────────────────────────────────────── */
function MenuItemIcon({ type, color }: { type: string; color: string }) {
  const props = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "home":    return <svg {...props}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "about":   return <svg {...props}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "chart":   return <svg {...props}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "layers":  return <svg {...props}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "box":     return <svg {...props}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
    case "badge":   return <svg {...props}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
    case "book":    return <svg {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case "mail":    return <svg {...props}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    default:        return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="3"/></svg>;
  }
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function CornerDownLeftIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>
    </svg>
  );
}

// "I" mark — replaces ChanhDaiMark in footer
function IMark({ size = 24, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <rect x="4" y="3" width="16" height="18" rx="2"/>
      <line x1="9" y1="3" x2="9" y2="21"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   KBD — styled exactly like chanhdai
───────────────────────────────────────────── */
function Kbd({ children, className = "", style: extraStyle }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        height: 20,
        minWidth: 24,
        width: "fit-content",
        gap: 4,
        borderRadius: 4,
        padding: "0 4px",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 400,
        letterSpacing: "-0.01em",
        color: "var(--text-muted)",
        userSelect: "none",
        pointerEvents: "none",
        lineHeight: 1,
        background: "rgba(0,0,0,0.05)",
        boxShadow: "inset 0 0 1px rgba(0,0,0,0.1)",
        ...extraStyle,
      }}
      className={`dark-kbd ${className}`}
    >
      {children}
    </kbd>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED MOON ICON (from chanhdai)
───────────────────────────────────────────── */
const moonVariants: Variants = {
  normal: { rotate: 0 },
  animate: { rotate: [0, -10, 10, -5, 5, 0] },
};
const moonTransition: Transition = { duration: 1.2, ease: "easeInOut" };

function MoonIconAnimated({ size = 16 }: { size?: number }) {
  const controls = useAnimation();
  return (
    <div
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        width={size} height={size}
        viewBox="0 0 24 24"
        fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        variants={moonVariants}
        animate={controls}
        transition={moonTransition}
      >
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
      </motion.svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   ANIMATED SUN ICON (from chanhdai)
───────────────────────────────────────────── */
const sunPathVariants: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({
    opacity: [0, 1],
    transition: { delay: i * 0.1, duration: 0.3 },
  }),
};
const SUN_RAYS = ["M12 3v1","M12 20v1","M3 12h1","M20 12h1","m18.364 5.636-.707.707","m6.343 17.657-.707.707","m5.636 5.636.707.707","m17.657 17.657.707.707"];

function SunIconAnimated({ size = 16 }: { size?: number }) {
  const controls = useAnimation();
  return (
    <div
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        {SUN_RAYS.map((d, i) => (
          <motion.path key={d} d={d} animate={controls} variants={sunPathVariants} custom={i + 1}/>
        ))}
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TOOLTIP — styled same as chanhdai
   (bg-foreground text-background, with arrow)
───────────────────────────────────────────── */
function NavTooltip({ children, label, kbd }: { children: React.ReactNode; label: string; kbd?: string }) {
  const [show, setShow] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => { timer.current = setTimeout(() => setShow(true), 400); }}
      onMouseLeave={() => { if (timer.current) clearTimeout(timer.current); setShow(false); }}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--text-primary)",
            color: "var(--bg-base)",
            fontSize: 12,
            fontWeight: 500,
            fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
            padding: "6px 12px",
            borderRadius: 8,
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: 10,
            boxShadow: "0 4px 16px rgba(0,0,0,0.22)",
          }}
        >
          {/* Arrow pointing UP — tooltip is below button */}
          <span style={{
            position: "absolute", bottom: "100%", left: "50%", transform: "translateX(-50%)",
            width: 0, height: 0,
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderBottom: "5px solid var(--text-primary)",
          }}/>
          {label}
          {kbd && (
            <kbd style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              height: 18, minWidth: 20, padding: "0 4px",
              borderRadius: 3, fontSize: 11, fontWeight: 400,
              background: "rgba(255,255,255,0.2)",
              boxShadow: "inset 0 0 1px rgba(255,255,255,0.2)",
              color: "inherit", userSelect: "none",
            }}>
              {kbd}
            </kbd>
          )}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────
   COMMAND DIALOG — styled exactly like chanhdai
───────────────────────────────────────────── */
function CommandMenu({ open, onClose, isDark }: { open: boolean; onClose: () => void; isDark: boolean }) {
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? PORTFOLIO_LINKS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : PORTFOLIO_LINKS;

  useEffect(() => {
    if (open) {
      setVisible(true);
      setTimeout(() => inputRef.current?.focus(), 30);
      setQuery(""); setSelected(0);
    } else {
      // delay hiding to allow close animation
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")    { onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && filtered[selected]) {
        const href = filtered[selected].href;
        if (href === "#") window.scrollTo({ top: 0, behavior: "smooth" });
        else { const el = document.querySelector(href); el?.scrollIntoView({ behavior: "smooth" }); }
        onClose();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, filtered, selected, onClose]);

  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-cmd-item]");
    (items[selected] as HTMLElement)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!visible) return null;

  // chanhdai palette colours
  const bg       = isDark ? "hsl(0 0% 3.9%)"  : "hsl(0 0% 100%)";
  const surface  = isDark ? "hsl(0 0% 9%)"    : "hsl(0 0% 96.1%)";
  const border   = isDark ? "hsl(0 0% 14.9%)" : "hsl(0 0% 89.8%)";
  const fg       = isDark ? "hsl(0 0% 98%)"   : "hsl(0 0% 3.9%)";
  const muted    = isDark ? "hsl(0 0% 45%)"   : "hsl(0 0% 45%)";
  const accent   = isDark ? "hsl(0 0% 14.9%)" : "hsl(0 0% 92%)";
  const iconBg   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";

  return (
    <>
      <style suppressHydrationWarning>{`
        .cmdk-overlay { animation: cmdk-backdrop-in 0.18s ease forwards; }
        .cmdk-panel   { animation: cmdk-panel-in 0.2s cubic-bezier(0.22,1,0.36,1) forwards; }
        .cmdk-overlay.closing { animation: cmdk-backdrop-out 0.16s ease forwards; }
        .cmdk-panel.closing   { animation: cmdk-panel-out 0.16s ease forwards; }
        @keyframes cmdk-backdrop-in  { from { opacity:0 } to { opacity:1 } }
        @keyframes cmdk-backdrop-out { from { opacity:1 } to { opacity:0 } }
        @keyframes cmdk-panel-in  { from { opacity:0; transform:translateX(-50%) translateY(-8px) scale(0.97) } to { opacity:1; transform:translateX(-50%) translateY(0) scale(1) } }
        @keyframes cmdk-panel-out { from { opacity:1; transform:translateX(-50%) translateY(0) scale(1) } to { opacity:0; transform:translateX(-50%) translateY(-8px) scale(0.97) } }
        .dark-kbd { background: rgba(0,0,0,0.05) !important; }
        html.dark .dark-kbd { background: rgba(255,255,255,0.1) !important; box-shadow: inset 0 0 1px rgba(255,255,255,0.2) !important; }
        .scroll-fade {
          mask-image: linear-gradient(to bottom, transparent 0, black 40px, black calc(100% - 40px), transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0, black 40px, black calc(100% - 40px), transparent 100%);
        }
      `}</style>

      {/* Overlay */}
      <div
        className={`cmdk-overlay${!open ? " closing" : ""}`}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Panel — below nav bar, left-aligned to search trigger */}
      <div
        className={`cmdk-panel${!open ? " closing" : ""}`}
        style={{
          position: "fixed",
          top: 60, left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          width: "min(512px, calc(100vw - 32px))",
          maxHeight: "min(520px, calc(100vh - 80px))",
          background: bg,
          borderRadius: 16,
          border: `1px solid ${border}`,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 4,
          outline: "none",
        }}
        role="dialog"
        aria-label="Command palette"
      >
        {/* Input row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 12px", flexShrink: 0 }}>
          <span style={{ color: muted, display: "flex", flexShrink: 0 }}><SearchIcon size={20} /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: fg, fontSize: 14, fontWeight: 500,
              fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
              caretColor: fg,
              letterSpacing: "-0.01em",
            }}
          />
        </div>

        {/* Results list with chanhdai's surface card + ring */}
        <div
          ref={listRef}
          style={{
            borderRadius: 12,
            background: surface,
            border: `1px solid ${border}`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Scrollable area */}
          <div
            className="scroll-fade"
            style={{
              maxHeight: 320,
              overflowY: "auto",
              padding: "8px 0",
            }}
          >
            {/* Group heading */}
            <div style={{
              padding: "2px 10px 6px",
              fontSize: 11.5, fontWeight: 600,
              color: muted,
              fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}>
              {query ? "Results" : "Portfolio"}
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "24px 12px", textAlign: "center", color: muted, fontSize: 13, fontFamily: "monospace" }}>
                No results found.
              </div>
            ) : (
              filtered.map((item, idx) => {
                const isActive = idx === selected;
                return (
                  <a
                    key={item.href}
                    data-cmd-item
                    href={item.href}
                    onClick={onClose}
                    onMouseEnter={() => setSelected(idx)}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "8px 10px", margin: "0 4px",
                      borderRadius: 8,
                      background: isActive ? accent : "transparent",
                      color: fg,
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "background 0.1s",
                      outline: "none",
                    }}
                  >
                    {/* Icon box */}
                    <div style={{
                      width: 28, height: 28,
                      borderRadius: 6,
                      background: iconBg,
                      border: `1px solid ${border}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      <MenuItemIcon type={item.icon} color={isActive ? fg : muted} />
                    </div>

                    {/* Label */}
                    <span style={{ flex: 1, fontSize: 14, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", letterSpacing: "-0.01em" }}>
                      {item.label}
                    </span>
                  </a>
                );
              })
            )}
          </div>
        </div>

        {/* Footer — "I" mark on left, "Go to page ↵" on right — chanhdai style */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 40, padding: "0 6px 0 4px", flexShrink: 0,
        }}>
          <IMark size={24} color={muted} />

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: muted, fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", letterSpacing: "-0.01em" }}>
              Go to page
            </span>
            <Kbd><CornerDownLeftIcon /></Kbd>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   COMMAND MENU TRIGGER — exact chanhdai style
   ghost button: icon + "Search…" text (hidden sm+) + KbdGroup (OS-aware)
───────────────────────────────────────────── */
function CommandMenuTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open command menu"
      style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 32, padding: "0 6px",
        borderRadius: 8, border: "none",
        background: "transparent",
        color: "var(--nav-link-color)",
        cursor: "pointer", userSelect: "none",
        fontSize: 14,
        fontFamily: "inherit",
        transition: "background 0.15s, color 0.15s",
        WebkitTapHighlightColor: "transparent",
      }}
      className="cmdk-trigger"
    >
      <SearchIcon size={16} />
      {/* "Search…" — show only on small screens (mobile) */}
      <span className="cmdk-trigger-label" style={{ fontSize: 13.5, fontWeight: 500, fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", letterSpacing: "-0.01em" }}>Search…</span>
      {/* Ctrl K — hidden on mobile (sm:flex), shown on non-mac desktop */}
      <span className="cmdk-trigger-kbd" style={{ display: "flex", alignItems: "center", gap: 3 }}>
        <Kbd>Ctrl</Kbd>
        <Kbd style={{ minWidth: 20 }}>K</Kbd>
      </span>
    </button>
  );
}

/* ─────────────────────────────────────────────
   MOBILE NAV — chanhdai-style popover from bottom
   (uses Radix Tooltip as simple popover fallback)
───────────────────────────────────────────── */
function MobileMenuTrigger({ onClick, open, className }: { onClick: () => void; open: boolean; className?: string }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle menu"
      aria-expanded={open}
      className={className}
      style={{
        display: "inline-flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 5, width: 32, height: 32,
        borderRadius: 8, border: "none",
        background: open ? "var(--nav-link-active-bg)" : "transparent",
        color: "var(--nav-link-color)",
        cursor: "pointer",
        transition: "background 0.15s",
        WebkitTapHighlightColor: "transparent",
        touchAction: "manipulation",
        position: "relative",
      }}
    >
      <span style={{
        display: "block", width: 16, height: 1.5,
        borderRadius: 1,
        background: "currentColor",
        transition: "transform 0.2s ease",
        transform: open ? "translateY(3.25px) rotate(45deg)" : "none",
      }}/>
      <span style={{
        display: "block", width: 16, height: 1.5,
        borderRadius: 1,
        background: "currentColor",
        transition: "transform 0.2s ease",
        transform: open ? "translateY(-3.25px) rotate(-45deg)" : "none",
      }}/>
    </button>
  );
}

function MobileMenu({ open, onClose, isDark }: { open: boolean; onClose: () => void; isDark: boolean }) {
  const [render, setRender] = useState(false);
  const [anim,   setAnim]   = useState(false);
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      if (t.current) clearTimeout(t.current);
      setRender(true);
      setTimeout(() => setAnim(true), 10);
      document.body.style.overflow = "hidden";
    } else {
      setAnim(false);
      t.current = setTimeout(() => { setRender(false); }, 220);
      document.body.style.overflow = "";
    }
    return () => { if (t.current) clearTimeout(t.current); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!render) return null;

  // chanhdai mobile menu: popover from bottom, simple list
  const bg     = isDark ? "hsl(0 0% 9%)"   : "hsl(0 0% 96.1%)";
  const border = isDark ? "hsl(0 0% 15%)"  : "hsl(0 0% 89.8%)";
  const fg     = isDark ? "hsl(0 0% 98%)"  : "hsl(0 0% 3.9%)";
  const accent = isDark ? "hsl(0 0% 15%)"  : "hsl(0 0% 90%)";

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes mob-in  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes mob-out { from { opacity:1; transform:translateY(0)   } to { opacity:0; transform:translateY(8px) } }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9997,
          opacity: anim ? 1 : 0,
          transition: "opacity 0.18s ease",
        }}
      />

      {/* Popover panel — fixed below nav */}
      <div
        style={{
          position: "fixed",
          bottom: 8, left: 8, right: 8,
          zIndex: 9998,
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 12,
          padding: 4,
          boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          animation: anim ? "mob-in 0.22s cubic-bezier(0.22,1,0.36,1) forwards" : "mob-out 0.18s ease forwards",
        }}
      >
        {PORTFOLIO_LINKS.map((item, idx) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8,
              color: fg, textDecoration: "none",
              fontSize: 15, fontWeight: 500,
              fontFamily: "inherit",
              transition: "background 0.1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = accent)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{
              width: 24, height: 24, borderRadius: 6,
              background: "rgba(128,128,128,0.12)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <MenuItemIcon type={item.icon} color={isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)"} />
            </span>
            {item.label}
          </a>
        ))}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   MAIN NAVBAR
───────────────────────────────────────────── */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted,    setMounted]    = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const [cmdOpen,    setCmdOpen]    = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Ctrl+K / Cmd+K
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCmdOpen(v => !v);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  const isDark = mounted ? theme === "dark" : true;

  const handleTheme = useCallback(() => {
    const next = !isDark;
    playThemeToggleSound(next);
    setTheme(next ? "dark" : "light");
  }, [isDark, setTheme]);

  return (
    <>
      <style suppressHydrationWarning>{`
        /* chanhdai ghost button style */
        .cmdk-trigger:hover { color: var(--nav-link-hover) !important; background: var(--nav-link-active-bg) !important; }

        /* hide "Search…" label on sm+ (show only icon + kbd) */
        @media (min-width: 640px) { .cmdk-trigger-label { display: none !important; } }
        /* hide kbd group on mobile */
        @media (max-width: 639px) { .cmdk-trigger-kbd { display: none !important; } }

        /* Desktop nav links */
        .nav-desktop-link {
          font-size: 14px; font-weight: 500; letter-spacing: -0.01em;
          color: var(--nav-link-color);
          text-decoration: none;
          transition: color 0.15s;
          padding: 0 2px;
          font-family: -apple-system,'SF Pro Display','Helvetica Neue',sans-serif;
        }
        .nav-desktop-link:hover { color: var(--nav-link-hover); }

        /* vertical separator */
        .nav-sep {
          width: 1px; height: 20px; align-self: center;
          background: var(--nav-border);
          flex-shrink: 0;
        }

        /* icon-sm ghost button — chanhdai theme toggle style */
        .icon-btn {
          display: inline-flex; align-items: center; justify-content: center;
          width: 32px; height: 32px; border-radius: 8px; border: none;
          background: transparent; color: var(--nav-link-color);
          cursor: pointer; touch-action: manipulation;
          transition: background 0.15s, color 0.15s;
          -webkit-tap-highlight-color: transparent;
          position: relative;
        }
        .icon-btn:hover { background: var(--nav-link-active-bg); color: var(--nav-link-hover); }
        .icon-btn:active { transform: scale(0.97); }

        /* hide mobile items on desktop, desktop items on mobile */
        @media (min-width: 640px) {
          .nav-mobile-only { display: none !important; }
        }
        @media (max-width: 639px) {
          .nav-desktop-only { display: none !important; }
        }
      `}</style>

      <header
        className={`nav-root${scrolled ? " scrolled" : ""}`}
      >
        <div className="nav-inner">
          {/* ── Logo ── */}
          <a href="#" aria-label="Home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <div className="logo-area">
              <div className={`logo-i${scrolled ? " hide" : ""}`}>&lt;I&gt;</div>
              <div className={`logo-avatar${scrolled ? " show" : ""}`}>
                <img
                  src={isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg"}
                  alt="IT"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    const fb = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div className="logo-avatar-fallback" style={{ display: "none" }}>IT</div>
              </div>
            </div>
          </a>

          {/* ── Right side ── */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>

            {/* Desktop nav links — hidden on mobile */}
            <nav className="nav-desktop-only" style={{ display: "flex", alignItems: "center", gap: 16, marginRight: 4 }}>
              <a href="#" className="nav-desktop-link">Home</a>
              <a href="#projects" className="nav-desktop-link">Projects</a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-desktop-link">Resume</a>
            </nav>

            {/* Separator — desktop only */}
            <span className="nav-sep nav-desktop-only" style={{ margin: "0 6px" }}/>

            {/* Command menu trigger */}
            <CommandMenuTrigger onClick={() => setCmdOpen(true)} />

            {/* Separator — desktop only */}
            <span className="nav-sep nav-desktop-only" style={{ margin: "0 6px" }}/>

            {/* Theme toggle with chanhdai tooltip */}
            <NavTooltip label="Toggle mode" kbd="D">
              <button
                suppressHydrationWarning
                className="icon-btn"
                onClick={handleTheme}
                aria-label="Toggle theme"
              >
                {mounted
                  ? isDark
                    ? <MoonIconAnimated size={16} />
                    : <SunIconAnimated size={16} />
                  : <MoonIconAnimated size={16} />
                }
              </button>
            </NavTooltip>

            {/* Mobile hamburger — hidden on desktop */}
            <span className="nav-sep nav-mobile-only" style={{ margin: "0 4px" }}/>
            <MobileMenuTrigger
              className="nav-mobile-only"
              onClick={() => setMobileOpen(v => !v)}
              open={mobileOpen}
            />
          </div>
        </div>
      </header>

      {/* Command palette */}
      {mounted && (
        <CommandMenu open={cmdOpen} onClose={() => setCmdOpen(false)} isDark={isDark} />
      )}

      {/* Mobile menu */}
      {mounted && (
        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} isDark={isDark} />
      )}
    </>
  );
}