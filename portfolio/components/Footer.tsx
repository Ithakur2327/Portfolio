"use client";
export function Footer() {
  return (
    <footer style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 48px" }}>
      <div className="section-sep" style={{ marginBottom: 24 }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
          Built with 💙 by{" "}
          <a href="https://github.com" target="_blank" rel="noreferrer"
            style={{ color: "var(--text-secondary)", borderBottom: "1px solid var(--border)", paddingBottom: 1, transition: "color 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
          >Indresh Thakur</a>
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          {["GitHub", "LinkedIn", "Email"].map(l => (
            <a key={l} href="#" style={{ fontSize: 12.5, color: "var(--text-muted)", transition: "color 0.15s" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; }}
            >{l}</a>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--text-muted)" }}>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
