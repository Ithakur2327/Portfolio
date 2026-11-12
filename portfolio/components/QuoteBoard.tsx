"use client";
import { useReveal } from "./useReveal";
import { FlapBoard } from "./FlapBoard";

/** Split-flap board of Gita verses, developer quotes, code and colour puzzles — sits just above the footer. */
export function QuoteBoard() {
  const { ref, revealClass } = useReveal();
  return (
    <section id="quotes" ref={ref} className={revealClass} aria-label="Wisdom and code">
      <div className="qb-content">
        <FlapBoard />
      </div>
    </section>
  );
}