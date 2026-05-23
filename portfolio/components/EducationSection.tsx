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
    icon: "🏆",
    color: "#3b82f6",
  },
  {
    title: "Principles of Generative AI",
    issuer: "Infosys Springboard",
    year: "2024",
    icon: "🤖",
    color: "#8b5cf6",
  },
];

const ACTIVITIES = [
  {
    title: "Web Development Intern",
    org: "Unstop",
    period: "Jun–Aug 2025",
    icon: "💼",
    type: "internship",
  },
  {
    title: "Open Source Contributor",
    org: "GSSOC Extended Edition",
    period: "2025",
    icon: "🌟",
    type: "activity",
  },
  {
    title: "Hackathon Participant",
    org: "Smart India Hackathon (SIH)",
    period: "2025",
    icon: "💡",
    type: "activity",
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
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>
                {cert.icon}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
                  {cert.title}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                  {cert.issuer} · {cert.year}
                </p>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: "var(--text-muted)", flexShrink: 0 }}>
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </div>
          ))}
        </div>
      </section>

      {/* Activities & Internship */}
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
                fontSize: 15, flexShrink: 0,
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