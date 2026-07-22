import type { NextConfig } from "next";

// Subcarpeta de despliegue, controlada por variable de entorno:
//   • GitHub Pages  -> NEXT_PUBLIC_BASE_PATH="/NEXARQ" (lo pone el workflow)
//   • Raiz dominio  -> sin variable
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Build "portable" (ZIP para entregar): rutas RELATIVAS con assetPrefix "./"
// NATIVO de Next, para servir el tour desde CUALQUIER subcarpeta sin recompilar
// y sin post-procesar el HTML. Se activa con NEXT_PUBLIC_PORTABLE_BUILD=1.
// (Post-procesar /_next/ a mano corrompe la hidratación de Turbopack; por eso
// se usa assetPrefix nativo, igual que en el proyecto Mirriñao.)
const portable = process.env.NEXT_PUBLIC_PORTABLE_BUILD === "1";

const nextConfig: NextConfig = {
  output: "export",
  basePath: portable ? "" : basePath,
  assetPrefix: portable ? "./" : basePath ? `${basePath}/` : "",
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
