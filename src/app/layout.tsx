import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIES 360 | Recorrido Virtual Arquitectónico",
  description: "Explore cada espacio del proyecto arquitectónico MIES 360 con tecnología panorámica interactiva 360°.",
  keywords: ["MIES 360", "recorrido 360", "tour virtual", "arquitectura", "panorámica", "inmobiliaria"],
  authors: [{ name: "MIES 360" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "MIES 360 | Recorrido Virtual Arquitectónico",
    description: "Explore cada espacio del proyecto arquitectónico MIES 360 con tecnología panorámica interactiva 360°.",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-foreground overflow-hidden`}
        style={{ margin: 0, padding: 0, width: '100vw', height: '100vh' }}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
