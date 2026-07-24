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

// Small inline SVG glyphs (as data URIs) — used ONLY for tags that
// describe a generic concept rather than a real, brand-owned product
// (there is no "official logo" for RAG, a vector database in the
// abstract, or "LLM APIs" as a category). Every tag that IS a real,
// named product now points to its official logo instead (see below).
const glyph = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const ICON_LLM = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='#10a37f'><path d='M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2z'/></svg>`
);
const ICON_RAG = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#a855f7' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='12' height='15' rx='1.5'/><line x1='6' y1='7' x2='12' y2='7'/><line x1='6' y1='11' x2='10' y2='11'/><circle cx='17' cy='16' r='3.2'/><line x1='19.3' y1='18.3' x2='22' y2='21'/></svg>`
);
const ICON_VECTORDB = glyph(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='#14b8a6' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><ellipse cx='12' cy='5' rx='8' ry='3'/><path d='M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5'/><path d='M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3'/></svg>`
);

// Official brand logos, served pre-colored via the Simple Icons CDN
// (https://cdn.simpleicons.org/<slug>/<hex>) so each icon matches its
// project's accent instead of shipping a hand-traced approximation.
const officialLogo = (slug: string, hex: string) => `https://cdn.simpleicons.org/${slug}/${hex}`;

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
  "OpenAI API":    { color: "#10a37f", logo: officialLogo("openai", "10a37f") },
  "RAG":           { color: "#a855f7", logo: ICON_RAG },
  "Vector DB":     { color: "#14b8a6", logo: ICON_VECTORDB },
  "JWT":           { color: "#d63aff", logo: officialLogo("jsonwebtokens", "d63aff") },
  "shadcn/ui":     { color: "#e4e4e7", logo: officialLogo("shadcnui", "e4e4e7") },
  "Framer Motion": { color: "#bb4af8", logo: officialLogo("framer", "bb4af8") },
};

export const PROJECTS: Project[] = [
  {
    name: "I.Vision",
    year: "2026",
    accent: "#06b6d4",
    accentBg: "rgba(6,182,212,0.10)",
    accentBorder: "rgba(6,182,212,0.28)",
    img: "/ivision-preview.svg",
    description: "Personal AI assistant that answers questions grounded in your own documents instead of general model memory. A type-safe Next.js frontend calls a FastAPI backend, where LangChain orchestrates retrieval over an embedded knowledge base before handing the query to an LLM.",
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
    description: "Fully responsive developer portfolio with an animated dot-grid background, scroll-triggered reveal transitions, and a working contact form. Built with Next.js and Tailwind CSS, deployed on Vercel with automatic CI/CD.",
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
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1600&q=85",
    description: "Preventive health platform that turns lifestyle and family-history intake into a personalized risk score. An LLM-powered assistant generates prevention plans, with interactive charts tracking health metrics over time.",
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
    description: "Personal finance tool that auto-categorizes transactions with the OpenAI API and flags unusual spending patterns. Chart.js dashboards visualize trends, with per-category budgets and threshold alerts.",
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
    description: "Multimodal RAG pipeline that ingests PDFs, images, text and audio into a chunked vector database. LangChain orchestrates retrieval and generation for natural-language queries, with sub-200ms semantic search at production scale.",
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
    img: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=1600&q=85",
    description: "AI study companion that turns any YouTube lecture into structured notes. Paste a URL and VidLearn pulls the transcript via the YouTube API, then uses an LLM to summarize key concepts and generate MCQ quizzes with explanations.",
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
    img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=85",
    description: "Full-featured fashion e-commerce platform with advanced filtering, autocomplete search, and a Redux-powered cart and wishlist. Includes a multi-step checkout flow with address and payment pages, fully responsive end to end.",
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