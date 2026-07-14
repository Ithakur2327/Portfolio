"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

function DotCanvas({ dotColor, activeDotColor, interactive }: {
  dotColor: string; activeDotColor: string; interactive: boolean;
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

    const SPACING = 4.5;
    const RADIUS  = 110;
    const RADIUS2 = RADIUS * RADIUS;
    const DOT_R   = 1;

    let w = 0, h = 0, dpr = 1;
    let dotPositions: Float32Array | null = null;
    let staticCanvas: OffscreenCanvas | null = null;
    let staticCtx: OffscreenCanvasRenderingContext2D | null = null;
    let raf: number | null = null;
    let needsDraw = false;
    let isVisible = true;
    // Skip repaint work for off-screen canvases.
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
        staticCtx.arc(x, y, DOT_R, 0, Math.PI * 2);
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
        const pad = RADIUS + 2;
        const bx0 = mouse.x - pad, by0 = mouse.y - pad;
        const bw  = pad * 2,       bh  = pad * 2;
        ctx.clearRect(bx0, by0, bw, bh);

        const ix0 = Math.max(0, bx0), iy0 = Math.max(0, by0);
        const ix1 = Math.min(w, bx0 + bw), iy1 = Math.min(h, by0 + bh);

        ctx.fillStyle = dotColorRef.current;
        ctx.beginPath();
        for (let i = 0; i < dotPositions.length; i += 2) {
          const x = dotPositions[i], y = dotPositions[i + 1];
          if (x < ix0 || x > ix1 || y < iy0 || y > iy1) continue;
          const dx = x - mouse.x, dy = y - mouse.y;
          if (dx * dx + dy * dy < RADIUS2) continue;
          ctx.moveTo(x + DOT_R, y);
          ctx.arc(x, y, DOT_R, 0, Math.PI * 2);
        }
        ctx.fill();

        for (let i = 0; i < dotPositions.length; i += 2) {
          const x = dotPositions[i], y = dotPositions[i + 1];
          if (x < ix0 || x > ix1 || y < iy0 || y > iy1) continue;
          const dx = x - mouse.x, dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= RADIUS2) continue;
          const f = 1 - Math.sqrt(d2) / RADIUS;
          ctx.globalAlpha = 0.35 + 0.65 * f;
          ctx.fillStyle = activeDotColorRef.current;
          ctx.beginPath();
          ctx.arc(x, y, DOT_R + f, 0, Math.PI * 2);
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
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

    return () => {
      repaintRef.current = null;
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (raf)       cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
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

/**
 * DotField — drop this inside any `position: relative` (or absolute/fixed)
 * container and it fills that container edge-to-edge with the dot grid.
 * Used (a) behind the hero — from the avatar down to where About begins —
 * and (b) inside `DotDivider` as a thin partition strip between sections.
 */
export function DotField({ interactive = true }: { interactive?: boolean }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <DotCanvas
      interactive={interactive}
      dotColor={isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.12)"}
      activeDotColor={isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.24)"}
    />
  );
}

/**
 * DotDivider — a thin, full-bleed horizontal strip used as a *partition
 * indicator* between two sections (same convention as SparklesBridge):
 * a bounded-height band, not a page-covering background.
 */
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