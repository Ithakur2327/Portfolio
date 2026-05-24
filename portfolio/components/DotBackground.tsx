"use client";
import React, { useEffect, useRef } from "react";

// Exact chanhdai DotGridSpotlight algorithm adapted for full-page fixed canvas
// Colors from the demo code provided:
const DOT_COLOR = {
  light: {
    default: "rgba(0, 0, 0, 0.08)",
    active:  "rgba(0, 0, 0, 0.16)",
  },
  dark: {
    default: "rgba(255, 255, 255, 0.06)",
    active:  "rgba(255, 255, 255, 0.12)",
  },
};

export function DotBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -1000, y: -1000, isActive: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // chanhdai defaults
    const spacing         = 5;   // tighter than default 10 for full-page feel
    const baseRadius      = 1;
    const activeRadius    = 2;
    const interactionRadius = 140;
    const activeMaxAlpha  = 1.0;
    const activeMinAlpha  = 0.5;

    let width = 0, height = 0;
    let renderFrameId: number | null = null;

    const getTheme = () =>
      document.documentElement.classList.contains("dark") ? "dark" : "light";

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const theme = getTheme();
      const dotColor    = DOT_COLOR[theme].default;
      const activeDot   = DOT_COLOR[theme].active;

      const offsetX = (width  % spacing) / 2;
      const offsetY = (height % spacing) / 2;

      for (let x = offsetX; x <= width; x += spacing) {
        for (let y = offsetY; y <= height; y += spacing) {
          const dx = x - mouse.current.x;
          const dy = y - mouse.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let currentRadius = baseRadius;
          let currentColor  = dotColor;
          let currentAlpha  = 1.0;

          if (mouse.current.isActive && distance < interactionRadius) {
            const factor  = 1 - distance / interactionRadius;
            currentRadius = baseRadius + (activeRadius - baseRadius) * factor;
            currentColor  = activeDot;
            currentAlpha  = activeMinAlpha + (activeMaxAlpha - activeMinAlpha) * factor;
          }

          ctx.globalAlpha = currentAlpha;
          ctx.beginPath();
          ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
          ctx.fillStyle = currentColor;
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1.0;
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width  = window.innerWidth;
      height = window.innerHeight;
      canvas.width  = width  * dpr;
      canvas.height = height * dpr;
      canvas.style.width  = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
      draw();
    };

    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, isActive: true };
      if (renderFrameId === null) {
        renderFrameId = requestAnimationFrame(() => { draw(); renderFrameId = null; });
      }
    };

    const onMouseLeave = () => {
      mouse.current.isActive = false;
      if (renderFrameId === null) {
        renderFrameId = requestAnimationFrame(() => { draw(); renderFrameId = null; });
      }
    };

    // Also redraw when theme changes (MutationObserver on html class)
    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("resize",     resize);
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    resize();

    return () => {
      window.removeEventListener("resize",     resize);
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      mo.disconnect();
      if (renderFrameId !== null) cancelAnimationFrame(renderFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position:      "fixed",
        inset:         0,
        zIndex:        0,
        pointerEvents: "none",
        display:       "block",
      }}
    />
  );
}
