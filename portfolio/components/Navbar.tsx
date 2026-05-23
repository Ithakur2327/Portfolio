"use client";
import { useEffect, useState } from "react";
import { NAV_LINKS } from "@/lib/data";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [active, setActive] = useState("");

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY + 10 && y > 120);
      setLastY(y);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [lastY]);

  // Active section tracking
  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.3s ease, background 0.2s, border-color 0.2s",
      }}
    >
      <div style={{
        maxWidth: 780, margin: "0 auto", padding: "0 24px",
        height: 54,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(9,9,11,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        transition: "all 0.3s ease",
      }}>
        {/* Logo */}
        <a href="#" style={{
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none",
        }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: "var(--text-1)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 800, color: "var(--bg)",
            letterSpacing: "-0.02em", fontFamily: "'DM Mono', monospace",
          }}>IT</div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-1)", letterSpacing: "-0.02em" }}>
            Indresh Thakur
          </span>
        </a>

        {/* Nav */}
        <nav style={{ display: "flex", gap: 2 }}>
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                padding: "5px 12px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 450,
                color: active === link.href.slice(1) ? "var(--text-1)" : "var(--text-2)",
                background: active === link.href.slice(1) ? "rgba(255,255,255,0.07)" : "transparent",
                transition: "all 0.15s",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                if (active !== link.href.slice(1)) {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-1)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }
              }}
              onMouseLeave={e => {
                if (active !== link.href.slice(1)) {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-2)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="mailto:ithakur2327@gmail.com"
          className="btn-primary"
          style={{ padding: "7px 16px", fontSize: 13 }}
        >
          Hire Me
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M7 17L17 7M7 7h10v10"/>
          </svg>
        </a>
      </div>
    </header>
  );
}