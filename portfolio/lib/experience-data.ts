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
    summary: "Working directly with clients to turn rough ideas into fast, polished web apps.",
    points: [
      "Plan, design and build products end to end: React and Next.js on the front, Node.js and MongoDB behind it.",
      "Break every project into small milestones and keep clients in the loop as things ship.",
      "Handle deployment and the post-launch fixes too, so nothing is left half-done.",
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
    summary: "Three months on a fully remote team, working across the stack to ship real features.",
    points: [
      "Built features on both sides of the stack, from React and Next.js screens to the Node.js APIs behind them.",
      "Worked asynchronously with the team: picked up tasks, opened pull requests and acted on review feedback.",
      "Tracked down bugs and polished performance and UI details before each release.",
    ],
    stack: ["React", "Next.js", "Node.js", "REST APIs"],
  },
];