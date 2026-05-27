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

    const HEIGHT = 60;

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
        r: 0.3 + Math.random() * 0.85,
        life: 0,
        maxLife,
        maxOp: 0.5 + Math.random() * 0.5,
      };
    }

    for (let i = 0; i < 200; i++) {
      const d = spawn();
      d.life = Math.random() * d.maxLife;
      dots.push(d);
    }

    let raf: number;

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width;

      // Pure black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, HEIGHT);

      // White sparkle dots only — no blue line
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

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();

        if (d.r > 0.6) {
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3.5);
          g.addColorStop(0, `rgba(210,230,255,${op * 0.35})`);
          g.addColorStop(1, "rgba(0,0,0,0)");
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }
      }

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
      style={{ display: "block", width: "100%", height: 60 }}
    />
  );
}