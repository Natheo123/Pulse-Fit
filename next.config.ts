import type { NextConfig } from "next";

const isMobile = process.env.MOBILE_BUILD === "1";

const nextConfig: NextConfig = {
  // APK Capacitor = site statique dans le WebView
  ...(isMobile
    ? {
        output: "export" as const,
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {
        cacheComponents: true,
        partialPrefetching: true,
        images: {
          remotePatterns: [
            {
              protocol: "https",
              hostname: "img.youtube.com",
              pathname: "/vi/**",
            },
            {
              protocol: "https",
              hostname: "images.unsplash.com",
              pathname: "/**",
            },
            {
              protocol: "https",
              hostname: "apilyfta.com",
              pathname: "/static/**",
            },
            {
              protocol: "https",
              hostname: "lyfta.app",
              pathname: "/images/**",
            },
          ],
        },
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
