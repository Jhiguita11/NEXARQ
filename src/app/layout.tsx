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
  title: "Recorrido Virtual 360° | Constructora Melendez",
  description: "Recorrido virtual arquitectónico 360° - Residencia Verdant. Explore cada espacio de nuestro proyecto inmobiliario de lujo con tecnología panorámica interactiva.",
  keywords: ["recorrido 360", "tour virtual", "arquitectura", "inmobiliaria", "panorámica", "constructora"],
  authors: [{ name: "Constructora Melendez" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "Recorrido Virtual 360° | Residencia Verdant",
    description: "Explore cada espacio de nuestro proyecto inmobiliario de lujo con tecnología panorámica interactiva.",
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
