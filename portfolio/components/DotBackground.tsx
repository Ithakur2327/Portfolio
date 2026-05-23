"use client";
import { useEffect, useRef } from "react";

export function DotBackground() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!spotlightRef.current) return;
      spotlightRef.current.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(139,92,246,0.10) 0%, transparent 70%)`;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      <div className="dot-bg" aria-hidden="true" />
      <div ref={spotlightRef} className="dot-spotlight" aria-hidden="true" />
    </>
  );
}