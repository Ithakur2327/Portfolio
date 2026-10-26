"use client";

import React, { useEffect, useRef } from "react";
import { whenIdle } from "@/lib/idle";

export type CloudShaderProps = {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  /** Animation speed multiplier. 1 = default drift. */
  speed?: number;
  /** Cloud tint color (hex or rgb string). */
  cloudColor?: string;
  /** Sky color at the top (hex or rgb string). */
  skyTopColor?: string;
  /** Sky color at the bottom (hex or rgb string). */
  skyBottomColor?: string;
  /** Cloud size relative to the strip height. */
  cloudScale?: number;
  /**
   * Draw only while this returns true. Evaluated on every frame and whenever
   * `html`'s class changes, so a theme switch can start / stop the sky
   * instantly. Defaults to "always".
   */
  isActive?: () => boolean;
};

const VERT = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Cloud shader (Aceternity UI). Each cloud is an asymmetric envelope (dome
// top, flat base) filled with domain-warped billow noise. A second density
// sample above the pixel approximates self-shadowing. Clouds drift
// horizontally and wrap around. (Extended with extra passes + a size scale so
// a wide, short strip can hold more, smaller clouds.)
const FRAG = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_res;
uniform float u_time;
uniform float u_count;
uniform float u_scale;
uniform vec3 u_cloud;
uniform vec3 u_skyTop;
uniform vec3 u_skyBottom;

const mat2 R = mat2(0.80, 0.60, -0.60, 0.80);

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(41.31, 289.17))) * 26737.367);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 4; i++) {
    sum += amp * vnoise(p);
    p = R * p * 2.03 + 19.19;
    amp *= 0.5;
  }
  return sum;
}

// billow noise: sharp puffy ridges, like cauliflower cloud tops
float billow(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    sum += amp * (1.0 - abs(2.0 * vnoise(p) - 1.0));
    p = R * p * 2.11 + 13.37;
    amp *= 0.5;
  }
  return sum;
}

// raw density for one cloud at point p
float cloudDensity(vec2 p, vec2 c, vec2 r, float seed, float t) {
  vec2 q = p - c;

  // envelope: dome above the center, flat base below
  float ry = q.y > 0.0 ? r.y : r.y * 0.42;
  float env = 1.0 - length(vec2(q.x / r.x, q.y / ry));
  if (env < -0.35) return 0.0;

  // domain-warped billow detail, moves with the cloud, evolves slowly
  vec2 dp = q * (2.4 / r.x) + seed;
  dp += 0.6 * vec2(
    fbm(dp * 1.4 + t * 0.04),
    fbm(dp * 1.4 + 7.7 - t * 0.03)
  );
  float detail = billow(dp * 1.6);

  return env + (detail - 0.62) * 0.62;
}

// shades one cloud and blends it over the current color
vec3 shadeCloud(vec3 color, vec3 sky, vec2 p, vec2 c, vec2 r, float seed, float t, float dist) {
  float d = cloudDensity(p, c, r, seed, t);
  if (d < 0.02) return color;

  // sample density toward the sun (straight up) for self-shadowing
  float dUp = cloudDensity(p + vec2(0.0, r.y * 0.55), c, r, seed, t);
  float occl = clamp((dUp - d) * 1.1 + d * 0.55, 0.0, 1.0);

  vec3 lit = u_cloud * 1.04;
  vec3 shadow = mix(u_cloud * 0.60, sky, 0.38);
  vec3 cloudCol = mix(lit, shadow, occl * 0.85);

  float alpha = smoothstep(0.02, 0.38, d);

  // silver lining on thin edges
  float rim = smoothstep(0.02, 0.14, d) * (1.0 - smoothstep(0.14, 0.40, d));
  cloudCol += rim * 0.10;

  // atmospheric perspective: far clouds fade into the sky
  cloudCol = mix(cloudCol, sky, dist * 0.35);
  alpha *= mix(1.0, 0.8, dist);

  return mix(color, cloudCol, alpha);
}

// one drifting cloud: horizontal wrap + gentle vertical bob
vec3 cloudPass(vec3 color, vec3 sky, vec2 p, float aspect, float t,
               float spd, float phase, float y, vec2 r, float seed, float dist) {
  r *= u_scale;
  float cx = mix(-r.x - 0.25, aspect + r.x + 0.25, fract(t * spd + phase));
  float cy = y + sin(t * 0.05 + phase * 6.2831) * 0.012;
  return shadeCloud(color, sky, p, vec2(cx, cy), r, seed, t, dist);
}

void main() {
  float aspect = u_res.x / u_res.y;
  vec2 p = vec2(v_uv.x * aspect, v_uv.y);
  float t = u_time;

  vec3 sky = mix(u_skyBottom, u_skyTop, v_uv.y);
  vec3 color = sky;

  // faint haze band near the horizon
  color = mix(color, u_skyBottom * 1.06, smoothstep(0.35, 0.0, v_uv.y) * 0.5);

  // soft sun glow, upper area
  vec2 sunPos = vec2(aspect * 0.78, 0.92);
  float sunDist = length(p - sunPos);
  color += vec3(1.0, 0.95, 0.82) * exp(-sunDist * sunDist * 5.0) * 0.28;

  // thin cirrus streaks, stretched horizontally, high in the sky
  float cirrusBand = smoothstep(0.55, 0.8, v_uv.y) * (1.0 - smoothstep(0.9, 1.0, v_uv.y));
  if (cirrusBand > 0.01) {
    float streak = fbm(vec2(p.x * 1.6 - t * 0.006, p.y * 12.0));
    float wisp = smoothstep(0.52, 0.78, streak) * cirrusBand;
    color = mix(color, u_cloud * 0.98, wisp * 0.35);
  }

  // extra far / mid / near clouds — only used on wide strips (u_count > 6)
  if (u_count > 11.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.007, 0.27, 0.78, vec2(0.18, 0.09), 12.9, 0.95);
  }
  if (u_count > 10.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.009, 0.91, 0.66, vec2(0.22, 0.11), 38.1, 0.80);
  }

  // far layer: small, high, slow
  if (u_count > 5.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.006, 0.10, 0.84, vec2(0.20, 0.10), 43.7, 1.0);
  }
  if (u_count > 4.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.008, 0.62, 0.73, vec2(0.24, 0.12), 71.3, 0.85);
  }

  if (u_count > 9.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.012, 0.18, 0.55, vec2(0.30, 0.14), 64.4, 0.50);
  }
  if (u_count > 8.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.014, 0.55, 0.42, vec2(0.34, 0.15), 77.7, 0.40);
  }

  // middle layer
  if (u_count > 3.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.011, 0.33, 0.60, vec2(0.34, 0.16), 17.3, 0.55);
  }
  if (u_count > 2.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.013, 0.80, 0.47, vec2(0.30, 0.15), 29.9, 0.45);
  }

  if (u_count > 7.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.017, 0.72, 0.30, vec2(0.40, 0.18), 5.5, 0.20);
  }
  if (u_count > 6.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.019, 0.90, 0.26, vec2(0.46, 0.20), 23.3, 0.10);
  }

  // near layer: big, low, fast
  if (u_count > 1.5) {
    color = cloudPass(color, sky, p, aspect, t, 0.016, 0.05, 0.35, vec2(0.46, 0.20), 91.1, 0.15);
  }
  color = cloudPass(color, sky, p, aspect, t, 0.020, 0.48, 0.20, vec2(0.56, 0.24), 57.2, 0.0);

  gl_FragColor = vec4(color, 1.0);
}
`;

function parseColor(color: string): [number, number, number] {
  const value = color.trim();
  if (value.startsWith("#")) {
    const hex = value.slice(1);
    if (hex.length === 3) {
      return [
        parseInt(hex[0] + hex[0], 16) / 255,
        parseInt(hex[1] + hex[1], 16) / 255,
        parseInt(hex[2] + hex[2], 16) / 255,
      ];
    }
    return [
      parseInt(hex.slice(0, 2), 16) / 255,
      parseInt(hex.slice(2, 4), 16) / 255,
      parseInt(hex.slice(4, 6), 16) / 255,
    ];
  }
  const rgb = value.match(/[\d.]+/g);
  if (rgb && rgb.length >= 3) {
    return [Number(rgb[0]) / 255, Number(rgb[1]) / 255, Number(rgb[2]) / 255];
  }
  return [0.95, 0.95, 0.95];
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export const CloudShader = ({
  className,
  style,
  children,
  speed = 1,
  cloudColor = "#fbf8f2",
  skyTopColor = "#3876ba",
  skyBottomColor = "#8cbfe8",
  cloudScale = 1.45,
  isActive,
}: CloudShaderProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const paramsRef = useRef({ speed, cloudColor, skyTopColor, skyBottomColor, cloudScale, isActive });

  useEffect(() => {
    paramsRef.current = { speed, cloudColor, skyTopColor, skyBottomColor, cloudScale, isActive };
  }, [speed, cloudColor, skyTopColor, skyBottomColor, cloudScale, isActive]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let vert: WebGLShader | null = null;
    let frag: WebGLShader | null = null;
    let loc: Record<"res" | "time" | "count" | "scale" | "cloud" | "skyTop" | "skyBottom", WebGLUniformLocation | null> | null = null;

    let raf = 0;
    let ready = false;
    let lost = false;
    let inView = true;
    let still = false; // software GL / reduced motion → one crisp still frame instead of animating
    let lastNow = 0;
    let elapsed = 0; // only advances while we are actually drawing, so there is no jump on resume
    let cancelIdle: (() => void) | null = null;
    let ro: ResizeObserver | null = null;
    let mo: MutationObserver | null = null;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const introActive = () => document.documentElement.classList.contains("intro-active");
    const wanted = () => {
      const ok = paramsRef.current.isActive ? paramsRef.current.isActive() : true;
      return ok && inView && !document.hidden && !introActive() && !lost;
    };

    // Backing store = CSS size × devicePixelRatio (which already includes browser zoom), so the
    // sky is pixel-sharp on retina / high-DPI screens. Clouds count follows the strip's aspect ratio.
    let cloudCount = 6;
    const resize = () => {
      if (!gl || !loc) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      let w = Math.round(canvas.clientWidth * dpr);
      let h = Math.round(canvas.clientHeight * dpr);
      w = Math.max(1, w);
      h = Math.max(1, h);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      gl.viewport(0, 0, w, h);
      gl.uniform2f(loc.res, w, h);
      cloudCount = Math.max(5, Math.min(12, Math.round(w / h / 3.3)));
    };

    const draw = () => {
      if (!gl || !loc) return;
      const p = paramsRef.current;
      const cloud = parseColor(p.cloudColor);
      const skyTop = parseColor(p.skyTopColor);
      const skyBottom = parseColor(p.skyBottomColor);
      gl.uniform1f(loc.time, elapsed);
      gl.uniform1f(loc.count, cloudCount);
      gl.uniform1f(loc.scale, p.cloudScale);
      gl.uniform3f(loc.cloud, cloud[0], cloud[1], cloud[2]);
      gl.uniform3f(loc.skyTop, skyTop[0], skyTop[1], skyTop[2]);
      gl.uniform3f(loc.skyBottom, skyBottom[0], skyBottom[1], skyBottom[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const loop = (now: number) => {
      raf = 0;
      if (!wanted()) {
        lastNow = 0;
        return;
      }
      if (lastNow) elapsed += ((now - lastNow) / 1000) * paramsRef.current.speed;
      lastNow = now;
      draw();
      if (!still) raf = requestAnimationFrame(loop); // every display frame — 60 / 120 / 144 Hz alike
    };

    const sync = () => {
      if (!ready) {
        // theme switched to light before the deferred start → build the sky right now
        if (!started && wanted()) {
          cancelIdle?.();
          clearTimeout(initTimer);
          init();
        }
        return;
      }
      if (wanted()) {
        if (!raf) {
          lastNow = 0;
          draw(); // paint right now so a theme switch never shows a stale / blank frame
          if (!still) raf = requestAnimationFrame(loop);
        }
      } else if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
        lastNow = 0;
      }
    };

    let started = false;
    let initTimer: ReturnType<typeof setTimeout> | undefined;
    const init = () => {
      if (started || ready || lost) return;
      started = true;
      gl = canvas.getContext("webgl", { alpha: false, antialias: false, premultipliedAlpha: false, powerPreference: "default" });
      if (!gl) return;
      const hp = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
      const fragSrc = hp && hp.precision > 0 ? FRAG : FRAG.replace("precision highp float;", "precision mediump float;");
      // Compile on the GPU process's own threads (KHR_parallel_shader_compile) and only touch the
      // program once it is ready — otherwise reading COMPILE/LINK_STATUS blocks the main thread
      // (at first load, often for 100+ ms on a cold shader cache).
      const par = gl.getExtension("KHR_parallel_shader_compile");
      const v = gl.createShader(gl.VERTEX_SHADER);
      const f = gl.createShader(gl.FRAGMENT_SHADER);
      if (!v || !f) return;
      gl.shaderSource(v, VERT);
      gl.shaderSource(f, fragSrc);
      gl.compileShader(v);
      gl.compileShader(f);
      vert = v;
      frag = f;
      program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vert);
      gl.attachShader(program, frag);
      gl.bindAttribLocation(program, 0, "a_pos");
      gl.linkProgram(program);
      const prog = program;
      const finish = () => {
        if (!gl || lost) return;
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
        gl.useProgram(prog);
        setup();
      };
      if (par) {
        const poll = () => {
          if (!gl || lost) return;
          if (gl.getProgramParameter(prog, par.COMPLETION_STATUS_KHR)) finish();
          else requestAnimationFrame(poll);
        };
        requestAnimationFrame(poll);
      } else {
        finish();
      }
    };

    const setup = () => {
      if (!gl || !program) return;
      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

      loc = {
        res: gl.getUniformLocation(program, "u_res"),
        time: gl.getUniformLocation(program, "u_time"),
        count: gl.getUniformLocation(program, "u_count"),
        scale: gl.getUniformLocation(program, "u_scale"),
        cloud: gl.getUniformLocation(program, "u_cloud"),
        skyTop: gl.getUniformLocation(program, "u_skyTop"),
        skyBottom: gl.getUniformLocation(program, "u_skyBottom"),
      };

      // A CPU-rendered WebGL context can't animate a shader smoothly — show one still frame.
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      const gpu = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
      still = reduceMotion || /swiftshader|llvmpipe|software|basic render/i.test(gpu);
      elapsed = 20; // start with the clouds already spread across the strip

      ro = new ResizeObserver(() => {
        resize();
        if (ready && !raf) draw(); // keep a crisp frame on screen while resizing / paused
      });
      ro.observe(canvas);
      resize();
      ready = true;
      draw();
      sync();
    };

    // Compile + first frame never happen in the first-paint path. Light theme: as soon as the
    // browser is idle. Dark theme (the sky is hidden): wait until the page has been quiet for a
    // few seconds, so the sky is usually already warm if someone switches to light.
    const lightNow = paramsRef.current.isActive ? paramsRef.current.isActive() : true;
    if (lightNow) {
      cancelIdle = whenIdle(init, 1200);
    } else {
      initTimer = setTimeout(() => {
        cancelIdle = whenIdle(init, 4000);
      }, 4500);
    }

    const io = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting;
      sync();
    });
    io.observe(canvas);

    // Theme / intro changes arrive as class changes on <html>; react in the same task.
    mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("intro:complete", sync);
    document.addEventListener("visibilitychange", sync);

    const onLost = (e: Event) => {
      e.preventDefault();
      lost = true;
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelIdle?.();
      clearTimeout(initTimer);
      io.disconnect();
      ro?.disconnect();
      mo?.disconnect();
      window.removeEventListener("intro:complete", sync);
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("webglcontextlost", onLost);
      if (raf) cancelAnimationFrame(raf);
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
        if (vert) gl.deleteShader(vert);
        if (frag) gl.deleteShader(frag);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      }
    };
  }, []);

  return (
    <div
      className={className}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden", ...style }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", pointerEvents: "none" }}
      />
      {children ? (
        <div style={{ position: "relative", zIndex: 10, display: "flex", width: "100%", height: "100%", alignItems: "center", justifyContent: "center" }}>
          {children}
        </div>
      ) : null}
    </div>
  );
};

export default CloudShader;