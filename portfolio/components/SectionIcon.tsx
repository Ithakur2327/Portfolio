"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SectionIcon — the exact icon set used in the navbar's command-menu
 * (search) list, extracted into one shared component so every section
 * title can render the same icon that represents it in search.
 *
 * Keep this in sync with the `icon` field on PORTFOLIO_LINKS in Navbar.tsx.
 */
export type SectionIconType =
  | "home" | "about" | "chart" | "layers" | "box"
  | "badge" | "book" | "mail" | "resume" | "github"
  | "leetcode" | "website" | "institution" | "cap";

export function SectionIcon({
  type,
  size = 20,
  color = "currentColor",
  strokeWidth = 1.8,
}: {
  type: SectionIconType;
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  const p = {
    width: size, height: size, viewBox: "0 0 24 24",
    fill: "none", stroke: color, strokeWidth,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
  switch (type) {
    case "home":
      return <svg {...p}><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
    case "about":
      return <svg {...p}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case "chart":
      return <svg {...p}><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
    case "layers":
      return <svg {...p}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>;
    case "box":
      return <svg {...p}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;
    case "badge":
      return <svg {...p}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
    case "book":
      return <svg {...p}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>;
    case "mail":
      return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
    case "resume":
      return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>;
    case "github":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>;
    case "leetcode":
      return <svg width={size} height={size} viewBox="0 0 24 24" fill={color}><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>;
    case "website":
      return <svg {...p}><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
    case "institution":
      return <svg {...p}><line x1="3" y1="21" x2="21" y2="21"/><line x1="4" y1="10" x2="20" y2="10"/><polygon points="12 3 21 8 3 8"/><line x1="6" y1="10" x2="6" y2="21"/><line x1="10" y1="10" x2="10" y2="21"/><line x1="14" y1="10" x2="14" y2="21"/><line x1="18" y1="10" x2="18" y2="21"/></svg>;
    case "cap":
      return <svg {...p}><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.66 2.69 3 6 3s6-1.34 6-3v-5"/><path d="M22 10v6"/></svg>;
    default:
      return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="3"/></svg>;
  }
}

/** Shared flat icon box used next to every section title — same size and
 * background treatment everywhere so all sections match (no 3D/embossed effect).
 * Pops in once the first time it scrolls into view, and pops again on hover. */
export function SectionTitleIcon({ type }: { type: SectionIconType }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [popped, setPopped] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPopped(true);
          obs.disconnect();
        }
      },
      { threshold: 0.4, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      className="section-title-icon-3d"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: 34, height: 34, borderRadius: 9,
        background: "var(--bg-secondary)",
        border: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--text-secondary)", flexShrink: 0,
        opacity: popped ? 1 : 0,
        transform: !popped ? "scale(0.4)" : hovered ? "scale(1.14)" : "scale(1)",
        transition: popped
          ? "transform 0.28s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease"
          : "opacity 0.3s ease, transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <SectionIcon type={type} size={15} strokeWidth={2} />
    </span>
  );
}

/** Small static gold dot placed to the right of a section title. No animation. */
export function GoldDot() {
  return (
    <span
      aria-hidden="true"
      style={{
        width: 6, height: 6, borderRadius: "50%",
        background: "#d4a017", flexShrink: 0,
        marginLeft: 2,
      }}
    />
  );
}


export function SectionTitle({
  icon, children, style,
}: { icon: SectionIconType; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, ...style }}>
      <SectionIcon type={icon} size={22} strokeWidth={2} />
      {children}
    </span>
  );
}