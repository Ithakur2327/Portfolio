"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

function DotCanvas({ dotColor, activeDotColor }: { dotColor: string; activeDotColor: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", {
      // Hint: we don't need alpha readback — faster compositing
      willReadFrequently: false,
      // Use display-p3 on supported devices for 8K-quality color
      colorSpace: "srgb",
    });
    if (!ctx) return;

    const SPACING = 4.5;
    let w = 0, h = 0;
    let raf: number | null = null;
    let resizeRaf: number | null = null;
    const mouse = { x: -9999, y: -9999, active: false };
    let needsDraw = false;
    let isVisible = true; // page visibility optimization

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const ox = (w % SPACING) / 2;
      const oy = (h % SPACING) / 2;

      // Pass 1: all static dots in a single path batch (one fillStyle set)
      ctx.globalAlpha = 1;
      ctx.fillStyle = dotColor;
      ctx.beginPath();
      for (let x = ox; x <= w; x += SPACING) {
        for (let y = oy; y <= h; y += SPACING) {
          if (mouse.active) {
            const dx = x - mouse.x, dy = y - mouse.y;
            if (dx * dx + dy * dy < 140 * 140) continue;
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
            const dist2 = dx * dx + dy * dy;
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
      raf = null;
    };

    const scheduleDrawIfNeeded = () => {
      // Skip rendering when tab is not visible — saves GPU + battery
      if (!isVisible) return;
      if (!needsDraw) {
        needsDraw = true;
        if (!raf) raf = requestAnimationFrame(() => { draw(); raf = null; });
      }
    };

    const resize = () => {
      // Debounce resize via rAF — prevents resize explosion on window drag
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2); // cap at 2× — 4× is overkill
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width  = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width  = `${w}px`;
        canvas.style.height = `${h}px`;
        ctx.scale(dpr, dpr);
        draw();
        canvas.style.opacity = "1";
        resizeRaf = null;
      });
    };

    // Throttle mousemove via rAF — fires at display refresh rate (60/120/144hz)
    // not at raw event rate (hundreds/sec). This is the key to zero jank.
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      scheduleDrawIfNeeded();
    };

    const onLeave = () => {
      mouse.active = false;
      scheduleDrawIfNeeded();
    };

    // Page Visibility API — pause canvas when tab is hidden
    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) scheduleDrawIfNeeded();
      else if (raf) { cancelAnimationFrame(raf); raf = null; }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

    resize();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (raf) cancelAnimationFrame(raf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
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
