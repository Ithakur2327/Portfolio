"use client";
import { motion } from "motion/react";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { usePdfModal } from "./PdfViewerModal";
import { slugify } from "@/lib/utils";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

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
  {
    title: "Next Gen Technologies",
    issuer: "Infosys Springboard",
    date: "2025",
    logo: "https://cdn.simpleicons.org/infosys/007CC3",
    stack: [],
  },
];

export function CertificationsSection() {
  const { ref, revealClass, visible } = useReveal();
  const { openPdf } = usePdfModal();

  return (
    <>
      <style suppressHydrationWarning>{`
        /* ── shared section wrapper (same as Education / Skills / Projects) ── */
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
          margin-bottom: 22px;
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
        /* ── certifications grid — 2 columns on tablet/iPad/desktop,
           1 column on mobile. grid-auto-flow:column fills a whole column
           top-to-bottom before wrapping to the next one, so DOM order
           stays visually stacked within each column — that's what lets
           the connecting line below just chain consecutive DOM siblings
           the same way it does in single-column mode. */
        .cert-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: repeat(3, auto);
          grid-auto-flow: column;
          column-gap: 40px;
        }
        /* Right column sits a bit further from the center gap. Uses
           margin (not padding) so the icon AND its absolutely-positioned
           connecting line — which is anchored to this box's own edge —
           shift together; padding here would only have moved the icon,
           leaving the line behind and visibly misaligned from it. */
        .cert-grid > .cert-item-2:nth-child(n+4) { margin-left: 14px; }
        /* Column 1's last card has no card visually below it in the
           2-column layout (its next DOM sibling is the top of column 2) —
           so its trailing connector line is hidden here only. */
        .cert-grid > .cert-item-2:nth-child(3) > .cert-item-2-line { display: none; }
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
        /* Only the certificate name is clickable — the card itself carries
           no onClick/role/tabIndex. */
        .cert-item-2-title {
          display: inline-block;
          font-size: 14.5px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: -0.025em;
          font-family: ${SF};
          line-height: 1.2;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          text-align: left;
        }
        .cert-item-2-title:hover { text-decoration: underline; text-underline-offset: 3px; }
        .cert-item-2-title:focus-visible {
          outline: 2px solid var(--text-muted);
          outline-offset: 3px;
          border-radius: 3px;
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
          margin-left: 8px;
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
          .edu-sec-title { font-size: 22px; }
        }
        @media (max-width: 767px) {
          .cert-grid {
            grid-template-columns: 1fr;
            grid-template-rows: repeat(${CERTIFICATIONS.length}, auto);
            column-gap: 0;
          }
          .cert-grid > .cert-item-2:nth-child(n+4) { margin-left: 0; }
          .cert-grid > .cert-item-2:nth-child(3) > .cert-item-2-line { display: block; }
        }
      `}</style>

      {/* ═══ CERTIFICATIONS ═══ */}
      <section
        id="certifications"
        ref={ref}
        className={revealClass}
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

            {/* Cert items — education-card layout: company icon, title, issuer/date.
                Only the certificate name is clickable; the card itself is inert. */}
            <div className="cert-grid">
              {CERTIFICATIONS.map((cert, i) => {
                const pdfSrc = `/certificates/${slugify(cert.title)}.pdf`;
                return (
                  <motion.div
                    key={i}
                    className="cert-item-2"
                    initial={false}
                    animate={visible ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 14, rotateX: 6 }}
                    transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1], delay: visible ? i * 0.08 : 0 }}
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
                          <button
                            type="button"
                            className="cert-item-2-title"
                            onClick={() => openPdf(pdfSrc, cert.title)}
                          >
                            {cert.title}
                          </button>
                          <p className="cert-item-2-issuer">
                            @{cert.issuer}
                            <span className="cert-item-2-date">{cert.date}</span>
                          </p>
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
        </div>
      </section>
    </>
  );
}