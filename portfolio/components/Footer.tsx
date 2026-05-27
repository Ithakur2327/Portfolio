"use client";

const FOOTER_LINKS = [
  { label: "About",    href: "#about" },
  { label: "Skills",   href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact",  href: "#contact" },
];

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/IndreshThakur",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/indresh-thakur",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: "Email",
    href: "mailto:ithakur2327@gmail.com",
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <div className="section-separator" />

      <footer style={{ padding: "32px 0 48px" }}>

        {/* ── Top row: logo + tagline ─────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "flex-start", flexWrap: "wrap", gap: 20,
          marginBottom: 28,
        }}>
          {/* Brand */}
          <div>
            <span style={{
              fontFamily: "'Geist Mono', monospace", fontWeight: 900,
              fontSize: 16, color: "var(--text-primary)", letterSpacing: "-0.05em",
            }}>
              IT<span style={{ color: "var(--text-muted)" }}>.</span>
            </span>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4, maxWidth: 260, lineHeight: 1.6 }}>
              Building AI-powered products with care, curiosity, and craft.
            </p>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "flex-start" }}>
            {FOOTER_LINKS.map(l => (
              <a
                key={l.label}
                href={l.href}
                style={{
                  fontSize: 12.5, color: "var(--text-muted)",
                  padding: "4px 8px", borderRadius: 5,
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* ── Divider ─────────────────────────────── */}
        <div style={{ height: 1, background: "var(--border)", marginBottom: 20 }} />

        {/* ── Bottom row ──────────────────────────── */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 14,
        }}>
          {/* Copyright + stack */}
          <p style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "'Geist Mono', monospace" }}>
            © {year} Indresh Thakur
            <span style={{ margin: "0 6px", opacity: 0.4 }}>·</span>
            Built with Next.js &amp; 💙
          </p>

          {/* Social icons */}
          <div style={{ display: "flex", gap: 2 }}>
            {SOCIAL_LINKS.map(s => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                style={{
                  width: 30, height: 30, borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "var(--text-muted)",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  (e.currentTarget as HTMLElement).style.background = "var(--bg-hover)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>

      </footer>

      {/* Responsive stacking */}
      <style>{`
        @media (max-width: 600px) {
          footer [style*="justifyContent: space-between"] {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}