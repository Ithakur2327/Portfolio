"use client";
import { useState } from "react";
import { AnimatePresence } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { ProjectCard, ProjectModal } from "./ProjectCard";
import { BP, mq } from "@/lib/breakpoints";
import { useIsLaptopUp } from "@/lib/useBreakpoint";

export function ProjectsGrid({ projects, visible = true, mobileMax, wide }: {
  projects: Project[];
  visible?: boolean;
  mobileMax?: number;
  wide?: boolean;
}) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const isDesktop = useIsLaptopUp();
  const active = activeIndex === null ? null : projects[activeIndex] ?? null;

  const imageSizes = wide
    ? "(max-width: 599px) 94vw, (max-width: 1299px) min(48vw, 438px), min(32vw, 284px)"
    : "(max-width: 599px) 94vw, min(48vw, 438px)";

  return (
    <>
      <style suppressHydrationWarning>{`
        .proj-grid2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
          contain: layout;
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

      <div className="proj-grid2">
        {projects.map((proj, i) => (
          <ProjectCard
            key={proj.name}
            proj={proj}
            index={i}
            visible={visible}
            isDesktop={isDesktop}
            onOpen={() => setActiveIndex(i)}
            imageSizes={imageSizes}
          />
        ))}
      </div>

      <AnimatePresence>
        {active && activeIndex !== null && (
          <ProjectModal key="modal" proj={active} index={activeIndex} isDesktop={isDesktop} onClose={() => setActiveIndex(null)} />
        )}
      </AnimatePresence>
    </>
  );
}