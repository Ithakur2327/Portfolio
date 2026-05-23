"use client";
import { useEffect, useRef } from "react";

export function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse     = useRef({ x: -9999, y: -9999 });
  const raf       = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── exact props from chanhdai DotGridSpotlight API ─── */
    const spacing         = 24;    // grid gap
    const baseRadius      = 1.0;   // dot size at rest
    const activeRadius    = 3.0;   // dot size at cursor
    const interactionRadius = 120; // influence area
    const activeMaxAlpha  = 0.50;  // brightest alpha near cursor
    const activeMinAlpha  = 0.05;  // dimmest alpha (rest state)

    /* lerp speed — chanhdai uses CSS transition, we simulate it */
    const LERP = 0.08;

    let cols = 0, rows = 0;
    let curR  : Float32Array;
    let curA  : Float32Array;

    const init = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      cols  = Math.ceil(canvas.width  / spacing) + 2;
      rows  = Math.ceil(canvas.height / spacing) + 2;
      curR  = new Float32Array(cols * rows).fill(baseRadius);
      curA  = new Float32Array(cols * rows).fill(activeMinAlpha);
    };
    init();
    window.addEventListener("resize", init);

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouse.current;
      const dark = document.documentElement.classList.contains("dark");
      const rgb  = dark ? "255,255,255" : "0,0,0";

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px  = c * spacing;
          const py  = r * spacing;
          const idx = r * cols + c;

          const dist = Math.sqrt((px - mx) ** 2 + (py - my) ** 2);

          /* 0→1 influence, smoothstep */
          const raw    = Math.max(0, 1 - dist / interactionRadius);
          const smooth = raw * raw * (3 - 2 * raw);

          const targetR = baseRadius  + (activeRadius - baseRadius)   * smooth;
          const targetA = activeMinAlpha + (activeMaxAlpha - activeMinAlpha) * smooth;

          /* smooth lerp both radius and alpha */
          curR[idx] += (targetR - curR[idx]) * LERP;
          curA[idx] += (targetA - curA[idx]) * LERP;

          ctx.beginPath();
          ctx.arc(px, py, curR[idx], 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rgb},${curA[idx].toFixed(4)})`;
          ctx.fill();
        }
      }

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", init);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position     : "fixed",
        inset        : 0,
        zIndex       : 0,
        pointerEvents: "none",
      }}
    />
  );
}
