import type { Metadata } from "next";
import type { Viewport } from "next";
import { ThemeProvider } from "@/components/ThemeProvider";
import { PdfModalProvider } from "@/components/PdfViewerModal";
import { IntroLoader } from "@/components/IntroLoader";
import OnekoCatLoader from "@/components/OnekoCatLoader";
import { Navbar } from "@/components/Navbar";
import ClickSpark from "@/components/ClickSpark";
import { getAvatarVersion } from "@/lib/avatar";
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
  },

  openGraph: {
    title: "Indresh Thakur | AI Engineer & Full Stack Developer",
    description: "AI Engineer & Full Stack Developer.",
    url: "https://ithakur.vercel.app",
    siteName: "Indresh Thakur",
    type: "website",
    images: [
      {
        url: "/portfolio-preview.png",
        width: 1683,
        height: 990,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    images: ["/portfolio-preview.png"],
  },
};

// ─── Root Layout ──────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const avatarVersion = getAvatarVersion();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* DNS prefetch for external logo CDNs used in Skills/Projects */}
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="https://registry.npmmirror.com" />
        <link rel="dns-prefetch" href="https://upload.wikimedia.org" />
        {/* Preconnect for the actual project card photos — bigger payload than the logo icons */}
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />

        {/* Preload only the avatar the visitor will actually see (theme is read
            from localStorage exactly like next-themes does) so the hero photo
            is fetched in parallel with JS instead of after hydration. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':true;var l=document.createElement('link');l.rel='preload';l.as='image';l.fetchPriority='high';l.href='/avatar-'+(d?'dark':'light')+'.jpg?v=${avatarVersion}';document.head.appendChild(l);}catch(e){}})();`,
          }}
        />

        {/* Fonts — the site references 'Geist' and 'Geist Mono' by name
            throughout its components, but neither was ever actually loaded,
            so every browser silently fell back to a generic system font.
            That mismatch is what made text look fuzzy/inconsistent. Loading
            the real families here fixes it everywhere without touching
            each component. The pixel-style name heading uses the
            self-hosted 'Geist Pixel Square' family (see globals.css
            @font-face) instead of a Google Fonts request. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Loaded as non-blocking: preload the stylesheet, then swap its
            media to "all" once it's fetched. This removes the render-blocking
            round trip to Google Fonts that was stalling first paint — the
            fonts, weights, and fallback behavior are identical, just applied
            a beat sooner instead of holding up the page. */}
        {/* eslint-disable @next/next/no-page-custom-font -- that rule targets
            Pages Router per-page `_document.js` overrides, which only load
            fonts on one route; it doesn't apply to the App Router root
            layout, which already wraps every route by definition. */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Fraunces:opsz,wght,SOFT@9..144,100..900,0..100&family=Press+Start+2P&display=swap"
        />
        <link
          id="gfonts-stylesheet"
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Fraunces:opsz,wght,SOFT@9..144,100..900,0..100&family=Press+Start+2P&display=swap"
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
            href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&family=Geist+Mono:wght@400;500;600&family=Fraunces:opsz,wght,SOFT@9..144,100..900,0..100&family=Press+Start+2P&display=swap"
          />
        </noscript>
        {/* eslint-enable @next/next/no-page-custom-font */}
      </head>

      <body suppressHydrationWarning>
        {/* Runs synchronously as soon as the parser reaches <body>, i.e.
            before any hero markup below is parsed/painted and long before
            React hydrates. Paints the entire "loading" visual for
            IntroLoader (see components/IntroLoader.tsx) — this element
            owns it exclusively for the whole loading hold; React doesn't
            touch it until the exact moment flight begins, so the intro
            screen is always what the person sees first (never the hero
            section flashing underneath it), and its animations never get
            recreated/restarted mid-hold. */}
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
                // Resolve the theme ourselves instead of reading
                // d.classList.contains('dark') — next-themes' own
                // theme-setting script (rendered inside <ThemeProvider>,
                // i.e. AFTER this script in document order) hasn't run
                // yet at this point, so that class is never present here
                // and this always picked the light avatar/background
                // regardless of the visitor's actual theme. Mirrors
                // next-themes' own algorithm exactly (storageKey="theme",
                // defaultTheme="dark") so the two never disagree.
                var stored = null;
                try { stored = localStorage.getItem('theme'); } catch (e) {}
                var isDark = stored ? stored === 'dark' : true;
                var src = (isDark ? '/avatar-dark.jpg' : '/avatar-light.jpg') + '?v=${avatarVersion}';
                var shell = document.createElement('div');
                shell.id = 'intro-shell';
                // This shell owns the entire loading-hold visual by
                // itself — its ring/breathe/dot CSS animations run
                // continuously and are NEVER recreated by React (see
                // components/IntroLoader.tsx). React only reads this
                // element's live rect once, at the exact moment flight
                // begins, then removes it and mounts a flying clone in
                // its place — a single one-time hand-off rather than a
                // continuous animation being swapped out from under
                // itself, which is what used to cause visible stutter.
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
                        <ClickSpark
              sparkColor={["#0ABAB5", "#D4AF37"]}
              sparkSize={8}
              sparkRadius={36}
              sparkCount={8}
              sparkWidth={1.5}
              duration={480}
              glow={0.25}
            >
              <Navbar />
              <div style={{ position: "relative", zIndex: 1 }}>
                {children}
              </div>
            </ClickSpark>

            {/* 🐱 Pixel cat — client-only, loaded after hydration */}
            <OnekoCatLoader />

            {/* One-time landing sequence: avatar + dots → flies into the
                hero section and settles. See components/IntroLoader.tsx */}
            <IntroLoader />
          </PdfModalProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}