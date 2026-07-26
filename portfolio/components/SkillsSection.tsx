"use client";

import { useRef, memo, forwardRef, useEffect, useState } from "react";
import Matter from "matter-js";
import { useReveal } from "./useReveal";
import { useTheme } from "./ThemeProvider";
import { SectionTitleIcon } from "./SectionIcon";
import { BP, cond, mq } from "@/lib/breakpoints";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

/* Tiffany & Co. blue — Pantone 1837, the box's dashed border color */
const TIFFANY = "#ffffff";

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
  "AI":           { color: "#10a37f", logo: "https://cdn.simpleicons.org/openai/10a37f", invert: false },
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

/* Every skill in TECH falls into the box — nothing is grouped anymore */
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

/* Single falling icon chip. Position/rotation are written directly to the
   DOM node by the physics loop in FallingIconsBox (see the rAF `tick`
   below) — not through React state — so this stays a plain forwarded-ref
   element instead of re-rendering every frame. */
const FallingIcon = memo(forwardRef<HTMLDivElement, { name: string; isDark: boolean }>(
  function FallingIcon({ name, isDark }, ref) {
    const tech = TECH[name] ?? { color: "#71717a", logo: "" };

    const filter = isDark
      ? tech.invert ? "invert(1) brightness(0.92)" : tech.bright ? "brightness(1.8) contrast(1.1)" : "none"
      : tech.bright && !tech.keepInLight ? "brightness(0.1) saturate(0)" : "none";

    return (
      <div
        ref={ref}
        className="falling-icon-chip"
        style={{ background: `${tech.color}18`, borderColor: `${tech.color}40` }}
      >
        {tech.logo && (
          // eslint-disable-next-line @next/next/no-img-element -- tiny physics-driven skill icon
          <img
            src={tech.logo}
            alt={name}
            draggable={false}
            style={{ filter }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <span className="falling-icon-tip">{name}</span>
      </div>
    );
  }
));
FallingIcon.displayName = "FallingIcon";

/* The falling-icons box: every skill icon starts laid out in a tidy grid,
   then — once scrolled into view — drops into a physics-driven pile inside
   the dashed box, exactly like the FallingText word-drop effect but with
   skill icons instead of words. Pieces stay mouse/touch-draggable after
   settling. */
function FallingIconsBox() {
  const { ref: boxRef, inView } = useBoxInView();
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Icons drop in once on first scroll into view; they don't re-drop on
  // subsequent scroll passes.
  const [hasAppeared, setHasAppeared] = useState(false);
  useEffect(() => { if (inView) setHasAppeared(true); }, [inView]);

  useEffect(() => {
    if (!hasAppeared) return;
    const box = boxRef.current;
    const canvasHost = canvasHostRef.current;
    if (!box || !canvasHost) return;

    const { Engine, Render, World, Bodies, Body, Runner, Mouse, MouseConstraint } = Matter;

    let rect = box.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = 0.85;

    // Invisible render target — only needed so MouseConstraint has a
    // canvas to hang off of. Nothing is actually drawn (fillStyle is
    // transparent everywhere); the icon chips are real DOM elements whose
    // position/rotation the rAF loop below copies from the physics bodies.
    const render = Render.create({
      element: canvasHost,
      engine,
      options: { width: rect.width, height: rect.height, background: "transparent", wireframes: false },
    });

    const wallOpts = { isStatic: true, friction: 0.4, render: { fillStyle: "transparent" } };
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
        render: { fillStyle: "transparent" },
        restitution: 0.5,
        frictionAir: 0.02,
        friction: 0.3,
        chamfer: { radius: 8 },
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0 });
      Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
      return { el, body };
    });

    pieces.forEach(({ el, body }) => {
      el.style.position  = "absolute";
      el.style.left      = `${body.position.x}px`;
      el.style.top        = `${body.position.y}px`;
      el.style.margin     = "0";
      el.style.transform  = "translate(-50%,-50%)";
    });

    const mouse = Mouse.create(box);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    render.mouse = mouse;

    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...pieces.map(p => p.body)]);

    const runner = Runner.create();
    Runner.run(runner, engine);
    Render.run(render);

    let rafId = 0;
    const tick = () => {
      pieces.forEach(({ el, body }) => {
        el.style.left      = `${body.position.x}px`;
        el.style.top       = `${body.position.y}px`;
        el.style.transform = `translate(-50%,-50%) rotate(${body.angle}rad)`;
      });
      rafId = requestAnimationFrame(tick);
    };
    tick();

    // Keep the box's walls in sync if the viewport is resized/rotated.
    // The pieces themselves are left alone so a settled pile isn't
    // disturbed — only the boundaries around it move.
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
      Render.stop(render);
      Runner.stop(runner);
      if (render.canvas && canvasHost) canvasHost.removeChild(render.canvas);
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
            isDark={isDark}
            ref={el => { iconRefs.current[i] = el; }}
          />
        ))}
      </div>
      <div className="falling-icons-canvas-host" ref={canvasHostRef} aria-hidden />
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
          border: .5px dashed ${TIFFANY};
          border-radius: 14px;
          background: #000;
          min-height: 420px;
        }
        .falling-icons-flow {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: center;
          gap: 12px;
          padding: 46px 24px 24px;
        }
        .falling-icons-canvas-host { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .falling-icons-canvas-host canvas { display: block; }
        .falling-icons-hint {
          position: absolute; top: 14px; right: 16px; z-index: 2;
          font-family: ${MONO}; font-size: 10.5px; letter-spacing: 0.02em;
          color: var(--text-muted); pointer-events: none; user-select: none;
        }

        .falling-icon-chip {
          width: 54px; height: 54px;
          display: flex; align-items: center; justify-content: center;
          border-radius: 12px; border: 1px solid;
          position: relative; z-index: 1;
          cursor: grab; touch-action: none;
          user-select: none; -webkit-user-select: none;
          transition: border-color 0.3s ease;
        }
        .falling-icon-chip:active { cursor: grabbing; }
        .falling-icon-chip img {
          width: 26px; height: 26px; object-fit: contain;
          pointer-events: none; -webkit-user-drag: none;
        }
        .falling-icon-tip {
          position: absolute; bottom: calc(100% + 8px); left: 50%;
          transform: translateX(-50%) translateY(4px);
          padding: 4px 9px; border-radius: 6px;
          background: var(--bg-secondary); border: 1px solid var(--border);
          color: var(--text-primary); font-size: 11px; font-weight: 500;
          font-family: ${MONO}; white-space: nowrap;
          opacity: 0; pointer-events: none;
          transition: opacity 0.15s ease, transform 0.15s ease;
          z-index: 5;
        }
        .falling-icon-chip:hover .falling-icon-tip { opacity: 1; transform: translateX(-50%) translateY(0); }

        ${mq.mobile} {
          .skills-inner { padding: 0 16px 28px !important; }
          .falling-icons-box { border-radius: 12px; min-height: 340px; }
          .falling-icons-flow { padding: 40px 16px 18px; gap: 9px; }
          .falling-icon-chip { width: 44px; height: 44px; border-radius: 10px; }
          .falling-icon-chip img { width: 21px; height: 21px; }
        }

        @media ${cond.down(BP.mobileXsMax)} {
          .falling-icons-box { min-height: 300px; }
          .falling-icon-chip { width: 38px; height: 38px; border-radius: 9px; }
          .falling-icon-chip img { width: 18px; height: 18px; }
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