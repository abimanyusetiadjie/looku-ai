"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Heart, 
  ArrowUpRight, 
  LayoutGrid, 
  Rows, 
  Share2, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Palette, 
  Sparkles,
  ShoppingBag,
  Layers,
  Shirt,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TRENDING_LOOKS_FEED } from "@/lib/presets";
import { TrendingLook, OOTDRecommendation } from "@/lib/types";
import ImageLightboxModal from "./ImageLightboxModal";
import StoryShareModal from "./StoryShareModal";

interface TrendingFeedProps {
  onSelectLook: (outfit: OOTDRecommendation) => void;
  userSkinTone?: string;
  isStandalone?: boolean;
}

export default function TrendingFeed({ onSelectLook, userSkinTone, isStandalone = false }: TrendingFeedProps) {
  const [likes, setLikes] = useState<Record<string, number>>({
    trend_01: 1248,
    trend_02: 982,
    trend_03: 856,
    trend_04: 645,
    trend_05: 789,
    trend_06: 912,
    trend_07: 834,
    trend_08: 1105,
    trend_09: 720,
    trend_10: 890,
    trend_11: 654,
    trend_12: 830,
    trend_13: 745,
    trend_14: 960,
    trend_15: 810,
    trend_16: 875,
  });
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [selectedLightboxLook, setSelectedLightboxLook] = useState<TrendingLook | null>(null);
  const [storyOutfit, setStoryOutfit] = useState<OOTDRecommendation | null>(null);

  // Default Mobile View Mode: 2-Column Pinterest Grid (Fashion Industry Standard)
  const [mobileViewMode, setMobileViewMode] = useState<"grid" | "reel">("grid");
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>(["all"]);
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>(userSkinTone || "all");

  const reelScrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "all", label: "Semua (16)" },
    { id: "hijab", label: "🧕 Modest Hijab" },
    { id: "campus", label: "🏢 SCBD & Kerja" },
    { id: "weekend", label: "☕ Santai Kafe" },
    { id: "streetwear", label: "🔥 Streetwear" },
    { id: "formal", label: "🌸 Pesta Kondangan" },
  ];

  const skinToneFilters = [
    { id: "all", label: "Semua Tone", hex: null },
    { id: "medium", label: "Sawo Matang", hex: "#C69365", matchText: "Sawo Matang" },
    { id: "light", label: "Kuning Langsat", hex: "#E8C4A2", matchText: "Kuning Langsat" },
    { id: "fair", label: "Putih Gading", hex: "#F7E2D3", matchText: "Putih Gading" },
    { id: "tan", label: "Eksotis", hex: "#9E6C45", matchText: "Eksotis" },
  ];

  // Auto-sync when user passes personal color quiz
  useEffect(() => {
    if (userSkinTone && userSkinTone !== "all") {
      setSelectedSkinTone(userSkinTone);
    }
  }, [userSkinTone]);

  // Load liked looks from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("looku_liked_looks");
        if (stored) setLikedIds(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleTag = (id: string) => {
    if (id === "all") {
      setSelectedTags(["all"]);
      return;
    }
    let updated = selectedTags.filter((t) => t !== "all");
    if (updated.includes(id)) {
      updated = updated.filter((t) => t !== id);
      if (updated.length === 0) updated = ["all"];
    } else {
      updated.push(id);
    }
    setSelectedTags(updated);
  };

  const toggleLike = (id: string) => {
    let updated: string[];
    if (likedIds.includes(id)) {
      updated = likedIds.filter((item) => item !== id);
      setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) - 1 }));
    } else {
      updated = [...likedIds, id];
      setLikes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    }
    setLikedIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_liked_looks", JSON.stringify(updated));
    }
  };

  const filteredLooks = TRENDING_LOOKS_FEED.filter((item) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        item.title.toLowerCase().includes(q) ||
        item.vibe.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.tag.toLowerCase().includes(q) ||
        item.skinToneRecommendation.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // Personal Color Skin Tone Filter
    if (selectedSkinTone !== "all") {
      const toneObj = skinToneFilters.find((t) => t.id === selectedSkinTone);
      if (toneObj?.matchText) {
        const matchesTone =
          item.skinToneRecommendation.toLowerCase().includes(toneObj.matchText.toLowerCase()) ||
          item.vibe.toLowerCase().includes(toneObj.matchText.toLowerCase()) ||
          item.outfit.skinToneMatch.toLowerCase().includes(toneObj.matchText.toLowerCase());
        if (!matchesTone) return false;
      }
    }

    // Multi-tag category filter
    if (selectedTags.includes("all")) return true;
    return selectedTags.some((tag) => {
      if (tag === "hijab") return item.category.includes("Hijab") || item.outfit.modestFriendly;
      if (tag === "campus") return item.category.includes("Campus") || item.category.includes("Work");
      if (tag === "weekend") return item.category.includes("Weekend");
      if (tag === "streetwear") return item.category.includes("Streetwear");
      if (tag === "formal") return item.category.includes("Pesta") || item.category.includes("Reception");
      return false;
    });
  });

  const handleReelScroll = () => {
    if (!reelScrollRef.current) return;
    const { scrollLeft, offsetWidth } = reelScrollRef.current;
    const index = Math.round(scrollLeft / (offsetWidth * 0.8));
    setActiveReelIndex(index);
  };

  return (
    <>
      <section id="trending" className={isStandalone ? "py-2 sm:py-6 bg-[#FAF8F5]" : "py-10 sm:py-16 border-b border-[#E8DFD1] bg-[#FAF8F5]"}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title (Only shown when not standalone lookbook page) */}
          {!isStandalone && (
            <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#D7CABC] pb-4 mb-6 gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                  <span className="lookbook-label">FEED INSPIRASI PILIHAN</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#181A18] tracking-tight">
                  Trending Lookbook Indonesia
                </h2>
              </div>
              <div className="text-xs font-mono text-sand-500">
                16 Formula OOTD Terkurasi Edisi 2026
              </div>
            </div>
          )}

          {/* FASHION APP DISCOVERY BAR (Unified, Compact & Professional) */}
          <div className="space-y-2.5 mb-6">
            {/* Row 1: Search Input + View Mode Switcher */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-charcoal-900/60 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Cari gaya: linen, kafe, scbd, hijab, blazer, batik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-10 pr-9 rounded-2xl bg-white border border-sand-300 text-xs sm:text-sm text-charcoal-900 font-medium placeholder:text-sand-400 focus:outline-none focus:border-charcoal-900 shadow-2xs transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-sand-200 text-charcoal-900 hover:bg-charcoal-900 hover:text-white text-xs flex items-center justify-center transition-colors"
                    aria-label="Reset pencarian"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Mobile View Toggle: 2-Col Grid vs Editorial Feed */}
              <div className="flex md:hidden items-center bg-white p-1 rounded-2xl border border-sand-300 shadow-2xs shrink-0">
                <button
                  onClick={() => setMobileViewMode("grid")}
                  aria-label="Tampilan Grid 2 Kolom"
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    mobileViewMode === "grid"
                      ? "bg-charcoal-900 text-white shadow-xs"
                      : "text-sand-500 hover:text-charcoal-900"
                  }`}
                  title="Grid 2 Kolom (Pinterest Style)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setMobileViewMode("reel")}
                  aria-label="Tampilan Feed Penuh"
                  className={`p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                    mobileViewMode === "reel"
                      ? "bg-charcoal-900 text-white shadow-xs"
                      : "text-sand-500 hover:text-charcoal-900"
                  }`}
                  title="Feed Penuh (Vogue Style)"
                >
                  <Rows className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Row 2: Horizontal Category Pill Rail */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => {
                const isSelected = selectedTags.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleTag(cat.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-charcoal-900 text-white border-charcoal-900 shadow-xs"
                        : "bg-white hover:bg-sand-100 text-charcoal-900/80 border-sand-300 shadow-2xs"
                    }`}
                  >
                    {isSelected && cat.id !== "all" && (
                      <Check className="w-3 h-3 text-terracotta-400" />
                    )}
                    <span>{cat.label}</span>
                  </button>
                );
              })}

              {!selectedTags.includes("all") && (
                <button
                  onClick={() => setSelectedTags(["all"])}
                  className="px-3 py-1.5 rounded-full text-[10px] font-bold text-terracotta-600 bg-terracotta-50 border border-terracotta-200 hover:bg-terracotta-100 whitespace-nowrap shrink-0 uppercase tracking-widest"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Row 3: Undertone Skin Tone Filter Chips (Slim & Minimalist) */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
              <span className="text-[10px] font-mono font-bold uppercase text-sand-500 tracking-wider shrink-0 flex items-center gap-1 mr-0.5">
                <Palette className="w-3 h-3 text-terracotta-500" />
                <span>UNDERTONE:</span>
              </span>
              {skinToneFilters.map((tone) => {
                const isToneActive = selectedSkinTone === tone.id;
                return (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedSkinTone(tone.id)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all shrink-0 flex items-center gap-1.5 border ${
                      isToneActive
                        ? "bg-sand-200 text-charcoal-900 border-charcoal-900 font-bold shadow-2xs"
                        : "bg-white/80 hover:bg-white text-charcoal-900/70 border-sand-200"
                    }`}
                  >
                    {tone.hex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                        style={{ backgroundColor: tone.hex }}
                      />
                    )}
                    <span>{tone.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Empty Search Result State */}
          {filteredLooks.length === 0 && (
            <div className="text-center py-16 px-4 bg-white rounded-3xl border border-sand-300 space-y-3 my-6 shadow-sm">
              <div className="w-14 h-14 rounded-2xl bg-sand-100 flex items-center justify-center mx-auto text-2xl shadow-2xs">
                🔍
              </div>
              <h3 className="font-serif font-bold text-lg text-charcoal-900">Tidak ada formula yang cocok</h3>
              <p className="text-xs text-sand-500 max-w-md mx-auto">
                Coba kata kunci lain (misal: &apos;linen&apos;, &apos;kafe&apos;, &apos;kondangan&apos;, &apos;formal&apos;, &apos;hijab&apos;) atau reset filter pencarian kamu.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTags(["all"]);
                  setSelectedSkinTone("all");
                }}
                className="mt-2 px-5 py-2.5 bg-charcoal-900 hover:bg-terracotta-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
              >
                Reset Semua Filter
              </button>
            </div>
          )}

          {/* MOBILE VIEW MODE 1: 2-Column Pinterest / Lemon8 Grid (DEFAULT MOBILE) */}
          <div className="block md:hidden">
            {mobileViewMode === "grid" ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredLooks.map((item) => {
                  const isLiked = likedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="group rounded-2xl bg-white border border-[#E8DFD1] hover:border-charcoal-900 hover:shadow-tactile transition-all overflow-hidden flex flex-col justify-between"
                    >
                      {/* Visual Photo Card */}
                      <div
                        onClick={() => onSelectLook(item.outfit)}
                        className="relative w-full aspect-[3/4] bg-sand-200 overflow-hidden cursor-pointer"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="48vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Top Floating Badges */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none">
                          <span className="px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-xs text-white text-[8px] font-mono font-bold tracking-wider uppercase">
                            {item.tag}
                          </span>

                          <button
                            type="button"
                            aria-label={isLiked ? "Unlike" : "Like"}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(item.id);
                            }}
                            className="pointer-events-auto p-1.5 rounded-full bg-white/90 backdrop-blur-xs shadow-sm"
                          >
                            <Heart className={`w-3 h-3 ${isLiked ? "fill-rose-500 text-rose-500" : "text-charcoal-900"}`} />
                          </button>
                        </div>

                        {/* Bottom Floating Price Tag */}
                        <div className="absolute bottom-2 left-2 pointer-events-none">
                          <span className="px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-charcoal-900 text-[9px] font-mono font-bold shadow-xs">
                            {item.priceRange.replace(" / Set", "")}
                          </span>
                        </div>
                      </div>

                      {/* Card Content & Action */}
                      <div className="p-3 space-y-2 flex flex-col justify-between flex-1">
                        <div>
                          <div className="text-[8px] font-mono text-terracotta-600 font-bold uppercase truncate">
                            {item.vibe}
                          </div>
                          <h4 className="font-serif font-bold text-xs text-[#181A18] line-clamp-1 mt-0.5">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-sand-500 line-clamp-1 mt-0.5">
                            {item.skinToneRecommendation}
                          </p>
                        </div>

                        <button
                          onClick={() => onSelectLook(item.outfit)}
                          className="w-full py-2 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <span>Racik Look</span>
                          <ArrowUpRight className="w-3 h-3 text-terracotta-400" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* MOBILE VIEW MODE 2: Full-Width Editorial Feed (Swipe / Scroll) */
              <div className="space-y-6">
                {filteredLooks.map((item) => {
                  const isLiked = likedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile overflow-hidden space-y-3"
                    >
                      {/* Photo Frame */}
                      <div
                        onClick={() => onSelectLook(item.outfit)}
                        className="relative w-full aspect-[4/5] bg-sand-200 overflow-hidden cursor-pointer"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="95vw"
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[9px] font-mono font-bold uppercase">
                            {item.tag}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(item.id);
                            }}
                            className="p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-md"
                          >
                            <Heart className={`w-4 h-4 ${isLiked ? "fill-rose-500 text-rose-500" : "text-charcoal-900"}`} />
                          </button>
                        </div>
                      </div>

                      {/* Card Details */}
                      <div className="p-4 pt-1 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-terracotta-600 font-bold uppercase">
                            {item.category}
                          </span>
                          <span className="text-xs font-mono font-bold text-charcoal-900">
                            {item.priceRange}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-serif font-bold text-base text-[#181A18]">
                            {item.title}
                          </h4>
                          <p className="text-xs text-sand-500 mt-0.5">
                            {item.outfit.tagline}
                          </p>
                        </div>

                        {/* Garment Breakdown List */}
                        <div className="space-y-1.5 pt-1">
                          {item.outfit.items.slice(0, 3).map((piece, pIdx) => (
                            <div key={pIdx} className="flex items-center justify-between text-xs py-1 border-b border-sand-100">
                              <span className="text-charcoal-900/80 font-medium truncate max-w-[200px]">
                                • {piece.name}
                              </span>
                              <span className="text-[11px] font-mono text-sand-500 shrink-0">
                                {piece.estimatedPrice}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            onClick={() => onSelectLook(item.outfit)}
                            className="flex-1 py-3 px-4 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <span>Racik di Studio OOTD</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setStoryOutfit(item.outfit)}
                            className="p-3 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900"
                            title="Bagikan Story"
                          >
                            <Share2 className="w-4 h-4 text-terracotta-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DESKTOP VIEW: Responsive 4-Column Editorial Grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredLooks.map((item, idx) => {
              const isLiked = likedIds.includes(item.id);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.04 }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl bg-white border border-[#E8DFD1] hover:border-charcoal-900 hover:shadow-tactile transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Visual Photo Card */}
                    <div
                      onClick={() => onSelectLook(item.outfit)}
                      className="relative w-full aspect-[4/5] bg-sand-200 overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 1200px) 50vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-charcoal-900 text-[9px] font-mono font-bold tracking-wider uppercase shadow-xs">
                          {item.tag}
                        </span>

                        <button
                          type="button"
                          aria-label={isLiked ? "Unlike" : "Like"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(item.id);
                          }}
                          className="p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-sm hover:scale-110 transition-transform"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-500 text-rose-500" : "text-charcoal-900"}`} />
                        </button>
                      </div>

                      {/* Bottom Price Tag */}
                      <div className="absolute bottom-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-xs text-white text-[10px] font-mono font-bold">
                          {item.priceRange.replace(" / Set", "")}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-1.5">
                      <div className="text-[10px] font-mono text-sand-500 uppercase tracking-wider">
                        {item.category}
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#181A18] line-clamp-1 group-hover:text-terracotta-600 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-sand-500 line-clamp-1">
                        {item.skinToneRecommendation}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => onSelectLook(item.outfit)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                    >
                      <span>Racik Look</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setStoryOutfit(item.outfit)}
                      className="p-2.5 rounded-xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 transition-colors"
                      title="Ekspor Story (9:16)"
                    >
                      <Share2 className="w-3.5 h-3.5 text-terracotta-600" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedLightboxLook && (
        <ImageLightboxModal
          look={selectedLightboxLook}
          onClose={() => setSelectedLightboxLook(null)}
          onTryLook={onSelectLook}
        />
      )}

      {/* Story Share Modal */}
      {storyOutfit && (
        <StoryShareModal
          outfit={storyOutfit}
          onClose={() => setStoryOutfit(null)}
        />
      )}
    </>
  );
}
