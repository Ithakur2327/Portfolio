"use client";
import React, { useEffect, useState } from "react";

/* ── flip sentences ─────────────────────────────────────── */
const FLIP_SENTENCES = [
  "AI Software Engineer",
  "Open Source Contributor",
  "Competitive Programmer",
  "Code · Create · Innovate",
];

function FlipSentences() {
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  useEffect(() => {
    const t = setInterval(() => {
      setPhase("out");
      setTimeout(() => { setIndex(i => (i + 1) % FLIP_SENTENCES.length); setPhase("in"); }, 350);
    }, 3000);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="flip-wrap">
      <span key={index} className={`flip-item ${phase}`}>{FLIP_SENTENCES[index]}</span>
    </div>
  );
}

/* ── live IST time ──────────────────────────────────────── */
function LiveTime() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => setTime(
      new Date().toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit", hour12: false,
      }) + " IST"
    );
    fmt(); const id = setInterval(fmt, 1000); return () => clearInterval(id);
  }, []);
  return <span style={{ fontFamily: "'Geist Mono', monospace" }}>{time}</span>;
}

/* ── icon box ────────────────────────────────────────────── */
function IB({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: 7,
      background: "#111113", border: "1px solid #27272a",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#71717a", flexShrink: 0,
    }}>{children}</div>
  );
}

/* ── SVG icons ───────────────────────────────────────────── */
const ICONS = {
  code:     <IB><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg></IB>,
  pin:      <IB><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></IB>,
  phone:    <IB><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></IB>,
  mail:     <IB><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></IB>,
  link:     <IB><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></IB>,
  clock:    <IB><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></IB>,
  person:   <IB><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg></IB>,
  file:     <IB><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg></IB>,
};

/* ── LEFT col: AI title, location, phone, resume ────────── */
const LEFT_ROWS = [
  { icon: ICONS.code,  label: "AI Software Engineer",   href: null },
  { icon: ICONS.pin,   label: "Noida, India",            href: "https://maps.google.com/?q=Greater+Noida+India" },
  { icon: ICONS.phone, label: "+91 7859096326",          href: "tel:+917859096326" },
  { icon: ICONS.file,  label: "Resume",                  href: "/resume.pdf" },
];

/* ── RIGHT col: mail, website, time, he/him ─────────────── */
const RIGHT_ROWS = [
  { icon: ICONS.mail,   label: "ithakur2327@gmail.com", href: "mailto:ithakur2327@gmail.com" },
  { icon: ICONS.link,   label: "indreshthakur.dev",     href: "https://indreshthakur.dev" },
  { icon: ICONS.clock,  label: <LiveTime />,             href: null },
  { icon: ICONS.person, label: "he/him",                 href: null },
];

/* ── social tiles — GitHub, LinkedIn, X ─────────────────── */
const SOCIAL = [
  {
    label: "GitHub", href: "https://github.com/IndreshThakur",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
    bg: "#18181b", border: "1px solid #27272a", color: "#fafafa",
  },
  {
    label: "LinkedIn", href: "https://linkedin.com/in/indresh-thakur",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>,
    bg: "#0A66C2", border: "none", color: "#fff",
  },
  {
    label: "X", href: "https://x.com/indresh_dev",
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.255 5.623zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
    bg: "#18181b", border: "1px solid #27272a", color: "#fafafa",
  },
];

/* ════════════════════════════════════════════════════════════ */
const BG = "#09090b";
const BD = "1px solid #27272a";

const cellStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12,
  padding: "13px 16px",
  background: BG, color: "#a1a1aa",
  fontSize: 13, fontFamily: "'Geist Mono', monospace",
  textDecoration: "none",
  transition: "background 0.12s, color 0.12s",
};
const hi = (e: React.MouseEvent) => {
  (e.currentTarget as HTMLElement).style.background = "#111113";
  (e.currentTarget as HTMLElement).style.color = "#e4e4e7";
};
const ho = (e: React.MouseEvent) => {
  (e.currentTarget as HTMLElement).style.background = BG;
  (e.currentTarget as HTMLElement).style.color = "#a1a1aa";
};

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [lit, setLit]         = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  return (
    <div
      id="about"
      style={{
        marginTop: 52,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(14px)",
        transition: "opacity 0.6s var(--expo-out), transform 0.6s var(--expo-out)",
      }}
    >
      {/* ══ BLOCK 1: Avatar + Name ══════════════════════════════ */}
      <div style={{ background: BG, border: BD, borderBottom: "none" }}>
        <div style={{ display: "flex", alignItems: "stretch" }}>

          {/* Avatar */}
          <div style={{
            borderRight: BD, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px 20px",
          }}>
            <div
              className={`avatar-wrap ${lit ? "lit" : ""}`}
              onMouseEnter={() => setLit(true)}
              onMouseLeave={() => setLit(false)}
              style={{ position: "relative", width: 120, height: 120 }}
            >
              <div className="avatar-lights-off" style={{
                width: 120, height: 120, borderRadius: "50%",
                background: "linear-gradient(135deg, #27272a 0%, #52525b 100%)",
                border: "2px solid #3f3f46",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 800, color: "#fafafa",
                fontFamily: "'Geist Mono', monospace",
                transition: "box-shadow 0.3s, opacity 0.3s",
                boxShadow: lit ? "0 0 40px rgba(251,191,36,0.35)" : "none",
              }}>IT</div>
              <div className="avatar-lights-on" style={{
                width: 120, height: 120, borderRadius: "50%",
                background: "linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)",
                border: "2px solid #fbbf24",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 28, fontWeight: 800, color: "#1c1917",
                fontFamily: "'Geist Mono', monospace",
              }}>IT</div>
              <span className="pulse" style={{
                position: "absolute", bottom: 5, right: 5,
                width: 14, height: 14, borderRadius: "50%",
                background: "#22c55e", border: "2.5px solid #09090b",
              }} />
            </div>
          </div>

          {/* Name + flip column */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", minWidth: 0 }}>
            {/* Name */}
            <div style={{ padding: "18px 20px 10px" }}>
              <h1 style={{
                fontSize: 30, fontWeight: 700, letterSpacing: "-0.04em",
                color: "#fafafa", lineHeight: 1.15, margin: 0,
                fontFamily: "'Geist', sans-serif",
              }}>
                Indresh Thakur
              </h1>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: BD.split(" ")[2], margin: "0 20px" }} />

            {/* Flip subtitles */}
            <div style={{ padding: "10px 20px 18px", fontFamily: "'Geist Mono', monospace" }}>
              <FlipSentences />
            </div>
          </div>
        </div>
      </div>

      {/* ══ GAP — dot bg visible ════════════════════════════════ */}
      <div style={{ height: 16, background: "transparent" }} />

      {/* ══ BLOCK 2: Info grid (no partition lines) + Social ═══ */}
      <div style={{ background: BG, border: BD }}>

        {/* 2-column info grid — no dividers between rows */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>

          {LEFT_ROWS.map((item, i) => {
            const right = RIGHT_ROWS[i];
            return (
              <React.Fragment key={i}>
                {/* Left cell */}
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : "_blank"}
                    rel="noreferrer"
                    style={{ ...cellStyle, borderRight: BD }}
                    onMouseEnter={hi} onMouseLeave={ho}
                  >
                    {item.icon}<span>{item.label}</span>
                  </a>
                ) : (
                  <div style={{ ...cellStyle, borderRight: BD, cursor: "default" }}>
                    {item.icon}<span>{item.label}</span>
                  </div>
                )}

                {/* Right cell */}
                {right.href ? (
                  <a
                    href={right.href}
                    target={right.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    style={{ ...cellStyle }}
                    onMouseEnter={hi} onMouseLeave={ho}
                  >
                    {right.icon}<span>{right.label}</span>
                  </a>
                ) : (
                  <div style={{ ...cellStyle, cursor: "default" }}>
                    {right.icon}<span>{right.label}</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Social tiles — GitHub, LinkedIn, X */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: BD }}>
          {SOCIAL.map((s, i) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "15px 16px",
                borderRight: i < SOCIAL.length - 1 ? BD : "none",
                background: BG, color: "#fafafa",
                transition: "background 0.15s",
                position: "relative", textDecoration: "none",
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "#111113"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = BG}
            >
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: s.bg, border: s.border,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: s.color, flexShrink: 0,
              }}>{s.icon}</div>
              <span style={{ fontWeight: 600, fontSize: 13.5, fontFamily: "'Geist', sans-serif" }}>{s.label}</span>
              <span style={{ position: "absolute", top: 12, right: 12, color: "#3f3f46" }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                </svg>
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
