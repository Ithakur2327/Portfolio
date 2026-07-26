"use client";
import { useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { ProjectCard, ProjectModal } from "./ProjectCard";
import { BP, mq } from "@/lib/breakpoints";
import { useIsLaptopUp } from "@/lib/useBreakpoint";

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
  // Desktop/laptop gets the hover-driven image reveal; tablet and mobile
  // get the scroll-triggered version instead (see ProjectCard).
  const isDesktop = useIsLaptopUp();

  return (
    <>
      <style suppressHydrationWarning>{`
        .proj-grid2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: ${BP.tabletMin}px) {
          .proj-grid2 { grid-template-columns: repeat(2, 1fr); }
        }
        ${wide ? `
        ${mq.wideGridUp} {
          .proj-grid2 { grid-template-columns: repeat(3, 1fr); gap: 18px; }
        }` : ""}
        ${mobileMax ? `
        ${mq.mobile} {
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
          {active && <ProjectModal key="modal" proj={active} index={activeIndex} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </LayoutGroup>
    </>
  );
}