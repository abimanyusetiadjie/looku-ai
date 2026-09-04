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
  ChevronDown,
  RefreshCw,
  Layers,
  Wind,
  ShieldCheck,
  Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";
import { getMarketplaceLinks, trackAffiliateClick } from "@/lib/affiliate";
import { ShopeeIcon, TokopediaIcon } from "@/components/MarketplaceIcons";
import StoryShareModal from "./StoryShareModal";

interface OutfitCardProps {
  outfit: OOTDRecommendation;
  onRegenerate?: (feedbackHint?: string) => void;
  onOpenSavedDrawer?: () => void;
  onOutfitChange?: (updatedOutfit: OOTDRecommendation) => void;
}

export default function OutfitCard({ outfit, onRegenerate, onOpenSavedDrawer, onOutfitChange }: OutfitCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeBudgetTier, setActiveBudgetTier] = useState<"budget" | "mall">("budget");
  const [galleryViewMode, setGalleryViewMode] = useState<"grid" | "rack">("grid");
  const [items, setItems] = useState<OutfitItem[]>(outfit.items);
  const [toastMsg, setToastMsg] = useState("");
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopyHex = (hex: string, name: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      setCopiedHex(hex);
      setToastMsg(`Kode HEX ${hex} (${name}) disalin`);
      setTimeout(() => {
        setCopiedHex(null);
        setToastMsg("");
      }, 2500);
    }
  };

  useEffect(() => {
    setItems(outfit.items);
  }, [outfit.items]);

  const handleSwapItem = (index: number) => {
    const item = items[index];
    const cat = item.category;
    
    const alt = { ...item };
    if (cat === "atasan") {
      alt.name = alt.name.includes("Blouse") ? "Kemeja Linen Sage" : "Blouse Katun Rayon";
      alt.color = alt.color.includes("Broken White") ? "Sage Green" : "Broken White";
    } else if (cat === "bawahan") {
      alt.name = alt.name.includes("Kulot") ? "Linen Straight Pants" : "Celana Kulot Highwaist";
      alt.color = alt.color.includes("Mocca") ? "Warm Sand" : "Mocca";
    } else if (cat === "outer_hijab") {
      alt.name = alt.name.includes("Pashmina") ? "Hijab Voal Premium" : "Pashmina Ceruty Babydoll";
      alt.color = alt.color.includes("Cream") ? "Soft Oat" : "Cream";
    } else if (cat === "sepatu") {
      alt.name = alt.name.includes("Sandals") ? "Mules Loafers" : "Platform Sandals";
      alt.color = alt.color.includes("Nude") ? "Warm Ivory" : "Nude";
    } else {
      alt.name = "Aksesoris Tambahan";
    }
    
    const newItems = [...items];
    newItems[index] = alt;
    setItems(newItems);
    
    const updated = { ...outfit, items: newItems };
    if (onOutfitChange) {
      onOutfitChange(updated);
    }
    
    const catLabel = cat === "outer_hijab" ? "Hijab/Outer" : cat.charAt(0).toUpperCase() + cat.slice(1);
    setToastMsg(`${catLabel} diganti ke ${alt.name}`);
    setTimeout(() => setToastMsg(""), 3000);
  };

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
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/?look=${outfit.id}` : `https://looku.ai/?look=${outfit.id}`;
    const text = `*${outfit.title}* - Kurasi look.u AI\n"${outfit.tagline}"\n\n*Items:*\n${outfit.items
      .map((i) => `• ${i.name} (${i.color})`)
      .join("\n")}\n\n*Tips:* ${outfit.stylingTip}\n\nLihat kurasi lengkap di: ${shareUrl}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleCopyShareLink = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      const shareUrl = `${window.location.origin}/?look=${outfit.id}`;
      navigator.clipboard.writeText(shareUrl);
      setToastMsg("Tautan outfit berhasil disalin ke clipboard!");
      setTimeout(() => setToastMsg(""), 2500);
    }
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
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl border border-[#E8DFD1] p-4 sm:p-8 space-y-5 sm:space-y-8 shadow-tactile"
        >
          {/* Header Bar: Spec Number & Action Controls (Mobile Clean & Thumb-Friendly) */}
          <div className="flex items-center justify-between gap-2 border-b border-[#E8DFD1] pb-3.5 sm:pb-5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase bg-[#181A18] text-[#FAF8F5] px-2.5 py-1 rounded-full">
                LOOK OF THE DAY
              </span>
              {outfit.modestFriendly && (
                <span className="text-[9px] sm:text-[10px] font-mono tracking-wider uppercase text-charcoal-900 border border-sand-300 px-2 py-0.5 sm:py-1 rounded-full font-semibold">
                  MODEST
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleShareWhatsApp}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl text-charcoal-900/70 hover:text-charcoal-900 hover:bg-sand-100 transition-colors flex items-center justify-center"
                title="Kirim ke WhatsApp"
                aria-label="Kirim ke WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => setShowStoryModal(true)}
                className="min-h-[36px] sm:min-h-[44px] bg-sand-100 hover:bg-sand-200 text-charcoal-900 border border-sand-300 font-semibold text-xs py-1.5 px-3 sm:py-2 sm:px-3.5 rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-charcoal-700" />
                <span className="hidden xs:inline">Story</span>
              </button>

              <button
                onClick={handleToggleSave}
                className={`min-h-[36px] sm:min-h-[44px] text-xs font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                  isSaved
                    ? "bg-emerald-700 text-white"
                    : "bg-charcoal-900 hover:bg-charcoal-800 text-white"
                }`}
                title="Simpan ke Lemari"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? "Tersimpan" : "Simpan"}</span>
              </button>
            </div>
          </div>

          {/* Title & Editorial Tagline (Mobile Scaled) */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] sm:text-[10px] font-mono text-terracotta-600 font-bold tracking-widest uppercase">
                {outfit.overallVibe}
              </span>
              <span className="text-[10px] font-mono text-sand-500">•</span>
              <span className="text-[9px] sm:text-[10px] font-mono text-charcoal-700 font-semibold">Personal Color Match</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#181A18] tracking-tight leading-tight">
              {outfit.title}
            </h2>
            <p className="font-serif italic text-sm sm:text-lg text-[#181A18]/70 pt-0.5 leading-snug">
              &ldquo;{outfit.tagline}&rdquo;
            </p>
          </div>

          {/* Tier Selector & Total Estimate Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-b border-[#E8DFD1] py-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase text-sand-500 tracking-wider">
                TIER BELANJA:
              </span>
              <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-xl border border-sand-200">
                <button
                  type="button"
                  onClick={() => {
                    setActiveBudgetTier("budget");
                    setToastMsg("Mode Hemat Terjangkau aktif (< Rp 120rb)");
                    setTimeout(() => setToastMsg(""), 2500);
                  }}
                  className={`py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeBudgetTier === "budget"
                      ? "bg-charcoal-900 text-white shadow-xs"
                      : "text-charcoal-700 hover:text-charcoal-900"
                  }`}
                >
                  Hemat
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveBudgetTier("mall");
                    setToastMsg("Mode Official Store & Mall aktif");
                    setTimeout(() => setToastMsg(""), 2500);
                  }}
                  className={`py-1 px-2.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                    activeBudgetTier === "mall"
                      ? "bg-charcoal-900 text-white shadow-xs"
                      : "text-charcoal-700 hover:text-charcoal-900"
                  }`}
                >
                  Mall
                </button>
              </div>
            </div>

            <div className="text-[10px] font-mono font-bold text-charcoal-900 bg-sand-100 px-2.5 py-1 rounded-full border border-sand-200">
              {activeBudgetTier === "mall" ? "TOTAL EST: ~Rp 650rb (Mall)" : "TOTAL EST: ~Rp 185rb (Hemat)"}
            </div>
          </div>

          {/* 2-Column Shoppable Pieces Grid (Fashion Commerce Standard) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono tracking-wider uppercase text-sand-500 font-bold">
                BEDAH 4 ITEM BUSANA (BELI DI MARKETPLACE)
              </span>
              <span className="text-[9px] font-mono text-terracotta-600 font-bold">
                TAP SHOPEE / TOKPED
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {items.map((item, index) => {
                const links = getMarketplaceLinks(item.shopeeQuery);
                const catLabel = item.category === "outer_hijab" ? "Hijab/Outer" : item.category.charAt(0).toUpperCase() + item.category.slice(1);
                const fallbackImages = [
                  "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=400&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=400&auto=format&fit=crop&q=80",
                  "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&auto=format&fit=crop&q=80",
                ];
                const itemImage = item.imageUrl || outfit.flatlayImages?.[index] || fallbackImages[index % fallbackImages.length];

                return (
                  <div
                    key={index}
                    className="rounded-2xl sm:rounded-3xl bg-white border border-sand-200 hover:border-charcoal-900 transition-all overflow-hidden flex flex-col justify-between shadow-2xs group/card"
                  >
                    {/* Garment Image + Category Badge + Swap Button */}
                    <div className="relative aspect-square sm:aspect-[4/3] bg-sand-100 overflow-hidden">
                      <img
                        src={itemImage}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                      />

                      {/* Top Category Badge */}
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-0.5 rounded-md bg-charcoal-900/85 text-white text-[8px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                          {getCategoryTag(item.category)}
                        </span>
                      </div>

                      {/* Top Swap Button */}
                      {!item.isOwnedItem && (
                        <button
                          type="button"
                          onClick={() => handleSwapItem(index)}
                          className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-white/95 hover:bg-white text-charcoal-900 text-[8px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all"
                          title={`Ganti varian ${catLabel}`}
                        >
                          <span>↻ Ganti</span>
                        </button>
                      )}

                      {/* Bottom Color Chip */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[9px] font-mono font-semibold text-charcoal-900 shadow-2xs">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: item.colorHex || "#C69365" }}
                        />
                        <span className="truncate max-w-[85px]">{item.color}</span>
                      </div>
                    </div>

                    {/* Garment Details & Actions */}
                    <div className="p-3 space-y-2 flex flex-col justify-between flex-1">
                      <div className="space-y-0.5">
                        <h4 className="font-bold text-xs sm:text-sm text-charcoal-900 line-clamp-1 leading-snug">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-sand-500 line-clamp-1">
                          {item.material}
                        </p>
                        <div className="pt-0.5">
                          <span className="text-[11px] sm:text-xs font-mono font-bold text-charcoal-900">
                            {item.isOwnedItem
                              ? "Koleksi Sendiri (Rp 0)"
                              : activeBudgetTier === "mall"
                              ? "Rp 249rb - 450rb"
                              : item.estimatedPrice}
                          </span>
                        </div>
                      </div>

                      {/* Dual Marketplace Direct Buttons (Side-by-Side) */}
                      {item.isOwnedItem ? (
                        <div className="py-2 bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold rounded-xl border border-emerald-200 text-center">
                          ✓ Ada di Lemarimu
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <motion.a
                            href={links.shopee + (activeBudgetTier === "mall" ? "%20official%20store" : "")}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackAffiliateClick("shopee", item.shopeeQuery || item.name, "outfit_card")}
                            whileTap={{ scale: 0.96 }}
                            className="py-2 px-1 rounded-xl bg-[#EE4D2D] hover:bg-[#d63b1d] text-white text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                            title="Beli di Shopee"
                          >
                            <ShopeeIcon className="w-3 h-3 shrink-0" />
                            <span>Shopee</span>
                          </motion.a>

                          <motion.a
                            href={links.tokopedia + (activeBudgetTier === "mall" ? "%20official%20store" : "")}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackAffiliateClick("tokopedia", item.shopeeQuery || item.name, "outfit_card")}
                            whileTap={{ scale: 0.96 }}
                            className="py-2 px-1 rounded-xl bg-[#00AA5B] hover:bg-[#008f4c] text-white text-[10px] sm:text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs"
                            title="Beli di Tokopedia"
                          >
                            <TokopediaIcon className="w-3 h-3 shrink-0" />
                            <span>Tokped</span>
                          </motion.a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Expand/Collapse Toggle Button for Editorial Notes */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 rounded-2xl bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            <span>{isExpanded ? 'Tutup Detail' : 'Lihat Catatan & Perawatan Kain'}</span>
          </button>

          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden space-y-6 pt-2"
              >
                {/* Editorial Notes: Color Palette & Swatches */}
                <div className="border-t border-sand-200 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-wider uppercase text-sand-500 font-bold">
                      PALET WARNA HARMONIS
                    </span>
                    <span className="text-[9px] font-mono text-terracotta-600 font-bold">1-TAP SALIN</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {outfit.colorPalette.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCopyHex(col.hex, col.name)}
                        className="p-2.5 rounded-xl bg-white hover:bg-sand-50 border border-sand-200 flex items-center gap-2.5 transition-colors text-left"
                        title={`Klik untuk salin kode ${col.hex}`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-black/10 shrink-0 relative"
                          style={{ backgroundColor: col.hex }}
                        >
                          {copiedHex === col.hex && (
                            <span className="absolute inset-0 m-auto flex items-center justify-center text-white text-[10px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-charcoal-900 truncate">
                            {col.name}
                          </div>
                          <div className="text-[9px] font-mono text-sand-500 uppercase">
                            {copiedHex === col.hex ? "Tersalin" : col.hex}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Hijab Harmony Micro Note */}
                  <div className="text-xs text-charcoal-800 leading-relaxed pt-1">
                    <span className="font-bold text-charcoal-900 font-serif">Harmoni Hijab &amp; Aksesoris:</span>{" "}
                    {outfit.hijabHarmonyTip || "Padukan atasan ini dengan Hijab Voal Broken White atau Sand agar rona wajah tampak cerah alami."}
                  </div>
                </div>

                {/* Styling Rationale */}
                <div className="border-t border-sand-200 pt-5 space-y-2">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-sand-500">
                    KENAPA KOMBINASI INI COCOK BUAT KAMU
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed">
                    {outfit.whyItWorks}
                  </p>
                  <div className="text-xs text-terracotta-600 font-medium pt-1">
                    <span className="font-bold font-serif">Tips Stylist:</span> {outfit.stylingTip}
                  </div>
                </div>

                {/* Fabric Care & Longevity Guide */}
                <div className="border-t border-sand-200 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sand-500">
                      PANDUAN PERAWATAN KAIN (AGAR TIDAK SUSUT &amp; ADEM)
                    </span>
                    <span className="text-[10px] font-mono text-sand-500 uppercase">FABRIC CARE</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                      <div className="text-[10px] font-mono font-bold text-charcoal-900 uppercase">
                        Pencucian
                      </div>
                      <p className="text-[11px] text-charcoal-700 leading-tight">
                        Gunakan air dingin &amp; sabun cair lembut. Hindari sikat kasar agar serat kain tidak berbulu.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                      <div className="text-[10px] font-mono font-bold text-charcoal-900 uppercase">
                        Pengeringan
                      </div>
                      <p className="text-[11px] text-charcoal-700 leading-tight">
                        Jemur gantung di tempat teduh (anginkan). Hindari mesin pengering bersuhu panas tinggi.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-sand-50 border border-sand-200 space-y-1">
                      <div className="text-[10px] font-mono font-bold text-charcoal-900 uppercase">
                        Penyetrikaan
                      </div>
                      <p className="text-[11px] text-charcoal-700 leading-tight">
                        Setrika suhu sedang saat kain masih agak lembap atau gunakan semprotan uap (steamer).
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Directional Stylist Feedback Bar */}
          <div className="border-t border-[#E8DFD1] pt-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-charcoal-900 font-serif">Kurang pas? Arahkan gaya OOTD kamu:</span>
              <span className="text-[10px] font-mono text-sand-500 uppercase tracking-wider font-semibold">PILIHAN GAYA</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Lebih Santai / Kasual", hint: "Lebih santai, kasual, nyaman untuk nongkrong kafe" },
                { label: "Lebih Rapi & Formal", hint: "Lebih formal, rapi, profesional untuk kantor atau meeting" },
                { label: "Warna Lebih Cerah", hint: "Warna lebih cerah, fresh, dan playful" },
                { label: "Versi Hijab Longgar", hint: "Versi hijab modest, potongan longgar, dan menutup aurat" },
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (onRegenerate) onRegenerate(chip.hint);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white hover:bg-charcoal-900 hover:text-white border border-sand-300 text-xs text-charcoal-900 font-medium transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-sand-500 border-t border-sand-200">
            <span>Kombinasi disesuaikan dengan iklim tropis harian &amp; ketersediaan toko lokal.</span>
            {onRegenerate && (
              <button
                onClick={() => onRegenerate()}
                className="font-bold text-charcoal-900 hover:text-terracotta-600 uppercase tracking-wider text-[11px] underline underline-offset-4"
              >
                Variasi Lain ↻
              </button>
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

      {/* Subtle Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 10, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 10, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 px-4 py-2 bg-charcoal-900 text-sand-50 text-xs rounded-xl shadow-lg font-medium"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
