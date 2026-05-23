"use client";
import { useReveal } from "./useReveal";

const skills = [
  { category: "Frontend", items: ["React.js", "Next.js", "TypeScript", "JavaScript", "Tailwind CSS", "HTML5", "CSS3"] },
  { category: "Backend", items: ["Node.js", "Express.js", "REST APIs"] },
  { category: "Databases", items: ["MongoDB", "MySQL"] },
  { category: "GenAI / AI", items: ["LLM APIs", "LangChain", "RAG", "Vector Database"] },
  { category: "Languages", items: ["Python", "Java", "C++"] },
  { category: "Tools", items: ["Git", "GitHub", "VS Code", "Vercel", "Postman"] },
];

const all = [...skills.flatMap(s => s.items), ...skills.flatMap(s => s.items)];

export function SkillsSection() {
  const { ref, visible } = useReveal();

  return (
    <section id="skills" style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 48px" }}>
      <div className="section-sep" />
      <div
        ref={ref}
        style={{
          paddingTop: 40,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <p className="section-heading">Stack</p>

        {/* Marquee strip */}
        <div style={{
          overflow: "hidden", marginBottom: 28,
          mask: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)",
          WebkitMask: "linear-gradient(90deg,transparent,black 8%,black 92%,transparent)",
        }}>
          <div className="marquee-inner">
            {all.map((s, i) => (
              <span key={i} className="tag" style={{ whiteSpace: "nowrap", flexShrink: 0, cursor: "default" }}>{s}</span>
            ))}
          </div>
        </div>

        {/* Grid of categories */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {skills.map((cat, i) => (
            <div
              key={cat.category}
              style={{
                display: "flex", gap: 16, padding: "12px 0",
                borderBottom: i < skills.length - 1 ? "1px solid var(--border)" : "none",
                alignItems: "flex-start",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(8px)",
                transition: `opacity 0.4s ease ${0.05 * i}s, transform 0.4s ease ${0.05 * i}s`,
              }}
            >
              <span style={{ fontSize: 12, color: "var(--text-muted)", minWidth: 80, flexShrink: 0, paddingTop: 3 }}>
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
      </div>
    </section>
  );
}
