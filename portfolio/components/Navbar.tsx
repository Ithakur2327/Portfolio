"use client";
import { useEffect, useState, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "About",     href: "#about" },
  { label: "Skills",    href: "#skills" },
  { label: "Projects",  href: "#projects" },
  { label: "Education", href: "#education" },
  { label: "Contact",   href: "#contact" },
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

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const prevScrolled = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      const s = window.scrollY > 60;
      if (s !== prevScrolled.current) {
        prevScrolled.current = s;
        setScrolled(s);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1));
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const isDark = theme === "dark";

  return (
    <>
      <style>{`
        .logo-wrap {
          position: relative;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
        }

        /* I.. text — no box, just raw text */
        .logo-text {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Geist Mono', monospace;
          font-size: 17px;
          font-weight: 900;
          color: #fafafa;
          letter-spacing: -0.06em;
          /* start visible */
          opacity: 1;
          transform: translateY(0px) scale(1);
          transition:
            opacity  0.5s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
          pointer-events: none;
          user-select: none;
        }
        .logo-text.hide {
          opacity: 0;
          transform: translateY(-10px) scale(0.8);
        }

        /* IT avatar circle */
        .logo-avatar {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #27272a 0%, #52525b 100%);
          border: 1.5px solid #3f3f46;
          font-family: 'Geist Mono', monospace;
          font-size: 11px;
          font-weight: 800;
          color: #fafafa;
          letter-spacing: -0.02em;
          /* start hidden below */
          opacity: 0;
          transform: translateY(10px) scale(0.75);
          transition:
            opacity  0.5s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
          pointer-events: none;
          user-select: none;
        }
        .logo-avatar.show {
          opacity: 1;
          transform: translateY(0px) scale(1);
        }

        .nav-link {
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.45);
          background: transparent;
          transition: color 0.15s, background 0.15s;
          text-decoration: none;
        }
        .nav-link:hover,
        .nav-link.active {
          color: #fafafa;
          background: rgba(255,255,255,0.07);
        }

        .theme-btn {
          width: 32px; height: 32px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.1);
          background: transparent;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .theme-btn:hover {
          background: rgba(255,255,255,0.07);
          color: #fafafa;
          border-color: rgba(255,255,255,0.2);
        }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#09090b",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{
          maxWidth: 860, margin: "0 auto", padding: "0 16px",
          height: 52,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderLeft: "1px solid rgba(255,255,255,0.06)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}>

          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>

            <div className="logo-wrap">
              {/* I.. text */}
              <div className={`logo-text ${scrolled ? "hide" : ""}`}>
                I..
              </div>
              {/* IT avatar */}
              <div className={`logo-avatar ${scrolled ? "show" : ""}`}>
                IT
              </div>
            </div>

            {/* Name — slides out on scroll */}
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 13.5,
              fontWeight: 700,
              color: "#fafafa",
              letterSpacing: "-0.03em",
              opacity: scrolled ? 0 : 1,
              transform: scrolled ? "translateX(-8px)" : "none",
              transition: "opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)",
              pointerEvents: "none",
              userSelect: "none",
            }}>
              Indresh Thakur
            </span>
          </a>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <nav style={{ display: "flex", gap: 1, marginRight: 6 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className={`nav-link ${activeSection === href.slice(1) ? "active" : ""}`}
                >
                  {label}
                </a>
              ))}
            </nav>

            <button
              suppressHydrationWarning
              onClick={toggleTheme}
              title={isDark ? "Switch to light" : "Switch to dark"}
              className="theme-btn"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

        </div>
      </header>
    </>
  );
}