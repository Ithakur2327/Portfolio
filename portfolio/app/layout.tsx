import type { Metadata } from "next";
import type { Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PdfModalProvider } from "@/components/PdfViewerModal";
import OnekoCatLoader from "@/components/OnekoCatLoader";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import path from "path";
import "./globals.css";


function getAvatarVersion(): string {
  try {
    const dark = readFileSync(path.join(process.cwd(), "public", "avatar-dark.jpg"));
    const light = readFileSync(path.join(process.cwd(), "public", "avatar-light.jpg"));
    return createHash("md5").update(dark).update(light).digest("hex").slice(0, 10);
  } catch {
    return "0";
  }
}

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

// ─── Root Layout ─────
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

        <link rel="preload" as="image" href={`/avatar-dark.jpg?v=${getAvatarVersion()}`} fetchPriority="high" />
        <link rel="preload" as="image" href={`/avatar-light.jpg?v=${getAvatarVersion()}`} fetchPriority="high" />

        {/* Google Fonts: Geist & Geist Mono */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
        />
        <link
          id="gfonts-stylesheet"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
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
            href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          />
        </noscript>
      </head>

      <body suppressHydrationWarning>
        <ThemeProvider>
          <PdfModalProvider>
            <div style={{ position: "relative", zIndex: 1 }}>
              {children}
            </div>

            <OnekoCatLoader />
          </PdfModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}