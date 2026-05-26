"use client";
import { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";

const COUNT = 100;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

interface Dot {
  id: number;
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  opacity: number;
}

function makeDots(): Dot[] {
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    left:     `${randomBetween(0, 100)}%`,
    top:      `${randomBetween(5, 95)}%`,
    size:      randomBetween(1, 2.8),
    delay:    `${randomBetween(0, 4).toFixed(2)}s`,
    duration: `${randomBetween(1.4, 3.2).toFixed(2)}s`,
    opacity:   randomBetween(0.5, 1),
  }));
}

export function SparklesBridge() {
  const { theme } = useTheme();
  const [dots, setDots] = useState<Dot[]>([]);

  // Generate dots only on client to avoid SSR mismatch
  useEffect(() => {
    setDots(makeDots());
  }, []);

  const isDark = theme === "dark";
  const color  = isDark ? "255,255,255" : "0,0,0";

  return (
    <>
      <style>{`
        @keyframes spkl {
          0%,100% { opacity:0; transform:scale(0.4); }
          50%      { opacity:var(--spkl-op); transform:scale(1); }
        }
      `}</style>

      <div style={{
        position: "relative",
        width: "100%",
        height: 28,
        overflow: "hidden",
        borderBottom: "1px solid var(--nav-border)",
      }}>
        {dots.map((d) => (
          <span
            key={d.id}
            style={{
              position:    "absolute",
              left:         d.left,
              top:          d.top,
              width:        d.size,
              height:       d.size,
              borderRadius: "50%",
              background:  `rgba(${color},${d.opacity})`,
              boxShadow:   `0 0 ${d.size * 3}px ${d.size}px rgba(${color},0.25)`,
              // @ts-ignore
              "--spkl-op":  d.opacity,
              animation:   `spkl ${d.duration} ${d.delay} ease-in-out infinite`,
              pointerEvents: "none",
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}