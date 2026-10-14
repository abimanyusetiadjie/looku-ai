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
  { id: "ALL", label: "SEMUA", count: 22 },
  { id: "WANITA", label: "WANITA", count: 10 },
  { id: "HIJAB", label: "HIJAB / MODEST", count: 6 },
  { id: "PRIA", label: "PRIA", count: 6 },
];

function getContextualClimateBadge(title: string, category: string): string {
  const t = title.toLowerCase();
  const c = category.toLowerCase();
  
  if (t.includes("biker") || t.includes("corporate") || t.includes("silk draping") || t.includes("gala") || t.includes("scbd") || t.includes("blazer")) {
    return "INDOOR AC / EVENING";
  }
  if (t.includes("rainy") || t.includes("hujan") || t.includes("cardigan cozy") || t.includes("layering")) {
    return "BREEZY / RAINY 24°C";
  }
  return "AIRY TROPICAL · OPTIMAL";
}

export default function TrendingFeed({ isStandalone, onSelectLook }: TrendingFeedProps) {
  const [activeTab, setActiveTab] = useState<TabType>("ALL");
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
    setTimeout(() => setIsLoading(false), 250);
  };

  // Filter 22 looks based on Tab
  const filteredLooks = TRENDING_LOOKS_FEED.filter((look) => {
    if (activeTab === "ALL") return true;

    const t = look.title.toLowerCase();
    const c = look.category.toLowerCase();
    const tag = look.tag.toLowerCase();
    const isPria = t.includes("pria") || t.includes("chino") || t.includes("menswear") || tag.includes("menswear") || tag.includes("myntra") || t.includes("batik modern tulis") || t.includes("office nomad");

    if (activeTab === "PRIA") {
      return isPria;
    }

    if (activeTab === "HIJAB") {
      if (isPria) return false;
      return look.outfit?.modestFriendly || c.includes("hijab") || t.includes("chiffon") || t.includes("vest") || t.includes("corporate") || t.includes("rainy") || t.includes("pastel");
    }

    if (activeTab === "WANITA") {
      // Non-hijab female / universal chic
      if (isPria) return false;
      const isPureHijab = c.includes("campus & hijab") || t.includes("casual campus chiffon") || t.includes("modern modest silk") || t.includes("sweetheart pastel date");
      return !isPureHijab;
    }

    return true;
  });

  const selectedLook = TRENDING_LOOKS_FEED.find(l => l.id === selectedLookId);

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
            22 formula padu-padan iklim tropis terkurasi AI dari dataset Polyvore, Myntra, dan arsip busana lokal Indonesia.
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
          ) : filteredLooks.length > 0 ? (
            filteredLooks.map((look) => {
              const climateBadge = getContextualClimateBadge(look.title, look.category);
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
                        {climateBadge}
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
              <p className="font-serif text-xl text-[#181A18] mb-1">Belum ada gaya untuk kategori ini</p>
              <p className="text-xs text-[#181A18]/60 mb-4">Silakan pilih kategori lain atau kembali ke seluruh koleksi.</p>
              <button
                type="button"
                onClick={() => handleTabClick("ALL")}
                className="h-10 px-6 bg-[#181A18] text-white text-xs font-bold uppercase tracking-widest rounded-none"
              >
                KEMBALI KE SEMUA (22)
              </button>
            </div>
          )}
        </div>
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
                    {getContextualClimateBadge(selectedLook.title, selectedLook.category)}
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

                  {/* Rincian Komponen Baju */}
                  <div className="mt-4 space-y-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]/50 block">
                      KOMPOSISI SET:
                    </span>
                    {selectedLook.outfit?.items?.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-[#181A18]/5">
                        <span className="text-[#181A18] font-medium line-clamp-1 flex-1 pr-2">
                          {it.name}
                        </span>
                        <span className="font-mono text-[#181A18]/70 text-[11px] shrink-0">
                          {it.estimatedPrice}
                        </span>
                      </div>
                    ))}
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
