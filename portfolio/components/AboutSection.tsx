"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "motion/react";

import { useReveal } from "./useReveal";
import { useTheme } from "./ThemeProvider";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'SF Mono', 'Geist Mono', monospace";

const ABOUT_TEXT = `Hi, I'm [[Indresh Thakur]], currently pursuing [[B.Tech]] in [[Computer Science & Engineering (AI)]] at [[NIET Greater Noida]]. I'm a [[motivated]] and [[growth oriented]] [[Full-Stack & AI Developer]] passionate about building [[modern]], [[scalable]], and [[user-focused]] digital experiences.

My work focuses on developing [[intelligent web applications]] and [[AI-powered systems]] while continuously improving my [[problem-solving]] abilities through active [[Data Structures and Algorithms]] practice and real-world project development. I enjoy exploring [[emerging technologies]], learning new tech stacks, and turning ideas into [[impactful solutions]].

I bring a unique blend of [[technical expertise]], [[adaptability]], [[creativity]], and a genuine enthusiasm for building software that creates [[real impact]].`;

interface Token { text: string; hl: boolean; idx: number; isName: boolean; }
interface ContribDay { contributionCount: number; date: string; }
interface Week { days: ContribDay[]; }
interface LC {
  easySolved: number; totalEasy: number;
  mediumSolved: number; totalMedium: number;
  hardSolved: number; totalHard: number;
  totalSolved: number; ranking: number;
}
interface LCCalDay { date: number; count: number; }
interface HoveredCell { date: string; count: number; x: number; y: number; }

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
  const p = useSpring(raw, { stiffness: 400, damping: 28, mass: 0.2 });
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
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 20, restDelta: 0.001 });
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

function Spin({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60 }}>
      <div style={{ width: 18, height: 18, borderTop: `2px solid ${color}`, borderRight: "2px solid transparent", borderBottom: "2px solid transparent", borderLeft: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );
}

function LeetCodeLogo({ size = 30, isDark = true }: { size?: number; isDark?: boolean }) {
  // Real LeetCode logomark (the actual brand mark, not an approximation)
  // bg adapts: dark theme = #1a1a1a, light theme = #fff8f0
  const bg     = isDark ? "#1a1a1a"                   : "#fff8f0";
  const border = isDark ? "1px solid rgba(255,161,22,0.28)" : "1px solid rgba(255,161,22,0.40)";
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.26), background: bg, border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24" fill="#FFA116" xmlns="http://www.w3.org/2000/svg">
        <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" />
      </svg>
    </div>
  );
}

function GitHubLogo({ size = 30, isDark }: { size?: number; isDark: boolean }) {
  return (
    <div className="gh-logo-wrap" style={{ width: size, height: size, borderRadius: Math.round(size * 0.26), background: isDark ? "#161b22" : "#f0f6ff", border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", overflow: "hidden" }}>
      <svg className="gh-logo-svg" width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill={isDark ? "#ffffff" : "#24292f"} style={{ transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    </div>
  );
}

function DonutChart({ easy, medium, hard, totalSolved, totalProblems, attempting }: {
  easy: number; medium: number; hard: number; totalSolved: number; totalProblems: number; attempting: number;
}) {
  const size = 100, CX = 50, CY = 50, R = 38, STROKE = 8, gap = 3;
  const easyFrac = easy / totalProblems, medFrac = medium / totalProblems, hardFrac = hard / totalProblems;
  const restFrac = Math.max(0, 1 - easyFrac - medFrac - hardFrac);
  const segments = [
    { frac: easyFrac, color: "#00b8a3" }, { frac: medFrac, color: "#ffc01e" },
    { frac: hardFrac, color: "#ef4743" }, { frac: restFrac, color: "rgba(255,255,255,0.07)" },
  ];
  let offset = -90;
  const paths = segments.map((seg, i) => {
    const degrees = seg.frac * 360 - gap;
    const startRad = (offset * Math.PI) / 180;
    const x1 = CX + R * Math.cos(startRad), y1 = CY + R * Math.sin(startRad);
    const endDeg = offset + degrees, endRad = (endDeg * Math.PI) / 180;
    const x2 = CX + R * Math.cos(endRad), y2 = CY + R * Math.sin(endRad);
    const largeArc = degrees > 180 ? 1 : 0;
    offset += seg.frac * 360;
    return { d: `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`, color: seg.color, key: i };
  });
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={STROKE} />
        {paths.map(p => <path key={p.key} d={p.d} fill="none" stroke={p.color} strokeWidth={STROKE} strokeLinecap="round" />)}
        <text x={CX} y={CY - 7} textAnchor="middle" fill="var(--text-primary)" style={{ fontFamily: MONO, fontSize: 16, fontWeight: 800, letterSpacing: "-0.04em" }}>{totalSolved}</text>
        <text x={CX} y={CY + 5} textAnchor="middle" fill="var(--text-muted)" style={{ fontFamily: MONO, fontSize: 8 }}>/{totalProblems}</text>
        <text x={CX} y={CY + 16} textAnchor="middle" fill="#4ade80" style={{ fontFamily: SF, fontSize: 8, fontWeight: 600 }}>✓ Solved</text>
        <text x={CX} y={CY + 27} textAnchor="middle" fill="var(--text-muted)" style={{ fontFamily: SF, fontSize: 7 }}>{attempting} Attempting</text>
      </svg>
    </div>
  );
}

// ── Portal tooltip — renders directly into document.body, escapes ALL stacking contexts ──
function PortalTooltip({ hovered, accentColor, label }: {
  hovered: HoveredCell | null;
  accentColor: string;
  label: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !hovered) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        left: hovered.x,
        top: hovered.y,
        transform: "translate(-50%, calc(-100% - 10px))",
        pointerEvents: "none",
        // Highest possible z-index — above stat-card-3d (z-index unset), nav (z:100), scroll-arrow (z:95)
        zIndex: 2147483647,
        padding: "5px 10px",
        borderRadius: 8,
        background: "rgba(8,8,10,0.95)",
        border: `1px solid ${accentColor}60`,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: `0 0 0 1px ${accentColor}18, 0 6px 18px rgba(0,0,0,0.65)`,
        textAlign: "center",
        whiteSpace: "nowrap",
        animation: "tooltipPop 0.18s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 800, color: accentColor, fontFamily: MONO, letterSpacing: "-0.04em", lineHeight: 1.2 }}>
        {hovered.count}
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)", fontFamily: MONO, marginTop: 2 }}>
        {label} · {hovered.date}
      </div>
    </div>,
    document.body
  );
}

/* ─────────────────────────────────────────────────────
   LeetCode Stats
───────────────────────────────────────────────────── */
const LC_TOTAL = 3949;
const GLOBAL_RANK = 150000;
const MON_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS_LC = ["","Mon","","Wed","","Fri",""];

function LeetCodeStats({ username = "IThakur09" }: { username?: string }) {
  const [data, setData] = useState<LC | null>(null);
  const [loading, setLoading] = useState(true);
  const [calData, setCalData] = useState<LCCalDay[]>([]);
  const [hovered, setHovered] = useState<HoveredCell | null>(null);

  useEffect(() => {
    (async () => {
      const apis = [
        `https://leetcode-stats-api.herokuapp.com/${username}`,
        `https://alfa-leetcode-api.onrender.com/userProfile/${username}`,
      ];
      for (const url of apis) {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(8000) });
          if (!r.ok) continue;
          const j = await r.json();
          if (j && !j.error) {
            const easy = j.easySolved ?? j.totalEasySolved ?? 0;
            const medium = j.mediumSolved ?? j.totalMediumSolved ?? 0;
            const hard = j.hardSolved ?? j.totalHardSolved ?? 0;
            setData({ easySolved: easy, totalEasy: j.totalEasy ?? 947, mediumSolved: medium, totalMedium: j.totalMedium ?? 2063, hardSolved: hard, totalHard: j.totalHard ?? 939, totalSolved: j.totalSolved ?? (easy + medium + hard), ranking: j.ranking ?? GLOBAL_RANK });
            break;
          }
        } catch { /* try next */ }
      }
      setLoading(false);
    })();
  }, [username]);

  useEffect(() => {
    (async () => {
      const apis = [
        `https://alfa-leetcode-api.onrender.com/${username}/calendar`,
        `https://alfa-leetcode-api.onrender.com/userProfileCalendar?username=${username}&year=2026`,
      ];
      for (const url of apis) {
        try {
          const cr = await fetch(url, { signal: AbortSignal.timeout(6000) });
          if (!cr.ok) continue;
          const cj = await cr.json();
          const calStr = cj?.submissionCalendar ?? cj?.calendar ?? cj?.data?.matchedUser?.userCalendar?.submissionCalendar ?? "{}";
          const calObj: Record<string, number> = typeof calStr === "string" ? JSON.parse(calStr) : calStr;
          const days: LCCalDay[] = Object.entries(calObj).map(([ts, cnt]) => ({ date: Number(ts), count: Number(cnt) }));
          if (days.length > 0) { setCalData(days.sort((a, b) => a.date - b.date)); return; }
        } catch { /* try next */ }
      }
    })();
  }, [username]);

  const d = data ?? { easySolved: 197, totalEasy: 947, mediumSolved: 223, totalMedium: 2063, hardSolved: 32, totalHard: 939, totalSolved: 452, ranking: GLOBAL_RANK };

  const isTablet = typeof window !== "undefined" && window.innerWidth >= 601 && window.innerWidth <= 1024;
  const CELL = isTablet ? 14 : 10, GAP = isTablet ? 4 : 3, STEP = CELL + GAP;

  const countMap = new Map<string, number>();
  calData.forEach(day => {
    const dt = new Date(day.date * 1000);
    if (dt.getFullYear() === 2026) {
      const k = dt.toISOString().split("T")[0];
      countMap.set(k, (countMap.get(k) ?? 0) + day.count);
    }
  });

  const today = new Date(); today.setHours(0,0,0,0);
  const jan1 = new Date(2026, 0, 1);
  const startSun = new Date(jan1); startSun.setDate(startSun.getDate() - startSun.getDay());

  const lcWeeks: { date: Date; count: number }[][] = [];
  let cur = new Date(startSun);
  while (cur <= today) {
    const wk: { date: Date; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(cur); dt.setDate(cur.getDate() + i);
      const k = dt.toISOString().split("T")[0];
      wk.push({ date: dt, count: countMap.get(k) ?? 0 });
    }
    lcWeeks.push(wk);
    cur.setDate(cur.getDate() + 7);
  }

  const lcMonthLabels: { label: string; col: number }[] = [];
  lcWeeks.forEach((wk, wi) => {
    const lbl = MON_SHORT[wk[0].date.getMonth()];
    const last = lcMonthLabels[lcMonthLabels.length - 1];
    if (!last || last.label !== lbl) {
      if (!last || wi - last.col >= 2) lcMonthLabels.push({ label: lbl, col: wi });
    }
  });

  const lcLvl = (c: number) => c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 7 ? 3 : 4;
  const diffColors = { Easy: "#00b8a3", Medium: "#ffc01e", Hard: "#ef4743" };

  const handleCellEnter = useCallback((e: React.MouseEvent<HTMLDivElement>, date: string, count: number) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = "scale(1.5)";
    const cr = el.getBoundingClientRect();
    setHovered({ date, count, x: cr.left + cr.width / 2, y: cr.top });
  }, []);

  const handleCellLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).style.transform = "";
    setHovered(null);
  }, []);

  const gridContent = (
    <div style={{ display: "inline-flex", flexDirection: "column", paddingBottom: 4, minWidth: "max-content" }}>
      {/* Month labels */}
      <div style={{ display: "flex", marginBottom: 3, paddingLeft: 24 }}>
        {lcMonthLabels.map((m, i) => {
          const nextCol = lcMonthLabels[i + 1]?.col ?? lcWeeks.length;
          const w = (nextCol - m.col) * STEP;
          return (
            <div key={i} style={{ width: w, flexShrink: 0, fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, overflow: "visible", whiteSpace: "nowrap" }}>
              {m.label}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 0 }}>
        {/* Day labels */}
        <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 4 }}>
          {DAY_LABELS_LC.map((lbl, i) => (
            <div key={i} style={{ height: CELL, fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, lineHeight: `${CELL}px`, width: 20 }}>{lbl}</div>
          ))}
        </div>
        {/* Cells */}
        <div style={{ display: "flex", gap: GAP }}>
          {lcWeeks.map((wk, wi) => (
            <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
              {wk.map((day, di) => {
                const k = day.date.toISOString().split("T")[0];
                return (
                  <div
                    key={di}
                    className={`lc-cell lc-cell-${lcLvl(day.count)}`}
                    style={{ width: CELL, height: CELL, borderRadius: 2, cursor: "default", transition: "transform 0.1s" }}
                    onMouseEnter={e => handleCellEnter(e, k, day.count)}
                    onMouseLeave={handleCellLeave}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 5 }}>
        <span style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, marginRight: 3 }}>Less</span>
        {[0,1,2,3,4].map(l => <div key={l} className={`lc-cell lc-cell-${l}`} style={{ width: 9, height: 9, borderRadius: 2 }} />)}
        <span style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, marginLeft: 3 }}>More</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Portal tooltip — renders into body, no stacking context issues */}
      <PortalTooltip hovered={hovered} accentColor="#FFA116" label="submissions" />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <LeetCodeLogo size={30} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: SF }}>LeetCode</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO }}>@{username}</div>
          </div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO }}>Rank</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", fontFamily: MONO, letterSpacing: "-0.04em" }}>#{(d.ranking || GLOBAL_RANK).toLocaleString()}</span>
        </div>
      </div>
      <div style={{ height: 1, background: "var(--border)", marginBottom: 10 }} />

      {/* Desktop layout */}
      <div className="lc-body-desktop" style={{ display: "flex", gap: 0, flex: 1, minHeight: 0 }}>
        {/* Left: donut + bars */}
        <div style={{ width: "33%", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5 }}>
          {loading ? <Spin color="#FFA116" /> : (
            <>
              <DonutChart easy={d.easySolved} medium={d.mediumSolved} hard={d.hardSolved} totalSolved={d.totalSolved} totalProblems={LC_TOTAL} attempting={5} />
              <div style={{ display: "flex", flexDirection: "column", gap: 3, width: "100%", padding: "0 2px" }}>
                {[
                  { label: "Easy", solved: d.easySolved, total: d.totalEasy, color: diffColors.Easy },
                  { label: "Med.", solved: d.mediumSolved, total: d.totalMedium, color: diffColors.Medium },
                  { label: "Hard", solved: d.hardSolved, total: d.totalHard, color: diffColors.Hard },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "2px 6px", borderRadius: 5, background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: row.color, fontFamily: MONO }}>{row.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: "var(--text-primary)", fontFamily: MONO }}>{row.solved}<span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/{row.total}</span></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0, margin: "0 8px" }} />
        {/* Right: grid */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginBottom: 4 }}>2026 activity</div>
          <div
            style={{ width: "100%", overflowX: "auto", overflowY: "visible", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin", scrollbarColor: "rgba(255,161,22,0.3) transparent" }}
            onMouseLeave={() => setHovered(null)}
          >
            {gridContent}
          </div>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lc-body-mobile" style={{ display: "none", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {loading ? <Spin color="#FFA116" /> : (
            <>
              <DonutChart easy={d.easySolved} medium={d.mediumSolved} hard={d.hardSolved} totalSolved={d.totalSolved} totalProblems={LC_TOTAL} attempting={5} />
              <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                {[
                  { label: "Easy", solved: d.easySolved, total: d.totalEasy, color: diffColors.Easy },
                  { label: "Med.", solved: d.mediumSolved, total: d.totalMedium, color: diffColors.Medium },
                  { label: "Hard", solved: d.hardSolved, total: d.totalHard, color: diffColors.Hard },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "3px 7px", borderRadius: 6, background: "var(--bg-secondary)", border: "1px solid var(--border)" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: row.color, fontFamily: MONO }}>{row.label}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text-primary)", fontFamily: MONO }}>{row.solved}<span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/{row.total}</span></span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <div style={{ height: 1, background: "var(--border)" }} />
        <div>
          <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginBottom: 4 }}>2026 activity</div>
          <div
            style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin" }}
            onMouseLeave={() => setHovered(null)}
          >
            {gridContent}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────
   GitHub Graph
───────────────────────────────────────────────────── */
const MONTHS_GH = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS_GH = ["","Mon","","Wed","","Fri",""];

function GitHubGraph({ username = "Ithakur2327" }: { username?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [hovered, setHovered] = useState<HoveredCell | null>(null);

  useEffect(() => {
    (async () => {
      const apis = [
        `https://github-contributions-api.jogruber.de/v4/${username}?y=2026`,
        `https://github-contributions-api.jogruber.de/v4/${username}`,
      ];
      for (const url of apis) {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(9000) });
          if (!r.ok) continue;
          const json = await r.json();
          const c: { date: string; count: number }[] | undefined = json.contributions ?? json.data ?? json;
          if (!Array.isArray(c) || !c.length) continue;
          const c2026 = c.filter(x => x.date?.startsWith("2026"));
          if (!c2026.length) continue;
          const tot = c2026.reduce((a, b) => a + b.count, 0);
          setTotal(tot);
          const today = new Date(); today.setHours(0,0,0,0);
          const jan1 = new Date(2026,0,1);
          const startSun = new Date(jan1); startSun.setDate(startSun.getDate() - startSun.getDay());
          const dateMap = new Map(c2026.map(x => [x.date, x.count]));
          const ws: Week[] = [];
          let cur = new Date(startSun);
          while (cur <= today) {
            const days: ContribDay[] = [];
            for (let i = 0; i < 7; i++) {
              const dt = new Date(cur); dt.setDate(cur.getDate() + i);
              const k = dt.toISOString().split("T")[0];
              days.push({ contributionCount: dateMap.get(k) ?? 0, date: k });
            }
            ws.push({ days });
            cur.setDate(cur.getDate() + 7);
          }
          setWeeks(ws); setIsLive(true); setLoading(false);
          return;
        } catch { /* try next */ }
      }
      // fallback
      const today = new Date(); today.setHours(0,0,0,0);
      const jan1 = new Date(2026,0,1);
      const startSun = new Date(jan1); startSun.setDate(startSun.getDate() - startSun.getDay());
      const ws: Week[] = [];
      let cur = new Date(startSun);
      while (cur <= today) {
        const days: ContribDay[] = [];
        for (let i = 0; i < 7; i++) {
          const dt = new Date(cur); dt.setDate(cur.getDate() + i);
          days.push({ contributionCount: 0, date: dt.toISOString().split("T")[0] });
        }
        ws.push({ days });
        cur.setDate(cur.getDate() + 7);
      }
      setWeeks(ws); setIsLive(false); setLoading(false);
    })();
  }, [username]);

  const lvl = (n: number) => n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4;
  const isTablet = typeof window !== "undefined" && window.innerWidth >= 601 && window.innerWidth <= 1024;
  const CELL = isTablet ? 14 : 10, GAP = isTablet ? 4 : 3, STEP = CELL + GAP;
  const contribColor = isDark ? "#ffffff" : "#000000";

  const monthLabels: { label: string; col: number }[] = [];
  weeks.forEach((w, wi) => {
    if (!w.days[0]) return;
    const d = new Date(w.days[0].date + "T00:00:00");
    const lbl = MONTHS_GH[d.getMonth()];
    const last = monthLabels[monthLabels.length - 1];
    if (!last || last.label !== lbl) {
      if (!last || wi - last.col >= 1) monthLabels.push({ label: lbl, col: wi });
    }
  });

  const handleCellEnter = useCallback((e: React.MouseEvent<HTMLDivElement>, date: string, count: number) => {
    const el = e.currentTarget as HTMLElement;
    el.style.transform = "scale(1.35)";
    const cr = el.getBoundingClientRect();
    setHovered({ date, count, x: cr.left + cr.width / 2, y: cr.top });
  }, []);

  const handleCellLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    (e.currentTarget as HTMLElement).style.transform = "";
    setHovered(null);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Portal tooltip — renders into body */}
      <PortalTooltip hovered={hovered} accentColor="#4ade80" label="contributions" />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <GitHubLogo size={30} isDark={isDark} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: SF }}>GitHub</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO }}>@{username} ↗</div>
          </div>
        </a>
        {isLive && total !== null && total > 0 ? (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: contribColor, fontFamily: MONO, letterSpacing: "-0.05em", lineHeight: 1 }}>{total.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginTop: 2 }}>contributions this year</div>
          </div>
        ) : !loading ? (
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, textDecoration: "none", opacity: 0.7 }}>View on GitHub ↗</a>
        ) : null}
      </div>
      <div style={{ height: 1, background: "var(--border)", marginBottom: 10 }} />

      {loading ? <Spin color="#FFA116" /> : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginBottom: 4 }}>
            {isLive ? "2026 contributions" : "2026 activity (preview)"}
          </div>
          <div
            style={{ flex: 1, width: "100%", overflowX: "auto", overflowY: "visible", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin", scrollbarColor: "rgba(255,161,22,0.3) transparent" }}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ display: "inline-flex", flexDirection: "column", paddingBottom: 4, minWidth: "max-content" }}>
              {/* Month labels */}
              <div style={{ display: "flex", marginBottom: 4, paddingLeft: 26 }}>
                {monthLabels.map((m, i) => {
                  const nextCol = monthLabels[i + 1]?.col ?? weeks.length;
                  const boxW = (nextCol - m.col) * STEP;
                  return (
                    <div key={i} style={{ width: boxW, flexShrink: 0, fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, overflow: "visible", whiteSpace: "nowrap", lineHeight: "16px" }}>
                      {m.label}
                    </div>
                  );
                })}
              </div>
              <div style={{ display: "flex", gap: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 4 }}>
                  {DAYS_GH.map((lbl, i) => (
                    <div key={i} style={{ height: CELL, fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, lineHeight: `${CELL}px`, userSelect: "none", width: 22 }}>{lbl}</div>
                  ))}
                </div>
                <div style={{ display: "flex", gap: GAP }}>
                  {weeks.map((w, wi) => (
                    <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                      {w.days.map((day, di) => (
                        <div
                          key={di}
                          className={`gh-cell gh-cell-${lvl(day.contributionCount)}`}
                          style={{ width: CELL, height: CELL, borderRadius: 2, cursor: "default", transition: "transform 0.1s" }}
                          onMouseEnter={e => handleCellEnter(e, day.date, day.contributionCount)}
                          onMouseLeave={handleCellLeave}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
                <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO }}>{isLive ? "Contribution activity" : "preview"}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginRight: 3 }}>Less</span>
                  {[0,1,2,3,4].map(l => <div key={l} className={`gh-cell gh-cell-${l}`} style={{ width: 10, height: 10, borderRadius: 2 }} />)}
                  <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginLeft: 3 }}>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes tooltipPop {
          from { opacity: 0; transform: translate(-50%, calc(-100% - 4px)) scale(0.80); }
          to   { opacity: 1; transform: translate(-50%, calc(-100% - 10px)) scale(1); }
        }
        @keyframes lcPulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .lc-logo-outer { animation: lcPulse 2.4s ease-in-out infinite; }
        .lc-logo-bar   { animation: lcPulse 2.4s ease-in-out infinite 0.6s; }

        .gh-logo-wrap:hover .gh-logo-svg {
          transform: rotate(360deg);
          transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
        }

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

        .gh-cell-0 { background: rgba(255,255,255,0.04); outline: 1px solid rgba(255,255,255,0.10); outline-offset: -1px; }
        .gh-cell-1 { background: #fac68f; }
        .gh-cell-2 { background: #c46212; }
        .gh-cell-3 { background: #984b10; }
        .gh-cell-4 { background: #e3d04f; }

        .lc-cell-0 { background: rgba(255,255,255,0.04); outline: 1px solid rgba(255,255,255,0.10); outline-offset: -1px; }
        .lc-cell-1 { background: #fac68f; }
        .lc-cell-2 { background: #c46212; }
        .lc-cell-3 { background: #984b10; }
        .lc-cell-4 { background: #e3d04f; }

        html.light .name-highlight { color: #16a34a; background: rgba(22,163,74,0.08); border-color: rgba(22,163,74,0.20); box-shadow: none; }
        html.light .gold-box-word { color: #d97706 !important; background: rgba(245,158,11,0.13) !important; border-color: rgba(217,119,6,0.45) !important; }
        html.light .gh-cell-0 { background: #e8eaec; outline: 1px solid rgba(0,0,0,0.08); outline-offset: -1px; }
        html.light .gh-cell-1 { background: #fac68f; }
        html.light .gh-cell-2 { background: #c46212; }
        html.light .gh-cell-3 { background: #984b10; }
        html.light .gh-cell-4 { background: #1f2328; }
        html.light .lc-cell-0 { background: #e8eaec; outline: 1px solid rgba(0,0,0,0.08); outline-offset: -1px; }
        html.light .lc-cell-1 { background: #fac68f; }
        html.light .lc-cell-2 { background: #c46212; }
        html.light .lc-cell-3 { background: #984b10; }
        html.light .lc-cell-4 { background: #1f2328; }

        /* 3D cards */
        .stat-card-3d {
          padding: 14px;
          background: #080809;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          position: relative;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s cubic-bezier(0.16,1,0.3,1);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.04) inset,
            0 2px 4px rgba(0,0,0,0.60),
            0 8px 20px rgba(0,0,0,0.50),
            0 20px 40px rgba(0,0,0,0.35);
          display: flex;
          flex-direction: column;
          /* CRITICAL: do NOT set overflow:hidden — it clips portal tooltips on some browsers */
          overflow: visible;
        }
        .stat-card-3d:hover {
          transform: translateY(-4px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.07) inset,
            0 4px 8px rgba(0,0,0,0.65),
            0 14px 30px rgba(0,0,0,0.55),
            0 28px 56px rgba(0,0,0,0.40);
        }
        html.light .stat-card-3d {
          background: #ffffff;
          border-color: rgba(0,0,0,0.09);
          box-shadow: 0 1px 2px rgba(0,0,0,0.07), 0 4px 10px rgba(0,0,0,0.05);
        }
        html.light .stat-card-3d:hover {
          box-shadow: 0 6px 14px rgba(0,0,0,0.09), 0 12px 28px rgba(0,0,0,0.07);
        }

        .about-panels {
          display: grid;
          gap: 14px;
          align-items: stretch;
          grid-template-columns: 1fr 1fr;
        }

        @media (min-width: 601px) and (max-width: 1024px) {
          .about-panels { grid-template-columns: 1fr !important; }
          .stat-card-3d { width: 100% !important; min-width: 0 !important; min-height: 220px; }
          /* Graph cells scale up so graph fills card width */
          .gh-cell { width: 14px !important; height: 14px !important; border-radius: 3px !important; }
          .lc-cell { width: 14px !important; height: 14px !important; border-radius: 3px !important; }
        }
        @media (max-width: 639px) {
          .about-panels { grid-template-columns: 1fr; }
        }

        .about-content {
          max-width: 1060px; margin: 0 auto; padding: 0 20px 40px;
        }
        @media (max-width: 860px) { .about-content { padding: 0 22px 34px; } }
        @media (max-width: 639px) {
          .about-content  { padding: 0 14px 28px; }
          .about-para     { font-size: 14px !important; line-height: 1.8 !important; }
          .stat-card-3d   { width: 100% !important; min-width: 0 !important; padding: 12px !important; }
          .lc-body-desktop { display: none !important; }
          .lc-body-mobile  { display: flex !important; }
        }

        .stat-card-3d ::-webkit-scrollbar { height: 4px; }
        .stat-card-3d ::-webkit-scrollbar-track { background: transparent; }
        .stat-card-3d ::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(128,128,128,0.25); }
      `}</style>

      <section ref={ref} className={revealClass}>
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="about-content">
            <div style={{ paddingTop: 28 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>About</span>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 28px" }} />
            <div style={{ marginBottom: 40 }}>
              <ScrollRevealText />
            </div>
          </div>
        </div>
      </section>

      <section className={revealClass}>
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="about-content">
            <div style={{ paddingTop: 28 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>Stats</span>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 28px" }} />
            <div className="about-panels" style={{ paddingBottom: 32 }}>
              <div className="stat-card-3d">
                <GitHubGraph username="Ithakur2327" />
              </div>
              <div className="stat-card-3d">
                <LeetCodeStats username="IThakur09" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}