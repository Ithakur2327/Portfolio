"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

const SPACING = 4.5;
const RADIUS = 110;
const RADIUS2 = RADIUS * RADIUS;
const DOT_R = 1;
const TAU = Math.PI * 2;

function smoothstep(t: number) {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
}

function DotCanvas({
  dotColor,
  activeDotColor,
  interactive,
}: {
  dotColor: string;
  activeDotColor: string;
  interactive: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const dotColorRef = useRef(dotColor);
  const activeDotColorRef = useRef(activeDotColor);

  const repaintRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    dotColorRef.current = dotColor;
    activeDotColorRef.current = activeDotColor;
    repaintRef.current?.();
  }, [dotColor, activeDotColor]);

  useEffect(() => {
    const canvas = ref.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false, colorSpace: "srgb" });
    if (!ctx) return;

    let w = 0, h = 0, dpr = 1;
    let dotPositions: Float32Array | null = null;
    let staticCanvas: OffscreenCanvas | null = null;
    let staticCtx: OffscreenCanvasRenderingContext2D | null = null;
    let raf: number | null = null;
    let needsDraw = false;
    let isVisible = true;
    let inViewport = true;
    let colorDirty = false;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const mouse = { x: -9999, y: -9999, active: false };

    const bakeDots = () => {
      const ox = (w % SPACING) / 2;
      const oy = (h % SPACING) / 2;
      const cols = Math.ceil(w / SPACING) + 2;
      const rows = Math.ceil(h / SPACING) + 2;

      const arr = new Float32Array(cols * rows * 2);
      let i = 0;
      for (let x = ox; x <= w + SPACING; x += SPACING) {
        for (let y = oy; y <= h + SPACING; y += SPACING) {
          arr[i++] = x;
          arr[i++] = y;
        }
      }
      dotPositions = arr.subarray(0, i);
    };

    const paintStatic = () => {
      if (!dotPositions || !staticCtx || !staticCanvas) return;
      staticCtx.clearRect(0, 0, w, h);
      staticCtx.fillStyle = dotColorRef.current;
      staticCtx.beginPath();
      for (let i = 0; i < dotPositions.length; i += 2) {
        const x = dotPositions[i], y = dotPositions[i + 1];
        staticCtx.moveTo(x + DOT_R, y);
        staticCtx.arc(x, y, DOT_R, 0, TAU);
      }
      staticCtx.fill();
    };

    repaintRef.current = () => {
      if (!inViewport) { colorDirty = true; return; }
      paintStatic();
      needsDraw = true;
      schedule();
    };

    const draw = () => {
      if (!dotPositions || !staticCanvas) return;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(staticCanvas, 0, 0, w, h);

      if (interactive && mouse.active) {
        const pad = RADIUS;
        const ix0 = Math.max(0, mouse.x - pad);
        const iy0 = Math.max(0, mouse.y - pad);
        const ix1 = Math.min(w, mouse.x + pad);
        const iy1 = Math.min(h, mouse.y + pad);

        ctx.fillStyle = activeDotColorRef.current;
        for (let i = 0; i < dotPositions.length; i += 2) {
          const x = dotPositions[i], y = dotPositions[i + 1];
          if (x < ix0 || x > ix1 || y < iy0 || y > iy1) continue;
          const dx = x - mouse.x, dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= RADIUS2) continue;
          const t = 1 - Math.sqrt(d2) / RADIUS;
          const f = smoothstep(t);
          if (f <= 0.001) continue;
          ctx.globalAlpha = f;
          ctx.beginPath();
          ctx.arc(x, y, DOT_R + f, 0, TAU);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      needsDraw = false;
      raf = null;
    };

    const schedule = () => {
      if (!isVisible || !inViewport || !needsDraw || raf) return;
      raf = requestAnimationFrame(() => { draw(); raf = null; });
    };

    const onMove = (e: MouseEvent) => {
      if (!interactive) return;
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = mouse.x >= -50 && mouse.x <= w + 50 && mouse.y >= -50 && mouse.y <= h + 50;
      needsDraw = true;
      schedule();
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { needsDraw = false; }, 2000);
    };

    const onLeave = () => {
      mouse.active = false;
      needsDraw = true;
      schedule();
    };

    const onScroll = () => {
      if (!mouse.active) return;
      mouse.active = false;
      needsDraw = true;
      schedule();
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) { needsDraw = true; schedule(); }
      else if (raf)  { cancelAnimationFrame(raf); raf = null; }
    };

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      w = Math.max(1, Math.round(rect.width));
      h = Math.max(1, Math.round(rect.height));

      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      staticCanvas = new OffscreenCanvas(Math.round(w * dpr), Math.round(h * dpr));
      staticCtx = staticCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
      staticCtx.scale(dpr, dpr);

      bakeDots();
      paintStatic();
      needsDraw = true;
      if (raf) { cancelAnimationFrame(raf); raf = null; }
      draw();
      canvas.style.opacity = "1";
    };

    const ro = new ResizeObserver(setup);
    ro.observe(container);

    const io = new IntersectionObserver((entries) => {
      const entry = entries[0];
      inViewport = !!entry?.isIntersecting;
      if (inViewport && colorDirty) {
        colorDirty = false;
        paintStatic();
        needsDraw = true;
        schedule();
      }
    }, { rootMargin: "200px 0px" });
    io.observe(canvas);

    if (interactive) {
      window.addEventListener("mousemove",  onMove,  { passive: true });
      window.addEventListener("mouseleave", onLeave, { passive: true });
    }
    window.addEventListener("scroll", onScroll, { passive: true, capture: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

    return () => {
      repaintRef.current = null;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("scroll", onScroll, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (raf)       cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [interactive]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        pointerEvents: "none",
        opacity: 0, transition: "opacity 0.5s ease",
        willChange: "transform",
        display: "block",
      }}
    />
  );
}

function useDotColors() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return {
    dotColor: isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.12)",
    activeDotColor: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.24)",
  };
}

export function DotField({ interactive = true }: { interactive?: boolean }) {
  const { dotColor, activeDotColor } = useDotColors();
  return (
    <DotCanvas
      interactive={interactive}
      dotColor={dotColor}
      activeDotColor={activeDotColor}
    />
  );
}

export function DotDivider({ height = 38 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      className="dot-divider"
      style={{
        position: "relative", left: "50%", marginLeft: "-50vw",
        width: "100vw", height,
        overflow: "hidden",
      }}
    >
      <DotField interactive />
    </div>
  );
}