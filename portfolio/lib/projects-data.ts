// Central project data source.
//
// Add a new project by appending an object to PROJECTS — it will
// automatically show up on the homepage (if within the first 4) and
// always on the /projects page. Every tag used in `tags` must have a
// matching entry in TECH_MAP so its icon renders correctly.
//
// `description` is used both on the card (line-clamped) and in the
// expanded modal (in full) — keep it as one field so the shared-layout
// animation morphs the same text instead of swapping content mid-transition.

export type Project = {
  name: string;
  year: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  img: string;
  description: string;
  features: string[];
  tags: string[];
  github: string;
  live: string;
};

// Small inline SVG glyphs (as data URIs) for tags that don't have one
// authoritative brand logo, or where relying on a third-party icon host
// isn't worth the risk of a broken image. Zero network dependency —
// these always render.
const glyph = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const ICON_LLM = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#10a37f'><path d='M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z'/></svg>`
);
const ICON_OPENAI = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#10a37f' stroke-width='1.6'><circle cx='12' cy='12' r='2.8'/><ellipse cx='12' cy='12' rx='9' ry='3.6'/><ellipse cx='12' cy='12' rx='9' ry='3.6' transform='rotate(60 12 12)'/><ellipse cx='12' cy='12' rx='9' ry='3.6' transform='rotate(120 12 12)'/></svg>`
);
const ICON_RAG = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#a855f7' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='12' height='15' rx='1.5'/><line x1='6' y1='7' x2='12' y2='7'/><line x1='6' y1='11' x2='10' y2='11'/><circle cx='17' cy='16' r='3.2'/><line x1='19.3' y1='18.3' x2='22' y2='21'/></svg>`
);
const ICON_VECTORDB = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#14b8a6' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><ellipse cx='12' cy='5' rx='8' ry='3'/><path d='M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5'/><path d='M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3'/></svg>`
);
const ICON_JWT = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#d63aff' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='7.5' cy='15.5' r='4.5'/><path d='M11 12l9-9'/><path d='M15 8l3 3'/><path d='M18 5l3 3'/></svg>`
);
const ICON_SHADCN = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#a1a1aa' stroke-width='2' stroke-linecap='round'><line x1='4' y1='20' x2='20' y2='4'/><line x1='9' y1='20' x2='20' y2='9'/></svg>`
);
const ICON_FRAMER = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#bb4af8'><path d='M4 3h16v6.5h-8L20 16v5H4v-6.5h8L4 8V3z'/></svg>`
);

export const TECH_MAP: Record<string, { color: string; logo: string }> = {
  "React.js":      { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":       { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Node.js":       { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js":    { color: "#888888", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  "FastAPI":       { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  "MongoDB":       { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  "TypeScript":    { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  "JavaScript":    { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "Tailwind CSS":  { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  "Redux":         { color: "#764ABC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
  "LangChain":     { color: "#1C9E6E", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/langchain.svg" },
  "Vercel":        { color: "#ffffff", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
  "YouTube API":   { color: "#FF0000", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/youtube/youtube-original.svg" },
  "Chart.js":      { color: "#FF6384", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/chartjs/chartjs-original.svg" },
  "LLM APIs":      { color: "#10a37f", logo: ICON_LLM },
  "OpenAI API":    { color: "#10a37f", logo: ICON_OPENAI },
  "RAG":           { color: "#a855f7", logo: ICON_RAG },
  "Vector DB":     { color: "#14b8a6", logo: ICON_VECTORDB },
  "JWT":           { color: "#d63aff", logo: ICON_JWT },
  "shadcn/ui":     { color: "#a1a1aa", logo: ICON_SHADCN },
  "Framer Motion": { color: "#bb4af8", logo: ICON_FRAMER },
};

export const PROJECTS: Project[] = [
  {
    name: "I.Vision",
    year: "2026",
    accent: "#06b6d4",
    accentBg: "rgba(6,182,212,0.10)",
    accentBorder: "rgba(6,182,212,0.28)",
    img: "/ivision-preview.svg",
    description: "I.Vision is a personal AI assistant built to actually know your stuff. It ingests your documents and data into a retrieval-augmented pipeline, then answers questions grounded in that context instead of guessing. A Next.js + TypeScript frontend talks to a FastAPI backend, where LangChain orchestrates retrieval over an embedded knowledge base before the query is passed to an LLM for a grounded, conversational response.",
    features: [
      "Retrieval-augmented generation — answers are grounded in your own ingested data, not just model memory",
      "FastAPI backend with a LangChain-orchestrated retrieval pipeline",
      "Type-safe Next.js frontend for a fast, responsive chat experience",
      "Context-aware conversation that stays scoped to what it was taught",
    ],
    tags: ["Next.js", "TypeScript", "FastAPI", "LangChain", "RAG", "LLM APIs"],
    github: "https://github.com/Ithakur2327",
    live: "#",
  },
  {
    name: "Portfolio Website",
    year: "2025",
    accent: "#6366f1",
    accentBg: "rgba(99,102,241,0.10)",
    accentBorder: "rgba(99,102,241,0.30)",
    img: "/portfolio-preview.png",
    description: "A fully responsive developer portfolio showcasing skills, projects and experience. Features a dot-grid animated background, custom reveal animations, 3D tilt cards, infinite scrolling skill ticker and a working contact form. Deployed on Vercel with automatic CI/CD.",
    features: [
      "Animated dot-grid background with scroll-triggered reveal transitions",
      "Dark/light theme with a custom slide-to-unlock projects gate",
      "Infinite scrolling skill ticker and 3D tilt cards",
      "Working contact form with automatic Vercel CI/CD deployment",
    ],
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "shadcn/ui", "Vercel"],
    github: "https://github.com/Ithakur2327",
    live: "#",
  },
  {
    name: "HealthnexAI",
    year: "2025",
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.10)",
    accentBorder: "rgba(16,185,129,0.25)",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    description: "HealthnexAI helps users proactively manage their health. Users input lifestyle data (sleep, diet, stress, activity) and family medical history. NexAI — powered by LLM APIs — generates personalized risk scores and prevention plans. Interactive charts track health metrics over time.",
    features: [
      "Lifestyle and family-history intake feeding a personalized risk score",
      "NexAI assistant generates prevention plans powered by LLM APIs",
      "Interactive charts tracking health metrics over time",
      "Full-stack MERN architecture with a Tailwind CSS interface",
    ],
    tags: ["React.js", "Node.js", "Express.js", "MongoDB", "LLM APIs", "Tailwind CSS"],
    github: "https://github.com/Ithakur2327",
    live: "#",
  },
  {
    name: "FinLedgerAI",
    year: "2025",
    accent: "#f59e0b",
    accentBg: "rgba(245,158,11,0.10)",
    accentBorder: "rgba(245,158,11,0.25)",
    img: "/finledger-preview.png",
    description: "An intelligent personal finance tool. Transactions are auto-categorized using the OpenAI API. The ML layer detects unusual spending patterns and generates weekly budget insights. Chart.js dashboards visualize trends. Users set budgets per category and receive alerts.",
    features: [
      "Automatic transaction categorization via the OpenAI API",
      "Anomaly detection surfaces unusual spending patterns",
      "Weekly budget insights with Chart.js trend dashboards",
      "Per-category budgets with threshold alerts",
    ],
    tags: ["React.js", "Node.js", "MongoDB", "OpenAI API", "Chart.js"],
    github: "https://github.com/Ithakur2327",
    live: "#",
  },
  {
    name: "SnipixAI",
    year: "2025",
    accent: "#8b5cf6",
    accentBg: "rgba(139,92,246,0.10)",
    accentBorder: "rgba(139,92,246,0.25)",
    img: "/snipix-preview.png",
    description: "A multimodal RAG pipeline ingesting PDFs, images, text and audio. Documents are chunked and embedded into a vector database. LangChain orchestrates retrieval and generation — users query documents with natural language. Supports semantic search with sub-200ms query latency.",
    features: [
      "Multimodal ingestion — PDFs, images, text and audio in one pipeline",
      "Chunked embeddings stored in a vector database for semantic search",
      "LangChain-orchestrated retrieval and generation",
      "Sub-200ms query latency at production scale",
    ],
    tags: ["Next.js", "TypeScript", "LangChain", "RAG", "Vector DB", "LLM APIs"],
    github: "https://github.com/Ithakur2327",
    live: "#",
  },
  {
    name: "VidLearn",
    year: "2025",
    accent: "#ef4444",
    accentBg: "rgba(239,68,68,0.10)",
    accentBorder: "rgba(239,68,68,0.25)",
    img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&q=80",
    description: "An AI learning companion for students. Paste any YouTube lecture URL and VidLearn fetches the transcript via the YouTube API, then uses LLM APIs to auto-summarize content, extract key concepts into structured notes, and generate MCQ quizzes with explanations.",
    features: [
      "Transcript extraction straight from a pasted YouTube URL",
      "LLM-generated summaries and structured concept notes",
      "Auto-generated MCQ quizzes with explanations",
      "Built for fast, distraction-free exam revision",
    ],
    tags: ["Next.js", "TypeScript", "YouTube API", "LLM APIs", "Tailwind CSS"],
    github: "https://github.com/Ithakur2327",
    live: "#",
  },
  {
    name: "Myntra Clone",
    year: "2024",
    accent: "#ec4899",
    accentBg: "rgba(236,72,153,0.10)",
    accentBorder: "rgba(236,72,153,0.25)",
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    description: "A full-featured fashion e-commerce platform. Includes product browsing with advanced filters (brand, price, size, category), search with autocomplete, cart & wishlist with Redux, a multi-step checkout flow with address and payment pages, fully responsive design.",
    features: [
      "Advanced filtering by brand, price, size and category",
      "Search with autocomplete suggestions",
      "Redux-powered cart and wishlist",
      "Multi-step checkout flow with address and payment pages",
    ],
    tags: ["React.js", "Redux", "Node.js", "MongoDB", "Tailwind CSS"],
    github: "https://github.com/Ithakur2327",
    live: "#",
  },
];