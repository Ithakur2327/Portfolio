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
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
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
      if (menuRef.current && menuRef.current.contains(e.target as Node)) return;
      setMobileOpen(false);
    };
    const t = setTimeout(() => document.addEventListener("mousedown", fn), 80);
    return () => { clearTimeout(t); document.removeEventListener("mousedown", fn); };
  }, [mobileOpen]);

  const isDark = mounted ? theme === "dark" : true;
  const avatarSrc = isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg";

  // Always glass — stronger on scroll
  const navBgStyle = {
    background: isDark
      ? scrolled ? "rgba(9,9,11,0.82)" : "rgba(9,9,11,0.60)"
      : scrolled ? "rgba(245,245,243,0.82)" : "rgba(245,245,243,0.60)",
    borderBottomColor: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    backdropFilter: "blur(20px) saturate(160%)",
    WebkitBackdropFilter: "blur(20px) saturate(160%)",
  };

  const menuFg = isDark ? "#fafafa" : "#111111";
  const menuBg = isDark ? "rgba(14,14,16,0.96)" : "rgba(248,248,246,0.96)";
  const menuBorder = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.10)";

  return (
    <>
      <style suppressHydrationWarning>{`
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
        .mobile-nav-btn { display: none !important; }

        /* Compact mobile dropdown */
        .mobile-menu-dropdown {
          position: fixed;
          top: 54px;
          right: 16px;
          width: 190px;
          border-radius: 14px;
          overflow: hidden;
          z-index: 9000;
          animation: menuDropIn 0.18s cubic-bezier(0.22,1,0.36,1) both;
          transform-origin: top right;
        }
        @keyframes menuDropIn {
          from { opacity: 0; transform: scale(0.88) translateY(-8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .mobile-menu-link {
          display: flex; align-items: center;
          padding: 10px 16px;
          font-size: 13.5px; font-weight: 500;
          text-decoration: none;
          transition: background 0.12s, color 0.12s;
          gap: 10px;
        }
        .mobile-menu-link:hover { background: rgba(128,128,128,0.12); }

        @media (min-width: 761px) {
          .mobile-nav-btn { display: none !important; }
          .desktop-nav    { display: flex !important; }
          .nav-partition  { display: flex !important; }
        }
        @media (max-width: 760px) {
          .mobile-nav-btn { display: flex !important; }
          .desktop-nav    { display: none !important; }
          .nav-partition  { display: none !important; }
        }
      `}</style>

      <header
        className="nav-root"
        style={{
          ...navBgStyle,
          transition: "background 0.35s ease, border-color 0.35s ease",
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

      {/* Compact mobile dropdown */}
      {mobileOpen && (
        <div
          ref={menuRef}
          className="mobile-menu-dropdown"
          style={{
            background: menuBg,
            border: `1px solid ${menuBorder}`,
            backdropFilter: "blur(20px) saturate(160%)",
            WebkitBackdropFilter: "blur(20px) saturate(160%)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.16)",
          }}
        >
          {/* Theme toggle inside menu */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "10px 16px 8px",
            borderBottom: `1px solid ${menuBorder}`,
            marginBottom: 4,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: menuFg, opacity: 0.4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Navigation
            </span>
          </div>

          {NAV_LINKS.map((item, idx) => (
            <a
              key={item.href}
              href={item.href}
              className="mobile-menu-link"
              style={{
                color: menuFg,
                borderBottom: idx < NAV_LINKS.length - 1 ? `1px solid ${menuBorder}` : "none",
              }}
              onClick={() => setMobileOpen(false)}
            >
              <span
                style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: item.color, flexShrink: 0,
                  boxShadow: `0 0 6px ${item.color}88`,
                }}
              />
              {item.label}
            </a>
          ))}
        </div>
      )}
    </>
  );
}