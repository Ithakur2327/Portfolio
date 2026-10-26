"use client";
import { useReveal } from "./useReveal";
import { TextFlippingBoard } from "./TextFlippingBoard";
import { BOARD_MESSAGES } from "@/lib/board-messages";

/** Lightweight rotating quote card — sits just above the footer. */
export function QuoteBoard() {
  const { ref, revealClass } = useReveal();
  return (
    <section id="quotes" ref={ref} className={`quote-board ${revealClass}`} aria-label="Bhagavad Gita reflections">
      <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
        <div className="qb-wrap">
          <p className="qb-kicker"><b>{"//"}</b> Bhagavad Gita · reflections</p>
          <TextFlippingBoard messages={BOARD_MESSAGES} />
        </div>
      </div>
    </section>
  );
}