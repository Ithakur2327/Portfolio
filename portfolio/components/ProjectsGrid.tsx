"use client";
import { useState, startTransition } from "react";
import { AnimatePresence } from "motion/react";
import type { Project } from "@/lib/projects-data";
import { ProjectCard, ProjectModal } from "./ProjectCard";

export function ProjectsGrid({ projects, visible = true }: { projects: Project[]; visible?: boolean }) {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <>
      <style suppressHydrationWarning>{`
        .proj-grid2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }
        @media (min-width: 641px) {
          .proj-grid2 { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="proj-grid2">
        {projects.map((proj, i) => (
          <ProjectCard
            key={proj.name}
            proj={proj}
            index={i}
            visible={visible}
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
