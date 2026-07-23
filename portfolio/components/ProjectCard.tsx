"use client";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { TECH_MAP } from "@/lib/projects-data";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// One shared spring for every layoutId'd element — keeping it identical
// everywhere is what makes the card-to-modal morph read as one continuous
// motion instead of several independently-timed animations.
const SPRING = { type: "spring" as const, stiffness: 260, damping: 25 };

export const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);
export const ExternalIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);
const ExpandIcon = ({ size = 15 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
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
        style={{ color: "var(--text-muted)", display: "flex", transition: "color 0.15s", cursor: "pointer" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = proj.accent; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
      >
        <ExternalIcon size={size} />
      </a>
      <a
        href={proj.github} target="_blank" rel="noreferrer" title="GitHub"
        onClick={e => e.stopPropagation()}
        style={{ color: "var(--text-muted)", display: "flex", transition: "color 0.15s", cursor: "pointer" }}
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
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ delay: visible ? 0.05 * index : 0, type: "spring", stiffness: 340, damping: 26, mass: 0.75 }}
      layoutId={`card-container-${proj.name}`}
      onClick={onOpen}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        cursor: "pointer",
        overflow: "hidden",
        borderRadius: 14,
        willChange: "transform",
      }}
    >
      {/* Dashed frame + tilted banner photo */}
      <div style={{ width: "100%", padding: 4, borderRadius: 10, border: "1px dashed var(--border)" }}>
        <motion.div
          layoutId={`card-banner-${proj.name}`}
          transition={SPRING}
          style={{
            width: "100%", height: 176, borderRadius: 8,
            background: "var(--bg-secondary)", border: "1px solid var(--border)",
            position: "relative", overflow: "hidden",
          }}
        >
          <motion.div
            layoutId={`card-banner-image-${proj.name}`}
            initial={{ bottom: "-32px", rotate: -8 }}
            whileHover={{ bottom: 0, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            style={{
              position: "absolute", left: 0, right: 0, margin: "0 auto",
              width: "85%", aspectRatio: "4 / 2",
              borderRadius: 4, overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
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
      <div style={{ width: "100%", padding: "12px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <motion.span
            layoutId={`card-title-${proj.name}`}
            transition={SPRING}
            style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", fontFamily: SF, lineHeight: 1.3 }}
          >
            {proj.name}
          </motion.span>
          <motion.div
            layoutId={`card-links-${proj.name}`}
            transition={SPRING}
            style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onOpen}
              className="card-expand-btn"
              aria-label="Expand"
              style={{ display: "none", alignItems: "center", justifyContent: "center", width: 24, height: 24, padding: 0, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <ExpandIcon />
            </button>
            <ProjectLinks proj={proj} size={18} />
          </motion.div>
        </div>

        <motion.p
          layoutId={`card-description-${proj.name}`}
          transition={SPRING}
          style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, fontFamily: SF, textAlign: "left", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {proj.description}
        </motion.p>

        <motion.div
          layoutId={`card-tech-section-${proj.name}`}
          transition={SPRING}
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: SF }}>
            Technologies
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {proj.tags.map(tag => {
              const tech = TECH_MAP[tag];
              if (!tech) return null;
              return (
                <motion.div key={tag} layoutId={`card-tech-${proj.name}-${tag}`} transition={SPRING} title={tag} style={{ display: "flex" }}>
                  <img
                    src={tech.logo}
                    alt={tag}
                    width={24}
                    height={24}
                    decoding="async"
                    style={{ objectFit: "contain", display: "block" }}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <style suppressHydrationWarning>{`
        @media (max-width: 640px) {
          .card-expand-btn { display: flex !important; }
        }
      `}</style>
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
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
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
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
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
        style={{ position: "fixed", inset: 0, zIndex: 9000, background: "rgba(0,0,0,0.6)", willChange: "opacity" }}
      />

      <div style={{ position: "fixed", inset: 0, zIndex: 9001, display: "grid", placeItems: "center", padding: 16, pointerEvents: "none" }}>
        <motion.div
          ref={modalRef}
          layoutId={`card-container-${proj.name}`}
          transition={SPRING}
          style={{
            pointerEvents: "auto",
            width: "100%", maxWidth: 672,
            maxHeight: "85vh",
            display: "flex", flexDirection: "column",
            cursor: "default",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.55)",
            overflow: "hidden",
            willChange: "transform",
          }}
        >
          <style suppressHydrationWarning>{`
            .pm-scroll::-webkit-scrollbar { display: none; }
            .pm-tag {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 12.5px; padding: 6px 11px; border-radius: 999px;
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
            style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", scrollbarWidth: "none", padding: 24, display: "flex", flexDirection: "column", gap: 16 }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <motion.h2
                  layoutId={`card-title-${proj.name}`}
                  transition={SPRING}
                  style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: SF, margin: 0, lineHeight: 1.25 }}
                >
                  {proj.name}
                </motion.h2>
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: SF }}
                >
                  Created: {proj.year}
                </motion.span>
              </div>
              <motion.div
                layoutId={`card-links-${proj.name}`}
                transition={SPRING}
                style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, paddingTop: 4 }}
              >
                <ProjectLinks proj={proj} size={18} />
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              layoutId={`card-description-${proj.name}`}
              transition={SPRING}
              style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.625, margin: 0, fontFamily: SF }}
            >
              {proj.description}
            </motion.p>

            {/* Technologies */}
            <motion.div
              layoutId={`card-tech-section-${proj.name}`}
              transition={SPRING}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: SF }}>
                Technologies
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {proj.tags.map(tag => {
                  const tech = TECH_MAP[tag];
                  return (
                    <motion.div key={tag} layoutId={`card-tech-${proj.name}-${tag}`} transition={SPRING}>
                      <span className="pm-tag" style={{ color: "var(--tag-text)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)" }}>
                        {tech && <img src={tech.logo} alt={tag} width={15} height={15} decoding="async" style={{ objectFit: "contain", flexShrink: 0 }} />}
                        {tag}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Features — only shown expanded */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-muted)", fontFamily: SF }}>
                Features
              </span>
              <ul style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                {proj.features.map((feature, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + i * 0.03 }}
                    style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, fontFamily: SF }}
                  >
                    <span style={{ color: proj.accent, marginTop: 4, flexShrink: 0 }}>•</span>
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
