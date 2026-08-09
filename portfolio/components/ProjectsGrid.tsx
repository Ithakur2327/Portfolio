"use client";
import { useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { ProjectCard, ProjectModal } from "./ProjectCard";
import { BP, mq } from "@/lib/breakpoints";
import { useIsLaptopUp } from "@/lib/useBreakpoint";

export function ProjectsGrid({ projects, visible = true, mobileMax, wide, scope = "grid" }: {
  projects: Project[];
  visible?: boolean;
  mobileMax?: number;
  wide?: boolean;
  scope?: string;
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
          <LayoutGroup key={proj.name} id={`project-${scope}-${proj.name}`}>
            <ProjectCard
              proj={proj}
              index={i}
              visible={visible}
              isDesktop={isDesktop}
              isHidden={isDesktop && active?.name === proj.name}
              onOpen={() => setActiveIndex(i)}
              imageSizes={imageSizes}
              scope={scope}
            />
          </LayoutGroup>
        ))}
      </div>

      <AnimatePresence>
        {active && activeIndex !== null && (
          <LayoutGroup id={`project-${scope}-${active.name}`}>
            <ProjectModal key="modal" proj={active} index={activeIndex} isDesktop={isDesktop} onClose={() => setActiveIndex(null)} scope={scope} />
          </LayoutGroup>
        )}
      </AnimatePresence>
    </>
  );
}