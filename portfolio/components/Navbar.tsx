"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { gsap } from "gsap";

const NAV_LINKS = [
  { label: "About",          href: "#about",          color: "#6366f1" },
  { label: "Skills",         href: "#skills",         color: "#10b981" },
  { label: "Projects",       href: "#projects",       color: "#f59e0b" },
  { label: "Education",      href: "#education",      color: "#ef4444" },
  { label: "Certifications", href: "#certifications", color: "#3b82f6" },
  { label: "Contact",        href: "#contact",        color: "#8b5cf6" },
];

function SunIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  );
}
function MoonIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  );
}
function CloseIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

// ── Bubble menu item (individual box) ─────────────────────
function BubbleItem({
  item, index, bubblesRef, labelRefs
}: {
  item: typeof NAV_LINKS[0];
  index: number;
  bubblesRef: React.MutableRefObject<HTMLAnchorElement[]>;
  labelRefs: React.MutableRefObject<HTMLSpanElement[]>;
}) {
  return (
    <a
      href={item.href}
      aria-label={item.label}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 14,
        background: "rgba(18,18,20,0.82)",
        border: "1px solid rgba(255,255,255,0.10)",
        backdropFilter: "blur(16px) saturate(180%)",
        WebkitBackdropFilter: "blur(16px) saturate(180%)",
        boxShadow: `0 4px 20px rgba(0,0,0,0.32), 0 0 0 1px rgba(255,255,255,0.04) inset`,
        color: "#fafafa",
        textDecoration: "none",
        fontSize: "clamp(13px,3.5vw,15px)",
        fontWeight: 600,
        padding: "10px 18px",
        whiteSpace: "nowrap",
        cursor: "pointer",
        transition: "background 0.18s ease, box-shadow 0.18s ease",
        willChange: "transform",
      }}
      ref={(el) => { if (el) bubblesRef.current[index] = el; }}
      onClick={() => {}}
    >
      <span
        ref={(el) => { if (el) labelRefs.current[index] = el; }}
        style={{ display: "flex", alignItems: "center", gap: 7 }}
      >
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: item.color, flexShrink: 0,
          boxShadow: `0 0 6px ${item.color}aa`,
        }} />
        {item.label}
      </span>
    </a>
  );
}

// ── Bubble overlay (mobile/tablet only) ────────────────────
function BubbleOverlay({
  open, onClose, isDark
}: { open: boolean; onClose: () => void; isDark: boolean }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLAnchorElement[]>([]);
  const labelRefs = useRef<HTMLSpanElement[]>([]);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (open) {
      setShowOverlay(true);
    }
  }, [open]);

  useEffect(() => {
    if (!showOverlay) return;
    const bubbles = bubblesRef.current.filter(Boolean);
    const labels = labelRefs.current.filter(Boolean);
    if (!bubbles.length) return;

    if (open) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 16, autoAlpha: 0 });
      bubbles.forEach((bubble, i) => {
        const delay = i * 0.07 + gsap.utils.random(-0.02, 0.02);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, { scale: 1, duration: 0.4, ease: "back.out(1.5)" });
        if (labels[i]) {
          tl.to(labels[i], { y: 0, autoAlpha: 1, duration: 0.3, ease: "power3.out" }, "-=0.28");
        }
      });
    } else {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, { y: 16, autoAlpha: 0, duration: 0.15, ease: "power3.in" });
      gsap.to(bubbles, {
        scale: 0, duration: 0.18, ease: "power3.in",
        onComplete: () => setShowOverlay(false),
      });
    }
  }, [open, showOverlay]);

  if (!showOverlay) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: open ? "auto" : "none",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        background: isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.28)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }} onClick={onClose} />
      {/* Grid of bubbles */}
      <div style={{
        position: "relative",
        zIndex: 1,
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        padding: 24,
        maxWidth: 380,
        width: "100%",
      }}>
        {NAV_LINKS.map((item, idx) => (
          <BubbleItem
            key={item.href}
            item={item}
            index={idx}
            bubblesRef={bubblesRef}
            labelRefs={labelRefs}
          />
        ))}
      </div>
    </div>
  );
}

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [mounted,       setMounted]       = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const isDark = mounted ? theme === "dark" : true;

  // Always glass — stronger on scroll
  const navBgStyle = {
    background: isDark
      ? scrolled ? "rgba(4,4,4,0.42)" : "rgba(4,4,4,0.22)"
      : scrolled ? "rgba(242,242,240,0.44)" : "rgba(242,242,240,0.20)",
    borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
    backdropFilter: scrolled ? "blur(36px) saturate(220%) brightness(1.06)" : "blur(28px) saturate(200%) brightness(1.04)",
    WebkitBackdropFilter: scrolled ? "blur(36px) saturate(220%) brightness(1.06)" : "blur(28px) saturate(200%) brightness(1.04)",
  };

  return (
    <>
      <style suppressHydrationWarning>{`
        .nav-link {
          padding: 5px 10px; border-radius: 5px;
          font-size: 13px; font-weight: 500;
          color: var(--nav-link-color);
          background: transparent !important;
          text-decoration: none;
          transition: color 0.15s;
          white-space: nowrap;
        }
        .nav-link:hover  { color: var(--nav-link-hover); }
        .nav-link.active { color: var(--nav-link-hover); }
        .nav-partition { width:1px; height:18px; background:var(--nav-border); margin:0 6px; flex-shrink:0; }
        .mobile-nav-btn { display: none !important; }

        @media (min-width: 761px) {
          .mobile-nav-btn { display: none !important; }
          .desktop-nav    { display: flex !important; }
          .nav-partition  { display: flex !important; }
        }
        @media (max-width: 760px) {
          .mobile-nav-btn { display: flex !important; }
          .desktop-nav    { display: none !important; }
          .nav-partition  { display: none !important; }
        }
        @media (min-width: 761px) and (max-width: 1024px) {
          .mobile-nav-btn { display: flex !important; }
          .desktop-nav    { display: none !important; }
          .nav-partition  { display: none !important; }
        }
      `}</style>

      <header
        className={`nav-root${scrolled ? " scrolled" : ""}`}
        style={{
          ...navBgStyle,
          transition: "background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
          boxShadow: isDark
            ? "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0,0,0,0.18)"
            : "0 1px 0 rgba(255,255,255,0.7) inset, 0 8px 32px rgba(0,0,0,0.06)",
        }}
      >
        <div className="nav-inner">
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <div className="logo-area">
              <div className={`logo-i${scrolled ? " hide" : ""}`}>&lt;I&gt;</div>
              <div className={`logo-avatar${scrolled ? " show" : ""}`}>
                <img
                  key={isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg"}
                  src={isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg"}
                  alt="IT"
                  onError={(e) => {
                    const el = e.currentTarget as HTMLImageElement;
                    el.style.display = "none";
                    const fb = el.nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div className="logo-avatar-fallback" style={{ display: "none" }}>IT</div>
              </div>
            </div>
          </a>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            <nav className="desktop-nav" style={{ display: "flex", gap: 0 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={href} href={href} className={`nav-link${activeSection === href.slice(1) ? " active" : ""}`}>
                  {label}
                </a>
              ))}
            </nav>
            <span className="nav-partition desktop-nav" />
            <button
              suppressHydrationWarning
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="theme-btn"
              title={isDark ? "Switch to light" : "Switch to dark"}
              style={{ marginLeft: 4 }}
            >
              {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <MoonIcon />}
            </button>
            {/* Mobile/tablet bubble menu toggle */}
            <button
              ref={menuRef as any}
              className="mobile-nav-btn theme-btn"
              style={{ display: "none", alignItems: "center", justifyContent: "center", marginLeft: 8 }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Bubble menu overlay — mobile/tablet only */}
      <BubbleOverlay
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isDark={isDark}
      />
    </>
  );
}
