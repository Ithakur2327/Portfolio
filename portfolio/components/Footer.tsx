"use client";

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
  const year = new Date().getFullYear();

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
          padding: 40px 32px 36px;
        }
        .footer-top {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 40px;
          align-items: flex-start;
          margin-bottom: 32px;
        }
        .footer-brand-logo {
          font-family: ${MONO};
          font-weight: 900;
          font-size: 20px;
          color: var(--text-primary);
          letter-spacing: -0.05em;
          margin-bottom: 6px;
        }
        .footer-brand-desc {
          font-size: 12px;
          color: var(--text-muted);
          line-height: 1.6;
          font-family: ${SF};
          max-width: 220px;
        }
        .footer-col-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: var(--text-muted);
          font-family: ${MONO};
          margin-bottom: 12px;
        }
        .footer-link {
          display: block;
          font-size: 13px;
          color: var(--text-secondary);
          font-family: ${SF};
          text-decoration: none;
          padding: 3px 0;
          transition: color 0.15s;
        }
        .footer-link:hover { color: var(--text-primary); }
        .footer-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 24px;
          border-top: 1px solid var(--border);
          flex-wrap: wrap;
          gap: 10px;
        }
        .footer-copy {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: ${MONO};
        }
        .footer-made {
          font-size: 11.5px;
          color: var(--text-muted);
          font-family: ${SF};
        }

        @media (max-width: 720px) {
          .footer-inner { padding: 32px 22px 28px; }
          .footer-top { grid-template-columns: 1fr 1fr; gap: 28px; }
          .footer-top > :first-child { grid-column: 1 / -1; }
        }
        @media (max-width: 480px) {
          .footer-inner { padding: 28px 16px 24px; }
          .footer-top { grid-template-columns: 1fr; gap: 22px; }
          .footer-top > :first-child { grid-column: auto; }
          .footer-bottom { flex-direction: column; align-items: flex-start; gap: 6px; }
        }
      `}</style>

      <div className="section-separator" />
      <footer className="footer-root">
        <div className="footer-inner">
          {/* Top grid */}
          <div className="footer-top">
            {/* Brand */}
            <div>
              <div className="footer-brand-logo">
                IT<span style={{ color: "var(--text-muted)" }}>.</span>
              </div>
              <p className="footer-brand-desc">
                Indresh Thakur — Full-Stack &amp; AI Developer building modern, scalable digital experiences.
              </p>
            </div>

            {/* Navigation col */}
            <div>
              <p className="footer-col-title">Navigation</p>
              {NAV_LINKS.map(l => (
                <a key={l.label} href={l.href} className="footer-link">{l.label}</a>
              ))}
            </div>

            {/* Social col */}
            <div>
              <p className="footer-col-title">Connect</p>
              {SOCIAL_LINKS.map(l => (
                <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="footer-link">
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="footer-bottom">
            <span className="footer-copy">© {year} Indresh Thakur. All rights reserved.</span>
            <span className="footer-made">Built with Next.js &amp; 💙</span>
          </div>
        </div>
      </footer>
    </>
  );
}