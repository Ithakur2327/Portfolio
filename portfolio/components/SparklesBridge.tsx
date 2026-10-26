"use client";
import { useEffect, useRef } from "react";
import { CloudShader } from "./CloudShader";

/**
 * The strip between the navbar and the hero — about 1.3× the navbar height
 * (`--bridge-h`, see globals.css) on every device.
 *   • dark theme  → black sky with slowly breathing sparkles (2D canvas)
 *   • light theme → blue sky + small drifting clouds (WebGL shader)
 * The layer that shows is chosen by CSS (`html.light`), so there is no theme
 * flash on load; the inactive layer is paused (not destroyed), so switching
 * theme is instant and never shows a half-initialised canvas.
 */

// Sampled from public/avatar-light.jpg so the sky melts into the portrait.
const SKY_BOTTOM = "#66bcdf";
const SKY_TOP = "#4ea6d9";

const isLight = () => document.documentElement.classList.contains("light");

function Sparkles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    type Dot = { x: number; y: number; vx: number; vy: number; r: number; phase: number; speed: number; minOp: number; maxOp: number };
    let W = 0;
    let H = 0;
    let dots: Dot[] = [];

    const spawn = (): Dot => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: 0.2 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.008 + Math.random() * 0.018,
      minOp: 0.08 + Math.random() * 0.1,
      maxOp: 0.35 + Math.random() * 0.4,
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      if (!W || !H) return;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(18, Math.min(90, Math.round((W * H) / 1500)));
      dots = Array.from({ length: count }, spawn);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    let raf = 0;
    let inView = false;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        d.phase += d.speed;
        if (d.phase > Math.PI * 2) d.phase -= Math.PI * 2;
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < -4) d.x = W + 4;
        if (d.x > W + 4) d.x = -4;
        if (d.y < -4) d.y = H + 4;
        if (d.y > H + 4) d.y = -4;
        ctx.globalAlpha = d.minOp + (d.maxOp - d.minOp) * (0.5 + 0.5 * Math.sin(d.phase));
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const sync = () => {
      const run =
        inView && !document.hidden && !isLight() && !document.documentElement.classList.contains("intro-active");
      if (run && !raf) raf = requestAnimationFrame(draw);
      else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([e]) => {
      inView = !!e?.isIntersecting;
      sync();
    });
    io.observe(canvas);
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("intro:complete", sync);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("intro:complete", sync);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className="bridge-canvas" />;
}

export function SparklesBridge() {
  return (
    <div className="bridge" aria-hidden="true">
      <div className="bridge-layer bridge-dark">
        <Sparkles />
      </div>
      <div className="bridge-layer bridge-sky" style={{ background: `linear-gradient(to top, ${SKY_BOTTOM}, ${SKY_TOP})` }}>
        <CloudShader
          cloudColor="#ffffff"
          skyTopColor={SKY_TOP}
          skyBottomColor={SKY_BOTTOM}
          isActive={isLight}
        />
      </div>
    </div>
  );
}