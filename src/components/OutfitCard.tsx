"use client";

import React, { useState, useEffect } from "react";
import { 
  ArrowUpRight, 
  Bookmark, 
  Share2, 
  Info,
  Sparkles,
  MessageCircle,
  Check,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";
import { getMarketplaceLinks } from "@/lib/affiliate";
import StoryShareModal from "./StoryShareModal";

interface OutfitCardProps {
  outfit: OOTDRecommendation;
  onRegenerate?: () => void;
  onOpenSavedDrawer?: () => void;
}

export default function OutfitCard({ outfit, onRegenerate, onOpenSavedDrawer }: OutfitCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("looku_saved_outfits");
        if (stored) {
          const list: OOTDRecommendation[] = JSON.parse(stored);
          setIsSaved(list.some((item) => item.id === outfit.id));
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, [outfit.id]);

  const handleToggleSave = () => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("looku_saved_outfits");
        let list: OOTDRecommendation[] = stored ? JSON.parse(stored) : [];

        if (isSaved) {
          list = list.filter((item) => item.id !== outfit.id);
          setIsSaved(false);
        } else {
          list.unshift(outfit);
          setIsSaved(true);
        }
        localStorage.setItem("looku_saved_outfits", JSON.stringify(list));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleShareWhatsApp = () => {
    const text = `🧥 *${outfit.title}* - Kurasi look.u AI\n"${outfit.tagline}"\n\n✨ *Items:*\n${outfit.items
      .map((i) => `• ${i.name} (${i.color})`)
      .join("\n")}\n\n💡 *Tips:* ${outfit.stylingTip}\n\nCoba outfit kamu di https://looku.ai`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const getCategoryTag = (cat: OutfitItem["category"]) => {
    switch (cat) {
      case "atasan":
        return "ATASAN";
      case "bawahan":
        return "BAWAHAN";
      case "outer_hijab":
        return "HIJAB & OUTER";
      case "sepatu":
        return "ALAS KAKI";
      case "aksesoris":
        return "AKSESORIS";
      default:
        return "ITEM";
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={outfit.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="tactile-card p-6 sm:p-8 space-y-7 shadow-sm bg-white"
        >
          {/* Spec Sheet Header with Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD1] pb-5">
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-[#181A18] text-[#FAF8F5] px-3 py-1 rounded-full">
                FORMULA #{outfit.id.slice(-4).toUpperCase()}
              </span>
              {outfit.modestFriendly && (
                <span className="text-[10px] font-mono tracking-widest uppercase text-olive-700 bg-olive-50 border border-olive-100 px-3 py-1 rounded-full font-bold">
                  ✓ MODEST & HIJAB
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* WhatsApp Share */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShareWhatsApp}
                className="p-2.5 rounded-xl text-charcoal-900/60 hover:text-emerald-700 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-colors"
                title="Kirim ke WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </motion.button>

              {/* Export IG Story 9:16 */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowStoryModal(true)}
                className="bg-sand-100 hover:bg-sand-200 text-charcoal-900 border border-sand-300 font-bold text-xs py-2.5 px-3.5 rounded-xl shadow-2xs flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Export Story</span>
              </motion.button>

              {/* Bookmark Save to LocalStorage */}
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleToggleSave}
                className={
                  isSaved
                    ? "bg-charcoal-900 text-sand-50 font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center gap-1.5"
                    : "bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md flex items-center gap-1.5"
                }
                title="Simpan ke Lemari"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? "Tersimpan" : "Simpan"}</span>
              </motion.button>
            </div>
          </div>

          {/* Title & Editorial Tagline */}
          <div>
            <div className="flex items-center gap-2">
              <div className="text-[10px] font-mono text-terracotta-600 font-bold tracking-widest uppercase">
                {outfit.overallVibe}
              </div>
              {outfit.title && (
                <span className="text-[10px] font-mono text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200 font-bold">✦ DIADAPTASI UNTUK WARNA KULITMU</span>
              )}
            </div>
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-3xl sm:text-4xl font-bold text-[#181A18] tracking-tight mt-1"
            >
              {outfit.title}
            </motion.h2>
            <p className="font-serif italic text-base sm:text-lg text-[#181A18]/70 mt-1">
              &ldquo;{outfit.tagline}&rdquo;
            </p>
          </div>

          {/* Personal Color & Skin Tone Harmony Callout */}
          {outfit.skinToneMatch && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 rounded-2xl bg-terracotta-50/70 border border-terracotta-200/80 flex items-start gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono font-bold tracking-wider uppercase text-terracotta-700">
                  KESESUAIAN WARNA KULIT
                </div>
                <p className="text-xs sm:text-sm text-[#181A18]/85 leading-relaxed font-medium">
                  {outfit.skinToneMatch}
                </p>
              </div>
            </motion.div>
          )}

          {/* Expand/Collapse Toggle Button */}
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            whileTap={{ scale: 0.97 }}
            className="w-full py-3 rounded-xl bg-[#F4EFE6] hover:bg-[#E8DFD1] border border-[#E8DFD1] text-[#181A18] text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            <span>{isExpanded ? 'Sembunyikan Detail' : 'Lihat Detail Lengkap'}</span>
          </motion.button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="overflow-hidden space-y-7"
              >
                {/* Curation Index / Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E8DFD1] flex flex-col justify-between"
            >
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#A89582] font-bold">
                KENYAMANAN DI CUACA PANAS
              </span>
              <div className="text-xl font-serif font-bold text-[#181A18] mt-1">
                {outfit.comfortRating} / 5.0{" "}
                <span className="text-xs font-sans font-normal text-[#A89582]">
                  (Bahan Adem & Sirkulasi Maksimal)
                </span>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl bg-[#F4EFE6] border border-[#E8DFD1] flex flex-col justify-between"
            >
              <span className="text-[10px] font-mono tracking-wider uppercase text-[#A89582] font-bold">
                KISARAN BUDGET BELANJA
              </span>
              <div className="text-xl font-serif font-bold text-[#181A18] mt-1">
                {outfit.affordabilityRating} / 5.0{" "}
                <span className="text-xs font-sans font-normal text-[#A89582]">
                  (Ramah Budget Shopee & Tokped)
                </span>
              </div>
            </motion.div>
          </div>

          {/* Styling Manifesto & Rationale */}
          <div className="p-5 rounded-2xl bg-white border border-[#D7CABC] space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#181A18]">
              <Info className="w-3.5 h-3.5 text-terracotta-500" />
              <span>KENAPA KOMBINASI INI COCOK BUAT KAMU</span>
            </div>
            <p className="text-xs sm:text-sm text-[#181A18]/80 leading-relaxed">
              {outfit.whyItWorks}
            </p>
            <div className="pt-2 border-t border-[#E8DFD1] text-xs font-medium text-terracotta-600 flex items-baseline gap-2">
              <span className="text-[10px] font-mono font-bold tracking-widest uppercase bg-terracotta-50 px-2 py-0.5 rounded text-terracotta-700">
                TIPS DARI STYLIST
              </span>
              <span>{outfit.stylingTip}</span>
            </div>
          </div>

          {/* Tactile Color Swatch Discs */}
          <div>
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#A89582] font-bold mb-3">
              PALET WARNA HARMONIS
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {outfit.colorPalette.map((col, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="p-2.5 rounded-xl bg-white border border-[#E8DFD1] flex items-center gap-2.5 shadow-sm"
                >
                  <div
                    className="w-6 h-6 rounded-full border border-black/10 shadow-sm shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <div className="truncate">
                    <div className="text-xs font-bold text-[#181A18] truncate">
                      {col.name}
                    </div>
                    <div className="text-[9px] font-mono text-[#A89582] uppercase">
                      {col.hex}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Garment Breakdown Specification & Shopping Hangtags */}
          <div className="space-y-3.5">
            <div className="text-[10px] font-mono tracking-wider uppercase text-[#A89582] font-bold">
              ITEM PILIHAN & TEMPAT BELANJA
            </div>

            <div className="space-y-3">
              {outfit.items.map((item, index) => {
                const links = getMarketplaceLinks(item.shopeeQuery);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.08 }}
                    whileHover={{ y: -2 }}
                    className="p-4 sm:p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD1] hover:border-[#181A18] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-[#E8DFD1] text-[#181A18]">
                          {getCategoryTag(item.category)}
                        </span>
                        <span className="text-xs text-[#A89582]">•</span>
                        <span className="text-xs font-semibold text-terracotta-500">
                          {item.color}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm sm:text-base text-[#181A18] group-hover:text-terracotta-500 transition-colors">
                        {item.name}
                      </h4>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#181A18]/70">
                        <span className="text-[11px] font-mono text-[#A89582] uppercase">BAHAN:</span>
                        <span className="font-medium text-[#181A18]">{item.material}</span>
                        <span>•</span>
                        <span className="text-[11px] font-mono text-[#A89582] uppercase">EST:</span>
                        <span className="font-mono text-[#181A18] font-bold bg-white px-2 py-0.5 rounded border border-[#E8DFD1]">
                          {item.estimatedPrice}
                        </span>
                      </div>
                    </div>

                    {/* Boutique Shop Actions */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#E8DFD1]">
                      <motion.a
                        href={links.shopee}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-orange-500 hover:text-white border border-[#D7CABC] hover:border-orange-500 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        title="Cari di Shopee"
                      >
                        <span>Cari Shopee</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </motion.a>

                      <motion.a
                        href={links.tokopedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-white hover:bg-emerald-600 hover:text-white border border-[#D7CABC] hover:border-emerald-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                        title="Cari di Tokopedia"
                      >
                        <span>Tokopedia</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </motion.a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Directional Stylist Feedback & Recovery */}
          <div className="p-4 rounded-2xl bg-sand-50 border border-sand-200 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-900 font-serif">Kurang cocok? Beri arahan ke Stylist:</span>
              <span className="text-[10px] font-mono text-sand-500 uppercase">1-TAP ADJUST</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "☕ Lebih Santai / Kasual", hint: "Santai" },
                { label: "🏢 Lebih Rapi & Formal", hint: "Formal" },
                { label: "🌸 Warna Lebih Cerah", hint: "Cerah" },
                { label: "🧕 Versi Hijab Longgar", hint: "Modest" },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onRegenerate) onRegenerate();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-charcoal-900 hover:text-white border border-sand-300 text-xs text-charcoal-900 font-medium transition-all shadow-2xs"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Curation Actions */}
          <div className="pt-4 border-t border-[#E8DFD1] flex flex-wrap items-center justify-between gap-3 text-xs text-[#A89582]">
            <div>
              Kombinasi ini disesuaikan dengan ketersediaan barang dan iklim harian Indonesia.
            </div>

            {onRegenerate && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onRegenerate}
                className="font-bold text-[#181A18] hover:text-terracotta-500 uppercase tracking-wider text-[11px] underline underline-offset-4"
              >
                Mix & Match Variasi Lain ↻
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {showStoryModal && (
        <StoryShareModal
          outfit={outfit}
          onClose={() => setShowStoryModal(false)}
        />
      )}
    </>
  );
}
