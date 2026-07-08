"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReveal } from "./useReveal";
import { DotDivider } from "./DotBackground";
import { SectionIcon, SectionTitleIcon } from "./SectionIcon";
import { usePdfModal } from "./PdfViewerModal";
import { slugify } from "@/lib/utils";

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

// Each cert's PDF is auto-matched from its title:
// "MERN Stack Development" -> /public/certificates/mern-stack-development.pdf
// Just drop your PDFs into public/certificates/ using the slugified title as the filename.
const CERTIFICATIONS = [
  {
    title: "MERN Stack Development",
    issuer: "Coursera",
    date: "2024",
    logo: "https://cdn.simpleicons.org/coursera/2A73CC",
    stack: [],
  },
  {
    title: "Data Structures & Algorithms",
    issuer: "GeeksforGeeks",
    date: "2024",
    logo: "https://cdn.simpleicons.org/geeksforgeeks/2F8D46",
    stack: [],
  },
  {
    title: "Principles of Generative AI",
    issuer: "Coursera",
    date: "2025",
    logo: "https://cdn.simpleicons.org/coursera/2A73CC",
    stack: [],
  },
  {
    title: "Cloud Computing Fundamentals",
    issuer: "Google Cloud",
    date: "2025",
    logo: "https://cdn.simpleicons.org/googlecloud/4285F4",
    stack: [],
  },
  {
    title: "Networking",
    issuer: "Cisco",
    date: "2026",
    logo: "https://cdn.simpleicons.org/cisco/1BA0D7",
    stack: [],
  },
];



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
      {/* left graduation-cap icon — used for both college and school entries */}
      <div className="edu-card-icon">
        <SectionIcon type="cap" size={15} strokeWidth={2} />
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
  const { openPdf } = usePdfModal();

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
        }
        .edu-inner {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 32px 64px;
        }

        /* ── section head – bold label + icon exactly like Projects/Skills ── */
        .edu-sec-titlerow {
          padding-top: 50px;
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
        .cert-logo-img {
          width: 17px; height: 17px; object-fit: contain;
        }
        .cert-item-2 {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 28px 0;
        }
        .cert-item-2:hover .edu-card-icon {
          box-shadow: 0 3px 10px rgba(0,0,0,0.22);
          transform: translateY(-1px);
        }
        .cert-item-2-line {
          position: absolute;
          left: 16px;
          top: 62px;
          bottom: -20px;
          width: 2px;
          background: linear-gradient(to bottom, var(--border), transparent);
          z-index: 0;
        }
        .cert-item-2-body { flex: 1; min-width: 0; }
        .cert-item-2-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }
        .cert-item-2-title {
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.025em;
          font-family: ${SF};
          line-height: 1.2;
        }
        .cert-item-2-issuer {
          font-size: 12.5px;
          color: var(--text-secondary);
          margin-top: 3px;
          font-family: ${SF};
        }
        .cert-item-2-date {
          font-size: 11px;
          color: var(--text-muted);
          font-family: ${MONO};
          white-space: nowrap;
          margin-left: 10px;
          font-weight: 400;
        }
        .cert-tags-row {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 10px;
        }
        .cert-tag-pill {
          font-family: ${MONO};
          font-size: 11px;
          font-weight: 500;
          color: var(--text-secondary);
          background: var(--tag-bg);
          border: 1px solid var(--tag-border);
          padding: 3px 9px;
          border-radius: 6px;
          white-space: nowrap;
          transition: color 0.15s, border-color 0.15s;
        }
        .cert-item-2:hover .cert-tag-pill {
          color: var(--text-primary);
          border-color: var(--text-muted);
        }

        /* ── responsive ── */
        @media (max-width: 860px) {
          .edu-inner { padding: 0 22px 34px; }
        }
        @media (max-width: 640px) {
          .edu-inner { padding: 0 16px 28px; }
          .edu-card-top { flex-direction: column; gap: 4px; }
          .edu-card-period { margin-left: 0; }
          .edu-sec-title { font-size: 22px; }
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
                <SectionTitleIcon type="institution" />
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

      <DotDivider />

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
                <SectionTitleIcon type="badge" />
                Certifications
                <span className="cert-count-badge">{CERTIFICATIONS.length}</span>
              </h2>
            </div>

            <div className="edu-sec-divider" />

            {/* Cert items — education-card layout: company icon, title, issuer/date */}
            {CERTIFICATIONS.map((cert, i) => {
              const pdfSrc = `/certificates/${slugify(cert.title)}.pdf`;
              return (
                <motion.div
                  key={i}
                  role="button"
                  tabIndex={0}
                  onClick={() => openPdf(pdfSrc, cert.title)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openPdf(pdfSrc, cert.title);
                    }
                  }}
                  className="cert-item-2"
                  initial={false}
                  animate={vis2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 14, rotateX: 6 }}
                  transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1], delay: vis2 ? i * 0.08 : 0 }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="edu-card-icon">
                    <img
                      className="cert-logo-img"
                      src={cert.logo}
                      alt={cert.issuer}
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                  {i < CERTIFICATIONS.length - 1 && <div className="cert-item-2-line" />}
                  <div className="cert-item-2-body">
                    <div className="cert-item-2-top">
                      <div>
                        <p className="cert-item-2-title">
                          {cert.title}
                          <span className="cert-item-2-date">{cert.date}</span>
                        </p>
                        <p className="cert-item-2-issuer">{cert.issuer}</p>
                      </div>
                    </div>
                    {cert.stack.length > 0 && (
                      <div className="cert-tags-row">
                        {cert.stack.map((tag, ti) => (
                          <span key={ti} className="cert-tag-pill">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}