"use client";

import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "motion/react";

import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

const ABOUT_TEXT = `Hi, I'm [[Indresh Thakur]], currently pursuing [[B.Tech]] in [[Computer Science & Engineering]] [[AI]] at [[NIET Greater Noida]]. I'm a [[motivated]] and [[growth oriented]] [[Full-Stack]] & [[AI Developer]] passionate about building [[modern]], [[scalable]], and [[user-focused]] digital experiences.

My work focuses on developing [[intelligent web applications]] and [[AI-powered systems]] while continuously improving my [[problem]]-[[solving]] abilities through active [[Data Structures and Algorithms]] practice and real-world project development. I enjoy exploring [[emerging technologies]], learning new tech stacks, and turning ideas into [[impactful]] [[solutions]].

I bring a unique blend of [[technical expertise]], [[adaptability]], [[creativity]], and a genuine enthusiasm for building software that creates [[real]] [[impact]].`;

interface Token { text: string; hl: boolean; idx: number; isName: boolean; }

function parse(raw: string): Token[][] {
  let g = 0;
  return raw.split("\n\n").map((para) => {
    const tokens: Token[] = [];
    const re = /\[\[(.+?)\]\]|([^\[]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(para)) !== null) {
      if (m[1]) tokens.push({ text: m[1], hl: true, idx: g++, isName: m[1] === "Indresh Thakur" });
      else tokens.push({ text: m[2], hl: false, idx: -1, isName: false });
    }
    return tokens;
  });
}

function GoldWord({ text, idx, total, progress, isName }: {
  text: string; idx: number; total: number; progress: MotionValue<number>; isName: boolean;
}) {
  const s = Math.max(0, (idx - 0.2) / total);
  const e = Math.min(1, (idx + 0.4) / total);
  const raw = useTransform(progress, [s, e], [0, 1]);
  const p = useSpring(raw, { stiffness: 200, damping: 30, mass: 0.5 });
  const opacity = useTransform(p, [0, 0.15, 1], [0.25, 0.65, 1]);
  if (isName) return (
    <motion.span style={{ opacity, display: "inline", verticalAlign: "baseline" }}>
      <span className="name-highlight">{text}</span>
    </motion.span>
  );
  return (
    <motion.span className="gold-box-word" style={{ opacity, display: "inline", verticalAlign: "baseline" }}>
      {text}
    </motion.span>
  );
}

function ScrollRevealText() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "center 0.6"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 25, restDelta: 0.001 });
  const paras = parse(ABOUT_TEXT);
  const total = paras.flat().filter((t) => t.hl).length;
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {paras.map((tokens, pi) => (
        <p key={pi} className="about-para" style={{
          margin: 0, lineHeight: 1.85, fontFamily: SF, fontSize: 15,
          letterSpacing: "-0.01em", fontWeight: 400, color: "var(--text-primary)",
          wordBreak: "normal", overflowWrap: "break-word",
        }}>
          {tokens.map((t, ti) =>
            t.hl
              ? <GoldWord key={ti} text={t.text} idx={t.idx} total={total} progress={smooth} isName={t.isName} />
              : <span key={ti} style={{ color: "var(--text-primary)", display: "inline" }}>{t.text}</span>
          )}
        </p>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   Main AboutSection export
───────────────────────────────────────────────────── */
export function AboutSection() {
  const { ref, revealClass } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        .name-highlight {
          display: inline; color: #4ade80;
          background: linear-gradient(135deg,rgba(74,222,128,0.10) 0%,rgba(34,197,94,0.05) 50%,rgba(16,185,129,0.08) 100%);
          border: 1px solid rgba(74,222,128,0.22); border-radius: 5px;
          padding: 1px 7px 2px;
          box-shadow: 0 0 10px rgba(74,222,128,0.12),0 0 22px rgba(74,222,128,0.06);
          font-weight: 600; white-space: nowrap;
        }
        .gold-box-word {
          display: inline; color: #d4a017; font-weight: 600;
          background: rgba(212,160,23,0.10); border: 1px solid rgba(212,160,23,0.22);
          border-radius: 5px; padding: 1px 5px 2px; margin: 0 1px;
        }
        html.light .name-highlight { color: #16a34a; background: rgba(22,163,74,0.08); border-color: rgba(22,163,74,0.20); box-shadow: none; }
        html.light .gold-box-word { color: #d97706 !important; background: rgba(245,158,11,0.13) !important; border-color: rgba(217,119,6,0.45) !important; }

        .about-content {
          max-width: 980px; margin: 0 auto; padding: 0 20px 64px;
        }
        @media (max-width: 860px) { .about-content { padding: 0 22px 34px; } }
        @media (max-width: 639px) {
          .about-content { padding: 0 14px 28px; }
          .about-para    { font-size: 14px !important; line-height: 1.8 !important; }
        }

        .about-box {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          border: 1px solid var(--border);
          border-radius: 10px;
          background: var(--bg-base);
          padding: 18px 18px;
        }
        @media (max-width: 860px) {
          .about-box { padding: 16px 16px; }
        }
        @media (max-width: 639px) {
          .about-box { padding: 24px 20px; border-radius: 8px; }
        }
      `}</style>

      <section id="about" ref={ref} className={revealClass}>
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
          <div className="about-content">
            <div style={{ paddingTop: 50 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                <SectionTitleIcon type="about" />
                About
              </span>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 20px" }} />
            <div className="about-box">
              <ScrollRevealText />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}