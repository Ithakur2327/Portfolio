"use client";
import { useEffect, useRef, useState } from "react";

export function ScrollEnhancements() {
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

        setVisible(y > 120);
        setPointingUp(maxScroll > 0 ? y / maxScroll > 0.40 : y > 300);

        // Hide as soon as footer starts entering viewport
        const footer = document.querySelector(".footer-root") as HTMLElement | null;
        if (footer) {
          const rect = footer.getBoundingClientRect();
          setNearFooter(rect.top < window.innerHeight + 40);
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

  return (
    <>
      <style suppressHydrationWarning>{`
        /* ── Pure glass fade — NO color, just blur+transparency ── */
        .scroll-glass-fade {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          pointer-events: none;
          z-index: 80;
          transition: opacity 0.22s ease;

          /* Desktop: 56px */
          height: 56px;
          background: transparent;
        }

        /* Blur layer — masked so only bottom strip is blurred */
        .scroll-glass-fade::after {
          content: '';
          position: absolute;
          inset: 0;
          /* Softer blur */
          backdrop-filter: blur(7px) saturate(1.2);
          -webkit-backdrop-filter: blur(7px) saturate(1.2);
          -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 65%);
          mask-image: linear-gradient(to bottom, transparent 0%, black 65%);
        }

        /* Tablet */
        @media (min-width: 601px) and (max-width: 1024px) {
          .scroll-glass-fade { height: 42px; }
          .scroll-glass-fade::after {
            backdrop-filter: blur(6px) saturate(1.15);
            -webkit-backdrop-filter: blur(6px) saturate(1.15);
          }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .scroll-glass-fade { height: 32px; }
          .scroll-glass-fade::after {
            backdrop-filter: blur(5px) saturate(1.1);
            -webkit-backdrop-filter: blur(5px) saturate(1.1);
          }
        }

        /* High-density mobile screens — disable expensive backdrop-filter.
           Blur cost scales with physical pixel count, so this targets
           devices with min-device-pixel-ratio (the ones that actually
           pay the most for it), not max. */
        @media (max-width: 480px) and (min-device-pixel-ratio: 2) {
          .scroll-glass-fade::after {
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }
        }

        /* Scroll arrow */
        .scroll-arrow-btn {
          position: fixed;
          bottom: 22px;
          right: 22px;
          z-index: 9999;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }

        @media (max-width: 600px) {
          .scroll-arrow-btn {
            bottom: 16px;
            right: 14px;
            width: 34px;
            height: 34px;
          }
        }
      `}</style>

      {/* Pure glass fade — no color tint */}
      <div
        aria-hidden="true"
        className="scroll-glass-fade"
        style={{ opacity: nearFooter ? 0 : 1 }}
      />

      {/* Scroll arrow — hides when near footer */}
      {!nearFooter && (
        <button
          onClick={handleClick}
          aria-label={pointingUp ? "Scroll to top" : "Scroll down"}
          className="scroll-arrow-btn"
          style={{
            border: "1px solid rgba(128,128,128,0.22)",
            background: "rgba(128,128,128,0.12)",
            backdropFilter: "blur(16px) saturate(1.6)",
            WebkitBackdropFilter: "blur(16px) saturate(1.6)",
            boxShadow: "0 2px 16px rgba(0,0,0,0.12)",
            color: "var(--text-secondary)",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1) translateY(0)" : "scale(0.6) translateY(10px)",
            transition: "opacity 0.28s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
            pointerEvents: visible ? "auto" : "none",
          }}
        >
          <svg
            width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" strokeLinejoin="round"
            style={{
              transform: pointingUp ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      )}
    </>
  );
}