"use client";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import type { Project } from "@/lib/projects-data";
import { TECH_MAP } from "@/lib/projects-data";
import { useTheme } from "./ThemeProvider";
import { mq } from "@/lib/breakpoints";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

function techLogoSrc(tech: { logo: string; logoLight?: string }, isDark: boolean) {
  return !isDark && tech.logoLight ? tech.logoLight : tech.logo;
}

const SPRING = { type: "spring" as const, stiffness: 240, damping: 32, mass: 0.85 };
const HOVER_SPRING = { type: "spring" as const, stiffness: 300, damping: 28, mass: 0.6 };
const TAP_SPRING = { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.5 };


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



export function ProjectCard({ proj, index, visible, isDesktop, isHidden, onOpen, imageSizes }: {
  proj: Project;
  index: number;
  visible: boolean;
  isDesktop: boolean;
  isHidden?: boolean;
  onOpen: () => void;
  imageSizes?: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { amount: 0.6 });
  const [hovered, setHovered] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (isHidden) setHovered(false);
  }, [isHidden]);

  const shown = isDesktop ? hovered : inView;

  const cid = (id: string) => (isDesktop ? id : undefined);

  if (isHidden) {
    return (
      <div aria-hidden="true" style={{ width: "100%", visibility: "hidden" }}>
        <div style={{ width: "100%", padding: 2, borderRadius: 14, boxSizing: "border-box" }}>
          <div style={{ width: "100%", aspectRatio: "16 / 9", borderRadius: 12 }} />
        </div>
        <div style={{ width: "100%", padding: "12px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ height: 20 }} />
          <div style={{ height: 60 }} />
          <div style={{ height: 46 }} />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 20 }}
      transition={{ delay: visible ? 0.055 * index : 0, type: "spring", stiffness: 190, damping: 30, mass: 0.9 }}
      layoutId={cid(`card-container-${proj.name}`)}
      style={{ position: "relative", width: "100%" }}
    >
      <motion.div
        onClick={onOpen}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={isDesktop ? { scale: 1.02, transition: HOVER_SPRING } : undefined}
        whileTap={{ scale: 0.98, transition: TAP_SPRING }}
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          cursor: "pointer",
          overflow: "hidden",
          borderRadius: 14,
          willChange: "transform",
          WebkitTapHighlightColor: "transparent",
          touchAction: "manipulation",
        }}
      >
      <div
        style={{
          width: "100%",
         padding: 2,
         borderRadius: 14,
        border: `1px dashed ${
        index % 2 === 0 ? "rgba(10,186,181,0.55)" : "rgba(212,175,55,0.55)" }`,
          boxSizing: "border-box",
        }}
      >
        <motion.div
          ref={frameRef}
          layoutId={cid(`card-banner-${proj.name}`)}
          transition={SPRING}
          style={{
            width: "100%", aspectRatio: "16 / 9", borderRadius: 12,
            position: "relative", overflow: "hidden",
            background: isDark ? "#121212" : "rgba(0,0,0,0.05)",
            border: "1px solid var(--border)",
          }}
        >
          <motion.div
            initial={false}
            animate={shown ? { scale: 1, y: 0 } : { scale: 0.8, y: "10%" }}
            transition={isDesktop
              ? { type: "spring", stiffness: 150, damping: 22, mass: 0.85 }
              : { type: "tween", duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "absolute", inset: 0, transformOrigin: "50% 100%", willChange: "transform" }}
          >
            <motion.div
              initial={false}
              animate={shown ? { rotate: 0, borderRadius: 10 } : { rotate: -7, borderRadius: 6 }}
              transition={isDesktop
                ? { type: "spring", stiffness: 150, damping: 22, mass: 0.85 }
                : { type: "tween", duration: 0.52, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "absolute", inset: 0, overflow: "hidden",
                boxShadow: "0 16px 30px -12px rgba(0,0,0,0.4)",
                willChange: "transform",
              }}
            >
              <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                <Image
                  src={proj.img}
                  alt={proj.name}
                  fill
                  quality={88}
                  sizes={imageSizes ?? "(max-width: 599px) 94vw, min(48vw, 438px)"}
                  unoptimized={proj.img.endsWith(".svg")}
                  style={{ objectFit: "cover" }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <div style={{ width: "100%", padding: "12px 8px", display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span
            style={{ fontSize: 20, fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em", fontFamily: SF, lineHeight: 1.3 }}
          >
            {proj.name}
          </span>
          <div
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
          </div>
        </div>

        <p
          style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.5, margin: 0, fontFamily: SF, textAlign: "left", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {proj.description}
        </p>

        <div
          style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: SF }}>
            Stack
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
            {proj.tags.slice(0, 3).map(tag => {
              const tech = TECH_MAP[tag];
              if (!tech) return null;
              return (
                <div key={tag} title={tag} style={{ display: "flex" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- tiny external SVG icon */}
                  <img
                    src={techLogoSrc(tech, isDark)}
                    alt={tag}
                    width={24}
                    height={24}
                    decoding="async"
                    style={{ objectFit: "contain", display: "block" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </motion.div>

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

export function ProjectModal({ proj, index, onClose, isDesktop }: { proj: Project; index: number; onClose: () => void; isDesktop: boolean }) {
  const dashColor = index % 2 === 0 ? "rgba(10,186,181,0.55)" : "rgba(212,175,55,0.55)";
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const sheet = !isDesktop;
  const shellTransition = sheet
    ? { type: "spring" as const, stiffness: 280, damping: 30, mass: 0.85 }
    : { type: "spring" as const, stiffness: 260, damping: 30, mass: 0.85 };
  const shellInitial = sheet
    ? { opacity: 0, y: "100%", scale: 0.97 }
    : { opacity: 0, y: 16, scale: 0.95 };
  const shellAnimate = sheet
    ? { opacity: 1, y: "0%", scale: 1 }
    : { opacity: 1, y: 0, scale: 1 };

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    const cat = document.getElementById("oneko");
    if (cat) cat.style.display = "none";

    const previouslyFocused = document.activeElement as HTMLElement | null;

    let focusTimer: ReturnType<typeof setTimeout>;
    const raf = requestAnimationFrame(() => {
      focusTimer = setTimeout(() => closeBtnRef.current?.focus(), 50);
    });

    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };

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

  const imageBlock = (
    <div className="pm-image-border" style={sheet ? { position: "sticky", top: 0, zIndex: 2 } : undefined}>
      <div className="pm-image-frame" style={{ position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <Image
            src={proj.img}
            alt={proj.name}
            fill
            quality={88}
            sizes="(max-width: 767px) 100vw, min(45vw, 432px)"
            unoptimized={proj.img.endsWith(".svg")}
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );

  const linksAndStackBlock = (
    <div className="pm-media-links">
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <ProjectLinks proj={proj} size={22} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: SF }}>
          Stack
        </span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {proj.tags.map(tag => {
            const tech = TECH_MAP[tag];
            return (
              <span
                key={tag}
                className="pm-tag"
                style={{ color: "var(--tag-text)", background: "var(--tag-bg)", border: "1px solid var(--tag-border)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- tiny external SVG icon */}
                {tech && <img src={techLogoSrc(tech, isDark)} alt={tag} width={15} height={15} decoding="async" style={{ objectFit: "contain", flexShrink: 0 }} />}
                {tag}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );

  const infoBlock = (
    <div className="pm-info-col" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <h2
            style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em", fontFamily: SF, margin: 0, lineHeight: 1.25 }}
          >
            {proj.name}
          </h2>
          <span style={{ fontSize: 14, color: "var(--text-muted)", fontFamily: SF }}>
            Created: {proj.year}
          </span>
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

      <p
        style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.625, margin: 0, fontFamily: SF }}
      >
        {proj.description}
      </p>

      {proj.features?.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: SF }}>
            Features
          </span>
          <ul style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
            {proj.features.map((feature, i) => (
              <li
                key={i}
                style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.55, fontFamily: SF }}
              >
                <span style={{ color: proj.accent, marginTop: 1 }}>•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const content = (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.15 } }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
        onClick={onClose}
        className="pm-overlay"
        style={{
          position: "fixed", inset: 0, zIndex: 9000,
          background: "rgba(0,0,0,0.55)",
          willChange: "opacity",
        }}
      />

      <div style={{ position: "fixed", inset: 0, zIndex: 9001, display: "grid", alignItems: sheet ? "end" : "center", justifyItems: sheet ? "stretch" : "center", padding: sheet ? 0 : 16, pointerEvents: "none" }}>
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${proj.name} project details`}
          initial={shellInitial}
          animate={shellAnimate}
          exit={shellInitial}
          transition={shellTransition}
          className="pm-shell"
          style={{
            pointerEvents: "auto",
            width: "100%", maxWidth: 960,
            cursor: "default",
            borderRadius: sheet ? "16px 16px 0 0" : 16,
            boxShadow: "0 12px 28px -8px rgba(0,0,0,0.45)",
            overflow: "hidden",
            willChange: "transform, opacity",
            transform: "translateZ(0)",
          }}
        >
          <style suppressHydrationWarning>{`
            .pm-overlay {
              contain: strict;
              will-change: opacity;
            }
            /* Blur is compositor-heavy and is the main source of jank during
               the bottom-sheet open animation on phones/tablets, so it's
               skipped there and only enabled from laptop width up. */
            ${mq.laptopUp} {
              .pm-overlay {
                backdrop-filter: blur(6px);
                -webkit-backdrop-filter: blur(6px);
              }
            }

            .pm-shell {
              display: flex;
              flex-direction: column;
              max-height: 92vh;
              contain: layout paint;
              background: var(--modal-glass-bg);
              border: 1px solid var(--modal-glass-border);
              backdrop-filter: blur(14px) saturate(160%);
              -webkit-backdrop-filter: blur(14px) saturate(160%);
            }
            ${mq.laptopUp} {
              .pm-shell { max-height: 82vh; }
            }

            /* Body is a plain, non-layout-animated div that actually scrolls */
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
            .pm-media-col {
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .pm-sheet-scroll {
              display: flex;
              flex-direction: column;
            }
            .pm-media-links {
              display: flex;
              flex-direction: column;
              gap: 12px;
              padding: 16px 20px 20px;
            }
            .pm-image-border {
              width: 100%;
              padding: 2px;
              border-radius: 14px;
              border: 1px dashed ${dashColor};
              box-sizing: border-box;
              overflow: hidden;
              flex-shrink: 0;
              background: var(--bg-card);
            }
            .pm-image-frame {
              width: 100%;
              aspect-ratio: 16 / 9;
              z-index: 2;
              overflow: hidden;
              border-radius: 12px;
              flex-shrink: 0;
              background: var(--bg-card);
            }

            /* Desktop/laptop: horizontal split — media left, info right */
            ${mq.laptopUp} {
              .pm-body { flex-direction: row; }
              .pm-media-col {
                width: 45%; flex-shrink: 0;
                gap: 14px;
                padding: 24px; border-right: 1px solid var(--border);
                overflow-y: auto; scrollbar-width: none;
              }
              .pm-media-col::-webkit-scrollbar { display: none; }
              .pm-media-links { padding: 0; }
              .pm-info-col {
                flex: 1; min-width: 0;
                padding: 24px; overflow-y: auto; scrollbar-width: none;
                display: flex; flex-direction: column; gap: 16px;
              }
              .pm-info-col::-webkit-scrollbar { display: none; }
              .pm-image-frame {
                border-radius: 9px;
              }
            }
          `}</style>

          <div className="pm-body">
          {sheet ? (
            <>
              {imageBlock}
              <div className="pm-sheet-scroll">
                {linksAndStackBlock}
                {infoBlock}
              </div>
            </>
          ) : (
            <>
              <div className="pm-media-col">
                {imageBlock}
                {linksAndStackBlock}
              </div>
              {infoBlock}
            </>
          )}
          </div>
        </motion.div>
      </div>
    </>
  );

  return createPortal(content, document.body);
}