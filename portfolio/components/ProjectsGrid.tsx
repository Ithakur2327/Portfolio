"use client";
import { useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { ProjectCard, ProjectModal } from "./ProjectCard";
import { useIsLaptopUp } from "@/lib/breakpoints";

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
  // Desktop/laptop (>=1025px, same laptopMin used by the rest of the app —
  // see lib/breakpoints.json) gets the hover-driven image reveal and the
  // full card-to-modal morph. Tablet and mobile get the scroll-triggered
  // reveal and a plain bottom-sheet open instead (see ProjectCard).
  //
  // This used to be a local `(min-width: 900px)` media query, which didn't
  // match the app's real tablet↔laptop boundary (1024/1025px) — so tablets
  // in the 900–1024px range (e.g. iPad landscape) were wrongly bucketed as
  // "desktop" and got the heavy FLIP morph meant only for mouse/hover
  // devices. Using the shared hook fixes that mismatch.
  const isDesktop = useIsLaptopUp();

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

        <AnimatePresence>
          {active && <ProjectModal key="modal" proj={active} index={activeIndex} isDesktop={isDesktop} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </LayoutGroup>
    </>
  );
}