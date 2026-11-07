"use client";

import { useEffect, useRef } from "react";
import {
  SCENES, TILES, PALETTE_DARK, PALETTE_LIGHT, gridFor, layoutScene,
  type Anim, type Laid, type Palette, type Scene,
} from "@/lib/board-scenes";

/**
 * Split-flap board — gita verses, developer quotes, code and colour puzzles.
 *
 * One <canvas>, drawn in whole device pixels (razor-sharp on retina / 4K
 * phones). Every distinct flap face (character + colour) is rendered ONCE into
 * a small bitmap; a flip is then just a few `drawImage` calls — the old top
 * half folds down, the new bottom half unfolds, with shading. Only cells that
 * are actually flipping are redrawn, and only while the board is on screen, so
 * a settled board costs nothing. (The first version had ~800 DOM nodes and
 * ~260 CSS 3D layers animating at once, which is what made phones struggle.)
 */

const FONT = '"Geist Pixel Square", "Geist Mono", ui-monospace, SFMono-Regular, Menlo, monospace';
const SCRAMBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&$?+=/<>{}";

type Motion = { maxDelay: number; steps: [number, number]; stepMs: number; flipMs: number };
const MOTION: Record<Anim, Motion> = {
  center: { maxDelay: 1150, steps: [7, 11], stepMs: 135, flipMs: 128 },
  ltr:    { maxDelay: 900,  steps: [6, 10], stepMs: 108, flipMs: 100 },
  ttb:    { maxDelay: 900,  steps: [6, 10], stepMs: 108, flipMs: 100 },
  diag:   { maxDelay: 950,  steps: [6, 10], stepMs: 108, flipMs: 100 },
  random: { maxDelay: 950,  steps: [6, 11], stepMs: 108, flipMs: 100 },
  spiral: { maxDelay: 1200, steps: [6, 10], stepMs: 112, flipMs: 104 },
  wave:   { maxDelay: 1000, steps: [6, 10], stepMs: 108, flipMs: 100 },
  type:   { maxDelay: 0,    steps: [2, 3],  stepMs: 78,  flipMs: 74 },
};

const rand = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const isLight = () => document.documentElement.classList.contains("light");

function spiralOrder(cols: number, rows: number): Float32Array {
  const order = new Float32Array(cols * rows);
  let top = 0, left = 0, bottom = rows - 1, right = cols - 1, k = 0;
  const total = cols * rows;
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) order[top * cols + c] = k++ / total;
    for (let r = top + 1; r <= bottom; r++) order[r * cols + right] = k++ / total;
    if (top < bottom) for (let c = right - 1; c >= left; c--) order[bottom * cols + c] = k++ / total;
    if (left < right) for (let r = bottom - 1; r > top; r--) order[r * cols + left] = k++ / total;
    top++; left++; bottom--; right--;
  }
  return order;
}

export function FlapBoard() {
  const hostRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const tilt = tiltRef.current;
    const canvas = canvasRef.current;
    if (!host || !tilt || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ── geometry (all in whole DEVICE pixels, so static cells are pixel-exact) ── */
    let cols = 22, rows = 6, aspect = 1.7;
    let cwP = 90, chP = 150, gapP = 6, padXP = 30, padYP = 30, fsP = 80, dpr = 1;
    let cssH = 0;
    let n = 0;
    let spiral: Float32Array<ArrayBufferLike> = new Float32Array(0);
    let atlas = new Map<string, HTMLCanvasElement>();

    /* ── per-cell state ── */
    let curCh: string[] = [], prevCh: string[] = [], tgtCh: string[] = [];
    let curFg = new Uint8Array(0), prevFg = new Uint8Array(0), tgtFg = new Uint8Array(0);
    let curBg = new Int8Array(0), prevBg = new Int8Array(0), tgtBg = new Int8Array(0);
    let flipStart = new Float64Array(0);
    let stepsLeft = new Int16Array(0);
    let nextAt = new Float64Array(0);
    let active: number[] = [];
    let inActive = new Uint8Array(0);

    let pal: Palette = isLight() ? PALETTE_LIGHT : PALETTE_DARK;
    let sceneIdx = -1;
    let laid: Laid | null = null;
    let motion: Motion = MOTION.ltr;
    let tileScene = false;

    let inView = false;
    let raf = 0;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let blinkTimer: ReturnType<typeof setInterval> | undefined;
    let due = false;
    let transitioning = false;
    let cursorIdx = -1;
    let cursorOn = false;
    let ready = false;

    const alloc = () => {
      n = cols * rows;
      curCh = new Array(n).fill(" "); prevCh = new Array(n).fill(" "); tgtCh = new Array(n).fill(" ");
      curFg = new Uint8Array(n); prevFg = new Uint8Array(n); tgtFg = new Uint8Array(n);
      curBg = new Int8Array(n).fill(-1); prevBg = new Int8Array(n).fill(-1); tgtBg = new Int8Array(n).fill(-1);
      flipStart = new Float64Array(n).fill(-1);
      stepsLeft = new Int16Array(n);
      nextAt = new Float64Array(n).fill(Infinity);
      active = [];
      inActive = new Uint8Array(n);
      spiral = spiralOrder(cols, rows);
    };

    const setGeometry = () => {
      const width = Math.max(240, host.clientWidth);
      const g = gridFor(width);
      const changedGrid = g.cols !== cols || g.rows !== rows || !n;
      cols = g.cols; rows = g.rows; aspect = g.aspect;
      // sharp, but bounded: ≤ ~5.5 megapixels of backing store
      dpr = Math.min(window.devicePixelRatio || 1, 3);
      const est = (d: number) => width * (width / 2.2) * d * d;
      while (est(dpr) > 5.5e6 && dpr > 1) dpr -= 0.25;
      const WP = Math.round(width * dpr);
      const small = width < 640;
      gapP = Math.max(1, Math.round((small ? 2 : 3) * dpr));
      const padMin = Math.round((small ? 8 : 14) * dpr);
      cwP = Math.floor((WP - padMin * 2 - gapP * (cols - 1)) / cols);
      chP = Math.round(cwP * aspect / 2) * 2;                    // even → the hinge sits on a pixel boundary
      padXP = Math.floor((WP - (cwP * cols + gapP * (cols - 1))) / 2);
      padYP = padMin;
      const HP = padYP * 2 + rows * chP + (rows - 1) * gapP;
      fsP = Math.min(cwP * 1.12, chP * 0.6);
      cssH = HP / dpr;
      canvas.width = WP;
      canvas.height = HP;
      canvas.style.height = `${cssH}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      host.style.minHeight = "0px";
      atlas = new Map();
      if (changedGrid) alloc();
    };

    /* ── drawing ── */
    const FACE_FONT = () => `700 ${fsP.toFixed(2)}px ${FONT}`;

    const roundedFace = (g: CanvasRenderingContext2D, w: number, h: number, r: number) => {
      g.beginPath();
      g.moveTo(r, 0); g.lineTo(w - r, 0); g.arcTo(w, 0, w, r, r);
      g.lineTo(w, h - r); g.arcTo(w, h, w - r, h, r);
      g.lineTo(r, h); g.arcTo(0, h, 0, h - r, r);
      g.lineTo(0, r); g.arcTo(0, 0, r, 0, r);
      g.closePath();
    };

    /** One flap face (both halves) rendered once and re-used for every frame. */
    const face = (chr: string, fg: number, bg: number): HTMLCanvasElement => {
      const key = bg >= 0 ? `t${bg}` : `${chr}|${fg}`;
      const hit = atlas.get(key);
      if (hit) return hit;
      const c = document.createElement("canvas");
      c.width = cwP; c.height = chP;
      const g = c.getContext("2d")!;
      const r = Math.min(3.2 * dpr, cwP * 0.14);
      const hh = chP / 2;
      g.save();
      roundedFace(g, cwP, chP, r);
      g.clip();
      if (bg >= 0) {
        g.fillStyle = TILES[bg]; g.fillRect(0, 0, cwP, chP);
        g.fillStyle = "rgba(255,255,255,0.22)"; g.fillRect(0, 0, cwP, hh * 0.55);
        g.fillStyle = "rgba(0,0,0,0.17)"; g.fillRect(0, hh, cwP, hh);
      } else {
        g.fillStyle = pal.faceTop; g.fillRect(0, 0, cwP, hh);
        g.fillStyle = pal.faceBot; g.fillRect(0, hh, cwP, hh);
        g.fillStyle = pal.gloss; g.fillRect(0, 0, cwP, Math.max(1, dpr * 1.2));
        if (chr !== " ") {
          g.font = FACE_FONT();
          g.textAlign = "center"; g.textBaseline = "middle"; g.lineJoin = "round";
          g.lineWidth = Math.max(0.6, fsP * 0.045);
          g.fillStyle = pal.fg[fg]; g.strokeStyle = pal.fg[fg];
          const cx = cwP / 2, cy = chP / 2 + fsP * 0.05;
          g.fillText(chr, cx, cy);
          g.strokeText(chr, cx, cy); // faux-bold: heavier, clearer strokes at small sizes
        }
      }
      g.restore();
      atlas.set(key, c);
      return c;
    };

    const drawCell = (i: number, now: number) => {
      const r = (i / cols) | 0;
      const c = i - r * cols;
      const x = padXP + c * (cwP + gapP);
      const y = padYP + r * (chP + gapP);
      const hh = chP / 2;
      const hy = y + hh;
      ctx.fillStyle = pal.bezel;
      ctx.fillRect(x - gapP, y - gapP, cwP + gapP * 2, chP + gapP * 2);

      const t = flipStart[i] >= 0 ? (now - flipStart[i]) / motion.flipMs : 1;
      const cur = face(curCh[i], curFg[i], curBg[i]);
      if (t >= 1) {
        ctx.drawImage(cur, x, y);
      } else {
        const old = face(prevCh[i], prevFg[i], prevBg[i]);
        ctx.drawImage(cur, 0, 0, cwP, hh, x, y, cwP, hh);              // new top, revealed underneath
        ctx.drawImage(old, 0, hh, cwP, hh, x, hy, cwP, hh);            // old bottom, still showing
        if (t < 0.5) {
          const a = Math.pow(t / 0.5, 1.8);                             // old top folds down (gravity ease-in)
          const dh = Math.max(1, hh * Math.cos(a * Math.PI / 2));
          ctx.drawImage(old, 0, 0, cwP, hh, x, hy - dh, cwP, dh);
          ctx.fillStyle = `rgba(0,0,0,${(a * 0.55).toFixed(3)})`;
          ctx.fillRect(x, hy - dh, cwP, dh);
        } else {
          const a = 1 - Math.pow(1 - (t - 0.5) / 0.5, 2.4);             // new bottom unfolds, settling
          const dh = Math.max(1, hh * Math.sin(a * Math.PI / 2));
          ctx.drawImage(cur, 0, hh, cwP, hh, x, hy, cwP, dh);
          ctx.fillStyle = `rgba(0,0,0,${((1 - a) * 0.5).toFixed(3)})`;
          ctx.fillRect(x, hy, cwP, dh);
        }
      }
      // hinge groove
      const hl = Math.max(1, Math.round(dpr));
      ctx.fillStyle = pal.hinge; ctx.fillRect(x, hy - hl, cwP, hl * 2);
      ctx.fillStyle = pal.hingeLight; ctx.fillRect(x, hy + hl, cwP, hl);
      if (i === cursorIdx && cursorOn && t >= 1) {
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = pal.fg[2];
        ctx.fillRect(x + cwP * 0.2, y + chP * 0.22, cwP * 0.6, chP * 0.56);
        ctx.globalAlpha = 1;
      }
    };

    const drawAll = (now = performance.now()) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = pal.bezel;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < n; i++) drawCell(i, now);
    };

    /* ── scene handling ── */
    const settleInstantly = (L: Laid) => {
      for (let i = 0; i < n; i++) {
        curCh[i] = L.ch[i]; curFg[i] = L.fg[i]; curBg[i] = L.bg[i];
        prevCh[i] = L.ch[i]; prevFg[i] = L.fg[i]; prevBg[i] = L.bg[i];
        flipStart[i] = -1; stepsLeft[i] = 0; nextAt[i] = Infinity; inActive[i] = 0;
      }
      active = [];
      cursorIdx = L.cursor;
    };

    const announce = (s: Scene) => {
      if (!liveRef.current) return;
      const text = s.kind === "text" ? `${(s.text ?? "").replace(/\[\[|\]\]/g, "")} — ${s.by ?? ""}` : s.kind === "code" ? (s.lines ?? []).join(" ") : s.label;
      liveRef.current.textContent = text;
    };

    const delayFor = (i: number, a: Anim, orderIdx: number) => {
      const r = (i / cols) | 0, c = i - r * cols;
      const D = motion.maxDelay;
      switch (a) {
        case "center": {
          const dx = (c - (cols - 1) / 2) / (cols / 2), dy = (r - (rows - 1) / 2) / (rows / 2);
          return Math.min(1, Math.hypot(dx, dy) / 1.25) * D;
        }
        case "ltr": return (c / Math.max(1, cols - 1)) * D + Math.random() * 50;
        case "ttb": return (r / Math.max(1, rows - 1)) * D + c * (50 / cols);
        case "diag": return ((r + c * 0.6) / (rows + cols * 0.6)) * D;
        case "random": return Math.random() * D;
        case "spiral": return spiral[i] * D;
        case "wave": return (c / Math.max(1, cols - 1)) * D * 0.7 + ((Math.sin(r * 0.9 + c * 0.35) + 1) / 2) * D * 0.3;
        case "type": return orderIdx * 20;
      }
    };

    const startFrame = () => { if (!raf && inView && active.length) raf = requestAnimationFrame(frame); };

    const goTo = (idx: number, instant: boolean) => {
      clearTimeout(holdTimer);
      clearInterval(blinkTimer);
      cursorOn = false;
      sceneIdx = (idx + SCENES.length) % SCENES.length;
      const scene = SCENES[sceneIdx];
      const L = layoutScene(scene, cols, rows, aspect);
      laid = L;
      tileScene = scene.kind === "puzzle";
      motion = MOTION[scene.anim];
      announce(scene);

      if (instant || reduce) {
        settleInstantly(L);
        drawAll();
        scheduleNext(scene);
        return;
      }

      const now = performance.now();
      transitioning = true;
      let order = 0;
      for (let i = 0; i < n; i++) {
        const same = curCh[i] === L.ch[i] && curFg[i] === L.fg[i] && curBg[i] === L.bg[i];
        cursorIdx = -1;
        if (same) continue;
        tgtCh[i] = L.ch[i]; tgtFg[i] = L.fg[i]; tgtBg[i] = L.bg[i];
        const blank = L.ch[i] === " " && L.bg[i] < 0;
        stepsLeft[i] = scene.anim === "type" && blank ? 1 : rand(motion.steps[0], motion.steps[1]);
        nextAt[i] = now + delayFor(i, scene.anim, order++);
        if (!inActive[i]) { inActive[i] = 1; active.push(i); }
      }
      cursorIdx = -1;
      startFrame();
      if (!active.length) onSettled();
    };

    const scheduleNext = (scene: Scene) => {
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        if (inView && !transitioning) goTo(sceneIdx + 1, false);
        else due = true;
      }, (scene.hold ?? 6) * 1000);
    };

    const onSettled = () => {
      transitioning = false;
      const scene = SCENES[sceneIdx];
      if (laid && laid.cursor >= 0 && !reduce) {
        cursorIdx = laid.cursor;
        cursorOn = true;
        const step = () => {
          if (!inView) return;
          cursorOn = !cursorOn;
          drawCell(cursorIdx, performance.now());
        };
        clearInterval(blinkTimer);
        blinkTimer = setInterval(step, 540);
        drawCell(cursorIdx, performance.now());
      }
      scheduleNext(scene);
    };

    const frame = (now: number) => {
      raf = 0;
      if (!inView) return;
      for (let k = active.length - 1; k >= 0; k--) {
        const i = active[k];
        if (stepsLeft[i] > 0 && now >= nextAt[i]) {
          prevCh[i] = curCh[i]; prevFg[i] = curFg[i]; prevBg[i] = curBg[i];
          stepsLeft[i]--;
          if (stepsLeft[i] === 0) {
            curCh[i] = tgtCh[i]; curFg[i] = tgtFg[i]; curBg[i] = tgtBg[i];
            nextAt[i] = Infinity;
          } else {
            if (tileScene || Math.random() < 0.2) { curCh[i] = " "; curFg[i] = 0; curBg[i] = rand(0, TILES.length - 1); }
            else { curCh[i] = SCRAMBLE[rand(0, SCRAMBLE.length - 1)]; curFg[i] = 0; curBg[i] = -1; }
            nextAt[i] = now + motion.stepMs;
          }
          flipStart[i] = now;
        }
        if (flipStart[i] >= 0) {
          drawCell(i, now);
          if (now - flipStart[i] >= motion.flipMs) flipStart[i] = -1;
        }
        if (stepsLeft[i] === 0 && flipStart[i] < 0) {
          inActive[i] = 0;
          active[k] = active[active.length - 1];
          active.pop();
        }
      }
      if (active.length) raf = requestAnimationFrame(frame);
      else onSettled();
    };

    /* ── lifecycle ── */
    const init = () => {
      if (ready) return;
      ready = true;
      setGeometry();
      const first = 0;
      const L = layoutScene(SCENES[first], cols, rows, aspect);
      // show something immediately (blank board), then flip the first scene in
      for (let i = 0; i < n; i++) { curCh[i] = " "; prevCh[i] = " "; }
      sceneIdx = first;
      laid = L;
      drawAll();
      goTo(first, false);
      const fontReady = () => { setGeometry(); drawAll(); };
      document.fonts?.load(`700 20px "Geist Pixel Square"`).then(fontReady).catch(() => {});
    };

    const io = new IntersectionObserver(([e]) => {
      inView = !!e?.isIntersecting;
      host.classList.toggle("fb--live", inView);
      if (!inView) { cancelAnimationFrame(raf); raf = 0; return; }
      if (!ready) { init(); return; }
      if (due && !transitioning) { due = false; goTo(sceneIdx + 1, false); return; }
      startFrame();
    }, { rootMargin: "120px 0px" });
    io.observe(host);

    // build the canvas shortly before it is needed
    const pre = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) { pre.disconnect(); setGeometry(); drawAll(); }
    }, { rootMargin: "700px 0px" });
    pre.observe(host);

    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!ready) return;
        const prevCols = cols, prevRows = rows;
        setGeometry();
        if (cols !== prevCols || rows !== prevRows) {
          const L = layoutScene(SCENES[sceneIdx], cols, rows, aspect);
          laid = L;
          settleInstantly(L);
        }
        drawAll();
        if (laid && laid.cursor >= 0) cursorIdx = laid.cursor;
      }, 90);
    });
    ro.observe(host);

    const mo = new MutationObserver(() => {
      pal = isLight() ? PALETTE_LIGHT : PALETTE_DARK;
      atlas = new Map();
      if (ready) drawAll();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const onVis = () => { if (!document.hidden) startFrame(); };
    document.addEventListener("visibilitychange", onVis);

    // click / tap → next card
    const onClick = () => { if (ready && inView && !transitioning) goTo(sceneIdx + 1, false); };
    host.addEventListener("click", onClick);

    // gentle 3D tilt, desktop pointers only
    let tiltFrame = 0, tx = 0, ty = 0;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reduce;
    const applyTilt = () => {
      tiltFrame = 0;
      tilt.style.transform = `perspective(1100px) rotateX(${(-ty * 3.2).toFixed(2)}deg) rotateY(${(tx * 4.2).toFixed(2)}deg)`;
    };
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!tiltFrame) tiltFrame = requestAnimationFrame(applyTilt);
    };
    const onEnter = () => { tilt.style.willChange = "transform"; tilt.style.transition = "transform 0.14s cubic-bezier(0.22,0.61,0.36,1)"; };
    const onLeave = () => {
      tx = ty = 0;
      tilt.style.transition = "transform 0.6s cubic-bezier(0.22,1,0.36,1)";
      tilt.style.transform = "";
      setTimeout(() => { tilt.style.willChange = ""; }, 650);
    };
    if (fine) {
      host.addEventListener("pointerenter", onEnter);
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }

    return () => {
      io.disconnect(); pre.disconnect(); ro.disconnect(); mo.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      host.removeEventListener("click", onClick);
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf); cancelAnimationFrame(tiltFrame);
      clearTimeout(holdTimer); clearInterval(blinkTimer); clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div ref={hostRef} className="fb" role="img" aria-label="Rotating board of Bhagavad Gita verses, developer quotes, code snippets and colour puzzles. Click to flip to the next card.">
      <div ref={tiltRef} className="fb-tilt">
        <canvas ref={canvasRef} className="fb-canvas" />
        <span className="fb-sheen" aria-hidden="true" />
      </div>
      <p ref={liveRef} className="fb-live" aria-live="polite" />
    </div>
  );
}

export default FlapBoard;