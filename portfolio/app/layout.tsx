import type { Metadata } from "next";
import type { Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PdfModalProvider } from "@/components/PdfViewerModal";
import { IntroLoader } from "@/components/IntroLoader";
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

// ─── Viewport ──────
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f3" },
  ],
};

// ─── Metadata ───────
export const metadata: Metadata = {
  metadataBase: new URL("https://ithakur.vercel.app"),

  title: "Indresh Thakur | AI Engineer & Full Stack Developer",

  description:
    "Portfolio of Indresh Thakur. AI Engineer, Full Stack Developer, MERN Stack, Machine Learning, GenAI and Agentic AI.",

  keywords: [
    "Indresh Thakur",
    "AI Engineer",
    "Full Stack Developer",
    "MERN",
    "Next.js",
    "Machine Learning",
    "Portfolio"
  ],

  authors: [
    {
      name: "Indresh Thakur",
    },
  ],

  robots: {
    index: true,
    follow: true,
  },

  alternates: {
    canonical: "https://ithakur.vercel.app",
  },

  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    title: "Indresh Thakur | AI Engineer & Full Stack Developer",
    description: "AI Engineer & Full Stack Developer.",
    url: "https://ithakur.vercel.app",
    siteName: "Indresh Thakur",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    images: ["/og-image.png"],
  },
};

// ─── Root Layout ───
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://registry.npmmirror.com" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />

        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={`/avatar-dark.jpg?v=${getAvatarVersion()}`} fetchPriority="high" crossOrigin="anonymous" />
        <link rel="preload" as="image" href={`/avatar-light.jpg?v=${getAvatarVersion()}`} fetchPriority="high" crossOrigin="anonymous" />
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  if (sessionStorage.getItem('introPlayed:v1') === '1') return;
                } catch (e) {}
                if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
                var d = document.documentElement;
                d.classList.add('intro-active');
                var stored = null;
                try { stored = localStorage.getItem('theme'); } catch (e) {}
                var isDark = stored ? stored === 'dark' : true;
                var src = isDark ? '/avatar-dark.jpg' : '/avatar-light.jpg';
                var shell = document.createElement('div');
                shell.id = 'intro-shell';
                window.__introAnimStart = performance.now();
                shell.innerHTML =
                  '<div class="intro-shell-avatar">' +
                    '<div class="intro-shell-ring"></div>' +
                    '<div class="intro-shell-imgwrap"><img src="' + src + '" alt=""/></div>' +
                  '</div>' +
                  '<div class="intro-shell-dots"><span></span><span></span><span></span></div>';
                document.body.appendChild(shell);
              })();
            `,
          }}
        />

        <ThemeProvider>
          <PdfModalProvider>
            <div style={{ position: "relative", zIndex: 1 }}>
              {children}
            </div>
            <OnekoCatLoader />
            <IntroLoader />
          </PdfModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}