"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useSpring, useTransform, MotionValue } from "framer-motion";
import { useReveal } from "./useReveal";

const SF   = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', sans-serif";
const MONO = "'SF Mono', 'Geist Mono', monospace";

const ABOUT_TEXT = `Hi, I'm [[Indresh Thakur]], currently pursuing [[B.Tech]] in [[Computer Science & Engineering (AI)]] at [[NIET Greater Noida]]. I'm a [[motivated]] and [[growth-oriented]] [[Full-Stack & AI Developer]] passionate about building [[modern]], [[scalable]], and [[user-focused]] digital experiences.

My work focuses on developing [[intelligent web applications]] and [[AI-powered systems]] while continuously improving my [[problem-solving]] abilities through active [[DSA]] practice and real-world project development. I enjoy exploring [[emerging technologies]], learning new tech stacks, and turning ideas into [[impactful solutions]].

I bring a unique blend of [[technical expertise]], [[adaptability]], [[creativity]], and a genuine enthusiasm for building software that creates [[real impact]].`;

interface Token { text: string; hl: boolean; idx: number }
function parse(raw: string): Token[][] {
  let g = 0;
  return raw.split("\n\n").map(para => {
    const tokens: Token[] = [];
    const re = /\[\[(.+?)\]\]|([^\[]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(para)) !== null) {
      if (m[1]) tokens.push({ text: m[1], hl: true,  idx: g++ });
      else      tokens.push({ text: m[2], hl: false, idx: -1  });
    }
    return tokens;
  });
}

/* ══════════════════════════════════════════════════════════
   GOLD WORD
   — text ALWAYS fully visible, no blur ever
   — scroll se sirf gold glass background + text color change
   — 90fps feel: will-change + translateZ(0) GPU layer
══════════════════════════════════════════════════════════ */
function GoldWord({ text, idx, total, progress, isDark }: {
  text: string; idx: number; total: number;
  progress: MotionValue<number>; isDark: boolean;
}) {
  /* stagger per word, tight window for fast feel */
  const s = Math.max(0, (idx - 0.2) / total);
  const e = Math.min(1, (idx + 0.6) / total);

  /* 0→1 scroll progress for this word */
  const raw = useTransform(progress, [s, e], [0, 1]);
  /* high stiffness = snappy 90fps-like response */
  const p = useSpring(raw, { stiffness: 400, damping: 30, mass: 0.5 });

  /* interpolated values */
  const goldTextDark  = "rgba(255, 210, 80, 1)";
  const goldTextLight = "rgba(130, 90, 0, 1)";
  const baseTextDark  = "rgba(161,161,170,1)";   /* zinc-400 */
  const baseTextLight = "rgba(82,82,91,1)";

  const color   = useTransform(p, [0,1], isDark  ? [baseTextDark,  goldTextDark]  : [baseTextLight, goldTextLight]);
  const bgAlpha = useTransform(p, [0,1], [0, isDark ? 0.14 : 0.10]);
  const bdAlpha = useTransform(p, [0,1], [0, isDark ? 0.35 : 0.28]);

  const goldRGB = isDark ? "245,200,80" : "160,110,0";

  return (
    <motion.span
      style={{
        position: "relative",
        display: "inline",
        color,
        fontWeight: 600,
        borderRadius: 5,
        /* GPU layer for smoothness */
        willChange: "color",
        transform: "translateZ(0)",
      }}
    >
      {/* gold glass bg — separate layer so text stays crisp */}
      <motion.span
        aria-hidden
        style={{
          position: "absolute",
          inset: "-2px -5px",
          borderRadius: 5,
          background: useTransform(bgAlpha, v => `rgba(${goldRGB},${v.toFixed(3)})`),
          border: useTransform(bdAlpha, v => `1px solid rgba(${goldRGB},${v.toFixed(3)})`),
          boxShadow: useTransform(p, [0,1], [
            "none",
            `0 0 8px rgba(${goldRGB},0.18), inset 0 1px 0 rgba(255,240,160,0.12)`
          ]),
          pointerEvents: "none",
          willChange: "background, border, box-shadow",
          transform: "translateZ(0)",
        }}
      />
      {text}
    </motion.span>
  );
}

/* ══════════════════════════════════════════════════════════
   SCROLL REVEAL TEXT
══════════════════════════════════════════════════════════ */
function ScrollRevealText({ isDark }: { isDark: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.88", "end 0.18"],
  });
  /* smooth but responsive */
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.0005 });

  const paras = parse(ABOUT_TEXT);
  const total = paras.flat().filter(t => t.hl).length;

  return (
    <div ref={ref}>
      {paras.map((tokens, pi) => (
        <motion.p
          key={pi}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, delay: pi * 0.05, ease: [0.22, 1, 0.36, 1] }}
          style={{
            margin: "0 0 18px",
            fontSize: 15,
            lineHeight: 1.85,
            fontFamily: SF,
            letterSpacing: "-0.015em",
          }}
        >
          {tokens.map((t, ti) =>
            t.hl
              ? <GoldWord key={ti} text={t.text} idx={t.idx} total={total} progress={smooth} isDark={isDark} />
              : <span key={ti} style={{ color: isDark ? "#71717a" : "#6b7280" }}>{t.text}</span>
          )}
        </motion.p>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   GITHUB GRAPH
══════════════════════════════════════════════════════════ */
interface Week { days: { contributionCount: number; date: string }[] }

function GitHubGraph({ username = "IndreshThakur", isDark }: { username?: string; isDark: boolean }) {
  const [weeks,   setWeeks]   = useState<Week[]>([]);
  const [total,   setTotal]   = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(r => r.json())
      .then(json => {
        const c: { date: string; count: number }[] = json.contributions ?? [];
        const tot = Object.values(json.total as Record<string, number>).reduce((a, b) => a + b, 0);
        setTotal(tot);
        const ws: Week[] = [];
        for (let i = 0; i < c.length; i += 7)
          ws.push({ days: c.slice(i, i + 7).map(x => ({ contributionCount: x.count, date: x.date })) });
        setWeeks(ws.slice(-26)); setLoading(false);
      })
      .catch(() => {
        const ws = Array.from({ length: 26 }, (_, w) => ({
          days: Array.from({ length: 7 }, (_, d) => {
            const s = (w*7+d+13)%17;
            return { contributionCount:[0,1,3,6,10][s<5?0:s<9?1:s<12?2:s<15?3:4], date:"" };
          }),
        }));
        setWeeks(ws); setTotal(null); setLoading(false);
      });
  }, [username]);

  const lvl = (n: number) => n===0?0:n<3?1:n<6?2:n<10?3:4;
  const bd = isDark ? "#1f1f23" : "#e4e4e7";

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <IBox isDark={isDark}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill={isDark?"#e4e4e7":"#18181b"}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </IBox>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:isDark?"#e4e4e7":"#18181b", fontFamily:SF, letterSpacing:"-0.01em" }}>GitHub</div>
            <div style={{ fontSize:11, color:"#71717a", fontFamily:MONO }}>@{username}</div>
          </div>
        </div>
        {total !== null && total > 0 && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, fontWeight:700, color:"#4ade80", fontFamily:MONO, letterSpacing:"-0.04em", lineHeight:1 }}>{total.toLocaleString()}</div>
            <div style={{ fontSize:10, color:"#71717a", fontFamily:MONO, marginTop:2 }}>contributions this year</div>
          </div>
        )}
      </div>
      <div style={{ height:1, background:bd, marginBottom:12 }} />
      {loading ? <Spin color="#4ade80" isDark={isDark}/> : (
        <>
          <div style={{ display:"flex", gap:3, overflowX:"auto", paddingBottom:4 }}>
            {weeks.map((w,wi) => (
              <div key={wi} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                {w.days.map((d,di) => (
                  <div key={di} className="contrib-cell" data-level={lvl(d.contributionCount)}
                    title={d.date?`${d.date}: ${d.contributionCount}`:`${d.contributionCount} contributions`}/>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:8 }}>
            <span style={{ fontSize:10, color:"#52525b", fontFamily:MONO }}>Contribution activity</span>
            <div style={{ display:"flex", alignItems:"center", gap:3 }}>
              <span style={{ fontSize:10, color:"#52525b", fontFamily:MONO }}>Less</span>
              {[0,1,2,3,4].map(l=><div key={l} className="contrib-cell" data-level={l} style={{ flexShrink:0 }}/>)}
              <span style={{ fontSize:10, color:"#52525b", fontFamily:MONO }}>More</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LEETCODE STATS
══════════════════════════════════════════════════════════ */
interface LC { easySolved:number; totalEasy:number; mediumSolved:number; totalMedium:number; hardSolved:number; totalHard:number; totalSolved:number; ranking:number; }

function LeetCodeStats({ username="IThakur09", isDark }: { username?: string; isDark: boolean }) {
  const [data,    setData]    = useState<LC|null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    setLoading(true); setError(false); setData(null);
    const run = async () => {
      try {
        const r  = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        const j  = await r.json();
        if (j.solvedProblem !== undefined) {
          const r2 = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
          const j2 = await r2.json();
          setData({ easySolved:j2.easySolved??0, totalEasy:j2.totalEasy??842, mediumSolved:j2.mediumSolved??0, totalMedium:j2.totalMedium??1768, hardSolved:j2.hardSolved??0, totalHard:j2.totalHard??763, totalSolved:j.solvedProblem??0, ranking:j2.ranking??0 });
          setLoading(false); return;
        }
      } catch {}
      try {
        const body = JSON.stringify({ query:`query($u:String!){matchedUser(username:$u){submitStats{acSubmissionNum{difficulty count}}profile{ranking}}}`, variables:{u:username} });
        const r = await fetch("https://leetcode.com/graphql",{method:"POST",headers:{"Content-Type":"application/json"},body});
        const j = await r.json();
        const s = j?.data?.matchedUser?.submitStats?.acSubmissionNum??[];
        const g = (d:string)=>s.find((x:{difficulty:string;count:number})=>x.difficulty===d)?.count??0;
        setData({ easySolved:g("Easy"), totalEasy:842, mediumSolved:g("Medium"), totalMedium:1768, hardSolved:g("Hard"), totalHard:763, totalSolved:g("All"), ranking:j?.data?.matchedUser?.profile?.ranking??0 });
        setLoading(false); return;
      } catch {}
      setError(true); setLoading(false);
    };
    run();
  }, [username]);

  const tiers = data ? [
    { label:"Easy",   solved:data.easySolved,  total:data.totalEasy,   color:"#4ade80", bg:"rgba(74,222,128,0.07)"  },
    { label:"Medium", solved:data.mediumSolved, total:data.totalMedium, color:"#fbbf24", bg:"rgba(251,191,36,0.07)"  },
    { label:"Hard",   solved:data.hardSolved,   total:data.totalHard,   color:"#f87171", bg:"rgba(248,113,113,0.07)" },
  ] : [];
  const bd = isDark ? "#1f1f23" : "#e4e4e7";

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <IBox isDark={isDark}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
            </svg>
          </IBox>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:isDark?"#e4e4e7":"#18181b", fontFamily:SF, letterSpacing:"-0.01em" }}>LeetCode</div>
            <div style={{ fontSize:11, color:"#71717a", fontFamily:MONO }}>@{username}</div>
          </div>
        </div>
        {data && data.totalSolved > 0 && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, fontWeight:700, color:"#fbbf24", fontFamily:MONO, letterSpacing:"-0.04em", lineHeight:1 }}>{data.totalSolved}</div>
            <div style={{ fontSize:10, color:"#71717a", fontFamily:MONO, marginTop:2 }}>problems solved</div>
          </div>
        )}
      </div>
      <div style={{ height:1, background:bd, marginBottom:12 }} />
      {loading ? <Spin color="#fbbf24" isDark={isDark}/> : error||!data ? (
        <div style={{ height:90, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8 }}>
          <span style={{ fontSize:12, color:"#52525b", fontFamily:MONO }}>Could not load</span>
          <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer" style={{ fontSize:11, color:"#fbbf24", fontFamily:MONO, textDecoration:"none" }}>Visit profile ↗</a>
        </div>
      ) : (
        <>
          <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:12 }}>
            {tiers.map(t => (
              <div key={t.label} style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, background:t.bg, border:`1px solid ${t.color}22` }}>
                <span style={{ fontSize:11, color:t.color, fontFamily:MONO, width:46, fontWeight:600 }}>{t.label}</span>
                <div style={{ flex:1, height:4, borderRadius:2, background:"rgba(255,255,255,0.06)", overflow:"hidden" }}>
                  <div style={{ height:"100%", borderRadius:2, background:t.color, width:`${Math.round((t.solved/(t.total||1))*100)}%`, transition:"width 1.2s cubic-bezier(0.22,1,0.36,1)", boxShadow:`0 0 6px ${t.color}88` }}/>
                </div>
                <span style={{ fontSize:11, fontFamily:MONO, width:60, textAlign:"right" }}>
                  <span style={{ color:t.color }}>{t.solved}</span>
                  <span style={{ color:"#3f3f46" }}>/{t.total}</span>
                </span>
              </div>
            ))}
          </div>
          {data.ranking>0 && (
            <div style={{ display:"flex", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:"#52525b", fontFamily:MONO }}>Global ranking</span>
              <span style={{ fontSize:12, color:"#fbbf24", fontFamily:MONO, fontWeight:600 }}>#{data.ranking.toLocaleString()}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function IBox({ isDark, children }: { isDark: boolean; children: React.ReactNode }) {
  return (
    <div style={{ width:32, height:32, borderRadius:8, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", background:isDark?"#111113":"#f4f4f5", border:`1px solid ${isDark?"#27272a":"#e4e4e7"}` }}>
      {children}
    </div>
  );
}
function Spin({ color, isDark }: { color: string; isDark: boolean }) {
  return (
    <div style={{ height:80, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:18, height:18, border:`2px solid ${isDark?"#27272a":"#e4e4e7"}`, borderTop:`2px solid ${color}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }}/>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════════ */
export function AboutSection() {
  const { ref, visible } = useReveal();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute("data-theme") !== "light");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes:true, attributeFilter:["data-theme","class"] });
    return () => obs.disconnect();
  }, []);

  const panelBg = isDark ? "#0d0d0f" : "#ececea";
  const panelBd = isDark ? "#1f1f23" : "#ddddd8";

  return (
    <>
      <motion.section
        ref={ref}
        initial={{ opacity:0, y:14 }}
        animate={visible ? { opacity:1, y:0 } : {}}
        transition={{ duration:0.5, ease:[0.22,1,0.36,1] }}
        style={{ padding:"20px 0 40px", borderBottom:"1px solid var(--line)" }}
      >
        {/* full-bleed wrapper — same as hero panels */}
        <div style={{
          position: "relative",
          marginLeft:  "calc(-100vw + 50%)",
          marginRight: "calc(-100vw + 50%)",
          background: isDark ? "#09090b" : "#f2f2f0",
          borderTop:    "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
        }}>
          <div style={{ maxWidth:1060, margin:"0 auto", padding:"0 32px" }}>

            {/* About heading */}
            <div style={{
              padding:"22px 0 16px",
              borderBottom:`1px solid ${isDark?"#1f1f23":"#e0e0dc"}`,
            }}>
              <h2 style={{
                fontSize:18,
                fontWeight:700,
                letterSpacing:"-0.03em",
                color: isDark?"#fafafa":"#18181b",
                fontFamily:SF,
                margin:0,
              }}>
                About
              </h2>
            </div>

            {/* body */}
            <div style={{ padding:"24px 0 32px" }}>
              <div style={{ marginBottom:28 }}>
                <ScrollRevealText isDark={isDark} />
              </div>

              {/* stats panels */}
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div style={{
                  padding:"18px",
                  background:panelBg,
                  border:`1px solid ${panelBd}`,
                  borderRadius:10,
                }}>
                  <GitHubGraph username="IndreshThakur" isDark={isDark} />
                </div>
                <div style={{
                  padding:"18px",
                  background:panelBg,
                  border:`1px solid ${panelBd}`,
                  borderRadius:10,
                }}>
                  <LeetCodeStats username="IThakur09" isDark={isDark} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </>
  );
}
