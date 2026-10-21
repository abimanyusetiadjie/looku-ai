"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ArrowRight, 
  Heart, 
  Sparkles, 
  ExternalLink,
  Search,
  Bookmark,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  Camera,
  Ruler
} from "lucide-react";
import dynamic from "next/dynamic";
import { 
  TRENDING_LOOKS_FEED, 
  getLookGender, 
  getLookHeight, 
  HeightFilterRange 
} from "@/lib/presets";
import { OOTDRecommendation, TrendingLook } from "@/lib/types";
import { trackAffiliateClick } from "@/lib/affiliate";
import { resolveSmartItemVisual, resolveCleanShoePackshot } from "@/lib/packshot-dictionary";

const InfluencerCloneModal = dynamic(() => import("@/components/InfluencerCloneModal"), { ssr: false });

export interface SelectedLookPayload {
  lookId: string;
  outfitId?: string;
  image: string;
  title: string;
  tag?: string;
  priceRange?: string;
  vibe?: string;
  category?: string;
  outfit?: OOTDRecommendation;
}

interface TrendingFeedProps {
  isStandalone?: boolean;
  onSelectLook?: (look: SelectedLookPayload | OOTDRecommendation) => void;
}

type TabType = "ALL" | "WANITA" | "HIJAB" | "PRIA";

interface CategoryTab {
  id: TabType;
  label: string;
  count: number;
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: "ALL", label: "SEMUA", count: TRENDING_LOOKS_FEED.length },
  { id: "WANITA", label: "WANITA", count: TRENDING_LOOKS_FEED.filter((l) => getLookGender(l) === "WANITA").length },
  { id: "HIJAB", label: "HIJAB / MODEST", count: TRENDING_LOOKS_FEED.filter((l) => getLookGender(l) === "HIJAB").length },
  { id: "PRIA", label: "PRIA", count: TRENDING_LOOKS_FEED.filter((l) => getLookGender(l) === "PRIA").length },
];

type ClimateFilter = "all" | "hot" | "ac" | "mild" | "rainy";
type OccasionFilter = "all" | "campus" | "office" | "weekend" | "resort" | "party" | "streetwear";
type SortOption = "trending" | "breathability" | "price_asc" | "price_desc";

export interface QuickChip {
  id: string;
  label: string;
}

export const QUICK_CHIPS: QuickChip[] = [
  { id: "for-you", label: "For you" },
  { id: "fashion", label: "Fashion" },
  { id: "hot", label: "Panas (>30°C)" },
  { id: "hijab", label: "Hijab Friendly" },
  { id: "office", label: "Smart SCBD" },
  { id: "campus", label: "Kuliah Santai" },
  { id: "weekend", label: "Kafe Weekend" },
  { id: "pria", label: "Pria Menswear" },
  { id: "ac", label: "Dingin AC (20–24°C)" },
  { id: "kondangan", label: "Kondangan Pesta" },
  { id: "resort", label: "Resort Linen" },
  { id: "streetwear", label: "Streetwear" },
];

const PAGE_SIZE = 16;

export interface ClimateClassification {
  id: "hot" | "ac" | "mild" | "rainy";
  badge: string;
  temp: string;
  label: string;
}

export function getLookClimate(look: (typeof TRENDING_LOOKS_FEED)[0]): ClimateClassification {
  const cat = (look.category || "").toLowerCase();
  const vibe = (look.vibe || "").toLowerCase();
  const t = (look.title || "").toLowerCase();
  const outfitTitle = (look.outfit?.title || "").toLowerCase();

  // 1. Ruang AC Dingin / Kantor / Formal (20–24°C)
  if (
    cat.includes("work") || cat.includes("meeting") || cat.includes("reception") || cat.includes("pesta") ||
    vibe.includes("corporate") || vibe.includes("formal") || vibe.includes("cocktail") || vibe.includes("office") || vibe.includes("luxe") ||
    t.includes("blazer") || t.includes("corporate") || t.includes("gala") || t.includes("scbd") || t.includes("suit") || t.includes("slacks") || t.includes("oxford") || t.includes("batik") ||
    outfitTitle.includes("blazer") || outfitTitle.includes("corporate")
  ) {
    return {
      id: "ac",
      badge: "🏢 RUANG AC 20–24°C",
      temp: "20–24°C",
      label: "Dingin AC (20–24°C)"
    };
  }

  // 2. Hujan / Sejuk / Layering (24–27°C)
  if (
    t.includes("rainy") || t.includes("hujan") || t.includes("cardigan") || t.includes("knit") || t.includes("sweatshirt") || t.includes("biker") || t.includes("layering") ||
    vibe.includes("cozy") || vibe.includes("layering") || vibe.includes("warm")
  ) {
    return {
      id: "rainy",
      badge: "🌧️ HUJAN / SEJUK 24°C",
      temp: "24–27°C",
      label: "Hujan / Sejuk (24–27°C)"
    };
  }

  // 3. Hangat Normal / Luar Ruang Pagi-Sore (28–30°C)
  if (
    cat.includes("travel") || vibe.includes("resort") || vibe.includes("brunch") || vibe.includes("nomad") || vibe.includes("vacation") ||
    t.includes("resort") || t.includes("bali") || t.includes("nomad") || t.includes("brunch") || t.includes("streetwear")
  ) {
    return {
      id: "mild",
      badge: "🌤️ HANGAT 28–30°C",
      temp: "28–30°C",
      label: "Hangat (28–30°C)"
    };
  }

  // 4. Panas Terik (>30°C / Tropis Siang)
  return {
    id: "hot",
    badge: "☀️ PANAS TERIK 31–35°C",
    temp: "31–35°C",
    label: "Panas (>30°C)"
  };
}

export default function TrendingFeed({ isStandalone, onSelectLook }: TrendingFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeQuickChip, setActiveQuickChip] = useState("for-you");

  const handleSelectLookForStudio = (look: (typeof TRENDING_LOOKS_FEED)[0]) => {
    const payload: SelectedLookPayload = {
      lookId: look.id,
      outfitId: look.outfit?.id || look.id,
      image: look.image,
      title: look.title,
      tag: look.tag,
      priceRange: look.priceRange,
      vibe: look.vibe,
      category: look.category,
      outfit: look.outfit,
    };

    try {
      localStorage.setItem("looku_selected_studio_look", JSON.stringify(payload));
    } catch (e) {
      console.warn("Storage write failed", e);
    }

    if (onSelectLook) {
      onSelectLook(payload);
    } else {
      window.location.href = `/studio?look=${encodeURIComponent(look.id)}`;
    }
  };

  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [climateFilter, setClimateFilter] = useState<ClimateFilter>("all");
  const [occasionFilter, setOccasionFilter] = useState<OccasionFilter>("all");
  const [heightFilter, setHeightFilter] = useState<HeightFilterRange>("all");
  const [isVisualSearchOpen, setIsVisualSearchOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("trending");
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [selectedLookId, setSelectedLookId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [allFeedLooks, setAllFeedLooks] = useState<TrendingLook[]>(TRENDING_LOOKS_FEED);

  // Live Sync Lookbook Feed dengan Admin CMS
  useEffect(() => {
    const syncLookbook = () => {
      if (typeof window !== "undefined") {
        try {
          const customRaw = localStorage.getItem("looku_custom_lookbook");
          const customLooks: TrendingLook[] = customRaw ? JSON.parse(customRaw) : [];
          const deletedRaw = localStorage.getItem("looku_deleted_lookbook_ids");
          const deletedIds: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];

          const customIds = new Set(customLooks.map((l) => l.id));
          const activeDefault = TRENDING_LOOKS_FEED.filter(
            (l) => !deletedIds.includes(l.id) && !customIds.has(l.id)
          );

          setAllFeedLooks([...customLooks, ...activeDefault]);
        } catch (e) {
          console.warn("Gagal membaca custom lookbook:", e);
        }
      }
    };

    syncLookbook();
    window.addEventListener("looku_lookbook_updated", syncLookbook);
    window.addEventListener("storage", syncLookbook);
    return () => {
      window.removeEventListener("looku_lookbook_updated", syncLookbook);
      window.removeEventListener("storage", syncLookbook);
    };
  }, []);
  const [isLoading, setIsLoading] = useState(false);

  // Sync saved count for Bookmark icon badge
  useEffect(() => {
    const updateSavedCount = () => {
      try {
        const stored = localStorage.getItem("looku_saved_outfits");
        if (stored) {
          const parsed = JSON.parse(stored);
          setSavedCount(Array.isArray(parsed) ? parsed.length : 0);
        } else {
          setSavedCount(0);
        }
      } catch {
        setSavedCount(0);
      }
    };
    updateSavedCount();
    window.addEventListener("storage", updateSavedCount);
    window.addEventListener("looku_saved_updated", updateSavedCount);
    return () => {
      window.removeEventListener("storage", updateSavedCount);
      window.removeEventListener("looku_saved_updated", updateSavedCount);
    };
  }, []);

  // Lock body scroll and Escape key handler for Filter Modal
  useEffect(() => {
    if (isFilterModalOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFilterModalOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isFilterModalOpen]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleTabClick = (tabId: TabType) => {
    if (tabId === activeTab) return;
    setIsLoading(true);
    setActiveTab(tabId);
    setVisibleCount(PAGE_SIZE);
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleClimateFilter = (filter: ClimateFilter) => {
    setClimateFilter(filter);
    setVisibleCount(PAGE_SIZE);
  };

  const handleOccasionFilter = (filter: OccasionFilter) => {
    setOccasionFilter(filter);
    setVisibleCount(PAGE_SIZE);
  };

  const handleSelectQuickChip = (chipId: string) => {
    setActiveQuickChip(chipId);
    setVisibleCount(PAGE_SIZE);

    if (chipId === "for-you" || chipId === "fashion") {
      setActiveTab("ALL");
      setClimateFilter("all");
      setOccasionFilter("all");
    } else if (chipId === "hot") {
      setClimateFilter("hot");
      setActiveTab("ALL");
      setOccasionFilter("all");
    } else if (chipId === "hijab") {
      setActiveTab("HIJAB");
      setClimateFilter("all");
      setOccasionFilter("all");
    } else if (chipId === "office") {
      setOccasionFilter("office");
      setActiveTab("ALL");
      setClimateFilter("all");
    } else if (chipId === "campus") {
      setOccasionFilter("campus");
      setActiveTab("ALL");
      setClimateFilter("all");
    } else if (chipId === "weekend") {
      setOccasionFilter("weekend");
      setActiveTab("ALL");
      setClimateFilter("all");
    } else if (chipId === "pria") {
      setActiveTab("PRIA");
      setClimateFilter("all");
      setOccasionFilter("all");
    } else if (chipId === "ac") {
      setClimateFilter("ac");
      setActiveTab("ALL");
      setOccasionFilter("all");
    } else if (chipId === "kondangan") {
      setOccasionFilter("party");
      setActiveTab("ALL");
      setClimateFilter("all");
    } else if (chipId === "resort") {
      setOccasionFilter("resort");
      setActiveTab("ALL");
      setClimateFilter("all");
    } else if (chipId === "streetwear") {
      setOccasionFilter("streetwear");
      setActiveTab("ALL");
      setClimateFilter("all");
    }
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setActiveQuickChip("for-you");
    setActiveTab("ALL");
    setClimateFilter("all");
    setOccasionFilter("all");
    setHeightFilter("all");
    setSortBy("trending");
    setVisibleCount(PAGE_SIZE);
  };

  // Filter 500 looks based on Search Query, Tab, Climate, Occasion & Height
  const filteredLooks = allFeedLooks.filter((look) => {
    // 1. Search Query Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const titleMatch = (look.title || "").toLowerCase().includes(q);
      const vibeMatch = (look.vibe || "").toLowerCase().includes(q);
      const tagMatch = (look.tag || "").toLowerCase().includes(q);
      const catMatch = (look.category || "").toLowerCase().includes(q);
      const skinMatch = (look.skinToneRecommendation || "").toLowerCase().includes(q);
      const itemsMatch = look.outfit?.items?.some(it => 
        (it.name || "").toLowerCase().includes(q) || 
        (it.material || "").toLowerCase().includes(q) || 
        (it.color || "").toLowerCase().includes(q)
      );
      if (!titleMatch && !vibeMatch && !tagMatch && !catMatch && !skinMatch && !itemsMatch) {
        return false;
      }
    }

    // 2. Gender Category Tab
    if (activeTab !== "ALL") {
      const gender = getLookGender(look);
      if (gender !== activeTab) return false;
    }

    // 3. Climate / Temperature Filter
    if (climateFilter !== "all") {
      const climateInfo = getLookClimate(look);
      if (climateInfo.id !== climateFilter) return false;
    }

    // 4. Occasion Filter
    if (occasionFilter !== "all") {
      const c = (look.category || "").toLowerCase();
      const t = (look.title || "").toLowerCase();
      const v = (look.vibe || "").toLowerCase();
      if (occasionFilter === "campus" && !(c.includes("campus") || t.includes("campus") || t.includes("kuliah"))) return false;
      if (occasionFilter === "office" && !(c.includes("work") || c.includes("meeting") || t.includes("corporate") || t.includes("office") || t.includes("blazer") || t.includes("slacks") || v.includes("corporate"))) return false;
      if (occasionFilter === "weekend" && !(c.includes("weekend") || c.includes("cafe") || t.includes("cafe") || t.includes("brunch") || t.includes("hangout"))) return false;
      if (occasionFilter === "resort" && !(c.includes("travel") || t.includes("resort") || t.includes("bali") || t.includes("coastal") || t.includes("linen") || v.includes("resort"))) return false;
      if (occasionFilter === "party" && !(c.includes("pesta") || c.includes("reception") || t.includes("gala") || t.includes("silk") || t.includes("batik") || v.includes("formal"))) return false;
      if (occasionFilter === "streetwear" && !(c.includes("streetwear") || t.includes("streetwear") || t.includes("cargo") || t.includes("biker") || t.includes("heavyweight") || t.includes("boxy") || v.includes("streetwear"))) return false;
    }

    // 5. Height Filter (StyleHint Petite / Standard / Tall)
    if (heightFilter !== "all") {
      const h = getLookHeight(look);
      if (h.range !== heightFilter) return false;
    }

    return true;
  });

  // Sorting (Lapis 3: Prioritas Golden Signature Looks)
  const sortedLooks = [...filteredLooks].sort((a, b) => {
    // 1. Prioritaskan Golden Signature Looks di posisi teratas
    const aGold = a.isGoldenSignature ? 1 : 0;
    const bGold = b.isGoldenSignature ? 1 : 0;
    if (bGold !== aGold) {
      return bGold - aGold;
    }

    if (sortBy === "breathability") {
      const breathA = a.outfit?.comfortRating || 0;
      const breathB = b.outfit?.comfortRating || 0;
      return breathB - breathA;
    }
    if (sortBy === "price_asc") {
      const extractPrice = (str: string) => {
        const num = parseInt(str.replace(/[^0-9]/g, ""), 10);
        return isNaN(num) ? 0 : num;
      };
      return extractPrice(a.priceRange) - extractPrice(b.priceRange);
    }
    if (sortBy === "price_desc") {
      const extractPrice = (str: string) => {
        const num = parseInt(str.replace(/[^0-9]/g, ""), 10);
        return isNaN(num) ? 0 : num;
      };
      return extractPrice(b.priceRange) - extractPrice(a.priceRange);
    }
    return (b.likes || 0) - (a.likes || 0); // Default: Urutan likes tertinggi
  });

  const displayedLooks = sortedLooks.slice(0, visibleCount);
  const selectedLook = allFeedLooks.find(l => l.id === selectedLookId);
  const isFilterActive = searchQuery.trim() !== "" || activeTab !== "ALL" || climateFilter !== "all" || occasionFilter !== "all" || heightFilter !== "all" || sortBy !== "trending";
  const activeFilterCount = (activeTab !== "ALL" ? 1 : 0) + (climateFilter !== "all" ? 1 : 0) + (occasionFilter !== "all" ? 1 : 0) + (heightFilter !== "all" ? 1 : 0) + (sortBy !== "trending" ? 1 : 0);

  return (
    <section className="w-full bg-[#FAF8F5] min-h-screen pb-24">
      {/* ============================================================ */}
      {/* STICKY SEARCH & FILTER HEADER (INSTAGRAM EXPLORE STYLE)      */}
      {/* ============================================================ */}
      <div className="sticky top-0 md:top-20 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#181A18]/10 pt-[max(0.65rem,env(safe-area-inset-top))] pb-2.5 px-3.5 sm:px-8 shadow-2xs">
        <div className="max-w-[1400px] mx-auto flex flex-col gap-2.5">
          
          {/* Baris 1: Search Pill Input + Bookmark Icon (Persis Gambar Referensi) */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Search Capsule Input with Camera Visual Search (StyleHint) */}
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-4 w-4 h-4 sm:w-5 sm:h-5 text-[#181A18]/45 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                placeholder="Cari gaya, linen, blazer, kafe..."
                className="w-full h-11 sm:h-12 pl-11 sm:pl-12 pr-20 bg-[#EFECE6] hover:bg-[#EAE4DC] focus:bg-white text-[#181A18] placeholder:text-[#181A18]/40 text-sm font-sans rounded-full border border-transparent focus:border-[#181A18]/30 transition-all outline-none"
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Bersihkan pencarian"
                    onClick={() => setSearchQuery("")}
                    className="w-6 h-6 flex items-center justify-center rounded-full bg-[#181A18]/10 text-[#181A18] hover:bg-[#181A18]/25 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsVisualSearchOpen(true)}
                  aria-label="Visual Search dari Foto"
                  title="Visual Search AI: Cari OOTD dari foto kamera atau screenshot galeri"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-900 text-white hover:bg-neutral-800 flex items-center justify-center transition-all shadow-xs active:scale-95 shrink-0"
                >
                  <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Bookmark Icon Button on Right (Persis di foto) */}
            <Link
              href="/profile?tab=wardrobe"
              title="Buka Lemari Koleksi"
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#EFECE6] hover:bg-[#EAE4DC] flex items-center justify-center text-[#181A18] transition-colors shrink-0"
            >
              <Bookmark className="w-5 h-5 stroke-[1.8]" />
              {savedCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#8C5A3C] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center px-1 border-2 border-[#FAF8F5]">
                  {savedCount}
                </span>
              )}
            </Link>
          </div>

          {/* Baris 2: Filter Sliders Button + Horizontal Scrolling Quick Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 select-none">
            {/* 1. Filter Sliders Icon Button (Item pertama persis di foto) */}
            <button
              type="button"
              onClick={() => setIsFilterModalOpen(true)}
              className={`relative shrink-0 h-9 sm:h-10 px-3.5 rounded-full border flex items-center justify-center gap-1.5 transition-all ${
                activeFilterCount > 0
                  ? "bg-[#181A18] text-white border-[#181A18] shadow-xs"
                  : "bg-white text-[#181A18] border-[#181A18]/20 hover:border-[#181A18]"
              }`}
              title="Filter Terpadu (Suhu, Gender, Acara, Tinggi, Urutan)"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="min-w-[16px] h-4 text-[10px] font-mono font-bold rounded-full bg-[#8C5A3C] text-white flex items-center justify-center px-1">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* 2. Scrollable Rounded Pill Chips */}
            {QUICK_CHIPS.map((chip) => {
              const isSelected = activeQuickChip === chip.id && !searchQuery.trim();
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => handleSelectQuickChip(chip.id)}
                  className={`shrink-0 h-9 sm:h-10 px-4 rounded-full text-xs font-semibold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#181A18] text-[#FAF8F5] border-[#181A18] shadow-xs"
                      : "bg-white text-[#181A18]/80 border-[#181A18]/15 hover:border-[#181A18] hover:text-[#181A18]"
                  }`}
                >
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Baris 3: Height Filter Pills ala StyleHint */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 select-none text-[10px] font-mono border-t border-[#181A18]/5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 shrink-0 mr-1 flex items-center gap-1">
              <Ruler className="w-3 h-3 text-neutral-400" />
              <span>TINGGI MODEL:</span>
            </span>
            {[
              { id: "all", label: "SEMUA TINGGI" },
              { id: "petite", label: "PETITE (< 158 CM)" },
              { id: "standard", label: "STANDARD (158–165 CM)" },
              { id: "tall", label: "TALL (> 165 CM)" },
            ].map((h) => {
              const isSelected = heightFilter === h.id;
              return (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => {
                    setHeightFilter(h.id as any);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide transition-all border ${
                    isSelected
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                      : "bg-white text-neutral-700 border-neutral-200/90 hover:border-neutral-400"
                  }`}
                >
                  {h.label}
                </button>
              );
            })}
          </div>

          {/* Baris 3: Status Pencarian & Counter Ringkas */}
          {(isFilterActive || searchQuery.trim()) && (
            <div className="flex items-center justify-between text-[11px] text-[#181A18]/70 pt-0.5 px-1 border-t border-[#181A18]/5">
              <span>
                Menampilkan <strong className="text-[#181A18]">{sortedLooks.length}</strong> dari {allFeedLooks.length} formula OOTD
                {searchQuery.trim() && <span> untuk &ldquo;{searchQuery}&rdquo;</span>}
              </span>
              <button
                type="button"
                onClick={resetAllFilters}
                className="font-mono text-[10px] font-bold text-[#8C5A3C] uppercase underline hover:text-[#181A18] transition-colors"
              >
                Reset Filter ↺
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ============================================================ */}
      {/* 4:5 DISIPLIN GRID: 2-Col Mobile / 4-Col Desktop               */}
      {/* ============================================================ */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 mt-6">
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-6 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          {isLoading ? (
            /* Skeleton Loading State */
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col bg-white border border-[#181A18]/10 p-2.5 animate-pulse">
                <div className="w-full aspect-[4/5] bg-[#EFECE6]" />
                <div className="h-3 w-3/4 bg-[#EFECE6] mt-3" />
                <div className="h-2.5 w-1/2 bg-[#EFECE6] mt-1.5" />
                <div className="h-3 w-1/3 bg-[#EFECE6] mt-2 pt-1 border-t border-[#181A18]/10" />
              </div>
            ))
          ) : displayedLooks.length > 0 ? (
            displayedLooks.map((look) => {
              const climateInfo = getLookClimate(look);
              const isLiked = likedIds.includes(look.id);

              return (
                <article
                  key={look.id}
                  onClick={() => handleSelectLookForStudio(look)}
                  className="group flex flex-col bg-white border border-[#181A18]/10 p-2 sm:p-2.5 hover:shadow-md transition-all duration-300 rounded-none cursor-pointer"
                >
                  {/* Kanvas Foto 4:5 Latar Warm Stone (#EFECE6) */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EFECE6] rounded-none">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Badge Iklim Kontekstual & Golden Signature di Kiri Atas */}
                    <div className="absolute top-2 left-2 z-10 flex flex-col items-start gap-1">
                      {look.isGoldenSignature && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-[#8C5A3C] text-white shadow-xs">
                          ★ GOLDEN LOOK
                        </span>
                      )}
                      <span className="inline-block px-2 py-0.5 text-[11px] font-mono font-bold uppercase tracking-wider bg-[#181A18]/90 text-[#FAF8F5] shadow-xs">
                        {climateInfo.badge}
                      </span>
                    </div>

                    {/* Tombol Wishlist Minimalis di Kanan Atas */}
                    <button
                      type="button"
                      aria-label="Simpan Look"
                      onClick={(e) => toggleLike(look.id, e)}
                      className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/85 backdrop-blur-sm flex items-center justify-center text-[#181A18] shadow-xs hover:scale-110 active:scale-90 transition-transform"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-[#181A18] text-[#181A18]" : "text-stone-700"}`} />
                    </button>
                  </div>

                  {/* Metadata Bersih di Bawah Foto (Uniqlo Anatomy) */}
                  <div className="pt-2.5 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Baris 1: 3 Dot Swatches Palet Warna + Height Pill + Tag Kategori */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <div className="flex items-center gap-0.5">
                            {look.outfit?.colorPalette?.slice(0, 3).map((warna, idx) => (
                              <span
                                key={idx}
                                className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-[#181A18]/25 shadow-2xs"
                                style={{ backgroundColor: warna.hex }}
                                title={warna.name}
                              />
                            )) || (
                              <span className="w-2.5 h-2.5 rounded-full bg-[#181A18]" />
                            )}
                          </div>
                          <span className="text-[11px] font-mono text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded font-bold">
                            {getLookHeight(look).label}
                          </span>
                        </div>
                        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A3C] truncate max-w-[110px]">
                          {look.tag}
                        </span>
                      </div>

                      {/* Baris 2: Judul Formula (Strict line-clamp-1) */}
                      <h3 className="font-serif text-sm sm:text-base font-semibold text-[#181A18] group-hover:text-terracotta-600 transition-colors line-clamp-1 leading-snug">
                        {look.title}
                      </h3>

                      {/* Baris 3: Deskripsi Bahan / Vibe (Strict line-clamp-1) */}
                      <p className="text-xs text-[#181A18]/65 line-clamp-1 mt-0.5">
                        {look.outfit?.items?.[0]?.material || look.vibe}
                      </p>
                    </div>

                    {/* Baris 4: Harga Set IDR (Rata & Tegas) */}
                    <div className="pt-2 mt-2 border-t border-[#181A18]/10 flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#181A18]/60 font-semibold">
                        Estimasi
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#181A18]">
                        {look.priceRange.replace(" / Set", "")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            /* Empty State */
            <div className="col-span-2 lg:col-span-4 flex flex-col items-center justify-center py-16 text-center bg-white border border-[#181A18]/10 p-8 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-[#EFECE6] flex items-center justify-center text-[#181A18] mb-3">
                <Search className="w-6 h-6 stroke-[1.5]" />
              </div>
              <p className="font-serif text-xl text-[#181A18] mb-1">
                {searchQuery.trim() ? `Tidak ada gaya untuk "${searchQuery}"` : "Belum ada gaya untuk filter ini"}
              </p>
              <p className="text-xs text-[#181A18]/60 mb-4 max-w-sm">
                Silakan coba kata kunci pakaian lain atau sesuaikan filter suhu dan acara.
              </p>

              {/* Quick Keywords Chips */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-md mb-6">
                <span className="text-[11px] font-mono text-[#181A18]/70 uppercase tracking-wider block w-full mb-1 font-semibold">
                  Saran Pencarian Populer:
                </span>
                {["Linen", "Kulot", "SCBD", "Batik", "Hijab", "Blazer", "Sage", "Kemeja", "Casual"].map((kw) => (
                  <button
                    key={kw}
                    type="button"
                    onClick={() => {
                      setSearchQuery(kw);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className="px-3 py-1 bg-stone-100 hover:bg-[#181A18] hover:text-white rounded-full text-xs text-[#181A18] border border-[#181A18]/10 transition-colors"
                  >
                    {kw}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={resetAllFilters}
                className="h-10 px-6 bg-[#181A18] text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-[#8C5A3C] transition-colors shadow-xs"
              >
                Kembali ke Semua ({TRENDING_LOOKS_FEED.length})
              </button>
            </div>
          )}
        </div>

        {/* Load More Pagination Button */}
        {visibleCount < filteredLooks.length && (
          <div className="mt-12 flex flex-col items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="h-12 px-8 bg-[#181A18] text-[#FAF8F5] text-xs font-bold uppercase tracking-[0.18em] hover:bg-[#8C5A3C] active:opacity-90 transition-all rounded-none shadow-sm flex items-center gap-2.5"
            >
              <span>Muat Lebih Banyak ({Math.min(visibleCount + PAGE_SIZE, filteredLooks.length)} dari {filteredLooks.length} Set)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#181A18]/50">
              Menampilkan {Math.min(visibleCount, filteredLooks.length)} dari {filteredLooks.length} Formula Terkurasi
            </p>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL DETAIL OOTD (Shoppable & Weather-Aware)                */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedLook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => setSelectedLookId(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#FAF8F5] border border-[#181A18]/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative rounded-none shadow-2xl"
            >
              {/* Tombol Tutup */}
              <button
                type="button"
                aria-label="Tutup Detail"
                onClick={() => setSelectedLookId(null)}
                className="absolute top-3 right-3 z-20 w-8 h-8 bg-white border border-[#181A18]/20 flex items-center justify-center text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Kolom Foto Kiri */}
              <div className="w-full md:w-1/2 p-4 sm:p-6 bg-[#EFECE6] flex items-center justify-center">
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <img
                    src={selectedLook.image}
                    alt={selectedLook.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#181A18]/90 text-white px-2.5 py-1 text-[11px] font-mono font-bold uppercase tracking-wider">
                    {getLookClimate(selectedLook).badge}
                  </div>
                </div>
              </div>

              {/* Kolom Informasi Kanan */}
              <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#8C5A3C]">
                      {selectedLook.tag}
                    </span>
                    <span className="text-[#181A18]/30">·</span>
                    <span className="text-[10px] font-mono uppercase text-[#181A18]/60">
                      {selectedLook.category}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-[#181A18] leading-tight">
                    {selectedLook.title}
                  </h2>

                  <p className="text-xs text-[#181A18]/70 mt-1.5 leading-relaxed">
                    {selectedLook.outfit?.tagline || selectedLook.vibe}
                  </p>

                  {/* Rekomendasi Warna Kulit */}
                  <div className="mt-4 p-3 bg-white border border-[#181A18]/10 text-xs">
                    <span className="font-semibold text-[#181A18] block text-xs mb-0.5">
                      Cocok untuk Warna Kulit:
                    </span>
                    <p className="text-[#181A18]/70 text-xs leading-relaxed">
                      {selectedLook.outfit?.skinToneMatch || selectedLook.skinToneRecommendation}
                    </p>
                  </div>

                  {/* Rincian Komponen Baju (Termasuk Sepatu & Aksesoris Terkurasi) */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-[#181A18]/50 block">
                        KOMPOSISI ITEM REAL ({selectedLook.outfit?.items?.length || 0} PIECES):
                      </span>
                      <span className="text-[10px] font-mono text-[#8C5A3C] uppercase tracking-wider">Authentic Catalog</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {selectedLook.outfit?.items?.map((it, idx) => {
                        const categoryLabelMap: Record<string, string> = {
                          atasan: "Atasan",
                          bawahan: "Bawahan",
                          outer_hijab: "Hijab / Outer",
                          sepatu: "Sepatu / Alas Kaki",
                          aksesoris: "Aksesoris",
                        };
                        const catLabel = categoryLabelMap[it.category] || it.category;

                        const isShoe = it.category === "sepatu";
                        const slotKey = it.category === "atasan" ? "top" : it.category === "bawahan" ? "bottom" : it.category === "outer_hijab" ? "outer" : "shoes";
                        const visual = resolveSmartItemVisual(it, slotKey, selectedLook.image);
                        const displayImg = isShoe
                          ? resolveCleanShoePackshot(it.name, it.color, it.colorHex)
                          : visual.imageUrl || it.imageUrl;

                        return (
                          <div key={idx} className="flex items-center gap-2.5 py-1.5 px-2 bg-stone-50/70 border border-[#181A18]/5">
                            <div className="w-10 h-10 bg-[#EFECE6] border border-[#181A18]/10 shrink-0 overflow-hidden relative">
                              <img
                                src={displayImg}
                                alt={it.name}
                                className="w-full h-full object-cover object-top"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[10px] font-mono uppercase tracking-wider text-[#8C5A3C] block font-semibold">
                                {catLabel}
                              </span>
                              <span className="text-[#181A18] text-xs font-semibold truncate block">
                                {it.name}
                              </span>
                              {it.material && (
                                <span className="text-xs text-stone-500 truncate block">
                                  {it.material}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono text-[#181A18] text-xs font-semibold">
                                {it.estimatedPrice}
                              </span>
                              {it.shopeeUrl && (
                                <a
                                  href={it.shopeeUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    trackAffiliateClick("shopee", it.shopeeQuery || it.name, "outfit_card");
                                  }}
                                  className="px-2 py-0.5 bg-orange-50 hover:bg-orange-100 text-[#EE4D2D] border border-orange-200 text-[9px] font-mono font-bold uppercase rounded flex items-center gap-1 transition-colors"
                                  title="Beli langsung di Shopee"
                                >
                                  <span>Shopee ↗</span>
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Tombol Aksi Bawah Modal */}
                <div className="pt-4 border-t border-[#181A18]/10 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[#181A18]/50">Total Estimasi:</span>
                    <span className="text-base font-mono font-bold text-[#181A18]">{selectedLook.priceRange}</span>
                  </div>

                  {selectedLook.shopeeUrl && (
                    <a
                      href={selectedLook.shopeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackAffiliateClick("shopee", selectedLook.title, "outfit_card")}
                      className="w-full h-11 bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-colors rounded-none shadow-xs"
                    >
                      <span>🛍️ Beli Setelan Ini di Shopee</span>
                      <span>↗</span>
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      handleSelectLookForStudio(selectedLook);
                      setSelectedLookId(null);
                    }}
                    className="w-full h-11 bg-[#181A18] text-[#FAF8F5] text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-terracotta-600 transition-colors rounded-none"
                  >
                    <span>Racik Formula Ini di Studio</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MODAL / DRAWER FILTER LENGKAP LOOKBOOK (Advanced Filter)     */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isFilterModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop Gelap Solid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsFilterModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Card / Bottom Sheet */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative z-[70] w-full sm:max-w-lg bg-white border-t-2 sm:border-2 border-[#181A18] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-none"
            >
              {/* Mobile Drag Indicator */}
              <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 bg-white">
                <div className="w-12 h-1 bg-stone-300 rounded-full" />
              </div>

              {/* Header Modal */}
              <div className="px-5 py-4 border-b border-[#181A18]/15 flex items-center justify-between bg-white shrink-0">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#8C5A3C] bg-[#8C5A3C]/10 px-2 py-0.5">
                    Look.u Smart Filter
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#181A18] mt-1">
                    Filter Terpadu Lookbook
                  </h3>
                </div>

                <button
                  type="button"
                  aria-label="Tutup Filter"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="w-9 h-9 bg-stone-100 flex items-center justify-center text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors cursor-pointer shrink-0 ml-3"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Filter Options */}
              <div className="p-5 overflow-y-auto space-y-5 text-xs bg-[#FAF8F5]">
                {/* 1. Kategori Gender */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]/70 block mb-2">
                    Kategori Pengguna:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORY_TABS.map((tab) => {
                      const isSel = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(tab.id);
                            setActiveQuickChip("for-you");
                          }}
                          className={`p-2.5 text-xs font-semibold border flex items-center justify-between transition-colors ${
                            isSel
                              ? "bg-[#181A18] text-white border-[#181A18]"
                              : "bg-white text-[#181A18]/80 border-[#181A18]/15 hover:border-[#181A18]"
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span className="text-[10px] font-mono opacity-60">({tab.count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Suhu & Iklim Tropis */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]/70 block mb-2">
                    Kondisi Iklim &amp; Suhu:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "all", label: "Semua Suhu" },
                      { id: "hot", label: "☀️ Panas Terik (>30°C)" },
                      { id: "ac", label: "🏢 Dingin AC (20–24°C)" },
                      { id: "mild", label: "🌤️ Hangat (28–30°C)" },
                      { id: "rainy", label: "🌧️ Hujan / Sejuk (24–27°C)" }
                    ].map((f) => {
                      const isSel = climateFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setClimateFilter(f.id as ClimateFilter);
                            setActiveQuickChip("for-you");
                          }}
                          className={`p-2.5 text-xs font-semibold border text-left transition-colors ${
                            isSel
                              ? "bg-[#181A18] text-white border-[#181A18]"
                              : "bg-white text-[#181A18]/80 border-[#181A18]/15 hover:border-[#181A18]"
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Tujuan Acara / Occasion */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]/70 block mb-2">
                    Tujuan Acara (Occasion):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "all", label: "Semua Acara" },
                      { id: "campus", label: "🎒 Kuliah Kampus" },
                      { id: "office", label: "🏢 Kantor SCBD" },
                      { id: "weekend", label: "☕ Kafe & Weekend" },
                      { id: "resort", label: "🌴 Resort & Liburan" },
                      { id: "party", label: "✨ Kondangan Pesta" },
                      { id: "streetwear", label: "🛹 Streetwear Indie" }
                    ].map((f) => {
                      const isSel = occasionFilter === f.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setOccasionFilter(f.id as OccasionFilter);
                            setActiveQuickChip("for-you");
                          }}
                          className={`p-2.5 text-xs font-semibold border text-left transition-colors ${
                            isSel
                              ? "bg-[#8C5A3C] text-white border-[#8C5A3C]"
                              : "bg-white text-[#181A18]/80 border-[#181A18]/15 hover:border-[#8C5A3C]"
                          }`}
                        >
                          {f.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 4. Tinggi Badan Model (StyleHint Fit) */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]/70 block mb-2 flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Tinggi Badan Model:</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "all", label: "Semua Tinggi" },
                      { id: "petite", label: "Petite (< 158 cm)" },
                      { id: "standard", label: "Standard (158–165 cm)" },
                      { id: "tall", label: "Tall (> 165 cm)" },
                    ].map((h) => {
                      const isSel = heightFilter === h.id;
                      return (
                        <button
                          key={h.id}
                          type="button"
                          onClick={() => {
                            setHeightFilter(h.id as HeightFilterRange);
                            setActiveQuickChip("for-you");
                          }}
                          className={`p-2.5 text-xs font-semibold border text-left transition-colors ${
                            isSel
                              ? "bg-[#181A18] text-white border-[#181A18]"
                              : "bg-white text-[#181A18]/80 border-[#181A18]/15 hover:border-[#181A18]"
                          }`}
                        >
                          {h.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Urutan Tampilan (Sort) */}
                <div>
                  <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]/70 block mb-2">
                    Urutkan Tampilan:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "trending", label: "✦ Rekomendasi Terkini" },
                      { id: "breathability", label: "💨 Sirkulasi Adem Tertinggi" },
                      { id: "price_asc", label: "🏷️ Harga Terendah" },
                      { id: "price_desc", label: "💎 Harga Tertinggi" },
                    ].map((s) => {
                      const isSel = sortBy === s.id;
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSortBy(s.id as SortOption)}
                          className={`p-2.5 text-xs font-semibold border text-left transition-colors ${
                            isSel
                              ? "bg-[#181A18] text-white border-[#181A18]"
                              : "bg-white text-[#181A18]/80 border-[#181A18]/15 hover:border-[#181A18]"
                          }`}
                        >
                          {s.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Actions in Filter Modal */}
              <div className="p-4 bg-white border-t border-[#181A18]/15 flex items-center gap-3 shrink-0">
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-4 py-3 border border-[#181A18]/25 bg-white text-[#181A18] text-xs font-mono font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="flex-1 py-3 bg-[#181A18] text-[#FAF8F5] text-xs font-mono font-bold uppercase tracking-wider hover:bg-[#8C5A3C] active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>Terapkan Filter ({sortedLooks.length} Look)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Visual Search AI Modal (StyleHint Vision) */}
      <InfluencerCloneModal
        isOpen={isVisualSearchOpen}
        onClose={() => setIsVisualSearchOpen(false)}
        onOpenStudio={() => {
          setIsVisualSearchOpen(false);
          window.location.href = "/studio";
        }}
        onSelectDupeLook={(outfitData) => {
          setIsVisualSearchOpen(false);
          if (outfitData?.title) {
            setSearchQuery(outfitData.title.replace("✦", "").trim());
          }
        }}
      />
    </section>
  );
}
