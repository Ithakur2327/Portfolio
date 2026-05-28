"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

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
      <style>{`
        .contact-section-box {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .contact-section-inner {
          max-width: 1060px;
          margin: 0 auto;
          padding: 28px 32px 52px;
        }
        .contact-head {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 28px;
        }
        .contact-icon-box {
          width: 32px; height: 32px;
          border-radius: 8px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-muted);
          flex-shrink: 0;
        }
        .contact-headline {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.04em;
          line-height: 1.1;
          font-family: ${SF};
          margin-bottom: 8px;
        }
        .contact-sub {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.65;
          font-family: ${SF};
          max-width: 460px;
        }
        .contact-note {
          font-size: 12px;
          color: var(--text-muted);
          font-family: ${MONO};
          margin-top: 6px;
        }
        .contact-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .contact-form-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 6px;
          font-family: ${MONO};
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }
        .contact-form-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 16px;
        }
        .contact-divider {
          height: 1px;
          background: var(--border);
          margin: 24px 0;
        }

        @keyframes contact-spin { to { transform: rotate(360deg); } }

        @media (max-width: 860px) {
          .contact-section-inner { padding: 22px 22px 44px; }
        }
        @media (max-width: 640px) {
          .contact-section-inner { padding: 18px 16px 36px; }
          .contact-form-grid { grid-template-columns: 1fr; }
          .contact-headline { font-size: 22px; }
        }
      `}</style>

      <div className="section-separator" />
      <section
        id="contact"
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
        }}
      >
        <div className="contact-section-box">
          <div className="contact-section-inner">

            {/* Section icon label */}
            <div className="contact-head">
              <div className="contact-icon-box">
                <MailIcon />
              </div>
              <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: "var(--text-muted)" }}>
                Contact
              </span>
            </div>

            {/* Headline block */}
            <div
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(10px)",
                transition: "opacity 0.5s var(--expo-out) 0.05s, transform 0.5s var(--expo-out) 0.05s",
                marginBottom: 28,
              }}
            >
              <p className="contact-headline">Let&apos;s Build Together</p>
              <p style={{ fontSize: 18, fontWeight: 600, color: "var(--text-secondary)", fontFamily: SF, marginBottom: 10, letterSpacing: "-0.02em" }}>
                Have an idea? Let&apos;s talk.
              </p>
              <p className="contact-sub">
                Open to freelance projects, collaborations, and full-time roles. Drop me a message and I&apos;ll get back to you within 24 hours.
              </p>
            </div>

            <div className="contact-divider" />

            {/* Form */}
            <form onSubmit={handleSubmit}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(10px)",
                transition: "opacity 0.5s var(--expo-out) 0.12s, transform 0.5s var(--expo-out) 0.12s",
              }}
            >
              <div className="contact-form-grid">
                <div>
                  <label className="contact-form-label">Name</label>
                  <input
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                    className="field-input"
                    suppressHydrationWarning
                  />
                </div>
                <div>
                  <label className="contact-form-label">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required
                    className="field-input"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div style={{ marginBottom: 0 }}>
                <label className="contact-form-label">Message</label>
                <textarea
                  placeholder="Tell me about your project or idea..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="field-input"
                  suppressHydrationWarning
                  style={{ resize: "vertical" }}
                />
              </div>

              <div className="contact-form-footer">
                <button
                  type="submit"
                  className={`btn-primary${sent ? " sent" : ""}`}
                  suppressHydrationWarning
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? (
                    <>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "contact-spin 0.8s linear infinite" }}>
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                      Sending...
                    </>
                  ) : sent ? (
                    <>✓ Message Sent!</>
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
            </form>
          </div>
        </div>
      </section>
    </>
  );
}