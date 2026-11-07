/**
 * Scenes for the split-flap board (components/FlapBoard.tsx).
 *
 * A scene is either
 *   • text   — a quote (+ optional attribution), word-wrapped and centred to whatever grid the
 *              board currently has (22×6 on desktop … 14×10 on a phone). Wrap words in [[double
 *              brackets]] to highlight them.
 *   • code   — a few lines of syntax-coloured code / terminal output.
 *   • puzzle — a pattern of colour tiles.
 * `anim` picks how the flaps cascade in, so every kind of scene arrives differently.
 */

export type Anim = "center" | "ltr" | "ttb" | "diag" | "random" | "spiral" | "wave" | "type";
export type PatternName = "rainbow" | "checker" | "rings" | "glyph" | "mosaic" | "sunrise" | "waves";

export type Scene = {
  id: string;
  kind: "text" | "code" | "puzzle";
  /** text scenes: the quote. */
  text?: string;
  /** text scenes: who said it / where it is from. */
  by?: string;
  tone?: "gita" | "dev" | "fact";
  /** code scenes: wide layout, and an optional shorter version for narrow grids. */
  lines?: string[];
  short?: string[];
  pattern?: PatternName;
  anim: Anim;
  /** seconds on screen once settled */
  hold?: number;
  /** read-out for screen readers */
  label: string;
};

export const SCENES: Scene[] = [
  { id: "g1", kind: "text", tone: "gita", anim: "center", hold: 8, label: "Bhagavad Gita 2.47",
    text: "Your right is to [[the action alone]], never to its fruits.", by: "Bhagavad Gita 2.47" },
  { id: "d1", kind: "text", tone: "dev", anim: "ltr", label: "Linus Torvalds",
    text: "Talk is cheap. [[Show me the code.]]", by: "Linus Torvalds" },
  { id: "p1", kind: "puzzle", pattern: "rainbow", anim: "wave", hold: 4.5, label: "Colour puzzle" },
  { id: "c1", kind: "code", anim: "type", hold: 6.5, label: "A few lines of code",
    lines: ["const dev = () => {", "  while (1) learn();", "  ship();", "};"],
    short: ["dev = () => {", "  learn();", "  ship();", "}"] },
  { id: "g2", kind: "text", tone: "gita", anim: "spiral", hold: 8, label: "Bhagavad Gita 6.5",
    text: "[[Lift yourself]] by your own effort. You are your own friend or enemy.", by: "Bhagavad Gita 6.5" },
  { id: "d2", kind: "text", tone: "dev", anim: "ttb", label: "Kent Beck",
    text: "Make it [[work]]. Make it [[right]]. Make it [[fast]].", by: "Kent Beck" },
  { id: "p2", kind: "puzzle", pattern: "checker", anim: "diag", hold: 4.5, label: "Colour puzzle" },
  { id: "g3", kind: "text", tone: "gita", anim: "center", hold: 8, label: "Bhagavad Gita 2.20",
    text: "The soul is [[never born]], and it [[never dies]].", by: "Bhagavad Gita 2.20" },
  { id: "c2", kind: "code", anim: "type", hold: 6, label: "Terminal",
    lines: ['$ git commit -m "wip"', "[main 4f2a9c1] wip", "1 file changed"],
    short: ["$ git push", "pushed: main", "all green"] },
  { id: "d3", kind: "text", tone: "dev", anim: "diag", label: "Donald Knuth",
    text: "[[Premature optimization]] is the root of all evil.", by: "Donald Knuth" },
  { id: "p3", kind: "puzzle", pattern: "rings", anim: "spiral", hold: 4.5, label: "Colour puzzle" },
  { id: "g4", kind: "text", tone: "gita", anim: "wave", hold: 8, label: "Bhagavad Gita 2.14",
    text: "Joy and pain come and go like the seasons. [[Bear them calmly.]]", by: "Bhagavad Gita 2.14" },
  { id: "f1", kind: "text", tone: "fact", anim: "random", label: "Fun fact",
    text: "The first computer bug was a real [[moth]], found in 1947.", by: "Harvard Mark II" },
  { id: "c3", kind: "code", anim: "type", hold: 5.5, label: "A joke in code",
    lines: ["0.1 + 0.2", "= 0.30000000000000004", "// IEEE 754 magic"],
    short: ["0.1 + 0.2", "= 0.30000000", "// IEEE 754"] },
  { id: "d4", kind: "text", tone: "dev", anim: "center", label: "Alan Kay",
    text: "The best way to predict the future is to [[invent it.]]", by: "Alan Kay" },
  { id: "p4", kind: "puzzle", pattern: "glyph", anim: "random", hold: 5, label: "Colour puzzle" },
  { id: "g5", kind: "text", tone: "gita", anim: "spiral", hold: 8, label: "Bhagavad Gita 4.38",
    text: "Nothing in this world purifies like [[knowledge.]]", by: "Bhagavad Gita 4.38" },
  { id: "d5", kind: "text", tone: "dev", anim: "ltr", label: "Brian Kernighan",
    text: "[[Debugging]] is twice as hard as writing the code in the first place.", by: "Brian Kernighan" },
  { id: "c4", kind: "code", anim: "type", hold: 6, label: "Terminal",
    lines: ["$ npm run dream", "> building...", "done in 0.42s"],
    short: ["$ npm run dev", "> building...", "done in 0.4s"] },
  { id: "g6", kind: "text", tone: "gita", anim: "center", hold: 8, label: "Bhagavad Gita 6.35",
    text: "The restless mind is tamed by [[practice]] and [[detachment.]]", by: "Bhagavad Gita 6.35" },
  { id: "p5", kind: "puzzle", pattern: "mosaic", anim: "random", hold: 4.5, label: "Colour puzzle" },
  { id: "d6", kind: "text", tone: "dev", anim: "ttb", label: "Phil Karlton",
    text: "Two hard things in CS: [[cache invalidation]] and [[naming things.]]", by: "Phil Karlton" },
  { id: "c5", kind: "code", anim: "type", hold: 6, label: "try / catch / finally",
    lines: ["try { build(); }", "catch { learn(); }", "finally { ship(); }"],
    short: ["try {", "  build();", "} catch {", "  learn();", "} finally {", "  ship();", "}"] },
  { id: "g7", kind: "text", tone: "gita", anim: "wave", hold: 8, label: "Bhagavad Gita 2.48",
    text: "Stay steady in success and failure. [[That evenness is yoga.]]", by: "Bhagavad Gita 2.48" },
  { id: "p6", kind: "puzzle", pattern: "sunrise", anim: "center", hold: 4.5, label: "Colour puzzle" },
  { id: "d7", kind: "text", tone: "dev", anim: "diag", label: "Edsger Dijkstra",
    text: "[[Simplicity]] is prerequisite for [[reliability.]]", by: "Edsger W. Dijkstra" },
  { id: "g8", kind: "text", tone: "gita", anim: "spiral", hold: 8, label: "Bhagavad Gita 17.3",
    text: "A person is made by their faith. [[As they believe, so they become.]]", by: "Bhagavad Gita 17.3" },
  { id: "c6", kind: "code", anim: "type", hold: 5.5, label: "404",
    lines: ["404", "BUG NOT FOUND", "// it's a feature"],
    short: ["404", "BUG NOT FOUND", "// a feature"] },
  { id: "p7", kind: "puzzle", pattern: "waves", anim: "ltr", hold: 4.5, label: "Colour puzzle" },
  { id: "d8", kind: "text", tone: "dev", anim: "random", label: "Marc Andreessen",
    text: "[[Software]] is eating the world.", by: "Marc Andreessen" },
];

/* ───────────────────────── palette ───────────────────────── */

/** Text colour slots */
export const FG = { text: 0, gold: 1, teal: 2, pink: 3, violet: 4, green: 5, blue: 6, dim: 7, orange: 8, red: 9 } as const;

export type Palette = {
  bezel: string;
  faceTop: string;
  faceBot: string;
  gloss: string;
  hinge: string;
  hingeLight: string;
  fg: string[];
};

export const PALETTE_DARK: Palette = {
  bezel: "#0a0b0d",
  faceTop: "#202328",
  faceBot: "#171a1e",
  gloss: "rgba(255,255,255,0.07)",
  hinge: "rgba(0,0,0,0.75)",
  hingeLight: "rgba(255,255,255,0.07)",
  fg: ["#f6f7f9", "#f7c948", "#2dd4cf", "#ff6fae", "#b6a2ff", "#4ade80", "#6cb2ff", "#808897", "#ff9f43", "#ff6464"],
};

export const PALETTE_LIGHT: Palette = {
  bezel: "#c7ced9",
  faceTop: "#ffffff",
  faceBot: "#e9edf3",
  gloss: "rgba(255,255,255,0.65)",
  hinge: "rgba(20,30,50,0.42)",
  hingeLight: "rgba(255,255,255,0.8)",
  fg: ["#10131a", "#b7791f", "#0f8f8b", "#d6336c", "#6741d9", "#15803d", "#1971c2", "#6b7280", "#d9480f", "#c92a2a"],
};

/** Colour-tile slots */
export const TILES = ["#ff4d6d", "#ff9f1c", "#ffd60a", "#2ec27e", "#0abab5", "#3b82f6", "#8b5cf6", "#ff5fa2"];

/* ───────────────────────── layout ───────────────────────── */

export type Laid = {
  ch: string[];
  fg: Uint8Array;
  /** colour-tile index, or -1 for a normal flap */
  bg: Int8Array;
  /** index of the cell where a blinking cursor belongs (code scenes), or -1 */
  cursor: number;
};

/* a word with one colour per character, so a highlight followed by punctuation stays glued together */
type Word = { w: string; fg: number[] };

function wrapWords(words: Word[], cols: number): Word[][] {
  const lines: Word[][] = [];
  let line: Word[] = [];
  let len = 0;
  for (const word of words) {
    let w = word;
    // very long single words are hard-split
    while (w.w.length > cols) {
      if (line.length) { lines.push(line); line = []; len = 0; }
      lines.push([{ w: w.w.slice(0, cols), fg: w.fg.slice(0, cols) }]);
      w = { w: w.w.slice(cols), fg: w.fg.slice(cols) };
    }
    const add = (line.length ? 1 : 0) + w.w.length;
    if (len + add <= cols) { line.push(w); len += add; }
    else { lines.push(line); line = [w]; len = w.w.length; }
  }
  if (line.length) lines.push(line);
  return lines;
}

const mono = (w: string, fg: number): Word => ({ w, fg: Array.from({ length: w.length }, () => fg) });

function parseHighlights(text: string, hlFg: number, baseFg: number): Word[] {
  const out: Word[] = [];
  const re = /\[\[(.+?)\]\]|([^\[]+)/g;
  let prevEndedWithSpace = true;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const hl = m[1] !== undefined;
    const raw = (m[1] ?? m[2]).toUpperCase();
    // glue only when there is NO space between the two chunks:  "[[alone]], never" -> "ALONE,"
    const glueToPrev = out.length > 0 && !prevEndedWithSpace && !/^\s/.test(raw);
    prevEndedWithSpace = /\s$/.test(raw);
    raw.split(/\s+/).filter(Boolean).forEach((w, k) => {
      const piece = mono(w, hl ? hlFg : baseFg);
      if (k === 0 && glueToPrev) {
        const prev = out[out.length - 1];
        prev.w += piece.w;
        prev.fg = prev.fg.concat(piece.fg);
      } else out.push(piece);
    });
  }
  return out;
}

const KEYWORDS = new Set(["const", "let", "var", "return", "while", "if", "else", "for", "function", "try", "catch", "finally", "import", "from", "new", "await", "async", "git", "npm", "sudo", "echo", "true", "false"]);

function tokenize(line: string): { t: string; fg: number }[] {
  const out: { t: string; fg: number }[] = [];
  const re = /\s+|\/\/.*|"[^"]*"|'[^']*'|\d+(?:\.\d+)?|[A-Za-z_$][\w$]*|[^\sA-Za-z0-9_$]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    const t = m[0];
    let fg: number = FG.text;
    if (/^\s+$/.test(t)) fg = FG.text;
    else if (t.startsWith("//")) fg = FG.dim;
    else if (t[0] === '"' || t[0] === "'") fg = FG.green;
    else if (/^\d/.test(t)) fg = FG.orange;
    else if (KEYWORDS.has(t)) fg = FG.violet;
    else if (/^[A-Za-z_$]/.test(t) && line[m.index + t.length] === "(") fg = FG.blue;
    else if (t === "$" || t === ">" && m.index === 0) fg = FG.teal;
    else if (/^[{}()[\];,=<>+\-*/.]+$/.test(t)) fg = FG.dim;
    out.push({ t, fg });
  }
  return out;
}

/* colour patterns: (row, col, rows, cols, cellAspect) → tile index or -1 */
const hash = (a: number, b: number) => {
  let h = (a * 374761393 + b * 668265263) ^ 0x5bd1e995;
  h = (h ^ (h >>> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
};
function distToSeg(px: number, py: number, ax: number, ay: number, bx: number, by: number) {
  const dx = bx - ax, dy = by - ay;
  const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy || 1)));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

const PATTERNS: Record<PatternName, (r: number, c: number, rows: number, cols: number, asp: number) => number> = {
  rainbow: (r, c) => (r + c) % 7,
  checker: (r, c) => ((r + c) % 2 === 0 ? 4 : (r % 2 === 0 ? 2 : 7)),
  rings: (r, c, rows, cols) => {
    const x = (c - (cols - 1) / 2) / (cols / 2), y = (r - (rows - 1) / 2) / (rows / 2);
    return Math.floor((Math.abs(x) + Math.abs(y)) * 4.5) % 7;
  },
  glyph: (r, c, rows, cols, asp) => {
    // </> drawn with thick line segments in "cell widths" space
    const W = cols, H = rows * asp;
    const px = c + 0.5, py = (r + 0.5) * asp;
    const cx = W / 2, cy = H / 2, s = Math.min(W / 2.6, H / 1.5) * 0.5;
    const th = 0.95;
    if (distToSeg(px, py, cx - s * 1.45, cy, cx - s * 0.65, cy - s * 0.9) < th || distToSeg(px, py, cx - s * 1.45, cy, cx - s * 0.65, cy + s * 0.9) < th) return 4;
    if (distToSeg(px, py, cx + s * 1.45, cy, cx + s * 0.65, cy - s * 0.9) < th || distToSeg(px, py, cx + s * 1.45, cy, cx + s * 0.65, cy + s * 0.9) < th) return 7;
    if (distToSeg(px, py, cx + s * 0.28, cy - s * 1.05, cx - s * 0.28, cy + s * 1.05) < th) return 2;
    return -1;
  },
  mosaic: (r, c) => (hash(r, c) < 0.12 ? -1 : Math.floor(hash(c + 7, r + 3) * 8)),
  sunrise: (r, c, rows, cols, asp) => {
    const px = (c + 0.5) - cols / 2, py = ((r + 0.5) - rows) * asp;
    const d = Math.hypot(px, py) / (cols / 2);
    if (d < 0.3) return 2;
    if (d < 0.5) return 1;
    if (d < 0.72) return 0;
    if (d < 0.95) return 7;
    return -1;
  },
  waves: (r, c) => ((Math.floor(r + Math.sin(c * 0.55) * 2.2 + 8)) % 7 + 7) % 7,
};

export function layoutScene(scene: Scene, cols: number, rows: number, cellAspect = 1.6): Laid {
  const n = cols * rows;
  const out: Laid = { ch: new Array(n).fill(" "), fg: new Uint8Array(n), bg: new Int8Array(n).fill(-1), cursor: -1 };

  if (scene.kind === "puzzle" && scene.pattern) {
    const f = PATTERNS[scene.pattern];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) out.bg[r * cols + c] = f(r, c, rows, cols, cellAspect);
    return out;
  }

  if (scene.kind === "code") {
    const src = (cols < 20 && scene.short ? scene.short : scene.lines) ?? [];
    const lines = src.slice(0, rows).map(l => l.slice(0, cols - 1));
    const maxLen = Math.max(...lines.map(l => l.length), 1);
    const startRow = Math.max(0, Math.floor((rows - lines.length) / 2));
    const startCol = Math.max(0, Math.floor((cols - maxLen) / 2));
    lines.forEach((line, li) => {
      let col = startCol;
      for (const tok of tokenize(line)) {
        for (const chr of tok.t) {
          if (col < cols) { const i = (startRow + li) * cols + col; out.ch[i] = chr; out.fg[i] = tok.fg; }
          col++;
        }
      }
    });
    const lastRow = startRow + lines.length - 1;
    const endCol = Math.min(cols - 1, startCol + (lines[lines.length - 1]?.length ?? 0));
    out.cursor = lastRow * cols + endCol;
    return out;
  }

  // text
  const tone = scene.tone ?? "dev";
  const hl = tone === "gita" ? FG.gold : tone === "fact" ? FG.pink : FG.teal;
  const byFg = tone === "gita" ? FG.orange : FG.dim;
  const wrapCols = Math.max(8, cols - 2); // keep a one-flap margin on both sides
  const body = wrapWords(parseHighlights(scene.text ?? "", hl, FG.text), wrapCols);
  const by = scene.by ? wrapWords([mono("-", byFg), ...scene.by.toUpperCase().split(/\s+/).map(w => mono(w, byFg))], wrapCols) : [];
  const all: Word[][] = [...body, ...(by.length ? [[], ...by] : [])];
  const lines = all.slice(0, rows);
  const startRow = Math.max(0, Math.floor((rows - lines.length) / 2));
  lines.forEach((line, li) => {
    const len = line.reduce((a, w, i) => a + w.w.length + (i ? 1 : 0), 0);
    let col = Math.max(0, Math.floor((cols - len) / 2));
    line.forEach((w, wi) => {
      if (wi) col++;
      for (let k = 0; k < w.w.length; k++) {
        if (col < cols) { const i = (startRow + li) * cols + col; out.ch[i] = w.w[k]; out.fg[i] = w.fg[k]; }
        col++;
      }
    });
  });
  return out;
}

/** Grid for a given board width (CSS px). Phones get fewer, bigger, easier-to-read cells. */
export function gridFor(width: number) {
  if (width >= 640) return { cols: 22, rows: 6, aspect: 1.7 };
  if (width >= 440) return { cols: 18, rows: 8, aspect: 1.6 };
  return { cols: 14, rows: 10, aspect: 1.5 };
}