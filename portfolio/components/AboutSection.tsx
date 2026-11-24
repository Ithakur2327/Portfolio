"use client";

import React, { useEffect, useRef } from "react";
import { useMotionValueEvent } from "motion/react";

import { useReveal } from "./useReveal";
import VariableProximity, { type VariableProximityPiece } from "./VariableProximity";
import { useScrollProgress } from "@/lib/useScrollProgress";
import { mq } from "@/lib/breakpoints";

const TIFFANY = "#0ABAB5";
const GOLD = "#D4AF37";

// [[double brackets]] = highlighted words (they light up one after another as you scroll)
const PARAGRAPHS = [
  `I'm [[Indresh Thakur]], a [[full-stack developer]] with a growing focus on [[AI-powered products]]. I'm pursuing my [[B.Tech in Computer Science & Engineering (AI)]] at [[NIET, Greater Noida]], and I enjoy turning ideas into things people can actually use.`,
  `Most of my time goes into building [[end-to-end web apps]]: clean React and Next.js interfaces on the front, Node.js and FastAPI behind them, and [[LLMs, RAG and agent workflows]] where they genuinely help. Right now I'm [[freelancing]] with clients, and I recently wrapped up a remote [[full-stack internship]].`,
  `Away from client work, I keep my fundamentals sharp with [[data structures and algorithms]], contribute to [[open source]]. I care about [[clean code]], [[clear communication]] and learning something new every week.`,
];

const countHighlights = (s: string) => (s.match(/\[\[/g) ?? []).length;
const STARTS = PARAGRAPHS.map((_, i) => PARAGRAPHS.slice(0, i).reduce((n, p) => n + countHighlights(p), 0));
const TOTAL = PARAGRAPHS.reduce((n, p) => n + countHighlights(p), 0);

const pieceClass = (piece: VariableProximityPiece) => {
  if (piece.hl < 0) return undefined;
  return piece.group === "Indresh Thakur" ? "ab-hl ab-name" : "ab-hl ab-gold";
};

function ScrollRevealText() {
  const ref = useRef<HTMLDivElement>(null);
  // Layout-read-free scroll progress (see lib/useScrollProgress.ts).
  const progress = useScrollProgress(ref, ["start 0.85", "center 0.6"]);

  // One CSS variable drives every highlight's opacity (see .ab-hl): a single
  // style write per scroll frame, and only while the text is inside its short
  // reveal window.
  const write = (v: number) => ref.current?.style.setProperty("--p", v.toFixed(4));
  useMotionValueEvent(progress, "change", write);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    write(reduced ? 1 : progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className="ab-text" style={{ ["--p" as string]: 0, ["--n" as string]: TOTAL } as React.CSSProperties}>
      {PARAGRAPHS.map((para, i) => (
        <p key={i} className="ab-para">
          <VariableProximity
            label={para}
            startIndex={STARTS[i]}
            radius={96}
            falloff="gaussian"
            smoothing={0.16}
            stroke={0.6}
            scale={1.22}
            lift={0.055}
            pieceClassName={pieceClass}
          />
        </p>
      ))}
    </div>
  );
}

// About section
export function AboutSection() {
  const { ref, revealClass } = useReveal();
  const [greeting, setGreeting] = React.useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
  }, []);

  return (
    <>
      <style suppressHydrationWarning>{`
        .ab-text { display: flex; flex-direction: column; gap: 18px; }
        /* The app's own body font (inherited), sized to the space it is given. */
        .ab-para {
          margin: 0;
          font-family: inherit;
          font-size: clamp(14.5px, 0.55vw + 12.8px, 17px);
          line-height: 1.75;
          letter-spacing: -0.003em;
          color: var(--text-primary);
          text-align: left;
          text-wrap: pretty;
          overflow-wrap: anywhere;
        }
        /* highlights: colour + the scroll-driven fade-in (0.25 → 1) */
        .ab-hl {
          font-weight: 600;
          opacity: calc(0.25 + 0.75 * clamp(0, (var(--p) * var(--n) - var(--i) + 0.2) / 0.6, 1));
        }
        .ab-name { color: ${TIFFANY}; text-shadow: 0 0 6px color-mix(in srgb, ${TIFFANY} 22%, transparent); }
        .ab-gold { color: ${GOLD}; text-shadow: 0 0 5px color-mix(in srgb, ${GOLD} 16%, transparent); }
        html.light .ab-name { color: #0f766e; text-shadow: none; }
        html.light .ab-gold { color: #b8860b; text-shadow: none; }

        .ab-content { padding: 26px 24px 28px; }
        .ab-greeting {
          display: inline-block;
          font-family: "Fraunces", "Iowan Old Style", Georgia, serif;
          font-size: 28px;
          font-weight: 700;
          line-height: 1;
          letter-spacing: -0.03em;
          color: var(--text-primary);
        }
        ${mq.navCollapse} { .ab-content { padding: 22px 18px 24px; } }
        ${mq.mobile} {
          .ab-content { padding: 18px 12px 20px; }
          .ab-text { gap: 14px; }
          .ab-para { line-height: 1.7; }
        }
      `}</style>

      <section id="about" ref={ref} className={revealClass}>
        <div className="ab-content">
          <span className="ab-greeting">{greeting}</span>
          <div style={{ height: 1, background: "var(--border)", margin: "18px 0 20px" }} />
          <ScrollRevealText />
        </div>
      </section>
    </>
  );
}