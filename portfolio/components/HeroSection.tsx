"use client";
import { useEffect, useState, useRef } from "react";

const ROLES = ["AI Software Engineer", "Open Source Contributor", "Code · Create · Innovate"];

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => { setTimeout(() => setVisible(true), 60); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => { setRoleIdx(i => (i + 1) % ROLES.length); setRoleVisible(true); }, 320);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => {
      if (!heroRef.current) return;
      setShowLogo(heroRef.current.getBoundingClientRect().bottom < 60);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <section
        id="about"
        ref={heroRef}
        style={{
          maxWidth: 860, margin: "0 auto", padding: "80px 32px 0",
          opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        {/* ── TOP: Photo left | Name+Role right ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "220px 1fr",
          borderBottom: "1px solid var(--border)",
        }}>
          {/* LEFT — Avatar */}
          <div style={{
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: "0 0 0 0", borderRight: "1px solid var(--border)",
            paddingBottom: 0,
          }}>
            <div style={{ position: "relative", width: 160, height: 160 }}>
              {/* Circle photo */}
              <div style={{
                width: 160, height: 160, borderRadius: "50%",
                background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%)",
                border: "3px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em",
                position: "absolute", top: 0, left: 0,
                opacity: showLogo ? 0 : 1, transform: showLogo ? "scale(0.88)" : "scale(1)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                boxShadow: "0 0 0 5px var(--bg), 0 0 0 6px var(--border)",
              }}>IT</div>
              {/* Square logo */}
              <div style={{
                width: 160, height: 160, borderRadius: 20,
                background: "var(--text-primary)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 42, fontWeight: 900, color: "var(--bg)", letterSpacing: "-0.04em",
                position: "absolute", top: 0, left: 0,
                opacity: showLogo ? 1 : 0, transform: showLogo ? "scale(1)" : "scale(0.88)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
                boxShadow: "0 0 0 5px var(--bg), 0 0 0 6px var(--border)",
              }}>IT</div>
            </div>
          </div>

          {/* RIGHT — Name + role */}
          <div style={{ padding: "32px 0 28px 32px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            {/* small label like reference */}
            <p style={{ fontSize: 11, color: "var(--text-muted)", letterSpacing: "0.06em", marginBottom: 8, fontFamily: "monospace" }}>
              text-3xl font-semibold
            </p>
            <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em", color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 10 }}>
              Indresh Thakur
            </h1>
            {/* Animated role */}
            <div style={{ height: 20, overflow: "hidden", marginBottom: 0 }}>
              <p style={{
                fontSize: 13.5, color: "var(--text-secondary)", fontWeight: 400,
                opacity: roleVisible ? 1 : 0, transform: roleVisible ? "translateY(0)" : "translateY(-6px)",
                transition: "opacity 0.32s ease, transform 0.32s ease",
              }}>{ROLES[roleIdx]}</p>
            </div>
          </div>
        </div>

        {/* ── MIDDLE: Info grid ── */}
        <div style={{ borderBottom: "1px solid var(--border)" }}>
          {/* Row 1 — role | clock */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
            <InfoCell icon={<CodeIcon />} text="AI Software Engineer" borderRight />
            <InfoCell icon={<ClockIcon />} text={<LiveClock />} />
          </div>
          {/* Row 2 — phone | email */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
            <InfoCell icon={<PhoneIcon />} text="+91 78590 96326" href="tel:+917859096326" borderRight />
            <InfoCell icon={<MailIcon />} text="ithakur2327@gmail.com" href="mailto:ithakur2327@gmail.com" />
          </div>
          {/* Row 3 — location | he/him */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
            <InfoCell icon={<PinIcon />} text="Noida, India" href="https://maps.google.com/?q=Noida,India" borderRight />
            <InfoCell icon={<UserIcon />} text="he/him" />
          </div>
          {/* Row 4 — resume full width */}
          <div>
            <button
              onClick={() => setResumeOpen(true)}
              style={{ width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left", padding: 0 }}
            >
              <InfoCell icon={<FileIcon />} text={<span style={{ color: "var(--link)" }}>View / Download Resume ↓</span>} />
            </button>
          </div>
        </div>

        {/* ── BOTTOM: Social tiles ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid var(--border)" }}>
          <SocialTile label="GitHub" href="https://github.com/indresh149" icon={<GithubIcon />} borderRight />
          <SocialTile label="LinkedIn" href="https://linkedin.com/in/indresh-thakur" icon={<LinkedinIcon />} borderRight />
          <SocialTile label="X" href="https://x.com" icon={<XIcon />} />
        </div>
      </section>

      {/* Resume Modal */}
      {resumeOpen && (
        <div
          onClick={() => setResumeOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 200,
            background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "cdFadeIn 0.2s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--bg-secondary)", border: "1px solid var(--border)",
              borderRadius: 18, padding: 32, maxWidth: 460, width: "90%",
              animation: "cdSlideUp 0.25s ease",
              boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>Resume</h3>
              <button onClick={() => setResumeOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{
              background: "var(--bg-hover)", borderRadius: 10, padding: 18,
              display: "flex", alignItems: "center", gap: 14, marginBottom: 20,
              border: "1px solid var(--border)",
            }}>
              <div style={{ width: 44, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>Indresh Thakur — Resume</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>AI Software Engineer · PDF</p>
              </div>
            </div>
            <a href="/resume.pdf" target="_blank" rel="noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%", padding: "11px 0",
                background: "var(--text-primary)", color: "var(--bg)",
                borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                transition: "opacity 0.15s", textDecoration: "none",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.82"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Resume
            </a>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ── */

function InfoCell({ icon, text, href, borderRight }: {
  icon: React.ReactNode; text: React.ReactNode; href?: string; borderRight?: boolean;
}) {
  const style: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 10,
    padding: "14px 20px", fontSize: 13.5, color: "var(--text-secondary)",
    borderRight: borderRight ? "1px solid var(--border)" : undefined,
    transition: "color 0.15s, background 0.15s",
    textDecoration: "none",
  };
  const content = (
    <>
      <span style={{ color: "var(--text-muted)", flexShrink: 0 }}>{icon}</span>
      <span>{text}</span>
    </>
  );
  if (href) return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={style}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
    >{content}</a>
  );
  return <div style={style}>{content}</div>;
}

function SocialTile({ label, href, icon, borderRight }: {
  label: string; href: string; icon: React.ReactNode; borderRight?: boolean;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "20px 24px",
        color: "var(--text-primary)", textDecoration: "none",
        borderRight: borderRight ? "1px solid var(--border)" : undefined,
        transition: "background 0.15s",
      }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      <span style={{
        width: 36, height: 36, borderRadius: 8, background: "var(--bg-hover)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{icon}</span>
      <span style={{ fontSize: 15, fontWeight: 600 }}>{label}</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto", opacity: 0.4 }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  );
}

function LiveClock() {
  const fmt = () => new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" });
  const [t, setT] = useState(fmt);
  useEffect(() => { const id = setInterval(() => setT(fmt()), 30000); return () => clearInterval(id); }, []);
  return <>{t} IST</>;
}

/* ── Icons ── */
const CodeIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const ClockIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PhoneIcon   = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.56 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MailIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PinIcon     = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const UserIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>;
const FileIcon    = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
const GithubIcon  = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>;
const LinkedinIcon= () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const XIcon       = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;