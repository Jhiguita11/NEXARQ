import type { NextConfig } from "next";

// Subcarpeta de despliegue, controlada por variable de entorno:
//   • GitHub Pages  -> NEXT_PUBLIC_BASE_PATH="/NEXARQ" (lo pone el workflow)
//   • Raiz dominio  -> sin variable (build local para la constructora)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : "",
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  devIndicators: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
