"use client";
import { useEffect, useRef, useState, CSSProperties } from "react";
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

/* ── Icons ── */
function SunIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>;
}
function MoonIcon() {
  return <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>;
}
function MenuIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>;
}
function CloseIcon() {
  return <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}

/* ── BlobMenu — full-screen overlay with organic blobs (Image 2 style) ── */
function BlobMenu({ open, onClose, isDark }: { open: boolean; onClose: () => void; isDark: boolean }) {
  const overlayRef  = useRef<HTMLDivElement>(null);
  const blobsRef    = useRef<HTMLAnchorElement[]>([]);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { if (open) setMounted(true); }, [open]);

  useEffect(() => {
    if (!mounted) return;
    const blobs    = blobsRef.current.filter(Boolean);
    const backdrop = backdropRef.current;
    if (!blobs.length || !backdrop) return;

    if (open) {
      // Show backdrop
      gsap.killTweensOf([...blobs, backdrop]);
      gsap.set(backdrop, { autoAlpha: 0 });
      gsap.to(backdrop, { autoAlpha: 1, duration: 0.25, ease: "power2.out" });

      // Each blob pops in with spring bounce
      gsap.set(blobs, { scale: 0, transformOrigin: "50% 50%" });
      blobs.forEach((blob, i) => {
        gsap.to(blob, {
          scale: 1,
          duration: 0.55,
          delay: i * 0.06,
          ease: "back.out(1.8)",
        });
      });
    } else {
      gsap.killTweensOf([...blobs, backdrop]);
      gsap.to(blobs, { scale: 0, duration: 0.2, ease: "power3.in", stagger: 0.03 });
      gsap.to(backdrop, {
        autoAlpha: 0,
        duration: 0.22,
        delay: 0.1,
        onComplete: () => setMounted(false),
      });
    }
  }, [open, mounted]);

  if (!mounted) return null;

  const fg = isDark ? "#ffffff" : "#111111";
  const blobBg = isDark ? "rgba(255,255,255,0.93)" : "#ffffff";
  const blobText = "#111111"; // always dark text on white blobs like image

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        pointerEvents: open ? "auto" : "none",
      }}
    >
      {/* Backdrop */}
      <div
        ref={backdropRef}
        style={{
          position: "absolute",
          inset: 0,
          background: isDark
            ? "rgba(0,0,0,0.92)"
            : "rgba(0,0,0,0.88)",
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
        }}
        onClick={onClose}
      />

      {/* Blobs container — centered, same layout as Image 2 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {/*
          Image 2 layout: 3 on top row, 2 on bottom row centered.
          We have 6 links → 3 top row + 3 bottom row, or keep it 3+3.
          We'll do 3 top + 3 bottom, matching Image 2's visual grouping.
        */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(12px, 3vw, 28px)",
          pointerEvents: "none",
        }}>
          {/* Row 1 — 3 blobs */}
          <div style={{ display: "flex", gap: "clamp(10px, 2.5vw, 24px)", pointerEvents: "none" }}>
            {NAV_LINKS.slice(0, 3).map((item, idx) => (
              <BlobItem
                key={item.href}
                item={item}
                idx={idx}
                blobBg={blobBg}
                blobText={blobText}
                blobsRef={blobsRef}
                onClose={onClose}
              />
            ))}
          </div>
          {/* Row 2 — 3 blobs */}
          <div style={{ display: "flex", gap: "clamp(10px, 2.5vw, 24px)", pointerEvents: "none" }}>
            {NAV_LINKS.slice(3, 6).map((item, idx) => (
              <BlobItem
                key={item.href}
                item={item}
                idx={idx + 3}
                blobBg={blobBg}
                blobText={blobText}
                blobsRef={blobsRef}
                onClose={onClose}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Single blob item ── */
function BlobItem({
  item, idx, blobBg, blobText, blobsRef, onClose
}: {
  item: typeof NAV_LINKS[0];
  idx: number;
  blobBg: string;
  blobText: string;
  blobsRef: React.MutableRefObject<HTMLAnchorElement[]>;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  /*
    Unique organic blob shape per item using border-radius trick.
    Each one is slightly different like in Image 2.
  */
  const blobShapes = [
    "62% 38% 46% 54% / 60% 44% 56% 40%",
    "46% 54% 62% 38% / 44% 60% 40% 56%",
    "54% 46% 38% 62% / 56% 40% 60% 44%",
    "38% 62% 54% 46% / 40% 56% 44% 60%",
    "60% 40% 42% 58% / 48% 62% 38% 52%",
    "42% 58% 60% 40% / 62% 38% 52% 48%",
  ];

  const blobSize = "clamp(90px, 20vw, 155px)";

  return (
    <a
      href={item.href}
      aria-label={item.label}
      ref={el => { if (el) blobsRef.current[idx] = el; }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: blobSize,
        height: blobSize,
        borderRadius: blobShapes[idx] ?? "50%",
        background: hovered ? item.color : blobBg,
        color: hovered ? "#fff" : blobText,
        textDecoration: "none",
        fontSize: "clamp(14px, 3.5vw, 22px)",
        fontWeight: 500,
        fontFamily: "-apple-system, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif",
        letterSpacing: "-0.01em",
        pointerEvents: "auto",
        cursor: "pointer",
        boxShadow: hovered
          ? `0 8px 32px ${item.color}55`
          : "0 4px 20px rgba(0,0,0,0.18)",
        transition: "background 0.22s ease, color 0.22s ease, box-shadow 0.22s ease, border-radius 0.4s ease",
        willChange: "transform",
        flexShrink: 0,
      } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClose}
    >
      {item.label}
    </a>
  );
}

/* ══════════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════════ */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [mounted,       setMounted]       = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [isTablet,      setIsTablet]      = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const checkTablet = () => setIsTablet(window.innerWidth <= 1024);
    checkTablet();
    window.addEventListener("resize", checkTablet, { passive: true });
    return () => window.removeEventListener("resize", checkTablet);
  }, []);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { rootMargin: "-40% 0px -55% 0px" }
    );
    NAV_LINKS.forEach(({ href }) => {
      const el = document.getElementById(href.slice(1));
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const isDark = mounted ? theme === "dark" : true;
  const showMobileMenu = mounted && isTablet;

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
        .nav-partition {
          width: 1px; height: 18px;
          background: var(--nav-border); margin: 0 6px; flex-shrink: 0;
        }
        @media (max-width: 1024px) {
          .desktop-nav-links { display: none !important; }
          .desktop-nav-partition { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 1025px) {
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>

      <header
        className={`nav-root${scrolled ? " scrolled" : ""}`}
        style={{
          background: isDark
            ? scrolled ? "rgba(4,4,4,0.42)" : "rgba(4,4,4,0.22)"
            : scrolled ? "rgba(242,242,240,0.46)" : "rgba(242,242,240,0.22)",
          borderBottomColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)",
          backdropFilter: scrolled ? "blur(36px) saturate(220%) brightness(1.06)" : "blur(28px) saturate(200%) brightness(1.04)",
          WebkitBackdropFilter: scrolled ? "blur(36px) saturate(220%) brightness(1.06)" : "blur(28px) saturate(200%) brightness(1.04)",
          boxShadow: isDark
            ? "0 1px 0 rgba(255,255,255,0.06) inset, 0 8px 32px rgba(0,0,0,0.18)"
            : "0 1px 0 rgba(255,255,255,0.7) inset, 0 8px 32px rgba(0,0,0,0.06)",
          transition: "background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease",
        }}
      >
        <div className="nav-inner">
          {/* Logo */}
          <a href="#" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <div className="logo-area">
              <div className={`logo-i${scrolled ? " hide" : ""}`}>&lt;I&gt;</div>
              <div className={`logo-avatar${scrolled ? " show" : ""}`}>
                <img
                  src={isDark ? "/avatar-dark.jpg" : "/avatar-light.jpg"}
                  alt="IT"
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                    const fb = (e.currentTarget as HTMLImageElement).nextElementSibling as HTMLElement;
                    if (fb) fb.style.display = "flex";
                  }}
                />
                <div className="logo-avatar-fallback" style={{ display: "none" }}>IT</div>
              </div>
            </div>
          </a>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {/* Desktop links */}
            <nav className="desktop-nav-links" style={{ display: "flex", gap: 0 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={href} href={href} className={`nav-link${activeSection === href.slice(1) ? " active" : ""}`}>
                  {label}
                </a>
              ))}
            </nav>
            <span className="nav-partition desktop-nav-partition" />

            {/* Theme btn */}
            <button
              suppressHydrationWarning
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="theme-btn"
              title={isDark ? "Switch to light" : "Switch to dark"}
              style={{ marginLeft: 4 }}
            >
              {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <MoonIcon />}
            </button>

            {/* Mobile/tablet hamburger */}
            <button
              className="mobile-menu-btn theme-btn"
              style={{
                display: "none",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: 8,
              }}
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Blob menu overlay */}
      <BlobMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        isDark={isDark}
      />
    </>
  );
}
