"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReveal } from "./useReveal";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

const EDUCATION = [
  {
    school: "Noida Institute of Engineering and Technology",
    short: "Greater Noida",
    degree: "B.Tech — Computer Science & Engineering (AI)",
    period: "Aug 2023 — Present",
  },
  {
    school: "L.N.J School",
    short: "Madhubani, Bihar",
    degree: "Class XII — BSEB",
    period: "",
  },
  {
    school: "U.M.S Madhubani",
    short: "Madhubani, Bihar",
    degree: "Class X — BSEB",
    period: "",
  },
];

const LANGUAGES = [
  { name: "HINDI" },
  { name: "ENGLISH" },
  { name: "MAITHILI" },
];

// ── Certifications — edit driveLink when you add the file to Drive ──
const CERTIFICATIONS = [
  {
    title: "MERN Stack Development",
    issuer: "Coursera",
    date: "2024",
    driveLink: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/1200px-Coursera-Logo_600x600.svg.png",
    logoBg: "#0056D2",
  },
  {
    title: "Principles of Generative AI",
    issuer: "Coursera",
    date: "2024",
    driveLink: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/1200px-Coursera-Logo_600x600.svg.png",
    logoBg: "#0056D2",
  },
  {
    title: "Web Development Bootcamp",
    issuer: "Udemy",
    date: "2024",
    driveLink: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/2560px-Udemy_logo.svg.png",
    logoBg: "#A435F0",
  },
  {
    title: "Data Structures & Algorithms",
    issuer: "GeeksforGeeks",
    date: "2024",
    driveLink: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/4/43/GeeksforGeeks.svg",
    logoBg: "#2F8D46",
  },
  {
    title: "Machine Learning & Deep Learning",
    issuer: "Coursera",
    date: "2025",
    driveLink: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Coursera-Logo_600x600.svg/1200px-Coursera-Logo_600x600.svg.png",
    logoBg: "#0056D2",
  },
  {
    title: "Cloud Computing Fundamentals",
    issuer: "Google Cloud",
    date: "2025",
    driveLink: "",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Google_Cloud_logo.svg/2560px-Google_Cloud_logo.svg.png",
    logoBg: "#FFFFFF",
  },
];

function EduIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}

function CertIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/>
      <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  );
}


/* ── Language pill with skill-section-style highlight animation ── */
function LangPill({ name, delay }: { name: string; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <motion.span
      ref={ref}
      className="lang-pill-item"
      initial={false}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.82, y: 8 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1], delay: inView ? delay : 0 }}
    >
      <span className="lang-pill-dot" />
      {name}
    </motion.span>
  );
}

/* ── Education card with 3D entrance ── */
function EduCard({ school, degree, short, period, index, sectionVisible }: {
  school: string; degree: string; short: string; period: string; index: number; sectionVisible: boolean;
}) {
  return (
    <motion.div
      className="edu-card"
      initial={false}
      animate={sectionVisible ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 22, rotateX: 8 }}
      transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1], delay: sectionVisible ? index * 0.1 : 0 }}
    >
      {/* left graduation icon */}
      <div className="edu-card-icon">
        <EduIcon />
      </div>
      {/* vertical connecting line (hidden for last) */}
      {index < EDUCATION.length - 1 && <div className="edu-card-line" />}
      <div className="edu-card-body">
        <div className="edu-card-top">
          <div>
            <p className="edu-card-school">{school}</p>
            <p className="edu-card-degree">{degree}</p>
            <p className="edu-card-loc">{short}</p>
          </div>
          <span className="edu-card-period">{period}</span>
        </div>
      </div>
    </motion.div>
  );
}

export function EducationSection() {
  const { ref, revealClass, visible } = useReveal();
  const { ref: ref2, revealClass: revealClass2, visible: vis2 } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        /* ── shared section wrapper (same as Skills / Projects) ── */
        .edu-outer {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .edu-inner {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 32px 40px;
        }

        /* ── section head – bold label + icon exactly like Projects/Skills ── */
        .edu-sec-titlerow {
          padding-top: 28px;
          margin-bottom: 20px;
        }
        .edu-sec-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
          font-family: ${SF};
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .edu-sec-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.18);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .edu-sec-icon:hover {
          box-shadow: 0 2px 8px rgba(0,0,0,0.28);
          border-color: var(--text-muted);
        }
        .edu-sec-divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 22px;
        }

        /* ── edu cards – screenshot style, no line between them ── */
        .edu-card {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 0 16px;
          perspective: 600px;
        }
        .edu-card-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          flex-shrink: 0;
          position: relative;
          z-index: 1;
          box-shadow: 0 1px 3px rgba(0,0,0,0.14);
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .edu-card:hover .edu-card-icon {
          box-shadow: 0 3px 10px rgba(0,0,0,0.22);
          transform: translateY(-1px);
        }
        .edu-card-line {
          position: absolute;
          left: 16px;
          top: 50px;
          bottom: -16px;
          width: 2px;
          background: linear-gradient(to bottom, var(--border), transparent);
          z-index: 0;
        }
        .edu-card-body { flex: 1; min-width: 0; }
        .edu-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .edu-card-school {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.025em;
          font-family: ${SF};
          line-height: 1.2;
        }
        .edu-card-degree {
          font-size: 12.5px;
          color: var(--text-secondary);
          margin-top: 3px;
          font-family: ${SF};
        }
        .edu-card-loc {
          font-size: 11.5px;
          color: var(--text-muted);
          margin-top: 4px;
          font-family: ${MONO};
        }
        .edu-card-period {
          font-size: 11px;
          color: var(--text-muted);
          font-family: ${MONO};
          white-space: nowrap;
          flex-shrink: 0;
          padding-top: 2px;
        }

        /* ── language row — enhanced box layout ── */
        .lang-row {
          display: flex;
          align-items: center;
          gap: 0;
          flex-wrap: nowrap;
          width: fit-content;
          max-width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none;
          margin-top: 8px;
          padding: 14px 16px;
          border-top: 1px solid var(--border);
          border: 1px solid rgba(59,130,246,0.22);
          border-radius: 10px;
          background: rgba(59,130,246,0.04);
          box-shadow: 0 0 0 1px rgba(59,130,246,0.08) inset;
        }
        .lang-row::-webkit-scrollbar { display: none; }
        .lang-label-txt {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-primary);
          font-family: ${MONO};
          flex-shrink: 0;
        }
        .lang-dash {
          font-size: 13px;
          font-weight: 400;
          color: var(--text-muted);
          font-family: ${MONO};
          margin: 0 12px;
          flex-shrink: 0;
        }
        .lang-pills-wrap {
          display: flex;
          gap: 7px;
          align-items: center;
          flex-wrap: nowrap;
        }
        .lang-pill-item {
          display: inline-flex;
          align-items: center;
          gap: 0;
          padding: 5px 16px;
          border-radius: 7px;
          font-size: 12.5px;
          font-weight: 800;
          font-family: ${SF};
          letter-spacing: 0.06em;
          border: 1px solid rgba(59,130,246,0.35);
          color: #60a5fa;
          background: rgba(59,130,246,0.08);
          cursor: default;
          user-select: none;
          transition: transform 0.18s cubic-bezier(0.22,1,0.36,1), box-shadow 0.18s, background 0.18s;
        }
        .lang-pill-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(59,130,246,0.20);
          background: rgba(59,130,246,0.14);
        }
        html.light .lang-row {
          border-color: rgba(217,119,6,0.28);
          background: rgba(217,119,6,0.04);
          box-shadow: 0 0 0 1px rgba(217,119,6,0.08) inset;
        }
        html.light .lang-pill-item {
          color: #92400e;
          background: rgba(217,119,6,0.10);
          border-color: rgba(217,119,6,0.35);
        }
        html.light .lang-pill-item:hover {
          box-shadow: 0 4px 12px rgba(217,119,6,0.18);
          background: rgba(217,119,6,0.16);
        }
        .lang-pill-dot { display: none; }

        /* ── cert section ── */
        .cert-count-badge {
          font-family: ${MONO};
          font-size: 10px;
          color: var(--text-muted);
          background: var(--tag-bg);
          border: 1px solid var(--tag-border);
          padding: 1px 6px;
          border-radius: 4px;
          margin-left: 8px;
          vertical-align: middle;
        }

        /* ── New card grid ── */
        .cert-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 14px;
        }
        .cert-card {
          position: relative;
          display: flex;
          flex-direction: column;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          text-decoration: none;
          color: inherit;
          transition: border-color 0.2s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1), box-shadow 0.2s ease;
        }
        .cert-card:hover {
          border-color: rgba(99,102,241,0.45);
          transform: translateY(-3px);
          box-shadow: 0 8px 28px rgba(0,0,0,0.22);
        }
        /* Top banner — issuer logo */
        .cert-card-banner {
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          position: relative;
          overflow: hidden;
        }
        .cert-card-banner-bg {
          position: absolute; inset: 0;
          opacity: 0.12;
          transition: opacity 0.2s;
        }
        .cert-card:hover .cert-card-banner-bg { opacity: 0.18; }
        .cert-card-logo {
          height: 32px;
          max-width: 110px;
          object-fit: contain;
          position: relative; z-index: 1;
          filter: none;
        }
        /* Bottom content */
        .cert-card-body {
          padding: 13px 14px 14px;
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
        }
        .cert-card-title {
          font-size: 12.5px;
          font-weight: 700;
          color: var(--text-primary);
          font-family: ${SF};
          letter-spacing: -0.018em;
          line-height: 1.35;
        }
        .cert-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
          padding-top: 6px;
        }
        .cert-card-issuer {
          font-size: 10.5px;
          font-family: ${MONO};
          color: var(--text-muted);
          letter-spacing: 0.02em;
        }
        .cert-card-date {
          font-size: 10px;
          font-family: ${MONO};
          color: var(--text-muted);
          background: var(--bg-hover);
          border: 1px solid var(--border);
          border-radius: 4px;
          padding: 2px 6px;
        }
        /* Drive link badge */
        .cert-card-link-badge {
          position: absolute;
          top: 8px; right: 8px;
          width: 22px; height: 22px;
          border-radius: 6px;
          background: rgba(99,102,241,0.15);
          border: 1px solid rgba(99,102,241,0.30);
          display: flex; align-items: center; justify-content: center;
          opacity: 0;
          transition: opacity 0.18s ease;
          z-index: 2;
        }
        .cert-card:hover .cert-card-link-badge { opacity: 1; }

        @media (max-width: 860px) {
          .edu-inner { padding: 0 22px 34px; }
          .cert-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 640px) {
          .edu-inner { padding: 0 16px 28px; }
          .edu-card-top { flex-direction: column; gap: 4px; }
          .edu-card-period { margin-left: 0; }
          .edu-sec-title { font-size: 22px; }
          .cert-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }
        @media (max-width: 420px) {
          .cert-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* ═══ EDUCATION ═══ */}
      <section
        id="education"
        ref={ref}
        className={revealClass}
      >
        <div className="edu-outer">
          <div className="edu-inner">
            {/* Title row – exactly like Projects/Skills */}
            <div className="edu-sec-titlerow">
              <h2 className="edu-sec-title">
                <span className="edu-sec-icon"><EduIcon /></span>
                Education
              </h2>
            </div>

            <div className="edu-sec-divider" />

            {/* Cards */}
            {EDUCATION.map((edu, i) => (
              <EduCard
                key={i}
                {...edu}
                index={i}
                sectionVisible={visible}
              />
            ))}

            {/* Languages */}
            <div className="lang-row">
              <span className="lang-label-txt">Languages</span>
              <span className="lang-dash">—</span>
              <div className="lang-pills-wrap">
                {LANGUAGES.map((lang, i) => (
                  <LangPill key={i} name={lang.name} delay={0.18 + i * 0.08} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CERTIFICATIONS ═══ */}
      <section
        id="certifications"
        ref={ref2}
        className={revealClass2}
      >
        <div className="edu-outer">
          <div className="edu-inner">
            {/* Title row */}
            <div className="edu-sec-titlerow">
              <h2 className="edu-sec-title">
                <span className="edu-sec-icon"><CertIcon /></span>
                Certifications
                <span className="cert-count-badge">{CERTIFICATIONS.length}</span>
              </h2>
            </div>

            <div className="edu-sec-divider" />

            {/* Cert cards — 3 per row */}
            <div className="cert-grid">
              {CERTIFICATIONS.map((cert, i) => {
                const handleOpen = () => {
                  if (cert.driveLink) {
                    window.open(cert.driveLink, "_blank", "noopener,noreferrer");
                  }
                };
                return (
                  <motion.div
                    key={i}
                    className="cert-card"
                    role="button"
                    tabIndex={0}
                    onClick={handleOpen}
                    onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleOpen()}
                    initial={false}
                    animate={vis2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                    transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1], delay: vis2 ? i * 0.07 : 0 }}
                  >
                    {/* Drive link indicator */}
                    {cert.driveLink && (
                      <span className="cert-card-link-badge">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      </span>
                    )}

                    {/* Banner with real logo */}
                    <div className="cert-card-banner">
                      <div
                        className="cert-card-banner-bg"
                        style={{ background: cert.logoBg }}
                      />
                      <img
                        src={cert.logo}
                        alt={cert.issuer}
                        className="cert-card-logo"
                        loading="lazy"
                        draggable={false}
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </div>

                    {/* Content */}
                    <div className="cert-card-body">
                      <p className="cert-card-title">{cert.title}</p>
                      <div className="cert-card-meta">
                        <span className="cert-card-issuer">{cert.issuer}</span>
                        <span className="cert-card-date">{cert.date}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}