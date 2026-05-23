"use client";
import { useReveal } from "./useReveal";

const projects = [
  {
    name: "HealthnexAI",
    desc: "AI-powered preventive healthcare platform that analyzes lifestyle habits and family medical history to predict potential disease risks. Integrated LLM APIs for an AI assistant (NexAI) that provides health insights.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "LLM APIs", "Tailwind CSS"],
    period: "2025",
    github: "#",
    live: "#",
    icon: "🏥",
  },
  {
    name: "SnipixAI",
    desc: "RAG-based multimodal summarization system to process and retrieve information from PDFs, images, text, and audio. Built with LangChain and Vector Database for semantic search and context-aware retrieval.",
    tags: ["Next.js", "TypeScript", "LangChain", "RAG", "Vector DB", "LLM APIs"],
    period: "2025",
    github: "#",
    live: "#",
    icon: "🤖",
  },
];

export function ProjectsSection() {
  const { ref, visible } = useReveal();

  return (
    <section id="projects" style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 48px" }}>
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
        <p className="section-heading">Projects[{projects.length}]</p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          {projects.map((proj, i) => (
            <div
              key={proj.name}
              style={{
                padding: "18px 0",
                borderBottom: i < projects.length - 1 ? "1px solid var(--border)" : "none",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(8px)",
                transition: `opacity 0.4s ease ${0.1 * i}s, transform 0.4s ease ${0.1 * i}s`,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16 }}>{proj.icon}</span>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                      {proj.name}
                    </span>
                    <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 8 }}>
                      {proj.period}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <a href={proj.github} target="_blank" rel="noreferrer"
                    style={{ fontSize: 12, color: "var(--text-muted)", padding: "3px 8px", borderRadius: 5,
                      border: "1px solid var(--border)", transition: "all 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--text-muted)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
                  >GitHub ↗</a>
                  <a href={proj.live} target="_blank" rel="noreferrer"
                    style={{ fontSize: 12, color: "var(--bg)", background: "var(--text-primary)", padding: "3px 8px", borderRadius: 5,
                      border: "1px solid var(--text-primary)", transition: "opacity 0.15s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >Live ↗</a>
                </div>
              </div>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.65, marginBottom: 10 }}>
                {proj.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {proj.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
