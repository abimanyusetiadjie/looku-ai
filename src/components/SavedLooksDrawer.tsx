"use client";

import React, { useEffect, useState } from "react";
import { X, Bookmark, Trash2, ArrowUpRight, Share2, Sparkles, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OOTDRecommendation } from "@/lib/types";

interface SavedLooksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOutfit: (outfit: OOTDRecommendation) => void;
  onExportStory: (outfit: OOTDRecommendation) => void;
}

export default function SavedLooksDrawer({
  isOpen,
  onClose,
  onSelectOutfit,
  onExportStory,
}: SavedLooksDrawerProps) {
  const [savedOutfits, setSavedOutfits] = useState<OOTDRecommendation[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("looku_saved_outfits");
        if (stored) {
          setSavedOutfits(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Error reading saved outfits:", e);
      }
    }
  }, [isOpen]);

  const handleDelete = (id: string) => {
    const updated = savedOutfits.filter((item) => item.id !== id);
    setSavedOutfits(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_saved_outfits", JSON.stringify(updated));
    }
  };

  const handleShareWhatsApp = (outfit: OOTDRecommendation) => {
    const text = `🧥 *${outfit.title}* - Kurasi Looku AI\n"${outfit.tagline}"\n\n✨ *Items:*\n${outfit.items
      .map((i) => `• ${i.name} (${i.color})`)
      .join("\n")}\n\n💡 *Tips:* ${outfit.stylingTip}\n\nCoba outfit kamu di https://looku.ai`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleBatchShare = () => {
    const text = `🧥 *Lemari Koleksiku* - Kurasi Looku AI\n\n` + savedOutfits.map((o, idx) => `${idx + 1}. ✨ *${o.title}*\n"${o.tagline}"\n`).join('\n') + `\nCoba outfit kamu di https://looku.ai`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const vibeCounts = savedOutfits.reduce((acc, curr) => {
    acc[curr.overallVibe] = (acc[curr.overallVibe] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const dominantVibe = Object.entries(vibeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Earthy Minimalist";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#181A18]/60 backdrop-blur-sm transition-opacity"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            {/* Drawer Canvas */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-[#FAF8F5] border-l border-[#D7CABC] flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 bg-[#181A18] text-white flex items-center justify-between border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-terracotta-500 flex items-center justify-center text-white">
                    <Bookmark className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg">Lemari Koleksi Kamu</h3>
                    <p className="text-[10px] font-mono text-[#D7CABC] uppercase tracking-wider">
                      {savedOutfits.length} Formula OOTD • Dominasi {dominantVibe}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-1.5 rounded-full text-[#A89582] hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Style Evolution & Growth Metric Card */}
              <div className="p-3.5 mx-5 mt-4 rounded-2xl bg-sand-100 border border-sand-300 space-y-1.5 shadow-2xs shrink-0">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-charcoal-900 font-serif">📈 Gaya Makin Konsisten</span>
                  <span className="text-[10px] font-mono font-bold text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-100">+40% BULAN INI</span>
                </div>
                <p className="text-[11px] text-charcoal-900/70 leading-tight">
                  {savedOutfits.length > 0
                    ? `Koleksi kamu didominasi nuansa ${dominantVibe}. Sangat proporsional untuk iklim tropis sehari-hari.`
                    : "Simpan formula OOTD pertamamu untuk mulai membangun indeks konsistensi gaya personal."}
                </p>
              </div>

              {/* Body Content */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {savedOutfits.length === 0 ? (
                  <div className="py-20 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-[#E8DFD1] text-[#A89582] flex items-center justify-center mx-auto shadow-inner">
                      <Bookmark className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-[#181A18]">
                      Lemari Koleksi Masih Kosong
                    </h4>
                    <p className="text-xs text-[#A89582] max-w-xs mx-auto leading-relaxed">
                      Simpan formula OOTD favoritmu dari Lookbook atau Studio untuk inspirasi outfit harian.
                    </p>
                    <button onClick={onClose} className="mt-4 py-3 px-6 rounded-xl bg-[#181A18] text-white font-bold text-xs uppercase tracking-wider hover:bg-terracotta-500 transition-all shadow-md">
                      Mulai Mix & Match Sekarang ↗
                    </button>
                  </div>
                ) : (
                  <>
                    {savedOutfits.map((outfit) => (
                      <motion.div
                        key={outfit.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 rounded-2xl bg-white border border-[#E8DFD1] shadow-2xs space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] font-mono uppercase text-terracotta-600 font-bold tracking-wider">
                              {outfit.overallVibe}
                            </span>
                            <h4 className="font-serif font-bold text-base text-[#181A18]">
                              {outfit.title}
                            </h4>
                            <p className="text-xs text-[#A89582] line-clamp-1 italic">
                              &ldquo;{outfit.tagline}&rdquo;
                            </p>
                          </div>

                          <button
                            onClick={() => handleDelete(outfit.id)}
                            className="p-1.5 text-[#A89582] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Hapus dari lemari"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Items Preview */}
                        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                          {outfit.colorPalette.map((col, idx) => (
                            <div
                              key={idx}
                              className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                              style={{ backgroundColor: col.hex }}
                              title={col.name}
                            />
                          ))}
                          <span className="text-[10px] font-mono text-[#A89582] ml-1">
                            {outfit.items.length} pieces
                          </span>
                        </div>

                        {/* Action Row */}
                        <div className="pt-2 border-t border-[#E8DFD1]/60 flex items-center justify-between gap-2">
                          <button
                            onClick={() => {
                              onSelectOutfit(outfit);
                              onClose();
                              if (typeof window !== "undefined") {
                                document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                              }
                            }}
                            className="flex-1 py-2 px-3 rounded-xl bg-[#181A18] hover:bg-terracotta-500 text-white font-bold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Buka di Studio</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleShareWhatsApp(outfit)}
                            className="p-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
                            title="Kirim ke WhatsApp"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onExportStory(outfit)}
                            className="p-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E8DFD1] text-[#181A18] border border-[#D7CABC] transition-colors"
                            title="Export Story 9:16"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    
                    <div className="pt-2">
                      <button
                        onClick={handleBatchShare}
                        className="w-full py-3 px-4 rounded-xl bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-md"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Bagikan Seluruh Lemari via WhatsApp
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
