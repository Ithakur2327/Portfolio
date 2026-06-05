"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

import { useReveal } from "./useReveal";
import { useTheme } from "./ThemeProvider";

const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'SF Mono', 'Geist Mono', monospace";

/* ──────────────────────────────────────────────────────────
   ABOUT TEXT
────────────────────────────────────────────────────────── */
const ABOUT_TEXT = `Hi, I'm [[Indresh Thakur]], currently pursuing [[B.Tech]] in [[Computer Science & Engineering (AI)]] at [[NIET Greater Noida]]. I'm a [[motivated]] and [[growth oriented]] [[Full-Stack & AI Developer]] passionate about building [[modern]], [[scalable]], and [[user-focused]] digital experiences.

My work focuses on developing [[intelligent web applications]] and [[AI-powered systems]] while continuously improving my [[problem-solving]] abilities through active [[Data Structures and Algorithms]] practice and real-world project development. I enjoy exploring [[emerging technologies]], learning new tech stacks, and turning ideas into [[impactful solutions]].

I bring a unique blend of [[technical expertise]], [[adaptability]], [[creativity]], and a genuine enthusiasm for building software that creates [[real impact]].`;

/* ──────────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────────── */
interface Token { text: string; hl: boolean; idx: number; isName: boolean; }
interface ContribDay { contributionCount: number; date: string; }
interface Week { days: ContribDay[]; }
interface LC {
  easySolved: number; totalEasy: number;
  mediumSolved: number; totalMedium: number;
  hardSolved: number; totalHard: number;
  totalSolved: number; ranking: number;
}
interface LCStreak { currentStreak: number; maxStreak: number; totalActiveDays: number; }
interface LCCalDay { date: number; count: number; }

/* ──────────────────────────────────────────────────────────
   PARSER
────────────────────────────────────────────────────────── */
function parse(raw: string): Token[][] {
  let g = 0;
  return raw.split("\n\n").map((para) => {
    const tokens: Token[] = [];
    const re = /\[\[(.+?)\]\]|([^\[]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(para)) !== null) {
      if (m[1]) {
        tokens.push({ text: m[1], hl: true, idx: g++, isName: m[1] === "Indresh Thakur" });
      } else {
        tokens.push({ text: m[2], hl: false, idx: -1, isName: false });
      }
    }
    return tokens;
  });
}

/* ──────────────────────────────────────────────────────────
   GOLD WORD
────────────────────────────────────────────────────────── */
function GoldWord({ text, idx, total, progress, isName }: {
  text: string; idx: number; total: number; progress: MotionValue<number>; isName: boolean;
}) {
  const s = Math.max(0, (idx - 0.2) / total);
  const e = Math.min(1, (idx + 0.4) / total);
  const raw = useTransform(progress, [s, e], [0, 1]);
  const p = useSpring(raw, { stiffness: 400, damping: 28, mass: 0.2 });
  const opacity = useTransform(p, [0, 0.15, 1], [0.25, 0.65, 1]);

  if (isName) {
    return (
      <motion.span style={{ opacity, display: "inline", verticalAlign: "baseline" }}>
        <span className="name-highlight">{text}</span>
      </motion.span>
    );
  }
  return (
    <motion.span className="gold-box-word" style={{ opacity, display: "inline", verticalAlign: "baseline" }}>
      {text}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────
   SCROLL REVEAL TEXT
────────────────────────────────────────────────────────── */
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
            t.hl ? (
              <GoldWord key={ti} text={t.text} idx={t.idx} total={total} progress={smooth} isName={t.isName} />
            ) : (
              <span key={ti} style={{ color: "var(--text-primary)", display: "inline" }}>{t.text}</span>
            )
          )}
        </p>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SPINNER
────────────────────────────────────────────────────────── */
function Spin({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60 }}>
      <div style={{
        width: 18, height: 18,
        borderTop: `2px solid ${color}`, borderRight: "2px solid transparent",
        borderBottom: "2px solid transparent", borderLeft: "2px solid transparent",
        borderRadius: "50%", animation: "spin 0.7s linear infinite",
      }} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   DONUT CHART (LeetCode visual)
────────────────────────────────────────────────────────── */
function DonutChart({ easy, medium, hard, totalSolved, totalProblems, attempting }: {
  easy: number; medium: number; hard: number;
  totalSolved: number; totalProblems: number; attempting: number;
}) {
  const R = 70;
  const CX = 90, CY = 90;
  const STROKE = 10;
  const circumference = 2 * Math.PI * R;
  const gap = 4; // gap in degrees between segments
  const gapFraction = gap / 360;

  // fractions of total problems
  const easyFrac = easy / totalProblems;
  const medFrac = medium / totalProblems;
  const hardFrac = hard / totalProblems;
  const restFrac = 1 - easyFrac - medFrac - hardFrac;

  // Each segment gets its fraction minus gap
  const segments = [
    { frac: easyFrac, color: "#00b8a3" },   // teal/easy
    { frac: medFrac, color: "#ffc01e" },     // yellow/medium
    { frac: hardFrac, color: "#ef4743" },    // red/hard
    { frac: restFrac, color: "rgba(255,255,255,0.06)" }, // remainder
  ];

  let offset = -90; // start from top
  const paths = segments.map((seg, i) => {
    const degrees = seg.frac * 360 - gap;
    const dashLen = (degrees / 360) * circumference;
    const startDeg = offset;
    const startRad = (startDeg * Math.PI) / 180;
    const x1 = CX + R * Math.cos(startRad);
    const y1 = CY + R * Math.sin(startRad);
    const endDeg = startDeg + degrees;
    const endRad = (endDeg * Math.PI) / 180;
    const x2 = CX + R * Math.cos(endRad);
    const y2 = CY + R * Math.sin(endRad);
    const largeArc = degrees > 180 ? 1 : 0;
    offset += seg.frac * 360;

    const d = `M ${x1} ${y1} A ${R} ${R} 0 ${largeArc} 1 ${x2} ${y2}`;
    return { d, color: seg.color, key: i };
  });

  return (
    <svg width={CX * 2} height={CY * 2} viewBox={`0 0 ${CX * 2} ${CY * 2}`} style={{ overflow: "visible" }}>
      {/* Background ring */}
      <circle cx={CX} cy={CY} r={R} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={STROKE} />
      {/* Segments */}
      {paths.map(p => (
        <path key={p.key} d={p.d} fill="none" stroke={p.color} strokeWidth={STROKE}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
      ))}
      {/* Center text */}
      <text x={CX} y={CY - 10} textAnchor="middle" fill="var(--text-primary)"
        style={{ fontFamily: MONO, fontSize: 22, fontWeight: 800, letterSpacing: "-0.04em" }}>
        {totalSolved}
      </text>
      <text x={CX} y={CY + 6} textAnchor="middle" fill="var(--text-muted)"
        style={{ fontFamily: MONO, fontSize: 10 }}>
        /{totalProblems}
      </text>
      {/* Solved tick */}
      <text x={CX} y={CY + 22} textAnchor="middle" fill="#4ade80"
        style={{ fontFamily: SF, fontSize: 11, fontWeight: 600 }}>
        ✓ Solved
      </text>
      {/* Attempting */}
      <text x={CX} y={CY + 54} textAnchor="middle" fill="var(--text-muted)"
        style={{ fontFamily: MONO, fontSize: 9 }}>
        {attempting} Attempting
      </text>
    </svg>
  );
}

/* ──────────────────────────────────────────────────────────
   LEETCODE PANEL — Left: donut (40%), Right: scrollable streak (60%)
────────────────────────────────────────────────────────── */
function LeetCodeStats({ username = "IThakur09" }: { username?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<LC | null>(null);
  const [loading, setLoading] = useState(true);
  const [calData, setCalData] = useState<LCCalDay[]>([]);
  const [streak, setStreak] = useState<LCStreak | null>(null);
  const [hoveredSubmissions, setHoveredSubmissions] = useState<{ date: string; count: number } | null>(null);

  // HARDCODED global rank — change this value anytime
  const GLOBAL_RANK = 150000;

  useEffect(() => {
    const run = async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
          fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`),
        ]);
        const [j1, j2] = await Promise.all([r1.json(), r2.json()]);
        const easySolved = j2.easySolved ?? 0;
        const mediumSolved = j2.mediumSolved ?? 0;
        const hardSolved = j2.hardSolved ?? 0;
        setData({
          easySolved, totalEasy: j2.totalEasy ?? 946,
          mediumSolved, totalMedium: j2.totalMedium ?? 2061,
          hardSolved, totalHard: j2.totalHard ?? 937,
          totalSolved: j1.solvedProblem ?? (easySolved + mediumSolved + hardSolved),
          ranking: GLOBAL_RANK,
        });
      } catch { /* use fallback */ }
      finally { setLoading(false); }
    };
    run();
  }, [username]);

  // Fetch streak + calendar
  useEffect(() => {
    const run = async () => {
      try {
        const [sr, cr] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/streak`),
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/calendar`),
        ]);
        const [sj, cj] = await Promise.all([sr.json(), cr.json()]);
        if (sj) {
          setStreak({
            currentStreak: sj.currentStreak ?? sj.streak ?? 0,
            maxStreak: sj.maxStreak ?? sj.longestStreak ?? 0,
            totalActiveDays: sj.totalActiveDays ?? 0,
          });
        }
        const calStr = cj?.submissionCalendar ?? cj?.calendar ?? "{}";
        const calObj: Record<string, number> = typeof calStr === "string" ? JSON.parse(calStr) : calStr;
        const days: LCCalDay[] = Object.entries(calObj).map(([ts, cnt]) => ({
          date: Number(ts), count: Number(cnt),
        }));
        setCalData(days.sort((a, b) => a.date - b.date));
      } catch {
        // Fake full year data
        const now = Date.now() / 1000;
        const fake: LCCalDay[] = [];
        for (let i = 364; i >= 0; i--) {
          const ts = now - i * 86400;
          const r = Math.random();
          if (r > 0.45) fake.push({ date: ts, count: r > 0.85 ? 5 : r > 0.7 ? 3 : 1 });
        }
        setCalData(fake);
        setStreak({ currentStreak: 7, maxStreak: 22, totalActiveDays: 45 });
      }
    };
    run();
  }, [username]);

  const displayData = data ?? {
    easySolved: 197, totalEasy: 947,
    mediumSolved: 223, totalMedium: 2063,
    hardSolved: 32, totalHard: 939,
    totalSolved: 452, ranking: GLOBAL_RANK,
  };

  const totalProblems = displayData.totalEasy + displayData.totalMedium + displayData.totalHard;
  const attempting = 5;

  // Build full-year streak calendar grid
  const CELL = 9, GAP = 2.5, STEP = CELL + GAP;
  const MON_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const DAY_LABELS = ["","Mon","","Wed","","Fri",""];

  const countMap = new Map<string, number>();
  calData.forEach(d => {
    const k = new Date(d.date * 1000).toISOString().split("T")[0];
    countMap.set(k, (countMap.get(k) ?? 0) + d.count);
  });

  // Build 53 weeks (full year) ending today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDay = today.getDay();
  const endDate = new Date(today);
  const daysToSat = (6 - todayDay + 7) % 7;
  endDate.setDate(endDate.getDate() + daysToSat);

  const lcWeeks: { date: Date; count: number }[][] = [];
  for (let w = 52; w >= 0; w--) {
    const week: { date: Date; count: number }[] = [];
    for (let d = 0; d < 7; d++) {
      const dt = new Date(endDate);
      dt.setDate(endDate.getDate() - w * 7 - (6 - d));
      const k = dt.toISOString().split("T")[0];
      week.push({ date: dt, count: countMap.get(k) ?? 0 });
    }
    lcWeeks.push(week);
  }

  // Month labels
  const lcMonthLabels: { label: string; col: number }[] = [];
  lcWeeks.forEach((wk, wi) => {
    const m = wk[0].date.getMonth();
    const last = lcMonthLabels[lcMonthLabels.length - 1];
    const lbl = MON_SHORT[m];
    if (!last || last.label !== lbl) {
      if (!last || wi - last.col >= 2) lcMonthLabels.push({ label: lbl, col: wi });
    }
  });

  const lcLvl = (c: number) => c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 7 ? 3 : 4;

  const diffColors = { Easy: "#00b8a3", Medium: "#ffc01e", Hard: "#ef4743" };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer"
          style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.75"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
        >
          <div style={{ width: 34, height: 34, borderRadius: 9, background: isDark ? "#1a1200" : "#fff7e6", border: `1px solid ${isDark ? "#3d2e00" : "#f0c070"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" fill="#FFA116"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: SF }}>LeetCode</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO }}>@{username}</div>
          </div>
        </a>
        {/* Global Rank — hardcoded, always visible */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: MONO }}>Rank</span>
          <span style={{ fontSize: 18, fontWeight: 800, color: isDark ? "#ffffff" : "#000000", fontFamily: MONO, letterSpacing: "-0.04em" }}>
            #{GLOBAL_RANK.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border)", marginBottom: 12 }} />

      {/* Main body: left donut 40% + right scroll 60% */}
      <div style={{ display: "flex", gap: 0, flex: 1, minHeight: 0, overflow: "hidden" }}>

        {/* ── LEFT 40%: Donut + difficulty labels (STATIC, no scroll) ── */}
        <div style={{ width: "40%", flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
          {loading ? <Spin color="#FFA116" /> : (
            <>
              <DonutChart
                easy={displayData.easySolved}
                medium={displayData.mediumSolved}
                hard={displayData.hardSolved}
                totalSolved={displayData.totalSolved}
                totalProblems={totalProblems}
                attempting={attempting}
              />
              {/* Difficulty labels */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5, width: "100%", padding: "0 8px" }}>
                {[
                  { label: "Easy", solved: displayData.easySolved, total: displayData.totalEasy, color: diffColors.Easy },
                  { label: "Med.", solved: displayData.mediumSolved, total: displayData.totalMedium, color: diffColors.Medium },
                  { label: "Hard", solved: displayData.hardSolved, total: displayData.totalHard, color: diffColors.Hard },
                ].map(d => (
                  <div key={d.label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "5px 8px", borderRadius: 7,
                    background: "var(--bg-secondary)", border: "1px solid var(--border)",
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: d.color, fontFamily: MONO, letterSpacing: "0.03em" }}>{d.label}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", fontFamily: MONO }}>
                      {d.solved}<span style={{ color: "var(--text-muted)", fontWeight: 400 }}>/{d.total}</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Vertical divider */}
        <div style={{ width: 1, background: "var(--border)", flexShrink: 0, margin: "0 10px" }} />

        {/* ── RIGHT 60%: Hover tooltip + scrollable streak calendar ── */}
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
          {/* Hover tooltip area — above streak graph */}
          <div style={{
            height: 44, display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 6,
          }}>
            {hoveredSubmissions ? (
              <motion.div
                initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "6px 14px", borderRadius: 8,
                  background: "var(--bg-secondary)", border: "1px solid rgba(255,161,22,0.35)",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 16, fontWeight: 800, color: "#FFA116", fontFamily: MONO, letterSpacing: "-0.04em", lineHeight: 1 }}>
                  {hoveredSubmissions.count}
                </div>
                <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginTop: 2 }}>
                  submissions on {hoveredSubmissions.date}
                </div>
              </motion.div>
            ) : (
              <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, opacity: 0.6 }}>
                hover a cell to see submissions
              </div>
            )}
          </div>

          {/* Streak stats row */}
          {streak && (
            <div style={{ display: "flex", gap: 5, marginBottom: 8 }}>
              {[
                { label: "Current", value: streak.currentStreak, suffix: "d", color: "#fb923c" },
                { label: "Max", value: streak.maxStreak, suffix: "d", color: "#f87171" },
                { label: "Active", value: streak.totalActiveDays, suffix: "", color: "#FFA116" },
              ].map(s => (
                <div key={s.label} style={{
                  flex: 1, padding: "5px 4px", borderRadius: 7,
                  background: "var(--bg-secondary)", border: "1px solid var(--border)",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: s.color, fontFamily: MONO, letterSpacing: "-0.04em", lineHeight: 1 }}>
                    {s.value}{s.suffix}
                  </div>
                  <div style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Scrollable streak calendar — full year, horizontal scroll */}
          <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginBottom: 3 }}>
            This year's activity
          </div>
          <div style={{ overflowX: "auto", overflowY: "hidden", flex: 1,
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,161,22,0.3) transparent",
          }}>
            <div style={{ display: "inline-flex", flexDirection: "column", paddingBottom: 4 }}>
              {/* Month labels */}
              <div style={{ display: "flex", marginBottom: 3, paddingLeft: 22 }}>
                {lcMonthLabels.map((m, i) => {
                  const nextCol = lcMonthLabels[i + 1]?.col ?? lcWeeks.length;
                  const w = (nextCol - m.col) * STEP;
                  return (
                    <div key={i} style={{ width: w, flexShrink: 0, fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, overflow: "hidden", whiteSpace: "nowrap" }}>
                      {m.label}
                    </div>
                  );
                })}
              </div>
              {/* Grid */}
              <div style={{ display: "flex", gap: 0 }}>
                {/* Day labels */}
                <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 3 }}>
                  {DAY_LABELS.map((d, i) => (
                    <div key={i} style={{ height: CELL, fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, lineHeight: `${CELL}px`, width: 20 }}>{d}</div>
                  ))}
                </div>
                {/* Cells */}
                <div style={{ display: "flex", gap: GAP }}>
                  {lcWeeks.map((wk, wi) => (
                    <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                      {wk.map((day, di) => (
                        <div
                          key={di}
                          className={`lc-cell lc-cell-${lcLvl(day.count)}`}
                          style={{ width: CELL, height: CELL, borderRadius: 2, cursor: "default", transition: "transform 0.1s" }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.transform = "scale(1.5)";
                            setHoveredSubmissions({ date: day.date.toISOString().split("T")[0], count: day.count });
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.transform = "";
                            setHoveredSubmissions(null);
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* Legend */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 5 }}>
                <span style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, marginRight: 3 }}>Less</span>
                {[0, 1, 2, 3, 4].map(l => <div key={l} className={`lc-cell lc-cell-${l}`} style={{ width: 9, height: 9, borderRadius: 2 }} />)}
                <span style={{ fontSize: 8, color: "var(--text-muted)", fontFamily: MONO, marginLeft: 3 }}>More</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   GITHUB GRAPH
────────────────────────────────────────────────────────── */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

function buildMockWeeks(): Week[] {
  const weeks: Week[] = [];
  const now = new Date();
  for (let w = 52; w >= 0; w--) {
    const days: ContribDay[] = [];
    const isRecent = w <= 3;
    for (let d = 0; d < 7; d++) {
      const date = new Date(now);
      date.setDate(date.getDate() - (w * 7 + (6 - d)));
      const r = Math.random();
      let count: number;
      if (isRecent) {
        count = r < 0.15 ? 0 : r < 0.35 ? 1 : r < 0.55 ? 3 : r < 0.72 ? 6 : r < 0.88 ? 9 : 12;
      } else {
        count = r < 0.40 ? 0 : r < 0.58 ? 1 : r < 0.74 ? 3 : r < 0.87 ? 6 : r < 0.94 ? 9 : 12;
      }
      days.push({ contributionCount: count, date: date.toISOString().split("T")[0] });
    }
    weeks.push({ days });
  }
  return weeks;
}

function GitHubGraph({ username = "Ithakur2327" }: { username?: string }) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [hoveredCell, setHoveredCell] = useState<{ date: string; count: number } | null>(null);

  useEffect(() => {
    const fetchContributions = async () => {
      const apis = [
        `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
        `https://github-contributions-api.jogruber.de/v4/${username}`,
      ];
      for (const url of apis) {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(9000) });
          if (!r.ok) continue;
          const json = await r.json();
          let c: { date: string; count: number }[] | undefined =
            json.contributions ?? json.data ?? json;
          if (!Array.isArray(c) || !c.length) continue;
          const tot = c.reduce((a: number, b: { count: number }) => a + b.count, 0);
          setTotal(tot);
          const ws: Week[] = [];
          for (let i = 0; i < c.length; i += 7) {
            ws.push({ days: c.slice(i, i + 7).map((x) => ({ contributionCount: x.count, date: x.date })) });
          }
          setWeeks(ws.slice(-53));
          setIsLive(true);
          setLoading(false);
          return;
        } catch { /* try next */ }
      }
      setWeeks(buildMockWeeks());
      setIsLive(false);
      setLoading(false);
    };
    fetchContributions();
  }, [username]);

  const lvl = (n: number) => n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4;

  const CELL = 10, GAP = 3, STEP = CELL + GAP;

  // Month labels — ensure Jun always shows when month changes
  const monthLabels: { label: string; col: number }[] = [];
  weeks.forEach((w, wi) => {
    if (w.days[0]) {
      const d = new Date(w.days[0].date + "T00:00:00");
      const lbl = MONTHS[d.getMonth()];
      const last = monthLabels[monthLabels.length - 1];
      // Show label at month boundary: either first week or when month changes
      if (!last || last.label !== lbl) {
        if (!last || wi - last.col >= 1) {
          monthLabels.push({ label: lbl, col: wi });
        }
      }
    }
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="var(--text-primary)">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", fontFamily: SF }}>GitHub</div>
            <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer"
              style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"}
            >@{username} ↗</a>
          </div>
        </div>
        {isLive && total !== null && total > 0 ? (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#4ade80", fontFamily: MONO, letterSpacing: "-0.05em", lineHeight: 1 }}>{total.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, marginTop: 2 }}>contributions this year</div>
          </div>
        ) : !loading ? (
          <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer"
            style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: MONO, textDecoration: "none", opacity: 0.7 }}>
            View on GitHub ↗
          </a>
        ) : null}
      </div>

      <div style={{ height: 1, background: "var(--border)", marginBottom: 10 }} />

      {/* Hover tooltip — above graph, centered */}
      <div style={{
        height: 42, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 6,
      }}>
        {hoveredCell ? (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            style={{
              padding: "6px 14px", borderRadius: 8,
              background: "var(--bg-secondary)", border: "1px solid rgba(74,222,128,0.35)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 16, fontWeight: 800, color: "#4ade80", fontFamily: MONO, letterSpacing: "-0.04em", lineHeight: 1 }}>
              {hoveredCell.count}
            </div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginTop: 2 }}>
              contributions on {hoveredCell.date}
            </div>
          </motion.div>
        ) : (
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, opacity: 0.6 }}>
            hover a cell to see contributions
          </div>
        )}
      </div>

      {loading ? <Spin color="#4ade80" /> : (
        /* Scrollable graph */
        <div style={{
          overflowX: "auto", overflowY: "hidden",
          scrollbarWidth: "thin", scrollbarColor: "rgba(74,222,128,0.3) transparent",
        }}>
          <div style={{ display: "inline-flex", flexDirection: "column", paddingBottom: 4 }}>
            {/* Month labels */}
            <div style={{ display: "flex", marginBottom: 4, paddingLeft: 26 }}>
              {monthLabels.map((m, i) => {
                const nextCol = monthLabels[i + 1]?.col ?? weeks.length;
                const slots = nextCol - m.col;
                const boxW = slots * STEP;
                return (
                  <div key={i} style={{
                    width: boxW, flexShrink: 0, fontSize: 9, color: "var(--text-muted)",
                    fontFamily: MONO, overflow: "hidden", whiteSpace: "nowrap",
                    lineHeight: "16px", visibility: boxW >= 20 ? "visible" : "hidden",
                  }}>{m.label}</div>
                );
              })}
            </div>

            {/* Grid */}
            <div style={{ display: "flex", gap: 0 }}>
              {/* Day labels */}
              <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 4 }}>
                {DAYS.map((d, i) => (
                  <div key={i} style={{ height: CELL, fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, lineHeight: `${CELL}px`, userSelect: "none", width: 22 }}>{d}</div>
                ))}
              </div>
              {/* Cells */}
              <div style={{ display: "flex", gap: GAP }}>
                {weeks.map((w, wi) => (
                  <div key={wi} style={{ display: "flex", flexDirection: "column", gap: GAP }}>
                    {w.days.map((d, di) => (
                      <div
                        key={di}
                        className={`gh-cell gh-cell-${lvl(d.contributionCount)}`}
                        style={{ width: CELL, height: CELL, borderRadius: 2, cursor: "default", transition: "transform 0.1s" }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.transform = "scale(1.35)";
                          setHoveredCell({ date: d.date, count: d.contributionCount });
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.transform = "";
                          setHoveredCell(null);
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO }}>
                {isLive ? "Contribution activity" : "Contribution activity (preview)"}
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginRight: 3 }}>Less</span>
                {[0, 1, 2, 3, 4].map(l => (
                  <div key={l} className={`gh-cell gh-cell-${l}`} style={{ width: 10, height: 10, borderRadius: 2 }} />
                ))}
                <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginLeft: 3 }}>More</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN EXPORT
────────────────────────────────────────────────────────── */
export function AboutSection() {
  const { ref, revealClass, visible } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes progressFill {
          from { width: 0%; }
          to   { width: var(--target-pct, 100%); }
        }

        .name-highlight {
          display: inline;
          color: #4ade80;
          background: linear-gradient(135deg, rgba(74,222,128,0.10) 0%, rgba(34,197,94,0.05) 50%, rgba(16,185,129,0.08) 100%);
          border: 1px solid rgba(74,222,128,0.22);
          border-radius: 5px;
          padding: 1px 7px 2px;
          box-shadow: 0 0 10px rgba(74,222,128,0.12), 0 0 22px rgba(74,222,128,0.06);
          font-weight: 600;
          white-space: nowrap;
        }

        .gold-box-word {
          display: inline;
          color: #d4a017;
          font-weight: 600;
          background: rgba(212,160,23,0.10);
          border: 1px solid rgba(212,160,23,0.22);
          border-radius: 5px;
          padding: 1px 5px 2px;
          margin: 0 1px;
        }

        .gh-cell   { background: rgba(255,255,255,0.06); }
        .gh-cell:hover { transform: scale(1.35); }
        .gh-cell-0 { background: rgba(255,255,255,0.06); }
        .gh-cell-1 { background: rgba(74,222,128,0.22); }
        .gh-cell-2 { background: rgba(74,222,128,0.44); }
        .gh-cell-3 { background: rgba(74,222,128,0.68); }
        .gh-cell-4 { background: #4ade80; }

        .lc-cell   { background: rgba(255,165,0,0.08); }
        .lc-cell-0 { background: rgba(255,165,0,0.08); }
        .lc-cell-1 { background: rgba(255,161,22,0.28); }
        .lc-cell-2 { background: rgba(255,161,22,0.52); }
        .lc-cell-3 { background: rgba(255,161,22,0.76); }
        .lc-cell-4 { background: #FFA116; }

        html.light .name-highlight {
          color: #16a34a;
          background: rgba(22,163,74,0.08);
          border-color: rgba(22,163,74,0.20);
          box-shadow: none;
        }
        html.light .gold-box-word {
          color: #d97706 !important;
          background: rgba(245,158,11,0.13) !important;
          border-color: rgba(217,119,6,0.45) !important;
          box-shadow: none !important;
        }
        html.light .gh-cell-0 { background: rgba(0,0,0,0.07); }
        html.light .gh-cell-1 { background: rgba(22,163,74,0.20); }
        html.light .gh-cell-2 { background: rgba(22,163,74,0.45); }
        html.light .gh-cell-3 { background: rgba(22,163,74,0.70); }
        html.light .gh-cell-4 { background: #16a34a; }
        html.light .lc-cell-0 { background: rgba(180,120,0,0.10); }
        html.light .lc-cell-1 { background: rgba(200,130,0,0.28); }
        html.light .lc-cell-2 { background: rgba(200,130,0,0.52); }
        html.light .lc-cell-3 { background: rgba(200,130,0,0.76); }
        html.light .lc-cell-4 { background: #d97706; }

        .stat-card-3d {
          padding: 16px;
          background: #18181b;
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 12px;
          position: relative;
          transition: transform 0.28s cubic-bezier(0.16,1,0.3,1), box-shadow 0.28s cubic-bezier(0.16,1,0.3,1);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 2px 4px rgba(0,0,0,0.45),
            0 8px 20px rgba(0,0,0,0.32),
            0 16px 32px rgba(0,0,0,0.18);
        }
        .stat-card-3d:hover {
          transform: translateY(-4px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.07) inset,
            0 4px 8px rgba(0,0,0,0.50),
            0 12px 28px rgba(0,0,0,0.38),
            0 24px 48px rgba(0,0,0,0.22);
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
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          align-items: stretch;
        }
        .about-content {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 20px 40px;
        }

        /* Scrollbar styling for webkit */
        .stat-card-3d ::-webkit-scrollbar {
          height: 4px;
        }
        .stat-card-3d ::-webkit-scrollbar-track {
          background: transparent;
        }
        .stat-card-3d ::-webkit-scrollbar-thumb {
          border-radius: 2px;
          background: rgba(128,128,128,0.25);
        }

        @media (max-width: 860px) {
          .about-content { padding: 0 22px 34px; }
        }
        @media (max-width: 640px) {
          .about-panels { grid-template-columns: 1fr; }
          .about-content { padding: 0 16px 30px; }
          .about-para { font-size: 14px !important; line-height: 1.85 !important; }
          .stat-card-3d { width: 100% !important; min-width: unset !important; }
        }
      `}</style>

      <section ref={ref} className={revealClass}>
        <div style={{
          position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw",
          background: "var(--bg-base)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
        }}>
          <div className="about-content">
            {/* Title */}
            <div style={{ paddingTop: 28 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                About
              </span>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 28px" }} />

            {/* Text */}
            <div style={{ marginBottom: 32 }}>
              <ScrollRevealText />
            </div>

            {/* Panels */}
            <div className="about-panels">
              <div className="stat-card-3d" style={{ minWidth: 0 }}>
                <GitHubGraph username="Ithakur2327" />
              </div>
              <div className="stat-card-3d" style={{ minWidth: 0 }}>
                <LeetCodeStats username="IThakur09" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}