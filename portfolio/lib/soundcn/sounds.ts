/**
 * Sound engine — Web Audio API synthesis + base64 assets.
 * Theme toggle and tick use synthesis.
 * Slide-to-unlock uses a chanhdai-style real audio clip (CC0).
 */

/* ─── Shared AudioContext singleton ─── */
let _ctx: AudioContext | null = null;
function getCtx(): AudioContext {
  if (!_ctx) _ctx = new AudioContext();
  if (_ctx.state === "suspended") _ctx.resume();
  return _ctx;
}

/* ─── Base64 audio cache ─── */
const _bufCache = new Map<string, AudioBuffer>();
async function decodeB64(dataUri: string): Promise<AudioBuffer> {
  const cached = _bufCache.get(dataUri);
  if (cached) return cached;
  const ctx = getCtx();
  const b64 = dataUri.split(",")[1];
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  const buf = await ctx.decodeAudioData(bytes.buffer.slice(0));
  _bufCache.set(dataUri, buf);
  return buf;
}

async function playB64(dataUri: string, volume = 1, rate = 1): Promise<void> {
  try {
    const ctx = getCtx();
    const buf = await decodeB64(dataUri);
    const src = ctx.createBufferSource();
    const gain = ctx.createGain();
    src.buffer = buf;
    src.playbackRate.value = rate;
    gain.gain.value = volume;
    src.connect(gain);
    gain.connect(ctx.destination);
    src.start(0);
  } catch { /* silent fail */ }
}

/* ─── CC0 soft click (same as chanhdai click-soft, Kenney) ─── */
const CLICK_SOFT_URI =
  "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjMuMTAwAAAAAAAAAAAAAAD/+1DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAIAAAJxAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr//////////////////////////////////////////////////////////////////wAAAABMYXZjNjIuMTEAAAAAAAAAAAAAAAAkBYYAAAAAAAACcU7MYgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAACghZUlTHgAGDlWufHzAAAVWgJg3EszX3mlF95pSk7enve+GBDEMNMg4R8BLACwAsA7BVjjOhDEMQxWKx5EcJwfB/KBiU8/wI7QH+BHaA/ynv6PB8/LgQEMgD78CHO/oGiAIBAQBAYFAA1hDi4z22DmJ7Et+PSEd1f8Y4PmLI5uDYKAWyCmBlSZJ3gAmD0RBEUDS/HKFzC5iZIr/5FTIvE0Yl3/8ipkXi8Yl0u/xEFQVER7/WCoiCoKiL/4VBURPOqgAQuacbblgZh//7UsQEg8aUBv9cMIAgAAA0gAAABIKqErhFDZUNQ7PRK4S8s8r1HiuGlHuSnenrcW9yvO/PcFflep5XqPKfrO9NTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";

/**
 * Slide-to-unlock — soft synthesized "unlock" chime.
 * Two-tone ascending notes, gentle and satisfying.
 */
export function playIOSUnlockSound(audioCtx?: AudioContext): void {
  try {
    const ctx = audioCtx ?? getCtx();
    const now = ctx.currentTime;

    // Two ascending notes: C5 → E5
    const notes = [523.25, 659.25];
    notes.forEach((freq, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      const t    = now + i * 0.08;

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.004, t + 0.18);

      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);

      // Subtle harmonic overtone
      const osc2  = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(freq * 2, t);
      gain2.gain.setValueAtTime(0, t);
      gain2.gain.linearRampToValueAtTime(0.06, t + 0.008);
      gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);   gain.connect(ctx.destination);
      osc2.connect(gain2); gain2.connect(ctx.destination);
      osc.start(t);  osc.stop(t + 0.34);
      osc2.start(t); osc2.stop(t + 0.20);
    });
  } catch { /* silent fail */ }
}

/**
 * Drag tick — very subtle soft click per zone.
 */
export function playTickSound(audioCtx: AudioContext, pitch = 1.0): void {
  try {
    const now = audioCtx.currentTime;
    const osc    = audioCtx.createOscillator();
    const gain   = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(720 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(520 * pitch, now + 0.020);

    filter.type = "bandpass";
    filter.frequency.value = 820 * pitch;
    filter.Q.value = 2.5;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.042, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.024);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.028);
  } catch { /* silent fail */ }
}

/**
 * Theme toggle — plays the CC0 soft click (chanhdai-style),
 * with a subtle pitch shift for dark vs light feel.
 */
export function playThemeToggleSound(isDark: boolean): void {
  try {
    const ctx = getCtx();
    const now = ctx.currentTime;

    // short click with slight pitch difference for dark/light
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(isDark ? 520 : 720, now);

    gain.gain.setValueAtTime(0.0, now);
    gain.gain.linearRampToValueAtTime(0.36, now + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  } catch { /* silent fail */ }
}