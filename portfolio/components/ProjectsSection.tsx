"use client";
import { useRef, useCallback, useState, useEffect, useId } from "react";
import { createPortal } from "react-dom";
import { useReveal } from "./useReveal";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { playIOSUnlockSound, playTickSound } from "../lib/soundcn/sounds";


const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

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
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
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
    img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80",
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

/* ─────────────────────────────────────────────────────────
   SLIDE-TO-UNLOCK
   Root cause of lag was dragConstraints={ref} — Framer calls
   getBoundingClientRect every frame. Fix: numeric constraints.
   No rotateY (3D + drag = compositor conflict = glitch).
───────────────────────────────────────────────────────── */
const HANDLE_W = 46;
const TRACK_H  = 42;

function SlideToUnlock({ onUnlock }: { onUnlock: () => void }) {
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const lastTickZone = useRef(-1);
  const trackRef     = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(244);
  const [unlockDone, setUnlockDone] = useState(false);

  /* Measure track once on mount + resize */
  useEffect(() => {
    const measure = () => {
      if (trackRef.current)
        setTrackW(Math.max(trackRef.current.offsetWidth - HANDLE_W, 1));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const x = useMotionValue(0);

  /* Derived motion values — all compositor-only, zero JS per frame */
  const textOpacity  = useTransform(x, [0, HANDLE_W * 1.5], [1, 0]);
  const fillScaleX   = useTransform(x, [0, trackW], [0, 1]);

  /* AudioContext — lazy init */
  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  /* Tick sounds on drag */
  useEffect(() => x.on("change", (v) => {
    if (v < 2 || trackW <= 0) return;
    const zone = Math.floor((v / trackW) * 6);
    if (zone !== lastTickZone.current && zone >= 0 && zone <= 5) {
      lastTickZone.current = zone;
      try { playTickSound(getCtx(), 0.8 + (zone / 5) * 0.5); } catch { /**/ }
    }
  }), [x, trackW, getCtx]);

  const onDragStart = useCallback(() => {
    lastTickZone.current = -1;
    getCtx();
  }, [getCtx]);

  const onDragEnd = useCallback(() => {
    const cur = x.get();
    if (cur >= trackW * 0.82) {
      /* Snap to end — tight spring, zero overshoot */
      animate(x, trackW, { type: "spring", stiffness: 900, damping: 60, mass: 0.35 });
      playIOSUnlockSound(getCtx());
      setUnlockDone(true);
      setTimeout(() => onUnlock(), 200);
    } else {
      /* Snap back — fast spring, no bounce */
      animate(x, 0, { type: "spring", stiffness: 1100, damping: 70, mass: 0.3, bounce: 0 });
      lastTickZone.current = -1;
    }
  }, [x, trackW, onUnlock, getCtx]);

  return (
    <div style={{
      width: 260, borderRadius: 14,
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      boxShadow: "0 2px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)",
      padding: 3,
      userSelect: "none", WebkitUserSelect: "none",
    }}>
      {/* Track — fixed numeric size, no overflow:hidden on drag parent */}
      <div
        ref={trackRef}
        style={{
          position: "relative",
          height: TRACK_H,
          borderRadius: 12,
          background: "var(--bg-secondary)",
          border: "1px solid var(--border)",
          touchAction: "none",
          overflow: "hidden",
        }}
      >
        {/* Progress fill — scaleX from left, GPU only */}
        <motion.div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(90deg, rgba(99,102,241,0.15) 0%, transparent 100%)",
          scaleX: fillScaleX,
          transformOrigin: "left center",
          pointerEvents: "none",
        }} />

        {/* Label */}
        <motion.div style={{
          opacity: textOpacity,
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          paddingLeft: HANDLE_W + 4,
          pointerEvents: "none",
          gap: 6,
        }}>
          <span style={{
            fontSize: 12, fontWeight: 500, fontFamily: SF,
            color: "var(--text-muted)", letterSpacing: "0.04em",
          }}>
            slide to unlock
          </span>
          <span style={{ color: "var(--text-muted)", fontSize: 11, opacity: 0.6 }}>›</span>
        </motion.div>

        {/* Handle — NUMERIC dragConstraints = no DOM reads per frame */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: trackW }}
          dragElastic={0}
          dragMomentum={false}
          /* dragTransition: controls physics when drag released — spring to snap point */
          dragTransition={{ bounceStiffness: 1100, bounceDamping: 70 }}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: HANDLE_W, height: TRACK_H,
            x,
            background: "var(--slide-handle-bg)",
            borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 2,
            color: "var(--slide-handle-fg)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)",
            cursor: "grab",
            zIndex: 2,
            touchAction: "none",
            willChange: "transform",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          whileTap={{ scale: 0.91, cursor: "grabbing" }}
        >
          {/* Chevron arrows → → */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ opacity: 0.45, marginLeft: -5 }}>
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </motion.div>

        {/* Checkmark on unlock */}
        <AnimatePresence>
          {unlockDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 700, damping: 24 }}
              style={{
                position: "absolute", right: 12, top: "50%",
                transform: "translateY(-50%)",
                width: 24, height: 24, borderRadius: "50%",
                background: "rgba(34,197,94,0.14)",
                border: "1px solid rgba(34,197,94,0.4)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#22c55e", pointerEvents: "none",
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   PROJECT MODAL
───────────────────────────────────────────────────────── */
function ProjectModal({
  proj,
  onClose,
}: {
  proj: typeof PROJECTS[0];
  cardRect: DOMRect | null;
  uid: string;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      window.removeEventListener("keydown", esc);
    };
  }, [onClose]);

  if (!mounted) return null;

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.18 } }}
        transition={{ duration: 0.22 }}
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.80)",
          backdropFilter: "blur(10px) saturate(160%)",
          WebkitBackdropFilter: "blur(10px) saturate(160%)",
          zIndex: 9000,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{
          opacity: 0,
          scale: 0.88,
          y: 28,
          transition: { duration: 0.18, ease: [0.4, 0, 1, 1] },
        }}
        transition={{ type: "spring", stiffness: 380, damping: 28, mass: 0.85 }}
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 9001,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            maxHeight: "calc(100vh - 24px)",
            overflowY: "auto",
            background: "var(--bg-card)",
            border: `1px solid ${proj.accentBorder}`,
            borderTop: `3px solid ${proj.accent}`,
            borderRadius: 20,
            boxShadow: `0 0 0 1px ${proj.accentBorder}, 0 40px 100px rgba(0,0,0,0.70), 0 0 60px ${proj.accent}18`,
            scrollbarWidth: "none" as const,
            pointerEvents: "auto",
          }}
        >
          <style suppressHydrationWarning>{`
            .modal-scroll::-webkit-scrollbar { display: none; }
            .modal-two-col {
              display: grid;
              grid-template-columns: 280px 1fr;
              gap: 24px;
              align-items: start;
            }
            @media (max-width: 600px) {
              .modal-two-col { grid-template-columns: 1fr; gap: 16px; }
            }
            .modal-tag-badge {
              display: inline-flex;
              align-items: center;
              gap: 4px;
              font-size: 10.5px;
              padding: 4px 10px;
              border-radius: 7px;
              font-family: 'Geist Mono', monospace;
              transition: opacity 0.15s;
            }
            .modal-tag-badge:hover { opacity: 0.75; }
            .modal-action-btn {
              display: inline-flex;
              align-items: center;
              gap: 7px;
              padding: 10px 22px;
              border-radius: 10px;
              font-size: 13px;
              font-weight: 600;
              text-decoration: none;
              transition: opacity 0.15s, transform 0.15s;
            }
            .modal-action-btn:hover { opacity: 0.85; transform: translateY(-1px); }
          `}</style>
          <div className="modal-scroll" style={{ padding: "22px 22px 26px" }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 18 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const, marginBottom: 4 }}>
                  <h3 style={{ fontSize: "clamp(18px, 2.5vw, 24px)", fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", fontFamily: SF, margin: 0 }}>{proj.name}</h3>
                  <span style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)", background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 6 }}>{proj.year}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, maxWidth: 520 }}>{proj.desc}</p>
              </div>
              <button
                onClick={onClose}
                style={{ width: 34, height: 34, borderRadius: "50%", flexShrink: 0, background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background 0.15s" }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: `linear-gradient(90deg, ${proj.accent}44, var(--border), transparent)`, marginBottom: 20 }} />

            <div className="modal-two-col">
              {/* Image */}
              <div>
                <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${proj.accentBorder}`, boxShadow: `0 4px 20px rgba(0,0,0,0.3)` }}>
                  <img src={proj.img} alt={proj.name} style={{ width: "100%", height: 190, objectFit: "cover", objectPosition: "center top", display: "block" }} />
                </div>
                {/* Action buttons under image */}
                <div style={{ display: "flex", gap: 9, marginTop: 14, flexWrap: "wrap" as const }}>
                  <a href={proj.github} target="_blank" rel="noreferrer" className="modal-action-btn" style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", fontFamily: SF }}><GithubIcon /> GitHub</a>
                  <a href={proj.live} target="_blank" rel="noreferrer" className="modal-action-btn" style={{ background: proj.accentBg, border: `1px solid ${proj.accentBorder}`, color: proj.accent, fontFamily: SF }}><ExternalIcon /> Live Demo</a>
                </div>
              </div>

              {/* Details */}
              <div>
                <p style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 20, fontFamily: SF }}>{proj.longDesc}</p>
                <p style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-muted)", marginBottom: 10, fontFamily: MONO }}>Tech Stack</p>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                  {proj.tags.map(tag => {
                    const tech = TECH_MAP[tag];
                    return (
                      <span key={tag} className="modal-tag-badge" style={{ color: "var(--tag-text)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)" }}>
                        {tech && <img src={tech.logo} alt={tag} width={11} height={11} style={{ objectFit: "contain", flexShrink: 0, filter: tag === "Express.js" ? "brightness(0) invert(0.6)" : "none" }} />}
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  return createPortal(content, document.body);
}

/* ─────────────────────────────────────────────────────────
   PROJECT CARD
───────────────────────────────────────────────────────── */
function ProjectCard({ proj, index, visible, onOpen }: {
  proj: typeof PROJECTS[0];
  index: number;
  visible: boolean;
  uid: string;
  onOpen: (rect: DOMRect) => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef  = useRef<HTMLImageElement>(null);
  const handleClick = useCallback(() => {
    const rect = cardRef.current?.getBoundingClientRect() ?? null;
    onOpen(rect as DOMRect);
  }, [onOpen]);

  const handleImgEnter = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    el.style.willChange = "transform";
    el.style.transform  = "translateZ(0) scale(1.08)";
  }, []);

  const handleImgLeave = useCallback(() => {
    const el = imgRef.current;
    if (!el) return;
    el.style.transform = "translateZ(0) scale(1)";
    setTimeout(() => {
      if (el.isConnected) el.style.willChange = "auto";
    }, 500);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={false}
      animate={{
        opacity: visible ? 1 : 0,
        y: visible ? 0 : 22,
      }}
      transition={{
        delay: visible ? 0.055 * index : 0,
        type: "spring",
        stiffness: 340,
        damping: 26,
        mass: 0.75,
      }}
      style={{
        borderRadius: 12,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative" as const,
        display: "flex",
        flexDirection: "column" as const,
        /* willChange only set during hover via onHoverStart — not permanently */
        backfaceVisibility: "hidden" as const,
        WebkitBackfaceVisibility: "hidden" as const,
        transform: "translateZ(0)",
      }}
      onClick={handleClick}
      onHoverStart={() => {
        if (cardRef.current) cardRef.current.style.willChange = "transform";
      }}
      onHoverEnd={() => {
        /* Release GPU layer after hover — frees memory */
        setTimeout(() => {
          if (cardRef.current) cardRef.current.style.willChange = "auto";
        }, 300);
      }}
      whileHover={{
        y: -6,
        scale: 1.022,
        transition: { type: "spring", stiffness: 480, damping: 30, mass: 0.5 },
      }}
      whileTap={{
        scale: 0.972,
        transition: { type: "spring", stiffness: 700, damping: 38 },
      }}
    >
      <div style={{ overflow: "hidden", flexShrink: 0 }}>
        <img
          ref={imgRef}
          src={proj.img}
          alt={proj.name}
          style={{
            width: "100%", height: 110,
            objectFit: "cover", objectPosition: "center top", display: "block",
            transform: "translateZ(0) scale(1)",
            transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1)",
            willChange: "auto",
          }}
          onMouseEnter={handleImgEnter}
          onMouseLeave={handleImgLeave}
        />
      </div>
      <div style={{ padding: "10px 12px 10px", display: "flex", flexDirection: "column" as const, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5, flexWrap: "wrap" as const }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: SF, lineHeight: 1.2 }}>{proj.name}</span>
          <span style={{ fontFamily: MONO, fontSize: 9.5, color: "var(--text-muted)" }}>{proj.year}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 auto", fontFamily: SF, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
          {proj.desc}
        </p>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 7, marginTop: 9, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "var(--text-muted)", fontFamily: SF }}>
          Click to view full details
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: "15%", right: "15%", height: 1, background: `linear-gradient(90deg, transparent, ${proj.accent}44, transparent)`, pointerEvents: "none" }} />
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   SECTION
───────────────────────────────────────────────────────── */
export function ProjectsSection() {
  const { ref: revealRef, revealClass, visible } = useReveal();
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState<{ proj: typeof PROJECTS[0]; rect: DOMRect | null } | null>(null);
  const sectionNodeRef = useRef<HTMLDivElement>(null);
  const uid = useId();

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    (sectionNodeRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, [revealRef]);

  // Reset lock when section scrolls fully out of view
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
      <div
        id="projects"
        ref={setRefs}
        className={revealClass}
      >
        <div style={{
          position: "relative", left: "50%", marginLeft: "-50vw",
          width: "100vw", background: "var(--bg-base)",
          borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)",
        }}>
          <div style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 32px" }}>
            <div style={{ paddingTop: 24, marginBottom: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>Projects</span>
            </div>

            {/* Slide-to-unlock — AnimatePresence for smooth exit */}
            <AnimatePresence mode="wait">
              {!unlocked && (
                <motion.div
                  key="slide"
                  initial={{ opacity: 0, y: 12, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.8 }}
                  style={{ display: "flex", justifyContent: "center", padding: "16px 0 6px" }}
                >
                  <SlideToUnlock onUnlock={() => setUnlocked(true)} />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{
              height: 1,
              background: "var(--border)",
              margin: unlocked ? "20px 0 20px" : "14px 0 20px",
              transition: "margin 0.35s cubic-bezier(0.22,1,0.36,1)",
            }} />

            <style suppressHydrationWarning>{`
              .proj-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 10px;
              }
              @media (max-width: 980px) { .proj-grid { grid-template-columns: repeat(3, 1fr); } }
              @media (max-width: 680px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
              @media (max-width: 400px) { .proj-grid { grid-template-columns: 1fr; } }
            `}</style>

            <motion.div
              className="proj-grid"
              animate={{
                opacity: unlocked ? 1 : 0.55,
                scale:   unlocked ? 1 : 0.997,
                filter:  unlocked ? "blur(0px)" : "blur(5px)",
              }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              style={{
                pointerEvents: unlocked ? "auto" : "none",
                willChange: "transform, opacity, filter",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              {PROJECTS.map((proj, i) => (
                <ProjectCard
                  key={proj.name}
                  proj={proj}
                  index={i}
                  visible={visible}
                  uid={`${uid}-${i}`}
                  onOpen={(rect) => setActive({ proj, rect })}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <ProjectModal
            key="modal"
            proj={active.proj}
            uid={`${uid}-${PROJECTS.indexOf(active.proj)}`}
            cardRect={active.rect}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}