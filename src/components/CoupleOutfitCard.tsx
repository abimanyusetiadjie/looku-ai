"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, Bookmark, Camera, MessageCircle, Heart, Share2, ArrowUpRight } from "lucide-react";
import { OOTDRecommendation } from "@/lib/types";
import { getMarketplaceLinks, trackAffiliateClick } from "@/lib/affiliate";
import { ShopeeIcon, TokopediaIcon } from "@/components/MarketplaceIcons";

export interface CoupleOutfitCardProps {
  outfit?: OOTDRecommendation;
  onRegenerate?: () => void;
  onOpenSavedDrawer?: () => void;
  mode?: "couple" | "bestie";
  synergyScore?: number;
  synergyDesc?: string;
  occasionBadge?: string;
  palette?: { name: string; hex: string }[];
  personOne?: {
    title: string;
    items: { category: string; name: string }[];
  };
  personTwo?: {
    title: string;
    items: { category: string; name: string }[];
  };
}

export default function CoupleOutfitCard({
  outfit,
  onRegenerate,
  onOpenSavedDrawer,
  mode = "couple",
  synergyScore = 98,
  synergyDesc = "Harmoni Warna Komplementer",
  occasionBadge = "Cafe Date & Kondangan",
  palette = [
    { name: "Sage Green", hex: "#9CA986" },
    { name: "Mocca Oat", hex: "#D6C0B3" },
    { name: "Broken White", hex: "#FAEDCD" }
  ],
  personOne = {
    title: "Outfit Dia (Wanita)",
    items: [
      { category: "Atasan", name: "Blouse Silk Mocca Drop Shoulder" },
      { category: "Bawahan", name: "Rok Plisket Flowy Sage Green" },
      { category: "Hijab", name: "Pashmina Ceruty Oat Miracle" },
      { category: "Sepatu", name: "Flat Shoes Nude Leather" }
    ]
  },
  personTwo = {
    title: "Outfit Pasangan (Pria)",
    items: [
      { category: "Atasan", name: "Kemeja Linen Camp Collar Sage" },
      { category: "Bawahan", name: "Chino Pants Slim Straight Cream" },
      { category: "Sepatu", name: "Clean White Leather Sneakers" }
    ]
  }
}: CoupleOutfitCardProps) {
  const [isSaved, setIsSaved] = React.useState(false);
  const [toastMsg, setToastMsg] = React.useState("");

  const coupleOutfitId = React.useMemo(() => {
    return outfit?.id || `couple-${mode}-${Date.now()}`;
  }, [outfit, mode]);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
        setIsSaved(saved.some((item: any) => item.id === coupleOutfitId));
      } catch (e) {
        console.error(e);
      }
    }
  }, [coupleOutfitId]);

  const handleToggleSave = () => {
    if (typeof window === "undefined") return;
    try {
      const saved = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
      if (isSaved) {
        const filtered = saved.filter((item: any) => item.id !== coupleOutfitId);
        localStorage.setItem("looku_saved_outfits", JSON.stringify(filtered));
        setIsSaved(false);
        setToastMsg("Dihapus dari Lemari");
      } else {
        const coupleOutfitToSave: OOTDRecommendation = {
          id: coupleOutfitId,
          title: `✦ ${mode === "couple" ? "Couple Harmonious Look" : "Bestie Duo Aesthetic"} (${occasionBadge})`,
          tagline: `${synergyScore}% Sinergi Warna: ${palette.map(p => p.name).join(" + ")}`,
          overallVibe: synergyDesc,
          comfortRating: 5,
          affordabilityRating: 5,
          modestFriendly: true,
          skinToneMatch: "Harmoni seimbang untuk warna kulit berdua",
          whyItWorks: `Dirancang seimbang untuk foto berdua dengan sinergi warna ${palette.map(p => p.name).join(" & ")}.`,
          stylingTip: "Kenakan alas kaki senada dengan warna dominan pasangan.",
          colorPalette: palette.map(p => ({ name: p.name, hex: p.hex })),
          createdAt: new Date().toISOString(),
          items: [
            ...personOne.items.map(i => ({
              name: `[${personOne.title}] ${i.name}`,
              category: "atasan" as const,
              color: palette[0]?.name || "Harmoni",
              material: "Katun Linen / Silk",
              estimatedPrice: "Rp 150.000 - Rp 350.000",
              shopeeQuery: i.name,
              tokopediaQuery: i.name,
            })),
            ...personTwo.items.map(i => ({
              name: `[${personTwo.title}] ${i.name}`,
              category: "atasan" as const,
              color: palette[1]?.name || "Harmoni",
              material: "Katun Linen",
              estimatedPrice: "Rp 150.000 - Rp 350.000",
              shopeeQuery: i.name,
              tokopediaQuery: i.name,
            }))
          ],
        };

        localStorage.setItem("looku_saved_outfits", JSON.stringify([coupleOutfitToSave, ...saved]));
        setIsSaved(true);
        setToastMsg("Disimpan ke Lemari Koleksi!");
      }
      window.dispatchEvent(new Event("looku_saved_updated"));
      window.dispatchEvent(new Event("looku_profile_updated"));
      setTimeout(() => setToastMsg(""), 3000);
    } catch (e) {
      console.error("Error saving couple look:", e);
    }
  };

  const handleShareWA = () => {
    const text = `*LOOK.U DUO OOTD FORMULA*\n` +
      `*Occasion:* ${occasionBadge} (Sinergi: ${synergyScore}%)\n` +
      `*Palet:* ${palette.map(p => p.name).join(" + ")}\n\n` +
      `*${personOne.title}:*\n` +
      personOne.items.map(i => `• ${i.category}: ${i.name}`).join("\n") +
      `\n\n*${personTwo.title}:*\n` +
      personTwo.items.map(i => `• ${i.category}: ${i.name}`).join("\n") +
      `\n\n_Dicurasi dengan AI di looku.ai_`;
    
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="tactile-card overflow-hidden bg-white rounded-3xl shadow-sm border border-[#E8DFD1] relative"
    >
      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute top-4 right-4 z-20 bg-charcoal-900 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 animate-fade-in">
          {toastMsg}
        </div>
      )}

      {/* Header: Synergy Score & Occasion Badge */}
      <div className="bg-[#FAF8F5] p-5 border-b border-[#E8DFD1] flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sand-100 text-charcoal-900 border border-sand-300 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
            {occasionBadge}
          </span>
          <div className="flex gap-1.5">
            {palette.map((p, i) => (
              <div 
                key={i} 
                className="w-5 h-5 rounded-full border border-black/10 shadow-sm"
                style={{ backgroundColor: p.hex }}
                title={p.name}
              />
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
              SINERGI {synergyScore}%
            </span>
            <h3 className="text-xl font-serif font-bold text-[#181A18]">
              {synergyDesc}
            </h3>
          </div>
          <p className="text-xs text-[#181A18]/70 mt-1">
            Paduan warna {palette.map(p => p.name).join(" + ")} yang menciptakan look {mode === "couple" ? "romantis" : "kompak"} &amp; fotogenik.
          </p>
        </div>
      </div>

      {/* Body: 2 Columns for Outfits */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E8DFD1]">
        {/* Person One */}
        <div className="p-5 space-y-4">
          <h4 className="text-xs font-mono font-bold text-[#181A18] uppercase tracking-wider border-b border-[#E8DFD1] pb-2 flex items-center justify-between">
            <span>{personOne.title}</span>
            <span className="text-[10px] font-mono text-sand-500 lowercase">outfit 1</span>
          </h4>
          <ul className="space-y-3">
            {personOne.items.map((item, idx) => {
              const links = getMarketplaceLinks(item.name);
              return (
                <li key={idx} className="flex flex-col gap-1 pb-2 border-b border-sand-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#A89582] uppercase font-bold">{item.category}</span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={links.shopee}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackAffiliateClick("shopee", item.name, "couple_card")}
                        className="px-2 py-0.5 rounded bg-[#EE4D2D] hover:bg-[#d63b1d] text-white text-[9px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <ShopeeIcon className="w-2.5 h-2.5" />
                        <span>Shopee</span>
                      </a>
                      <a
                        href={links.tokopedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackAffiliateClick("tokopedia", item.name, "couple_card")}
                        className="px-2 py-0.5 rounded bg-[#00AA5B] hover:bg-[#008f4c] text-white text-[9px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <TokopediaIcon className="w-2.5 h-2.5" />
                        <span>Tokped</span>
                      </a>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#181A18]">{item.name}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Person Two */}
        <div className="p-5 space-y-4 bg-[#F4EFE6]/30">
          <h4 className="text-sm font-bold text-[#181A18] uppercase tracking-wide border-b border-[#E8DFD1] pb-2 flex items-center justify-between">
            <span>{personTwo.title}</span>
            <span className="text-[10px] font-mono text-sand-500 lowercase">outfit 2</span>
          </h4>
          <ul className="space-y-3">
            {personTwo.items.map((item, idx) => {
              const links = getMarketplaceLinks(item.name);
              return (
                <li key={idx} className="flex flex-col gap-1 pb-2 border-b border-sand-100 last:border-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#A89582] uppercase font-bold">{item.category}</span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={links.shopee}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackAffiliateClick("shopee", item.name, "couple_card")}
                        className="px-2 py-0.5 rounded bg-[#EE4D2D] hover:bg-[#d63b1d] text-white text-[9px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <ShopeeIcon className="w-2.5 h-2.5" />
                        <span>Shopee</span>
                      </a>
                      <a
                        href={links.tokopedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackAffiliateClick("tokopedia", item.name, "couple_card")}
                        className="px-2 py-0.5 rounded bg-[#00AA5B] hover:bg-[#008f4c] text-white text-[9px] font-bold transition-colors flex items-center gap-1 shadow-2xs"
                      >
                        <TokopediaIcon className="w-2.5 h-2.5" />
                        <span>Tokped</span>
                      </a>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#181A18]">{item.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-5 bg-white border-t border-[#E8DFD1] flex flex-col sm:flex-row gap-3">
        <button 
          onClick={handleToggleSave}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 ${
            isSaved 
              ? "bg-charcoal-900 text-white" 
              : "bg-[#F4EFE6] hover:bg-[#E8DFD1] text-[#181A18]"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isSaved ? "fill-white" : ""}`} />
          <span>{isSaved ? "Tersimpan di Lemari" : "Simpan Koleksi"}</span>
        </button>
        
        {onOpenSavedDrawer && (
          <button 
            onClick={onOpenSavedDrawer}
            className="py-3 px-4 rounded-xl bg-sand-100 hover:bg-sand-200 text-charcoal-900 font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2"
          >
            <span>Buka Lemari ↗</span>
          </button>
        )}

        <button 
          onClick={handleShareWA}
          className="flex-1 py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs tracking-wider transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Share via WA</span>
        </button>
      </div>
    </motion.div>
  );
}
