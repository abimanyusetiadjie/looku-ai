import { OOTDRecommendation } from "./types";
import { PRESET_OOTD_COLLECTION } from "./presets";
import { FASHION_CATALOG_300, FashionCatalogItem } from "./fashion-catalog-data";

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
  window.dispatchEvent(new Event("looku_catalog_updated"));
  window.dispatchEvent(new Event("looku_presets_updated"));
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
