"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useAnimation } from "motion/react";
import type { Transition, Variants } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { playThemeToggleSound } from "@/lib/soundcn/sounds";
import { usePdfModal } from "./PdfViewerModal";
import { SectionIcon, type SectionIconType } from "./SectionIcon";
import { BP, mq } from "@/lib/breakpoints";

type NavLinkType = "section" | "page" | "link" | "pdf";
type NavLink = {
  label: string;
  href: string;
  icon: string;
  external: boolean;
  type: NavLinkType;
  comingSoon?: boolean;
};

const PORTFOLIO_LINKS: NavLink[] = [
  { label: "Home",           href: "#",                                       icon: "home",     external: false, type: "section" },
  { label: "About",          href: "#about",                                  icon: "about",    external: false, type: "section" },
  { label: "Stats",          href: "#stats",                                  icon: "chart",    external: false, type: "section" },
  { label: "Skills",         href: "#skills",                                 icon: "layers",   external: false, type: "section" },
  { label: "Projects",       href: "/projects",                               icon: "box",      external: false, type: "page"    },
  { label: "Education",      href: "#education",                              icon: "book",     external: false, type: "section" },
  { label: "Experience",     href: "#experience",                             icon: "briefcase",external: false, type: "section", comingSoon: true },
  { label: "Certifications", href: "#certifications",                         icon: "badge",    external: false, type: "section" },
  { label: "Contact",        href: "/contact",                               icon: "mail",     external: false, type: "page"    },
  { label: "Resume",         href: "/resume.pdf",                             icon: "resume",   external: false, type: "pdf"     },
  { label: "Mail",           href: "mailto:ithakur2327@gmail.com",            icon: "mail",     external: true,  type: "link"    },
  { label: "LinkedIn",       href: "https://www.linkedin.com/in/indresh-thakur", icon: "linkedin", external: true,  type: "link" },
  { label: "GitHub",         href: "https://github.com/Ithakur2327",          icon: "github",   external: true,  type: "link"    },
  { label: "X / Twitter",    href: "https://x.com/indresh_dev",               icon: "twitter",  external: true,  type: "link"    },
  { label: "LeetCode",       href: "https://leetcode.com/IThakur09/",         icon: "leetcode", external: true,  type: "link"    },
  { label: "Website",        href: "https://indreshthakur.dev",              icon: "website",  external: true,  type: "link"    },
];

const SECTION_IDS = PORTFOLIO_LINKS.filter(i => i.type === "section" && i.href !== "#").map(i => i.href.slice(1));

function useActiveSection() {
  const [active, setActive] = useState<string>("");

  useEffect(() => {
    const els = SECTION_IDS
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length === 0) return;
        const top = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b
        );
        setActive(top.target.id);
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    );
    els.forEach(el => io.observe(el));

    const onScroll = () => {
      if (window.scrollY < 60) setActive("");
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => { io.disconnect(); window.removeEventListener("scroll", onScroll); };
  }, []);

  return active;
}

function MenuItemIcon({ type, color }: { type: string; color: string }) {
  return <SectionIcon type={type as SectionIconType} size={14} color={color} strokeWidth={2} />;
}

function SearchIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" shapeRendering="geometricPrecision">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}

function Kbd({ children, style: s }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <kbd className="nav-kbd" style={s}>{children}</kbd>;
}

const moonVariants: Variants = { normal: { rotate: 0 }, animate: { rotate: [0, -10, 10, -5, 5, 0] } };
const moonTransition: Transition = { duration: 1.2, ease: "easeInOut" };
function MoonIconAnimated({ size = 17 }: { size?: number }) {
  const c = useAnimation();
  return (
    <div onMouseEnter={() => c.start("animate")} onMouseLeave={() => c.start("normal")}>
      <motion.svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" variants={moonVariants} animate={c} transition={moonTransition} shapeRendering="geometricPrecision">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
      </motion.svg>
    </div>
  );
}

const sunPathVariants: Variants = {
  normal: { opacity: 1 },
  animate: (i: number) => ({ opacity: [0, 1], transition: { delay: i * 0.1, duration: 0.3 } }),
};
const SUN_RAYS = ["M12 3v1","M12 20v1","M3 12h1","M20 12h1","m18.364 5.636-.707.707","m6.343 17.657-.707.707","m5.636 5.636.707.707","m17.657 17.657.707.707"];
function SunIconAnimated({ size = 17 }: { size?: number }) {
  const c = useAnimation();
  return (
    <div onMouseEnter={() => c.start("animate")} onMouseLeave={() => c.start("normal")}>
      <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" shapeRendering="geometricPrecision">
        <circle cx="12" cy="12" r="4"/>
        {SUN_RAYS.map((d, i) => <motion.path key={d} d={d} animate={c} variants={sunPathVariants} custom={i + 1}/>)}
      </svg>
    </div>
  );
}

function NavTooltip({ children, label, kbd }: { children: React.ReactNode; label: string; kbd?: string }) {
  const [show, setShow] = useState(false);
  const timer    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasShown = useRef(false);

  return (
    <div
      style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
      onMouseEnter={() => {
        if (hasShown.current) return;
        hasShown.current = true;
        timer.current = setTimeout(() => setShow(true), 0);
      }}
      onMouseLeave={() => {
        if (timer.current) clearTimeout(timer.current);
        setShow(false);
        hasShown.current = false;
      }}
    >
      {children}
      {show && (
        <div className="nav-tooltip-box">
          <span className="nav-tooltip-arrow"/>
          {label}
          {kbd && <kbd style={{ display:"inline-flex",alignItems:"center",justifyContent:"center",height:18,minWidth:20,padding:"0 4px",borderRadius:3,fontSize:11,fontWeight:400,background:"rgba(128,128,128,0.25)",border:"1px solid rgba(128,128,128,0.35)",color:"inherit",userSelect:"none" }}>{kbd}</kbd>}
        </div>
      )}
    </div>
  );
}

function CommandMenu({
  open, onClose, isDark, triggerRef, openPdf, activeSection, isHome,
}: {
  open: boolean; onClose: () => void; isDark: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  openPdf: (src: string, title: string, dl?: string) => void;
  activeSection: string;
  isHome: boolean;
}) {
  const [query,    setQuery]    = useState("");
  const [selected, setSelected] = useState(0);
  const [visible,  setVisible]  = useState(false);
  const router = useRouter();
  const [panelLeft, setPanelLeft] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef  = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => (
    query.trim()
      ? PORTFOLIO_LINKS.filter(i => i.label.toLowerCase().includes(query.toLowerCase()))
      : PORTFOLIO_LINKS
  ), [query]);

  // The list is always rendered sections-first, then everything else — so
  // `selected` must be an index into this same grouped order everywhere,
  // not into `filtered`'s original mixed order.
  const flatFiltered = useMemo(() => [
    ...filtered.filter(i => i.type === "section"),
    ...filtered.filter(i => i.type !== "section"),
  ], [filtered]);

  useEffect(() => {
    if (!open || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const panelW = Math.min(480, window.innerWidth - 32);
    const desktopShift = window.innerWidth >= BP.tabletMin ? 56 : 0;
    let left = rect.left + rect.width / 2 - panelW / 2 - desktopShift;
    left = Math.max(16, Math.min(left, window.innerWidth - panelW - 16));
    setPanelLeft(left);
  }, [open, triggerRef]);

  useEffect(() => {
    if (open) {
      setVisible(true);
      setQuery("");
      const startIdx = flatFiltered.findIndex(i =>
        i.type === "section" && (i.href === "#" ? activeSection === "" : activeSection === i.href.slice(1))
      );
      setSelected(startIdx >= 0 ? startIdx : 0);
      const isMobile = window.matchMedia("(hover: none)").matches;
      if (!isMobile) requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      const t = setTimeout(() => setVisible(false), 200);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, activeSection]);

  useEffect(() => {
    if (!open) return;
    const fn = (e: KeyboardEvent) => {
      if (e.key === "Escape") { onClose(); }
      if (e.key === "ArrowDown") { e.preventDefault(); setSelected(s => Math.min(s + 1, flatFiltered.length - 1)); }
      if (e.key === "ArrowUp")   { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === "Enter" && flatFiltered[selected]) {
        const item = flatFiltered[selected];
        if (item.comingSoon) return;
        if (item.type === "pdf") { openPdf(item.href, item.label, item.href); onClose(); return; }
        if (item.type === "page") { onClose(); router.push(item.href); return; }
        if (item.external) {
          onClose();
          if (item.href.startsWith("mailto:")) window.location.href = item.href;
          else window.open(item.href, "_blank", "noopener,noreferrer");
          return;
        }
        onClose();
        setTimeout(() => {
          if (!isHome) { router.push(item.href === "#" ? "/" : `/${item.href}`); return; }
          if (item.href === "#") { window.scrollTo({ top: 0, behavior: "smooth" }); return; }
          const el = document.querySelector<HTMLElement>(item.href);
          if (!el) return;
          const top = el.getBoundingClientRect().top + window.scrollY - 64;
          window.scrollTo({ top, behavior: "smooth" });
        }, 60);
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [open, flatFiltered, selected, onClose, openPdf, isHome, router]);

  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll("[data-cmd-item]");
    (items[selected] as HTMLElement)?.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!visible) return null;

  const bg     = isDark ? "rgba(12, 13, 18, 0.72)" : "rgba(248, 250, 252, 0.72)";
  const border = isDark ? "rgba(255,255,255,0.16)" : "rgba(255,255,255,0.82)";
  const fg     = isDark ? "var(--text-primary)" : "var(--text-primary)";
  const muted  = isDark ? "var(--text-secondary)" : "var(--text-secondary)";
  const accent = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.7)";
  const iconBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.88)";
  const rowBg  = isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.60)";
  const panelW = typeof window !== "undefined" ? Math.min(480, window.innerWidth - 32) : 480;
  const panelShadow = isDark
    ? "0 24px 80px -26px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -12px 24px rgba(255,255,255,0.03), 0 0 0 1px rgba(255,255,255,0.05)"
    : "0 24px 80px -26px rgba(15,15,20,0.24), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -12px 24px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.55)";

  const sectionItems = filtered.filter(i => i.type === "section");
  const linkItems    = filtered.filter(i => i.type !== "section");

  const handleItemClick = (item: NavLink) => {
    if (item.comingSoon) return;
    if (item.type === "pdf") {
      openPdf(item.href, item.label, item.href);
      onClose();
      return;
    }
    if (item.type === "page") {
      onClose();
      router.push(item.href);
      return;
    }
    if (item.external) {
      onClose();
      if (item.href.startsWith("mailto:")) window.location.href = item.href;
      else window.open(item.href, "_blank", "noopener,noreferrer");
      return;
    }
    onClose();
    setTimeout(() => {
      if (!isHome) { router.push(item.href === "#" ? "/" : `/${item.href}`); return; }
      if (item.href === "#") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      const el = document.querySelector<HTMLElement>(item.href);
      if (!el) return;
      const navOffset = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - navOffset;
      window.scrollTo({ top, behavior: "smooth" });
    }, 60);
  };

  const renderItem = (item: NavLink, flatIdx: number) => {
    const isActive = flatIdx === selected;
    const isCurrent = item.type === "section" &&
      (item.href === "#" ? activeSection === "" : activeSection === item.href.slice(1));
    return (
      <div
        key={item.href + item.label}
        data-cmd-item
        onClick={() => handleItemClick(item)}
        onMouseEnter={() => setSelected(flatIdx)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 10px", margin: "0 4px", borderRadius: 7,
          background: isActive && !item.comingSoon ? accent : "transparent",
          color: fg, cursor: item.comingSoon ? "default" : "pointer",
          transition: "background 0.1s",
          opacity: item.comingSoon ? 0.45 : 1,
          filter: item.comingSoon ? "blur(0.4px)" : "none",
        }}
      >
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: isCurrent ? "#4ade8022" : iconBg,
          border: `1px solid ${isCurrent ? "#4ade8070" : border}`,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <MenuItemIcon type={item.icon} color={isCurrent ? "#4ade80" : isActive ? fg : muted} />
        </div>
        <span style={{
          flex: 1, fontSize: 14, fontWeight: 500,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
          letterSpacing: "-0.01em",
        }}>
          {item.label}
        </span>
        {item.comingSoon && (
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.04em",
            padding: "2px 6px", borderRadius: 5,
            color: muted, border: `1px solid ${border}`,
            fontFamily: "-apple-system,sans-serif", flexShrink: 0,
          }}>
            SOON
          </span>
        )}
        {item.external && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        )}
      </div>

    );
  };

  return (
    <>
      <div className={`cmdk-overlay${!open ? " closing" : ""}`} onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: isDark ? "rgba(0,0,0,0.22)" : "rgba(7,7,10,0.12)",
          backdropFilter: typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
            ? "blur(8px) saturate(140%)"
            : "none",
          WebkitBackdropFilter: typeof window !== "undefined" && window.matchMedia("(hover: none)").matches
            ? "blur(8px) saturate(140%)"
            : "none",
        }}
      />
      <div
        className={`cmdk-panel${!open ? " closing" : ""}`}
        style={{
          position: "fixed", top: 58,
          left: panelLeft !== null ? panelLeft : "50%",
          transform: panelLeft !== null ? "none" : "translateX(-50%) perspective(1200px) rotateX(0.2deg)",
          zIndex: 9999, width: panelW,
          maxHeight: "min(520px, calc(100vh - 80px))",
          background: bg, borderRadius: 16, border: `1px solid ${border}`,
          boxShadow: panelShadow,
          backdropFilter: "blur(22px) saturate(190%) brightness(110%)",
          WebkitBackdropFilter: "blur(22px) saturate(190%) brightness(110%)",
          overflow: "hidden", display: "flex", flexDirection: "column",
          padding: 4, outline: "none",
        }}
        role="dialog" aria-label="Command palette"
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, height: 48, padding: "0 12px", flexShrink: 0 }}>
          <span style={{ color: muted, display: "flex", flexShrink: 0 }}><SearchIcon size={18} /></span>
          <input
            ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search…" enterKeyHint="search"
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: fg, fontSize: 15, fontWeight: 500,
              fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
              caretColor: fg, letterSpacing: "-0.01em",
            }}
          />
        </div>

        <div ref={listRef} style={{
          borderRadius: 12, background: rowBg, border: `1px solid ${border}`,
          overflow: "hidden", display: "flex", flexDirection: "column",
          backdropFilter: "blur(14px) saturate(170%)",
          WebkitBackdropFilter: "blur(14px) saturate(170%)",
        }}>
          <div className="scroll-fade" style={{ maxHeight: 340, overflowY: "auto", padding: "6px 0" }}>
            {flatFiltered.length === 0 ? (
              <div style={{ padding: "20px 12px", textAlign: "center", color: muted, fontSize: 13 }}>No results found.</div>
            ) : (
              <>
                {sectionItems.filter(i => filtered.includes(i)).length > 0 && (
                  <>
                    <div style={{ padding: "4px 14px 5px", fontSize: 10.5, fontWeight: 700, color: muted, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "-apple-system,sans-serif" }}>
                      {query ? "Sections" : "Navigation"}
                    </div>
                    {sectionItems.filter(i => filtered.includes(i)).map(item => renderItem(item, flatFiltered.indexOf(item)))}
                  </>
                )}
                {linkItems.filter(i => filtered.includes(i)).length > 0 && (
                  <>
                    <div style={{ padding: "8px 14px 5px", fontSize: 10.5, fontWeight: 700, color: muted, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "-apple-system,sans-serif" }}>
                      Links
                    </div>
                    {linkItems.filter(i => filtered.includes(i)).map(item => renderItem(item, flatFiltered.indexOf(item)))}
                  </>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 38, padding: "0 8px 0 6px", flexShrink: 0 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: muted, fontFamily: "-apple-system,'SF Pro Display',sans-serif", letterSpacing: "-0.02em", userSelect: "none" }}>
            &lt;I&gt;
          </span>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 10 4 15 9 20"/><path d="M20 4v7a4 4 0 0 1-4 4H4"/>
          </svg>
        </div>
      </div>
    </>
  );
}




function CommandMenuTrigger({ onClick, btnRef }: { onClick: () => void; btnRef: React.RefObject<HTMLButtonElement | null> }) {
  return (
    <button ref={btnRef} onClick={onClick} aria-label="Open command menu" className="cmdk-trigger">
      <SearchIcon size={17} />
      <span className="cmdk-trigger-label">Search…</span>
      <span className="cmdk-trigger-kbd">
        <Kbd>Ctrl</Kbd>
        <Kbd style={{ minWidth: 20 }}>K</Kbd>
      </span>
    </button>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const { openPdf } = usePdfModal();
  const [mounted,  setMounted]  = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cmdOpen,  setCmdOpen]  = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const activeSection = useActiveSection();
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [heroAvatarOutOfView, setHeroAvatarOutOfView] = useState(!isHome);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    if (!isHome) { setHeroAvatarOutOfView(true); return; }
    const el = document.getElementById("hero-avatar-anchor");
    if (!el) { setHeroAvatarOutOfView(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => setHeroAvatarOutOfView(!entry.isIntersecting),
      { rootMargin: "-52px 0px 0px 0px", threshold: 0 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [isHome]);

  const showCornerAvatar = heroAvatarOutOfView;

  const isDark = mounted ? theme === "dark" : true;

  const handleTheme = useCallback(() => {
    const next = !isDark;
    try {
      if (typeof navigator !== "undefined" && navigator.vibrate) {
        navigator.vibrate(next ? [30, 10, 15] : [15, 8, 30]);
      }
    } catch {}
    playThemeToggleSound(next);
    setTheme(next ? "dark" : "light");
  }, [isDark, setTheme]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") { e.preventDefault(); setCmdOpen(v => !v); return; }
      // "D" toggles the theme — matches the kbd hint shown in this
      // button's own tooltip, which previously had no listener behind it.
      if (e.key.toLowerCase() === "d" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
        e.preventDefault();
        handleTheme();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handleTheme]);

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

        ${mq.mobile} {
          .cmdk-overlay { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
        }

        .scroll-fade {
          mask-image: linear-gradient(to bottom,transparent 0,black 32px,black calc(100% - 32px),transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom,transparent 0,black 32px,black calc(100% - 32px),transparent 100%);
        }

        .nav-kbd {
          display:inline-flex;align-items:center;justify-content:center;
          height:19px;min-width:21px;width:fit-content;gap:3px;
          border-radius:3px;padding:0 4px;
          font-family:inherit;font-size:11.5px;font-weight:400;line-height:1;
          color:var(--text-muted);user-select:none;pointer-events:none;
          background:rgba(0,0,0,0.04);
          border:1px solid rgba(0,0,0,0.09);
          box-shadow:none;
        }
        html.dark .nav-kbd {
          background:rgba(255,255,255,0.07);
          border:1px solid rgba(255,255,255,0.13);
          box-shadow:none;
          color:var(--text-muted);
        }

        .cmdk-trigger {
          display:inline-flex;align-items:center;gap:6px;
          height:36px;padding:0 9px;border-radius:8px;border:none;
          background:transparent;color:var(--nav-link-color);
          cursor:pointer;user-select:none;
          font-size:15.5px;font-weight:500;
          font-family:-apple-system,'SF Pro Display','Helvetica Neue',sans-serif;
          letter-spacing:-0.01em;
          transition:background 0.15s,color 0.15s;
          -webkit-tap-highlight-color:transparent;
        }
        .cmdk-trigger:hover { color:var(--nav-link-hover);background:var(--nav-link-active-bg); }
        ${mq.laptopWideUp} { .cmdk-trigger-label { display:none !important; } }
        ${mq.laptopNarrowDown} { .cmdk-trigger-kbd   { display:none !important; } }
        .cmdk-trigger-kbd { display:flex;align-items:center;gap:3px; }

        .nav-desktop-link {
          font-size:15.5px;font-weight:500;letter-spacing:-0.01em;
          color:var(--nav-link-color);text-decoration:none;
          transition:color 0.15s;padding:0 2px;
          font-family:-apple-system,'SF Pro Display','Helvetica Neue',sans-serif;
          cursor:pointer;background:none;border:none;
          display:inline-flex;align-items:center;height:36px;
        }
        .nav-desktop-link:hover { color:var(--nav-link-hover); }
        .nav-desktop-link.active { color:var(--nav-link-hover); }

        .nav-sep { width:1px;height:22px;align-self:center;background:var(--nav-border);flex-shrink:0; }

        .icon-btn {
          display:grid;place-items:center;
          width:36px;height:36px;border-radius:8px;border:none;
          background:transparent;color:var(--nav-link-color);
          cursor:pointer;touch-action:manipulation;
          transition:background 0.15s,color 0.15s;
          -webkit-tap-highlight-color:transparent;
          flex-shrink:0;
          padding:0;
          line-height:1;
          vertical-align:middle;
          position:relative;
        }
        .icon-btn > * { display:block; }
        .icon-btn svg, .cmdk-trigger svg, .nav-tooltip-box svg, .nav-desktop-link svg {
          shape-rendering: geometricPrecision;
        }
        .icon-btn:hover  { background:var(--nav-link-active-bg);color:var(--nav-link-hover); }
        .icon-btn:active { transform:scale(0.95); }

        ${mq.mobile} {
          .icon-btn {
            width:30px;height:30px;border-radius:0;
            background:transparent !important;
          }
          .icon-btn:hover,
          .icon-btn:active {
            background:transparent !important;
            color:var(--nav-link-color);
            transform:none;
          }
        }

        .nav-tooltip-box {
          position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);
          background:var(--text-primary);color:var(--bg-base);
          font-size:12px;font-weight:500;
          font-family:-apple-system,'SF Pro Display','Helvetica Neue',sans-serif;
          padding:6px 12px;border-radius:8px;
          white-space:nowrap;pointer-events:none;z-index:1000;
          display:flex;align-items:center;gap:10px;
          box-shadow:0 4px 16px rgba(0,0,0,0.22);
          animation: tooltip-pop 0.08s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        @keyframes tooltip-pop {
          from { opacity:0; transform:translateX(-50%) translateY(-4px) scale(0.96); }
          to   { opacity:1; transform:translateX(-50%) translateY(0)     scale(1);    }
        }
        ${mq.mobile}  { .nav-tooltip-box { display:none !important; } }
        @media (hover:none)       { .nav-tooltip-box { display:none !important; } }

        .nav-tooltip-arrow {
          position:absolute;bottom:100%;left:50%;transform:translateX(-50%);
          width:0;height:0;
          border-left:5px solid transparent;border-right:5px solid transparent;
          border-bottom:5px solid var(--text-primary);
        }

        ${mq.laptopNarrowDown} { .nav-desktop-only { display:none !important; } }
      `}</style>

      <header className={`nav-root${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">

          <Link href={isHome ? "#" : "/"} aria-label="Home" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <div className="logo-area">
              <div className={`logo-i${showCornerAvatar ? " hide" : ""}`}>&lt;I&gt;</div>
              <div className={`logo-avatar${showCornerAvatar ? " show" : ""}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
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
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>

            <nav className="nav-desktop-only" style={{ display: "flex", alignItems: "center", gap: 16, marginRight: 4 }}>
              <Link href={isHome ? "#" : "/"} className="nav-desktop-link">Home</Link>
              <Link href="/projects" className="nav-desktop-link">Projects</Link>
            </nav>

            <span className="nav-sep nav-desktop-only" style={{ margin: "0 6px" }}/>

            <CommandMenuTrigger onClick={() => setCmdOpen(true)} btnRef={triggerRef} />

            <span className="nav-sep nav-desktop-only" style={{ margin: "0 6px" }}/>

            <NavTooltip label="Toggle mode" kbd="D">
              <button suppressHydrationWarning className="icon-btn" onClick={handleTheme} aria-label="Toggle theme">
                {mounted
                  ? isDark ? <MoonIconAnimated size={17} /> : <SunIconAnimated size={17} />
                  : <MoonIconAnimated size={17} />
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
          openPdf={openPdf}
          activeSection={activeSection}
          isHome={isHome}
        />
      )}
    </>
  );
}