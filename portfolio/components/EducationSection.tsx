"use client";
import { useReveal } from "./useReveal";

const EDUCATION = [
  {
    school: "Noida Institute of Engineering and Technology",
    short: "NIET, Greater Noida",
    degree: "B.Tech — Computer Science & Engineering (AI)",
    period: "Aug 2023 — Present",
    detail: "CGPA: 7.5 / 10",
    icon: "🎓",
  },
  {
    school: "L.N.J School",
    short: "Madhubani, Bihar",
    degree: "Class XII — BSEB",
    period: "2021",
    detail: "70%",
    icon: "📚",
  },
];

const CERTIFICATIONS = [
  {
    title: "MERN Stack Development",
    issuer: "Coursera",
    year: "2024",
    color: "#3b82f6",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  {
    title: "Principles of Generative AI",
    issuer: "Infosys Springboard",
    year: "2024",
    color: "#8b5cf6",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },
];

const ACTIVITIES = [
  {
    title: "Web Development Intern",
    org: "Unstop",
    period: "Jun–Aug 2025",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
  },
  {
    title: "Open Source Contributor",
    org: "GSSOC Extended Edition",
    period: "2025",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    title: "Hackathon Participant",
    org: "Smart India Hackathon (SIH)",
    period: "2025",
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
      </svg>
    ),
  },
];

export function EducationSection() {
  const { ref, visible } = useReveal();
  const { ref: ref2, visible: vis2 } = useReveal();
  const { ref: ref3, visible: vis3 } = useReveal();

  return (
    <>
      {/* Education */}
      <div className="section-separator" />
      <section
        id="education"
        ref={ref}
        style={{
          padding: "32px 0 40px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p className="section-label">Education</p>
        <div>
          {EDUCATION.map((edu, i) => (
            <div
              key={i}
              className="exp-card"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(10px)",
                transition: `opacity 0.45s var(--expo-out) ${0.1 * i}s, transform 0.45s var(--expo-out) ${0.1 * i}s`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    fontSize: 18, width: 32, height: 32, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--bg-hover)", border: "1px solid var(--border)",
                    borderRadius: 7, marginTop: 1,
                  }}>
                    {edu.icon}
                  </span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                      {edu.school}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{edu.degree}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3, fontFamily: "'Geist Mono', monospace" }}>
                      {edu.short}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'Geist Mono', monospace" }}>{edu.period}</p>
                  <span className="tag" style={{ marginTop: 6, display: "inline-block" }}>{edu.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Certifications */}
      <div className="section-separator" />
      <section
        ref={ref2}
        style={{
          padding: "32px 0 40px",
          opacity: vis2 ? 1 : 0,
          transform: vis2 ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p className="section-label">
          Certifications
          <span style={{
            fontFamily: "'Geist Mono', monospace", fontSize: 10,
            color: "var(--text-muted)", background: "var(--tag-bg)",
            border: "1px solid var(--tag-border)", padding: "1px 6px",
            borderRadius: 4, marginLeft: 8,
          }}>
            {CERTIFICATIONS.length}
          </span>
        </p>
        <div>
          {CERTIFICATIONS.map((cert, i) => (
            <div
              key={i}
              className="cert-card"
              style={{
                opacity: vis2 ? 1 : 0,
                transform: vis2 ? "none" : "translateY(10px)",
                transition: `opacity 0.45s var(--expo-out) ${0.1 * i}s, transform 0.45s var(--expo-out) ${0.1 * i}s`,
              }}
            >
              <div style={{
                width: 32, height: 32, borderRadius: 7, flexShrink: 0,
                background: `${cert.color}18`, border: `1px solid ${cert.color}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={cert.logo} width={18} height={18} style={{ objectFit: "contain" }} alt={cert.title} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                  {cert.title}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  @ {cert.issuer} · {cert.year}
                </p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* Activities */}
      <div className="section-separator" />
      <section
        ref={ref3}
        style={{
          padding: "32px 0 40px",
          opacity: vis3 ? 1 : 0,
          transform: vis3 ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p className="section-label">Activities &amp; Internship</p>
        <div>
          {ACTIVITIES.map((a, i) => (
            <div
              key={i}
              style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "12px 0",
                borderBottom: i < ACTIVITIES.length - 1 ? "1px solid var(--border)" : "none",
                opacity: vis3 ? 1 : 0,
                transform: vis3 ? "none" : "translateX(-8px)",
                transition: `opacity 0.4s var(--expo-out) ${0.1 * i}s, transform 0.4s var(--expo-out) ${0.1 * i}s`,
              }}
            >
              <span style={{
                width: 32, height: 32, borderRadius: 7,
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-secondary)", flexShrink: 0,
              }}>
                {a.icon}
              </span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                  {a.title}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{a.org}</p>
              </div>
              <span className="tag" style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace" }}>
                {a.period}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}