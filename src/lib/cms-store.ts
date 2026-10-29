import { OOTDRecommendation, TrendingLook } from "./types";
import { PRESET_OOTD_COLLECTION, FASHION_CATALOG_300, FashionCatalogItem, TRENDING_LOOKS_FEED, ALL_LOOKS_DATABASE } from "./presets";
import { getAffiliateStats, AffiliateStats } from "./affiliate";

export interface AISettingsConfig {
  temperature: number;
  systemPrompt: string;
  defaultClimate: string;
  preferredFabricWeights: string[];
}

export const DEFAULT_AI_SETTINGS: AISettingsConfig = {
  temperature: 0.7,
  defaultClimate: "33°C Panas Terik",
  preferredFabricWeights: ["Katun Rayon Twill", "Linen Euro Crinkle", "Tencel Modal", "Voal Miracle"],
  systemPrompt: `Kamu adalah "Looku AI", personal stylist profesional nomor 1 di Indonesia yang sangat menguasai analisis Personal Color & Fashion Harian Tropis. Prioritaskan bahan katun rayon & linen yang adem 33°C, ramah hijab, dan sesuaikan dengan warna kulit sawo matang / nusantara.`,
};

// ==========================================
// PRESETS / FORMULA OOTD MANAGEMENT
// ==========================================

export function getAllAdminPresets(): OOTDRecommendation[] {
  if (typeof window === "undefined") {
    return Object.values(PRESET_OOTD_COLLECTION);
  }

  try {
    const customRaw = localStorage.getItem("looku_custom_presets");
    const customPresets: Record<string, OOTDRecommendation> = customRaw ? JSON.parse(customRaw) : {};
    
    // Merge built-in presets with custom overrides/additions
    const merged = { ...PRESET_OOTD_COLLECTION, ...customPresets };
    return Object.values(merged);
  } catch (e) {
    console.error("Error reading presets:", e);
    return Object.values(PRESET_OOTD_COLLECTION);
  }
}

export function saveAdminPreset(preset: OOTDRecommendation): void {
  if (typeof window === "undefined") return;

  try {
    const customRaw = localStorage.getItem("looku_custom_presets");
    const customPresets: Record<string, OOTDRecommendation> = customRaw ? JSON.parse(customRaw) : {};
    
    customPresets[preset.id] = {
      ...preset,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("looku_custom_presets", JSON.stringify(customPresets));
    window.dispatchEvent(new Event("looku_presets_updated"));
  } catch (e) {
    console.error("Error saving preset:", e);
  }
}

export function deleteAdminPreset(presetId: string): void {
  if (typeof window === "undefined") return;

  try {
    const customRaw = localStorage.getItem("looku_custom_presets");
    const customPresets: Record<string, OOTDRecommendation> = customRaw ? JSON.parse(customRaw) : {};
    
    delete customPresets[presetId];
    localStorage.setItem("looku_custom_presets", JSON.stringify(customPresets));
    window.dispatchEvent(new Event("looku_presets_updated"));
  } catch (e) {
    console.error("Error deleting preset:", e);
  }
}

// ==========================================
// MASTER FASHION CATALOG 300+ MANAGEMENT
// ==========================================

export function getAllAdminCatalog(): FashionCatalogItem[] {
  if (typeof window === "undefined") {
    return FASHION_CATALOG_300;
  }

  try {
    const customRaw = localStorage.getItem("looku_custom_catalog");
    if (!customRaw) return FASHION_CATALOG_300;
    
    const customCatalog: FashionCatalogItem[] = JSON.parse(customRaw);
    return customCatalog.length > 0 ? customCatalog : FASHION_CATALOG_300;
  } catch (e) {
    console.error("Error reading custom catalog:", e);
    return FASHION_CATALOG_300;
  }
}

export function saveAdminCatalogItem(item: FashionCatalogItem): void {
  if (typeof window === "undefined") return;

  try {
    const current = getAllAdminCatalog();
    const index = current.findIndex((c) => c.id === item.id);
    
    let updated: FashionCatalogItem[];
    if (index >= 0) {
      updated = [...current];
      updated[index] = item;
    } else {
      updated = [item, ...current];
    }

    localStorage.setItem("looku_custom_catalog", JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_catalog_updated"));
  } catch (e) {
    console.error("Error saving catalog item:", e);
  }
}

export function deleteAdminCatalogItem(itemId: string): void {
  if (typeof window === "undefined") return;

  try {
    const current = getAllAdminCatalog();
    const updated = current.filter((c) => c.id !== itemId);
    localStorage.setItem("looku_custom_catalog", JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_catalog_updated"));
  } catch (e) {
    console.error("Error deleting catalog item:", e);
  }
}

export function resetCatalogToFactory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("looku_custom_catalog");
  localStorage.removeItem("looku_custom_presets");
  localStorage.removeItem("looku_custom_lookbook");
  localStorage.removeItem("looku_deleted_lookbook_ids");
  window.dispatchEvent(new Event("looku_catalog_updated"));
  window.dispatchEvent(new Event("looku_presets_updated"));
  window.dispatchEvent(new Event("looku_lookbook_updated"));
}

// ==========================================
// AI ENGINE SETTINGS
// ==========================================

export function getAdminAISettings(): AISettingsConfig {
  if (typeof window === "undefined") return DEFAULT_AI_SETTINGS;
  try {
    const raw = localStorage.getItem("looku_admin_ai_settings");
    return raw ? { ...DEFAULT_AI_SETTINGS, ...JSON.parse(raw) } : DEFAULT_AI_SETTINGS;
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

export function saveAdminAISettings(settings: Partial<AISettingsConfig>): void {
  if (typeof window === "undefined") return;
  try {
    const current = getAdminAISettings();
    const updated = { ...current, ...settings };
    localStorage.setItem("looku_admin_ai_settings", JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_ai_settings_updated"));
  } catch (e) {
    console.error("Error saving AI settings:", e);
  }
}

// ==========================================
// LOOKBOOK OOTD FEED MANAGEMENT (ADMIN CRUD)
// ==========================================

export function getAllAdminLookbook(): TrendingLook[] {
  if (typeof window === "undefined") {
    return ALL_LOOKS_DATABASE;
  }

  try {
    const DATASET_VERSION_KEY = "looku_dataset_v36_harmonized_15";
    const currentVer = localStorage.getItem("looku_dataset_version");
    if (currentVer !== DATASET_VERSION_KEY) {
      localStorage.removeItem("looku_custom_lookbook");
      localStorage.removeItem("looku_deleted_lookbook_ids");
      localStorage.setItem("looku_dataset_version", DATASET_VERSION_KEY);
    }

    const customRaw = localStorage.getItem("looku_custom_lookbook");
    const customLooks: TrendingLook[] = customRaw ? JSON.parse(customRaw) : [];

    const deletedRaw = localStorage.getItem("looku_deleted_lookbook_ids");
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];

    const customIds = new Set(customLooks.map((l) => l.id));
    const activeDefault = ALL_LOOKS_DATABASE.filter(
      (l) => !deletedIds.includes(l.id) && !customIds.has(l.id)
    );

    return [...customLooks, ...activeDefault];
  } catch (e) {
    console.error("Error reading lookbook:", e);
    return ALL_LOOKS_DATABASE;
  }
}

export function saveAdminLookbookItem(look: TrendingLook): void {
  if (typeof window === "undefined") return;

  try {
    const customRaw = localStorage.getItem("looku_custom_lookbook");
    const customLooks: TrendingLook[] = customRaw ? JSON.parse(customRaw) : [];

    const index = customLooks.findIndex((l) => l.id === look.id);
    let updated: TrendingLook[];

    if (index >= 0) {
      updated = [...customLooks];
      updated[index] = look;
    } else {
      updated = [look, ...customLooks];
    }

    localStorage.setItem("looku_custom_lookbook", JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_lookbook_updated"));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Error saving lookbook item:", e);
  }
}

export function deleteAdminLookbookItem(lookId: string): void {
  if (typeof window === "undefined") return;

  try {
    const customRaw = localStorage.getItem("looku_custom_lookbook");
    const customLooks: TrendingLook[] = customRaw ? JSON.parse(customRaw) : [];
    const updatedCustom = customLooks.filter((l) => l.id !== lookId);
    localStorage.setItem("looku_custom_lookbook", JSON.stringify(updatedCustom));

    const deletedRaw = localStorage.getItem("looku_deleted_lookbook_ids");
    const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
    if (!deletedIds.includes(lookId)) {
      deletedIds.push(lookId);
      localStorage.setItem("looku_deleted_lookbook_ids", JSON.stringify(deletedIds));
    }

    window.dispatchEvent(new Event("looku_lookbook_updated"));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Error deleting lookbook item:", e);
  }
}

export function saveBulkAdminLookbook(looks: TrendingLook[]): void {
  if (typeof window === "undefined") return;

  try {
    const customRaw = localStorage.getItem("looku_custom_lookbook");
    const customLooks: TrendingLook[] = customRaw ? JSON.parse(customRaw) : [];
    const customMap = new Map(customLooks.map((l) => [l.id, l]));

    looks.forEach((look) => {
      customMap.set(look.id, look);
    });

    const updated = Array.from(customMap.values());
    localStorage.setItem("looku_custom_lookbook", JSON.stringify(updated));
    window.dispatchEvent(new Event("looku_lookbook_updated"));
    window.dispatchEvent(new Event("storage"));
  } catch (e) {
    console.error("Error bulk saving lookbook:", e);
  }
}

export function parseCsvToTrendingLooks(csvText: string): TrendingLook[] {
  const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const firstLine = lines[0];
  const isTab = firstLine.includes("\t") && firstLine.split("\t").length >= firstLine.split(",").length;
  const delimiter = isTab ? "\t" : ",";

  const parseLine = (line: string): string[] => {
    const res: string[] = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQuotes && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (c === delimiter && !inQuotes) {
        res.push(cur.trim());
        cur = "";
      } else {
        cur += c;
      }
    }
    res.push(cur.trim());
    return res;
  };

  const headers = parseLine(lines[0]).map((h) => h.replace(/^\uFEFF/, "").toLowerCase().replace(/[^a-z0-9_]/g, ""));
  const headerMap: Record<string, number> = {};
  headers.forEach((h, i) => {
    headerMap[h] = i;
  });

  const getCol = (cols: string[], ...aliases: string[]): string => {
    for (const a of aliases) {
      const cleanKey = a.toLowerCase().replace(/[^a-z0-9_]/g, "");
      if (cleanKey in headerMap) {
        const val = cols[headerMap[cleanKey]];
        if (val !== undefined && val !== null) return val.trim();
      }
    }
    return "";
  };

  const results: TrendingLook[] = [];

  for (let rowIdx = 1; rowIdx < lines.length; rowIdx++) {
    const cols = parseLine(lines[rowIdx]);
    if (cols.length === 0 || cols.every((c) => !c)) continue;

    const id = getCol(cols, "id") || `custom_look_${Date.now()}_${rowIdx}`;
    const title = getCol(cols, "title") || `Lookbook OOTD #${rowIdx}`;
    const tag = getCol(cols, "tag") || "CURATED LOOK";
    const category = getCol(cols, "category") || "Wanita";
    const vibe = getCol(cols, "vibe") || "Earthy Minimalist";
    const priceRange = getCol(cols, "pricerange", "price") || "Rp 150.000 - Rp 300.000";
    const skinTone = getCol(cols, "skintone", "skintonerecommendation") || "Sawo Matang & Kuning Langsat";
    const isGoldenRaw = getCol(cols, "isgolden", "isgoldensignature").toUpperCase();
    const isGolden = isGoldenRaw === "TRUE" || isGoldenRaw === "1" || isGoldenRaw === "YES";

    const topName = getCol(cols, "top_name", "topname") || "Atasan Katun Berpori";
    const topMaterial = getCol(cols, "top_material", "topmaterial") || "Katun Poplin Breathable";
    const topPrice = getCol(cols, "top_price", "topprice") || "Rp 120.000";
    const topShopee = getCol(cols, "top_shopee_url", "topshopeeurl") || undefined;
    const topImg = getCol(cols, "top_image_url", "topimageurl") || undefined;

    const btmName = getCol(cols, "bottom_name", "bottomname") || "Bawahan Loose Sejuk";
    const btmMaterial = getCol(cols, "bottom_material", "bottommaterial") || "Rayon Twill / Katun";
    const btmPrice = getCol(cols, "bottom_price", "bottomprice") || "Rp 95.000";
    const btmShopee = getCol(cols, "bottom_shopee_url", "bottomshopeeurl") || undefined;
    const btmImg = getCol(cols, "bottom_image_url", "bottomimageurl") || undefined;

    const outerName = getCol(cols, "outer_name", "outername") || "Hijab / Layer Ringan";
    const outerMaterial = getCol(cols, "outer_material", "outermaterial") || "Voal Ultrafine / Katun";
    const outerPrice = getCol(cols, "outer_price", "outerprice") || "Rp 45.000";
    const outerShopee = getCol(cols, "outer_shopee_url", "outershopeeurl") || undefined;
    const outerImg = getCol(cols, "outer_image_url", "outerimageurl") || undefined;

    const shoesName = getCol(cols, "shoes_name", "shoesname") || "Alas Kaki Nyaman";
    const shoesMaterial = getCol(cols, "shoes_material", "shoesmaterial") || "Canvas / Breathable Sole";
    const shoesPrice = getCol(cols, "shoes_price", "shoesprice") || "Rp 85.000";
    const shoesShopee = getCol(cols, "shoes_shopee_url", "shoesshopeeurl") || undefined;
    const shoesImg = getCol(cols, "shoes_image_url", "shoesimageurl") || undefined;

    const rawHero = getCol(cols, "heroimage", "image");
    const heroImage = rawHero || topImg || btmImg || "";
    const shopeeUrl = getCol(cols, "shopeeurl") || topShopee || undefined;

    const items = [
      {
        category: "atasan" as const,
        name: topName,
        material: topMaterial,
        color: "Neutral",
        colorHex: "#EAE5DF",
        estimatedPrice: topPrice,
        shopeeQuery: topName,
        tokopediaQuery: topName,
        shopeeUrl: topShopee,
        imageUrl: topImg,
      },
      {
        category: "bawahan" as const,
        name: btmName,
        material: btmMaterial,
        color: "Sand",
        colorHex: "#D5C8B8",
        estimatedPrice: btmPrice,
        shopeeQuery: btmName,
        tokopediaQuery: btmName,
        shopeeUrl: btmShopee,
        imageUrl: btmImg,
      },
      {
        category: "outer_hijab" as const,
        name: outerName,
        material: outerMaterial,
        color: "Soft Tint",
        colorHex: "#C2B29F",
        estimatedPrice: outerPrice,
        shopeeQuery: outerName,
        tokopediaQuery: outerName,
        shopeeUrl: outerShopee,
        imageUrl: outerImg,
      },
      {
        category: "sepatu" as const,
        name: shoesName,
        material: shoesMaterial,
        color: "Clean White",
        colorHex: "#FFFFFF",
        estimatedPrice: shoesPrice,
        shopeeQuery: shoesName,
        tokopediaQuery: shoesName,
        shopeeUrl: shoesShopee,
        imageUrl: shoesImg,
      },
    ];

    const lookItem: TrendingLook = {
      id,
      title,
      vibe,
      tag,
      category,
      skinToneRecommendation: skinTone,
      priceRange,
      image: heroImage,
      likes: 650 + ((rowIdx * 43) % 450),
      isGoldenSignature: isGolden,
      shopeeUrl,
      outfit: {
        id,
        title,
        tagline: `Kombinasi ${vibe} sejuk & nyaman untuk iklim tropis.`,
        overallVibe: vibe,
        comfortRating: 9.6,
        affordabilityRating: 9.2,
        modestFriendly: category.toLowerCase().includes("hijab") || category.toLowerCase().includes("modest"),
        skinToneMatch: `Sangat harmonis untuk ${skinTone}.`,
        whyItWorks: `Perpaduan sirkulasi udara dari ${topMaterial} dan ${btmMaterial} menjaga tubuh tetap sejuk di suhu 33°C.`,
        stylingTip: `Padukan dengan aksesori minimalis senada agar aksen ${vibe} terlihat bersih dan rapi.`,
        colorPalette: [
          { name: "Earthy Sand", hex: "#D8C7B5" },
          { name: "Warm Cream", hex: "#F5EFEB" },
          { name: "Terracotta Soft", hex: "#C87D55" },
          { name: "Charcoal Deep", hex: "#2B2927" },
        ],
        items,
        createdAt: new Date().toISOString(),
        isGoldenSignature: isGolden,
        heroImage,
        shopeeUrl,
      },
    };

    results.push(lookItem);
  }

  return results;
}

export function exportLookbookToCsv(looks: TrendingLook[]): string {
  const headers = [
    "id",
    "title",
    "tag",
    "category",
    "vibe",
    "priceRange",
    "skinTone",
    "isGolden",
    "heroImage",
    "shopeeUrl",
    "top_name",
    "top_material",
    "top_price",
    "top_shopee_url",
    "top_image_url",
    "bottom_name",
    "bottom_material",
    "bottom_price",
    "bottom_shopee_url",
    "bottom_image_url",
    "outer_name",
    "outer_material",
    "outer_price",
    "outer_shopee_url",
    "outer_image_url",
    "shoes_name",
    "shoes_material",
    "shoes_price",
    "shoes_shopee_url",
    "shoes_image_url",
  ];

  const escapeCol = (val: any) => {
    if (val === null || val === undefined) return '""';
    const s = String(val).replace(/"/g, '""');
    return `"${s}"`;
  };

  const rows = looks.map((l) => {
    const items = l.outfit?.items || [];
    const top = items.find((i) => i.category === "atasan") || items[0] || ({} as any);
    const btm = items.find((i) => i.category === "bawahan") || items[1] || ({} as any);
    const outer = items.find((i) => i.category === "outer_hijab") || items[2] || ({} as any);
    const shoes = items.find((i) => i.category === "sepatu") || items[3] || ({} as any);

    return [
      escapeCol(l.id),
      escapeCol(l.title),
      escapeCol(l.tag),
      escapeCol(l.category),
      escapeCol(l.vibe),
      escapeCol(l.priceRange),
      escapeCol(l.skinToneRecommendation),
      escapeCol(l.isGoldenSignature ? "TRUE" : "FALSE"),
      escapeCol(l.image || l.outfit?.heroImage),
      escapeCol(l.shopeeUrl || l.outfit?.shopeeUrl),
      escapeCol(top.name),
      escapeCol(top.material),
      escapeCol(top.estimatedPrice),
      escapeCol(top.shopeeUrl),
      escapeCol(top.imageUrl),
      escapeCol(btm.name),
      escapeCol(btm.material),
      escapeCol(btm.estimatedPrice),
      escapeCol(btm.shopeeUrl),
      escapeCol(btm.imageUrl),
      escapeCol(outer.name),
      escapeCol(outer.material),
      escapeCol(outer.estimatedPrice),
      escapeCol(outer.shopeeUrl),
      escapeCol(outer.imageUrl),
      escapeCol(shoes.name),
      escapeCol(shoes.material),
      escapeCol(shoes.estimatedPrice),
      escapeCol(shoes.shopeeUrl),
      escapeCol(shoes.imageUrl),
    ].join(",");
  });

  return "\uFEFF" + [headers.join(","), ...rows].join("\r\n");
}

export interface AdminDashboardMetrics {
  totalLookbook: number;
  totalGoldenLooks: number;
  totalPresets: number;
  totalCatalogItems: number;
  totalActiveShopeeLinks: number;
  categories: {
    hijab: number;
    wanita: number;
    pria: number;
  };
  affiliateStats: AffiliateStats;
}

export function getAdminDashboardMetrics(): AdminDashboardMetrics {
  const looks = getAllAdminLookbook();
  const presets = getAllAdminPresets();
  const catalog = getAllAdminCatalog();
  const affiliateStats = getAffiliateStats();

  let totalActiveShopeeLinks = 0;
  let hijabCount = 0;
  let wanitaCount = 0;
  let priaCount = 0;
  let goldenCount = 0;

  looks.forEach((l) => {
    if (l.isGoldenSignature || l.outfit?.isGoldenSignature) goldenCount++;
    if (l.shopeeUrl) totalActiveShopeeLinks++;
    l.outfit?.items?.forEach((it) => {
      if (it.shopeeUrl) totalActiveShopeeLinks++;
    });

    const isPria = l.tag?.toUpperCase() === "MENSWEAR" || l.category?.toLowerCase().includes("pria");
    const isHijab = l.tag?.toUpperCase().includes("HIJAB") || l.category?.toLowerCase().includes("hijab") || l.outfit?.modestFriendly;

    if (isPria) priaCount++;
    else if (isHijab) hijabCount++;
    else wanitaCount++;
  });

  return {
    totalLookbook: looks.length,
    totalGoldenLooks: goldenCount,
    totalPresets: presets.length,
    totalCatalogItems: catalog.length,
    totalActiveShopeeLinks,
    categories: {
      hijab: hijabCount,
      wanita: wanitaCount,
      pria: priaCount,
    },
    affiliateStats,
  };
}


export interface LookbookValidationResult {
  isValid: boolean;
  checks: {
    cleanTitle: boolean;
    validHeroImage: boolean;
    validItemsAndBrands: boolean;
    validPricing: boolean;
  };
  warnings: string[];
}

export function validateLookbookItem(look: TrendingLook): LookbookValidationResult {
  const warnings: string[] = [];
  const cleanTitle = Boolean(look.title && look.title.trim().length >= 8 && !/#\d+/.test(look.title));
  if (!cleanTitle) {
    warnings.push("Judul mengandung nomor mentah (#angka) atau terlalu pendek.");
  }

  const validHeroImage = Boolean(
    look.image &&
      (look.image.startsWith("https://") ||
        look.image.startsWith("http://") ||
        look.image.startsWith("/")) &&
      !look.image.includes("undefined")
  );
  if (!validHeroImage) {
    warnings.push("URL gambar utama tidak valid atau masih kosong.");
  }

  const items = (look.outfit?.items || []).filter((it) => Boolean(it && it.name));
  const validItemsAndBrands =
    items.length >= 2 &&
    items.every((it) => Boolean(it.name && !/#\d+/.test(it.name)));
  if (!validItemsAndBrands) {
    warnings.push("Minimal 2 item produk (Atasan & Bawahan) harus terisi dengan nama bersih.");
  }

  const validPricing = Boolean(look.priceRange && look.priceRange.includes("Rp"));
  if (!validPricing) {
    warnings.push("Rentang harga perkiraan belum diisi dengan format Rp.");
  }

  return {
    isValid: cleanTitle && validHeroImage && validItemsAndBrands && validPricing,
    checks: {
      cleanTitle,
      validHeroImage,
      validItemsAndBrands,
      validPricing,
    },
    warnings,
  };
}
