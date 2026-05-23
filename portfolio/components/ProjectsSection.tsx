"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";

const PROJECTS = [
  {
    name: "HealthnexAI",
    desc: "AI-powered preventive healthcare platform that analyzes lifestyle habits and family medical history to predict potential disease risks. Integrated LLM APIs for an AI assistant (NexAI) that provides personalized health insights.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "LLM APIs", "Tailwind CSS"],
    period: "2025",
    github: "https://github.com/IndreshThakur",
    live: "#",
    icon: "🏥",
    featured: true,
  },
  {
    name: "SnipixAI",
    desc: "RAG-based multimodal summarization system to process and retrieve information from PDFs, images, text, and audio. Built with LangChain and Vector Database for semantic search and context-aware retrieval.",
    tags: ["Next.js", "TypeScript", "LangChain", "RAG", "Vector DB", "LLM APIs"],
    period: "2025",
    github: "https://github.com/IndreshThakur",
    live: "#",
    icon: "🤖",
    featured: true,
  },
  {
    name: "DevConnect",
    desc: "Full-stack social platform for developers to connect, share projects, and collaborate. Features real-time notifications, project showcase, and skill-based matching.",
    tags: ["React.js", "Node.js", "MongoDB", "Socket.io", "JWT"],
    period: "2024",
    github: "https://github.com/IndreshThakur",
    live: "#",
    icon: "🔗",
    featured: false,
  },
  {
    name: "AI Code Reviewer",
    desc: "Automated code review tool powered by LLMs that analyzes GitHub PRs, provides suggestions, detects bugs, and explains code improvements in natural language.",
    tags: ["Python", "FastAPI", "OpenAI API", "GitHub API", "React"],
    period: "2024",
    github: "https://github.com/IndreshThakur",
    live: "#",
    icon: "🔍",
    featured: false,
  },
];

export function ProjectsSection() {
  const { ref, visible } = useReveal();
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? PROJECTS : PROJECTS.filter(p => p.featured);

  return (
    <>
      <div className="section-separator" />
      <section
        id="projects"
        ref={ref}
        style={{
          padding: "32px 0 40px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <p className="section-label" style={{ marginBottom: 0 }}>
            Projects
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 10, color: "var(--text-muted)",
              background: "var(--tag-bg)", border: "1px solid var(--tag-border)",
              padding: "1px 6px", borderRadius: 4, marginLeft: 8,
            }}>
              {PROJECTS.length}
            </span>
          </p>
        </div>

        <div style={{ marginTop: 16 }}>
          {displayed.map((proj, i) => (
            <div
              key={proj.name}
              className="proj-card"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(10px)",
                transition: `opacity 0.45s var(--expo-out) ${0.1 * i}s, transform 0.45s var(--expo-out) ${0.1 * i}s`,
              }}
            >
              {/* Header row */}
              <div style={{
                display: "flex", alignItems: "flex-start",
                justifyContent: "space-between", gap: 12, marginBottom: 10,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{
                    fontSize: 18,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 7,
                    background: "var(--bg-hover)", border: "1px solid var(--border)",
                    flexShrink: 0,
                  }}>
                    {proj.icon}
                  </span>
                  <div>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                      {proj.name}
                    </span>
                    <span style={{
                      fontSize: 11, color: "var(--text-muted)", marginLeft: 8,
                      fontFamily: "'Geist Mono', monospace",
                    }}>
                      {proj.period}
                    </span>
                    {proj.featured && (
                      <span style={{
                        fontSize: 10, background: "var(--tag-bg)", color: "var(--text-muted)",
                        border: "1px solid var(--tag-border)", padding: "1px 6px", borderRadius: 4,
                        marginLeft: 6, fontWeight: 600, letterSpacing: "0.04em", textTransform: "uppercase",
                      }}>
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                    </svg>
                  </a>
                  <a
                    href={proj.live}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "5px 10px", borderRadius: 6,
                      background: "var(--text-primary)", color: "var(--bg)",
                      fontSize: 12, fontWeight: 600,
                      border: "1px solid var(--text-primary)",
                      transition: "opacity 0.15s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    Live
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
                    </svg>
                  </a>
                </div>
              </div>

              <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 12 }}>
                {proj.desc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {proj.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>

        {/* Show more/less */}
        <div style={{ marginTop: 20, textAlign: "center" }}>
          <button
            onClick={() => setShowAll(v => !v)}
            className="btn-ghost"
            style={{ width: "100%", justifyContent: "center", padding: "9px" }}
          >
            {showAll ? (
              <>Show less <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg></>
            ) : (
              <>View all {PROJECTS.length} projects <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg></>
            )}
          </button>
        </div>
      </section>
    </>
  );
}