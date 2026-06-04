import type { NextConfig } from "next";

// Despliegue en la RAIZ del dominio (sin subcarpeta).
// Si en el futuro se publica bajo una subcarpeta, definir basePath/assetPrefix
// con el nombre de esa carpeta (ej. basePath: "/valle-alto").
const nextConfig: NextConfig = {
  output: "export",
  basePath: "",
  assetPrefix: "",
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
