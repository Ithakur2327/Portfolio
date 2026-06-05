import type { Metadata } from "next";
import type { Viewport } from "next";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const DynamicDotBackground = dynamic(
  () => import("@/components/DotBackground").then((mod) => mod.DotBackground),
  { ssr: false }
);
const DynamicOnekoCatLoader = dynamic(
  () => import("@/components/OnekoCatLoader").then((mod) => mod.default),
  { ssr: false }
);

// ─── Viewport ─────────────────────────────────────────────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
  ],
};

// ─── Metadata ─────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Indresh Thakur — Full-Stack & AI Developer",
  description:
    "Computer science student (AI specialization) at NIET, passionate about full-stack development and generative AI systems.",
  keywords: [
    "Indresh Thakur",
    "Full-Stack Developer",
    "AI Developer",
    "React",
    "Next.js",
    "Node.js",
    "LLM",
    "NIET",
  ],
  authors: [{ name: "Indresh Thakur" }],
  openGraph: {
    title: "Indresh Thakur — Full-Stack & AI Developer",
    description: "Building real-world apps with code.",
    type: "website",
  },
};

// ─── Root Layout ──────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />

      <body>
        <ThemeProvider>
          <DynamicDotBackground />
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>

          {/* 🐱 Pixel cat — client-only, loaded after hydration */}
          <DynamicOnekoCatLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}