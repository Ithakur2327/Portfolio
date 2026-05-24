"use client";
import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "About",     href: "#about"     },
  { label: "Skills",    href: "#skills"    },
  { label: "Projects",  href: "#projects"  },
  { label: "Education", href: "#education" },
  { label: "Contact",   href: "#contact"   },
];

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled]         = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [mounted, setMounted]           = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
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

  const isDark = mounted ? theme === "dark" : true;
  const toggleTheme = () => setTheme(isDark ? "light" : "dark");

  return (
    <>
      <style>{`
        /* ── Logo ─────────────────────────────────── */
        .logo-area {
          position: relative;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
        }

        /* <I> text — shown when NOT scrolled */
        .logo-i {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Geist Mono', monospace;
          font-size: 15px; font-weight: 900;
          color: #fafafa;
          letter-spacing: -0.04em;
          opacity: 1;
          transform: scale(1) translateY(0);
          transition: opacity 0.45s cubic-bezier(0.16,1,0.3,1),
                      transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .logo-i.hide {
          opacity: 0;
          transform: scale(0.7) translateY(-8px);
        }

        /* Avatar circle — shown when scrolled */
        .logo-avatar {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #27272a 0%, #52525b 100%);
          border: 1.5px solid #3f3f46;
          font-family: 'Geist Mono', monospace;
          font-size: 12px; font-weight: 800;
          color: #fafafa;
          opacity: 0;
          transform: scale(0.7) translateY(8px);
          transition: opacity 0.45s cubic-bezier(0.16,1,0.3,1),
                      transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .logo-avatar.show {
          opacity: 1;
          transform: scale(1) translateY(0);
        }

        /* ── Nav links ───────────────────────────── */
        .nav-link {
          padding: 5px 11px;
          border-radius: 6px;
          font-size: 13px; font-weight: 500;
          color: rgba(255,255,255,0.4);
          background: transparent;
          text-decoration: none;
          transition: color 0.15s, background 0.15s;
        }
        .nav-link:hover { color: #fafafa; background: rgba(255,255,255,0.07); }
        .nav-link.active { color: #fafafa; background: rgba(255,255,255,0.09); }

        /* ── Theme button — NO box ───────────────── */
        .theme-btn {
          width: 30px; height: 30px;
          background: none; border: none; outline: none;
          color: rgba(255,255,255,0.4);
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: color 0.15s;
          padding: 0;
        }
        .theme-btn:hover { color: #fafafa; }
      `}</style>

      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        background: "#09090b",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}>
        <div style={{
          maxWidth: 1060, margin: "0 auto", padding: "0 16px",
          height: 52,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          
        }}>

          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <div className="logo-area">
              {/* <I> — visible before scroll */}
              <div className={`logo-i${scrolled ? " hide" : ""}`}>&lt;I&gt;</div>
              {/* Avatar circle — visible after scroll */}
              <div className={`logo-avatar${scrolled ? " show" : ""}`}>IT</div>
            </div>
          </a>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <nav style={{ display: "flex", gap: 1, marginRight: 8 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className={`nav-link${activeSection === href.slice(1) ? " active" : ""}`}
                >
                  {label}
                </a>
              ))}
            </nav>

            <button
              suppressHydrationWarning
              onClick={toggleTheme}
              className="theme-btn"
              title={isDark ? "Switch to light" : "Switch to dark"}
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>

        </div>
      </header>
    </>
  );
}
