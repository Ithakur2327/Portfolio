"use client";
import { useEffect, useRef, useState, useCallback, CSSProperties } from "react";
import { useTheme } from "./ThemeProvider";
import { playThemeToggleSound } from "@/lib/soundcn/sounds";

/* ══════════════════════
   NAV SECTIONS for search
══════════════════════ */
const NAV_MENU = [
  { label: "Home",           href: "#",              shortcut: "GH" },
  { label: "About",          href: "#about",         shortcut: "GA" },
  { label: "Skills",         href: "#skills",        shortcut: "GS" },
  { label: "Projects",       href: "#projects",      shortcut: "GP" },
  { label: "Certifications", href: "#certifications",shortcut: "GC" },
  { label: "Education",      href: "#education",     shortcut: "GE" },
  { label: "Contact",        href: "#contact",       shortcut: "GN" },
];

/* ── Icons ── */
function SunIcon()    { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>; }
function MoonIcon()   { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>; }
function SearchIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>; }
function EnterIcon()  { return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/></svg>; }
function MenuIcon()   { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>; }
function CloseIcon()  { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>; }

/* ══════════════════════════════════════════════
   COMMAND PALETTE  — exactly like reference image
══════════════════════════════════════════════ */
function CommandPalette({ open, onClose, isDark }: { open: boolean; onClose: () => void; isDark: boolean }) {
  const [query,     setQuery]    = useState("");
  const [selected,  setSelected] = useState(0);
  const [animIn,    setAnimIn]   = useState(false);
  const inputRef   = useRef<HTMLInputElement>(null);
  const listRef    = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? NAV_MENU.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
    : NAV_MENU;

  useEffect(() => {
    if (open) {
      setTimeout(() => { setAnimIn(true); inputRef.current?.focus(); }, 10);
      setQuery(""); setSelected(0);
    } else {
      setAnimIn(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape")     { onClose(); }
      if (e.key === "ArrowDown")  { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === "ArrowUp")    { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && filtered[selected]) {
        const href = filtered[selected].href;
        if (href === "#") window.scrollTo({ top: 0, behavior: "smooth" });
        else { const el = document.querySelector(href); if (el) el.scrollIntoView({ behavior: "smooth" }); }
        onClose();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, filtered, selected, onClose]);

  useEffect(() => { setSelected(0); }, [query]);

  // scroll selected into view
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const items = list.querySelectorAll("[data-cmd-item]");
    const el = items[selected] as HTMLElement;
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open && !animIn) return null;

  const bg        = isDark ? "#0a0a0a" : "#ffffff";
  const surface   = isDark ? "#141414" : "#f5f5f3";
  const border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const inputClr  = isDark ? "#fafafa" : "#0a0a0a";
  const mutedClr  = isDark ? "#71717a" : "#6b6b6b";
  const hoverBg   = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
  const activeBg  = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";
  const kbdBg     = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)";
  const kbdBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";

  return (
    <div
      style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", alignItems:"flex-start", justifyContent:"center", paddingTop:"clamp(48px,6vh,96px)" }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div style={{
        position:"absolute", inset:0,
        background: isDark ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.25)",
        backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)",
        opacity: animIn ? 1 : 0, transition:"opacity 0.18s ease",
      }} />

      {/* Panel */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position:"relative",
          width:"min(600px,92vw)",
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: isDark
            ? "0 0 0 1px rgba(255,255,255,0.04) inset, 0 32px 80px rgba(0,0,0,0.80)"
            : "0 0 0 1px rgba(255,255,255,0.8) inset, 0 20px 60px rgba(0,0,0,0.15)",
          transform: animIn ? "translateY(0) scale(1)" : "translateY(-10px) scale(0.97)",
          opacity: animIn ? 1 : 0,
          transition:"transform 0.22s cubic-bezier(0.22,1,0.36,1), opacity 0.18s ease",
        }}
      >
        {/* Search input row */}
        <div style={{ display:"flex", alignItems:"center", gap:10, padding:"14px 14px 12px", borderBottom:`1px solid ${border}` }}>
          <span style={{ color:mutedClr, flexShrink:0, display:"flex" }}><SearchIcon /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command or search…"
            style={{
              flex:1, background:"transparent", border:"none", outline:"none",
              color: inputClr,
              fontSize:14, fontWeight:400,
              fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif",
              caretColor: inputClr,
            }}
          />
        </div>

        {/* List */}
        <div ref={listRef} style={{ background: surface, margin:8, borderRadius:12, overflow:"hidden" }}>
          {/* Group heading */}
          <div style={{ padding:"8px 10px 4px", fontSize:11.5, fontWeight:500, color:mutedClr, fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif", letterSpacing:"0.01em" }}>
            {query ? "Results" : "Menu"}
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding:"20px 12px", textAlign:"center", color:mutedClr, fontSize:13, fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif" }}>
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
                    display:"flex", alignItems:"center", gap:10,
                    padding:"9px 10px", margin:"1px 4px",
                    borderRadius:8,
                    background: isActive ? activeBg : "transparent",
                    color: inputClr,
                    textDecoration:"none",
                    cursor:"pointer",
                    transition:"background 0.1s",
                  }}
                >
                  {/* Small icon box */}
                  <div style={{
                    width:28, height:28, borderRadius:7, flexShrink:0,
                    background: kbdBg,
                    border:`1px solid ${kbdBorder}`,
                    display:"flex", alignItems:"center", justifyContent:"center",
                  }}>
                    {/* Generic page icon */}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={mutedClr} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="3"/>
                      <line x1="3" y1="9" x2="21" y2="9"/>
                      <line x1="9" y1="21" x2="9" y2="9"/>
                    </svg>
                  </div>

                  <span style={{ flex:1, fontSize:14, fontWeight:450, fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif" }}>
                    {item.label}
                  </span>

                  {/* Shortcut */}
                  <span style={{
                    fontSize:12, fontWeight:500, letterSpacing:"0.12em",
                    color:mutedClr,
                    fontFamily:"'Geist Mono','SF Mono',monospace",
                  }}>
                    {item.shortcut}
                  </span>
                </a>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"10px 14px 12px",
          borderTop: `1px solid ${border}`,
        }}>
          {/* Left: logo mark placeholder */}
          <div style={{
            width:24, height:24, display:"flex", alignItems:"center", justifyContent:"center",
            color:mutedClr,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="3"/>
              <line x1="3" y1="9" x2="21" y2="9"/>
              <line x1="9" y1="21" x2="9" y2="9"/>
            </svg>
          </div>

          {/* Right: Go to page + enter key */}
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <span style={{ fontSize:12, fontWeight:500, color:mutedClr, fontFamily:"-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif" }}>
              Go to page
            </span>
            <kbd style={{
              display:"flex", alignItems:"center", justifyContent:"center",
              width:26, height:22, borderRadius:5,
              background:kbdBg, border:`1px solid ${kbdBorder}`,
              color:mutedClr, fontSize:10,
            }}>
              <EnterIcon />
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   MOBILE BLOB MENU
══════════════════════════════════════ */
const NAV_LINKS_MOBILE = [
  { label: "About",          href: "#about",          color: "#6366f1" },
  { label: "Skills",         href: "#skills",         color: "#10b981" },
  { label: "Projects",       href: "#projects",       color: "#f59e0b" },
  { label: "Education",      href: "#education",      color: "#ef4444" },
  { label: "Certifications", href: "#certifications", color: "#3b82f6" },
  { label: "Contact",        href: "#contact",        color: "#8b5cf6" },
];
const BLOB_SHAPES = [
  "62% 38% 46% 54% / 60% 44% 56% 40%","46% 54% 62% 38% / 44% 60% 40% 56%",
  "54% 46% 38% 62% / 56% 40% 60% 44%","38% 62% 54% 46% / 40% 56% 44% 60%",
  "60% 40% 42% 58% / 48% 62% 38% 52%","42% 58% 60% 40% / 62% 38% 52% 48%",
];

function BlobItem({ item, idx, blobBg, onClose }: { item: typeof NAV_LINKS_MOBILE[0]; idx: number; blobBg: string; onClose: () => void }) {
  const [hovered, setHovered] = useState(false);
  const blobSize = "clamp(90px,20vw,155px)";
  return (
    <a href={item.href} className="blob-item"
      style={{ display:"flex", alignItems:"center", justifyContent:"center", width:blobSize, height:blobSize, borderRadius:BLOB_SHAPES[idx]??"50%", background:hovered?item.color:blobBg, color:hovered?"#fff":"#111", textDecoration:"none", fontSize:"clamp(14px,3.5vw,22px)", fontWeight:500, pointerEvents:"auto", cursor:"pointer", boxShadow:hovered?`0 8px 32px ${item.color}55`:"0 4px 20px rgba(0,0,0,0.18)", transition:"background 0.18s,color 0.18s,box-shadow 0.18s", willChange:"transform", flexShrink:0, touchAction:"manipulation", WebkitTapHighlightColor:"transparent", userSelect:"none", WebkitUserSelect:"none" } as CSSProperties}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      onTouchStart={()=>setHovered(true)} onTouchEnd={()=>{setHovered(false);onClose();}}
      onClick={onClose}
    >{item.label}</a>
  );
}

function BlobMenu({ open, onClose, isDark }: { open: boolean; onClose: () => void; isDark: boolean }) {
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing,    setIsClosing]    = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  useEffect(()=>{
    if(open){if(closeTimer.current)clearTimeout(closeTimer.current);setIsClosing(false);setShouldRender(true);document.body.style.overflow="hidden";document.body.style.touchAction="none";}
    else{if(shouldRender){setIsClosing(true);closeTimer.current=setTimeout(()=>{setShouldRender(false);setIsClosing(false);},300);}document.body.style.overflow="";document.body.style.touchAction="";}
    return()=>{if(closeTimer.current)clearTimeout(closeTimer.current);};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[open]);
  useEffect(()=>{if(!open)return;const esc=(e:KeyboardEvent)=>{if(e.key==="Escape")onClose();};window.addEventListener("keydown",esc);return()=>window.removeEventListener("keydown",esc);},[open,onClose]);
  if(!shouldRender)return null;
  const blobBg=isDark?"rgba(255,255,255,0.93)":"#fff";
  const animClass=isClosing?"blob-exit":"blob-enter";
  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes bIn{from{opacity:0;transform:scale(0.3);}60%{transform:scale(1.08);}to{opacity:1;transform:scale(1);}}
        @keyframes bOut{from{opacity:1;transform:scale(1);}to{opacity:0;transform:scale(0.3);}}
        @keyframes bdIn{from{opacity:0}to{opacity:1}} @keyframes bdOut{from{opacity:1}to{opacity:0}}
        .blob-backdrop-enter{animation:bdIn .22s ease forwards;} .blob-backdrop-exit{animation:bdOut .22s ease forwards;}
        .blob-enter .blob-item{animation:bIn .42s cubic-bezier(0.34,1.56,0.64,1) forwards;opacity:0;}
        .blob-exit .blob-item{animation:bOut .22s ease-in forwards;opacity:1;}
        .blob-enter .blob-item:nth-child(1){animation-delay:.00s} .blob-enter .blob-item:nth-child(2){animation-delay:.06s}
        .blob-enter .blob-item:nth-child(3){animation-delay:.12s} .blob-enter .blob-item:nth-child(4){animation-delay:.18s}
        .blob-enter .blob-item:nth-child(5){animation-delay:.22s} .blob-enter .blob-item:nth-child(6){animation-delay:.26s}
        .blob-exit .blob-item:nth-child(1){animation-delay:.00s} .blob-exit .blob-item:nth-child(2){animation-delay:.02s}
        .blob-exit .blob-item:nth-child(3){animation-delay:.04s} .blob-exit .blob-item:nth-child(4){animation-delay:.06s}
        .blob-exit .blob-item:nth-child(5){animation-delay:.08s} .blob-exit .blob-item:nth-child(6){animation-delay:.10s}
        .blob-item:hover{transform:scale(1.07)!important;transition:background .18s,color .18s,box-shadow .18s,transform .18s!important}
        .blob-item:active{transform:scale(0.94)!important}
      `}</style>
      <div style={{position:"fixed",inset:0,zIndex:9999,pointerEvents:"auto"}}>
        <div className={isClosing?"blob-backdrop-exit":"blob-backdrop-enter"} onClick={onClose} style={{position:"absolute",inset:0,background:isDark?"rgba(0,0,0,0.92)":"rgba(0,0,0,0.88)",backdropFilter:"blur(3px)",WebkitBackdropFilter:"blur(3px)"}} />
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <div className={animClass} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"clamp(12px,3vw,28px)",pointerEvents:"none"}}>
            <div style={{display:"flex",gap:"clamp(10px,2.5vw,24px)",pointerEvents:"none"}}>
              {NAV_LINKS_MOBILE.slice(0,3).map((item,idx)=><BlobItem key={item.href} item={item} idx={idx} blobBg={blobBg} onClose={onClose}/>)}
            </div>
            <div style={{display:"flex",gap:"clamp(10px,2.5vw,24px)",pointerEvents:"none"}}>
              {NAV_LINKS_MOBILE.slice(3,6).map((item,idx)=><BlobItem key={item.href} item={item} idx={idx+3} blobBg={blobBg} onClose={onClose}/>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════ */
export function Navbar() {
  const { theme, setTheme }                 = useTheme();
  const [scrolled,       setScrolled]       = useState(false);
  const [mounted,        setMounted]        = useState(false);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [searchOpen,     setSearchOpen]     = useState(false);
  const [showTooltip,    setShowTooltip]    = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout>|null>(null);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setSearchOpen(v => !v); }
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
        .nav-lnk {
          padding: 5px 10px; border-radius: 6px;
          font-size: 12.5px; font-weight: 500;
          color: var(--nav-link-color);
          text-decoration: none; white-space: nowrap;
          transition: color .15s, background .15s;
          font-family: -apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif;
        }
        .nav-lnk:hover { color: var(--nav-link-hover); background: var(--nav-link-active-bg); }
        .nav-divider { width:1px; height:14px; background:var(--nav-border); margin:0 4px; flex-shrink:0; }

        /* Search trigger — exactly like reference: icon + text + kbd */
        .nav-search-trigger {
          display: flex; align-items: center; gap: 6px;
          padding: 4px 8px; border-radius: 6px;
          background: transparent;
          border: 1px solid var(--nav-border);
          color: var(--nav-link-color); cursor: pointer;
          font-size: 12.5px; font-weight: 500;
          font-family: -apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif;
          transition: background .15s, border-color .15s, color .15s;
          white-space: nowrap;
        }
        .nav-search-trigger:hover { color: var(--nav-link-hover); background: var(--nav-link-active-bg); }
        .nav-search-kbd {
          display: flex; align-items: center; gap: 2px;
        }
        .nav-search-kbd kbd {
          display: inline-flex; align-items: center; justify-content: center;
          min-width: 20px; height: 18px; padding: 0 4px;
          border-radius: 4px;
          background: var(--nav-link-active-bg);
          border: 1px solid var(--nav-border);
          font-size: 11px; font-weight: 500;
          color: var(--nav-link-color);
          font-family: 'Geist Mono','SF Mono',monospace;
          line-height: 1;
        }

        /* Theme btn */
        .theme-btn {
          width:30px; height:30px; border-radius:7px; border:none;
          background:transparent; color:var(--nav-link-color);
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transform:translateZ(0);
          transition:color .15s, background .15s, transform .18s cubic-bezier(0.34,1.56,0.64,1);
          -webkit-tap-highlight-color:transparent; touch-action:manipulation;
        }
        .theme-btn:hover { color:var(--nav-link-hover); background:var(--nav-link-active-bg); transform:translateZ(0) scale(1.12); }
        .theme-btn:active { transform:translateZ(0) scale(0.88); }

        .theme-tip {
          position:absolute; bottom:calc(100% + 8px); left:50%; transform:translateX(-50%);
          background:var(--bg-card); border:1px solid var(--border);
          color:var(--text-secondary); font-size:11px; white-space:nowrap;
          padding:4px 9px; border-radius:6px; pointer-events:none;
          box-shadow:0 4px 12px rgba(0,0,0,0.18);
          font-family:-apple-system,'SF Pro Display','Helvetica Neue',Arial,sans-serif;
        }
        .theme-tip::after {
          content:''; position:absolute; top:100%; left:50%; transform:translateX(-50%);
          border:5px solid transparent; border-top-color:var(--border);
        }

        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 769px) { .mobile-menu-btn { display: none !important; } }
      `}</style>

      <header
        className={`nav-root${scrolled ? " scrolled" : ""}`}
        style={{
          background: isDark
            ? scrolled ? "rgba(4,4,4,0.48)" : "rgba(4,4,4,0.12)"
            : scrolled ? "rgba(252,252,250,0.18)" : "rgba(252,252,250,0.08)",
          borderBottomColor: isDark
            ? scrolled ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"
            : scrolled ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.82)",
          backdropFilter: scrolled
            ? "blur(60px) saturate(320%) brightness(1.12)"
            : "blur(48px) saturate(280%) brightness(1.10)",
          WebkitBackdropFilter: scrolled
            ? "blur(60px) saturate(320%) brightness(1.12)"
            : "blur(48px) saturate(280%) brightness(1.10)",
        }}
      >
        <div className="nav-inner">
          {/* Logo */}
          <a href="#" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
            <div className="logo-area">
              <div className={`logo-i${scrolled?" hide":""}`}>&lt;I&gt;</div>
              <div className={`logo-avatar${scrolled?" show":""}`}>
                <img
                  src={isDark?"/avatar-dark.jpg":"/avatar-light.jpg"}
                  alt="IT"
                  onError={e=>{(e.currentTarget as HTMLImageElement).style.display="none";const fb=(e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement;if(fb)fb.style.display="flex";}}
                />
                <div className="logo-avatar-fallback" style={{display:"none"}}>IT</div>
              </div>
            </div>
          </a>

          {/* Right */}
          <div style={{ display:"flex", alignItems:"center", gap:0 }}>
            <div className="desktop-nav" style={{ display:"flex", alignItems:"center", gap:0 }}>
              <a href="#" className="nav-lnk">Home</a>
              <a href="#projects" className="nav-lnk">Projects</a>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="nav-lnk">Resume</a>

              <span className="nav-divider" style={{ margin:"0 6px" }} />

              {/* Search trigger — icon + text + Ctrl K */}
              <button className="nav-search-trigger" onClick={() => setSearchOpen(true)} aria-label="Open search">
                <SearchIcon />
                <span>Search…</span>
                <span className="nav-search-kbd">
                  <kbd>Ctrl</kbd>
                  <kbd>K</kbd>
                </span>
              </button>

              <span className="nav-divider" style={{ margin:"0 6px" }} />
            </div>

            {/* Theme toggle */}
            <div style={{ position:"relative" }}>
              <button
                suppressHydrationWarning
                className="theme-btn"
                onClick={handleTheme}
                onMouseEnter={() => { if(tooltipTimer.current)clearTimeout(tooltipTimer.current); tooltipTimer.current=setTimeout(()=>setShowTooltip(true),400); }}
                onMouseLeave={() => { if(tooltipTimer.current)clearTimeout(tooltipTimer.current); setShowTooltip(false); }}
                aria-label={isDark?"Switch to light":"Switch to dark"}
                style={{ marginLeft:4 }}
              >
                {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <MoonIcon />}
              </button>
              {showTooltip && mounted && (
                <div className="theme-tip">{isDark?"Light mode":"Dark mode"}</div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              className="mobile-menu-btn theme-btn"
              style={{ display:"none", alignItems:"center", justifyContent:"center", marginLeft:8 }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {mounted && <CommandPalette open={searchOpen} onClose={() => setSearchOpen(false)} isDark={isDark} />}
      {mounted && <BlobMenu open={mobileOpen} onClose={() => setMobileOpen(false)} isDark={isDark} />}
    </>
  );
}