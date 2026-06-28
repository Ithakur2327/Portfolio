"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export function SparklesBridge() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  // Store theme in a ref so canvas draw loop can read latest value
  // without needing to re-run the entire effect (which causes canvas rebuild)
  const themeRef = useRef(theme);

  // Sync ref whenever theme state changes — no canvas restart needed
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const getHeight = () => {
      const vw = window.innerWidth;
      if (vw >= 1024 && vw <= 1180) return 120; // iPad Pro
      if (vw >= 768  && vw <= 1023) return 100; // iPad / standard tablet
      if (vw >= 600  && vw <= 767)  return 80;  // Fold unfolded
      return 48;
    };

    let canvasW = window.innerWidth;

    const resize = () => {
      const HEIGHT = getHeight();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      canvasW = w;
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

    function spawn(): Dot {
      const maxLife = 100 + Math.random() * 140;
      return {
        x: Math.random() * canvasW,
        y: Math.random() * getHeight(),
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: 0.2 + Math.random() * 0.5,
        life: 0, maxLife,
        maxOp: 0.4 + Math.random() * 0.4,
      };
    }

    const particleCount = getHeight() > 72 ? 55 : 30;
    for (let i = 0; i < particleCount; i++) {
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

    function draw(ts: number) {
      raf = requestAnimationFrame(draw);
      if (!isVisible) return;
      if (ts - lastTs < FRAME_MS) return;
      lastTs = ts;
      if (!ctx || !canvas) return;
      const W = canvasW;
      const H = getHeight();

      // Read current theme from ref — no re-mount needed when theme changes
      const isDark = themeRef.current === "dark";
      const bgColor = getComputedStyle(document.documentElement)
        .getPropertyValue("--bg-base").trim() ||
        (isDark ? "#040404" : "#f5f5f3");

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, W, H);

      ctx.beginPath();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.life++;
        d.x += d.vx;
        d.y += d.vy;

        if (d.x < -4)       d.x = W + 4;
        if (d.x > W + 4)    d.x = -4;
        if (d.y < -4)       d.y = H + 4;
        if (d.y > H + 4)    d.y = -4;
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Mount once only — theme changes handled via themeRef

  return (
    <div style={{ background: "var(--bg-base)" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: 48,
        }}
        className="sparkles-bridge-canvas"
      />
      <style suppressHydrationWarning>{`
        @media (min-width: 600px) and (max-width: 767px) {
          .sparkles-bridge-canvas { height: 80px !important; }
        }
        @media (min-width: 768px) and (max-width: 1023px) {
          .sparkles-bridge-canvas { height: 100px !important; }
        }
        @media (min-width: 1024px) and (max-width: 1180px) {
          .sparkles-bridge-canvas { height: 120px !important; }
        }
      `}</style>
    </div>
  );
}
