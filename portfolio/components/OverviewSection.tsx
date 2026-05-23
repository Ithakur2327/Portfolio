"use client";
import { useEffect, useState } from "react";
import { useReveal } from "./useReveal";

function LiveTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }) + " IST"
      );
    };
    fmt();
    const id = setInterval(fmt, 1000);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: 13 }}>{time}</span>;
}

const OVERVIEW_ITEMS = [
  {
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    text: "+91 7859096326",
    href: "tel:+917859096326",
  },
  {
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    text: "ithakur2327@gmail.com",
    href: "mailto:ithakur2327@gmail.com",
  },
  {
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
    text: "Greater Noida, India",
    href: "https://maps.google.com/?q=Greater+Noida+India",
  },
  {
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    text: "Web Dev Intern @ Unstop",
    href: "https://unstop.com",
  },
  {
    icon: (
      <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
        <path d="M6 12v5c3 3 9 3 12 0v-5"/>
      </svg>
    ),
    text: "B.Tech CSE (AI) @ NIET, Greater Noida",
    href: "#education",
  },
];

export function OverviewSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <div className="section-separator" />
      <section
        ref={ref}
        style={{
          padding: "32px 0 40px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p className="section-label">Overview</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {OVERVIEW_ITEMS.map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="overview-item"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateX(-8px)",
                transition: `opacity 0.4s var(--expo-out) ${0.05 * i}s, transform 0.4s var(--expo-out) ${0.05 * i}s`,
              }}
            >
              <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
                {item.icon}
              </span>
              <span>{item.text}</span>
            </a>
          ))}

          {/* Live local time */}
          <div className="overview-item" style={{ cursor: "default" }}>
            <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center" }}>
              <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </span>
            <LiveTime />
          </div>
        </div>

        {/* Social row */}
        <div style={{ display: "flex", gap: 6, marginTop: 20, flexWrap: "wrap" }}>
          {[
            { label: "GitHub", href: "https://github.com/IndreshThakur" },
            { label: "LinkedIn", href: "https://linkedin.com/in/indresh-thakur" },
          ].map(s => (
            <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="social-link">
              {s.label}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}