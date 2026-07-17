"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

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

    // Height now scales with BOTH viewport width (breakpoint tier) and
    // viewport height (so short/tall screens shrink/grow it), keeping it
    // in lockstep with the Hero section instead of a fixed pixel band.
    // No CSS !important overrides fight this anymore — the inline style
    // set below is the single source of truth.
    const getHeight = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      let base: number;
      if (vw >= 1024 && vw <= 1180) base = 148;
      else if (vw >= 768  && vw <= 1023) base = 124;
      else if (vw >= 600  && vw <= 767)  base = 100;
      else base = 62;

      // Scale that base by how tall the actual viewport is, clamped so it
      // never gets absurdly big/small on extreme aspect ratios.
      const vhScale = Math.min(1.2, Math.max(0.7, vh / 800));
      return Math.round(base * vhScale);
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

    let bgColor  = themeRef.current === "dark" ? "#040404" : "#f5f5f3";
    let dotColor = themeRef.current === "dark" ? "255,255,255" : "0,0,0";
    let lastTheme = themeRef.current;

    let raf: number;

    function draw() {
      raf = requestAnimationFrame(draw);

      if (themeRef.current !== lastTheme) {
        lastTheme = themeRef.current;
        const isDark = lastTheme === "dark";
        bgColor  = isDark ? "#040404" : "#f5f5f3";
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

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ background: "var(--bg-base)" }}>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: 62 }}
        className="sparkles-bridge-canvas"
      />
      {/* No fixed-height !important breakpoints here anymore — they used
          to override the JS-computed inline height and stop the canvas
          from actually scaling with the viewport. The inline height set
          by the resize() handler above is now the only source of truth,
          so this bridge grows/shrinks together with the Hero section. */}
    </div>
  );
}