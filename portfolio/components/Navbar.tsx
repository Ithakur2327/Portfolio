"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "motion/react";
import type { Transition, Variants } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { playThemeToggleSound } from "@/lib/soundcn/sounds";
import { usePdfModal } from "./PdfViewerModal";

const PORTFOLIO_LINKS = [
  { label: "Home",           href: "#",               icon: "home"   },
  { label: "About",          href: "#about",          icon: "about"  },
  { label: "Stats",          href: "#stats",          icon: "chart"  },
  { label: "Skills",         href: "#skills",         icon: "layers" },
  { label: "Projects",       href: "#projects",       icon: "box"    },
  { label: "Certifications", href: "#certifications", icon: "badge"  },
  { label: "Education",      href: "#education",      icon: "book"   },
  { label: "Contact",        href: "#contact",        icon: "mail"   },
];

function MenuItemIcon({ type, color }: { type: string; color: string }) {
  const p = { width: 14, height: 14, viewBox: "0 0 24 24", fill: "none", stroke: color, strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (type) {
    case "home":   return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "about":  return <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "chart":  return <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "layers": return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "box":    return <svg {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
    case "badge":  return <svg {...p}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
    case "book":   return <svg {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case "mail":   return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    default:       return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/></svg>;
  }
}

function SearchIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function Kbd({ children, style: s }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <kbd className="nav-kbd" style={s}>{children}</kbd>;
}

/* ── Moon ── */
const moonVariants: Variants = { normal: { rotate: 0 }, animate: { rotate: [0, -10, 10, -5, 5, 0] } };
const moonTransition: Transition = { duration: 1.2, ease: "easeInOut" };
function MoonIconAnimated({ size = 16 }: { size?: number }) {
  const c = useAnimation();
  return (
    <div onMouseEnter={() => c.start("animate")} onMouseLeave={() => c.start("normal")}>
      <motion.svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={moonVariants} animate={c} transition={moonTransition}>
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
      </motion.svg>
    </div>
  );
}

/* ── Sun ── */
const sunPathVariants: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({ opacity: [0, 1], transition: { delay: i * 0.1, duration: 0.3 } }),
};
const SUN_RAYS = ["M12 3v1","M12 20v1","M3 12h1","M20 12h1","m18.364 5.636-.707.707","m6.343 17.657-.707.707","m5.636 5.636.707.707","m17.657 17.657.707.707"];
function SunIconAnimated({ size = 16 }: { size?: number }) {
  const c = useAnimation();
  return (
    <div onMouseEnter={() => c.start("animate")} onMouseLeave={() => c.start("normal")}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4"/>
        {SUN_RAYS.map((d, i) => <motion.path key={d} d={d} animate={c} variants={sunPathVariants} custom={i + 1}/>)}
      </svg>
    </div>
  );
}

/* ── Tooltip — desktop/mouse only ── */
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
        <div className="nav-tooltip-box">
          <span className="nav-tooltip-arrow"/>
          {label}
          {kbd && <kbd style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",height:18,minWidth:20,padding:"0 4px",borderRadius:3,fontSize:11,fontWeight:400,background:"rgba(255,255,255,0.2)",boxShadow:"inset 0 0 1px rgba(255,255,255,0.2)",color:"inherit",userSelect:"none" }}>{kbd}</kbd>}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────
   COMMAND MENU
────────────────────────────────────────────── */
function CommandMenu({
  open, onClose, isDark, triggerRef,
}: {
  open: boolean; onClose: () => void; isDark: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const [panelLeft, setPanelLeft] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? PORTFOLIO_LINKS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : PORTFOLIO_LINKS;

  /* Position panel below the search trigger */
  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    // Center of trigger, clamped so panel doesn't go off-screen
    const panelW = Math.min(480, window.innerWidth - 32);
    let left = rect.left + rect.width / 2 - panelW / 2;
    left = Math.max(16, Math.min(left, window.innerWidth - panelW - 16));
    setPanelLeft(left);
  }, [open, triggerRef]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setQuery("");
      setSelected(0);
      // Desktop: auto-focus; Mobile: user taps to focus
      const isMobile = window.matchMedia("(hover: none)").matches;
      if (!isMobile) requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && filtered[selected]) {
        const href = filtered[selected].href;
        if (href === "#") window.scrollTo({ top: 0, behavior: "smooth" });
        else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
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

  const bg     = isDark ? "hsl(0 0% 4%)"    : "hsl(0 0% 100%)";
  const border = isDark ? "hsl(0 0% 15%)"   : "hsl(0 0% 89.8%)";
  const fg     = isDark ? "hsl(0 0% 98%)"   : "hsl(0 0% 3.9%)";
  const muted  = isDark ? "hsl(0 0% 45%)"   : "hsl(0 0% 45%)";
  const accent = isDark ? "hsl(0 0% 14.9%)" : "hsl(0 0% 92%)";
  const iconBg = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)";
  // Row bg = same as panel bg → seamless black in dark
  const rowBg  = isDark ? "hsl(0 0% 4%)"    : "hsl(0 0% 96.1%)";

  const panelW = typeof window !== "undefined" ? Math.min(480, window.innerWidth - 32) : 480;

  return (
    <>
      {/* Overlay — blur on mobile, plain dark on desktop */}
      <div
        className={`cmdk-overlay${!open ? " closing" : ""}`}
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.55)" }}
      />

      {/* Panel */}
      <div
        className={`cmdk-panel${!open ? " closing" : ""}`}
        style={{
          position: "fixed",
          top: 58,
          left: panelLeft !== null ? panelLeft : "50%",
          transform: panelLeft !== null ? "none" : "translateX(-50%)",
          zIndex: 9999,
          width: panelW,
          maxHeight: "min(480px, calc(100vh - 80px))",
          background: bg,
          borderRadius: 14,
          border: `1px solid ${border}`,
          boxShadow: "0 20px 50px -8px rgba(0,0,0,0.6)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          padding: 4,
          outline: "none",
        }}
        role="dialog"
        aria-label="Command palette"
      >
        {/* Search input */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 12px", flexShrink: 0 }}>
          <span style={{ color: muted, display: "flex", flexShrink: 0 }}><SearchIcon size={18} /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            enterKeyHint="search"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: fg, fontSize: 15, fontWeight: 500,
              fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
              caretColor: fg, letterSpacing: "-0.01em",
            }}
          />
        </div>

        {/* Results list — background matches panel (black in dark) */}
        <div ref={listRef} style={{
          borderRadius: 10,
          background: rowBg,
          border: `1px solid ${border}`,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}>
          <div className="scroll-fade" style={{ maxHeight: 300, overflowY: "auto", padding: "6px 0" }}>
            <div style={{
              padding: "4px 10px 6px",
              fontSize: 10.5, fontWeight: 700, color: muted,
              letterSpacing: "0.06em", textTransform: "uppercase",
              fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
            }}>
              {query ? "Results" : "Portfolio"}
            </div>

            {filtered.length === 0 ? (
              <div style={{ padding: "20px 12px", textAlign: "center", color: muted, fontSize: 13 }}>
                No results found.
              </div>
            ) : filtered.map((item, idx) => {
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
                    padding: "7px 10px", margin: "0 4px", borderRadius: 7,
                    background: isActive ? accent : "transparent",
                    color: fg, textDecoration: "none", cursor: "pointer",
                    transition: "background 0.1s", outline: "none",
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: iconBg, border: `1px solid ${border}`,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}>
                    <MenuItemIcon type={item.icon} color={isActive ? fg : muted} />
                  </div>
                  <span style={{
                    flex: 1, fontSize: 14, fontWeight: 500,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
                    letterSpacing: "-0.01em",
                  }}>
                    {item.label}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
        {/* "Go to page" footer REMOVED */}
      </div>
    </>
  );
}

/* ── Command trigger ── */
function CommandMenuTrigger({ onClick, btnRef }: { onClick: () => void; btnRef: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <button ref={btnRef} onClick={onClick} aria-label="Open command menu" className="cmdk-trigger">
      <SearchIcon size={16} />
      <span className="cmdk-trigger-label">Search…</span>
      <span className="cmdk-trigger-kbd">
        <Kbd>Ctrl</Kbd>
        <Kbd style={{ minWidth: 20 }}>K</Kbd>
      </span>
    </button>
  );
}

/* ──────────────────────────────────────────────
   MAIN NAVBAR
────────────────────────────────────────────── */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { openPdf } = usePdfModal();
  const [mounted,  setMounted]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cmdOpen,  setCmdOpen]  = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setCmdOpen(v => !v); }
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
        .cmdk-overlay { animation: cmdk-bd-in 0.18s ease forwards; }
        .cmdk-panel   { animation: cmdk-p-in 0.2s cubic-bezier(0.22,1,0.36,1) forwards; }
        .cmdk-overlay.closing { animation: cmdk-bd-out 0.16s ease forwards; }
        .cmdk-panel.closing   { animation: cmdk-p-out 0.16s ease forwards; }
        @keyframes cmdk-bd-in  { from{opacity:0} to{opacity:1} }
        @keyframes cmdk-bd-out { from{opacity:1} to{opacity:0} }
        @keyframes cmdk-p-in   { from{opacity:0;transform:translateY(-6px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes cmdk-p-out  { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(-6px) scale(0.98)} }

        /* Mobile overlay: blur */
        @media (max-width: 639px) {
          .cmdk-overlay { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        }

        .scroll-fade {
          mask-image: linear-gradient(to bottom,transparent 0,black 32px,black calc(100% - 32px),transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom,transparent 0,black 32px,black calc(100% - 32px),transparent 100%);
        }

        /* KBD */
        .nav-kbd {
          display:inline-flex;align-items:center;justify-content:center;
          height:20px;min-width:24px;width:fit-content;gap:4px;
          border-radius:4px;padding:0 5px;
          font-family:inherit;font-size:12px;font-weight:500;line-height:1;
          color:var(--text-muted);user-select:none;pointer-events:none;
          background:rgba(0,0,0,0.07);
          border:1px solid rgba(0,0,0,0.15);
          box-shadow:0 1px 0 rgba(0,0,0,0.12),inset 0 -1px 0 rgba(0,0,0,0.08);
        }
        html.dark .nav-kbd {
          background:rgba(255,255,255,0.13);
          border:1px solid rgba(255,255,255,0.25);
          box-shadow:0 1px 0 rgba(255,255,255,0.07),inset 0 -1px 0 rgba(255,255,255,0.07);
          color:var(--text-muted);
        }

        /* Search trigger */
        .cmdk-trigger {
          display:inline-flex;align-items:center;gap:6px;
          height:34px;padding:0 8px;border-radius:8px;border:none;
          background:transparent;color:var(--nav-link-color);
          cursor:pointer;user-select:none;
          font-size:14.5px;font-weight:500;
          font-family:-apple-system,'SF Pro Display','Helvetica Neue',sans-serif;
          letter-spacing:-0.01em;
          transition:background 0.15s,color 0.15s;
          -webkit-tap-highlight-color:transparent;
        }
        .cmdk-trigger:hover { color:var(--nav-link-hover);background:var(--nav-link-active-bg); }
        @media (min-width:640px) { .cmdk-trigger-label { display:none !important; } }
        @media (max-width:639px) { .cmdk-trigger-kbd   { display:none !important; } }
        .cmdk-trigger-kbd { display:flex;align-items:center;gap:3px; }

        /* Desktop nav links */
        .nav-desktop-link {
          font-size:14.5px;font-weight:500;letter-spacing:-0.01em;
          color:var(--nav-link-color);text-decoration:none;
          transition:color 0.15s;padding:0 2px;
          font-family:-apple-system,'SF Pro Display','Helvetica Neue',sans-serif;
          cursor:pointer;background:none;border:none;
        }
        .nav-desktop-link:hover { color:var(--nav-link-hover); }

        .nav-sep { width:1px;height:20px;align-self:center;background:var(--nav-border);flex-shrink:0; }

        /* Icon button */
        .icon-btn {
          display:inline-flex;align-items:center;justify-content:center;
          width:34px;height:34px;border-radius:8px;border:none;
          background:transparent;color:var(--nav-link-color);
          cursor:pointer;touch-action:manipulation;
          transition:background 0.15s,color 0.15s;
          -webkit-tap-highlight-color:transparent;
        }
        .icon-btn:hover  { background:var(--nav-link-active-bg);color:var(--nav-link-hover); }
        .icon-btn:active { transform:scale(0.95); }

        /* Tooltip — desktop/mouse pointer only */
        .nav-tooltip-box {
          position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);
          background:var(--text-primary);color:var(--bg-base);
          font-size:12px;font-weight:500;
          font-family:-apple-system,'SF Pro Display','Helvetica Neue',sans-serif;
          padding:6px 12px;border-radius:8px;
          white-space:nowrap;pointer-events:none;z-index:1000;
          display:flex;align-items:center;gap:10px;
          box-shadow:0 4px 16px rgba(0,0,0,0.22);
        }
        @media (max-width:639px)  { .nav-tooltip-box { display:none !important; } }
        @media (hover:none)       { .nav-tooltip-box { display:none !important; } }

        .nav-tooltip-arrow {
          position:absolute;bottom:100%;left:50%;transform:translateX(-50%);
          width:0;height:0;
          border-left:5px solid transparent;border-right:5px solid transparent;
          border-bottom:5px solid var(--text-primary);
        }

        @media (max-width:639px) { .nav-desktop-only { display:none !important; } }
      `}</style>

      <header className={`nav-root${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">

          {/* Logo */}
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

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>

            <nav className="nav-desktop-only" style={{ display: "flex", alignItems: "center", gap: 16, marginRight: 4 }}>
              <a href="#" className="nav-desktop-link">Home</a>
              <a href="#projects" className="nav-desktop-link">Projects</a>
              {/* Resume: open in-app PDF viewer like HeroSection */}
              <button
                className="nav-desktop-link"
                onClick={() => openPdf("/resume.pdf", "Resume", "/resume.pdf")}
              >
                Resume
              </button>
            </nav>

            <span className="nav-sep nav-desktop-only" style={{ margin: "0 6px" }}/>

            <CommandMenuTrigger onClick={() => setCmdOpen(true)} btnRef={triggerRef} />

            <span className="nav-sep nav-desktop-only" style={{ margin: "0 6px" }}/>

            <NavTooltip label="Toggle mode" kbd="D">
              <button suppressHydrationWarning className="icon-btn" onClick={handleTheme} aria-label="Toggle theme">
                {mounted
                  ? isDark ? <MoonIconAnimated size={16} /> : <SunIconAnimated size={16} />
                  : <MoonIconAnimated size={16} />
                }
              </button>
            </NavTooltip>
          </div>
        </div>
      </header>

      {mounted && (
        <CommandMenu
          open={cmdOpen}
          onClose={() => setCmdOpen(false)}
          isDark={isDark}
          triggerRef={triggerRef}
        />
      )}
    </>
  );
}