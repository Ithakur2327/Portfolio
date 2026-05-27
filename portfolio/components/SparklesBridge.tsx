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

    const HEIGHT = 120;

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
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: 0.5 + Math.random() * 1.8,
        life: 0,
        maxLife,
        maxOp: 0.4 + Math.random() * 0.6,
      };
    }

    // seed at random lifecycle positions
    for (let i = 0; i < 280; i++) {
      const d = spawn();
      d.life = Math.random() * d.maxLife;
      dots.push(d);
    }

    let raf: number;

    function draw() {
      if (!ctx || !canvas) return;
      const W = canvas.width;

      // Pure black background always
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, W, HEIGHT);

      // Blue horizontal light line at the very top
      // Glow effect: multiple layers
      const lineY = 2;

      // Outer wide glow
      const glowWide = ctx.createLinearGradient(0, lineY - 18, 0, lineY + 18);
      glowWide.addColorStop(0, "rgba(0,0,0,0)");
      glowWide.addColorStop(0.4, "rgba(30,80,200,0.08)");
      glowWide.addColorStop(0.5, "rgba(60,140,255,0.18)");
      glowWide.addColorStop(0.6, "rgba(30,80,200,0.08)");
      glowWide.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glowWide;
      ctx.fillRect(0, lineY - 18, W, 36);

      // Inner bright line
      const lineGrad = ctx.createLinearGradient(0, 0, W, 0);
      lineGrad.addColorStop(0,    "rgba(0,60,180,0)");
      lineGrad.addColorStop(0.15, "rgba(40,100,255,0.5)");
      lineGrad.addColorStop(0.35, "rgba(80,160,255,0.95)");
      lineGrad.addColorStop(0.5,  "rgba(120,190,255,1)");
      lineGrad.addColorStop(0.65, "rgba(80,160,255,0.95)");
      lineGrad.addColorStop(0.85, "rgba(40,100,255,0.5)");
      lineGrad.addColorStop(1,    "rgba(0,60,180,0)");
      ctx.beginPath();
      ctx.moveTo(0, lineY);
      ctx.lineTo(W, lineY);
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Vertical bloom below the line (fades down)
      const bloom = ctx.createLinearGradient(0, lineY, 0, HEIGHT);
      bloom.addColorStop(0,   "rgba(40,100,255,0.12)");
      bloom.addColorStop(0.15,"rgba(20,60,200,0.06)");
      bloom.addColorStop(0.4, "rgba(10,30,150,0.02)");
      bloom.addColorStop(1,   "rgba(0,0,0,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, lineY, W, HEIGHT);

      // White sparkle dots
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.life++;
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < -5)           d.x = W + 5;
        if (d.x > W + 5)        d.x = -5;
        if (d.y < -5)           d.y = HEIGHT + 5;
        if (d.y > HEIGHT + 5)   d.y = -5;

        if (d.life >= d.maxLife) {
          dots[i] = spawn();
          continue;
        }

        const half = d.maxLife / 2;
        const op = d.life < half
          ? (d.life / half) * d.maxOp
          : ((d.maxLife - d.life) / half) * d.maxOp;

        // core dot - white
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${op})`;
        ctx.fill();

        // soft glow
        if (d.r > 1) {
          const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
          g.addColorStop(0, `rgba(200,220,255,${op * 0.5})`);
          g.addColorStop(1, `rgba(200,220,255,0)`);
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
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
      style={{
        display: "block",
        width: "100%",
        height: 120,
      }}
    />
  );
}