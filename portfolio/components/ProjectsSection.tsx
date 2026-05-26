"use client";
import { useRef, useEffect, useState } from "react";
import { useReveal } from "./useReveal";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/3d-card";

/* ─── Tech icon map (same CDN as SkillsSection) ────────── */
const TECH_MAP: Record<string, { color: string; logo: string }> = {
  "React.js":    { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":     { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Node.js":     { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js":  { color: "#888888", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  "MongoDB":     { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  "TypeScript":  { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  "JavaScript":  { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "Tailwind CSS":{ color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  "Redux":       { color: "#764ABC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
  "LLM APIs":    { color: "#10a37f", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  "OpenAI API":  { color: "#10a37f", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  "LangChain":   { color: "#1C9E6E", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png" },
  "RAG":         { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":   { color: "#FF6333", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  "YouTube API": { color: "#FF0000", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" },
  "Chart.js":    { color: "#FF6384", logo: "https://www.chartjs.org/img/chartjs-logo.svg" },
  "Socket.io":   { color: "#010101", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
  "JWT":         { color: "#d63aff", logo: "https://jwt.io/img/pic_logo.svg" },
  "Python":      { color: "#3776AB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  "FastAPI":     { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  "PostgreSQL":  { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  "Docker":      { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  "MySQL":       { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
};

/* ─── Projects data ─────────────────────────────────────── */
const PROJECTS = [
  {
    name: "HealthnexAI",
    year: "2025",
    featured: true,
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.07)",
    accentBorder: "rgba(16,185,129,0.2)",
    desc: "AI-powered preventive healthcare platform that analyzes lifestyle habits and family medical history to predict disease risks. Features NexAI — an LLM-powered assistant that delivers personalized health insights.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "LLM APIs", "Tailwind CSS"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "Smart Expense Tracker",
    year: "2025",
    featured: true,
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.07)",
    accentBorder: "rgba(245,158,11,0.2)",
    desc: "AI-driven expense tracker that auto-categorizes transactions, detects spending patterns, and delivers smart budget insights using machine learning.",
    tags: ["React.js", "Node.js", "MongoDB", "OpenAI API", "Chart.js"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "SnipixAI",
    year: "2025",
    featured: true,
    accent: "#8b5cf6",
    accentBg: "rgba(139,92,246,0.07)",
    accentBorder: "rgba(139,92,246,0.2)",
    desc: "RAG-based multimodal summarization system for PDFs, images, text and audio. Built with LangChain and Vector DB for semantic search and context-aware retrieval.",
    tags: ["Next.js", "TypeScript", "LangChain", "RAG", "Vector DB", "LLM APIs"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "VidLearn",
    year: "2025",
    featured: true,
    accent: "#ef4444",
    accentBg: "rgba(239,68,68,0.07)",
    accentBorder: "rgba(239,68,68,0.2)",
    desc: "YouTube video learning companion that auto-summarizes lectures, extracts key concepts, generates exam-style quizzes and curated Q&A sets for students.",
    tags: ["Next.js", "TypeScript", "YouTube API", "LLM APIs", "Tailwind CSS"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "Myntra Clone",
    year: "2024",
    featured: false,
    accent: "#ec4899",
    accentBg: "rgba(236,72,153,0.07)",
    accentBorder: "rgba(236,72,153,0.2)",
    desc: "Full-stack fashion e-commerce clone with product listings, search & filters, cart, wishlist and a complete checkout flow. Pixel-perfect responsive UI.",
    tags: ["React.js", "Redux", "Node.js", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "DevConnect",
    year: "2024",
    featured: false,
    accent: "#3b82f6",
    accentBg: "rgba(59,130,246,0.07)",
    accentBorder: "rgba(59,130,246,0.2)",
    desc: "Social platform for developers to connect, share projects and collaborate. Real-time notifications, project showcase and skill-based developer matching.",
    tags: ["React.js", "Node.js", "MongoDB", "Socket.io", "JWT"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
];

/* ─── SVG Icons ─────────────────────────────────────────── */
const GithubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

/* ─── Single Card ───────────────────────────────────────── */
function ProjectCard({
  proj,
  index,
  visible,
}: {
  proj: (typeof PROJECTS)[0];
  index: number;
  visible: boolean;
}) {
  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${0.07 * index}s, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${0.07 * index}s`,
      }}
    >
      <CardContainer containerClassName="py-0 w-full" style={{ width: "100%" }}>
        <CardBody className="w-full h-auto" style={{ width: "100%", height: "auto", minHeight: "unset" } as React.CSSProperties}>
          {/* Card shell */}
          <div
            style={{
              position: "relative",
              borderRadius: 14,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              padding: "20px 22px 18px",
              overflow: "hidden",
              transition: "border-color 0.25s ease",
              willChange: "transform",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = proj.accentBorder;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
            }}
          >
            {/* Subtle top glow — appears on hover via CSS var override */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 1,
                background: `linear-gradient(90deg, transparent 10%, ${proj.accent}55 50%, transparent 90%)`,
                opacity: 0,
                transition: "opacity 0.3s",
                pointerEvents: "none",
              }}
              className="card-top-line"
            />

            {/* ── Row 1: name + year + featured + links ── */}
            <CardItem translateZ={28} style={{ display: "block", width: "100%" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>

                {/* Left: name + year + featured */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.025em",
                      lineHeight: 1.2,
                    }}>
                      {proj.name}
                    </span>
                    <span style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: 10,
                      color: "var(--text-muted)",
                      marginTop: 1,
                    }}>
                      {proj.year}
                    </span>
                    {proj.featured && (
                      <span style={{
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: "0.07em",
                        textTransform: "uppercase" as const,
                        color: proj.accent,
                        background: proj.accentBg,
                        border: `1px solid ${proj.accentBorder}`,
                        padding: "2px 7px",
                        borderRadius: 20,
                      }}>
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: GitHub + Live */}
                <div style={{ display: "flex", gap: 6, flexShrink: 0, alignItems: "center" }}>
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 11px",
                      borderRadius: 7,
                      background: "var(--bg-hover)",
                      color: "var(--text-muted)",
                      fontSize: 11,
                      fontWeight: 500,
                      border: "1px solid var(--border)",
                      textDecoration: "none",
                      transition: "color 0.15s, border-color 0.15s",
                      whiteSpace: "nowrap" as const,
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--text-muted)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                      (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                    }}
                  >
                    <GithubIcon /> GitHub <ArrowIcon />
                  </a>
                  <a
                    href={proj.live}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "5px 11px",
                      borderRadius: 7,
                      background: proj.accentBg,
                      color: proj.accent,
                      fontSize: 11,
                      fontWeight: 600,
                      border: `1px solid ${proj.accentBorder}`,
                      textDecoration: "none",
                      transition: "opacity 0.15s",
                      whiteSpace: "nowrap" as const,
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.7"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
                  >
                    <ExternalIcon /> Live
                  </a>
                </div>
              </div>
            </CardItem>

            {/* Thin accent divider */}
            <CardItem translateZ={10} style={{ display: "block", width: "100%", marginBottom: 12 }}>
              <div style={{ height: 1, background: "var(--border)", width: "100%" }} />
            </CardItem>

            {/* ── Description ── */}
            <CardItem translateZ={18} style={{ display: "block", width: "100%" }}>
              <p style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                lineHeight: 1.75,
                margin: "0 0 16px",
              }}>
                {proj.desc}
              </p>
            </CardItem>

            {/* ── Tech stack icons ── */}
            <CardItem translateZ={14} style={{ display: "block", width: "100%" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {proj.tags.map(tag => {
                  const tech = TECH_MAP[tag];
                  return (
                    <span
                      key={tag}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        fontSize: 11,
                        color: "var(--tag-text)",
                        background: "var(--tag-bg)",
                        border: "1px solid var(--tag-border)",
                        padding: "3px 8px",
                        borderRadius: 5,
                        fontFamily: "'Geist Mono', monospace",
                        letterSpacing: "0.01em",
                        transition: "border-color 0.15s",
                      }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = tech ? tech.color + "55" : "var(--text-muted)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.borderColor = "var(--tag-border)";
                      }}
                    >
                      {tech && (
                        <img
                          src={tech.logo}
                          alt={tag}
                          width={13}
                          height={13}
                          style={{
                            objectFit: "contain",
                            flexShrink: 0,
                            filter: tag === "Express.js" ? "brightness(0) invert(0.6)" : "none",
                          }}
                          loading="lazy"
                        />
                      )}
                      {tag}
                    </span>
                  );
                })}
              </div>
            </CardItem>

            {/* Bottom accent glow line */}
            <div style={{
              position: "absolute",
              bottom: 0,
              left: "15%",
              right: "15%",
              height: 1,
              background: `linear-gradient(90deg, transparent, ${proj.accent}44, transparent)`,
              pointerEvents: "none",
            }} />
          </div>
        </CardBody>
      </CardContainer>
    </div>
  );
}

/* ─── Section ───────────────────────────────────────────── */
export function ProjectsSection() {
  const { ref, visible } = useReveal();

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
        {/* ── Section header ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <p className="section-label" style={{ marginBottom: 0 }}>
            Projects
          </p>
          <span style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 10,
            color: "var(--text-muted)",
            background: "var(--tag-bg)",
            border: "1px solid var(--tag-border)",
            padding: "1px 6px",
            borderRadius: 4,
          }}>
            {PROJECTS.length}
          </span>
        </div>

        {/* ── Outer box — matches other sections ── */}
        <div
          style={{
            borderRadius: 12,
            border: "1px solid var(--border)",
            background: "var(--bg-secondary)",
            padding: "20px",
            backdropFilter: "blur(8px)",
          }}
        >
          {/* CSS for hover glow line + light mode Express icon + responsive grid */}
          <style>{`
            .proj-card-wrap:hover .card-top-line { opacity: 1 !important; }

            html.light img[data-tag="Express.js"] {
              filter: brightness(0) invert(0.2) !important;
            }

            .projects-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;
            }

            @media (max-width: 680px) {
              .projects-grid { grid-template-columns: 1fr; }
            }
          `}</style>

          <div className="projects-grid">
            {PROJECTS.map((proj, i) => (
              <div key={proj.name} className="proj-card-wrap">
                <ProjectCard proj={proj} index={i} visible={visible} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}