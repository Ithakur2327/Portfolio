"use client";

import { useEffect, useRef, useState } from "react";

export interface TextFlippingBoardProps {
  messages: string[];
  hold?: number;
  duration?: number;
  className?: string;
}

export function TextFlippingBoard({ messages, hold = 8, className }: TextFlippingBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messages.length < 2) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    let inView = false;

    const syncTimer = () => {
      if (inView && !document.hidden && !timer) {
        timer = setInterval(() => {
          setMessageIndex(index => (index + 1) % messages.length);
        }, hold * 1000);
      } else if ((!inView || document.hidden) && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    };

    const board = boardRef.current;
    if (!board) return;
    const observer = new IntersectionObserver(([entry]) => {
      inView = !!entry?.isIntersecting;
      syncTimer();
    }, { rootMargin: "80px 0px" });
    observer.observe(board);

    document.addEventListener("visibilitychange", syncTimer);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncTimer);
      if (timer) clearInterval(timer);
    };
  }, [hold, messages.length]);

  const message = messages[messageIndex] ?? messages[0] ?? "";
  const lines = message.split("\n");

  return (
    <div ref={boardRef} className={`sfb${className ? ` ${className}` : ""}`}>
      <p key={messageIndex} className="sfb-quote" aria-live="polite" aria-atomic="true">
        {lines.map((line, index) => (
          <span key={`${messageIndex}-${index}`}>
            {line}
            {index < lines.length - 1 && <br />}
          </span>
        ))}
      </p>
    </div>
  );
}

export default TextFlippingBoard;
