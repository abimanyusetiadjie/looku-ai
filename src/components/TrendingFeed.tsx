"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Heart, Sparkles, ExternalLink } from "lucide-react";
import { TRENDING_LOOKS_FEED } from "@/lib/presets";
import { OOTDRecommendation } from "@/lib/types";

interface TrendingFeedProps {
  isStandalone?: boolean;
  onSelectLook?: (outfit: OOTDRecommendation) => void;
}

type TabType = "ALL" | "WANITA" | "HIJAB" | "PRIA";

interface CategoryTab {
  id: TabType;
  label: string;
  count: number;
}

const CATEGORY_TABS: CategoryTab[] = [
  { id: "ALL", label: "SEMUA", count: 500 },
  { id: "WANITA", label: "WANITA", count: 170 },
  { id: "HIJAB", label: "HIJAB / MODEST", count: 170 },
  { id: "PRIA", label: "PRIA", count: 160 },
];

const SIGNATURE_PRIA_IDS = new Set([
  "trend_poly_m1", "trend_poly_m2", "trend_poly_m3", "trend_04", "trend_10", "trend_12"
]);
const SIGNATURE_HIJAB_IDS = new Set([
  "trend_01", "trend_03", "trend_06", "trend_07", "trend_14", "trend_15"
]);
const SIGNATURE_WANITA_IDS = new Set([
  "trend_poly_f1", "trend_poly_f2", "trend_poly_f3", "trend_02", "trend_05", "trend_08", "trend_09", "trend_11", "trend_13", "trend_16"
]);

function getLookGender(look: (typeof TRENDING_LOOKS_FEED)[0]): "PRIA" | "HIJAB" | "WANITA" {
  if (SIGNATURE_PRIA_IDS.has(look.id)) return "PRIA";
  if (SIGNATURE_HIJAB_IDS.has(look.id)) return "HIJAB";
  if (SIGNATURE_WANITA_IDS.has(look.id)) return "WANITA";

  if (look.tag === "MENSWEAR" || look.outfit?.id?.startsWith("pa_male") || look.outfit?.id?.startsWith("synthesized_male")) return "PRIA";
  if (look.tag === "MODEST CAPSULE" || look.outfit?.id?.startsWith("pa_hijab") || look.outfit?.id?.startsWith("synthesized_hijab")) return "HIJAB";
  return "WANITA";
}

type ClimateFilter = "all" | "hot" | "ac" | "mild" | "rainy";
type OccasionFilter = "all" | "campus" | "office" | "weekend" | "resort" | "party" | "streetwear";

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
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
  const [climateFilter, setClimateFilter] = useState<ClimateFilter>("all");
  const [occasionFilter, setOccasionFilter] = useState<OccasionFilter>("all");
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [selectedLookId, setSelectedLookId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const resetAllFilters = () => {
    setActiveTab("ALL");
    setClimateFilter("all");
    setOccasionFilter("all");
    setVisibleCount(PAGE_SIZE);
  };

  // Filter 500 looks based on Tab, Climate, & Occasion
  const filteredLooks = TRENDING_LOOKS_FEED.filter((look) => {
    // 1. Gender Category Tab
    if (activeTab !== "ALL") {
      const gender = getLookGender(look);
      if (gender !== activeTab) return false;
    }

    // 2. Climate / Temperature Filter
    if (climateFilter !== "all") {
      const climateInfo = getLookClimate(look);
      if (climateInfo.id !== climateFilter) return false;
    }

    // 3. Occasion Filter
    if (occasionFilter !== "all") {
      const c = (look.category || "").toLowerCase();
      const t = (look.title || "").toLowerCase();
      if (occasionFilter === "campus" && !(c.includes("campus") || t.includes("campus") || t.includes("kuliah"))) return false;
      if (occasionFilter === "office" && !(c.includes("work") || c.includes("meeting") || t.includes("corporate") || t.includes("office") || t.includes("blazer") || t.includes("slacks"))) return false;
      if (occasionFilter === "weekend" && !(c.includes("weekend") || c.includes("cafe") || t.includes("cafe") || t.includes("brunch") || t.includes("hangout"))) return false;
      if (occasionFilter === "resort" && !(c.includes("travel") || t.includes("resort") || t.includes("bali") || t.includes("coastal") || t.includes("linen"))) return false;
      if (occasionFilter === "party" && !(c.includes("pesta") || c.includes("reception") || t.includes("gala") || t.includes("silk") || t.includes("batik"))) return false;
      if (occasionFilter === "streetwear" && !(c.includes("streetwear") || t.includes("streetwear") || t.includes("cargo") || t.includes("biker") || t.includes("heavyweight") || t.includes("boxy"))) return false;
    }

    return true;
  });

  const displayedLooks = filteredLooks.slice(0, visibleCount);
  const selectedLook = TRENDING_LOOKS_FEED.find(l => l.id === selectedLookId);
  const isFilterActive = activeTab !== "ALL" || climateFilter !== "all" || occasionFilter !== "all";

  return (
    <section className="w-full bg-[#FAF8F5] min-h-screen pb-24">
      {/* Editorial Header Section */}
      <div className="pt-8 md:pt-14 pb-4 max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between border-b border-[#181A18]/10 pb-6 gap-4">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C5A3C] mb-1">
              Look.u Editorial Luxe
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#181A18] tracking-tight">
              Katalog Koleksi &amp; Lookbook
            </h1>
          </div>
          <p className="text-xs text-[#181A18]/65 max-w-sm font-sans leading-relaxed">
            500 formula padu-padan iklim tropis terkurasi AI dari dataset Param Aggarwal, Myntra, Polyvore, dan arsip busana modest Indonesia.
          </p>
        </div>

        {/* ============================================================ */}
        {/* UNIQLO-STYLE CATEGORY TAB BAR (Tegas, Rata, Border-Bottom)   */}
        {/* ============================================================ */}
        <div className="flex items-center gap-2 sm:gap-6 border-b border-[#181A18]/15 mt-6 overflow-x-auto no-scrollbar">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`pb-3 px-1 text-xs sm:text-sm font-bold tracking-wider uppercase whitespace-nowrap transition-all border-b-2 relative ${
                  isActive
                    ? "border-[#181A18] text-[#181A18]"
                    : "border-transparent text-[#181A18]/45 hover:text-[#181A18] hover:border-[#181A18]/30"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`ml-1.5 text-[10px] font-mono ${isActive ? "text-[#8C5A3C]" : "text-[#181A18]/30"}`}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>

        {/* ============================================================ */}
        {/* SUB-FILTER BAR: Suhu Tropis & Acara (Utilitarian Minimalist) */}
        {/* ============================================================ */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mt-4 pt-3 border-t border-[#181A18]/10 text-xs">
          {/* Suhu / Iklim */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#181A18]/50 mr-1 shrink-0">SUHU:</span>
            {[
              { id: "all", label: "Semua Suhu" },
              { id: "hot", label: "☀️ Panas (>30°C)" },
              { id: "ac", label: "🏢 Dingin AC (20–24°C)" },
              { id: "mild", label: "🌤️ Hangat (28–30°C)" },
              { id: "rainy", label: "🌧️ Hujan / Sejuk (24–27°C)" }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleClimateFilter(f.id as ClimateFilter)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors shrink-0 rounded-none border ${
                  climateFilter === f.id
                    ? "bg-[#181A18] text-[#FAF8F5] border-[#181A18]"
                    : "bg-white text-[#181A18]/70 border-[#181A18]/15 hover:border-[#181A18]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Acara / Occasion + Reset */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#181A18]/50 mr-1 shrink-0">ACARA:</span>
            {[
              { id: "all", label: "Semua" },
              { id: "campus", label: "Kuliah" },
              { id: "office", label: "Kantor" },
              { id: "weekend", label: "Kafe" },
              { id: "resort", label: "Resort" },
              { id: "party", label: "Pesta" },
              { id: "streetwear", label: "Street" }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => handleOccasionFilter(f.id as OccasionFilter)}
                className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors shrink-0 rounded-none border ${
                  occasionFilter === f.id
                    ? "bg-[#8C5A3C] text-[#FAF8F5] border-[#8C5A3C]"
                    : "bg-white text-[#181A18]/70 border-[#181A18]/15 hover:border-[#8C5A3C]"
                }`}
              >
                {f.label}
              </button>
            ))}

            {isFilterActive && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="ml-2 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-[#8C5A3C] hover:text-[#181A18] underline underline-offset-2 shrink-0"
              >
                Reset
              </button>
            )}
          </div>
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
                  onClick={() => {
                    if (onSelectLook && look.outfit) {
                      onSelectLook(look.outfit);
                    } else {
                      setSelectedLookId(look.id);
                    }
                  }}
                  className="group flex flex-col bg-white border border-[#181A18]/10 p-2 sm:p-2.5 hover:shadow-md transition-all duration-300 rounded-none cursor-pointer"
                >
                  {/* Kanvas Foto 4:5 Latar Warm Stone (#EFECE6) */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EFECE6] rounded-none">
                    <img
                      src={look.image}
                      alt={look.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Badge Iklim Kontekstual di Kiri Atas */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="inline-block px-2 py-0.5 text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-wider bg-[#181A18]/90 text-[#FAF8F5] shadow-xs">
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
                      {/* Baris 1: 3 Dot Swatches Palet Warna + Tag Kategori */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1">
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
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#8C5A3C] truncate max-w-[110px]">
                          {look.tag}
                        </span>
                      </div>

                      {/* Baris 2: Judul Formula (Strict line-clamp-1) */}
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#181A18] group-hover:text-terracotta-600 transition-colors line-clamp-1 leading-snug">
                        {look.title}
                      </h3>

                      {/* Baris 3: Deskripsi Bahan / Vibe (Strict line-clamp-1) */}
                      <p className="text-[10px] sm:text-[11px] text-[#181A18]/65 line-clamp-1 mt-0.5">
                        {look.outfit?.items?.[0]?.material || look.vibe}
                      </p>
                    </div>

                    {/* Baris 4: Harga Set IDR (Rata & Tegas) */}
                    <div className="pt-2 mt-2 border-t border-[#181A18]/10 flex items-center justify-between">
                      <span className="text-[9px] font-mono uppercase tracking-wider text-[#181A18]/45">
                        Estimasi
                      </span>
                      <span className="font-mono text-xs font-bold text-[#181A18]">
                        {look.priceRange.replace(" / Set", "")}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            /* Empty State */
            <div className="col-span-2 lg:col-span-4 flex flex-col items-center justify-center py-20 text-center bg-white border border-[#181A18]/10 p-8">
              <p className="font-serif text-xl text-[#181A18] mb-1">Belum ada gaya untuk filter ini</p>
              <p className="text-xs text-[#181A18]/60 mb-4">Silakan sesuaikan filter suhu/acara atau kembali ke seluruh katalog.</p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="h-10 px-6 bg-[#181A18] text-white text-xs font-bold uppercase tracking-widest rounded-none hover:bg-[#8C5A3C] transition-colors"
              >
                KEMBALI KE SEMUA (500)
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
                  />
                  <div className="absolute top-2.5 left-2.5 bg-[#181A18]/90 text-white px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-widest">
                    {getLookClimate(selectedLook).badge}
                  </div>
                </div>
              </div>

              {/* Kolom Informasi Kanan */}
              <div className="w-full md:w-1/2 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#8C5A3C]">
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
                    <span className="font-bold text-[#181A18] block text-[11px] mb-0.5">
                      Cocok untuk Warna Kulit:
                    </span>
                    <p className="text-[#181A18]/70 text-[11px] leading-relaxed">
                      {selectedLook.outfit?.skinToneMatch || selectedLook.skinToneRecommendation}
                    </p>
                  </div>

                  {/* Rincian Komponen Baju (Termasuk Sepatu & Aksesoris Terkurasi) */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]/50 block">
                        KOMPOSISI ITEM REAL ({selectedLook.outfit?.items?.length || 0} PIECES):
                      </span>
                      <span className="text-[9px] font-mono text-[#8C5A3C] uppercase">Authentic Catalog</span>
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

                        return (
                          <div key={idx} className="flex items-center gap-2.5 py-1.5 px-2 bg-stone-50/70 border border-[#181A18]/5">
                            {it.imageUrl ? (
                              <img
                                src={it.imageUrl}
                                alt={it.name}
                                className="w-10 h-10 object-cover bg-white border border-[#181A18]/10 shrink-0"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-stone-100 border border-[#181A18]/10 shrink-0 flex items-center justify-center text-[10px] text-stone-500 font-mono">
                                ✦
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="text-[8px] font-mono uppercase tracking-wider text-[#8C5A3C] block font-bold">
                                {catLabel}
                              </span>
                              <span className="text-[#181A18] text-[11px] font-medium truncate block">
                                {it.name}
                              </span>
                              {it.material && (
                                <span className="text-[10px] text-stone-500 truncate block">
                                  {it.material}
                                </span>
                              )}
                            </div>
                            <span className="font-mono text-[#181A18]/80 text-[11px] font-semibold shrink-0">
                              {it.estimatedPrice}
                            </span>
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

                  <button
                    type="button"
                    onClick={() => {
                      if (onSelectLook && selectedLook.outfit) {
                        onSelectLook(selectedLook.outfit);
                        setSelectedLookId(null);
                      } else {
                        window.location.href = `/studio?look=${selectedLook.id}`;
                      }
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
    </section>
  );
}
