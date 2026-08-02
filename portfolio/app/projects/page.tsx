import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitleIcon } from "@/components/SectionIcon";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { PROJECTS } from "@/lib/projects-data";
import { mq } from "@/lib/breakpoints";

export const metadata: Metadata = {
  title: "All Projects — Indresh Thakur",
  description: "Full list of projects built by Indresh Thakur — full-stack apps and AI/RAG-powered tools.",
};

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

function BackToHomeLink() {
  return (
    <Link href="/#projects" className="back-home-link">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5"/><path d="M11 18l-6-6 6-6"/>
      </svg>
      Back to home
    </Link>
  );
}

export default function ProjectsPage() {
  return (
    <>
      <style suppressHydrationWarning>{`
        .back-home-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--text-muted);
          font-family: ${SF}; text-decoration: none; transition: color 0.15s;
        }
        .back-home-link:hover { color: var(--text-primary); }

        .all-projects-wrap { padding: 44px 0 70px; }
        .all-projects-title { font-size: clamp(22px, 4.5vw, 28px); }
        .all-projects-sub { font-size: 13.5px; }

        ${mq.navCollapse} {
          .all-projects-wrap { padding: 34px 22px 48px; }
        }
        ${mq.mobile} {
          .all-projects-wrap { padding: 26px 13px 36px; }
          .all-projects-sub  { font-size: 12.5px; }
        }
      `}</style>
      <main style={{ paddingTop: 52 }}>
        <div className="page-wrapper">
          <div className="all-projects-wrap">
            <BackToHomeLink />

            <div style={{ paddingTop: 18, marginBottom: 26 }}>
              <span className="all-projects-title" style={{ display: "inline-flex", alignItems: "center", gap: 10, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                <SectionTitleIcon type="box" />
                All Projects
              </span>
              <p className="all-projects-sub" style={{ margin: "10px 0 0", color: "var(--text-secondary)", fontFamily: SF }}>
                {PROJECTS.length} project{PROJECTS.length === 1 ? "" : "s"} — everything I&apos;ve built and shipped.
              </p>
            </div>

            <ProjectsGrid projects={PROJECTS} wide />
          </div>
        </div>
      </main>
    </>
  );
}