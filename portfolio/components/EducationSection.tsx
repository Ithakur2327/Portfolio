"use client";
import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useReveal } from "./useReveal";
import { SectionIcon, SectionTitleIcon } from "./SectionIcon";
import { mq } from "@/lib/breakpoints";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

const EDUCATION = [
  {
    school: "Noida Institute of Engineering and Technology",
    short: "Greater Noida",
    degree: "B.Tech — Computer Science & Engineering (AI)",
    period: "",
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
];

/* Language chip */
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

/* Education card */
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

  return (
    <>
      <style suppressHydrationWarning>{`
        /* Shared section wrapper */
        .edu-outer {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
        }
        .edu-inner {
          max-width: var(--content-width);
          margin: 0 auto;
          padding: 0 20px 64px;
        }

        /* Section header */
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

        /* Education cards */
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

        /* Language row */
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
          border: 1px solid rgba(10,186,181,0.28);
          border-radius: 10px;
          background: rgba(10,186,181,0.05);
          box-shadow: 0 0 0 1px rgba(10,186,181,0.08) inset;
        }
        .lang-row::-webkit-scrollbar { display: none; }
        .lang-label-txt {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-primary);
          font-family: ${SF};
          flex-shrink: 0;
        }
        .lang-dash {
          font-size: 13px;
          font-weight: 400;
          color: var(--text-muted);
          font-family: ${SF};
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
          font-weight: 600;
          font-family: ${SF};
          letter-spacing: 0.06em;
          border: 1px dashed rgba(10,186,181,0.45);
          color: #2dd4c8;
          background: rgba(10,186,181,0.08);
          cursor: default;
          user-select: none;
        }
        html.light .lang-pill-item {
          color: #0f766e;
          background: rgba(10,186,181,0.10);
          border-color: rgba(10,186,181,0.45);
        }
        .lang-pill-dot { display: none; }

        /* Responsive tweaks */
        ${mq.navCollapse} {
          .edu-inner { padding: 0 22px 34px; }
        }
        ${mq.mobile} {
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
    </>
  );
}