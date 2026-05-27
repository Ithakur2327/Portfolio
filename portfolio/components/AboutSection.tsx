"use client";

import React, { useRef, useState, useEffect } from "react";
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
interface Token {
  text: string;
  hl: boolean;
  idx: number;
  isName: boolean;
}

interface ContribDay {
  contributionCount: number;
  date: string;
}

interface Week {
  days: ContribDay[];
}

interface LC {
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  totalSolved: number;
  ranking: number;
}

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
function GoldWord({
  text, idx, total, progress, isName,
}: {
  text: string; idx: number; total: number; progress: MotionValue<number>; isName: boolean;
}) {
  const s = Math.max(0, (idx - 0.2) / total);
  const e = Math.min(1, (idx + 0.4) / total);
  const raw = useTransform(progress, [s, e], [0, 1]);
  const p = useSpring(raw, { stiffness: 800, damping: 32, mass: 0.2 });
  const opacity = useTransform(p, [0, 0.15, 1], [0.25, 0.65, 1]);

  if (isName) {
    return (
      <motion.span style={{ opacity, display: "inline", verticalAlign: "baseline" }}>
        <span className="name-highlight">{text}</span>
      </motion.span>
    );
  }

  return (
    <motion.span
      className="gold-box-word"
      style={{ opacity, display: "inline", verticalAlign: "baseline" }}
    >
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
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 26, restDelta: 0.001 });
  const paras = parse(ABOUT_TEXT);
  const total = paras.flat().filter((t) => t.hl).length;

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {paras.map((tokens, pi) => (
        <p
          key={pi}
          className="about-para"
          style={{
            margin: 0,
            lineHeight: 1.85,
            fontFamily: SF,
            fontSize: 15,
            letterSpacing: "-0.01em",
            fontWeight: 400,
            color: "var(--text-primary)",
            wordBreak: "normal",
            overflowWrap: "break-word",
          }}
        >
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
   GITHUB GRAPH
────────────────────────────────────────────────────────── */
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["","Mon","","Wed","","Fri",""];

function GitHubGraph({ username = "IndreshThakur" }: { username?: string }) {
  const [weeks,   setWeeks]   = useState<Week[]>([]);
  const [total,   setTotal]   = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<{ date: string; count: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then((r) => r.json())
      .then((json) => {
        const c: { date: string; count: number }[] | undefined = json.contributions;
        // sum all years
        const tot = c?.reduce((a, b) => a + b.count, 0) ?? 0;
        setTotal(tot);
        const ws: Week[] = [];
        for (let i = 0; i < (c?.length || 0); i += 7) {
          ws.push({ days: c?.slice(i, i + 7).map((x) => ({ contributionCount: x.count, date: x.date })) || [] });
        }
        setWeeks(ws.slice(-53));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [username]);

  const lvl = (n: number) => n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4;

  const monthLabels: { label: string; col: number }[] = [];
  weeks.forEach((w, wi) => {
    if (w.days[0]) {
      const d = new Date(w.days[0].date);
      if (wi === 0 || d.getDate() <= 7) {
        const lbl = MONTHS[d.getMonth()];
        if (!monthLabels.length || monthLabels[monthLabels.length - 1].label !== lbl) {
          monthLabels.push({ label: lbl, col: wi });
        }
      }
    }
  });

  const CELL = 11;
  const GAP  = 3;
  const STEP = CELL + GAP;
  const LEFT_PAD = 28;

  return (
    <div style={{ position: "relative" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--text-primary)">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: SF }}>GitHub</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: MONO }}>@{username}</div>
          </div>
        </div>
        {total !== null && total > 0 && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "#4ade80", fontFamily: MONO, letterSpacing: "-0.05em", lineHeight: 1 }}>{total.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, marginTop: 2 }}>contributions this year</div>
          </div>
        )}
      </div>

      <div style={{ height: 1, background: "var(--border)", marginBottom: 12 }} />

      {loading ? <Spin color="#4ade80" /> : (
        <div style={{ overflowX: "auto", paddingBottom: 4 }}>
          {/* Month labels */}
          <div style={{ position: "relative", paddingLeft: LEFT_PAD, marginBottom: 4, height: 14 }}>
            {monthLabels.map((m, i) => (
              <div key={i} style={{
                position: "absolute",
                left: LEFT_PAD + m.col * STEP,
                fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, userSelect: "none",
              }}>{m.label}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display: "flex", gap: 0, position: "relative" }}>
            {/* Day labels */}
            <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 4, marginTop: 0 }}>
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
                      onMouseEnter={(e) => {
                        const rect = (e.target as HTMLElement).getBoundingClientRect();
                        setHovered({ date: d.date, count: d.contributionCount });
                        setTooltipPos({ x: rect.left, y: rect.top });
                      }}
                      onMouseLeave={() => setHovered(null)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
            <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO }}>Contribution activity</span>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginRight: 3 }}>Less</span>
              {[0,1,2,3,4].map(l => (
                <div key={l} className={`gh-cell gh-cell-${l}`} style={{ width: 10, height: 10, borderRadius: 2 }} />
              ))}
              <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginLeft: 3 }}>More</span>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: "fixed", top: tooltipPos.y - 36, left: tooltipPos.x - 40,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          borderRadius: 6, padding: "4px 10px", fontSize: 11, fontFamily: MONO,
          color: "var(--text-primary)", pointerEvents: "none", zIndex: 999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)", whiteSpace: "nowrap",
        }}>
          <strong style={{ color: "#4ade80" }}>{hovered.count}</strong> contributions on {hovered.date}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   PROGRESS BAR
────────────────────────────────────────────────────────── */
function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ position: "relative", height: 8, borderRadius: 99, background: "rgba(128,128,128,0.15)", overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, borderRadius: 99, background: color }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   LEETCODE
────────────────────────────────────────────────────────── */
function LeetCodeStats({ username = "IThakur09" }: { username?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<LC | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const [r1, r2] = await Promise.all([
          fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`),
          fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`),
        ]);
        const [j1, j2] = await Promise.all([r1.json(), r2.json()]);
        setData({
          easySolved:   j2.easySolved   ?? 0,
          totalEasy:    j2.totalEasy    ?? 946,
          mediumSolved: j2.mediumSolved ?? 0,
          totalMedium:  j2.totalMedium  ?? 2061,
          hardSolved:   j2.hardSolved   ?? 0,
          totalHard:    j2.totalHard    ?? 937,
          totalSolved:  j1.solvedProblem ?? 0,
          ranking:      j2.ranking      ?? 0,
        });
        setLoading(false);
      } catch { setLoading(false); }
    };
    run();
  }, [username]);

  // Fallback static data when API fails
  const displayData = data ?? {
    easySolved: 195, totalEasy: 946,
    mediumSolved: 221, totalMedium: 2061,
    hardSolved: 32, totalHard: 937,
    totalSolved: 448,
    ranking: 150000,
  };

  const tiers = [
    { label: "Easy",   solved: displayData.easySolved,   total: displayData.totalEasy,   color: "#4ade80" },
    { label: "Medium", solved: displayData.mediumSolved,  total: displayData.totalMedium, color: "#fb923c" },
    { label: "Hard",   solved: displayData.hardSolved,    total: displayData.totalHard,   color: "#f87171" },
  ];

  // Theme-aware colors
  const solvedColor = isDark ? "#FFA116" : "var(--text-primary)";
  const rankColor   = isDark ? "#FFA116" : "var(--text-primary)";

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* HEADER */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Real LeetCode logo */}
          <div style={{ width: 40, height: 40, borderRadius: 10, background: isDark ? "#1a1200" : "#fff7e6", border: `1px solid ${isDark ? "#3d2e00" : "#f0c070"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z" fill="#FFA116"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: SF }}>LeetCode</div>
            <div style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: MONO }}>@{username}</div>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: solvedColor, fontFamily: MONO, letterSpacing: "-0.05em", lineHeight: 1 }}>{displayData.totalSolved.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO, marginTop: 2 }}>problems solved</div>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border)", marginBottom: 16 }} />

      {loading && !data ? <Spin color="#FFA116" /> : (
        <>
          {/* Progress bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 16 }}>
            {tiers.map((t) => {
              const pct = Math.round((t.solved / t.total) * 100);
              return (
                <div key={t.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.color, fontFamily: SF }}>{t.label}</span>
                    <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: MONO }}>
                      {t.solved} / {t.total}&nbsp;&nbsp;
                      <span style={{ color: t.color }}>{pct}%</span>
                    </span>
                  </div>
                  <ProgressBar pct={pct} color={t.color} />
                </div>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ height: 1, background: "var(--border)", marginBottom: 14 }} />

          {/* Global ranking */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: SF }}>Global Ranking</span>
            <span style={{ marginLeft: "auto", fontSize: 18, fontWeight: 800, color: rankColor, fontFamily: MONO, letterSpacing: "-0.04em" }}>
              #{displayData.ranking > 0 ? displayData.ranking.toLocaleString() : "150,000"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SPINNER
────────────────────────────────────────────────────────── */
function Spin({ color }: { color: string }) {
  return (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 80 }}>
      <div style={{ width: 18, height: 18, borderTop: `2px solid ${color}`, borderRight: "2px solid transparent", borderBottom: "2px solid transparent", borderLeft: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN
────────────────────────────────────────────────────────── */
export function AboutSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Name highlight — green */
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

        /* Gold highlight — dark theme */
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

        /* GitHub cell colours — dark */
        .gh-cell   { background: rgba(255,255,255,0.06); }
        .gh-cell:hover { transform: scale(1.35); }
        .gh-cell-0 { background: rgba(255,255,255,0.06); }
        .gh-cell-1 { background: rgba(74,222,128,0.22); }
        .gh-cell-2 { background: rgba(74,222,128,0.44); }
        .gh-cell-3 { background: rgba(74,222,128,0.68); }
        .gh-cell-4 { background: #4ade80; }

        /* 3D card */
        .stat-card-3d {
          padding: 20px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          position: relative;
          transition: transform 0.25s cubic-bezier(0.16,1,0.3,1), box-shadow 0.25s cubic-bezier(0.16,1,0.3,1);
          transform-style: preserve-3d;
          box-shadow:
            0 1px 1px rgba(0,0,0,0.12),
            0 2px 2px rgba(0,0,0,0.10),
            0 4px 4px rgba(0,0,0,0.09),
            0 8px 8px rgba(0,0,0,0.07),
            0 0 0 1px rgba(255,255,255,0.04) inset;
        }
        .stat-card-3d:hover {
          transform: translateY(-4px) rotateX(1.5deg);
          box-shadow:
            0 4px 8px rgba(0,0,0,0.15),
            0 8px 16px rgba(0,0,0,0.12),
            0 16px 32px rgba(0,0,0,0.10),
            0 0 0 1px rgba(255,255,255,0.06) inset;
        }

        /* ── LIGHT MODE ── */
        html.light .name-highlight {
          color: #16a34a;
          background: rgba(22,163,74,0.08);
          border-color: rgba(22,163,74,0.20);
          box-shadow: none;
        }
        html.light .gold-box-word {
          color: #92400e;
          background: rgba(180,100,0,0.08);
          border-color: rgba(180,100,0,0.20);
        }
        html.light .gh-cell-0 { background: rgba(0,0,0,0.07); }
        html.light .gh-cell-1 { background: rgba(22,163,74,0.20); }
        html.light .gh-cell-2 { background: rgba(22,163,74,0.45); }
        html.light .gh-cell-3 { background: rgba(22,163,74,0.70); }
        html.light .gh-cell-4 { background: #16a34a; }
        html.light .stat-card-3d {
          box-shadow:
            0 1px 1px rgba(0,0,0,0.06),
            0 2px 4px rgba(0,0,0,0.05),
            0 4px 8px rgba(0,0,0,0.04),
            0 0 0 1px rgba(0,0,0,0.03) inset;
        }
        html.light .stat-card-3d:hover {
          box-shadow:
            0 4px 8px rgba(0,0,0,0.08),
            0 8px 16px rgba(0,0,0,0.06),
            0 16px 24px rgba(0,0,0,0.05);
        }

        .about-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .about-content {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 32px 40px;
        }

        @media (max-width: 860px) {
          .about-content { padding: 0 22px 34px; }
        }

        @media (max-width: 640px) {
          .about-panels { grid-template-columns: 1fr; }
          .about-content { padding: 0 16px 30px; }
          .about-para { font-size: 14px !important; line-height: 1.9 !important; }
        }
      `}</style>

      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 14 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
          <div className="about-content">
            {/* TITLE */}
            <div style={{ paddingTop: 28 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                About
              </span>
            </div>

            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 28px" }} />

            {/* TEXT */}
            <div style={{ marginBottom: 32 }}>
              <ScrollRevealText />
            </div>

            {/* PANELS */}
            <div className="about-panels">
              <div className="stat-card-3d">
                <GitHubGraph username="IndreshThakur" />
              </div>
              <div className="stat-card-3d">
                <LeetCodeStats username="IThakur09" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}