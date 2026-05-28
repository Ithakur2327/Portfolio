"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "About",          href: "#about"          },
  { label: "Skills",         href: "#skills"         },
  { label: "Projects",       href: "#projects"       },
  { label: "Education",      href: "#education"      },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact",        href: "#contact"        },
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
function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled,       setScrolled]      = useState(false);
  const [activeSection,  setActiveSection] = useState("about");
  const [mounted,        setMounted]       = useState(false);
  const [mobileOpen,     setMobileOpen]    = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 80);
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

  useEffect(() => {
    if (!mobileOpen) return;
    const fn = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".nav-root")) setMobileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [mobileOpen]);

  const isDark = mounted ? theme === "dark" : true;
  // Avatar image changes with theme
  const avatarSrc = isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg";

  return (
    <>
      <style>{`
        .mobile-nav-btn { display: none; }
        .mobile-menu {
          display: none;
          position: fixed;
          top: 52px; left: 0; right: 0;
          background: var(--nav-bg);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid var(--nav-border);
          padding: 12px 16px;
          flex-direction: column;
          gap: 4px;
          z-index: 99;
        }
        .mobile-menu.open { display: flex; }
        .mobile-menu a {
          padding: 10px 14px; border-radius: 8px;
          font-size: 15px; font-weight: 500;
          color: var(--nav-link-color);
          text-decoration: none;
          transition: color 0.15s;
        }
        .mobile-menu a:hover,
        .mobile-menu a.active {
          color: var(--nav-link-hover);
        }

        /* Nav link — NO background box, only colour change on hover/active */
        .nav-link {
          padding: 5px 10px;
          border-radius: 0;
          font-size: 13px; font-weight: 500;
          color: var(--nav-link-color);
          background: transparent !important;
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-link:hover  { color: var(--nav-link-hover); background: transparent !important; }
        .nav-link.active { color: var(--nav-link-hover); background: transparent !important; }

        @media (max-width: 700px) {
          .mobile-nav-btn { display: flex !important; }
          .desktop-nav    { display: none !important; }
        }
      `}</style>

      <header className="nav-root">
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

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <nav className="desktop-nav" style={{ display: "flex", gap: 0, marginRight: 8 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={href} href={href} className={`nav-link${activeSection === href.slice(1) ? " active" : ""}`}>
                  {label}
                </a>
              ))}
            </nav>

            <button
              suppressHydrationWarning
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="theme-btn"
              title={isDark ? "Switch to light" : "Switch to dark"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Mobile hamburger */}
            <button
              className="mobile-nav-btn theme-btn"
              style={{ display: "none" }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      <nav className={`mobile-menu${mobileOpen ? " open" : ""}`}>
        {NAV_LINKS.map(({ label, href }) => (
          <a
            key={href}
            href={href}
            className={activeSection === href.slice(1) ? "active" : ""}
            onClick={() => setMobileOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </>
  );
}