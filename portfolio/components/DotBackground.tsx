"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

/**
 * Dot grid.
 *
 *  • The static grid is a CSS radial-gradient pattern (rasterised once by the
 *    browser, zero JS, zero per-frame cost).
 *  • The interactive "glow near the cursor" is a transparent canvas that only
 *    draws while the cursor is actually near that field.
 *  • ONE shared pointer listener serves every field on the page (there used to
 *    be one window listener + one forced layout read per field per mouse move).
 */

const SPACING = 4.5;
const RADIUS = 110;
const RADIUS2 = RADIUS * RADIUS;
const DOT_R = 1;
const TAU = Math.PI * 2;

const smoothstep = (t: number) => {
  const c = t < 0 ? 0 : t > 1 ? 1 : t;
  return c * c * (3 - 2 * c);
};

/* ── shared pointer hub ─────────────────────────────────────────────── */
type Field = {
  el: HTMLElement;
  visible: boolean;
  onPointer: (clientX: number, clientY: number, active: boolean) => void;
};

const fields = new Set<Field>();
const pointer = { x: -9999, y: -9999, active: false };
let hubFrame = 0;
let hubBound = false;

function hubFlush() {
  hubFrame = 0;
  fields.forEach(f => {
    if (f.visible) f.onPointer(pointer.x, pointer.y, pointer.active);
  });
}
function hubSchedule() {
  if (!hubFrame) hubFrame = requestAnimationFrame(hubFlush);
}
function hubBind() {
  if (hubBound) return;
  hubBound = true;
  window.addEventListener(
    "pointermove",
    e => {
      if (e.pointerType === "touch") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
      hubSchedule();
    },
    { passive: true },
  );
  const off = () => {
    pointer.active = false;
    hubSchedule();
  };
  document.documentElement.addEventListener("mouseleave", off);
  // Scrolling moves fields under a stationary cursor; just drop the glow.
  window.addEventListener("scroll", off, { passive: true });
}

/* ── one field ──────────────────────────────────────────────────────── */
export function DotField({ interactive = true }: { interactive?: boolean }) {
  const { theme } = useTheme();
  const activeColor = theme === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.24)";
  const activeRef = useRef(activeColor);
  activeRef.current = activeColor;

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!interactive) return;
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(hover: none)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    hubBind();

    let w = 0;
    let h = 0;
    let dpr = 1;
    let sized = false;
    let drawn = false;

    // The glow only ever covers a RADIUS-sized window, so the canvas is that
    // window (not the whole 100vw field) and is moved with the cursor.
    const SIZE = RADIUS * 2;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = root.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(SIZE * dpr);
      canvas.height = Math.round(SIZE * dpr);
      canvas.style.width = `${SIZE}px`;
      canvas.style.height = `${SIZE}px`;
      sized = true;
    };

    const clear = () => {
      if (!drawn) return;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawn = false;
    };

    const field: Field = {
      el: root,
      visible: false,
      onPointer(cx, cy, active) {
        const rect = root.getBoundingClientRect();
        const mx = cx - rect.left;
        const my = cy - rect.top;
        if (!active || mx < -RADIUS || mx > rect.width + RADIUS || my < -RADIUS || my > rect.height + RADIUS) {
          clear();
          return;
        }
        if (!sized || Math.abs(rect.width - w) > 1 || Math.abs(rect.height - h) > 1) resize();

        // Dots sit at  centre + k·SPACING  — exactly like the CSS pattern below.
        const cxm = rect.width / 2;
        const cym = rect.height / 2;
        const x0 = mx - RADIUS;
        const y0 = my - RADIUS;
        canvas.style.transform = `translate3d(${x0}px, ${y0}px, 0)`;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.clearRect(0, 0, SIZE, SIZE);
        ctx.fillStyle = activeRef.current;

        const kx0 = Math.ceil((x0 - cxm) / SPACING);
        const kx1 = Math.floor((x0 + SIZE - cxm) / SPACING);
        const ky0 = Math.ceil((y0 - cym) / SPACING);
        const ky1 = Math.floor((y0 + SIZE - cym) / SPACING);
        for (let kx = kx0; kx <= kx1; kx++) {
          const x = cxm + kx * SPACING;
          if (x < 0 || x > rect.width) continue;
          for (let ky = ky0; ky <= ky1; ky++) {
            const y = cym + ky * SPACING;
            if (y < 0 || y > rect.height) continue;
            const dx = x - mx;
            const dy = y - my;
            const d2 = dx * dx + dy * dy;
            if (d2 >= RADIUS2) continue;
            const f = smoothstep(1 - Math.sqrt(d2) / RADIUS);
            if (f <= 0.001) continue;
            ctx.globalAlpha = f;
            ctx.beginPath();
            ctx.arc(x - x0, y - y0, DOT_R + f, 0, TAU);
            ctx.fill();
          }
        }
        ctx.globalAlpha = 1;
        drawn = true;
      },
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        field.visible = !!entry?.isIntersecting;
        if (!field.visible) clear();
      },
      { rootMargin: `${RADIUS}px 0px` },
    );
    io.observe(root);
    fields.add(field);

    return () => {
      io.disconnect();
      fields.delete(field);
    };
  }, [interactive]);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="dot-field"
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}
    >
      {interactive && (
        <canvas
          ref={canvasRef}
          style={{ position: "absolute", left: 0, top: 0, display: "block", willChange: "transform" }}
        />
      )}
    </div>
  );
}

export function DotDivider({ height = 38 }: { height?: number }) {
  return (
    <div
      aria-hidden="true"
      className="dot-divider"
      style={{
        position: "relative", left: "50%", marginLeft: "-50vw",
        width: "100vw", height,
        overflow: "hidden",
      }}
    >
      <DotField interactive />
    </div>
  );
}
