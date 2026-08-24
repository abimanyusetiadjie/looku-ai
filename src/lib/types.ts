export type GenderPreference = "female" | "male" | "unisex";

export type SkinToneType = 
  | "fair" // Putih Gading
  | "light" // Kuning Langsat
  | "medium" // Sawo Matang
  | "tan" // Eksotis Tropis
  | "deep"; // Deep Bronze

export type AgeRangeType = 
  | "teens" // 15-19
  | "20s" // 20-29 (Kuliah & First Job)
  | "30s" // 30-39 (Career & Young Chic)
  | "40s_plus"; // 40+ (Mature & Polished)

export type OccasionType = 
  | "kuliah" 
  | "kantor" 
  | "hangout" 
  | "kondangan" 
  | "dating" 
  | "olahraga"
  | "santai_rumah";

export type WeatherType = 
  | "panas_terik" 
  | "hujan_dingin" 
  | "ruangan_ac" 
  | "mendung_lembab";

export type BudgetRange = 
  | "hemat" // < 200rb
  | "menengah" // 200rb - 500rb
  | "premium" // > 500rb
  | "bebas";

export type VibeStyle = 
  | "casual_clean"
  | "korean_soft"
  | "earthy_minimalist"
  | "streetwear"
  | "smart_formal"
  | "vintage_retro";

export interface UserPreferences {
  gender: GenderPreference;
  skinTone: SkinToneType;
  ageRange: AgeRangeType;
  occasion: OccasionType;
  isModestHijab: boolean;
  weather: WeatherType;
  budget: BudgetRange;
  vibe: VibeStyle;
  customNotes?: string;
}

export interface OutfitItem {
  category: "atasan" | "bawahan" | "outer_hijab" | "sepatu" | "aksesoris";
  name: string;
  material: string;
  color: string;
  colorHex?: string;
  estimatedPrice: string;
  shopeeQuery: string;
  tokopediaQuery: string;
  imageUrl?: string;
}

export interface OOTDRecommendation {
  id: string;
  title: string;
  tagline: string;
  overallVibe: string;
  comfortRating: number;
  affordabilityRating: number;
  modestFriendly: boolean;
  skinToneMatch: string; // Deskripsi kecocokan dengan warna kulit (e.g. "Memberi efek cerah & glowing pada kulit Sawo Matang")
  whyItWorks: string;
  stylingTip: string;
  colorPalette: { name: string; hex: string }[];
  items: OutfitItem[];
  createdAt: string;
}

export interface TrendingLook {
  id: string;
  title: string;
  vibe: string;
  tag: string;
  category: string;
  skinToneRecommendation: string;
  priceRange: string;
  image: string;
  likes: number;
  outfit: OOTDRecommendation;
}

export interface WaitlistEntry {
  email: string;
  whatsapp?: string;
  name?: string;
  favoriteStyle?: string;
  skinTone?: SkinToneType;
  createdAt: string;
}
