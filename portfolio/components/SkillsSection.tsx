"use client";

import { useRef, memo, useEffect, useState, useCallback } from "react";
import { useLowPerf } from "./PerfMode";
import { useReveal } from "./useReveal";
import { useTheme } from "./ThemeProvider";
import { playThemeToggleSound } from "@/lib/soundcn/sounds";
import { SectionTitleIcon } from "./SectionIcon";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

/* Accent used for the single global lamp toggle (not tied to any one card's color) */
const LAMP_ACCENT = "#FFB020";

/* ─── Tech definitions ─── */
const TECH: Record<string, { color: string; logo: string; bright?: boolean; invert?: boolean; keepInLight?: boolean }> = {
  // Languages
  Python:         { color: "#3776AB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  Java:           { color: "#ED8B00", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  "C++":          { color: "#00599C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  TypeScript:     { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  JavaScript:     { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  // Frontend
  "React.js":     { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":      { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", bright: true, keepInLight: true },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  HTML5:          { color: "#E34F26", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  CSS3:           { color: "#1572B6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  "Framer Motion": { color: "#0055FF", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/framermotion/framermotion-original.svg" },
  "shadcn/ui":    { color: "#000000", logo: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4", invert: false },
  // Backend
  "Node.js":      { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain-wordmark.svg" },
  "Express.js":   { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invert: true },
  "REST APIs":    { color: "#85EA2D", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" },
  FastAPI:        { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  GraphQL:        { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  // GenAI / AI
  "AI":           { color: "#10a37f", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/openai/openai-original.svg", invert: true },
  LangChain:      { color: "#1C9E6E", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png" },
  LangGraph:      { color: "#2ecc71", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langgraph-color.png" },
  RAG:            { color: "#ee4c2c", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":    { color: "#FF6333", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  // Cloud & DevOps
  AWS:            { color: "#FF9900", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", bright: true },
  Kubernetes:     { color: "#326CE5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  Docker:         { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  "CI/CD":        { color: "#f05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
  Vercel:         { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", invert: true },
  // Tools & Database
  MongoDB:        { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  MySQL:          { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  PostgreSQL:     { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  Git:            { color: "#F05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  GitHub:         { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert: true },
  Postman:        { color: "#FF6C37", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
  "VS Code":      { color: "#007ACC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
};

/* All six skill groups now live in ONE flat list — they share a single grid */
const LAMP_GROUPS = [
  { title: "LANGUAGES",        glowColor: "#3776AB", items: ["Python", "Java", "C++", "TypeScript", "JavaScript"] },
  { title: "FRONTEND",         glowColor: "#61DAFB", items: ["React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Framer Motion", "shadcn/ui"] },
  { title: "BACKEND",          glowColor: "#339933", items: ["Node.js", "Express.js", "REST APIs", "FastAPI", "GraphQL"] },
  { title: "CLOUD & DEVOPS",   glowColor: "#FF9900", items: ["AWS", "Kubernetes", "Docker", "CI/CD", "Vercel"] },
  { title: "GENAI / AI",       glowColor: "#10a37f", items: ["AI", "LangChain", "LangGraph", "RAG", "Vector DB"] },
  { title: "TOOLS & DATABASE", glowColor: "#47A248", items: ["MongoDB", "MySQL", "PostgreSQL", "Git", "GitHub", "Postman"] },
];

const STRIP_NAMES = [
  "Python", "TypeScript", "React.js", "Next.js", "Node.js",
  "FastAPI", "GraphQL", "MongoDB", "PostgreSQL", "Docker",
  "AWS", "Kubernetes", "Git", "VS Code", "Postman",
];

/* ─── useBoxInView ─── */
function useBoxInView(lowPerf: boolean) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        const isIn = entry.isIntersecting;
        setInView(isIn);
        if (isIn && lowPerf) obs.disconnect();
      },
      { rootMargin: "-60px 0px -60px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lowPerf]);
  return { ref, inView };
}

/* ─── SkillRow: icon left + name right, horizontal layout ─── */
const SkillRow = memo(function SkillRow({
  name, visible, delay = 0,
}: { name: string; visible: boolean; delay?: number }) {
  const tech   = TECH[name] ?? { color: "#71717a", logo: "" };
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hovered, setHovered] = useState(false);

  const getImgFilter = () => {
    if (!visible) return "grayscale(1) opacity(.3)";
    if (isDark) {
      if (tech.invert) return "invert(1) brightness(0.92)";
      if (tech.bright) return "brightness(1.8) contrast(1.1)";
    } else {
      // keepInLight: logo already reads fine on a light background (e.g. a
      // dark glyph with internal contrast) — darkening it further would
      // crush that internal contrast and make it disappear.
      if (tech.bright && !tech.keepInLight) return "brightness(0.1) saturate(0)";
    }
    return "none";
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", alignItems: "center", gap: 9,
        padding: "6px 10px",
        borderRadius: 7,
        background: hovered
          ? isDark ? `${tech.color}14` : `${tech.color}10`
          : "transparent",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-8px)",
        transition: visible
          ? `opacity 0.42s cubic-bezier(0.22,1,0.36,1) ${delay}s, transform 0.42s cubic-bezier(0.22,1,0.36,1) ${delay}s, background 0.18s ease`
          : "opacity 0.25s ease, transform 0.25s ease, background 0.18s ease",
        cursor: "default",
      }}
    >
      {/* Icon box */}
      <div style={{
        width: 26, height: 26, borderRadius: 6, flexShrink: 0,
        background: `${tech.color}18`,
        border: `1px solid ${tech.color}${visible ? "40" : "18"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.35s ease, transform 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hovered ? "scale(1.08)" : "scale(1)",
      }}>
        {tech.logo && (
          <img
            src={tech.logo} alt={name}
            width={15} height={15}
            loading="lazy" draggable={false}
            style={{
              objectFit: "contain", userSelect: "none", pointerEvents: "none",
              filter: getImgFilter(),
              transition: "filter 0.35s ease",
            }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
      </div>
      {/* Name */}
      <span style={{
        fontSize: 12, fontWeight: 500,
        color: visible
          ? hovered ? "var(--text-primary)" : "var(--text-secondary)"
          : "var(--text-muted)",
        fontFamily: MONO,
        whiteSpace: "nowrap",
        transition: "color 0.18s ease",
        userSelect: "none",
      }}>
        {name}
      </span>
    </div>
  );
});

/* ─── LampBeam (intensity toned down slightly) ─── */
const LampBeam = memo(function LampBeam({ glowColor, visible, lampOn }: { glowColor: string; visible: boolean; lampOn: boolean }) {
  const { theme } = useTheme();
  const isDark    = theme === "dark";
  const active    = visible && lampOn;

  // Dark mode: white lamp; Light mode: colored lamp
  const effectiveColor   = isDark ? "#ffffff" : glowColor;
  const glowIntensity    = isDark ? "06" : "1e";
  const innerIntensity   = isDark ? "0f" : "2c";

  return (
    <div aria-hidden style={{ position:"absolute", inset:0, overflow:"hidden", pointerEvents:"none", zIndex:0, transform:"translateZ(0)", willChange:"opacity" }}>
      {/* Top line beam */}
      <div style={{
        position:"absolute", top:0, left:"50%", transform:"translateX(-50%)",
        width:"74%", height:1.5, borderRadius:999,
        background:`linear-gradient(90deg,transparent 0%,${effectiveColor} 18%,${effectiveColor} 82%,transparent 100%)`,
        boxShadow: active
          ? isDark
            ? `0 0 5px ${effectiveColor}45,0 0 11px ${effectiveColor}26`
            : `0 0 8px ${effectiveColor},0 0 18px ${effectiveColor}50`
          : "0 0 0px transparent",
        opacity: active ? (isDark ? 0.36 : 0.85) : 0,
        transition:"opacity 0.72s cubic-bezier(0.22,1,0.36,1), box-shadow 0.72s ease",
      }} />
      {/* Wide glow cone */}
      <div style={{
        position:"absolute", left:"50%", top:0, transform:"translate3d(-50%,0,0)",
        width:"180%", height:"145%",
        background:`radial-gradient(ellipse 60% 70% at 50% 0%,${effectiveColor}${glowIntensity} 0%,${effectiveColor}0a 25%,${effectiveColor}06 45%,${effectiveColor}03 60%,transparent 82%)`,
        opacity: active ? 0.85 : 0,
        transition:"opacity 0.90s cubic-bezier(0.22,1,0.36,1)",
      }} />
      {/* Inner tight glow */}
      <div style={{
        position:"absolute", left:"50%", top:0, transform:"translateX(-50%)",
        width:"120%", height:"100%",
        background:`radial-gradient(ellipse 42% 38% at 50% 0%,${effectiveColor}${innerIntensity} 0%,${effectiveColor}0a 35%,${effectiveColor}04 55%,transparent 78%)`,
        opacity: active ? 0.85 : 0,
        transition:`opacity 0.78s cubic-bezier(0.22,1,0.36,1) ${active?"0.06s":"0s"}`,
      }} />
    </div>
  );
});

/* ─── Lamp toggle button — reused for the single global control ─── */
function LampToggleButton({ lampOn, onToggle, color, isDark, size = 22 }: { lampOn: boolean; onToggle: () => void; color: string; isDark: boolean; size?: number }) {
  const [hov, setHov] = useState(false);
  // In light theme the lamp stays colored, never plain white/gray.
  const lightColor = isDark ? "#ffffff" : color;
  const iconSize = Math.round(size * 0.6);

  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      title={lampOn ? "Turn off lamps" : "Turn on lamps"}
      style={{
        width: size, height: size, borderRadius: 6, border: "none",
        background: lampOn
          ? isDark ? "rgba(255,255,255,0.12)" : `${color}18`
          : "transparent",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.18s ease, transform 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hov ? "scale(1.12)" : "scale(1)",
        flexShrink: 0,
        padding: 0,
      }}
      aria-label={lampOn ? "Turn off lamps" : "Turn on lamps"}
    >
      <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke={lampOn ? lightColor : "var(--text-muted)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        style={{ transition: "stroke 0.22s ease", filter: lampOn ? (isDark ? `drop-shadow(0 0 3px rgba(255,255,255,0.7))` : `drop-shadow(0 0 3px ${color}aa)`) : "none" }}>
        <path d="M9 21h6"/>
        <path d="M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V18a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1v-3.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"/>
      </svg>
    </button>
  );
}

/* ─── LampSkillBox: a single cell in the shared grid ─── */
function LampSkillBox({ title, glowColor, items, lampOn }: { title: string; glowColor: string; items: string[]; lampOn: boolean }) {
  const lowPerf       = useLowPerf();
  const { ref, inView } = useBoxInView(lowPerf);
  const { theme }     = useTheme();
  const isDark        = theme === "dark";

  // Split items into two columns
  const col1 = items.filter((_, i) => i % 2 === 0);
  const col2 = items.filter((_, i) => i % 2 === 1);

  return (
    <div
      ref={ref}
      className="lamp-skill-box"
      style={{
        overflow: "hidden",
        display: "flex", flexDirection: "column",
        position: "relative",
        transform: "translateZ(0)", backfaceVisibility: "hidden",
      }}
    >
      <LampBeam glowColor={glowColor} visible={inView} lampOn={lampOn} />

      <div style={{ position:"relative", zIndex:1, paddingTop:12, display:"flex", flexDirection:"column", height:"100%" }}>

        {/* Title — single centered element, no per-card button to throw it off-center */}
        <div style={{ padding:"0 12px", marginBottom:10 }}>
          <span style={{
            display: "block", textAlign: "center",
            fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: inView && lampOn ? glowColor : "var(--text-muted)",
            fontFamily: MONO,
            opacity: inView ? 1 : 0.22,
            transform: inView ? "none" : "translateY(4px)",
            transition: "opacity 0.48s cubic-bezier(0.22,1,0.36,1), transform 0.48s cubic-bezier(0.22,1,0.36,1), color 0.42s ease",
          }}>
            {title}
          </span>
        </div>

        {/* Separator */}
        <div style={{
          height: 1, margin: "0 12px 10px",
          background: `linear-gradient(to right,transparent,${glowColor}${inView && lampOn ? "35" : "08"},transparent)`,
          transition: "background 0.5s ease",
        }} />

        {/* Two-column skill rows — divider is absolutely centered, independent of column content */}
        <div style={{ position: "relative", padding: "0 12px 12px", display: "flex", gap: 20, flex: 1 }}>
          {/* Column 1 */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            {col1.map((name, i) => (
              <SkillRow key={name} name={name} visible={inView} delay={inView ? 0.06 + i * 0.05 : 0} />
            ))}
          </div>

          {/* Column 2 */}
          <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            {col2.map((name, i) => (
              <SkillRow key={name} name={name} visible={inView} delay={inView ? 0.09 + i * 0.05 : 0} />
            ))}
          </div>

          {/* Centered partition line — pinned to the true horizontal center */}
          <div aria-hidden style={{
            position: "absolute", left: "50%", top: 4, bottom: 4, width: 1,
            transform: "translateX(-50%)",
            background: `linear-gradient(to bottom, transparent, ${isDark ? "rgba(255,255,255,0.10)" : glowColor + "28"}, transparent)`,
          }} />
        </div>
      </div>
    </div>
  );
}

/* ─── MovingStrip ─── */
const STRIP_ALL = [...STRIP_NAMES, ...STRIP_NAMES, ...STRIP_NAMES];

const MovingStrip = memo(function MovingStrip() {
  const { theme } = useTheme();
  const isDark    = theme === "dark";

  return (
    <div
      className="skills-strip-outer"
      style={{
        overflow: "hidden",
        maskImage: "linear-gradient(to right,transparent,black 8%,black 92%,transparent)",
        WebkitMaskImage: "linear-gradient(to right,transparent,black 8%,black 92%,transparent)",
      }}
    >
      <div
        className="skills-strip"
        style={{
          display:"flex", gap:10, width:"max-content",
          animation:"skills-scroll-left 32s linear infinite",
          willChange:"transform", transform:"translateZ(0)",
        }}
      >
        {STRIP_ALL.map((name, idx) => {
          const tech = TECH[name] ?? { color:"#71717a", logo:"" };
          const stripFilter = isDark
            ? tech.invert ? "invert(1) brightness(0.92)" : tech.bright ? "brightness(1.8) contrast(1.1)" : "none"
            : tech.bright && !tech.keepInLight ? "brightness(0.1) saturate(0)" : "none";
          return (
            <div key={idx} style={{
              display:"flex", alignItems:"center", gap:9,
              padding:"8px 14px", borderRadius:10,
              border:`1px solid ${tech.color}28`,
              background:"var(--bg-card)", flexShrink:0,
            }}>
              <div style={{
                width:26, height:26, borderRadius:6,
                background:`${tech.color}18`, border:`1px solid ${tech.color}35`,
                display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
              }}>
                {tech.logo && (
                  <img src={tech.logo} alt={name} width={16} height={16}
                    loading="lazy" draggable={false}
                    style={{ objectFit:"contain", filter:stripFilter }}
                    onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                )}
              </div>
              <span style={{ fontSize:12, fontWeight:500, color:"var(--text-secondary)", fontFamily:MONO, whiteSpace:"nowrap" }}>
                {name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

/* ─── Main ─── */
export function SkillsSection() {
  const { ref, revealClass } = useReveal();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [lampOn, setLampOn] = useState(true);

  const handleLampToggle = useCallback(() => {
    setLampOn(prev => {
      const next = !prev;
      playThemeToggleSound(next);
      return next;
    });
  }, []);

  return (
    <>
      <style suppressHydrationWarning>{`
        .skills-strip-outer:hover .skills-strip { animation-play-state: paused !important; }

        /* One shared grid: the 1px gap (colored like a border) IS the grid line,
           so every cell shares the same continuous lines — no separate "card" squares. */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--border);
          border: 1px solid var(--border);
          border-radius: 14px;
          overflow: hidden;
        }

        .lamp-skill-box {
          background: var(--bg-base);
          min-height: 184px;
        }

        @media (max-width: 1024px) {
          .skills-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .skills-grid { grid-template-columns: repeat(2, 1fr); }
          .lamp-skill-box { min-height: auto; }
        }

        @media (max-width: 380px) {
          .skills-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <section ref={ref} id="skills" className={revealClass}>
        <div style={{
          position:"relative",
          left:"50%", marginLeft:"-50vw",
          width:"100vw",
          background:"var(--bg-base)",
        }}>
          <div style={{ maxWidth: 1057, margin:"0 auto", padding:"0 20px 40px" }}>
            <div style={{ paddingTop:28, marginBottom:4, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{
                fontSize:28, fontWeight:700,
                letterSpacing:"-0.03em", lineHeight:1,
                fontFamily:SF, color:"var(--text-primary)",
                display:"inline-flex", alignItems:"center", gap:10,
              }}>
                <SectionTitleIcon type="layers" />
                Skills
              </span>
              <LampToggleButton lampOn={lampOn} onToggle={handleLampToggle} color={LAMP_ACCENT} isDark={isDark} />
            </div>
            <div style={{ height:1, background:"var(--border)", margin:"18px 0 24px" }} />

            <div className="skills-grid">
              {LAMP_GROUPS.map(g => <LampSkillBox key={g.title} {...g} lampOn={lampOn} />)}
            </div>

            <div style={{ marginTop:28, marginLeft:-20, marginRight:-20 }}>
              <MovingStrip />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}