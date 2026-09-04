"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal, Sparkles } from "lucide-react";
import { UserPreferences } from "@/lib/types";
import GeneratorForm from "./GeneratorForm";

interface MobilePreferenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prefs: UserPreferences) => void;
  isLoading: boolean;
  externalPrefs?: Partial<UserPreferences>;
}

export default function MobilePreferenceDrawer({
  isOpen,
  onClose,
  onGenerate,
  isLoading,
  externalPrefs,
}: MobilePreferenceDrawerProps) {
  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleApplyGenerate = (prefs: UserPreferences) => {
    onGenerate(prefs);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
          />

          {/* Slide-Up Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-x-0 bottom-0 z-50 md:hidden bg-[#FAF8F5] rounded-t-[32px] border-t border-[#E8DFD1] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Top Drag Pill & Header */}
            <div className="pt-3 pb-2 px-5 border-b border-[#E8DFD1]/80 bg-[#FAF8F5]/95 backdrop-blur-md sticky top-0 z-10 shrink-0 flex flex-col items-center">
              {/* Drag Handle Bar */}
              <div className="w-12 h-1.5 rounded-full bg-sand-300 mb-2.5" />

              <div className="w-full flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-charcoal-900 text-sand-50 flex items-center justify-center shadow-2xs">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta-400" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#181A18] leading-tight">
                      Sesuaikan OOTD Kamu
                    </h3>
                    <p className="text-[10px] text-sand-500 font-mono uppercase">
                      Acara • Cuaca 33°C • Hijab • Budget
                    </p>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-sand-200/70 hover:bg-sand-300 flex items-center justify-center text-charcoal-900 transition-colors"
                  aria-label="Tutup Pengaturan"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Form Container */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 overscroll-contain">
              <div className="bg-white rounded-2xl p-4 border border-[#E8DFD1] shadow-2xs mb-2">
                <p className="text-xs text-charcoal-900/80 leading-relaxed">
                  💡 <b>Tips AI:</b> Ubah acara atau cuaca untuk mendapatkan racikan bahan katun rayon &amp; linen yang paling adem.
                </p>
              </div>

              <GeneratorForm
                onGenerate={handleApplyGenerate}
                isLoading={isLoading}
                externalPrefs={externalPrefs}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
