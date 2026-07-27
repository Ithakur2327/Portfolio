"use client";
import { useState } from "react";

/* ════════════════════════════════════════════════════════════
   Canonical social links — single source of truth shared by
   the Hero info box and the Footer, so both always match.

   NOTE: your project previously had two different GitHub
   usernames on file (Navbar/Hero used "Ithakur2327", Footer used
   "IndreshThakur"). I standardized on "Ithakur2327" since it's
   the one used in two places — flag me if that's the wrong one.

   Instagram has no link on file anywhere in the project, so
   href is left empty below — drop your handle in and it's live.
═══════════════════════════════════════════════════════════ */
export const SOCIAL_LINKS = [
  {
    key: "mail", label: "Mail", href: "mailto:ithakur2327@gmail.com",
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
  {
    key: "github", label: "GitHub", href: "https://github.com/Ithakur2327",
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/indresh-thakur",
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    key: "twitter", label: "X / Twitter", href: "https://x.com/indresh_dev",
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.255 5.623zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
  {
    key: "instagram", label: "Instagram", href: "",
    icon: (
      <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
];

/* ── Tooltip — single active-item model shared across the whole row,
   so switching from one icon straight to another swaps instantly with
   zero overlap (no two tooltips ever visible at once, no per-icon
   linger delay). Pure presentational — SocialRow above owns which key
   is active. Animation uses a bouncy spring-style cubic-bezier so it
   pops in with a touch of overshoot rather than a flat ease. ── */
function SocialTooltip({
  label,
  show,
  onEnter,
  onLeave,
  children,
}: {
  label: string;
  show: boolean;
  onEnter: () => void;
  onLeave: () => void;
  children: React.ReactNode;
}) {
  return (
    <span
      className="rt-wrap"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      {children}
      <span
        className={`rt-tip${show ? " rt-tip--visible" : ""}`}
        role="tooltip"
        aria-hidden={!show}
      >
        {label}
        <span className="rt-arrow" aria-hidden="true" />
      </span>
    </span>
  );
}

export function SocialRow({ size = 22, gap = 16, bright = false, leftAlign = false }: { size?: number; gap?: number; bright?: boolean; leftAlign?: boolean }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <style suppressHydrationWarning>{`
        .rt-row { display: flex; flex-wrap: wrap; align-items: center; }
        .rt-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .rt-link {
          display: inline-flex;
          color: var(--text-muted);
          transition: color 0.15s ease, transform 0.15s ease;
          line-height: 0;
        }
        .rt-link--bright { color: var(--text-secondary); }
        .rt-link:hover { color: var(--text-primary); transform: translateY(-1px); }

        .rt-tip {
          position: absolute;
          bottom: calc(100% + 10px);
          left: 50%;
          background: var(--text-primary);
          color: var(--bg-base);
          font-size: 12px;
          font-weight: 500;
          font-family: 'Geist Mono', monospace;
          padding: 6px 12px;
          border-radius: 8px;
          white-space: nowrap;
          pointer-events: none;
          z-index: 50;
          opacity: 0;
          transform: translateX(-50%) translateY(5px) scale(0.82);
          transition: opacity 0.16s cubic-bezier(0.34,1.56,0.64,1), transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
        }
        .rt-tip--visible {
          opacity: 1;
          transform: translateX(-50%) translateY(0) scale(1);
          transition: opacity 0.12s ease-out, transform 0.32s cubic-bezier(0.34,1.56,0.64,1);
        }
        .rt-arrow {
          position: absolute;
          top: 100%;
          left: 50%;
          width: 8px; height: 8px;
          background: var(--text-primary);
          transform: translate(-50%, -50%) rotate(45deg);
          border-radius: 2px;
          z-index: -1;
        }
        @media (hover: none) {
          .rt-tip { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rt-tip { transition: none; }
        }
      `}</style>

      <div className="rt-row" style={{ gap, justifyContent: leftAlign ? "flex-start" : undefined }}>
        {SOCIAL_LINKS.map(s => (
          <SocialTooltip
            key={s.key}
            label={s.label}
            show={active === s.key}
            onEnter={() => setActive(s.key)}
            onLeave={() => setActive(cur => (cur === s.key ? null : cur))}
          >
            <a
              href={s.href || undefined}
              target={s.key === "mail" ? undefined : "_blank"}
              rel={s.key === "mail" ? undefined : "noopener noreferrer"}
              aria-label={s.label}
              className={`rt-link${bright ? " rt-link--bright" : ""}`}
              style={{ fontSize: size }}
              onClick={!s.href ? (e) => e.preventDefault() : undefined}
              aria-disabled={!s.href || undefined}
            >
              {s.icon}
            </a>
          </SocialTooltip>
        ))}
      </div>
    </>
  );
}