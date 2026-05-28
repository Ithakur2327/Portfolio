"use client";
import { useTheme } from "./ThemeProvider";

const MONO = "'Geist Mono', monospace";
const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

const SOCIAL_LINKS = [
  { label: "GitHub",   href: "https://github.com/IndreshThakur" },
  { label: "LinkedIn", href: "https://linkedin.com/in/indresh-thakur" },
  { label: "Email",    href: "mailto:ithakur2327@gmail.com" },
];

const NAV_LINKS = [
  { label: "About",          href: "#about" },
  { label: "Skills",         href: "#skills" },
  { label: "Projects",       href: "#projects" },
  { label: "Education",      href: "#education" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact",        href: "#contact" },
];

export function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const year = new Date().getFullYear();
  const avatarSrc = isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg";

  return (
    <>
      <style>{`
        .footer-root {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
          border-top: 1px solid var(--line);
        }
        .footer-inner {
          max-width: 1060px;
          margin: 0 auto;
          padding: 44px 32px 36px;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          gap: 44px;
          align-items: flex-start;
          margin-bottom: 36px;
        }
        .footer-avatar-wrap {
          width: 46px; height: 46px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--border);
          flex-shrink: 0;
          margin-bottom: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.18);
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        .footer-avatar-wrap:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.28);
          border-color: var(--text-muted);
        }
        .footer-avatar-wrap img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          border-radius: 50%;
          image-rendering: high-quality;
        }
        .footer-brand-name {
          font-family: ${SF};
          font-weight: 700;
          font-size: 14.5px;
          color: var(--text-primary);
          letter-spacing: -0.02em;
          margin-bottom: 4px;
        }
        .footer-brand-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
          font-family: ${SF};
          max-width: 200px;
        }
        .footer-col-title {
          font-size: 10.5px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          font-family: ${MONO};
          margin-bottom: 13px;
        }
        .footer-link {
          display: block;
          font-size: 13px;
          color: var(--text-secondary);
          font-family: ${SF};
          text-decoration: none;
          padding: 3.5px 0;
          transition: color 0.15s;
        }
        .footer-link:hover { color: var(--text-primary); }
        .footer-bottom {
          padding-top: 24px;
          border-top: 1px solid var(--border);
          text-align: center;
        }
        .footer-copy {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: ${MONO};
        }

        @media (max-width: 720px) {
          .footer-inner { padding: 36px 22px 28px; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer-top > :first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-inner { padding: 28px 16px 24px; }
          .footer-top { grid-template-columns: 1fr; gap: 24px; }
          .footer-top > :first-child { grid-column: auto; }
        }
      `}</style>

      <footer className="footer-root">
        <div className="footer-inner">
          {/* Top grid */}
          <div className="footer-top">
            {/* Brand with avatar */}
            <div>
              <div className="footer-avatar-wrap">
                <img key={avatarSrc} src={avatarSrc} alt="Indresh Thakur" />
              </div>
              <p className="footer-brand-name">Indresh Thakur</p>
              <p className="footer-brand-desc">
                Full-Stack &amp; AI Developer building modern, scalable digital experiences.
              </p>
            </div>

            {/* Navigation */}
            <div>
              <p className="footer-col-title">Navigation</p>
              {NAV_LINKS.map(l => (
                <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
              ))}
            </div>

            {/* Connect */}
            <div>
              <p className="footer-col-title">Connect</p>
              {SOCIAL_LINKS.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="footer-link">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom copyright centered */}
          <div className="footer-bottom">
            <span className="footer-copy">© {year} Indresh Thakur. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </>
  );
}