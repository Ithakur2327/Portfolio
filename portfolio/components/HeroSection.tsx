"use client";
import { useEffect, useState, useRef } from "react";
import { Avatar } from "./Avatar";
import { useTheme } from "./ThemeProvider";
import { usePdfModal } from "./PdfViewerModal";

/* ─── Flip sentences ─────────────────────────────────── */
const SENTENCES = [
  "AI Software Engineer",
  "Open Source Contributor",
  "Competitive Programmer",
  "Code · Create · Innovate",
];

function FlipSentences() {
  const [idx, setIdx] = useState(0);
  const [anim, setAnim] = useState<"in"|"out">("in");
  useEffect(() => {
    const t = setInterval(() => {
      setAnim("out");
      setTimeout(() => { setIdx(i => (i+1)%SENTENCES.length); setAnim("in"); }, 280);
    }, 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <span key={idx} className={`fs-${anim}`} style={{
      display:"block", fontFamily:"'Geist Mono',monospace",
      fontSize:13, color:"var(--text-muted)", lineHeight:1,
    }}>{SENTENCES[idx]}</span>
  );
}

/* ─── Live clock ─────────────────────────────────────── */
function LiveClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => setTime(
      new Date().toLocaleTimeString("en-IN",{
        timeZone:"Asia/Kolkata", hour:"2-digit", minute:"2-digit", hour12:true,
      }).toUpperCase()+" IST"
    );
    update(); const id = setInterval(update, 30000); return () => clearInterval(id);
  },[]);
  return <span style={{fontFamily:"'Geist Mono',monospace"}}>{time||"--:-- IST"}</span>;
}

/* ─── Icon box ───────────────────────────────────────── */
function IBox({color, children}:{color?:string; children:React.ReactNode}) {
  return (
    <div style={{
      width:28, height:28, borderRadius:7,
      background: color ? `${color}18` : "var(--bg-secondary)",
      border:`1px solid ${color ? `${color}40` : "var(--border)"}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      color: color ?? "var(--text-muted)", flexShrink:0,
    }}>{children}</div>
  );
}

/* ─── Row ────────────────────────────────────────────── */
function Row({icon, href, newTab, onClick, children}:{icon:React.ReactNode; href?:string; newTab?:boolean; onClick?:()=>void; children:React.ReactNode}) {
  const s:React.CSSProperties = {
    display:"flex", alignItems:"center", gap:13,
    fontFamily:"'Geist Mono',monospace", fontSize:13,
    color:"var(--text-primary)", textDecoration:"none",
  };
  if (onClick) return (
    <button type="button" onClick={onClick}
      className="hero-link-hover"
      style={{...s, cursor:"pointer", transition:"opacity 0.15s", background:"none", border:"none", padding:0, font:"inherit", textAlign:"left", width:"100%"}}
    >{icon}<span style={{borderBottom:"1px solid rgba(128,128,128,0.2)"}}>{children}</span></button>
  );
  if (href) return (
    <a href={href} target={newTab?"_blank":undefined} rel="noreferrer"
      className="hero-link-hover"
      style={{...s, cursor:"pointer", transition:"opacity 0.15s"}}
    >{icon}<span style={{borderBottom:"1px solid rgba(128,128,128,0.2)"}}>{children}</span></a>
  );
  return <div style={{...s}}>{icon}<span>{children}</span></div>;
}

/* ─── Social icon tile ───────────────────────────────── */
function SocialIconTile({href,label,icon,iconBg,iconBorder,iconColor}:{href:string;label:string;icon:React.ReactNode;iconBg:string;iconBorder:string;iconColor:string}) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href} target="_blank" rel="noreferrer"
      className="s-icon-tile"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:"flex", alignItems:"center", justifyContent:"center",
        gap: hovered ? 8 : 0,
        padding: hovered ? "14px 18px" : "14px 16px",
        background: hovered ? "var(--bg-secondary)" : "var(--bg-base)",
        color:"var(--text-primary)",
        textDecoration:"none", position:"relative",
        transition:"background 0.18s, padding 0.2s cubic-bezier(0.16,1,0.3,1), gap 0.2s cubic-bezier(0.16,1,0.3,1)",
        overflow:"hidden", minWidth: hovered ? 0 : "auto",
        cursor:"pointer",
      }}
    >
      <div style={{
        width:32,height:32,borderRadius:8,
        background:iconBg,border:iconBorder,
        display:"flex",alignItems:"center",justifyContent:"center",
        color:iconColor,flexShrink:0,
        transform: hovered ? "scale(1.12)" : "scale(1)",
        transition:"transform 0.18s cubic-bezier(0.16,1,0.3,1)",
      }}>{icon}</div>
      <span style={{
        fontWeight:600,fontSize:13.5,fontFamily:"'Geist',sans-serif",
        maxWidth: hovered ? 80 : 0,
        opacity: hovered ? 1 : 0,
        overflow:"hidden",
        whiteSpace:"nowrap",
        transition:"max-width 0.22s cubic-bezier(0.16,1,0.3,1), opacity 0.18s",
      }}>{label}</span>
    </a>
  );
}

/* ─── Spotify-style Player ───────────────────────────── */
function SpotifyPlayer() {
  // ── ADD YOUR YOUTUBE LINKS HERE ──────────────────────
  const PLAYLIST = [
    "https://www.youtube.com/watch?v=jVVwYXV22zg&list=RDjVVwYXV22zg&start_radio=1",
    "https://www.youtube.com/watch?v=cl0a3i2wFcc&list=RDcl0a3i2wFcc&start_radio=1",
    
    "https://www.youtube.com/watch?v=tlkb3cLfaOQ&list=RDtlkb3cLfaOQ&start_radio=1",
    // "https://www.youtube.com/watch?v=ANOTHER_ID",
  ];
  // ─────────────────────────────────────────────────────

  const [trackIdx, setTrackIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [songTitle, setSongTitle] = useState("Loading...");
  const [artistName, setArtistName] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const currentUrl = PLAYLIST[trackIdx] ?? "";
  const currentId = (() => {
    const m = currentUrl.match(/(?:v=|youtu\.be\/|embed\/)([a-zA-Z0-9_-]{11})/);
    return m ? m[1] : "";
  })();
  const isMulti = PLAYLIST.length > 1;

  // Cache fetched song metadata per URL to avoid repeated network calls
  const titleCacheRef = useRef<Map<string, { title: string; artist: string }>>(new Map());

  useEffect(() => {
    if (!currentUrl) return;

    // Check cache first
    const cached = titleCacheRef.current.get(currentUrl);
    if (cached) {
      setSongTitle(cached.title);
      setArtistName(cached.artist);
      return;
    }

    setSongTitle("Loading..."); setArtistName("");
    fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(currentUrl)}&format=json`)
      .then(r => r.json())
      .then(d => {
        const rawTitle:  string = d.title      ?? "";
        const rawAuthor: string = (d.author_name ?? "")
          .replace(/\s*-\s*Topic$/i, "").trim();

        // Strip noise from title
        const cleaned = rawTitle
          .replace(/\s*[|•·]\s*.*/g, "")
          .replace(/\(.*?\)/g, "").replace(/\[.*?\]/g, "")
          .replace(/\s*(ft\.|feat\.|official|video|audio|lyric|lyrics|full|hd|4k|new|latest|song|songs|punjabi|hindi|music)\b.*/gi, "")
          .replace(/\b(19|20)\d{2}\b/g, "")
          .replace(/\s{2,}/g, " ").trim();

        let finalTitle = "";
        let finalArtist = "";

        // 1️⃣ Dash in title → most reliable split
        const dashParts = cleaned.split(/\s*-\s+/);
        if (dashParts.length >= 2) {
          finalArtist = dashParts[0].trim();
          finalTitle = dashParts.slice(1).join(" - ").trim();
        } else {
          // 2️⃣ author_name looks like a real artist (not a label/channel)?
          const isLabel = /records|music|entertainment|productions|studios|worldwide|official|media|films|vevo|channel|tv\b/i
            .test(rawAuthor);
          if (rawAuthor && !isLabel) {
            finalArtist = rawAuthor;
            finalTitle = cleaned || rawTitle;
          } else {
            // 3️⃣ Fallback: last 2 words of title = artist, rest = song
            const words = cleaned.split(/\s+/).filter(Boolean);
            if (words.length >= 3) {
              finalArtist = words.slice(-2).join(" ");
              finalTitle = words.slice(0, -2).join(" ");
            } else {
              finalArtist = "";
              finalTitle = cleaned || rawTitle;
            }
          }
        }

        // Store in cache
        titleCacheRef.current.set(currentUrl, { title: finalTitle, artist: finalArtist });
        setArtistName(finalArtist);
        setSongTitle(finalTitle);
      })
      .catch(() => {
        const fallback = { title: "Unknown", artist: "" };
        titleCacheRef.current.set(currentUrl, fallback);
        setSongTitle(fallback.title);
      });
  }, [currentUrl]);

  const ytMsg = (cmd: object) => {
    iframeRef.current?.contentWindow?.postMessage(JSON.stringify(cmd), "*");
  };

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (playing) {
      ytMsg({ event: "command", func: "pauseVideo" });
      setPlaying(false);
    } else {
      ytMsg({ event: "command", func: "playVideo" });
      setPlaying(true);
    }
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTrackIdx(i => (i + 1) % PLAYLIST.length);
    setPlaying(true);
  };

  // Resume playback when tab becomes visible again
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === "visible" && playing) {
        setTimeout(() => ytMsg({ event: "command", func: "playVideo" }), 300);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [playing]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.info?.playerState === 0) {
          if (isMulti) {
            setTrackIdx(i => (i + 1) % PLAYLIST.length);
            setPlaying(true);
          } else {
            setTimeout(() => {
              ytMsg({ event: "command", func: "seekTo", args: [0, true] });
              ytMsg({ event: "command", func: "playVideo" });
            }, 300);
          }
        }
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [trackIdx, isMulti, PLAYLIST.length]);

  useEffect(() => {
    if (playing) {
      const t = setTimeout(() => ytMsg({ event: "command", func: "playVideo" }), 800);
      return () => clearTimeout(t);
    }
    // Intentionally only reacts to track changes — reads the current
    // `playing` flag without re-running every time playback is paused/resumed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIdx]);

  return (
    <div
      className="spotify-tile"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex:1, display:"flex", alignItems:"center", gap:10,
        padding:"0 14px",
        background: hovered ? "var(--bg-secondary)" : "var(--bg-base)",
        position:"relative",
        transition:"background 0.18s",
        minWidth:0, overflow:"hidden",
        cursor:"default",
        height:"100%",
      }}
    >
      {/* Hidden YouTube iframe */}
      {currentId && (
        <iframe
          ref={iframeRef}
          key={currentId}
          src={`https://www.youtube.com/embed/${currentId}?enablejsapi=1&autoplay=0&controls=0`}
          allow="autoplay"
          style={{ display:"none", width:0, height:0, border:"none", position:"absolute" }}
          title="yt-audio"
        />
      )}

      {/* Spotify glass logo */}
      <div style={{
        width:34, height:34, borderRadius:10, flexShrink:0,
        background:"linear-gradient(135deg,rgba(30,215,96,0.22) 0%,rgba(30,215,96,0.06) 100%)",
        border:"1px solid rgba(30,215,96,0.32)",
        backdropFilter:"blur(8px)",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 2px 10px rgba(30,215,96,0.12)",
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="#1ED760">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      </div>

      {/* Text block + play/pause inline */}
      <div style={{display:"flex", alignItems:"center", gap:8, minWidth:0, overflow:"hidden"}}>

        {/* Text column — no flex:1 so button sits right after text */}
        <div style={{minWidth:0, overflow:"hidden"}}>
          {/* Top: EQ bars + song name only */}
          <div style={{display:"flex", alignItems:"center", gap:5}}>
            {playing && (
              <span style={{
                display:"inline-flex", alignItems:"flex-end", gap:1.5,
                height:10, flexShrink:0,
              }}>
                {[0, 0.2, 0.1].map((delay, i) => (
                  <span key={i} style={{
                    display:"inline-block", width:2.5, borderRadius:1,
                    background:"#1ED760",
                    animation:`eq-bar 0.8s ease-in-out ${delay}s infinite alternate`,
                    height:"100%",
                  }}/>
                ))}
              </span>
            )}
            <span style={{
              fontFamily:"'Geist',sans-serif",
              fontSize:12.5, fontWeight:600,
              color:"var(--text-primary)",
              whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis",
              display:"block",
            }}>
              {songTitle}
            </span>
          </div>

          {/* Bottom: Singer name left · Recently Played right */}
          <div style={{
            display:"flex", alignItems:"center", gap:6,
            marginTop:3,
          }}>
            {artistName && (
              <span style={{
                fontSize:10, fontFamily:"'Geist Mono',monospace",
                color:"var(--text-primary)", opacity:0.5,
                fontWeight:500, whiteSpace:"nowrap",
              }}>
                {artistName}
              </span>
            )}
            <span style={{
              fontSize:10, fontFamily:"'Geist Mono',monospace",
              color:"var(--text-primary)", opacity:0.28,
              fontWeight:500, whiteSpace:"nowrap",
            }}>
              Recently Played
            </span>
          </div>
        </div>

        {/* Play / Pause — immediately after text */}
        <button onClick={handlePlay} style={{
          width:24, height:24, flexShrink:0,
          background:"none", border:"none", padding:0,
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"#1ED760", cursor:"pointer",
          transition:"transform 0.15s cubic-bezier(0.16,1,0.3,1), opacity 0.15s",
          transform: hovered ? "scale(1.15)" : "scale(1)",
          opacity: hovered ? 1 : 0.85,
        }} aria-label={playing ? "Pause" : "Play"}>
          {playing ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" rx="1"/>
              <rect x="14" y="4" width="4" height="16" rx="1"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
        </button>

      </div>

      {/* Skip — only when playlist > 1 */}
      {isMulti && (
        <button onClick={handleSkip} style={{
          width:26, height:26, borderRadius:"50%",
          background:"transparent", border:"1px solid var(--border)",
          display:"flex", alignItems:"center", justifyContent:"center",
          color:"var(--text-muted)", flexShrink:0, cursor:"pointer",
          transition:"border-color 0.15s, color 0.15s",
        }} aria-label="Next track">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 15,12 5,21"/>
            <rect x="17" y="3" width="3" height="18" rx="1"/>
          </svg>
        </button>
      )}

    </div>
  );
}

/* ─── HoverBorderGradient ─────────────────────────────── */
function HoverBorderGradient({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bright = isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.32)";
  const dim    = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)";

  return (
    <div style={{ position: "relative" }}>
      <style suppressHydrationWarning>{`
        @keyframes hbg-spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to   { transform: translate(-50%,-50%) rotate(360deg); }
        }
        .hbg-outer {
          position: absolute;
          inset: -1px;
          overflow: hidden;
          z-index: 0;
          pointer-events: none;
        }
        .hbg-rotor {
          position: absolute;
          top: 50%; left: 50%;
          width: 250%; height: 250%;
          animation: hbg-spin 10s linear infinite;
          background: conic-gradient(
            from 0deg,
            transparent    0deg,
            transparent    55deg,
            ${dim}         85deg,
            ${bright}      110deg,
            ${dim}         140deg,
            transparent    170deg,
            transparent    360deg
          );
        }
        @media (prefers-reduced-motion: reduce) {
          .hbg-rotor { animation: none; }
        }
      `}</style>

      {/* Clipping wrapper + spinning gradient */}
      <div className="hbg-outer">
        <div className="hbg-rotor" />
      </div>

      {/* Static hairline border on top */}
      <div aria-hidden style={{
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
        border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.08)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN HERO
═══════════════════════════════════════════════════════ */
const CW = 1060;

export function HeroSection() {
  const [vis, setVis] = useState<"ssr" | "visible">("ssr");
  const { openPdf } = usePdfModal();
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [lineW, setLineW] = useState(180);

  useEffect(() => { setTimeout(() => setVis("visible"), 50); }, []);
  useEffect(() => {
    const upd = () => { if (nameRef.current) setLineW(nameRef.current.offsetWidth); };
    upd(); window.addEventListener("resize", upd);
    return () => window.removeEventListener("resize", upd);
  }, []);

  const BG = "var(--bg-base)";
  const B  = "1px solid var(--border)";

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes fsIn  { from{transform:translateY(7px);opacity:0} to{transform:none;opacity:1} }
        @keyframes fsOut { from{transform:none;opacity:1} to{transform:translateY(-7px);opacity:0} }
        .fs-in  { animation: fsIn  0.28s cubic-bezier(0.16,1,0.3,1) forwards }
        .fs-out { animation: fsOut 0.22s ease-in forwards }

        @keyframes eq-bar {
          from { transform: scaleY(0.2); }
          to   { transform: scaleY(1);   }
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.5; transform:scale(1.4); }
        }

        /* ── Profile row ── */
        .h-profile {
          display: flex;
          flex-direction: row;
          align-items: stretch;
        }

        /* Avatar box */
        .h-avatar {
          width: 162px;
          min-width: 162px;
          height: 162px;
          min-height: 162px;
          flex-shrink: 0;
          border-right: 1px solid var(--border);
          overflow: hidden;
          padding: 0;
          display: flex;
          align-items: stretch;
          justify-content: stretch;
        }
        .h-nameblock {
          flex: 1; display: flex; flex-direction: column;
          justify-content: flex-end; min-width: 0;
        }

        /* ── Info wrap (centering) ── */
        .h-info-wrap {
          max-width: 1060px;
          margin-left: auto;
          margin-right: auto;
        }

        /* ── Info grid ── */
        .h-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 11px 48px;
        }

        /* ── Social row ── */
        .h-social { display: flex; flex-direction: row; }

        /* Social icon tiles */
        .s-icon-tile {
          border-right: 1px solid var(--border);
        }
        .s-icon-tile:last-child { border-right: none !important; }

        /* Spotify tile */
        .spotify-tile {
          border-left: 1px solid var(--border);
        }

        /* Social left group */
        .s-social-group {
          display: flex;
          flex-direction: row;
          flex: 0 0 auto;
        }

        /* Social partition */
        .s-partition {
          width: 1px;
          background: var(--border);
          flex-shrink: 0;
          align-self: stretch;
        }

        /* Spotify wrapper */
        .s-spotify-wrap {
          flex: 1;
          min-width: 0;
          display: flex;
        }

        /* ── iPad / Tablet (768px–1180px) ── */
        @media (min-width: 768px) and (max-width: 1180px) {
          /* Avatar — much bigger on tablets */
          .h-avatar {
            width: clamp(220px, 32vw, 300px) !important;
            min-width: clamp(220px, 32vw, 300px) !important;
            height: clamp(220px, 32vw, 300px) !important;
            min-height: clamp(220px, 32vw, 300px) !important;
          }
          /* Name bigger */
          .h-nameblock h1 {
            font-size: clamp(32px, 5.5vw, 52px) !important;
            letter-spacing: -0.05em !important;
          }
          .h-nameblock {
            padding: 0 8px !important;
          }
          /* Flip sentence bigger */
          .h-nameblock .fs-in,
          .h-nameblock .fs-out {
            font-size: 16px !important;
          }
          /* Info wrap full width with tablet padding */
          .h-info-wrap {
            margin-left: 24px !important;
            margin-right: 24px !important;
          }
          /* Info pad more spacious */
          .h-info-pad {
            padding: 28px 36px 24px !important;
          }
          /* Grid gap bigger */
          .h-grid {
            gap: 20px 80px !important;
          }
          /* Icon boxes bigger */
          .h-info-pad .h-grid > div > div > div:first-child,
          .h-info-pad .h-grid > div > a > div:first-child {
            width: 36px !important; height: 36px !important;
            border-radius: 9px !important;
          }
          /* Row text bigger */
          .h-info-pad .h-grid > div > div,
          .h-info-pad .h-grid > div > a {
            font-size: 15px !important;
            gap: 16px !important;
          }
          /* Spotify + social bigger */
          .spotify-tile {
            padding: 0 24px !important;
          }
          .s-icon-tile {
            padding: 18px 24px !important;
          }
          /* Social icon tiles bigger icons */
          .s-icon-tile > div {
            width: 38px !important; height: 38px !important;
          }
          /* Profile row profile section taller */
          .h-profile {
            min-height: clamp(220px, 32vw, 300px) !important;
          }
        }

        /* ── iPad Pro / large tablet (1024px–1180px) ── */
        @media (min-width: 1024px) and (max-width: 1180px) {
          .h-avatar {
            width: clamp(260px, 28vw, 300px) !important;
            min-width: clamp(260px, 28vw, 300px) !important;
            height: clamp(260px, 28vw, 300px) !important;
            min-height: clamp(260px, 28vw, 300px) !important;
          }
          .h-nameblock h1 {
            font-size: clamp(38px, 5vw, 52px) !important;
          }
          .h-info-pad {
            padding: 32px 44px 28px !important;
          }
        }

        /* ── Samsung Fold unfolded (600px–768px) ── */
        @media (min-width: 600px) and (max-width: 767px) {
          .h-avatar {
            width: clamp(160px, 26vw, 200px) !important;
            min-width: clamp(160px, 26vw, 200px) !important;
            height: clamp(160px, 26vw, 200px) !important;
            min-height: clamp(160px, 26vw, 200px) !important;
          }
          .h-nameblock h1 {
            font-size: clamp(24px, 4vw, 32px) !important;
          }
          .h-info-wrap {
            margin-left: 20px !important;
            margin-right: 20px !important;
          }
          .h-info-pad {
            padding: 20px 24px 18px !important;
          }
          .h-grid {
            gap: 14px 40px !important;
          }
          .h-info-pad .h-grid > div > div,
          .h-info-pad .h-grid > div > a {
            font-size: 13.5px !important;
          }
          .spotify-tile {
            padding: 0 16px !important;
          }
          .s-icon-tile {
            padding: 14px 18px !important;
          }
        }

        @media (max-width: 600px) {
          .h-profile { flex-direction: row !important; }
          .h-avatar {
            width: clamp(100px, 28vw, 148px) !important;
            min-width: clamp(100px, 28vw, 148px) !important;
            height: clamp(100px, 28vw, 148px) !important;
            min-height: clamp(100px, 28vw, 148px) !important;
            border-right: 1px solid var(--border) !important;
            border-bottom: none !important;
            overflow: hidden !important;
            padding: 0 !important;
          }
          .h-nameblock {
            flex: 1 !important;
            min-width: 0 !important;
            overflow: hidden !important;
          }
          .h-grid {
            grid-template-columns: 1fr !important;
            gap: 11px 0 !important;
          }
          .h-spacer { display: none !important; }
          .h-social { flex-direction: column !important; }
          .s-social-group {
            border-bottom: none !important;
            flex-direction: row !important;
          }
          .s-partition { display: none !important; }
          .s-icon-tile {
            flex: 1 !important;
            border-right: 1px solid var(--border) !important;
            justify-content: center !important;
          }
          .s-icon-tile:last-child { border-right: none !important; }
          .s-spotify-wrap {
            border-top: 1px solid var(--border) !important;
            display: flex !important;
          }
          .spotify-tile {
            border-left: none !important;
            border-top: none !important;
            justify-content: flex-start !important;
            padding-left: calc(33.333vw / 2 - 22px) !important;
            padding-right: 12px !important;
          }
          .h-info-wrap {
            border-left: none !important;
            border-right: none !important;
            margin-left: 12px !important;
            margin-right: 12px !important;
          }
        }

        @media (max-width: 380px) {
          .h-avatar {
            width: clamp(88px, 26vw, 110px) !important;
            min-width: clamp(88px, 26vw, 110px) !important;
            height: clamp(88px, 26vw, 110px) !important;
            min-height: clamp(88px, 26vw, 110px) !important;
          }
        }
      `}</style>

      <section id="about"
        className={vis === "ssr" ? "" : "reveal visible"}
      >

        {/* ── PROFILE ROW ── */}
        <div style={{
          position:"relative", left:"50%", marginLeft:"-50vw", width:"100vw",
          background:BG, borderTop:B, borderBottom:B,
        }}>
          <div className="h-profile" style={{maxWidth:CW, margin:"0 auto", borderLeft:B, borderRight:B}}>

            {/* Avatar */}
            <div className="h-avatar">
              <Avatar />
            </div>

            {/* Name + flip */}
            <div className="h-nameblock">
              <div style={{flex:1}}/>
              <div style={{padding:"10px 20px 0"}}>
                <h1 ref={nameRef} style={{
                  fontSize:"clamp(20px,3.5vw,32px)", fontWeight:700,
                  letterSpacing:"-0.04em", color:"var(--text-primary)",
                  lineHeight:1.15, margin:0,
                  fontFamily:"'Geist',sans-serif", display:"inline-block",
                }}>Indresh Thakur</h1>
                <div style={{height:1, background:"var(--border)", marginTop:8, width:lineW, maxWidth:"100%"}}/>
              </div>
              <div style={{padding:"8px 20px 12px", height:36, display:"flex", alignItems:"center", overflow:"hidden"}}>
                <FlipSentences/>
              </div>
            </div>
          </div>
        </div>

        <div style={{height:38, maxWidth:CW, margin:"0 auto"}}/>

        {/* ── INFO + SOCIAL ── */}
        <div className="h-info-wrap" style={{borderLeft:B, borderRight:B}}>
          <HoverBorderGradient>
            <div style={{background:BG, border:B}}>

              <div className="h-info-pad" style={{padding:"16px 18px 14px"}}>
                <div className="h-grid">

                  {/* LEFT */}
                  <div style={{display:"flex",flexDirection:"column",gap:11}}>
                    <Row href="https://maps.google.com/?q=Greater+Noida+India" newTab
                      icon={<IBox color="#f87171"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></IBox>}>
                      Noida, India
                    </Row>
                    <Row href="tel:+917859096326"
                      icon={<IBox color="#4ade80"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></IBox>}>
                      +91 7859096326
                    </Row>
                    <Row href="mailto:ithakur2327@gmail.com"
                      icon={<IBox color="#60a5fa"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></IBox>}>
                      ithakur2327@gmail.com
                    </Row>
                    <Row onClick={() => openPdf("/resume.png.png", "Resume", "/resume.png.png")}
                      icon={<IBox color="#94a3b8"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg></IBox>}>
                      Resume
                    </Row>
                  </div>

                  {/* RIGHT */}
                  <div style={{display:"flex",flexDirection:"column",gap:11}}>
                    <div className="h-spacer" style={{height:28,flexShrink:0}}/>
                    <Row icon={<IBox color="#fbbf24"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></IBox>}>
                      <LiveClock/>
                    </Row>
                    <Row href="https://ithakur.vercel.app" newTab
                      icon={<IBox color="#a78bfa"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></IBox>}>
                      indreshthakur.dev
                    </Row>
                    <Row icon={<IBox color="#f472b6"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg></IBox>}>
                      he/him
                    </Row>
                  </div>
                </div>
              </div>

              {/* ── Social row ── */}
              <div className="h-social" style={{borderTop:B}}>

                {/* Left: 3 social icon tiles */}
                <div className="s-social-group">
                  <SocialIconTile href="https://github.com/Ithakur2327" label="GitHub"
                    iconBg="var(--bg-secondary)" iconBorder="1px solid var(--border)" iconColor="var(--text-primary)"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>}
                  />
                  <SocialIconTile href="https://www.linkedin.com/in/indresh-thakur" label="LinkedIn"
                    iconBg="#0A66C2" iconBorder="none" iconColor="#fff"
                    icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}
                  />
                  <SocialIconTile href="" label="X / Twitter"
                    iconBg="var(--bg-secondary)" iconBorder="1px solid var(--border)" iconColor="var(--text-primary)"
                    icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.255 5.623zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                  />
                </div>

                {/* Partition */}
                <div className="s-partition"/>

                {/* Right: Spotify player */}
                <div className="s-spotify-wrap">
                  <SpotifyPlayer/>
                </div>

              </div>
            </div>
          </HoverBorderGradient>
        </div>

      </section>
    </>
  );
}