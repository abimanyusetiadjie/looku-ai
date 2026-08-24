"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import GeneratorForm from "@/components/GeneratorForm";
import OutfitCard from "@/components/OutfitCard";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import SavedLooksDrawer from "@/components/SavedLooksDrawer";
import StoryShareModal from "@/components/StoryShareModal";
import Toast, { ToastMessage } from "@/components/Toast";
import { UserPreferences, OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION } from "@/lib/presets";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function MultiStageLoader() {
  const [activeLoaderStep, setActiveLoaderStep] = useState(0);
  const stages = [
    "🟢 1. Menganalisis undertone warna kulit & profil...",
    "🟢 2. Menyeleksi sirkulasi bahan katun rayon & linen adem...",
    "🟢 3. Mengkurasi toko bintang 4.8+ di Shopee & Tokopedia..."
  ];
  
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLoaderStep((prev) => (prev < 2 ? prev + 1 : prev));
    }, 650);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      key="loading-studio"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full tactile-card p-8 sm:p-14 flex flex-col items-center justify-center text-center min-h-[500px]"
    >
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 rounded-full border-2 border-[#D7CABC] border-t-terracotta-500"
          />
        </div>
        
        <div className="space-y-4 mb-8 text-left">
          {stages.map((text, idx) => {
            const isActive = idx === activeLoaderStep;
            const isPast = idx < activeLoaderStep;
            return (
              <div key={idx} className={`flex items-center gap-3 transition-all duration-500 ${idx <= activeLoaderStep ? 'opacity-100' : 'opacity-30'} ${isActive ? 'border border-terracotta-500 bg-[#F4EFE6] p-3 rounded-xl' : 'p-3'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${isPast ? 'bg-emerald-500 text-white' : isActive ? 'bg-terracotta-500 text-white animate-pulse shadow-[0_0_8px_rgba(235,97,52,0.6)]' : 'bg-[#E8DFD1] text-transparent'}`}>
                  {isPast ? <Check className="w-3 h-3" /> : idx + 1}
                </div>
                <span className={`text-xs font-bold font-mono tracking-wide ${idx <= activeLoaderStep ? 'text-[#181A18]' : 'text-[#A89582]'}`}>
                  {text}
                </span>
              </div>
            );
          })}
        </div>

        <div className="space-y-3 opacity-50">
          <div className="h-4 bg-[#E8DFD1] rounded animate-pulse w-3/4 mx-auto" />
          <div className="h-4 bg-[#E8DFD1] rounded animate-pulse w-1/2 mx-auto" />
          <div className="h-32 bg-[#E8DFD1] rounded-xl animate-pulse w-full mt-4" />
        </div>
      </div>
    </motion.div>
  );
}

export default function StudioPage() {
  const [currentOutfit, setCurrentOutfit] = useState<OOTDRecommendation>(
    PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastPrefs, setLastPrefs] = useState<UserPreferences | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Saved Looks Drawer & Story Modal State
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [storyOutfitToExport, setStoryOutfitToExport] = useState<OOTDRecommendation | null>(null);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const handleGenerate = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setLastPrefs(prefs);
    addToast({ title: "Memulai Kurasi", description: "Mencari kombinasi outfit terbaik...", type: "curate" });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setCurrentOutfit(json.data);
        addToast({ title: "Kurasi Berhasil", description: "Outfit siap untuk kamu!", type: "success" });
      }
    } catch (err) {
      console.error("Studio generate error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    if (lastPrefs) {
      handleGenerate(lastPrefs);
    }
  };

  // Setup listener for storage events to detect saving
  useEffect(() => {
    let lastSavedItems = 0;
    try {
      lastSavedItems = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]").length;
    } catch (e) {}

    const handleStorageCheck = () => {
      try {
        const currentItems = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]").length;
        if (currentItems > lastSavedItems) {
          addToast({ title: "Tersimpan di Lemari", description: "Outfit berhasil disimpan", type: "save" });
        }
        lastSavedItems = currentItems;
      } catch (e) {}
    };

    // Poll localstorage or listen to custom events if needed, but simplest is listening to click intercept or click bubbling
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button[title="Simpan ke Lemari"]')) {
         setTimeout(handleStorageCheck, 50);
      }
    };
    
    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-16 md:pb-0">
      <Navbar onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8DFD1] pb-6 mb-8"
        >
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/"
                className="p-2.5 rounded-xl bg-white border border-[#D7CABC] text-[#181A18] hover:bg-[#F4EFE6] transition-colors flex items-center justify-center shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </motion.div>
            <div>
              <span className="lookbook-label">STUDIO LOOK.U</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#181A18] tracking-tight">
                Konsultasi Stylist Pribadi
              </h1>
            </div>
          </div>

          <span className="text-[10px] font-mono font-bold tracking-widest text-[#A89582] uppercase bg-[#F4EFE6] px-3 py-1.5 rounded-full border border-[#E8DFD1]">
            EDISI 2026 • PERSONAL COLOR & TROPICAL SPEC
          </span>
        </motion.div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form */}
          <div className="lg:col-span-5 w-full">
            <GeneratorForm
              onGenerate={handleGenerate}
              isLoading={isLoading}
            />
          </div>

          {/* Right Outfit Card */}
          <div className="lg:col-span-7 w-full">
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-terracotta-50 to-[#FAF8F5] border border-terracotta-200 shadow-sm flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
              <p className="text-sm text-[#181A18] font-medium leading-relaxed">
                ✨ Formula OOTD Kamu Hari Ini Telah Disesuaikan Berdasarkan Cuaca & Smart Defaults <span className="font-bold">(GPS Synced Climate 33°C, Earthy Minimalist, Sawo Matang Tone)</span>. Klik 'Sesuaikan' di form jika ingin mengubah acara/budget.
              </p>
            </div>
            <AnimatePresence mode="wait">
              {isLoading ? (
                <MultiStageLoader key="loader" />
              ) : (
                <OutfitCard
                  key={currentOutfit.id}
                  outfit={currentOutfit}
                  onRegenerate={handleRegenerate}
                  onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating Mobile App-Shell Navigation */}
      <BottomNav onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} />

      {/* Saved Looks Drawer */}
      <SavedLooksDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        onSelectOutfit={(outfit) => setCurrentOutfit(outfit)}
        onExportStory={(outfit) => setStoryOutfitToExport(outfit)}
      />

      {/* Story Share Modal for Drawer */}
      {storyOutfitToExport && (
        <StoryShareModal
          outfit={storyOutfitToExport}
          onClose={() => setStoryOutfitToExport(null)}
        />
      )}

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}
