"use client";
import { useReveal } from "./useReveal";

const education = [
  {
    school: "Noida Institute of Engineering and Technology",
    degree: "B.Tech — Computer Science & Engineering (AI)",
    period: "08.2023—",
    detail: "CGPA: 7.5 / 10",
    location: "Greater Noida",
  },
  {
    school: "L.N.J School",
    degree: "Class XII — BSEB",
    period: "2021",
    detail: "Percentage: 70%",
    location: "Madhubani, Bihar",
  },
];

const certifications = [
  { title: "MERN Stack", issuer: "Coursera", year: "2024" },
  { title: "Principles of Generative AI", issuer: "Infosys Springboard", year: "2024" },
];

const activities = [
  { title: "Contributor — GSSOC Extended Edition", period: "2025" },
  { title: "Smart India Hackathon (SIH) Participant", period: "2025" },
  { title: "Web Development Intern @ Unstop", period: "Jun–Aug 2025" },
];

export function EducationSection() {
  const { ref, visible } = useReveal();
  const { ref: ref2, visible: vis2 } = useReveal();
  const { ref: ref3, visible: vis3 } = useReveal();

  return (
    <>
      {/* Education */}
      <section id="education" style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 48px" }}>
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
          <p className="section-heading">Education</p>
          <div>
            {education.map((edu, i) => (
              <div key={i} className="exp-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>
                      {edu.school}
                    </p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>{edu.degree}</p>
                    <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{edu.location}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{edu.period}</p>
                    <span className="tag" style={{ marginTop: 6, display: "inline-block" }}>{edu.detail}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 48px" }}>
        <div className="section-sep" />
        <div
          ref={ref2}
          style={{
            paddingTop: 40,
            opacity: vis2 ? 1 : 0,
            transform: vis2 ? "none" : "translateY(14px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <p className="section-heading">Certifications[{certifications.length}]</p>
          <div>
            {certifications.map((cert, i) => (
              <div key={i} className="cert-card">
                <div style={{
                  width: 32, height: 32, borderRadius: 6, background: "var(--bg-hover)",
                  border: "1px solid var(--border)", display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 14, flexShrink: 0,
                }}>🏆</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", marginBottom: 2 }}>{cert.title}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: 12 }}>
                    {cert.issuer} · {cert.year}
                  </p>
                </div>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>↗</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 48px" }}>
        <div className="section-sep" />
        <div
          ref={ref3}
          style={{
            paddingTop: 40,
            opacity: vis3 ? 1 : 0,
            transform: vis3 ? "none" : "translateY(14px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          <p className="section-heading">Activities & Internship</p>
          <div>
            {activities.map((a, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0",
                borderBottom: i < activities.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <span style={{ fontSize: 13.5, color: "var(--text-secondary)" }}>{a.title}</span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", flexShrink: 0 }}>{a.period}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
