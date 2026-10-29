import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tes Personal Color Kulit Nusantara Online Gratis | look.u",
  description:
    "Ikuti kuis personal color 60 detik untuk mengenali undertone kulitmu (Warm Autumn, Cool Summer, Neutral). Temukan palet warna pakaian terbaik yang mencerahkan wajah tanpa gerah.",
  alternates: {
    canonical: "https://looku.site/kuesioner",
  },
  keywords: [
    "tes personal color indonesia",
    "kuis undertone kulit",
    "warna baju sawo matang",
    "personal color quiz gratis",
  ],
  openGraph: {
    title: "Tes Personal Color Kulit Nusantara Online Gratis | look.u",
    description: "Kenali undertone kulitmu dan dapatkan palet warna pakaian yang paling cocok.",
    url: "https://looku.site/kuesioner",
    siteName: "look.u",
    images: [
      {
        url: "/api/og?title=Tes+Personal+Color+Nusantara&vibe=Temukan+Warna+Busana+Terbaikmu",
        width: 1200,
        height: 630,
        alt: "Personal Color Test look.u",
      },
    ],
  },
};

export default function KuesionerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
