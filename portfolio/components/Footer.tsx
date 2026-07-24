"use client";
import React from "react";
import { useTheme } from "./ThemeProvider";
import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";
import { SocialRow } from "./ui/SocialRow";
import { SolidMagneticButton, SendIcon } from "./HeroActionButtons";

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

export function Footer() {
  // Computing the year directly during render would bake the build-time
  // year into this statically-prerendered page, which can mismatch the
  // client's actual year right around a New Year rollover. Render a fixed
  // value on the first (server-matching) pass, then correct it after mount.
  const [year, setYear] = React.useState(2026);
  React.useEffect(() => { setYear(new Date().getFullYear()); }, []);

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

        .footer-cta-band {
          max-width: var(--content-width);
          margin: 0 auto;
          padding: 28px 32px 22px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .footer-bottom-band {
          max-width: var(--content-width);
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
        .footer-copy {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: ${MONO};
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
          .footer-cta-band     { padding: 20px 16px 16px; }
          .footer-bottom-band  { padding: 12px 16px; flex-direction: column; gap: 10px; }
        }

        /* PC / laptop only — cap "IThakur.Dev" to a fixed width instead of
           full 100vw (intentionally wider than --content-width; it's a
           decorative banner, not body content). Mobile and tablet keep
           the existing full-bleed size. */
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
        <div className="footer-cta-band">
          <SolidMagneticButton as="a" href="/contact">
            <SendIcon />
            Get in Touch
          </SolidMagneticButton>
        </div>

        <div className="footer-bottom-band">
          <span className="footer-copy">© {year} Indresh Thakur. All rights reserved.</span>
          <SocialRow size={16} gap={12} />
        </div>

        <FluidGradientText text="IThakur.Dev" />
      </footer>
    </>
  );
}