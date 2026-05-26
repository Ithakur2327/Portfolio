"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReveal } from "./useReveal";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

/* ── Tech registry ─────────────────────────────────────── */
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
  "GraphQL":     { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  "LLM APIs":    { color: "#10a37f", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg" },
  "LangChain":   { color: "#1C9E6E", logo: "https://avatars.githubusercontent.com/u/126733545?s=48" },
  "RAG":         { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":   { color: "#FF6333", logo: "https://avatars.githubusercontent.com/u/73504361?s=48" },
  "OpenAI":      { color: "#10a37f", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg" },
  "Gemini":      { color: "#4285F4", logo: "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06.svg" },
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
  { title: "BACKEND",   glowColor: "#339933", items: ["Node.js","Express.js","REST APIs","GraphQL"] },
  { title: "GENAI / AI",glowColor: "#10a37f", items: ["LLM APIs","LangChain","RAG","Vector DB","OpenAI","Gemini"] },
];

const ROW1 = ["MongoDB","MySQL","PostgreSQL","Git","GitHub","VS Code","Vercel","Postman","Docker"];
const ROW2 = ["Docker","Postman","Vercel","VS Code","GitHub","Git","PostgreSQL","MySQL","MongoDB"];

/* ── Skill chip ─────────────────────────────────────────── */
function SkillChip({ name, visible, delay = 0 }: { name: string; visible: boolean; delay?: number }) {
  const tech = TECH[name] ?? { color: "#71717a", logo: "" };
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0.18, y: visible ? 0 : 5 }}
      transition={{ delay: visible ? delay : 0, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, width: 62, cursor: "default" }}
    >
      <div
        style={{
          width: 40, height: 40,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 10,
          background: `${tech.color}${visible ? "1a" : "08"}`,
          border: `1px solid ${tech.color}${visible ? "45" : "18"}`,
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "translateY(-3px) scale(1.1)";
          el.style.boxShadow = `0 6px 20px ${tech.color}55`;
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.transform = "";
          el.style.boxShadow = "";
        }}
      >
        {tech.logo && (
          <img src={tech.logo} alt={name} width={24} height={24}
            style={{ objectFit: "contain", transition: "filter 0.4s", filter: visible ? "none" : "grayscale(1) opacity(0.25)" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <span style={{
        fontSize: 9.5, fontWeight: 500, fontFamily: MONO,
        textAlign: "center", lineHeight: 1.3, userSelect: "none",
        color: visible ? "var(--text-secondary)" : "var(--text-muted)",
        transition: "color 0.4s",
      }}>{name}</span>
    </motion.div>
  );
}

/* ── Lamp Beam — pure glow, NO background patches ─────────── */
function LampBeam({ glowColor, visible }: { glowColor: string; visible: boolean }) {
  return (
    // overflow:visible so glow can spill downward into chip area
    <div style={{ position: "relative", width: "100%", height: 64, overflow: "visible", flexShrink: 0, zIndex: 1 }}>

      {/* Horizontal bar at very top */}
      <motion.div
        animate={{ opacity: visible ? 1 : 0, scaleX: visible ? 1 : 0.12 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "72%", height: 2, borderRadius: 2,
          background: glowColor,
          boxShadow: `0 0 10px 2px ${glowColor}99`,
          transformOrigin: "center",
        }}
      />

      {/* Left wing — pure color, mask fades edges, NO bg overlay */}
      <motion.div
        animate={{ opacity: visible ? 0.55 : 0, scaleX: visible ? 1 : 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        style={{
          position: "absolute", top: 0, right: "50%",
          width: "52%", height: 70,
          background: `linear-gradient(to bottom right, ${glowColor}bb 0%, ${glowColor}33 50%, transparent 100%)`,
          maskImage: "linear-gradient(to left, transparent 0%, black 40%)",
          WebkitMaskImage: "linear-gradient(to left, transparent 0%, black 40%)",
          transformOrigin: "right center",
        }}
      />

      {/* Right wing */}
      <motion.div
        animate={{ opacity: visible ? 0.55 : 0, scaleX: visible ? 1 : 0.3 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
        style={{
          position: "absolute", top: 0, left: "50%",
          width: "52%", height: 70,
          background: `linear-gradient(to bottom left, ${glowColor}bb 0%, ${glowColor}33 50%, transparent 100%)`,
          maskImage: "linear-gradient(to right, transparent 0%, black 40%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 40%)",
          transformOrigin: "left center",
        }}
      />

      {/* Central downward glow — reaches toward icons */}
      <motion.div
        animate={{ opacity: visible ? 0.6 : 0, height: visible ? 90 : 30 }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: "60%",
          background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${glowColor}88 0%, ${glowColor}22 60%, transparent 100%)`,
          borderRadius: "0 0 50% 50%",
          pointerEvents: "none",
        }}
      />

    </div>
  );
}

/* ── Lamp Skill Box ─────────────────────────────────────── */
function LampSkillBox({ title, glowColor, items }: { title: string; glowColor: string; items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  // once:false so it toggles on scroll up/down
  const isInView = useInView(ref, { once: false, margin: "-60px 0px -60px 0px" });

  return (
    <div
      ref={ref}
      style={{
        flex: 1, minWidth: 0,
        borderRadius: 12,
        border: `1px solid ${glowColor}${isInView ? "2e" : "12"}`,
        background: "var(--bg-card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.6s",
        position: "relative",
      }}
    >
      {/* Lamp beam at top */}
      <LampBeam glowColor={glowColor} visible={isInView} />

      {/* Title */}
      <div style={{ textAlign: "center", marginTop: 8, marginBottom: 10, position: "relative", zIndex: 2 }}>
        <motion.span
          animate={{ opacity: isInView ? 1 : 0.2, y: isInView ? 0 : 3 }}
          transition={{ delay: isInView ? 0.3 : 0, duration: 0.5 }}
          style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
            color: isInView ? glowColor : "var(--text-muted)",
            fontFamily: MONO,
            transition: "color 0.5s",
            display: "inline-block",
          }}
        >{title}</motion.span>
      </div>

      {/* Thin accent divider */}
      <div style={{
        height: 1, margin: "0 14px 14px",
        background: `linear-gradient(to right, transparent, ${glowColor}${isInView ? "40" : "12"}, transparent)`,
        transition: "background 0.6s",
      }} />

      {/* Skills grid */}
      <div style={{ padding: "0 14px 16px", display: "flex", flexWrap: "wrap", gap: 10, position: "relative", zIndex: 2 }}>
        {items.map((name, i) => (
          <SkillChip key={name} name={name} visible={isInView} delay={isInView ? 0.35 + i * 0.06 : 0} />
        ))}
      </div>
    </div>
  );
}

/* ── Pure CSS infinite scrolling strip ─────────────────── */
function MovingStrip({ items, direction = "left" }: { items: string[]; direction?: "left" | "right" }) {
  const all = [...items, ...items, ...items];
  return (
    <div style={{
      overflow: "hidden",
      maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
    }}>
      <div
        className={direction === "left" ? "skills-strip-left" : "skills-strip-right"}
        style={{ display: "flex", gap: 10, width: "max-content" }}
        onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "paused"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.animationPlayState = "running"; }}
      >
        {all.map((name, idx) => {
          const tech = TECH[name] ?? { color: "#71717a", logo: "" };
          return (
            <div key={idx} style={{
              display: "flex", alignItems: "center", gap: 9,
              padding: "8px 14px",
              borderRadius: 10,
              border: `1px solid ${tech.color}28`,
              background: "var(--bg-card)",
              flexShrink: 0,
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 6,
                background: `${tech.color}18`,
                border: `1px solid ${tech.color}35`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {tech.logo && (
                  <img src={tech.logo} alt={name} width={16} height={16}
                    style={{ objectFit: "contain" }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
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
}

/* ── Main export ───────────────────────────────────────── */
export function SkillsSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <style>{`
        .skills-strip-left  { animation: skills-left  36s linear infinite; }
        .skills-strip-right { animation: skills-right 36s linear infinite; }
        @keyframes skills-left  { from { transform: translateX(0); }          to { transform: translateX(-33.333%); } }
        @keyframes skills-right { from { transform: translateX(-33.333%); }   to { transform: translateX(0); } }

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
      >
        {/* Full-bleed background strip — same pattern as AboutSection */}
        <div style={{
          position: "relative",
          left: "50%",
          marginLeft: "-50vw",
          width: "100vw",
          background: "var(--bg-base)",
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 32px 40px" }}>

            {/* Heading */}
            <div style={{ paddingTop: 28 }}>
              <span style={{
                fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em",
                lineHeight: 1, fontFamily: SF,
                color: "var(--text-primary)", display: "inline-block",
              }}>Skills</span>
            </div>

            <div style={{ height: 1, background: "var(--border)", margin: "18px 0 24px" }} />

            {/* 4 lamp boxes */}
            <div className="skills-lamp-grid" style={{ display: "flex", gap: 12 }}>
              {LAMP_GROUPS.map(g => (
                <LampSkillBox key={g.title} {...g} />
              ))}
            </div>

            {/* Moving strips — bleed to container edges */}
            <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 10, marginLeft: -32, marginRight: -32 }}>
              <MovingStrip items={ROW1} direction="left"  />
              <MovingStrip items={ROW2} direction="right" />
            </div>

          </div>
        </div>
      </motion.section>

      <div style={{ height: 55 }} />
    </>
  );
}