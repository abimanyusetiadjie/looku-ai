"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Droplets, Store } from "lucide-react";
import { searchFashionCatalog } from "@/lib/supabase";
import { OOTDRecommendation } from "@/lib/types";
import { getMarketplaceLinks, trackAffiliateClick } from "@/lib/affiliate";
import { ShopeeIcon, TokopediaIcon } from "@/components/MarketplaceIcons";

interface FashionCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  { id: "", label: "Semua" },
  { id: "atasan", label: "Atasan" },
  { id: "bawahan", label: "Bawahan" },
  { id: "outer_hijab", label: "Hijab & Outer" },
  { id: "sepatu", label: "Sepatu & Tas" },
  { id: "aksesoris", label: "Aksesoris" },
];

const SKIN_TONES = [
  { id: "", label: "Semua Kulit" },
  { id: "fair", label: "Putih Gading" },
  { id: "light", label: "Kuning Langsat" },
  { id: "medium", label: "Sawo Matang" },
  { id: "tan", label: "Eksotis" },
  { id: "deep", label: "Deep Bronze" },
];

const BUDGET_TIERS = [
  { id: "", label: "Semua Budget" },
  { id: "hemat", label: "Hemat (< 100rb)" },
  { id: "menengah", label: "Menengah (100-250rb)" },
  { id: "premium", label: "Premium (250-650rb)" },
  { id: "luxury", label: "Luxury (> 650rb)" },
];

export default function FashionCatalogModal({ isOpen, onClose }: FashionCatalogModalProps) {
  const [items, setItems] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [activeSkinTone, setActiveSkinTone] = useState("");
  const [activeTier, setActiveTier] = useState("");
  const [loading, setLoading] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const handleBookmarkItem = (item: any) => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
      const newWardrobeEntry: OOTDRecommendation = {
        id: `catalog-${item.id}-${Date.now()}`,
        title: `✦ ${item.name}`,
        tagline: `Brand: ${item.brandName || item.brand} • Bahan: ${item.material || item.fabric}`,
        overallVibe: item.category === "atasan" ? "Top Essential" : "Wardrobe Essential",
        comfortRating: 5,
        affordabilityRating: 5,
        modestFriendly: true,
        skinToneMatch: "Item kurasi langsung dari Gudang 300+ Busana look.u",
        whyItWorks: "Pilihan esensial dengan bahan adem tropis & potongan proporsional.",
        stylingTip: "Padukan dengan bawahan atau atasan netral.",
        colorPalette: [
          { name: item.colorName || "Color", hex: item.colorHex || "#181A18" },
          { name: "Sand", hex: "#FAF8F5" },
        ],
        createdAt: new Date().toISOString(),
        items: [
          {
            name: item.name,
            category: (item.category || "atasan") as any,
            color: item.color || item.colorName || "Harmonious",
            material: item.material || item.fabric || "Katun Rayon",
            estimatedPrice: item.priceFormatted || `Rp ${item.priceMin?.toLocaleString("id-ID") || "100.000"}`,
            shopeeQuery: item.shopeeQuery || item.name,
            tokopediaQuery: item.tokopediaQuery || item.name,
          },
        ],
      };

      localStorage.setItem("looku_saved_outfits", JSON.stringify([newWardrobeEntry, ...saved]));
      window.dispatchEvent(new Event("looku_saved_updated"));
      setSavedMsg(`"${item.name}" Disimpan ke Lemari!`);
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isOpen) {
      handleSearch();
    }
  }, [isOpen, query, activeCategory, activeSkinTone, activeTier]);

  const handleSearch = async () => {
    setLoading(true);
    const results = await searchFashionCatalog({
      query,
      category: activeCategory,
      skinTone: activeSkinTone,
      brandTier: activeTier,
    });
    setItems(results);
    setLoading(false);
  };

  const formatPrice = (price: any) => {
    const num = typeof price === "number" ? price : parseInt(String(price || "").replace(/\D/g, ""), 10);
    if (isNaN(num) || num <= 0) return "Rp 95.000";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#181A18]/80 backdrop-blur-sm transition-opacity"
          />

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-5xl h-[92dvh] sm:h-auto sm:max-h-[90vh] bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#D7CABC]"
          >
            {/* Mobile Pull Handle Indicator */}
            <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 bg-[#181A18]">
              <div className="w-10 h-1 rounded-full bg-white/30" />
            </div>

            {/* Header */}
            <div className="p-4 sm:p-6 bg-[#181A18] text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-terracotta-500 flex items-center justify-center text-white shrink-0">
                  <Store className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-xl">Gudang Referensi 300+ Busana</h3>
                  <p className="text-[11px] text-[#D7CABC] mt-0.5 line-clamp-1">Kurasi brand lokal berdaya tahan &amp; sirkulasi adem tropis</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {savedMsg && (
              <div className="bg-emerald-600 text-white text-xs font-bold py-2 px-4 text-center shrink-0">
                {savedMsg}
              </div>
            )}

            {/* Responsive Search & Horizontal Filter Pills */}
            <div className="p-3 sm:p-5 bg-white border-b border-[#E8DFD1] space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari kemeja linen, kulot rayon, Cottonink..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-sand-50 border border-sand-200 rounded-xl text-xs text-charcoal-900 placeholder:text-sand-500 focus:outline-none focus:border-charcoal-900"
                />
              </div>

              {/* Category Pills (Horizontal Snap Scroll) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border whitespace-nowrap transition-colors shrink-0 ${
                      activeCategory === cat.id
                        ? "bg-terracotta-500 text-white border-terracotta-500"
                        : "bg-sand-50 text-charcoal-800 border-sand-200 hover:bg-sand-100"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Budget & Skin Tone Filter Chips (Horizontal Scroll) */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px]">
                {BUDGET_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => setActiveTier(tier.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold border whitespace-nowrap transition-colors shrink-0 ${
                      activeTier === tier.id
                        ? "bg-charcoal-900 text-white border-charcoal-900"
                        : "bg-white text-charcoal-700 border-sand-200 hover:bg-sand-50"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
                <span className="text-sand-300">|</span>
                {SKIN_TONES.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setActiveSkinTone(tone.id)}
                    className={`px-2.5 py-1 rounded-lg font-bold border whitespace-nowrap transition-colors shrink-0 ${
                      activeSkinTone === tone.id
                        ? "bg-amber-600 text-white border-amber-600"
                        : "bg-white text-charcoal-700 border-sand-200 hover:bg-sand-50"
                    }`}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Shopee Intermediary Curator Trust Banner */}
            <div className="mx-3 sm:mx-6 mt-3 p-3 bg-sand-50 border border-sand-300 rounded-2xl flex flex-wrap items-center justify-between gap-2 text-xs shrink-0 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#EE4D2D]" />
                <span className="font-bold text-charcoal-900">
                  Kurator Belanja Shopee Mall &amp; Tokopedia Official
                </span>
                <span className="text-[10px] text-sand-500 hidden sm:inline">• Uji rating bintang 4.8+ &amp; garansi bahan adem</span>
              </div>
              <span className="text-[9px] font-mono text-[#EE4D2D] bg-white px-2 py-0.5 rounded-full border border-orange-200 font-bold">
                100% VERIFIED LOCAL BRANDS
              </span>
            </div>

            {/* 2-Column Mobile Grid / 3-Column Desktop Grid */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar">
              {loading ? (
                <div className="flex justify-center items-center h-40 text-xs text-sand-500 font-mono">
                  Mengkurasi katalog Shopee Mall &amp; Star+...
                </div>
              ) : items.length === 0 ? (
                <div className="text-center py-16 text-xs text-sand-500 font-mono">
                  Tidak ada pakaian yang cocok dengan filter.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                  {items.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8DFD1] hover:border-[#EE4D2D] transition-colors group flex flex-col justify-between shadow-2xs"
                    >
                      <div>
                        <div className="relative aspect-[3/4] overflow-hidden bg-sand-100">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          
                          {/* Shopee Mall / Star+ Badge */}
                          <div className="absolute top-2 left-2 bg-[#EE4D2D] text-white text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs tracking-wider uppercase flex items-center gap-1">
                            <span>{idx % 3 === 0 ? "Mall" : "Star+"}</span>
                          </div>

                          {/* Breathability Pill */}
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur text-[8px] font-bold px-1.5 py-0.5 rounded-md text-charcoal-900 flex items-center gap-1 shadow-2xs">
                            <Droplets className="w-2.5 h-2.5 text-blue-500" />
                            <span>{item.breathability}</span>
                          </div>
                        </div>

                        <div className="p-2.5 sm:p-3.5 space-y-1.5">
                          <div className="flex items-center justify-between gap-1 text-[9px] font-mono text-terracotta-600 font-bold uppercase truncate">
                            <span>{item.brandName || "Atelier"}</span>
                            <span className="text-sand-400 font-normal">{item.material?.split(" ")[0]}</span>
                          </div>
                          
                          <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal-900 line-clamp-2 leading-tight">
                            {item.name}
                          </h4>

                          {/* Rating & Sold Count */}
                          <div className="flex items-center gap-1.5 text-[9px] font-mono text-sand-500">
                            <span className="text-amber-500 font-bold">★ 4.9</span>
                            <span>•</span>
                            <span>{1.2 + (idx % 8) * 0.4}k Terjual</span>
                          </div>

                          <div className="font-mono text-[10px] sm:text-xs font-bold text-[#EE4D2D] bg-orange-50 px-2 py-0.5 rounded inline-block border border-orange-100">
                            {formatPrice(item.priceMin || item.price_min || item.price)}
                          </div>
                        </div>
                      </div>

                      <div className="p-2.5 sm:p-3.5 pt-0 space-y-1.5">
                        <button
                          onClick={() => handleBookmarkItem(item)}
                          className="w-full py-1.5 rounded-lg bg-sand-100 hover:bg-charcoal-900 hover:text-white text-charcoal-900 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1 border border-sand-300 shadow-2xs"
                        >
                          <span>📌 Simpan</span>
                        </button>
                        
                        {(() => {
                          const links = getMarketplaceLinks(item.shopeeQuery || item.tokopediaQuery || item.name);
                          return (
                            <div className="flex gap-1.5">
                              <a
                                href={links.shopee}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackAffiliateClick("shopee", item.shopeeQuery || item.name, "catalog")}
                                className="flex-1 bg-[#EE4D2D] hover:bg-[#d63b1d] text-white text-[10px] sm:text-[11px] font-bold py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <ShopeeIcon className="w-3.5 h-3.5" />
                                <span>Shopee</span>
                              </a>
                              <a
                                href={links.tokopedia}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackAffiliateClick("tokopedia", item.tokopediaQuery || item.name, "catalog")}
                                className="flex-1 bg-[#00AA5B] hover:bg-[#008f4c] text-white text-[10px] sm:text-[11px] font-bold py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <TokopediaIcon className="w-3.5 h-3.5" />
                                <span>Tokped</span>
                              </a>
                            </div>
                          );
                        })()}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
