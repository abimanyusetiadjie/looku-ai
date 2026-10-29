import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Katalog Lookbook OOTD Cuaca Panas 33°C & Ramah Hijab | look.u",
  description:
    "Eksplorasi 300+ inspirasi gaya OOTD tropis anti-gerah untuk wanita, pria, dan modest hijab. Lengkap dengan komposisi bahan breathable, palet warna, dan link belanja official Shopee & Tokopedia.",
  alternates: {
    canonical: "https://looku.site/lookbook",
  },
  keywords: [
    "lookbook ootd tropis",
    "outfit cuaca panas",
    "ootd hijab casual",
    "baju adem 33 derajat",
    "rekomendasi ootd scbd",
    "gaya linen modest",
    "outfit sawo matang",
    "lookbook shopee fashion",
  ],
  openGraph: {
    title: "Katalog Lookbook OOTD Cuaca Panas 33°C | look.u",
    description: "300+ Formula Outfit Terkurasi Ramah Cuaca Panas & Hijab Friendly.",
    url: "https://looku.site/lookbook",
    siteName: "look.u",
    images: [
      {
        url: "/api/og?title=Katalog+Lookbook+300+OOTD+Tropis&vibe=Ramah+Hijab+%26+Adem+33C",
        width: 1200,
        height: 630,
        alt: "look.u Lookbook Catalog",
      },
    ],
  },
};

export default function LookbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
