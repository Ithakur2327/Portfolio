import type { Config } from "tailwindcss";
import bp from "./lib/breakpoints.json";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Screens are derived from lib/breakpoints.json — the single source
    // of truth shared with every component's inline media queries and
    // with globals.css. Do not hardcode pixel values here; edit the
    // JSON file instead so every consumer stays in sync.
    screens: {
      sm: `${bp.tabletMin}px`, // 600  — tablet and up
      md: `${bp.laptopMin}px`, // 1025 — laptop and up
      lg: `${bp.laptopWideMin}px`, // 1181 — wide laptop and up
      xl: `${bp.desktopMin}px`, // 1600 — desktop and up
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        "surface": "rgba(255,255,255,0.03)",
        "surface-hover": "rgba(255,255,255,0.06)",
        "border-subtle": "rgba(255,255,255,0.08)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
        "shimmer": "shimmer 2s linear infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;