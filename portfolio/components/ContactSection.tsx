"use client";
import { useCallback, useState, memo } from "react";
import { motion } from "motion/react";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";

const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";
const TO_EMAIL = "ithakur2327@gmail.com";

const PURPOSE_OPTIONS = [
  { value: "freelance-project", label: "Hiring for a freelance project" },
  { value: "collaboration",     label: "Looking for collaboration" },
  { value: "job-opportunity",   label: "Offering a job opportunity" },
  { value: "casual-chat",       label: "Just a casual chat" },
];

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

const ContactCard = memo(function ContactCard() {
  const [form, setForm] = useState({ name: "", email: "", purpose: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const purposeLabel = PURPOSE_OPTIONS.find(o => o.value === form.purpose)?.label ?? "";
    const subject = `Portfolio Contact from ${form.name}`;
    const body    = `Name: ${form.name}\nEmail: ${form.email}\nPurpose: ${purposeLabel}\n\n${form.message}`;
    window.location.href = `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setForm({ name: "", email: "", purpose: "", message: "" });
    setTimeout(() => setSent(false), 5000);
  }, [form]);

  return (
    <div className="contact-card">
      <div className="contact-card-head">
        <span className="contact-card-icon">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </span>
        <div>
          <div className="contact-card-title">Send me a message</div>
          <div className="contact-card-subtitle">Fill out the form below and I&apos;ll get back to you as soon as possible.</div>
        </div>
      </div>

      <div className="contact-card-sep" />

      <div className="contact-card-body">
        <form onSubmit={handleSubmit}>
          <div className="contact-form-grid">
            <div>
              <label className="contact-form-label">Full Name <span className="contact-req">*</span></label>
              <input
                placeholder="Your name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required minLength={2} className="field-input"
                suppressHydrationWarning autoComplete="name"
              />
            </div>
            <div>
              <label className="contact-form-label">Email <span className="contact-req">*</span></label>
              <input
                type="email" placeholder="your@email.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required className="field-input"
                suppressHydrationWarning autoComplete="email"
              />
            </div>
          </div>

          <div className="contact-form-purpose">
            <label className="contact-form-label">Purpose <span className="contact-req">*</span></label>
            <div className="contact-select-wrap">
              <select
                value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })}
                required className="field-input contact-select"
                suppressHydrationWarning
              >
                <option value="" disabled>Select purpose of message</option>
                {PURPOSE_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <span className="contact-select-chevron"><ChevronIcon /></span>
            </div>
          </div>

          <div className="contact-form-message">
            <label className="contact-form-label">Message <span className="contact-req">*</span></label>
            <textarea
              placeholder="Tell me about your project or idea..."
              value={form.message}
              onChange={e => setForm({ ...form, message: e.target.value })}
              required minLength={10} rows={5} className="field-input"
              suppressHydrationWarning style={{ resize: "vertical" }}
            />
          </div>

          <div className="contact-form-footer">
            <div className="contact-send-wrap">
              <button
                type="submit"
                className={`contact-send-btn${sent ? " sent" : ""}`}
                suppressHydrationWarning
              >
                {sent ? "Opening Email App..." : "Send Message"}
                <span className="contact-send-icon">
                  {sent ? <>&#10003;</> : <SendIcon />}
                </span>
              </button>
            </div>
          </div>
        </form>
      </div>
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
        .contact-inner { max-width: var(--content-width); margin: 0 auto; padding: 0 32px 68px; }
        .contact-divider { height: 1px; background: var(--border); margin-bottom: 28px; }

        /* ── Card — adapts to site theme ── */
        .contact-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
        }
        .contact-card-head {
          display: flex; align-items: flex-start; gap: 12px;
          padding: 20px 22px;
        }
        .contact-card-icon {
          width: 34px; height: 34px; border-radius: 9px; flex-shrink: 0;
          background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.28);
          display: flex; align-items: center; justify-content: center;
          margin-top: 1px;
        }
        .contact-card-title {
          font-family: ${SF}; font-size: 15px; font-weight: 600;
          color: var(--text-primary); margin-bottom: 3px;
        }
        .contact-card-subtitle {
          font-family: ${SF}; font-size: 13px; line-height: 1.5;
          color: var(--text-secondary);
        }
        .contact-card-sep { height: 1px; background: var(--border); }
        .contact-card-body { padding: 22px; }

        /* Form */
        .contact-form-label {
          display: block; font-size: 10px; font-weight: 700;
          color: var(--text-muted); margin-bottom: 7px;
          font-family: ${MONO}; letter-spacing: 0.09em; text-transform: uppercase;
        }
        .contact-req { color: #f87171; }
        .contact-form-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 12px; margin-bottom: 16px;
        }
        .contact-form-purpose { max-width: 340px; margin-bottom: 16px; }
        .contact-form-message { margin-bottom: 4px; }

        .contact-select-wrap { position: relative; }
        .contact-select {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 34px !important;
          cursor: pointer;
        }
        .contact-select-chevron {
          position: absolute; top: 50%; right: 12px;
          transform: translateY(-50%);
          color: var(--text-muted); pointer-events: none;
          display: flex; align-items: center;
        }

        .contact-form-footer {
          display: flex; align-items: center; justify-content: flex-start;
          margin-top: 20px;
        }

        /* Dashed-border wrap + rotating send icon — matches the
           reference portfolio's contact-form button treatment */
        .contact-send-wrap {
          display: inline-block;
          padding: 2px;
          border: 1px dashed var(--border);
          border-radius: 11px;
          transition: border-color 0.2s ease;
        }
        .contact-send-wrap:hover { border-color: var(--text-muted); }
        .contact-send-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 9px; border: none;
          background: var(--text-primary); color: var(--bg-base);
          font-family: ${MONO}; font-size: 13px; font-weight: 600;
          cursor: pointer;
          transition: opacity 0.18s ease, transform 0.18s ease;
        }
        .contact-send-btn:hover  { opacity: 0.85; }
        .contact-send-btn:active { transform: scale(0.97); }
        .contact-send-btn.sent   { background: var(--success); color: #fff; }
        .contact-send-icon { display: inline-flex; align-items: center; transition: transform 0.3s ease; }
        .contact-send-wrap:hover .contact-send-icon { transform: rotate(45deg); }
        .contact-send-btn.sent .contact-send-icon { transform: none !important; }

        @media (max-width: 860px) { .contact-inner { padding: 0 22px 44px; } }
        @media (max-width: 640px) {
          .contact-inner { padding: 0 16px 36px; }
          .contact-form-grid { grid-template-columns: 1fr; }
          .contact-form-purpose { max-width: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .contact-send-icon, .contact-send-wrap { transition: none; }
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