"use client";

import React, { useRef, useState } from "react";
import { X, Download, Check, Share2, Copy, Sparkles, Palette, ThermometerSun, Wind } from "lucide-react";
import { motion } from "framer-motion";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";
import { toPng } from "html-to-image";
import { resolveSmartItemVisual, resolveCleanShoePackshot } from "@/lib/packshot-dictionary";

interface StoryShareModalProps {
  outfit: OOTDRecommendation;
  onClose: () => void;
}

type StoryTemplate = "editorial" | "lemon8" | "polaroid";

export default function StoryShareModal({ outfit, onClose }: StoryShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<StoryTemplate>("editorial");
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Fallback and Smart Visual Resolution
  const fallbackHero = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85";
  const heroImage = outfit.heroImage || outfit.flatlayImages?.[0] || outfit.items?.[0]?.imageUrl || fallbackHero;

  // Resolve 3 key breakdown packshots for the Lemon8 & Collage layouts
  const breakdownItems = (outfit.items || []).slice(0, 3).map((item) => {
    const slotMap: Record<string, "top" | "bottom" | "outer" | "shoes"> = {
      atasan: "top",
      bawahan: "bottom",
      outer_hijab: "outer",
      sepatu: "shoes",
    };
    const isShoe = item.category === "sepatu";
    const smartVisual = resolveSmartItemVisual(item, slotMap[item.category] || "top", heroImage);
    const imgUrl = isShoe
      ? resolveCleanShoePackshot(item.name, item.color, item.colorHex)
      : (item.imageUrl || smartVisual.imageUrl || heroImage);

    return {
      ...item,
      resolvedImage: imgUrl,
      categoryTag:
        item.category === "atasan"
          ? "ATASAN"
          : item.category === "bawahan"
          ? "BAWAHAN"
          : item.category === "outer_hijab"
          ? "HIJAB/OUTER"
          : "ALAS KAKI",
    };
  });

  const generateDataUrl = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    await new Promise((resolve) => setTimeout(resolve, 200));
    return await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2.5,
      quality: 0.95,
      backgroundColor: template === "editorial" ? "#121412" : template === "lemon8" ? "#FAF6EE" : "#F4EFE6",
    });
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    try {
      const dataUrl = await generateDataUrl();
      if (!dataUrl) return;

      const link = document.createElement("a");
      link.download = `LOOKU-${template.toUpperCase()}-${outfit.title.replace(/\s+/g, "_")}.png`;
      link.href = dataUrl;
      link.click();

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err) {
      console.error("Failed to export story card:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleNativeShare = async () => {
    setSharing(true);
    try {
      const dataUrl = await generateDataUrl();
      if (!dataUrl) return;

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `looku-ootd-${outfit.id.slice(-4)}.png`, { type: "image/png" });
      const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/?look=${outfit.id}` : `https://looku.ai/?look=${outfit.id}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Formula OOTD: ${outfit.title}`,
          text: `Cek formula OOTD tropis "${outfit.title}" yang dikurasi oleh look.u AI!\nBuka langsung di: ${shareUrl}`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `OOTD: ${outfit.title}`,
          text: `Formula gaya "${outfit.title}" - ${outfit.tagline}\nBuka di: ${shareUrl}`,
          url: shareUrl,
        });
      } else {
        handleDownloadImage();
      }
    } catch (err) {
      console.log("Share cancelled or unsupported:", err);
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/?look=${outfit.id}` : `https://looku.ai/?look=${outfit.id}`;
      const shareText = `Formula OOTD: ${outfit.title}\n"${outfit.tagline}"\n\n• Atasan: ${outfit.items[0]?.name || "-"}\n• Bawahan: ${outfit.items[1]?.name || "-"}\n• Tips: ${outfit.stylingTip}\n\nLihat kurasi lengkap di: ${shareUrl}`;
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error("Gagal menyalin link:", e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#121412]/90 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-sm w-full my-auto space-y-3"
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs text-white font-mono uppercase font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Story Lookbook (9:16)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 text-[#FAF8F5]/80 hover:text-white transition-all"
            aria-label="Tutup Story"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Aesthetic Template Selectors */}
        <div className="bg-white/10 p-1 rounded-2xl flex items-center gap-1 border border-white/15 text-[11px] font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setTemplate("editorial")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              template === "editorial"
                ? "bg-white text-charcoal-900 shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            ✦ Editorial
          </button>
          <button
            onClick={() => setTemplate("lemon8")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              template === "lemon8"
                ? "bg-[#FAF6EE] text-charcoal-900 shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            🍋 Lemon8
          </button>
          <button
            onClick={() => setTemplate("polaroid")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              template === "polaroid"
                ? "bg-terracotta-500 text-white shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            📷 Polaroid
          </button>
        </div>

        {/* ============================================================ */}
        {/* 9:16 STORY CANVAS CONTAINER (EXPORTED HIGH-DPI)             */}
        {/* ============================================================ */}
        <div className="overflow-hidden rounded-3xl shadow-2xl border border-white/10 flex justify-center bg-black/40">
          <div
            ref={cardRef}
            className="w-full relative flex flex-col justify-between overflow-hidden select-none"
            style={{
              width: "100%",
              maxWidth: "360px",
              aspectRatio: "9/16",
              minHeight: "560px",
            }}
          >
            {/* -------------------------------------------------------- */}
            {/* TEMPLATE 1: THE HIGH-FASHION EDITORIAL MAGAZINE (KINFOLK) */}
            {/* -------------------------------------------------------- */}
            {template === "editorial" && (
              <div className="w-full h-full bg-[#121412] text-[#FAF8F5] p-5 flex flex-col justify-between relative overflow-hidden">
                {/* Subtle Ambient Radial Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Top Magazine Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-white/20 pb-3">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-medium text-2xl tracking-[0.04em] text-white">
                      Look<span className="text-terracotta-400 font-bold">.</span>u
                    </span>
                    <span className="text-[9px] font-mono tracking-[0.25em] text-[#D7CABC] uppercase pl-1">
                      STUDIO
                    </span>
                  </div>
                  <div className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-white/25 text-[#FAF8F5]/90 bg-white/5">
                    33°C TROPICAL
                  </div>
                </div>

                {/* Hero Photo (Taking Center Stage ~56% Height) */}
                <div className="relative z-10 my-3 w-full flex-1 max-h-[58%] rounded-2xl overflow-hidden bg-neutral-900 border border-white/15 shadow-xl">
                  <img
                    src={heroImage}
                    alt={outfit.title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className="px-2.5 py-1 rounded-full bg-[#181A18]/90 text-white text-[10px] font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-xs">
                      ✦ {outfit.overallVibe}
                    </span>
                    {outfit.modestFriendly && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md">
                        MODEST COMPLIANT
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-white/90 text-charcoal-900 text-[10px] font-mono font-bold backdrop-blur-md shadow-xs">
                    AIRFLOW 98.4%
                  </div>
                </div>

                {/* Editorial Typography & Color Chips */}
                <div className="relative z-10 space-y-2.5 pt-1">
                  <div>
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
                      {outfit.title}
                    </h3>
                    <p className="font-serif italic text-xs text-white/75 mt-0.5 line-clamp-1">
                      &ldquo;{outfit.tagline}&rdquo;
                    </p>
                  </div>

                  {/* 4-Chip Minimalist Swatch Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                    <div className="flex items-center gap-1.5">
                      {outfit.colorPalette.slice(0, 4).map((col, idx) => (
                        <div key={idx} className="flex items-center gap-1 bg-white/5 border border-white/15 px-2 py-1 rounded-md">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0 border border-black/20"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span className="text-[10px] font-mono text-[#D7CABC] truncate max-w-[50px]">
                            {col.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Colophon Barcode */}
                  <div className="flex items-end justify-between pt-1 border-t border-white/10 text-[9px] font-mono text-white/60">
                    <div>
                      <span>CURATED BY LOOK.U ARCHIVE · 2026</span>
                    </div>
                    <div className="tracking-widest uppercase text-white/80 font-bold">
                      #LOOK-{outfit.id.slice(-4).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* TEMPLATE 2: THE VIRAL LEMON8 / OOTD BREAKDOWN COLLAGE     */}
            {/* -------------------------------------------------------- */}
            {template === "lemon8" && (
              <div className="w-full h-full bg-[#FAF6EE] text-[#181A18] p-4 sm:p-5 flex flex-col justify-between relative overflow-hidden border-2 border-[#E8DFD1]">
                {/* Header Lemon8 Style */}
                <div className="flex items-center justify-between pb-2 border-b border-[#E8DFD1]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#8C5A3C]">
                      LEMON8 OOTD GUIDE · 33°C
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#E8DFD1] text-[#181A18]">
                    ANTI-GERAH 100%
                  </span>
                </div>

                {/* Hero Visual (Top ~40% Height) */}
                <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden bg-[#EFECE6] border border-[#181A18]/10 my-2 shadow-sm">
                  <img
                    src={heroImage}
                    alt={outfit.title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-2 left-2 bg-[#181A18]/85 text-white px-2 py-0.5 rounded text-[10px] font-mono font-bold">
                    EST: ~Rp 185rb - 240rb
                  </div>
                  <div className="absolute top-2 right-2 bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded text-[10px] font-bold">
                    ★ REKOMENDASI ADEM
                  </div>
                </div>

                {/* Title & Fabric Highlight */}
                <div className="space-y-0.5 py-1">
                  <h3 className="font-serif text-xl font-bold text-[#181A18] leading-tight">
                    {outfit.title}
                  </h3>
                  <p className="text-[11px] text-[#5C554E] font-medium line-clamp-1">
                    🍃 {outfit.items[0]?.material || "Linen Crinkle & Katun Rayon Sejuk"}
                  </p>
                </div>

                {/* The 3-Piece Breakdown Cards (Lemon8 Viral Signature!) */}
                <div className="space-y-1.5 py-1">
                  <div className="text-[10px] font-mono font-bold text-[#8C5A3C] uppercase tracking-wider">
                    BEDAH POTONGAN PAKAIAN:
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {breakdownItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white rounded-xl p-1.5 border border-[#E8DFD1] flex flex-col justify-between shadow-2xs"
                      >
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#EFECE6] mb-1">
                          <img
                            src={item.resolvedImage}
                            alt={item.name}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                          <span className="absolute top-1 left-1 bg-[#181A18]/85 text-white text-[8px] font-mono px-1 py-0.2 rounded font-bold">
                            {item.categoryTag}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-[10px] text-[#181A18] line-clamp-1 leading-snug">
                            {item.name}
                          </h5>
                          <div className="flex items-center justify-between text-[9px] font-mono text-[#5C554E]">
                            <span className="flex items-center gap-1">
                              <span
                                className="w-1.5 h-1.5 rounded-full inline-block border border-black/20"
                                style={{ backgroundColor: item.colorHex || "#C69365" }}
                              />
                              <span className="truncate max-w-[40px]">{item.color}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Watermark */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E8DFD1] text-[10px] font-mono text-[#181A18]/70">
                  <span className="font-bold">look.u AI Stylist</span>
                  <span>looku.ai/?look={outfit.id}</span>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* TEMPLATE 3: THE KOREAN MINIMALIST POLAROID & PANTONE      */}
            {/* -------------------------------------------------------- */}
            {template === "polaroid" && (
              <div className="w-full h-full bg-[#F4EFE6] text-charcoal-900 p-5 flex flex-col justify-between relative overflow-hidden">
                {/* Polaroid Frame Card */}
                <div className="bg-white p-4 pb-5 rounded-2xl shadow-xl border border-sand-300 flex flex-col justify-between flex-1 relative">
                  {/* Photo Container */}
                  <div className="relative w-full aspect-[4/4] rounded-lg overflow-hidden bg-sand-100 border border-black/5 shadow-inner">
                    <img
                      src={heroImage}
                      alt={outfit.title}
                      crossOrigin="anonymous"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Timestamp */}
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-white font-mono text-[9px] tracking-wider uppercase backdrop-blur-xs">
                      JAKARTA · 33°C
                    </div>
                  </div>

                  {/* Below Polaroid Photo: Handwriting & Details */}
                  <div className="space-y-3 pt-4 text-center">
                    <div>
                      <h4 className="font-serif text-2xl font-bold text-charcoal-900 leading-tight">
                        {outfit.title}
                      </h4>
                      <p className="font-serif italic text-xs text-charcoal-700 mt-1">
                        &ldquo;{outfit.tagline}&rdquo;
                      </p>
                    </div>

                    {/* Minimalist Pantone Swatch Strip */}
                    <div className="border-t border-sand-200 pt-3">
                      <div className="text-[9px] font-mono tracking-widest uppercase text-sand-500 font-bold mb-1.5">
                        PANTONE HARMONY
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {outfit.colorPalette.slice(0, 4).map((col, idx) => (
                          <div key={idx} className="flex flex-col items-center">
                            <span
                              className="w-6 h-6 rounded-md border border-black/15 shadow-2xs"
                              style={{ backgroundColor: col.hex }}
                            />
                            <span className="text-[8px] font-mono text-charcoal-800 font-semibold mt-0.5 truncate max-w-[42px]">
                              {col.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Stylist Micro-Note */}
                    <div className="p-2 bg-sand-50 border border-sand-200 rounded-lg text-[10px] text-charcoal-800 text-left leading-snug">
                      <span className="font-bold font-serif text-charcoal-900">Stylist Note:</span>{" "}
                      {outfit.stylingTip}
                    </div>
                  </div>

                  {/* Polaroid Bottom Brand Stamp */}
                  <div className="flex items-center justify-between pt-3 border-t border-sand-200 text-[9px] font-mono text-sand-500">
                    <span>LOOK.U SEOUL-JAKARTA EDITORIAL</span>
                    <span>ARCHIVE #{outfit.id.slice(-4).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-2 pt-1">
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              onClick={handleNativeShare}
              disabled={sharing}
              whileTap={{ scale: 0.96 }}
              className="py-3 px-3 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{sharing ? "Menyiapkan..." : "Bagikan (IG/WA)"}</span>
            </motion.button>

            <motion.button
              onClick={handleDownloadImage}
              disabled={downloading}
              whileTap={{ scale: 0.96 }}
              className="py-3 px-3 rounded-2xl bg-white hover:bg-sand-100 text-charcoal-900 font-bold text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-1.5 transition-all"
            >
              {downloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tersimpan!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PNG</span>
                </>
              )}
            </motion.button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono flex items-center justify-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-300">Teks Outfit Disalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-white/70" />
                <span>Salin Teks Ringkasan Outfit</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
