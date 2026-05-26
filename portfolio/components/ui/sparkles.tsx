"use client";
import React, { useId, useEffect, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { Engine, RecursivePartial, IOptions } from "@tsparticles/engine";
import { cn } from "@/lib/utils";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

// Initialize ONCE outside component — not inside a hook
let engineReady = false;
let enginePromise: Promise<void> | null = null;

function getEngine(): Promise<void> {
  if (engineReady) return Promise.resolve();
  if (enginePromise) return enginePromise;
  enginePromise = import("@tsparticles/engine")
    .then(({ tsParticles }) => loadSlim(tsParticles as unknown as Engine))
    .then(() => { engineReady = true; });
  return enginePromise;
}

export function SparklesCore(props: ParticlesProps) {
  const {
    id,
    className,
    background = "transparent",
    minSize = 1,
    maxSize = 3,
    speed = 4,
    particleColor = "#ffffff",
    particleDensity = 120,
  } = props;

  const [init, setInit] = useState(false);
  const generatedId = useId();

  useEffect(() => {
    getEngine().then(() => setInit(true));
  }, []);

  return init ? (
    <Particles
      id={id || generatedId}
      className={cn("h-full w-full", className)}
      options={{
        background: { color: { value: background } },
        fullScreen: { enable: false, zIndex: 1 },
        fpsLimit: 120,
        particles: {
          color: { value: particleColor },
          move: {
            direction: "none",
            enable: true,
            outModes: { default: "out" },
            random: true,
            speed: { min: 0.1, max: 1 },
            straight: false,
          },
          number: {
            density: { enable: true, width: 400, height: 400 },
            value: particleDensity,
          },
          opacity: {
            value: { min: 0.1, max: 1 },
            animation: {
              enable: true,
              speed: speed,
              sync: false,
              startValue: "random" as any,
            },
          },
          shape: { type: "circle" },
          size: { value: { min: minSize, max: maxSize } },
        },
        detectRetina: true,
      } as RecursivePartial<IOptions>}
    />
  ) : null;
}