"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, X } from "lucide-react";

export default function ResearchBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Tampilkan banner setelah pengguna berada di halaman selama 5 detik
    const timer = setTimeout(() => setIsVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-24 lg:bottom-6 left-4 right-4 lg:left-1/2 lg:-translate-x-1/2 lg:w-max z-[90]"
      >
        <div className="bg-charcoal-900 text-white rounded-2xl p-4 shadow-2xl border border-charcoal-800 flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-terracotta-500/20 flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 text-terracotta-400" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Bantu Uji Sistem! 🎓</h4>
              <p className="text-[10px] text-white/70 mt-0.5 max-w-[200px] leading-tight">
                Setelah mencoba aplikasi, mohon luangkan 2 menit mengisi kuesioner System Usability Scale (SUS).
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href="https://forms.gle/YOUR_SUS_FORM_LINK_HERE" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm whitespace-nowrap"
            >
              Isi Kuesioner
            </a>
            <button 
              onClick={() => setIsVisible(false)}
              className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
