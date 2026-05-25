"use client";
import { useReveal } from "./useReveal";

/* ── brand color + real devicon logo per tech ─────────── */
const TECH: Record<string, { color: string; logo: string }> = {
  // Languages
  "Python":     { color: "#3776AB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  "Java":       { color: "#ED8B00", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  "C++":        { color: "#00599C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  "TypeScript": { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  "JavaScript": { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  // Frontend
  "React.js":     { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":      { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" },
  "HTML5":        { color: "#E34F26", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  "CSS3":         { color: "#1572B6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  // Backend
  "Node.js":    { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js": { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  "REST APIs":  { color: "#6366f1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  "GraphQL":    { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  // GenAI
  "LLM APIs":  { color: "#10a37f", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg" },
  "LangChain": { color: "#1C3C3C", logo: "https://avatars.githubusercontent.com/u/126733545?s=48" },
  "RAG":       { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB": { color: "#FF6333", logo: "https://avatars.githubusercontent.com/u/73504361?s=48" },
  "OpenAI":    { color: "#10a37f", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg" },
  "Gemini":    { color: "#4285F4", logo: "https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06.svg" },
  // Databases
  "MongoDB":    { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  "MySQL":      { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  "PostgreSQL": { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  // Tools & Deploy
  "Git":     { color: "#F05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  "GitHub":  { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" },
  "VS Code": { color: "#007ACC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
  "Vercel":  { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vercel/vercel-original.svg" },
  "Postman": { color: "#FF6C37", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postman/postman-original.svg" },
  "Docker":  { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
};

/* ── single skill chip (logo + label) ─────────────────── */
function SkillChip({ name }: { name: string }) {
  const t = TECH[name] ?? { color: "#71717a", logo: "" };
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 6,
      width: 68,
    }}>
      <div style={{
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        background: `${t.color}12`,
        border: `1px solid ${t.color}38`,
      }}>
        {t.logo && (
          <img
            src={t.logo}
            alt={name}
            width={24}
            height={24}
            style={{ objectFit: "contain", display: "block" }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      <span style={{
        fontSize: 10,
        fontWeight: 500,
        color: "var(--text-secondary)",
        fontFamily: "'Geist Mono', monospace",
        textAlign: "center",
        lineHeight: 1.3,
        wordBreak: "break-word",
      }}>{name}</span>
    </div>
  );
}

/* ── glow card ─────────────────────────────────────────── */
function GlowCard({ title, items, glowColor }: {
  title: string;
  items: string[];
  glowColor: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        borderRadius: 12,
        border: `1px solid ${glowColor}35`,
        background: "var(--bg-card)",
        padding: "16px 16px 14px",
        position: "relative",
        overflow: "hidden",
        boxShadow: `0 0 20px ${glowColor}10`,
        transition: "box-shadow 0.25s, border-color 0.25s",
        cursor: "default",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = `0 0 32px ${glowColor}28`;
        el.style.borderColor = `${glowColor}65`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.boxShadow = `0 0 20px ${glowColor}10`;
        el.style.borderColor = `${glowColor}35`;
      }}
    >
      {/* radial glow top-right corner */}
      <div style={{
        position: "absolute",
        top: -24,
        right: -24,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: `radial-gradient(circle, ${glowColor}1a 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />

      {/* card title */}
      <p style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: glowColor,
        fontFamily: "'Geist Mono', monospace",
        marginBottom: 14,
        opacity: 0.9,
      }}>{title}</p>

      {/* skill chips */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 10,
      }}>
        {items.map(name => <SkillChip key={name} name={name} />)}
      </div>
    </div>
  );
}

/* ── card row definitions ──────────────────────────────── */
const ROW1 = [
  { title: "Languages", glowColor: "#3776AB",
    items: ["Python", "Java", "C++", "TypeScript", "JavaScript"] },
  { title: "Frontend",  glowColor: "#61DAFB",
    items: ["React.js", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3"] },
  { title: "Backend",   glowColor: "#339933",
    items: ["Node.js", "Express.js", "REST APIs", "GraphQL"] },
];
const ROW2 = [
  { title: "GenAI / AI", glowColor: "#10a37f",
    items: ["LLM APIs", "LangChain", "RAG", "Vector DB", "OpenAI", "Gemini"] },
  { title: "Databases",  glowColor: "#47A248",
    items: ["MongoDB", "MySQL", "PostgreSQL"] },
];
const ROW3 = [
  { title: "Tools & Deploy", glowColor: "#F05032",
    items: ["Git", "GitHub", "VS Code", "Vercel", "Postman", "Docker"] },
];

/* ── main export ───────────────────────────────────────── */
export function SkillsSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      {/* gap between About and Skills */}
      <div style={{ height: 60 }} />

      {/* partition box — full page-wrapper width */}
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
        {/* "Skill Section" label — left corner, inside content padding */}
        <div style={{
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--line)",
        }}>
          <p className="section-label" style={{ margin: 0 }}>Skill Section</p>
        </div>

        {/* cards — same horizontal padding as rest of site */}
        <div style={{ padding: "20px 24px 24px", display: "flex", flexDirection: "column", gap: 12 }}>

          {/* row 1: Languages · Frontend · Backend */}
          <div style={{ display: "flex", gap: 12 }}>
            {ROW1.map(c => <GlowCard key={c.title} {...c} />)}
          </div>

          {/* row 2: GenAI · Databases */}
          <div style={{ display: "flex", gap: 12 }}>
            {ROW2.map(c => <GlowCard key={c.title} {...c} />)}
          </div>

          {/* row 3: Tools & Deploy */}
          <div style={{ display: "flex", gap: 12 }}>
            {ROW3.map(c => <GlowCard key={c.title} {...c} />)}
          </div>

        </div>
      </div>
    </>
  );
}