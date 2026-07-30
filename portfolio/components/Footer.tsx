"use client";
import React from "react";
import { useTheme } from "./ThemeProvider";
import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";
import { SocialRow } from "./ui/SocialRow";
import { BP, mq as MQ } from "@/lib/breakpoints";
import { useIsMobile } from "@/lib/useBreakpoint";

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

  const triggerFill = (relX: number) => {
    mouseXRaw.jump(relX * VW);
    animate(hollowOpacity, 0, { duration: 0.22, ease: "easeOut" });
    animate(fillOpacity,   1, { duration: 0.22, ease: "easeOut" });
    animate(sweepOpacity,  1, { duration: 0.22, ease: "easeOut" });
  };
  const triggerDrain = () => {
    animate(sweepOpacity,  0, { duration: 0.30, ease: [0.4, 0, 1, 1] });
    animate(fillOpacity,   0, { duration: 0.60, ease: [0.4, 0, 1, 1] });
    animate(hollowOpacity, 1, { duration: 0.60, ease: "easeIn", delay: 0.12 });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    triggerFill((e.clientX - r.left) / r.width);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mouseXRaw.set(((e.clientX - r.left) / r.width) * VW);
  };
  const handleMouseLeave = () => triggerDrain();

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
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

  const strokeColor  = isDark ? "#00c8a8" : "#7c3aed";

  const baseStops = isDark
    ? [{ o: "0%", c: "#002e28" }, { o: "45%", c: "#007a65" }, { o: "100%", c: "#00e8c6" }]
    : [{ o: "0%", c: "#1e0345" }, { o: "45%", c: "#5b21b6" }, { o: "100%", c: "#a855f7" }];

  const brightColor  = isDark ? "#00ffda" : "#e879f9";
  const crystalEdge  = isDark ? "#ccfff7" : "#fae8ff";
  const midColor     = isDark ? "#00b89c" : "#7c3aed";
  const dimColor     = isDark ? "#001a14" : "#1e0345";

  const spread = VW * 0.26;
  const gx1 = useTransform(mouseX, v => v - spread);
  const gx2 = useTransform(mouseX, v => v + spread);

  const tl = VW * 0.945;

  const isMobile = useIsMobile();

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
          <linearGradient id="fgt_base" x1="0" y1={VH} x2="0" y2="0" gradientUnits="userSpaceOnUse">
            {baseStops.map((s, i) => <stop key={i} offset={s.o} stopColor={s.c} />)}
          </linearGradient>

          <linearGradient id="fgt_crystal" x1="0" y1="0" x2={VW * 0.18} y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor={crystalEdge} stopOpacity="0.55" />
            <stop offset="18%"  stopColor={brightColor}  stopOpacity="0.28" />
            <stop offset="55%"  stopColor={midColor}     stopOpacity="0.08" />
            <stop offset="100%" stopColor={dimColor}      stopOpacity="0" />
          </linearGradient>

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

      <div className="fgt-line" />
    </div>
  );
}

// Footer section
export function Footer() {
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

        /* Copyright (left) + social icons (right) share one row on
           laptop/desktop. Below navCollapse (mobile + tablet) they stack
           with icons on top and copyright underneath — see override below. */
        .footer-bottom-band {
          max-width: var(--content-width);
          margin: 0 auto;
          padding: 34px 32px 12px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          flex-wrap: wrap;
          row-gap: 12px;
        }
        .footer-copy {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: ${MONO};
        }
        .footer-full-line {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          height: 1px;
          background: var(--border);
        }

        /* ── Big pixel text ── */
        .fgt-outer {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          margin-top: clamp(2px, 0.6vw, 8px);
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

        @media (max-width: ${BP.footerCompactMax}px) {
          .footer-bottom-band  { padding: 28px 22px 10px; gap: 16px; }
        }

        /* Mobile + tablet: stack instead of a side-by-side row. Icons stay
           in DOM-first position for the desktop row, so flip the visual
           order here rather than reordering the JSX. */
        ${MQ.navCollapse} {
          .footer-bottom-band {
            flex-direction: column-reverse;
            justify-content: center;
            padding: 26px 16px 10px;
            gap: 12px;
          }
        }
        ${MQ.mobile} {
          .footer-bottom-band { padding: 22px 13px 10px; }
        }

        /* PC / laptop only — cap "IThakur.Dev" to a fixed width instead of
           full 100vw (intentionally wider than --content-width; it's a
           decorative banner, not body content). Mobile and tablet keep
           the existing full-bleed size. */
        @media (min-width: ${BP.laptopMin}px) {
          .fgt-outer {
            position: static;
            left: auto;
            width: 100%;
            max-width: 1140px;
            margin-top: clamp(2px, 0.5vw, 6px);
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
          .footer-bottom-band { padding: 38px 32px 14px; }
        }
      `}</style>

      <footer id="site-footer-root" className="footer-root">
        <div className="footer-bottom-band">
          <span className="footer-copy">© {year} Indresh Thakur. All rights reserved.</span>
          <SocialRow size={22} gap={16} bright thinBorder boostSize={1.15} />
        </div>

        <div className="footer-full-line" />

        <FluidGradientText text="IThakur.Dev" />
      </footer>
    </>
  );
}