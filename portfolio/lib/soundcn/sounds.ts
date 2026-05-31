/**
 * Web Audio sound engine — zero files, pure synthesis.
 * Enhanced: stereo panning + louder volumes.
 */

/** Create a stereo panner at position (-1 = left, 0 = center, +1 = right) */
function mkPanner(ctx: AudioContext, pan: number): StereoPannerNode | null {
  try {
    const p = ctx.createStereoPanner();
    p.pan.value = pan;
    return p;
  } catch { return null; }
}

/**
 * Soft unlock — stereo whoosh + layered clicks for depth.
 */
export function playIOSUnlockSound(audioCtx?: AudioContext): void {
  try {
    const ctx = audioCtx ?? new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.85, now);  // louder
    master.connect(ctx.destination);

    /* ── Stereo whoosh sweep (L→R panning) ── */
    const bufSize = Math.floor(ctx.sampleRate * 0.22);
    const buf = ctx.createBuffer(2, bufSize, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) {
      const data = buf.getChannelData(ch);
      for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.9;
    }

    const noise     = ctx.createBufferSource();
    const bandpass  = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();
    const panner    = mkPanner(ctx, 0);

    noise.buffer = buf;
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(600, now);
    bandpass.frequency.exponentialRampToValueAtTime(3200, now + 0.18);
    bandpass.Q.value = 0.9;

    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.42, now + 0.018);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    if (panner) { noiseGain.connect(panner); panner.connect(master); }
    else noiseGain.connect(master);
    noise.start(now);
    noise.stop(now + 0.24);

    /* ── Primary soft click ── */
    const click     = ctx.createOscillator();
    const clickFilt = ctx.createBiquadFilter();
    const clickGain = ctx.createGain();
    const clickPan  = mkPanner(ctx, -0.3);

    click.type = "sine";
    click.frequency.setValueAtTime(220, now + 0.04);
    click.frequency.exponentialRampToValueAtTime(70, now + 0.12);
    clickFilt.type = "lowpass";
    clickFilt.frequency.value = 350;

    clickGain.gain.setValueAtTime(0, now + 0.04);
    clickGain.gain.linearRampToValueAtTime(0.6, now + 0.05);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);

    click.connect(clickFilt);
    clickFilt.connect(clickGain);
    if (clickPan) { clickGain.connect(clickPan); clickPan.connect(master); }
    else clickGain.connect(master);
    click.start(now + 0.04);
    click.stop(now + 0.18);

    /* ── High chirp accent (right channel) ── */
    const chirp     = ctx.createOscillator();
    const chirpGain = ctx.createGain();
    const chirpPan  = mkPanner(ctx, 0.5);

    chirp.type = "triangle";
    chirp.frequency.setValueAtTime(1400, now + 0.06);
    chirp.frequency.exponentialRampToValueAtTime(900, now + 0.14);

    chirpGain.gain.setValueAtTime(0, now + 0.06);
    chirpGain.gain.linearRampToValueAtTime(0.18, now + 0.075);
    chirpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    chirp.connect(chirpGain);
    if (chirpPan) { chirpGain.connect(chirpPan); chirpPan.connect(master); }
    else chirpGain.connect(master);
    chirp.start(now + 0.06);
    chirp.stop(now + 0.2);

  } catch { /* silent fail */ }
}

/**
 * Drag tick — subtle but stereo-positioned.
 */
export function playTickSound(audioCtx: AudioContext, pitch = 1.0): void {
  try {
    const now = audioCtx.currentTime;
    const osc    = audioCtx.createOscillator();
    const gain   = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    // Pan based on pitch: low pitch = left, high pitch = right
    const pan = (pitch - 1.0) * 0.7;
    const panner = mkPanner(audioCtx, Math.max(-1, Math.min(1, pan)));

    osc.type = "sine";
    osc.frequency.setValueAtTime(900 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(650 * pitch, now + 0.024);

    filter.type = "bandpass";
    filter.frequency.value = 1000 * pitch;
    filter.Q.value = 2.5;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.085, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

    osc.connect(filter);
    filter.connect(gain);
    if (panner) { gain.connect(panner); panner.connect(audioCtx.destination); }
    else gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  } catch { /* silent fail */ }
}

/**
 * Theme toggle — richer stereo sound.
 */
export function playThemeToggleSound(isDark: boolean): void {
  try {
    const ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const freq = isDark ? 440 : 880;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.7, now);
    master.connect(ctx.destination);

    /* Main tone */
    const osc   = ctx.createOscillator();
    const gain  = ctx.createGain();
    const filt  = ctx.createBiquadFilter();
    const panL  = mkPanner(ctx, -0.4);

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * (isDark ? 0.8 : 1.25), now + 0.12);
    filt.type = "bandpass";
    filt.frequency.value = freq * 1.5;
    filt.Q.value = 1.5;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(filt);
    filt.connect(gain);
    if (panL) { gain.connect(panL); panL.connect(master); }
    else gain.connect(master);
    osc.start(now);
    osc.stop(now + 0.16);

    /* Harmonic shimmer (right) */
    const osc2  = ctx.createOscillator();
    const gain2 = ctx.createGain();
    const panR  = mkPanner(ctx, 0.5);

    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(freq * 1.5, now + 0.02);
    osc2.frequency.exponentialRampToValueAtTime(freq * (isDark ? 1.1 : 2.0), now + 0.14);

    gain2.gain.setValueAtTime(0, now + 0.02);
    gain2.gain.linearRampToValueAtTime(0.22, now + 0.032);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc2.connect(gain2);
    if (panR) { gain2.connect(panR); panR.connect(master); }
    else gain2.connect(master);
    osc2.start(now + 0.02);
    osc2.stop(now + 0.17);

  } catch { /* silent fail */ }
}
