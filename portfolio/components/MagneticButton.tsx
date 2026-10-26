"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Magnetic hover wrapper: the child is pulled toward the pointer (spring
 * physics), and a dashed, tinted "slot" appears where it normally sits.
 * Position lives in motion values, so following the pointer never re-renders
 * React — only entering / leaving the area flips a single boolean.
 */
export const MagneticButton = ({
  children,
  strength = 0.8,
  maxDistance = 100,
  color = "#0ABAB5",
}: {
  children: React.ReactNode;
  strength?: number;
  maxDistance?: number;
  /** Accent used for the dashed outline and tint. */
  color?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 150, damping: 25, mass: 0.1 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const { width, height, left, top } = ref.current.getBoundingClientRect();
    let dx = (e.clientX - (left + width / 2)) * strength;
    let dy = (e.clientY - (top + height / 2)) * strength;

    const distance = Math.hypot(dx, dy);
    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      dx *= scale;
      dy *= scale;
    }
    x.set(dx);
    y.set(dy);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setActive(false);
  };

  return (
    <div
      className="mag-btn"
      data-active={active}
      onMouseEnter={() => setActive(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ ["--show-color" as string]: color } as React.CSSProperties}
    >
      <motion.div ref={ref} style={{ x: sx, y: sy }}>
        {children}
      </motion.div>
    </div>
  );
};

export default MagneticButton;