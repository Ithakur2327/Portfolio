"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const cycleTheme = () => {
    const order: Record<string, string> = { light: "dark", dark: "system", system: "light" };
    setTheme(order[theme] as any);
  };

  const ThemeIcon = () => {
    if (theme === "dark") return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
    );
    if (theme === "light") return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
    );
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    );
  };

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transition: "all 0.2s",
      }}
      className={scrolled ? "nav-bg" : ""}
    >
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <a href="#" style={{ fontWeight: 600, fontSize: 14, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: "50%",
            background: "var(--text-primary)",
            color: "var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 700, letterSpacing: "-0.02em"
          }}>IT</div>
          <span style={{ color: "var(--text-primary)" }}>Indresh Thakur</span>
        </a>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {/* Nav links — desktop */}
          <nav style={{ display: "flex", gap: 2, marginRight: 8 }} className="desktop-nav">
            {["#skills","#projects","#education","#contact"].map((href) => (
              <a key={href} href={href} style={{
                padding: "5px 10px", borderRadius: 6, fontSize: 13,
                color: "var(--text-secondary)", transition: "all 0.15s"
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
              >
                {href.slice(1).charAt(0).toUpperCase() + href.slice(2)}
              </a>
            ))}
          </nav>

          {/* Theme toggle */}
          <button onClick={cycleTheme} style={{
            width: 32, height: 32, borderRadius: 6, border: "1px solid var(--border)",
            background: "var(--bg)", color: "var(--text-secondary)", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s"
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
          title={`Theme: ${theme}`}
          >
            <ThemeIcon />
          </button>

          {/* Hire me */}
          <a href="#contact" style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
            background: "var(--text-primary)", color: "var(--bg)",
            transition: "opacity 0.15s"
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            Hire Me
          </a>
        </div>
      </div>
      <style>{`@media(max-width:600px){.desktop-nav{display:none!important}}`}</style>
    </header>
  );
}
