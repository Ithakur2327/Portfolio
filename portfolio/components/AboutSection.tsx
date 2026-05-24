"use client";
import React, { useEffect, useState } from "react";
import { useReveal } from "./useReveal";

const ABOUT_POINTS = [
  "Computer science student (AI specialization) at NIET, Greater Noida — passionate about building full-stack web apps and generative AI systems.",
  "Experienced with React, Next.js, Node.js, and LLM APIs. Built production-level projects integrating RAG pipelines, vector databases, and multimodal AI.",
  "Active open-source contributor at GSSoC Extended Edition 2025 and hackathon participant at Smart India Hackathon 2025.",
  "Currently interning as Web Developer at Unstop (Jun–Aug 2025), gaining hands-on experience in real-world product development.",
];

const STATS = [
  { num: "2+",  label: "Years Coding",             color: "#a78bfa" },
  { num: "5+",  label: "Projects Built",            color: "#60a5fa" },
  { num: "10+", label: "Open Source Contributions", color: "#4ade80" },
];

/* ══ GITHUB ════════════════════════════════════════════════ */
interface Week { days: { contributionCount: number; date: string }[] }

function GitHubGraph({ username = "IndreshThakur" }: { username?: string }) {
  const [weeks,   setWeeks]   = useState<Week[]>([]);
  const [total,   setTotal]   = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=last`)
      .then(r => r.json())
      .then(json => {
        const contribs: { date: string; count: number }[] = json.contributions ?? [];
        const tot = Object.values(json.total as Record<string, number>).reduce((a, b) => a + b, 0);
        setTotal(tot);
        const ws: Week[] = [];
        for (let i = 0; i < contribs.length; i += 7)
          ws.push({ days: contribs.slice(i, i + 7).map(c => ({ contributionCount: c.count, date: c.date })) });
        setWeeks(ws.slice(-26));
        setLoading(false);
      })
      .catch(() => {
        const ws = Array.from({ length: 26 }, (_, w) => ({
          days: Array.from({ length: 7 }, (_, d) => {
            const s = (w * 7 + d + 13) % 17;
            return { contributionCount: [0,1,3,6,10][s<5?0:s<9?1:s<12?2:s<15?3:4], date: "" };
          }),
        }));
        setWeeks(ws); setTotal(null); setLoading(false);
      });
  }, [username]);

  const lvl = (n: number) => n===0?0:n<3?1:n<6?2:n<10?3:4;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={iconBox}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#e4e4e7">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
          </div>
          <div>
            <div style={lbl}>GitHub Activity</div>
            <div style={sub}>@{username}</div>
          </div>
        </div>
        {total !== null && total > 0 && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:20, fontWeight:700, color:"#4ade80", fontFamily:"'Geist Mono',monospace", letterSpacing:"-0.03em" }}>{total.toLocaleString()}</div>
            <div style={sub}>contributions</div>
          </div>
        )}
      </div>
      {loading ? <Spin color="#4ade80" /> : (
        <>
          <div style={{ display:"flex", gap:3, overflowX:"auto", paddingBottom:2 }}>
            {weeks.map((w, wi) => (
              <div key={wi} style={{ display:"flex", flexDirection:"column", gap:3 }}>
                {w.days.map((d, di) => (
                  <div key={di} className="contrib-cell" data-level={lvl(d.contributionCount)}
                    title={d.date ? `${d.date}: ${d.contributionCount}` : `${d.contributionCount} contributions`} />
                ))}
              </div>
            ))}
          </div>
          <p style={{ fontSize:10, color:"#3f3f46", marginTop:8, fontFamily:"'Geist Mono',monospace" }}>
            Contribution activity — GitHub
          </p>
        </>
      )}
    </div>
  );
}

/* ══ LEETCODE — using alfa-leetcode-api (reliable) ════════ */
interface LC {
  easySolved:number; totalEasy:number;
  mediumSolved:number; totalMedium:number;
  hardSolved:number; totalHard:number;
  totalSolved:number; ranking:number;
}

function LeetCodeStats({ username = "indreshthaakur" }: { username?: string }) {
  const [data,    setData]    = useState<LC | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    setLoading(true); setError(false); setData(null);

    // Try multiple APIs in order
    const tryApis = async () => {
      // API 1: alfa-leetcode-api
      try {
        const r = await fetch(`https://alfa-leetcode-api.onrender.com/${username}/solved`);
        const j = await r.json();
        if (j.solvedProblem !== undefined) {
          // Get difficulty breakdown
          const r2 = await fetch(`https://alfa-leetcode-api.onrender.com/userProfile/${username}`);
          const j2 = await r2.json();
          setData({
            easySolved: j2.easySolved ?? 0,   totalEasy: j2.totalEasy ?? 842,
            mediumSolved: j2.mediumSolved ?? 0, totalMedium: j2.totalMedium ?? 1768,
            hardSolved: j2.hardSolved ?? 0,   totalHard: j2.totalHard ?? 763,
            totalSolved: j.solvedProblem ?? 0, ranking: j2.ranking ?? 0,
          });
          setLoading(false); return;
        }
      } catch {}

      // API 2: leetcode-query via public graphql proxy
      try {
        const body = JSON.stringify({
          query: `query getUserProfile($username: String!) {
            matchedUser(username: $username) {
              submitStats { acSubmissionNum { difficulty count } }
              profile { ranking }
            }
          }`,
          variables: { username },
        });
        const r = await fetch("https://leetcode.com/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const j = await r.json();
        const stats = j?.data?.matchedUser?.submitStats?.acSubmissionNum ?? [];
        const get = (d: string) => stats.find((s: {difficulty:string;count:number}) => s.difficulty === d)?.count ?? 0;
        setData({
          easySolved: get("Easy"), totalEasy: 842,
          mediumSolved: get("Medium"), totalMedium: 1768,
          hardSolved: get("Hard"), totalHard: 763,
          totalSolved: get("All"),
          ranking: j?.data?.matchedUser?.profile?.ranking ?? 0,
        });
        setLoading(false); return;
      } catch {}

      setError(true); setLoading(false);
    };

    tryApis();
  }, [username]);

  const tiers = data ? [
    { label:"Easy",   solved:data.easySolved,   total:data.totalEasy,   color:"#4ade80" },
    { label:"Medium", solved:data.mediumSolved,  total:data.totalMedium, color:"#fbbf24" },
    { label:"Hard",   solved:data.hardSolved,    total:data.totalHard,   color:"#f87171" },
  ] : [];

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={iconBox}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#fbbf24">
              <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
            </svg>
          </div>
          <div>
            <div style={lbl}>LeetCode</div>
            <div style={sub}>@{username}</div>
          </div>
        </div>
        {data && data.totalSolved > 0 && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:20, fontWeight:700, color:"#fbbf24", fontFamily:"'Geist Mono',monospace", letterSpacing:"-0.03em" }}>{data.totalSolved}</div>
            <div style={sub}>solved</div>
          </div>
        )}
      </div>

      {loading ? <Spin color="#fbbf24" /> : error || !data ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:90, gap:6 }}>
          <span style={{ fontSize:12, color:"#52525b", fontFamily:"'Geist Mono',monospace" }}>Could not load — check username</span>
          <a href={`https://leetcode.com/${username}`} target="_blank" rel="noreferrer"
            style={{ fontSize:11, color:"#fbbf24", fontFamily:"'Geist Mono',monospace", textDecoration:"none" }}>
            View profile ↗
          </a>
        </div>
      ) : (
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {tiers.map(t => (
            <div key={t.label}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontSize:11, color:"#71717a", fontFamily:"'Geist Mono',monospace" }}>{t.label}</span>
                <span style={{ fontSize:11, color:"#a1a1aa", fontFamily:"'Geist Mono',monospace" }}>
                  {t.solved}<span style={{ color:"#3f3f46" }}>/{t.total}</span>
                </span>
              </div>
              <div style={{ height:5, borderRadius:3, background:"#1a1a1a", overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:3, background:t.color,
                  width:`${Math.round((t.solved/(t.total||1))*100)}%`,
                  transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)",
                  boxShadow:`0 0 8px ${t.color}55`,
                }} />
              </div>
            </div>
          ))}
          {data.ranking > 0 && (
            <p style={{ fontSize:11, color:"#3f3f46", fontFamily:"'Geist Mono',monospace", marginTop:2 }}>
              Global rank: <span style={{ color:"#71717a" }}>#{data.ranking.toLocaleString()}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── helpers ─────────────────────────────────────────── */
const iconBox: React.CSSProperties = {
  width:30, height:30, borderRadius:7,
  background:"#111113", border:"1px solid #27272a",
  display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
};
const lbl: React.CSSProperties = { fontSize:12, fontWeight:600, color:"#e4e4e7", letterSpacing:"-0.01em" };
const sub: React.CSSProperties = { fontSize:10, color:"#52525b", fontFamily:"'Geist Mono',monospace" };

function Spin({ color }: { color: string }) {
  return (
    <div style={{ height:80, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ width:18, height:18, border:`2px solid #27272a`, borderTop:`2px solid ${color}`, borderRadius:"50%", animation:"spin 0.8s linear infinite" }} />
    </div>
  );
}

/* ══ MAIN ══════════════════════════════════════════════════ */
export function AboutSection() {
  const { ref, visible } = useReveal();

  return (
    <>
      <section
        ref={ref}
        style={{
          padding: "20px 0 36px",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(14px)",
          transition: "opacity 0.55s var(--expo-out), transform 0.55s var(--expo-out)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        {/* ══ FULL-WIDTH BOX with round corners ══ */}
        <div style={{
          position: "relative",
          left: "50%",
          marginLeft: "-50vw",
          width: "100vw",
          background: "#09090b",
          border: "1px solid #27272a",
          borderRadius: 18,
          overflow: "hidden",
        }}>
          <div style={{ maxWidth:1060, margin:"0 auto", padding:"28px 32px 36px" }}>

            {/* ABOUT label inside box */}
            <p className="section-label" style={{ marginBottom:18 }}>About</p>

            {/* ── BULLET POINTS — bigger font ── */}
            <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:28 }}>
              {ABOUT_POINTS.map((text, i) => (
                <div key={i} style={{
                  display:"flex", gap:14, alignItems:"flex-start",
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(8px)",
                  transition:`opacity 0.45s var(--expo-out) ${0.08*i+0.1}s, transform 0.45s var(--expo-out) ${0.08*i+0.1}s`,
                }}>
                  <span style={{
                    flexShrink:0, marginTop:9,
                    width:6, height:6, borderRadius:"50%",
                    background:["#a78bfa","#60a5fa","#4ade80","#fb923c"][i],
                    boxShadow:`0 0 10px ${["rgba(167,139,250,0.7)","rgba(96,165,250,0.7)","rgba(74,222,128,0.7)","rgba(251,146,60,0.7)"][i]}`,
                  }} />
                  <p style={{
                    fontSize: 15.5,
                    color:"#b4b4be",
                    lineHeight: 1.85,
                    margin: 0,
                    fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text','Helvetica Neue',sans-serif",
                    fontWeight: 400,
                    letterSpacing: "-0.01em",
                  }}>{text}</p>
                </div>
              ))}
            </div>

            {/* ── 3 STAT BOXES — smaller/compact ── */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:24 }}>
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    padding:"16px 12px",
                    background:"#0d0d0f",
                    border:"1px solid #27272a",
                    borderRadius:10,
                    transition:"border-color 0.2s, transform 0.2s",
                    cursor:"default",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(10px)",
                    transitionDelay:`${0.15+i*0.07}s`,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = s.color + "55";
                    el.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "#27272a";
                    el.style.transform = "none";
                  }}
                >
                  <span style={{
                    fontSize:24, fontWeight:700, letterSpacing:"-0.04em",
                    color:s.color, fontFamily:"'Geist Mono',monospace",
                    textShadow:`0 0 20px ${s.color}44`,
                  }}>{s.num}</span>
                  <span style={{
                    fontSize:11, color:"#52525b", marginTop:4, textAlign:"center", lineHeight:1.4,
                    fontFamily:"-apple-system,BlinkMacSystemFont,'SF Pro Text',sans-serif",
                    fontWeight:500,
                  }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* ── GITHUB + LEETCODE ── */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
              <div style={{
                padding:"18px 16px",
                background:"#0d0d0f",
                border:"1px solid #27272a",
                borderRadius:10,
              }}>
                <GitHubGraph username="IndreshThakur" />
              </div>
              <div style={{
                padding:"18px 16px",
                background:"#0d0d0f",
                border:"1px solid #27272a",
                borderRadius:10,
              }}>
                <LeetCodeStats username="IThakur09" />
              </div>
            </div>

          </div>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}