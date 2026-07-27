"use client";

import { useRef, memo, forwardRef, useEffect, useState } from "react";
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

/* Skills are split into two themed boxes: languages/full-stack, and
   genai/devops/tools. Note: the old invert/bright/keepInLight flags above
   are still not read for image filtering (see FallingIcon) — each chip's
   card background follows the site theme (via --bg-secondary) instead of
   always being light, so every logo still shows in its real, unfiltered
   brand color without needing per-icon color hacks. */
const LANG_FULLSTACK_TECH = [
  "Python", "Java", "C++", "TypeScript", "JavaScript",
  "React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Framer Motion", "shadcn/ui",
  "Node.js", "Express.js", "REST APIs", "FastAPI", "GraphQL",
];
const GENAI_DEVOPS_TOOLS_TECH = [
  "AI", "LangChain", "LangGraph", "RAG", "Vector DB",
  "AWS", "Kubernetes", "Docker", "CI/CD", "Vercel",
  "MongoDB", "MySQL", "PostgreSQL", "Git", "GitHub", "Postman", "VS Code",
];

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
   it. No tooltip — the name label is the only text shown. Position is
   written directly to the DOM node by the physics loop in FallingIconsBox
   — never rotation, only translate — so the card always stays upright. */
const FallingIcon = memo(forwardRef<HTMLDivElement, { name: string }>(function FallingIcon({ name }, ref) {
  const tech = TECH[name] ?? { color: "#8a8a8a", logo: "" };

  return (
    <div
      ref={ref}
      className="falling-icon-chip"
      style={{
        background: `linear-gradient(155deg, var(--bg-secondary) 0%, var(--bg-secondary) 52%, ${tech.color}22 100%)`,
        borderColor: `${tech.color}4d`,
      }}
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
    </div>
  );
}));
FallingIcon.displayName = "FallingIcon";

/* The falling-icons box: every skill card starts laid out in a tidy grid,
   then — once scrolled into view — drops into a physics-driven pile inside
   the dashed box, exactly like the FallingText word-drop effect but with
   skill icons instead of words. Cards stay mouse/touch-draggable after
   settling, never rotate, and use a transform-only render loop (no
   Matter.Render, no Matter.Runner) to stay light on mobile. Each instance
   is self-contained (own engine/refs), so two can run side by side.

   Containment + scroll handling:
   - Every body's center is hard-clamped every frame to stay strictly
     inside the box (using each chip's own half-width/half-height), so
     dragging or piling up can never push a card past the dashed border,
     regardless of drag speed or stacking.
   - Matter's own Mouse module unconditionally calls preventDefault() on
     every touchmove (blocking page scroll anywhere over the box) and on
     every wheel event (blocking desktop scroll while hovering the box).
     Both of those default listeners are removed and replaced: wheel
     scrolling is left completely alone, and touch scrolling is only
     intercepted while a chip is actively being dragged — everywhere else
     in the box, a swipe scrolls the page normally, on both touch and
     desktop trackpads/mice. */
function FallingIconsBox({ title, items }: { title: string; items: string[] }) {
  const { ref: boxRef, inView } = useBoxInView();
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Icons drop in once on first scroll into view; they don't re-drop on
  // subsequent scroll passes.
  const [hasAppeared, setHasAppeared] = useState(false);
  useEffect(() => { if (inView) setHasAppeared(true); }, [inView]);

  useEffect(() => {
    if (!hasAppeared) return;
    const box = boxRef.current;
    if (!box) return;

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint } = Matter;

    let rect = box.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const engine = Engine.create({
      positionIterations: 10,
      velocityIterations: 8,
      constraintIterations: 4,
    });
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
        restitution: 0.4,
        frictionAir: 0.02,
        friction: 0.3,
        chamfer: { radius: 10 },
        inertia: Infinity, // never rotate — cards always stay upright
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0 });
      return { el, body, hw: r.width / 2, hh: r.height / 2 };
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
    // Matter's TS defs don't declare these handler properties on Mouse,
    // even though they exist at runtime (that's how Matter wires up its
    // own DOM listeners internally) — this local type just lets us refer
    // to them without `any` scattered everywhere below.
    type MouseHandlers = Matter.Mouse & {
      mousewheel: (event: Event) => void;
      mousedown: (event: Event) => void;
      mousemove: (event: Event) => void;
      mouseup: (event: Event) => void;
    };
    const mouse = Mouse.create(box) as MouseHandlers;

    // Strip Matter's own wheel + touch listeners (see note above), then
    // rewire touch so only an in-progress chip-drag blocks page scroll.
    box.removeEventListener("mousewheel", mouse.mousewheel);
    box.removeEventListener("DOMMouseScroll", mouse.mousewheel);
    box.removeEventListener("touchstart", mouse.mousedown);
    box.removeEventListener("touchmove", mouse.mousemove);
    box.removeEventListener("touchend", mouse.mouseup);

    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    const handleTouchStart = (e: TouchEvent) => mouse.mousedown(e);
    const handleTouchMove = (e: TouchEvent) => {
      // Nothing grabbed yet -> this is just a page swipe, let it scroll.
      if (!mouseConstraint.body) return;
      e.preventDefault();
      mouse.mousemove(e);
    };
    const handleTouchEnd = (e: TouchEvent) => mouse.mouseup(e);

    box.addEventListener("touchstart", handleTouchStart, { passive: true });
    box.addEventListener("touchmove", handleTouchMove, { passive: false });
    box.addEventListener("touchend", handleTouchEnd, { passive: true });
    box.addEventListener("touchcancel", handleTouchEnd, { passive: true });

    World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...pieces.map(p => p.body)]);

    let rafId = 0;
    let lastTime = performance.now();
    const tick = (time: number) => {
      const delta = Math.min(time - lastTime, 1000 / 30);
      lastTime = time;
      Engine.update(engine, delta);
      pieces.forEach(({ el, body, hw, hh }) => {
        // Hard containment backstop: whatever the collision solver does,
        // a chip's center can never end up outside the box's interior —
        // this is what stops drags/piling from ever poking past the
        // dashed border.
        const maxX = Math.max(hw, rect.width - hw);
        const maxY = Math.max(hh, rect.height - hh);
        const clampedX = Math.min(Math.max(body.position.x, hw), maxX);
        const clampedY = Math.min(Math.max(body.position.y, hh), maxY);
        if (clampedX !== body.position.x || clampedY !== body.position.y) {
          Body.setPosition(body, { x: clampedX, y: clampedY });
          Body.setVelocity(body, { x: body.velocity.x * 0.3, y: Math.min(body.velocity.y, 0) });
        }
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
      box.removeEventListener("touchstart", handleTouchStart);
      box.removeEventListener("touchmove", handleTouchMove);
      box.removeEventListener("touchend", handleTouchEnd);
      box.removeEventListener("touchcancel", handleTouchEnd);
      clearTimeout(resizeTimer);
      cancelAnimationFrame(rafId);
      World.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [hasAppeared, boxRef]);

  return (
    <div className="falling-icons-panel">
      <div className="falling-icons-title">{title}</div>
      <div ref={boxRef} className="falling-icons-box">
        <span className="falling-icons-hint">{"// drag the icons"}</span>
        <div className="falling-icons-flow">
          {items.map((name, i) => (
            <FallingIcon
              key={name}
              name={name}
              ref={el => { iconRefs.current[i] = el; }}
            />
          ))}
        </div>
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
        .falling-icons-row {
          display: flex;
          align-items: stretch;
          gap: 20px;
        }
        .falling-icons-panel {
          flex: 1 1 0;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .falling-icons-title {
          font-family: ${SF};
          font-size: 14px;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: var(--text-primary);
          text-align: center;
          margin-bottom: 10px;
        }

        .falling-icons-box {
          position: relative;
          overflow: hidden;
          border: 0.7px dashed rgba(0,0,0,0.32);
          border-radius: 14px;
          background: #ffffff;
          min-height: 300px;
          flex: 1;
          touch-action: pan-y;
        }
        .dark .falling-icons-box {
          border-color: rgba(255,255,255,0.32);
          background: #000000;
        }
        .falling-icons-flow {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          align-content: flex-start;
          justify-content: center;
          gap: 10px;
          padding: 38px 20px 22px;
        }
        .falling-icons-hint {
          position: absolute; top: 14px; right: 16px; z-index: 2;
          font-family: ${MONO}; font-size: 10.5px; letter-spacing: 0.02em;
          color: var(--text-muted); pointer-events: none; user-select: none;
        }

        .falling-icon-chip {
          width: 50px; height: 58px;
          padding: 7px 3px 6px;
          display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
          gap: 4px;
          border-radius: 12px; border: 1px solid;
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
          border-radius: 12px;
          background: linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.2) 32%, transparent 55%);
          pointer-events: none;
        }
        .dark .falling-icon-chip {
          box-shadow:
            0 10px 18px -8px rgba(0,0,0,0.55),
            0 2px 5px rgba(0,0,0,0.35),
            inset 0 1px 0 rgba(255,255,255,0.12);
        }
        .dark .falling-icon-chip::before {
          background: linear-gradient(165deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 32%, transparent 55%);
        }
        .falling-icon-chip:active { cursor: grabbing; }
        .falling-icon-chip img {
          width: 21px; height: 21px; object-fit: contain;
          pointer-events: none; -webkit-user-drag: none;
          position: relative; z-index: 1;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.28));
        }
        .falling-icon-name {
          position: relative; z-index: 1;
          font-family: ${MONO}; font-size: 7.5px; font-weight: 600; letter-spacing: 0.01em;
          color: var(--text-primary); text-align: center; line-height: 1.15;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; max-width: 100%;
        }

        ${mq.mobile} {
          .skills-inner { padding: 0 16px 28px !important; }
          .falling-icons-row { flex-direction: column; gap: 16px; }
          .falling-icons-box { border-radius: 12px; min-height: 260px; }
          .falling-icons-flow { padding: 34px 12px 16px; gap: 8px; }
          .falling-icon-chip { width: 44px; height: 50px; border-radius: 11px; gap: 4px; padding: 6px 3px 5px; }
          .falling-icon-chip img { width: 18px; height: 18px; }
          .falling-icon-name { font-size: 7px; }
          .falling-icons-title { font-size: 12.5px; margin-bottom: 8px; }
        }

        @media ${cond.down(BP.mobileXsMax)} {
          .falling-icons-box { min-height: 220px; }
          .falling-icon-chip { width: 38px; height: 44px; border-radius: 10px; }
          .falling-icon-chip img { width: 15px; height: 15px; }
          .falling-icon-name { font-size: 6.2px; }
          .falling-icons-hint { font-size: 8.5px; top: 8px; right: 9px; }
          .falling-icons-title { font-size: 11.5px; }
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

            <div className="falling-icons-row">
              <FallingIconsBox title="Languages & Full Stack" items={LANG_FULLSTACK_TECH} />
              <FallingIconsBox title="GenAI, DevOps & Tools" items={GENAI_DEVOPS_TOOLS_TECH} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}