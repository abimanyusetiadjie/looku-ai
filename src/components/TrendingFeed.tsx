"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Heart, ArrowUpRight, Maximize2, LayoutGrid, Rows } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TRENDING_LOOKS_FEED } from "@/lib/presets";
import { TrendingLook, OOTDRecommendation } from "@/lib/types";
import ImageLightboxModal from "./ImageLightboxModal";

interface TrendingFeedProps {
  onSelectLook: (outfit: OOTDRecommendation) => void;
}

export default function TrendingFeed({ onSelectLook }: TrendingFeedProps) {
  const [likes, setLikes] = useState<Record<string, number>>({
    trend_01: 1248,
    trend_02: 982,
    trend_03: 856,
    trend_04: 645,
    trend_05: 789,
    trend_06: 912,
    trend_07: 834,
    trend_08: 1105,
  });
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [selectedLightboxLook, setSelectedLightboxLook] = useState<TrendingLook | null>(null);

  // Concept C: Category Filter & Mobile View Mode State
  const [selectedTags, setSelectedTags] = useState<string[]>(["all"]);

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
  const [mobileViewMode, setMobileViewMode] = useState<"reel" | "grid">("reel");
  const [activeReelIndex, setActiveReelIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");

  const reelScrollRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: "all", label: "Semua Look" },
    { id: "hijab", label: "Hijab Friendly" },
    { id: "campus", label: "Campus & Work" },
    { id: "weekend", label: "Weekend & Cafe" },
    { id: "streetwear", label: "Streetwear" },
    { id: "formal", label: "Pesta / Kondangan" },
  ];

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

    // Multi-tag filter
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

  const toggleLike = (id: string) => {
    let updated: string[];
    if (likedIds.includes(id)) {
      updated = likedIds.filter((item) => item !== id);
      setLikes((prev) => ({ ...prev, [id]: prev[id] - 1 }));
    } else {
      updated = [...likedIds, id];
      setLikes((prev) => ({ ...prev, [id]: prev[id] + 1 }));
    }
    setLikedIds(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_liked_looks", JSON.stringify(updated));
    }
  };

  const getSkinToneColors = (recommendation: string) => {
    if (recommendation.includes("Sawo Matang")) return ["#C69365", "#E8C4A2"];
    if (recommendation.includes("Putih Gading")) return ["#F7E2D3", "#E8C4A2"];
    if (recommendation.includes("Eksotis")) return ["#C69365", "#9E6C45"];
    return ["#C69365", "#633E2B"];
  };

  const handleReelScroll = () => {
    if (!reelScrollRef.current) return;
    const { scrollLeft, offsetWidth } = reelScrollRef.current;
    const index = Math.round(scrollLeft / (offsetWidth * 0.8));
    setActiveReelIndex(index);
  };

  return (
    <>
      <section id="trending" className="py-14 sm:py-20 border-b border-[#E8DFD1] bg-[#FAF8F5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Title with Lookbook Index */}
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#D7CABC] pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
                <span className="lookbook-label">CURATED STREETWEAR & MODEST FEED</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181A18] tracking-tight">
                Trending Lookbook Indonesia
              </h2>
            </div>

            {/* Mobile View Switcher & Edition Tag */}
            <div className="flex items-center justify-between md:justify-end gap-3">
              {/* Mobile View Toggle (Reel vs 2-Col Grid) */}
              <div className="flex md:hidden items-center bg-[#F4EFE6] p-1 rounded-xl border border-[#E8DFD1]">
                <button
                  onClick={() => setMobileViewMode("reel")}
                  aria-label="Slide Reel Mode"
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    mobileViewMode === "reel"
                      ? "bg-[#181A18] text-white shadow-xs"
                      : "text-[#A89582] hover:text-[#181A18]"
                  }`}
                  title="Slide Reel Mode"
                >
                  <Rows className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Reel</span>
                </button>
                <button
                  onClick={() => setMobileViewMode("grid")}
                  aria-label="2-Column Grid Mode"
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    mobileViewMode === "grid"
                      ? "bg-[#181A18] text-white shadow-xs"
                      : "text-[#A89582] hover:text-[#181A18]"
                  }`}
                  title="2-Column Grid Mode"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="text-[10px]">Grid</span>
                </button>
              </div>

              <div className="text-[11px] font-mono text-[#A89582] uppercase tracking-widest flex items-center gap-2">
                <span>EDISI MINGGU INI</span>
                <span className="text-[#181A18]">•</span>
                <span>8 LOOKS</span>
              </div>
            </div>
          </div>

          {/* Search & Category Filter Pills Bar */}
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="🔍 Cari gaya: kafe, kondangan, linen, blazer, santai, formal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-2xl bg-white border border-sand-200 text-xs text-charcoal-900 placeholder:text-sand-500 focus:outline-none focus:border-charcoal-900 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sand-500 hover:text-charcoal-900 text-xs"
              >
                ✕
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-2">
            {categories.map((cat) => {
              const isSelected = selectedTags.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleTag(cat.id)}
                  aria-label={`Filter by ${cat.label}`}
                  className={`relative px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors tracking-wider uppercase shrink-0 z-10 flex items-center gap-1.5 ${
                    isSelected ? "text-[#FAF8F5] bg-[#181A18]" : "text-[#181A18]/70 hover:text-[#181A18] border border-[#E8DFD1] bg-white hover:bg-[#F4EFE6]"
                  }`}
                >
                  {isSelected && cat.id !== "all" && (
                    <span className="w-3 h-3 rounded-full bg-terracotta-500 flex items-center justify-center shrink-0">
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </span>
                  )}
                  <span>{cat.label}</span>
                </button>
              );
            })}
            {!selectedTags.includes("all") && (
              <button
                onClick={() => setSelectedTags(["all"])}
                className="ml-2 px-3 py-2 rounded-full text-[10px] font-bold text-terracotta-600 bg-terracotta-50 border border-terracotta-200 hover:bg-terracotta-100 whitespace-nowrap shrink-0 uppercase tracking-widest"
              >
                Reset Filter
              </button>
            )}
          </div>

          {/* MOBILE VIEW MODE 1: Horizontal Snap Reel (Swipe 👉 with Peek & Dots) */}
          <div className="block md:hidden">
            {mobileViewMode === "reel" ? (
              <div className="space-y-4">
                <div
                  ref={reelScrollRef}
                  onScroll={handleReelScroll}
                  className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2"
                >
                  {filteredLooks.map((item, idx) => {
                    const isLiked = likedIds.includes(item.id);
                    const toneColors = getSkinToneColors(item.skinToneRecommendation);

                    return (
                      <div
                        key={item.id}
                        className="w-[82vw] shrink-0 snap-center tactile-card overflow-hidden flex flex-col justify-between shadow-md bg-white border border-[#D7CABC]"
                      >
                        {/* Visual Image Banner with Hotspot & Lightbox Trigger */}
                        <motion.div
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            onSelectLook(item.outfit);
                            document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="relative w-full aspect-[4/5] bg-sand-200 animate-pulse overflow-hidden cursor-pointer"
                        >
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="85vw"
                            className="object-cover"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                            <span className="px-3 py-1 rounded-full bg-[#181A18]/85 text-[#FAF8F5] text-[9px] font-mono font-bold tracking-widest uppercase backdrop-blur-md">
                              {item.tag}
                            </span>

                            <motion.button
                              type="button"
                              whileTap={{ scale: 0.85 }}
                              aria-label={isLiked ? "Unlike" : "Like"}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(item.id);
                              }}
                              className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md shadow-md ${
                                isLiked
                                  ? "bg-terracotta-500 text-white"
                                  : "bg-white/90 text-[#181A18]"
                              }`}
                            >
                              <Heart
                                className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`}
                              />
                            </motion.button>
                          </div>

                          {/* Hotspot Dot */}
                          <div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveHotspot(activeHotspot === item.id ? null : item.id);
                            }}
                          >
                            <div className="relative w-6 h-6 flex items-center justify-center">
                              <span className="absolute w-full h-full rounded-full bg-white/40 animate-ping" />
                              <span className="w-3 h-3 rounded-full bg-white border-2 border-[#181A18] shadow-md z-10" />
                            </div>

                            <AnimatePresence>
                              {activeHotspot === item.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 5, scale: 0.9 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 5, scale: 0.9 }}
                                  className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-[#181A18] text-white p-2 rounded-xl shadow-xl border border-white/20 whitespace-nowrap text-[10px] z-30"
                                >
                                  <div className="font-bold">{item.outfit.items[0]?.name}</div>
                                  <div className="text-terracotta-400 font-mono text-[9px]">
                                    {item.outfit.items[0]?.estimatedPrice}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Bottom Category */}
                          <div className="absolute bottom-3 left-3">
                            <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-[#FAF8F5]/95 text-[#181A18] px-2.5 py-1 rounded-md shadow-xs">
                              {item.category}
                            </span>
                          </div>
                        </motion.div>

                        {/* Card Content & Action */}
                        <div className="p-4 flex flex-col justify-between flex-1 space-y-3.5">
                          <div className="space-y-2">
                            <div className="text-[10px] font-mono text-terracotta-600 font-bold tracking-widest uppercase">
                              {item.vibe}
                            </div>
                            <h3 className="font-serif font-bold text-lg text-[#181A18] leading-tight">
                              {item.title}
                            </h3>

                            {/* Tone Harmony */}
                            <div className="p-2 rounded-xl bg-[#FAF8F5] border border-[#E8DFD1] flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1.5">
                                <div className="flex -space-x-1">
                                  {toneColors.map((hex, i) => (
                                    <div
                                      key={i}
                                      className="w-3.5 h-3.5 rounded-full border border-white shrink-0"
                                      style={{ backgroundColor: hex }}
                                    />
                                  ))}
                                </div>
                                <span className="font-semibold text-[#181A18] text-[11px] truncate max-w-[130px]">
                                  {item.skinToneRecommendation}
                                </span>
                              </div>
                              <span className="font-mono font-bold text-[11px] text-[#181A18] bg-[#F4EFE6] px-1.5 py-0.5 rounded">
                                {item.priceRange.replace(" / Set", "")}
                              </span>
                            </div>
                          </div>

                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            onClick={() => {
                              onSelectLook(item.outfit);
                              document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="w-full py-3 px-4 rounded-xl bg-[#181A18] text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-xs"
                          >
                            <span>TRY THIS LOOK</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Progress Dots Indicator for Reel */}
                <div className="flex items-center justify-center gap-1.5 pt-1">
                  {filteredLooks.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeReelIndex === i
                          ? "w-6 bg-[#181A18]"
                          : "w-1.5 bg-[#D7CABC]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ) : (
              /* MOBILE VIEW MODE 2: Compact 2-Column Pinterest Grid */
              <div className="grid grid-cols-2 gap-3.5">
                {filteredLooks.map((item) => {
                  const isLiked = likedIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className="tactile-card overflow-hidden flex flex-col justify-between bg-white border border-[#E8DFD1] shadow-2xs"
                    >
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onSelectLook(item.outfit);
                          document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="relative w-full aspect-[3/4] bg-sand-200 animate-pulse overflow-hidden cursor-pointer"
                      >
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="45vw"
                          className="object-cover"
                        />
                        <button
                          type="button"
                          aria-label={isLiked ? "Unlike" : "Like"}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(item.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 shadow-sm"
                        >
                          <Heart className={`w-3 h-3 ${isLiked ? "fill-terracotta-500 text-terracotta-500" : "text-[#181A18]"}`} />
                        </button>
                      </motion.div>

                      <div className="p-2.5 flex flex-col justify-between flex-1 space-y-2">
                        <div>
                          <div className="text-[8px] font-mono text-terracotta-600 font-bold uppercase truncate">
                            {item.vibe}
                          </div>
                          <h4 className="font-serif font-bold text-xs text-[#181A18] line-clamp-1">
                            {item.title}
                          </h4>
                          <div className="text-[9px] font-mono font-bold text-[#181A18] mt-0.5">
                            {item.priceRange.replace(" / Set", "")}
                          </div>
                        </div>

                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          onClick={() => {
                            onSelectLook(item.outfit);
                            document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="w-full py-1.5 rounded-lg bg-[#181A18] text-white font-bold text-[9px] uppercase tracking-wider flex items-center justify-center gap-1"
                        >
                          <span>TRY</span>
                          <ArrowUpRight className="w-2.5 h-2.5" />
                        </motion.button>
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
              const toneColors = getSkinToneColors(item.skinToneRecommendation);

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="tactile-card overflow-hidden flex flex-col justify-between group shadow-sm hover:shadow-xl hover:border-[#181A18] transition-all duration-300 bg-white"
                >
                  {/* Visual Image Banner with Hotspots & Lightbox Trigger */}
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      onSelectLook(item.outfit);
                      document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="relative w-full aspect-[4/5] bg-sand-200 animate-pulse overflow-hidden cursor-pointer"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    />

                    {/* Gradient Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#181A18]/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    {/* Top Tag Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="px-3 py-1 rounded-full bg-[#181A18]/85 text-[#FAF8F5] text-[9px] font-mono font-bold tracking-widest uppercase backdrop-blur-md border border-white/10 shadow-sm">
                        {item.tag}
                      </span>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.85 }}
                        aria-label={isLiked ? "Unlike" : "Like"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                        className={`pointer-events-auto p-2.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                          isLiked
                            ? "bg-terracotta-500 text-white"
                            : "bg-white/90 hover:bg-white text-[#181A18]"
                        }`}
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${isLiked ? "fill-white" : ""}`}
                        />
                      </motion.button>
                    </div>

                    {/* Interactive Hotspot Pin (Top Item) */}
                    <div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspot(activeHotspot === item.id ? null : item.id);
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="relative w-6 h-6 flex items-center justify-center cursor-pointer"
                      >
                        <span className="absolute w-full h-full rounded-full bg-white/40 animate-ping" />
                        <span className="w-3 h-3 rounded-full bg-white border-2 border-[#181A18] shadow-md z-10" />
                      </motion.div>

                      {/* Tooltip Tag */}
                      <AnimatePresence>
                        {activeHotspot === item.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 5, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.9 }}
                            className="absolute bottom-7 left-1/2 -translate-x-1/2 bg-[#181A18] text-white p-2 rounded-xl shadow-xl border border-white/20 whitespace-nowrap text-[10px] z-30"
                          >
                            <div className="font-bold">{item.outfit.items[0]?.name}</div>
                            <div className="text-terracotta-400 font-mono text-[9px]">
                              {item.outfit.items[0]?.estimatedPrice}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Bottom Category Overlay & Zoom Hint */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="text-[9px] font-mono font-bold tracking-widest uppercase bg-[#FAF8F5]/95 text-[#181A18] px-2.5 py-1 rounded-md backdrop-blur-md shadow-sm border border-black/5">
                        {item.category}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLightboxLook(item);
                        }}
                        className="pointer-events-auto opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-md bg-[#181A18]/80 hover:bg-terracotta-500 text-white backdrop-blur-sm shadow-md"
                        title="Perbesar Tampilan Foto"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>

                  {/* Card Content & Action */}
                  <div className="p-5 flex flex-col justify-between flex-1 space-y-4">
                    <div className="space-y-3">
                      {/* Vibe Micro-Tag */}
                      <div className="text-[10px] font-mono text-terracotta-600 font-bold tracking-widest uppercase flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                        <span>{item.vibe}</span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-bold text-xl text-[#181A18] leading-snug group-hover:text-terracotta-500 transition-colors">
                        {item.title}
                      </h3>

                      {/* Tone Harmony Pill */}
                      <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E8DFD1] space-y-1.5">
                        <div className="flex items-center justify-between text-[9px] font-mono text-[#A89582] tracking-wider uppercase">
                          <span>TONE HARMONY</span>
                          <span className="font-bold text-terracotta-600">IDEAL MATCH</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-1.5">
                            {toneColors.map((hex, i) => (
                              <div
                                key={i}
                                className="w-4 h-4 rounded-full border-2 border-white shadow-sm shrink-0"
                                style={{ backgroundColor: hex }}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-semibold text-[#181A18] truncate">
                            {item.skinToneRecommendation}
                          </span>
                        </div>
                      </div>

                      {/* Budget Hangtag Badge */}
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[10px] font-mono tracking-wider uppercase text-[#A89582]">
                          EST. BUDGET
                        </span>
                        <span className="text-xs font-mono font-bold text-[#181A18] bg-[#F4EFE6] px-2 py-0.5 rounded-md border border-[#E8DFD1]">
                          {item.priceRange.replace(" / Set", "")}
                        </span>
                      </div>
                    </div>

                    {/* Action Button: TRY THIS LOOK */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        onSelectLook(item.outfit);
                        if (typeof window !== "undefined") {
                          const el = document.getElementById("studio");
                          el?.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                      className="w-full py-3 px-4 rounded-xl bg-[#181A18] hover:bg-terracotta-500 text-white font-bold text-xs tracking-widest uppercase transition-all flex items-center justify-center gap-2 shadow-sm group/btn"
                    >
                      <span>TRY THIS LOOK</span>
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </motion.button>
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
    </>
  );
}
