"use client";
import { useState, useEffect, startTransition } from "react";
import { AnimatePresence } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { ProjectCard, ProjectModal } from "./ProjectCard";

// Desktop/laptop gets the hover-driven image reveal; tablet and mobile
// get the scroll-triggered version instead (see ProjectCard).
const DESKTOP_QUERY = "(min-width: 1025px)";

export function ProjectsGrid({ projects, visible = true, mobileMax }: {
  projects: Project[];
  visible?: boolean;
  /** If set, only this many cards show on narrow (<=640px) screens — the
   *  rest stay in the DOM (no layout shift on resize) but are hidden. */
  mobileMax?: number;
}) {
  const [active, setActive] = useState<Project | null>(null);
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
        @media (min-width: 600px) {
          .proj-grid2 { grid-template-columns: repeat(2, 1fr); }
        }
        ${mobileMax ? `
        @media (max-width: 599px) {
          .proj-grid2 > *:nth-child(n + ${mobileMax + 1}) { display: none; }
        }` : ""}
      `}</style>

      <div className="proj-grid2">
        {projects.map((proj, i) => (
          <ProjectCard
            key={proj.name}
            proj={proj}
            index={i}
            visible={visible}
            isDesktop={isDesktop}
            onOpen={() => startTransition(() => setActive(proj))}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && <ProjectModal key="modal" proj={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </>
  );
}