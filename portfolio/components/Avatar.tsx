"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export function Avatar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(isDark);
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    prog: WebGLProgram;
    texD: WebGLTexture | null;
    texL: WebGLTexture | null;
    raf: number;
    t: number;
    blink: number;
    blinkDir: number;
    state: { hover: boolean };
    tid: ReturnType<typeof setTimeout> | null;
    uTime: WebGLUniformLocation | null;
    uBlink: WebGLUniformLocation | null;
    uTex: WebGLUniformLocation | null;
  } | null>(null);

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  // Force immediate re-render when theme changes (override idle throttle)
  useEffect(() => {
    const G = glRef.current;
    if (!G) return;
    // Temporarily mark as active to bypass 2fps idle throttle
    const prevHover = G.state.hover;
    G.state.hover = true;
    const t = setTimeout(() => { G.state.hover = prevHover; }, 600);
    return () => clearTimeout(t);
  }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const DPR  = Math.min(window.devicePixelRatio || 1, 2);
    const SIZE = 512;
    canvas.width  = SIZE * DPR;
    canvas.height = SIZE * DPR;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const VERT = `
      attribute vec2 pos;
      varying   vec2 uv;
      void main(){
        uv = vec2(pos.x * 0.5 + 0.5, 0.5 - pos.y * 0.5);
        gl_Position = vec4(pos, 0.0, 1.0);
      }`;

    /*
      TWO-PASS hair detection:

      Pass 1 — geometric zone:
        Hair only lives in top 33% of the image (uv.y < 0.33).
        Below that is face or background — never warp it.

      Pass 2 — pixel color test (sampled at REST position):
        Hair pixel = dark warm brown:
          brightness < 0.42  (not bright skin)
          red channel > blue * 1.4  (warm tint, not cool shadow)
          red channel > 0.04  (not pure black background)
        Face pixel = bright warm: red > 0.50, red > green * 1.1
        Background = near-black: all channels < 0.04

      Only pixels that pass BOTH tests get warped.
      Face and background pixels always sample from original uv.
    */
    const FRAG = `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D tex;
      uniform float time;
      uniform float blink;

      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float n(vec2 p){
        vec2 i = floor(p), f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(h(i), h(i + vec2(1,0)), u.x),
          mix(h(i + vec2(0,1)), h(i + vec2(1,1)), u.x),
          u.y
        );
      }
      float fbm(vec2 p){
        float v = 0.0, a = 0.5;
        for(int i = 0; i < 4; i++){
          v += a * n(p);
          p = p * 2.1 + vec2(1.7, 9.2);
          a *= 0.5;
        }
        return v;
      }

      void main(){
        /* circular clip */
        vec2 c = uv * 2.0 - 1.0;
        float d = length(c);
        if(d > 1.0){ gl_FragColor = vec4(0.0); return; }

        /* ── Step 1: geometric zone gate ──
           Hair is ONLY in the top 33% of the image.
           Transition zone 0.28→0.34 softens the cutoff. */
        float zoneWeight = smoothstep(0.34, 0.25, uv.y);

        /* ── Step 2: compute warp offset ── */
        float t  = time * 0.7;
        float dx = (fbm(uv * vec2(4.0, 3.0) + vec2(t * 0.55, t * 0.30)) - 0.5) * 2.0 * 0.026;
        float dy = (fbm(uv * vec2(3.0, 4.0) + vec2(-t * 0.30, t * 0.45) + 4.3) - 0.5) * 2.0 * 0.011;

        /* ── Step 3: sample pixel at REST uv to classify it ──
           We need to know what this pixel IS before warping it. */
        vec4 restColor = texture2D(tex, uv);
        float r = restColor.r;
        float g = restColor.g;
        float b = restColor.b;
        float brightness = (r + g + b) / 3.0;

        /* Hair: dark warm brown
             brightness 0.04–0.42, red warm (r > b*1.4), not pure black */
        float isHair = 0.0;
        if(brightness > 0.04 && brightness < 0.42 && r > b * 1.35 && r > 0.04){
          isHair = 1.0;
        }

        /* Extra guard: if pixel is bright skin colour, force isHair=0
           (catches any stray bright pixels in the top zone) */
        if(brightness > 0.42){ isHair = 0.0; }

        /* Final mask = geometry AND color */
        float mask = zoneWeight * isHair;

        /* ── Step 4: apply warp only where mask > 0 ── */
        vec2 warpedUV  = clamp(uv + vec2(dx, dy), 0.001, 0.999);
        vec2 finalUV   = mix(uv, warpedUV, mask);

        vec4 col = texture2D(tex, finalUV);
        col.a *= smoothstep(1.0, 0.96, d);
        gl_FragColor = col;
      }`;

    const mkS = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error("Shader error:", gl.getShaderInfoLog(s));
      return s;
    };

    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkS(gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, mkS(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error("Link error:", gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const mkTex = (src: HTMLImageElement | HTMLCanvasElement): WebGLTexture => {
      const tx = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tx;
    };

    const makeFallback = (dark: boolean): WebGLTexture => {
      const sz = 256;
      const oc = document.createElement("canvas");
      oc.width = oc.height = sz;
      const ctx = oc.getContext("2d")!;
      ctx.fillStyle = dark ? "#1a1a2e" : "#e8e8f0";
      ctx.beginPath(); ctx.arc(sz/2, sz/2, sz/2, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = dark ? "#4ade80" : "#16a34a";
      ctx.font = `bold ${Math.floor(sz*0.38)}px -apple-system,sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("IT", sz/2, sz/2 + sz*0.03);
      return mkTex(oc);
    };

    const G = {
      gl, prog,
      texD: null as WebGLTexture | null,
      texL: null as WebGLTexture | null,
      uTex:   gl.getUniformLocation(prog, "tex"),
      uTime:  gl.getUniformLocation(prog, "time"),
      uBlink: gl.getUniformLocation(prog, "blink"),
      raf: 0, t: 0,
      blink: 0, blinkDir: 0,
      state: { hover: false },
      tid: null as ReturnType<typeof setTimeout> | null,
    };
    glRef.current = G;

    let loaded = 0;
    const boot = () => { if (++loaded < 2) return; startLoop(); };

    const imgD = new window.Image();
    imgD.crossOrigin = "anonymous";
    imgD.onload  = () => { G.texD = mkTex(imgD);        boot(); };
    imgD.onerror = () => { G.texD = makeFallback(true); boot(); };
    imgD.src = "/avatar-dark.jpg";

    const imgL = new window.Image();
    imgL.crossOrigin = "anonymous";
    imgL.onload  = () => { G.texL = mkTex(imgL);         boot(); };
    imgL.onerror = () => { G.texL = makeFallback(false); boot(); };
    imgL.src = "/avatar-light.jpg";

    let isVisible = true;
    let loopFn: ((ts: number) => void) | null = null;

    const resumeIfNeeded = () => {
      if (isVisible && !document.hidden && G.raf === 0 && loopFn) {
        G.raf = requestAnimationFrame(loopFn);
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting; resumeIfNeeded(); },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibilityChange = () => resumeIfNeeded();
    document.addEventListener("visibilitychange", onVisibilityChange);

    const startLoop = () => {
      let last = 0;
      const loop = (ts: number) => {
        // Don't keep scheduling frames while off-screen or the tab is
        // backgrounded — the shader work (per-pixel noise warp) is the
        // single most expensive thing running on the page, and it was
        // previously running forever even when nobody could see it,
        // stealing frame budget from every other section.
        if (!isVisible || document.hidden) { G.raf = 0; return; }
        // Throttle to ~2fps when idle (not hovered, not blinking) — saves massive CPU/GPU
        const isIdle = !G.state.hover && G.blinkDir === 0 && G.blink === 0;
        const minInterval = isIdle ? 500 : 0; // 2fps idle, 60fps active
        if (ts - last < minInterval) { G.raf = requestAnimationFrame(loop); return; }
        G.raf = requestAnimationFrame(loop);
        const dt = Math.min((ts - last) / 1000, 0.033);
        last = ts;
        G.t += dt;

        if (G.blinkDir === 1) {
          G.blink = Math.min(1, G.blink + dt * 14);
          if (G.blink >= 1) {
            G.blinkDir = 0;
            G.tid = setTimeout(() => { G.blinkDir = -1; }, 65);
          }
        } else if (G.blinkDir === -1) {
          G.blink = Math.max(0, G.blink - dt * 10);
          if (G.blink <= 0) {
            G.blink = 0; G.blinkDir = 0;
            if (G.state.hover) {
              G.tid = setTimeout(() => {
                if (G.state.hover && G.blinkDir === 0) G.blinkDir = 1;
              }, 700 + Math.random() * 900);
            }
          }
        }

        const tex = isDarkRef.current ? G.texD : G.texL;
        if (!tex) return;

        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1i(G.uTex,   0);
        gl.uniform1f(G.uTime,  G.t);
        gl.uniform1f(G.uBlink, G.blink);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      loopFn = loop;
      G.raf = requestAnimationFrame(loop);
    };

    const onEnter = () => {
      G.state.hover = true;
      if (G.blinkDir === 0 && G.blink < 0.01) G.blinkDir = 1;
    };
    const onLeave = () => {
      G.state.hover = false;
      if (G.tid) { clearTimeout(G.tid); G.tid = null; }
    };
    canvas.addEventListener("mouseenter", onEnter);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(G.raf);
      if (G.tid) clearTimeout(G.tid);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      canvas.removeEventListener("mouseenter", onEnter);
      canvas.removeEventListener("mouseleave", onLeave);
      if (G.texD) gl.deleteTexture(G.texD);
      if (G.texL) gl.deleteTexture(G.texL);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, []);

  return (
    <div style={{
      width: "100%", height: "100%",
      maxWidth: "100%", maxHeight: "100%",
      borderRadius: "50%", display: "block",
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%", height: "100%",
          maxWidth: "100%", maxHeight: "100%",
          borderRadius: "50%", display: "block",
        }}
      />
    </div>
  );
}