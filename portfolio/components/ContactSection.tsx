"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";

export function ContactSection() {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 4000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 7,
    border: "1px solid var(--border)", background: "var(--bg-secondary)",
    color: "var(--text-primary)", fontSize: 13.5, outline: "none",
    fontFamily: "inherit", transition: "border-color 0.15s",
  };

  return (
    <section id="contact" style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 80px" }}>
      <div className="section-sep" />
      <div
        ref={ref}
        style={{
          paddingTop: 40,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.5s ease, transform 0.5s ease",
        }}
      >
        <p className="section-heading">Contact</p>

        {/* Contact rows */}
        <div style={{ marginBottom: 32 }}>
          {[
            { icon: "📧", label: "Email", value: "ithakur2327@gmail.com", href: "mailto:ithakur2327@gmail.com" },
            { icon: "📱", label: "Phone", value: "+91 7859096326", href: "tel:+917859096326" },
            { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, label: "LinkedIn", value: "linkedin.com/in/indresh", href: "https://linkedin.com" },
            { icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>, label: "GitHub", value: "github.com/indresh", href: "https://github.com" },
          ].map((item, i) => (
            <a key={i} href={item.href} target="_blank" rel="noreferrer" className="contact-row">
              <span style={{ width: 18, textAlign: "center", fontSize: 14, flexShrink: 0 }}>
                {typeof item.icon === "string" ? item.icon : item.icon}
              </span>
              <span style={{ fontSize: 12, color: "var(--text-muted)", width: 56, flexShrink: 0 }}>{item.label}</span>
              <span>{item.value}</span>
            </a>
          ))}
        </div>

        {/* Form */}
        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", marginBottom: 14, letterSpacing: "0.06em", textTransform: "uppercase" }}>
          Send a Message
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <input placeholder="Your name" value={form.name}
                onChange={e => setForm({...form, name: e.target.value})} required
                style={inputStyle}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--text-secondary)"; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)"; }}
              />
              <input type="email" placeholder="your@email.com" value={form.email}
                onChange={e => setForm({...form, email: e.target.value})} required
                style={inputStyle}
                onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--text-secondary)"; }}
                onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)"; }}
              />
            </div>
            <textarea placeholder="Tell me about your project..." value={form.message}
              onChange={e => setForm({...form, message: e.target.value})} required rows={4}
              style={{ ...inputStyle, resize: "vertical" }}
              onFocus={e => { (e.target as HTMLElement).style.borderColor = "var(--text-secondary)"; }}
              onBlur={e => { (e.target as HTMLElement).style.borderColor = "var(--border)"; }}
            />
            <button type="submit" style={{
              padding: "9px 20px", borderRadius: 7, border: "1px solid var(--border)",
              background: sent ? "#22c55e" : "var(--text-primary)", color: sent ? "#fff" : "var(--bg)",
              fontSize: 13.5, fontWeight: 600, cursor: "pointer", alignSelf: "flex-start",
              transition: "all 0.2s", fontFamily: "inherit",
            }}
            onMouseEnter={e => { if (!sent) (e.currentTarget as HTMLElement).style.opacity = "0.8"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >
              {sent ? "✓ Sent!" : "Send Message →"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
