"use client";
import { useRef, useCallback, useState, useEffect } from "react";
import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
import { useReveal } from "./useReveal";
import { playIOSUnlockSound, playTickSound } from "../lib/soundcn/sounds";
import { SectionTitleIcon } from "./SectionIcon";
import { PROJECTS } from "@/lib/projects-data";
import { ProjectsGrid } from "./ProjectsGrid";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// Only the first 4 projects show on the homepage — the rest live on
// the /projects page behind the "View more" link below.
const FEATURED_COUNT = 4;

// The slide-to-unlock gate is a mobile/tablet-only affordance. Above this
// width the grid is always shown unlocked, with no gate at all.
const DESKTOP_QUERY = "(min-width: 1025px)";

/* Unlock control */
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

export function ProjectsSection() {
  const { ref: revealRef, revealClass, visible } = useReveal();
  const [unlocked, setUnlocked] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionNodeRef = useRef<HTMLDivElement>(null);

  const setRefs = useCallback((node: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    (sectionNodeRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
  }, [revealRef]);

  // Desktop/laptop viewports skip the unlock gate entirely — mobile and
  // tablet keep it. Checked via matchMedia so it also reacts to resizing
  // across the breakpoint, not just the viewport at first load.
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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

  const gateOpen = isDesktop || unlocked;
  const featured = PROJECTS.slice(0, FEATURED_COUNT);

  return (
    <div id="projects" ref={setRefs} className={revealClass}>
      <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
        <div className="proj-inner" style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "0 20px 60px" }}>
          <div style={{ paddingTop: 50, marginBottom: 4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
              <SectionTitleIcon type="box" />
              Projects
            </span>
          </div>

          {!isDesktop && (
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
          )}

          <div style={{ height: 1, background: "var(--border)", margin: gateOpen ? "20px 0 20px" : "14px 0 20px", transition: "margin 0.3s ease" }} />

          <style suppressHydrationWarning>{`
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

          <div className={`proj-grid-wrap${gateOpen ? " unlocked" : ""}`}>
            <ProjectsGrid projects={featured} visible={visible} />
          </div>

          {PROJECTS.length > FEATURED_COUNT && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
              <Link
                href="/projects"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "10px 22px", borderRadius: 9,
                  border: "1px solid var(--border)", background: "transparent",
                  color: "var(--text-secondary)", fontFamily: SF, fontSize: 13, fontWeight: 600,
                  textDecoration: "none", transition: "color 0.15s, border-color 0.15s, background 0.15s, transform 0.15s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-primary)"; el.style.borderColor = "var(--text-muted)"; el.style.background = "var(--bg-hover)"; el.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-secondary)"; el.style.borderColor = "var(--border)"; el.style.background = "transparent"; el.style.transform = "none"; }}
              >
                View More
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
