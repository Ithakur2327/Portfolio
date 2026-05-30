// CC0 sounds - base64 embedded, no external requests

// Soft click for theme toggle / UI interactions
export const clickSoftSound = {
  dataUri:
    "data:audio/mpeg;base64,SUQzBAAAAAAAIlRTU0UAAAAOAAADTGF2ZjYyLjMuMTAwAAAAAAAAAAAAAAD/+1DAAAAAAAAAAAAAAAAAAAAAAABJbmZvAAAADwAAAAIAAAJxAKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqr//////////////////////////////////////////////////////////////////wAAAABMYXZjNjIuMTEAAAAAAAAAAAAAAAAkBYYAAAAAAAACcU7MYgYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAACghZUlTHgAGDlWufHzAAAVWgJg3EszX3mlF95pSk7enve+GBDEMNMg4R8BLACwAsA7BVjjOhDEMQxWKx5EcJwfB/KBiU8/wI7QH+BHaA/ynv6PB8/LgQEMgD78CHO/oGiAIBAQBAYFAA1hDi4z22DmJ7Et+PSEd1f8Y4PmLI5uDYKAWyCmBlSZJ3gAmD0RBEUDS/HKFzC5iZIr/5FTIvE0Yl3/8ipkXi8Yl0u/xEFQVER7/WCoiCoKiL/4VBURPOqgAQuacbblgZh//7UsQEg8aUBv9cMIAgAAA0gAAABIKqErhFDZUNQ7PRK4S8s8r1HiuGlHuSnenrcW9yvO/PcFflep5XqPKfrO9NTEFNRTMuMTAwVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV",
};

/**
 * Premium iOS-style unlock chime — synthesized via Web Audio API.
 * 3-note ascending E-major arpeggio (E5 → G#5 → B5) with:
 *  - sine fundamental + triangle harmonic per note
 *  - per-note lowpass filter with frequency sweep
 *  - snap attack (7ms), warm natural decay
 *  - feedback delay for subtle hall reverb
 *  - dynamics compressor for punch + headroom
 */
export function playIOSUnlockSound(audioCtx?: AudioContext): void {
  try {
    const ctx = audioCtx ?? new AudioContext();
    if (ctx.state === "suspended") ctx.resume();

    const now = ctx.currentTime;

    /* ── Dynamics compressor — punch + prevent clipping ── */
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -10;
    comp.knee.value      = 3;
    comp.ratio.value     = 4;
    comp.attack.value    = 0.001;
    comp.release.value   = 0.08;
    comp.connect(ctx.destination);

    /* ── Master gain ── */
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.58, now);
    master.connect(comp);

    /* ── Feedback delay → subtle hall reverb ── */
    const delay   = ctx.createDelay(0.4);
    delay.delayTime.value = 0.052;
    const delayFb  = ctx.createGain();
    delayFb.gain.value = 0.16;
    const delayOut = ctx.createGain();
    delayOut.gain.value = 0.13;
    // Feedback loop
    delay.connect(delayFb);
    delayFb.connect(delay);
    // Wet signal out
    delay.connect(delayOut);
    delayOut.connect(comp);
    // Feed dry signal in
    master.connect(delay);

    /* ── E-major arpeggio: E5 → G#5 → B5 ── */
    const notes: { freq: number; start: number; dur: number; gain: number }[] = [
      { freq: 659.25, start: 0.00,  dur: 0.30, gain: 0.42 }, // E5
      { freq: 830.61, start: 0.09,  dur: 0.28, gain: 0.36 }, // G#5
      { freq: 987.77, start: 0.175, dur: 0.36, gain: 0.28 }, // B5
    ];

    notes.forEach(({ freq, start, dur, gain: gv }) => {
      /* Sine fundamental */
      const osc1    = ctx.createOscillator();
      /* Triangle octave harmonic — adds bell-like brightness */
      const osc2    = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const harmGain = ctx.createGain();
      const lpf      = ctx.createBiquadFilter();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(freq, now + start);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(freq * 2.001, now + start); // slightly detuned octave

      /* Lowpass filter sweeps down — mimics resonant bell decay */
      lpf.type = "lowpass";
      lpf.frequency.setValueAtTime(freq * 5.5, now + start);
      lpf.frequency.exponentialRampToValueAtTime(freq * 1.8, now + start + dur * 0.75);
      lpf.Q.value = 1.0;

      /* Note envelope: snap attack → hold → exponential decay */
      noteGain.gain.setValueAtTime(0,          now + start);
      noteGain.gain.linearRampToValueAtTime(gv, now + start + 0.007);
      noteGain.gain.setTargetAtTime(gv * 0.6,  now + start + 0.018, 0.035);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur);

      /* Harmonic envelope: shorter — adds initial brightness only */
      harmGain.gain.setValueAtTime(0,            now + start);
      harmGain.gain.linearRampToValueAtTime(gv * 0.07, now + start + 0.01);
      harmGain.gain.exponentialRampToValueAtTime(0.0001, now + start + dur * 0.55);

      osc1.connect(lpf);
      lpf.connect(noteGain);
      noteGain.connect(master);

      osc2.connect(harmGain);
      harmGain.connect(master);

      osc1.start(now + start);
      osc1.stop(now  + start + dur + 0.06);
      osc2.start(now + start);
      osc2.stop(now  + start + dur * 0.6);
    });

  } catch {
    // AudioContext not available — silently fail
  }
}

/**
 * Crisp ascending tick during drag — pitch rises across 6 zones.
 */
export function playTickSound(audioCtx: AudioContext, pitch = 1.0): void {
  try {
    const now = audioCtx.currentTime;

    const osc    = audioCtx.createOscillator();
    const gain   = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(860 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(680 * pitch, now + 0.032);

    filter.type = "bandpass";
    filter.frequency.value = 1000 * pitch;
    filter.Q.value = 3.5;

    gain.gain.setValueAtTime(0,     now);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.042);

    osc.connect(filter);
    filter.connect(gain);
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
