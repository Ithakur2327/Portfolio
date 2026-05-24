"use client";
import { useEffect, useRef } from "react";

export function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef  = useRef({ x: -9999, y: -9999 });
  const rafRef    = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const GAP        = 14;    // bahut tight grid
    const DOT_R_BASE = 0.8;   // tiny dot
    const DOT_R_PEAK = 1.4;   // barely grow — no blinking
    const ALPHA_REST = 0.08;  // dim at rest
    const ALPHA_PEAK = 0.28;  // subtle, not bright
    const REACH      = 120;
    const LERP_IN    = 0.09;
    const LERP_OUT   = 0.05;

    let cols = 0, rows = 0;
    let dotR: Float32Array;
    let dotA: Float32Array;

    const init = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width        = window.innerWidth  * dpr;
      canvas.height       = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(window.innerWidth  / GAP) + 2;
      rows = Math.ceil(window.innerHeight / GAP) + 2;
      dotR = new Float32Array(cols * rows).fill(DOT_R_BASE);
      dotA = new Float32Array(cols * rows).fill(ALPHA_REST);
    };
    init();
    window.addEventListener("resize", init);

    const onMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onLeave = ()               => { mouseRef.current = { x: -9999, y: -9999 }; };
    window.addEventListener("mousemove",  onMove,  { passive: true });
    window.addEventListener("mouseleave", onLeave);

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const { x: mx, y: my } = mouseRef.current;
      const dark = document.documentElement.classList.contains("dark");
      const rgb  = dark ? "255,255,255" : "0,0,0";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px  = c * GAP;
          const py  = r * GAP;
          const idx = r * cols + c;
          const dist = Math.sqrt((px - mx) ** 2 + (py - my) ** 2);
          const t    = Math.max(0, 1 - dist / REACH);
          const s    = t * t * (3 - 2 * t);
          const tR = DOT_R_BASE + (DOT_R_PEAK - DOT_R_BASE) * s;
          const tA = ALPHA_REST + (ALPHA_PEAK - ALPHA_REST) * s;
          const sp = tR > dotR[idx] ? LERP_IN : LERP_OUT;
          dotR[idx] += (tR - dotR[idx]) * sp;
          dotA[idx] += (tA - dotA[idx]) * sp;
          ctx.beginPath();
          ctx.arc(px, py, dotR[idx], 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${dotA[idx].toFixed(4)})`;
          ctx.fill();
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize",     init);
      window.removeEventListener("mousemove",  onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", display: "block" }}
    />
  );
}