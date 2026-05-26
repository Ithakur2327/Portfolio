"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { Avatar } from "./Avatar";

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
      display:"block",fontFamily:"'Geist Mono',monospace",
      fontSize:13,color:"var(--text-muted)",lineHeight:1,
    }}>{SENTENCES[idx]}</span>
  );
}

function LiveClock() {
  const [time, setTime] = useState("");
  const [diff, setDiff] = useState("");
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-IN",{
        timeZone:"Asia/Kolkata",hour:"2-digit",minute:"2-digit",hour12:true,
      }).toUpperCase()+" IST");
      const d = 330-(-now.getTimezoneOffset());
      if(d===0){setDiff("same time");return;}
      const h=Math.floor(Math.abs(d)/60),m=Math.abs(d)%60;
      setDiff(`${h}${m?`:${String(m).padStart(2,"0")}`:``}h ${d>0?"ahead":"behind"}`);
    };
    update(); const id=setInterval(update,30000); return()=>clearInterval(id);
  },[]);
  return (
    <span style={{fontFamily:"'Geist Mono',monospace"}}>
      {time||"--:-- IST"} 
    </span>
  );
}

function IBox({color,children}:{color?:string;children:React.ReactNode}) {
  return (
    <div style={{
      width:26,height:26,borderRadius:7,
      background:"var(--bg-secondary)",border:"1px solid var(--border)",
      display:"flex",alignItems:"center",justifyContent:"center",
      color:color??"#71717a",flexShrink:0,
    }}>{children}</div>
  );
}

function Row({icon,href,newTab,children}:{icon:React.ReactNode;href?:string;newTab?:boolean;children:React.ReactNode}) {
  const s:React.CSSProperties={display:"flex",alignItems:"center",gap:13,fontFamily:"'Geist Mono',monospace",fontSize:13,color:"var(--text-secondary)",textDecoration:"none"};
  if(href) return (
    <a href={href} target={newTab?"_blank":undefined} rel="noreferrer" style={s}
      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.color="var(--text-primary)"}
      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.color="var(--text-muted)"}
    >{icon}<span>{children}</span></a>
  );
  return <div style={{...s,cursor:"default"}}>{icon}<span>{children}</span></div>;
}

function SocialTile({href,label,icon,iconBg,iconBorder,iconColor,last}:{href:string;label:string;icon:React.ReactNode;iconBg:string;iconBorder:string;iconColor:string;last?:boolean}) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      flex:1,display:"flex",alignItems:"center",gap:10,
      padding:"14px 16px",borderRight:last?"none":"1px solid #27272a",
      background:"var(--bg-base)",color:"var(--text-primary)",textDecoration:"none",position:"relative",
      transition:"background 0.12s",minWidth:0,
    }}
      onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background="var(--bg-secondary)"}
      onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background="var(--bg-base)"}
    >
      <div style={{width:32,height:32,borderRadius:8,background:iconBg,border:iconBorder,display:"flex",alignItems:"center",justifyContent:"center",color:iconColor,flexShrink:0}}>{icon}</div>
      <span style={{fontWeight:600,fontSize:13.5,fontFamily:"'Geist',sans-serif"}}>{label}</span>
      <span style={{position:"absolute",top:11,right:11,color:"var(--text-muted)"}}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
      </span>
    </a>
  );
}

/* ══════════════════════════════════════════════════════
   AVATAR — Canvas-based: real photo + perpetual hair
   wave + hover eye blink. Buttery 120fps feel.
══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════ */
const CW = 1060;

export function HeroSection() {
  const [vis, setVis] = useState(false);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [lineW, setLineW] = useState<number>(180);

  useEffect(() => { setTimeout(() => setVis(true), 50); }, []);
  useEffect(() => { if(nameRef.current) setLineW(nameRef.current.offsetWidth); }, []);

  const BG = "var(--bg-base)";
  const B  = "1px solid var(--border)";
  const centered:React.CSSProperties = { maxWidth:CW, margin:"0 auto", borderLeft:B, borderRight:B };

  return (
    <>
      <style>{`
        @keyframes fsIn  { from{transform:translateY(7px);opacity:0} to{transform:none;opacity:1} }
        @keyframes fsOut { from{transform:none;opacity:1} to{transform:translateY(-7px);opacity:0} }
        .fs-in  { animation: fsIn  0.28s cubic-bezier(0.16,1,0.3,1) forwards }
        .fs-out { animation: fsOut 0.22s ease-in forwards }
        .hero-social { display:flex; }
        @media (max-width:540px) {
          .hero-social { flex-direction:column; }
          .hero-social a { border-right:none !important; border-bottom:1px solid #27272a; }
          .hero-social a:last-child { border-bottom:none; }
          .hero-grid { grid-template-columns:1fr !important; }
        }
      `}</style>

      <section id="about" style={{
        marginTop:72,
        opacity:vis?1:0, transform:vis?"none":"translateY(10px)",
        transition:"opacity 0.5s cubic-bezier(0.16,1,0.3,1),transform 0.5s cubic-bezier(0.16,1,0.3,1)",
      }}>

        {/* PROFILE */}
        <div style={{width:"100%",background:BG,borderTop:B,borderBottom:B}}>
          <div style={{...centered,display:"flex",alignItems:"stretch"}}>
            {/* Avatar box */}
            <div style={{
              borderRight:B, flexShrink:0,
              display:"flex", alignItems:"center", justifyContent:"center",
              padding:0, width:162, minWidth:162,
            }}>
              <Avatar />
            </div>

            <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0,justifyContent:"flex-end"}}>
              <div style={{flex:1}}/>
              <div style={{padding:"10px 20px 0"}}>
                <h1 ref={nameRef} style={{
                  fontSize:"clamp(22px,4vw,32px)",fontWeight:700,
                  letterSpacing:"-0.04em",color:"var(--text-primary)",
                  lineHeight:1.15,margin:0,
                  fontFamily:"'Geist',sans-serif",display:"inline-block",
                }}>Indresh Thakur</h1>
                <div style={{height:1,background:"var(--border)",marginTop:8,width:lineW,maxWidth:"100%"}}/>
              </div>
              <div style={{padding:"8px 20px 12px",height:36,display:"flex",alignItems:"center",overflow:"hidden"}}>
                <FlipSentences/>
              </div>
            </div>
          </div>
        </div>

        <div style={{height:20}}/>

        {/* INFO + SOCIAL */}
        <div style={centered}>
          <div style={{background:BG,borderTop:B,borderBottom:B,borderLeft:B,borderRight:B}}>
            <div style={{padding:"16px 18px 14px"}}>
              <div className="hero-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"11px 48px"}}>
                {/* LEFT: Noida → Phone → Email → Resume */}
                <div style={{display:"flex",flexDirection:"column",gap:11}}>
                  <Row href="https://maps.google.com/?q=Greater+Noida+India" newTab icon={<IBox color="#f87171"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></IBox>}>Noida, India</Row>
                  <Row href="tel:+917859096326" icon={<IBox color="#4ade80"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.35 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg></IBox>}>+91 7859096326</Row>
                  <Row href="mailto:ithakur2327@gmail.com" icon={<IBox color="#60a5fa"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></IBox>}>ithakur2327@gmail.com</Row>
                  <Row href="/resume.pdf" newTab icon={<IBox><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg></IBox>}>Resume</Row>
                </div>
                {/* RIGHT: Clock → Website → he/him (aligned with resume) */}
                <div style={{display:"flex",flexDirection:"column",gap:11}}>
                  <Row icon={<IBox color="#fbbf24"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></IBox>}><LiveClock/></Row>
                  <Row href="https://indreshthakur.dev" newTab icon={<IBox color="#a78bfa"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></IBox>}>indreshthakur.dev</Row>
                  <Row icon={<IBox color="#f472b6"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M20 21a8 8 0 1 0-16 0"/></svg></IBox>}>he/him</Row>
                </div>
              </div>
            </div>
            <div className="hero-social" style={{display:"flex",borderTop:B}}>
              <SocialTile href="https://github.com/IndreshThakur" label="GitHub" iconBg="var(--bg-secondary)" iconBorder="1px solid var(--border)" iconColor="var(--text-primary)" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>}/>
              <SocialTile href="https://linkedin.com/in/indresh-thakur" label="LinkedIn" iconBg="#0A66C2" iconBorder="none" iconColor="#fff" icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>}/>
              <SocialTile href="https://x.com/indresh_dev" label="X" last iconBg="var(--bg-secondary)" iconBorder="1px solid var(--border)" iconColor="var(--text-primary)" icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.255 5.623zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}/>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}