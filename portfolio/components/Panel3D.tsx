"use client";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";

/**
 * A section's content area, rendered as a physical 3D slab.
 *
 *  • Static look (pure CSS, see `.s3d*` in globals.css): an even edge and a
 *    soft shadow around the whole panel. Thickness, corner radius and shadow
 *    spread are expressed in container-query units (`cqw`).
 *  • Pointer tilt (fine pointers only): perspective + rotation are derived
 *    from the slab's *measured size* — with a deliberately subtle limit.
 *    Only `transform` is written (compositor-only), and
 *    nothing is written to inherited custom properties, so the content inside
 *    is never restyled while tilting.
 *  • At rest the slab has NO transform, so sticky / fixed descendants behave
 *    exactly as they would without it.
 */

type Props = {
  children: ReactNode;
  /** "slab" = full panel with a face. "lift" = only depth + shadow around an element that already has its own surface. */
  variant?: "slab" | "lift";
  /** Pointer tilt. Turn off for areas that rely on exact pointer geometry (drag physics, shared-layout modals). */
  tilt?: boolean;
  className?: string;
  style?: CSSProperties;
  id?: string;
};

const MAX_EDGE_DEPTH_PX = 4; // how far an edge may move in z at full tilt
const rad2deg = 180 / Math.PI;

export function Panel3D({ children, variant = "slab", tilt = true, className, style, id }: Props) {
  const stageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const glossRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!tilt) return;
    const stage = stageRef.current;
    const body = bodyRef.current;
    const gloss = glossRef.current;
    if (!stage || !body) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rect: DOMRect | null = null;
    let maxX = 1; // deg, around the X axis (driven by height)
    let maxY = 1; // deg, around the Y axis (driven by width)
    let persp = 1200;
    let nx = 0;
    let ny = 0;
    let px = 0;
    let py = 0;
    let frame = 0;
    let inside = false;
    let suspended = false;
    let resetTimer: ReturnType<typeof setTimeout> | undefined;

    // Derive the tilt envelope from the slab's size — this is what makes the
    // 3D follow the area when the layout width changes.
    const size = () => {
      const w = stage.offsetWidth;
      const h = stage.offsetHeight;
      const ang = (len: number) => Math.min(1.2, Math.max(0.25, Math.asin(Math.min(1, MAX_EDGE_DEPTH_PX / (len / 2))) * rad2deg));
      maxX = ang(h);
      maxY = ang(w);
      persp = Math.round(Math.max(w, h * 0.6) * 1.7);
    };
    const ro = new ResizeObserver(size);
    ro.observe(stage);
    size();

    const apply = () => {
      frame = 0;
      body.style.transform = `perspective(${persp}px) rotateX(${(-ny * maxX).toFixed(3)}deg) rotateY(${(nx * maxY).toFixed(3)}deg)`;
      if (gloss && rect) gloss.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
    };

    const onEnter = () => {
      if (suspended) return;
      inside = true;
      clearTimeout(resetTimer);
      rect = stage.getBoundingClientRect();
      body.classList.remove("is-leaving");
      body.classList.add("is-hot");
      if (gloss) gloss.style.opacity = "1";
    };
    const onMove = (e: PointerEvent) => {
      if (suspended || !inside || e.pointerType === "touch") return;
      if (!rect) rect = stage.getBoundingClientRect();
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
      nx = Math.max(-1, Math.min(1, (px / rect.width) * 2 - 1));
      ny = Math.max(-1, Math.min(1, (py / rect.height) * 2 - 1));
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const reset = () => {
      inside = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      body.classList.remove("is-hot");
      body.classList.add("is-leaving");
      body.style.transform = "perspective(1px) rotateX(0deg) rotateY(0deg)";
      if (gloss) gloss.style.opacity = "0";
      clearTimeout(resetTimer);
      // Back to a true `transform: none` once the ease-out has finished.
      resetTimer = setTimeout(() => {
        body.style.transform = "";
        body.classList.remove("is-leaving");
      }, 650);
    };
    const onLeave = () => {
      suspended = false;
      if (inside) reset();
    };
    // Clicking inside (opening a modal, starting a drag…) flattens the slab
    // until the pointer leaves, so nothing measures against a tilted parent.
    const onDown = () => {
      if (inside) {
        suspended = true;
        reset();
      }
    };
    const onScroll = () => {
      rect = null;
    };

    stage.addEventListener("pointerenter", onEnter);
    stage.addEventListener("pointermove", onMove, { passive: true });
    stage.addEventListener("pointerleave", onLeave);
    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      ro.disconnect();
      clearTimeout(resetTimer);
      if (frame) cancelAnimationFrame(frame);
      stage.removeEventListener("pointerenter", onEnter);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", onScroll);
      body.style.transform = "";
    };
  }, [tilt]);

  return (
    <div ref={stageRef} id={id} className={`s3d${className ? ` ${className}` : ""}`} data-variant={variant} style={style}>
      <div ref={bodyRef} className="s3d__body">
        <span className="s3d__shadow" aria-hidden="true" />
        <span className="s3d__wall" aria-hidden="true" />
        <div className="s3d__face">
          {variant === "slab" && (
            <span className="s3d__gloss" aria-hidden="true">
              <i ref={glossRef} />
            </span>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
