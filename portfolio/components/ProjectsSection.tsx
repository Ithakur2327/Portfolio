"use client";
import { useRef, useCallback, useState, useEffect, useId } from "react";
import { useReveal } from "./useReveal";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/3d-card";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

/* ─── Tech map ──────────────────────────────────────────── */
const TECH_MAP: Record<string, { color: string; logo: string }> = {
  "React.js":     { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":      { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Node.js":      { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js":   { color: "#888888", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  "MongoDB":      { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  "TypeScript":   { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  "JavaScript":   { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  "Redux":        { color: "#764ABC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
  "LLM APIs":     { color: "#10a37f", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  "OpenAI API":   { color: "#10a37f", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  "LangChain":    { color: "#1C9E6E", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png" },
  "RAG":          { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":    { color: "#FF6333", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  "YouTube API":  { color: "#FF0000", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg" },
  "Chart.js":     { color: "#FF6384", logo: "https://www.chartjs.org/img/chartjs-logo.svg" },
  "Socket.io":    { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
  "JWT":          { color: "#d63aff", logo: "https://jwt.io/img/pic_logo.svg" },
  "Framer Motion":{ color: "#bb4af8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "shadcn/ui":    { color: "#ffffff", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Vercel":       { color: "#ffffff", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
};

/* ─── Projects ──────────────────────────────────────────── */
const PROJECTS = [
  {
    name: "Portfolio Website",
    year: "2025",
    featured: true,
    accent: "#6366f1",
    accentBg: "rgba(99,102,241,0.10)",
    accentBorder: "rgba(99,102,241,0.30)",
    img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80",
    desc: "Personal developer portfolio with animated sections, dark/light mode, 3D cards and smooth reveal animations.",
    longDesc: "A fully responsive developer portfolio showcasing skills, projects and experience. Features a dot-grid animated background, custom reveal animations, 3D tilt cards, infinite scrolling skill ticker and a working contact form. Deployed on Vercel with automatic CI/CD.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui", "Vercel"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "HealthnexAI",
    year: "2025",
    featured: true,
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.10)",
    accentBorder: "rgba(16,185,129,0.25)",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    desc: "AI-powered preventive healthcare platform predicting disease risks from lifestyle habits using LLM-powered NexAI assistant.",
    longDesc: "HealthnexAI helps users proactively manage their health. Users input lifestyle data (sleep, diet, stress, activity) and family medical history. NexAI — powered by LLM APIs — generates personalized risk scores and prevention plans. Interactive charts track health metrics over time.",
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "LLM APIs", "Tailwind CSS"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "Smart Expense Tracker",
    year: "2025",
    featured: true,
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.10)",
    accentBorder: "rgba(245,158,11,0.25)",
    img: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80",
    desc: "AI-driven expense tracker that auto-categorizes transactions and delivers smart budget insights with Chart.js dashboards.",
    longDesc: "An intelligent personal finance tool. Transactions are auto-categorized using OpenAI API. The ML layer detects unusual spending patterns and generates weekly budget insights. Chart.js dashboards visualize trends. Users set budgets per category and receive alerts.",
    tags: ["React.js", "Node.js", "MongoDB", "OpenAI API", "Chart.js"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "SnipixAI",
    year: "2025",
    featured: true,
    accent: "#8b5cf6",
    accentBg: "rgba(139,92,246,0.10)",
    accentBorder: "rgba(139,92,246,0.25)",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
    desc: "RAG-based multimodal summarization for PDFs, images, text and audio with semantic search and sub-200ms query latency.",
    longDesc: "A multimodal RAG pipeline ingesting PDFs, images, text and audio. Documents are chunked and embedded into a Vector DB. LangChain orchestrates retrieval and generation — users query documents with natural language. Supports semantic search with sub-200ms query latency.",
    tags: ["Next.js", "TypeScript", "LangChain", "RAG", "Vector DB", "LLM APIs"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "VidLearn",
    year: "2025",
    featured: true,
    accent: "#ef4444",
    accentBg: "rgba(239,68,68,0.10)",
    accentBorder: "rgba(239,68,68,0.25)",
    img: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&q=80",
    desc: "YouTube learning companion that auto-summarizes lectures, extracts key concepts and generates exam-style quizzes.",
    longDesc: "An AI learning companion for students. Paste any YouTube lecture URL and VidLearn fetches the transcript via YouTube API, then uses LLM APIs to auto-summarize content, extract key concepts into structured notes, and generate MCQ quizzes with explanations.",
    tags: ["Next.js", "TypeScript", "YouTube API", "LLM APIs", "Tailwind CSS"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "Myntra Clone",
    year: "2024",
    featured: false,
    accent: "#ec4899",
    accentBg: "rgba(236,72,153,0.10)",
    accentBorder: "rgba(236,72,153,0.25)",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    desc: "Full-stack fashion e-commerce clone with product listings, search & filters, cart, wishlist and a complete checkout flow.",
    longDesc: "A full-featured fashion e-commerce platform. Includes product browsing with advanced filters (brand, price, size, category), search with autocomplete, cart & wishlist with Redux, a multi-step checkout flow with address and payment pages, fully responsive design.",
    tags: ["React.js", "Redux", "Node.js", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
];

/* ─── Icons ─────────────────────────────────────────────── */
const GithubIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const LockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

/* ─── Slide-to-unlock ───────────────────────────────────── */
function SlideToUnlock({ onUnlock }: { onUnlock: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const HANDLE = 52;
  const x = useMotionValue(0);
  const textOpacity = useTransform(x, [0, HANDLE * 1.3], [1, 0]);

  const onDragEnd = useCallback(() => {
    setDragging(false);
    const maxX = (trackRef.current?.offsetWidth ?? 0) - HANDLE;
    if (x.get() >= maxX * 0.88) {
      onUnlock();
    } else {
      animate(x, 0, { type: "spring", bounce: 0, duration: 0.28 });
    }
  }, [x, onUnlock]);

  return (
    <div style={{
      width: 264,
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 14, padding: 4,
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      boxShadow: "inset 0 1px 1px rgba(255,255,255,0.04), 0 6px 32px rgba(0,0,0,0.4)",
    }}>
      <div ref={trackRef} style={{ position: "relative", height: 48, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <motion.span style={{ opacity: textOpacity, marginLeft: HANDLE + 10, pointerEvents: "none", userSelect: "none" }}>
          <span style={{ fontSize: 13, fontWeight: 600, fontFamily: SF, color: "rgba(255,255,255,0.65)", letterSpacing: "0.01em" }}>
            {dragging ? "release to unlock →" : "slide to unlock"}
          </span>
        </motion.span>
        <motion.div
          drag="x" dragConstraints={trackRef} dragElastic={0} dragMomentum={false}
          onDragStart={() => setDragging(true)}
          onDragEnd={onDragEnd}
          style={{
            position: "absolute", top: 0, left: 0,
            width: HANDLE, height: 48, x,
            background: "rgba(255,255,255,0.93)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#333", boxShadow: "0 2px 10px rgba(0,0,0,0.28)",
            cursor: "grab", zIndex: 2,
          }}
          whileTap={{ cursor: "grabbing", scale: 0.97 }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12 12.75 3v4.696H0v8.608h12.75V21z"/>
          </svg>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Expanded Modal (Aceternity style) ─────────────────── */
function ProjectModal({ proj, uid, onClose }: { proj: typeof PROJECTS[0]; uid: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)", zIndex: 99998 }}
        onClick={onClose}
      />

      {/* Modal panel */}
      <div style={{ position: "fixed", inset: 0, zIndex: 99999, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <motion.div
          layoutId={`proj-card-${uid}`}
          style={{
            width: "100%", maxWidth: 520,
            maxHeight: "90vh", overflowY: "auto",
            background: "var(--bg-card)",
            border: `1px solid ${proj.accentBorder}`,
            borderRadius: 20,
            boxShadow: `0 0 80px ${proj.accent}28, 0 32px 80px rgba(0,0,0,0.6)`,
            scrollbarWidth: "none" as const,
          }}
        >
          {/* Top accent line */}
          <div style={{ height: 3, background: `linear-gradient(90deg, ${proj.accent}, ${proj.accent}66, transparent)`, borderRadius: "20px 20px 0 0", flexShrink: 0 }} />

          {/* Image */}
          <motion.div layoutId={`proj-img-${uid}`} style={{ overflow: "hidden" }}>
            <img
              src={proj.img} alt={proj.name}
              style={{ width: "100%", height: 200, objectFit: "cover", objectPosition: "center top", display: "block" }}
            />
          </motion.div>

          {/* Header */}
          <div style={{ padding: "20px 24px 0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                <motion.h3
                  layoutId={`proj-name-${uid}`}
                  style={{ fontSize: 22, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", fontFamily: SF, margin: 0 }}
                >
                  {proj.name}
                </motion.h3>
                <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)" }}>{proj.year}</span>
                {proj.featured && (
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: proj.accent, background: proj.accentBg, border: `1px solid ${proj.accentBorder}`, padding: "2px 8px", borderRadius: 20 }}>Featured</span>
                )}
              </div>
              <button
                onClick={onClose}
                style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "16px 0" }} />
          </div>

          {/* Body */}
          <div style={{ padding: "0 24px 28px" }}>
            <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 22 }}>{proj.longDesc}</p>

            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-muted)", marginBottom: 10, fontFamily: MONO }}>Tech Stack</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              {proj.tags.map(tag => {
                const tech = TECH_MAP[tag];
                return (
                  <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--tag-text)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)", padding: "4px 10px", borderRadius: 6, fontFamily: MONO }}>
                    {tech && <img src={tech.logo} alt={tag} width={12} height={12} style={{ objectFit: "contain", flexShrink: 0, filter: tag === "Express.js" ? "brightness(0) invert(0.6)" : "none" }} />}
                    {tag}
                  </span>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <a href={proj.github} target="_blank" rel="noreferrer" style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 16px", borderRadius: 10, background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 13, fontWeight: 600, textDecoration: "none", fontFamily: SF, transition: "border-color 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--text-muted)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"}
              ><GithubIcon /> GitHub</a>
              <a href={proj.live} target="_blank" rel="noreferrer" style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px 16px", borderRadius: 10, background: proj.accentBg, border: `1px solid ${proj.accentBorder}`, color: proj.accent, fontSize: 13, fontWeight: 700, textDecoration: "none", fontFamily: SF, transition: "opacity 0.15s" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = "0.72"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = "1"}
              ><ExternalIcon /> Live Demo</a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}

/* ─── Compact card ──────────────────────────────────────── */
function ProjectCard({ proj, index, visible, uid, onOpen }: {
  proj: typeof PROJECTS[0]; index: number; visible: boolean; uid: string; onOpen: () => void;
}) {
  return (
    <motion.div
      layoutId={`proj-card-${uid}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `opacity 0.45s cubic-bezier(0.16,1,0.3,1) ${0.06 * index}s, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${0.06 * index}s`,
        borderRadius: 12,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative" as const,
      }}
      onClick={onOpen}
      whileHover={{ y: -2, transition: { duration: 0.18 } }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = proj.accentBorder;
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
      }}
    >
      {/* Top accent line on hover */}
      <div className={`ptl-${index}`} style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent 5%, ${proj.accent}88 50%, transparent 95%)`,
        opacity: 0, transition: "opacity 0.25s", pointerEvents: "none", zIndex: 2,
      }} />

      {/* Image */}
      <motion.div layoutId={`proj-img-${uid}`} style={{ overflow: "hidden" }}>
        <img
          src={proj.img} alt={proj.name}
          style={{ width: "100%", height: 120, objectFit: "cover", objectPosition: "center top", display: "block", transition: "transform 0.35s ease" }}
          onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1.04)"}
          onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = "scale(1)"}
        />
      </motion.div>

      {/* Content */}
      <div style={{ padding: "11px 13px 12px" }}>
        {/* Name row */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, flexWrap: "wrap" as const }}>
          <motion.span
            layoutId={`proj-name-${uid}`}
            style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: SF, lineHeight: 1.2 }}
          >
            {proj.name}
          </motion.span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--text-muted)" }}>{proj.year}</span>
          {proj.featured && (
            <span style={{ fontSize: 8.5, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: proj.accent, background: proj.accentBg, border: `1px solid ${proj.accentBorder}`, padding: "1px 5px", borderRadius: 20 }}>Featured</span>
          )}
        </div>

        {/* Description — 2 lines max */}
        <p style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: "0 0 9px", fontFamily: SF, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
          {proj.desc}
        </p>

        {/* Tags — first 3 only */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
          {proj.tags.slice(0, 3).map(tag => {
            const tech = TECH_MAP[tag];
            return (
              <span key={tag} style={{ display: "inline-flex", alignItems: "center", gap: 3, fontSize: 9.5, color: "var(--tag-text)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)", padding: "2px 6px", borderRadius: 4, fontFamily: MONO }}>
                {tech && <img src={tech.logo} alt={tag} width={9} height={9} style={{ objectFit: "contain", flexShrink: 0, filter: tag === "Express.js" ? "brightness(0) invert(0.6)" : "none" }} loading="lazy" />}
                {tag}
              </span>
            );
          })}
          {proj.tags.length > 3 && (
            <span style={{ fontSize: 9.5, color: "var(--text-muted)", fontFamily: MONO, padding: "2px 5px" }}>+{proj.tags.length - 3}</span>
          )}
        </div>

        {/* Click hint */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10.5, color: "var(--text-muted)", fontFamily: SF }}>
          Click to view full details
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>

      {/* Bottom glow */}
      <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${proj.accent}44, transparent)`, pointerEvents: "none" }} />
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────── */
export function ProjectsSection() {
  const { ref: revealRef, visible } = useReveal();
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState<typeof PROJECTS[0] | null>(null);
  const sectionNodeRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const setRefs = useCallback(
    (node: HTMLDivElement | null) => {
      (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
      (sectionNodeRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    },
    [revealRef]
  );

  useEffect(() => {
    const el = sectionNodeRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (!entry.isIntersecting) setUnlocked(false); },
      { threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <div className="section-separator" />
      <div
        id="projects"
        ref={setRefs}
        style={{
          padding: "32px 0 40px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p className="section-label">Projects</p>

        <div style={{
          position: "relative", left: "50%", marginLeft: "-50vw",
          width: "100vw", background: "var(--bg-base)",
          borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
        }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 32px" }}>

            {/* Title — no icon, just text */}
            <div style={{ paddingTop: 24, marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                Projects
              </span>
              <span style={{ marginLeft: 10, fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)", padding: "2px 8px", borderRadius: 5 }}>
                {PROJECTS.length}
              </span>
            </div>

            {/* Slide-to-unlock */}
            <AnimatePresence>
              {!unlocked && (
                <motion.div
                  key="lock-bar"
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6, transition: { duration: 0.3 } }}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "20px 0 4px" }}
                >
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
                    style={{ width: 44, height: 44, borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}
                  >
                    <LockIcon />
                  </motion.div>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: MONO, letterSpacing: "0.05em" }}>projects are locked</p>
                  <SlideToUnlock onUnlock={() => setUnlocked(true)} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div style={{ height: 1, background: "var(--border)", margin: unlocked ? "20px 0 20px" : "16px 0 20px", transition: "margin 0.3s" }} />

            {/* Grid */}
            <style>{`
              .proj-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
              }
              @media (max-width: 980px) { .proj-grid { grid-template-columns: repeat(3,1fr); } }
              @media (max-width: 700px) { .proj-grid { grid-template-columns: repeat(2,1fr); } }
              @media (max-width: 440px) { .proj-grid { grid-template-columns: 1fr; } }
            `}</style>
            <div
              className="proj-grid"
              style={{
                filter: unlocked ? "none" : "blur(5px)",
                pointerEvents: unlocked ? "auto" : "none",
                userSelect: unlocked ? "auto" : "none",
                transition: "filter 0.5s ease",
              }}
            >
              {PROJECTS.map((proj, i) => (
                <ProjectCard
                  key={proj.name}
                  proj={proj}
                  index={i}
                  visible={visible}
                  uid={`${uid}-${i}`}
                  onOpen={() => setActive(proj)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <ProjectModal
            proj={active}
            uid={`${uid}-${PROJECTS.indexOf(active)}`}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}