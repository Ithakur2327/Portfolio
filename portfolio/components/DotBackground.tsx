"use client";
import { useEffect, useRef } from "react";

export function DotBackground() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!spotRef.current) return;
      spotRef.current.style.background = `radial-gradient(700px circle at ${e.clientX}px ${e.clientY}px, rgba(96,165,250,0.055) 0%, transparent 65%)`;
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <>
      <div className="dot-grid" aria-hidden />
      <div ref={spotRef} className="dot-spotlight" aria-hidden />
    </>
  );
}