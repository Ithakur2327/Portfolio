"use client";
import React from "react";
import { useTheme } from "./ThemeProvider";
import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";

const MONO = "'Geist Mono', monospace";

const VW = 3840, VH = 600, FONT_SIZE = 386;

function FluidGradientText({ text }: { text: string }) {
  const mouseXRaw = useMotionValue(VW / 2);
  const mouseX    = useSpring(mouseXRaw, { stiffness: 200, damping: 30, mass: 0.35 });

  const hollowOpacity = useMotionValue(1);
  const fillOpacity   = useMotionValue(0);
  const sweepOpacity  = useMotionValue(0);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Shared fill logic
  const triggerFill = (relX: number) => {
    mouseXRaw.jump(relX * VW);
    animate(hollowOpacity, 0, { duration: 0.22, ease: "easeOut" });
    animate(fillOpacity,   1, { duration: 0.22, ease: "easeOut" });
    animate(sweepOpacity,  1, { duration: 0.22, ease: "easeOut" });
  };
  const triggerDrain = () => {
    // Drain the fill smoothly
    animate(sweepOpacity,  0, { duration: 0.30, ease: [0.4, 0, 1, 1] });
    animate(fillOpacity,   0, { duration: 0.60, ease: [0.4, 0, 1, 1] });
    animate(hollowOpacity, 1, { duration: 0.60, ease: "easeIn", delay: 0.12 });
  };

  // Mouse interactions
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    triggerFill((e.clientX - r.left) / r.width);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseXRaw.set(((e.clientX - r.left) / r.width) * VW);
  };
  const handleMouseLeave = () => triggerDrain();

  // Touch interactions
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault(); // stops browser text-selection on long-press
    const r = e.currentTarget.getBoundingClientRect();
    const t = e.touches[0];
    triggerFill((t.clientX - r.left) / r.width);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const t = e.touches[0];
    mouseXRaw.set(((t.clientX - r.left) / r.width) * VW);
  };
  const handleTouchEnd = () => triggerDrain();

  // Theme colors
  const strokeColor  = isDark ? "#00c8a8" : "#7c3aed";

  // Dark: exact same stop structure as light (0%, 45%, 100%) just teal instead of purple
  const baseStops = isDark
    ? [{ o: "0%", c: "#002e28" }, { o: "45%", c: "#007a65" }, { o: "100%", c: "#00e8c6" }]
    : [{ o: "0%", c: "#1e0345" }, { o: "45%", c: "#5b21b6" }, { o: "100%", c: "#a855f7" }];

  // Exact teal equivalents of purple sweep colors
  const brightColor  = isDark ? "#00ffda" : "#e879f9";  // teal ↔ fuchsia bright
  const crystalEdge  = isDark ? "#ccfff7" : "#fae8ff";  // near-white teal ↔ near-white purple
  const midColor     = isDark ? "#00b89c" : "#7c3aed";  // mid teal ↔ mid purple
  const dimColor     = isDark ? "#001a14" : "#1e0345";  // near-black teal ↔ near-black purple

  const spread = VW * 0.26;
  const gx1 = useTransform(mouseX, v => v - spread);
  const gx2 = useTransform(mouseX, v => v + spread);

  const tl = VW * 0.945;

  // Stretch the art to fill the box on small screens.
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div
      className="fgt-outer"
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <svg
        className="fgt-svg"
        viewBox={`0 0 ${VW} ${VH}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio={isMobile ? "none" : "xMidYMid meet"}
        aria-hidden="true"
      >
        <defs>
          {/* Base fill — bottom bright → top dark (water fill) */}
          <linearGradient id="fgt_base" x1="0" y1={VH} x2="0" y2="0" gradientUnits="userSpaceOnUse">
            {baseStops.map((s, i) => <stop key={i} offset={s.o} stopColor={s.c} />)}
          </linearGradient>

          {/* Crystal left-edge shine — fixed, sharpest at x=0 fades rightward */}
          <linearGradient id="fgt_crystal" x1="0" y1="0" x2={VW * 0.18} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={crystalEdge} stopOpacity="0.55" />
            <stop offset="18%"  stopColor={brightColor}  stopOpacity="0.28" />
            <stop offset="55%"  stopColor={midColor}     stopOpacity="0.08" />
            <stop offset="100%" stopColor={dimColor}      stopOpacity="0" />
          </linearGradient>

          {/* Sweep highlight — centered on mouse, horizontal */}
          <motion.linearGradient
            id="fgt_sweep"
            x1={gx1} y1="0"
            x2={gx2} y2="0"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%"   stopColor={dimColor}     stopOpacity="0" />
            <stop offset="30%"  stopColor={midColor}     stopOpacity="0.3" />
            <stop offset="48%"  stopColor={brightColor}  stopOpacity="0.55" />
            <stop offset="50%"  stopColor={crystalEdge}  stopOpacity="0.65" />
            <stop offset="52%"  stopColor={brightColor}  stopOpacity="0.55" />
            <stop offset="70%"  stopColor={midColor}     stopOpacity="0.3" />
            <stop offset="100%" stopColor={dimColor}      stopOpacity="0" />
          </motion.linearGradient>
        </defs>

        {/* Layer 1 — hollow outline (resting) */}
        <motion.text
          x="50%" y={VH}
          textAnchor="middle" dominantBaseline="auto"
          fill="none"
          stroke={strokeColor}
          strokeWidth="3"
          opacity={hollowOpacity}
          textLength={tl}
          lengthAdjust="spacingAndGlyphs"
          className="fgt-text"
        >
          {text}
        </motion.text>

        {/* Layer 2 — base fill (hover) — water body */}
        <motion.text
          x="50%" y={VH}
          textAnchor="middle" dominantBaseline="auto"
          fill="url(#fgt_base)"
          stroke="none"
          opacity={fillOpacity}
          textLength={tl}
          lengthAdjust="spacingAndGlyphs"
          className="fgt-text"
        >
          {text}
        </motion.text>

        {/* Layer 3 — crystal left-edge shine */}
        <motion.text
          x="50%" y={VH}
          textAnchor="middle" dominantBaseline="auto"
          fill="url(#fgt_crystal)"
          stroke="none"
          opacity={sweepOpacity}
          textLength={tl}
          lengthAdjust="spacingAndGlyphs"
          className="fgt-text"
        >
          {text}
        </motion.text>

        {/* Layer 4 — mouse sweep highlight */}
        <motion.text
          x="50%" y={VH}
          textAnchor="middle" dominantBaseline="auto"
          fill="url(#fgt_sweep)"
          stroke="none"
          opacity={sweepOpacity}
          textLength={tl}
          lengthAdjust="spacingAndGlyphs"
          className="fgt-text"
        >
          {text}
        </motion.text>
      </svg>

      {/* Line flush with SVG bottom — negative margin kills the SVG inline gap */}
      <div className="fgt-line" />
    </div>
  );
}

function SocialIcon({
  href, label, children,
}: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="footer-social-btn">
      {children}
    </a>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <style suppressHydrationWarning>{`
        @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

        .footer-root {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
          border-top: 1px solid var(--line);
          margin-top: 0;
          overflow: hidden;
        }

        .footer-bottom-band {
          max-width: 1060px;
          margin: 0 auto;
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap;
          row-gap: 12px;
        }
        .footer-socials-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: nowrap;
        }
        .footer-copy {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: ${MONO};
        }
        .footer-social-btn {
          width: 34px; height: 34px;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--bg-secondary);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          transition: background 0.14s, color 0.14s, border-color 0.14s, transform 0.14s;
          text-decoration: none;
          flex-shrink: 0;
        }
        .footer-social-btn:hover {
          background: var(--bg-hover);
          color: var(--text-primary);
          border-color: var(--text-muted);
          transform: translateY(-2px);
        }

        /* ── Big pixel text ── */
        .fgt-outer {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          margin-top: clamp(20px, 3vw, 44px);
          cursor: crosshair;
          user-select: none;
          -webkit-user-select: none;
          touch-action: none;          /* prevents scroll hijack AND text selection on mobile */
          -webkit-touch-callout: none; /* disables iOS long-press menu */
          font-size: 0;
          line-height: 0;
        }
        .fgt-svg {
          display: block;
          width: 100%;
          height: clamp(56px, 16vw, 220px);
          vertical-align: bottom;
          margin-bottom: 0;
        }
        .fgt-text {
          font-family: 'Press Start 2P', 'Courier New', monospace;
          font-size: ${FONT_SIZE}px;
          font-weight: 400;
        }
        /* Line sits flush directly below SVG */
        .fgt-line {
          display: block;
          width: 100%;
          height: 1px;
          background: var(--border);
          margin-bottom: 0;
        }
        .footer-root {
          padding-bottom: clamp(18px, 3vw, 40px);
        }

        @media (max-width: 720px) {
          .footer-bottom-band  { padding: 14px 22px; gap: 14px; }
        }
        @media (max-width: 480px) {
          .footer-bottom-band  { padding: 12px 16px; flex-direction: column; gap: 10px; }
          .footer-socials-row  { gap: 8px; }
          .footer-social-btn   { width: 38px; height: 38px; }
        }

        /* PC / laptop only — match "IThakur.Dev" width to the content column
           (same 1060px as the rest of the site) instead of full 100vw.
           Mobile and tablet keep the existing full-bleed size. */
        @media (min-width: 1025px) {
          .fgt-outer {
            position: static;
            left: auto;
            width: 100%;
            max-width: 1140px;
            margin-top: clamp(10px, 2vw, 28px);
            margin-left: auto;
            margin-right: auto;
            padding: 0 32px;
            box-sizing: border-box;
          }
          /* Bigger on desktop — same width as the content column, more
             presence height-wise. */
          .fgt-svg { height: clamp(84px, 18vw, 260px); }
          /* The divider still needs to read as full-bleed like every other
             section divider on the site, even though its parent (.fgt-outer)
             is now intentionally width-capped to match the text above it.
             It stays visually flush directly under the text either way. */
          .fgt-line {
            position: relative;
            left: 50%;
            margin-left: -50vw;
            width: 100vw;
            margin-top: -10px;
          }
          .footer-bottom-band { padding: 24px 32px 18px; }
        }
      `}</style>

      <footer id="site-footer-root" className="footer-root">
        <div className="footer-bottom-band">
          <span className="footer-copy">© {year} Indresh Thakur. All rights reserved.</span>

          <div className="footer-socials-row">
            <SocialIcon href="https://x.com/indresh_dev" label="X / Twitter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.255 5.623zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>

            <SocialIcon href="https://github.com/IndreshThakur" label="GitHub">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </SocialIcon>

            <SocialIcon href="https://linkedin.com/in/indresh-thakur" label="LinkedIn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </SocialIcon>
          </div>
        </div>

        <FluidGradientText text="IThakur.Dev" />
      </footer>
    </>
  );
}