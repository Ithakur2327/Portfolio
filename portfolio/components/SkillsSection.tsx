"use client";

import { useRef, memo, forwardRef, useEffect, useState } from "react";
import Matter from "matter-js";
import { useReveal } from "./useReveal";
import { useTheme } from "./ThemeProvider";
import { SectionTitleIcon } from "./SectionIcon";
import { BP, cond, mq } from "@/lib/breakpoints";
import { useMediaQuery } from "@/lib/useBreakpoint";

const MONO = "'Geist Mono', 'SF Mono', monospace";
const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

/* Tech definitions. `invert` marks logos that are basically monochrome
   black marks (GitHub, Vercel, Express, shadcn/ui...) — in dark mode these
   get flipped to white so they stay visible on a dark glass card; every
   other logo keeps its real, unfiltered brand color in both themes. */
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
  "Next.js":      { color: "#8a8a8a", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg", invert: true },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  HTML5:          { color: "#E34F26", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
  CSS3:           { color: "#1572B6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
  "Framer Motion": { color: "#0055FF", logo: "https://cdn.simpleicons.org/framer/0055FF" },
  "shadcn/ui":    { color: "#8a8a8a", logo: "https://avatars.githubusercontent.com/u/139895814?s=200&v=4", invert: true },
  // Backend
  "Node.js":      { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain-wordmark.svg" },
  "Express.js":   { color: "#8a8a8a", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg", invert: true },
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
  AWS:            { color: "#FF9900", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-plain-wordmark.svg" },
  Kubernetes:     { color: "#326CE5", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" },
  Docker:         { color: "#2496ED", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" },
  "CI/CD":        { color: "#f05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" },
  Vercel:         { color: "#8a8a8a", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg", invert: true },
  // Tools & Database
  MongoDB:        { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  MySQL:          { color: "#4479A1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
  PostgreSQL:     { color: "#4169E1", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  Git:            { color: "#F05032", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
  GitHub:         { color: "#8a8a8a", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg", invert: true },
  Postman:        { color: "#FF6C37", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg" },
  "VS Code":      { color: "#007ACC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg" },
};

/* The skillset is split into two falling boxes. */
const GROUP_LANGUAGES_FULLSTACK = [
  "Python", "Java", "C++", "TypeScript", "JavaScript",
  "React.js", "Next.js", "Tailwind CSS", "HTML5", "CSS3", "Framer Motion", "shadcn/ui",
  "Node.js", "Express.js", "REST APIs", "FastAPI", "GraphQL",
];
const GROUP_GENAI_DEVOPS_TOOLS = [
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

/* Single falling icon card: a frosted-glass chip with the logo + a
   permanently-visible name label below it. Position is written directly to
   the DOM node by the physics loop in FallingIconsBox — only ever
   translate, never rotate — so the card stays upright at all times. */
const FallingIcon = memo(forwardRef<HTMLDivElement, { name: string }>(
  function FallingIcon({ name }, ref) {
    const tech = TECH[name] ?? { color: "#8a8a8a", logo: "" };
    const { theme } = useTheme();
    const isDark = theme === "dark";

    // Only the icon itself carries brand color — the chip's glass surface
    // and border stay neutral/theme-aware, no per-tech tinted border.
    const background = isDark
      ? "linear-gradient(155deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.045) 45%, rgba(255,255,255,0.02) 100%)"
      : "linear-gradient(155deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.62) 45%, rgba(255,255,255,0.4) 100%)";
    const filter = isDark && tech.invert
      ? "invert(1) brightness(1.6) drop-shadow(0 3px 5px rgba(0,0,0,0.5))"
      : "drop-shadow(0 3px 5px rgba(0,0,0,0.35))";

    return (
      <div
        ref={ref}
        className={`falling-icon-chip${isDark ? " is-dark" : ""}`}
        style={{ background }}
      >
        {tech.logo && (
          // eslint-disable-next-line @next/next/no-img-element -- tiny physics-driven skill icon, real brand colors, unfiltered
          <img
            src={tech.logo}
            alt={name}
            draggable={false}
            style={{ filter }}
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        )}
        <span className="falling-icon-name">{name}</span>
      </div>
    );
  }
));
FallingIcon.displayName = "FallingIcon";

/* One falling-icons box for a given subset of skills. Cards start laid out
   in a tidy grid, then — once scrolled into view — drop into a
   physics-driven pile inside the dashed box, exactly like the FallingText
   word-drop effect but with skill icons instead of words. Cards stay
   mouse/touch-draggable after settling, never rotate, and use a
   transform-only render loop (no Matter.Render, no Matter.Runner) to stay
   smooth on mobile.

   Three things this guards against:
   1) Scroll vs. drag: a touch only becomes a "drag" once it's held mostly
      still on a card for a short moment. A quick swipe anywhere — even
      starting on a card — is left alone and scrolls the page normally,
      exactly like the rest of the page.
   2) The box's height is locked the instant physics starts, so cards can
      never fall out past the dashed border once the pre-fall grid layout
      (which can be taller than min-height) collapses.
   3) Physics is tuned for a soft, controlled settle rather than a bouncy
      one, and mouse/touch position is read on every animation frame for
      a smooth drag feel. */
function FallingIconsBox({ title, names }: { title: string; names: string[] }) {
  const { ref: boxRef, inView } = useBoxInView();
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Icons drop in once on first scroll into view; they don't re-drop on
  // subsequent scroll passes.
  const [hasAppeared, setHasAppeared] = useState(false);
  useEffect(() => { if (inView) setHasAppeared(true); }, [inView]);

  // Live (non-sticky) in-view flag read inside the render loop — this is
  // what lets the physics tick pause itself the moment the box scrolls
  // off-screen and resume the instant it's back, instead of quietly
  // grinding away below the fold and stealing frame budget from the rest
  // of the page (a big source of the mobile/tablet lag).
  const inViewRef = useRef(inView);
  useEffect(() => { inViewRef.current = inView; }, [inView]);

  // Snapshot of the phone/tablet perf tier, read once when physics boots
  // up (kept in a ref, not a dependency, so an orientation change never
  // tears down and re-drops an already-settled pile).
  const isTabletDown = useMediaQuery(cond.tabletDown);
  const isTabletDownRef = useRef(isTabletDown);
  useEffect(() => { isTabletDownRef.current = isTabletDown; }, [isTabletDown]);

  useEffect(() => {
    if (!hasAppeared) return;
    const box = boxRef.current;
    if (!box) return;

    const { Engine, World, Bodies, Body, Mouse, MouseConstraint, Events, Sleeping } = Matter;

    let cancelled = false;
    let engine: Matter.Engine | null = null;
    let rafId = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;
    let handleResize: (() => void) | null = null;
    let onTouchStart: ((e: TouchEvent) => void) | null = null;
    let onTouchMove: ((e: TouchEvent) => void) | null = null;
    let onTouchEnd: ((e: TouchEvent) => void) | null = null;
    let clearHold: (() => void) | null = null;

    // Wait for every logo image (and the mono font the labels use) to
    // actually finish loading before measuring anything. This is what
    // fixes the "squished" mobile box: measuring too early — while an
    // icon was still 0px tall mid-load — used to lock the box to a
    // shorter height than the fully-loaded grid really needs, silently
    // clipping the last row(s) against `overflow: hidden`.
    const imgs = Array.from(box.querySelectorAll("img"));
    const imgsReady = imgs.map(img =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>(resolve => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          })
    );
    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    // Never let one slow/blocked CDN icon hold the whole section hostage —
    // fall back to whatever's loaded after a short cap either way.
    const safetyTimeout = new Promise<void>(resolve => setTimeout(resolve, 500));

    Promise.race([Promise.all([fontsReady, ...imgsReady]), safetyTimeout]).then(() => {
      if (cancelled) return;
      // One more paint cycle so layout is fully committed before measuring.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (cancelled) return;
        setup();
      }));
    });

    function setup() {
      if (!box) return;
      let rect = box.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      // Lock the box's height now that the grid is truly, fully laid
      // out — plus a tiny buffer so no row can ever brush the clipped
      // edge.
      box.style.height = `${Math.ceil(rect.height) + 3}px`;

      engine = Engine.create();
      engine.world.gravity.y = 0.78;
      // Cards that have settled stop costing CPU instead of being
      // re-solved forever — this is the other big piece of the mobile
      // lag fix.
      engine.enableSleeping = true;
      if (isTabletDownRef.current) {
        // Fewer solver passes per step — same soft settle, cheaper to
        // compute on the phones/tablets where this section felt laggiest.
        engine.positionIterations = 4;
        engine.velocityIterations = 3;
      }

      const wallOpts = { isStatic: true, friction: 0.5 };
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
          restitution: 0.35,
          frictionAir: 0.028,
          friction: 0.35,
          chamfer: { radius: 10 },
          inertia: Infinity, // never rotate — cards always stay upright
          sleepThreshold: 40, // settles into sleep a little sooner
        });
        Body.setVelocity(body, { x: (Math.random() - 0.5) * 2, y: 0 });
        return { el, body, halfW: r.width / 2, halfH: r.height / 2 };
      });

      // Base offset is set once; every frame after this only `transform`
      // changes (GPU-composited), never `left`/`top` — keeps this smooth
      // on mobile instead of forcing a layout reflow every frame.
      pieces.forEach(({ el }) => {
        el.style.position = "absolute";
        el.style.left = "0px";
        el.style.top = "0px";
        el.style.margin = "0";
      });

      // Mouse input for dragging — no Matter.Render/canvas needed at all,
      // Mouse.create() works directly against any DOM element.
      const mouse = Mouse.create(box) as Matter.Mouse & {
        mousedown: (event: Event) => void;
        mousemove: (event: Event) => void;
        mouseup: (event: Event) => void;
        mousewheel: (event: Event) => void;
      };
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      });
      // A sleeping card should wake the instant it's grabbed, not sit
      // frozen under the cursor/finger. (@types/matter-js doesn't type
      // this event's `body` field, so it's read via a narrow cast.)
      Events.on(mouseConstraint, "startdrag", (event: Matter.IEvent<Matter.MouseConstraint>) => {
        const body = (event as unknown as { body?: Matter.Body }).body;
        if (body) Sleeping.set(body, false);
      });

      // Matter attaches its own touchstart/touchmove/touchend to `box` that
      // unconditionally preventDefault() on every touch — remove them and
      // use our own hold-to-drag logic instead (see note (1) above).
      box.removeEventListener("touchstart", mouse.mousedown);
      box.removeEventListener("touchmove", mouse.mousemove);
      box.removeEventListener("touchend", mouse.mouseup);
      box.removeEventListener("wheel", mouse.mousewheel);

      const HOLD_MS = 160;
      const MOVE_TOLERANCE = 9;
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let holdTimer: ReturnType<typeof setTimeout> | null = null;

      clearHold = () => {
        if (holdTimer) { clearTimeout(holdTimer); holdTimer = null; }
      };

      onTouchStart = (e: TouchEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest(".falling-icon-chip")) return; // not a card — let the page scroll
        const t = e.touches[0];
        startX = t.clientX;
        startY = t.clientY;
        dragging = false;
        clearHold?.();
        holdTimer = setTimeout(() => {
          dragging = true;
          mouse.mousedown(e as unknown as Event);
        }, HOLD_MS);
      };
      onTouchMove = (e: TouchEvent) => {
        if (dragging) {
          e.preventDefault();
          mouse.mousemove(e as unknown as Event);
          return;
        }
        if (holdTimer) {
          const t = e.touches[0];
          if (Math.abs(t.clientX - startX) > MOVE_TOLERANCE || Math.abs(t.clientY - startY) > MOVE_TOLERANCE) {
            clearHold?.(); // moved too fast/far — this is a scroll, not a drag
          }
        }
        // not dragging yet => don't preventDefault, the page scrolls normally
      };
      onTouchEnd = (e: TouchEvent) => {
        clearHold?.();
        if (dragging) {
          dragging = false;
          mouse.mouseup(e as unknown as Event);
        }
      };
      box.addEventListener("touchstart", onTouchStart, { passive: true });
      box.addEventListener("touchmove", onTouchMove, { passive: false });
      box.addEventListener("touchend", onTouchEnd, { passive: false });

      World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...pieces.map(p => p.body)]);

      let lastTime = performance.now();
      const tick = (time: number) => {
        // Scrolled out of view — skip all physics/DOM work this frame.
        // The loop itself stays alive (just one cheap boolean check) so
        // it can resume instantly once the box is back in view, but the
        // rest of the page never has to compete with an invisible
        // simulation for frame budget.
        if (!inViewRef.current) {
          lastTime = time;
          rafId = requestAnimationFrame(tick);
          return;
        }
        const delta = Math.min(time - lastTime, 1000 / 30);
        lastTime = time;
        Engine.update(engine!, delta);
        const w = rect.width, h = rect.height;
        pieces.forEach(({ el, body, halfW, halfH }) => {
          if (body.isSleeping) return; // resting — nothing changed, skip the DOM write
          // Strict containment: no matter how fast a card is flicked/dragged,
          // its center can never leave the box's interior. This is a hard
          // clamp on top of the wall bodies, not a replacement for them.
          const hitX = body.position.x < halfW || body.position.x > w - halfW;
          const hitY = body.position.y < halfH || body.position.y > h - halfH;
          if (hitX || hitY) {
            const cx = Math.min(Math.max(body.position.x, halfW), w - halfW);
            const cy = Math.min(Math.max(body.position.y, halfH), h - halfH);
            Body.setPosition(body, { x: cx, y: cy });
            Body.setVelocity(body, {
              x: hitX ? 0 : body.velocity.x,
              y: hitY ? 0 : body.velocity.y,
            });
          }
          el.style.transform = `translate3d(${body.position.x}px, ${body.position.y}px, 0) translate(-50%, -50%)`;
        });
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);

      // Keep the box's walls in sync if the viewport is resized/rotated.
      // The pieces themselves are left alone so a settled pile isn't
      // disturbed — only the boundaries around it move. (Height stays
      // locked; only width-driven wall positions need to move.)
      handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (!box || !engine) return;
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
    }

    return () => {
      cancelled = true;
      if (handleResize) window.removeEventListener("resize", handleResize);
      if (onTouchStart) box.removeEventListener("touchstart", onTouchStart);
      if (onTouchMove) box.removeEventListener("touchmove", onTouchMove);
      if (onTouchEnd) box.removeEventListener("touchend", onTouchEnd);
      clearHold?.();
      clearTimeout(resizeTimer);
      cancelAnimationFrame(rafId);
      if (engine) {
        World.clear(engine.world, false);
        Engine.clear(engine);
      }
    };
  }, [hasAppeared, boxRef]);

  return (
    <div className="falling-group">
      <div className="falling-group-title">{title}</div>
      <div ref={boxRef} className="falling-icons-box">
        <span className="falling-icons-hint">{"// drag the icons"}</span>
        <div className="falling-icons-flow">
          {names.map((name, i) => (
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
        .falling-groups-row {
          display: flex;
          align-items: flex-start;
          gap: 24px;
        }
        .falling-groups-row > .falling-group {
          flex: 1 1 0;
          min-width: 0;
          margin-top: 0;
        }
        .falling-group { margin-top: 30px; }
        .falling-group:first-child { margin-top: 0; }
        .falling-group-title {
          font-family: ${SF};
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: var(--text-primary);
          margin: 0 0 12px 2px;
        }

        .falling-icons-box {
          position: relative;
          overflow: hidden;
          border: 0.7px dashed rgba(0,0,0,0.55);
          border-radius: 14px;
          background: #ffffff;
          min-height: 340px;
        }
        html.dark .falling-icons-box {
          border-color: rgba(255,255,255,0.55);
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
          padding: 42px 22px 24px;
        }
        .falling-icons-hint {
          position: absolute; top: 14px; right: 16px; z-index: 2;
          font-family: ${MONO}; font-size: 10.5px; letter-spacing: 0.02em;
          color: var(--text-muted); pointer-events: none; user-select: none;
        }

        .falling-icon-chip {
          width: 58px; height: 65px;
          padding: 8px 4px 6px;
          display: flex; flex-direction: column; align-items: center; justify-content: flex-start;
          gap: 5px;
          border-radius: 15px;
          border: 1px solid rgba(0,0,0,0.10);
          position: relative; z-index: 1;
          cursor: grab;
          user-select: none; -webkit-user-select: none;
          will-change: transform;
          contain: layout style;
          backdrop-filter: blur(12px) saturate(170%);
          -webkit-backdrop-filter: blur(12px) saturate(170%);
          box-shadow:
            0 18px 26px -10px rgba(0,0,0,0.5),
            0 4px 8px rgba(0,0,0,0.22),
            inset 0 1px 0 rgba(255,255,255,0.6),
            inset 0 -8px 14px -10px rgba(0,0,0,0.28);
        }
        .falling-icon-chip.is-dark {
          border-color: rgba(255,255,255,0.14);
          box-shadow:
            0 18px 26px -10px rgba(0,0,0,0.65),
            0 4px 10px rgba(0,0,0,0.38),
            inset 0 1px 0 rgba(255,255,255,0.16),
            inset 0 -8px 14px -10px rgba(0,0,0,0.45);
        }
        .falling-icon-chip::before {
          content: "";
          position: absolute; inset: 0; z-index: 0;
          border-radius: 15px;
          background: linear-gradient(165deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.1) 32%, transparent 55%);
          pointer-events: none;
        }
        .falling-icon-chip.is-dark::before {
          background: linear-gradient(165deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.03) 32%, transparent 55%);
        }
        .falling-icon-chip:active { cursor: grabbing; }
        .falling-icon-chip img {
          width: 25px; height: 25px; object-fit: contain;
          pointer-events: none; -webkit-user-drag: none;
          position: relative; z-index: 1;
        }
        .falling-icon-name {
          position: relative; z-index: 1;
          font-family: ${MONO}; font-size: 9px; font-weight: 600; letter-spacing: 0.005em;
          color: var(--text-primary); text-align: center; line-height: 1.2;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
          overflow: hidden; max-width: 100%; word-break: break-word;
        }

        ${mq.mobile} {
          .skills-inner { padding: 0 16px 28px !important; }
          .falling-groups-row { flex-direction: column; gap: 0; }
          .falling-groups-row > .falling-group { margin-top: 22px; }
          .falling-groups-row > .falling-group:first-child { margin-top: 0; }
          .falling-group { margin-top: 22px; }
          .falling-group-title { font-size: 14px; }
          .falling-icons-box { border-radius: 12px; min-height: 210px; }
          .falling-icons-flow {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            justify-items: center;
            padding: 32px 10px 14px;
            gap: 7px;
          }
          .falling-icon-chip { width: 100%; max-width: 54px; height: 54px; border-radius: 12px; gap: 3px; padding: 6px 3px 5px; }
          .falling-icon-chip img { width: 19px; height: 19px; }
          .falling-icon-name { font-size: 7px; }
        }

        @media ${cond.down(BP.mobileXsMax)} {
          .falling-icons-box { min-height: 190px; }
          .falling-icons-flow { grid-template-columns: repeat(3, 1fr); }
          .falling-icon-chip { max-width: 50px; height: 50px; border-radius: 11px; }
          .falling-icon-chip img { width: 17px; height: 17px; }
          .falling-icon-name { font-size: 6.5px; }
          .falling-icons-hint { font-size: 9.5px; top: 10px; right: 12px; }
        }

        /* Phones + tablets: the frosted-glass look costs real GPU
           compositing every single frame while a card is moving (each
           blurred, moving layer needs its own recomposite pass) — with up
           to 17 cards animating at once this was the single biggest
           source of the reported mobile/tablet lag. Trimming the blur
           radius and shadow layer count here keeps the same glassy look
           at a much cheaper render cost; the physics/animation itself is
           untouched. Laptop/desktop keep the full effect. */
        ${mq.tabletDown} {
          .falling-icon-chip {
            backdrop-filter: blur(6px) saturate(140%);
            -webkit-backdrop-filter: blur(6px) saturate(140%);
            box-shadow:
              0 10px 16px -8px rgba(0,0,0,0.4),
              inset 0 1px 0 rgba(255,255,255,0.5);
          }
          .falling-icon-chip.is-dark {
            box-shadow:
              0 10px 16px -8px rgba(0,0,0,0.55),
              inset 0 1px 0 rgba(255,255,255,0.14);
          }
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

            <div className="falling-groups-row">
              <FallingIconsBox title="Languages & Full-Stack" names={GROUP_LANGUAGES_FULLSTACK} />
              <FallingIconsBox title="GenAI, DevOps & Tools" names={GROUP_GENAI_DEVOPS_TOOLS} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}