"use client";

import React from "react";
import Image from "next/image";
import { X, ArrowUpRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingLook, OOTDRecommendation } from "@/lib/types";

interface ImageLightboxModalProps {
  look: TrendingLook;
  onClose: () => void;
  onTryLook: (outfit: OOTDRecommendation) => void;
}

export default function ImageLightboxModal({
  look,
  onClose,
  onTryLook,
}: ImageLightboxModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#181A18]/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative max-w-4xl w-full bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-[#D7CABC] grid grid-cols-1 md:grid-cols-12 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#181A18]/70 hover:bg-[#181A18] text-white transition-all shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: High-Res Editorial Visual (7 cols) */}
        <div className="md:col-span-7 relative aspect-[4/5] md:aspect-auto min-h-[380px] md:min-h-[520px] bg-[#E8DFD1]">
          <Image
            src={look.image}
            alt={look.title}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover"
            priority
          />
          <div className="absolute bottom-4 left-4">
            <span className="px-3 py-1 rounded-full bg-[#181A18]/85 text-white text-[10px] font-mono tracking-widest uppercase backdrop-blur-md">
              {look.tag} • {look.category}
            </span>
          </div>
        </div>

        {/* Right: Curated Spec & Action (5 cols) */}
        <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-white">
          <div className="space-y-4">
            <div>
              <span className="lookbook-label">EDITORIAL SPECIMEN</span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#181A18] tracking-tight mt-1">
                {look.title}
              </h3>
              <p className="text-xs text-[#A89582] font-mono mt-0.5 uppercase tracking-wider">
                Vibe: {look.vibe}
              </p>
            </div>

            {/* Tone Match Detail */}
            <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD1] space-y-1.5">
              <div className="text-[9px] font-mono uppercase tracking-wider text-[#A89582] font-bold">
                PERSONAL COLOR HARMONY
              </div>
              <p className="text-xs text-[#181A18] font-medium leading-relaxed">
                Paling flattering untuk warna kulit <b>{look.skinToneRecommendation}</b>.
              </p>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#A89582] font-bold">
                CURATED ITEMS BREAKDOWN:
              </div>
              <div className="space-y-1.5">
                {look.outfit.items.slice(0, 4).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1 border-b border-[#E8DFD1]/60"
                  >
                    <span className="text-[#181A18] font-medium truncate pr-2">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-mono text-terracotta-600 shrink-0 font-bold">
                      {item.estimatedPrice}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="font-mono text-[#A89582] uppercase">ESTIMASI TOTAL:</span>
              <span className="font-mono font-bold text-[#181A18] bg-[#F4EFE6] px-2.5 py-1 rounded-md border border-[#E8DFD1]">
                {look.priceRange}
              </span>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-[#E8DFD1] space-y-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onTryLook(look.outfit);
                onClose();
                if (typeof window !== "undefined") {
                  document.getElementById("studio")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#181A18] hover:bg-terracotta-500 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>TRY THIS LOOK DI STUDIO</span>
              <ArrowUpRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
