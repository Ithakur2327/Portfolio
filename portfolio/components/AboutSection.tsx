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
import { mq } from "@/lib/breakpoints";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

// Same two accent colors used for the dashed frames around the project
// cards, reused here so the About box reads as part of the same system.
const TIFFANY = "#0FA89C";
const GOLD = "#D4AF37";

/* Time-of-day greeting removed — reverted back to a static "About" title. */

const ABOUT_TEXT = `Hi, I'm [[Indresh Thakur]], currently pursuing [[B.Tech]] in [[Computer Science & Engineering (AI)]] at [[NIET Greater Noida]]. I'm a [[motivated]] and [[growth oriented]] [[Full-Stack]] & [[AI Developer]] passionate about building [[modern]], [[scalable]], and [[user]]-[[focused]] digital experiences.

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
          margin: 0, lineHeight: 1.7, fontFamily: SF, fontSize: 16,
          letterSpacing: "-0.01em", fontWeight: 400, color: "var(--text-primary)",
          textAlign: "justify", textJustify: "inter-word" as React.CSSProperties["textJustify"],
          hyphens: "auto", wordBreak: "normal", overflowWrap: "break-word",
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

/* About section export */
export function AboutSection() {
  const { ref, revealClass } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        /* Name highlight → tiffany, same accent used for the project cards. */
        .name-highlight {
          display: inline; color: ${TIFFANY}; font-weight: 600; white-space: nowrap;
          background: rgba(15,168,156,0.12); border: 1px solid rgba(15,168,156,0.35);
          border-radius: 5px; padding: 1px 7px 2px;
        }
        /* All other highlighted terms → gold, same accent used for the project cards. */
        .gold-box-word {
          display: inline; color: ${GOLD}; font-weight: 600;
          background: rgba(212,175,55,0.10); border: 1px solid rgba(212,175,55,0.30);
          border-radius: 5px; padding: 1px 5px 2px; margin: 0 1px;
        }
        html.light .name-highlight  { color: #0a7a70 !important; background: rgba(15,168,156,0.14) !important; border-color: rgba(10,122,112,0.45) !important; }
        html.light .gold-box-word   { color: #b8860b !important; background: rgba(212,175,55,0.14) !important; border-color: rgba(184,134,11,0.45) !important; }

        .about-content {
          max-width: var(--content-width); margin: 0 auto; padding: 0 20px 64px;
        }
        ${mq.navCollapse} { .about-content { padding: 0 22px 34px; } }
        ${mq.mobile} {
          .about-content { padding: 0 14px 28px; }
          .about-para    { font-size: 14px !important; }
        }

        .about-box {
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          border: 1px dashed rgba(255,255,255,0.35);
          border-radius: 10px;
          background: var(--bg-base);
          padding: 18px 18px;
        }
        html.light .about-box { border-color: rgba(0,0,0,0.30); }
        ${mq.navCollapse} {
          .about-box { padding: 16px 16px; }
        }
        ${mq.mobile} {
          .about-box { padding: 14px 12px; border-radius: 8px; }
        }
      `}</style>

      <section id="about" ref={ref} className={revealClass}>
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
          <div className="about-content">
            <div style={{ paddingTop: 28 }}>
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