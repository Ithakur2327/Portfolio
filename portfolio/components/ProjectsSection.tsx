"use client";
import Link from "next/link";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { PROJECTS } from "@/lib/projects-data";
import { ProjectsGrid } from "./ProjectsGrid";
import { mq } from "@/lib/breakpoints";

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

const FEATURED_COUNT = 4;
const MOBILE_COUNT   = 3;

// Projects section
export function ProjectsSection() {
  const { ref: revealRef, revealClass, visible } = useReveal();
  const featured = PROJECTS.slice(0, FEATURED_COUNT);

  return (
    <div id="projects" ref={revealRef as unknown as React.Ref<HTMLDivElement>} className={revealClass}>
      <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
        <div className="proj-inner" style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "0 20px 60px" }}>
          <div style={{ paddingTop: 50, marginBottom: 4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
              <SectionTitleIcon type="box" />
              Projects
            </span>
          </div>

          <div style={{ height: 1, background: "var(--border)", margin: "20px 0 20px" }} />

          <style suppressHydrationWarning>{`
            ${mq.navCollapse} { .proj-inner { padding: 0 22px 34px !important; } }
            ${mq.mobile} { .proj-inner { padding: 0 13px 28px !important; } }
          `}</style>

          <ProjectsGrid projects={featured} visible={visible} mobileMax={MOBILE_COUNT} />

          {PROJECTS.length > FEATURED_COUNT && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
              <Link
                href="/projects"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7,
                  padding: "10px 24px", borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--nav-bg)",
                  backdropFilter: "blur(12px) saturate(180%)",
                  WebkitBackdropFilter: "blur(12px) saturate(180%)",
                  boxShadow: "0 8px 24px -8px rgba(0,0,0,0.35)",
                  color: "var(--text-secondary)", fontFamily: SF, fontSize: 13, fontWeight: 600,
                  textDecoration: "none", transition: "color 0.15s, border-color 0.15s, background 0.2s, transform 0.15s, box-shadow 0.2s",
                }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-primary)"; el.style.borderColor = "var(--text-muted)"; el.style.background = "var(--nav-bg-scrolled)"; el.style.transform = "translateY(-1.5px)"; el.style.boxShadow = "0 12px 28px -8px rgba(0,0,0,0.45)"; }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.color = "var(--text-secondary)"; el.style.borderColor = "var(--border)"; el.style.background = "var(--nav-bg)"; el.style.transform = "none"; el.style.boxShadow = "0 8px 24px -8px rgba(0,0,0,0.35)"; }}
              >
                View More
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}