"use client";
import { useEffect, useRef, useState } from "react";

function ArrowUpIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

/**
 * ScrollFadeAndTop — bottom-of-screen fade/blur strip + a bottom-right
 * "scroll to top" arrow button, styled after chanhdai.com's pattern:
 *  - the fade sits fixed at the bottom edge of the viewport
 *  - the arrow appears after scrolling past a threshold, dims while
 *    actively scrolling down, and brightens on scroll-up / hover
 *  - both are only shown while scrolling through the page content —
 *    once the footer itself scrolls into view, they disappear so they
 *    never sit on top of the footer.
 */
export function ScrollFadeAndTop() {
  const [scrolledPast, setScrolledPast] = useState(false);
  const [dimmed, setDimmed] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);
  const lastY = useRef(0);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const footer = document.getElementById("site-footer-root");
    let observer: IntersectionObserver | null = null;
    if (footer) {
      observer = new IntersectionObserver(
        ([entry]) => setFooterVisible(entry.isIntersecting),
        { rootMargin: "0px 0px -15% 0px", threshold: 0 }
      );
      observer.observe(footer);
    }

    let raf: number | null = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolledPast(y > 400);
        setDimmed(y > lastY.current + 1);
        lastY.current = y;
        raf = null;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const show = scrolledPast && !footerVisible;

  return (
    <>
      {/* Bottom fade/blur — fades from transparent into the page background,
          stops appearing before the footer (which has its own background). */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: 0, right: 0, bottom: 0,
          height: 22,
          pointerEvents: "none",
          zIndex: 40,
          background: "linear-gradient(to top, var(--bg-base) 0%, var(--bg-base) 8%, transparent 100%)",
          backdropFilter: "blur(1.5px)",
          WebkitBackdropFilter: "blur(1.5px)",
          opacity: footerVisible ? 0 : 1,
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Bottom-right scroll-to-top arrow */}
      <button
        type="button"
        aria-label="Scroll to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: "fixed",
          right: 16,
          bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
          zIndex: 45,
          width: 38, height: 38,
          borderRadius: 10,
          border: "1px solid var(--border)",
          background: "var(--bg-secondary)",
          color: "var(--text-secondary)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          opacity: show ? (dimmed && !hovered ? 0.3 : 1) : 0,
          transform: show ? "translateY(0)" : "translateY(8px)",
          pointerEvents: show ? "auto" : "none",
          transition: "opacity 0.3s ease, transform 0.3s ease, background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
        }}
      >
        <ArrowUpIcon />
      </button>
    </>
  );
}
