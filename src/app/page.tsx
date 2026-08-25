"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingFeed from "@/components/TrendingFeed";
import GeneratorForm from "@/components/GeneratorForm";
import OutfitCard from "@/components/OutfitCard";
import FeaturesSection from "@/components/FeaturesSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import SavedLooksDrawer from "@/components/SavedLooksDrawer";
import StoryShareModal from "@/components/StoryShareModal";
import { UserPreferences, OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION } from "@/lib/presets";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import Toast, { ToastMessage } from "@/components/Toast";
import PersonalColorQuizModal from "@/components/PersonalColorQuizModal";
import TomorrowOOTDWidget from "@/components/TomorrowOOTDWidget";

export default function HomePage() {
  const [currentOutfit, setCurrentOutfit] = useState<OOTDRecommendation>(
    PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"]
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
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
      }
    } catch (err) {
      console.error("Generate error:", err);
    } finally {
      setIsLoading(false);
      if (typeof window !== "undefined" && window.innerWidth < 768) {
        const el = document.getElementById("hasil-ootd");
        el?.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleRegenerate = () => {
    if (lastPrefs) {
      handleGenerate(lastPrefs);
    }
  };

  const handleSelectLook = (outfit: OOTDRecommendation) => {
    setCurrentOutfit(outfit);
    addToast({
      title: "Menyesuaikan Formula Lookbook untukmu...",
      description: "Disesuaikan dengan warna kulit & sirkulasi adem",
      type: "curate",
    });
    if (typeof window !== "undefined") {
      const el = document.getElementById("hasil-ootd");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleApplyQuizResult = (skinToneId: string) => {
    addToast({
      title: "Personal Color Diterapkan",
      description: "✨ Personal Color Diterapkan: Sawo Matang (Warm Autumn)",
      type: "success",
    });
    if (typeof window !== "undefined") {
      const el = document.getElementById("studio");
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleScheduleTomorrow = (outfit: any) => {
    addToast({
      title: "Jadwal OOTD",
      description: "✨ OOTD Besok Pagi Berhasil Disimpan di Lemari!",
      type: "save",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] pb-16 md:pb-0">
      {/* Navbar with Saved Looks Drawer Trigger */}
      <Navbar onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} onOpenQuiz={() => setIsQuizOpen(true)} />

      {/* Hero Section */}
      <HeroSection onOpenQuiz={() => setIsQuizOpen(true)} />

      {/* Trending Lookbook Feed with Hotspots & Lightbox */}
      <TrendingFeed onSelectLook={handleSelectLook} />

      {/* Interactive Studio Generator Section */}
      <section id="studio" className="py-14 sm:py-24 border-b border-[#E8DFD1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-b border-[#D7CABC] pb-6 mb-10 text-center sm:text-left"
          >
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-terracotta-500" />
              <span className="lookbook-label">KONSULTASI STYLIST PRIBADI</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#181A18] tracking-tight">
              Mix & Match Outfit Personal Kamu
            </h2>
            <p className="text-sm text-[#181A18]/70 mt-2 max-w-xl">
              Ikuti 3 langkah singkat di bawah. Stylist kami akan memilihkan formula warna dan potongan baju yang pas untukmu hari ini.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Conversational Form (5 cols) */}
            <div className="lg:col-span-5 w-full">
              <TomorrowOOTDWidget onScheduleTomorrow={handleScheduleTomorrow} />
              <GeneratorForm
                onGenerate={handleGenerate}
                isLoading={isLoading}
              />
            </div>

            {/* Right Column: Dynamic Outfit Card Result (7 cols) */}
            <div id="hasil-ootd" className="lg:col-span-7 w-full scroll-mt-24">
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-terracotta-50 to-[#FAF8F5] border border-terracotta-200 shadow-sm flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
                <p className="text-sm text-[#181A18] font-medium leading-relaxed">
                  ✨ Formula OOTD Kamu Hari Ini Telah Disesuaikan Berdasarkan Cuaca & Smart Defaults <span className="font-bold">(GPS Synced Climate 33°C, Earthy Minimalist, Sawo Matang Tone)</span>. Klik 'Sesuaikan' di form jika ingin mengubah acara/budget.
                </p>
              </div>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading-box"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    className="w-full tactile-card p-8 sm:p-10 flex flex-col justify-between min-h-[520px] bg-white relative overflow-hidden"
                  >
                    <div className="space-y-6">
                      <div className="flex items-center justify-between border-b border-sand-200 pb-4">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-terracotta-500 animate-ping" />
                          <span className="lookbook-label">AI STYLIST SEDANG BEKERJA</span>
                        </div>
                        <span className="text-[10px] font-mono text-sand-500 uppercase tracking-widest animate-pulse">
                          GENERATING FORMULA...
                        </span>
                      </div>

                      {/* Stage Progress Pills */}
                      <div className="space-y-3">
                        {[
                          "🟢 1. Menganalisis undertone warna kulit & profil...",
                          "🟢 2. Menyeleksi sirkulasi bahan katun rayon & linen adem...",
                          "🟢 3. Mengkurasi toko bintang 4.8+ di Shopee & Tokopedia..."
                        ].map((text, idx) => {
                          const isActive = idx === activeLoaderStep;
                          const isPast = idx < activeLoaderStep;
                          return (
                            <div key={idx} className={`flex items-center gap-3 text-xs font-semibold p-3 rounded-xl border transition-all ${isActive ? "border-terracotta-500 bg-sand-50" : "border-sand-200 bg-sand-50/50"} ${idx <= activeLoaderStep ? "text-charcoal-900" : "text-sand-500 opacity-50"}`}>
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
                        <div className="h-6 w-3/4 rounded-lg animate-shimmer" />
                        <div className="h-4 w-1/2 rounded-lg animate-shimmer" />
                        <div className="h-20 w-full rounded-xl animate-shimmer" />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-[10px] font-mono text-sand-500">
                      <span>ESTIMASI PROSES: ~1.2 DETIK</span>
                      <span className="text-terracotta-500 font-bold">100% REALISTIC PRICING</span>
                    </div>
                  </motion.div>
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
        </div>
      </section>

      {/* Features & Curation Principles */}
      <FeaturesSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />

      {/* Floating Mobile App-Shell Navigation */}
      <BottomNav onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)} />

      {/* Saved Looks Drawer */}
      <SavedLooksDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        onSelectOutfit={handleSelectLook}
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

      {/* Toasts Notification */}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
