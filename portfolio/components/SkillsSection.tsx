"use client";

import React, { useRef, memo } from "react";
import { useInView } from "motion/react";
import { useReveal } from "./useReveal";
import { useLowPerf } from "./PerfMode";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

const TECH: Record<string, { color: string; logo: string }> = {
  Python:         { color: "#3776AB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  Java:           { color: "#ED8B00", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  "C++":          { color: "#00599C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  TypeScript:     { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  JavaScript:     { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "React.js":     { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":      { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  HTML5:          { color: "#E34F26", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  CSS3:           { color: "#1572B6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  "Node.js":      { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js":   { color: "#ffffff", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  "REST APIs":    { color: "#6366f1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  FastAPI:        { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  GraphQL:        { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  "LLM APIs":     { color: "#10a37f", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  LangChain:      { color: "#1C9E6E", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png" },
  LangGraph:      { color: "#2D6A4F", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langgraph-color.png" },
  RAG:            { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":    { color: "#FF6333", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  MongoDB:        { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  MySQL:          { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  PostgreSQL:     { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  Git:            { color: "#F05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  GitHub:         { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  "VS Code":      { color: "#007ACC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  Vercel:         { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
  Postman:        { color: "#FF6C37", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
  Docker:         { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
};

const LAMP_GROUPS = [
  { title: "LANGUAGES", glowColor: "#3776AB", items: ["Python", "Java", "C++", "TypeScript", "JavaScript"] },
  { title: "FRONTEND",  glowColor: "#61DAFB", items: ["React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3"] },
  { title: "BACKEND",   glowColor: "#339933", items: ["Node.js", "Express.js", "REST APIs", "FastAPI", "GraphQL"] },
  { title: "GENAI / AI",glowColor: "#10a37f", items: ["LLM APIs", "LangChain", "LangGraph", "RAG", "Vector DB"] },
];

const STRIP_NAMES = [
  "MongoDB", "MySQL", "PostgreSQL", "Git", "GitHub",
  "VS Code", "Vercel", "Postman", "Docker",
];

/* ── Skill Chip ── */
const SkillChip = memo(function SkillChip({
  name, visible, delay = 0,
}: { name: string; visible: boolean; delay?: number }) {
  const tech = TECH[name] ?? { color: "#71717a", logo: "" };

  return (
    <div
      className="skill-chip"
      style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 7, width: 68, cursor: "default",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(10px)",
        transition: `opacity 0.48s cubic-bezier(0.22,1,0.36,1) ${visible ? delay : 0}s,
                     transform 0.48s cubic-bezier(0.22,1,0.36,1) ${visible ? delay : 0}s`,
      }}
    >
      <div
        className="skill-chip-box"
        style={{
          width: 46, height: 46,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 12,
          background: visible ? `${tech.color}18` : `${tech.color}08`,
          border: `1px solid ${tech.color}${visible ? "42" : "20"}`,
          backfaceVisibility: "hidden",
          transition: "background 0.4s ease, border-color 0.4s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.22s ease",
        }}
      >
        {tech.logo && (
          <img
            src={tech.logo} alt={name}
            width={26} height={26}
            loading="lazy" draggable={false}
            style={{
              objectFit: "contain",
              userSelect: "none", pointerEvents: "none",
              filter: visible ? "none" : "grayscale(1) opacity(.35)",
              transition: "filter 0.38s ease",
            }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <span style={{
        fontSize: 9.5, fontWeight: 500,
        color: visible ? "var(--text-secondary)" : "var(--text-muted)",
        fontFamily: MONO, textAlign: "center",
        lineHeight: 1.3, transition: "color 0.38s ease",
        userSelect: "none",
      }}>
        {name}
      </span>
    </div>
  );
});

/* ── Lamp Beam ── */
function LampBeam({ glowColor, visible }: { glowColor: string; visible: boolean }) {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      {/* Top beam line */}
      <div
        style={{
          position: "absolute", top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "74%", height: 1.5, borderRadius: 999,
          background: `linear-gradient(90deg,transparent 0%,${glowColor} 18%,${glowColor} 82%,transparent 100%)`,
          boxShadow: visible ? `0 0 10px ${glowColor},0 0 24px ${glowColor}66` : "none",
          transformOrigin: "center",
          opacity: visible ? 1 : 0,
          scaleX: visible ? 1 : 0.2,
          transition: "opacity 0.72s cubic-bezier(0.22,1,0.36,1), transform 0.72s cubic-bezier(0.22,1,0.36,1), box-shadow 0.72s ease",
        } as React.CSSProperties}
      />
      {/* Wide glow */}
      <div
        className="skills-lamp-glow-wide"
        style={{
          position: "absolute", left: "50%", top: 0,
          transform: "translate3d(-50%,0,0)",
          width: "180%", height: "145%",
          background: `radial-gradient(ellipse 60% 70% at 50% 0%,${glowColor}2e 0%,${glowColor}16 25%,${glowColor}0e 45%,${glowColor}08 60%,transparent 82%)`,
          filter: "blur(18px)",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.90s cubic-bezier(0.22,1,0.36,1)",
        }}
      />
      {/* Inner glow */}
      <div
        className="skills-lamp-glow-inner"
        style={{
          position: "absolute", left: "50%", top: 0,
          transform: "translateX(-50%)", width: "120%", height: "100%",
          background: `radial-gradient(ellipse 42% 38% at 50% 0%,${glowColor}40 0%,${glowColor}1e 35%,${glowColor}0e 55%,transparent 78%)`,
          filter: "blur(10px)",
          opacity: visible ? 1 : 0,
          transition: `opacity 0.78s cubic-bezier(0.22,1,0.36,1) ${visible ? "0.06s" : "0s"}`,
        }}
      />
    </div>
  );
}

/* ── Lamp Skill Box — no card background, border-only partition ── */
function LampSkillBox({
  title, glowColor, items, isLast,
}: { title: string; glowColor: string; items: string[]; isLast?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const lowPerf = useLowPerf();
  const isInView = useInView(ref, { margin: "-60px 0px -60px 0px", once: lowPerf });

  return (
    <div
      ref={ref}
      style={{
        flex: 1, minWidth: 0,
        /* No card background — transparent */
        background: "transparent",
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        position: "relative",
        /* Right border as divider (except last) */
        borderRight: isLast ? "none" : "1px solid var(--border)",
        paddingRight: isLast ? 0 : 0,
        willChange: "transform", transform: "translateZ(0)",
        backfaceVisibility: "hidden", minHeight: 285,
        contain: "layout style",
      }}
    >
      <LampBeam glowColor={glowColor} visible={isInView} />
      <div style={{ position: "relative", zIndex: 1, paddingTop: 20, display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 12 }}>
          <span
            style={{
              display: "inline-block",
              fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isInView ? glowColor : "var(--text-muted)",
              fontFamily: MONO,
              opacity: isInView ? 1 : 0.22,
              transform: isInView ? "none" : "translateY(4px)",
              transition: "opacity 0.48s cubic-bezier(0.22,1,0.36,1), transform 0.48s cubic-bezier(0.22,1,0.36,1), color 0.42s ease",
            }}
          >
            {title}
          </span>
        </div>
        <div style={{
          height: 1, margin: "0 14px 18px",
          background: `linear-gradient(to right,transparent,${glowColor}${isInView ? "35" : "08"},transparent)`,
          transition: "background 0.5s ease",
        }} />
        <div style={{
          padding: "0 14px 20px", display: "flex",
          flexWrap: "wrap", gap: 12, justifyContent: "center",
          alignContent: "flex-start", flex: 1,
        }}>
          {items.map((name, i) => (
            <SkillChip
              key={name} name={name} visible={isInView}
              delay={isInView ? 0.075 + i * 0.042 : 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Moving Strip — fixed with hover pause ── */
function MovingStrip({ items }: { items: string[] }) {
  const all = [...items, ...items, ...items];

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
        {all.map((name, idx) => {
          const tech = TECH[name] ?? { color: "#71717a", logo: "" };
          return (
            <div
              key={idx}
              style={{
                display: "flex", alignItems: "center", gap: 9,
                padding: "8px 14px", borderRadius: 10,
                border: `1px solid ${tech.color}28`,
                background: "var(--bg-card)", flexShrink: 0,
                willChange: "transform", transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: `${tech.color}18`, border: `1px solid ${tech.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                {tech.logo && (
                  <img src={tech.logo} alt={name} width={16} height={16}
                    loading="lazy" draggable={false}
                    style={{ objectFit: "contain" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 500, color: "var(--text-secondary)",
                fontFamily: MONO, whiteSpace: "nowrap",
              }}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main ── */
export function SkillsSection() {
  const { ref, revealClass, visible } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        /* Hover pause fix for moving strip */
        .skills-strip-outer:hover .skills-strip {
          animation-play-state: paused !important;
        }

        /* Skills lamp grid */
        .skills-lamp-grid {
          display: flex;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }
        @media (max-width: 680px) {
          .skills-lamp-grid {
            flex-direction: column;
          }
          .skills-lamp-grid > div {
            border-right: none !important;
            border-bottom: 1px solid var(--border);
          }
          .skills-lamp-grid > div:last-child {
            border-bottom: none !important;
          }
        }
      `}</style>
      <section
        ref={ref}
        id="skills"
        className={revealClass}
      >
        <div style={{
          position: "relative",
          left: "50%", marginLeft: "-50vw",
          width: "100vw",
          background: "var(--bg-base)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          maskImage: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, black 15%, black 85%, rgba(0,0,0,0.45) 100%)",
          WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,0.45) 0%, black 15%, black 85%, rgba(0,0,0,0.45) 100%)",
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
            <div className="skills-lamp-grid">
              {LAMP_GROUPS.map((g, idx) => (
                <LampSkillBox
                  key={g.title}
                  {...g}
                  isLast={idx === LAMP_GROUPS.length - 1}
                />
              ))}
            </div>
            <div style={{ marginTop: 28, marginLeft: -20, marginRight: -20 }}>
              <MovingStrip items={STRIP_NAMES} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}