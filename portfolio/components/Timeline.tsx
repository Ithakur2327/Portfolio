"use client";
import React, { useRef } from "react";
import { motion, useTransform } from "motion/react";
import { useScrollProgress } from "@/lib/useScrollProgress";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

export interface TimelineEntry {
  /** Big label in the left column (e.g. a date range). */
  label: string;
  /** Small line under the label. */
  sublabel?: string;
  /** Pulses the marker — for ongoing items. */
  current?: boolean;
  content: React.ReactNode;
}

/**
 * Scroll-driven timeline.
 *  • The rail fills (teal → gold) as you scroll through the list.
 *  • Each marker lights up when its entry reaches the reading line.
 * Everything is driven by transform / opacity motion values — nothing here
 * triggers layout while scrolling.
 */
function Marker({ target, current }: { target: React.RefObject<HTMLElement | null>; current?: boolean }) {
  const scrollYProgress = useScrollProgress(target as React.RefObject<HTMLElement | null>, ["start 0.78", "start 0.55"]);
  const on = useTransform(scrollYProgress, [0, 1], [0, 1]);
  return (
    <span className="tl-marker" aria-hidden="true">
      <span className="tl-marker-ring" />
      <motion.span className="tl-marker-core" style={{ opacity: on, scale: on }} />
      {current && <span className="tl-marker-pulse" />}
    </span>
  );
}

function Entry({ entry }: { entry: TimelineEntry }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="tl-entry">
      <div className="tl-date">
        <span className="tl-date-main">{entry.label}</span>
        {entry.sublabel && <span className="tl-date-sub">{entry.sublabel}</span>}
      </div>
      <div className="tl-rail-cell">
        <Marker target={ref} current={entry.current} />
      </div>
      <div className="tl-body">{entry.content}</div>
    </div>
  );
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const scrollYProgress = useScrollProgress(listRef, ["start 0.62", "end 0.58"]);
  const opacity = useTransform(scrollYProgress, [0, 0.04], [0, 1]);

  return (
    <>
      <style suppressHydrationWarning>{`
        .tl-list { position: relative; --tl-date: 148px; --tl-rail: 34px; }
        .tl-entry {
          display: grid;
          grid-template-columns: var(--tl-date) var(--tl-rail) minmax(0, 1fr);
          column-gap: 6px;
          padding-bottom: 26px;
        }
        .tl-entry:last-child { padding-bottom: 0; }

        .tl-date { position: sticky; top: 92px; align-self: start; padding-top: 6px; display: flex; flex-direction: column; gap: 4px; }
        .tl-date-main { font-family: ${MONO}; font-size: 14px; font-weight: 600; letter-spacing: -0.01em; color: var(--text-primary); line-height: 1.25; }
        .tl-date-sub  { font-family: ${MONO}; font-size: 11.5px; color: var(--text-muted); }

        .tl-rail-cell { position: relative; display: flex; justify-content: center; padding-top: 7px; }

        /* the track + the progress fill live on .tl-list, aligned to the rail column */
        .tl-track, .tl-fill {
          position: absolute; top: 0; bottom: 0;
          left: calc(var(--tl-date) + 6px + var(--tl-rail) / 2 - 1px);
          width: 2px; border-radius: 2px; pointer-events: none;
        }
        .tl-track { background: var(--border); }
        .tl-fill {
          background: linear-gradient(to bottom, #0abab5, #d4af37);
          transform-origin: top; will-change: transform;
          box-shadow: 0 0 10px rgba(10,186,181,0.35);
        }

        .tl-marker { position: relative; width: 20px; height: 20px; display: block; z-index: 1; }
        .tl-marker-ring {
          position: absolute; inset: 0; border-radius: 50%;
          background: var(--bg-base); border: 2px solid var(--border);
        }
        .tl-marker-core {
          position: absolute; inset: 4px; border-radius: 50%;
          background: #0abab5; box-shadow: 0 0 12px rgba(10,186,181,0.75);
        }
        .tl-marker-pulse {
          position: absolute; inset: 0; border-radius: 50%;
          border: 2px solid #0abab5; opacity: 0;
          animation: tl-pulse 2.4s ease-out infinite;
        }
        @keyframes tl-pulse { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.1); opacity: 0; } }

        .tl-body { min-width: 0; }

        .tl-list { isolation: isolate; }

        /* glass card: frosted pane, bright rim, specular sheen */
        .xp-card {
          position: relative; padding: 16px 18px 16px; border-radius: 16px; overflow: hidden;
          background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 46%, rgba(255,255,255,0.08) 100%);
          border: 1px solid rgba(255,255,255,0.16);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.30),
            inset 0 -1px 0 rgba(255,255,255,0.05),
            inset 0 0 28px rgba(255,255,255,0.03),
            0 16px 34px -16px rgba(0,0,0,0.75);
          -webkit-backdrop-filter: blur(16px) saturate(155%);
          backdrop-filter: blur(16px) saturate(155%);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .xp-card::before {
          content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
          background: linear-gradient(115deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.05) 22%, rgba(255,255,255,0) 40%);
        }
        .xp-card > * { position: relative; }
        .xp-card:hover { border-color: rgba(10,186,181,0.55); box-shadow: inset 0 1px 0 rgba(255,255,255,0.4), inset 0 0 28px rgba(10,186,181,0.07), 0 18px 38px -16px rgba(0,0,0,0.8); }
        html.light .xp-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.38) 50%, rgba(255,255,255,0.6) 100%);
          border-color: rgba(255,255,255,0.95);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,1),
            inset 0 -1px 0 rgba(20,40,80,0.05),
            0 14px 30px -14px rgba(36,58,96,0.35),
            0 0 0 1px rgba(20,40,80,0.06);
        }
        html.light .xp-card::before { background: linear-gradient(115deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.25) 24%, rgba(255,255,255,0) 42%); }
        html.light .xp-card:hover { border-color: rgba(10,186,181,0.7); }
        .xp-period-inline { display: none; }
        .xp-head { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 10px; }
        .xp-role { font-family: ${SF}; font-size: 17px; font-weight: 700; letter-spacing: -0.02em; line-height: 1.25; color: var(--text-primary); }
        .xp-badge {
          font-family: ${MONO}; font-size: 10.5px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase;
          padding: 2px 8px; border-radius: 999px; white-space: nowrap;
          color: #0abab5; border: 1px solid rgba(10,186,181,0.45); background: rgba(10,186,181,0.1);
        }
        .xp-badge[data-kind="Freelance"] { color: #d4af37; border-color: rgba(212,175,55,0.5); background: rgba(212,175,55,0.1); }
        html.light .xp-badge { color: #0f766e; }
        html.light .xp-badge[data-kind="Freelance"] { color: #946f0a; }
        .xp-meta { margin-top: 5px; font-family: ${MONO}; font-size: 12.5px; color: var(--text-secondary); display: flex; flex-wrap: wrap; gap: 2px 8px; align-items: center; }
        .xp-dotsep { width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted); }
        .xp-live { display: inline-flex; align-items: center; gap: 6px; color: #22c55e; font-weight: 600; }
        .xp-live::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 8px #22c55e; }
        .xp-summary { margin-top: 11px; font-family: ${SF}; font-size: 14.5px; line-height: 1.55; color: var(--text-primary); font-weight: 500; }
        .xp-points { margin: 9px 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 6px; }
        .xp-points li { position: relative; padding-left: 16px; font-family: ${SF}; font-size: 13.5px; line-height: 1.5; color: var(--text-secondary); }
        .xp-points li::before { content: ""; position: absolute; left: 1px; top: 0.62em; width: 6px; height: 6px; border-radius: 2px; background: linear-gradient(135deg, #0abab5, #d4af37); }
        .xp-stack { margin-top: 13px; display: flex; flex-wrap: wrap; gap: 6px; }
        .xp-stack .tag { font-size: 12px; padding: 2px 8px; }

        @media (max-width: 699px) {
          .tl-list { --tl-date: 0px; --tl-rail: 30px; }
          .tl-entry { grid-template-columns: var(--tl-rail) minmax(0, 1fr); column-gap: 0; padding-bottom: 20px; }
          .tl-date { display: none; }
          .tl-track, .tl-fill { left: calc(var(--tl-rail) / 2 - 1px); }
          .xp-card { padding: 14px 14px 14px; }
          .xp-period-inline { display: block; margin-bottom: 8px; font-family: ${MONO}; font-size: 12px; font-weight: 600; color: var(--text-secondary); }
          .xp-role { font-size: 16px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .tl-marker-pulse { animation: none; }
        }
      `}</style>

      <div ref={listRef} className="tl-list">
        <div className="tl-track" aria-hidden="true" />
        <motion.div className="tl-fill" aria-hidden="true" style={{ scaleY: scrollYProgress, opacity }} />
        {data.map((entry, i) => (
          <Entry key={i} entry={entry} />
        ))}
      </div>
    </>
  );
}