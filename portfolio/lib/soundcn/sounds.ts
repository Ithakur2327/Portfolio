/**
 * Web Audio sound engine — zero files, pure synthesis.
 */

/**
 * Soft unlock — gentle whoosh + single soft click.
 * No musical notes/tune. Just a clean "done" feel.
 */
export function playIOSUnlockSound(audioCtx?: AudioContext): void {
  try {
    const ctx = audioCtx ?? new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;

    const master = ctx.createGain();
    master.gain.setValueAtTime(0.5, now);
    master.connect(ctx.destination);

    /* ── Whoosh — filtered noise sweep ── */
    const bufSize = ctx.sampleRate * 0.18;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;

    const noise     = ctx.createBufferSource();
    const bandpass  = ctx.createBiquadFilter();
    const noiseGain = ctx.createGain();

    noise.buffer = buf;
    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(800, now);
    bandpass.frequency.exponentialRampToValueAtTime(2400, now + 0.14);
    bandpass.Q.value = 1.2;

    /* Envelope: fast fade in → smooth fade out */
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.28, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    noise.connect(bandpass);
    bandpass.connect(noiseGain);
    noiseGain.connect(master);
    noise.start(now);
    noise.stop(now + 0.2);

    /* ── Soft click — very short sine thud ── */
    const click     = ctx.createOscillator();
    const clickFilt = ctx.createBiquadFilter();
    const clickGain = ctx.createGain();

    click.type = "sine";
    click.frequency.setValueAtTime(180, now + 0.04);
    click.frequency.exponentialRampToValueAtTime(60, now + 0.1);

    clickFilt.type = "lowpass";
    clickFilt.frequency.value = 300;

    clickGain.gain.setValueAtTime(0, now + 0.04);
    clickGain.gain.linearRampToValueAtTime(0.4, now + 0.048);
    clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);

    click.connect(clickFilt);
    clickFilt.connect(clickGain);
    clickGain.connect(master);
    click.start(now + 0.04);
    click.stop(now + 0.15);

  } catch { /* silent fail */ }
}

/**
 * Drag tick — very subtle, quiet.
 */
export function playTickSound(audioCtx: AudioContext, pitch = 1.0): void {
  try {
    const now = audioCtx.currentTime;
    const osc    = audioCtx.createOscillator();
    const gain   = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800 * pitch, now);
    osc.frequency.exponentialRampToValueAtTime(600 * pitch, now + 0.022);

    filter.type = "bandpass";
    filter.frequency.value = 900 * pitch;
    filter.Q.value = 3;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.055, now + 0.003);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.028);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.032);
  } catch { /* silent fail */ }
}

/**
 * Theme toggle click.
 */
export function playThemeToggleSound(isDark: boolean): void {
  try {
    const ctx = new AudioContext();
    if (ctx.state === "suspended") ctx.resume();
    const now = ctx.currentTime;
    const freq = isDark ? 480 : 820;
    const osc   = ctx.createOscillator();
    const gain  = ctx.createGain();
    const filt  = ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.9, now + 0.09);
    filt.type = "bandpass";
    filt.frequency.value = freq * 1.4;
    filt.Q.value = 2;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.16, now + 0.007);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

    osc.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.13);
  } catch { /* silent fail */ }
}
