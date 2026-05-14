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
  title: "GUAYACANES | Recorrido Virtual 360°",
  description:
    "Explore cada espacio del proyecto Guayacanes con tecnología panorámica interactiva 360°.",
  keywords: [
    "Guayacanes",
    "recorrido 360",
    "tour virtual",
    "arquitectura",
    "panorámica",
    "inmobiliaria",
  ],
  authors: [{ name: "NEXARQ 360" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "GUAYACANES | Recorrido Virtual 360°",
    description:
      "Explore cada espacio del proyecto Guayacanes con tecnología panorámica interactiva 360°.",
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
