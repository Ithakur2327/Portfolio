"use client";
import { useReveal } from "./useReveal";

const ABOUT_POINTS = [
  "Computer science student (AI specialization) at NIET, Greater Noida — passionate about building full-stack web apps and generative AI systems.",
  "Experienced with React, Next.js, Node.js, and LLM APIs. Built production-level projects integrating RAG pipelines, vector databases, and multimodal AI.",
  "Active open-source contributor at GSSOC Extended Edition 2025 and hackathon participant at Smart India Hackathon 2025.",
  "Currently interning as Web Developer at Unstop (Jun–Aug 2025), gaining hands-on experience in real-world product development.",
];

const STATS = [
  { num: "2+", label: "Years Coding" },
  { num: "5+", label: "Projects Built" },
  { num: "3+", label: "AI Integrations" },
  { num: "7.5", label: "CGPA" },
];

// Simple mock GitHub contribution grid
function GitHubContributions() {
  const weeks = 20;
  const days = 7;
  // Deterministic random-looking levels
  const level = (w: number, d: number) => {
    const seed = (w * 7 + d + 13) % 17;
    if (seed < 5) return 0;
    if (seed < 9) return 1;
    if (seed < 12) return 2;
    if (seed < 15) return 3;
    return 4;
  };

  return (
    <div style={{ marginTop: 28 }}>
      <p className="section-label" style={{ marginBottom: 10 }}>Contributions</p>
      <div style={{ display: "flex", gap: 3, overflowX: "auto", paddingBottom: 4 }}>
        {Array.from({ length: weeks }, (_, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {Array.from({ length: days }, (_, d) => (
              <div
                key={d}
                className="contrib-cell"
                data-level={level(w, d)}
                title={`${level(w, d)} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
      <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8 }}>
        Contribution activity — GitHub
      </p>
    </div>
  );
}

export function AboutSection() {
  const { ref, visible } = useReveal();
  const { ref: ref2, visible: vis2 } = useReveal();

  return (
    <>
      <div className="section-separator" />
      <section
        ref={ref}
        style={{
          padding: "32px 0 40px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <p className="section-label">About</p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {ABOUT_POINTS.map((text, i) => (
            <div
              key={i}
              className="about-item"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(8px)",
                transition: `opacity 0.4s var(--expo-out) ${0.07 * i}s, transform 0.4s var(--expo-out) ${0.07 * i}s`,
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(10px)",
            transition: "opacity 0.5s var(--expo-out) 0.3s, transform 0.5s var(--expo-out) 0.3s",
          }}
        >
          {STATS.map(s => (
            <div key={s.label} className="stat-badge">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        <GitHubContributions />
      </section>
    </>
  );
}