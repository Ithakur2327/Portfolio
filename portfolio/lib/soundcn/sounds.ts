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

/* ─── CC0 laser/whoosh (chanhdai laser-small-001, Kenney) ─── */
const LASER_URI =
  "data:audio/mpeg;base64,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";

/**
 * Slide-to-unlock — plays the CC0 laser/whoosh clip (chanhdai-style),
 * slightly pitched down for a satisfying "unlock" feel.
 */
export function playIOSUnlockSound(audioCtx?: AudioContext): void {
  // Ignore passed ctx — use singleton for caching
  void playB64(LASER_URI, 0.55, 0.82);
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
  // Use the click-soft clip at different rates for dark/light feel
  void playB64(CLICK_SOFT_URI, 0.45, isDark ? 0.88 : 1.18);
}
