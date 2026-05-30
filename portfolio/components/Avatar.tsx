"use client";
import { useEffect, useRef } from "react";
import { useTheme } from "./ThemeProvider";

export function Avatar() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
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
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDarkRef = useRef(isDark);

  useEffect(() => { isDarkRef.current = isDark; }, [isDark]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // FIX: Cap DPR at 2 (not 3) and canvas size at 512px
    // This was 2048*DPR = 4096×4096 on 2x screens — massive memory + GPU overhead
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const SIZE = 512;
    canvas.width  = SIZE * DPR;
    canvas.height = SIZE * DPR;

    const gl = canvas.getContext("webgl", {
      antialias: true, alpha: true, premultipliedAlpha: false,
      // FIX: powerPreference hint for smoother rendering on battery-limited devices
      powerPreference: "default",
    });
    if (!gl) return;

    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const VERT = `
      attribute vec2 pos;
      varying   vec2 uv;
      void main(){
        uv = vec2(pos.x*.5+.5, .5-pos.y*.5);
        gl_Position = vec4(pos,0.,1.);
      }`;

    // FIX: Reduced FBM octaves from 5→3, reduced hair warp intensity slightly
    // This directly reduces GPU shader load — was biggest cause of frame drops
    const FRAG = `
      precision highp float;
      varying vec2 uv;
      uniform sampler2D tex;
      uniform float time;
      uniform float blink;

      float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
      float n(vec2 p){
        vec2 i=floor(p), f=fract(p), u=f*f*(3.-2.*f);
        return mix(mix(h(i),h(i+vec2(1,0)),u.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),u.x),u.y);
      }
      float fbm(vec2 p){
        float v=0.,a=.5;
        for(int i=0;i<3;i++){v+=a*n(p);p=p*2.1+vec2(1.7,9.2);a*=.5;}
        return v;
      }

      void main(){
        vec2 c = uv*2.-1.;
        float d = length(c);
        if(d>1.){ gl_FragColor=vec4(0.); return; }

        float mask = smoothstep(.58,.02,uv.y);
        float t = time*.7;
        float dx = (fbm(uv*vec2(4.0,3.0)+vec2(t*.55,t*.30))-.5)*2.*.026*mask;
        float dy = (fbm(uv*vec2(3.0,4.0)+vec2(-t*.30,t*.45)+4.3)-.5)*2.*.011*mask;
        vec2 w = clamp(uv+vec2(dx,dy),.001,.999);
        vec4 col = texture2D(tex, w);

        col.a *= smoothstep(1.,.96,d);
        gl_FragColor = col;
      }`;

    const mkS = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error("Shader:", gl.getShaderInfoLog(s));
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, mkS(gl.VERTEX_SHADER,   VERT));
    gl.attachShader(prog, mkS(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER,
      new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const mkTex = (img: HTMLImageElement) => {
      const tx = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tx);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const ext =
        gl.getExtension("EXT_texture_filter_anisotropic") ||
        gl.getExtension("WEBKIT_EXT_texture_filter_anisotropic") ||
        gl.getExtension("MOZ_EXT_texture_filter_anisotropic");
      if (ext) {
        gl.texParameterf(
          gl.TEXTURE_2D,
          ext.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(8, gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT))
        );
      }
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tx;
    };

    const uTex   = gl.getUniformLocation(prog, "tex");
    const uTime  = gl.getUniformLocation(prog, "time");
    const uBlink = gl.getUniformLocation(prog, "blink");

    const shared = { hover: false };

    const G = {
      gl, prog,
      texD: null as WebGLTexture | null,
      texL: null as WebGLTexture | null,
      raf: 0, t: 0,
      blink: 0, blinkDir: 0,
      state: shared,
      tid: null as ReturnType<typeof setTimeout> | null,
    };
    glRef.current = G;

    let loaded = 0;
    const boot = () => { if (++loaded < 2) return; startLoop(); };

    const imgD = new window.Image();
    imgD.onload  = () => { G.texD = mkTex(imgD); boot(); };
    imgD.onerror = () => { boot(); };
    imgD.src = "/avatar-dark.jpg";

    const imgL = new window.Image();
    imgL.onload  = () => { G.texL = mkTex(imgL); boot(); };
    imgL.onerror = () => { boot(); };
    imgL.src = "/avatar-light.jpg";

    const startLoop = () => {
      let last = 0;
      // FIX: Frame-rate throttle — render at max 60fps (not 120fps unlocked)
      // On 120Hz screens the original ran every 8ms, now capped at 16ms
      const TARGET_MS = 1000 / 60;
      const loop = (ts: number) => {
        G.raf = requestAnimationFrame(loop);
        const elapsed = ts - last;
        if (elapsed < TARGET_MS - 1) return; // skip frame
        const dt = Math.min(elapsed / 1000, 0.033);
        last = ts;
        G.t += dt;

        /* blink FSM */
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
        gl.uniform1i(uTex,   0);
        gl.uniform1f(uTime,  G.t);
        gl.uniform1f(uBlink, G.blink);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };
      G.raf = requestAnimationFrame(loop);
    };

    const onEnter = () => {
      shared.hover = true;
      if (G.blinkDir === 0 && G.blink < 0.01) G.blinkDir = 1;
    };
    const onLeave = () => {
      shared.hover = false;
      if (G.tid) { clearTimeout(G.tid); G.tid = null; }
    };
    canvas.addEventListener("mouseenter", onEnter);
    canvas.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(G.raf);
      if (G.tid) clearTimeout(G.tid);
      canvas.removeEventListener("mouseenter", onEnter);
      canvas.removeEventListener("mouseleave", onLeave);
      // FIX: Properly release WebGL resources to prevent memory leak on re-mount
      if (G.texD) gl.deleteTexture(G.texD);
      if (G.texL) gl.deleteTexture(G.texL);
    };
  }, []);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      maxWidth: "100%",
      maxHeight: "100%",
      borderRadius: "50%",
      display: "block",
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "100%",
          maxHeight: "100%",
          borderRadius: "50%",
          display: "block",
          // FIX: crisp-edges removed — "auto" gives smoother scaling at display size
          imageRendering: "auto",
          // FIX: Own compositor layer — prevents canvas repaints from triggering page repaints
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
