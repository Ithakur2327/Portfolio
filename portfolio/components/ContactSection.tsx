"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { useReveal } from "./useReveal";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

// Form ka data yahan bharke, email app (Gmail/Outlook/jo bhi default ho)
// khulega — Subject + Body already bhara hua milega. User sirf "Send"
// dabayega apne email app me — final bhejna usi se hota hai.
const TO_EMAIL = "ithakur2327@gmail.com";

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

export function ContactSection() {
  const { ref, revealClass, visible } = useReveal();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `Portfolio Contact from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`;
    const mailtoUrl = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Email app khulega, fields pehle se bhare honge — final send wahin se.
    window.location.href = mailtoUrl;

    setSent(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSent(false), 6000);
  };

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes contact-spin { to { transform: rotate(360deg); } }

        .contact-outer {
          position: relative;
          left: 50%;
          margin-left: -50vw;
          width: 100vw;
          background: var(--bg-base);
          border-top: 1px solid var(--line);
          border-bottom: 1px solid var(--line);
        }
        .contact-inner {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 32px 52px;
        }
        .contact-titlerow {
          padding-top: 28px;
          margin-bottom: 20px;
        }
        .contact-title {
          font-size: 28px;
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1;
          font-family: ${SF};
          color: var(--text-primary);
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .contact-sec-icon {
          width: 34px; height: 34px;
          border-radius: 9px;
          background: var(--bg-hover);
          border: 1px solid var(--border);
          display: flex; align-items: center; justify-content: center;
          color: var(--text-secondary);
          flex-shrink: 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.18);
        }
        .contact-divider { height: 1px; background: var(--border); margin-bottom: 28px; }
        .contact-headline {
          font-size: 26px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.04em;
          line-height: 1.1;
          font-family: ${SF};
          margin-bottom: 6px;
        }
        .contact-subtitle {
          font-size: 17px;
          font-weight: 600;
          color: var(--text-secondary);
          letter-spacing: -0.02em;
          font-family: ${SF};
          margin-bottom: 10px;
        }
        .contact-body-txt {
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.7;
          font-family: ${SF};
          max-width: 480px;
          margin-bottom: 28px;
        }
        .contact-form-divider { height: 1px; background: var(--border); margin-bottom: 24px; }
        .contact-form-label {
          display: block;
          font-size: 10.5px;
          font-weight: 600;
          color: var(--text-muted);
          margin-bottom: 6px;
          font-family: ${MONO};
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }
        .contact-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
        }
        .contact-form-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 18px;
          flex-wrap: wrap;
          gap: 10px;
        }
        .contact-error {
          font-size: 12px;
          color: #f87171;
          font-family: ${MONO};
        }

        @media (max-width: 860px) {
          .contact-inner { padding: 0 22px 44px; }
        }
        @media (max-width: 640px) {
          .contact-inner { padding: 0 16px 36px; }
          .contact-form-grid { grid-template-columns: 1fr; }
          .contact-headline { font-size: 21px; }
          .contact-title { font-size: 22px; }
        }
      `}</style>

      <section
        id="contact"
        ref={ref}
        className={revealClass}
      >
        <div className="contact-outer">
          <div className="contact-inner">

            <div className="contact-titlerow">
              <h2 className="contact-title">
                <span className="contact-sec-icon"><MailIcon /></span>
                Contact
              </h2>
            </div>

            <div className="contact-divider" />

            <motion.div
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
            >
              <p className="contact-headline">Let&apos;s Build Together</p>
              <p className="contact-subtitle">Have an idea? Let&apos;s talk.</p>
              <p className="contact-body-txt">
                Open to freelance projects, collaborations, and full-time roles. Drop me a message and I&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>

            <div className="contact-form-divider" />

            <motion.form
              onSubmit={handleSubmit}
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
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
                  type="submit"
                  className={`btn-primary${sent ? " sent" : ""}`}
                  suppressHydrationWarning
                  style={{ marginLeft: "auto" }}
                >
                  {sent ? (
                    <>✓ Opening Email App...</>
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
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
}