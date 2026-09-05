"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Sparkles, History, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GeneratorForm from "@/components/GeneratorForm";
import OutfitCard from "@/components/OutfitCard";
import BottomNav from "@/components/BottomNav";
import Toast, { ToastMessage } from "@/components/Toast";
import { UserPreferences, OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION } from "@/lib/presets";

// Dynamic Code-Splitting for Heavy Modals & Offscreen Widgets
const SavedLooksDrawer = dynamic(() => import("@/components/SavedLooksDrawer"), { ssr: false });
const StoryShareModal = dynamic(() => import("@/components/StoryShareModal"), { ssr: false });
const PersonalColorQuizModal = dynamic(() => import("@/components/PersonalColorQuizModal"), { ssr: false });
const TomorrowOOTDWidget = dynamic(() => import("@/components/TomorrowOOTDWidget"), { ssr: false });
const GenerationHistoryModal = dynamic(() => import("@/components/GenerationHistoryModal"), { ssr: false });
const PWAInstallBanner = dynamic(() => import("@/components/PWAInstallBanner"), { ssr: false });
const MobilePreferenceDrawer = dynamic(() => import("@/components/MobilePreferenceDrawer"), { ssr: false });
const WeeklyOutfitCalendar = dynamic(() => import("@/components/WeeklyOutfitCalendar"), { ssr: false });

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
          <span>Memilih bahan katun &amp; linen anti-gerah</span>
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
  const [isMobilePrefDrawerOpen, setIsMobilePrefDrawerOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [lastPrefs, setLastPrefs] = useState<UserPreferences | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [externalPrefs, setExternalPrefs] = useState<Partial<UserPreferences>>({});

  // Deep-Link URL query handler on initial mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const lookId = params.get("look");
      if (lookId && PRESET_OOTD_COLLECTION[lookId]) {
        setCurrentOutfit(PRESET_OOTD_COLLECTION[lookId]);
      }
    }
  }, []);

  // Saved Looks Drawer & Story Modal State
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [storyOutfitToExport, setStoryOutfitToExport] = useState<OOTDRecommendation | null>(null);

  // Listen for Chatbot / Widget load to studio events
  React.useEffect(() => {
    const handleLoadToStudio = (e: Event) => {
      const customEvent = e as CustomEvent<OOTDRecommendation>;
      if (customEvent.detail) {
        setCurrentOutfit(customEvent.detail);
        addToast({
          title: "Outfit Dimuat ke Studio OOTD!",
          description: customEvent.detail.title,
          type: "curate",
        });
      }
    };

    window.addEventListener("looku_load_outfit_to_studio", handleLoadToStudio);
    return () => {
      window.removeEventListener("looku_load_outfit_to_studio", handleLoadToStudio);
    };
  }, []);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const handleApplyQuizResult = (skinToneId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_personal_color", skinToneId);
    }
    const toneType: any = skinToneId === "fair" ? "fair" : skinToneId === "light" ? "light" : skinToneId === "tan" ? "tan" : skinToneId === "deep" ? "deep" : "medium";
    setExternalPrefs(prev => ({ ...prev, skinTone: toneType }));

    const toneNames: Record<string, string> = {
      fair: "Putih Gading (Light Spring)",
      light: "Kuning Langsat (Warm Spring)",
      medium: "Sawo Matang (Warm Autumn)",
      tan: "Tan Eksotis (Deep Autumn)",
      deep: "Deep Bronze (Deep Winter)",
    };
    const label = toneNames[skinToneId] || skinToneId;

    addToast({
      title: "Personal Color Diterapkan",
      description: `Disesuaikan dengan undertone ${label}`,
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
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-32 md:pb-0">
      {/* Studio Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E8DFD1] pt-[max(0px,env(safe-area-inset-top))]">
        <div className="max-w-md md:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
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
      <main className="flex-1 max-w-md md:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        {/* Sleek Minimal Desktop Header (Hidden on Mobile) */}
        <div className="hidden sm:flex items-center justify-between gap-4 pb-4 mb-6 border-b border-sand-200">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-2 rounded-xl bg-white border border-sand-300 text-charcoal-900 hover:bg-sand-100 transition-colors flex items-center justify-center shadow-2xs"
              title="Kembali ke Beranda"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-sand-500">
                AI STYLIST ATELIER
              </span>
              <h1 className="font-serif text-2xl font-bold text-charcoal-900 tracking-tight">
                Studio Padu Padan
              </h1>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-sand-500 uppercase bg-sand-100 px-3 py-1 rounded-full border border-sand-200">
            PERSONAL COLOR &amp; TROPICAL FIT
          </span>
        </div>

        {/* Mobile Quick Preference Bar (Prominent & Clean Directly Above Result) */}
        <div className="block lg:hidden mb-3">
          <div className="p-2.5 bg-white rounded-2xl border border-sand-300 shadow-2xs flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-sand-100 text-charcoal-900 font-bold whitespace-nowrap text-[10px]">
                {lastPrefs?.occasion ? `☕ ${lastPrefs.occasion.toUpperCase()}` : "☕ HANGOUT"}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-bold whitespace-nowrap text-[10px]">
                ☀️ 33°C ADEM
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold whitespace-nowrap text-[10px]">
                {lastPrefs?.isModestHijab !== false ? "🧕 MODEST" : "✨ UNISEX"}
              </span>
            </div>
            <button
              onClick={() => setIsMobilePrefDrawerOpen(true)}
              className="shrink-0 py-1.5 px-3 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Sesuaikan</span>
            </button>
          </div>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form (Desktop only, opened via bottom sheet on mobile) */}
          <div className="hidden lg:block lg:col-span-5 w-full space-y-6">
            <TomorrowOOTDWidget onScheduleTomorrow={handleScheduleTomorrow} />
            <GeneratorForm
              onGenerate={handleGenerate}
              isLoading={isLoading}
              externalPrefs={externalPrefs}
            />
          </div>

          {/* Right Outfit Card (Full width on mobile) */}
          <div className="lg:col-span-7 w-full">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <MultiStageLoader key="loader" />
              ) : (
                <OutfitCard
                  key={currentOutfit.id}
                  outfit={currentOutfit}
                  onRegenerate={handleRegenerate}
                  onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
                  onOutfitChange={(updated) => {
                    setCurrentOutfit(updated);
                    addToast({
                      title: "Outfit Diperbarui",
                      description: "Item alternatif telah disinkronkan ke Studio OOTD.",
                      type: "curate",
                    });
                  }}
                />
              )}
            </AnimatePresence>

            {/* Mobile Trigger Button to Open Drawer Form */}
            <div className="block lg:hidden mt-4">
              <button
                onClick={() => setIsMobilePrefDrawerOpen(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-2xs transition-all"
              >
                <SlidersHorizontal className="w-4 h-4 text-terracotta-500" />
                <span>Kustomisasi Detail Acara, Cuaca & Budget ➔</span>
              </button>
            </div>

            {/* Mobile Tomorrow OOTD Widget Placed Below Result */}
            <div className="block lg:hidden mt-6">
              <TomorrowOOTDWidget onScheduleTomorrow={handleScheduleTomorrow} />
            </div>
          </div>
        </div>

        {/* Weekly Outfit Calendar (7-Day Planner Accordion) */}
        <div className="hidden md:block mt-8 pt-6 border-t border-sand-200">
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-sand-50 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-2xs transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="text-base">📅</span>
              <span>Jadwal OOTD 7 Hari (Weekly Planner)</span>
            </div>
            <span className="text-[11px] text-terracotta-600 font-bold">
              {isCalendarOpen ? "Sembunyikan ▲" : "Buka Jadwal ▼"}
            </span>
          </button>

          {isCalendarOpen && (
            <div className="mt-4">
              <WeeklyOutfitCalendar
                currentOutfit={currentOutfit}
                onSelectDayOutfit={(outfit) => setCurrentOutfit(outfit)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Floating Mobile App-Shell Navigation */}
      <BottomNav onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} />

      {/* Saved Looks Drawer (Loaded on Demand) */}
      {isSavedDrawerOpen && (
        <SavedLooksDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          onSelectOutfit={(outfit) => setCurrentOutfit(outfit)}
          onExportStory={(outfit) => setStoryOutfitToExport(outfit)}
        />
      )}

      {/* Story Share Modal for Drawer */}
      {storyOutfitToExport && (
        <StoryShareModal
          outfit={storyOutfitToExport}
          onClose={() => setStoryOutfitToExport(null)}
        />
      )}

      {/* Personal Color Quiz Modal (Loaded on Demand) */}
      {isQuizOpen && (
        <PersonalColorQuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          onApplyResult={handleApplyQuizResult}
        />
      )}

      {/* Generation History Modal (Loaded on Demand) */}
      {isHistoryOpen && (
        <GenerationHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectOutfit={(outfit) => setCurrentOutfit(outfit)}
        />
      )}

      {/* Mobile-First Slide-Up Preference Drawer */}
      <MobilePreferenceDrawer
        isOpen={isMobilePrefDrawerOpen}
        onClose={() => setIsMobilePrefDrawerOpen(false)}
        onGenerate={handleGenerate}
        isLoading={isLoading}
        externalPrefs={externalPrefs}
      />

      {/* Smart Mobile PWA Install Banner */}
      <PWAInstallBanner />

      {/* Toasts */}
      <Toast toasts={toasts} onDismiss={(id) => setToasts(t => t.filter(x => x.id !== id))} />
    </div>
  );
}
