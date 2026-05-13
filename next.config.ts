import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "preview-chat-f8a73ff9-3482-4619-8282-f00f87dc885f.space-z.ai",
  ],
};

export default nextConfig;
