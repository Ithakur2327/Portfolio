"use client";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";
import { mq } from "@/lib/breakpoints";

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

function ResumeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2.5" />
      <circle cx="8" cy="10.5" r="2" />
      <path d="M5 16c0-1.66 1.34-3 3-3s3 1.34 3 3" />
      <line x1="13.5" y1="8.5" x2="19" y2="8.5" />
      <line x1="13.5" y1="12" x2="19" y2="12" />
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

function ArrowUpRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 16c3.2-6.4 7.6-9.6 13-10.6" />
      <polyline points="11 5 18 5.4 17.4 12.4" />
    </svg>
  );
}

export { SendIcon, ResumeIcon, ArrowUpRightIcon };

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

        ${mq.mobile} {
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
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          column-gap: var(--info-col-gap, 14px);
          align-items: center;
          justify-items: start;
        }
        .hero-actions > *:first-child { margin-left: var(--info-pad-l, 0px); }
        .hero-actions > *:last-child  { margin-left: var(--info-pad-r, 0px); }

        .hero-resume-group {
          display: inline-flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .hero-liquid-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          height: 38px;
          width: 160px;
          padding: 0 16px;
          border-radius: 10px;
          border: 1px solid var(--border);
          font-family: 'Geist Mono', monospace;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
        }

        .hero-actions .hero-contact-btn {
          height: 38px !important;
          width: 160px !important;
          min-width: 0 !important;
          justify-content: center !important;
          padding: 0 16px !important;
          font-size: 15px !important;
          background: var(--bg-secondary) !important;
          backdrop-filter: blur(14px) saturate(160%) !important;
          -webkit-backdrop-filter: blur(14px) saturate(160%) !important;
          border: 1px solid var(--border) !important;
          color: var(--text-primary) !important;
        }

        ${mq.mobile} {
          .hero-liquid-btn { height: 38px; padding: 0 16px; font-size: 12.5px; width: 100%; }
          .hero-actions {
            display: grid !important;
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) !important;
            justify-items: stretch !important;
          }
          .hero-actions > *:first-child,
          .hero-actions > *:last-child {
            margin-left: 0 !important;
          }
          .hero-resume-group { width: 100% !important; }
          .hero-actions .hero-contact-btn {
            width: 100% !important;
            min-width: 0 !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-liquid-btn { transition: none; }
        }
      `}</style>

      <div className="hero-actions">
        <div className="hero-resume-group">
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
        </div>

        <SolidMagneticButton as="a" href={contactHref}>
          Get in touch
          <ArrowUpRightIcon />
        </SolidMagneticButton>
      </div>
    </>
  );
}