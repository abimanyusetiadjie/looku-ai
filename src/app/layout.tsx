import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import FloatingChatbot from "@/components/FloatingChatbot";
import BottomNav from "@/components/BottomNav";
import ResearchBanner from "@/components/ResearchBanner";
import SplashScreen from "@/components/SplashScreen";
import ImageFallbackGuard from "@/components/ImageFallbackGuard";

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
  metadataBase: new URL("https://looku.site"),
  alternates: {
    canonical: "https://looku.site",
  },
  title: "look.u — Personal Stylist AI & Kurasi OOTD Tropis 33°C",
  description:
    "Kurasi paduan outfit adem di cuaca tropis 33°C, ramah hijab dan modest fashion, analisis personal color kulit Nusantara, terhubung langsung ke Shopee & Tokopedia.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "look.u",
  },
  keywords: [
    "look.u",
    "looku.site",
    "Looku AI",
    "OOTD AI Indonesia",
    "Personal Color Quiz Indonesia",
    "Outfit Kuliah Hijab",
    "Baju Adem 33 Derajat",
    "Rekomendasi Outfit Tropis",
    "Fashion Stylist AI Sawo Matang",
    "Shopee Mall Fashion",
    "Tokopedia Official Fashion",
  ],
  openGraph: {
    title: "look.u AI — Kurasi OOTD Harian Tropis 33°C & Ramah Hijab",
    description: "Bebas bingung pilih baju tiap pagi. Racik formula pakaian adem & personal color dalam 10 detik.",
    url: "https://looku.site",
    siteName: "look.u AI",
    images: [
      {
        url: "/api/og",
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
    images: ["/api/og"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://looku.site/#website",
      "url": "https://looku.site",
      "name": "look.u",
      "alternateName": ["look.u AI", "Looku Fashion Tech"],
      "description": "Personal Stylist AI & Kurasi OOTD Tropis 33°C Ramah Hijab",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://looku.site/lookbook?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Organization",
      "@id": "https://looku.site/#organization",
      "name": "look.u AI",
      "url": "https://looku.site",
      "logo": "https://looku.site/api/og",
      "description": "Platform riset fashion-tech personal stylist cerdas cuaca tropis Nusantara.",
      "sameAs": ["https://github.com/abimanyusetiadjie/looku-ai"],
    },
    {
      "@type": "WebApplication",
      "@id": "https://looku.site/#webapp",
      "name": "look.u Personal Stylist AI",
      "applicationCategory": "LifestyleApplication",
      "operatingSystem": "All",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "url": "https://looku.site",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "IDR",
      },
      "featureList": [
        "Kurasi 300+ Formula OOTD Tropis 33°C",
        "Personal Color Analysis Kulit Nusantara",
        "Visual Search AI Kamera Galeri",
        "Deep-Link Belanja Shopee & Tokopedia Official",
      ],
    },
    {
      "@type": "FAQPage",
      "@id": "https://looku.site/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Apa itu look.u AI?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "look.u adalah platform kurasi gaya berbusana berbasis AI yang dirancang khusus untuk kenyamanan iklim tropis 33°C, ramah hijab dan modest fashion, dengan algoritma personal color kulit Nusantara.",
          },
        },
        {
          "@type": "Question",
          "name": "Bagaimana cara kerja analisis Personal Color di look.u?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pengguna dapat mengikuti kuis interaktif atau mengunggah foto untuk mendeteksi warna kulit (Warm Autumn, Cool Summer, Sawo Matang, Kuning Langsat) guna mencocokkan palet warna busana yang membuat wajah tampak segar berseri.",
          },
        },
        {
          "@type": "Question",
          "name": "Apakah pakaian yang direkomendasikan dapat langsung dibeli?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ya, setiap pakaian terkurasi dilengkapi tautan langsung ke official store marketplace Shopee dan Tokopedia dengan estimasi harga transparan.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${jakarta.variable} ${playfair.variable} scroll-smooth`}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#FAF8F5] text-[#181A18]">
        <SplashScreen />
        <ImageFallbackGuard />
        {children}
        {/* Floating AI Stylist Chatbot */}
        <BottomNav />
        <FloatingChatbot />
        <ResearchBanner />
      </body>
    </html>
  );
}
