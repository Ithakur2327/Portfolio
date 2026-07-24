"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";

/* ════════════════════════════════════════════════════════════
   Magnetic — subtle cursor-attraction wrapper.
   Ported from the reference portfolio's Magnetic component;
   tracks the pointer globally and nudges its child toward it
   within `range`, eased back with a spring on release.
═══════════════════════════════════════════════════════════ */
const MAGNETIC_SPRING: SpringOptions = { stiffness: 150, damping: 15, mass: 0.15 };

export function Magnetic({
  children,
  intensity = 0.25,
  range = 100,
}: {
  children: React.ReactNode;
  intensity?: number;
  range?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, MAGNETIC_SPRING);
  const springY = useSpring(y, MAGNETIC_SPRING);

  useEffect(() => {
    let raf: number | null = null;
    const onMove = (e: MouseEvent) => {
      if (raf !== null) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist <= range) {
          const scale = 1 - dist / range;
          x.set(dx * intensity * scale);
          y.set(dy * intensity * scale);
        } else {
          x.set(0);
          y.set(0);
        }
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, [intensity, range, x, y]);

  return (
    <motion.div ref={ref} style={{ x: springX, y: springY, display: "inline-flex" }}>
      {children}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════
   LiquidButton — outline button whose background "fills in"
   from the bottom on hover (CSS custom-property + background-
   position trick), same technique as the reference portfolio.
═══════════════════════════════════════════════════════════ */
export function LiquidButton({
  children,
  onClick,
  fillColor,
  baseColor,
  borderColor,
  textColor,
  hoverTextColor,
  delay = "0.32s",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  fillColor: string;
  baseColor: string;
  borderColor: string;
  textColor: string;
  hoverTextColor: string;
  delay?: string;
}) {
  const seconds = parseFloat(delay);
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="hero-liquid-btn"
      whileTap={{ scale: 0.96 }}
      whileHover={{
        scale: 1.035,
        color: hoverTextColor,
        "--fill-w": "100%",
        "--fill-h": "100%",
        "--fill-delay": delay,
        transition: {
          "--fill-w": { duration: 0 },
          "--fill-h": { duration: 0 },
          "--fill-delay": { duration: 0 },
          color: { duration: seconds, delay: seconds },
        },
      }}
      style={
        {
          "--fill-w": "-1%",
          "--fill-h": "3px",
          "--fill-delay": "0s",
          background: `linear-gradient(${fillColor} 0 0) no-repeat calc(200% - var(--fill-w, -1%)) 100% / 200% var(--fill-h, 3px)`,
          backgroundColor: baseColor,
          borderColor,
          color: textColor,
          transition: `background ${delay} var(--fill-delay, 0s), background-position ${delay} calc(${delay} - var(--fill-delay, 0s)), border-color 0.2s ease`,
        } as React.CSSProperties
      }
    >
      {children}
    </motion.button>
  );
}

/* ── Icons (kept visually consistent with icons already used elsewhere
   in the portfolio — the info-box "Resume" row and the Contact page) ── */
function ResumeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
      <polyline points="14 2 14 7 19 7" />
      <circle cx="9" cy="13.5" r="2" />
      <path d="M5.5 20a3.5 3.5 0 0 1 7 0" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* Cleaner, more premium arrow — used only by the Hero's "Get in touch"
   button in place of the paper-plane SendIcon used elsewhere on the site. */
function ArrowUpRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

export { SendIcon, ResumeIcon };

/* ════════════════════════════════════════════════════════════
   SolidMagneticButton — solid, magnetically-pulled button.
   Self-contained (ships its own styles), so it renders correctly
   anywhere it's used: Hero, Footer, or the standalone Contact page.
═══════════════════════════════════════════════════════════ */
export function SolidMagneticButton({
  as = "button",
  href,
  onClick,
  type = "button",
  children,
  className = "",
}: {
  as?: "button" | "a";
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  children: React.ReactNode;
  className?: string;
}) {
  const inner = (
    <Magnetic intensity={0.12} range={200}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        {children}
      </span>
    </Magnetic>
  );

  return (
    <>
      <style suppressHydrationWarning>{`
        .hero-contact-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 40px;
          padding: 0 20px;
          border-radius: 10px;
          border: none;
          background: var(--text-primary);
          color: var(--bg-base);
          font-family: 'Geist Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          white-space: nowrap;
          cursor: pointer;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .hero-contact-btn:hover  { opacity: 0.82; }
        .hero-contact-btn:active { transform: scale(0.97); }
        .hero-contact-btn:disabled { cursor: default; opacity: 0.55; }

        @media (max-width: 600px) {
          .hero-contact-btn { height: 38px; padding: 0 16px; font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-contact-btn { transition: none; }
        }
      `}</style>

      <Magnetic intensity={0.2} range={100}>
        {as === "a" ? (
          <a href={href} className={`hero-contact-btn ${className}`}>{inner}</a>
        ) : (
          <button type={type} onClick={onClick} className={`hero-contact-btn ${className}`}>{inner}</button>
        )}
      </Magnetic>
    </>
  );
}

/* ════════════════════════════════════════════════════════════
   HeroActionButtons — Resume (liquid-fill) + Contact (magnetic)
═══════════════════════════════════════════════════════════ */
export function HeroActionButtons({
  onResumeClick,
  contactHref = "/contact",
}: {
  onResumeClick: () => void;
  contactHref?: string;
}) {
  return (
    <>
      <style suppressHydrationWarning>{`
        .hero-actions {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-wrap: wrap;
        }
        .hero-liquid-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          height: 38px;
          padding: 0 16px;
          border-radius: 10px;
          border: 1px solid var(--border);
          font-family: 'Geist Mono', monospace;
          font-size: 12.5px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }
        .hero-liquid-btn svg { flex-shrink: 0; }

        /* Get in touch — matched to the Resume button's slightly smaller size.
           Scoped to .hero-actions so the shared .hero-contact-btn used by the
           Footer and Contact page keeps its own (larger) size. */
        .hero-actions .hero-contact-btn {
          height: 38px !important;
          padding: 0 16px !important;
          font-size: 12.5px !important;
        }

        @media (max-width: 600px) {
          .hero-liquid-btn { height: 38px; padding: 0 16px; font-size: 12.5px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-liquid-btn { transition: none; }
        }
      `}</style>

      <div className="hero-actions">
        <LiquidButton
          onClick={onResumeClick}
          fillColor="var(--text-primary)"
          baseColor="var(--bg-secondary)"
          borderColor="var(--border)"
          textColor="var(--text-primary)"
          hoverTextColor="var(--bg-base)"
        >
          <ResumeIcon />
          Resume
        </LiquidButton>

        <SolidMagneticButton as="a" href={contactHref}>
          <ArrowUpRightIcon />
          Get in touch
        </SolidMagneticButton>
      </div>
    </>
  );
}