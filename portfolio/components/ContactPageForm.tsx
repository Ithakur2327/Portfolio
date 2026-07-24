"use client";
import { useCallback, useState } from "react";
import { SolidMagneticButton, SendIcon } from "./HeroActionButtons";

const MONO = "'Geist Mono', monospace";
const TO_EMAIL = "ithakur2327@gmail.com";

const PURPOSE_OPTIONS = [
  { value: "freelance-project", label: "Hiring for a freelance project" },
  { value: "collaboration",     label: "Looking for collaboration" },
  { value: "job-opportunity",   label: "Offering a job opportunity" },
  { value: "casual-chat",       label: "Just a casual chat" },
];

function ChevronIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

export function ContactPageForm() {
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
    <>
      <style suppressHydrationWarning>{`
        .cpf-label {
          display: block; font-size: 10px; font-weight: 700;
          color: var(--text-muted); margin-bottom: 7px;
          font-family: ${MONO}; letter-spacing: 0.09em; text-transform: uppercase;
        }
        .cpf-req { color: #f87171; }
        .cpf-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 14px; margin-bottom: 18px;
        }
        .cpf-purpose { margin-bottom: 18px; }
        .cpf-message { margin-bottom: 4px; }

        .cpf-select-wrap { position: relative; }
        .cpf-select {
          appearance: none;
          -webkit-appearance: none;
          padding-right: 34px !important;
          cursor: pointer;
        }
        .cpf-select-chevron {
          position: absolute; top: 50%; right: 12px;
          transform: translateY(-50%);
          color: var(--text-muted); pointer-events: none;
          display: flex; align-items: center;
        }

        .cpf-footer {
          display: flex; align-items: center; justify-content: flex-start;
          margin-top: 22px;
        }

        /* ── Book-a-call banner ── */
        .cpf-banner {
          width: 100%;
          padding: 18px 20px;
          background: var(--bg-secondary);
          border: 1px solid var(--border);
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 32px;
        }
        .cpf-banner-icon { flex-shrink: 0; color: var(--text-primary); }
        .cpf-banner-title {
          font-size: 16px; font-weight: 700; color: var(--text-primary);
          margin: 0 0 3px;
        }
        .cpf-banner-sub {
          font-size: 13px; color: var(--text-secondary); margin: 0;
        }

        @media (max-width: 640px) {
          .cpf-grid { grid-template-columns: 1fr; }
          .cpf-banner { flex-direction: column; align-items: flex-start; text-align: left; }
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <div className="cpf-grid">
          <div>
            <label htmlFor="cpf-name" className="cpf-label">Full Name <span className="cpf-req">*</span></label>
            <input
              id="cpf-name"
              placeholder="Your name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required minLength={2} className="field-input"
              suppressHydrationWarning autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="cpf-email" className="cpf-label">Email <span className="cpf-req">*</span></label>
            <input
              id="cpf-email"
              type="email" placeholder="your@email.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required className="field-input"
              suppressHydrationWarning autoComplete="email"
            />
          </div>
        </div>

        <div className="cpf-purpose">
          <label htmlFor="cpf-purpose" className="cpf-label">Purpose <span className="cpf-req">*</span></label>
          <div className="cpf-select-wrap">
            <select
              id="cpf-purpose"
              value={form.purpose}
              onChange={e => setForm({ ...form, purpose: e.target.value })}
              required className="field-input cpf-select"
              suppressHydrationWarning
            >
              <option value="" disabled>Select purpose of message</option>
              {PURPOSE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="cpf-select-chevron"><ChevronIcon /></span>
          </div>
        </div>

        <div className="cpf-message">
          <label htmlFor="cpf-message" className="cpf-label">Message <span className="cpf-req">*</span></label>
          <textarea
            id="cpf-message"
            placeholder="Tell me about your project or idea..."
            value={form.message}
            onChange={e => setForm({ ...form, message: e.target.value })}
            required minLength={10} rows={6} className="field-input"
            suppressHydrationWarning style={{ resize: "vertical" }}
          />
        </div>

        <div className="cpf-footer" style={{ flexDirection: "column", alignItems: "flex-start", gap: 10 }}>
          <SolidMagneticButton type="submit">
            {sent ? "Opening Email App..." : "Send Message"}
            <SendIcon />
          </SolidMagneticButton>
          {/* mailto: silently does nothing if the visitor has no default mail
              app configured (common on fresh desktop installs) -- there's no
              way to detect that in JS, so always show a working fallback
              rather than leaving those visitors with no path to reach out. */}
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", fontFamily: MONO, margin: 0 }}>
            Or email directly at{" "}
            <a href={`mailto:${TO_EMAIL}`} style={{ color: "var(--text-secondary)", textDecoration: "underline" }}>
              {TO_EMAIL}
            </a>
          </p>
        </div>
      </form>
    </>
  );
}