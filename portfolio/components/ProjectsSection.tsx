"use client";
import Link from "next/link";
import { useReveal } from "./useReveal";
import { SectionTitleIcon } from "./SectionIcon";
import { PROJECTS } from "@/lib/projects-data";
import { ProjectsGrid } from "./ProjectsGrid";
import { mq } from "@/lib/breakpoints";

import { Panel3D } from "./Panel3D";
const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

const FEATURED_COUNT = 6;

// Projects section
export function ProjectsSection() {
  const { ref: revealRef, revealClass, visible } = useReveal();
  const featured = PROJECTS.slice(0, FEATURED_COUNT);

  return (
    <div id="projects" ref={revealRef as unknown as React.Ref<HTMLDivElement>} className={revealClass}>
      <div style={{ position: "relative", left: "50%", marginLeft: "-50vw", width: "100vw", background: "var(--bg-base)" }}>
        <Panel3D tilt={false}>
        <div className="proj-inner" style={{ maxWidth: "var(--content-width)", margin: "0 auto", padding: "26px 20px 26px" }}>
          <div style={{ paddingTop: 0, marginBottom: 4 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
              <SectionTitleIcon type="box" />
              Projects
            </span>
          </div>

          <div style={{ height: 1, background: "var(--border)", margin: "20px 0 20px" }} />

          <style suppressHydrationWarning>{`
            ${mq.navCollapse} { .proj-inner { padding: 22px 16px 22px !important; } }
           ${mq.mobile} { .proj-inner { padding: 18px 4px 20px !important; } }
            .view-more-link {
              display: inline-flex; align-items: center; gap: 7px;
              padding: 10px 24px; border-radius: 10px;
              border: 1px solid rgba(10,186,181,0.55);
              background: linear-gradient(180deg, rgba(10,186,181,0.22), rgba(10,186,181,0.09));
              box-shadow: inset 0 1px 0 rgba(255,255,255,0.28), 0 3px 0 rgba(7,111,107,0.72), 0 8px 18px rgba(0,0,0,0.22);
              color: #63e4dc; font-family: ${SF}; font-size: 13px; font-weight: 700;
              text-decoration: none; transform: translateY(0);
              transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease;
            }
            html.light .view-more-link {
              color: #087d79;
              background: linear-gradient(180deg, rgba(10,186,181,0.18), rgba(10,186,181,0.08));
              box-shadow: inset 0 1px 0 rgba(255,255,255,0.75), 0 3px 0 rgba(10,130,125,0.38), 0 8px 16px rgba(10,80,78,0.14);
            }
            .view-more-link:hover {
              transform: translateY(-2px);
              border-color: rgba(10,186,181,0.8);
              background: linear-gradient(180deg, rgba(10,186,181,0.3), rgba(10,186,181,0.13));
              box-shadow: inset 0 1px 0 rgba(255,255,255,0.34), 0 5px 0 rgba(7,111,107,0.68), 0 12px 22px rgba(0,0,0,0.24);
            }
            .view-more-link:active {
              transform: translateY(2px);
              box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), 0 1px 0 rgba(7,111,107,0.72), 0 3px 8px rgba(0,0,0,0.18);
            }
            .view-more-link:focus-visible { outline: 2px solid #0abab5; outline-offset: 4px; }
            @media (prefers-reduced-motion: reduce) {
              .view-more-link { transition: none; }
            }
          `}</style>

          <ProjectsGrid projects={featured} visible={visible} mobileMax={FEATURED_COUNT} scope="home" />

          {PROJECTS.length > FEATURED_COUNT && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 26 }}>
              <Link
                href="/projects"
                className="view-more-link"
              >
                View More
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>
                </svg>
              </Link>
            </div>
          )}
        </div>
        </Panel3D>
      </div>
    </div>
  );
}