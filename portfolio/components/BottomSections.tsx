"use client";

import { useEffect, useRef, useState } from "react";

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref]);
  return inView;
}

export function EducationSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);

  const education = [
    {
      degree: "B.Tech — Computer Science & Engineering (AI)",
      institution: "Noida Institute of Engineering and Technology",
      location: "Greater Noida",
      period: "2023 – Present",
      detail: "CGPA: 7.5 / 10",
      color: "#6c63ff",
      icon: "🎓",
    },
    {
      degree: "Class XII — BSEB",
      institution: "L.N.J School",
      location: "Madhubani, Bihar",
      period: "2021",
      detail: "Percentage: 70%",
      color: "#22c55e",
      icon: "📚",
    },
  ];

  const certifications = [
    { title: "MERN Stack", issuer: "Coursera", color: "#0891b2", icon: "🏆" },
    { title: "Principles of Generative AI", issuer: "Infosys Springboard", color: "#7c3aed", icon: "🤖" },
  ];

  const activities = [
    { text: "Contributor — GSSOC (Extended Edition) 2025", icon: "🌟" },
    { text: "Participated in Smart India Hackathon (SIH) 2025", icon: "💡" },
    { text: "Web Development Intern — Unstop (Jun–Aug 2025)", icon: "💼" },
  ];

  return (
    <section id="education" style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-tag">
            <span>🎓</span> Education
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Academic Background
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 16,
            marginBottom: 48,
          }}
        >
          {education.map((edu, i) => (
            <div
              key={edu.degree}
              className="card"
              style={{
                padding: "28px",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${edu.color}, transparent)`,
                }}
              />
              <div style={{ fontSize: 28, marginBottom: 12 }}>{edu.icon}</div>
              <h3
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                  lineHeight: 1.4,
                }}
              >
                {edu.degree}
              </h3>
              <p style={{ fontSize: 14, color: edu.color, fontWeight: 600, marginBottom: 4 }}>
                {edu.institution}
              </p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
                {edu.location} · {edu.period}
              </p>
              <div
                style={{
                  display: "inline-flex",
                  padding: "4px 12px",
                  borderRadius: 6,
                  background: `${edu.color}15`,
                  color: edu.color,
                  fontSize: 13,
                  fontWeight: 600,
                  border: `1px solid ${edu.color}30`,
                }}
              >
                {edu.detail}
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div className="section-tag">
              <span>🏆</span> Certifications
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
            }}
          >
            {certifications.map((cert, i) => (
              <div
                key={cert.title}
                className="card"
                style={{
                  padding: "22px 24px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  opacity: inView ? 1 : 0,
                  transform: inView ? "translateY(0)" : "translateY(20px)",
                  transition: `opacity 0.5s ease ${0.2 + i * 0.1}s, transform 0.5s ease ${0.2 + i * 0.1}s`,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${cert.color}20`,
                    border: `1px solid ${cert.color}40`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                  }}
                >
                  {cert.icon}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      lineHeight: 1.3,
                    }}
                  >
                    {cert.title}
                  </p>
                  <p style={{ fontSize: 12, color: cert.color, marginTop: 3, fontWeight: 600 }}>
                    {cert.issuer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="section-tag">
            <span>🌟</span> Activities
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 12,
          }}
        >
          {activities.map((a, i) => (
            <div
              key={a.text}
              className="card"
              style={{
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-16px)",
                transition: `opacity 0.5s ease ${0.3 + i * 0.1}s, transform 0.5s ease ${0.3 + i * 0.1}s`,
              }}
            >
              <span style={{ fontSize: 18 }}>{a.icon}</span>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.4 }}>
                {a.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactAndFooter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" style={{ padding: "80px 24px 0" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }} ref={ref}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <div className="section-tag">
            <span>✉️</span> Contact
          </div>
          <h2
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
            }}
          >
            Let's Work Together
          </h2>
          <p style={{ color: "var(--text-secondary)", marginTop: 12, fontSize: 15 }}>
            Have a project in mind? I'd love to hear from you.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 32,
            marginBottom: 0,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {/* Contact Info */}
          <div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 24,
              }}
            >
              Get in Touch
            </h3>

            {[
              {
                icon: "📧",
                label: "Email",
                value: "ithakur2327@gmail.com",
                href: "mailto:ithakur2327@gmail.com",
              },
              {
                icon: "📱",
                label: "Phone",
                value: "+91 7859096326",
                href: "tel:+917859096326",
              },
              {
                icon: "💼",
                label: "LinkedIn",
                value: "Connect with me",
                href: "https://linkedin.com",
              },
              {
                icon: "⌨️",
                label: "GitHub",
                value: "See my code",
                href: "https://github.com",
              },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 0",
                  borderBottom: "1px solid var(--border)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                  color: "inherit",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "inherit";
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <div>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 2 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{item.value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { key: "name", label: "Name", type: "text", placeholder: "Your name" },
                { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
              ].map((field) => (
                <div key={field.key}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      marginBottom: 6,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: 8,
                      border: "1px solid var(--border)",
                      background: "var(--bg-card)",
                      color: "var(--text-primary)",
                      fontSize: 14,
                      outline: "none",
                      transition: "border-color 0.2s",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    onFocus={(e) => {
                      (e.target as HTMLElement).style.borderColor = "var(--accent)";
                    }}
                    onBlur={(e) => {
                      (e.target as HTMLElement).style.borderColor = "var(--border)";
                    }}
                  />
                </div>
              ))}

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  Message
                </label>
                <textarea
                  placeholder="Tell me about your project..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--bg-card)",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    outline: "none",
                    resize: "vertical",
                    fontFamily: "'DM Sans', sans-serif",
                    transition: "border-color 0.2s",
                  }}
                  onFocus={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--accent)";
                  }}
                  onBlur={(e) => {
                    (e.target as HTMLElement).style.borderColor = "var(--border)";
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: "13px 24px",
                  borderRadius: 10,
                  background: sent ? "var(--green)" : "var(--accent)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 15,
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.3s, transform 0.2s",
                  fontFamily: "'Syne', sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {sent ? "✓ Message Sent!" : "Send Message →"}
              </button>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 80,
            padding: "32px 0",
            borderTop: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: "var(--text-primary)",
              }}
            >
              IT<span style={{ color: "var(--accent)" }}>.</span>
            </span>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
              Indresh Thakur — Full-Stack & AI Developer
            </p>
          </div>

          <div style={{ display: "flex", gap: 20 }}>
            {["GitHub", "LinkedIn", "Email"].map((link) => (
              <a
                key={link}
                href="#"
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                }}
              >
                {link}
              </a>
            ))}
          </div>

          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} Indresh Thakur
          </p>
        </div>
      </div>
    </section>
  );
}
