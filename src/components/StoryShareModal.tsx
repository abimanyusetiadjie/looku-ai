"use client";

import React, { useRef, useState } from "react";
import { X, Download, Check } from "lucide-react";
import { motion } from "framer-motion";
import { OOTDRecommendation } from "@/lib/types";
import { toPng } from "html-to-image";

interface StoryShareModalProps {
  outfit: OOTDRecommendation;
  onClose: () => void;
}

export default function StoryShareModal({ outfit, onClose }: StoryShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setDownloading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2.5, // Crisp HD rendering
      });

      const link = document.createElement("a");
      link.download = `LOOK.U-LOOKBOOK-${outfit.title.replace(/\s+/g, "_")}.png`;
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#181A18]/80 backdrop-blur-md overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-sm w-full my-auto"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 p-2 text-[#FAF8F5]/80 hover:text-white transition-all z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 9:16 Seoul Editorial Magazine Story Canvas */}
        <div
          ref={cardRef}
          className="w-full bg-[#181A18] text-[#FAF8F5] rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#2B352A] relative overflow-hidden flex flex-col justify-between"
          style={{ minHeight: "580px", aspectRatio: "9/16" }}
        >
          {/* Subtle Warm Linen Ambient Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Editorial Top Bar with look.u Logo */}
          <div className="relative z-10 flex items-center justify-between border-b border-white/15 pb-4">
            <div>
              <div className="font-serif italic font-bold text-xl tracking-tight text-white flex items-baseline">
                look<span className="text-terracotta-500 not-italic">.</span>u
              </div>
              <div className="text-[9px] font-mono tracking-widest text-[#A89582] uppercase">
                DAILY LOOKBOOK ARCHIVE
              </div>
            </div>
            <div className="text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/20 text-[#D7CABC]">
              2026 EDITION
            </div>
          </div>

          {/* Main Lookbook Showcase Body */}
          <div className="relative z-10 my-auto py-5 space-y-4">
            <div>
              <div className="text-[10px] font-mono tracking-[0.2em] text-terracotta-500 uppercase font-bold">
                {outfit.overallVibe}
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
                {outfit.title}
              </h3>
              <p className="font-serif italic text-xs text-white/70 mt-0.5">
                &ldquo;{outfit.tagline}&rdquo;
              </p>
            </div>

            {/* Spec Items Box */}
            <div className="space-y-2 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <div className="text-[9px] font-mono tracking-widest text-[#A89582] uppercase">
                CURATED PIECES SPEC:
              </div>
              {outfit.items.slice(0, 4).map((item, idx) => (
                <div key={idx} className="flex items-baseline justify-between text-xs">
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="w-1 h-1 rounded-full bg-terracotta-500 shrink-0" />
                    <span className="text-white/90 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#D7CABC] shrink-0">
                    {item.color}
                  </span>
                </div>
              ))}
            </div>

            {/* Skin Tone & Color Palette Matrix */}
            <div>
              <div className="text-[9px] font-mono tracking-widest text-[#A89582] uppercase mb-1.5">
                COLOR HARMONY MATRIX:
              </div>
              <div className="flex items-center gap-2">
                {outfit.colorPalette.map((col, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full h-4 rounded-md border border-white/20"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span className="text-[8px] font-mono text-white/60 truncate max-w-[50px]">
                      {col.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Micro Quote */}
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] text-white/80 leading-relaxed">
              💡 <b>Styling Note:</b> {outfit.stylingTip}
            </div>
          </div>

          {/* Editorial Bottom Colophon & Barcode */}
          <div className="relative z-10 border-t border-white/15 pt-3 flex items-end justify-between">
            <div>
              <div className="text-[8px] font-mono text-[#A89582] uppercase tracking-widest">
                CURATED BY LOOK.U STUDIO
              </div>
              <div className="text-[11px] font-bold text-white tracking-wider">
                looku.ai <span className="font-normal text-white/50">| Coba Outfitmu</span>
              </div>
            </div>
            {/* Minimalist Barcode graphic */}
            <div className="font-mono text-[8px] text-white/40 tracking-widest uppercase text-right">
              ||| | |||| | ||| ||
              <div>#ID-{outfit.id.slice(-4)}</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 space-y-2">
          <motion.button
            onClick={handleDownloadImage}
            disabled={downloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 px-5 rounded-2xl bg-white hover:bg-[#F4EFE6] text-[#181A18] font-bold text-xs tracking-wider uppercase shadow-xl flex items-center justify-center gap-2 transition-all"
          >
            {downloading ? (
              <span>Memproses Kartu HD...</span>
            ) : downloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Kartu Tersimpan! Siap Post di Story</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download Lookbook Story (9:16)</span>
              </>
            )}
          </motion.button>

          <p className="text-center text-[10px] font-mono text-[#FAF8F5]/60 uppercase tracking-widest">
            Tinggal post di Instagram Stories / WhatsApp Status
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
