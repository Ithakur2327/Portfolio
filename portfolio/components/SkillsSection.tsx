"use client";
import { useReveal } from "./useReveal";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/ui/lamp";
import { InfiniteMovingSkills } from "@/components/ui/infinite-moving-cards";

/* ── tech data ─────────────────────────────────────────── */
const TECH: Record<string, { color: string; logo: string }> = {
  "Python":     { color: "#3776AB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  "Java":       { color: "#ED8B00", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  "C++":        { color: "#00599C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  "TypeScript": { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  "JavaScript": { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "React.js":   { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":    { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  "HTML5":      { color: "#E34F26", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  "CSS3":       { color: "#1572B6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  "Node.js":    { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js": { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  "REST APIs":  { color: "#6366f1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  "GraphQL":    { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  "LLM APIs":   { color: "#10a37f", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg" },
  "LangChain":  { color: "#1C3C3C", logo: "https://avatars.githubusercontent.com/u/126733545?s=48" },
  "RAG":        { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":  { color: "#FF6333", logo: "https://avatars.githubusercontent.com/u/73504361?s=48" },
  "OpenAI":     { color: "#10a37f", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg" },
  "Gemini":     { color: "#4285F4", logo: "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06.svg" },
  "MongoDB":    { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  "MySQL":      { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  "PostgreSQL": { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  "Git":        { color: "#F05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  "GitHub":     { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  "VS Code":    { color: "#007ACC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  "Vercel":     { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" },
  "Postman":    { color: "#FF6C37", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
  "Docker":     { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
};

function t(name: string) {
  return { name, ...TECH[name] ?? { color: "#71717a", logo: "" } };
}

/* ── Lamp section groups ───────────────────────────────── */
const LAMP_GROUPS = [
  {
    title: "LANGUAGES",
    glowColor: "#3776AB",
    items: ["Python", "Java", "C++", "TypeScript", "JavaScript"],
  },
  {
    title: "FRONTEND",
    glowColor: "#61DAFB",
    items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    title: "BACKEND",
    glowColor: "#339933",
    items: ["Node.js", "Express.js", "REST APIs", "GraphQL"],
  },
  {
    title: "GENAI / AI",
    glowColor: "#10a37f",
    items: ["LLM APIs", "LangChain", "RAG", "Vector DB", "OpenAI", "Gemini"],
  },
];

/* ── Skill chip inside lamp box ────────────────────────── */
function SkillChip({ name }: { name: string }) {
  const tech = TECH[name] ?? { color: "#71717a", logo: "" };
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5, width: 62 }}>
      <div style={{
        width: 38, height: 38,
        display: "flex", alignItems: "center", justifyContent: "center",
        borderRadius: 9,
        background: `${tech.color}14`,
        border: `1px solid ${tech.color}40`,
      }}>
        {tech.logo && (
          <img src={tech.logo} alt={name} width={22} height={22}
            style={{ objectFit: "contain" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <span style={{
        fontSize: 9.5, fontWeight: 500, color: "var(--text-secondary)",
        fontFamily: "'Geist Mono', monospace", textAlign: "center", lineHeight: 1.3,
      }}>{name}</span>
    </div>
  );
}

/* ── Lamp skill box ─────────────────────────────────────── */
function LampSkillBox({ title, glowColor, items }: { title: string; glowColor: string; items: string[] }) {
  return (
    <div style={{
      flex: 1, minWidth: 0,
      borderRadius: 12,
      border: `1px solid ${glowColor}30`,
      background: "var(--bg-card)",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Lamp effect on top */}
      <LampContainer className="min-h-0 pt-0" style={{ height: 100 } as React.CSSProperties}>
        <p style={{
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em",
          textTransform: "uppercase", color: glowColor,
          fontFamily: "'Geist Mono', monospace",
          marginTop: -8,
        }}>{title}</p>
      </LampContainer>

      {/* Skills grid */}
      <div style={{ padding: "0 16px 16px", display: "flex", flexWrap: "wrap", gap: 10 }}>
        {items.map(name => <SkillChip key={name} name={name} />)}
      </div>
    </div>
  );
}

/* ── Moving row items ───────────────────────────────────── */
const MOVING_ROW1 = ["MongoDB", "MySQL", "PostgreSQL", "Git", "GitHub", "VS Code", "Vercel", "Postman", "Docker"].map(t);
const MOVING_ROW2 = ["Docker", "Postman", "Vercel", "VS Code", "GitHub", "Git", "PostgreSQL", "MySQL", "MongoDB"].map(t);

/* ── Main export ───────────────────────────────────────── */
export function SkillsSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <div style={{ height: 60 }} />

      <div
        ref={ref}
        id="skills"
        style={{
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          marginBottom: 55,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        {/* Section label */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--line)" }}>
          <p className="section-label" style={{ margin: 0 }}>Skill Section</p>
        </div>

        {/* ── Lamp boxes row ── */}
        <div style={{ padding: "20px 24px 0", display: "flex", gap: 12 }}>
          {LAMP_GROUPS.map(g => (
            <LampSkillBox key={g.title} {...g} />
          ))}
        </div>

        {/* ── Infinite moving rows ── */}
        <div style={{ padding: "20px 0 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          <InfiniteMovingSkills items={MOVING_ROW1} direction="left"  speed="normal" />
          <InfiniteMovingSkills items={MOVING_ROW2} direction="right" speed="normal" />
        </div>
      </div>
    </>
  );
}