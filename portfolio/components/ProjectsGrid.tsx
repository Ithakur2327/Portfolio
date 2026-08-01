"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, LayoutGroup } from "motion/react";
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
  const [active, setActive] = useState<Project | null>(null);
  const isDesktop = useIsLaptopUp();

  // On open, the clicked card's real (layoutId-bearing) element and the
  // newly-mounted modal must both exist in the DOM for at least one frame —
  // that overlap is what lets the shared layoutId transition compute its
  // "from" rect and morph. On close this overlap happens for free (the
  // modal stays mounted mid-exit while the grid card is instantly restored),
  // which is why closing always animated correctly. Opening had no such
  // overlap: the source card was swapped for its invisible placeholder in
  // the very same render that mounted the modal, so there was nothing for
  // Framer to morph from and the modal just popped in.
  // `hiddenName` mirrors `active` but is deliberately set one frame later,
  // giving that first frame of overlap on open while staying perfectly in
  // sync (reset instantly) on close.
  const [hiddenName, setHiddenName] = useState<string | null>(null);

  useEffect(() => {
    if (!active) {
      setHiddenName(null);
      return;
    }
    const raf = requestAnimationFrame(() => setHiddenName(active.name));
    return () => cancelAnimationFrame(raf);
  }, [active]);

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
              isHidden={isDesktop && active?.name === proj.name && hiddenName === proj.name}
              onOpen={() => setActive(proj)}
            />
          ))}
        </div>

        <AnimatePresence>
          {active && <ProjectModal key="modal" proj={active} isDesktop={isDesktop} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </LayoutGroup>
    </>
  );
}