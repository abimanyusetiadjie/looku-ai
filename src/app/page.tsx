"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Sparkles, 
  Palette, 
  Bookmark, 
  Compass, 
  ArrowRight, 
  ArrowUpRight, 
  Flame, 
  Wind, 
  Sun, 
  ShoppingBag, 
  Eye, 
  Heart, 
  Layers, 
  Shirt, 
  ChevronRight, 
  ExternalLink, 
  Store 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Core Components
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import Footer from "@/components/Footer";
import LookUMobileView from "@/components/LookUMobileView";
import OnboardingFlow from "@/components/OnboardingFlow";
import Toast, { ToastMessage } from "@/components/Toast";
import { OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION, TRENDING_LOOKS_FEED } from "@/lib/presets";

// Dynamic Code-Splitting for Heavy Modals & Offscreen Content
const SavedLooksDrawer = dynamic(() => import("@/components/SavedLooksDrawer"), { ssr: false });
const StoryShareModal = dynamic(() => import("@/components/StoryShareModal"), { ssr: false });
const PersonalColorQuizModal = dynamic(() => import("@/components/PersonalColorQuizModal"), { ssr: false });
const InfluencerCloneModal = dynamic(() => import("@/components/InfluencerCloneModal"), { ssr: false });
const FashionCatalogModal = dynamic(() => import("@/components/FashionCatalogModal"), { ssr: false });
const DailyReminderBanner = dynamic(() => import("@/components/DailyReminderBanner"), { ssr: false });
const FeaturesSection = dynamic(() => import("@/components/FeaturesSection"), { ssr: false });
const FAQSection = dynamic(() => import("@/components/FAQSection"), { ssr: false });
const PWAInstallBanner = dynamic(() => import("@/components/PWAInstallBanner"), { ssr: false });

export default function HomePage() {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [hasOnboarded, setHasOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    const onboarded = localStorage.getItem('looku_has_onboarded');
    if (window.location.search.includes('quiz=true')) {
      setIsQuizOpen(true);
    }
    if (onboarded) {
      setHasOnboarded(true);
    } else {
      setHasOnboarded(false);
    }
  }, []);

  const handleCompleteOnboarding = () => {
    localStorage.setItem('looku_has_onboarded', 'true');
    setHasOnboarded(true);
    setIsQuizOpen(true);
  };
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [storyOutfitToExport, setStoryOutfitToExport] = useState<OOTDRecommendation | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [savedCount, setSavedCount] = useState<number>(0);

  // Sinkronisasi jumlah outfit tersimpan untuk badge Lemari
  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("looku_saved_outfits");
        if (stored) {
          setSavedCount(JSON.parse(stored).length);
        } else {
          setSavedCount(0);
        }
      } catch {
        setSavedCount(0);
      }
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    const interval = setInterval(updateCount, 2000);
    return () => {
      window.removeEventListener("storage", updateCount);
      clearInterval(interval);
    };
  }, []);

  // Spotlight Look of the Day
  const spotlightOutfit = PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"];

  // Top 6 Curated Looks for Horizontal Carousel Reel
  const featuredTrendingLooks = TRENDING_LOOKS_FEED.slice(0, 6);

  const addToast = (toast: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
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
      fair: "Putih Gading",
      light: "Kuning Langsat",
      medium: "Sawo Matang",
      tan: "Tan Eksotis",
      deep: "Deep Bronze",
    };
    const label = toneNames[skinToneId] || skinToneId;

    addToast({
      title: "Personal Color Berhasil Disimpan!",
      description: `Undertone ${label} kini aktif untuk kurasi outfitmu.`,
      type: "success",
    });
  };

  if (hasOnboarded === null) return null;

  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
  }

  if (hasOnboarded === null) return null;

  if (!hasOnboarded) {
    return <OnboardingFlow onComplete={handleCompleteOnboarding} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      {/* ============================================================ */}
      {/* TAMPILAN MOBILE-FIRST KHUSUS PONSEL (< 768px / md:hidden)     */}
      {/* ============================================================ */}
      <div className="block md:hidden w-full">
        <LookUMobileView
          onOpenQuiz={() => setIsQuizOpen(true)}
          onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
          savedCount={savedCount}
        />
      </div>

      {/* ============================================================ */}
      {/* TAMPILAN DESKTOP LENGKAP (>= 768px / hidden md:flex)         */}
      {/* 100% DIPERTAHANKAN UTUH TANPA MERUSAK TAMPILAN DESKTOP       */}
      {/* ============================================================ */}
      <div className="hidden md:flex flex-col min-h-screen">
        {/* 1. Header & Top Navigation Bar */}
        <Navbar
          onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenHistory={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/studio";
          }
        }}
      />

      {/* 2. Daily Weather & Morning Dressing Briefing Banner */}

      {/* 3. Hero Section (With 1-Tap Live Climate & Style Switcher) */}
      <HeroSection onOpenQuiz={() => setIsQuizOpen(true)} />

      
        {/* 4. Editorial Campaign Split */}
        <section className="py-20 bg-white">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="relative aspect-[4/5] bg-sand-100 overflow-hidden group cursor-pointer" onClick={() => setIsCatalogOpen(true)}>
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80" alt="Curated Materials" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="font-serif text-3xl text-white mb-2">Curated Materials</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-white/90 font-bold mb-4">Discover Breathable Fabrics</p>
                  <div className="h-px w-12 bg-white group-hover:w-full transition-all duration-500" />
                </div>
              </div>
              <div className="relative aspect-[4/5] bg-sand-100 overflow-hidden group cursor-pointer" onClick={() => setIsQuizOpen(true)}>
                <img src="https://images.unsplash.com/photo-1550614000-4b95d8822dbe?w=800&q=80" alt="Color Intelligence" className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute bottom-8 left-8 right-8">
                  <h3 className="font-serif text-3xl text-white mb-2">Color Intelligence</h3>
                  <p className="font-sans text-xs uppercase tracking-widest text-white/90 font-bold mb-4">Find Your Perfect Palette</p>
                  <div className="h-px w-12 bg-white group-hover:w-full transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. The Lookbook (Trending Looks) */}
        <section className="py-24 bg-[#FAF8F5]">
          <div className="max-w-[1400px] mx-auto px-8">
            <div className="flex items-end justify-between mb-12 border-b border-sand-300 pb-6">
              <div>
                <h2 className="font-serif text-4xl text-charcoal-900 tracking-tight">The Editorial</h2>
                <p className="font-sans text-sm text-sand-500 mt-2 uppercase tracking-widest">Curated looks for the tropics</p>
              </div>
              <Link href="/lookbook" className="font-sans text-xs font-bold uppercase tracking-widest text-charcoal-900 hover:text-terracotta-600 transition-colors pb-1 border-b border-transparent hover:border-terracotta-600">
                View Collection
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
              {featuredTrendingLooks.slice(0, 4).map((look) => (
                <Link key={look.id} href={`/studio?look=${look.outfit.id}`} className="group flex flex-col">
                  <div className="relative aspect-[3/4] overflow-hidden bg-sand-200 mb-4">
                    <img
                      src={look.image}
                      alt={look.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white text-[9px] font-sans font-bold uppercase tracking-widest text-charcoal-900">
                        {look.tag}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-lg text-charcoal-900 group-hover:text-terracotta-600 transition-colors">{look.title}</h3>
                    <p className="text-xs font-sans text-sand-500 mt-1 uppercase tracking-widest">{look.category}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Features & FAQ */}
        <div className="bg-white py-12">
          <FeaturesSection />
          <FAQSection />
        </div>

        {/* 7. Final Conversion Card */}
        <section className="py-32 bg-charcoal-900 text-white">
          <div className="max-w-3xl mx-auto px-8 text-center space-y-8">
            <h2 className="font-serif text-5xl md:text-6xl font-medium tracking-tight">
              Elevate Your Everyday.
            </h2>
            <p className="font-sans text-sm md:text-base text-white/70 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
              Discover your personalized style matrix with our Context-Aware AI. Tailored for the tropical climate and your unique skin tone.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/studio"
                className="w-full sm:w-auto px-10 py-4 bg-white text-charcoal-900 font-sans text-xs font-bold uppercase tracking-widest hover:bg-sand-100 transition-colors"
              >
                Enter Studio
              </Link>
              <button
                onClick={() => setIsQuizOpen(true)}
                className="w-full sm:w-auto px-10 py-4 border border-white text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-charcoal-900 transition-colors"
              >
                Color Diagnostic
              </button>
            </div>
          </div>
        </section>

        {/* 8. Footer */}
        <Footer />
      </div>

      {/* Modals Loaded On-Demand - Terhubung Bersama untuk Mobile & Desktop */}
{/* Modals Loaded On-Demand - Terhubung Bersama untuk Mobile & Desktop */}
      {isSavedDrawerOpen && (
        <SavedLooksDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          onSelectOutfit={(outfit) => {
            setIsSavedDrawerOpen(false);
            if (typeof window !== "undefined") {
              window.location.href = `/studio?look=${outfit.id}`;
            }
          }}
          onExportStory={(outfit) => setStoryOutfitToExport(outfit)}
        />
      )}

      {storyOutfitToExport && (
        <StoryShareModal
          outfit={storyOutfitToExport}
          onClose={() => setStoryOutfitToExport(null)}
        />
      )}

      {isQuizOpen && (
        <PersonalColorQuizModal
          isOpen={isQuizOpen}
          onClose={() => setIsQuizOpen(false)}
          onApplyResult={handleApplyQuizResult}
        />
      )}

      {isCatalogOpen && (
        <FashionCatalogModal
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
        />
      )}

      <PWAInstallBanner />
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}










