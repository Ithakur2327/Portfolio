"use client";

import React, { useEffect, useMemo, useRef } from "react";

/**
 * Split-flap ("airport") board.
 *
 * Same look and behaviour as the original component — every character
 * scrambles through random flaps (some flash a colour) before landing on its
 * letter, top flap folding down, bottom flap rising with a little overshoot —
 * but rebuilt to be cheap:
 *  • Plain DOM + Web Animations, driven by ONE rAF loop. No React state per
 *    flap, so a 132-cell board never re-renders while it animates.
 *  • It only runs while it is on screen and goes completely idle afterwards.
 *  • prefers-reduced-motion: messages swap instantly, no flipping.
 */

const FLAP_CHARS = " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$()-+&=;:'\"%,./?°";

export const BOARD_ROWS = 6;
export const BOARD_COLS = 22;

const BASE_COL_DELAY = 8;
const BASE_ROW_DELAY = 6;
const BASE_STEP_MS = 40;
const BASE_FLIP_S = 0.16;
const BASE_TOTAL_S = ((BOARD_COLS - 1) * BASE_COL_DELAY + (BOARD_ROWS - 1) * BASE_ROW_DELAY + 8 * BASE_STEP_MS) / 1000;

const ACCENTS = 7; // see .sfb-cell[data-ta] in globals.css

const COLOR_MAP: Record<string, string> = {
  "{R}": "#D32F2F",
  "{O}": "#F57C00",
  "{Y}": "#FBC02D",
  "{G}": "#43A047",
  "{B}": "#1E88E5",
  "{V}": "#8E24AA",
  "{W}": "#FAFAFA",
};

type ParsedCell = { type: "char"; value: string } | { type: "color"; hex: string };

function parseRow(row: string): ParsedCell[] {
  const cells: ParsedCell[] = [];
  let i = 0;
  while (i < row.length) {
    if (row[i] === "{" && i + 2 < row.length && row[i + 2] === "}") {
      const code = row.substring(i, i + 3);
      if (COLOR_MAP[code]) {
        cells.push({ type: "color", hex: COLOR_MAP[code] });
        i += 3;
        continue;
      }
    }
    cells.push({ type: "char", value: row[i] });
    i++;
  }
  return cells;
}

function wrapParagraph(paragraph: string, maxCols: number): string[] {
  const lines: string[] = [];
  const words = paragraph.split(/[ \t]+/).filter(Boolean);
  let currentLine = "";
  for (const word of words) {
    if (word.length > maxCols) {
      if (currentLine) { lines.push(currentLine); currentLine = ""; }
      lines.push(word.slice(0, maxCols));
      continue;
    }
    if (!currentLine) currentLine = word;
    else if (currentLine.length + 1 + word.length <= maxCols) currentLine += " " + word;
    else { lines.push(currentLine); currentLine = word; }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function wrapText(input: string, maxCols: number): string[] {
  return input.split("\n").flatMap((p) => (p.trim() === "" ? [""] : wrapParagraph(p, maxCols)));
}

/** Lay a message out on the 6 × 22 grid, centred. */
function layout(text: string): ParsedCell[][] {
  const grid: ParsedCell[][] = Array.from({ length: BOARD_ROWS }, () =>
    Array.from({ length: BOARD_COLS }, () => ({ type: "char" as const, value: " " })),
  );
  const lines = wrapText(text, BOARD_COLS).slice(0, BOARD_ROWS);
  const startRow = Math.max(0, Math.floor((BOARD_ROWS - lines.length) / 2));
  lines.forEach((line, i) => {
    const row = startRow + i;
    if (row >= BOARD_ROWS) return;
    const parsed = parseRow(line);
    const startCol = Math.max(0, Math.floor((BOARD_COLS - parsed.length) / 2));
    parsed.forEach((cell, c) => {
      if (startCol + c < BOARD_COLS) grid[row][startCol + c] = cell;
    });
  });
  return grid;
}

/* ───────────────────────── one flap cell (imperative) ───────────────────────── */

type Cell = {
  root: HTMLElement;
  top: HTMLElement;
  bot: HTMLElement;
  flapTop: HTMLElement;
  flapBot: HTMLElement;
  cur: string;
  curAccent: number; // -1 = none
  tile: string | null; // colour tile hex
  // scramble plan
  target: string;
  step: number;
  steps: number;
  nextAt: number;
};

function buildCell(): Cell {
  const root = document.createElement("div");
  root.className = "sfb-cell";
  root.innerHTML =
    '<div class="sfb-area">' +
    '<div class="sfb-half sfb-top"></div>' +
    '<div class="sfb-half sfb-bot"></div>' +
    '<div class="sfb-half sfb-flap sfb-flap-top"></div>' +
    '<div class="sfb-half sfb-flap sfb-flap-bot"></div>' +
    "</div>";
  const q = (sel: string) => root.querySelector(sel) as HTMLElement;
  return {
    root,
    top: q(".sfb-top"),
    bot: q(".sfb-bot"),
    flapTop: q(".sfb-flap-top"),
    flapBot: q(".sfb-flap-bot"),
    cur: " ",
    curAccent: -1,
    tile: null,
    target: " ",
    step: 0,
    steps: 0,
    nextAt: Infinity,
  };
}

function setAccent(cell: Cell, accent: number) {
  if (accent < 0) {
    delete cell.root.dataset.ta;
  } else {
    cell.root.dataset.ta = String(accent);
  }
  cell.curAccent = accent;
}

function setTile(cell: Cell, hex: string | null) {
  cell.tile = hex;
  if (hex) {
    cell.root.dataset.tile = "1";
    cell.root.style.setProperty("--tile", hex);
  } else {
    delete cell.root.dataset.tile;
    cell.root.style.removeProperty("--tile");
  }
}

/** Show `ch` (with `accent`) and fold the previous character away. */
function flip(cell: Cell, ch: string, accent: number, flipS: number, animate: boolean) {
  const prevCh = cell.cur;
  const prevAccent = cell.curAccent;

  // previous glyph → the falling top flap, coloured as it was
  cell.flapTop.dataset.c = prevCh;
  if (prevAccent >= 0) cell.flapTop.dataset.fa = String(prevAccent);
  else delete cell.flapTop.dataset.fa;

  // new glyph → static halves + the rising bottom flap
  cell.top.dataset.c = ch;
  cell.bot.dataset.c = ch;
  cell.flapBot.dataset.c = ch;
  setAccent(cell, accent);
  cell.cur = ch;

  if (!animate) return;
  cell.flapTop.getAnimations().forEach((a) => a.cancel());
  cell.flapBot.getAnimations().forEach((a) => a.cancel());
  cell.flapTop.style.visibility = "visible";
  cell.flapBot.style.visibility = "visible";
  cell.flapTop.animate(
    [
      { transform: "rotateX(0deg)" },
      { transform: "rotateX(-100deg)" },
    ],
    { duration: flipS * 1000, easing: "cubic-bezier(0.55,0.055,0.675,0.19)", fill: "forwards" },
  );
  cell.flapBot.animate(
    [{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }],
    { duration: flipS * 0.85 * 1000, delay: flipS * 0.5 * 1000, easing: "cubic-bezier(0.33,1.55,0.64,1)", fill: "both" },
  );
}

/* ───────────────────────── the board ───────────────────────── */

export interface TextFlippingBoardProps {
  /** Messages to cycle through (see lib/board-messages.ts for the format). */
  messages: string[];
  /** Seconds a message stays on screen once it has settled. */
  hold?: number;
  /** Total flip-in duration in seconds. */
  duration?: number;
  className?: string;
}

export function TextFlippingBoard({ messages, hold = 5.5, duration = BASE_TOTAL_S, className }: TextFlippingBoardProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const grids = useMemo(() => messages.map(layout), [messages]);
  const plain = useMemo(() => messages.map((m) => m.replace(/\{[ROYGBVW]\}/g, "").replace(/\s*\n\s*/g, " ").trim()), [messages]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !grids.length) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scale = duration / BASE_TOTAL_S;
    const colDelay = BASE_COL_DELAY * scale;
    const rowDelay = BASE_ROW_DELAY * scale;
    const stepMs = BASE_STEP_MS * scale;
    const flipS = Math.min(0.6, Math.max(0.15, BASE_FLIP_S * scale));

    // The 132 cells are built the first time the board is about to be seen — not at page load.
    const cells: Cell[] = [];
    const ensureBuilt = () => {
      if (cells.length) return;
      const frag = document.createDocumentFragment();
      for (let i = 0; i < BOARD_ROWS * BOARD_COLS; i++) {
        const c = buildCell();
        cells.push(c);
        frag.appendChild(c.root);
      }
      host.appendChild(frag);
      host.dataset.built = "1";
    };

    const cleanups: (() => void)[] = [];
    let msgIndex = 0;
    let showing = -1;
    let raf = 0;
    let holdTimer: ReturnType<typeof setTimeout> | undefined;
    let inView = false;
    let due = false; // a hold elapsed while the board was off screen
    let pending = 0; // cells still scrambling

    const applyMessage = (idx: number, now: number, animate: boolean) => {
      const grid = grids[idx];
      showing = idx;
      pending = 0;
      for (let r = 0; r < BOARD_ROWS; r++) {
        for (let c = 0; c < BOARD_COLS; c++) {
          const cell = cells[r * BOARD_COLS + c];
          const spec = grid[r][c];
          if (spec.type === "color") {
            setTile(cell, spec.hex);
            cell.target = " ";
            cell.nextAt = Infinity;
            continue;
          }
          if (cell.tile) setTile(cell, null);
          const upper = spec.value.toUpperCase();
          const target = FLAP_CHARS.includes(upper) ? upper : " ";
          if (target === cell.cur && cell.curAccent < 0) {
            cell.nextAt = Infinity;
            continue;
          }
          if (!animate) {
            flip(cell, target, -1, flipS, false);
            cell.nextAt = Infinity;
            continue;
          }
          cell.target = target;
          cell.step = 0;
          cell.steps = target === " " ? 2 + Math.floor(Math.random() * 3) : 4 + Math.floor(Math.random() * 4);
          cell.nextAt = now + c * colDelay + r * rowDelay;
          pending++;
        }
      }
      if (liveRef.current) liveRef.current.textContent = plain[idx];
    };

    const nextMessage = () => {
      msgIndex = (msgIndex + 1) % grids.length;
      applyMessage(msgIndex, performance.now(), true);
      start();
    };

    const scheduleNext = () => {
      clearTimeout(holdTimer);
      holdTimer = setTimeout(() => {
        if (inView) nextMessage();
        else due = true; // pick it up as soon as the board scrolls back into view
      }, hold * 1000 + flipS * 1000);
    };

    // One rAF loop, alive only while letters are actually flipping.
    const tick = (now: number) => {
      raf = 0;
      if (!inView) return;
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (now < cell.nextAt) continue;
        cell.step += 1;
        const last = cell.step >= cell.steps;
        const ch = last ? cell.target : FLAP_CHARS[1 + Math.floor(Math.random() * (FLAP_CHARS.length - 1))];
        const accent = last ? -1 : Math.random() < 0.2 ? Math.floor(Math.random() * ACCENTS) : -1;
        flip(cell, ch, accent, flipS, true);
        if (last) {
          cell.nextAt = Infinity;
          pending--;
        } else {
          cell.nextAt = now + stepMs;
        }
      }
      if (pending > 0) raf = requestAnimationFrame(tick);
      else scheduleNext();
    };

    function start() {
      if (!raf && pending > 0) raf = requestAnimationFrame(tick);
    }

    const prebuild = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        prebuild.disconnect();
        ensureBuilt();
        if (reduce) applyMessage(0, performance.now(), false);
      }
    }, { rootMargin: "900px 0px" });
    prebuild.observe(host);

    if (reduce) {
      // built on first approach (see prebuild); messages then rotate without flipping
      if (grids.length > 1) {
        const t = setInterval(() => {
          if (!inView || !cells.length) return;
          msgIndex = (msgIndex + 1) % grids.length;
          applyMessage(msgIndex, performance.now(), false);
        }, 7000);
        cleanups.push(() => clearInterval(t));
      }
    }

    const io = new IntersectionObserver(([e]) => {
      inView = !!e?.isIntersecting;
      if (!inView || reduce) return;
      ensureBuilt();
      if (showing === -1) {
        applyMessage(0, performance.now(), true);
        start();
      } else if (due) {
        due = false;
        nextMessage();
      } else {
        start();
      }
    }, { rootMargin: "80px 0px" });
    io.observe(host);

    return () => {
      io.disconnect();
      prebuild.disconnect();
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(holdTimer);
      cleanups.forEach((fn) => fn());
      host.textContent = "";
      delete host.dataset.built;
    };
  }, [grids, plain, hold, duration]);

  return (
    <div className={`sfb${className ? ` ${className}` : ""}`}>
      <div ref={hostRef} className="sfb-grid" aria-hidden="true" />
      <p ref={liveRef} className="sfb-live" aria-live="polite" />
    </div>
  );
}

export default TextFlippingBoard;