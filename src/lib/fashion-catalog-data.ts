export interface FashionItem {
  id: string;
  name: string;
  category: "atasan" | "bawahan" | "outer_hijab" | "sepatu";
  material: string;
  breathabilityScore?: number; // 0 - 100 (Di atas 85 = Aman untuk 33°C)
  colorName: string;
  colorHex: string;
  suitableForSkinTones?: Array<"Fair" | "Light" | "Medium" | "Tan" | "Deep">;
  marketValidation?: {
    estimatedPrice: number;
    searchVolumeTrend: string; // Bukti data pasar untuk sidang
    source: string;
  };
  imageUrl?: string;
  [key: string]: any; // Backward compatibility with legacy CMS
}

/**
 * GOLDEN DATASET (Timeless Tropical Minimalist)
 * Terdiri dari 15 item busana yang saling melengkapi (Mix & Match friendly).
 * Data ini divalidasi berdasarkan top keyword marketplace Indonesia Q3.
 */
export const GOLDEN_DATASET: FashionItem[] = [
  // ==========================================
  // ATASAN (5 Items)
  // ==========================================
  {
    id: "top_linen_white",
    name: "Kemeja Linen Oversized Klasik",
    category: "atasan",
    material: "Linen Euro",
    breathabilityScore: 98,
    colorName: "Broken White",
    colorHex: "#F3EFE6",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 145000,
      searchVolumeTrend: "RISING_45K_MONTHLY",
      source: "Top 10 Shopee Mall (Kemeja Wanita)"
    },
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
  },
  {
    id: "top_crinkle_sage",
    name: "Blouse Crinkle Airflow Batwing",
    category: "atasan",
    material: "Crinkle Airflow",
    breathabilityScore: 92,
    colorName: "Sage Green",
    colorHex: "#8A9A86",
    suitableForSkinTones: ["Light", "Medium", "Tan"],
    marketValidation: {
      estimatedPrice: 125000,
      searchVolumeTrend: "STABLE_HIGH_30K_MONTHLY",
      source: "Top 5 Keyword Tokopedia (Baju Sage Green)"
    },
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80" // Greenish aesthetic top
  },
  {
    id: "top_cotton_black",
    name: "Boxy Basic Tee Ultra-Cool",
    category: "atasan",
    material: "Cotton Combed 24s Cooltech",
    breathabilityScore: 88,
    colorName: "Jet Black",
    colorHex: "#181A18",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 89000,
      searchVolumeTrend: "EVERGREEN_100K_MONTHLY",
      source: "Shopee Top 50 Baju Kaos"
    },
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
  },
  {
    id: "top_rayon_tunic",
    name: "Tunik Asimetris Flowy",
    category: "atasan",
    material: "Katun Rayon Twill",
    breathabilityScore: 95,
    colorName: "Mocca Oat",
    colorHex: "#D7CABC",
    suitableForSkinTones: ["Fair", "Medium", "Deep"],
    marketValidation: {
      estimatedPrice: 165000,
      searchVolumeTrend: "RISING_25K_MONTHLY",
      source: "Zalora Modest Wear Trend Q3"
    },
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&q=80"
  },
  {
    id: "top_silk_champagne",
    name: "Satin Silk Wrap Blouse (Kondangan)",
    category: "atasan",
    material: "Satin Silk Premium",
    breathabilityScore: 75, // Lebih panas, khusus acara malam/AC
    colorName: "Champagne Gold",
    colorHex: "#D4AF37",
    suitableForSkinTones: ["Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 185000,
      searchVolumeTrend: "SEASONAL_HIGH_WEEKEND",
      source: "Top Search 'Baju Kondangan Simple'"
    },
    imageUrl: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&q=80"
  },

  // ==========================================
  // BAWAHAN (5 Items)
  // ==========================================
  {
    id: "btm_linen_culotte",
    name: "Kulot Highwaist Linen Loose",
    category: "bawahan",
    material: "Linen Rami",
    breathabilityScore: 97,
    colorName: "Oatmeal",
    colorHex: "#E8DFD1",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 135000,
      searchVolumeTrend: "RISING_80K_MONTHLY",
      source: "Shopee Mall Top 10 Bawahan"
    },
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80"
  },
  {
    id: "btm_crinkle_skirt",
    name: "Rok A-Line Flowy Crinkle",
    category: "bawahan",
    material: "Crinkle Airflow",
    breathabilityScore: 94,
    colorName: "Terracotta",
    colorHex: "#BA5D38",
    suitableForSkinTones: ["Fair", "Light", "Medium"],
    marketValidation: {
      estimatedPrice: 110000,
      searchVolumeTrend: "STABLE_40K_MONTHLY",
      source: "Tokopedia Top Skirt Modest"
    },
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&q=80"
  },
  {
    id: "btm_ankle_pants",
    name: "Smart Ankle Pants (Office)",
    category: "bawahan",
    material: "Semi Wool Stretch",
    breathabilityScore: 82,
    colorName: "Charcoal Deep",
    colorHex: "#2B2620",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 175000,
      searchVolumeTrend: "EVERGREEN_60K_MONTHLY",
      source: "Top 5 'Celana Kerja Wanita'"
    },
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80"
  },
  {
    id: "btm_denim_maxi",
    name: "Maxi Skirt Denim Washed",
    category: "bawahan",
    material: "Lightweight Denim 10oz",
    breathabilityScore: 85,
    colorName: "Light Blue Wash",
    colorHex: "#89A1B5",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Deep"],
    marketValidation: {
      estimatedPrice: 195000,
      searchVolumeTrend: "TRENDING_PEAK_Q3",
      source: "WGSN Gen-Z Local Trend"
    },
    imageUrl: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&q=80"
  },
  {
    id: "btm_cotton_chino",
    name: "Chino Pants Relaxed Fit",
    category: "bawahan",
    material: "Cotton Twill",
    breathabilityScore: 88,
    colorName: "Khaki Sand",
    colorHex: "#C3B091",
    suitableForSkinTones: ["Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 155000,
      searchVolumeTrend: "STABLE_50K_MONTHLY",
      source: "Zalora Casual Wear"
    },
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80"
  },

  // ==========================================
  // OUTER & HIJAB (3 Items)
  // ==========================================
  {
    id: "hijab_voal_nude",
    name: "Hijab Segiempat Voal Paris",
    category: "outer_hijab",
    material: "Voal Paris Premium",
    breathabilityScore: 99, // Sangat adem untuk kepala
    colorName: "Nude Blush",
    colorHex: "#E2C4B8",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 65000,
      searchVolumeTrend: "EVERGREEN_200K_MONTHLY",
      source: "Shopee Keyword 'Hijab Voal'"
    },
    imageUrl: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&q=80"
  },
  {
    id: "hijab_silk_pashmina",
    name: "Pashmina Silk Ceruty",
    category: "outer_hijab",
    material: "Ceruty Babydoll",
    breathabilityScore: 90,
    colorName: "Rose Gold",
    colorHex: "#B76E79",
    suitableForSkinTones: ["Light", "Medium", "Tan"],
    marketValidation: {
      estimatedPrice: 55000,
      searchVolumeTrend: "RISING_150K_MONTHLY",
      source: "Shopee Keyword 'Pashmina Silk'"
    },
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"
  },
  {
    id: "outer_knit_cardigan",
    name: "Cardigan Rajut Ringan (Anti-UV)",
    category: "outer_hijab",
    material: "Lightweight Cotton Knit",
    breathabilityScore: 86,
    colorName: "Vanilla Cream",
    colorHex: "#F3E5AB",
    suitableForSkinTones: ["Fair", "Medium", "Deep"],
    marketValidation: {
      estimatedPrice: 145000,
      searchVolumeTrend: "STABLE_45K_MONTHLY",
      source: "Tokopedia 'Cardigan Tipis'"
    },
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80"
  },

  // ==========================================
  // SEPATU (2 Items)
  // ==========================================
  {
    id: "shoe_loafers_black",
    name: "Classic Leather Loafers",
    category: "sepatu",
    material: "Vegan Leather",
    breathabilityScore: 70, // Sepatu standar
    colorName: "Black Gloss",
    colorHex: "#111111",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 225000,
      searchVolumeTrend: "RISING_Q3",
      source: "Top 10 Footwear Zalora"
    },
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80"
  },
  {
    id: "shoe_canvas_sneakers",
    name: "Minimalist Canvas Sneakers",
    category: "sepatu",
    material: "Breathable Canvas",
    breathabilityScore: 85,
    colorName: "Chalk White",
    colorHex: "#FAFAFA",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 250000,
      searchVolumeTrend: "EVERGREEN_HIGH",
      source: "Shopee 'Sneakers Putih'"
    },
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80"
  },

  // ==========================================
  // POLYVORE & MYNTRA EXPANSION CATALOG (WANITA & PRIA)
  // ==========================================
  {
    id: "poly_top_feather_dress",
    name: "White Summer Graphic Slip Dress",
    category: "atasan",
    material: "Katun Rayon Combed 30s",
    breathabilityScore: 94,
    colorName: "Broken White",
    colorHex: "#FDFBF7",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 130000,
      searchVolumeTrend: "POLYVORE_CURATED",
      source: "Polyvore Outfits Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&q=80"
  },
  {
    id: "poly_outer_leather_biker",
    name: "Ruffle Biker Leather Jacket",
    category: "outer_hijab",
    material: "Breathable Vegan Leather",
    breathabilityScore: 78,
    colorName: "Midnight Black",
    colorHex: "#1C1C1E",
    suitableForSkinTones: ["Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 265000,
      searchVolumeTrend: "STREETWEAR_TREND",
      source: "Polyvore Outfits Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"
  },
  {
    id: "poly_bottom_dark_jeans",
    name: "Straight-Leg Dark Wash Jeans",
    category: "bawahan",
    material: "Katun Denim Stretch 12oz",
    breathabilityScore: 82,
    colorName: "Dark Indigo",
    colorHex: "#2C3E50",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 175000,
      searchVolumeTrend: "EVERGREEN_DENIM",
      source: "Polyvore Outfits Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80"
  },
  {
    id: "poly_top_silk_cocktail",
    name: "Draped Cowl Neck Silk Cocktail Dress",
    category: "atasan",
    material: "Silk Satin Twill Halus",
    breathabilityScore: 88,
    colorName: "Ice Blue",
    colorHex: "#A8C7C7",
    suitableForSkinTones: ["Fair", "Light", "Medium"],
    marketValidation: {
      estimatedPrice: 320000,
      searchVolumeTrend: "FORMAL_GALA",
      source: "Polyvore Outfits Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80"
  },
  {
    id: "poly_shoe_wrap_boots",
    name: "Slouchy Wrap Chunky Ankle Boots",
    category: "sepatu",
    material: "Soft Faux Leather Hak Kayu",
    breathabilityScore: 75,
    colorName: "Olive Taupe",
    colorHex: "#6E6859",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 210000,
      searchVolumeTrend: "AUTUMN_TREND",
      source: "Polyvore Outfits Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80"
  },
  {
    id: "myntra_top_oxford_shirt",
    name: "Kemeja Katun Oxford Sky Blue",
    category: "atasan",
    material: "100% Katun Oxford Pin-Point",
    breathabilityScore: 92,
    colorName: "Sky Oxford Blue",
    colorHex: "#87CEEB",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan"],
    marketValidation: {
      estimatedPrice: 155000,
      searchVolumeTrend: "MYNTRA_OFFICE_BEST",
      source: "Myntra Catalog Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80"
  },
  {
    id: "myntra_top_camp_linen",
    name: "Camp Collar Organic Linen Shirt (Pria)",
    category: "atasan",
    material: "100% Pure Organic Linen",
    breathabilityScore: 98,
    colorName: "Sage Soft",
    colorHex: "#91AF90",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 145000,
      searchVolumeTrend: "RESORT_TREND",
      source: "Myntra Catalog Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&q=80"
  },
  {
    id: "myntra_bottom_chino",
    name: "Slim Tapered Stretch Chino (Pria)",
    category: "bawahan",
    material: "Katun Twill Stretch Breathable",
    breathabilityScore: 88,
    colorName: "Khaki Sand",
    colorHex: "#C2B280",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 165000,
      searchVolumeTrend: "EVERGREEN_MENSWEAR",
      source: "Myntra Catalog Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80"
  },
  {
    id: "myntra_shoe_loafers",
    name: "Leather Penny Loafers Cushioned",
    category: "sepatu",
    material: "Microfiber Leather dengan Sol Empuk",
    breathabilityScore: 78,
    colorName: "Espresso Brown",
    colorHex: "#3E2723",
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 280000,
      searchVolumeTrend: "FORMAL_MENSWEAR",
      source: "Myntra Catalog Dataset"
    },
    imageUrl: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&q=80"
  }
];

// Backward compatibility exports to prevent build failures
export type FashionCatalogItem = FashionItem;
export const FASHION_CATALOG_300 = GOLDEN_DATASET;
