"use client";
import { useEffect, useRef, useState, CSSProperties } from "react";
import { useTheme } from "./ThemeProvider";

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

/* ══════════════════════════════════════════════════════════
   BLOB MENU — zero GSAP, pure CSS keyframes
   Reliable on every device including low-end Android
══════════════════════════════════════════════════════════ */

const BLOB_SHAPES = [
  "62% 38% 46% 54% / 60% 44% 56% 40%",
  "46% 54% 62% 38% / 44% 60% 40% 56%",
  "54% 46% 38% 62% / 56% 40% 60% 44%",
  "38% 62% 54% 46% / 40% 56% 44% 60%",
  "60% 40% 42% 58% / 48% 62% 38% 52%",
  "42% 58% 60% 40% / 62% 38% 52% 48%",
];

function BlobMenu({ open, onClose, isDark }: { open: boolean; onClose: () => void; isDark: boolean }) {
  // Keep DOM mounted during close animation
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) {
      if (closeTimer.current) clearTimeout(closeTimer.current);
      setIsClosing(false);
      setShouldRender(true);
      // Lock body scroll
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      if (shouldRender) {
        setIsClosing(true);
        closeTimer.current = setTimeout(() => {
          setShouldRender(false);
          setIsClosing(false);
        }, 300);
      }
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, [open]);

  // Keyboard close
  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [open, onClose]);

  if (!shouldRender) return null;

  const blobBg    = isDark ? "rgba(255,255,255,0.93)" : "#ffffff";
  const blobText  = "#111111";
  const animClass = isClosing ? "blob-exit" : "blob-enter";

  return (
    <>
      <style suppressHydrationWarning>{`
        /* ── Backdrop ── */
        @keyframes backdropIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes backdropOut { from { opacity: 1 } to { opacity: 0 } }

        .blob-backdrop-enter { animation: backdropIn  0.22s ease forwards; }
        .blob-backdrop-exit  { animation: backdropOut 0.22s ease forwards; }

        /* ── Blob pop-in / pop-out ── */
        @keyframes blobIn  {
          from { opacity: 0; transform: scale(0.3); }
          60%  { transform: scale(1.08); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes blobOut {
          from { opacity: 1; transform: scale(1); }
          to   { opacity: 0; transform: scale(0.3); }
        }

        .blob-enter .blob-item {
          animation: blobIn 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          opacity: 0;
        }
        .blob-exit .blob-item {
          animation: blobOut 0.22s ease-in forwards;
          opacity: 1;
        }

        /* Stagger delays for each blob */
        .blob-enter .blob-item:nth-child(1) { animation-delay: 0.00s; }
        .blob-enter .blob-item:nth-child(2) { animation-delay: 0.06s; }
        .blob-enter .blob-item:nth-child(3) { animation-delay: 0.12s; }
        .blob-enter .blob-item:nth-child(4) { animation-delay: 0.18s; }
        .blob-enter .blob-item:nth-child(5) { animation-delay: 0.22s; }
        .blob-enter .blob-item:nth-child(6) { animation-delay: 0.26s; }

        .blob-exit .blob-item:nth-child(1) { animation-delay: 0.00s; }
        .blob-exit .blob-item:nth-child(2) { animation-delay: 0.02s; }
        .blob-exit .blob-item:nth-child(3) { animation-delay: 0.04s; }
        .blob-exit .blob-item:nth-child(4) { animation-delay: 0.06s; }
        .blob-exit .blob-item:nth-child(5) { animation-delay: 0.08s; }
        .blob-exit .blob-item:nth-child(6) { animation-delay: 0.10s; }

        /* Hover */
        .blob-item:hover {
          transform: scale(1.07) !important;
          transition: background 0.18s ease, color 0.18s ease,
                      box-shadow 0.18s ease, transform 0.18s ease !important;
        }
        .blob-item:active {
          transform: scale(0.94) !important;
        }

        @media (prefers-reduced-motion: reduce) {
          .blob-enter .blob-item,
          .blob-exit  .blob-item { animation: none !important; opacity: 1 !important; }
          .blob-backdrop-enter,
          .blob-backdrop-exit    { animation: none !important; opacity: 1 !important; }
        }
      `}</style>

      {/* Fixed overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          pointerEvents: "auto",
        }}
      >
        {/* Backdrop */}
        <div
          className={isClosing ? "blob-backdrop-exit" : "blob-backdrop-enter"}
          onClick={onClose}
          style={{
            position: "absolute",
            inset: 0,
            background: isDark ? "rgba(0,0,0,0.92)" : "rgba(0,0,0,0.88)",
            backdropFilter: "blur(3px)",
            WebkitBackdropFilter: "blur(3px)",
          }}
        />

        {/* Blobs grid — centered */}
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
          <div
            className={animClass}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "clamp(12px, 3vw, 28px)",
              pointerEvents: "none",
            }}
          >
            {/* Row 1 — 3 blobs */}
            <div style={{ display: "flex", gap: "clamp(10px, 2.5vw, 24px)", pointerEvents: "none" }}>
              {NAV_LINKS.slice(0, 3).map((item, idx) => (
                <BlobItem
                  key={item.href}
                  item={item}
                  idx={idx}
                  blobBg={blobBg}
                  blobText={blobText}
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
                  onClose={onClose}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ── Single blob item ── */
function BlobItem({
  item, idx, blobBg, blobText, onClose,
}: {
  item: typeof NAV_LINKS[0];
  idx: number;
  blobBg: string;
  blobText: string;
  onClose: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const blobSize = "clamp(90px, 20vw, 155px)";

  return (
    <a
      href={item.href}
      aria-label={item.label}
      className="blob-item"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: blobSize,
        height: blobSize,
        borderRadius: BLOB_SHAPES[idx] ?? "50%",
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
        transition: "background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease",
        willChange: "transform",
        flexShrink: 0,
        touchAction: "manipulation",
        WebkitTapHighlightColor: "transparent",
        userSelect: "none",
        WebkitUserSelect: "none",
      } as CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={() => setHovered(true)}
      onTouchEnd={() => { setHovered(false); onClose(); }}
      onClick={onClose}
    >
      {item.label}
    </a>
  );
}

/* ══════════════════════════════════════
   MAIN NAVBAR
══════════════════════════════════════ */
export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [scrolled,      setScrolled]      = useState(false);
  const [activeSection, setActiveSection] = useState("about");
  const [mounted,       setMounted]       = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);

  useEffect(() => { setMounted(true); }, []);

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

        /* Desktop links hidden on ≤768px — hamburger always shown on mobile */
        @media (max-width: 768px) {
          .desktop-nav-links  { display: none !important; }
          .desktop-partition  { display: none !important; }
          .mobile-menu-btn    { display: flex !important; }
        }
        /* Hamburger hidden on desktop */
        @media (min-width: 769px) {
          .mobile-menu-btn { display: none !important; }
        }

        /* theme-btn base */
        .theme-btn {
          width: 34px; height: 34px; border-radius: 8px;
          border: 1px solid var(--nav-border);
          background: transparent;
          color: var(--nav-link-color);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          -webkit-tap-highlight-color: transparent;
          touch-action: manipulation;
        }
        .theme-btn:hover {
          color: var(--nav-link-hover);
          background: var(--nav-link-active-bg);
        }
      `}</style>

      <header
        className={`nav-root${scrolled ? " scrolled" : ""}`}
        style={{
          background: isDark
            ? scrolled ? "rgba(4,4,4,0.52)" : "rgba(4,4,4,0.18)"
            : scrolled ? "rgba(245,245,243,0.68)" : "rgba(245,245,243,0.20)",
          borderBottomColor: isDark
            ? scrolled ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.06)"
            : scrolled ? "rgba(0,0,0,0.08)" : "rgba(0,0,0,0.05)",
          backdropFilter: scrolled
            ? "blur(28px) saturate(200%) brightness(1.04)"
            : "blur(20px) saturate(180%) brightness(1.02)",
          WebkitBackdropFilter: scrolled
            ? "blur(28px) saturate(200%) brightness(1.04)"
            : "blur(20px) saturate(180%) brightness(1.02)",
          boxShadow: isDark
            ? scrolled
              ? "0 1px 0 rgba(255,255,255,0.06) inset, 0 4px 24px rgba(0,0,0,0.32)"
              : "0 1px 0 rgba(255,255,255,0.04) inset, 0 1px 0 rgba(4,4,4,0.8)"
            : scrolled
              ? "0 1px 0 rgba(255,255,255,0.80) inset, 0 4px 20px rgba(0,0,0,0.06)"
              : "0 1px 0 rgba(255,255,255,0.60) inset, 0 1px 0 rgba(245,245,243,0.9)",
          transition: "background 0.35s ease, border-color 0.35s ease, backdrop-filter 0.35s ease, box-shadow 0.35s ease",
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

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {/* Desktop links */}
            <nav className="desktop-nav-links" style={{ display: "flex", gap: 0 }}>
              {NAV_LINKS.map(({ label, href }) => (
                <a key={href} href={href} className={`nav-link${activeSection === href.slice(1) ? " active" : ""}`}>
                  {label}
                </a>
              ))}
            </nav>
            <span className="nav-partition desktop-partition" />

            {/* Theme toggle */}
            <button
              suppressHydrationWarning
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="theme-btn"
              title={isDark ? "Switch to light" : "Switch to dark"}
              style={{ marginLeft: 4 }}
            >
              {mounted ? (isDark ? <SunIcon /> : <MoonIcon />) : <MoonIcon />}
            </button>

            {/* Hamburger — always visible on mobile (≤768px) */}
            <button
              className="mobile-menu-btn theme-btn"
              style={{
                display: "none",     // CSS overrides to flex on ≤768px
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
      {mounted && (
        <BlobMenu
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          isDark={isDark}
        />
      )}
    </>
  );
}
