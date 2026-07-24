import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { SectionTitleIcon } from "@/components/SectionIcon";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { PROJECTS } from "@/lib/projects-data";

export const metadata: Metadata = {
  title: "All Projects — Indresh Thakur",
  description: "Full list of projects built by Indresh Thakur — full-stack apps and AI/RAG-powered tools.",
};

const SF = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

function BackToHomeLink() {
  return (
    <Link href="/" className="back-home-link">
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
      <Navbar />
      <style suppressHydrationWarning>{`
        .back-home-link {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 13px; font-weight: 600; color: var(--text-muted);
          font-family: ${SF}; text-decoration: none; transition: color 0.15s;
        }
        .back-home-link:hover { color: var(--text-primary); }
      `}</style>
      <main style={{ paddingTop: 52 }}>
        <div className="page-wrapper">
          <div style={{ padding: "44px 0 70px" }}>
            <BackToHomeLink />

            <div style={{ paddingTop: 18, marginBottom: 26 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 28, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1, fontFamily: SF, color: "var(--text-primary)" }}>
                <SectionTitleIcon type="box" />
                All Projects
              </span>
              <p style={{ margin: "10px 0 0", fontSize: 13.5, color: "var(--text-secondary)", fontFamily: SF }}>
                {PROJECTS.length} project{PROJECTS.length === 1 ? "" : "s"} — everything I&apos;ve built and shipped.
              </p>
            </div>

            <ProjectsGrid projects={PROJECTS} />
          </div>
        </div>
      </main>
    </>
  );
}
