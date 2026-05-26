"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  maxOpacity: number;
  life: number;
  maxLife: number;
}

export function SparklesBridge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef   = useRef<number>(0);
  const particles = useRef<Particle[]>([]);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Particle colour — white in dark, near-black in light
  const isDark = mounted ? theme === "dark" : true;
  const particleColor = isDark ? "255,255,255" : "10,10,10";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const HEIGHT = 28; // exact gap height

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = HEIGHT;
    }
    resize();
    window.addEventListener("resize", resize);

    // Spawn particles across full width
    function spawnParticle() {
      if (!canvas) return;
      const maxLife = 60 + Math.random() * 80; // ~1-2s at 60fps
      particles.current.push({
        x:          Math.random() * canvas.width,
        y:          Math.random() * HEIGHT,
        vx:         (Math.random() - 0.5) * 0.4,
        vy:         (Math.random() - 0.5) * 0.4,
        size:       0.3 + Math.random() * 1.1,
        opacity:    0,
        maxOpacity: 0.25 + Math.random() * 0.65,
        life:       0,
        maxLife,
      });
    }

    // Pre-seed
    for (let i = 0; i < 120; i++) spawnParticle();

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, HEIGHT);

      // Spawn a few per frame to maintain density
      if (particles.current.length < 180) spawnParticle();
      if (Math.random() < 0.55) spawnParticle();

      const color = isDark ? "255,255,255" : "10,10,10";

      particles.current = particles.current.filter((p) => {
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        // Fade in first half, fade out second half
        const half = p.maxLife / 2;
        if (p.life < half) {
          p.opacity = (p.life / half) * p.maxOpacity;
        } else {
          p.opacity = ((p.maxLife - p.life) / half) * p.maxOpacity;
        }

        if (p.life >= p.maxLife) return false;

        // Soft glow dot
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2.5);
        grd.addColorStop(0, `rgba(${color},${p.opacity})`);
        grd.addColorStop(1, `rgba(${color},0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        return true;
      });

      animRef.current = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      particles.current = [];
    };
  // Re-run when theme changes so particle colour updates instantly
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: 28,
        overflow: "hidden",
        // Subtle gradient line at bottom edge (navbar shadow continuation)
        borderBottom: "1px solid var(--nav-border)",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: 28,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}