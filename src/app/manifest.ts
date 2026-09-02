import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "look.u — AI Stylist & Tropical OOTD Studio",
    short_name: "look.u AI",
    description: "Your personal AI stylist untuk daily OOTD yang effortless, adem di cuaca tropis 33°C, ramah hijab & personal color Indonesia.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F5",
    theme_color: "#181A18",
    orientation: "portrait",
    categories: ["lifestyle", "shopping", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
    shortcuts: [
      {
        name: "Studio OOTD",
        url: "/studio",
        description: "Buka Studio Racik OOTD AI",
      },
      {
        name: "Trending Lookbook",
        url: "/#trending",
        description: "Lihat inspirasi gaya harian terpopuler",
      },
      {
        name: "Profil & Lemari",
        url: "/profile",
        description: "Akses lemari outfit dan style DNA kamu",
      },
    ],
  };
}
