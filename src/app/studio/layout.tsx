import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio Racik Outfit AI & Personal Color Kulit Nusantara | look.u",
  description:
    "Interactive Stylist Studio AI: Padu-padan busana interaktif real-time berdasarkan suhu cuaca hari ini, analisis personal color kulit Nusantara, dan rating breathability pakaian.",
  alternates: {
    canonical: "https://looku.site/studio",
  },
  keywords: [
    "studio ootd ai",
    "personal color analysis indonesia",
    "racik baju online",
    "stylist cuaca tropis",
    "paduan warna sawo matang",
  ],
  openGraph: {
    title: "Studio Racik Outfit AI & Personal Color | look.u",
    description: "Racik gaya OOTD harianmu sesuai suhu dan warna kulit secara interaktif.",
    url: "https://looku.site/studio",
    siteName: "look.u",
    images: [
      {
        url: "/api/og?title=Studio+Racik+Outfit+AI&vibe=Personal+Color+Nusantara",
        width: 1200,
        height: 630,
        alt: "look.u Studio AI",
      },
    ],
  },
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
