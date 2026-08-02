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
  // Only used for the mobile bottom sheet now — desktop cards each manage
  // their own expanded view internally (see ProjectCard).
  const [active, setActive] = useState<Project | null>(null);
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

      <div className="proj-grid2">
        {projects.map((proj, i) => (
          <ProjectCard
            key={proj.name}
            proj={proj}
            index={i}
            visible={visible}
            isDesktop={isDesktop}
            onOpenMobile={() => setActive(proj)}
          />
        ))}
      </div>

      <AnimatePresence>
        {!isDesktop && active && (
          <ProjectModal key="modal" proj={active} onClose={() => setActive(null)} />
        )}
      </AnimatePresence>
    </>
  );
}