/**
 * Sound engine — Web Audio API synthesis + base64 assets.
 * Theme toggle plays a CC0 real audio clip (see playThemeToggleSound below).
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
 * Theme toggle — plays the CC0 soft click (chanhdai-style),
 * with a subtle pitch shift for dark vs light feel.
 */
export function playThemeToggleSound(isDark: boolean): void {
  // Use the click-soft clip at different rates for dark/light feel
  void playB64(CLICK_SOFT_URI, 0.45, isDark ? 0.88 : 1.18);
}