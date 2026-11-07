"use client";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { Panel3D } from "./Panel3D";
import { FlapBoard } from "./FlapBoard";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

/** Split-flap board of Gita verses, developer quotes, code and colour puzzles — sits just above the footer. */
export function QuoteBoard() {
  const { ref, revealClass } = useReveal();
  return (
    <section id="quotes" ref={ref} className={revealClass} aria-label="Wisdom and code">
      <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
        <Panel3D tilt={false}>
          <div className="qb-content">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
              <SectionTitleIcon type="quote" />
              Wisdom &amp; Code
            </span>
            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 20px" }} />
            <FlapBoard />
          </div>
        </Panel3D>
      </div>
    </section>
  );
}