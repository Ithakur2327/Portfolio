import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { unoptimized: true },

  // FIX: HTTP headers for GPU compositing hints + caching
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Enable hardware acceleration hints
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        // FIX: Cache static assets aggressively — avatars, fonts won't change
        source: "/(:path*\\.jpg|:path*\\.png|:path*\\.webp|:path*\\.ico|:path*\\.svg)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },

  // FIX: Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // FIX: Experimental — reduces JS bundle size
  experimental: {
    optimizePackageImports: ["motion"],
  },
};

export default nextConfig;
