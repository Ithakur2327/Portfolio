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

    canvas.width  = window.innerWidth;
    canvas.height = 28;

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 28;
    };
    window.addEventListener("resize", onResize);

    const isDark = document.documentElement.classList.contains("dark");
    const rgb = isDark ? "255,255,255" : "0,0,0";

    type Dot = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      life: number; maxLife: number;
      maxOp: number;
    };

    const dots: Dot[] = [];

    function spawn(): Dot {
      const maxLife = 80 + Math.random() * 100;
      return {
        x: Math.random() * canvas!.width,
        y: Math.random() * 28,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 0.5 + Math.random() * 1.5,
        life: 0,
        maxLife,
        maxOp: 0.4 + Math.random() * 0.6,
      };
    }

    for (let i = 0; i < 150; i++) {
      const d = spawn();
      d.life = Math.random() * d.maxLife; // stagger start
      dots.push(d);
    }

    let raf: number;

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, 28);

      const currentRgb = document.documentElement.classList.contains("dark")
        ? "255,255,255" : "0,0,0";

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.life++;
        d.x += d.vx;
        d.y += d.vy;

        if (d.life >= d.maxLife) {
          dots[i] = spawn();
          continue;
        }

        const half = d.maxLife / 2;
        const op = d.life < half
          ? (d.life / half) * d.maxOp
          : ((d.maxLife - d.life) / half) * d.maxOp;

        // glow
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 3);
        g.addColorStop(0, `rgba(${currentRgb},${op})`);
        g.addColorStop(1, `rgba(${currentRgb},0)`);
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 3, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: 28,
        borderBottom: "1px solid var(--nav-border)",
      }}
    />
  );
}