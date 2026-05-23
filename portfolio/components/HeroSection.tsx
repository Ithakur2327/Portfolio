"use client";
import { useEffect, useState, useRef } from "react";
import { ROLES } from "@/lib/data";

function LiveClock() {
  const fmt = () =>
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata",
    });
  const [t, setT] = useState(fmt);
  useEffect(() => {
    const id = setInterval(() => setT(fmt()), 30000);
    return () => clearInterval(id);
  }, []);
  return <>{t} IST</>;
}

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const [roleIdx, setRoleIdx] = useState(0);
  const [roleVis, setRoleVis] = useState(true);
  const [showLogo, setShowLogo] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setRoleVis(false);
      setTimeout(() => {
        setRoleIdx(i => (i + 1) % ROLES.length);
        setRoleVis(true);
      }, 320);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const fn = () => {
      if (!sectionRef.current) return;
      setShowLogo(sectionRef.current.getBoundingClientRect().bottom < 60);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Card mouse glow
  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <>
      <section
        id="about"
        ref={sectionRef}
        style={{
          maxWidth: 860, margin: "0 auto", padding: "88px 32px 0",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        {/* ── PROFILE BLOCK ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "200px 1fr",
          border: "1px solid var(--border)",
          borderRadius: "var(--r-xl) var(--r-xl) 0 0",
          overflow: "hidden",
          background: "var(--card)",
        }}>
          {/* Avatar col */}
          <div style={{
            borderRight: "1px solid var(--border)",
            display: "flex", alignItems: "flex-end", justifyContent: "center",
            padding: "32px 0 0",
            background: "rgba(255,255,255,0.015)",
            minHeight: 200,
          }}>
            <div style={{ position: "relative", width: 148, height: 148 }}>
              {/* Circle */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: "50%",
                background: "linear-gradient(145deg,#27272a 0%,#18181b 100%)",
                border: "2px solid var(--border-strong)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 38, fontWeight: 800, color: "var(--text-2)",
                letterSpacing: "-0.04em", fontFamily: "'DM Mono',monospace",
                boxShadow: "0 0 0 6px var(--bg), 0 0 40px rgba(96,165,250,0.08)",
                opacity: showLogo ? 0 : 1,
                transform: showLogo ? "scale(0.85)" : "scale(1)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}>IT</div>
              {/* Logo */}
              <div style={{
                position: "absolute", inset: 0, borderRadius: 20,
                background: "var(--text-1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 38, fontWeight: 900, color: "var(--bg)",
                letterSpacing: "-0.04em", fontFamily: "'DM Mono',monospace",
                boxShadow: "0 0 0 6px var(--bg), 0 0 40px rgba(255,255,255,0.1)",
                opacity: showLogo ? 1 : 0,
                transform: showLogo ? "scale(1)" : "scale(0.85)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}>IT</div>
            </div>
          </div>

          {/* Name/role col */}
          <div style={{ padding: "36px 32px 32px" }}>
            <p className="mono" style={{ fontSize: 10.5, color: "var(--text-3)", letterSpacing: "0.08em", marginBottom: 12 }}>
              text-3xl font-semibold tracking-tight
            </p>
            <h1 style={{
              fontSize: 36, fontWeight: 600, letterSpacing: "-0.04em",
              color: "var(--text-1)", lineHeight: 1.1, marginBottom: 14,
            }}>
              Indresh Thakur
            </h1>
            {/* Role cycle */}
            <div style={{ height: 22, overflow: "hidden", marginBottom: 20 }}>
              <p style={{
                fontSize: 14, color: "var(--text-2)", fontWeight: 400,
                opacity: roleVis ? 1 : 0,
                transform: roleVis ? "translateY(0)" : "translateY(-7px)",
                transition: "opacity 0.32s ease, transform 0.32s ease",
              }}>
                {ROLES[roleIdx]}
              </p>
            </div>
            {/* Available badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span className="pulse-dot" />
              <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>
                Available for internship & collaborations
              </span>
            </div>
          </div>
        </div>

        {/* ── INFO GRID ── */}
        <div style={{
          border: "1px solid var(--border)",
          borderTop: "none",
          background: "var(--card)",
        }}>
          {/* Row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
            <InfoCell icon={<CodeBracketIcon />} label="Role" value="AI Software Engineer" borderRight />
            <InfoCell icon={<ClockIcon />} label="Local time" value={<LiveClock />} />
          </div>
          {/* Row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
            <InfoCell icon={<PhoneIcon />} label="Phone" value="+91 78590 96326" href="tel:+917859096326" borderRight />
            <InfoCell icon={<MailIcon />} label="Email" value="ithakur2327@gmail.com" href="mailto:ithakur2327@gmail.com" />
          </div>
          {/* Row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid var(--border)" }}>
            <InfoCell icon={<PinIcon />} label="Location" value="Noida, India" href="https://maps.google.com/?q=Noida,India" borderRight />
            <InfoCell icon={<UserIcon />} label="Pronouns" value="he/him" />
          </div>
          {/* Resume row */}
          <div>
            <button
              onClick={() => setResumeOpen(true)}
              style={{ width: "100%", background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}
            >
              <InfoCellRaw>
                <span style={{ color: "var(--text-3)", flexShrink: 0 }}><FileIcon /></span>
                <span style={{ fontSize: 13.5, color: "var(--text-2)" }}>Resume</span>
                <span style={{
                  marginLeft: "auto", fontSize: 11, color: "var(--accent)",
                  fontFamily: "'DM Mono',monospace", fontWeight: 500,
                }}>View / Download →</span>
              </InfoCellRaw>
            </button>
          </div>
        </div>

        {/* ── SOCIAL TILES ── */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
          border: "1px solid var(--border)",
          borderTop: "none",
          borderRadius: "0 0 var(--r-xl) var(--r-xl)",
          overflow: "hidden",
        }}>
          <SocialTile label="GitHub" sub="github.com/indresh149" href="https://github.com/indresh149" icon={<GithubIcon />} borderRight />
          <SocialTile label="LinkedIn" sub="indresh-thakur" href="https://linkedin.com/in/indresh-thakur" icon={<LinkedinIcon />} borderRight />
          <SocialTile label="X / Twitter" sub="@indresh_dev" href="https://x.com" icon={<XIcon />} />
        </div>
      </section>

      {/* Resume Modal */}
      {resumeOpen && (
        <div
          onClick={() => setResumeOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 300,
            background: "rgba(0,0,0,0.7)", backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "cdFadeIn 0.2s ease",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "var(--bg-2,#0f0f11)", border: "1px solid var(--border-strong)",
              borderRadius: "var(--r-xl)", padding: 32, maxWidth: 440, width: "90%",
              animation: "cdSlideUp 0.25s ease",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-1)" }}>Resume</p>
              <button onClick={() => setResumeOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-3)", padding: 4 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.03)", borderRadius: "var(--r-lg)",
              padding: 18, display: "flex", gap: 16, alignItems: "center",
              border: "1px solid var(--border)", marginBottom: 20,
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 10,
                background: "linear-gradient(135deg,#27272a,#3f3f46)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <FileIcon size={20} color="var(--text-2)" />
              </div>
              <div>
                <p style={{ fontSize: 13.5, fontWeight: 500, color: "var(--text-1)" }}>Indresh_Thakur_Resume.pdf</p>
                <p style={{ fontSize: 12, color: "var(--text-3)", marginTop: 3 }}>AI Software Engineer · Updated 2025</p>
              </div>
            </div>
            <a
              href="/resume.pdf" target="_blank" rel="noreferrer"
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", padding: "12px 0" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Resume
            </a>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cdFadeIn { from{opacity:0} to{opacity:1} }
        @keyframes cdSlideUp { from{opacity:0;transform:translateY(14px) scale(0.97)} to{opacity:1;transform:none} }
      `}</style>
    </>
  );
}

function InfoCell({ icon, label, value, href, borderRight }: {
  icon: React.ReactNode; label: string; value: React.ReactNode; href?: string; borderRight?: boolean;
}) {
  const style: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 10, padding: "13px 20px",
    borderRight: borderRight ? "1px solid var(--border)" : undefined,
    color: "var(--text-2)", fontSize: 13.5, textDecoration: "none",
    transition: "background 0.15s, color 0.15s",
    minWidth: 0,
  };
  const content = (
    <>
      <span style={{ color: "var(--text-3)", flexShrink: 0 }}>{icon}</span>
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</span>
    </>
  );
  if (href) return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" style={style}
      onMouseEnter={e => { Object.assign((e.currentTarget as HTMLElement).style, { background: "rgba(255,255,255,0.025)", color: "var(--text-1)" }); }}
      onMouseLeave={e => { Object.assign((e.currentTarget as HTMLElement).style, { background: "transparent", color: "var(--text-2)" }); }}
    >{content}</a>
  );
  return <div style={style}>{content}</div>;
}

function InfoCellRaw({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10, padding: "13px 20px",
      transition: "background 0.15s",
    }}
    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)"; }}
    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >{children}</div>
  );
}

function SocialTile({ label, sub, href, icon, borderRight }: {
  label: string; sub: string; href: string; icon: React.ReactNode; borderRight?: boolean;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{
        display: "flex", alignItems: "center", gap: 12, padding: "18px 22px",
        borderRight: borderRight ? "1px solid var(--border)" : undefined,
        color: "var(--text-2)", textDecoration: "none", transition: "all 0.15s",
      }}
      onMouseEnter={e => { Object.assign((e.currentTarget as HTMLElement).style, { background: "rgba(255,255,255,0.025)", color: "var(--text-1)" }); }}
      onMouseLeave={e => { Object.assign((e.currentTarget as HTMLElement).style, { background: "transparent", color: "var(--text-2)" }); }}
    >
      <span style={{
        width: 32, height: 32, borderRadius: 8,
        background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
      }}>{icon}</span>
      <div style={{ overflow: "hidden" }}>
        <p style={{ fontSize: 13.5, fontWeight: 600, color: "inherit" }}>{label}</p>
        <p className="mono" style={{ fontSize: 11, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub}</p>
      </div>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: "auto", opacity: 0.4, flexShrink: 0 }}>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
        <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
      </svg>
    </a>
  );
}

/* ── Icons ── */
const CodeBracketIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>;
const ClockIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const PhoneIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.65 3.56 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6.29 6.29l.96-.86a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
const MailIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const PinIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const UserIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg>;
function FileIcon({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
}
const GithubIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>;
const LinkedinIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>;
const XIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;