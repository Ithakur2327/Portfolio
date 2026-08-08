"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";

import { useReveal } from "./useReveal";
import { useTheme } from "./ThemeProvider";
import { SectionIcon } from "./SectionIcon";
import { mq } from "@/lib/breakpoints";
import { useIsLaptopUp, useIsTablet } from "@/lib/useBreakpoint";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'SF Mono', 'Geist Mono', monospace";

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
interface StatHover { label: string; solved: number; total: number; x: number; y: number; }

type PaletteKey = "tiffany" | "blue" | "green" | "original";
interface HeatPalette { label: string; swatch: string; c1: string; c2: string; c3: string; c4: string; }

const HEAT_PALETTES: Record<PaletteKey, HeatPalette> = {
  tiffany:  { label: "Tiffany",  swatch: "#0abab5", c1: "#a6e8e3", c2: "#4fd0c7", c3: "#0abab5", c4: "#067b76" },
  blue:     { label: "Blue",     swatch: "#1262c4", c1: "#8fc6fa", c2: "#1262c4", c3: "#104b98", c4: "#0d0a6b" },
  green:    { label: "Green",    swatch: "#30a14e", c1: "#9be9a8", c2: "#40c463", c3: "#30a14e", c4: "#216e39" },
  original: { label: "Original", swatch: "#c46212", c1: "#fac68f", c2: "#c46212", c3: "#984b10", c4: "#000000" },
};
const HEAT_PALETTE_ORDER: PaletteKey[] = ["tiffany", "blue", "green", "original"];
const HEAT_STORAGE_KEY = "heatmap-palettes-v1";
const DEFAULT_HEAT_PALETTES: Record<"dark" | "light", PaletteKey> = { dark: "blue", light: "original" };

function isPaletteKey(v: unknown): v is PaletteKey {
  return typeof v === "string" && v in HEAT_PALETTES;
}

function loadHeatPalettes(): Record<"dark" | "light", PaletteKey> {
  if (typeof window === "undefined") return DEFAULT_HEAT_PALETTES;
  try {
    const raw = window.localStorage.getItem(HEAT_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isPaletteKey(parsed?.dark) && isPaletteKey(parsed?.light)) {
        return { dark: parsed.dark, light: parsed.light };
      }
    }
  } catch { }
  return DEFAULT_HEAT_PALETTES;
}

function computeTooltipPosition(x: number, halfWidth: number) {
  if (typeof window === "undefined") return { left: x, arrowOffset: 0 };
  const min = halfWidth + 8;
  const max = window.innerWidth - halfWidth - 8;
  const left = Math.min(Math.max(x, min), max);
  const rawOffset = x - left;
  const maxArrowOffset = halfWidth - 14;
  const arrowOffset = Math.min(Math.max(rawOffset, -maxArrowOffset), maxArrowOffset);
  return { left, arrowOffset };
}

function useDismissTooltipOnScroll(setHovered: (v: null) => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const dismiss = () => setHovered(null);
    window.addEventListener("scroll", dismiss, { capture: true, passive: true });
    window.addEventListener("touchmove", dismiss, { passive: true });
    window.addEventListener("resize", dismiss, { passive: true });
    return () => {
      window.removeEventListener("scroll", dismiss, true);
      window.removeEventListener("touchmove", dismiss);
      window.removeEventListener("resize", dismiss);
    };
  }, [active, setHovered]);
}

function Spin({ color }: { color: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 60 }}>
      <div style={{ width: 18, height: 18, borderTop: `2px solid ${color}`, borderRight: "2px solid transparent", borderBottom: "2px solid transparent", borderLeft: "2px solid transparent", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
    </div>
  );
}


const LEETCODE_ICON_DATA_URI = "data:image/png;base64,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";

function LeetCodeLogo({ size = 34, isDark = true }: { size?: number; isDark?: boolean }) {
  
  const bg = isDark ? "#1a1a1a" : "#fff8f0";
  const border = isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.12)";
  const iconColor = isDark ? "ffffff" : "000000";
  return (
    <div style={{ width: size, height: size, borderRadius: Math.round(size * 0.26), background: bg, border, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", lineHeight: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- small external SVG icon with a data-URI onError fallback; dangerouslyAllowSVG is intentionally off, so next/image can't optimize this anyway */}
      <img
        src={`https://cdn.simpleicons.org/leetcode/${iconColor}`}
        alt="LeetCode"
        width={size * 0.56}
        height={size * 0.56}
        style={{ display: "block", width: size * 0.56, height: size * 0.56, objectFit: "contain", objectPosition: "center", flexShrink: 0, margin: 0 }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = LEETCODE_ICON_DATA_URI;
          (e.target as HTMLImageElement).style.filter = isDark
            ? "grayscale(1) brightness(2.1) contrast(1.05)"
            : "grayscale(1) brightness(0.25)";
        }}
      />
    </div>
  );
}

function GitHubLogo({ size = 34, isDark }: { size?: number; isDark: boolean }) {
  return (
    <div className="gh-logo-wrap" style={{ width: size, height: size, borderRadius: Math.round(size * 0.26), background: isDark ? "#161b22" : "#f0f6ff", border: `1px solid ${isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer", overflow: "hidden", lineHeight: 0 }}>
      <svg className="gh-logo-svg" width={size * 0.58} height={size * 0.58} viewBox="0 0 24 24" fill={isDark ? "#ffffff" : "#24292f"} style={{ display: "block", transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
      </svg>
    </div>
  );
}

function PortalTooltip({ hovered, accentColor, label }: {
  hovered: HoveredCell | null;
  accentColor: string;
  label: string;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !hovered) return null;

  const { left, arrowOffset } = computeTooltipPosition(hovered.x, 52);

  return createPortal(
    <div
      style={{
        position: "fixed",
        left,
        top: hovered.y,
        transform: "translate(-50%, calc(-100% - 9px))",
        pointerEvents: "none",
        zIndex: 2147483647,
        background: "var(--text-primary)",
        color: "var(--bg-base)",
        padding: "5px 8px",
        borderRadius: 7,
        whiteSpace: "nowrap",
        width: "max-content",
        boxShadow: "0 4px 14px rgba(0,0,0,0.22)",
        animation: "statTooltipPop 0.14s cubic-bezier(0.19,1,0.22,1) forwards",
        textAlign: "center",
      }}
    >
      <span className="stat-tooltip-arrow" style={{ left: `calc(50% + ${arrowOffset}px)` }} />
      <div style={{ fontSize: 11, fontWeight: 700, fontFamily: MONO, letterSpacing: "-0.02em", lineHeight: 1.2, color: accentColor }}>
        {hovered.count}
      </div>
      <div style={{ fontSize: 9, fontWeight: 500, fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif", opacity: 0.7, marginTop: 1 }}>
        {label} · {hovered.date}
      </div>
    </div>,
    document.body
  );
}

function StatTooltip({ hovered, accentColor }: { hovered: StatHover | null; accentColor: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !hovered) return null;

  const { left, arrowOffset } = computeTooltipPosition(hovered.x, 74);

  return createPortal(
    <div
      style={{
        position: "fixed",
        left,
        top: hovered.y,
        transform: "translate(-50%, calc(-100% - 12px))",
        pointerEvents: "none",
        zIndex: 2147483647,
        background: "var(--bg-card)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${accentColor}40`,
        borderRadius: 11,
        padding: "8px 13px",
        minWidth: 66,
        boxShadow: `0 12px 32px rgba(0,0,0,0.38), 0 0 0 1px ${accentColor}12`,
        animation: "statChipTooltipPop 0.16s cubic-bezier(0.19,1,0.22,1) forwards",
        textAlign: "center",
      }}
    >
      <span
        className="stat-chip-tooltip-arrow"
        style={{ left: `calc(50% + ${arrowOffset}px)`, borderTopColor: "var(--bg-card)" }}
      />
      <span
        className="stat-chip-tooltip-arrow-border"
        style={{ left: `calc(50% + ${arrowOffset}px)`, borderTopColor: `${accentColor}40` }}
      />
      <div style={{ fontSize: 9, fontWeight: 700, color: accentColor, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 3 }}>
        {hovered.label}
      </div>
      <div style={{ fontSize: 14, fontWeight: 800, color: "var(--text-primary)", fontFamily: MONO, letterSpacing: "-0.03em" }}>
        {hovered.solved}<span style={{ color: "var(--text-muted)", fontWeight: 500 }}>/{hovered.total}</span>
      </div>
    </div>,
    document.body
  );
}

function StatChip({ label, shortLabel, solved, color, bold, onEnter, onLeave }: {
  label: string;
  shortLabel?: string;
  solved: number;
  color: string;
  bold?: boolean;
  onEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onLeave: () => void;
}) {
  return (
    <div
      className="stat-chip"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 2,
        padding: bold ? "2px 6px" : "2px 5px",
        borderRadius: 6,
        background: "var(--bg-secondary)",
        border: `1px solid ${bold ? `${color}55` : "var(--border)"}`,
        cursor: "default",
        transition: "border-color 0.15s ease, transform 0.15s cubic-bezier(0.19,1,0.22,1)",
        whiteSpace: "nowrap",
        minWidth: 0,
      }}
    >
      <span className="stat-chip-label" style={{ fontSize: 9, fontWeight: 700, color, fontFamily: MONO, letterSpacing: "-0.02em" }}>
        {shortLabel ? (
          <>
            <span className="stat-chip-label-full">{label}</span>
            <span className="stat-chip-label-short">{shortLabel}</span>
          </>
        ) : label}
      </span>
      <span className="stat-chip-value" style={{ fontSize: bold ? 12 : 10, fontWeight: 800, color: "var(--text-primary)", fontFamily: MONO, letterSpacing: "-0.03em" }}>{solved}</span>
    </div>
  );
}

const LC_TOTAL = 3949;
const GLOBAL_RANK = 150000;
const MON_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAY_LABELS_LC = ["","Mon","","Wed","","Fri",""];

function LeetCodeStats({ username = "IThakur09" }: { username?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [data, setData] = useState<LC | null>(null);
  const [loading, setLoading] = useState(true);
  const [calData, setCalData] = useState<LCCalDay[]>([]);
  const [hovered, setHovered] = useState<HoveredCell | null>(null);
  const [statHover, setStatHover] = useState<StatHover | null>(null);
  const [mounted, setMounted] = useState(false);
  useDismissTooltipOnScroll(setHovered, hovered !== null);
  useDismissTooltipOnScroll(setStatHover, statHover !== null);

  useEffect(() => { setMounted(true); }, []);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    (async () => {
     
      try {
        const r = await fetch(
          `/api/leetcode-calendar?username=${encodeURIComponent(username)}&year=${currentYear}`,
          { signal: AbortSignal.timeout(9000) }
        );
        if (r.ok) {
          const json = await r.json();
          const days: LCCalDay[] = (json.days ?? []).sort(
            (a: LCCalDay, b: LCCalDay) => a.date - b.date
          );
          if (days.length > 0) setCalData(days);
          if (json.profile) setData(json.profile as LC);
        }
      } catch { }
      setLoading(false);
    })();
  }, [username, currentYear]);

  const d = data ?? { easySolved: 197, totalEasy: 947, mediumSolved: 223, totalMedium: 2063, hardSolved: 32, totalHard: 939, totalSolved: 452, ranking: GLOBAL_RANK };

  const isTablet = useIsTablet();
  const isLaptopUp = useIsLaptopUp();
  const CELL = isTablet ? 14 : 10, GAP = isTablet ? 4 : 3, STEP = CELL + GAP;

  const countMap = new Map<string, number>();
  calData.forEach(day => {
    const dt = new Date(day.date * 1000);
    if (dt.getFullYear() === currentYear) {
      const k = dt.toISOString().split("T")[0];
      countMap.set(k, (countMap.get(k) ?? 0) + day.count);
    }
  });

  const jan1 = new Date(currentYear, 0, 1);
  const startSun = new Date(jan1); startSun.setDate(startSun.getDate() - startSun.getDay());
  const today = mounted ? (() => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; })() : startSun;

  const lcWeeks: { date: Date; count: number }[][] = [];
  const cur = new Date(startSun);
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

  const lcLvl = (c: number) =>
  c === 0 ? 0 :
  c <= 3 ? 1 :
  c <= 6 ? 2 :
  c <= 11 ? 3 :
  4;
  const diffColors = { Easy: "#00b8a3", Medium: "#ffc01e", Hard: "#ef4743" };
  const solvedColor = isDark ? "#FFA116" : "#C77600";

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

  const handleStatEnter = useCallback((e: React.MouseEvent<HTMLDivElement>, label: string, solved: number, total: number) => {
    const cr = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setStatHover({ label, solved, total, x: cr.left + cr.width / 2, y: cr.top });
  }, []);
  const handleStatLeave = useCallback(() => setStatHover(null), []);

  const gridContent = (
    <div style={{ display: "inline-flex", flexDirection: "column", paddingBottom: 4, minWidth: "max-content" }}>
      <div style={{ display: "flex", marginBottom: 4, paddingLeft: 26 }}>
        {lcMonthLabels.map((m, i) => {
          const nextCol = lcMonthLabels[i + 1]?.col ?? lcWeeks.length;
          const w = (nextCol - m.col) * STEP;
          return (
            <div key={i} style={{ width: w, flexShrink: 0, fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, overflow: "visible", whiteSpace: "nowrap", lineHeight: "16px" }}>
              {m.label}
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 0 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: GAP, marginRight: 4 }}>
          {DAY_LABELS_LC.map((lbl, i) => (
            <div key={i} style={{ height: CELL, fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, lineHeight: `${CELL}px`, userSelect: "none", width: 22 }}>{lbl}</div>
          ))}
        </div>
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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 3, marginTop: 8 }}>
        <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginRight: 3 }}>Less</span>
        {[0,1,2,3,4].map(l => <div key={l} className={`lc-cell lc-cell-${l}`} style={{ width: 10, height: 10, borderRadius: 2 }} />)}
        <span style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, marginLeft: 3 }}>More</span>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <PortalTooltip hovered={hovered} accentColor={solvedColor} label="submissions" />
      <StatTooltip hovered={statHover} accentColor={statHover?.label === "Total Solved" ? solvedColor : (diffColors as Record<string, string>)[statHover?.label ?? ""] ?? solvedColor} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: isLaptopUp ? "nowrap" : "wrap", gap: 8, minHeight: isLaptopUp ? 56 : undefined }}>
        <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <LeetCodeLogo size={34} isDark={isDark} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: SF }}>LeetCode</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO }}>@{username} ↗</div>
          </div>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: MONO }}>Rank</span>
          <span style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", fontFamily: MONO, letterSpacing: "-0.04em" }}>#{(d.ranking || GLOBAL_RANK).toLocaleString()}</span>
        </div>
      </div>
      <div style={{ height: 1, background: "var(--border)", marginBottom: 10 }} />

      {loading ? <Spin color="#FFA116" /> : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <div className="lc-header-stats" style={{ display: "flex", alignItems: "center", flexWrap: "nowrap", gap: 8, marginBottom: 4, minWidth: 0, minHeight: isLaptopUp ? 56 : undefined }}>
            <span className="lc-activity-label" style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", fontFamily: MONO, flexShrink: 0, minWidth: 0, whiteSpace: "nowrap" }}>{currentYear} activity <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>—</span></span>
            <div className="lc-header-stats-chips" style={{ display: "flex", alignItems: "center", gap: isLaptopUp ? 3 : 4, flexWrap: "nowrap", minWidth: 0, flex: "1 1 auto", justifyContent: "flex-end", overflow: "hidden", paddingRight: isLaptopUp ? 12 : 6 }}>
              <div
                className="lc-solved-box"
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 4px",
                  gap: 2,
                  borderRadius: 7,
                  flexShrink: 1,
                  minWidth: 0,
                }}
              >
                <StatChip
                  label="Solved" solved={d.totalSolved} color={solvedColor} bold
                  onEnter={e => handleStatEnter(e, "Total Solved", d.totalSolved, LC_TOTAL)}
                  onLeave={handleStatLeave}
                />
              </div>
              <div
                className="lc-emh-box"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  flexWrap: "nowrap",
                  padding: "0 4px",
                  borderRadius: 7,
                  flexShrink: 1,
                  minWidth: 0,
                }}
              >
                <StatChip
                  label="Easy" shortLabel="E" solved={d.easySolved} color={diffColors.Easy}
                  onEnter={e => handleStatEnter(e, "Easy", d.easySolved, d.totalEasy)}
                  onLeave={handleStatLeave}
                />
                <StatChip
                  label="Medium" shortLabel="M" solved={d.mediumSolved} color={diffColors.Medium}
                  onEnter={e => handleStatEnter(e, "Medium", d.mediumSolved, d.totalMedium)}
                  onLeave={handleStatLeave}
                />
                <StatChip
                  label="Hard" shortLabel="H" solved={d.hardSolved} color={diffColors.Hard}
                  onEnter={e => handleStatEnter(e, "Hard", d.hardSolved, d.totalHard)}
                  onLeave={handleStatLeave}
                />
              </div>
            </div>
          </div>
          <div
            style={{ flex: 1, width: "100%", overflowX: "auto", overflowY: "visible", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin", scrollbarColor: "rgba(10,186,181,0.45) transparent" }}
            onMouseLeave={() => setHovered(null)}
          >
            {gridContent}
          </div>
        </div>
      )}
    </div>
  );
}

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
  useDismissTooltipOnScroll(setHovered, hovered !== null);

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    (async () => {
      const apis = [
        `https://github-contributions-api.jogruber.de/v4/${username}?y=${currentYear}`,
        `https://github-contributions-api.jogruber.de/v4/${username}`,
      ];
      for (const url of apis) {
        try {
          const r = await fetch(url, { signal: AbortSignal.timeout(9000) });
          if (!r.ok) continue;
          const json = await r.json();
          const c: { date: string; count: number }[] | undefined = json.contributions ?? json.data ?? json;
          if (!Array.isArray(c) || !c.length) continue;
          const cYear = c.filter(x => x.date?.startsWith(String(currentYear)));
          if (!cYear.length) continue;
          const tot = cYear.reduce((a, b) => a + b.count, 0);
          setTotal(tot);
          const today = new Date(); today.setHours(0,0,0,0);
          const jan1 = new Date(currentYear,0,1);
          const startSun = new Date(jan1); startSun.setDate(startSun.getDate() - startSun.getDay());
          const dateMap = new Map(cYear.map(x => [x.date, x.count]));
          const ws: Week[] = [];
          const cur = new Date(startSun);
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
        } catch { }
      }
      const today = new Date(); today.setHours(0,0,0,0);
      const jan1 = new Date(currentYear,0,1);
      const startSun = new Date(jan1); startSun.setDate(startSun.getDate() - startSun.getDay());
      const ws: Week[] = [];
      const cur = new Date(startSun);
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
  }, [username, currentYear]);

 const lvl = (n: number) =>
  n === 0 ? 0 :
  n <= 8 ? 1 :
  n <= 18 ? 2 :
  n <= 34 ? 3 :
  4;
  const isTablet = useIsTablet();
  const isLaptopUp = useIsLaptopUp();
  const CELL = isTablet ? 14 : 10, GAP = isTablet ? 4 : 3, STEP = CELL + GAP;
  const contribColor = isDark ? "#ffffff" : "#000000";

  const monthLabels: { label: string; col: number }[] = [];
  weeks.forEach((w, wi) => {
    if (!w.days[0]) return;
    const d = new Date(w.days[0].date + "T00:00:00");
    if (d.getFullYear() < currentYear) return;
    const lbl = MONTHS_GH[d.getMonth()];
    const last = monthLabels[monthLabels.length - 1];
    if (!last || last.label !== lbl) {
      if (!last || wi - last.col >= 2) monthLabels.push({ label: lbl, col: wi });
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
      <PortalTooltip hovered={hovered} accentColor={isDark ? "#4ade80" : "#1a7f37"} label="contributions" />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: isLaptopUp ? "nowrap" : "wrap", gap: 8, minWidth: 0, minHeight: isLaptopUp ? 56 : undefined }}>
        <a href={`https://github.com/${username}`} target="_blank" rel="noreferrer" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", minWidth: 0, flexShrink: 1 }}>
          <GitHubLogo size={34} isDark={isDark} />
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-primary)", fontFamily: SF, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>GitHub</div>
            <div style={{ fontSize: 9, color: "var(--text-muted)", fontFamily: MONO, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>@{username} ↗</div>
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
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-primary)", fontFamily: MONO, marginBottom: 4, minHeight: isLaptopUp ? 56 : undefined, display: "flex", alignItems: "center" }}>
            {isLive ? `${currentYear} contributions` : `${currentYear} activity (preview)`}
          </div>
          <div
            style={{ flex: 1, width: "100%", overflowX: "auto", overflowY: "visible", WebkitOverflowScrolling: "touch", scrollbarWidth: "thin", scrollbarColor: "rgba(10,186,181,0.45) transparent" }}
            onMouseLeave={() => setHovered(null)}
          >
            <div style={{ display: "inline-flex", flexDirection: "column", paddingBottom: 4, minWidth: "max-content" }}>
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

function HeatmapPaletteButton({
  isDark, activeKey, onSelect,
}: {
  isDark: boolean;
  activeKey: PaletteKey;
  onSelect: (key: PaletteKey) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [popped, setPopped] = useState(false);
  const [hovered, setHovered] = useState(false);
  const active = HEAT_PALETTES[activeKey];

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setPopped(true); obs.disconnect(); }
      },
      { threshold: 0.4, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const dismiss = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", dismiss);
    window.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", dismiss);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={wrapRef} style={{ position: "relative", display: "inline-flex" }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`Change heatmap colours (editing ${isDark ? "dark" : "light"} theme)`}
        title={`Heatmap colours — editing ${isDark ? "dark" : "light"} theme`}
        className="section-title-icon-3d"
        style={{
          width: 34, height: 34, borderRadius: 9,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-secondary)", flexShrink: 0,
          padding: 0, cursor: "pointer", position: "relative",
          opacity: popped ? 1 : 0,
          transform: !popped ? "scale(0.4)" : hovered || open ? "scale(1.14)" : "scale(1)",
          transition: popped
            ? "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease, border-color 0.15s ease"
            : "opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
          borderColor: open ? active.swatch : "var(--border)",
        }}
      >
        <SectionIcon type="chart" size={15} strokeWidth={2} />
        <span
          aria-hidden="true"
          style={{
            position: "absolute", right: -3, bottom: -3,
            width: 9, height: 9, borderRadius: "50%",
            background: active.swatch,
            border: "2px solid var(--bg-base)",
          }}
        />
      </button>

      {open && (
        <div
          className="heat-palette-pop"
          style={{
            position: "absolute", top: "calc(100% + 10px)", left: 0, zIndex: 40,
            background: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 12, padding: 10, minWidth: 176,
            boxShadow: "0 12px 28px rgba(0,0,0,0.28)",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text-muted)", fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
            Editing {isDark ? "dark" : "light"} theme
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {HEAT_PALETTE_ORDER.map(key => {
              const p = HEAT_PALETTES[key];
              const selected = key === activeKey;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => { onSelect(key); setOpen(false); }}
                  className="heat-palette-option"
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "6px 8px", borderRadius: 8, border: "1px solid transparent",
                    background: selected ? "var(--bg-secondary)" : "transparent",
                    cursor: "pointer", width: "100%", textAlign: "left",
                  }}
                >
                  <span style={{ display: "flex", gap: 2, flexShrink: 0 }}>
                    {[p.c1, p.c2, p.c3, p.c4].map((c, i) => (
                      <span key={i} style={{ width: 9, height: 9, borderRadius: 2, background: c }} />
                    ))}
                  </span>
                  <span style={{ flex: 1, fontSize: 12.5, fontWeight: 600, color: "var(--text-primary)", fontFamily: SF }}>
                    {p.label}
                  </span>
                  {selected && (
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={p.swatch} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Stats section
export function StatsSection() {
  const { ref: statsRef, revealClass } = useReveal(0.15);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [palettes, setPalettes] = useState<Record<"dark" | "light", PaletteKey>>(DEFAULT_HEAT_PALETTES);

  useEffect(() => { setPalettes(loadHeatPalettes()); }, []);

  const activeKey = palettes[isDark ? "dark" : "light"];
  const active = HEAT_PALETTES[activeKey];

  const selectPalette = useCallback((key: PaletteKey) => {
    setPalettes(prev => {
      const next = { ...prev, [isDark ? "dark" : "light"]: key };
      try { window.localStorage.setItem(HEAT_STORAGE_KEY, JSON.stringify(next)); } catch { }
      return next;
    });
  }, [isDark]);

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes statTooltipPop {
          from { opacity: 0; transform: translate(-50%, calc(-100% - 6px)) scale(0.94); }
          to   { opacity: 1; transform: translate(-50%, calc(-100% - 10px)) scale(1); }
        }
        @keyframes statChipTooltipPop {
          from { opacity: 0; transform: translate(-50%, calc(-100% - 8px)) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%, calc(-100% - 12px)) scale(1); }
        }
        .stat-tooltip-arrow {
          position: absolute; top: 100%; transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 4px solid transparent; border-right: 4px solid transparent;
          border-top: 4px solid var(--text-primary);
        }
        .stat-chip-tooltip-arrow {
          position: absolute; top: 100%; transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 6px solid transparent; border-right: 6px solid transparent;
          border-top: 6px solid var(--bg-card);
          z-index: 1;
        }
        .stat-chip-tooltip-arrow-border {
          position: absolute; top: calc(100% + 1px); transform: translateX(-50%);
          width: 0; height: 0;
          border-left: 7px solid transparent; border-right: 7px solid transparent;
          border-top: 7px solid;
          z-index: 0;
        }
        .stat-chip-label-short { display: none; }
        .stat-chip-label-full { display: inline; }
        ${mq.mobile} {
          .stat-chip { padding: 2px 4px !important; gap: 2px !important; min-width: 0; }
          .stat-chip-label { font-size: 8.5px !important; white-space: nowrap; }
          .stat-chip-value { font-size: 9px !important; }
        }

        @keyframes lcPulse { 0%,100%{opacity:1} 50%{opacity:0.7} }
        .lc-logo-outer { animation: lcPulse 2.4s ease-in-out infinite; }
        .lc-logo-bar   { animation: lcPulse 2.4s ease-in-out infinite 0.6s; }

        .gh-logo-wrap:hover .gh-logo-svg {
          transform: rotate(360deg);
          transition: transform 0.6s cubic-bezier(0.34,1.56,0.64,1);
        }

        .gh-cell-0, .lc-cell-0 { background: rgba(255,255,255,0.04); outline: 1px solid rgba(255,255,255,0.10); outline-offset: -1px; }
        html.light .gh-cell-0, html.light .lc-cell-0 { background: #e8eaec; outline: 1px solid rgba(0,0,0,0.08); outline-offset: -1px; }

        .gh-cell-1, .lc-cell-1 { background: var(--heat-1); }
        .gh-cell-2, .lc-cell-2 { background: var(--heat-2); }
        .gh-cell-3, .lc-cell-3 { background: var(--heat-3); }
        .gh-cell-4, .lc-cell-4 { background: var(--heat-4); }

        .stat-chip, .stat-chip-label, .stat-chip-value, .lc-solved-box, .lc-emh-box {
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }

        .heat-palette-option:hover { background: var(--bg-secondary); }
        @keyframes heatPalettePop {
          from { opacity: 0; transform: translateY(-6px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .heat-palette-pop { animation: heatPalettePop 0.16s cubic-bezier(0.19,1,0.22,1) forwards; }

        .stat-card-3d {
          padding: 12px 14px;
          background: var(--bg-secondary);
          border: 1.3px dashed rgba(10, 186, 181, 0.65);
          border-radius: 10px;
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: visible;
          box-shadow: none;
          transition: border-color 0.2s;
          min-width: 0;
        }
        .about-panels > .stat-card-3d:first-child {
          border-color: rgba(10, 186, 181, 0.80);
        }
        .about-panels > .stat-card-3d:nth-child(2) {
          border-color: rgba(212, 175, 55, 0.80);
        }
        html.light .about-panels > .stat-card-3d:first-child {
          border-color: rgba(10, 186, 181, 0.95);
        }
        html.light .about-panels > .stat-card-3d:nth-child(2) {
          border-color: rgba(212, 175, 55, 0.95);
        }
        .stat-card-3d:hover {
          border-color: var(--text-muted);
          transform: none;
          box-shadow: none;
        }

        .about-panels {
          display: grid;
          gap: 14px;
          align-items: stretch;
          grid-template-columns: 1fr 1fr;
          position: relative;
          align-content: stretch;
        }

        ${mq.tablet} {
          .about-panels { grid-template-columns: 1fr !important; }
          .stat-card-3d { width: 100% !important; min-width: 0 !important; min-height: 220px; padding: 14px; }
          .gh-cell { width: 14px !important; height: 14px !important; border-radius: 3px !important; }
          .lc-cell { width: 14px !important; height: 14px !important; border-radius: 3px !important; }
        }
        ${mq.mobile} {
          .about-panels { grid-template-columns: 1fr; }
          .stat-card-3d { padding: 8px; }
        }

        .about-content {
          max-width: var(--content-width); margin: 0 auto; padding: 0 20px 64px;
        }
        ${mq.navCollapse} { .about-content { padding: 0 22px 34px; } }
        ${mq.mobile} {
          .about-content  { padding: 0 13px 28px; }
          .stat-card-3d   { width: 100% !important; min-width: 0 !important; }
          .lc-activity-label { font-size: 10px !important; }
          .lc-solved-box, .lc-emh-box { padding: 2px 4px !important; gap: 3px !important; }
        }

        .stat-card-3d ::-webkit-scrollbar { height: 4px; }
        .stat-card-3d ::-webkit-scrollbar-track { background: transparent; }
        .stat-card-3d ::-webkit-scrollbar-thumb { border-radius: 2px; background: rgba(10,186,181,0.45); }
      `}</style>

      <section id="stats" ref={statsRef} className={revealClass}>
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
          <div className="about-content">
            <div style={{ paddingTop: 50 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                <HeatmapPaletteButton isDark={isDark} activeKey={activeKey} onSelect={selectPalette} />
                Stats
              </span>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 20px" }} />
            <div
              className="about-panels"
              style={{
                paddingBottom: 32,
                ["--heat-1" as string]: active.c1,
                ["--heat-2" as string]: active.c2,
                ["--heat-3" as string]: active.c3,
                ["--heat-4" as string]: active.c4,
              } as React.CSSProperties}
            >
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