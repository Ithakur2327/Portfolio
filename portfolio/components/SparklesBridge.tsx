"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";
import { BP, mq } from "@/lib/breakpoints";

export function SparklesBridge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const themeRef = useRef(theme);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    const getHeight = () => {
      const vw = window.innerWidth;
      if (vw >= BP.laptopMin && vw <= BP.laptopNarrowMax) return 148;
      if (vw >= BP.tabletSplitMin && vw <= BP.tabletMax) return 124;
      if (vw >= BP.tabletMin && vw <= BP.tabletSplitMax) return 100;
      return 62;
    };

    let canvasW = window.innerWidth;
    let canvasH = getHeight();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 4);
      canvasW = window.innerWidth;
      canvasH = getHeight();
      canvas.width  = Math.round(canvasW * dpr);
      canvas.height = Math.round(canvasH * dpr);
      canvas.style.width  = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    type Dot = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      phase: number;   
      speed: number;   
      minOp: number;   
      maxOp: number;   
    };

    const spawn = (): Dot => ({
      x: Math.random() * canvasW,
      y: Math.random() * canvasH,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,   // random start in cycle
      speed: 0.008 + Math.random() * 0.018, // slow breath
      minOp: 0.08 + Math.random() * 0.10,   // always faintly visible
      maxOp: 0.35 + Math.random() * 0.40,   // peak brightness
    });

    const particleCount = canvasH > 72 ? 55 : 30;
    const dots: Dot[] = Array.from({ length: particleCount }, spawn);

    let bgColor  = themeRef.current === "dark" ? "#000000" : "#edf1f5";
    let dotColor = themeRef.current === "dark" ? "255,255,255" : "0,0,0";
    let lastTheme = themeRef.current;

    let raf = 0;
    let running = false;
    let inView = true;

    function draw() {
      raf = requestAnimationFrame(draw);

      if (themeRef.current !== lastTheme) {
        lastTheme = themeRef.current;
        const isDark = lastTheme === "dark";
        bgColor  = isDark ? "#000000" : "#edf1f5";
        dotColor = isDark ? "255,255,255" : "0,0,0";
      }

      const W = canvasW;
      const H = canvasH;

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];

        // Advance phase — wraps around endlessly, never resets or respawns
        d.phase += d.speed;
        if (d.phase > Math.PI * 2) d.phase -= Math.PI * 2;

        // Smooth sine pulse between minOp and maxOp — always > 0
        const op = d.minOp + (d.maxOp - d.minOp) * (0.5 + 0.5 * Math.sin(d.phase));

        // Move
        d.x += d.vx;
        d.y += d.vy;

        // Wrap edges smoothly
        if (d.x < -4)    d.x = W + 4;
        if (d.x > W + 4) d.x = -4;
        if (d.y < -4)    d.y = H + 4;
        if (d.y > H + 4) d.y = -4;

        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${dotColor},${op.toFixed(3)})`;
        ctx.fill();
      }
    }

    function startLoop() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(draw);
    }
    function stopLoop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = !!entry?.isIntersecting;
        if (inView && !document.hidden) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibilityChange = () => {
      if (!document.hidden && inView) startLoop();
      else stopLoop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange, { passive: true });

    return () => {
      stopLoop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div style={{ background: "var(--bg-base)" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: 62 }}
        className="sparkles-bridge-canvas"
      />
      <style suppressHydrationWarning>{`
        @media (min-width: ${BP.tabletMin}px) and (max-width: ${BP.tabletSplitMax}px) {
          .sparkles-bridge-canvas { height: 100px !important; }
        }
        @media (min-width: ${BP.tabletSplitMin}px) and (max-width: ${BP.tabletMax}px) {
          .sparkles-bridge-canvas { height: 124px !important; }
        }
        ${mq.laptopNarrow} {
          .sparkles-bridge-canvas { height: 148px !important; }
        }
      `}</style>
    </div>
  );
}