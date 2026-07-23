"use client";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { TECH_MAP } from "@/lib/projects-data";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// Single shared spring for every layoutId'd element — keeping it identical
// everywhere is what makes the card-to-modal morph read as one continuous
// motion instead of several independently-timed animations.
const SPRING = { type: "spring" as const, stiffness: 260, damping: 25 };

export const GithubIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
export const ExternalIcon = ({ size = 13 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

/* Bare icon links shared between the card header and the modal header via
   layoutId — they morph in place rather than fading independently. */
function ProjectLinks({ proj, size }: { proj: Project; size: number }) {
  return (
    <>
      <a
        href={proj.live} target="_blank" rel="noreferrer" title="Live Demo"
        onClick={e => e.stopPropagation()}
        style={{ color: "var(--text-muted)", display: "flex", transition: "color 0.15s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = proj.accent; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
      >
        <ExternalIcon size={size} />
      </a>
      <a
        href={proj.github} target="_blank" rel="noreferrer" title="GitHub"
        onClick={e => e.stopPropagation()}
        style={{ color: "var(--text-muted)", display: "flex", transition: "color 0.15s" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = proj.accent; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
      >
        <GithubIcon size={size} />
      </a>
    </>
  );
}

/* ─────────────────────────────────────────────────────────
   Card — collapsed grid tile
───────────────────────────────────────────────────────── */
export function ProjectCard({ proj, index, visible, onOpen }: {
  proj: Project;
  index: number;
  visible: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 22 }}
      transition={{ delay: visible ? 0.05 * index : 0, type: "spring", stiffness: 340, damping: 26, mass: 0.75 }}
      layoutId={`card-container-${proj.name}`}
      onClick={onOpen}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 380, damping: 28, mass: 0.7 } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      style={{
        borderRadius: 14,
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        willChange: "transform",
      }}
    >
      {/* Dashed frame + tilted banner photo */}
      <div style={{ padding: 5, borderRadius: 14 }}>
        <motion.div
          layoutId={`card-banner-${proj.name}`}
          transition={SPRING}
          style={{
            width: "100%", height: 148, borderRadius: 10,
            background: "var(--bg-secondary)", border: "1px dashed var(--border)",
            position: "relative", overflow: "hidden",
          }}
        >
          <motion.div
            layoutId={`card-banner-image-${proj.name}`}
            initial={{ bottom: "-14px", rotate: -7 }}
            whileHover={{ bottom: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 20 }}
            style={{
              position: "absolute", left: 0, right: 0, margin: "0 auto",
              width: "86%", aspectRatio: "16 / 10",
              borderRadius: 8, overflow: "hidden",
              boxShadow: "0 14px 30px rgba(0,0,0,0.35)",
              willChange: "transform",
            }}
          >
            <img
              src={proj.img}
              alt={proj.name}
              loading="lazy"
              decoding="async"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Detail section */}
      <div style={{ padding: "12px 14px 14px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <motion.span
            layoutId={`card-title-${proj.name}`}
            transition={SPRING}
            style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: SF, lineHeight: 1.2 }}
          >
            {proj.name}
          </motion.span>
          <motion.div
            layoutId={`card-links-${proj.name}`}
            transition={SPRING}
            style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
          >
            <ProjectLinks proj={proj} size={14} />
          </motion.div>
        </div>

        <motion.p
          layoutId={`card-description-${proj.name}`}
          transition={SPRING}
          style={{ fontSize: 11.5, color: "var(--text-secondary)", lineHeight: 1.6, margin: 0, fontFamily: SF, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {proj.desc}
        </motion.p>

        <motion.div
          layoutId={`card-tech-section-${proj.name}`}
          transition={SPRING}
          style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: "auto", paddingTop: 4 }}
        >
          {proj.tags.map(tag => {
            const tech = TECH_MAP[tag];
            if (!tech) return null;
            return (
              <motion.div
                key={tag}
                layoutId={`card-tech-${proj.name}-${tag}`}
                transition={SPRING}
                title={tag}
              >
                <img
                  src={tech.logo}
                  alt={tag}
                  width={17}
                  height={17}
                  decoding="async"
                  style={{ objectFit: "contain", display: "block", filter: tag === "Express.js" ? "brightness(0) invert(0.6)" : "none", opacity: 0.9 }}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Modal — expanded shared-layout counterpart of the card
───────────────────────────────────────────────────────── */
export function ProjectModal({ proj, onClose }: { proj: Project; onClose: () => void }) {
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
        transition={{ duration: 0.15 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          willChange: "opacity",
        }}
      />

      <div style={{ position: "fixed", inset: 0, zIndex: 9001, display: "grid", placeItems: "center", padding: 16, pointerEvents: "none" }}>
        <motion.div
          ref={modalRef}
          layoutId={`card-container-${proj.name}`}
          transition={SPRING}
          style={{
            pointerEvents: "auto",
            width: "100%", maxWidth: 640,
            maxHeight: "85vh",
            display: "flex", flexDirection: "column",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 20,
            boxShadow: `0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.05), 0 0 32px ${proj.accent}20`,
            overflow: "hidden",
            willChange: "transform",
          }}
        >
          <style suppressHydrationWarning>{`
            .pm-scroll::-webkit-scrollbar { display: none; }
            .pm-tag {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 11.5px; padding: 6px 12px; border-radius: 8px;
              font-family: ${MONO}; font-weight: 600;
            }
          `}</style>

          {/* Banner */}
          <motion.div
            layoutId={`card-banner-${proj.name}`}
            transition={SPRING}
            style={{ width: "100%", aspectRatio: "16 / 9", flexShrink: 0, position: "relative", overflow: "hidden", background: "var(--bg-secondary)" }}
          >
            <motion.div
              layoutId={`card-banner-image-${proj.name}`}
              transition={SPRING}
              style={{ position: "absolute", inset: 0 }}
            >
              <img src={proj.img} alt={proj.name} loading="lazy" decoding="async" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </motion.div>

            <button
              onClick={onClose}
              aria-label="Close"
              style={{
                position: "absolute", top: 12, right: 12,
                width: 30, height: 30, borderRadius: "50%",
                background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", backdropFilter: "blur(4px)",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </motion.div>

          {/* Scrollable content */}
          <motion.div
            className="pm-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", padding: "20px 22px 26px", display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <motion.h2
                  layoutId={`card-title-${proj.name}`}
                  transition={SPRING}
                  style={{ fontSize: 21, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.03em", fontFamily: SF, margin: 0 }}
                >
                  {proj.name}
                </motion.h2>
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ fontFamily: MONO, fontSize: 11, color: "var(--text-muted)" }}
                >
                  {proj.year}
                </motion.span>
              </div>
              <motion.div
                layoutId={`card-links-${proj.name}`}
                transition={SPRING}
                style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0, paddingTop: 4 }}
              >
                <ProjectLinks proj={proj} size={17} />
              </motion.div>
            </div>

            {/* About */}
            <motion.p
              layoutId={`card-description-${proj.name}`}
              transition={SPRING}
              style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.85, margin: 0, fontFamily: SF }}
            >
              {proj.longDesc}
            </motion.p>

            {/* Tech stack */}
            <motion.div
              layoutId={`card-tech-section-${proj.name}`}
              transition={SPRING}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: MONO }}>
                Tech Stack
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {proj.tags.map(tag => {
                  const tech = TECH_MAP[tag];
                  return (
                    <motion.div key={tag} layoutId={`card-tech-${proj.name}-${tag}`} transition={SPRING}>
                      <span className="pm-tag" style={{ color: "var(--tag-text)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)" }}>
                        {tech && <img src={tech.logo} alt={tag} width={14} height={14} decoding="async" style={{ objectFit: "contain", flexShrink: 0, filter: tag === "Express.js" ? "brightness(0) invert(0.6)" : "none" }} />}
                        {tag}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Features — only shown expanded */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: 0.18, duration: 0.25 }}
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--text-muted)", fontFamily: MONO }}>
                Features
              </span>
              <ul style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                {proj.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.22 + i * 0.03 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: SF }}
                  >
                    <span style={{ color: proj.accent, marginTop: 2, flexShrink: 0 }}>•</span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}
