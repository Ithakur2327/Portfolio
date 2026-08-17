"use client";
import { useRef } from "react";
import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import { useReveal } from "./useReveal";
import { SectionIcon, SectionTitleIcon } from "./SectionIcon";
import { mq } from "@/lib/breakpoints";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

const EDUCATION: { school: string; short: string; degree: string; period: string }[] = [
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

function useStickyTilt(fromDeg: number) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start end", "start 0.3"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    mass: 0.9,
    restDelta: 0.0008,
  });
  const rotate = useTransform(smooth, [0, 1], [fromDeg, 0]);
  const y = useTransform(smooth, [0, 1], [18, 0]);
  const scale = useTransform(smooth, [0, 1], [0.975, 1]);
  return { wrapRef, rotate, y, scale };
}

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
      {name}
    </motion.span>
  );
}

function EduEntry({ school, degree, short, period, index, total, sectionVisible }: {
  school: string; degree: string; short: string; period: string;
  index: number; total: number; sectionVisible: boolean;
}) {
  return (
    <motion.div
      className="edu-card"
      initial={false}
      animate={sectionVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: sectionVisible ? index * 0.1 : 0 }}
    >
      <div className="edu-card-icon">
        <SectionIcon type="cap" size={15} strokeWidth={2} />
      </div>
      {index < total - 1 && <div className="edu-card-line" />}
      <div className="edu-card-body">
        <div className="edu-card-top">
          <div>
            <p className="edu-card-school">{school}</p>
            <p className="edu-card-degree">{degree}</p>
            <p className="edu-card-loc">{short}</p>
          </div>
          {period && <span className="edu-card-period">{period}</span>}
        </div>
      </div>
    </motion.div>
  );
}

function EduNoteCard({ visible }: { visible: boolean }) {
  const { wrapRef, rotate, y, scale } = useStickyTilt(-3.5);

  return (
    <div ref={wrapRef} className="sticky-wrap edu-sticky-wrap">
      <motion.div className="note-card edu-note-card" style={{ rotate, y, scale }}>
        <div className="note-fold" aria-hidden="true" />
        {EDUCATION.map((edu, i) => (
          <EduEntry
            key={i}
            {...edu}
            index={i}
            total={EDUCATION.length}
            sectionVisible={visible}
          />
        ))}
      </motion.div>
    </div>
  );
}

function LangNoteCard({ visible }: { visible: boolean }) {
  const { wrapRef, rotate, y, scale } = useStickyTilt(4.5);

  return (
    <div ref={wrapRef} className="sticky-wrap lang-sticky-wrap">
      <motion.div className="note-card lang-note-card" style={{ rotate, y, scale }}>
        <div className="note-fold" aria-hidden="true" />
        <div className="lang-note-head">
          <div className="edu-card-icon">
            <SectionIcon type="language" size={15} strokeWidth={2} />
          </div>
          <span className="lang-label-txt">Languages</span>
        </div>
        <div className="lang-pills-wrap">
          {LANGUAGES.map((lang, i) => (
            <LangPill key={i} name={lang.name} delay={visible ? 0.18 + i * 0.08 : 0} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Education section
export function EducationSection() {
  const { ref, revealClass, visible } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
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
        .edu-sec-divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 30px;
        }

        /* ── two-card row: Education + Languages ─────────────────── */
        .edu-lang-row {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 20px;
          align-items: start;
        }

        .sticky-wrap { padding-bottom: 110px; }
        .lang-sticky-wrap { padding-bottom: 80px; }

        /* ── sticky note card shell ───────────────────────────────── */
        .note-card {
          position: sticky;
          top: 78px;
          box-sizing: border-box;
          border: 1.3px dashed rgba(10,186,181,0.45);
          border-radius: 12px;
          background: rgba(10,186,181,0.045);
          box-shadow:
            0 14px 34px rgba(0,0,0,0.30),
            0 2px 8px rgba(0,0,0,0.22),
            0 0 0 1px rgba(10,186,181,0.06) inset;
          padding: 6px 22px 6px;
          transform-origin: top center;
          will-change: transform;
        }
        html.light .note-card {
          border-color: rgba(10,186,181,0.65);
          background: rgba(10,186,181,0.055);
          box-shadow:
            0 14px 30px rgba(0,0,0,0.10),
            0 2px 6px rgba(0,0,0,0.08),
            0 0 0 1px rgba(10,186,181,0.08) inset;
        }
        .lang-note-card { padding: 20px 20px 22px; }

        .note-fold {
          position: absolute;
          top: -1.5px; right: -1.5px;
          width: 26px; height: 26px;
          background: linear-gradient(135deg, transparent 50%, var(--bg-hover) 50.5%);
          border-bottom-left-radius: 7px;
          box-shadow: -2px 2px 5px rgba(0,0,0,0.25);
          pointer-events: none;
        }
        html.light .note-fold {
          background: linear-gradient(135deg, transparent 50%, #e2e2de 50.5%);
          box-shadow: -2px 2px 5px rgba(0,0,0,0.12);
        }
        .lang-note-card .note-fold {
          left: -1.5px; right: auto;
          background: linear-gradient(225deg, transparent 50%, var(--bg-hover) 50.5%);
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 7px;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.25);
        }
        html.light .lang-note-card .note-fold {
          background: linear-gradient(225deg, transparent 50%, #e2e2de 50.5%);
          box-shadow: 2px 2px 5px rgba(0,0,0,0.12);
        }

        /* ── education entries / timeline ─────────────────────────── */
        .edu-card {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 16px 0;
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

        /* ── languages note card ───────────────────────────────────── */
        .lang-note-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
        }
        .lang-label-txt {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--text-primary);
          font-family: ${SF};
        }
        .lang-pills-wrap {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .lang-pill-item {
          display: inline-flex;
          align-items: center;
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

        ${mq.navCollapse} {
          .edu-inner { padding: 0 22px 34px; }
        }
        ${mq.tablet} {
          .edu-lang-row { grid-template-columns: 1fr 1fr; gap: 16px; }
          .note-card { padding-left: 18px; padding-right: 18px; }
          .lang-note-card { padding: 18px; }
        }
        ${mq.mobile} {
          .edu-inner { padding: 0 13px 28px; }
          .edu-sec-title { font-size: 22px; }
          .edu-lang-row { grid-template-columns: 1fr; gap: 34px; }
          .sticky-wrap { padding-bottom: 70px; }
          .note-card { top: 68px; padding-left: 16px; padding-right: 16px; }
          .lang-note-card { padding: 16px; }
          .edu-card-top { flex-direction: column; gap: 4px; }
          .edu-card-period { margin-left: 0; }
        }
      `}</style>

      <section
        id="education"
        ref={ref}
        className={revealClass}
      >
        <div className="edu-outer">
          <div className="edu-inner">
            <div className="edu-sec-titlerow">
              <h2 className="edu-sec-title">
                <SectionTitleIcon type="institution" />
                Education
              </h2>
            </div>

            <div className="edu-sec-divider" />

            <div className="edu-lang-row">
              <EduNoteCard visible={visible} />
              <LangNoteCard visible={visible} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}