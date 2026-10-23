/**
 * Work experience shown in the Experience section (newest / ongoing first).
 * Edit this file to change what appears — no component changes needed.
 */
export type ExperienceItem = {
  id: string;
  role: string;
  company: string;
  /** Shown as a small badge next to the role. */
  kind: "Freelance" | "Internship";
  /** e.g. "Fully remote" */
  mode?: string;
  from: string;
  /** "Present" marks the entry as ongoing. */
  to: string;
  /** e.g. "3 months" */
  duration?: string;
  summary: string;
  points: string[];
  stack: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
  {
    id: "freelance",
    role: "Full-Stack Developer",
    company: "Freelance",
    kind: "Freelance",
    from: "Dec 2025",
    to: "Present",
    summary: "Building custom web products for clients, from the first sketch to production.",
    points: [
      "Turn client requirements into fast, responsive Next.js and React interfaces.",
      "Build the backend too: REST APIs, authentication and databases.",
      "Own delivery end to end: planning, development, deployment and post-launch fixes.",
    ],
    stack: ["Next.js", "React", "TypeScript", "Node.js", "MongoDB"],
  },
  {
    id: "prepeasy",
    role: "Full-Stack Developer Intern",
    company: "PrepEasy",
    kind: "Internship",
    mode: "Fully remote",
    from: "Jul 2026",
    to: "Oct 2026",
    duration: "3 months",
    summary: "Worked across the stack on a fully remote team, shipping features to production.",
    points: [
      "Built and shipped frontend features along with the APIs behind them.",
      "Collaborated asynchronously with the team through code reviews and regular syncs.",
      "Fixed bugs and improved performance and UI polish across the product.",
    ],
    stack: ["React", "Next.js", "Node.js", "REST APIs"],
  },
];