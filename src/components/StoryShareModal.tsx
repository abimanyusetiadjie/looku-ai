"use client";

import React, { useRef, useState } from "react";
import { X, Download, Check, Share2, Copy, Sparkles, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { OOTDRecommendation } from "@/lib/types";
import { toPng } from "html-to-image";

interface StoryShareModalProps {
  outfit: OOTDRecommendation;
  onClose: () => void;
}

type StoryTemplate = "editorial" | "earthy" | "streetwear";

export default function StoryShareModal({ outfit, onClose }: StoryShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [template, setTemplate] = useState<StoryTemplate>("editorial");
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const generateDataUrl = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    await new Promise((resolve) => setTimeout(resolve, 150));
    return await toPng(cardRef.current, {
      cacheBust: true,
      pixelRatio: 2.5,
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

  // Template Styles Config
  const isEditorial = template === "editorial";
  const isEarthy = template === "earthy";
  const isStreetwear = template === "streetwear";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#181A18]/85 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-sm w-full my-auto space-y-3"
      >
        {/* Top Header & Close */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5 text-xs text-white font-mono uppercase font-bold">
            <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
            <span>Story Lookbook (9:16)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 text-[#FAF8F5]/80 hover:text-white transition-all"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Template Selector Tabs */}
        <div className="bg-white/10 p-1 rounded-2xl flex items-center gap-1 border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider">
          <button
            onClick={() => setTemplate("editorial")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              isEditorial ? "bg-white text-charcoal-900 shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            ✦ Editorial
          </button>
          <button
            onClick={() => setTemplate("earthy")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              isEarthy ? "bg-[#FAF8F5] text-charcoal-900 shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            🌿 Earthy
          </button>
          <button
            onClick={() => setTemplate("streetwear")}
            className={`flex-1 py-1.5 rounded-xl transition-all ${
              isStreetwear ? "bg-terracotta-500 text-white shadow-sm" : "text-white/70 hover:text-white"
            }`}
          >
            ⚡ Street
          </button>
        </div>

        {/* 9:16 Story Canvas */}
        <div
          ref={cardRef}
          className={`w-full rounded-3xl p-6 sm:p-7 shadow-2xl relative overflow-hidden flex flex-col justify-between transition-colors ${
            isEditorial
              ? "bg-[#181A18] text-[#FAF8F5] border border-[#2B352A]"
              : isEarthy
              ? "bg-[#FAF8F5] text-charcoal-900 border border-[#D7CABC]"
              : "bg-[#0F110F] text-[#FAF8F5] border-2 border-terracotta-500/50"
          }`}
          style={{ minHeight: "560px", aspectRatio: "9/16" }}
        >
          {/* Ambient Aesthetic Background Element */}
          {isEditorial && (
            <div className="absolute top-0 right-0 w-48 h-48 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />
          )}
          {isEarthy && (
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#9DC183]/15 rounded-full blur-3xl pointer-events-none" />
          )}
          {isStreetwear && (
            <div className="absolute inset-0 bg-[radial-gradient(#BA5D38_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
          )}

          {/* Top Bar: Brand Watermark & Edition */}
          <div
            className={`relative z-10 flex items-center justify-between border-b pb-3 ${
              isEarthy ? "border-sand-300" : "border-white/15"
            }`}
          >
            <div>
              <div
                className={`font-serif italic font-bold text-xl tracking-tight flex items-baseline ${
                  isEarthy ? "text-charcoal-900" : "text-white"
                }`}
              >
                look<span className="text-terracotta-500 not-italic">.</span>u
              </div>
              <div
                className={`text-[8px] font-mono tracking-widest uppercase ${
                  isEarthy ? "text-sand-500" : "text-[#A89582]"
                }`}
              >
                AI STYLIST ARCHIVE
              </div>
            </div>
            <div
              className={`text-[8px] font-mono tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${
                isEarthy
                  ? "border-sand-400 text-charcoal-800 bg-sand-100"
                  : "border-white/20 text-[#D7CABC]"
              }`}
            >
              2026 EDITION
            </div>
          </div>

          {/* Main Showcase */}
          <div className="relative z-10 my-auto py-4 space-y-3.5">
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-terracotta-500 uppercase font-bold">
                {outfit.overallVibe}
              </div>
              <h3
                className={`font-serif text-2xl sm:text-[26px] font-bold tracking-tight mt-0.5 leading-tight ${
                  isEarthy ? "text-charcoal-900" : "text-white"
                }`}
              >
                {outfit.title}
              </h3>
              <p
                className={`font-serif italic text-xs mt-1 ${
                  isEarthy ? "text-charcoal-700" : "text-white/70"
                }`}
              >
                &ldquo;{outfit.tagline}&rdquo;
              </p>
            </div>

            {/* Spec Items Box */}
            <div
              className={`space-y-1.5 p-3 rounded-2xl border ${
                isEarthy
                  ? "bg-white border-sand-300 shadow-2xs"
                  : "bg-white/5 border-white/10"
              }`}
            >
              <div
                className={`text-[8px] font-mono tracking-widest uppercase font-bold ${
                  isEarthy ? "text-sand-500" : "text-[#A89582]"
                }`}
              >
                CURATED PIECES:
              </div>
              {outfit.items.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-baseline justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 truncate pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 shrink-0" />
                    <span
                      className={`font-medium truncate ${
                        isEarthy ? "text-charcoal-900" : "text-white/90"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono shrink-0 ${
                      isEarthy ? "text-terracotta-600 font-bold" : "text-[#D7CABC]"
                    }`}
                  >
                    {item.color}
                  </span>
                </div>
              ))}
            </div>

            {/* Color Swatch Matrix */}
            <div>
              <div
                className={`text-[8px] font-mono tracking-widest uppercase mb-1 font-bold ${
                  isEarthy ? "text-sand-500" : "text-[#A89582]"
                }`}
              >
                PALET WARNA HARMONI:
              </div>
              <div className="flex items-center gap-1.5">
                {outfit.colorPalette.map((col, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                    <div
                      className="w-full h-3.5 rounded-md border border-black/15 shadow-2xs"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span
                      className={`text-[7px] font-mono truncate max-w-[45px] ${
                        isEarthy ? "text-charcoal-700" : "text-white/70"
                      }`}
                    >
                      {col.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Styling Tip Pill */}
            <div
              className={`p-2.5 rounded-xl border text-[10px] leading-relaxed ${
                isEarthy
                  ? "bg-sand-100 border-sand-300 text-charcoal-800"
                  : "bg-white/5 border-white/10 text-white/80"
              }`}
            >
              <b>Catatan Stylist:</b> {outfit.stylingTip}
            </div>
          </div>

          {/* Bottom Colophon Barcode */}
          <div
            className={`relative z-10 border-t pt-2.5 flex items-end justify-between ${
              isEarthy ? "border-sand-300" : "border-white/15"
            }`}
          >
            <div>
              <div
                className={`text-[7px] font-mono uppercase tracking-widest ${
                  isEarthy ? "text-sand-500" : "text-[#A89582]"
                }`}
              >
                CURATED BY LOOK.U STUDIO
              </div>
              <div
                className={`text-[10px] font-bold tracking-wider ${
                  isEarthy ? "text-charcoal-900" : "text-white"
                }`}
              >
                looku.ai/?look={outfit.id} <span className="font-normal opacity-60">| Iklim 33°C</span>
              </div>
            </div>
            <div
              className={`font-mono text-[7px] tracking-widest uppercase text-right ${
                isEarthy ? "text-charcoal-500" : "text-white/40"
              }`}
            >
              ||| | |||| | ||| ||
              <div>#LOOK-{outfit.id.slice(-4).toUpperCase()}</div>
            </div>
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

