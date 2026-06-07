"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "./ThemeProvider";

export function LanyardCard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [flipped, setFlipped] = useState(false);
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

  // ── Idle gentle sway (slow, smooth) ──
  useEffect(() => {
    const sway = () => {
      if (!dragging.current && Math.abs(angleRef.current) < 1.2 && Math.abs(velRef.current) < 0.3) {
        idleT.current += 0.008; // slower = smoother
        const a = Math.sin(idleT.current) * 3.5;
        angleRef.current = a;
        setAngleDeg(a);
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
    const newAngle = Math.max(-42, Math.min(42, angleRef.current + dx * 0.6));
    lastVel.current  = newAngle - angleRef.current;
    angleRef.current = newAngle;
    setAngleDeg(newAngle);
    lastX.current = e.clientX;
  };

  const onPointerUp = () => {
    dragging.current = false;
    velRef.current   = lastVel.current * 0.65;
    physicsId.current = requestAnimationFrame(runPhysics);
    if (!didDrag.current) setFlipped(f => !f);
  };

  const isDark   = mounted ? theme === "dark" : true;
  // Card color follows theme
  const cardBg   = isDark ? "#f8f8f8" : "#ffffff";
  const cardText = "#111111";
  const shadow   = isDark
    ? "0 6px 28px rgba(0,0,0,0.65), 0 2px 6px rgba(0,0,0,0.4), 0 0 0 0.5px rgba(0,0,0,0.2)"
    : "0 4px 18px rgba(0,0,0,0.22), 0 1px 4px rgba(0,0,0,0.14), 0 0 0 0.5px rgba(0,0,0,0.10)";

  // Strap: plain dark band, no dots
  const strapBg = isDark
    ? "linear-gradient(180deg,#1a1a28 0%,#2a2a40 50%,#1a1a28 100%)"
    : "linear-gradient(180deg,#2a2a3a 0%,#3a3a52 50%,#2a2a3a 100%)";

  // Card dimensions — fit within 162px row height
  // strap 40px + hook 10px + card 96px + hint 14px = 160px  ✓
  const CARD_W = 82;
  const CARD_H = 110;

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "flex-start",
      paddingTop: 0,
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
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .lc-back { transform: rotateY(180deg); }

        /* Pivot point at very top of strap */
        .lc-pivot {
          transform-origin: top center;
          will-change: transform;
          display: flex; flex-direction: column; align-items: center;
          cursor: grab;
        }
        .lc-pivot:active { cursor: grabbing; }
      `}</style>

      {/* ── Pivot wrapper — rotates whole assembly from top ── */}
      <div
        className="lc-pivot"
        style={{ transform: `rotate(${angleDeg}deg)` }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* STRAP — plain band, no dots, connected directly to top of card area */}
        <div style={{
          width: 10,
          height: 42,
          background: strapBg,
          borderRadius: "3px 3px 0 0",
          boxShadow: "1px 0 2px rgba(0,0,0,0.35), inset -1px 0 1px rgba(255,255,255,0.05)",
          flexShrink: 0,
        }} />

        {/* METAL CLIP — small teardrop/D-ring, zero gap */}
        <div style={{
          width: 14,
          height: 11,
          flexShrink: 0,
          position: "relative",
          marginTop: 0,
        }}>
          {/* D-ring arch */}
          <div style={{
            position: "absolute",
            top: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 10, height: 7,
            border: "2px solid #999",
            borderBottom: "none",
            borderRadius: "6px 6px 0 0",
            background: "transparent",
          }} />
          {/* Clip body */}
          <div style={{
            position: "absolute",
            bottom: 0, left: "50%",
            transform: "translateX(-50%)",
            width: 14, height: 6,
            background: "linear-gradient(135deg,#bbb 0%,#777 100%)",
            borderRadius: 3,
            boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }} />
        </div>

        {/* CARD — flush with clip, no gap */}
        <div style={{ width: CARD_W, height: CARD_H, perspective: 480, flexShrink: 0 }}>
          <div
            className={`lc-inner${flipped ? " flipped" : ""}`}
            style={{ width: "100%", height: "100%", position: "relative" }}
          >
            {/* FRONT */}
            <div className="lc-face" style={{ background: cardBg, boxShadow: shadow }}>
              <span style={{
                fontSize: 20, fontWeight: 800, color: cardText,
                fontFamily: "-apple-system,'SF Pro Display','Helvetica Neue',sans-serif",
                letterSpacing: "-0.04em",
              }}>
                hello!
              </span>
            </div>

            {/* BACK */}
            <div className="lc-face lc-back" style={{ background: cardBg, boxShadow: shadow }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <span style={{ fontSize: 26, lineHeight: 1.1, fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}>☕</span>
                <span style={{ fontSize: 26, lineHeight: 1.1, fontFamily: "'Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif" }}>😎</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tap hint */}
        <div style={{
          fontSize: 8, color: "var(--text-muted)", fontFamily: "monospace",
          letterSpacing: "0.05em", opacity: 0.45, marginTop: 3,
          userSelect: "none",
        }}>
          tap to flip
        </div>
      </div>
    </div>
  );
}