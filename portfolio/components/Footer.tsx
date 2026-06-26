"use client";
import { useTheme } from "./ThemeProvider";
import {
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";

const MONO = "'Geist Mono', monospace";
const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

/* ── Full-width half-visible text (dark=green, light=purple) ─ */
function FluidGradientText({ text }: { text: string }) {
  const W = 1920, H = 260;
  const gradX = useMotionValue(W / 2);
  const smoothX = useSpring(gradX, { stiffness: 180, damping: 28, mass: 0.5 });
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    gradX.set(((e.clientX - rect.left) / rect.width) * W);
  };
  const handleLeave = () => gradX.set(W / 2);

  const stops = isDark
    ? [
        { offset: "0%",   color: "#052e16" },
        { offset: "40%",  color: "#16a34a" },
        { offset: "72%",  color: "#4ade80" },
        { offset: "100%", color: "#86efac" },
      ]
    : [
        { offset: "0%",   color: "#3b0764" },
        { offset: "40%",  color: "#7c3aed" },
        { offset: "72%",  color: "#a855f7" },
        { offset: "100%", color: "#d8b4fe" },
      ];

  return (
    <div
      className="fluid-text-wrap"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: "block" }}
        preserveAspectRatio="xMidYMax meet"
      >
        <defs>
          <motion.linearGradient
            id="footer_fluid_gradient"
            x1={smoothX}
            y1="0"
            x2={W / 2}
            y2={H}
            gradientUnits="userSpaceOnUse"
          >
            {stops.map((s, i) => (
              <stop key={i} offset={s.offset} stopColor={s.color} />
            ))}
          </motion.linearGradient>
        </defs>
        <text
          x="50%"
          y={H}
          textAnchor="middle"
          dominantBaseline="auto"
          fill="url(#footer_fluid_gradient)"
          textLength={W}
          lengthAdjust="spacingAndGlyphs"
          style={{
            fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
            fontSize: H,
            fontWeight: 900,
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}

/* ── Social icon buttons (like screenshot) ────────────── */
function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="footer-social-btn"
    >
      {children}
    </a>
  );
}

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();
  const avatarSrc = isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg";

  return (
    <>
      <style suppressHydrationWarning>{`
        .footer-root {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
          border-top: 1px solid var(--line);
          margin-top: 0;
        }

        /* ── Top profile band ── */
        .footer-profile-band {
          max-width: 1060px;
          margin: 0 auto;
          padding: 44px 32px 36px;
          display: flex;
          align-items: center;
          gap: 18px;
          border-bottom: 1px solid var(--border);
        }
        .footer-avatar {
          width: 54px; height: 54px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--border);
          flex-shrink: 0;
          box-shadow: 0 2px 10px rgba(0,0,0,0.22);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .footer-avatar:hover {
          box-shadow: 0 4px 18px rgba(0,0,0,0.32);
          border-color: var(--text-muted);
        }
        .footer-avatar img {
          width: 100%; height: 100%;
          object-fit: cover; border-radius: 50%;
        }
        .footer-profile-info { flex: 1; min-width: 0; }
        .footer-profile-name {
          font-family: ${SF};
          font-weight: 700;
          font-size: 15px;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 3px;
        }
        .footer-profile-desc {
          font-size: 12px;
          color: var(--text-muted);
          font-family: ${SF};
          line-height: 1.5;
          max-width: 260px;
        }

        /* ── Copyright + social row ── */
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

        /* ── Full-width half-visible text ── */
        .fluid-text-wrap {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          height: clamp(72px, 9vw, 160px);
          overflow: hidden;
          cursor: default;
          user-select: none;
          margin-top: 8px;
        }
        .fluid-text-wrap svg { width: 100%; display: block; }
        @media (max-width: 720px) {
          .footer-profile-band { padding: 32px 22px 28px; }
          .footer-bottom-band  { padding: 14px 22px; gap: 14px; }
        }
        @media (max-width: 480px) {
          .footer-profile-band { padding: 24px 16px 22px; flex-direction: column; align-items: flex-start; }
          .footer-bottom-band  { padding: 12px 16px; flex-direction: column; gap: 10px; }
          .footer-socials-row  { gap: 8px; flex-wrap: nowrap; }
          .footer-social-btn   { width: 38px; height: 38px; }
          .fluid-text-wrap     { height: clamp(50px, 14vw, 90px); }
        }
      `}</style>

      <footer className="footer-root">
        {/* ── Profile band ── */}
        <div className="footer-profile-band">
          <div className="footer-avatar">
            <img key={avatarSrc} src={avatarSrc} alt="Indresh Thakur" />
          </div>
          <div className="footer-profile-info">
            <p className="footer-profile-name">Indresh Thakur</p>
            <p className="footer-profile-desc">
              Full-Stack &amp; AI Developer building modern, scalable digital experiences.
            </p>
          </div>
        </div>

        {/* ── Copyright + socials ── */}
        <div className="footer-bottom-band">
          <span className="footer-copy">© {year} Indresh Thakur. All rights reserved.</span>

          {/* Social icons — always inline row */}
          <div className="footer-socials-row">
          <SocialIcon href="https://x.com/indresh_dev" label="X / Twitter">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.255 5.623zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
          </SocialIcon>

          <SocialIcon href="https://github.com/IndreshThakur" label="GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </SocialIcon>

          <SocialIcon href="https://linkedin.com/in/indresh-thakur" label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </SocialIcon>

          <SocialIcon href="mailto:ithakur2327@gmail.com" label="Email">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </SocialIcon>
          </div>{/* end footer-socials-row */}
        </div>

        {/* ── Fluid gradient "IThakur.dev" ── */}
        <FluidGradientText text="IThakur.dev" />
      </footer>
    </>
  );
}