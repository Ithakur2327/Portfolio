"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useReveal } from "./useReveal";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'Geist Mono', monospace";

// ─── Web3Forms Access Key ─────────────────────────────────
// To enable real email delivery:
// 1. Visit https://web3forms.com
// 2. Enter your email (ithakur2327@gmail.com) → get free access key
// 3. Replace the string below with your key
// 4. Redeploy — forms will land in your inbox
const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_WEB3FORMS_KEY";

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Web3Forms — free, no backend needed
      // Submissions go to your email inbox
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          name: form.name,
          email: form.email,
          message: form.message,
          subject: `Portfolio Contact from ${form.name}`,
          from_name: "Portfolio Contact Form",
        }),
      });

      const data = await res.json();

      if (data.success) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setSent(false), 6000);
      } else {
        // Fallback: open mailto if Web3Forms key not configured
        if (WEB3FORMS_KEY === "YOUR_WEB3FORMS_KEY") {
          const mailtoUrl = `mailto:ithakur2327@gmail.com?subject=${encodeURIComponent(`Portfolio Contact from ${form.name}`)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
          window.location.href = mailtoUrl;
          setSent(true);
          setForm({ name: "", email: "", message: "" });
          setTimeout(() => setSent(false), 6000);
        } else {
          setError("Failed to send. Please try again or email directly.");
        }
      }
    } catch {
      // Network error fallback — open mailto
      const mailtoUrl = `mailto:ithakur2327@gmail.com?subject=${encodeURIComponent(`Portfolio Contact from ${form.name}`)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
      window.location.href = mailtoUrl;
      setSent(true);
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setSent(false), 6000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
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
        style={{
          marginBottom: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translate3d(0, 14px, 0)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
        }}
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
              initial={{ opacity: 0, y: 12 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
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
              initial={{ opacity: 0, y: 14 }}
              animate={visible ? { opacity: 1, y: 0 } : {}}
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
                {error && <span className="contact-error">{error}</span>}
                <button
                  type="submit"
                  className={`btn-primary${sent ? " sent" : ""}`}
                  suppressHydrationWarning
                  disabled={loading}
                  style={{ opacity: loading ? 0.7 : 1, marginLeft: "auto" }}
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
            </motion.form>
          </div>
        </div>
      </section>
    </>
  );
}
