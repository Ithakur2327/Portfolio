"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

function DotCanvas({ dotColor, activeDotColor }: { dotColor: string; activeDotColor: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SPACING = 4.5;
    let w = 0, h = 0, raf: number | null = null;
    const mouse = { x: -9999, y: -9999, active: false };

    // FIX: Pre-parse colors once, draw with them directly
    // Avoids string parsing on every dot every frame
    let needsDraw = false;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const ox = (w % SPACING) / 2;
      const oy = (h % SPACING) / 2;

      // FIX: Draw static dots in one pass, active dots in second pass
      // This avoids changing fillStyle per-dot (major paint cost)
      // Pass 1: all static dots
      ctx.globalAlpha = 1;
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      for (let x = ox; x <= w; x += SPACING) {
        for (let y = oy; y <= h; y += SPACING) {
          if (mouse.active) {
            const dx = x - mouse.x, dy = y - mouse.y;
            if (dx*dx + dy*dy < 140*140) continue; // skip — drawn in pass 2
          }
          ctx.moveTo(x + 1, y);
          ctx.arc(x, y, 1, 0, Math.PI * 2);
        }
      }
      ctx.fill();

      // Pass 2: highlighted dots near cursor
      if (mouse.active) {
        const RADIUS = 140;
        const RADIUS2 = RADIUS * RADIUS;
        for (let x = ox; x <= w; x += SPACING) {
          for (let y = oy; y <= h; y += SPACING) {
            const dx = x - mouse.x, dy = y - mouse.y;
            const dist2 = dx*dx + dy*dy;
            if (dist2 >= RADIUS2) continue;
            const dist = Math.sqrt(dist2);
            const f = 1 - dist / RADIUS;
            const r = 1 + f;
            const alpha = 0.4 + 0.6 * f;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = activeDotColor;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
      }

      needsDraw = false;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width  = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      draw();
      canvas.style.opacity = "1";
    };

    // FIX: Throttle mousemove — was firing every pixel movement with full redraw
    // Now batched via rAF (runs once per frame max, not per event)
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      if (!needsDraw) {
        needsDraw = true;
        if (!raf) raf = requestAnimationFrame(() => { draw(); raf = null; });
      }
    };
    const onLeave = () => {
      mouse.active = false;
      needsDraw = true;
      if (!raf) raf = requestAnimationFrame(() => { draw(); raf = null; });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    resize();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [dotColor, activeDotColor]);

  return (
    <canvas ref={ref} style={{
      position: "fixed", top: 0, left: 0,
      width: "100vw", height: "100vh",
      pointerEvents: "none", zIndex: 0,
      opacity: 0, transition: "opacity 0.5s ease",
    }} />
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
