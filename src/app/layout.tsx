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
  title: "MIES 360 | Recorrido Virtual Arquitectónico",
  description:
    "Explore cada espacio del proyecto arquitectónico MIES 360 con tecnología panorámica interactiva 360°.",
  keywords: [
    "MIES 360",
    "recorrido 360",
    "tour virtual",
    "arquitectura",
    "panorámica",
    "inmobiliaria",
  ],
  authors: [{ name: "MIES 360" }],
  openGraph: {
    title: "MIES 360 | Recorrido Virtual Arquitectónico",
    description:
      "Explore cada espacio del proyecto arquitectónico MIES 360 con tecnología panorámica interactiva 360°.",
    type: "website",
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
