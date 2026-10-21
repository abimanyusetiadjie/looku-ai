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
import { resolveCleanShoePackshot, resolveSmartItemVisual } from "@/lib/packshot-dictionary";

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
    
    const slotMap: Record<string, "top" | "bottom" | "outer" | "shoes"> = {
      atasan: "top",
      bawahan: "bottom",
      outer_hijab: "outer",
      sepatu: "shoes",
    };
    const resolvedSwap = resolveSmartItemVisual(
      { ...alt, imageUrl: undefined },
      slotMap[cat] || "top"
    );
    alt.imageUrl = resolvedSwap.imageUrl;

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
          setToastMsg("Look dihapus dari Lemari.");
        } else {
          list.unshift(outfit);
          setIsSaved(true);
          setToastMsg("✨ Look berhasil disimpan ke Lemari!");
        }
        localStorage.setItem("looku_saved_outfits", JSON.stringify(list));
        window.dispatchEvent(new Event("looku_saved_updated"));
        window.dispatchEvent(new Event("storage"));
        setTimeout(() => setToastMsg(""), 3000);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleShareSHARE = () => {
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
          className="bg-white rounded-sm border border-[#E8DFD1] p-4 sm:p-8 space-y-5 sm:space-y-8 shadow-tactile"
        >
          {/* Header Bar: Spec Number & Action Controls (Mobile Clean & Thumb-Friendly) */}
          <div className="flex items-center justify-between gap-2 border-b border-[#E8DFD1] pb-3.5 sm:pb-5">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[11px] font-mono font-bold tracking-wider uppercase bg-[#181A18] text-[#FAF8F5] px-2.5 py-1 rounded-full">
                LOOK OF THE DAY
              </span>
              {outfit.modestFriendly && (
                <span className="text-[11px] font-mono tracking-wider uppercase text-charcoal-900 border border-sand-300 px-2.5 py-0.5 sm:py-1 rounded-full font-bold">
                  MODEST
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={handleShareSHARE}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-none text-charcoal-900/70 hover:text-charcoal-900 hover:bg-sand-100 transition-colors flex items-center justify-center min-w-[40px] min-h-[40px]"
                title="Kirim ke WhatsApp"
                aria-label="Kirim ke WhatsApp"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
              </button>

              <button
                onClick={() => setShowStoryModal(true)}
                className="min-h-[40px] sm:min-h-[44px] bg-sand-100 hover:bg-sand-200 text-charcoal-900 border border-sand-300 font-semibold text-xs py-1.5 px-3 sm:py-2 sm:px-3.5 rounded-none transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Share2 className="w-3.5 h-3.5 text-charcoal-700" />
                <span className="hidden xs:inline">Story</span>
              </button>

              <button
                onClick={handleToggleSave}
                className={`min-h-[40px] sm:min-h-[44px] text-xs font-bold py-1.5 px-3 sm:py-2 sm:px-4 rounded-none transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                  isSaved
                    ? "bg-emerald-700 text-white"
                    : "bg-charcoal-900 hover:bg-charcoal-800 text-white"
                }`}
                title="SAVE TO WARDROBE"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? "SAVED" : "SAVE TO WARDROBE"}</span>
              </button>
            </div>
          </div>

          {/* Title & Editorial Tagline (Mobile Scaled) */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-terracotta-600 font-bold tracking-wider uppercase">
                {outfit.overallVibe}
              </span>
              <span className="text-[11px] font-mono text-[#5C554E]">•</span>
              <span className="text-[11px] font-mono text-[#5C554E] font-bold">Personal Color Match</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#181A18] tracking-tight leading-tight">
              {outfit.title}
            </h2>
            <p className="font-serif italic text-sm sm:text-lg text-[#181A18]/70 pt-0.5 leading-snug">
              &ldquo;{outfit.tagline}&rdquo;
            </p>

            {/* FULL LOOK PREVIEW (Hero Image Collage) */}
            <div className="w-full aspect-[4/5] sm:aspect-[16/9] mt-6 flex gap-1 overflow-hidden rounded-sm bg-sand-100 border border-sand-200">
              {items.slice(0, 2).map((item, idx) => {
                const fallbackImages = [
                  "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80",
                  "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80"
                ];
                const itemImage = item.imageUrl || outfit.flatlayImages?.[idx] || fallbackImages[idx % fallbackImages.length];
                
                return (
                  <div key={idx} className="flex-1 relative group cursor-pointer overflow-hidden">
                    <img
                      src={itemImage}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
                    />
                    <div className="absolute inset-0 bg-black/5" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tier Selector & Total Estimate Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-b border-[#E8DFD1] py-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase text-[#5C554E] tracking-wider">
                TIER BELANJA:
              </span>
              <div className="flex items-center gap-1 bg-sand-100 p-1 rounded-none border border-sand-200">
                <button
                  type="button"
                  onClick={() => {
                    setActiveBudgetTier("budget");
                    setToastMsg("Mode Hemat Terjangkau aktif (< Rp 120rb)");
                    setTimeout(() => setToastMsg(""), 2500);
                  }}
                  className={`py-1.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
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
                  className={`py-1.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                    activeBudgetTier === "mall"
                      ? "bg-charcoal-900 text-white shadow-xs"
                      : "text-charcoal-700 hover:text-charcoal-900"
                  }`}
                >
                  Mall
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono font-bold text-charcoal-900 bg-sand-100 px-3 py-1.5 rounded-full border border-sand-200">
              {activeBudgetTier === "mall" ? "TOTAL EST: ~Rp 650rb (Mall)" : "TOTAL EST: ~Rp 185rb (Hemat)"}
            </div>
          </div>

          {/* 2-Column Shoppable Pieces Grid (Fashion Commerce Standard) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider uppercase text-[#5C554E] font-bold">
                KOMPOSISI LOOK
              </span>
              <span className="text-[11px] font-mono text-terracotta-600 font-bold tracking-wider uppercase">
                MARKETPLACE RESMI & DUPE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {items.map((item, index) => {
                const links = getMarketplaceLinks(item.shopeeQuery);
                const catLabel = item.category === "outer_hijab" ? "Hijab/Outer" : item.category.charAt(0).toUpperCase() + item.category.slice(1);
                const slotMap: Record<string, "top" | "bottom" | "outer" | "shoes"> = {
                  atasan: "top",
                  bawahan: "bottom",
                  outer_hijab: "outer",
                  sepatu: "shoes",
                };
                const isShoe = item.category === "sepatu";
                const smartVisual = resolveSmartItemVisual(item, slotMap[item.category] || "top", outfit.heroImage);
                const itemImage = isShoe
                  ? resolveCleanShoePackshot(item.name, item.color, item.colorHex)
                  : (item.imageUrl || smartVisual.imageUrl || outfit.flatlayImages?.[index]);

                return (
                  <div
                    key={index}
                    className="rounded-none sm:rounded-sm bg-white border border-sand-200 hover:border-charcoal-900 transition-all overflow-hidden flex flex-col justify-between shadow-2xs group/card"
                  >
                    {/* Garment Image + Category Badge + Swap Button */}
                    <div className="relative aspect-square sm:aspect-[4/3] bg-[#EFECE6] overflow-hidden">
                      <img
                        src={itemImage}
                        alt={item.name}
                        className={`w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ${
                          !isShoe && item.cropConfig?.isCrop
                            ? `${item.cropConfig.position} ${item.cropConfig.scale}`
                            : "object-top"
                        }`}
                      />

                      {/* Top Category & Brand Badge */}
                      <div className="absolute top-2 left-2 flex items-center gap-1">
                        <span className="px-2 py-0.5 rounded-md bg-charcoal-900/85 text-white text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                          {getCategoryTag(item.category)}
                        </span>
                        {item.brand && (
                          <span className="px-1.5 py-0.5 rounded-md bg-[#8C5A3C] text-white text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-xs">
                            {item.brand}
                          </span>
                        )}
                      </div>

                      {/* Top Swap Button (Touch-Friendly Standard >= 36px) */}
                      {!item.isOwnedItem && (
                        <button
                          type="button"
                          onClick={() => handleSwapItem(index)}
                          className="absolute top-2 right-2 min-h-[36px] px-2.5 py-1.5 rounded-md bg-white/95 hover:bg-white text-charcoal-900 text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
                          title={`Ganti varian ${catLabel}`}
                        >
                          <RefreshCw className="w-3 h-3 text-terracotta-600" />
                          <span>Ganti</span>
                        </button>
                      )}

                      {/* Bottom Color Chip */}
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/95 backdrop-blur-xs text-[11px] font-mono font-bold text-charcoal-900 shadow-2xs">
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
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-xs sm:text-sm text-charcoal-900 line-clamp-1 leading-snug">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-xs text-[#5C554E] line-clamp-1">
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

                      {/* Consolidated Marketplace CTA (Eliminates Button Collisions on Mobile) */}
                      {item.isOwnedItem ? (
                        <div className="py-2 bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold rounded-none border border-emerald-200 text-center">
                          ✓ Ada di Lemarimu
                        </div>
                      ) : (
                        <div className="pt-1">
                          {item.brandUrl ? (
                            <div className="space-y-1.5">
                              <a
                                href={item.brandUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full min-h-[36px] px-2.5 bg-[#181A18] hover:bg-[#8C5A3C] text-[#FAF8F5] text-[11px] font-mono font-bold tracking-wider uppercase flex items-center justify-center gap-1.5 transition-colors shadow-2xs rounded-sm"
                                title={`Beli resmi di ${item.brand || 'Brand'}`}
                              >
                                <span className="truncate">Beli Resmi ({item.brand || "Brand"})</span>
                                <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                              </a>
                              <div className="flex items-center justify-between gap-1 pt-0.5">
                                <motion.a
                                  href={item.shopeeUrl || (links.shopee + (activeBudgetTier === "mall" ? "%20official%20store" : ""))}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => trackAffiliateClick("shopee", item.shopeeQuery || item.name, "outfit_card")}
                                  whileTap={{ scale: 0.96 }}
                                  className="flex-1 min-h-[32px] px-2 bg-orange-50/80 hover:bg-orange-100 border border-orange-200 text-[#D7431F] text-[11px] font-mono font-bold flex items-center justify-center gap-1 rounded-sm transition-colors truncate"
                                  title="Alternatif hemat di Shopee"
                                >
                                  <ShopeeIcon className="w-3 h-3 shrink-0" />
                                  <span className="truncate">Shopee</span>
                                </motion.a>
                                <motion.a
                                  href={item.tokopediaUrl || (links.tokopedia + (activeBudgetTier === "mall" ? "%20official%20store" : ""))}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => trackAffiliateClick("tokopedia", item.shopeeQuery || item.name, "outfit_card")}
                                  whileTap={{ scale: 0.96 }}
                                  className="flex-1 min-h-[32px] px-2 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200 text-[#00884A] text-[11px] font-mono font-bold flex items-center justify-center gap-1 rounded-sm transition-colors truncate"
                                  title="Alternatif di Tokopedia"
                                >
                                  <TokopediaIcon className="w-3 h-3 shrink-0" />
                                  <span className="truncate">Tokped</span>
                                </motion.a>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1.5">
                              <motion.a
                                href={item.shopeeUrl || (links.shopee + (activeBudgetTier === "mall" ? "%20official%20store" : ""))}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => trackAffiliateClick("shopee", item.shopeeQuery || item.name, "outfit_card")}
                                whileTap={{ scale: 0.96 }}
                                className="w-full min-h-[36px] px-2.5 bg-[#FAF8F5] hover:bg-orange-50/60 border border-sand-300 hover:border-orange-300 text-[#D7431F] text-[11px] font-mono font-bold tracking-wide flex items-center justify-center gap-1.5 transition-colors shadow-2xs rounded-sm"
                                title="Beli produk di Shopee"
                              >
                                <ShopeeIcon className="w-3.5 h-3.5 shrink-0" />
                                <span className="truncate">Beli di Shopee</span>
                                <ArrowUpRight className="w-3 h-3 shrink-0 opacity-60" />
                              </motion.a>
                              <div className="text-center pt-0.5">
                                <a
                                  href={item.tokopediaUrl || (links.tokopedia + (activeBudgetTier === "mall" ? "%20official%20store" : ""))}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => trackAffiliateClick("tokopedia", item.shopeeQuery || item.name, "outfit_card")}
                                  className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold text-[#00884A] hover:underline"
                                >
                                  <TokopediaIcon className="w-3 h-3 shrink-0" />
                                  <span>Atau cek Tokopedia</span>
                                </a>
                              </div>
                            </div>
                          )}
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
            className="w-full py-3 rounded-none bg-sand-100 hover:bg-sand-200 border border-sand-300 text-charcoal-900 text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2"
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
                    <span className="text-[11px] font-mono tracking-wider uppercase text-[#5C554E] font-bold">
                      PALET WARNA HARMONIS
                    </span>
                    <span className="text-[11px] font-mono text-terracotta-600 font-bold">1-TAP SALIN</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {outfit.colorPalette.map((col, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleCopyHex(col.hex, col.name)}
                        className="p-2.5 rounded-none bg-white hover:bg-sand-50 border border-sand-200 flex items-center gap-2.5 transition-colors text-left"
                        title={`Klik untuk salin kode ${col.hex}`}
                      >
                        <div
                          className="w-6 h-6 rounded-full border border-black/10 shrink-0 relative"
                          style={{ backgroundColor: col.hex }}
                        >
                          {copiedHex === col.hex && (
                            <span className="absolute inset-0 m-auto flex items-center justify-center text-white text-[11px] font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                        <div className="truncate">
                          <div className="text-xs font-bold text-charcoal-900 truncate">
                            {col.name}
                          </div>
                          <div className="text-[11px] font-mono text-[#5C554E] uppercase">
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
                  <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5C554E]">
                    STYLING RATIONALE
                  </div>
                  <p className="text-xs sm:text-sm text-charcoal-800 leading-relaxed">
                    {outfit.whyItWorks}
                  </p>
                  <div className="text-xs text-terracotta-600 font-medium pt-1">
                    <span className="font-bold font-serif">Stylist Note:</span> {outfit.stylingTip}
                  </div>
                </div>

                {/* Fabric Care & Longevity Guide */}
                <div className="border-t border-sand-200 pt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#5C554E]">
                      PANDUAN PERAWATAN KAIN (AGAR TIDAK SUSUT &amp; ADEM)
                    </span>
                    <span className="text-[11px] font-mono text-[#5C554E] uppercase font-bold">FABRIC CARE</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3 rounded-none bg-sand-50 border border-sand-200 space-y-1">
                      <div className="text-[11px] font-mono font-bold text-charcoal-900 uppercase">
                        Pencucian
                      </div>
                      <p className="text-[11px] text-charcoal-700 leading-tight">
                        Gunakan air dingin &amp; sabun cair lembut. Hindari sikat kasar agar serat kain tidak berbulu.
                      </p>
                    </div>

                    <div className="p-3 rounded-none bg-sand-50 border border-sand-200 space-y-1">
                      <div className="text-[11px] font-mono font-bold text-charcoal-900 uppercase">
                        Pengeringan
                      </div>
                      <p className="text-[11px] text-charcoal-700 leading-tight">
                        Jemur gantung di tempat teduh (anginkan). Hindari mesin pengering bersuhu panas tinggi.
                      </p>
                    </div>

                    <div className="p-3 rounded-none bg-sand-50 border border-sand-200 space-y-1">
                      <div className="text-[11px] font-mono font-bold text-charcoal-900 uppercase">
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
              <span className="font-bold text-charcoal-900 font-serif">Directional Adjustments:</span>
              <span className="text-[11px] font-mono text-[#5C554E] uppercase tracking-wider font-bold">DIRECTIONAL CUES</span>
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
                  className="px-3 py-1.5 rounded-none bg-white hover:bg-charcoal-900 hover:text-white border border-sand-300 text-xs text-charcoal-900 font-medium transition-all"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Safe Harbor Legal Aggregator Disclaimer */}
          <div className="p-3 bg-[#FAF8F5] border border-[#181A18]/10 text-center text-[11px] text-[#181A18]/75 font-sans leading-relaxed select-none">
            ⚖️ <span className="font-semibold text-[#181A18]/90">Safe Harbor Disclaimer:</span> Foto dan merek dagang (Uniqlo, H&M, Zara, dll.) adalah hak milik masing-masing pemegang merek. Look.u bertindak semata-mata sebagai kurator gaya personal &amp; pengarah rujukan resmi (Aggregator Model).
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-[#5C554E] border-t border-sand-200">
            <span>Kombinasi disesuaikan dengan iklim tropis harian &amp; ketersediaan toko resmi &amp; lokal.</span>
            {onRegenerate && (
              <button
                onClick={() => onRegenerate()}
                className="font-bold text-charcoal-900 hover:text-terracotta-600 uppercase tracking-wider text-xs underline underline-offset-4"
              >
                Regenerate 
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
            className="fixed bottom-6 left-1/2 z-50 px-4 py-2 bg-charcoal-900 text-sand-50 text-xs rounded-none shadow-lg font-medium"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
