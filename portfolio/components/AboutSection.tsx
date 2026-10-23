"use client";

import React, { useEffect, useRef } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";

import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { Panel3D } from "./Panel3D";
import VariableProximity, { type VariableProximityPiece } from "./VariableProximity";
import { mq } from "@/lib/breakpoints";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
// Fraunces (loaded in app/layout.tsx) — a soft, characterful variable serif with
// weight / optical-size / "softness" axes, which is what the hover effect animates.
const ABOUT_FONT = "'Fraunces', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";

const TIFFANY = "#0ABAB5";
const GOLD = "#D4AF37";

// [[double brackets]] = highlighted words (they light up one after another as you scroll)
const PARAGRAPHS = [
  `Hi, I'm [[Indresh Thakur]], a [[Full-Stack]] & [[AI Developer]] currently pursuing [[B.Tech]] in [[Computer Science & Engineering (AI)]] at [[NIET Greater Noida]]. I'm [[motivated]] and [[growth oriented]], and I love building [[modern]], [[scalable]] and [[user]]-[[focused]] digital experiences.`,
  `I design and ship [[intelligent web applications]] and [[AI-powered systems]], from polished interfaces to robust backends. Alongside [[freelance]] client work and a recent [[full-stack internship]], I sharpen my [[problem]]-[[solving]] every day through [[Data Structures and Algorithms]] and keep exploring [[emerging technologies]] to turn ideas into [[impactful]] [[solutions]].`,
  `I bring a unique blend of [[technical expertise]], [[adaptability]] and [[creativity]], with a genuine enthusiasm for building software that creates [[real]] [[impact]].`,
];

const countHighlights = (s: string) => (s.match(/\[\[/g) ?? []).length;
const STARTS = PARAGRAPHS.map((_, i) => PARAGRAPHS.slice(0, i).reduce((n, p) => n + countHighlights(p), 0));
const TOTAL = PARAGRAPHS.reduce((n, p) => n + countHighlights(p), 0);

const FROM = "'wght' 400, 'opsz' 14, 'SOFT' 0";
const TO = "'wght' 840, 'opsz' 64, 'SOFT' 100";

const pieceClass = (piece: VariableProximityPiece) => {
  if (piece.hl < 0) return undefined;
  return piece.group === "Indresh Thakur" ? "ab-hl ab-name" : "ab-hl ab-gold";
};

function ScrollRevealText({ boxRef }: { boxRef: React.RefObject<HTMLDivElement | null> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "center 0.6"] });

  // One CSS variable drives every highlight's opacity (see .ab-hl). No springs,
  // no per-word motion values: a single style write per scroll frame, and only
  // while the paragraph is inside its short reveal window.
  const write = (v: number) => ref.current?.style.setProperty("--p", v.toFixed(4));
  useMotionValueEvent(scrollYProgress, "change", write);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    write(reduced ? 1 : scrollYProgress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={ref}
      className="ab-text"
      style={{ ["--p" as string]: 0, ["--n" as string]: TOTAL, display: "flex", flexDirection: "column", gap: 20 } as React.CSSProperties}
    >
      {PARAGRAPHS.map((para, i) => (
        <p key={i} className="ab-para" style={{ margin: 0 }}>
          <VariableProximity
            label={para}
            startIndex={STARTS[i]}
            containerRef={boxRef}
            fontFamily={ABOUT_FONT}
            fromFontVariationSettings={FROM}
            toFontVariationSettings={TO}
            radius={95}
            falloff="gaussian"
            smoothing={0.16}
            scale={1.06}
            lift={0.035}
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
  const boxRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <style suppressHydrationWarning>{`
        .ab-para {
          line-height: 1.78; font-family: ${ABOUT_FONT}; font-size: 17px;
          letter-spacing: -0.005em; color: var(--text-primary);
          text-align: left; overflow-wrap: break-word;
          font-optical-sizing: none;
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

        .ab-content { padding: 24px 24px 26px; }
        ${mq.navCollapse} { .ab-content { padding: 20px 16px 20px; } }
        ${mq.mobile} {
          .ab-content { padding: 16px 8px 16px; }
          .ab-para    { font-size: 15px !important; line-height: 1.72; }
        }

        .ab-box {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          border: 1px dashed rgba(255, 255, 255, 0.35);
          border-radius: 10px;
          padding: 14px 14px;
        }
        html.light .ab-box { border-color: rgba(0, 0, 0, 0.5); }
        ${mq.navCollapse} { .ab-box { padding: 14px 14px; } }
        ${mq.mobile} { .ab-box { padding: 12px 10px; border-radius: 8px; } }
      `}</style>

      <section id="about" ref={ref} className={revealClass}>
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
          <Panel3D>
            <div className="ab-content">
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                <SectionTitleIcon type="about" />
                About
              </span>
              <div style={{ height: 1, background: "var(--border)", margin: "18px 0 20px" }} />
              <div className="ab-box" ref={boxRef}>
                <ScrollRevealText boxRef={boxRef} />
              </div>
            </div>
          </Panel3D>
        </div>
      </section>
    </>
  );
}
