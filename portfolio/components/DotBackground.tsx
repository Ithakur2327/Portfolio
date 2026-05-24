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

    const SPACING = 5;
    let w = 0, h = 0, raf: number | null = null;
    const mouse = { x: -9999, y: -9999, active: false };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const ox = (w % SPACING) / 2;
      const oy = (h % SPACING) / 2;
      for (let x = ox; x <= w; x += SPACING) {
        for (let y = oy; y <= h; y += SPACING) {
          const dx = x - mouse.x, dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const RADIUS = 140;
          let r = 1, color = dotColor, alpha = 1;
          if (mouse.active && dist < RADIUS) {
            const f = 1 - dist / RADIUS;
            r = 1 + f;
            color = activeDotColor;
            alpha = 0.4 + 0.6 * f;
          }
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
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

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX; mouse.y = e.clientY; mouse.active = true;
      if (!raf) raf = requestAnimationFrame(() => { draw(); raf = null; });
    };
    const onLeave = () => {
      mouse.active = false;
      if (!raf) raf = requestAnimationFrame(() => { draw(); raf = null; });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", resize);
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