"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if dismissed previously
    if (typeof window !== "undefined") {
      const isDismissed = localStorage.getItem("looku_pwa_banner_dismissed");
      if (isDismissed) return;

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        // Show banner after 3 seconds of browsing
        setTimeout(() => {
          setShowBanner(true);
        }, 3000);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instructions for iOS / browsers without beforeinstallprompt
      alert("Untuk memasang look.u di iPhone/iPad: Tekan ikon 'Share' di browser Safari, lalu pilih 'Add to Home Screen'.");
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_pwa_banner_dismissed", "true");
    }
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 30 }}
          className="fixed bottom-20 md:bottom-6 left-4 right-16 md:left-auto md:right-6 md:max-w-md z-40 p-3 bg-[#181A18]/95 text-white backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl flex items-center justify-between gap-2.5"
        >
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-terracotta-500 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Smartphone className="w-4 h-4" />
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white font-serif tracking-tight truncate">
                Pasang look.u di HP
              </div>
              <div className="text-[10px] font-mono text-sand-300 truncate">
                Akses OOTD harian 1-klik tanpa browser
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="py-1.5 px-3 rounded-xl bg-white text-[#181A18] font-bold text-[11px] uppercase tracking-wider hover:bg-sand-100 transition-colors shadow-xs"
            >
              Pasang
            </button>
            <button
              onClick={handleDismiss}
              className="p-1 text-white/50 hover:text-white rounded-lg transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
