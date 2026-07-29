"use client";

import { useRef, memo, forwardRef, useEffect, useState } from "react";
import Matter from "matter-js";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { BP, cond, mq } from "@/lib/breakpoints";

// Fonts
const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// Tech
type TechDef = { color: string; logo: string; textIcon?: string; bright?: boolean; invert?: boolean; keepInLight?: boolean };

const TECH: Record<string, TechDef> = {
  Python:         { color: "#3776AB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  Java:           { color: "#ED8B00", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg" },
  "C++":          { color: "#00599C", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg" },
  TypeScript:     { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  JavaScript:     { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "React.js":     { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":      { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", bright: true, keepInLight: true },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  HTML5:          { color: "#E34F26", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  CSS3:           { color: "#1572B6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  "Framer Motion": { color: "#0055FF", logo: "https://cdn.simpleicons.org/framer/0055FF" },
  "shadcn/ui":    { color: "#555555", logo: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4", invert: true },
  "Node.js":      { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain-wordmark.svg" },
  "Express.js":   { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invert: true },
  "REST APIs":    { color: "#85EA2D", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swagger/swagger-original.svg" },
  FastAPI:        { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  GraphQL:        { color: "#E10098", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg" },
  "AI":           { color: "#10a37f", logo: "", textIcon: "AI" },
  LangChain:      { color: "#1C9E6E", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langchain-color.png" },
  LangGraph:      { color: "#2ecc71", logo: "https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/langgraph-color.png" },
  RAG:            { color: "#ee4c2c", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg" },
  "Vector DB":    { color: "#FF6333", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" },
  AWS:            { color: "#FF9900", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg", bright: true },
  Kubernetes:     { color: "#326CE5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  Docker:         { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  "CI/CD":        { color: "#f05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
  Vercel:         { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", invert: true },
  MongoDB:        { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  MySQL:          { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  PostgreSQL:     { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  Git:            { color: "#F05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  GitHub:         { color: "#555555", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert: true },
  Postman:        { color: "#FF6C37", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
  "VS Code":      { color: "#007ACC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
};

// Skills
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

// Hook
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

// Icon
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
      {tech.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={tech.logo}
          alt={name}
          draggable={false}
          className={tech.invert ? "invert-in-dark" : undefined}
          onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
      ) : tech.textIcon ? (
        <span className="falling-icon-textmark" style={{ color: tech.color }}>{tech.textIcon}</span>
      ) : null}
      <span className="falling-icon-name">{name}</span>
    </div>
  );
}));
FallingIcon.displayName = "FallingIcon";

// Physics
function FallingIconsBox({ title, items }: { title: string; items: string[] }) {
  const { ref: boxRef, inView } = useBoxInView();
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [hasAppeared, setHasAppeared] = useState(false);
  useEffect(() => { if (inView) setHasAppeared(true); }, [inView]);

  const inViewRef = useRef(inView);
  useEffect(() => { inViewRef.current = inView; }, [inView]);

  useEffect(() => {
    if (!hasAppeared) return;
    const box = boxRef.current;
    if (!box) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    const start = () => {
      if (cancelled) return;
      const { Engine, World, Bodies, Body, Mouse, MouseConstraint } = Matter;

      let rect = box.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

    const engine = Engine.create();
    engine.world.gravity.y = 0;

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
        inertia: Infinity,
      });
      Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0 });
      return { el, body, hw: r.width / 2, hh: r.height / 2 };
    });

    pieces.forEach(({ el }) => {
      el.style.position = "absolute";
      el.style.left = "0px";
      el.style.top = "0px";
      el.style.margin = "0";
    });

    type MouseHandlers = Matter.Mouse & {
      mousewheel: (event: Event) => void;
      mousedown: (event: Event) => void;
      mousemove: (event: Event) => void;
      mouseup: (event: Event) => void;
    };
    const mouse = Mouse.create(box) as MouseHandlers;

    box.removeEventListener("wheel", mouse.mousewheel);
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

    let lastScrollY = window.scrollY;
    let scrollImpulse = 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = Math.max(-80, Math.min(80, currentY - lastScrollY));
      lastScrollY = currentY;
      scrollImpulse += delta;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    let rafId = 0;
    let lastTime = performance.now();
    const tick = (time: number) => {
      if (!inViewRef.current) {
        lastTime = time;
        rafId = requestAnimationFrame(tick);
        return;
      }

      const delta = Math.min(time - lastTime, 1000 / 30);
      lastTime = time;
      Engine.update(engine, delta);

      const kick = scrollImpulse !== 0 ? Math.max(-2.5, Math.min(2.5, -scrollImpulse * 0.045)) : 0;
      scrollImpulse = 0;

      pieces.forEach(({ el, body, hw, hh }) => {
        if (kick !== 0) {
          Body.setVelocity(body, { x: body.velocity.x, y: body.velocity.y + kick });
        }
        const maxX = Math.max(hw, rect.width - hw);
        const maxY = Math.max(hh, rect.height - hh);
        const clampedX = Math.min(Math.max(body.position.x, hw), maxX);
        const clampedY = Math.min(Math.max(body.position.y, hh), maxY);
        if (clampedX !== body.position.x || clampedY !== body.position.y) {
          Body.setPosition(body, { x: clampedX, y: clampedY });
          Body.setVelocity(body, { x: body.velocity.x * 0.3, y: Math.min(body.velocity.y, 0) });
        }
        const px = Math.round(body.position.x);
        const py = Math.round(body.position.y);
        el.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
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

      cleanup = () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll);
        box.removeEventListener("touchstart", handleTouchStart);
        box.removeEventListener("touchmove", handleTouchMove);
        box.removeEventListener("touchend", handleTouchEnd);
        box.removeEventListener("touchcancel", handleTouchEnd);
        clearTimeout(resizeTimer);
        cancelAnimationFrame(rafId);
        World.clear(engine.world, false);
        Engine.clear(engine);
      };
    };

    const timer = setTimeout(() => requestAnimationFrame(start), 150);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      cleanup?.();
    };
  }, [hasAppeared, boxRef]);

  return (
    <div className="falling-icons-panel">
      <div className="falling-icons-title">{title}</div>
      <div ref={boxRef} className="falling-icons-box">
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

// Export
export function SkillsSection() {
  const { ref, revealClass } = useReveal();

  return (
    <>
      <style suppressHydrationWarning>{`
        .falling-icons-row {
          display: flex;
          align-items: stretch;
          gap: 14px;
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
          border-radius: 4px;
          background: #ffffff;
          min-height: 300px;
          flex: 1;
          user-select: none;
          -webkit-user-select: none;
          contain: layout paint;
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
          gap: 9px;
          padding: 20px 18px;
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
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          box-shadow: 0 6px 12px -6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .dark .falling-icon-chip {
          box-shadow: 0 6px 12px -6px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .falling-icon-chip:active { cursor: grabbing; }
        .falling-icon-chip img {
          width: 20px; height: 20px; object-fit: contain;
          pointer-events: none; -webkit-user-drag: none;
          position: relative; z-index: 1;
          filter: drop-shadow(0 2px 3px rgba(0,0,0,0.28));
        }
        .dark .falling-icon-chip img.invert-in-dark {
          filter: invert(1) drop-shadow(0 2px 3px rgba(0,0,0,0.4));
        }
        .falling-icon-textmark {
          font-weight: 800;
          font-size: 15px;
          line-height: 1;
          letter-spacing: -0.01em;
          position: relative; z-index: 1;
        }
        .falling-icon-name {
          position: relative; z-index: 1;
          font-family: ${MONO}; font-size: 7px; font-weight: 700; letter-spacing: 0.01em;
          color: #161616; text-align: center; line-height: 1.15;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; width: 100%; max-width: 100%;
          word-break: break-word; overflow-wrap: anywhere; hyphens: auto;
          box-sizing: border-box; padding: 0 1px;
        }
        .dark .falling-icon-name {
          color: #f7f7f7;
        }

        ${mq.mobile} {
          .skills-inner { padding: 0 16px 28px !important; }
          .falling-icons-row { flex-direction: column; gap: 16px; }
          .falling-icons-box { border-radius: 4px; min-height: 265px; }
          .falling-icons-flow { padding: 18px 12px; gap: 8px; }
          .falling-icon-chip { width: 45px; height: 51px; border-radius: 11px; gap: 4px; padding: 6px 3px 5px; }
          .falling-icon-chip img { width: 17px; height: 17px; }
          .falling-icon-textmark { font-size: 13px; }
          .falling-icon-name { font-size: 6.6px; }
          .falling-icons-title { font-size: 12.5px; margin-bottom: 8px; }
        }

        @media ${cond.down(BP.mobileXsMax)} {
          .falling-icons-box { min-height: 225px; border-radius: 4px; }
          .falling-icon-chip { width: 38px; height: 44px; border-radius: 10px; }
          .falling-icon-chip img { width: 14px; height: 14px; }
          .falling-icon-textmark { font-size: 11px; }
          .falling-icon-name { font-size: 6px; }
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