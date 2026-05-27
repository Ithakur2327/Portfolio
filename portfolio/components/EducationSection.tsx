"use client";
import { useReveal } from "./useReveal";

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CERTIFICATIONS = [
  {
    title: "MERN Stack Development",
    issuer: "Coursera",
    year: "2024",
    color: "#3b82f6",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    href: "#",
  },
  {
    title: "Principles of Generative AI",
    issuer: "Infosys Springboard",
    year: "2024",
    color: "#8b5cf6",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    href: "#",
  },
];

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

const LANGUAGES = [
  { name: "Hindi", level: "Native", pct: 100, color: "#f97316" },
  { name: "English", level: "Professional", pct: 85, color: "#3b82f6" },
  { name: "Maithili", level: "Native", pct: 100, color: "#22c55e" },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export function EducationSection() {
  const { ref: refCert, visible: visCert }   = useReveal();
  const { ref: refEdu,  visible: visEdu }    = useReveal();
  const { ref: refLang, visible: visLang }   = useReveal();

  return (
    <>
      {/* ── CERTIFICATIONS ─────────────────────────── */}
      <div className="section-separator" />
      <section
        id="certifications"
        ref={refCert}
        style={{
          padding: "32px 0 40px",
          opacity: visCert ? 1 : 0,
          transform: visCert ? "none" : "translateY(14px)",
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
            <a
              key={i}
              href={cert.href}
              target="_blank"
              rel="noreferrer"
              className="cert-card"
              style={{
                opacity: visCert ? 1 : 0,
                transform: visCert ? "none" : "translateY(10px)",
                transition: `opacity 0.45s var(--expo-out) ${0.1 * i}s, transform 0.45s var(--expo-out) ${0.1 * i}s`,
                textDecoration: "none",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 8px",
                margin: "0 -8px",
                borderRadius: 7,
                cursor: "pointer",
                borderBottom: i < CERTIFICATIONS.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              {/* Logo badge */}
              <div style={{
                width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                background: `${cert.color}18`, border: `1.5px solid ${cert.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <img src={cert.logo} width={20} height={20} style={{ objectFit: "contain" }} alt={cert.title} />
              </div>

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                  {cert.title}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>
                  {cert.issuer}
                  <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
                  <span style={{ fontFamily: "'Geist Mono', monospace" }}>{cert.year}</span>
                </p>
              </div>

              {/* Arrow */}
              <svg
                width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5"
                style={{ color: "var(--text-muted)", flexShrink: 0, marginTop: 4 }}
              >
                <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
              </svg>
            </a>
          ))}
        </div>
      </section>

      {/* ── EDUCATION ──────────────────────────────── */}
      <div className="section-separator" />
      <section
        id="education"
        ref={refEdu}
        style={{
          padding: "32px 0 40px",
          opacity: visEdu ? 1 : 0,
          transform: visEdu ? "none" : "translateY(14px)",
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
                opacity: visEdu ? 1 : 0,
                transform: visEdu ? "none" : "translateY(10px)",
                transition: `opacity 0.45s var(--expo-out) ${0.1 * i}s, transform 0.45s var(--expo-out) ${0.1 * i}s`,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                {/* Left: icon + text */}
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    fontSize: 18, width: 34, height: 34, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: "var(--bg-hover)", border: "1px solid var(--border)",
                    borderRadius: 8, marginTop: 1,
                  }}>
                    {edu.icon}
                  </span>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                      {edu.school}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{edu.degree}</p>
                    <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3, fontFamily: "'Geist Mono', monospace" }}>
                      {edu.short}
                    </p>
                  </div>
                </div>

                {/* Right: period + grade */}
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "'Geist Mono', monospace" }}>{edu.period}</p>
                  <span className="tag" style={{ marginTop: 6, display: "inline-block" }}>{edu.detail}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── LANGUAGES ──────────────────────────────── */}
      <div className="section-separator" />
      <section
        ref={refLang}
        style={{
          padding: "32px 0 40px",
          opacity: visLang ? 1 : 0,
          transform: visLang ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p className="section-label">Languages</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {LANGUAGES.map((lang, i) => (
            <div
              key={i}
              style={{
                opacity: visLang ? 1 : 0,
                transform: visLang ? "none" : "translateX(-8px)",
                transition: `opacity 0.45s var(--expo-out) ${0.1 * i}s, transform 0.45s var(--expo-out) ${0.1 * i}s`,
              }}
            >
              {/* Header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {/* Color dot */}
                  <span style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: lang.color, flexShrink: 0,
                    boxShadow: `0 0 6px ${lang.color}80`,
                  }} />
                  <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                    {lang.name}
                  </span>
                </div>
                <span style={{
                  fontSize: 11, color: "var(--text-muted)",
                  fontFamily: "'Geist Mono', monospace",
                  background: "var(--tag-bg)", border: "1px solid var(--tag-border)",
                  padding: "2px 8px", borderRadius: 4,
                }}>
                  {lang.level}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{
                height: 3, borderRadius: 99,
                background: "var(--border)",
                overflow: "hidden",
              }}>
                <div style={{
                  height: "100%",
                  width: visLang ? `${lang.pct}%` : "0%",
                  background: lang.color,
                  borderRadius: 99,
                  transition: `width 0.9s cubic-bezier(0.16,1,0.3,1) ${0.2 + 0.12 * i}s`,
                  boxShadow: `0 0 8px ${lang.color}60`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}