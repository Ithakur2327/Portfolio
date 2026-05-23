"use client";

export function Footer() {
  return (
    <>
      <div className="section-separator" />
      <footer style={{ padding: "24px 0 40px" }}>
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div>
            <span style={{
              fontFamily: "'Geist Mono', monospace", fontWeight: 800,
              fontSize: 15, color: "var(--text-primary)", letterSpacing: "-0.04em",
            }}>
              IT<span style={{ color: "var(--text-muted)" }}>.</span>
            </span>
            <p style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 3 }}>
              Indresh Thakur — Built with Next.js &amp; 💙
            </p>
          </div>

          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {[
              { label: "GitHub", href: "https://github.com/IndreshThakur" },
              { label: "LinkedIn", href: "https://linkedin.com/in/indresh-thakur" },
              { label: "Email", href: "mailto:ithakur2327@gmail.com" },
            ].map(l => (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontSize: 12.5, color: "var(--text-muted)", transition: "color 0.15s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
              >
                {l.label}
              </a>
            ))}
          </div>

          <p style={{
            fontSize: 11.5, color: "var(--text-muted)",
            fontFamily: "'Geist Mono', monospace",
          }}>
            © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </>
  );
}