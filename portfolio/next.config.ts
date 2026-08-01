import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  productionBrowserSourceMaps: false,
  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [375, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    dangerouslyAllowSVG: false,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        // The in-app PDF viewer (resume / certificates) loads this file inside
        // an <iframe>. "X-Frame-Options: DENY" above blocks that even though
        // it's same-origin, so we relax it just for the PDF to allow framing
        // from this site only — fixes the resume not rendering in the modal.
        source: "/resume.pdf",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/:path*.jpg",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.jpeg",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.avif",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.ico",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.svg",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:path*.woff2",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    // NOTE: do NOT add "motion" here. Next's optimizePackageImports rewrites
    // it into deep per-module imports at build time (production only, dev
    // is unaffected) which breaks the shared internal state that motion's
    // layoutId / shared-layout (morph) animations depend on. This is why
    // the project-card morph worked on localhost but silently stopped
    // working after deploying — the prod build was the only one applying
    // this rewrite.
  },

  compress: true,
  reactStrictMode: true,

  // Performance: disable x-powered-by header
  poweredByHeader: false,

  // Output standalone for smaller Docker images
  // output: "standalone",
};

export default nextConfig;