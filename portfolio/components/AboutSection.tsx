"use client";
import { useReveal } from "./useReveal";

export function AboutSection() {
  const { ref, visible } = useReveal();

  return (
    <section style={{ maxWidth: 680, margin: "0 auto", padding: "0 24px 48px" }}>
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
        <p className="section-heading">About</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {[
            "Computer science student (AI specialization) at NIET, Greater Noida — passionate about building full-stack web apps and generative AI systems.",
            "Experienced with React, Next.js, Node.js, and LLM APIs. Built production-level projects integrating RAG pipelines, vector databases, and multimodal AI.",
            "Active open-source contributor at GSSOC Extended Edition 2025 and hackathon participant at Smart India Hackathon 2025.",
          ].map((text, i) => (
            <div key={i} className="about-item">{text}</div>
          ))}
        </div>
      </div>
    </section>
  );
}
