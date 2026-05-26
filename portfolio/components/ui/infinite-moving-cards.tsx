"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

interface SkillItem {
  name: string;
  logo: string;
  color: string;
}

export const InfiniteMovingSkills = ({
  items,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  items: SkillItem[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef  = useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);
      scrollerContent.forEach((item) => {
        const dup = item.cloneNode(true);
        scrollerRef.current!.appendChild(dup);
      });
      containerRef.current.style.setProperty(
        "--animation-direction",
        direction === "left" ? "forwards" : "reverse"
      );
      const durations = { fast: "20s", normal: "40s", slow: "80s" };
      containerRef.current.style.setProperty("--animation-duration", durations[speed]);
      setStart(true);
    }
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-3 py-3",
          start && "animate-scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li
            key={idx}
            style={{
              border: `1px solid ${item.color}35`,
              background: "var(--bg-card)",
            }}
            className="relative flex items-center gap-2.5 shrink-0 rounded-xl px-4 py-2.5"
          >
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 7,
                background: `${item.color}18`,
                border: `1px solid ${item.color}40`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <img
                src={item.logo}
                alt={item.name}
                width={16}
                height={16}
                style={{ objectFit: "contain" }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                fontFamily: "'Geist Mono', monospace",
                whiteSpace: "nowrap",
              }}
            >
              {item.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};