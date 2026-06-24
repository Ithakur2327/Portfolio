"use client";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useReveal } from "./useReveal";

const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";
const TO_EMAIL = "ithakur2327@gmail.com";

const QUOTES = [
  { text: "A man who is master of patience is master of everything else.", author: "George Savile" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Programs must be written for people to read.", author: "Harold Abelson" },
];

function getQuoteForNow() {
  const slot = Math.floor(Date.now() / (1000 * 60 * 60 * 6));
  return QUOTES[slot % QUOTES.length];
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

export function ContactSection() {
  const { ref, revealClass, visible } = useReveal();
  const [open, setOpen]   = useState(false);
  const [form, setForm]   = useState({ name: "", email: "", message: "" });
  const [sent, setSent]   = useState(false);
  const quote = getQuoteForNow();

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Portfolio Contact from ${form.name}`;
    const body    = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    window.location.href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => { setSent(false); setOpen(false); }, 5000);
  }, [form]);

  return (
    <>
      <style suppressHydrationWarning>{`
        .contact-outer {
          position: relative; left: 50%; margin-left: -50vw;
          width: 100vw; background: var(--bg-base);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .contact-inner {
          max-width: 1060px; margin: 0 auto;
          padding: 0 32px 52px;
        }
        .contact-divider { height: 1px; background: var(--border); margin-bottom: 28px; }

        /* ── Quote Box ── */
        .quote-box {
          position: relative;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 24px 28px 24px 44px;
          margin-top: 26px;
          overflow: hidden;
        }
        .quote-mark {
          position: absolute; left: 10px; top: 10px;
          font-size: 72px; line-height: 1;
          font-family: Georgia, serif;
          color: var(--text-muted); opacity: 0.22;
          pointer-events: none; user-select: none;
          font-style: normal;
        }
        .quote-text {
          font-size: 13.5px;
          font-style: italic;
          color: var(--text-secondary);
          font-family: Georgia, 'Times New Roman', serif;
          line-height: 1.7;
          letter-spacing: 0.01em;
          margin: 0 0 10px;
        }
        .quote-author {
          text-align: right;
          font-size: 12px;
          font-family: ${MONO};
          color: var(--text-muted);
          margin: 0;
        }

        /* ── CTA Button ── */
        .contact-cta-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 13px 18px; border-radius: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-family: ${SF}; font-size: 14px; font-weight: 600;
          cursor: pointer; width: 100%;
          transition: border-color 0.2s ease, background 0.2s ease;
          text-align: left;
        }
        .contact-cta-btn:hover {
          border-color: rgba(99,102,241,0.5);
          background: var(--bg-hover);
        }
        .contact-cta-arrow {
          margin-left: auto;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          color: var(--text-muted); flex-shrink: 0;
        }
        .contact-cta-arrow.open { transform: rotate(180deg); }

        /* ── Form Panel ── */
        .contact-form-label {
          display: block; font-size: 10.5px; font-weight: 600;
          color: var(--text-muted); margin-bottom: 6px;
          font-family: ${MONO}; letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .contact-form-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 12px;
        }
        .contact-form-footer {
          display: flex; align-items: center; justify-content: flex-end;
          margin-top: 18px; gap: 10px;
        }

        @media (max-width: 860px) { .contact-inner { padding: 0 22px 44px; } }
        @media (max-width: 640px) {
          .contact-inner { padding: 0 16px 36px; }
          .contact-form-grid { grid-template-columns: 1fr; }
          .quote-box { padding: 20px 18px 20px 36px; }
        }
      `}</style>

      <section id="contact" ref={ref} className={revealClass}>
        <div className="contact-outer">
          <div className="contact-inner">

            {/* Section Title */}
            <div style={{ paddingTop: 28, marginBottom: 20 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10, margin: 0 }}>
                <span style={{ width: 34, height: 34, borderRadius: 9, background: "var(--bg-hover)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }}>
                  <MailIcon />
                </span>
                Contact
              </h2>
            </div>

            <div className="contact-divider" />

            {/* Headline */}
            <motion.div
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            >
              <p style={{ fontSize: 26, fontWeight: 800, color: "var(--text-primary)", letterSpacing: "-0.04em", lineHeight: 1.1, fontFamily: SF, margin: "0 0 6px" }}>
                Let&apos;s Build Together
              </p>
              <p style={{ fontSize: 17, fontWeight: 600, color: "var(--text-secondary)", letterSpacing: "-0.02em", fontFamily: SF, margin: "0 0 10px" }}>
                Have an idea? Let&apos;s talk.
              </p>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7, fontFamily: SF, maxWidth: 480, margin: "0 0 28px" }}>
                Open to freelance projects, collaborations, and full-time roles. Drop me a message and I&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>

            {/* CTA Button + Expandable Form */}
            <motion.div
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            >
              <button
                className="contact-cta-btn"
                onClick={() => setOpen(o => !o)}
                type="button"
              >
                <span style={{ width: 30, height: 30, borderRadius: 8, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <span>Send me a message</span>
                <svg
                  className={`contact-cta-arrow${open ? " open" : ""}`}
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    key="form-panel"
                    initial={{ opacity: 0, height: 0, y: -8 }}
                    animate={{ opacity: 1, height: "auto", y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -8 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: "hidden" }}
                  >
                    <div style={{ borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", borderRadius: "0 0 12px 12px", padding: "20px", background: "var(--bg-card)" }}>
                      <form onSubmit={handleSubmit}>
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
                              autoComplete="name"
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
                              autoComplete="email"
                            />
                          </div>
                        </div>
                        <div>
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
                            type="button"
                            onClick={() => setOpen(false)}
                            style={{ padding: "9px 16px", borderRadius: 10, background: "transparent", border: "1px solid var(--border)", color: "var(--text-muted)", fontFamily: SF, fontSize: 13, fontWeight: 500, cursor: "pointer" }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className={`btn-primary${sent ? " sent" : ""}`}
                            suppressHydrationWarning
                          >
                            {sent
                              ? <>&#10003; Opening Email App...</>
                              : <><SendIcon /> Send Message</>
                            }
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Quote Box */}
            <motion.div
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.22 }}
            >
              <div className="quote-box">
                <span className="quote-mark" aria-hidden="true">&ldquo;</span>
                <p className="quote-text">&ldquo;{quote.text}&rdquo;</p>
                <p className="quote-author">— {quote.author}</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}