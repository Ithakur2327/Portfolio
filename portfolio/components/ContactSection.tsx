"use client";
import { useState, useCallback, memo } from "react";
import { motion } from "motion/react";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";

const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";
const TO_EMAIL = "ithakur2327@gmail.com";

function SendIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}


const ContactCard = memo(function ContactCard() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

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
    <div className="contact-card">
      <div
        className="contact-card-header"
        onClick={() => setOpen(o => !o)}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && setOpen(o => !o)}
        aria-expanded={open}
      >
        <span className="contact-card-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </span>
        <span className="contact-card-title">Send me a message</span>
        <svg
          className={`contact-card-chevron${open ? " open" : ""}`}
          width="17" height="17" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>


      {open && (
        <div className="contact-form-panel">
          <div className="contact-card-sep" />
          <div className="contact-card-body">
            <form onSubmit={handleSubmit}>
              <div className="contact-form-grid">
                <div>
                  <label className="contact-form-label">Name</label>
                  <input
                    placeholder="Your name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required className="field-input"
                    suppressHydrationWarning autoComplete="name"
                  />
                </div>
                <div>
                  <label className="contact-form-label">Email</label>
                  <input
                    type="email" placeholder="your@email.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    required className="field-input"
                    suppressHydrationWarning autoComplete="email"
                  />
                </div>
              </div>
              <div>
                <label className="contact-form-label">Message</label>
                <textarea
                  placeholder="Tell me about your project or idea..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  required rows={5} className="field-input"
                  suppressHydrationWarning style={{ resize: "vertical" }}
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
                    ? <>&#10003;&nbsp;Opening Email App...</>
                    : <><SendIcon />&nbsp;Send Message</>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
});

export function ContactSection() {
  const { ref, revealClass, visible } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        .contact-outer {
          position: relative; left: 50%; margin-left: -50vw;
          width: 100vw; background: var(--bg-base);
        }
        .contact-inner { max-width: 1060px; margin: 0 auto; padding: 0 32px 68px; }
        .contact-divider { height: 1px; background: var(--border); margin-bottom: 28px; }

        /* ── Card — adapts to site theme ── */
        .contact-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }
        .contact-card-header {
          display: flex; align-items: center; gap: 12px;
          padding: 16px 20px; cursor: pointer;
          transition: background 0.15s ease;
          user-select: none;
        }
        .contact-card-header:hover { background: var(--bg-hover); }
        .contact-card-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.28);
          display: flex; align-items: center; justify-content: center;
        }
        .contact-card-title {
          font-family: ${SF}; font-size: 15px; font-weight: 600;
          color: var(--text-primary); flex: 1;
        }
        .contact-card-chevron {
          color: var(--text-muted); flex-shrink: 0;
          transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .contact-card-chevron.open { transform: rotate(180deg); }
        .contact-card-sep { height: 1px; background: var(--border); }
        .contact-card-body { padding: 20px; }

        /*
          THE KEY: only opacity + translateY are animated.
          Both are compositor-only — zero layout recalc, zero paint.
          Duration 220ms feels instant but still smooth.
        */
        @keyframes contactReveal {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .contact-form-panel {
          animation: contactReveal 0.22s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        /* Form */
        .contact-form-label {
          display: block; font-size: 10px; font-weight: 700;
          color: var(--text-muted); margin-bottom: 7px;
          font-family: ${MONO}; letter-spacing: 0.09em; text-transform: uppercase;
        }
        .contact-form-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 14px;
        }
        .contact-form-footer {
          display: flex; align-items: center; justify-content: flex-end;
          margin-top: 20px; gap: 10px;
        }

        @media (max-width: 860px) { .contact-inner { padding: 0 22px 44px; } }
        @media (max-width: 640px) {
          .contact-inner { padding: 0 16px 36px; }
          .contact-form-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section id="contact" ref={ref} className={revealClass}>
        <div className="contact-outer">
          <div className="contact-inner">

            {/* Section Title */}
            <div style={{ paddingTop: 50, marginBottom: 20 }}>
              <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 10, margin: 0 }}>
                <SectionTitleIcon type="mail" />
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
                Open to freelance projects, collaborations, and full-time roles.
              </p>
            </motion.div>

            {/* Card */}
            <motion.div
              initial={false}
              animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.14 }}
            >
              <ContactCard />
            </motion.div>

          </div>
        </div>
      </section>
    </>
  );
}