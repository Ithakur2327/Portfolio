import type { Metadata } from "next";
import type { Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DotBackground } from "@/components/DotBackground";
import OnekoCatLoader from "@/components/OnekoCatLoader";
import "./globals.css";

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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://registry.npmmirror.com" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
      </head>

      <body>
        <ThemeProvider>
          <DotBackground />
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>

          {/* 🐱 Pixel cat — client-only, loaded after hydration */}
          <OnekoCatLoader />
        </ThemeProvider>
      </body>
    </html>
  );
}