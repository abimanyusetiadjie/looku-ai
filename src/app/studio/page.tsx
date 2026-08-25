"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GeneratorForm from "@/components/GeneratorForm";
import OutfitCard from "@/components/OutfitCard";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import SavedLooksDrawer from "@/components/SavedLooksDrawer";
import StoryShareModal from "@/components/StoryShareModal";
import PersonalColorQuizModal from "@/components/PersonalColorQuizModal";
import TomorrowOOTDWidget from "@/components/TomorrowOOTDWidget";
import GenerationHistoryModal from "@/components/GenerationHistoryModal";
import Toast, { ToastMessage } from "@/components/Toast";
import { UserPreferences, OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION } from "@/lib/presets";

function MultiStageLoader() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="tactile-card p-8 sm:p-12 text-center min-h-[500px] flex flex-col items-center justify-center space-y-6 bg-white rounded-3xl border border-[#E8DFD1]"
    >
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-2 border-[#D7CABC] border-t-terracotta-500 animate-spin" />
        <Sparkles className="w-6 h-6 text-terracotta-500 absolute inset-0 m-auto animate-pulse" />
      </div>

      <div className="space-y-2">
        <div className="lookbook-label">AI CURATION IN PROGRESS</div>
        <h3 className="font-serif text-2xl font-bold text-[#181A18]">
          Mengkurasi Formula OOTD Terbaik...
        </h3>
        <p className="text-xs text-[#181A18]/60 font-mono">
          Menganalisis personal color, sirkulasi bahan tropis, dan budget lokal
        </p>
      </div>

      <div className="w-full max-w-sm space-y-3 pt-4">
        <div className="flex items-center gap-3 text-xs font-semibold text-[#181A18] bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DFD1]">
          <span className="w-5 h-5 rounded-full bg-terracotta-500 text-white flex items-center justify-center text-[10px] font-mono">1</span>
          <span>Analisis personal color & undertone kulit</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-[#181A18] bg-[#FAF8F5] p-3 rounded-xl border border-[#E8DFD1] animate-pulse">
          <span className="w-5 h-5 rounded-full bg-[#D7CABC] text-[#181A18] flex items-center justify-center text-[10px] font-mono">2</span>
          <span>Pencocokan bahan adem & sirkulasi udara</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-[#181A18]/60 bg-[#FAF8F5]/50 p-3 rounded-xl border border-[#E8DFD1]">
          <span className="w-5 h-5 rounded-full bg-[#E8DFD1] text-[#A89582] flex items-center justify-center text-[10px] font-mono">3</span>
          <span>Kurasi toko terpercaya di marketplace</span>
        </div>
      </div>

      <div className="w-full max-w-sm pt-2">
        <div className="space-y-2">
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
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [lastPrefs, setLastPrefs] = useState<UserPreferences | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Saved Looks Drawer & Story Modal State
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [storyOutfitToExport, setStoryOutfitToExport] = useState<OOTDRecommendation | null>(null);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const handleApplyQuizResult = (skinToneId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_personal_color", skinToneId);
    }
    const toneNames: Record<string, string> = {
      fair_porcelain: "Putih Gading (Light Spring)",
      light_medium: "Kuning Langsat (Warm Spring)",
      sawo_matang: "Sawo Matang (Warm Autumn)",
      tan_exotic: "Tan Eksotis (Deep Autumn)",
      dark_ebony: "Gelap Manis (Deep Winter)",
    };
    const label = toneNames[skinToneId] || skinToneId;

    addToast({
      title: "Personal Color Diterapkan",
      description: `✨ Disesuaikan dengan undertone ${label}`,
      type: "success",
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleScheduleTomorrow = (outfit: any) => {
    const outfitToSave = outfit && outfit.title ? outfit : {
      ...currentOutfit,
      id: `tomorrow-${Date.now()}`,
      title: `✦ OOTD Besok Pagi: ${currentOutfit.title}`,
      overallVibe: "Ready for Tomorrow",
    };

    if (typeof window !== "undefined") {
      try {
        const saved = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
        if (!saved.some((item: any) => item.id === outfitToSave.id)) {
          localStorage.setItem("looku_saved_outfits", JSON.stringify([outfitToSave, ...saved]));
          window.dispatchEvent(new Event("looku_saved_updated"));
        }

        const days = ["minggu", "senin", "selasa", "rabu", "kamis", "jumat", "sabtu"];
        const tomorrowIdx = (new Date().getDay() + 1) % 7;
        const tomorrowDayId = days[tomorrowIdx];
        const cal = JSON.parse(localStorage.getItem("looku_weekly_calendar") || "{}");
        cal[tomorrowDayId] = outfitToSave;
        localStorage.setItem("looku_weekly_calendar", JSON.stringify(cal));
      } catch (e) {
        console.error("Error scheduling tomorrow outfit:", e);
      }
    }

    addToast({
      title: "OOTD Besok Pagi Terkunci!",
      description: "✨ Disimpan ke Lemari & Dijadwalkan di Kalender Mingguan",
      type: "save",
    });
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

        // Auto save to Generation History
        if (typeof window !== "undefined") {
          try {
            const history = JSON.parse(localStorage.getItem("looku_generation_history") || "[]");
            const newHistory = [
              {
                id: `gen-${Date.now()}`,
                timestamp: new Date().toISOString(),
                outfit: json.data,
              },
              ...history.slice(0, 29),
            ];
            localStorage.setItem("looku_generation_history", JSON.stringify(newHistory));
          } catch (e) {
            console.error("Error saving history:", e);
          }
        }

        addToast({ title: "Kurasi Berhasil", description: "Outfit siap untuk kamu!", type: "success" });
      }
    } catch (err) {
      console.error("Studio generate error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = (feedbackHint?: string) => {
    if (lastPrefs) {
      const updated = { ...lastPrefs };
      if (feedbackHint) {
        updated.customNotes = `${updated.customNotes || ""} (Arahan: ${feedbackHint})`.trim();
      }
      handleGenerate(updated);
    } else {
      handleGenerate({
        stylingMode: "solo",
        gender: "female",
        skinTone: "medium",
        ageRange: "20s",
        occasion: "hangout",
        isModestHijab: true,
        weather: "panas_terik",
        budget: "hemat",
        vibe: "earthy_minimalist",
        customNotes: feedbackHint ? `Arahan: ${feedbackHint}` : undefined,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-28 md:pb-0">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif italic font-bold text-2xl text-[#181A18] flex items-baseline">
            look<span className="text-terracotta-500 not-italic">.</span>u
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="py-2 px-3 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-2xs"
            >
              <History className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Riwayat</span>
            </button>

            <button
              onClick={() => setIsSavedDrawerOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-charcoal-900 text-white font-bold text-xs uppercase tracking-wider shadow-sm"
            >
              Lemari Koleksi
            </button>
          </div>
        </div>
      </header>

      {/* Main Studio Container */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
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
            <TomorrowOOTDWidget onScheduleTomorrow={handleScheduleTomorrow} />
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
                ✨ Formula OOTD Kamu Hari Ini Telah Disesuaikan Berdasarkan Cuaca & Smart Defaults <span className="font-bold">(GPS Synced Climate 33°C, Earthy Minimalist, Sawo Matang Tone)</span>. Klik &apos;Sesuaikan&apos; di form jika ingin mengubah acara/budget.
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

      {/* Personal Color Quiz Modal */}
      <PersonalColorQuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        onApplyResult={handleApplyQuizResult}
      />

      {/* Generation History Modal */}
      <GenerationHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectOutfit={(outfit) => setCurrentOutfit(outfit)}
      />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}
