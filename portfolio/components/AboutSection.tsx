"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

import { useReveal } from "./useReveal";

const SF =
  "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";

const MONO =
  "'SF Mono', 'Geist Mono', monospace";

/* ──────────────────────────────────────────────────────────
   ABOUT TEXT
────────────────────────────────────────────────────────── */
const ABOUT_TEXT = `Hi, I'm [[Indresh Thakur]], currently pursuing [[B.Tech]] in [[Computer Science & Engineering (AI)]] at [[NIET Greater Noida]]. I'm a [[motivated]] and [[growth-oriented]] [[Full-Stack & AI Developer]] passionate about building [[modern]], [[scalable]], and [[user-focused]] digital experiences.

My work focuses on developing [[intelligent web applications]] and [[AI-powered systems]] while continuously improving my [[problem-solving]] abilities through active [[DSA]] practice and real-world project development. I enjoy exploring [[emerging technologies]], learning new tech stacks, and turning ideas into [[impactful solutions]].

I bring a unique blend of [[technical expertise]], [[adaptability]], [[creativity]], and a genuine enthusiasm for building software that creates [[real impact]].`;

/* ──────────────────────────────────────────────────────────
   TYPES
────────────────────────────────────────────────────────── */
interface Token {
  text: string;
  hl: boolean;
  idx: number;
  isName: boolean;
}

interface Week {
  days: {
    contributionCount: number;
    date: string;
  }[];
}

interface LC {
  easySolved: number;
  totalEasy: number;
  mediumSolved: number;
  totalMedium: number;
  hardSolved: number;
  totalHard: number;
  totalSolved: number;
  ranking: number;
}

/* ──────────────────────────────────────────────────────────
   PARSER
────────────────────────────────────────────────────────── */
function parse(raw: string): Token[][] {
  let g = 0;

  return raw.split("\n\n").map((para) => {
    const tokens: Token[] = [];

    const re = /\[\[(.+?)\]\]|([^\[]+)/g;

    let m: RegExpExecArray | null;

    while ((m = re.exec(para)) !== null) {
      if (m[1]) {
        tokens.push({
          text: m[1],
          hl: true,
          idx: g++,
          isName: m[1] === "Indresh Thakur",
        });
      } else {
        tokens.push({
          text: m[2],
          hl: false,
          idx: -1,
          isName: false,
        });
      }
    }

    return tokens;
  });
}

/* ──────────────────────────────────────────────────────────
   GOLD WORD
────────────────────────────────────────────────────────── */
function GoldWord({
  text,
  idx,
  total,
  progress,
  isName,
}: {
  text: string;
  idx: number;
  total: number;
  progress: MotionValue<number>;
  isName: boolean;
}) {
  const s = Math.max(0, (idx - 0.2) / total);

  const e = Math.min(1, (idx + 0.4) / total);

  const raw = useTransform(progress, [s, e], [0, 1]);

  const p = useSpring(raw, {
    stiffness: 800,
    damping: 32,
    mass: 0.2,
  });

  const opacity = useTransform(
    p,
    [0, 0.15, 1],
    [0.25, 0.65, 1]
  );

  if (isName) {
    return (
      <motion.span
        style={{
          opacity,
          display: "inline",
          verticalAlign: "baseline",
        }}
      >
        <span className="name-highlight">
          {text}
        </span>
      </motion.span>
    );
  }

  return (
    <motion.span
      className="gold-word"
      style={{
        opacity,
        display: "inline",
        verticalAlign: "baseline",
      }}
    >
      {text}
    </motion.span>
  );
}

/* ──────────────────────────────────────────────────────────
   SCROLL REVEAL TEXT
────────────────────────────────────────────────────────── */
function ScrollRevealText() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "center 0.6"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 26,
    restDelta: 0.001,
  });

  const paras = parse(ABOUT_TEXT);

  const total = paras
    .flat()
    .filter((t) => t.hl).length;

  return (
    <div ref={ref}>
      {paras.map((tokens, pi) => (
        <p
          key={pi}
          className="about-para"
          style={{
            margin: "0 0 18px",
            lineHeight: 1.8,
            fontFamily: SF,
            letterSpacing: "-0.01em",
            fontWeight: 400,
            color: "var(--text-primary)",
            wordBreak: "normal",
            overflowWrap: "break-word",
          }}
        >
          {tokens.map((t, ti) =>
            t.hl ? (
              <GoldWord
                key={ti}
                text={t.text}
                idx={t.idx}
                total={total}
                progress={smooth}
                isName={t.isName}
              />
            ) : (
              <span
                key={ti}
                style={{
                  color: "var(--text-primary)",
                  display: "inline",
                }}
              >
                {t.text}
              </span>
            )
          )}
        </p>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   GITHUB GRAPH
────────────────────────────────────────────────────────── */
function GitHubGraph({
  username = "IndreshThakur",
}: {
  username?: string;
}) {
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [total, setTotal] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      `https://github-contributions-api.jogruber.de/v4/${username}?y=last`
    )
      .then((r) => r.json())
      .then((json) => {
        const c:
          | {
              date: string;
              count: number;
            }[]
          | undefined = json.contributions;

        const tot = Object.values(
          json.total as Record<string, number>
        ).reduce((a, b) => a + b, 0);

        setTotal(tot);

        const ws: Week[] = [];

        for (let i = 0; i < (c?.length || 0); i += 7) {
          ws.push({
            days:
              c?.slice(i, i + 7).map((x) => ({
                contributionCount: x.count,
                date: x.date,
              })) || [],
          });
        }

        setWeeks(ws.slice(-26));

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [username]);

  const lvl = (n: number) =>
    n === 0 ? 0 : n < 3 ? 1 : n < 6 ? 2 : n < 10 ? 3 : 4;

  return (
    <div>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="var(--text-primary)"
            >
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </div>

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: SF,
              }}
            >
              GitHub
            </div>

            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: MONO,
              }}
            >
              @{username}
            </div>
          </div>
        </div>

        {total !== null && total > 0 && (
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "#4ade80",
                fontFamily: MONO,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {total.toLocaleString()}
            </div>

            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontFamily: MONO,
                marginTop: 2,
              }}
            >
              contributions this year
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          height: 1,
          background: "var(--border)",
          marginBottom: 12,
        }}
      />

      {loading ? (
        <Spin color="#4ade80" />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              gap: 3,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {weeks.map((w, wi) => (
              <div
                key={wi}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 3,
                }}
              >
                {w.days.map((d, di) => (
                  <div
                    key={di}
                    className="contrib-cell"
                    data-level={lvl(
                      d.contributionCount
                    )}
                  />
                ))}
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 8,
            }}
          >
            <span
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontFamily: MONO,
              }}
            >
              Contribution activity
            </span>
          </div>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   LEETCODE
────────────────────────────────────────────────────────── */
function LeetCodeStats({
  username = "IThakur09",
}: {
  username?: string;
}) {
  const [data, setData] =
    useState<LC | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const r = await fetch(
          `https://alfa-leetcode-api.onrender.com/${username}/solved`
        );

        const j = await r.json();

        const r2 = await fetch(
          `https://alfa-leetcode-api.onrender.com/userProfile/${username}`
        );

        const j2 = await r2.json();

        setData({
          easySolved: j2.easySolved ?? 0,
          totalEasy: j2.totalEasy ?? 842,
          mediumSolved: j2.mediumSolved ?? 0,
          totalMedium: j2.totalMedium ?? 1768,
          hardSolved: j2.hardSolved ?? 0,
          totalHard: j2.totalHard ?? 763,
          totalSolved: j.solvedProblem ?? 0,
          ranking: j2.ranking ?? 0,
        });

        setLoading(false);
      } catch {
        setLoading(false);
      }
    };

    run();
  }, [username]);

  const tiers = data
    ? [
        {
          label: "Easy",
          solved: data.easySolved,
          total: data.totalEasy,
          color: "#4ade80",
          accent: "rgba(74,222,128,0.08)",
        },

        {
          label: "Medium",
          solved: data.mediumSolved,
          total: data.totalMedium,
          color: "#fb923c",
          accent: "rgba(251,146,60,0.08)",
        },

        {
          label: "Hard",
          solved: data.hardSolved,
          total: data.totalHard,
          color: "#f87171",
          accent: "rgba(248,113,113,0.08)",
        },
      ]
    : [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 14,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M13.483 0a1.374 1.374 0 0 0-.961.438"
                fill="#FFA116"
              />
            </svg>
          </div>

          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text-primary)",
                fontFamily: SF,
              }}
            >
              LeetCode
            </div>

            <div
              style={{
                fontSize: 11,
                color: "var(--text-muted)",
                fontFamily: MONO,
              }}
            >
              @{username}
            </div>
          </div>
        </div>

        {data && (
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: "var(--text-primary)",
                fontFamily: MONO,
                letterSpacing: "-0.05em",
                lineHeight: 1,
              }}
            >
              {data.totalSolved}
            </div>

            <div
              style={{
                fontSize: 10,
                color: "var(--text-muted)",
                fontFamily: MONO,
                marginTop: 2,
              }}
            >
              problems solved
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          height: 1,
          background: "var(--border)",
          marginBottom: 14,
        }}
      />

      {loading ? (
        <Spin color="#FFA116" />
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr 1fr",
              gap: 8,
              marginBottom: 12,
            }}
          >
            {tiers.map((t) => (
              <div
                key={t.label}
                style={{
                  padding: "10px 10px 8px",
                  background: t.accent,
                  border: `1px solid ${t.color}22`,
                  borderRadius: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: t.color,
                    fontFamily: MONO,
                  }}
                >
                  {t.label}
                </span>

                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    fontFamily: MONO,
                    marginTop: 6,
                  }}
                >
                  {t.solved}
                </div>

                <div
                  style={{
                    fontSize: 9,
                    color: "var(--text-muted)",
                    fontFamily: MONO,
                  }}
                >
                  of {t.total}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   SPINNER
────────────────────────────────────────────────────────── */
function Spin({
  color,
}: {
  color: string;
}) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 60,
      }}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderTop: `2px solid ${color}`,
          borderRight: "2px solid transparent",
          borderBottom: "2px solid transparent",
          borderLeft: "2px solid transparent",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
    </div>
  );
}

/* ──────────────────────────────────────────────────────────
   MAIN
────────────────────────────────────────────────────────── */
export function AboutSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .name-highlight {
          display: inline;
          color: #4ade80;

          background: linear-gradient(
            135deg,
            rgba(74,222,128,0.10) 0%,
            rgba(34,197,94,0.05) 50%,
            rgba(16,185,129,0.08) 100%
          );

          border: 1px solid rgba(74,222,128,0.20);

          border-radius: 5px;

          padding: 1px 7px 2px;

          box-shadow:
            0 0 8px rgba(74,222,128,0.10),
            0 0 18px rgba(74,222,128,0.05);

          font-weight: 600;

          backdrop-filter: blur(3px);

          text-shadow:
            0 0 10px rgba(74,222,128,0.22);

          white-space: nowrap;
        }

        .gold-word {
          color: #f5c542;
          font-weight: 600;
          background: rgba(245,197,66,0.08);
          border: 1px solid rgba(245,197,66,0.12);
          border-radius: 5px;
          padding: 1px 5px 2px;
          margin: 0 1px;
        }

        .about-panels {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .about-content {
          max-width: 1060px;
          margin: 0 auto;
          padding: 0 32px 40px;
        }

        .contrib-cell {
          width: 11px;
          height: 11px;
          border-radius: 3px;
          background: #161b22;
        }

        .contrib-cell[data-level="1"] {
          background: rgba(74,222,128,0.25);
        }

        .contrib-cell[data-level="2"] {
          background: rgba(74,222,128,0.45);
        }

        .contrib-cell[data-level="3"] {
          background: rgba(74,222,128,0.7);
        }

        .contrib-cell[data-level="4"] {
          background: #4ade80;
        }

        @media (max-width: 860px) {

          .about-content {
            padding: 0 22px 34px;
          }
        }

        @media (max-width: 640px) {

          .about-panels {
            grid-template-columns: 1fr;
          }

          .about-content {
            padding: 0 16px 30px;
          }

          .about-para {
            font-size: 14px !important;
            line-height: 1.9 !important;
          }
        }
      `}</style>

      <motion.section
        ref={ref}
        initial={{
          opacity: 0,
          y: 14,
        }}
        animate={
          visible
            ? {
                opacity: 1,
                y: 0,
              }
            : {}
        }
        transition={{
          duration: 0.5,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <div
          style={{
            position: "relative",
            left: "50%",
            marginLeft: "-50vw",
            width: "100vw",
            background: "var(--bg-base)",
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
          }}
        >
          <div className="about-content">
            {/* TITLE */}
            <div
              style={{
                paddingTop: 28,
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  fontFamily: SF,
                  color: "var(--text-primary)",
                }}
              >
                About
              </span>
            </div>

            <div
              style={{
                height: 1,
                background: "var(--border)",
                margin: "18px 0 24px",
              }}
            />

            {/* TEXT */}
            <div
              style={{
                marginBottom: 28,
              }}
            >
              <ScrollRevealText />
            </div>

            {/* PANELS */}
            <div className="about-panels">
              <div
                style={{
                  padding: "18px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                }}
              >
                <GitHubGraph username="IndreshThakur" />
              </div>

              <div
                style={{
                  padding: "18px",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                }}
              >
                <LeetCodeStats username="IThakur09" />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </>
  );
}