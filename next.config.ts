import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  experimental: { cpus: 2, staticGenerationMaxConcurrency: 2 },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jacelcastillo.com.co",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
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
