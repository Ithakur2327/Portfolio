"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

export function ScrollEnhancements() {
  const { theme } = useTheme();
  const [mounted,     setMounted]     = useState(false);
  const [visible,     setVisible]     = useState(false);
  const [pointingUp,  setPointingUp]  = useState(false);
  const ticking = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setVisible(y > 100);
        setPointingUp(y > 350);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (pointingUp) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <>
      {/* ── Bottom fade ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          pointerEvents: "none",
          zIndex: 80,
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, rgba(4,4,4,0.85) 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(245,245,243,0.9) 100%)",
        }}
      />

      {/* ── Scroll arrow ── */}
      <button
        onClick={handleClick}
        aria-label={pointingUp ? "Scroll to top" : "Scroll down"}
        style={{
          position: "fixed",
          bottom: 22,
          right: 22,
          zIndex: 9999,        // very high so nothing covers it
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: isDark
            ? "1px solid rgba(255,255,255,0.14)"
            : "1px solid rgba(0,0,0,0.14)",
          background: isDark
            ? "rgba(12,12,16,0.78)"
            : "rgba(240,240,238,0.84)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: isDark
            ? "0 2px 16px rgba(0,0,0,0.45)"
            : "0 2px 12px rgba(0,0,0,0.15)",
          color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          // fade + scale in/out
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.6) translateY(10px)",
          transition: "opacity 0.28s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
        {/* Arrow SVG — rotates based on direction */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            transform: pointingUp ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.32s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </>
  );
}