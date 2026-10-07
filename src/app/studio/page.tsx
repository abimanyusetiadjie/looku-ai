"use client";
import Navbar from "@/components/Navbar";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, Sparkles, History, SlidersHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GeneratorForm from "@/components/GeneratorForm";
import OutfitCard from "@/components/OutfitCard";

import Toast, { ToastMessage } from "@/components/Toast";
import { UserPreferences, OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION, generateHeuristicOOTD } from "@/lib/presets";

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
        <div className="flex items-center gap-3 text-xs font-semibold text-[#181A18] bg-[#FAF8F5] p-3 rounded-sm border border-[#E8DFD1]">
          <span className="w-5 h-5 rounded-full bg-terracotta-500 text-white flex items-center justify-center text-[10px] font-mono">1</span>
          <span>Analisis personal color & undertone kulit</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-[#181A18] bg-[#FAF8F5] p-3 rounded-sm border border-[#E8DFD1] animate-pulse">
          <span className="w-5 h-5 rounded-full bg-[#D7CABC] text-[#181A18] flex items-center justify-center text-[10px] font-mono">2</span>
          <span>Memilih bahan katun &amp; linen anti-gerah</span>
        </div>
        <div className="flex items-center gap-3 text-xs font-semibold text-[#181A18]/60 bg-[#FAF8F5]/50 p-3 rounded-sm border border-[#E8DFD1]">
          <span className="w-5 h-5 rounded-full bg-[#E8DFD1] text-[#A89582] flex items-center justify-center text-[10px] font-mono">3</span>
          <span>Kurasi toko terpercaya di marketplace</span>
        </div>
      </div>

      <div className="w-full max-w-sm pt-2">
        <div className="space-y-2">
          <div className="h-4 bg-[#E8DFD1] rounded animate-pulse w-3/4 mx-auto" />
          <div className="h-4 bg-[#E8DFD1] rounded animate-pulse w-1/2 mx-auto" />
          <div className="h-32 bg-[#E8DFD1] rounded-sm animate-pulse w-full mt-4" />
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
      description: " Disimpan ke Lemari & Dijadwalkan di Kalender Mingguan",
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
      } else {
        // Fallback jika API mengembalikan respons non-ok
        const fallback = generateHeuristicOOTD(prefs);
        setCurrentOutfit(fallback);
        addToast({
          title: "Kurasi Presisi Siap",
          description: "Menggunakan kurasi formula presisi atelier.",
          type: "curate",
        });
      }
    } catch (err) {
      console.error("Studio generate error:", err);
      // Fallback ramah pengguna saat koneksi lambat/offline
      const fallback = generateHeuristicOOTD(prefs);
      setCurrentOutfit(fallback);
      addToast({
        title: "Koneksi Offline / Timeout",
        description: "Beralih ke kurasi formula cerdas atelier.",
        type: "curate",
      });
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
      <Navbar 
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
      />

      {/* Main Studio Container */}
      <main className="flex-1 max-w-md md:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        {/* Top Header Bar Minimalist Beige */}
        <div className="w-full text-center pb-8 pt-4">
           <p className="text-[9px] font-mono tracking-[0.25em] font-bold uppercase text-charcoal-900 mb-4">
             DESIGN • LOOK.U LUXURY AI STYLIST STUDIO
           </p>
           <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal-900 tracking-tight">
             Look.u
           </h1>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-[#F4EFE6] p-4 sm:p-8 rounded-2xl">
          {/* Left Panel: Chat + Recommendations */}
          <div className="w-full flex flex-col gap-6">
            <GeneratorForm
              onGenerate={handleGenerate}
              isLoading={isLoading}
              externalPrefs={externalPrefs}
            />
            {currentOutfit && !isLoading && (
              <div className="w-full">
                <div className="text-center mb-4">
                  <span className="text-[10px] font-mono tracking-widest font-bold text-charcoal-900 uppercase">
                    REKOMENDASI PRODUK • {currentOutfit.items.length} ITEM
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {currentOutfit.items.slice(0,2).map((item: any, idx: number) => (
                    <div key={idx} className="bg-white border border-charcoal-900 rounded-xl overflow-hidden p-4 flex flex-col items-center">
                      <img src={item.imageUrl || "https://images.unsplash.com/photo-1620799140408-35632e1ea25c?w=400&q=80"} alt={item.name} className="w-full aspect-square object-cover rounded-md mb-4" />
                      <h3 className="font-serif text-sm font-bold text-charcoal-900 text-center uppercase leading-tight mb-1">{item.name}</h3>
                      <p className="font-sans text-[9px] text-charcoal-900/60 mb-4 text-center">{item.material} • {item.breathability}</p>
                      <button className="w-full py-2 border border-charcoal-900 rounded-full text-[9px] font-bold uppercase tracking-widest text-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-colors">
                        ADD TO WARDROBE +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Curated Look Preview */}
          <div className="w-full bg-[#F4EFE6] border border-charcoal-900 rounded-xl p-6 lg:p-10 flex flex-col items-center">
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono tracking-widest font-bold text-charcoal-900 uppercase">
                CURATED LOOK PREVIEW
              </span>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <MultiStageLoader key="loader" />
              ) : currentOutfit ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={currentOutfit.id} 
                  className="w-full flex flex-col items-center"
                >
                  <img 
                    src={currentOutfit.flatlayImages?.[0] || "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800&q=80"} 
                    alt="Curated Preview" 
                    className="w-full max-w-sm aspect-[3/4] object-cover border border-charcoal-900 rounded-sm mb-8 shadow-sm" 
                  />
                  
                  <span className="text-[10px] font-mono tracking-widest text-charcoal-900 uppercase font-bold mb-2">LOOK:</span>
                  <h2 className="font-serif text-2xl lg:text-3xl font-medium text-charcoal-900 italic text-center mb-6 leading-tight">
                    {currentOutfit.title}
                  </h2>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    <span className="px-3 py-1.5 border border-charcoal-900 rounded-full text-[9px] font-bold uppercase tracking-widest">BREATHABLE</span>
                    <span className="px-3 py-1.5 border border-charcoal-900 rounded-full text-[9px] font-bold uppercase tracking-widest">COOL</span>
                    <span className="px-3 py-1.5 border border-charcoal-900 rounded-full text-[9px] font-bold uppercase tracking-widest">EFFORTLESS</span>
                  </div>

                  <button className="w-full max-w-sm py-4 bg-charcoal-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-xl">
                    SAVE TO LOOKBOOK
                  </button>
                  <div className="mt-8 text-center text-[9px] font-mono uppercase tracking-[0.2em] text-charcoal-900/50">
                    CURATED LOOK PREVIEW
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  <p className="font-serif italic text-charcoal-900/50 text-xl text-center">Menunggu respons Anda di panel chat...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Weekly Outfit Calendar (7-Day Planner Accordion) */}
        <div className="hidden md:block mt-8 pt-6 border-t border-sand-200">
          <button
            type="button"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="w-full py-3.5 px-4 rounded-sm bg-white hover:bg-sand-50 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between shadow-2xs transition-all"
          >
            <div className="flex items-center gap-2">
              <span className="text-base"></span>
              <span>WEEKLY PLANNER</span>
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


