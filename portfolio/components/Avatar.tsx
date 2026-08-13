"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

export function Avatar({ version }: { version?: string } = {}) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(
    typeof document !== "undefined"
      ? document.documentElement.classList.contains("dark")
      : isDark,
  );
  const glRef = useRef<{
    gl: WebGLRenderingContext;
    prog: WebGLProgram;
    texD: WebGLTexture | null;
    texL: WebGLTexture | null;
    uTex: WebGLUniformLocation | null;
    activeIsDark: boolean;
    activeTex: WebGLTexture | null;
  } | null>(null);
  const renderRef = useRef<(() => void) | null>(null);

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  // Theme changes are handled by the site-wide View Transition (see
  // ThemeProvider) — it already smooths the whole page, including this
  // canvas, via its own snapshot-based wipe. Running a SEPARATE internal
  // crossfade here (as this used to) meant the view-transition's "after"
  // snapshot froze the avatar mid-fade (since it's captured synchronously,
  // before the fade had progressed), then the live canvas finished its own
  // fade invisibly behind that frozen snapshot — producing a visible snap
  // right as the outer wipe finished. Switching the active texture
  // instantly keeps this in sync with how every other color on the page
  // updates (no transition of their own, smoothed entirely by the outer
  // wipe), so there's exactly one transition system instead of two
  // fighting each other.
  useEffect(() => {
    const G = glRef.current;
    if (!G) return;
    const nextTex = isDark ? G.texD : G.texL;
    if (!nextTex) return; // textures not loaded yet — boot() sets initial state directly
    G.activeTex = nextTex;
    G.activeIsDark = isDark;
    renderRef.current?.();
  }, [isDark]);

  // Waits for the intro overlay to finish before doing ANY of the heavy
  // work below (shader compile, texture upload, starting the render
  // loop). This mounts at the same time as the intro overlay, and all of
  // that setup running on the main thread right as the intro's ring is
  // trying to spin is what was causing the ring to visibly stutter mid-
  // animation — moving it here removes the contention entirely instead
  // of trying to out-optimize it.
  const [introDone, setIntroDone] = useState(
    typeof document === "undefined" ||
      !document.documentElement.classList.contains("intro-active"),
  );
  useEffect(() => {
    if (introDone) return;
    const onDone = () => setIntroDone(true);
    window.addEventListener("intro:flightStart", onDone, { once: true });
    return () => window.removeEventListener("intro:flightStart", onDone);
  }, [introDone]);

  // Kick off the avatar image downloads immediately on mount instead of
  // waiting for the intro overlay to finish — the WebGL/shader setup below
  // still waits for introDone (to avoid contending with the intro's ring
  // animation), but there's no reason the *network fetch* needs to wait
  // too. Prefetching here means the images are already decoded/cached by
  // the time the real effect runs, so the avatar doesn't visibly pop in
  // late.
  useEffect(() => {
    const d = new window.Image();
    d.src = version ? `/avatar-dark.jpg?v=${version}` : "/avatar-dark.jpg";
    const l = new window.Image();
    l.src = version ? `/avatar-light.jpg?v=${version}` : "/avatar-light.jpg";
  }, [version]);

  useEffect(() => {
    if (!introDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Size the backing store generously above the actual displayed size —
    // this shader is a per-pixel noise/fbm warp, and under-sampling it
    // (rendering close to 1:1 with the display size) makes the noise look
    // visibly grainy/low-quality instead of the smooth, "8k-ish" look it's
    // meant to have. We still avoid the old flat 768*DPR3 (~2300px) render
    // for every avatar regardless of how small it's shown, but keep a
    // generous supersampling floor so quality never visibly drops.
    const DPR = Math.min(window.devicePixelRatio || 1, 3);
    const rect0 = canvas.getBoundingClientRect();
    const displayed = Math.round(Math.max(rect0.width, rect0.height)) || 300;
    let SIZE = Math.min(1280, Math.max(560, displayed) * DPR);
    canvas.width  = SIZE;
    canvas.height = SIZE;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: true,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
    if (!gl) {
      // No WebGL on this device/browser (disabled GPU acceleration, some
      // older or locked-down mobile browsers, certain in-app webviews,
      // etc.) — without a fallback this canvas just stays blank forever,
      // which is exactly the "avatar works on some devices, not others"
      // report. Draw the plain photo with plain 2D canvas instead: no
      // shader warp effect, but never an empty avatar.
      const ctx2d = canvas.getContext("2d");
      if (!ctx2d) return;
      const draw = (src: string) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const size = canvas.width || 512;
          ctx2d.clearRect(0, 0, size, size);
          ctx2d.drawImage(img, 0, 0, size, size);
        };
        img.src = version ? `${src}?v=${version}` : src;
      };
      canvas.width = canvas.height = 512;
      draw(isDarkRef.current ? "/avatar-dark.jpg" : "/avatar-light.jpg");
      const onThemeChange = () => draw(isDarkRef.current ? "/avatar-dark.jpg" : "/avatar-light.jpg");
      // Re-draw on theme toggle so the fallback still tracks dark/light,
      // same as the WebGL path does via texD/texL.
      const mo = new MutationObserver(onThemeChange);
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => mo.disconnect();
    }

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

    const FRAG = `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D tex;

      void main(){
        gl_FragColor = texture2D(tex, uv);
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

    // Anisotropic filtering keeps the minified texture sharp instead of
    // blurring — most desktop/mobile GPUs expose this extension.
    const anisoExt =
      gl.getExtension("EXT_texture_filter_anisotropic") ||
      gl.getExtension("MOZ_EXT_texture_filter_anisotropic") ||
      gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic");
    const maxAniso = anisoExt ? gl.getParameter(anisoExt.MAX_TEXTURE_MAX_ANISOTROPY_EXT) : 1;

    const mkTex = (src: HTMLImageElement | HTMLCanvasElement): WebGLTexture => {
      const tx = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, src);

      // The source photos (1024-1256px) are often larger than the canvas
      // render target (560-1280px, floored/capped above), so this is
      // genuine texture minification — trilinear mipmapping avoids the
      // shimmer/aliasing that plain linear filtering would show on fine
      // detail (hair, skin texture) at that scale. generateMipmap can
      // still fail for a specific image/GPU combo (e.g. certain JPEG
      // chroma-subsampling or color-profile variants), so this must be
      // defensive per-texture — one bad image must never leave that
      // texture (and therefore that theme's avatar) blank.
      let mipmapped = false;
      try {
        gl.generateMipmap(gl.TEXTURE_2D);
        mipmapped = gl.getError() === gl.NO_ERROR;
      } catch {
        mipmapped = false;
      }

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, mipmapped ? gl.LINEAR_MIPMAP_LINEAR : gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      if (mipmapped && anisoExt) gl.texParameterf(gl.TEXTURE_2D, anisoExt.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(4, maxAniso));
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
      uTex: gl.getUniformLocation(prog, "tex"),
      activeIsDark: isDarkRef.current,
      activeTex: null as WebGLTexture | null,
    };
    glRef.current = G;

    const render = () => {
      const tex = G.activeTex;
      if (!tex) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(G.uTex, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    renderRef.current = render;

    let loaded = 0;
    const boot = () => {
      if (++loaded < 2) return;
      // Both textures are ready — settle directly on the correct theme's
      // texture and paint once.
      G.activeIsDark = isDarkRef.current;
      G.activeTex = G.activeIsDark ? G.texD : G.texL;
      render();
    };

    const imgD = new window.Image();
    imgD.crossOrigin = "anonymous";
    imgD.fetchPriority = "high";
    imgD.onload  = () => { try { G.texD = mkTex(imgD); } catch { G.texD = makeFallback(true); } boot(); };
    imgD.onerror = () => { G.texD = makeFallback(true); boot(); };
    imgD.src = version ? `/avatar-dark.jpg?v=${version}` : "/avatar-dark.jpg";

    const imgL = new window.Image();
    imgL.crossOrigin = "anonymous";
    imgL.fetchPriority = "high";
    imgL.onload  = () => { try { G.texL = mkTex(imgL); } catch { G.texL = makeFallback(false); } boot(); };
    imgL.onerror = () => { G.texL = makeFallback(false); boot(); };
    imgL.src = version ? `/avatar-light.jpg?v=${version}` : "/avatar-light.jpg";

    const ro = new ResizeObserver((entries) => {
      const r = entries[0]?.contentRect;
      if (!r) return;
      const displayedNow = Math.round(Math.max(r.width, r.height));
      const next = Math.min(1280, Math.max(560, displayedNow) * DPR);
      if (Math.abs(next - SIZE) < 2) return; // ignore sub-pixel noise
      SIZE = next;
      canvas.width  = SIZE;
      canvas.height = SIZE;
      render();
    });
    ro.observe(canvas);

    return () => {
      renderRef.current = null;
      ro.disconnect();
      if (G.texD) gl.deleteTexture(G.texD);
      if (G.texL) gl.deleteTexture(G.texL);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional one-time WebGL setup (gated on introDone); `version` is a stable build-time value and re-running this effect would tear down and rebuild the whole WebGL scene unnecessarily
  }, [introDone]);

  return (
    <div style={{
      width: "100%", height: "100%",
      maxWidth: "100%", maxHeight: "100%",
      borderRadius: "0", display: "block",
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%", height: "100%",
          maxWidth: "100%", maxHeight: "100%",
          borderRadius: "0", display: "block",
        }}
      />
    </div>
  );
}