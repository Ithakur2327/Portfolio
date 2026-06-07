"use client";
import { useEffect, useRef, useState } from "react";

// Renders:
// 1. Bottom screen fade/blur overlay
// 2. Scroll direction arrow (bottom-right)
// Both are purely visual overlays that don't affect layout.

export function ScrollEnhancements() {
  const [atBottom, setAtBottom] = useState(false);
  const [isPointingUp, setIsPointingUp] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      const nearBottom = y > maxY - 60;
      setAtBottom(nearBottom);
      // Pointing up when scrolling down (past a threshold), down when near top
      setIsPointingUp(y > 200);
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleArrowClick = () => {
    if (isPointingUp) {
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll down one viewport
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
    }
  };

  return (
    <>
      {/* Bottom fade blur */}
      <div id="scroll-bottom-fade" aria-hidden="true" />

      {/* Directional arrow */}
      <button
        id="scroll-arrow"
        className={isPointingUp ? "pointing-up" : ""}
        onClick={handleArrowClick}
        aria-label={isPointingUp ? "Scroll to top" : "Scroll down"}
        title={isPointingUp ? "Back to top" : "Scroll down"}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </>
  );
}
