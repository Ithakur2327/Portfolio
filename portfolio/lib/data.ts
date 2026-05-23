export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export const ROLES = [
  "AI Software Engineer",
  "Full-Stack Developer",
  "Open Source Contributor",
  "ML Systems Builder",
];

export const SKILLS = {
  "Languages": ["TypeScript", "Python", "JavaScript", "Java", "SQL"],
  "Frontend": ["React", "Next.js", "Tailwind CSS", "Framer Motion", "shadcn/ui"],
  "Backend": ["Node.js", "FastAPI", "Express", "REST APIs", "GraphQL"],
  "AI / ML": ["LangChain", "OpenAI API", "RAG Pipelines", "Vector DBs", "HuggingFace"],
  "Infrastructure": ["Docker", "Vercel", "AWS", "PostgreSQL", "Redis"],
  "Tools": ["Git", "GitHub", "Cursor", "Claude", "Figma"],
};

export const PROJECTS = [
  {
    title: "RAG Intelligence Platform",
    description: "End-to-end Retrieval-Augmented Generation system with multimodal support. Ingests PDFs, web pages, and images into a semantic vector store. Sub-200ms query latency at scale.",
    tags: ["Next.js", "LangChain", "Pinecone", "OpenAI", "TypeScript"],
    href: "https://github.com/indresh149",
    stars: 248,
    status: "Production",
  },
  {
    title: "AI Code Review Agent",
    description: "Autonomous code review agent that analyzes PRs, suggests improvements, detects security issues, and auto-generates documentation. Integrates directly with GitHub Actions.",
    tags: ["Python", "FastAPI", "GPT-4", "GitHub API", "Redis"],
    href: "https://github.com/indresh149",
    stars: 183,
    status: "Open Source",
  },
  {
    title: "Neural Search Engine",
    description: "Semantic search over technical documentation using bi-encoder + cross-encoder reranking. Built custom embedding pipeline with 94% relevance score on benchmarks.",
    tags: ["React", "Python", "HuggingFace", "Qdrant", "FastAPI"],
    href: "https://github.com/indresh149",
    stars: 127,
    status: "Beta",
  },
  {
    title: "DevFlow Dashboard",
    description: "Real-time developer productivity dashboard. Aggregates GitHub, Linear, and Notion activity into a unified view. Used by 3 engineering teams internally.",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Recharts"],
    href: "https://github.com/indresh149",
    stars: 96,
    status: "Live",
  },
];

export const EXPERIENCE = [
  {
    role: "Web Development Intern",
    company: "Unstop",
    period: "Jun 2025 – Aug 2025",
    description: "Built responsive UI components and integrated REST APIs for the platform's contest management system. Improved core web vitals by 40% through code splitting and lazy loading.",
    tags: ["React", "Node.js", "REST APIs"],
  },
  {
    role: "Open Source Contributor",
    company: "GSSOC Extended Edition",
    period: "Oct 2025 – Dec 2025",
    description: "Contributed to 6 open source repositories. Merged 18 PRs spanning bug fixes, feature additions, and documentation improvements. Ranked in top 50 contributors.",
    tags: ["Open Source", "TypeScript", "Documentation"],
  },
  {
    role: "Hackathon Participant",
    company: "Smart India Hackathon 2025",
    period: "Dec 2025",
    description: "Built an AI-powered grievance management system in 36 hours. Implemented NLP classification pipeline to auto-route complaints with 89% accuracy.",
    tags: ["AI/ML", "Python", "NLP", "React"],
  },
  {
    role: "B.Tech CSE (AI Specialization)",
    company: "NIET, Greater Noida",
    period: "2023 – Present",
    description: "Pursuing Computer Science Engineering with AI specialization. CGPA 7.5. Coursework includes Deep Learning, NLP, Distributed Systems, and Algorithms.",
    tags: ["AI", "Algorithms", "Research"],
  },
];

export const ACHIEVEMENTS = [
  { label: "GitHub Stars", value: "650+", icon: "⭐" },
  { label: "Open Source PRs", value: "18+", icon: "🔀" },
  { label: "Projects Built", value: "20+", icon: "🚀" },
  { label: "LeetCode Solved", value: "200+", icon: "💡" },
];

export const CONTACT_LINKS = [
  { label: "Email", value: "ithakur2327@gmail.com", href: "mailto:ithakur2327@gmail.com", icon: "✉" },
  { label: "GitHub", value: "github.com/indresh149", href: "https://github.com/indresh149", icon: "◈" },
  { label: "LinkedIn", value: "linkedin.com/in/indresh-thakur", href: "https://linkedin.com/in/indresh-thakur", icon: "◉" },
  { label: "Phone", value: "+91 78590 96326", href: "tel:+917859096326", icon: "◎" },
  { label: "Location", value: "Noida, India", href: "https://maps.google.com/?q=Noida,India", icon: "◌" },
];