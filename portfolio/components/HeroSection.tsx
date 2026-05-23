"use client";
import { useEffect, useState } from "react";

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  return (
    <section
      id="about"
      style={{
        maxWidth: 680, margin: "0 auto", padding: "96px 24px 48px",
        opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      {/* Avatar with hover light effect */}
      <div
        className="avatar-wrap"
        style={{ width: 72, height: 72, marginBottom: 24, position: "relative" }}
        onMouseEnter={() => setLightOn(true)}
        onMouseLeave={() => setLightOn(false)}
        title="Click the light switch 💡"
      >
        {/* Avatar placeholder — replace with real img */}
        <div style={{
          width: 72, height: 72, borderRadius: "50%",
          border: "2px solid var(--avatar-ring)",
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22, fontWeight: 700, color: "#fff",
          fontFamily: "inherit",
          position: "relative", overflow: "hidden",
          transition: "border-color 0.2s",
          boxShadow: lightOn ? "0 0 20px rgba(251,191,36,0.4)" : "none",
        }}>
          {/* Lights-off state */}
          <span className="lights-off" style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700,
            opacity: lightOn ? 0 : 1, transition: "opacity 0.3s",
          }}>IT</span>
          {/* Lights-on glow */}
          <span style={{
            position: "absolute", inset: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, fontWeight: 700,
            background: "linear-gradient(135deg, #fbbf24, #f59e0b)",
            opacity: lightOn ? 1 : 0, transition: "opacity 0.3s",
          }}>IT</span>
        </div>
        {/* Tooltip */}
        <div style={{
          position: "absolute", bottom: -28, left: "50%", transform: "translateX(-50%)",
          whiteSpace: "nowrap", fontSize: 11, color: "var(--text-muted)",
          opacity: 0, transition: "opacity 0.2s",
          pointerEvents: "none",
        }} className="avatar-tooltip">
          hover for lights
        </div>
      </div>

      {/* Name */}
      <h1 style={{
        fontSize: 28, fontWeight: 600, letterSpacing: "-0.03em",
        color: "var(--text-primary)", marginBottom: 4, lineHeight: 1.2,
      }}>
        Indresh Thakur
      </h1>

      {/* Role line */}
      <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 20 }}>
        Full-Stack Developer & AI Enthusiast.{" "}
        <span style={{ color: "var(--text-muted)" }}>Building real-world apps with code.</span>
      </p>

      {/* Available badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 32 }}>
        <span className="pulse" style={{
          width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block",
        }}/>
        <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
          Available for internship & collaborations
        </span>
      </div>

      {/* Social links row */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {[
          { label: "GitHub", href: "https://github.com", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg> },
          { label: "LinkedIn", href: "https://linkedin.com", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
          { label: "Email", href: "mailto:ithakur2327@gmail.com", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> },
        ].map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
            className="social-link" title={s.label}>
            {s.icon}
          </a>
        ))}
      </div>
    </section>
  );
}
