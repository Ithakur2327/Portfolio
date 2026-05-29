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

    // FIX 1: Increased from 30→48px so the bridge doesn't compress on
    // smaller viewports (e.g. Samsung Galaxy S8 360px wide).
    const HEIGHT = 30;
    const isDark = theme === "dark";

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = HEIGHT;
    };
    resize();
    window.addEventListener("resize", resize);

    type Dot = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      life: number; maxLife: number;
      maxOp: number;
    };

    const dots: Dot[] = [];

    function spawn(): Dot {
      const maxLife = 100 + Math.random() * 140;
      return {
        x: Math.random() * canvas!.width,
        y: Math.random() * HEIGHT,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.2 + Math.random() * 0.5,
        life: 0,
        maxLife,
        maxOp: 0.4 + Math.random() * 0.4,
      };
    }

    for (let i = 0; i < 50; i++) {
      const d = spawn();
      d.life = Math.random() * d.maxLife;
      dots.push(d);
    }

    let raf: number;

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width;

      ctx.fillStyle = isDark ? "#09090b" : "#f5f5f3";
      ctx.fillRect(0, 0, W, HEIGHT);

      ctx.beginPath();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.life++;
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < -4)          d.x = W + 4;
        if (d.x > W + 4)       d.x = -4;
        if (d.y < -4)          d.y = HEIGHT + 4;
        if (d.y > HEIGHT + 4)  d.y = -4;

        if (d.life >= d.maxLife) { dots[i] = spawn(); continue; }

        const half = d.maxLife / 2;
        const op = d.life < half
          ? (d.life / half) * d.maxOp
          : ((d.maxLife - d.life) / half) * d.maxOp;

        ctx.globalAlpha = op;
        // Reuse path: moveTo keeps arcs independent within one beginPath
        ctx.moveTo(d.x + d.r, d.y);
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      }
      ctx.fillStyle = isDark ? "#ffffff" : "#000000";
      ctx.fill();
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    }

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      // FIX 1: height updated from 30→48 to match canvas HEIGHT constant
      style={{ display: "block", width: "100%", height: 48, willChange: "transform" }}
    />
  );
}