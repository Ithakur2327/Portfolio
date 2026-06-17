"use client";
import { createContext, useContext, useEffect, useState } from "react";

/**
 * ── Adaptive performance mode ──────────────────────────────────────────
 *
 * The site previously guessed "low-end device" purely from screen width +
 * device-pixel-ratio media queries. That's a bad proxy — plenty of phones
 * with small screens have fast GPUs, and plenty of large-screen laptops
 * are weak (cheap Windows machines, old MacBooks, etc). It also meant
 * nothing ever adapted for a weak device with a normal-sized screen.
 *
 * This instead looks at real device signals (CPU core count, RAM, data-
 * saver preference, reduced-motion preference) AND runs a short actual
 * frame-rate probe so we react to genuine GPU/CPU struggle rather than
 * screen size. Capable devices are completely unaffected — every visual
 * stays exactly as designed. Only devices that are actually struggling
 * get cheaper blur radii, simpler transitions, etc.
 */

type PerfMode = "full" | "low";

const PerfContext = createContext<PerfMode>("full");

function staticHeuristicLow(): boolean {
  if (typeof window === "undefined") return false;

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4) return true;

  return false;
}

/** Measures real frame pacing for ~350ms. Returns true if frames are running slow. */
function probeFrameRate(onDone: (isSlow: boolean) => void) {
  const samples: number[] = [];
  let last = performance.now();
  let raf = 0;
  let frames = 0;

  const tick = (ts: number) => {
    const dt = ts - last;
    last = ts;
    if (frames > 1) samples.push(dt); // skip the first frame (warm-up)
    frames++;
    if (frames < 16) {
      raf = requestAnimationFrame(tick);
    } else {
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
      onDone(avg > 22); // slower than ~45fps average
    }
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export function PerfModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PerfMode>("full");

  useEffect(() => {
    // Fast, synchronous-ish heuristic first — covers the common cases
    // (data saver on, reduced motion requested, low-memory device) without
    // waiting on anything.
    if (staticHeuristicLow()) {
      setMode("low");
      document.documentElement.setAttribute("data-perf", "low");
      return;
    }

    // Otherwise, actually measure. If the device is struggling to hit a
    // smooth frame rate even doing nothing yet, it'll struggle more once
    // blur/animation work is added — better to find out now.
    const cancel = probeFrameRate((isSlow) => {
      if (isSlow) {
        setMode("low");
        document.documentElement.setAttribute("data-perf", "low");
      }
    });
    return cancel;
  }, []);

  return <PerfContext.Provider value={mode}>{children}</PerfContext.Provider>;
}

/** True only for devices detected as genuinely struggling. */
export function useLowPerf(): boolean {
  return useContext(PerfContext) === "low";
}
