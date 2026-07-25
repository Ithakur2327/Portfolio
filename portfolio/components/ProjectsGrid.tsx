"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { ProjectCard, ProjectModal } from "./ProjectCard";

// Desktop/laptop gets the hover-driven image reveal; tablet and mobile
// get the scroll-triggered version instead (see ProjectCard).
const DESKTOP_QUERY = "(min-width: 1025px)";

export function ProjectsGrid({ projects, visible = true, mobileMax, wide }: {
  projects: Project[];
  visible?: boolean;
  /** If set, only this many cards show on narrow (<=640px) screens — the
   *  rest stay in the DOM (no layout shift on resize) but are hidden. */
  mobileMax?: number;
  /** Adds a 3-column layout on large screens — used by the "All Projects"
   *  page, which has room to breathe with the full project list. */
  wide?: boolean;
}) {
  const [active, setActive] = useState<Project | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <>
      <style suppressHydrationWarning>{`
        .proj-grid2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 601px) {
          .proj-grid2 { grid-template-columns: repeat(2, 1fr); }
        }
        ${wide ? `
        @media (min-width: 1300px) {
          .proj-grid2 { grid-template-columns: repeat(3, 1fr); gap: 18px; }
        }` : ""}
        ${mobileMax ? `
        @media (max-width: 600px) {
          .proj-grid2 > *:nth-child(n + ${mobileMax + 1}) { display: none; }
        }` : ""}
      `}</style>

      <LayoutGroup>
        <div className="proj-grid2">
          {projects.map((proj, i) => (
            <ProjectCard
              key={proj.name}
              proj={proj}
              index={i}
              visible={visible}
              isDesktop={isDesktop}
              onOpen={() => { setActive(proj); setActiveIndex(i); }}
            />
          ))}
        </div>

        {/* mode="sync" made explicit — with a shared layoutId between the
            card and the modal, we never want Framer waiting on an exit
            animation to finish before starting the enter animation (that
            would show a stale/empty layout gap and read as a stall).
            Behavior is unchanged from the default; this just guards
            against future edits accidentally switching modes. */}
        <AnimatePresence mode="sync">
          {active && <ProjectModal key="modal" proj={active} index={activeIndex} isDesktop={isDesktop} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </LayoutGroup>
    </>
  );
}