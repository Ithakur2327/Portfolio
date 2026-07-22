"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Small tooltip mirroring the animate-ui tooltip used on the reference
 * portfolio: fades + scales in from the icon, small arrow, 0ms open delay,
 * short close delay so it doesn't flicker on fast mouse travel.
 */
export function SocialTooltip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  let closeTimer: ReturnType<typeof setTimeout> | null = null;

  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => {
        if (closeTimer) clearTimeout(closeTimer);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closeTimer = setTimeout(() => setOpen(false), 120);
      }}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 4 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 10px)",
              left: "50%",
              translateX: "-50%",
              transformOrigin: "bottom center",
              background: "var(--text-primary)",
              color: "var(--bg-base)",
              fontFamily: "'Geist', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 10px",
              borderRadius: 6,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 20,
            }}
          >
            {label}
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: "50%",
                transform: "translateX(-50%)",
                width: 8,
                height: 8,
                background: "var(--text-primary)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}