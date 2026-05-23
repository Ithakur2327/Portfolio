"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";

const CONTACT_LINKS = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    label: "Email",
    value: "ithakur2327@gmail.com",
    href: "mailto:ithakur2327@gmail.com",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
      </svg>
    ),
    label: "Phone",
    value: "+91 7859096326",
    href: "tel:+917859096326",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    label: "LinkedIn",
    value: "linkedin.com/in/indresh-thakur",
    href: "https://linkedin.com/in/indresh-thakur",
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    label: "GitHub",
    value: "github.com/IndreshThakur",
    href: "https://github.com/IndreshThakur",
  },
];

export function ContactSection() {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 5000);
    }, 1200);
  };

  return (
    <>
      <div className="section-separator" />
      <section
        id="contact"
        ref={ref}
        style={{
          padding: "32px 0 80px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
        }}
      >
        <p className="section-label">Contact</p>

        {/* Contact links */}
        <div style={{ marginBottom: 32 }}>
          {CONTACT_LINKS.map((item, i) => (
            <a
              key={i}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="contact-row"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateX(-8px)",
                transition: `opacity 0.4s var(--expo-out) ${0.06 * i}s, transform 0.4s var(--expo-out) ${0.06 * i}s`,
              }}
            >
              <span style={{
                width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                background: "var(--bg-hover)", border: "1px solid var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-secondary)",
              }}>
                {item.icon}
              </span>
              <span style={{ fontSize: 11, color: "var(--text-muted)", width: 56, flexShrink: 0, fontFamily: "'Geist Mono', monospace" }}>
                {item.label}
              </span>
              <span style={{ fontSize: 13.5 }}>{item.value}</span>
              <svg
                width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                style={{ marginLeft: "auto", color: "var(--text-muted)", flexShrink: 0 }}
              >
                <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
              </svg>
            </a>
          ))}
        </div>

        {/* Form */}
        <p className="section-label">Send a Message</p>
        <form onSubmit={handleSubmit} style={{ marginTop: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{
                  display: "block", fontSize: 11, fontWeight: 600,
                  color: "var(--text-muted)", marginBottom: 5,
                  fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em", textTransform: "uppercase",
                }}>
                  Name
                </label>
                <input
                  placeholder="Your name"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  required
                  className="field-input"
                />
              </div>
              <div>
                <label style={{
                  display: "block", fontSize: 11, fontWeight: 600,
                  color: "var(--text-muted)", marginBottom: 5,
                  fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em", textTransform: "uppercase",
                }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  required
                  className="field-input"
                />
              </div>
            </div>

            <div>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 600,
                color: "var(--text-muted)", marginBottom: 5,
                fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em", textTransform: "uppercase",
              }}>
                Message
              </label>
              <textarea
                placeholder="Tell me about your project..."
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                required
                rows={4}
                className="field-input"
                style={{ resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
                I usually respond within 24 hours.
              </p>
              <button
                type="submit"
                className={`btn-primary ${sent ? "sent" : ""}`}
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 0.8s linear infinite" }}>
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Sending...
                  </>
                ) : sent ? (
                  <>✓ Sent!</>
                ) : (
                  <>
                    Send Message
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="22" y1="2" x2="11" y2="13"/>
                      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </section>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}