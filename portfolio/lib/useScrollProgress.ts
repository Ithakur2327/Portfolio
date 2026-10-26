"use client";
import { useEffect } from "react";
import { whenIdle } from "@/lib/idle";
import { useMotionValue, type MotionValue } from "motion/react";

/**
 * Drop-in, layout-read-free replacement for `useScroll({ target, offset })`.
 *
 * Motion's useScroll re-reads offsetTop/offsetLeft/clientHeight… up the whole
 * ancestor chain of every tracked element on EVERY scroll frame. Each of those
 * reads forces a synchronous style + layout pass, so a handful of tracked
 * elements turned every scroll frame into dozens of forced layouts.
 *
 * Here the element's page position is measured only when something actually
 * changes (mount, resize, fonts/images settling, document height change); a
 * scroll frame is then pure arithmetic and a single MotionValue write per
 * subscriber. One shared scroll listener + one rAF serves every subscriber.
 *
 * `offset` uses the same grammar as Motion: [targetPoint viewportPoint, …],
 * where a point is start | center | end | <fraction> | <n>% | <n>px.
 */

type Offset = [string, string];

type Sub = {
  el: HTMLElement;
  mv: MotionValue<number>;
  offset: Offset;
  s0: number;
  s1: number;
  last: number;
};

const subs = new Set<Sub>();
let raf = 0;
let bound = false;
let ro: ResizeObserver | null = null;
let measureTimer: ReturnType<typeof setTimeout> | undefined;

function resolvePoint(token: string, length: number): number {
  const t = token.trim();
  if (t === "start") return 0;
  if (t === "center") return length / 2;
  if (t === "end") return length;
  if (t.endsWith("%")) return (parseFloat(t) / 100) * length;
  if (t.endsWith("px")) return parseFloat(t);
  const n = parseFloat(t);
  return Number.isFinite(n) ? n * length : 0;
}

/** Document-space top of an element, ignoring transforms (same basis Motion uses). */
function pageTop(el: HTMLElement): number {
  let top = 0;
  let node: HTMLElement | null = el;
  while (node) {
    top += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return top;
}

function measure(sub: Sub, vh: number) {
  const top = pageTop(sub.el);
  const h = sub.el.offsetHeight;
  const [a, b] = sub.offset.map((pair) => {
    const [tp, vp] = pair.split(/\s+/);
    return top + resolvePoint(tp, h) - resolvePoint(vp ?? "end", vh);
  }) as [number, number];
  sub.s0 = a;
  sub.s1 = b;
}

function progress(sub: Sub, y: number) {
  const span = sub.s1 - sub.s0;
  if (!span) return y >= sub.s1 ? 1 : 0;
  const p = (y - sub.s0) / span;
  return p < 0 ? 0 : p > 1 ? 1 : p;
}

function flush() {
  raf = 0;
  const y = window.scrollY;
  subs.forEach((s) => {
    const p = progress(s, y);
    // Skip sub-pixel noise, but always land exactly on 0 / 1.
    if (Math.abs(p - s.last) > 0.0005 || ((p === 0 || p === 1) && p !== s.last)) {
      s.last = p;
      s.mv.set(p);
    }
  });
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(flush);
}

function measureAll() {
  const vh = window.innerHeight;
  subs.forEach((s) => measure(s, vh));
  schedule();
}

let initialTimer: (() => void) | null = null;
function scheduleInitialMeasure() {
  if (initialTimer) return;
  initialTimer = whenIdle(() => {
    initialTimer = null;
    measureAll();
  }, 700);
}

function queueMeasure() {
  clearTimeout(measureTimer);
  measureTimer = setTimeout(measureAll, 60);
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", queueMeasure);
  window.addEventListener("load", queueMeasure);
  document.fonts?.ready.then(queueMeasure).catch(() => {});
  // Anything that changes the document's height can move every target.
  if (typeof ResizeObserver !== "undefined") {
    ro = new ResizeObserver(queueMeasure);
    ro.observe(document.documentElement);
  }
}

function unbind() {
  if (!bound || subs.size) return;
  bound = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", queueMeasure);
  window.removeEventListener("load", queueMeasure);
  ro?.disconnect();
  ro = null;
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}

export function useScrollProgress(
  target: React.RefObject<HTMLElement | null>,
  offset: Offset = ["start end", "end start"],
): MotionValue<number> {
  const mv = useMotionValue(0);
  const [o0, o1] = offset;

  useEffect(() => {
    const el = target.current;
    if (!el) return;
    const sub: Sub = { el, mv, offset: [o0, o1], s0: 0, s1: 1, last: -1 };
    subs.add(sub);
    bind();
    // Measuring forces a layout; do it once for every subscriber that joined in this
    // burst, when the browser is idle, instead of once each inside the hydration task.
    // Until then the progress is simply 0 (correct for everything below the fold).
    sub.s0 = sub.s1 = Infinity;
    sub.last = 0;
    scheduleInitialMeasure();
    return () => {
      subs.delete(sub);
      unbind();
    };
  }, [target, mv, o0, o1]);

  return mv;
}