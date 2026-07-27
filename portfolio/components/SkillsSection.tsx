"use client";

import { useRef, memo, forwardRef, useEffect, useState, useCallback } from "react";
import Matter from "matter-js";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { BP, cond, mq } from "@/lib/breakpoints";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

/* Tech definitions */
type TechDef = { color: string; logo: string; bright?: boolean; invert?: boolean; keepInLight?: boolean };

const TECH: Record<string, TechDef> = {
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
  "Framer Motion": { color: "#0055FF", logo: "https://cdn.simpleicons.org/framer/0055FF" },
  "shadcn/ui":    { color: "#555555", logo: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4", invert: true },
  // Backend
  "Node.js":      { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain-wordmark.svg" },
  "Express.js":   { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invert: true },
  "REST APIs":    { color: "#85EA2D", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" },
  FastAPI:        { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  GraphQL:        { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  // GenAI / AI
  "AI":           { color: "#10a37f", logo: "https://cdn.simpleicons.org/openai/10a37f" },
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

/* Every skill in TECH falls into the box — nothing is grouped anymore.
   Note: the old invert/bright/keepInLight flags above are no longer read
   for image filtering (see FallingIcon) — every chip now sits on its own
   light card regardless of site theme, so every logo shows in its real,
   unfiltered brand color without needing per-icon color hacks. */
const ALL_TECH = Object.keys(TECH);

/* View-based reveal hook — the box only "wakes up" (starts the physics
   simulation) once it's scrolled into view, not on page load. */
function useBoxInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "-60px 0px -60px 0px", threshold: 0 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

/* Single falling icon card: logo + a permanently-visible name label below
   it, plus a "thought bubble" tooltip that pops up above on hover (desktop)
   or tap (mobile/touch). Position is written directly to the DOM node by
   the physics loop in FallingIconsBox — never rotation, only translate —
   so the card (and therefore its tooltip) always stays upright. */
const FallingIcon = memo(forwardRef<HTMLDivElement, {
  name: string;
  active: boolean;
  onTap: (name: string) => void;
}>(function FallingIcon({ name, active, onTap }, ref) {
  const tech = TECH[name] ?? { color: "#8a8a8a", logo: "" };

  return (
    <div
      ref={ref}
      className={`falling-icon-chip${active ? " tip-active" : ""}`}
      style={{
        background: `linear-gradient(155deg, #ffffff 0%, #ffffff 52%, ${tech.color}22 100%)`,
        borderColor: `${tech.color}4d`,
      }}
      onClick={() => onTap(name)}
    >
      {tech.logo && (
        // eslint-disable-next-line @next/next/no-img-element -- tiny physics-driven skill icon, real brand colors, unfiltered
        <img
          src={tech.logo}
          alt={name}
          draggable={false}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      )}
      <span className="falling-icon-name">{name}</span>

      <div className="falling-icon-tip">
        <span className="tip-bubble">{name}</span>
        <i className="tip-dot tip-dot-a" />
        <i className="tip-dot tip-dot-b" />
      </div>
    </div>
  );
}));
FallingIcon.displayName = "FallingIcon";

/* The falling-icons box: every skill card starts laid out in a tidy grid,
   then — once scrolled into view — drops into a physics-driven pile inside
   the dashed box, exactly like the FallingText word-drop effect but with
   skill icons instead of words. Cards stay mouse/touch-draggable after
   settling, never rotate, and use a transform-only render loop (no
   Matter.Render, no Matter.Runner) to stay light on mobile. */
function FallingIconsBox() {
  const { ref: boxRef, inView } = useBoxInView();
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Icons drop in once on first scroll into view; they don't re-drop on
  // subsequent scroll passes.
  const [hasAppeared, setHasAppeared] = useState(false);
  useEffect(() => { if (inView) setHasAppeared(true); }, [inView]);

  // Tap/click-to-show tooltip (for touch devices, where :hover doesn't
  // apply). Tapping the same card again dismisses it early; otherwise it
  // auto-hides after a couple of seconds.
  const [activeTip, setActiveTip] = useState<string | null>(null);
  const handleTap = useCallback((name: string) => {
    setActiveTip(prev => (prev === name ? null : name));
  }, []);
  useEffect(() => {
    if (!activeTip) return;
    const t = setTimeout(() => setActiveTip(null), 2200);
    return () => clearTimeout(t);
  }, [activeTip]);

  useEffect(() => {
    if (!hasAppeared) return;
    const box = boxRef.current;
    if (!box) return;

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint } = Matter;

    let rect = box.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = 0.85;

    const wallOpts = { isStatic: true, friction: 0.4 };
    let floor      = Bodies.rectangle(rect.width / 2, rect.height + 24, rect.width, 48, wallOpts);
    let leftWall   = Bodies.rectangle(-24, rect.height / 2, 48, rect.height, wallOpts);
    let rightWall  = Bodies.rectangle(rect.width + 24, rect.height / 2, 48, rect.height, wallOpts);
    let ceiling    = Bodies.rectangle(rect.width / 2, -24, rect.width, 48, wallOpts);

    const nodes = iconRefs.current.filter((el): el is HTMLDivElement => !!el);
    const pieces = nodes.map(el => {
      const r = el.getBoundingClientRect();
      const x = r.left - rect.left + r.width / 2;
      const y = r.top - rect.top + r.height / 2;
      const body = Bodies.rectangle(x, y, r.width, r.height, {
        restitution: 0.5,
        frictionAir: 0.02,
        friction: 0.3,
        chamfer: { radius: 10 },
        inertia: Infinity, // never rotate — cards (and their tooltips) always stay upright
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0 });
      return { el, body };
    });

    // Base offset is set once; every frame after this only `transform`
    // changes (GPU-composited), never `left`/`top` — keeps this smooth
    // on mobile instead of forcing a layout reflow 30+ times a frame.
    pieces.forEach(({ el }) => {
      el.style.position = "absolute";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.margin = "0";
    });

    // Mouse/touch input for dragging — no Matter.Render/canvas needed at
    // all, Mouse.create() works directly against any DOM element and
    // recomputes its bounding rect on every event.
    const mouse = Mouse.create(box);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...pieces.map(p => p.body)]);

    let rafId = 0;
    let lastTime = performance.now();
    const tick = (time: number) => {
      const delta = Math.min(time - lastTime, 1000 / 30);
      lastTime = time;
      Engine.update(engine, delta);
      pieces.forEach(({ el, body }) => {
        el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%)`;
      });
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);


    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!box) return;
        rect = box.getBoundingClientRect();
        World.remove(engine.world, [floor, leftWall, rightWall, ceiling]);
        floor      = Bodies.rectangle(rect.width / 2, rect.height + 24, rect.width, 48, wallOpts);
        leftWall   = Bodies.rectangle(-24, rect.height / 2, 48, rect.height, wallOpts);
        rightWall  = Bodies.rectangle(rect.width + 24, rect.height / 2, 48, rect.height, wallOpts);
        ceiling    = Bodies.rectangle(rect.width / 2, -24, rect.width, 48, wallOpts);
        World.add(engine.world, [floor, leftWall, rightWall, ceiling]);
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(rafId);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [hasAppeared, boxRef]);

  return (
    <div ref={boxRef} className="falling-icons-box">
      <span className="falling-icons-hint">{"// drag the icons"}</span>
      <div className="falling-icons-flow">
        {ALL_TECH.map((name, i) => (
          <FallingIcon
            key={name}
            name={name}
            active={activeTip === name}
            onTap={handleTap}
            ref={el => { iconRefs.current[i] = el; }}
          />
        ))}
      </div>
    </div>
  );
}

/* Main export */
export function SkillsSection() {
  const { ref, revealClass } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        .falling-icons-box {
          position: relative;
          overflow: hidden;
          border: 0.7px dashed #000000;
          border-radius: 14px;
          background: #ffffff;
          min-height: 420px;
        }
        .dark .falling-icons-box {
          border-color: #ffffff;
          background: #000000;
        }
        .falling-icons-flow {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: center;
          gap: 14px;
          padding: 46px 24px 28px;
        }
        .falling-icons-hint {
          position: absolute; top: 14px; right: 16px; z-index: 2;
          font-family: ${MONO}; font-size: 10.5px; letter-spacing: 0.02em;
          color: var(--text-muted); pointer-events: none; user-select: none;
        }

        .falling-icon-chip {
          width: 68px; height: 76px;
          padding: 9px 5px 8px;
          display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
          gap: 6px;
          border-radius: 15px; border: 1px solid;
          position: relative; z-index: 1;
          cursor: grab; touch-action: none;
          user-select: none; -webkit-user-select: none;
          will-change: transform;
          box-shadow:
            0 10px 18px -8px rgba(0,0,0,0.35),
            0 2px 5px rgba(0,0,0,0.16),
            inset 0 1px 0 rgba(255,255,255,0.65);
        }
        .falling-icon-chip::before {
          content: "";
          position: absolute; inset: 0; z-index: 0;
          border-radius: 15px;
          background: linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.2) 32%, transparent 55%);
          pointer-events: none;
        }
        .falling-icon-chip:active { cursor: grabbing; }
        .falling-icon-chip img {
          width: 30px; height: 30px; object-fit: contain;
          pointer-events: none; -webkit-user-drag: none;
          position: relative; z-index: 1;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.28));
        }
        .falling-icon-name {
          position: relative; z-index: 1;
          font-family: ${MONO}; font-size: 8.5px; font-weight: 600; letter-spacing: 0.01em;
          color: #333333; text-align: center; line-height: 1.15;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; max-width: 100%;
        }

        .falling-icon-tip {
          position: absolute; bottom: calc(100% + 12px); left: 50%;
          transform: translateX(-50%) translateY(6px) scale(0.85);
          display: flex; flex-direction: column; align-items: center; gap: 4px;
          opacity: 0; pointer-events: none; z-index: 6;
          transition: opacity 0.18s cubic-bezier(.34,1.56,.64,1), transform 0.18s cubic-bezier(.34,1.56,.64,1);
        }
        .tip-bubble {
          padding: 5px 11px; border-radius: 999px;
          background: var(--bg-secondary); border: 1px solid var(--border);
          color: var(--text-primary); font-family: ${MONO}; font-size: 11px; font-weight: 600;
          white-space: nowrap; box-shadow: 0 6px 14px rgba(0,0,0,0.18);
        }
        .tip-dot {
          border-radius: 50%;
          background: var(--bg-secondary); border: 1px solid var(--border);
          box-shadow: 0 3px 6px rgba(0,0,0,0.14);
        }
        .tip-dot-a { width: 8px; height: 8px; }
        .tip-dot-b { width: 5px; height: 5px; }
        .falling-icon-chip:hover .falling-icon-tip,
        .falling-icon-chip.tip-active .falling-icon-tip {
          opacity: 1; transform: translateX(-50%) translateY(0) scale(1);
        }

        ${mq.mobile} {
          .skills-inner { padding: 0 16px 28px !important; }
          .falling-icons-box { border-radius: 12px; min-height: 400px; }
          .falling-icons-flow { padding: 40px 14px 20px; gap: 10px; }
          .falling-icon-chip { width: 58px; height: 66px; border-radius: 13px; gap: 5px; padding: 8px 4px 6px; }
          .falling-icon-chip img { width: 25px; height: 25px; }
          .falling-icon-name { font-size: 7.5px; }
        }

        @media ${cond.down(BP.mobileXsMax)} {
          .falling-icons-box { min-height: 360px; }
          .falling-icon-chip { width: 50px; height: 58px; border-radius: 12px; }
          .falling-icon-chip img { width: 21px; height: 21px; }
          .falling-icon-name { font-size: 7px; }
          .falling-icons-hint { font-size: 9.5px; top: 10px; right: 12px; }
        }
      `}</style>

      <section ref={ref} id="skills" className={revealClass}>
        <div style={{
          position:"relative",
          left:"50%", marginLeft:"-50vw",
          width:"100vw",
          background:"var(--bg-base)",
        }}>
          <div className="skills-inner" style={{ maxWidth: "var(--content-width)", margin:"0 auto", padding:"0 20px 64px" }}>
            <div style={{ paddingTop:50, marginBottom:4, display:"flex", alignItems:"center", gap:10 }}>
              <span style={{
                fontSize:28, fontWeight:700,
                letterSpacing:"-0.03em", lineHeight:1,
                fontFamily:SF, color:"var(--text-primary)",
                display:"inline-flex", alignItems:"center", gap:10,
              }}>
                <SectionTitleIcon type="layers" />
                Skills
              </span>
            </div>
            <div style={{ height:1, background:"var(--border)", margin:"18px 0 18px" }} />

            <FallingIconsBox />
          </div>
        </div>
      </section>
    </>
  );
}