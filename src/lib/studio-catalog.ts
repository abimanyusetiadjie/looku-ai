import { REAL_SIGNATURE_LOOKS_28 } from "./real-looks-28";
import { VERIFIED_PRODUCTS_35_RAW } from "./verified-catalog-35";

export interface StudioCatalogItem {
  id: string;
  name: string;
  category: "top" | "bottom" | "outer" | "shoes";
  categoryLabel: string;
  brand: string;
  material: string;
  price: number;
  priceStr: string;
  officialPriceStr: string;
  colorName: string;
  colorHex: string;
  imageUrl: string;
  breathability: number;
  gender: "female" | "male" | "unisex";
  modest: boolean;
  isHijab: boolean;
  officialUrl: string;
  note: string;
}

// Convert raw verified products & signature looks items into structured studio catalog
export function getStudioCatalogPool(): Record<"top" | "bottom" | "outer" | "shoes", StudioCatalogItem[]> {
  const result: Record<"top" | "bottom" | "outer" | "shoes", StudioCatalogItem[]> = {
    top: [],
    bottom: [],
    outer: [],
    shoes: [],
  };

  const addedIds = new Set<string>();

  // 1. Ingest items from 15 Signature Looks
  REAL_SIGNATURE_LOOKS_28.forEach((look) => {
    const isPria = look.category.includes("Pria");
    const isHijab = look.category.includes("Hijab");
    const items = look.outfit?.items || [];

    items.forEach((it) => {
      let slotKey: "top" | "bottom" | "outer" | "shoes" = "top";
      if (it.category === "atasan") slotKey = "top";
      else if (it.category === "bawahan") slotKey = "bottom";
      else if (it.category === "outer_hijab") slotKey = "outer";
      else if (it.category === "sepatu") slotKey = "shoes";

      const itemId = `cat_${slotKey}_${it.name.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 30)}`;
      if (!addedIds.has(itemId)) {
        addedIds.add(itemId);

        let priceNum = 149000;
        const numMatches = (it.estimatedPrice || "").match(/\d+[\d.]*/g);
        if (numMatches && numMatches.length > 0) {
          const raw = parseInt(numMatches[0].replace(/\./g, ""), 10);
          if (!isNaN(raw) && raw > 1000) priceNum = raw;
        }

        const isHijabItem = slotKey === "outer" && /voal|pashmina|hijab|shawl|kerudung/i.test(it.name);

        result[slotKey].push({
          id: itemId,
          name: it.name,
          category: slotKey,
          categoryLabel: slotKey === "top" ? "Atasan" : slotKey === "bottom" ? "Bawahan" : isHijabItem ? "Hijab" : slotKey === "outer" ? "Outer" : "Sepatu",
          brand: it.brand || "Brand Lokal",
          material: it.material || "Katun Rayon & Linen",
          price: priceNum,
          priceStr: `Rp ${priceNum.toLocaleString("id-ID")}`,
          officialPriceStr: it.estimatedPrice || `Rp ${priceNum.toLocaleString("id-ID")}`,
          colorName: it.color || "Harmonis",
          colorHex: it.colorHex || (slotKey === "top" ? "#F4EFE6" : slotKey === "bottom" ? "#D8C7B5" : "#A89886"),
          imageUrl: it.imageUrl || "/fallback-garment.svg",
          breathability: 95,
          gender: isPria ? "male" : "female",
          modest: isHijab,
          isHijab: isHijabItem,
          officialUrl: it.shopeeUrl || (it.brandUrl && !it.brandUrl.includes("zalora") ? it.brandUrl : `https://shopee.co.id/search?keyword=${encodeURIComponent(`${it.brand || ""} ${it.name}`.trim())}`),
          note: `Bahan ${it.material || "berpori mikro"} dengan sirkulasi udara optimal di iklim 33°C.`,
        });
      }
    });
  });

  // 2. Ingest extra items from VERIFIED_PRODUCTS_35_RAW to ensure rich selection
  VERIFIED_PRODUCTS_35_RAW.forEach((p, idx) => {
    let slotKey: "top" | "bottom" | "outer" | "shoes" = "top";
    if (p.category === "Bawahan") slotKey = "bottom";
    else if (p.category === "Hijab") slotKey = "outer";
    else slotKey = "top";

    const itemId = `prod_${idx + 1}_${p.product_name_original.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 25)}`;
    if (!addedIds.has(itemId)) {
      addedIds.add(itemId);

      const isHijabItem = p.category === "Hijab";
      const isMale = p.suitable_for?.includes("Men") || p.product_name_original.toLowerCase().includes("pria");

      result[slotKey].push({
        id: itemId,
        name: p.product_name_original,
        category: slotKey,
        categoryLabel: p.category,
        brand: p.brand,
        material: p.material,
        price: p.price_official,
        priceStr: `Rp ${p.price_official.toLocaleString("id-ID")}`,
        officialPriceStr: `Rp ${p.price_official.toLocaleString("id-ID")}`,
        colorName: "Netral Tropis",
        colorHex: slotKey === "top" ? "#EFECE6" : slotKey === "bottom" ? "#C2B29F" : "#D4A373",
        imageUrl: p.image_url,
        breathability: 96,
        gender: isMale ? "male" : "female",
        modest: p.suitable_for?.includes("Hijab Daily") || isHijabItem,
        isHijab: isHijabItem,
        officialUrl: (p.product_url && !p.product_url.includes("zalora") ? p.product_url : `https://shopee.co.id/search?keyword=${encodeURIComponent(`${p.brand} ${p.product_name_original}`.trim())}`),
        note: p.notes,
      });
    }
  });

  return result;
}
