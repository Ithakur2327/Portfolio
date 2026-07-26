"use client";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import type { Project } from "@/lib/projects-data";
import { TECH_MAP } from "@/lib/projects-data";
import { useTheme } from "./ThemeProvider";
import { BP, mq } from "@/lib/breakpoints";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// A few brand logos (Next.js, Express.js, Vercel, shadcn/ui) are monochrome
// and only ship a light-hex variant by default — invisible against the
// light theme's near-white tag background. Swap in the dark-hex `logoLight`
// variant when present and the current theme is light.
function techLogoSrc(tech: { logo: string; logoLight?: string }, isDark: boolean) {
  return !isDark && tech.logoLight ? tech.logoLight : tech.logo;
}

// One shared spring for every layoutId'd element — keeping it identical
// everywhere is what makes the card-to-modal morph read as one continuous
// motion instead of several independently-timed animations.
const SPRING = { type: "spring" as const, stiffness: 260, damping: 25 };

// Two alternating frame colors for the banner border — same thickness
// everywhere, alternating tiffany / gold by card position so neighboring
// cards read as a deliberate pair rather than a random mix.
const TIFFANY = "#0ABAB5";
const GOLD = "#D4AF37";

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

/* Bare icon links shared between the card header and the modal — they
   morph in place via layoutId rather than fading independently. */
function ProjectLinks({ proj, size }: { proj: Project; size: number }) {
  return (
    <>
      <a
        href={proj.live} target="_blank" rel="noreferrer" title="Live Demo"
        onClick={e => e.stopPropagation()}
        className="proj-icon-link"
        style={{ display: "flex", cursor: "pointer" }}
      >
        <ExternalIcon size={size} />
      </a>
      <a
        href={proj.github} target="_blank" rel="noreferrer" title="GitHub"
        onClick={e => e.stopPropagation()}
        className="proj-icon-link"
        style={{ display: "flex", cursor: "pointer" }}
      >
        <GithubIcon size={size} />
      </a>
    </>
  );
}

/* Labeled button versions of the same links — used in the modal, below
   the image, per the requested layout. Kept visually consistent with
   the bare-icon style (same icon glyphs/colors), just with a text label. */
function ProjectLinkButtons({ proj }: { proj: Project }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <a
        href={proj.live} target="_blank" rel="noreferrer"
        className="proj-link-btn"
        style={{ borderColor: proj.accentBorder, background: proj.accentBg, color: proj.accent }}
      >
        <ExternalIcon size={16} /> Live Demo
      </a>
      <a
        href={proj.github} target="_blank" rel="noreferrer"
        className="proj-link-btn"
        style={{ borderColor: "var(--border)", background: "var(--bg-secondary)", color: "var(--text-secondary)" }}
      >
        <GithubIcon size={16} /> GitHub
      </a>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   Card — collapsed grid tile
───────────────────────────────────────────────────────── */
export function ProjectCard({ proj, index, visible, isDesktop, onOpen }: {
  proj: Project;
  index: number;
  visible: boolean;
  isDesktop: boolean;
  onOpen: () => void;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  // Re-triggering (no "once") on purpose — the reveal should replay
  // every time the card crosses into/out of view on touch devices.
  const inView = useInView(frameRef, { amount: 0.6 });
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Desktop: reveal on hover anywhere over the card. Touch devices: reveal
  // on scroll into view (repeats every time it enters/leaves).
  const shown = isDesktop ? hovered : inView;

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ delay: visible ? 0.05 * index : 0, type: "spring", stiffness: 340, damping: 26, mass: 0.75 }}
      layoutId={`card-container-${proj.name}`}
      onClick={onOpen}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
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
      {/* Banner photo — the colored accent frame lives on this plain
          (non-animated) wrapper so its corners always render as one crisp,
          fully-connected line. Layout-animated (layoutId) elements get a
          transform applied by Framer Motion's shared-layout projection,
          which can make hairline borders render unevenly on non-top edges —
          keeping the visible frame on a static element sidesteps that. */}
      <div
        style={{
          width: "100%",
          padding: 3,
          borderRadius: 13,
          border: `1.2px dashed ${index % 2 === 0 ? TIFFANY : GOLD}`,
          boxSizing: "border-box",
        }}
      >
        <motion.div
          ref={frameRef}
          layoutId={`card-banner-${proj.name}`}
          transition={SPRING}
          style={{
            width: "100%", aspectRatio: "16 / 9", borderRadius: 9,
            background: "var(--bg-secondary)",
            border: "1.2px solid var(--border)",
            position: "relative", overflow: "hidden",
          }}
        >
          {/* Slide wrapper — a plain motion.div (no layoutId) that owns the
              reveal transform. Keeping it separate from the layoutId'd image
              below is what makes the hover/scroll reveal actually animate
              instead of fighting with Framer's shared-layout projection. */}
          <motion.div
            initial={false}
            animate={{ y: shown ? "0%" : "55%", rotate: shown ? 0 : -8 }}
            transition={isDesktop
              ? { type: "spring", stiffness: 210, damping: 24, mass: 0.85 }
              : { type: "spring", stiffness: 85, damping: 20, mass: 1.6 }}
            style={{ position: "absolute", inset: 0, willChange: "transform" }}
          >
            <motion.div
              layoutId={`card-banner-image-${proj.name}`}
              style={{ position: "absolute", inset: 0, overflow: "hidden" }}
            >
              <Image
                src={proj.img}
                alt={proj.name}
                fill
                quality={100}
                sizes="(max-width: 640px) 96vw, (max-width: 1024px) 48vw, 520px"
                unoptimized={proj.img.endsWith(".svg")}
                style={{ objectFit: "contain" }}
              />
            </motion.div>
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
            style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={onOpen}
              className="card-expand-btn"
              aria-label="Expand"
              title="Click to view"
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, height: 24, padding: 0, background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}
            >
              <ExpandIcon />
            </button>
            <ProjectLinks proj={proj} size={20} />
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
            Stack
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {proj.tags.map(tag => {
              const tech = TECH_MAP[tag];
              if (!tech) return null;
              return (
                <motion.div key={tag} layoutId={`card-tech-${proj.name}-${tag}`} transition={SPRING} title={tag} style={{ display: "flex" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- tiny (24px) external SVG icon; dangerouslyAllowSVG is intentionally off, and there's no bandwidth/LCP benefit to proxy such a small icon through next/image */}
                  <img
                    src={techLogoSrc(tech, isDark)}
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
        .proj-icon-link {
          color: var(--text-secondary);
          transition: color 0.15s ease, transform 0.15s cubic-bezier(0.16,1,0.3,1);
        }
        .proj-icon-link:hover {
          color: ${proj.accent};
          transform: translateY(-1.5px) scale(1.08);
        }

        .card-expand-btn:hover {
          color: ${proj.accent};
          transform: translateY(-1.5px) scale(1.08);
        }
      `}</style>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────
   Modal — expanded shared-layout counterpart of the card
───────────────────────────────────────────────────────── */
export function ProjectModal({ proj, onClose, index = 0 }: { proj: Project; onClose: () => void; index?: number }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // Mobile gets a simple slide-up-from-bottom open/close instead of the
  // card-morphing shared-layout animation used everywhere else — so
  // layoutId is intentionally omitted below on mobile (a plain
  // initial/animate/exit drives the sheet instead).
  // Mobile gets a simple slide-up-from-bottom open/close instead of the
  // card-morphing shared-layout animation used everywhere else — so
  // layoutId is intentionally omitted below on mobile (a plain
  // initial/animate/exit drives the sheet instead).
  //
  // Computed synchronously (not via the shared useIsMobile() hook, which
  // deliberately starts `false` for SSR-safety and only updates a tick
  // later). ProjectModal only ever mounts client-side, right when a card
  // is tapped, so `window` is always available here — reading it eagerly
  // means Framer Motion sees the correct `initial` position on the very
  // first render instead of missing it and popping in with no animation.
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth <= BP.mobileMax
  );
  // A plain tween (fixed duration, no per-frame spring integration) is
  // noticeably lighter on low-end phones than a spring, so mobile gets
  // this instead of the desktop SPRING.
  const mobileTransition = { type: "tween" as const, duration: 0.22, ease: [0.22, 1, 0.36, 1] as const };
  const lid = (id: string) => (isMobile ? undefined : id);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    const cat = document.getElementById("oneko");
    if (cat) cat.style.display = "none";

    // Focus the close button on open, restore focus to whatever
    // triggered the modal when it closes.
    const previouslyFocused = document.activeElement as HTMLElement | null;

    // Deferred by one rAF so this setup doesn't compete with the shared-
    // layout animation's first frame for main-thread time. This changes
    // nothing about the animation itself (no motion value, timing, or
    // spring is touched) — it only shifts *when* focus/listeners attach.
    let focusTimer: ReturnType<typeof setTimeout>;
    const raf = requestAnimationFrame(() => {
      focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 50);
    });

    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };

    // Basic focus trap — Tab/Shift+Tab cycle within the modal only.
    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;
      const focusables = modalRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };

    window.addEventListener("keydown", esc);
    window.addEventListener("keydown", trapFocus);
    const handler = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) onClose();
    };
    const t = setTimeout(() => {
      document.addEventListener("mousedown", handler);
    }, 80);
    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.classList.remove("modal-open");
      const cat = document.getElementById("oneko");
      if (cat) cat.style.display = "";
      window.removeEventListener("keydown", esc);
      window.removeEventListener("keydown", trapFocus);
      document.removeEventListener("mousedown", handler);
      cancelAnimationFrame(raf);
      clearTimeout(t);
      clearTimeout(focusTimer);
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="pm-overlay"
        style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: "rgba(0,0,0,0.55)",
          willChange: "opacity",
        }}
      />

      <div style={{ position: "fixed", inset: 0, zIndex: 9001, display: "grid", placeItems: "center", padding: 16, pointerEvents: "none" }}>
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${proj.name} project details`}
          layoutId={lid(`card-container-${proj.name}`)}
          initial={isMobile ? { y: "100%" } : false}
          animate={isMobile ? { y: 0 } : undefined}
          exit={isMobile ? { opacity: 0 } : undefined}
          transition={isMobile ? mobileTransition : SPRING}
          className="pm-shell"
          style={{
            pointerEvents: "auto",
            width: "100%", maxWidth: 960,
            cursor: "default",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            boxShadow: "0 12px 28px -8px rgba(0,0,0,0.45)",
            overflow: "hidden",
            willChange: "transform",
          }}
        >
          <style suppressHydrationWarning>{`
            .pm-overlay {
              backdrop-filter: blur(6px);
              -webkit-backdrop-filter: blur(6px);
            }
            ${mq.tabletSplitDown} {
              .pm-overlay { backdrop-filter: blur(3px); -webkit-backdrop-filter: blur(3px); }
            }
            ${mq.mobile} {
              .pm-overlay { backdrop-filter: none; -webkit-backdrop-filter: none; }
            }

            /* Shell — the layout-animated element. Purely a sized/positioned
               frame; it does NOT scroll itself, so Framer's layout transform
               never gets applied to a scrolling element (that's what broke
               touch-scroll on mobile after the open animation finished).
               Flex + min-height:0 on the body below is what actually lets
               the inner div scroll reliably inside a max-height parent —
               without min-height:0 a flex/block child can refuse to shrink
               below its content size, so overflow-y:auto never engages.
               will-change + translateZ(0) are compositor hints only — they
               don't change any animated value or timing, just tell the
               browser to promote this element to its own GPU layer before
               the animation starts rather than partway through it. */
            .pm-shell {
              display: flex;
              flex-direction: column;
              max-height: 92vh;
              will-change: transform;
              transform: translateZ(0);
            }
            ${mq.tabletSplitUp} { .pm-shell { max-height: 82vh; } }

            /* Body — a plain (non-layout-animated) div that actually scrolls.
               Always a fresh, transform-free element, so touch/wheel scroll
               keeps working regardless of what the shell's animation is doing. */
            .pm-body {
              width: 100%;
              flex: 1 1 auto;
              min-height: 0;
              display: flex;
              flex-direction: column;
              overflow-y: auto;
              overscroll-behavior: contain;
              -webkit-overflow-scrolling: touch;
              scrollbar-width: none;
            }
            .pm-body::-webkit-scrollbar { display: none; }

            .pm-tag {
              display: inline-flex; align-items: center; gap: 6px;
              font-size: 12.5px; padding: 6px 11px; border-radius: 999px;
              font-family: ${MONO}; font-weight: 600;
            }
            .proj-link-btn {
              display: inline-flex; align-items: center; gap: 7px;
              padding: 8px 14px; border-radius: 9px;
              border: 1px solid var(--border);
              font-family: ${SF}; font-size: 13px; font-weight: 600;
              text-decoration: none;
              transition: transform 0.15s cubic-bezier(0.16,1,0.3,1), opacity 0.15s ease;
            }
            .proj-link-btn:hover { transform: translateY(-1.5px); opacity: 0.88; }
            .proj-link-btn:active { transform: translateY(0) scale(0.98); }

            /* Desktop/laptop: horizontal split — image+links left,
               title/description/stack right. */
            ${mq.tabletSplitUp} {
              .pm-body { flex-direction: row; }
              .pm-media-col {
                width: 45%; flex-shrink: 0;
                display: flex; flex-direction: column; gap: 14px;
                padding: 24px; border-right: 1px solid var(--border);
                overflow-y: auto; scrollbar-width: none;
              }
              .pm-media-col::-webkit-scrollbar { display: none; }
              .pm-info-col {
                flex: 1; min-width: 0;
                padding: 24px; overflow-y: auto; scrollbar-width: none;
                display: flex; flex-direction: column; gap: 16px;
              }
              .pm-info-col::-webkit-scrollbar { display: none; }
              .pm-image-frame { aspect-ratio: 4 / 3; }
            }
          `}</style>

          <div className="pm-body">
          {/* Media column: image (uncropped) + Live/GitHub buttons */}
          <div className="pm-media-col" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
            <div
              style={{
                width: "100%", padding: 3, borderRadius: 13,
                border: `1.5px dashed ${index % 2 === 0 ? TIFFANY : GOLD}`,
                boxSizing: "border-box", flexShrink: 0,
              }}
            >
              <motion.div
                layoutId={lid(`card-banner-${proj.name}`)}
                transition={SPRING}
                className="pm-image-frame"
                style={{
                  width: "100%", aspectRatio: "16 / 9", position: "relative",
                  overflow: "hidden", borderRadius: 9,
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                }}
              >
                <motion.div
                  layoutId={lid(`card-banner-image-${proj.name}`)}
                  transition={SPRING}
                  style={{ position: "absolute", inset: 0 }}
                >
                  <Image
                    src={proj.img}
                    alt={proj.name}
                    fill
                    quality={100}
                    sizes="(max-width: 767px) 100vw, 45vw"
                    unoptimized={proj.img.endsWith(".svg")}
                    style={{ objectFit: "contain" }}
                  />
                </motion.div>
              </motion.div>
            </div>

            <motion.div layoutId={lid(`card-links-${proj.name}`)} transition={SPRING}>
              <ProjectLinkButtons proj={proj} />
            </motion.div>

            {/* Stack — moved below the image + Live/GitHub buttons, per the
                requested layout (image, then links, then stack). */}
            <motion.div
              layoutId={lid(`card-tech-section-${proj.name}`)}
              transition={SPRING}
              style={{ display: "flex", flexDirection: "column", gap: 8 }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: SF }}>
                Stack
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {proj.tags.map((tag, ti) => {
                  const tech = TECH_MAP[tag];
                  return (
                    <motion.span
                      key={tag}
                      initial={isMobile ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={isMobile ? { duration: 0 } : { delay: 0.05 + ti * 0.02, duration: 0.2 }}
                      className="pm-tag"
                      style={{ color: "var(--tag-text)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)" }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- tiny external SVG icon, see justification on the card version above */}
                      {tech && <img src={techLogoSrc(tech, isDark)} alt={tag} width={15} height={15} decoding="async" style={{ objectFit: "contain", flexShrink: 0 }} />}
                      {tag}
                    </motion.span>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Info column: title, description, features */}
          <div className="pm-info-col" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <motion.h2
                  layoutId={lid(`card-title-${proj.name}`)}
                  transition={SPRING}
                  style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: SF, margin: 0, lineHeight: 1.25 }}
                >
                  {proj.name}
                </motion.h2>
                <motion.span
                  initial={isMobile ? false : { opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={isMobile ? { duration: 0 } : { delay: 0.15 }}
                  style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: SF }}
                >
                  Created: {proj.year}
                </motion.span>
              </div>

              <button
                ref={closeBtnRef}
                onClick={onClose}
                aria-label="Close"
                style={{
                  flexShrink: 0,
                  width: 30, height: 30, borderRadius: "50%",
                  background: "var(--bg-secondary)", border: "1px solid var(--border)",
                  color: "var(--text-secondary)", display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>

            {/* Description */}
            <motion.p
              layoutId={lid(`card-description-${proj.name}`)}
              transition={SPRING}
              style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.625, margin: 0, fontFamily: SF }}
            >
              {proj.description}
            </motion.p>

            {/* Features — only shown in the expanded view, staggered in
                one line after another so the modal doesn't just feel like
                a bigger version of the card. */}
            {proj.features?.length > 0 && (
              <motion.div
                initial={isMobile ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={isMobile ? { duration: 0 } : { delay: 0.18, duration: 0.3 }}
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: SF }}>
                  Features
                </span>
                <ul style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
                  {proj.features.map((feature, i) => (
                    <motion.li
                      key={i}
                      initial={isMobile ? false : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={isMobile ? { duration: 0 } : { delay: 0.22 + i * 0.035 }}
                      style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, fontFamily: SF }}
                    >
                      <span style={{ color: proj.accent, marginTop: 1 }}>•</span>
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
          </div>
        </motion.div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}