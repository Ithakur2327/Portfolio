"use client";

import React, { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { useReveal } from "./useReveal";

const MONO =
  "'Geist Mono', 'SF Mono', monospace";

const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

/* ──────────────────────────────────────────────────────────
   TECH STACK
────────────────────────────────────────────────────────── */
const TECH: Record<
  string,
  { color: string; logo: string }
> = {
  Python: {
    color: "#3776AB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },

  Java: {
    color: "#ED8B00",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg",
  },

  "C++": {
    color: "#00599C",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },

  TypeScript: {
    color: "#3178C6",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },

  JavaScript: {
    color: "#F7DF1E",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },

  "React.js": {
    color: "#61DAFB",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },

  "Next.js": {
    color: "#aaaaaa",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },

  "Tailwind CSS": {
    color: "#38BDF8",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },

  HTML5: {
    color: "#E34F26",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },

  CSS3: {
    color: "#1572B6",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },

  "Node.js": {
    color: "#339933",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },

  "Express.js": {
    color: "#ffffff",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
  },

  "REST APIs": {
    color: "#6366f1",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },

  FastAPI: {
    color: "#009688",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },

  GraphQL: {
    color: "#E10098",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
  },

  "LLM APIs": {
    color: "#10a37f",
    logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
  },

  LangChain: {
    color: "#1C9E6E",
    logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png",
  },

  LangGraph: {
    color: "#2D6A4F",
    logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langgraph-color.png",
  },

  RAG: {
    color: "#a855f7",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },

  "Vector DB": {
    color: "#FF6333",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },

  MongoDB: {
    color: "#47A248",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },

  MySQL: {
    color: "#4479A1",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },

  PostgreSQL: {
    color: "#4169E1",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },

  Git: {
    color: "#F05032",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },

  GitHub: {
    color: "#aaaaaa",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },

  "VS Code": {
    color: "#007ACC",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },

  Vercel: {
    color: "#aaaaaa",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  },

  Postman: {
    color: "#FF6C37",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  },

  Docker: {
    color: "#2496ED",
    logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
};

/* ──────────────────────────────────────────────────────────
   GROUPS
────────────────────────────────────────────────────────── */
const LAMP_GROUPS = [
  {
    title: "LANGUAGES",
    glowColor: "#3776AB",
    items: [
      "Python",
      "Java",
      "C++",
      "TypeScript",
      "JavaScript",
    ],
  },

  {
    title: "FRONTEND",
    glowColor: "#61DAFB",
    items: [
      "React.js",
      "Next.js",
      "Tailwind CSS",
      "HTML5",
      "CSS3",
    ],
  },

  {
    title: "BACKEND",
    glowColor: "#339933",
    items: [
      "Node.js",
      "Express.js",
      "REST APIs",
      "FastAPI",
      "GraphQL",
    ],
  },

  {
    title: "GENAI / AI",
    glowColor: "#10a37f",
    items: [
      "LLM APIs",
      "LangChain",
      "LangGraph",
      "RAG",
      "Vector DB",
    ],
  },
];

const STRIP_NAMES = [
  "MongoDB",
  "MySQL",
  "PostgreSQL",
  "Git",
  "GitHub",
  "VS Code",
  "Vercel",
  "Postman",
  "Docker",
];

/* ──────────────────────────────────────────────────────────
   SKILL CHIP
────────────────────────────────────────────────────────── */
const SkillChip = memo(function SkillChip({
  name,
  visible,
  delay = 0,
}: {
  name: string;
  visible: boolean;
  delay?: number;
}) {
  const tech =
    TECH[name] ?? {
      color: "#71717a",
      logo: "",
    };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={
        visible
          ? { opacity: 1, y: 0 }
          : { opacity: 0.25, y: 4 }
      }
      transition={{
        delay,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        width: 68,
        cursor: "default",
        willChange: "transform, opacity",
        transform: "translateZ(0)",
      }}
    >
      <div
        style={{
          width: 46,
          height: 46,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 12,
          background: visible
            ? `${tech.color}18`
            : `${tech.color}08`,
          border: `1px solid ${tech.color}${
            visible ? "42" : "20"
          }`,
          transition:
            "transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s cubic-bezier(.22,1,.36,1), background .4s ease",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
        onMouseEnter={(e) => {
          const el =
            e.currentTarget as HTMLDivElement;

          el.style.transform =
            "translate3d(0,-4px,0) scale(1.08)";

          el.style.boxShadow = `0 10px 30px ${tech.color}55`;
        }}
        onMouseLeave={(e) => {
          const el =
            e.currentTarget as HTMLDivElement;

          el.style.transform = "translateZ(0)";
          el.style.boxShadow = "none";
        }}
      >
        {tech.logo && (
          <img
            src={tech.logo}
            alt={name}
            width={26}
            height={26}
            loading="lazy"
            draggable={false}
            style={{
              objectFit: "contain",
              userSelect: "none",
              pointerEvents: "none",
              filter: visible
                ? "none"
                : "grayscale(1) opacity(.35)",
              transition: "filter .35s ease",
              transform: "translateZ(0)",
            }}
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).style.display = "none";
            }}
          />
        )}
      </div>

      <span
        style={{
          fontSize: 9.5,
          fontWeight: 500,
          color: visible
            ? "var(--text-secondary)"
            : "var(--text-muted)",
          fontFamily: MONO,
          textAlign: "center",
          lineHeight: 1.3,
          transition: "color .35s ease",
          userSelect: "none",
        }}
      >
        {name}
      </span>
    </motion.div>
  );
});

/* ──────────────────────────────────────────────────────────
   LAMP BEAM
────────────────────────────────────────────────────────── */
function LampBeam({
  glowColor,
  visible,
}: {
  glowColor: string;
  visible: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {/* PERFECT CENTER LINE */}
      <motion.div
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scaleX: visible ? 1 : 0.25,
        }}
        transition={{
          duration: 0.75,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: "absolute",
          top: 0,
          left: "50%",

          /* FIX */
          x: "-50%",

          width: "74%",
          height: 1.5,

          borderRadius: 999,

          background: `linear-gradient(
            90deg,
            transparent 0%,
            ${glowColor} 18%,
            ${glowColor} 82%,
            transparent 100%
          )`,

          boxShadow: visible
            ? `
              0 0 10px ${glowColor},
              0 0 24px ${glowColor}66
            `
            : "none",

          transformOrigin: "center",

          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
        }}
      />

      {/* MAIN FULL CARD SPOTLIGHT */}
      <motion.div
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.95,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: "absolute",

          /* FIXED CENTER */
          left: "50%",
          top: 0,
          x: "-50%",

          /* FULL CARD COVERAGE */
          width: "180%",
          height: "145%",

          background: `
            radial-gradient(
              ellipse 60% 70% at 50% 0%,
              ${glowColor}30 0%,
              ${glowColor}18 25%,
              ${glowColor}10 45%,
              ${glowColor}08 60%,
              transparent 82%
            )
          `,

          filter: "blur(18px)",

          willChange: "opacity",
          backfaceVisibility: "hidden",
          transform: "translate3d(-50%,0,0)",
        }}
      />

      {/* INNER BRIGHT BEAM */}
      <motion.div
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.8,
          delay: 0.05,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: "absolute",

          left: "50%",
          top: 0,

          /* FIX */
          transform: "translateX(-50%)",

          width: "120%",
          height: "100%",

          background: `
            radial-gradient(
              ellipse 42% 38% at 50% 0%,
              ${glowColor}42 0%,
              ${glowColor}20 35%,
              ${glowColor}10 55%,
              transparent 78%
            )
          `,

          filter: "blur(10px)",

          willChange: "opacity",
          backfaceVisibility: "hidden",
        }}
      />

      {/* EXTRA SOFT LOWER GLOW */}
      <motion.div
        initial={false}
        animate={{
          opacity: visible ? 0.9 : 0,
        }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        style={{
          position: "absolute",

          left: "50%",
          bottom: -60,

          transform: "translateX(-50%)",

          width: "130%",
          height: 180,

          background: `
            radial-gradient(
              ellipse 50% 60% at 50% 0%,
              ${glowColor}10 0%,
              ${glowColor}06 40%,
              transparent 80%
            )
          `,

          filter: "blur(20px)",
        }}
      />
    </div>
  );
}
/* ──────────────────────────────────────────────────────────
   SKILL BOX
────────────────────────────────────────────────────────── */
function LampSkillBox({
  title,
  glowColor,
  items,
}: {
  title: string;
  glowColor: string;
  items: string[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const isInView = useInView(ref, {
    margin: "-80px 0px -80px 0px",
    once: false,
  });

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        minWidth: 0,
        borderRadius: 14,
        border: `1px solid ${glowColor}${
          isInView ? "28" : "12"
        }`,
        background: "var(--bg-card)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition:
          "border-color .45s ease, transform .35s ease",
        willChange: "transform",
        transform: "translateZ(0)",
        minHeight: 285,
      }}
    >
      <LampBeam
        glowColor={glowColor}
        visible={isInView}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          paddingTop: 20,
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {/* TITLE */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 12,
          }}
        >
          <motion.span
            animate={{
              opacity: isInView ? 1 : 0.22,
              y: isInView ? 0 : 4,
            }}
            transition={{
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: isInView
                ? glowColor
                : "var(--text-muted)",
              fontFamily: MONO,
              transition: "color .4s ease",
            }}
          >
            {title}
          </motion.span>
        </div>

        {/* DIVIDER */}
        <div
          style={{
            height: 1,
            margin: "0 14px 18px",
            background: `linear-gradient(
              to right,
              transparent,
              ${glowColor}${isInView ? "35" : "08"},
              transparent
            )`,
          }}
        />

        {/* SKILLS */}
        <div
          style={{
            padding: "0 14px 20px",
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "center",
            alignContent: "flex-start",
            flex: 1,
          }}
        >
          {items.map((name, i) => (
            <SkillChip
              key={name}
              name={name}
              visible={isInView}
              delay={
                isInView ? 0.08 + i * 0.045 : 0
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MOVING STRIP
────────────────────────────────────────────────────────── */
function MovingStrip({
  items,
}: {
  items: string[];
}) {
  const all = [...items, ...items, ...items];

  return (
    <div
      style={{
        overflow: "hidden",
        maskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 10,
          width: "max-content",
          animation:
            "skills-scroll-left 30s linear infinite",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
        onMouseEnter={(e) => {
          (
            e.currentTarget as HTMLDivElement
          ).style.animationPlayState = "paused";
        }}
        onMouseLeave={(e) => {
          (
            e.currentTarget as HTMLDivElement
          ).style.animationPlayState = "running";
        }}
      >
        {all.map((name, idx) => {
          const tech =
            TECH[name] ?? {
              color: "#71717a",
              logo: "",
            };

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "8px 14px",
                borderRadius: 10,
                border: `1px solid ${tech.color}28`,
                background: "var(--bg-card)",
                flexShrink: 0,
                backdropFilter: "blur(10px)",
              }}
            >
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: 6,
                  background: `${tech.color}18`,
                  border: `1px solid ${tech.color}35`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {tech.logo && (
                  <img
                    src={tech.logo}
                    alt={name}
                    width={16}
                    height={16}
                    loading="lazy"
                    draggable={false}
                    style={{
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      (
                        e.target as HTMLImageElement
                      ).style.display = "none";
                    }}
                  />
                )}
              </div>

              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: "var(--text-secondary)",
                  fontFamily: MONO,
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN
────────────────────────────────────────────────────────── */
export function SkillsSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <style>{`
        * {
          -webkit-tap-highlight-color: transparent;
        }

        @keyframes skills-scroll-left {
          from {
            transform: translate3d(0,0,0);
          }

          to {
            transform: translate3d(-33.333%,0,0);
          }
        }

        .skills-lamp-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 12px;
          align-items: stretch;
        }

        @media (max-width: 1100px) {
          .skills-lamp-grid {
            grid-template-columns: repeat(2, minmax(0,1fr));
          }
        }

        @media (max-width: 560px) {
          .skills-lamp-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 480px) {

          .skills-lamp-grid {
            gap: 10px;
          }
        }
      `}</style>

      <div style={{ height: 60 }} />

      <motion.section
        ref={ref}
        initial={{ opacity: 0, y: 14 }}
        animate={
          visible
            ? { opacity: 1, y: 0 }
            : {}
        }
        transition={{
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        id="skills"
        style={{
          marginBottom: 55,
        }}
      >
        <div
          style={{
            position: "relative",
            left: "50%",
            marginLeft: "-50vw",
            width: "100vw",
            background: "var(--bg-base)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              maxWidth: 1060,
              margin: "0 auto",
              padding: "0 20px 40px",
            }}
          >
            {/* TITLE */}
            <div
              style={{
                paddingTop: 28,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  fontFamily: SF,
                  color: "var(--text-primary)",
                  display: "inline-block",
                }}
              >
                Skills
              </span>
            </div>

            {/* LINE */}
            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "18px 0 24px",
              }}
            />

            {/* CARDS */}
            <div className="skills-lamp-grid">
              {LAMP_GROUPS.map((g) => (
                <LampSkillBox
                  key={g.title}
                  {...g}
                />
              ))}
            </div>

            {/* STRIP */}
            <div
              style={{
                marginTop: 28,
                marginLeft: -20,
                marginRight: -20,
              }}
            >
              <MovingStrip items={STRIP_NAMES} />
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}