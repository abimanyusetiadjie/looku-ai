"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Scale, ArrowRight, Check, Droplets, Wallet, ShieldCheck } from "lucide-react";
import { OOTDRecommendation } from "@/lib/types";

interface OutfitCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedOutfits: OOTDRecommendation[];
  onSelectOutfitToStudio?: (outfit: OOTDRecommendation) => void;
}

export default function OutfitCompareModal({
  isOpen,
  onClose,
  savedOutfits,
  onSelectOutfitToStudio,
}: OutfitCompareModalProps) {
  const [outfitAId, setOutfitAId] = useState<string>(savedOutfits[0]?.id || "");
  const [outfitBId, setOutfitBId] = useState<string>(savedOutfits[1]?.id || savedOutfits[0]?.id || "");

  if (!isOpen) return null;

  const outfitA = savedOutfits.find((o) => o.id === outfitAId) || savedOutfits[0];
  const outfitB = savedOutfits.find((o) => o.id === outfitBId) || savedOutfits[1] || savedOutfits[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4 bg-charcoal-900/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-transparent"
        />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", damping: 25, stiffness: 280 }}
          className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#D7CABC] overflow-hidden flex flex-col h-[90dvh] sm:h-auto sm:max-h-[90vh] z-10 pb-[env(safe-area-inset-bottom,0px)]"
        >
          {/* Mobile Pull Handle Indicator */}
          <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 bg-[#181A18]">
            <div className="w-10 h-1 rounded-full bg-white/30" />
          </div>

          {/* Header */}
          <div className="p-4 sm:p-6 bg-[#181A18] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-terracotta-500 flex items-center justify-center text-white shrink-0">
                <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base sm:text-xl">
                  ⚖️ Perbandingan Outfit Side-by-Side
                </h3>
                <p className="text-[11px] text-[#D7CABC]">
                  Bandingkan 2 formula OOTD dari lemari untuk menentukan outfit terbaik hari ini
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
            {savedOutfits.length < 2 ? (
              <div className="text-center py-16 space-y-3">
                <p className="text-sm text-sand-500">
                  Kamu butuh minimal 2 formula OOTD di lemari untuk menggunakan fitur perbandingan.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-charcoal-900 text-white font-bold text-xs uppercase tracking-wider"
                >
                  Tutup & Simpan OOTD Baru
                </button>
              </div>
            ) : (
              <>
                {/* Selectors Bar */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-bold text-sand-500">
                      PILIH OUTFIT A:
                    </label>
                    <select
                      value={outfitAId}
                      onChange={(e) => setOutfitAId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-sand-300 rounded-xl text-xs font-bold text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                    >
                      {savedOutfits.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-bold text-sand-500">
                      PILIH OUTFIT B:
                    </label>
                    <select
                      value={outfitBId}
                      onChange={(e) => setOutfitBId(e.target.value)}
                      className="w-full p-2.5 bg-white border border-sand-300 rounded-xl text-xs font-bold text-charcoal-900 focus:outline-none focus:border-terracotta-500"
                    >
                      {savedOutfits.map((o) => (
                        <option key={o.id} value={o.id}>
                          {o.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Side-by-Side Comparison Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
                  {/* Card A */}
                  {outfitA && (
                    <div className="p-5 rounded-3xl bg-white border-2 border-terracotta-500/30 shadow-tactile space-y-4 relative">
                      <span className="absolute top-4 right-4 bg-terracotta-500 text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full">
                        OPTION A
                      </span>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-terracotta-600 font-bold">
                          {outfitA.overallVibe}
                        </span>
                        <h4 className="font-serif font-bold text-lg text-charcoal-900 mt-0.5">
                          {outfitA.title}
                        </h4>
                        <p className="text-xs italic text-sand-500 mt-0.5">&ldquo;{outfitA.tagline}&rdquo;</p>
                      </div>

                      {/* Ratings */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-sand-50 border border-sand-200 text-center">
                        <div>
                          <div className="text-[9px] font-mono text-sand-500 uppercase">Kenyamanan</div>
                          <div className="text-sm font-mono font-bold text-charcoal-900">{outfitA.comfortRating}/10</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-mono text-sand-500 uppercase">Affordability</div>
                          <div className="text-sm font-mono font-bold text-emerald-700">{outfitA.affordabilityRating}/10</div>
                        </div>
                      </div>

                      {/* Color Palette */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-sand-400 uppercase font-bold">Palet Harmoni:</span>
                        <div className="flex gap-1.5">
                          {outfitA.colorPalette?.map((c, i) => (
                            <div
                              key={i}
                              title={c.name}
                              className="w-6 h-6 rounded-full border border-black/15 shadow-2xs"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Item List */}
                      <div className="space-y-1.5 pt-1 border-t border-sand-200">
                        <span className="text-[9px] font-mono text-sand-400 uppercase font-bold">Komposisi Baju:</span>
                        {outfitA.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-xs flex justify-between">
                            <span className="text-charcoal-900 font-medium truncate max-w-[180px]">• {item.name}</span>
                            <span className="font-mono text-sand-500 text-[10px]">{item.estimatedPrice}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (onSelectOutfitToStudio) onSelectOutfitToStudio(outfitA);
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pilih & Pakai Look A</span>
                      </button>
                    </div>
                  )}

                  {/* Card B */}
                  {outfitB && (
                    <div className="p-5 rounded-3xl bg-white border border-sand-300 shadow-tactile space-y-4 relative">
                      <span className="absolute top-4 right-4 bg-sand-200 text-charcoal-900 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border border-sand-300">
                        OPTION B
                      </span>

                      <div>
                        <span className="text-[10px] font-mono uppercase text-terracotta-600 font-bold">
                          {outfitB.overallVibe}
                        </span>
                        <h4 className="font-serif font-bold text-lg text-charcoal-900 mt-0.5">
                          {outfitB.title}
                        </h4>
                        <p className="text-xs italic text-sand-500 mt-0.5">&ldquo;{outfitB.tagline}&rdquo;</p>
                      </div>

                      {/* Ratings */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-sand-50 border border-sand-200 text-center">
                        <div>
                          <div className="text-[9px] font-mono text-sand-500 uppercase">Kenyamanan</div>
                          <div className="text-sm font-mono font-bold text-charcoal-900">{outfitB.comfortRating}/10</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-mono text-sand-500 uppercase">Affordability</div>
                          <div className="text-sm font-mono font-bold text-emerald-700">{outfitB.affordabilityRating}/10</div>
                        </div>
                      </div>

                      {/* Color Palette */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono text-sand-400 uppercase font-bold">Palet Harmoni:</span>
                        <div className="flex gap-1.5">
                          {outfitB.colorPalette?.map((c, i) => (
                            <div
                              key={i}
                              title={c.name}
                              className="w-6 h-6 rounded-full border border-black/15 shadow-2xs"
                              style={{ backgroundColor: c.hex }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Item List */}
                      <div className="space-y-1.5 pt-1 border-t border-sand-200">
                        <span className="text-[9px] font-mono text-sand-400 uppercase font-bold">Komposisi Baju:</span>
                        {outfitB.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-xs flex justify-between">
                            <span className="text-charcoal-900 font-medium truncate max-w-[180px]">• {item.name}</span>
                            <span className="font-mono text-sand-500 text-[10px]">{item.estimatedPrice}</span>
                          </div>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          if (onSelectOutfitToStudio) onSelectOutfitToStudio(outfitB);
                          onClose();
                        }}
                        className="w-full py-2.5 rounded-xl bg-sand-100 hover:bg-charcoal-900 hover:text-white text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 border border-sand-300 shadow-2xs"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Pilih & Pakai Look B</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* AI Stylist Verdict Callout */}
                <div className="p-4 rounded-2xl bg-sand-100 border border-sand-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-charcoal-900 font-serif">
                    <Sparkles className="w-3.5 h-3.5 text-terracotta-500" />
                    <span>Panduan Cepat Stylist:</span>
                  </div>
                  <p className="text-sand-500 leading-relaxed">
                    Pilih <b>{outfitA?.title}</b> jika agenda harianmu lebih banyak beraktivitas di luar ruangan / santai. Pilih <b>{outfitB?.title}</b> jika kamu butuh sentuhan siluet yang lebih rapi atau meeting indoor.
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
