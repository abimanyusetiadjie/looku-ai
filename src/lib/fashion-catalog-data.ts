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
  brand?: "UNIQLO" | "H&M" | "ZARA" | "COS" | "LOCAL_CURATED" | string;
  brandUrl?: string; // Direct link ke toko resmi brand (Uniqlo/H&M)
  isOfficialBrand?: boolean;
  [key: string]: any; // Backward compatibility with legacy CMS
}

/**
 * GOLDEN DATASET (Aggregator Curated: Uniqlo, H&M, & Contemporary Essentials)
 * Menampilkan item busana modern dengan siluet skena & clean look.
 * Foto & merek dagang adalah hak milik masing-masing pemegang merek (Safe Harbor Model).
 */
export const GOLDEN_DATASET: FashionItem[] = [
  // ==========================================
  // ATASAN (Uniqlo, H&M, & Curated Tops)
  // ==========================================
  {
    id: "top_linen_white",
    name: "Uniqlo Premium Linen Long Sleeve Shirt",
    category: "atasan",
    material: "100% European Flax Linen (Super Breathable)",
    breathabilityScore: 98,
    colorName: "Broken White",
    colorHex: "#F3EFE6",
    brand: "UNIQLO",
    brandUrl: "https://www.uniqlo.com/id/id/products/E464937-000/00",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 399000,
      searchVolumeTrend: "TOP_TRENDING_LINEN",
      source: "Uniqlo Official Store ID"
    },
    imageUrl: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "top_crinkle_sage",
    name: "H&M Relaxed Fit Camp Collar Linen Shirt",
    category: "atasan",
    material: "Linen-Blend Poplin (Kerah Terbuka Skena)",
    breathabilityScore: 94,
    colorName: "Sage Green Muted",
    colorHex: "#8A9A86",
    brand: "H&M",
    brandUrl: "https://id.hm.com/search?q=linen+shirt",
    isOfficialBrand: true,
    suitableForSkinTones: ["Light", "Medium", "Tan"],
    marketValidation: {
      estimatedPrice: 299000,
      searchVolumeTrend: "CAFE_HOPPING_SKENA",
      source: "H&M Indonesia Online"
    },
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "top_cotton_black",
    name: "Uniqlo U AIRism Cotton Oversized T-Shirt",
    category: "atasan",
    material: "AIRism Tech Cotton (Lapisan Dingin Anti-Gerah)",
    breathabilityScore: 96,
    colorName: "Jet Black Boxy",
    colorHex: "#181A18",
    brand: "UNIQLO",
    brandUrl: "https://www.uniqlo.com/id/id/products/E425974-000/00",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 199000,
      searchVolumeTrend: "EVERGREEN_ICONIC_AIRISM",
      source: "Uniqlo U Collection by Christophe Lemaire"
    },
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "top_rayon_tunic",
    name: "Uniqlo Rayon Relaxed Long Sleeve Blouse",
    category: "atasan",
    material: "Rayon Anti-Kusut (Jatuh Flowy & Dingin)",
    breathabilityScore: 95,
    colorName: "Mocca Oat",
    colorHex: "#D7CABC",
    brand: "UNIQLO",
    brandUrl: "https://www.uniqlo.com/id/id/products/E455734-000/00",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Medium", "Deep"],
    marketValidation: {
      estimatedPrice: 299000,
      searchVolumeTrend: "SMART_CASUAL_OFFICE",
      source: "Uniqlo Work & Everyday"
    },
    imageUrl: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "top_silk_champagne",
    name: "Zara Structured Wrap Satin Blouse",
    category: "atasan",
    material: "Satin Silk Finish Premium",
    breathabilityScore: 78,
    colorName: "Champagne Gold",
    colorHex: "#D4AF37",
    brand: "ZARA",
    brandUrl: "https://www.zara.com/id/",
    isOfficialBrand: true,
    suitableForSkinTones: ["Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 499000,
      searchVolumeTrend: "FORMAL_KONDANGAN_ELEGANT",
      source: "Zara Indonesia Official"
    },
    imageUrl: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=800&auto=format&fit=crop&q=85"
  },

  // ==========================================
  // BAWAHAN (Uniqlo Pleated Wide, H&M Slacks)
  // ==========================================
  {
    id: "btm_linen_culotte",
    name: "Uniqlo Pleated Wide Pants",
    category: "bawahan",
    material: "Flowy Crepe Twill (2-Way Stretch Bebas Gerah)",
    breathabilityScore: 97,
    colorName: "Sand Oat",
    colorHex: "#E8DFD1",
    brand: "UNIQLO",
    brandUrl: "https://www.uniqlo.com/id/id/products/E460311-000/00",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 499000,
      searchVolumeTrend: "VIRAL_TIKTOK_BESTSELLER",
      source: "Uniqlo Must-Have Wardrobe"
    },
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "btm_crinkle_skirt",
    name: "H&M A-Line Tiered Flowy Midi Skirt",
    category: "bawahan",
    material: "Lightweight Woven Rayon",
    breathabilityScore: 94,
    colorName: "Terracotta Earth",
    colorHex: "#BA5D38",
    brand: "H&M",
    brandUrl: "https://id.hm.com/search?q=skirt",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Light", "Medium"],
    marketValidation: {
      estimatedPrice: 349000,
      searchVolumeTrend: "STABLE_MODEST_TREND",
      source: "H&M Summer Collection"
    },
    imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "btm_ankle_pants",
    name: "Uniqlo Smart Ankle Pants (Tapered)",
    category: "bawahan",
    material: "Wool-Like Easy Care Stretch",
    breathabilityScore: 88,
    colorName: "Charcoal Slate",
    colorHex: "#2B2620",
    brand: "UNIQLO",
    brandUrl: "https://www.uniqlo.com/id/id/products/E464887-000/00",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 499000,
      searchVolumeTrend: "OFFICE_SCBD_STAPLE",
      source: "Uniqlo Smart Office Pant"
    },
    imageUrl: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "btm_denim_maxi",
    name: "H&M Loose Straight Fit Denim Pants",
    category: "bawahan",
    material: "100% Breathable Cotton Denim 10oz",
    breathabilityScore: 86,
    colorName: "Light Indigo Vintage",
    colorHex: "#89A1B5",
    brand: "H&M",
    brandUrl: "https://id.hm.com/search?q=loose+jeans",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Light", "Medium", "Deep"],
    marketValidation: {
      estimatedPrice: 449000,
      searchVolumeTrend: "GEN_Z_BAGGY_JEANS",
      source: "H&M Denim Department"
    },
    imageUrl: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "btm_cotton_chino",
    name: "Uniqlo Relaxed Fit Parachute Pants",
    category: "bawahan",
    material: "Ultra Light Nylon Ripstop",
    breathabilityScore: 92,
    colorName: "Khaki Olive",
    colorHex: "#C3B091",
    brand: "UNIQLO",
    brandUrl: "https://www.uniqlo.com/id/id/products/E464888-000/00",
    isOfficialBrand: true,
    suitableForSkinTones: ["Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 499000,
      searchVolumeTrend: "SKENA_URBAN_STREETWEAR",
      source: "Uniqlo Urban Trend"
    },
    imageUrl: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&auto=format&fit=crop&q=85"
  },

  // ==========================================
  // OUTER & HIJAB (AIRism UV & Curated Voal)
  // ==========================================
  {
    id: "hijab_voal_nude",
    name: "Voal Paris Ultrafine Clean Laser-Cut",
    category: "outer_hijab",
    material: "100% Voal Ultrafine Berpori Mikro",
    breathabilityScore: 99,
    colorName: "Nude Blush Muted",
    colorHex: "#E2C4B8",
    brand: "LOCAL_CURATED",
    brandUrl: "https://shopee.co.id/search?keyword=voal%20ultrafine%20laser%20cut",
    isOfficialBrand: false,
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 65000,
      searchVolumeTrend: "DAILY_MODEST_ESSENTIAL",
      source: "Top Local Hijab Brand Shopee Mall"
    },
    imageUrl: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "hijab_silk_pashmina",
    name: "Flowy Pashmina Ceruty Baby Doll",
    category: "outer_hijab",
    material: "Ceruty Baby Doll Premium",
    breathabilityScore: 92,
    colorName: "Dusty Mauve",
    colorHex: "#B76E79",
    brand: "LOCAL_CURATED",
    brandUrl: "https://shopee.co.id/search?keyword=pashmina%20ceruty%20baby%20doll",
    isOfficialBrand: false,
    suitableForSkinTones: ["Light", "Medium", "Tan"],
    marketValidation: {
      estimatedPrice: 45000,
      searchVolumeTrend: "VIRAL_CLEAN_GIRL_HIJAB",
      source: "Modest Wear Star+ Curator"
    },
    imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "outer_knit_cardigan",
    name: "Uniqlo AIRism UV Protection Mesh Hoodie",
    category: "outer_hijab",
    material: "AIRism Mesh Cooltech (Perlindungan UV UPF50+)",
    breathabilityScore: 98,
    colorName: "Vanilla Broken White",
    colorHex: "#F3E5AB",
    brand: "UNIQLO",
    brandUrl: "https://www.uniqlo.com/id/id/products/E456261-000/00",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Medium", "Deep"],
    marketValidation: {
      estimatedPrice: 399000,
      searchVolumeTrend: "BEST_TROPICAL_OUTER",
      source: "Uniqlo UV Protection Series"
    },
    imageUrl: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=85"
  },

  // ==========================================
  // SEPATU (Contemporary Skena Footwear)
  // ==========================================
  {
    id: "shoe_loafers_black",
    name: "Zara Chunky Lug-Sole Leather Loafers",
    category: "sepatu",
    material: "Supple Vegan Leather with Padded Insole",
    breathabilityScore: 78,
    colorName: "Polished Black",
    colorHex: "#111111",
    brand: "ZARA",
    brandUrl: "https://www.zara.com/id/en/woman-shoes-loafers-l1281.html",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 699000,
      searchVolumeTrend: "IT_GIRL_SCBD_LOAFERS",
      source: "Zara Footwear Department"
    },
    imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=85"
  },
  {
    id: "shoe_canvas_sneakers",
    name: "H&M Retro Low Court Sneakers",
    category: "sepatu",
    material: "Washed Canvas & Textured Gum Rubber Sole",
    breathabilityScore: 89,
    colorName: "Vintage Off-White",
    colorHex: "#FAFAFA",
    brand: "H&M",
    brandUrl: "https://id.hm.com/search?q=sneakers",
    isOfficialBrand: true,
    suitableForSkinTones: ["Fair", "Light", "Medium", "Tan", "Deep"],
    marketValidation: {
      estimatedPrice: 449000,
      searchVolumeTrend: "SAMBA_ALTERNATIVE_RETRO",
      source: "H&M Footwear Division"
    },
    imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=85"
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
