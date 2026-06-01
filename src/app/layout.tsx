import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

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
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: "VALLE ALTO | Recorrido Virtual 360°",
    description:
      "Explore cada espacio de Valle Alto — Constructora Meléndez con tecnología panorámica interactiva 360°.",
    type: "website",
    images: [
      {
        url: "/projects/melendez/valle-alto/panoramas/tipo-b/sala.jpg",
        width: 1200,
        height: 630,
        alt: "Sala Comedor — Apartamento Tipo B, Valle Alto",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VALLE ALTO | Recorrido Virtual 360°",
    description: "Explore cada espacio de Valle Alto con tecnología panorámica interactiva 360°.",
    images: ["/projects/melendez/valle-alto/panoramas/tipo-b/sala.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
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
