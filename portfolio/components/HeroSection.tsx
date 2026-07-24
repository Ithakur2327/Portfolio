"use client";
import { useEffect, useState } from "react";
import { Avatar } from "./Avatar";
import { DotField } from "./DotBackground";
import { useTheme } from "./ThemeProvider";
import { usePdfModal } from "./PdfViewerModal";
import { HeroActionButtons } from "./HeroActionButtons";
import { SocialRow } from "./ui/SocialRow";

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
    <span key={idx} className={`fs-${anim} subtitle-shine`} style={{
      display:"block", fontFamily:"'Geist Mono',monospace",
      fontSize:13.5, lineHeight:1,
    }}>{SENTENCES[idx]}</span>
  );
}

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

function IBox({color, children}:{color?:string; children:React.ReactNode}) {
  return (
    <div style={{
      width:32, height:32, borderRadius:8,
      background: color ? `${color}18` : "var(--bg-secondary)",
      border:`1px solid ${color ? `${color}40` : "var(--border)"}`,
      display:"flex", alignItems:"center", justifyContent:"center",
      color: color ?? "var(--text-muted)", flexShrink:0,
    }}>{children}</div>
  );
}

function Row({icon, href, newTab, onClick, children}:{icon:React.ReactNode; href?:string; newTab?:boolean; onClick?:()=>void; children:React.ReactNode}) {
  const s:React.CSSProperties = {
    display:"flex", alignItems:"center", gap:14,
    fontFamily:"'Geist Mono',monospace", fontSize:14,
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

/* ── Verified badge — matches the reference portfolio's blue checkmark ── */
function VerifiedBadge({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="#2db6f0"
      aria-label="Verified"
      role="img"
    >
      <path d="M15.616 3.268L12 .186L8.383 3.268l-4.737.378l-.378 4.737L.186 12l3.082 3.617l.378 4.737l4.737.378l3.616 3.082l3.617-3.082l4.737-.378l.378-4.737L23.813 12l-3.082-3.617l-.378-4.737zM11 16.414L6.585 12L8 10.586l3 3l5.5-5.5L17.914 9.5z" />
    </svg>
  );
}

function HoverBorderGradient({ children, radius = 10 }: { children: React.ReactNode; radius?: number }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const bright = isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.32)";
  const dim    = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)";

  return (
    <div className="hbg-wrap" style={{ position: "relative", borderRadius: radius }}>
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
          border-radius: ${radius}px;
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
        position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", borderRadius: radius,
        border: isDark ? "1px solid rgba(255,255,255,0.10)" : "1px solid rgba(0,0,0,0.08)",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}

// Width is controlled from ONE place: the --content-width variable in
// globals.css. --content-width-inset (defined there as content-width - 32px)
// is what lines the hero border up with the rest of the page content, since
// .page-wrapper already eats 16px of padding on each side.
const CW = "var(--content-width-inset)";

export function HeroSection({ avatarVersion }: { avatarVersion?: string } = {}) {
  const [vis, setVis] = useState<"ssr" | "visible">("ssr");
  const { openPdf } = usePdfModal();

  useEffect(() => { setTimeout(() => setVis("visible"), 50); }, []);

  const BG = "var(--bg-base)";
  const B  = "1px solid var(--border)";

  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes fsIn  { from{transform:translateY(7px);opacity:0} to{transform:none;opacity:1} }
        @keyframes fsOut { from{transform:none;opacity:1} to{transform:translateY(-7px);opacity:0} }
        .fs-in  { animation: fsIn  0.28s cubic-bezier(0.16,1,0.3,1) forwards }
        .fs-out { animation: fsOut 0.22s ease-in forwards }

        /* Subtitle — right-to-left shine sweep, fired once per flip so it
           starts the instant the new text flips in (reuses the site's
           existing global @keyframes shimmer, just played once and reversed) */
        .subtitle-shine {
          background: linear-gradient(
            100deg,
            var(--text-muted) 32%,
            var(--text-secondary) 44%,
            var(--text-primary) 50%,
            var(--text-secondary) 56%,
            var(--text-muted) 68%
          );
          background-size: 220% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-weight: 600;
          animation-name: fsIn, shimmer;
          animation-duration: 0.28s, 0.9s;
          animation-timing-function: cubic-bezier(0.16,1,0.3,1), linear;
          animation-iteration-count: 1, 1;
          animation-fill-mode: forwards, forwards;
          animation-direction: normal, reverse;
        }
        .fs-out.subtitle-shine {
          animation-name: fsOut, shimmer;
          animation-duration: 0.22s, 0.9s;
          animation-timing-function: ease-in, linear;
          animation-iteration-count: 1, 1;
          animation-fill-mode: forwards, forwards;
          animation-direction: normal, reverse;
        }
        @media (prefers-reduced-motion: reduce) {
          .subtitle-shine { animation: none; }
        }

        .h-profile {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          overflow: hidden; /* clips the nameblock's bottom-right corner into the curve below */
        }

        .h-avatar {
          width: 198px;
          min-width: 198px;
          height: 188px;
          min-height: 188px;
          flex-shrink: 0;
          border-right: 1px solid var(--border);
          overflow: hidden;
          padding: 0;
          display: flex;
          align-items: flex-start;
          justify-content: stretch;
          border-radius: 26px;
          background: var(--bg-base);
        }
        .h-nameblock {
          flex: 1; display: flex; flex-direction: column;
          justify-content: flex-end; min-width: 0;
        }

        /* Name row — name + verified badge */
        .h-name-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .h-verified-badge {
          width: 26px;
          height: 26px;
          flex-shrink: 0;
          cursor: default;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .h-verified-badge:hover { transform: rotate(360deg); }

        .h-info-wrap {
          max-width: ${CW};
          margin-left: auto;
          margin-right: auto;
        }

        .h-info-pad {
          position: relative; /* anchors the vertical partition line below */
        }
        .h-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 44px;
          position: relative;
        }
        .h-info-pad::before {
          content: "";
          position: absolute;
          top: 0; bottom: 0; left: 50%;
          transform: translateX(-50%);
          border-left: 1px dashed var(--border);
          pointer-events: none;
        }
        .h-grid-right { padding-left: 6px; }

        .h-social {
          display: flex;
          flex-direction: row;
          padding: 14px 22px;
        }

        /* Resume / Get in touch row — lives inside the info box now */
        .h-info-actions {
          margin-top: 16px;
        }

        @media (min-width: 600px) and (max-width: 1180px) {
          .h-avatar {
            width: clamp(220px, 32vw, 300px) !important;
            min-width: clamp(220px, 32vw, 300px) !important;
            height: calc(clamp(220px, 32vw, 300px) - 14px) !important;
            min-height: calc(clamp(220px, 32vw, 300px) - 14px) !important;
            border-radius: 28px !important;
          }
          .h-nameblock h1 {
            font-size: clamp(36px, 6vw, 64px) !important;
            font-weight: 800 !important;
            line-height: 1 !important;
            letter-spacing: 0.02em !important;
          }
          .h-name-row { gap: 14px !important; }
          .h-verified-badge { width: 40px !important; height: 40px !important; }
          .h-nameblock {
            padding: 0 8px !important;
          }
          .h-nameblock > div:nth-child(2) {
            padding-top: 26px !important;
            margin-bottom: -4px !important;
          }
          .h-nameblock .fs-in,
          .h-nameblock .fs-out {
            font-size: 16px !important;
          }
          .h-info-wrap {
            margin-left: 24px !important;
            margin-right: 24px !important;
          }
          .h-info-pad {
            padding: 20px 28px 18px !important;
          }
          .h-grid {
            gap: 14px 60px !important;
          }
          .h-info-pad .h-grid > div > div > div:first-child,
          .h-info-pad .h-grid > div > a > div:first-child {
            width: 36px !important; height: 36px !important;
            border-radius: 9px !important;
          }
          .h-info-pad .h-grid > div > div,
          .h-info-pad .h-grid > div > a {
            font-size: 15px !important;
            gap: 16px !important;
          }
          .h-social { padding: 16px 26px !important; }
          .h-profile {
            min-height: clamp(220px, 32vw, 300px) !important;
          }
        }

        @media (min-width: 1024px) and (max-width: 1180px) {
          .h-avatar {
            width: clamp(260px, 28vw, 300px) !important;
            min-width: clamp(260px, 28vw, 300px) !important;
            height: calc(clamp(260px, 28vw, 300px) - 14px) !important;
            min-height: calc(clamp(260px, 28vw, 300px) - 14px) !important;
          }
          .h-nameblock h1 {
            font-size: clamp(40px, 5vw, 72px) !important;
            font-weight: 800 !important;
            line-height: 1 !important;
          }
          .h-verified-badge { width: 46px !important; height: 46px !important; }
          .h-name-row { gap: 16px !important; }
          .h-nameblock > div:nth-child(2) {
            margin-bottom: -4px !important;
          }
          .h-info-pad {
            padding: 22px 32px 20px !important;
          }
        }

        @media (max-width: 600px) {
          .h-profile { flex-direction: row !important; }

          .h-avatar {
            width: clamp(125px, 34vw, 165px) !important;
            min-width: clamp(125px, 34vw, 165px) !important;
            height: calc(clamp(125px, 34vw, 165px) - 8px) !important;
            min-height: calc(clamp(125px, 34vw, 165px) - 8px) !important;
            border-right: 1px solid var(--border) !important;
            border-bottom: none !important;
            overflow: hidden !important;
            padding: 0 !important;
            border-radius: 18px !important;
          }
          .h-nameblock {
            flex: 1 !important;
            min-width: 0 !important;
            overflow: hidden !important;
          }

          .h-nameblock > div:nth-child(2) {
            padding: clamp(18px, 5.5vw, 26px) clamp(10px, 3.5vw, 16px) 0 !important;
            margin-bottom: -2px !important;
          }
          .h-nameblock h1 {
            font-size: clamp(21px, 7.4vw, 29px) !important;
            font-weight: 800 !important;
            letter-spacing: 0.015em !important;
            line-height: 1 !important;
            white-space: nowrap !important;
          }
          .h-verified-badge { width: 22px !important; height: 22px !important; }
          .h-name-row { gap: 6px !important; }
          .h-nameblock > div:nth-child(4) {
            padding: clamp(5px, 1.8vw, 8px) clamp(10px, 3.5vw, 16px) clamp(8px, 2.6vw, 12px) !important;
          }
          .h-nameblock .fs-in,
          .h-nameblock .fs-out {
            font-size: clamp(10.5px, 3vw, 12.5px) !important;
          }

          .h-info-pad {
            padding: 14px 16px 12px !important;
          }
          .h-grid {
            grid-template-columns: 1fr !important;
            gap: 8px 0 !important;
          }
          .h-info-pad::before { display: none !important; }
          .h-grid-right { padding-left: 0 !important; }
          .h-social { justify-content: center !important; padding: 14px 16px !important; }
          .hero-actions { justify-content: center !important; }
          .hero-liquid-btn, .hero-contact-btn { flex: 1 1 auto; justify-content: center; }
        }

        @media (max-width: 380px) {
          .h-avatar {
            width: clamp(105px, 30vw, 135px) !important;
            min-width: clamp(105px, 30vw, 135px) !important;
            height: calc(clamp(105px, 30vw, 135px) - 6px) !important;
            min-height: calc(clamp(105px, 30vw, 135px) - 6px) !important;
            border-radius: 16px !important;
          }
          .h-nameblock h1 {
            font-size: clamp(20px, 7vw, 24px) !important;
            font-weight: 800 !important;
            letter-spacing: 0.015em !important;
            line-height: 1 !important;
          }
          .h-verified-badge { width: 20px !important; height: 20px !important; }
          .h-name-row { gap: 5px !important; }
          .h-nameblock > div:nth-child(2) {
            margin-bottom: -2px !important;
          }
        }

        @media (max-width: 600px) {
          .h-info-wrap {
            border-left: none !important;
            border-right: none !important;
            margin-left: 12px !important;
            margin-right: 12px !important;
          }
          .hbg-wrap, .h-info-box {
            border-radius: 8px !important;
          }
        }
      `}</style>

      <section id="home"
        className={vis === "ssr" ? "" : "reveal visible"}
      >
        <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw" }}>
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            <DotField />
          </div>
          <div style={{ position: "relative", zIndex: 1 }}>

        <div style={{
          position:"relative", left:"50%", marginLeft:"-50vw", width:"100vw",
          background:BG, borderTop:B,
        }}>
          <div className="h-profile" style={{maxWidth:CW, margin:"0 auto", borderLeft:B, borderRight:B, borderBottom:B, borderTop:"none", borderRadius:8.5}}>

            <div className="h-avatar">
              <div style={{width:"100%", aspectRatio:"1 / 1", flexShrink:0}}>
                <Avatar version={avatarVersion} />
              </div>
            </div>

            <div className="h-nameblock">
              <div style={{flex:1}}/>
              <div className="h-name-row" style={{padding:"28px 20px 0", marginBottom:"-3px"}}>
                <h1 style={{
                  fontSize:"clamp(24px,3.8vw,36px)", fontWeight:900,
                  letterSpacing:"0.02em", color:"var(--text-primary)",
                  lineHeight:1, margin:0,
                  fontFamily:"'Geist Pixel Square','Geist Mono',monospace", display:"inline-block",
                  WebkitFontSmoothing:"antialiased", MozOsxFontSmoothing:"grayscale",
                  textRendering:"optimizeLegibility",
                }}>Indresh Thakur</h1>
                <VerifiedBadge className="h-verified-badge" />
              </div>
              {/* Line at full nameblock width — connects left partition to right border */}
              <div style={{height:1, background:"var(--border)", width:"100%"}}/>
              <div style={{padding:"8px 20px 12px", height:36, display:"flex", alignItems:"center", overflow:"hidden"}}>
                <FlipSentences/>
              </div>
            </div>
          </div>
        </div>

        <div style={{height:22, maxWidth:CW, margin:"0 auto"}}/>

        <div style={{height:22, maxWidth:CW, margin:"0 auto"}}/>

        {/* ── INFO + SOCIAL ── */}
        <div className="h-info-wrap">
          <HoverBorderGradient>
            <div className="h-info-box" style={{background:BG, border:B, borderRadius:8.5, overflow:"hidden"}}>

              <div className="h-info-pad" style={{padding:"18px 22px 16px"}}>
                <div className="h-grid">

                  {/* LEFT */}
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    <Row icon={<IBox color="#38bdf8"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 16 22 12 18 8"/><polyline points="6 8 2 12 6 16"/><line x1="14" y1="4" x2="10" y2="20"/></svg></IBox>}>
                      AI Software Engineer
                    </Row>
                    <Row href="https://maps.google.com/?q=Greater+Noida+India" newTab
                      icon={<IBox color="#f87171"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></IBox>}>
                      Noida, India
                    </Row>
                    <Row href="tel:+917859096326"
                      icon={<IBox color="#4ade80"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></IBox>}>
                      +91 7859096326
                    </Row>
                  </div>

                  {/* RIGHT */}
                  <div className="h-grid-right" style={{display:"flex",flexDirection:"column",gap:10}}>
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

                {/* ── Resume / Get in touch — inside the info box ── */}
                <div className="h-info-actions">
                  <HeroActionButtons
                    onResumeClick={() => openPdf("/resume.pdf", "Resume", "/resume.pdf")}
                    contactHref="/contact"
                  />
                </div>
              </div>

              {/* ── Social row — identical icons + tooltip everywhere on the site ── */}
              <div className="h-social" style={{borderTop:B}}>
                <SocialRow size={23} gap={20} />
              </div>
            </div>
          </HoverBorderGradient>
        </div>

        <div style={{ height: 38, maxWidth: CW, margin: "0 auto" }} />

          </div>
        </div>
      </section>
    </>
  );
}