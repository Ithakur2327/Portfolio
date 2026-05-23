"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const NAV_LINKS = [
  { label: "Skills",     href: "#skills" },
  { label: "Projects",   href: "#projects" },
  { label: "Education",  href: "#education" },
  { label: "Contact",    href: "#contact" },
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
function SystemIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
    </svg>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section highlight
  useEffect(() => {
    const ids = NAV_LINKS.map(l => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const cycleTheme = () => {
    const order: Record<string, string> = { light: "dark", dark: "system", system: "light" };
    setTheme(order[theme] as "light" | "dark" | "system");
  };

  const ThemeIcon = theme === "dark" ? MoonIcon : theme === "light" ? SunIcon : SystemIcon;

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.25s",
      }}
      className={scrolled ? "nav-bg" : ""}
    >
      <div
        style={{
          maxWidth: 680, margin: "0 auto", padding: "0 24px",
          height: 52, display: "flex", alignItems: "center", justifyContent: "space-between",
          borderLeft: "1px solid var(--line)", borderRight: "1px solid var(--line)",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: "flex", alignItems: "center", gap: 8,
            fontWeight: 700, fontSize: 14, color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "var(--text-primary)", color: "var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 800, letterSpacing: "0",
            fontFamily: "'Geist Mono', monospace",
          }}>IT</div>
          <span>Indresh Thakur</span>
        </a>

        {/* Right */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {/* Nav links */}
          <nav style={{ display: "flex", gap: 1, marginRight: 6 }} className="desktop-nav">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activeSection === href.slice(1);
              return (
                <a
                  key={href} href={href}
                  style={{
                    padding: "5px 10px", borderRadius: 6, fontSize: 13, fontWeight: 500,
                    color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                    background: isActive ? "var(--bg-hover)" : "transparent",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {label}
                </a>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <button
            onClick={cycleTheme}
            title={`Theme: ${theme}`}
            style={{
              width: 32, height: 32, borderRadius: 6,
              border: "1px solid var(--border)", background: "var(--bg)",
              color: "var(--text-secondary)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "var(--bg)";
              (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
            }}
          >
            <ThemeIcon />
          </button>

          {/* Hire me */}
          <a
            href="#contact"
            style={{
              padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 600,
              background: "var(--text-primary)", color: "var(--bg)",
              transition: "opacity 0.15s, transform 0.15s",
              display: "inline-flex", alignItems: "center", gap: 5,
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.opacity = "0.82";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.opacity = "1";
              (e.currentTarget as HTMLElement).style.transform = "none";
            }}
          >
            Hire Me
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}