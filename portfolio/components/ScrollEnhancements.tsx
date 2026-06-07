"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";

export function ScrollEnhancements() {
  const { theme } = useTheme();
  const [mounted,    setMounted]    = useState(false);
  const [visible,    setVisible]    = useState(false);
  const [pointingUp, setPointingUp] = useState(false);
  const [nearFooter, setNearFooter] = useState(false);
  const ticking = useRef(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y         = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // Show after 120px
        setVisible(y > 120);

        // Point UP when past 40% of page
        setPointingUp(maxScroll > 0 ? y / maxScroll > 0.40 : y > 300);

        // Detect if footer is in view — hide blur overlay when footer visible
        const footer = document.querySelector(".footer-root") as HTMLElement | null;
        if (footer) {
          const rect = footer.getBoundingClientRect();
          // Footer is starting to enter viewport bottom
          setNearFooter(rect.top < window.innerHeight + 10);
        }

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
      {/* ── Bottom glass fade — hides when footer appears ── */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: 140,
          pointerEvents: "none",
          zIndex: 80,
          // Fade out overlay when footer is visible
          opacity: nearFooter ? 0 : 1,
          transition: "opacity 0.35s ease",
          // Layered: frosted glass look — blur + gradient stacked
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, rgba(4,4,4,0.15) 30%, rgba(4,4,4,0.82) 70%, rgba(4,4,4,0.97) 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(245,245,243,0.15) 30%, rgba(245,245,243,0.88) 70%, rgba(245,245,243,0.98) 100%)",
          backdropFilter: "blur(0px)",          // backdrop on parent doesn't work on gradient, so use pseudo via boxShadow hack
          WebkitBackdropFilter: "blur(0px)",
        }}
      >
        {/* Inner glass layer for frosted effect */}
        <div style={{
          position: "absolute",
          inset: 0,
          bottom: 0,
          background: isDark
            ? "linear-gradient(to bottom, transparent 0%, rgba(4,4,4,0.0) 20%, rgba(4,4,4,0.55) 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(245,245,243,0.0) 20%, rgba(245,245,243,0.60) 100%)",
          backdropFilter: "blur(10px) saturate(1.4)",
          WebkitBackdropFilter: "blur(10px) saturate(1.4)",
          // Mask so blur only appears on bottom portion
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 55%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 55%)",
        }} />
      </div>

      {/* ── Scroll arrow ── */}
      <button
        onClick={handleClick}
        aria-label={pointingUp ? "Scroll to top" : "Scroll down"}
        style={{
          position: "fixed",
          bottom: 22,
          right: 22,
          zIndex: 9999,
          width: 40,
          height: 40,
          borderRadius: "50%",
          border: isDark
            ? "1px solid rgba(255,255,255,0.18)"
            : "1px solid rgba(0,0,0,0.16)",
          background: isDark
            ? "rgba(10,10,14,0.72)"
            : "rgba(245,245,243,0.72)",
          backdropFilter: "blur(20px) saturate(1.8)",
          WebkitBackdropFilter: "blur(20px) saturate(1.8)",
          boxShadow: isDark
            ? "0 2px 24px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)"
            : "0 2px 16px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.6)",
          color: isDark ? "rgba(255,255,255,0.82)" : "rgba(0,0,0,0.72)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.6) translateY(10px)",
          transition: "opacity 0.28s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          pointerEvents: visible ? "auto" : "none",
        }}
      >
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
            transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </>
  );
}
