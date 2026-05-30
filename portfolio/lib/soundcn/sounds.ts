// CC0 sounds - base64 embedded, no external requests

// Soft click for theme toggle / UI interactions
export const clickSoftSound = {
  dataUri:
    "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjMuMTAwAAAAAAAAAAAAAAD/+1DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAIAAAJxAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr//////////////////////////////////////////////////////////////////wAAAABMYXZjNjIuMTEAAAAAAAAAAAAAAAAkBYYAAAAAAAACcU7MYgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAACghZUlTHgAGDlWufHzAAAVWgJg3EszX3mlF95pSk7enve+GBDEMNMg4R8BLACwAsA7BVjjOhDEMQxWKx5EcJwfB/KBiU8/wI7QH+BHaA/ynv6PB8/LgQEMgD78CHO/oGiAIBAQBAYFAA1hDi4z22DmJ7Et+PSEd1f8Y4PmLI5uDYKAWyCmBlSZJ3gAmD0RBEUDS/HKFzC5iZIr/5FTIvE0Yl3/8ipkXi8Yl0u/xEFQVER7/WCoiCoKiL/4VBURPOqgAQuacbblgZh//7UsQEg8aUBv9cMIAgAAA0gAAABIKqErhFDZUNQ7PRK4S8s8r1HiuGlHuSnenrcW9yvO/PcFflep5XqPKfrO9NTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
};

/**
 * iOS-style unlock sound — synthesized via Web Audio API
 * Plays two ascending tones, mimicking the real iOS slide-to-unlock chime
 */
export function playIOSUnlockSound(audioCtx?: AudioContext): void {
  try {
    const ctx = audioCtx ?? new AudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;

    // Two-note ascending chime (like iOS unlock)
    const notes = [
      { freq: 880,  start: 0,     dur: 0.12, gain: 0.28 },
      { freq: 1174, start: 0.08,  dur: 0.18, gain: 0.22 },
    ];

    notes.forEach(({ freq, start, dur, gain: gv }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + start);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.015, now + start + dur * 0.3);

      filter.type = "lowpass";
      filter.frequency.value = 4000;
      filter.Q.value = 0.8;

      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(gv, now + start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + start);
      osc.stop(now + start + dur + 0.02);
    });
  } catch {
    // AudioContext not available silently fail
  }
}

/**
 * Subtle tick sound for drag progress
 */
export function playTickSound(audioCtx: AudioContext, pitch = 1.0): void {
  try {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.value = 600 * pitch;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  } catch {
    // silent fail
  }
}

/**
 * Theme toggle click — two-tone soft click
 */
export function playThemeToggleSound(isDark: boolean): void {
  try {
    const ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    const freq = isDark ? 520 : 880;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.92, now + 0.08);

    filter.type = "bandpass";
    filter.frequency.value = freq * 1.5;
    filter.Q.value = 2;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.14);
  } catch {
    // silent fail
  }
}