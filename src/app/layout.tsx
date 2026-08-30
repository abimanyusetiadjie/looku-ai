import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import FloatingChatbot from "@/components/FloatingChatbot";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

export const viewport: Viewport = {
  themeColor: "#181A18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://looku.ai"),
  title: "look.u — Personal Stylist AI & Kurasi OOTD Tropis 33°C",
  description:
    "Kurasi paduan outfit adem di cuaca tropis 33°C, ramah hijab, dan langsung terhubung ke official store Shopee & Tokopedia.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "look.u",
  },
  keywords: [
    "look.u",
    "Looku AI",
    "OOTD AI Indonesia",
    "Personal Color Quiz Indonesia",
    "Outfit Kuliah Hijab",
    "Baju Adem 33 Derajat",
    "Shopee Mall Fashion",
    "Tokopedia Official Fashion",
  ],
  openGraph: {
    title: "look.u AI — Kurasi OOTD Harian Tropis 33°C & Ramah Hijab",
    description: "Bebas bingung pilih baju tiap pagi. Racik formula pakaian adem & personal color dalam 10 detik.",
    url: "https://looku.ai",
    siteName: "look.u AI",
    images: [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80",
        width: 1200,
        height: 630,
        alt: "look.u AI Editorial Lookbook",
      },
    ],
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "look.u AI — Kurasi OOTD Harian Tropis 33°C",
    description: "Bebas bingung pilih baju tiap pagi. Racik formula pakaian adem dalam 10 detik.",
    images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=80"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans antialiased bg-[#FAF8F5] text-[#181A18]">
        {children}
        {/* Floating AI Stylist Chatbot */}
        <FloatingChatbot />
      </body>
    </html>
  );
}
