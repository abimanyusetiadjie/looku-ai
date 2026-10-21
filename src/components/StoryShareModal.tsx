"use client";

import React, { useRef, useState } from "react";
import { X, Download, Check, Share2, Copy, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { OOTDRecommendation } from "@/lib/types";
import { toPng } from "html-to-image";
import { resolveSmartItemVisual, resolveCleanShoePackshot } from "@/lib/packshot-dictionary";

interface StoryShareModalProps {
  outfit: OOTDRecommendation;
  onClose: () => void;
}

type StoryTemplate = "atelier" | "noir" | "archive";

export default function StoryShareModal({ outfit, onClose }: StoryShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<StoryTemplate>("atelier");
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  // Fallback and Smart Visual Resolution
  const fallbackHero = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000&auto=format&fit=crop&q=85";
  const heroImage = outfit.heroImage || outfit.flatlayImages?.[0] || outfit.items?.[0]?.imageUrl || fallbackHero;

  // Resolve 3 key breakdown packshots for the archive sheet layout
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
          ? "Top"
          : item.category === "bawahan"
          ? "Bottom"
          : item.category === "outer_hijab"
          ? "Layer"
          : "Shoes",
    };
  });

  const generateDataUrl = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    await new Promise((resolve) => setTimeout(resolve, 200));
    return await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2.5,
      quality: 0.98,
      backgroundColor: template === "noir" ? "#0E100F" : template === "atelier" ? "#F7F5F0" : "#FFFFFF",
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
          text: `Cek formula OOTD "${outfit.title}" yang dikurasi oleh look.u\n${shareUrl}`,
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `OOTD: ${outfit.title}`,
          text: `${outfit.title} — ${outfit.tagline}\n${shareUrl}`,
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
      const shareText = `${outfit.title}\n"${outfit.tagline}"\n\n• Atasan: ${outfit.items[0]?.name || "-"}\n• Bawahan: ${outfit.items[1]?.name || "-"}\n\nLihat kurasi di: ${shareUrl}`;
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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
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
          <div className="flex items-center gap-2 text-xs text-white/90 font-mono tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta-400" />
            <span>Story Export (9:16)</span>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-white/10 text-white/80 hover:text-white transition-all"
            aria-label="Tutup Story"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quiet Luxury Template Switchers */}
        <div className="bg-white/10 p-1 rounded-xl flex items-center gap-1 border border-white/10 text-[11px] font-mono tracking-wider uppercase">
          <button
            onClick={() => setTemplate("atelier")}
            className={`flex-1 py-1.5 rounded-lg transition-all font-medium ${
              template === "atelier"
                ? "bg-[#FAF8F5] text-charcoal-900 shadow-sm font-bold"
                : "text-white/70 hover:text-white"
            }`}
          >
            Atelier (Ecru)
          </button>
          <button
            onClick={() => setTemplate("noir")}
            className={`flex-1 py-1.5 rounded-lg transition-all font-medium ${
              template === "noir"
                ? "bg-[#181A18] text-white shadow-sm font-bold border border-white/20"
                : "text-white/70 hover:text-white"
            }`}
          >
            Noir (Dark)
          </button>
          <button
            onClick={() => setTemplate("archive")}
            className={`flex-1 py-1.5 rounded-lg transition-all font-medium ${
              template === "archive"
                ? "bg-white text-charcoal-900 shadow-sm font-bold"
                : "text-white/70 hover:text-white"
            }`}
          >
            Archive (Sheet)
          </button>
        </div>

        {/* ============================================================ */}
        {/* 9:16 STORY CANVAS CONTAINER (EXPORTED HIGH-DPI)             */}
        {/* ============================================================ */}
        <div className="overflow-hidden rounded-2xl shadow-2xl border border-white/10 flex justify-center bg-black/40">
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
            {/* TEMPLATE 1: THE ATELIER PASSE-PARTOUT (THE ROW / LEMAIRE) */}
            {/* -------------------------------------------------------- */}
            {template === "atelier" && (
              <div className="w-full h-full bg-[#FAF8F5] text-[#1E201E] p-6 flex flex-col justify-between relative overflow-hidden border border-[#E8DFD1]">
                {/* Refined Masthead */}
                <div className="flex items-center justify-between border-b border-[#E8DFD1] pb-3">
                  <div className="font-serif font-medium text-lg tracking-[0.06em] text-[#1E201E]">
                    Look<span className="text-[#8C5A3C] font-bold">.</span>u
                  </div>
                  <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#8C5A3C]">
                    Atelier Series
                  </div>
                </div>

                {/* Generous Framed Visual (Museum Passe-Partout) */}
                <div className="relative w-full aspect-[4/5] my-auto rounded-none overflow-hidden bg-[#EFECE6] border border-[#1E201E]/15 shadow-sm">
                  <img
                    src={heroImage}
                    alt={outfit.title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  {/* Subtle, restrained top-right coordinate */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-[#FAF8F5]/90 text-[#1E201E] text-[9px] font-mono tracking-widest uppercase">
                    33°C Tropics
                  </div>
                </div>

                {/* Quiet Luxury Typography & Color Specimen */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="text-[9px] font-mono tracking-[0.25em] text-[#8C5A3C] uppercase mb-0.5">
                      {outfit.overallVibe}
                    </div>
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-[#1E201E] leading-tight">
                      {outfit.title}
                    </h3>
                    <p className="font-serif italic text-xs text-[#1E201E]/70 mt-1 line-clamp-1">
                      &ldquo;{outfit.tagline}&rdquo;
                    </p>
                  </div>

                  {/* Minimalist Hairline Color Palette Strip */}
                  <div className="flex items-center justify-between border-t border-[#E8DFD1] pt-2.5">
                    <div className="flex items-center gap-2">
                      {outfit.colorPalette.slice(0, 4).map((col, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded-full border border-black/15 shadow-2xs shrink-0"
                            style={{ backgroundColor: col.hex }}
                          />
                          <span className="text-[9px] font-mono text-[#5C554E] truncate max-w-[48px]">
                            {col.name}
                          </span>
                        </div>
                      ))}
                    </div>
                    <span className="text-[9px] font-mono tracking-widest text-[#8C5A3C] uppercase">
                      Specimen
                    </span>
                  </div>

                  {/* Whispered Minimal Footer */}
                  <div className="flex items-center justify-between text-[8px] font-mono text-[#1E201E]/40 pt-1 border-t border-[#E8DFD1]">
                    <span>LOOKU.AI</span>
                    <span>CURATED IN JAKARTA</span>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* TEMPLATE 2: THE RUNWAY NOIR (SAINT LAURENT / ACNE STUDIOS)*/}
            {/* -------------------------------------------------------- */}
            {template === "noir" && (
              <div className="w-full h-full bg-[#0E100F] text-[#FAF8F5] p-6 flex flex-col justify-between relative overflow-hidden">
                {/* Top Minimalist Header */}
                <div className="flex items-baseline justify-between border-b border-white/15 pb-3">
                  <div className="font-serif text-xl font-medium tracking-[0.08em] text-white">
                    LOOK<span className="text-[#C69365] font-bold">.</span>U
                  </div>
                  <div className="text-[9px] font-mono tracking-[0.25em] text-white/50 uppercase">
                    33°C CLIMATE ARCHIVE
                  </div>
                </div>

                {/* Full Bleed Visual */}
                <div className="relative w-full aspect-[4/5] my-auto overflow-hidden bg-neutral-900 border border-white/10 shadow-2xl">
                  <img
                    src={heroImage}
                    alt={outfit.title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Editorial Typography */}
                <div className="space-y-3 pt-2">
                  <div>
                    <div className="text-[9px] font-mono tracking-[0.25em] text-[#C69365] uppercase mb-0.5">
                      COLLECTION 2026
                    </div>
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white leading-tight">
                      {outfit.title}
                    </h3>
                    <p className="text-[11px] font-mono text-white/60 mt-1 line-clamp-1">
                      {outfit.items[0]?.material || "100% Pure Flax Linen & Cotton Rayon"}
                    </p>
                  </div>

                  {/* Horizontal Pantone Graphic Strip */}
                  <div className="space-y-1 border-t border-white/10 pt-2.5">
                    <div className="flex h-2 w-full overflow-hidden rounded-full border border-white/20">
                      {outfit.colorPalette.slice(0, 4).map((col, idx) => (
                        <div
                          key={idx}
                          className="h-full flex-1"
                          style={{ backgroundColor: col.hex }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-[8px] font-mono text-white/40 pt-0.5">
                      {outfit.colorPalette.slice(0, 4).map((col, idx) => (
                        <span key={idx} className="truncate max-w-[55px]">
                          {col.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Footer Colophon */}
                  <div className="flex items-center justify-between text-[8px] font-mono text-white/35 pt-1 border-t border-white/10">
                    <span>LOOKU.AI / STUDIO</span>
                    <span>#LOOK-{outfit.id.slice(-4).toUpperCase()}</span>
                  </div>
                </div>
              </div>
            )}

            {/* -------------------------------------------------------- */}
            {/* TEMPLATE 3: THE DESIGNER'S LOOKBOOK SHEET (UNIQLO U / CDG)*/}
            {/* -------------------------------------------------------- */}
            {template === "archive" && (
              <div className="w-full h-full bg-white text-[#181A18] p-5 flex flex-col justify-between relative overflow-hidden border border-neutral-200">
                {/* Lookbook Header Table */}
                <div className="grid grid-cols-3 border-b border-neutral-300 pb-2 text-[9px] font-mono uppercase tracking-wider text-[#181A18]/60">
                  <div>LOOK.U STUDIO</div>
                  <div className="text-center">SEASON: TROPICS</div>
                  <div className="text-right">33°C HUMID</div>
                </div>

                {/* Hero Image (~45% Height) */}
                <div className="relative w-full aspect-[16/11] my-2 overflow-hidden bg-neutral-100 border border-neutral-200">
                  <img
                    src={heroImage}
                    alt={outfit.title}
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-white/95 text-neutral-900 text-[9px] font-mono uppercase font-bold tracking-wider">
                    {outfit.overallVibe}
                  </div>
                </div>

                {/* Clean Editorial Title */}
                <div className="py-1">
                  <h3 className="font-serif text-xl font-bold text-neutral-900 leading-tight">
                    {outfit.title}
                  </h3>
                  <p className="font-serif italic text-xs text-neutral-600 mt-0.5 line-clamp-1">
                    &ldquo;{outfit.tagline}&rdquo;
                  </p>
                </div>

                {/* The 3-Piece Breakdown Specimen Grid (Clean & Non-Gimmicky) */}
                <div className="space-y-1.5 py-1 border-t border-neutral-200 pt-2">
                  <div className="grid grid-cols-3 gap-2">
                    {breakdownItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-neutral-50 p-1.5 border border-neutral-200 flex flex-col justify-between"
                      >
                        <div className="relative aspect-square w-full overflow-hidden bg-neutral-200 mb-1">
                          <img
                            src={item.resolvedImage}
                            alt={item.name}
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover object-top"
                          />
                        </div>
                        <div className="space-y-0.5 text-left">
                          <div className="text-[8px] font-mono text-neutral-400 uppercase tracking-wider">
                            0{idx + 1} {item.categoryTag}
                          </div>
                          <div className="font-bold text-[10px] text-neutral-900 line-clamp-1 leading-snug">
                            {item.name}
                          </div>
                          <div className="text-[8px] font-mono text-neutral-500 truncate">
                            {item.color}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Reference */}
                <div className="flex items-center justify-between border-t border-neutral-300 pt-2 text-[9px] font-mono text-neutral-500 uppercase tracking-widest">
                  <span>looku.ai/?look={outfit.id}</span>
                  <span>Curated Architecture</span>
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
              className="py-3 px-3 rounded-xl bg-charcoal-900 hover:bg-terracotta-600 text-white font-bold text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-1.5 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{sharing ? "Menyiapkan..." : "Bagikan (IG/WA)"}</span>
            </motion.button>

            <motion.button
              onClick={handleDownloadImage}
              disabled={downloading}
              whileTap={{ scale: 0.96 }}
              className="py-3 px-3 rounded-xl bg-white hover:bg-sand-100 text-charcoal-900 font-bold text-xs tracking-wider uppercase shadow-lg flex items-center justify-center gap-1.5 transition-all border border-sand-300"
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
                <span className="text-emerald-300">Teks Formula Disalin ke Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-white/70" />
                <span>Salin Teks Ringkasan Formula</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
