"use client";
import { useReveal } from "./useReveal";

const SKILLS = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express.js", "REST APIs", "GraphQL"],
  },
  {
    category: "Databases",
    items: ["MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    category: "GenAI / AI",
    items: ["LLM APIs", "LangChain", "RAG", "Vector DB", "OpenAI", "Gemini"],
  },
  {
    category: "Languages",
    items: ["Python", "Java", "C++", "TypeScript"],
  },
  {
    category: "Tools",
    items: ["Git", "GitHub", "VS Code", "Vercel", "Postman", "Docker"],
  },
];

const ALL_SKILLS = [...SKILLS.flatMap(s => s.items), ...SKILLS.flatMap(s => s.items)];

export function SkillsSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <div className="section-separator" />
      <section
        id="skills"
        ref={ref}
        style={{
          padding: "32px 0 40px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p className="section-label">Tech Stack</p>

        {/* Marquee strip */}
        <div className="marquee-track marquee-fade" style={{ marginBottom: 28 }}>
          <div className="marquee-inner">
            {ALL_SKILLS.map((s, i) => (
              <span key={i} className="tag" style={{ cursor: "default" }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Category grid */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          {SKILLS.map((cat, i) => (
            <div
              key={cat.category}
              style={{
                display: "flex",
                gap: 20,
                padding: "13px 0",
                borderBottom: i < SKILLS.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "flex-start",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(8px)",
                transition: `opacity 0.4s var(--expo-out) ${0.06 * i}s, transform 0.4s var(--expo-out) ${0.06 * i}s`,
              }}
            >
              <span
                style={{
                  fontSize: 11, color: "var(--text-muted)", minWidth: 80,
                  flexShrink: 0, paddingTop: 3, fontFamily: "'Geist Mono', monospace",
                  letterSpacing: "0.03em", textTransform: "uppercase",
                }}
              >
                {cat.category}
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {cat.items.map(item => (
                  <span key={item} className="tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}