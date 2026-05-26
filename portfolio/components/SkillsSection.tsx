"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReveal } from "./useReveal";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

const TECH: Record<string, { color: string; logo: string }> = {
  "Python":      { color: "#3776AB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  "Java":        { color: "#ED8B00", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  "C++":         { color: "#00599C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  "TypeScript":  { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  "JavaScript":  { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "React.js":    { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":     { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Tailwind CSS":{ color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  "HTML5":       { color: "#E34F26", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  "CSS3":        { color: "#1572B6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  "Node.js":     { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js":  { color: "#888888", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  "REST APIs":   { color: "#6366f1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  "FastAPI":     { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  "GraphQL":     { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  "LLM APIs":    { color: "#10a37f", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg" },
  "LangChain":   { color: "#1C9E6E", logo: "https://avatars.githubusercontent.com/u/126733545?s=48" },
  "LangGraph":   { color: "#2D6A4F", logo: "https://avatars.githubusercontent.com/u/126733545?s=48" },
  "RAG":         { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":   { color: "#FF6333", logo: "https://avatars.githubusercontent.com/u/73504361?s=48" },
  "MongoDB":     { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  "MySQL":       { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  "PostgreSQL":  { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  "Git":         { color: "#F05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  "GitHub":      { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  "VS Code":     { color: "#007ACC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  "Vercel":      { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" },
  "Postman":     { color: "#FF6C37", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
  "Docker":      { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
};

const LAMP_GROUPS = [
  { title: "LANGUAGES", glowColor: "#3776AB", items: ["Python","Java","C++","TypeScript","JavaScript"] },
  { title: "FRONTEND",  glowColor: "#61DAFB", items: ["React.js","Next.js","TypeScript","Tailwind CSS","HTML5","CSS3"] },
  { title: "BACKEND",   glowColor: "#339933", items: ["Node.js","Express.js","REST APIs","FastAPI","GraphQL"] },
  { title: "GENAI / AI",glowColor: "#10a37f", items: ["LLM APIs","LangChain","LangGraph","RAG","Vector DB"] },
];

const STRIP_NAMES = ["MongoDB","MySQL","PostgreSQL","Git","GitHub","VS Code","Vercel","Postman","Docker"];

/* ── Skill chip ─────────────────────────────────────────── */
function SkillChip({ name, visible, delay = 0 }: { name: string; visible: boolean; delay?: number }) {
  const tech = TECH[name] ?? { color: "#71717a", logo: "" };
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={visible ? { opacity: 1, y: 0 } : { opacity: 0.15, y: 6 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 62, cursor: "default" }}
    >
      <div
        style={{
          width: 40, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 10,
          background: visible ? `${tech.color}18` : `${tech.color}08`,
          border: `1px solid ${tech.color}${visible ? "45" : "20"}`,
          transition: "transform 0.2s, box-shadow 0.2s, background 0.4s, border-color 0.4s",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-3px) scale(1.1)";
          el.style.boxShadow = `0 6px 20px ${tech.color}50`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "";
          el.style.boxShadow = "";
        }}
      >
        {tech.logo && (
          <img src={tech.logo} alt={name} width={24} height={24}
            style={{ objectFit: "contain", filter: visible ? "none" : "grayscale(1) opacity(0.3)", transition: "filter 0.4s" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <span style={{
        fontSize: 9.5, fontWeight: 500,
        color: visible ? "var(--text-secondary)" : "var(--text-muted)",
        fontFamily: MONO, textAlign: "center", lineHeight: 1.3,
        transition: "color 0.4s", userSelect: "none",
      }}>{name}</span>
    </motion.div>
  );
}

/* ── Lamp Beam — exactly like screenshot 2:
     one thin line at top + soft radial glow below, nothing else ── */
function LampBeam({ glowColor, visible }: { glowColor: string; visible: boolean }) {
  return (
    <div style={{ position: "relative", width: "100%", height: 80, flexShrink: 0, overflow: "visible" }}>

      {/* THE line — thin, centered, fades at edges */}
      <motion.div
        animate={
          visible
            ? { opacity: 1, scaleX: 1 }
            : { opacity: 0, scaleX: 0.15 }
        }
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          transformOrigin: "center",
          width: "78%", height: 1.5,
          borderRadius: 2,
          background: `linear-gradient(to right, transparent 0%, ${glowColor} 20%, ${glowColor} 80%, transparent 100%)`,
          boxShadow: visible ? `0 0 8px 1px ${glowColor}77` : "none",
          transition: "box-shadow 0.75s",
        }}
      />

      {/* Soft radial glow below the line — reaches down to icons */}
      <motion.div
        animate={
          visible
            ? { opacity: 1, height: 110 }
            : { opacity: 0, height: 40 }
        }
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        style={{
          position: "absolute",
          top: 0, left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          background: `radial-gradient(ellipse 100% 90% at 50% 0%, ${glowColor}44 0%, ${glowColor}18 45%, transparent 80%)`,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

/* ── Lamp Skill Box ─────────────────────────────────────── */
function LampSkillBox({ title, glowColor, items }: { title: string; glowColor: string; items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-80px 0px -80px 0px" });

  return (
    <div
      ref={ref}
      style={{
        flex: 1, minWidth: 0,
        borderRadius: 12,
        border: `1px solid ${glowColor}${isInView ? "28" : "10"}`,
        background: "var(--bg-card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.6s",
      }}
    >
      <LampBeam glowColor={glowColor} visible={isInView} />

      {/* Title */}
      <div style={{ textAlign: "center", marginTop: 2, marginBottom: 12, position: "relative", zIndex: 10 }}>
        <motion.span
          animate={{ opacity: isInView ? 1 : 0.22, y: isInView ? 0 : 4 }}
          transition={{ delay: isInView ? 0.3 : 0, duration: 0.5 }}
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: isInView ? glowColor : "var(--text-muted)",
            fontFamily: MONO,
            transition: "color 0.5s",
          }}
        >{title}</motion.span>
      </div>

      {/* Accent divider */}
      <div style={{
        height: 1, margin: "0 14px 14px",
        background: `linear-gradient(to right, transparent, ${glowColor}${isInView ? "30" : "0a"}, transparent)`,
        transition: "background 0.6s",
      }} />

      {/* Skills grid */}
      <div style={{ padding: "0 14px 16px", display: "flex", flexWrap: "wrap", gap: 10 }}>
        {items.map((name, i) => (
          <SkillChip key={name} name={name} visible={isInView} delay={isInView ? 0.35 + i * 0.07 : 0} />
        ))}
      </div>
    </div>
  );
}

/* ── Single infinite moving strip ──────────────────────── */
function MovingStrip({ items }: { items: string[] }) {
  const all = [...items, ...items, ...items];
  return (
    <div style={{
      overflow: "hidden",
      maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
    }}>
      <div
        style={{ display: "flex", gap: 10, width: "max-content", animation: "skills-scroll-left 35s linear infinite" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "running"; }}
      >
        {all.map((name, idx) => {
          const tech = TECH[name] ?? { color: "#71717a", logo: "" };
          return (
            <div key={idx} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 14px", borderRadius: 10,
              border: `1px solid ${tech.color}28`,
              background: "var(--bg-card)",
              flexShrink: 0,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: `${tech.color}18`, border: `1px solid ${tech.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {tech.logo && (
                  <img src={tech.logo} alt={name} width={16} height={16}
                    style={{ objectFit: "contain" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-secondary)", fontFamily: MONO, whiteSpace: "nowrap" }}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main export ───────────────────────────────────────── */
export function SkillsSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <style>{`
        @keyframes skills-scroll-left {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        @media (max-width: 860px) {
          .skills-lamp-grid { flex-wrap: wrap !important; }
          .skills-lamp-grid > * { min-width: calc(50% - 6px) !important; flex: 0 0 calc(50% - 6px) !important; }
        }
        @media (max-width: 500px) {
          .skills-lamp-grid > * { min-width: 100% !important; flex: 0 0 100% !important; }
        }
      `}</style>

      <div style={{ height: 60 }} />

      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 14 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        id="skills"
        style={{ marginBottom: 55 }}
      >
        <div style={{
          position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw",
          background: "var(--bg-base)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 32px 40px" }}>

            <div style={{ paddingTop: 28 }}>
              <span style={{
                fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1,
                fontFamily: SF, color: "var(--text-primary)", display: "inline-block",
              }}>Skills</span>
            </div>

            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 24px" }} />

            {/* 4 lamp boxes */}
            <div className="skills-lamp-grid" style={{ display: "flex", gap: 12 }}>
              {LAMP_GROUPS.map(g => (
                <LampSkillBox key={g.title} {...g} />
              ))}
            </div>

            {/* Single moving strip */}
            <div style={{ marginTop: 28, marginLeft: -32, marginRight: -32 }}>
              <MovingStrip items={STRIP_NAMES} />
            </div>

          </div>
        </div>
      </motion.section>
    </>
  );
}