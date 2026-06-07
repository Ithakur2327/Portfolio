"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export function SparklesBridge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const HEIGHT = 48;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      canvas.width  = w * dpr;
      canvas.height = HEIGHT * dpr;
      canvas.style.width  = `${w}px`;
      canvas.style.height = `${HEIGHT}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    type Dot = { x: number; y: number; vx: number; vy: number; r: number; life: number; maxLife: number; maxOp: number; };
    const dots: Dot[] = [];
    let canvasW = window.innerWidth;
    window.addEventListener("resize", () => { canvasW = window.innerWidth; }, { passive: true });

    function spawn(): Dot {
      const maxLife = 100 + Math.random() * 140;
      return {
        x: Math.random() * canvasW,
        y: Math.random() * HEIGHT,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.2 + Math.random() * 0.5,
        life: 0, maxLife,
        maxOp: 0.4 + Math.random() * 0.4,
      };
    }

    for (let i = 0; i < 30; i++) {
      const d = spawn();
      d.life = Math.random() * d.maxLife;
      dots.push(d);
    }

    let raf: number;
    let lastTs = 0;
    let isVisible = true;
    const FRAME_MS = 1000 / 24;

    const observer = new IntersectionObserver(
      (entries) => { isVisible = entries[0].isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(canvas);

    const onVisChange = () => { isVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVisChange, { passive: true });

    // Read bg color from CSS variable at draw time — matches theme perfectly
    function getBgColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue("--bg-base").trim() ||
    (theme === "dark" ? "#040404" : "#f5f5f3");
}

    const bgColor = getBgColor();
    function draw(ts: number) {
      raf = requestAnimationFrame(draw);
      if (!isVisible) return;
      if (ts - lastTs < FRAME_MS) return;
      lastTs = ts;
      if (!ctx || !canvas) return;
      const W = canvasW;
      const isDark = theme === "dark";

      ctx.clearRect(0, 0, W, HEIGHT);
      ctx.fillStyle = getBgColor();
      ctx.fillRect(0, 0, W, HEIGHT);

      ctx.beginPath();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.life++;
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < -4)         d.x = W + 4;
        if (d.x > W + 4)      d.x = -4;
        if (d.y < -4)         d.y = HEIGHT + 4;
        if (d.y > HEIGHT + 4) d.y = -4;
        if (d.life >= d.maxLife) { dots[i] = spawn(); continue; }

        const half = d.maxLife / 2;
        const op = d.life < half
          ? (d.life / half) * d.maxOp
          : ((d.maxLife - d.life) / half) * d.maxOp;

        ctx.globalAlpha = op;
        ctx.moveTo(d.x + d.r, d.y);
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      }
      ctx.fillStyle = isDark ? "#ffffff" : "#000000";
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisChange);
    };
  }, [theme]);

  return (
    <div style={{ background: "var(--bg-base)" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: 48,
        }}
      />
    </div>
  );
}
