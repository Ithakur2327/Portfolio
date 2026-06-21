"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Two-layer canvas strategy for dense 4.5px spacing without lag:
 *
 * Static layer (OffscreenCanvas, painted ONCE on resize):
 *   - All ~100k dots drawn as one big batched path → single GPU texture
 *
 * Per mouse-move frame:
 *   1. drawImage(staticCanvas) — one GPU blit, O(1), paints all 100k dots
 *   2. clearRect — erases only the small cursor bbox (~260×260px)
 *   3. Iterate only dots inside that bbox (~3,000 dots max) and redraw:
 *      a. regular dots outside radius (batched path)
 *      b. highlighted dots inside radius (per-dot for alpha gradient)
 *
 * Result: constant ~3k iterations per frame regardless of total dot count.
 */
function DotCanvas({ dotColor, activeDotColor }: { dotColor: string; activeDotColor: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    // Respect user's motion preference — skip heavy canvas animation if reduced motion requested
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false, colorSpace: "srgb" });
    if (!ctx) return;

    const SPACING = 4.5;
    const RADIUS  = 130;
    const RADIUS2 = RADIUS * RADIUS;
    const DOT_R   = 1; // dot radius in CSS px

    let w = 0, h = 0, dpr = 1;
    let dotPositions: Float32Array | null = null;
    let staticCanvas: OffscreenCanvas | null = null;
    let staticCtx: OffscreenCanvasRenderingContext2D | null = null;
    let raf: number | null = null;
    let needsDraw = false;
    let isVisible = true;
    let idleTimer: ReturnType<typeof setTimeout> | null = null;
    const mouse = { x: -9999, y: -9999, active: false };

    // ── Bake dot grid positions (CSS/logical px) ──────────────────────────
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

    // ── Paint ALL dots onto the offscreen canvas once ─────────────────────
    const paintStatic = () => {
      if (!dotPositions || !staticCtx || !staticCanvas) return;
      staticCtx.clearRect(0, 0, w, h);
      staticCtx.fillStyle = dotColor;
      staticCtx.beginPath();
      for (let i = 0; i < dotPositions.length; i += 2) {
        const x = dotPositions[i], y = dotPositions[i + 1];
        staticCtx.moveTo(x + DOT_R, y);
        staticCtx.arc(x, y, DOT_R, 0, Math.PI * 2);
      }
      staticCtx.fill();
    };

    // ── Per-frame draw ─────────────────────────────────────────────────────
    const draw = () => {
      if (!dotPositions || !staticCanvas) return;

      ctx.clearRect(0, 0, w, h);

      // Always start with the full static layer — one GPU blit
      ctx.drawImage(staticCanvas, 0, 0, w, h);

      if (mouse.active) {
        // Clear only the cursor region (tiny rectangle)
        const pad = RADIUS + 2;
        const bx0 = mouse.x - pad, by0 = mouse.y - pad;
        const bw  = pad * 2,       bh  = pad * 2;
        ctx.clearRect(bx0, by0, bw, bh);

        // Clamp bbox to canvas bounds for the iteration below
        const ix0 = Math.max(0, bx0), iy0 = Math.max(0, by0);
        const ix1 = Math.min(w, bx0 + bw), iy1 = Math.min(h, by0 + bh);

        // Pass A: regular dots in bbox that are outside the highlight radius (batched)
        ctx.fillStyle = dotColor;
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

        // Pass B: highlighted dots inside radius (per-dot alpha, ~few hundred dots)
        for (let i = 0; i < dotPositions.length; i += 2) {
          const x = dotPositions[i], y = dotPositions[i + 1];
          if (x < ix0 || x > ix1 || y < iy0 || y > iy1) continue;
          const dx = x - mouse.x, dy = y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 >= RADIUS2) continue;
          const f = 1 - Math.sqrt(d2) / RADIUS;
          ctx.globalAlpha = 0.35 + 0.65 * f;
          ctx.fillStyle = activeDotColor;
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
      if (!isVisible || !needsDraw || raf) return;
      raf = requestAnimationFrame(() => { draw(); raf = null; });
    };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
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
      w = window.innerWidth;
      h = window.innerHeight;

      // Main canvas — physical pixels
      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Offscreen static canvas — same physical size, same dpr scale
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
    ro.observe(document.documentElement);

    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (raf)       cancelAnimationFrame(raf);
      if (idleTimer) clearTimeout(idleTimer);
    };
  }, [dotColor, activeDotColor]);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100vw", height: "100vh",
        pointerEvents: "none", zIndex: 0,
        opacity: 0, transition: "opacity 0.5s ease",
        willChange: "transform",
      }}
    />
  );
}

export function DotBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <DotCanvas
      dotColor={isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.10)"}
      activeDotColor={isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.20)"}
    />
  );
}