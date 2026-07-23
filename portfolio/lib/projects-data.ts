// Central project data source.
//
// Add a new project by appending an object to PROJECTS — it will
// automatically show up on the homepage (if within the first 4) and
// always on the /projects page. Every tag used in `tags` must have a
// matching entry in TECH_MAP so its icon renders correctly.

export type Project = {
  name: string;
  year: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  img: string;
  desc: string;
  longDesc: string;
  features: string[];
  tags: string[];
  github: string;
  live: string;
};

export const TECH_MAP: Record<string, { color: string; logo: string }> = {
  "React.js":     { color: "#61DAFB", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
  "Next.js":      { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg" },
  "Node.js":      { color: "#339933", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
  "Express.js":   { color: "#888888", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg" },
  "FastAPI":      { color: "#009688", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg" },
  "MongoDB":      { color: "#47A248", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
  "TypeScript":   { color: "#3178C6", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" },
  "JavaScript":   { color: "#F7DF1E", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
  "Tailwind CSS": { color: "#38BDF8", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg" },
  "Redux":        { color: "#764ABC", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redux/redux-original.svg" },
  "LLM APIs":     { color: "#10a37f", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  "OpenAI API":   { color: "#10a37f", logo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  "LangChain":    { color: "#1C9E6E", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/langchain.svg" },
  "RAG":          { color: "#a855f7", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
  "Vector DB":    { color: "#FF6333", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" },
  "YouTube API":  { color: "#FF0000", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/youtube/youtube-original.svg" },
  "Chart.js":     { color: "#FF6384", logo: "https://www.chartjs.org/img/chartjs-logo.svg" },
  "Socket.io":    { color: "#aaaaaa", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/socketio/socketio-original.svg" },
  "JWT":          { color: "#d63aff", logo: "https://jwt.io/img/pic_logo.svg" },
  "Framer Motion":{ color: "#bb4af8", logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/framer.svg" },
  "shadcn/ui":    { color: "#ffffff", logo: "https://avatars.githubusercontent.com/u/139895814?s=48" },
  "Vercel":       { color: "#ffffff", logo: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg" },
};

export const PROJECTS: Project[] = [
  {
    name: "I.Vision",
    year: "2026",
    accent: "#06b6d4",
    accentBg: "rgba(6,182,212,0.10)",
    accentBorder: "rgba(6,182,212,0.28)",
    img: "/ivision-preview.svg",
    desc: "A personal AI assistant that ingests your own data and answers questions about it in natural language, in context.",
    longDesc: "I.Vision is a personal AI assistant built to actually know your stuff. It ingests your documents and data into a retrieval-augmented pipeline, then answers questions grounded in that context instead of guessing. A Next.js + TypeScript frontend talks to a FastAPI backend, where LangChain orchestrates retrieval over an embedded knowledge base before the query is passed to an LLM for a grounded, conversational response.",
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
    desc: "Personal developer portfolio with animated sections, dark/light mode, 3D cards and smooth reveal animations.",
    longDesc: "A fully responsive developer portfolio showcasing skills, projects and experience. Features a dot-grid animated background, custom reveal animations, 3D tilt cards, infinite scrolling skill ticker and a working contact form. Deployed on Vercel with automatic CI/CD.",
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
    desc: "AI-powered preventive healthcare platform predicting disease risks from lifestyle habits using LLM-powered NexAI assistant.",
    longDesc: "HealthnexAI helps users proactively manage their health. Users input lifestyle data (sleep, diet, stress, activity) and family medical history. NexAI — powered by LLM APIs — generates personalized risk scores and prevention plans. Interactive charts track health metrics over time.",
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
    desc: "AI-driven expense tracker that auto-categorizes transactions and delivers smart budget insights with Chart.js dashboards.",
    longDesc: "An intelligent personal finance tool. Transactions are auto-categorized using OpenAI API. The ML layer detects unusual spending patterns and generates weekly budget insights. Chart.js dashboards visualize trends. Users set budgets per category and receive alerts.",
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
    desc: "RAG-based multimodal summarization for PDFs, images, text and audio with semantic search and sub-200ms query latency.",
    longDesc: "A multimodal RAG pipeline ingesting PDFs, images, text and audio. Documents are chunked and embedded into a Vector DB. LangChain orchestrates retrieval and generation — users query documents with natural language. Supports semantic search with sub-200ms query latency.",
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
    desc: "YouTube learning companion that auto-summarizes lectures, extracts key concepts and generates exam-style quizzes.",
    longDesc: "An AI learning companion for students. Paste any YouTube lecture URL and VidLearn fetches the transcript via YouTube API, then uses LLM APIs to auto-summarize content, extract key concepts into structured notes, and generate MCQ quizzes with explanations.",
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
    desc: "Full-stack fashion e-commerce clone with product listings, search & filters, cart, wishlist and a complete checkout flow.",
    longDesc: "A full-featured fashion e-commerce platform. Includes product browsing with advanced filters (brand, price, size, category), search with autocomplete, cart & wishlist with Redux, a multi-step checkout flow with address and payment pages, fully responsive design.",
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