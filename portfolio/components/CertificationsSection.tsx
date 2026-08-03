"use client";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue, MotionStyle } from "motion/react";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { usePdfModal } from "./PdfViewerModal";
import { slugify } from "@/lib/utils";
import { mq } from "@/lib/breakpoints";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

const TIFFANY = "10,186,181";
const GOLD = "212,175,55";

const CERTIFICATIONS = [
  {
    title: "MERN Stack Development",
    issuer: "Coursera",
    date: "2024",
    logo: "https://cdn.simpleicons.org/coursera/2A73CC",
  },
  {
    title: "Data Structures & Algorithms",
    issuer: "GeeksforGeeks",
    date: "2024",
    logo: "https://cdn.simpleicons.org/geeksforgeeks/2F8D46",
  },
  {
    title: "Principles of Generative AI",
    issuer: "Coursera",
    date: "2025",
    logo: "https://cdn.simpleicons.org/coursera/2A73CC",
  },
  {
    title: "Cloud Computing Fundamentals",
    issuer: "Google Cloud",
    date: "2025",
    logo: "https://cdn.simpleicons.org/googlecloud/4285F4",
  },
  {
    title: "Networking",
    issuer: "Cisco",
    date: "2026",
    logo: "https://cdn.simpleicons.org/cisco/1BA0D7",
  },
  {
    title: "Next Gen Technologies",
    issuer: "Infosys Springboard",
    date: "2025",
    logo: "https://cdn.simpleicons.org/infosys/007CC3",
  },
];

const TILTS = [-3.5, 3, -2.5, 3.5, -3, 2.5];

function useSharedTilt() {
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
  return { wrapRef, smooth };
}

function CertTLCard({ cert, smooth, fromDeg, visible, delay, onOpen }: {
  cert: (typeof CERTIFICATIONS)[number];
  smooth: MotionValue<number>;
  fromDeg: number;
  visible: boolean;
  delay: number;
  onOpen: () => void;
}) {
  const rotate = useTransform(smooth, [0, 1], [fromDeg, 0]);
  const accent = fromDeg < 0 ? TIFFANY : GOLD;
  const cardStyle: MotionStyle = { rotate, "--accent": accent } as MotionStyle;

  return (
    <motion.div
      className="cert-tl-card"
      style={cardStyle}
      initial={false}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: visible ? delay : 0 }}
    >
      <div className="cert-tl-badge">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cert.logo}
          alt={cert.issuer}
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      </div>
      <div className="cert-tl-face">
        <button type="button" className="cert-tl-title" onClick={onOpen}>
          {cert.title}
        </button>
        <p className="cert-tl-issuer">@{cert.issuer}</p>
        <p className="cert-tl-date">{cert.date}</p>
      </div>
    </motion.div>
  );
}

// Certifications section
export function CertificationsSection() {
  const { ref, revealClass, visible } = useReveal();
  const { openPdf } = usePdfModal();
  const { wrapRef, smooth } = useSharedTilt();

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
          padding: 0 20px 44px;
        }
        .edu-sec-titlerow { padding-top: 50px; margin-bottom: 20px; }
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
        .edu-sec-divider { height: 1px; background: var(--border); margin-bottom: 34px; }
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

        /* ── shared sticky / tilt-to-straight mechanics ─────────────── */
        .tl-sticky-wrap { padding-bottom: 90px; }
        .tl-sticky-inner { position: sticky; top: 78px; }

        .cert-tl-row {
          position: relative;
          display: flex;
          gap: 14px;
          overflow-x: auto;
          overflow-y: visible;
          padding: 20px 4px 10px;
          scroll-snap-type: x proximity;
          scrollbar-width: thin;
        }
        .cert-tl-row::-webkit-scrollbar { height: 5px; }
        .cert-tl-row::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }
        .cert-tl-row::before {
          content: "";
          position: absolute;
          top: 40px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--border) 6%, var(--border) 94%, transparent);
          z-index: 0;
        }

        .cert-tl-card {
          position: relative;
          flex: 1 1 148px;
          min-width: 148px;
          scroll-snap-align: start;
          box-sizing: border-box;
          min-height: 150px;
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          padding: 22px 12px 12px;
          margin-top: 20px;
          transform-origin: top center;
          will-change: transform, filter;
          z-index: 1;
          border: 1.5px dashed rgba(var(--accent),0.5);
          background: rgba(var(--accent),0.05);
          box-shadow: 0 10px 24px rgba(0,0,0,0.26), 0 2px 8px rgba(0,0,0,0.18), 0 0 0 1px rgba(var(--accent),0.07) inset;
          transition: filter 0.4s ease, box-shadow 0.3s ease;
        }
        html.light .cert-tl-card {
          background: rgba(var(--accent),0.06);
          box-shadow: 0 10px 22px rgba(0,0,0,0.09), 0 2px 6px rgba(0,0,0,0.06), 0 0 0 1px rgba(var(--accent),0.09) inset;
        }

        /* B/W by default, colour on hover — desktop/laptop (true pointer) only */
        @media (hover: hover) and (pointer: fine) {
          .cert-tl-card { filter: grayscale(1) saturate(0); }
          .cert-tl-card:hover {
            filter: grayscale(0) saturate(1);
            box-shadow: 0 14px 30px rgba(0,0,0,0.3), 0 0 0 1px rgba(var(--accent),0.25) inset;
          }
        }

        .cert-tl-badge {
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 40px; height: 40px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: var(--bg-card, var(--bg-hover));
          border: 2px solid var(--bg-base);
          box-shadow: 0 3px 10px rgba(0,0,0,0.3), 0 0 0 1px rgba(var(--accent),0.35);
          z-index: 2;
        }
        .cert-tl-badge img { width: 18px; height: 18px; object-fit: contain; }

        .cert-tl-face { flex: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .cert-tl-title {
          font-size: 11.5px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          font-family: ${SF};
          line-height: 1.25;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .cert-tl-title:hover { text-decoration: underline; text-underline-offset: 3px; }
        .cert-tl-title:focus-visible { outline: 2px solid var(--text-muted); outline-offset: 3px; border-radius: 3px; }
        .cert-tl-issuer {
          font-size: 10px;
          color: var(--text-secondary);
          font-family: ${SF};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .cert-tl-date {
          font-size: 9.5px;
          color: var(--text-muted);
          font-family: ${MONO};
          margin-top: auto;
          padding-top: 6px;
        }

        ${mq.navCollapse} { .edu-inner { padding: 0 22px 30px; } }
        ${mq.mobile} {
          .edu-inner { padding: 0 13px 26px; }
          .edu-sec-title { font-size: 22px; }
          .edu-sec-divider { margin-bottom: 26px; }
          .tl-sticky-wrap { padding-bottom: 40px; }
          .tl-sticky-inner { top: 68px; }
          .cert-tl-card { flex-basis: 128px; min-width: 128px; }
        }
      `}</style>

      <section id="certifications" ref={ref} className={revealClass}>
        <div className="edu-outer">
          <div className="edu-inner">
            <div className="edu-sec-titlerow">
              <h2 className="edu-sec-title">
                <SectionTitleIcon type="badge" />
                Certifications
                <span className="cert-count-badge">{CERTIFICATIONS.length}</span>
              </h2>
            </div>

            <div className="edu-sec-divider" />

            <div ref={wrapRef} className="tl-sticky-wrap">
              <div className="tl-sticky-inner">
                <div className="cert-tl-row">
                  {CERTIFICATIONS.map((cert, i) => {
                    const pdfSrc = `/certificates/${slugify(cert.title)}.pdf`;
                    return (
                      <CertTLCard
                        key={i}
                        cert={cert}
                        smooth={smooth}
                        fromDeg={TILTS[i]}
                        visible={visible}
                        delay={i * 0.06}
                        onOpen={() => openPdf(pdfSrc, cert.title)}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}