import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    cssChunking: true,
  },
};

export default nextConfig;
