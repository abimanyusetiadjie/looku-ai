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
  title: "look.u — Curated Daily OOTD & Personal Color Studio",
  description:
    "Personal wardrobe curation for Indonesian climate. Tailored to tropical heat, modest silhouttes, personal color analysis, and local market budget.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "look.u",
  },
  keywords: [
    "look.u",
    "Looku",
    "Looku AI",
    "OOTD AI Indonesia",
    "Curated Wardrobe",
    "Modest Fashion Styling",
    "Shopee Fashion Affiliate",
    "Daily Outfit Lookbook",
  ],
  openGraph: {
    title: "look.u — Curated Daily OOTD & Wardrobe Studio",
    description: "Curated OOTD formulas for Indonesian tropical lifestyle.",
    type: "website",
    locale: "id_ID",
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
