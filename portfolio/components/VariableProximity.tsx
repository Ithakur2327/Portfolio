'use client';

import { whenIdle } from '@/lib/idle';
import { Fragment, forwardRef, useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';

/**
 * Variable Proximity — letters swell (heavier stroke, a little bigger, lifted)
 * as the pointer comes near them.
 *
 *  • Touch / coarse-pointer / reduced-motion devices render plain text — no
 *    per-letter DOM, no listeners, nothing to lag while scrolling.
 *  • On a mouse, every letter is pinned to its resting width, so the effect
 *    never re-flows the paragraph; text wraps naturally inside its box.
 *  • The "weight" is a continuous text-stroke + scale, so it is smooth with
 *    ANY font (a static font like Arial only has 400/700 and would snap).
 *    If you do use a variable font, pass `maxWeight` to animate real
 *    font-weight on top.
 *  • Letter positions are cached RELATIVE to the text block and combined with
 *    the block's current rect each frame, so scrolling, section-reveal
 *    transforms and layout shifts can never leave the effect misaligned.
 *  • One shared pointer listener + one rAF loop for every instance; an
 *    instance only works while it is on screen.
 */

type Falloff = 'linear' | 'exponential' | 'gaussian';

/** A run of text inside a word. `hl` is the index of the [[highlight]] it belongs to (-1 = plain). */
export interface VariableProximityPiece {
  text: string;
  hl: number;
  /** Full text of the [[highlight]] group this piece belongs to ('' when plain). */
  group: string;
}

interface VariableProximityProps extends HTMLAttributes<HTMLSpanElement> {
  /** Text to render. Wrap words in [[double brackets]] to mark them as highlights. */
  label?: string;
  /** Pointer reach in px. */
  radius?: number;
  falloff?: Falloff;
  /** 0 = snap, higher = softer easing (seconds-ish, like the original prop). */
  smoothing?: number;
  /** Optional real font-weight animation (variable fonts only): rest / highlight rest / full proximity. */
  baseWeight?: number;
  highlightWeight?: number;
  maxWeight?: number;
  /** Extra text-stroke (px) at full proximity — the font-independent "weight". */
  stroke?: number;
  /** Extra scale at full proximity (1 = none). */
  scale?: number;
  /** Lift in em at full proximity. */
  lift?: number;
  /** Global index of this label's first [[highlight]] (so several labels can share one sequence). */
  startIndex?: number;
  /** Return a class for a piece — used to colour [[highlights]]. Each piece also gets `--i` = its highlight index. */
  pieceClassName?: (piece: VariableProximityPiece) => string | undefined;
  className?: string;
  style?: CSSProperties;
}

const GAUSSIAN_EDGE = Math.exp(-2);
const strengthAt = (d: number, r: number, f: Falloff) => {
  if (d >= r) return 0;
  const n = 1 - d / r;
  if (f === 'exponential') return n * n;
  if (f === 'gaussian') return (Math.exp(-2 * (d / r) ** 2) - GAUSSIAN_EDGE) / (1 - GAUSSIAN_EDGE);
  return n;
};

const SR_ONLY: CSSProperties = {
  position: 'absolute', width: 1, height: 1, padding: 0, margin: -1,
  overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0
};

/** "Hi [[Indresh Thakur]]," → words → pieces. Spaces inside a highlight still split words. */
const parseLabel = (label: string, startIndex: number): VariableProximityPiece[][] => {
  const chars: { ch: string; hl: number; group: string }[] = [];
  const re = /\[\[(.+?)\]\]|([^\[]+|\[)/g;
  let hlCount = startIndex;
  let m: RegExpExecArray | null;
  while ((m = re.exec(label)) !== null) {
    if (m[1] !== undefined) {
      const idx = hlCount++;
      for (const ch of m[1]) chars.push({ ch, hl: idx, group: m[1] });
    } else {
      for (const ch of m[2]) chars.push({ ch, hl: -1, group: '' });
    }
  }
  const words: VariableProximityPiece[][] = [];
  let word: VariableProximityPiece[] = [];
  const flush = () => { if (word.length) words.push(word); word = []; };
  chars.forEach(({ ch, hl, group }) => {
    if (ch === ' ') { flush(); return; }
    const last = word[word.length - 1];
    if (last && last.hl === hl && last.group === group) last.text += ch;
    else word.push({ text: ch, hl, group });
  });
  flush();
  return words;
};

/* ────────────────────────── shared engine ────────────────────────── */

interface Instance {
  el: HTMLElement;
  letters: HTMLElement[];
  hlFlags: boolean[];
  radius: number;
  falloff: Falloff;
  smoothing: number;
  baseWeight: number;
  hlWeight: number;
  maxWeight: number | undefined;
  stroke: number;
  growth: number;
  rise: number;
  // letter centres, relative to the text block's top-left (layout-invariant)
  ax: Float32Array;
  ay: Float32Array;
  width: number;
  height: number;
  level: Float32Array;
  written: Int16Array;
  visible: boolean;
  measure: () => void;
}

const instances = new Set<Instance>();
const pointer = { x: -1e6, y: -1e6, active: false };
let frame = 0;
let lastT = 0;
let bound = false;

function stepInstance(inst: Instance, dt: number): boolean {
  const { letters, level, written, ax, ay } = inst;
  // One rect read per instance per frame: where is the text block RIGHT NOW (scroll,
  // reveal transforms and layout shifts are all already baked into it)?
  const rr = inst.el.getBoundingClientRect();
  const px = pointer.x - rr.left;
  const py = pointer.y - rr.top;
  const R = inst.radius;
  const near =
    pointer.active && px > -R && px < inst.width + R && py > -R && py < inst.height + R;
  const ease = inst.smoothing > 0 ? 1 - Math.exp(-dt / (inst.smoothing * 400)) : 1;
  let busy = false;

  for (let i = 0; i < letters.length; i++) {
    let target = 0;
    if (near) {
      const dx = px - ax[i];
      const dy = py - ay[i];
      const d2 = dx * dx + dy * dy;
      if (d2 < R * R) target = strengthAt(Math.sqrt(d2), R, inst.falloff);
    }
    const cur = level[i];
    if (cur === 0 && target === 0) continue;
    let next = cur + (target - cur) * ease;
    if (Math.abs(target - next) < 0.003) next = target;
    else busy = true;
    level[i] = next;

    // quantise so letters that did not visibly change are never rewritten
    const q = Math.round(next * 48);
    if (written[i] !== q) {
      written[i] = q;
      const el = letters[i];
      if (q === 0) {
        el.style.transform = '';
        el.style.removeProperty('-webkit-text-stroke-width');
        el.style.fontWeight = '';
      } else {
        const lv = q / 48;
        el.style.transform = `translate3d(0, ${(-inst.rise * lv).toFixed(3)}em, 0) scale(${(1 + inst.growth * lv).toFixed(3)})`;
        if (inst.stroke) el.style.setProperty('-webkit-text-stroke-width', `${(inst.stroke * lv).toFixed(2)}px`);
        if (inst.maxWeight) {
          const base = inst.hlFlags[i] ? inst.hlWeight : inst.baseWeight;
          el.style.fontWeight = String(Math.round(base + (inst.maxWeight - base) * lv));
        }
      }
    }
  }
  return busy;
}

function tick(now: number) {
  frame = 0;
  const dt = lastT ? Math.min(now - lastT, 64) : 16;
  lastT = now;
  let busy = false;
  instances.forEach(inst => {
    if (!inst.visible) return;
    if (stepInstance(inst, dt)) busy = true;
  });
  // keep running while letters are still easing; otherwise sleep until the next pointer move
  if (busy) frame = requestAnimationFrame(tick);
  else lastT = 0;
}

function wake() {
  if (!frame) frame = requestAnimationFrame(tick);
}

function bindPointer() {
  if (bound) return;
  bound = true;
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
    wake();
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => {
    pointer.active = false;
    wake();
  });
  // Scrolling moves text under a still pointer — re-evaluate, still no layout reads.
  window.addEventListener('scroll', () => { if (pointer.active) wake(); }, { passive: true });
}

/* ────────────────────────── component ────────────────────────── */

const VariableProximity = forwardRef<HTMLSpanElement, VariableProximityProps>((props, ref) => {
  const {
    label = '',
    radius = 90,
    falloff = 'gaussian',
    smoothing = 0.16,
    baseWeight = 400,
    highlightWeight = 600,
    maxWeight,
    stroke = 0.55,
    scale = 1.2,
    lift = 0.05,
    startIndex = 0,
    pieceClassName,
    className = '',
    style,
    ...restProps
  } = props;

  const rootRef = useRef<HTMLSpanElement | null>(null);
  const [interactive, setInteractive] = useState(false);

  const setRoot = useCallback(
    (node: HTMLSpanElement | null) => {
      rootRef.current = node;
      if (typeof ref === 'function') ref(node);
      else if (ref) ref.current = node;
    },
    [ref]
  );

  // Only mouse-driven, motion-OK devices get the per-letter version — and it is
  // switched on once the browser is idle, so building ~600 letter nodes never
  // competes with hydration / first paint.
  useEffect(() => {
    const ok =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!ok) return;
    return whenIdle(() => setInteractive(true), 700);
  }, []);

  const words = useMemo(() => parseLabel(label, startIndex), [label, startIndex]);
  const plainLabel = useMemo(() => label.replace(/\[\[|\]\]/g, ''), [label]);

  useEffect(() => {
    if (!interactive) return;
    const root = rootRef.current;
    if (!root) return;
    bindPointer();

    const letters = Array.from(root.querySelectorAll<HTMLElement>('[data-l]'));
    const n = letters.length;
    const inst: Instance = {
      el: root,
      letters,
      hlFlags: letters.map(l => l.dataset.h === '1'),
      radius,
      falloff,
      smoothing,
      baseWeight,
      hlWeight: highlightWeight,
      maxWeight,
      stroke,
      growth: (Number(scale) || 1) - 1,
      rise: Number(lift) || 0,
      ax: new Float32Array(n),
      ay: new Float32Array(n),
      width: 0,
      height: 0,
      level: new Float32Array(n),
      written: new Int16Array(n),
      visible: false,
      measure: () => {}
    };

    // Pin each letter to its resting width (weight/scale changes never re-flow the text) and
    // cache every letter's centre relative to the block. `getBoundingClientRect` includes any
    // CSS transform both on the block and on the letters' ancestors in the same way, so the
    // relative offsets stay valid no matter where the block currently is.
    let measureTimer: ReturnType<typeof setTimeout> | undefined;
    let refWidth = 0;
    inst.measure = () => {
      letters.forEach(l => { l.style.width = ''; l.style.transform = ''; });
      const rr = root.getBoundingClientRect();
      const rects = letters.map(l => l.getBoundingClientRect());
      rects.forEach((r, i) => {
        inst.ax[i] = r.left + r.width / 2 - rr.left;
        inst.ay[i] = r.top + r.height / 2 - rr.top;
      });
      inst.width = rr.width;
      inst.height = rr.height;
      refWidth = rr.width;
      letters.forEach((l, i) => { l.style.width = `${rects[i].width}px`; });
      inst.level.fill(0);
      inst.written.fill(0);
    };
    // The block moved (scroll, reveal, layout shift) → nothing to do, positions are relative.
    // Only a width change (resize / rotation) or new glyph widths (fonts) needs a re-measure.
    const revalidate = () => {
      const w = root.getBoundingClientRect().width;
      if (Math.abs(w - refWidth) > 0.5) inst.measure();
      wake();
    };
    const queueMeasure = () => {
      clearTimeout(measureTimer);
      measureTimer = setTimeout(revalidate, 150);
    };
    const onFonts = () => { clearTimeout(measureTimer); measureTimer = setTimeout(() => { inst.measure(); wake(); }, 60); };

    // Measure when the block is in its resting position (not mid reveal-transition).
    const settle = setTimeout(() => { inst.measure(); }, 0);
    inst.measure();
    instances.add(inst);
    document.fonts?.ready.then(onFonts).catch(() => {});

    const io = new IntersectionObserver(([e]) => {
      inst.visible = !!e?.isIntersecting;
      if (inst.visible) wake();
    });
    io.observe(root);

    // width changes (rotation, resize) and content-height changes both move the letters
    const ro = new ResizeObserver(queueMeasure);
    if (root.parentElement) ro.observe(root.parentElement);

    return () => {
      clearTimeout(measureTimer);
      clearTimeout(settle);
      io.disconnect();
      ro.disconnect();
      instances.delete(inst);
      letters.forEach(l => { l.style.width = ''; l.style.fontWeight = ''; l.style.transform = ''; l.style.removeProperty('-webkit-text-stroke-width'); });
    };
  }, [interactive, label, radius, falloff, smoothing, baseWeight, highlightWeight, maxWeight, stroke, scale, lift]);

  return (
    <span
      ref={setRoot}
      className={className}
      style={{ display: 'inline', ...style }}
      {...restProps}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          {wi > 0 && ' '}
          <span data-word="" style={{ display: 'inline-block', whiteSpace: 'nowrap' }} aria-hidden="true">
            {word.map((piece, pi) => (
              <span
                key={pi}
                className={pieceClassName?.(piece)}
                style={piece.hl >= 0 ? ({ '--i': piece.hl } as CSSProperties) : undefined}
              >
                {interactive
                  ? piece.text.split('').map((letter, li) => (
                      <span
                        key={li}
                        data-l=""
                        data-h={piece.hl >= 0 ? '1' : '0'}
                        style={{ display: 'inline-block', textAlign: 'center', transformOrigin: '50% 80%' }}
                      >
                        {letter}
                      </span>
                    ))
                  : piece.text}
              </span>
            ))}
          </span>
        </Fragment>
      ))}
      <span style={SR_ONLY}>{plainLabel}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;