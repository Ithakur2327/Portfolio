"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

export function LanyardCard() {
  const { theme } = useTheme();
  const [mounted, setMounted]   = useState(false);
  const [flipped, setFlipped]   = useState(false);
  const angleRef  = useRef(0);
  const velRef    = useRef(0);
  const dragging  = useRef(false);
  const lastX     = useRef(0);
  const lastVel   = useRef(0);
  const didDrag   = useRef(false);
  const idleT     = useRef(0);
  const physicsId = useRef(0);
  const idleId    = useRef(0);
  const [angleDeg, setAngleDeg] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  // ── Physics spring-back ──
  const runPhysics = useCallback(() => {
    if (dragging.current) { physicsId.current = requestAnimationFrame(runPhysics); return; }
    const stiffness = 0.14;
    const damping   = 0.26;
    velRef.current  += -angleRef.current * stiffness - velRef.current * damping;
    angleRef.current += velRef.current;
    setAngleDeg(angleRef.current);
    if (Math.abs(angleRef.current) > 0.08 || Math.abs(velRef.current) > 0.08) {
      physicsId.current = requestAnimationFrame(runPhysics);
    }
  }, []);

  // ── Idle gentle left-right sway — throttled to ~30fps for perf ──
  useEffect(() => {
    let lastTime = 0;
    const INTERVAL = 33; // ~30fps
    const sway = (ts: number) => {
      if (ts - lastTime >= INTERVAL) {
        lastTime = ts;
        if (!dragging.current && Math.abs(angleRef.current) < 1.5 && Math.abs(velRef.current) < 0.4) {
          idleT.current += 0.007;
          const a = Math.sin(idleT.current) * 4;
          angleRef.current = a;
          setAngleDeg(a);
        }
      }
      idleId.current = requestAnimationFrame(sway);
    };
    idleId.current = requestAnimationFrame(sway);
    return () => { cancelAnimationFrame(idleId.current); cancelAnimationFrame(physicsId.current); };
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    didDrag.current  = false;
    lastX.current    = e.clientX;
    lastVel.current  = 0;
    cancelAnimationFrame(physicsId.current);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    if (Math.abs(dx) > 1.5) didDrag.current = true;
    const newAngle    = Math.max(-42, Math.min(42, angleRef.current + dx * 0.6));
    lastVel.current   = newAngle - angleRef.current;
    angleRef.current  = newAngle;
    setAngleDeg(newAngle);
    lastX.current = e.clientX;
  };

  const onPointerUp = () => {
    dragging.current = false;
    velRef.current   = lastVel.current * 0.65;
    physicsId.current = requestAnimationFrame(runPhysics);
    if (!didDrag.current) setFlipped(f => !f);
  };

  const isDark  = mounted ? theme === "dark" : true;
  const cardBg  = isDark ? "#f5f5f5" : "#ffffff";
  const cardText = "#111111";
  const shadow  = isDark
    ? "0 6px 28px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(0,0,0,0.2)"
    : "0 4px 18px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.10)";

  // Strap gradient
  const strapBg = isDark
    ? "linear-gradient(180deg,#1a1a28 0%,#2a2a40 50%,#1a1a28 100%)"
    : "linear-gradient(180deg,#2a2a3a 0%,#3a3a52 50%,#2a2a3a 100%)";

  // ── Dimensions: ~half the original ──
  // Strap: 22px tall, 6px wide (was 42px / 10px)
  // Clip:  7px tall, 9px wide (was 11px / 14px)
  // Card:  48px wide × 64px tall (was 82px × 110px)
  const STRAP_W = 6;
  const STRAP_H = 22;
  const CARD_W  = 52;
  const CARD_H  = 68;

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start",
      paddingTop: 4,
      userSelect: "none", WebkitUserSelect: "none",
      touchAction: "none",
    }}>
      <style suppressHydrationWarning>{`
        .lc-inner {
          transform-style: preserve-3d;
          will-change: transform;
          transition: transform 0.55s cubic-bezier(0.34,1.2,0.64,1);
        }
        .lc-inner.flipped { transform: rotateY(180deg); }
        .lc-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          position: absolute; inset: 0;
          border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
        }
        .lc-back { transform: rotateY(180deg); }
        .lc-pivot {
          transform-origin: top center;
          will-change: transform;
          display: flex; flex-direction: column; align-items: center;
          cursor: grab;
        }
        .lc-pivot:active { cursor: grabbing; }
      `}</style>

      {/* ── Pivot wrapper ── */}
      <div
        className="lc-pivot"
        style={{ transform: `rotate(${angleDeg}deg)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* STRAP — flush top border of card hole */}
        <div style={{
          width: STRAP_W,
          height: STRAP_H,
          background: strapBg,
          borderRadius: "2px 2px 0 0",
          boxShadow: "1px 0 2px rgba(0,0,0,0.35), inset -1px 0 1px rgba(255,255,255,0.05)",
          flexShrink: 0,
          zIndex: 2,
        }} />

        {/* METAL CLIP — connects strap bottom to card top, no gap */}
        <div style={{
          width: 9,
          height: 7,
          flexShrink: 0,
          position: "relative",
          marginTop: 0,
          zIndex: 2,
        }}>
          {/* D-ring arch */}
          <div style={{
            position: "absolute",
            top: 0, left: "50%",
            transform: "translateX(-50%)",
            width: STRAP_W, height: 4,
            border: "1.5px solid #999",
            borderBottom: "none",
            borderRadius: "4px 4px 0 0",
            background: "transparent",
          }} />
          {/* Clip body — flush to card top */}
          <div style={{
            position: "absolute",
            bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 9, height: 4,
            background: "linear-gradient(135deg,#bbb 0%,#777 100%)",
            borderRadius: 2,
            boxShadow: "0 1px 2px rgba(0,0,0,0.5)",
          }} />
        </div>

        {/* CARD — flush with clip, zero gap */}
        <div style={{
          width: CARD_W,
          height: CARD_H,
          perspective: 300,
          flexShrink: 0,
          // The strip hole at the top of the card
          position: "relative",
        }}>
          {/* Lanyard hole notch at top center of card */}
          <div style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: STRAP_W + 2,
            height: 5,
            background: isDark ? "#e0e0e0" : "#ddd",
            borderRadius: "0 0 3px 3px",
            zIndex: 3,
          }} />

          <div
            className={`lc-inner${flipped ? " flipped" : ""}`}
            style={{ width: "100%", height: "100%", position: "relative" }}
          >
            {/* FRONT */}
            <div className="lc-face" style={{
              background: cardBg,
              boxShadow: shadow,
              flexDirection: "column",
              gap: 2,
            }}>
              {/* Top colored stripe */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 16,
                background: isDark
                  ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                  : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
                borderRadius: "5px 5px 0 0",
              }} />
              <span style={{
                fontSize: 10, fontWeight: 800, color: cardText,
                fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
                letterSpacing: "-0.04em",
                marginTop: 18,
              }}>
                hello!
              </span>
              <span style={{
                fontSize: 6, color: "#888",
                fontFamily: "'Geist Mono',monospace",
                letterSpacing: "0.05em",
              }}>VISITOR</span>
            </div>

            {/* BACK */}
            <div className="lc-face lc-back" style={{ background: cardBg, boxShadow: shadow, flexDirection: "column", gap: 3 }}>
              {/* Top stripe */}
              <div style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                height: 16,
                background: isDark
                  ? "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
                  : "linear-gradient(135deg, #d97706 0%, #dc2626 100%)",
                borderRadius: "5px 5px 0 0",
              }} />
              {/* Sunglasses emoji from user */}
              <span style={{
                fontSize: 22, lineHeight: 1.1, marginTop: 14,
                fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
              }}>😎</span>
              {/* Coffee cup — unique style */}
              <span style={{
                fontSize: 14, lineHeight: 1.1,
                fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif",
              }}>☕</span>
            </div>
          </div>
        </div>

        {/* Tap hint */}
        <div style={{
          fontSize: 6, color: "var(--text-muted)", fontFamily: "monospace",
          letterSpacing: "0.05em", opacity: 0.4, marginTop: 3,
          userSelect: "none",
        }}>
          tap to flip
        </div>
      </div>
    </div>
  );
}