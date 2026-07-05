import type { Metadata } from "next";
import type { Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { MotionProvider } from "@/components/MotionProvider";
import { PerfModeProvider } from "@/components/PerfMode";
import { DotBackground } from "@/components/DotBackground";
import { PdfModalProvider } from "@/components/PdfViewerModal";
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
        {/* DNS prefetch for external logo CDNs used in Skills/Projects */}
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://registry.npmmirror.com" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        {/* Preconnect for the actual project card photos — bigger payload than the logo icons */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />

        {/* Fonts — the site references 'Geist', 'Geist Mono' and 'Press Start 2P'
            by name throughout its components, but none of them were ever
            actually loaded, so every browser silently fell back to a generic
            system font. That mismatch is what made text look fuzzy/inconsistent
            (especially the pixel-style name heading). Loading the real
            families here fixes it everywhere without touching each component. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Loaded as non-blocking: preload the stylesheet, then swap its
            media to "all" once it's fetched. This removes the render-blocking
            round trip to Google Fonts that was stalling first paint — the
            fonts, weights, and fallback behavior are identical, just applied
            a beat sooner instead of holding up the page. */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Press+Start+2P&display=swap"
        />
        <link
          id="gfonts-stylesheet"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Press+Start+2P&display=swap"
          media="print"
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.getElementById('gfonts-stylesheet').addEventListener('load',function(){this.media='all';});",
          }}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Press+Start+2P&display=swap"
          />
        </noscript>
      </head>

      <body>
        <ThemeProvider>
          <MotionProvider>
            <PerfModeProvider>
              <PdfModalProvider>
                <DotBackground />
                <div style={{ position: "relative", zIndex: 1 }}>
                  {children}
                </div>

                {/* 🐱 Pixel cat — client-only, loaded after hydration */}
                <OnekoCatLoader />
              </PdfModalProvider>
            </PerfModeProvider>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}