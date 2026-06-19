import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Next.js NO prefija con basePath las URLs de metadata (icons/og). Lo hacemos
// manualmente para que funcionen tanto en GitHub Pages (/NEXARQ) como en raiz.
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "VALLE ALTO | Recorrido Virtual 360°",
  description:
    "Explore cada espacio de Valle Alto — Constructora Meléndez con tecnología panorámica interactiva 360°.",
  keywords: [
    "Valle Alto",
    "Constructora Meléndez",
    "recorrido 360",
    "tour virtual",
    "arquitectura",
    "panorámica",
    "inmobiliaria",
  ],
  authors: [{ name: "NEXARQ 360" }],
  icons: {
    icon: [
      { url: `${BASE}/favicon.svg`, type: "image/svg+xml" },
      { url: `${BASE}/icon.png`, type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: `${BASE}/apple-icon.png`, sizes: "180x180" }],
  },
  openGraph: {
    title: "VALLE ALTO | Recorrido Virtual 360°",
    description:
      "Explore cada espacio de Valle Alto — Constructora Meléndez con tecnología panorámica interactiva 360°.",
    type: "website",
    images: [
      {
        url: `${BASE}/building-mobile.jpg`,
        width: 1600,
        height: 900,
        alt: "Valle Alto — Constructora Meléndez",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VALLE ALTO | Recorrido Virtual 360°",
    description: "Explore cada espacio de Valle Alto con tecnología panorámica interactiva 360°.",
    images: [`${BASE}/building-mobile.jpg`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Preconexión al CDN del visor 360 (Pannellum) para que cargue antes
            al entrar a un recorrido. */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        {/* Preload del hero del selector — empieza a descargarse en paralelo
            con el JS, mientras corre el splash. Versión según viewport. */}
        <link rel="preload" as="image" href={`${BASE}/building-mobile.jpg`} media="(max-width: 767px)" />
        <link rel="preload" as="image" href={`${BASE}/building.jpg`} media="(min-width: 768px)" />
      </head>
      <body
        className={`${inter.variable} antialiased bg-black text-white overflow-hidden`}
        style={{ margin: 0, padding: 0, width: "100vw", height: "100vh" }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
