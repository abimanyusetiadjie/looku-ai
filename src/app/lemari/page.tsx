"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bookmark, 
  ArrowLeft, 
  Sparkles, 
  Trash2, 
  Share2, 
  ShoppingBag, 
  ExternalLink,
  Tag, 
  Filter, 
  Check, 
  Cloud,
  ChevronRight,
  TrendingUp,
  Download
} from "lucide-react";
import { OOTDRecommendation } from "@/lib/types";
import { getShopeeSearchUrl, getTokopediaSearchUrl, trackAffiliateClick } from "@/lib/affiliate";
import Toast, { ToastMessage } from "@/components/Toast";
import CloudSyncModal from "@/components/CloudSyncModal";
import StoryShareModal from "@/components/StoryShareModal";
import BottomNav from "@/components/BottomNav";

export default function LemariPage() {
  const [savedOutfits, setSavedOutfits] = useState<OOTDRecommendation[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<string>("all");
  const [activeStoryOutfit, setActiveStoryOutfit] = useState<OOTDRecommendation | null>(null);
  const [isCloudSyncOpen, setIsCloudSyncOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const loadSavedOutfits = () => {
    try {
      const stored = localStorage.getItem("looku_saved_outfits");
      if (stored) {
        setSavedOutfits(JSON.parse(stored));
      } else {
        setSavedOutfits([]);
      }
    } catch (e) {
      console.error("Error reading saved outfits:", e);
      setSavedOutfits([]);
    }
  };

  useEffect(() => {
    loadSavedOutfits();
    const handleUpdate = () => loadSavedOutfits();
    window.addEventListener("looku_saved_updated", handleUpdate);
    return () => window.removeEventListener("looku_saved_updated", handleUpdate);
  }, []);

  const handleDeleteOutfit = (id: string, title: string) => {
    try {
      const updated = savedOutfits.filter((o) => o.id !== id);
      setSavedOutfits(updated);
      localStorage.setItem("looku_saved_outfits", JSON.stringify(updated));
      window.dispatchEvent(new Event("looku_saved_updated"));
      addToast({
        title: "Outfit Dihapus dari Lemari",
        description: title,
        type: "info",
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareWhatsAppAll = () => {
    if (savedOutfits.length === 0) return;
    const text = `👗 Koleksi Lemari look.u AI (${savedOutfits.length} OOTD Terkurasi):\n\n` +
      savedOutfits.slice(0, 3).map((o, i) => `${i + 1}. *${o.title}* (${o.overallVibe}) - Bahan Katun Rayon/Linen Adem 33°C\n🔗 looku.ai/?look=${o.id}`).join("\n\n") +
      `\n\n✨ Kurasi formula OOTD tropis pribadimu di: https://looku.ai`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Vibe Breakdown & Dominant Style
  const vibeCounts = savedOutfits.reduce((acc, curr) => {
    const v = curr.overallVibe || "Earthy Minimalist";
    acc[v] = (acc[v] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantVibe = Object.entries(vibeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Earthy Minimalist";

  // Filtered Outfits
  const filteredOutfits = selectedVibe === "all"
    ? savedOutfits
    : savedOutfits.filter((o) => (o.overallVibe || "").toLowerCase().includes(selectedVibe.toLowerCase()));

  const uniqueVibes = Array.from(new Set(savedOutfits.map((o) => o.overallVibe).filter(Boolean)));

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-charcoal-900 pb-28 md:pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-charcoal-900/70 hover:text-charcoal-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="font-serif italic font-bold text-2xl text-[#181A18] flex items-baseline">
            look<span className="text-terracotta-500 not-italic">.</span>u
            <span className="font-mono text-[9px] not-italic ml-2 uppercase font-bold text-sand-500 tracking-wider">
              Lemari
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCloudSyncOpen(true)}
              className="py-2 px-3 sm:px-3.5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Cloud className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">Cloud Sync</span>
            </button>

            <Link
              href="/studio"
              className="py-2 px-3.5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studio ↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 w-full space-y-8">
        {/* Top Hero Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-terracotta-500" />
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-terracotta-600">
                PERSONAL DIGITAL CLOSET
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-4xl font-bold text-[#181A18] tracking-tight">
              Lemari Busana Terkurasi Kamu
            </h1>
            <p className="text-xs sm:text-sm text-sand-500">
              {savedOutfits.length > 0
                ? `${savedOutfits.length} formula OOTD tersimpan • Didominasi estetika ${dominantVibe}`
                : "Simpan formula OOTD dari Studio atau Lookbook untuk membangun lemari kapsul harianmu."}
            </p>
          </div>

          {savedOutfits.length > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleShareWhatsAppAll}
                className="py-3 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Bagikan ke WhatsApp</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter Pills if multiple outfits exist */}
        {uniqueVibes.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedVibe("all")}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                selectedVibe === "all"
                  ? "bg-charcoal-900 text-white shadow-xs"
                  : "bg-white border border-sand-300 text-charcoal-900 hover:bg-sand-100"
              }`}
            >
              Semua Koleksi ({savedOutfits.length})
            </button>
            {uniqueVibes.map((vibe) => (
              <button
                key={vibe}
                onClick={() => setSelectedVibe(vibe)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  selectedVibe === vibe
                    ? "bg-charcoal-900 text-white shadow-xs"
                    : "bg-white border border-sand-300 text-charcoal-900 hover:bg-sand-100"
                }`}
              >
                {vibe}
              </button>
            ))}
          </div>
        )}

        {/* Outfits Grid or Empty State */}
        {filteredOutfits.length === 0 ? (
          <div className="p-12 sm:p-16 rounded-3xl bg-white border border-[#E8DFD1] text-center space-y-6 shadow-tactile max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-sand-100 text-charcoal-900 flex items-center justify-center mx-auto border border-sand-200 shadow-2xs">
              <Bookmark className="w-7 h-7 text-terracotta-600" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif font-bold text-2xl text-charcoal-900">
                Lemari Koleksimu Masih Kosong
              </h3>
              <p className="text-xs sm:text-sm text-sand-500 max-w-md mx-auto leading-relaxed">
                Eksplorasi ribuan kombinasi pakaian adem iklim 33°C di Studio OOTD dan klik tombol <b>"Simpan ke Lemari"</b> untuk memulai.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/#studio"
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Sparkles className="w-4 h-4" />
                <span>Mulai Racik OOTD Sekarang ➔</span>
              </Link>
              <Link
                href="/#trending"
                className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Lihat Lookbook Trending
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {filteredOutfits.map((outfit) => (
              <motion.div
                key={outfit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 sm:p-7 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile flex flex-col justify-between space-y-6"
              >
                {/* Card Header */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="text-[9px] font-mono font-bold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200 uppercase">
                        {outfit.overallVibe || "Earthy Minimalist"}
                      </span>
                      <h3 className="font-serif font-bold text-xl text-charcoal-900 mt-1.5 leading-snug">
                        {outfit.title}
                      </h3>
                      <p className="text-xs text-sand-500 mt-0.5">
                        {outfit.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveStoryOutfit(outfit)}
                        className="p-2 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 transition-colors"
                        title="Ekspor Story 9:16"
                      >
                        <Share2 className="w-4 h-4 text-terracotta-600" />
                      </button>

                      <button
                        onClick={() => handleDeleteOutfit(outfit.id, outfit.title)}
                        className="p-2 rounded-xl bg-sand-100 hover:bg-rose-50 text-sand-500 hover:text-rose-600 transition-colors"
                        title="Hapus dari lemari"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Color Palette Swatches */}
                  {outfit.colorPalette && (
                    <div className="flex items-center gap-2 pt-1">
                      {outfit.colorPalette.map((col, idx) => (
                        <div
                          key={idx}
                          title={`${col.name} (${col.hex})`}
                          className="w-5 h-5 rounded-full border border-black/15 shadow-2xs"
                          style={{ backgroundColor: col.hex }}
                        />
                      ))}
                      <span className="text-[10px] font-mono text-sand-400 ml-1">
                        Harmoni Tropis
                      </span>
                    </div>
                  )}
                </div>

                {/* Garment Breakdown */}
                <div className="space-y-2 bg-sand-50 p-4 rounded-2xl border border-sand-200">
                  {outfit.items.map((item, idx) => {
                    const shopeeUrl = getShopeeSearchUrl(item.shopeeQuery);
                    const tokpedUrl = getTokopediaSearchUrl(item.tokopediaQuery);

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs py-1.5 border-b border-sand-200/70 last:border-0"
                      >
                        <div>
                          <div className="font-bold text-charcoal-900">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-sand-500 font-mono">
                            {item.material} • {item.color} ({item.estimatedPrice})
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <a
                            href={shopeeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackAffiliateClick("shopee", item.shopeeQuery, "outfit_card")}
                            className="p-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-[10px] font-bold flex items-center gap-1 transition-colors"
                            title="Beli di Shopee"
                          >
                            <span>Shopee</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <a
                            href={tokpedUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackAffiliateClick("tokopedia", item.tokopediaQuery, "outfit_card")}
                            className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-[10px] font-bold flex items-center gap-1 transition-colors"
                            title="Beli di Tokopedia"
                          >
                            <span>Tokped</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Footer Rationale */}
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-sand-500 border-t border-sand-200">
                  <span>ID: #{outfit.id.slice(-4).toUpperCase()}</span>
                  <Link
                    href={`/studio?look=${outfit.id}`}
                    className="text-terracotta-600 hover:text-charcoal-900 font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Buka di Studio</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Docked Native Bottom Navigation Bar */}
      <BottomNav />

      {/* Story Share Modal */}
      {activeStoryOutfit && (
        <StoryShareModal
          outfit={activeStoryOutfit}
          onClose={() => setActiveStoryOutfit(null)}
        />
      )}

      {/* Cloud Sync Modal */}
      <CloudSyncModal
        isOpen={isCloudSyncOpen}
        onClose={() => setIsCloudSyncOpen(false)}
        onToast={(title, description, type) => addToast({ title, description, type })}
      />

      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
