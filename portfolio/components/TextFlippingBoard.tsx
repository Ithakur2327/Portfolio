"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { BoardMessage, CodeToken } from "@/lib/board-messages";

const BOARD_COLS = 22;
const BOARD_ROWS = 9;

type Glyph = { value: string; tone?: CodeToken["tone"] };

export interface TextFlippingBoardProps {
  messages: BoardMessage[];
  hold?: number;
  duration?: number;
  className?: string;
}

function wrapLine(source: Glyph[]): Glyph[][] {
  const words: Glyph[][] = [];
  let word: Glyph[] = [];
  for (const glyph of source) {
    if (glyph.value === " ") {
      if (word.length) words.push(word);
      word = [];
    } else {
      word.push(glyph);
    }
  }
  if (word.length) words.push(word);

  const lines: Glyph[][] = [];
  let line: Glyph[] = [];
  for (const nextWord of words) {
    if (line.length && line.length + 1 + nextWord.length > BOARD_COLS) {
      lines.push(line);
      line = [];
    }
    if (nextWord.length > BOARD_COLS) {
      for (let offset = 0; offset < nextWord.length; offset += BOARD_COLS) {
        const part = nextWord.slice(offset, offset + BOARD_COLS);
        if (part.length === BOARD_COLS) lines.push(part);
        else line = part;
      }
    } else {
      if (line.length) line.push({ value: " " });
      line.push(...nextWord);
    }
  }
  if (line.length) lines.push(line);
  return lines;
}

function getMessageLines(message: BoardMessage): Glyph[][] {
  let lines: Glyph[][];
  if (message.type === "code") {
    lines = message.lines.map(tokens => tokens.flatMap(token =>
      Array.from(token.text, value => ({ value, tone: token.tone })),
    ));
  } else if (message.type === "puzzle") {
    lines = [
      Array.from(message.question, value => ({ value, tone: "keyword" as const })),
      Array.from(`ANSWER: ${message.answer}`, value => ({ value, tone: "string" as const })),
    ];
  } else {
    lines = [Array.from(message.text, value => ({ value, tone: "name" as const }))];
  }

  const wrapped = lines.flatMap(wrapLine).slice(0, BOARD_ROWS);
  const top = Math.floor((BOARD_ROWS - wrapped.length) / 2);
  return [
    ...Array.from({ length: top }, () => [] as Glyph[]),
    ...wrapped,
    ...Array.from({ length: BOARD_ROWS - top - wrapped.length }, () => [] as Glyph[]),
  ];
}

export function TextFlippingBoard({ messages, hold = 8, className }: TextFlippingBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [messageIndex, setMessageIndex] = useState(0);
  const lines = useMemo(
    () => getMessageLines(messages[messageIndex] ?? messages[0] ?? { type: "quote", text: "" }),
    [messageIndex, messages],
  );

  useEffect(() => {
    if (messages.length < 2) return;
    const board = boardRef.current;
    if (!board) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    let inView = false;
    const syncTimer = () => {
      if (inView && !document.hidden && !timer) {
        timer = setInterval(() => setMessageIndex(index => (index + 1) % messages.length), hold * 1000);
      } else if ((!inView || document.hidden) && timer) {
        clearInterval(timer);
        timer = undefined;
      }
    };
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

  return (
    <div ref={boardRef} className={`sfb${className ? ` ${className}` : ""}`}>
      <div className="sfb-grid" key={messageIndex} aria-hidden="true">
        {lines.flatMap((line, row) => {
          const start = Math.floor((BOARD_COLS - line.length) / 2);
          return Array.from({ length: BOARD_COLS }, (_, col) => {
            const glyph = line[col - start] ?? { value: " " };
            return (
              <span
                className={`sfb-cell${glyph.value.trim() ? " sfb-cell-active" : ""}${glyph.tone ? ` sfb-token-${glyph.tone}` : ""}`}
                key={`${row}-${col}`}
                style={glyph.value.trim() ? { animationDelay: `${row * 18 + col * 3}ms` } : undefined}
              >
                {glyph.value}
              </span>
            );
          });
        })}
      </div>
      <p className="sfb-live" aria-live="polite" aria-atomic="true">
        {messages[messageIndex]?.type === "quote"
          ? messages[messageIndex].text
          : messages[messageIndex]?.type === "puzzle"
            ? `${messages[messageIndex].question} Answer: ${messages[messageIndex].answer}`
            : messages[messageIndex]?.lines.map(line => line.map(token => token.text).join("")).join(" ")}
      </p>
    </div>
  );
}

export default TextFlippingBoard;
