"use client";
import { useEffect, useState } from "react";

const FLIP_SENTENCES = [
  "Full-Stack Developer & AI Enthusiast.",
  "Building real-world apps with code.",
  "React · Next.js · Node.js · LLMs.",
  "Open Source Contributor @ GSSOC.",
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/IndreshThakur",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/indresh-thakur",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:ithakur2327@gmail.com",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    label: "Resume",
    href: "#",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/>
        <line x1="9" y1="9" x2="12" y2="9"/>
      </svg>
    ),
  },
];

function FlipSentences() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    const timer = setInterval(() => {
      setPhase("out");
      setTimeout(() => {
        setIndex(i => (i + 1) % FLIP_SENTENCES.length);
        setPhase("in");
      }, 350);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flip-wrap" style={{ height: 24, overflow: "hidden", perspective: "600px" }}>
      <span
        key={index}
        className={`flip-item ${phase}`}
        style={{ display: "block", fontSize: 13.5, color: "var(--text-secondary)" }}
      >
        {FLIP_SENTENCES[index]}
      </span>
    </div>
  );
}

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [lit, setLit] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  return (
    <>
      {/* chanhdai-style: top border + diagonal pattern separator */}
      <div className="section-separator" style={{ marginTop: 52 }} />

      <section
        id="about"
        style={{
          padding: "40px 0 48px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.6s var(--expo-out), transform 0.6s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* Avatar + name row */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, marginBottom: 20 }}>
          {/* Avatar with light-on effect */}
          <div
            className={`avatar-wrap ${lit ? "lit" : ""}`}
            onMouseEnter={() => setLit(true)}
            onMouseLeave={() => setLit(false)}
            title="Hover for lights ✨"
            style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}
          >
            {/* Base avatar */}
            <div
              className="avatar-lights-off"
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #18181b 0%, #3f3f46 100%)",
                border: "2px solid var(--avatar-ring)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 800, color: "#fafafa",
                fontFamily: "'Geist Mono', monospace",
                letterSpacing: "-0.02em",
                boxShadow: lit ? "0 0 24px rgba(251,191,36,0.35)" : "none",
                transition: "box-shadow 0.3s, opacity 0.3s",
              }}
            >
              IT
            </div>
            {/* Lit avatar */}
            <div
              className="avatar-lights-on"
              style={{
                width: 72, height: 72, borderRadius: "50%",
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                border: "2px solid #fbbf24",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18, fontWeight: 800, color: "#1c1917",
                fontFamily: "'Geist Mono', monospace",
              }}
            >
              IT
            </div>

            {/* Online dot */}
            <span
              className="pulse"
              style={{
                position: "absolute", bottom: 3, right: 3,
                width: 10, height: 10, borderRadius: "50%",
                background: "#22c55e",
                border: "2px solid var(--bg)",
              }}
            />
          </div>

          <div style={{ flex: 1, paddingBottom: 4 }}>
            {/* Mono label */}
            <p style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 10, color: "var(--text-muted)",
              letterSpacing: "0.06em", marginBottom: 4,
              textTransform: "uppercase",
            }}>
              Full-Stack &amp; AI Developer
            </p>
            <h1 style={{
              fontSize: 26, fontWeight: 700, letterSpacing: "-0.04em",
              color: "var(--text-primary)", lineHeight: 1.15,
            }}>
              Indresh Thakur
            </h1>
          </div>
        </div>

        {/* Flip sentences */}
        <div style={{ marginBottom: 20 }}>
          <FlipSentences />
        </div>

        {/* Available badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 28 }}>
          <span
            className="pulse"
            style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#22c55e", display: "inline-block",
              boxShadow: "0 0 6px #22c55e",
            }}
          />
          <span style={{ fontSize: 12.5, color: "var(--text-secondary)" }}>
            Available for internship &amp; collaborations
          </span>
          <span className="kbd">🇮🇳 Greater Noida</span>
        </div>

        {/* Social links */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }} className="stagger">
          {SOCIAL_LINKS.map(s => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              {s.icon}
              <span>{s.label}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}