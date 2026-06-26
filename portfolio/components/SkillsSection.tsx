"use client";

import React, { useRef, memo, useEffect, useState } from "react";
import { useLowPerf } from "./PerfMode";
import { useReveal } from "./useReveal";
import { useTheme } from "./ThemeProvider";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

/* ─── Tech definitions
   bright: true  → white/light SVG that needs brightness boost in dark mode
   invert: true  → black/dark SVG that needs invert(1) to appear white in dark mode
──────────────────────────────────────────────────────────────── */
const TECH: Record<string, { color: string; logo: string; bright?: boolean; invert?: boolean }> = {
  // Languages
  Python:         { color: "#3776AB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  Java:           { color: "#ED8B00", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  "C++":          { color: "#00599C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  TypeScript:     { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  JavaScript:     { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  // Frontend
  "React.js":     { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":      { color: "#e2e8f0", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", bright: true },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  HTML5:          { color: "#E34F26", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  CSS3:           { color: "#1572B6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  // Backend
  "Node.js":      { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js":   { color: "#e2e8f0", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invert: true },
  "REST APIs":    { color: "#85EA2D", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" },
  FastAPI:        { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  GraphQL:        { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  // GenAI / AI
  "LLM APIs":     { color: "#74aa9c", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/openai/openai-original.svg", invert: true },
  LangChain:      { color: "#1C9E6E", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png" },
  LangGraph:      { color: "#2ecc71", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langgraph-color.png" },
  RAG:            { color: "#ee4c2c", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":    { color: "#FF6333", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  // Cloud & DevOps
  AWS:            { color: "#FF9900", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", bright: true },
  Kubernetes:     { color: "#326CE5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  Docker:         { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  "CI/CD":        { color: "#f05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
  Vercel:         { color: "#e2e8f0", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", invert: true },
  // Tools & Database
  MongoDB:        { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  MySQL:          { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  PostgreSQL:     { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  Git:            { color: "#F05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  GitHub:         { color: "#e2e8f0", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert: true },
  Postman:        { color: "#FF6C37", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
  // Strip extras
  "VS Code":      { color: "#007ACC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
};

// ROW 1: 3 cards
const LAMP_ROW1 = [
  { title: "LANGUAGES", glowColor: "#3776AB", items: ["Python", "Java", "C++", "TypeScript", "JavaScript"] },
  { title: "FRONTEND",  glowColor: "#61DAFB", items: ["React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3"] },
  { title: "BACKEND",   glowColor: "#339933", items: ["Node.js", "Express.js", "REST APIs", "FastAPI", "GraphQL"] },
];

// ROW 2: Cloud first, then Tools, then GenAI
const LAMP_ROW2 = [
  { title: "CLOUD & DEVOPS",   glowColor: "#FF9900", items: ["AWS", "Kubernetes", "Docker", "CI/CD", "Vercel"] },
  { title: "TOOLS & DATABASE", glowColor: "#47A248", items: ["MongoDB", "MySQL", "PostgreSQL", "Git", "GitHub", "Postman"] },
  { title: "GENAI / AI",       glowColor: "#10a37f", items: ["LLM APIs", "LangChain", "LangGraph", "RAG", "Vector DB"] },
];

const STRIP_NAMES = [
  "Python", "TypeScript", "React.js", "Next.js", "Node.js",
  "FastAPI", "GraphQL", "MongoDB", "PostgreSQL", "Docker",
  "AWS", "Kubernetes", "Git", "VS Code", "Postman",
];

/* ─── Staggered grid column calculator ───
   Uses a 6-column grid so:
   • Full rows:       items at cols 1-2, 3-4, 5-6
   • Last row of 2:   items at cols 2-3, 4-5  (centered under gaps)
   • Last row of 1:   item at cols 3-4         (centered)
────────────────────────────────────────── */
function getGridColumn(idx: number, total: number): string {
  const remainder = total % 3;
  const lastRowCount = remainder === 0 ? 3 : remainder;
  const lastRowStart = total - lastRowCount;
  const isLastRow = idx >= lastRowStart;
  const posInRow = idx % 3;

  if (!isLastRow || lastRowCount === 3) {
    const col = posInRow * 2 + 1; // 1, 3, 5
    return `${col} / ${col + 2}`;
  }

  const posInLastRow = idx - lastRowStart;

  if (lastRowCount === 2) {
    // Offset by 1 column so icons sit under gaps of row above
    const col = posInLastRow * 2 + 2; // 2, 4
    return `${col} / ${col + 2}`;
  }

  // lastRowCount === 1 → center
  return "3 / 5";
}

/* ─── useBoxInView ─── */
function useBoxInView(lowPerf: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const isIn = entry.isIntersecting;
        setInView(isIn);
        if (isIn && lowPerf) obs.disconnect();
      },
      { rootMargin: "-60px 0px -60px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lowPerf]);

  return { ref, inView };
}

/* ─── SkillChip ───
   • 6-col grid so 2nd row of 5 sits under gaps of 1st row
   • bright icons → brightness boost in dark mode
   • invert icons → invert(1) in dark mode (black SVGs → white)
─────────────────── */
const SkillChip = memo(function SkillChip({
  name, visible, delay = 0, gridColumn,
}: { name: string; visible: boolean; delay?: number; gridColumn?: string }) {
  const tech = TECH[name] ?? { color: "#71717a", logo: "" };
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const chipStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column", alignItems: "center",
    gap: 5, cursor: "default",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0px)" : "translateY(10px)",
    transition: visible
      ? `opacity 0.48s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.48s cubic-bezier(0.22,1,0.36,1) ${delay}s`
      : "opacity 0.3s ease, transform 0.3s ease",
    gridColumn,
  };

  const boxStyle: React.CSSProperties = {
    width: 44, height: 44,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 10,
    background: `${tech.color}20`,
    border: `1px solid ${tech.color}${visible ? "50" : "20"}`,
    transition: "border-color 0.4s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease",
  };

  // Compute filter based on theme and icon type
  const getImgFilter = () => {
    if (!visible) return "grayscale(1) opacity(.3)";
    if (isDark) {
      if (tech.invert) return "invert(1) brightness(0.92)";
      if (tech.bright) return "brightness(1.9) contrast(1.1)";
    } else {
      // light mode: inverted (originally dark/black) icons are fine as-is
      // bright (white) icons need darkening so they're visible
      if (tech.bright) return "brightness(0.15)";
    }
    return "none";
  };

  const imgStyle: React.CSSProperties = {
    objectFit: "contain", userSelect: "none", pointerEvents: "none",
    filter: getImgFilter(),
    transition: "filter 0.38s ease",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9, fontWeight: 500,
    color: visible ? "var(--text-secondary)" : "var(--text-muted)",
    fontFamily: MONO, textAlign: "center",
    lineHeight: 1.3, transition: "color 0.38s ease",
    userSelect: "none", whiteSpace: "nowrap",
  };

  return (
    <div className="skill-chip" style={chipStyle}>
      <div className="skill-chip-box" style={boxStyle}>
        {tech.logo && (
          <img
            src={tech.logo} alt={name}
            width={24} height={24}
            loading="lazy" draggable={false}
            style={imgStyle}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <span style={labelStyle}>{name}</span>
    </div>
  );
});

/* ─── LampBeam ───
   Dark mode → white glow (clean, minimal)
   Light mode → card's own glowColor (current behaviour)
──────────────── */
const LampBeam = memo(function LampBeam({
  glowColor, visible,
}: { glowColor: string; visible: boolean }) {
  const { theme } = useTheme();
  const effectiveColor = theme === "dark" ? "#ffffff" : glowColor;

  return (
    <div
      aria-hidden
      style={{
        position: "absolute", inset: 0, overflow: "hidden",
        pointerEvents: "none", zIndex: 0,
        transform: "translateZ(0)", willChange: "opacity",
      }}
    >
      {/* Top line beam */}
      <div style={{
        position: "absolute", top: 0, left: "50%",
        transform: "translateX(-50%)",
        width: "74%", height: 1.5, borderRadius: 999,
        background: `linear-gradient(90deg,transparent 0%,${effectiveColor} 18%,${effectiveColor} 82%,transparent 100%)`,
        boxShadow: visible ? `0 0 10px ${effectiveColor},0 0 24px ${effectiveColor}66` : "0 0 0px transparent",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.72s cubic-bezier(0.22,1,0.36,1), box-shadow 0.72s ease",
      }} />
      {/* Wide glow cone */}
      <div style={{
        position: "absolute", left: "50%", top: 0,
        transform: "translate3d(-50%,0,0)",
        width: "180%", height: "145%",
        background: `radial-gradient(ellipse 60% 70% at 50% 0%,${effectiveColor}2e 0%,${effectiveColor}16 25%,${effectiveColor}0e 45%,${effectiveColor}08 60%,transparent 82%)`,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.90s cubic-bezier(0.22,1,0.36,1)",
      }} />
      {/* Inner tight glow */}
      <div style={{
        position: "absolute", left: "50%", top: 0,
        transform: "translateX(-50%)",
        width: "120%", height: "100%",
        background: `radial-gradient(ellipse 42% 38% at 50% 0%,${effectiveColor}40 0%,${effectiveColor}1e 35%,${effectiveColor}0e 55%,transparent 78%)`,
        opacity: visible ? 1 : 0,
        transition: `opacity 0.78s cubic-bezier(0.22,1,0.36,1) ${visible ? "0.06s" : "0s"}`,
      }} />
    </div>
  );
});

/* ─── LampSkillBox ───
   Chips use a 6-column CSS grid so:
   • 5 items → row 1: 3 icons, row 2: 2 icons centred under gaps
   • 6 items → 2 equal rows of 3
──────────────────── */
function LampSkillBox({
  title, glowColor, items,
}: { title: string; glowColor: string; items: string[] }) {
  const lowPerf = useLowPerf();
  const { ref, inView } = useBoxInView(lowPerf);

  return (
    <div
      ref={ref}
      className="lamp-skill-box"
      style={{
        background: "transparent",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        position: "relative",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <LampBeam glowColor={glowColor} visible={inView} />

      <div style={{
        position: "relative", zIndex: 1,
        paddingTop: 16,
        display: "flex", flexDirection: "column", height: "100%",
      }}>
        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: 10 }}>
          <span style={{
            display: "inline-block",
            fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: inView ? glowColor : "var(--text-muted)",
            fontFamily: MONO,
            opacity: inView ? 1 : 0.22,
            transform: inView ? "none" : "translateY(4px)",
            transition: "opacity 0.48s cubic-bezier(0.22,1,0.36,1), transform 0.48s cubic-bezier(0.22,1,0.36,1), color 0.42s ease",
          }}>
            {title}
          </span>
        </div>

        {/* Separator */}
        <div style={{
          height: 1, margin: "0 14px 16px",
          background: `linear-gradient(to right,transparent,${glowColor}${inView ? "35" : "08"},transparent)`,
          transition: "background 0.5s ease",
        }} />

        {/* Chips — 6-column grid for staggered layout */}
        <div style={{
          padding: "0 14px 18px",
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gap: "12px 4px",
          justifyItems: "center",
          flex: 1,
        }}>
          {items.map((name, i) => (
            <SkillChip
              key={name}
              name={name}
              visible={inView}
              delay={inView ? 0.075 + i * 0.042 : 0}
              gridColumn={getGridColumn(i, items.length)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MovingStrip ─── */
const STRIP_ALL = [...STRIP_NAMES, ...STRIP_NAMES, ...STRIP_NAMES];

const MovingStrip = memo(function MovingStrip() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className="skills-strip-outer"
      style={{
        overflow: "hidden",
        maskImage: "linear-gradient(to right,transparent,black 8%,black 92%,transparent)",
        WebkitMaskImage: "linear-gradient(to right,transparent,black 8%,black 92%,transparent)",
      }}
    >
      <div
        className="skills-strip"
        style={{
          display: "flex", gap: 10, width: "max-content",
          animation: "skills-scroll-left 32s linear infinite",
          willChange: "transform", transform: "translateZ(0)",
        }}
      >
        {STRIP_ALL.map((name, idx) => {
          const tech = TECH[name] ?? { color: "#71717a", logo: "" };
          const stripFilter = isDark
            ? tech.invert ? "invert(1) brightness(0.92)"
              : tech.bright ? "brightness(1.9) contrast(1.1)"
              : "none"
            : tech.bright ? "brightness(0.15)" : "none";

          return (
            <div key={idx} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 14px", borderRadius: 10,
              border: `1px solid ${tech.color}28`,
              background: "var(--bg-card)", flexShrink: 0,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: `${tech.color}18`, border: `1px solid ${tech.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {tech.logo && (
                  <img
                    src={tech.logo} alt={name} width={16} height={16}
                    loading="lazy" draggable={false}
                    style={{ objectFit: "contain", filter: stripFilter }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 500,
                color: "var(--text-secondary)",
                fontFamily: MONO, whiteSpace: "nowrap",
              }}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

/* ─── Main ─── */
export function SkillsSection() {
  const { ref, revealClass } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        /* Strip hover pause */
        .skills-strip-outer:hover .skills-strip {
          animation-play-state: paused !important;
        }

        /* Chip hover */
        .skill-chip:hover .skill-chip-box {
          transform: translateY(-3px) scale(1.07);
          box-shadow: 0 6px 18px rgba(0,0,0,0.35);
        }

        /* Grid wrapper */
        .skills-grid-wrapper {
          display: flex;
          flex-direction: column;
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }

        /* Each row */
        .skills-grid-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid var(--border);
        }
        .skills-grid-row:last-child {
          border-bottom: none;
        }

        /* Each card inside row */
        .lamp-skill-box {
          border-right: 1px solid var(--border);
          min-height: 220px;
        }
        .lamp-skill-box:last-child {
          border-right: none;
        }

        /* ── Tablet: 2 cards per row ── */
        @media (max-width: 900px) {
          .skills-grid-row {
            grid-template-columns: repeat(2, 1fr);
            flex-wrap: wrap;
          }
          .skills-grid-row .lamp-skill-box:nth-child(3) {
            grid-column: span 2;
            border-right: none;
            border-top: 1px solid var(--border);
          }
          .lamp-skill-box {
            min-height: 200px;
          }
        }

        /* ── Mobile: 1 card per row ── */
        @media (max-width: 580px) {
          .skills-grid-row {
            grid-template-columns: 1fr;
          }
          .skills-grid-row .lamp-skill-box:nth-child(3) {
            grid-column: span 1;
          }
          .lamp-skill-box {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
            min-height: auto;
          }
          .lamp-skill-box:last-child {
            border-bottom: none;
          }
        }
      `}</style>

      <section ref={ref} id="skills" className={revealClass}>
        <div style={{
          position: "relative",
          left: "50%", marginLeft: "-50vw",
          width: "100vw",
          background: "var(--bg-base)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 40px" }}>
            <div style={{ paddingTop: 28, marginBottom: 4 }}>
              <span style={{
                fontSize: 28, fontWeight: 700,
                letterSpacing: "-0.03em", lineHeight: 1,
                fontFamily: SF, color: "var(--text-primary)",
                display: "inline-block",
              }}>
                Skills
              </span>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 24px" }} />

            <div className="skills-grid-wrapper">
              <div className="skills-grid-row">
                {LAMP_ROW1.map((g) => (
                  <LampSkillBox key={g.title} {...g} />
                ))}
              </div>
              <div className="skills-grid-row">
                {LAMP_ROW2.map((g) => (
                  <LampSkillBox key={g.title} {...g} />
                ))}
              </div>
            </div>

            <div style={{ marginTop: 28, marginLeft: -20, marginRight: -20 }}>
              <MovingStrip />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}