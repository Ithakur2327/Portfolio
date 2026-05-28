"use client";
import { useReveal } from "./useReveal";
import { useTheme } from "./ThemeProvider";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

const EDUCATION = [
  {
    school: "Noida Institute of Engineering and Technology",
    short: "NIET, Greater Noida",
    degree: "B.Tech — Computer Science & Engineering (AI)",
    period: "Aug 2023 — Present",
  },
  {
    school: "L.N.J School",
    short: "Madhubani, Bihar",
    degree: "Class XII — BSEB",
    period: "2021",
  },
  {
    school: "UMS Madhubani",
    short: "Madhubani, Bihar",
    degree: "Class X — BSEB",
    period: "2019",
  },
];

const LANGUAGES = [
  { name: "Hindi", native: true },
  { name: "English", native: false },
  { name: "Maithili", native: true },
];

const CERTIFICATIONS = [
  {
    title: "MERN Stack Development",
    issuer: "Coursera",
    date: "2024",
    link: "https://drive.google.com/",
  },
  {
    title: "Principles of Generative AI",
    issuer: "Infosys Springboard",
    date: "2024",
    link: "https://drive.google.com/",
  },
  {
    title: "Web Development Bootcamp",
    issuer: "Udemy",
    date: "2023",
    link: "https://drive.google.com/",
  },
  {
    title: "Data Structures & Algorithms",
    issuer: "GeeksforGeeks",
    date: "2023",
    link: "https://drive.google.com/",
  },
  {
    title: "Cloud Computing Fundamentals",
    issuer: "Google Cloud",
    date: "2024",
    link: "https://drive.google.com/",
  },
];

// Education icon SVG
function EduIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

// Cert icon SVG
function CertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}

// Arrow icon
function ArrowIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
    </svg>
  );
}

export function EducationSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { ref, visible } = useReveal();
  const { ref: ref2, visible: vis2 } = useReveal();

  return (
    <>
      <style>{`
        .edu-section-box {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .edu-section-inner {
          max-width: 1060px;
          margin: 0 auto;
          padding: 28px 32px 40px;
        }
        .edu-section-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 18px;
        }
        .edu-section-icon {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .edu-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
          padding: 14px 0;
          border-bottom: 1px solid var(--border);
        }
        .edu-row:last-child { border-bottom: none; }
        .edu-row-left {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .edu-dot {
          width: 7px; height: 7px;
          border-radius: 50%;
          background: var(--text-muted);
          margin-top: 6px;
          flex-shrink: 0;
        }
        .edu-school {
          font-size: 14px; font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          font-family: ${SF};
        }
        .edu-degree {
          font-size: 12.5px;
          color: var(--text-secondary);
          margin-top: 2px;
          font-family: ${SF};
        }
        .edu-location {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 3px;
          font-family: ${MONO};
        }
        .edu-period {
          font-size: 11px;
          color: var(--text-muted);
          font-family: ${MONO};
          white-space: nowrap;
          flex-shrink: 0;
          padding-top: 2px;
        }

        /* Languages row */
        .lang-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
        .lang-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--text-muted);
          font-family: ${MONO};
          margin-right: 4px;
        }
        .lang-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 10px 3px 8px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          font-family: ${SF};
          border: 1px solid;
          transition: transform 0.15s, opacity 0.15s;
          cursor: default;
        }
        .lang-pill:hover { transform: translateY(-1px); opacity: 0.85; }
        .lang-pill-gold {
          color: #d4a017;
          background: rgba(212,160,23,0.10);
          border-color: rgba(212,160,23,0.35);
        }
        html.light .lang-pill-gold {
          color: #b45309;
          background: rgba(180,83,9,0.09);
          border-color: rgba(180,83,9,0.30);
        }
        .lang-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
          opacity: 0.7;
        }

        /* Certifications box */
        .cert-section-box {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
          border-bottom: 1px solid var(--line);
        }
        .cert-section-inner {
          max-width: 1060px;
          margin: 0 auto;
          padding: 28px 32px 40px;
        }
        .cert-count {
          font-family: ${MONO};
          font-size: 10px;
          color: var(--text-muted);
          background: var(--tag-bg);
          border: 1px solid var(--tag-border);
          padding: 1px 6px;
          border-radius: 4px;
          margin-left: 8px;
        }
        .cert-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 13px 8px;
          margin: 0 -8px;
          border-radius: 7px;
          border-bottom: 1px solid var(--border);
          text-decoration: none;
          color: var(--text-primary);
          transition: background 0.12s;
          cursor: pointer;
        }
        .cert-item:last-child { border-bottom: none; }
        .cert-item:hover { background: var(--bg-hover); }
        .cert-item:hover .cert-arrow { opacity: 1; transform: translate(1px, -1px); }
        .cert-icon-wrap {
          width: 32px; height: 32px;
          border-radius: 7px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .cert-title {
          font-size: 13.5px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.01em;
          font-family: ${SF};
        }
        .cert-meta {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
          font-family: ${MONO};
        }
        .cert-arrow {
          color: var(--text-muted);
          flex-shrink: 0;
          opacity: 0.5;
          transition: opacity 0.15s, transform 0.15s;
          margin-left: auto;
        }

        @media (max-width: 860px) {
          .edu-section-inner, .cert-section-inner { padding: 22px 22px 34px; }
        }
        @media (max-width: 640px) {
          .edu-section-inner, .cert-section-inner { padding: 18px 16px 28px; }
          .edu-row { flex-direction: column; gap: 4px; }
          .edu-period { align-self: flex-start; padding-top: 0; margin-left: 19px; }
        }
      `}</style>

      {/* ── EDUCATION ── */}
      <div className="section-separator" />
      <section
        id="education"
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
        }}
      >
        <div className="edu-section-box">
          <div className="edu-section-inner">
            {/* Header */}
            <div className="edu-section-head">
              <div className="edu-section-icon">
                <EduIcon />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>
                Education
              </span>
            </div>

            {/* Education rows */}
            <div>
              {EDUCATION.map((edu, i) => (
                <div
                  key={i}
                  className="edu-row"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(10px)",
                    transition: `opacity 0.45s var(--expo-out) ${0.1 * i}s, transform 0.45s var(--expo-out) ${0.1 * i}s`,
                  }}
                >
                  <div className="edu-row-left">
                    <div className="edu-dot" />
                    <div>
                      <p className="edu-school">{edu.school}</p>
                      <p className="edu-degree">{edu.degree}</p>
                      <p className="edu-location">{edu.short}</p>
                    </div>
                  </div>
                  <span className="edu-period">{edu.period}</span>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div className="lang-row">
              <span className="lang-label">Languages</span>
              {LANGUAGES.map((lang, i) => (
                <span
                  key={i}
                  className="lang-pill lang-pill-gold"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.4s var(--expo-out) ${0.15 + 0.08 * i}s`,
                  }}
                >
                  <span className="lang-dot" />
                  {lang.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CERTIFICATIONS ── */}
      <div className="section-separator" />
      <section
        id="certifications"
        ref={ref2}
        style={{
          opacity: vis2 ? 1 : 0,
          transform: vis2 ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
        }}
      >
        <div className="cert-section-box">
          <div className="cert-section-inner">
            {/* Header */}
            <div className="edu-section-head">
              <div className="edu-section-icon">
                <CertIcon />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>
                Certifications
                <span className="cert-count">{CERTIFICATIONS.length}</span>
              </span>
            </div>

            {/* Certification items */}
            <div>
              {CERTIFICATIONS.map((cert, i) => (
                <a
                  key={i}
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="cert-item"
                  style={{
                    opacity: vis2 ? 1 : 0,
                    transform: vis2 ? "none" : "translateY(10px)",
                    transition: `opacity 0.45s var(--expo-out) ${0.08 * i}s, transform 0.45s var(--expo-out) ${0.08 * i}s`,
                  }}
                >
                  <div className="cert-icon-wrap">
                    <CertIcon />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="cert-title">{cert.title}</p>
                    <p className="cert-meta">@ {cert.issuer} · {cert.date}</p>
                  </div>
                  <span className="cert-arrow">
                    <ArrowIcon />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}