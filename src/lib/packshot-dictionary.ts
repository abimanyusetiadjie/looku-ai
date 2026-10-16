/**
 * =====================================================================
 * SISTEM HYBRID 3-LAPIS: PACKSHOT DICTIONARY & SMART CROP RESOLVER
 * =====================================================================
 * Lapis 1: CLEAN_PACKSHOT_DICTIONARY
 * Kamus packshot studio berlatar bersih (#EFECE6 / putih studio)
 * dikelompokkan berdasarkan sub-kategori busana dan rumpun warna netral.
 * 
 * Lapis 2: Smart Auto-Crop Koordinat Vertikal
 * Untuk atasan, bawahan, dan hijab pada foto model editorial utama.
 * CATATAN STRICT: Sepatu (Pin 4) DILARANG auto-crop dan WAJIB Lapis 1.
 */

import { OutfitItem } from "./types";

export type ColorFamily =
  | "black"
  | "white_cream"
  | "earth_brown"
  | "navy_blue"
  | "sage_olive"
  | "pastel";

export interface SmartVisualResult {
  imageUrl: string;
  cropConfig?: {
    isCrop: boolean;
    position: string;
    scale: string;
    heroUrl: string;
  };
}

/**
 * CLEAN_PACKSHOT_DICTIONARY
 * Packshot studio foto tunggal bersih, resolusi tinggi, tanpa watermark/sticker penjualan.
 */
export const CLEAN_PACKSHOT_DICTIONARY = {
  shoes: {
    mules: {
      cream: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80",
      tan: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?auto=format&fit=crop&w=800&q=80",
      black: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?auto=format&fit=crop&w=800&q=80",
      default: "https://images.unsplash.com/photo-1562273138-f46be4ebdf33?auto=format&fit=crop&w=800&q=80",
    },
    loafers: {
      black: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
      brown: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
      taupe: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      default: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    },
    sneakers: {
      white: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
      cream: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=800&q=80",
      black: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
      default: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    },
    heels: {
      nude: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
      black: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80",
      champagne: "https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=800&q=80",
      default: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80",
    },
  },
  hijab: {
    navy: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    earth_tone: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=800&q=80",
    pastel: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    ivory: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80",
    charcoal: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80",
    sage: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80",
    default: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?auto=format&fit=crop&w=800&q=80",
  },
  bottom: {
    charcoal: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80",
    cream: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    denim: "https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80",
    terracotta: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    default: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?auto=format&fit=crop&w=800&q=80",
  },
} as const;

/**
 * Deteksi Rumpun Warna dari Teks Nama / Warna / Hex Code
 */
export function detectColorFamily(text?: string, hex?: string): ColorFamily {
  const t = (text || "").toLowerCase();
  const h = (hex || "").toLowerCase();

  // 1. Black / Charcoal
  if (
    t.includes("black") ||
    t.includes("hitam") ||
    t.includes("charcoal") ||
    t.includes("dark") ||
    t.includes("gelap") ||
    h === "#181a18" ||
    h === "#111111" ||
    h === "#000000" ||
    h === "#2b2620"
  ) {
    return "black";
  }

  // 2. White / Cream / Broken White / Sand
  if (
    t.includes("white") ||
    t.includes("putih") ||
    t.includes("cream") ||
    t.includes("krem") ||
    t.includes("ivory") ||
    t.includes("broken white") ||
    t.includes("beige") ||
    t.includes("oatmeal") ||
    t.includes("bone") ||
    h === "#ffffff" ||
    h === "#faf8f5" ||
    h === "#efece6" ||
    h === "#f3efe6"
  ) {
    return "white_cream";
  }

  // 3. Earth / Brown / Terracotta / Mocca / Tan
  if (
    t.includes("brown") ||
    t.includes("coklat") ||
    t.includes("tan") ||
    t.includes("terracotta") ||
    t.includes("mocca") ||
    t.includes("khaki") ||
    t.includes("camel") ||
    t.includes("biscuit") ||
    t.includes("caramel") ||
    t.includes("earth")
  ) {
    return "earth_brown";
  }

  // 4. Navy / Blue / Denim / Sky
  if (
    t.includes("navy") ||
    t.includes("blue") ||
    t.includes("biru") ||
    t.includes("denim") ||
    t.includes("indigo") ||
    t.includes("sky") ||
    t.includes("ocean")
  ) {
    return "navy_blue";
  }

  // 5. Sage / Olive / Green
  if (
    t.includes("sage") ||
    t.includes("olive") ||
    t.includes("green") ||
    t.includes("hijau") ||
    t.includes("matcha") ||
    t.includes("forest")
  ) {
    return "sage_olive";
  }

  // 6. Pastel / Pink / Blush / Lilac / Mauve
  if (
    t.includes("pastel") ||
    t.includes("pink") ||
    t.includes("blush") ||
    t.includes("rose") ||
    t.includes("lilac") ||
    t.includes("mauve") ||
    t.includes("peach")
  ) {
    return "pastel";
  }

  return "white_cream";
}

/**
 * Resolver Gambar Bersih untuk Sepatu (Pin 4)
 * Strict Rule: Sepatu selalu menggunakan gambar packshot katalog bersih dari Lapis 1.
 */
export function resolveCleanShoePackshot(
  name?: string,
  color?: string,
  colorHex?: string
): string {
  const n = (name || "").toLowerCase();
  const c = (color || "").toLowerCase();
  const combined = `${n} ${c}`;
  const family = detectColorFamily(combined, colorHex);

  // 1. Loafers / Formal Oxford
  if (
    n.includes("loafer") ||
    n.includes("oxford") ||
    n.includes("pantofel") ||
    n.includes("derby") ||
    n.includes("docmart")
  ) {
    if (family === "black") return CLEAN_PACKSHOT_DICTIONARY.shoes.loafers.black;
    if (family === "earth_brown") return CLEAN_PACKSHOT_DICTIONARY.shoes.loafers.brown;
    return CLEAN_PACKSHOT_DICTIONARY.shoes.loafers.taupe;
  }

  // 2. Mules & Sandals
  if (
    n.includes("mule") ||
    n.includes("sandal") ||
    n.includes("slip on") ||
    n.includes("slide") ||
    n.includes("flat")
  ) {
    if (family === "black") return CLEAN_PACKSHOT_DICTIONARY.shoes.mules.black;
    if (family === "earth_brown") return CLEAN_PACKSHOT_DICTIONARY.shoes.mules.tan;
    return CLEAN_PACKSHOT_DICTIONARY.shoes.mules.cream;
  }

  // 3. Heels & Pumps
  if (
    n.includes("heel") ||
    n.includes("hak") ||
    n.includes("pump") ||
    n.includes("stiletto") ||
    n.includes("strappy")
  ) {
    if (family === "black") return CLEAN_PACKSHOT_DICTIONARY.shoes.heels.black;
    if (family === "white_cream" || family === "pastel") return CLEAN_PACKSHOT_DICTIONARY.shoes.heels.champagne;
    return CLEAN_PACKSHOT_DICTIONARY.shoes.heels.nude;
  }

  // 4. Sneakers & Casual Athletic (Default Footwear)
  if (family === "black") return CLEAN_PACKSHOT_DICTIONARY.shoes.sneakers.black;
  if (family === "earth_brown" || family === "sage_olive") return CLEAN_PACKSHOT_DICTIONARY.shoes.sneakers.cream;
  return CLEAN_PACKSHOT_DICTIONARY.shoes.sneakers.white;
}

/**
 * Resolver Gambar Bersih untuk Tekstur Hijab Lipatan Studio
 */
export function resolveCleanHijabPackshot(
  name?: string,
  color?: string,
  colorHex?: string
): string {
  const combined = `${name || ""} ${color || ""}`;
  const family = detectColorFamily(combined, colorHex);

  switch (family) {
    case "navy_blue":
      return CLEAN_PACKSHOT_DICTIONARY.hijab.navy;
    case "earth_brown":
      return CLEAN_PACKSHOT_DICTIONARY.hijab.earth_tone;
    case "pastel":
      return CLEAN_PACKSHOT_DICTIONARY.hijab.pastel;
    case "black":
      return CLEAN_PACKSHOT_DICTIONARY.hijab.charcoal;
    case "sage_olive":
      return CLEAN_PACKSHOT_DICTIONARY.hijab.sage;
    case "white_cream":
    default:
      return CLEAN_PACKSHOT_DICTIONARY.hijab.ivory;
  }
}

/**
 * Smart Visual Resolver (Lapis 1 & Lapis 2 Hybrid)
 * Memetakan setiap komponen busana ke representasi visual presisi tinggi.
 */
export function resolveSmartItemVisual(
  item: OutfitItem | undefined,
  slotKey: "top" | "bottom" | "outer" | "shoes",
  heroImage?: string
): SmartVisualResult {
  const itemName = item?.name || "";
  const itemColor = item?.color || "";
  const itemHex = item?.colorHex;
  const isHijab =
    itemName.toLowerCase().includes("hijab") ||
    itemName.toLowerCase().includes("pashmina") ||
    itemName.toLowerCase().includes("voal") ||
    itemName.toLowerCase().includes("segiempat");

  // ATURAN PRESISI 1: Sepatu (Pin 4) DILARANG auto-crop! Selalu gunakan packshot studio bersih Lapis 1.
  if (slotKey === "shoes") {
    const cleanUrl = resolveCleanShoePackshot(itemName, itemColor, itemHex);
    return {
      imageUrl: cleanUrl,
    };
  }

  // ATURAN PRESISI 2: Atasan (Pin 2) -> Smart Auto-Crop Torso Model (50% 35% scale 125%)
  if (slotKey === "top") {
    if (heroImage) {
      return {
        imageUrl: heroImage,
        cropConfig: {
          isCrop: true,
          position: "object-[50%_35%]",
          scale: "scale-125",
          heroUrl: heroImage,
        },
      };
    }
    return {
      imageUrl: item?.imageUrl || CLEAN_PACKSHOT_DICTIONARY.bottom.default,
    };
  }

  // ATURAN PRESISI 3: Bawahan (Pin 3) -> Smart Auto-Crop Pinggang-Kaki (50% 72% scale 125%)
  if (slotKey === "bottom") {
    if (heroImage) {
      return {
        imageUrl: heroImage,
        cropConfig: {
          isCrop: true,
          position: "object-[50%_72%]",
          scale: "scale-125",
          heroUrl: heroImage,
        },
      };
    }
    const family = detectColorFamily(`${itemName} ${itemColor}`, itemHex);
    let fallback: string = CLEAN_PACKSHOT_DICTIONARY.bottom.default;
    if (family === "navy_blue" || itemName.toLowerCase().includes("denim") || itemName.toLowerCase().includes("jeans")) {
      fallback = CLEAN_PACKSHOT_DICTIONARY.bottom.denim;
    } else if (family === "white_cream") {
      fallback = CLEAN_PACKSHOT_DICTIONARY.bottom.cream;
    } else if (family === "earth_brown") {
      fallback = CLEAN_PACKSHOT_DICTIONARY.bottom.terracotta;
    }
    return {
      imageUrl: item?.imageUrl || fallback,
    };
  }

  // ATURAN PRESISI 4: Outer / Hijab (Pin 1)
  if (slotKey === "outer") {
    if (isHijab) {
      // Untuk hijab, jika ada foto model utama, gunakan crop area kepala (50% 12% scale 150%)
      if (heroImage) {
        return {
          imageUrl: heroImage,
          cropConfig: {
            isCrop: true,
            position: "object-[50%_12%]",
            scale: "scale-150",
            heroUrl: heroImage,
          },
        };
      }
      return {
        imageUrl: resolveCleanHijabPackshot(itemName, itemColor, itemHex),
      };
    }

    // Untuk outerwear non-hijab (blazer, cardigan, vest)
    if (heroImage) {
      return {
        imageUrl: heroImage,
        cropConfig: {
          isCrop: true,
          position: "object-[50%_30%]",
          scale: "scale-125",
          heroUrl: heroImage,
        },
      };
    }
    return {
      imageUrl: item?.imageUrl || CLEAN_PACKSHOT_DICTIONARY.hijab.default,
    };
  }

  return {
    imageUrl: item?.imageUrl || CLEAN_PACKSHOT_DICTIONARY.bottom.default,
  };
}
