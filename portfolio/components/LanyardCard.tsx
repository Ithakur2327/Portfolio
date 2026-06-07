"use client";
import { useEffect, useRef, useState } from "react";

/*
  LanyardCard — animated ID card hanging on a lanyard.
  Front: "hello" text + greeting emoji
  Back:  coffee cup + cool emoji  
  Swings left/right continuously, flip on hover/click.
  Fully responsive, sized to fit inside the hero photo area.
  Uses pure CSS + minimal JS — no Three.js needed, works on all devices.
*/

export function LanyardCard() {
  const [flipped, setFlipped] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [dragAngle, setDragAngle] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartX = useRef(0);
  const currentAngle = useRef(0);

  // Swing animation via CSS — no JS frame loop needed
  const handlePointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    dragStartX.current = e.clientX;
    currentAngle.current = dragAngle;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - dragStartX.current;
    const angle = Math.max(-35, Math.min(35, currentAngle.current + dx * 0.4));
    setDragAngle(angle);
  };
  const handlePointerUp = () => {
    setDragging(false);
    // Spring back
    setDragAngle(0);
  };

  const handleClick = () => {
    if (!dragging) setFlipped(f => !f);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      userSelect: "none",
      WebkitUserSelect: "none",
    }}>
      <style suppressHydrationWarning>{`
        @keyframes lanyardSwing {
          0%   { transform: rotate(-6deg); }
          50%  { transform: rotate(6deg); }
          100% { transform: rotate(-6deg); }
        }
        .lanyard-pivot {
          transform-origin: top center;
          animation: lanyardSwing 2.8s ease-in-out infinite;
          will-change: transform;
        }
        .lanyard-pivot.dragging {
          animation: none;
        }
        .lanyard-card-inner {
          transition: transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-style: preserve-3d;
          will-change: transform;
        }
        .lanyard-card-inner.flipped {
          transform: rotateY(180deg);
        }
        .card-face {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          position: absolute;
          inset: 0;
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .card-face-back {
          transform: rotateY(180deg);
        }
        .lanyard-string {
          width: 2px;
          background: linear-gradient(to bottom, #888, #aaa, #888);
          border-radius: 1px;
        }
      `}</style>

      {/* String */}
      <div className="lanyard-string" style={{ height: 36 }} />

      {/* Swinging card */}
      <div
        className={`lanyard-pivot${dragging ? " dragging" : ""}`}
        style={{
          transform: dragging ? `rotate(${dragAngle}deg)` : undefined,
          cursor: dragging ? "grabbing" : "grab",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
      >
        {/* Clip / hook */}
        <div style={{
          width: 16, height: 10,
          background: "linear-gradient(135deg, #ccc, #888)",
          borderRadius: "3px 3px 0 0",
          margin: "0 auto",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        }} />

        {/* Card */}
        <div
          ref={cardRef}
          style={{
            width: 110,
            height: 150,
            perspective: 600,
          }}
        >
          <div
            className={`lanyard-card-inner${flipped ? " flipped" : ""}`}
            style={{
              width: "100%", height: "100%",
              position: "relative",
            }}
          >
            {/* Front face */}
            <div
              className="card-face"
              style={{
                background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
                border: "1px solid rgba(255,255,255,0.15)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.06) inset",
              }}
            >
              {/* Lanyard stripe at top */}
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 28,
                background: "linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)",
                borderRadius: "10px 10px 0 0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.85)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>
                  VISITOR
                </span>
              </div>

              <div style={{ marginTop: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={{ fontSize: 28 }}>👋</div>
                <div style={{
                  fontSize: 22, fontWeight: 800,
                  color: "#fff",
                  fontFamily: "'Geist', 'SF Pro Display', sans-serif",
                  letterSpacing: "-0.04em",
                }}>hello</div>
                <div style={{
                  fontSize: 9, color: "rgba(255,255,255,0.45)",
                  fontFamily: "monospace", letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}>tap to flip</div>
              </div>

              {/* Bottom strip */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 24,
                background: "rgba(255,255,255,0.04)",
                borderRadius: "0 0 10px 10px",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 50, height: 4, borderRadius: 2,
                  background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
                  opacity: 0.6,
                }} />
              </div>
            </div>

            {/* Back face */}
            <div
              className="card-face card-face-back"
              style={{
                background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.48), 0 0 0 1px rgba(255,255,255,0.04) inset",
              }}
            >
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 28,
                background: "linear-gradient(90deg, #10b981, #06d6a0, #10b981)",
                borderRadius: "10px 10px 0 0",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.9)", letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "monospace" }}>
                  DEV MODE
                </span>
              </div>

              <div style={{ marginTop: 10, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ fontSize: 28 }}>☕</div>
                <div style={{ fontSize: 22 }}>😎</div>
                <div style={{
                  fontSize: 9, color: "rgba(255,255,255,0.4)",
                  fontFamily: "monospace", letterSpacing: "0.08em",
                  textAlign: "center",
                  padding: "0 8px",
                }}>powered by<br/>coffee & code</div>
              </div>

              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0, height: 24,
                background: "rgba(255,255,255,0.03)",
                borderRadius: "0 0 10px 10px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <div style={{
                  width: 50, height: 4, borderRadius: 2,
                  background: "linear-gradient(90deg, #10b981, #06d6a0)",
                  opacity: 0.6,
                }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
