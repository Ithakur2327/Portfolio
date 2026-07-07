"use client";
import { useRef, useCallback, useState, useEffect, startTransition } from "react";
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
import { SectionTitleIcon } from "./SectionIcon";

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
  "LangChain":    { color: "#1C9E6E", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/langchain.svg" },
  "RAG":          { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  "Vector DB":    { color: "#FF6333", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  "YouTube API":  { color: "#FF0000", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/youtube/youtube-original.svg" },
  "Chart.js":     { color: "#FF6384", logo: "https://www.chartjs.org/img/chartjs-logo.svg" },
  "Socket.io":    { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
  "JWT":          { color: "#d63aff", logo: "https://jwt.io/img/pic_logo.svg" },
  "Framer Motion":{ color: "#bb4af8", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/framer.svg" },
  "shadcn/ui":    { color: "#ffffff", logo: "https://avatars.githubusercontent.com/u/139895814?s=48" },
  "Vercel":       { color: "#ffffff", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
};

const PROJECTS = [
  {
    name: "Portfolio Website",
    year: "2025",
    accent: "#6366f1",
    accentBg: "rgba(99,102,241,0.10)",
    accentBorder: "rgba(99,102,241,0.30)",
    img: "/portfolio-preview.png",
    desc: "Personal developer portfolio with animated sections, dark/light mode, 3D cards and smooth reveal animations.",
    longDesc: "A fully responsive developer portfolio showcasing skills, projects and experience. Features a dot-grid animated background, custom reveal animations, 3D tilt cards, infinite scrolling skill ticker and a working contact form. Deployed on Vercel with automatic CI/CD.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui", "Vercel"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "HealthnexAI",
    year: "2025",
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
    name: "FinLedgerAI",
    year: "2025",
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.10)",
    accentBorder: "rgba(245,158,11,0.25)",
    img: "/finledger-preview.png",
    desc: "AI-driven expense tracker that auto-categorizes transactions and delivers smart budget insights with Chart.js dashboards.",
    longDesc: "An intelligent personal finance tool. Transactions are auto-categorized using OpenAI API. The ML layer detects unusual spending patterns and generates weekly budget insights. Chart.js dashboards visualize trends. Users set budgets per category and receive alerts.",
    tags: ["React.js", "Node.js", "MongoDB", "OpenAI API", "Chart.js"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "SnipixAI",
    year: "2025",
    accent: "#8b5cf6",
    accentBg: "rgba(139,92,246,0.10)",
    accentBorder: "rgba(139,92,246,0.25)",
    img: "/snipix-preview.png",
    desc: "RAG-based multimodal summarization for PDFs, images, text and audio with semantic search and sub-200ms query latency.",
    longDesc: "A multimodal RAG pipeline ingesting PDFs, images, text and audio. Documents are chunked and embedded into a Vector DB. LangChain orchestrates retrieval and generation — users query documents with natural language. Supports semantic search with sub-200ms query latency.",
    tags: ["Next.js", "TypeScript", "LangChain", "RAG", "Vector DB", "LLM APIs"],
    github: "https://github.com/IndreshThakur",
    live: "#",
  },
  {
    name: "VidLearn",
    year: "2025",
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
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

/* ── Slide to Unlock ── */
const HANDLE_W = 46;
const TRACK_H  = 42;

function SlideToUnlock({ onUnlock }: { onUnlock: () => void }) {
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const lastTickZone = useRef(-1);
  const trackRef     = useRef<HTMLDivElement>(null);
  const [trackW, setTrackW] = useState(244);
  const [unlockDone, setUnlockDone] = useState(false);

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
  const textOpacity = useTransform(x, [0, HANDLE_W * 1.5], [1, 0]);
  const fillScaleX  = useTransform(x, [0, trackW], [0, 1]);

  const getCtx = useCallback(() => {
    if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
    if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
    return audioCtxRef.current;
  }, []);

  useEffect(() => x.on("change", (v) => {
    if (v < 2 || trackW <= 0) return;
    const zone = Math.floor((v / trackW) * 6);
    if (zone !== lastTickZone.current && zone >= 0 && zone <= 5) {
      lastTickZone.current = zone;
      try { playTickSound(getCtx(), 0.8 + (zone / 5) * 0.5); } catch { /**/ }
    }
  }), [x, trackW, getCtx]);

  const onDragStart = useCallback(() => { lastTickZone.current = -1; getCtx(); }, [getCtx]);

  const onDragEnd = useCallback(() => {
    const cur = x.get();
    if (cur >= trackW * 0.82) {
      animate(x, trackW, { type: "spring", stiffness: 900, damping: 60, mass: 0.35 });
      playIOSUnlockSound(getCtx());
      setUnlockDone(true);
      setTimeout(() => onUnlock(), 200);
    } else {
      animate(x, 0, { type: "spring", stiffness: 1100, damping: 70, mass: 0.3, bounce: 0 });
      lastTickZone.current = -1;
    }
  }, [x, trackW, onUnlock, getCtx]);

  return (
    <div style={{ width: 260, borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)", boxShadow: "0 2px 16px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.05)", padding: 3, userSelect: "none", WebkitUserSelect: "none" }}>
      <div ref={trackRef} style={{ position: "relative", height: TRACK_H, borderRadius: 12, background: "var(--bg-secondary)", border: "1px solid var(--border)", touchAction: "none", overflow: "hidden" }}>
        <motion.div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(99,102,241,0.15) 0%, transparent 100%)", scaleX: fillScaleX, transformOrigin: "left center", pointerEvents: "none" }} />
        <motion.div style={{ opacity: textOpacity, position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: HANDLE_W + 4, pointerEvents: "none", gap: 6 }}>
          <span style={{ fontSize: 12, fontWeight: 500, fontFamily: SF, color: "var(--text-muted)", letterSpacing: "0.04em" }}>slide to unlock</span>
          <span style={{ color: "var(--text-muted)", fontSize: 11, opacity: 0.6 }}>›</span>
        </motion.div>
        <motion.div
          drag="x" dragConstraints={{ left: 0, right: trackW }} dragElastic={0} dragMomentum={false}
          dragTransition={{ bounceStiffness: 1100, bounceDamping: 70 }}
          onDragStart={onDragStart} onDragEnd={onDragEnd}
          style={{ position: "absolute", top: 0, left: 0, width: HANDLE_W, height: TRACK_H, x, background: "var(--slide-handle-bg)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 2, color: "var(--slide-handle-fg)", boxShadow: "0 2px 10px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.12)", cursor: "grab", zIndex: 2, touchAction: "none", willChange: "transform" }}
          whileTap={{ scale: 0.91, cursor: "grabbing" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.45, marginLeft: -5 }}><polyline points="9 18 15 12 9 6"/></svg>
        </motion.div>
        <AnimatePresence>
          {unlockDone && (
            <motion.div initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 700, damping: 24 }}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 24, height: 24, borderRadius: "50%", background: "rgba(34,197,94,0.14)", border: "1px solid rgba(34,197,94,0.4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e", pointerEvents: "none" }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── Project Modal ── */
function ProjectModal({ proj, onClose }: { proj: typeof PROJECTS[0]; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
    const cat = document.getElementById("oneko");
    if (cat) cat.style.display = "none";

    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    const t = setTimeout(() => {
      const handler = (e: MouseEvent) => {
        if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, 80);
    return () => {
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
      const cat = document.getElementById("oneko");
      if (cat) cat.style.display = "";
      window.removeEventListener("keydown", esc);
      clearTimeout(t);
    };
  }, [onClose]);

  if (!mounted) return null;

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16, transition: { duration: 0.13, ease: "easeIn" } }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "fixed", inset: 0, zIndex: 9001,
          display: "flex", alignItems: "center", justifyContent: "center",
          padding: "16px",
          pointerEvents: "none",
          willChange: "transform, opacity",
        }}
      >
        <div
          ref={modalRef}
          style={{
            pointerEvents: "auto",
            width: "100%", maxWidth: 960,
            maxHeight: "calc(100dvh - 32px)",
            minHeight: 420,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05), 0 0 32px ${proj.accent}20`,
            overflow: "hidden",
            display: "flex", flexDirection: "column",
          }}
        >
          <style suppressHydrationWarning>{`
            .pm-scroll::-webkit-scrollbar { display: none; }
            .pm-tag {
              display: inline-flex; align-items: center; gap: 5px;
              font-size: 11px; padding: 5px 11px; border-radius: 8px;
              font-family: 'Geist Mono', monospace; font-weight: 600;
            }
          `}</style>
          {/* (extra style block merged above) */}

          <style suppressHydrationWarning>{`
            .pm-body {
              display: flex;
              flex-direction: row;
              flex: 1;
              overflow: hidden;
              min-height: 0;
            }
            .pm-img-col {
              width: 50%;
              flex-shrink: 0;
              border-right: 1px solid var(--border);
              background: var(--bg-secondary);
              display: flex;
              flex-direction: column;
              align-items: stretch;
              overflow-y: auto;
              scrollbar-width: none;
            }
            .pm-img-col::-webkit-scrollbar { display: none; }
            .pm-img-col img {
              width: 100%;
              height: auto;
              display: block;
              object-fit: contain;
              flex-shrink: 0;
            }
            .pm-img-links {
              display: flex;
              gap: 8px;
              padding: 12px;
              border-top: 1px solid var(--border);
              background: var(--bg-card);
              flex-shrink: 0;
              position: sticky;
              bottom: 0;
            }
            .pm-content-col {
              flex: 1;
              overflow-y: auto;
              scrollbar-width: none;
            }
            .pm-content-col::-webkit-scrollbar { display: none; }
            @media (max-width: 600px) {
              .pm-body {
                flex-direction: column;
              }
              .pm-img-col {
                width: 100%;
                border-right: none;
                border-bottom: 1px solid var(--border);
                flex-shrink: 0;
                overflow-y: visible;
              }
              .pm-img-col img {
                width: 100%;
                height: auto;
                object-fit: contain;
              }
            }
          `}</style>

          {/* Header */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 18px",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", fontFamily: SF, margin: 0 }}>
                {proj.name}
              </h3>
              <span style={{ fontFamily: MONO, fontSize: 10, color: "var(--text-muted)", background: "var(--bg-secondary)", border: "1px solid var(--border)", padding: "2px 7px", borderRadius: 5 }}>
                {proj.year}
              </span>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: "50%",
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                color: "var(--text-muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", flexShrink: 0,
                transition: "background 0.15s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-secondary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)"; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Body — horizontal on desktop, vertical on mobile */}
          <div className="pm-body">

            {/* Left: Image + Links */}
            <div className="pm-img-col">
              <img src={proj.img} alt={proj.name} loading="lazy" decoding="async" />
              {/* GitHub & Live Demo below image */}
              <div className="pm-img-links">
                <a href={proj.github} target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, textDecoration: "none", fontFamily: SF, background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)", transition: "opacity 0.15s, transform 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                >
                  <GithubIcon /> GitHub
                </a>
                <a href={proj.live} target="_blank" rel="noreferrer"
                  style={{ flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, padding: "10px 14px", borderRadius: 10, fontSize: 12.5, fontWeight: 600, textDecoration: "none", fontFamily: SF, background: proj.accentBg, border: `1px solid ${proj.accentBorder}`, color: proj.accent, transition: "opacity 0.15s, transform 0.15s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = "0.75"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; (e.currentTarget as HTMLElement).style.transform = "none"; }}
                >
                  <ExternalIcon /> Live Demo
                </a>
              </div>
            </div>

            {/* Right: Scrollable content */}
            <div className="pm-content-col pm-scroll">
              <div style={{ padding: "20px 20px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

                {/* About */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: MONO, margin: "0 0 8px" }}>About</p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.85, margin: 0, fontFamily: SF }}>{proj.longDesc}</p>
                </div>

                <div style={{ height: 1, background: "var(--border)" }} />

                {/* Tech Stack */}
                <div>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: MONO, margin: "0 0 12px" }}>Tech Stack</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                    {proj.tags.map(tag => {
                      const tech = TECH_MAP[tag];
                      return (
                        <span key={tag} className="pm-tag" style={{ color: "var(--tag-text)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)" }}>
                          {tech && <img src={tech.logo} alt={tag} width={13} height={13} decoding="async" style={{ objectFit: "contain", flexShrink: 0, filter: tag === "Express.js" ? "brightness(0) invert(0.6)" : "none" }} />}
                          {tag}
                        </span>
                      );
                    })}
                  </div>
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

/* ── Project Card ── */
function ProjectCard({ proj, index, visible, onOpen }: {
  proj: typeof PROJECTS[0];
  index: number;
  visible: boolean;
  onOpen: () => void;
}) {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImgEnter = useCallback(() => {
    const el = imgRef.current; if (!el) return;
    el.style.transform = "scale(1.08)";
  }, []);
  const handleImgLeave = useCallback(() => {
    const el = imgRef.current; if (!el) return;
    el.style.transform = "scale(1)";
  }, []);

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 22 }}
      transition={{ delay: visible ? 0.055 * index : 0, type: "spring", stiffness: 340, damping: 26, mass: 0.75 }}
      style={{
        borderRadius: 12,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onOpen}
      whileHover={{ y: -5, transition: { type: "spring", stiffness: 380, damping: 28, mass: 0.7 } }}
      whileTap={{ scale: 0.97, y: 0, transition: { duration: 0.1 } }}
    >
      <div style={{ overflow: "hidden", flexShrink: 0 }}>
        <img
          ref={imgRef}
          src={proj.img}
          alt={proj.name}
          loading="lazy"
          decoding="async"
          style={{ width: "100%", height: 130, objectFit: "cover", objectPosition: "top center", display: "block", transform: "scale(1)", transition: "transform 0.45s cubic-bezier(0.22,1,0.36,1)" }}
          onMouseEnter={handleImgEnter}
          onMouseLeave={handleImgLeave}
        />
      </div>
      <div style={{ padding: "10px 12px 10px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 5, flexWrap: "wrap" }}>
          <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: SF, lineHeight: 1.2 }}>{proj.name}</span>
          <span style={{ fontFamily: MONO, fontSize: 9.5, color: "var(--text-muted)" }}>{proj.year}</span>
        </div>
        <p style={{ fontSize: 11, color: "var(--text-secondary)", lineHeight: 1.55, margin: "0 0 auto", fontFamily: SF, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {proj.desc}
        </p>
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 7, marginTop: 9, display: "flex", alignItems: "center", justifyContent: "center", gap: 4, fontSize: 10, color: "var(--text-muted)", fontFamily: SF }}>
          Click to view full details
          <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section ── */
export function ProjectsSection() {
  const { ref: revealRef, revealClass, visible } = useReveal();
  const [unlocked, setUnlocked] = useState(false);
  const [active, setActive] = useState<typeof PROJECTS[0] | null>(null);
  const sectionNodeRef = useRef<HTMLDivElement>(null);

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    (sectionNodeRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, [revealRef]);

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
      <div id="projects" ref={setRefs} className={revealClass}>
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
          <div className="proj-inner" style={{ maxWidth: 1060, margin: "0 auto", padding: "0 20px 60px" }}>
            <div style={{ paddingTop: 50, marginBottom: 4 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                <SectionTitleIcon type="box" />
                Projects
              </span>
            </div>

            <AnimatePresence mode="wait">
              {!unlocked && (
                <motion.div
                  key="slide"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28, mass: 0.8 }}
                  style={{ display: "flex", justifyContent: "center", padding: "16px 0 6px" }}
                >
                  <SlideToUnlock onUnlock={() => setUnlocked(true)} />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ height: 1, background: "var(--border)", margin: unlocked ? "20px 0 20px" : "14px 0 20px", transition: "margin 0.3s ease" }} />

            <style suppressHydrationWarning>{`
              .proj-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
              }
              @media (max-width: 780px) { .proj-grid { grid-template-columns: repeat(2, 1fr); } }
              @media (max-width: 480px) { .proj-grid { grid-template-columns: 1fr; } }
              @media (max-width: 639px) { .proj-inner { padding: 0 16px 28px !important; } }
              .proj-grid-wrap {
                filter: blur(5px);
                opacity: 0.55;
                pointer-events: none;
                transition: filter 0.45s cubic-bezier(0.22,1,0.36,1), opacity 0.45s cubic-bezier(0.22,1,0.36,1);
              }
              .proj-grid-wrap.unlocked {
                filter: blur(0px);
                opacity: 1;
                pointer-events: auto;
              }
            `}</style>

            <div className={`proj-grid-wrap${unlocked ? " unlocked" : ""}`}>
              <div className="proj-grid">
                {PROJECTS.map((proj, i) => (
                  <ProjectCard
                    key={proj.name}
                    proj={proj}
                    index={i}
                    visible={visible}
                    onOpen={() => startTransition(() => setActive(proj))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {active && (
          <ProjectModal
            key="modal"
            proj={active}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}