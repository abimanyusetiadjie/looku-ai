"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingFeed from "@/components/TrendingFeed";
import GeneratorForm from "@/components/GeneratorForm";
import OutfitCard from "@/components/OutfitCard";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { UserPreferences, OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION, TRENDING_LOOKS_FEED } from "@/lib/presets";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, History, SlidersHorizontal } from "lucide-react";
import Toast, { ToastMessage } from "@/components/Toast";

// Dynamic Code-Splitting for Heavy Modals & Offscreen Widgets
const SavedLooksDrawer = dynamic(() => import("@/components/SavedLooksDrawer"), { ssr: false });
const StoryShareModal = dynamic(() => import("@/components/StoryShareModal"), { ssr: false });
const PersonalColorQuizModal = dynamic(() => import("@/components/PersonalColorQuizModal"), { ssr: false });
const InfluencerCloneModal = dynamic(() => import("@/components/InfluencerCloneModal"), { ssr: false });
const GenerationHistoryModal = dynamic(() => import("@/components/GenerationHistoryModal"), { ssr: false });
const FashionCatalogModal = dynamic(() => import("@/components/FashionCatalogModal"), { ssr: false });
const TomorrowOOTDWidget = dynamic(() => import("@/components/TomorrowOOTDWidget"), { ssr: false });
const WeeklyOutfitCalendar = dynamic(() => import("@/components/WeeklyOutfitCalendar"), { ssr: false });
const CoupleOutfitCard = dynamic(() => import("@/components/CoupleOutfitCard"), { ssr: false });
const OOTDChallengeSection = dynamic(() => import("@/components/OOTDChallengeSection"), { ssr: false });
const DailyReminderBanner = dynamic(() => import("@/components/DailyReminderBanner"), { ssr: false });
const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: false });
const PWAInstallBanner = dynamic(() => import("@/components/PWAInstallBanner"), { ssr: false });
const MobilePreferenceDrawer = dynamic(() => import("@/components/MobilePreferenceDrawer"), { ssr: false });

export default function HomePage() {
  const [currentOutfit, setCurrentOutfit] = useState<OOTDRecommendation>(
    PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isMobilePrefDrawerOpen, setIsMobilePrefDrawerOpen] = useState(false);
  const [lastPrefs, setLastPrefs] = useState<UserPreferences | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [activeLoaderStep, setActiveLoaderStep] = useState(0);

  // Saved Looks Drawer & Story Modal State
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [storyOutfitToExport, setStoryOutfitToExport] = useState<OOTDRecommendation | null>(null);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setActiveLoaderStep(0);
      timer = setInterval(() => {
        setActiveLoaderStep((prev) => (prev < 2 ? prev + 1 : prev));
      }, 650);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLoading]);

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
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleGenerate = async (prefs: UserPreferences) => {
    setIsLoading(true);
    setLastPrefs(prefs);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      const json = await res.json();
      if (res.ok && json.data) {
        setCurrentOutfit(json.data);

        // Auto save to Generation History in LocalStorage
        if (typeof window !== "undefined") {
          try {
            const history = JSON.parse(localStorage.getItem("looku_generation_history") || "[]");
            const newHistory = [
              {
                id: `gen-${Date.now()}`,
                timestamp: new Date().toISOString(),
                outfit: json.data,
              },
              ...history.slice(0, 29), // Retain top 30
            ];
            localStorage.setItem("looku_generation_history", JSON.stringify(newHistory));
          } catch (e) {
            console.error("Error saving generation history:", e);
          }
        }
      }
    } catch (err) {
      console.error("Generate error:", err);
      addToast({
        title: "Koneksi Agak Lambat",
        description: "Memuat formula outfit cadangan terkurasi...",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        const el = document.getElementById("hasil-ootd");
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleRegenerate = (feedbackHint?: string) => {
    if (lastPrefs) {
      const updated = { ...lastPrefs };
      if (feedbackHint) {
        updated.customNotes = `${updated.customNotes || ""} (Arahan User: ${feedbackHint})`.trim();
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
        customNotes: feedbackHint ? `Arahan User: ${feedbackHint}` : undefined,
      });
    }
  };

  const [externalPrefs, setExternalPrefs] = useState<Partial<UserPreferences>>({});
  const [activePersonalColor, setActivePersonalColor] = useState<string>("all");
  const [dominantWardrobeVibe, setDominantWardrobeVibe] = useState<string | null>(null);

  // Deep-Link URL State Handler & Smart Wardrobe Vibe Auto-Tuning on Initial Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const lookId = params.get("look");
      if (lookId) {
        // Look up in presets
        const matched = PRESET_OOTD_COLLECTION[lookId] || 
          TRENDING_LOOKS_FEED.find(t => t.id === lookId || t.outfit.id === lookId)?.outfit;
        if (matched) {
          setCurrentOutfit(matched);
        }
      } else {
        // Auto-Tuning: Read saved wardrobe for dominant user vibe
        try {
          const saved = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
          if (saved.length >= 2) {
            const counts: Record<string, number> = {};
            saved.forEach((item: any) => {
              const v = item.overallVibe || "Earthy Minimalist";
              counts[v] = (counts[v] || 0) + 1;
            });
            const topVibe = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
            if (topVibe) {
              setDominantWardrobeVibe(topVibe);
            }
          }
        } catch (e) {
          console.error(e);
        }
      }

      // Check stored personal color
      const storedTone = localStorage.getItem("looku_personal_color");
      if (storedTone) {
        const toneMap: Record<string, string> = {
          fair_porcelain: "fair",
          light_medium: "light",
          sawo_matang: "medium",
          tan_exotic: "tan",
          dark_ebony: "deep",
        };
        setActivePersonalColor(toneMap[storedTone] || storedTone);
      }
    }
  }, []);

  const handleSelectLook = (outfit: OOTDRecommendation) => {
    setCurrentOutfit(outfit);

    // Two-Way Sync: Update form inputs to match the selected look
    const isModest = outfit.modestFriendly;
    const isMale = outfit.title.toLowerCase().includes("pria") || outfit.overallVibe.toLowerCase().includes("pria");
    let occ: any = "hangout";
    if (outfit.title.toLowerCase().includes("campus") || outfit.title.toLowerCase().includes("kuliah")) occ = "kuliah";
    else if (outfit.title.toLowerCase().includes("blazer") || outfit.title.toLowerCase().includes("corporate") || outfit.title.toLowerCase().includes("kantor")) occ = "kantor";
    else if (outfit.title.toLowerCase().includes("kondangan") || outfit.title.toLowerCase().includes("batik")) occ = "kondangan";

    setExternalPrefs({
      gender: isMale ? "male" : "female",
      isModestHijab: isModest,
      occasion: occ,
    });

    // Update browser URL query param for easy sharing
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("look", outfit.id);
      window.history.replaceState(null, "", url.toString());
    }

    addToast({
      title: "Formula Lookbook Dimuat ke Studio",
      description: outfit.title,
      type: "curate",
    });
    if (typeof window !== "undefined") {
      const el = document.getElementById("hasil-ootd");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyQuizResult = (skinToneId: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_personal_color", skinToneId);
    }
    
    let toneType: any = "medium";
    if (skinToneId === "fair_porcelain") toneType = "fair";
    else if (skinToneId === "light_medium") toneType = "light";
    else if (skinToneId === "sawo_matang") toneType = "medium";
    else if (skinToneId === "tan_exotic") toneType = "tan";
    else if (skinToneId === "dark_ebony") toneType = "deep";

    setExternalPrefs(prev => ({ ...prev, skinTone: toneType }));

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
      description: `Disesuaikan dengan undertone ${label}`,
      type: "success",
    });
    if (typeof window !== "undefined") {
      const el = document.getElementById("studio");
      el?.scrollIntoView({ behavior: "smooth" });
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
        // Save to Wardrobe
        const saved = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
        if (!saved.some((item: any) => item.id === outfitToSave.id)) {
          localStorage.setItem("looku_saved_outfits", JSON.stringify([outfitToSave, ...saved]));
          window.dispatchEvent(new Event("looku_saved_updated"));
        }

        // Schedule in 7-Day Calendar
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



  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-28 md:pb-0">
      {/* Navbar with Saved Looks Drawer Trigger */}
      <Navbar
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenClone={() => setIsCloneModalOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenHistory={() => setIsHistoryOpen(true)}
      />

      {/* Daily Weather & Styling Morning Reminder Banner */}
      <DailyReminderBanner />

      {/* Hero Section */}
      <HeroSection onOpenQuiz={() => setIsQuizOpen(true)} />

      {/* Trending Community Lookbook */}
      <TrendingFeed 
        onSelectLook={handleSelectLook} 
        userSkinTone={activePersonalColor}
      />

      {/* Conversational & Rule-Based Styling Studio (Mobile-First Result-First) */}
      <section id="studio" className="py-8 sm:py-20 bg-[#FAF8F5] relative border-t border-[#E8DFD1] scroll-mt-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-b border-[#D7CABC] pb-4 sm:pb-6 mb-6 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 text-center sm:text-left"
          >
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                <span className="lookbook-label">KONSULTASI STYLIST PRIBADI</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-[#181A18] tracking-tight">
                Mix &amp; Match Outfit Personal Kamu
              </h2>
              <p className="text-xs sm:text-sm text-[#181A18]/70 mt-1.5 max-w-xl">
                Formula warna dan potongan baju yang pas untukmu hari ini berbasis iklim tropis 33°C &amp; warna kulit Nusantara.
              </p>
            </div>

            <button
              onClick={() => setIsHistoryOpen(true)}
              className="py-2 px-3.5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs self-center sm:self-auto"
            >
              <History className="w-3.5 h-3.5 text-terracotta-500" />
              <span>Riwayat Kurasi</span>
            </button>
          </motion.div>

          {/* Mobile-First Quick Preference Bar */}
          <div className="block lg:hidden mb-4">
            <div className="p-3 bg-white rounded-2xl border border-sand-300 shadow-2xs flex items-center justify-between gap-2">
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
                <span>Ubah</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Desktop Left Column: Form & Tomorrow Widget (Hidden on Mobile) */}
            <div className="hidden lg:block lg:col-span-5 w-full space-y-6">
              <TomorrowOOTDWidget onScheduleTomorrow={handleScheduleTomorrow} />
              <GeneratorForm
                onGenerate={handleGenerate}
                isLoading={isLoading}
                externalPrefs={externalPrefs}
              />
            </div>

            {/* Right Column (Mobile: Full Width on Top): Dynamic Outfit Card Result */}
            <div id="hasil-ootd" className="lg:col-span-7 w-full scroll-mt-24">
              <div className="mb-4 p-3 rounded-2xl bg-white border border-sand-300 shadow-2xs flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-terracotta-500 shrink-0" />
                <p className="text-xs text-charcoal-900 font-medium leading-relaxed">
                  {dominantWardrobeVibe
                    ? `Formula OOTD telah diselaraskan dengan gaya favorit lemarimu (${dominantWardrobeVibe}) & cuaca tropis.`
                    : "Formula OOTD diselaraskan dengan cuaca harian & profil warna kulitmu."}
                </p>
              </div>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading-box"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full tactile-card p-6 sm:p-10 flex flex-col justify-between min-h-[460px] sm:min-h-[520px] bg-white relative overflow-hidden rounded-3xl"
                  >
                    <div className="space-y-5">
                      <div className="flex items-center justify-between border-b border-sand-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-ping" />
                          <span className="lookbook-label">AI STYLIST SEDANG BEKERJA</span>
                        </div>
                        <span className="text-[10px] font-mono text-sand-500 uppercase tracking-widest animate-pulse">
                          GENERATING...
                        </span>
                      </div>

                      {/* Stage Progress Pills */}
                      <div className="space-y-2.5">
                        {[
                          "1. Menganalisis undertone warna kulit & profil...",
                          "2. Memilih bahan katun & linen anti-gerah...",
                          "3. Mengkurasi toko bintang 4.8+ di marketplace..."
                        ].map((text, idx) => {
                          const isActive = idx === activeLoaderStep;
                          const isPast = idx < activeLoaderStep;
                          return (
                            <div key={idx} className={`flex items-center gap-3 text-xs font-semibold p-2.5 sm:p-3 rounded-xl border transition-all ${isActive ? "border-terracotta-500 bg-sand-50" : "border-sand-200 bg-sand-50/50"} ${idx <= activeLoaderStep ? "text-charcoal-900" : "text-sand-500 opacity-50"}`}>
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono ${isPast ? "bg-emerald-500 text-white" : isActive ? "bg-terracotta-500 text-white animate-pulse shadow-[0_0_8px_rgba(235,97,52,0.6)]" : "bg-sand-200 text-sand-500"}`}>
                                {isPast ? "✓" : idx + 1}
                              </span>
                              <span>{text}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Shimmer Placeholder Skeletons */}
                      <div className="space-y-3 pt-2">
                        <div className="h-5 w-3/4 rounded-lg animate-shimmer" />
                        <div className="h-4 w-1/2 rounded-lg animate-shimmer" />
                        <div className="h-16 w-full rounded-xl animate-shimmer" />
                      </div>
                    </div>

                    <div className="pt-3 border-t border-sand-200 flex items-center justify-between text-[10px] font-mono text-sand-500 uppercase">
                      <span>PERSONAL COLOR & CUACA</span>
                      <span className="text-terracotta-500 font-bold">KATUN & LINEN ADEM</span>
                    </div>
                  </motion.div>
                ) : lastPrefs?.stylingMode === "couple" || lastPrefs?.stylingMode === "bestie" ? (
                  <CoupleOutfitCard
                    outfit={currentOutfit}
                    onRegenerate={handleRegenerate}
                    onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
                  />
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

          {/* Weekly Outfit Calendar (7-Day Planner) */}
          <div className="mt-16 pt-12 border-t border-sand-200 cv-auto">
            <WeeklyOutfitCalendar
              currentOutfit={currentOutfit}
              onSelectDayOutfit={(outfit) => handleSelectLook(outfit)}
            />
          </div>
        </div>
      </section>

      {/* Features & Curation Principles (Reassurance right after Studio) */}
      <div className="cv-auto">
        <FeaturesSection />
      </div>

      {/* FAQ Section (Objection Handling) */}
      <div className="cv-auto">
        <FAQSection />
      </div>

      {/* Weekly OOTD Challenge Community Leaderboard */}
      <section id="challenge" className="cv-auto">
        <OOTDChallengeSection />
      </section>

      {/* Final Conversion Re-engagement Card */}
      <section className="py-16 sm:py-20 bg-charcoal-900 text-sand-50 relative overflow-hidden border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono tracking-widest uppercase text-terracotta-400">
            <span>✦ SIAP TAMPIL PERCAYA DIRI SETIAP HARI</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Temukan Formula OOTD Terbaikmu Sekarang
          </h2>
          <p className="text-sm sm:text-base text-sand-300 max-w-xl mx-auto leading-relaxed">
            Tanpa perlu bingung di depan lemari. Dapatkan rekomendasi pakaian adem tropis, ramah hijab, dan sesuai warna kulit dalam 1 klik.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <a
              href="#studio"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Mulai Racik Outfit Kamu ➔</span>
            </a>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs tracking-wider uppercase transition-all"
            >
              <span>Tes Personal Color (60s)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <div className="cv-auto">
        <Footer />
      </div>

      {/* Floating Mobile App-Shell Navigation */}
      <BottomNav onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} />

      {/* Saved Looks Drawer (Loaded on Demand) */}
      {isSavedDrawerOpen && (
        <SavedLooksDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          onSelectOutfit={handleSelectLook}
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

      {/* Influencer Clone Modal (Loaded on Demand) */}
      {isCloneModalOpen && (
        <InfluencerCloneModal
          isOpen={isCloneModalOpen}
          onClose={() => setIsCloneModalOpen(false)}
          onSelectDupeLook={(outfit) => {
            handleSelectLook(outfit);
            setIsCloneModalOpen(false);
          }}
        />
      )}

      {/* Fashion Catalog Warehouse Modal (Loaded on Demand) */}
      {isCatalogOpen && (
        <FashionCatalogModal
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
        />
      )}

      {/* Generation History Modal (Loaded on Demand) */}
      {isHistoryOpen && (
        <GenerationHistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectOutfit={handleSelectLook}
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

      {/* Toasts Notification */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
