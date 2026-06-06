"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "About",          href: "#about",          color: "#6366f1" },
  { label: "Skills",         href: "#skills",         color: "#10b981" },
  { label: "Projects",       href: "#projects",       color: "#f59e0b" },
  { label: "Education",      href: "#education",      color: "#ef4444" },
  { label: "Certifications", href: "#certifications", color: "#3b82f6" },
  { label: "Contact",        href: "#contact",        color: "#8b5cf6" },
];

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [mounted,       setMounted]       = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  // For staggered pill animation without gsap
  const [pillsVisible,  setPillsVisible]  = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // Trigger after scroll = 40px — more transparent start
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const fn = (e: MouseEvent) => {
      if (overlayRef.current && overlayRef.current.contains(e.target as Node)) return;
      setMobileOpen(false);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", fn), 80);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", fn); };
  }, [mobileOpen]);

  // Stagger pills in after overlay opens
  useEffect(() => {
    if (mobileOpen) {
      const t = setTimeout(() => setPillsVisible(true), 30);
      return () => clearTimeout(t);
    } else {
      setPillsVisible(false);
    }
  }, [mobileOpen]);

  const isDark = mounted ? theme === "dark" : true;
  const avatarSrc = isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg";

  // Transparent by default, subtle glass on scroll
  const navBgStyle = scrolled
    ? { background: isDark ? "rgba(9,9,11,0.70)" : "rgba(245,245,243,0.70)", borderBottomColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)", backdropFilter: "blur(18px) saturate(160%)", WebkitBackdropFilter: "blur(18px) saturate(160%)" }
    : { background: "transparent", borderBottomColor: "transparent", backdropFilter: "none", WebkitBackdropFilter: "none" };

  const menuBg = isDark ? "#111113" : "#ffffff";
  const menuFg = isDark ? "#fafafa" : "#111111";
  const overlayBg = isDark ? "rgba(9,9,11,0.97)" : "rgba(245,245,243,0.97)";

  return (
    <>
      <style suppressHydrationWarning>{`
        /* Nav links — colour-only hover, no background box */
        .nav-link {
          padding: 5px 10px; border-radius: 5px;
          font-size: 13px; font-weight: 500;
          color: var(--nav-link-color);
          background: transparent !important;
          text-decoration: none;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover  { color: var(--nav-link-hover); }
        .nav-link.active { color: var(--nav-link-hover); }
        .nav-partition { width:1px; height:18px; background:var(--nav-border); margin:0 6px; flex-shrink:0; }

        /* Mobile btn hidden by default */
        .mobile-nav-btn { display: none !important; }

        /* BubbleMenu overlay */
        .bubble-overlay {
          position: fixed; inset: 0; z-index: 999;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column;
          transition: opacity 0.22s ease;
          pointer-events: none; opacity: 0;
        }
        .bubble-overlay.open { pointer-events: auto; opacity: 1; }

        /* Pill links */
        .bubble-pill {
          width: 100%; border-radius: 9999px;
          text-decoration: none;
          display: flex; align-items: center; justify-content: center;
          transition: background 0.22s, color 0.22s, transform 0.22s, opacity 0.28s;
          box-shadow: 0 4px 14px rgba(0,0,0,0.10);
          will-change: transform, opacity;
          white-space: nowrap; box-sizing: border-box;
        }
        .bubble-pill:active { transform: scale(0.95) !important; }

        @media (min-width: 761px) {
          .mobile-nav-btn { display: none !important; }
          .desktop-nav    { display: flex !important; }
          .nav-partition  { display: flex !important; }
          /* Desktop: pills rotated, in 3-col grid */
          .bubble-pill-col { flex: 0 0 calc(100% / 3); display: flex; justify-content: center; align-items: stretch; box-sizing: border-box; }
          .bubble-pill { min-height: 160px; padding: clamp(1.5rem,3vw,8rem) 0; font-size: clamp(1.5rem,4vw,4rem); font-weight: 400; line-height: 0; height: 10px; }
          .bubble-pill:hover { background: var(--pill-hover-bg) !important; color: var(--pill-hover-fg) !important; }
          /* 4th item centering */
          .bubble-pill-col:nth-child(4):nth-last-child(2) { margin-left: calc(100% / 6); }
          .bubble-pill-col:nth-child(4):last-child { margin-left: calc(100% / 3); }
        }

        @media (max-width: 760px) {
          .mobile-nav-btn { display: flex !important; }
          .desktop-nav    { display: none !important; }
          .nav-partition  { display: none !important; }
          /* Mobile: full-width stacked pills */
          .bubble-overlay { padding-top: 80px; align-items: flex-start; }
          .bubble-pill-list { width: 100%; padding: 0 20px; display: flex; flex-direction: column; gap: 10px; }
          .bubble-pill-col { width: 100%; }
          .bubble-pill { font-size: clamp(1.3rem,5vw,2.4rem) !important; min-height: 70px !important; padding: 20px 0 !important; font-weight: 500 !important; }
          .bubble-pill:hover { background: var(--pill-hover-bg) !important; color: var(--pill-hover-fg) !important; }
        }
      `}</style>

      {/* Inline transition for nav background */}
      <header
        className="nav-root"
        style={{
          ...navBgStyle,
          transition: "background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
        }}
      >
        <div className="nav-inner">
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <div className="logo-area">
              <div className={`logo-i${scrolled ? " hide" : ""}`}>&lt;I&gt;</div>
              <div className={`logo-avatar${scrolled ? " show" : ""}`}>
                <img
                  key={avatarSrc}
                  src={avatarSrc}
                  alt="IT"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const fb = el.nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div className="logo-avatar-fallback" style={{ display: "none" }}>IT</div>
              </div>
            </div>
          </a>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <nav className="desktop-nav" style={{ display: "flex", gap: 0 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={href} href={href} className={`nav-link${activeSection === href.slice(1) ? " active" : ""}`}>
                  {label}
                </a>
              ))}
            </nav>
            <span className="nav-partition desktop-nav" />
            <button
              suppressHydrationWarning
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="theme-btn"
              title={isDark ? "Switch to light" : "Switch to dark"}
              style={{ marginLeft: 4 }}
            >
              {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <MoonIcon />}
            </button>
            {/* Mobile hamburger */}
            <button
              className="mobile-nav-btn theme-btn"
              style={{ display: "none", alignItems: "center", justifyContent: "center", marginLeft: 8 }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* BubbleMenu overlay — CSS-animated, no gsap needed */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className={`bubble-overlay${mobileOpen ? " open" : ""}`}
          style={{
            background: overlayBg,
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
          }}
          aria-hidden={!mobileOpen}
        >
          {/* Close X */}
          <button
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{
              position: "absolute", top: 16, right: 16,
              width: 38, height: 38, borderRadius: "50%",
              background: menuBg,
              border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)"}`,
              color: menuFg,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", zIndex: 10,
            }}
          >
            <CloseIcon size={14} />
          </button>

          {/* Pills */}
          <ul
            className="bubble-pill-list"
            style={{
              listStyle: "none", margin: 0,
              padding: "0 24px",
              width: "100%", maxWidth: 1400,
              display: "flex", flexWrap: "wrap",
              gap: 0,
            }}
            role="menu"
          >
            {NAV_LINKS.map((item, idx) => (
              <li
                key={idx}
                role="none"
                className="bubble-pill-col"
                style={{ display: "flex", justifyContent: "center", alignItems: "stretch" }}
              >
                <a
                  role="menuitem"
                  href={item.href}
                  className="bubble-pill"
                  onClick={() => setMobileOpen(false)}
                  style={{
                    background: menuBg,
                    color: menuFg,
                    // CSS variables for hover
                    ["--pill-hover-bg" as string]: item.color,
                    ["--pill-hover-fg" as string]: "#fff",
                    // Stagger animation via CSS transition delay
                    opacity: pillsVisible ? 1 : 0,
                    transform: pillsVisible ? "scale(1) translateY(0)" : "scale(0.85) translateY(16px)",
                    transitionDelay: `${idx * 0.06}s`,
                  }}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}