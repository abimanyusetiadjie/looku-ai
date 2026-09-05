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
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
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
        onOpenClone={() => setIsCloneModalOpen(true)}
        onOpenCatalog={() => setIsCatalogOpen(true)}
        onOpenHistory={() => {
          if (typeof window !== "undefined") {
            window.location.href = "/studio";
          }
        }}
      />

      {/* 2. Daily Weather & Morning Dressing Briefing Banner */}
      <DailyReminderBanner />

      {/* 3. Hero Section (With 1-Tap Live Climate & Style Switcher) */}
      <HeroSection onOpenQuiz={() => setIsQuizOpen(true)} />

      {/* 4. Quick Discovery Hub (Native Mobile App Springboard Widgets) */}
      <section className="py-6 sm:py-10 bg-[#FAF8F5] relative border-b border-[#E8DFD1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-sand-500 tracking-wider">
                NAVIGASI FITUR UTAMA
              </span>
              <h2 className="font-serif text-lg sm:text-2xl font-bold text-[#181A18]">
                Eksplorasi look.u AI
              </h2>
            </div>
            <span className="text-[11px] font-mono text-terracotta-600 font-semibold hidden sm:inline">
              5 MODUL TERINTEGRASI
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Card 1: Studio OOTD */}
            <Link
              href="/studio"
              className="group p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-[#E8DFD1] hover:border-terracotta-500/60 hover:shadow-tactile transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-center text-terracotta-600 group-hover:scale-105 transition-transform">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-full border border-terracotta-200">
                    AI ATELIER
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#181A18] group-hover:text-terracotta-600 transition-colors">
                    Studio OOTD
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#181A18]/70 line-clamp-2 leading-relaxed mt-1">
                    Konsultasi &amp; racik formula outfit personal dengan kalender 7 hari.
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#FAF8F5] flex items-center justify-between text-[11px] font-bold text-terracotta-600">
                <span>Buka Studio</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 2: Lookbook & Tren */}
            <Link
              href="/lookbook"
              className="group p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-[#E8DFD1] hover:border-emerald-500/60 hover:shadow-tactile transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 group-hover:scale-105 transition-transform">
                    <Compass className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    16+ LOOKBOOK
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#181A18] group-hover:text-emerald-700 transition-colors">
                    Jelajah Lookbook
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#181A18]/70 line-clamp-2 leading-relaxed mt-1">
                    Feed kurasi tren hijab, santai kafe, kerja SCBD, &amp; kondangan.
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#FAF8F5] flex items-center justify-between text-[11px] font-bold text-emerald-700">
                <span>Lihat Feed</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* Card 3: Tes Personal Color (Modal Trigger) */}
            <button
              onClick={() => setIsQuizOpen(true)}
              className="group text-left p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-[#E8DFD1] hover:border-amber-500/60 hover:shadow-tactile transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 group-hover:scale-105 transition-transform">
                    <Palette className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    KUIS 60S
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#181A18] group-hover:text-amber-700 transition-colors">
                    Cek Personal Color
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#181A18]/70 line-clamp-2 leading-relaxed mt-1">
                    Kuis 3 pertanyaan praktis mendeteksi palet warna kulit paling glowing.
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#FAF8F5] flex items-center justify-between text-[11px] font-bold text-amber-700">
                <span>Mulai Kuis</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </button>

            {/* Card 4: Lemari Digital Saya */}
            <Link
              href="/lemari"
              className="group p-4 sm:p-5 rounded-2xl sm:rounded-3xl bg-white border border-[#E8DFD1] hover:border-charcoal-900/60 hover:shadow-tactile transition-all flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-sand-100 border border-sand-300 flex items-center justify-center text-charcoal-900 group-hover:scale-105 transition-transform">
                    <Bookmark className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-charcoal-900 bg-sand-100 px-2 py-0.5 rounded-full border border-sand-300">
                    SMART WARDROBE
                  </span>
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#181A18] group-hover:text-terracotta-600 transition-colors">
                    Lemari &amp; Efisiensi
                  </h3>
                  <p className="text-[11px] sm:text-xs text-[#181A18]/70 line-clamp-2 leading-relaxed mt-1">
                    Simpan outfit favorit, hitung cost-per-wear &amp; sinkron cloud multi-device.
                  </p>
                </div>
              </div>
              <div className="pt-3 mt-2 border-t border-[#FAF8F5] flex items-center justify-between text-[11px] font-bold text-charcoal-900">
                <span>Buka Lemari</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. "Look of the Day" (24H Editorial Magazine Spotlight) */}
      <section className="py-8 sm:py-14 bg-white border-b border-[#E8DFD1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-50 border border-terracotta-200 text-terracotta-700 text-[10px] font-mono font-bold uppercase tracking-wider mb-2">
                <Flame className="w-3 h-3 text-terracotta-500" />
                <span>LOOK OF THE DAY • EDISI 24 JAM</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#181A18] tracking-tight">
                Formula Pilihan Editor Hari Ini
              </h2>
              <p className="text-xs sm:text-sm text-[#181A18]/70 mt-1 max-w-xl">
                Rekomendasi paduan adem yang dihitung spesifik untuk cuaca 33°C siang ini dan warna kulit Nusantara.
              </p>
            </div>

            <Link
              href={`/studio?look=${spotlightOutfit.id}`}
              className="py-2.5 px-5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm self-start md:self-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
              <span>Racik Look Ini di Studio ➔</span>
            </Link>
          </div>

          {/* Magazine Cover Presentation Card */}
          <div className="rounded-3xl bg-[#FAF8F5] border border-[#E8DFD1] p-5 sm:p-8 lg:p-10 shadow-tactile">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Left Column: Story, Weather & Palette */}
              <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-amber-100/80 text-amber-900 font-bold border border-amber-300 text-[10px] font-mono">
                    ☀️ 33°C PANAS TERIK
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-900 font-bold border border-emerald-300 text-[10px] font-mono">
                    🧕 100% MODEST &amp; HIJAB
                  </span>
                  <span className="px-3 py-1 rounded-full bg-sand-200 text-charcoal-900 font-bold text-[10px] font-mono">
                    ✦ SIRKULASI 98.4% ADEM
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-xl sm:text-3xl font-bold text-[#181A18]">
                    {spotlightOutfit.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-sand-500 italic mt-1">
                    "{spotlightOutfit.tagline}"
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-[#181A18]/80 leading-relaxed">
                  {spotlightOutfit.whyItWorks}
                </p>

                {/* Color Palette Strip */}
                <div className="space-y-2 pt-1">
                  <span className="text-[10px] font-mono uppercase font-bold text-sand-500 tracking-wider">
                    HARMONI WARNA (PERSONAL COLOR SAWO MATANG &amp; KUNING LANGSAT)
                  </span>
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {spotlightOutfit.colorPalette.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-sand-300 shadow-2xs text-xs font-medium"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[#181A18] text-[11px] font-semibold">{color.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Action Row */}
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href={`/studio?look=${spotlightOutfit.id}`}
                    className="w-full sm:w-auto py-3 px-6 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Kustomisasi di Studio OOTD ➔</span>
                  </Link>

                  <Link
                    href="/lookbook"
                    className="w-full sm:w-auto py-3 px-5 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <span>Lihat Inspirasi Serupa di Lookbook ↗</span>
                  </Link>
                </div>
              </div>

              {/* Right Column: Garment Breakdown Items */}
              <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
                <div className="p-3 bg-white rounded-2xl border border-sand-300 flex items-center justify-between text-xs font-bold text-charcoal-900 shadow-2xs">
                  <span className="flex items-center gap-1.5">
                    <Shirt className="w-4 h-4 text-terracotta-500" />
                    <span>Bedah Item Pakaian</span>
                  </span>
                  <span className="text-[10px] font-mono text-sand-500 uppercase">
                    EST. RP 180.000 - 260.000
                  </span>
                </div>

                <div className="space-y-2">
                  {spotlightOutfit.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl bg-white border border-sand-200 shadow-2xs flex items-center justify-between gap-3 hover:border-terracotta-400 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                        />
                        <div>
                          <div className="text-[9px] font-mono text-sand-500 uppercase tracking-wider">
                            {item.category.replace("_", " ")}
                          </div>
                          <div className="text-xs font-bold text-[#181A18] line-clamp-1">
                            {item.name}
                          </div>
                          <div className="text-[10px] text-[#181A18]/60">
                            {item.material}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[11px] font-mono font-bold text-charcoal-900">
                          {item.estimatedPrice}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Trending Highlights: Horizontal Snap Carousel (Instagram Stories / Pinterest Style) */}
      <section className="py-8 sm:py-14 bg-[#FAF8F5] border-b border-[#E8DFD1]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-terracotta-500" />
                <span className="lookbook-label">SWIPE UNTUK INSPIRASI</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#181A18] tracking-tight">
                Tren OOTD Terpopuler Minggu Ini
              </h2>
              <p className="text-xs sm:text-sm text-[#181A18]/70 mt-1 max-w-xl">
                Koleksi yang paling sering dicoba dan disimpan oleh ribuan pengguna di Jakarta, Bandung, dan Surabaya.
              </p>
            </div>

            <Link
              href="/lookbook"
              className="py-2.5 px-4 rounded-xl bg-white hover:bg-sand-100 border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-2xs self-start sm:self-auto"
            >
              <span>Semua 16 Look ➔</span>
            </Link>
          </div>

          {/* Horizontal Swipeable Snap Carousel */}
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 pt-1 no-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
            {featuredTrendingLooks.map((look) => (
              <div
                key={look.id}
                className="w-[280px] sm:w-auto shrink-0 snap-start rounded-3xl bg-white border border-[#E8DFD1] hover:border-charcoal-900 hover:shadow-tactile transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-4/5 w-full overflow-hidden bg-sand-200">
                    <img
                      src={look.image}
                      alt={look.title}
                      loading="lazy"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-white/95 backdrop-blur-xs text-[9px] font-mono font-bold text-charcoal-900 shadow-xs">
                        {look.tag}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-white text-[9px] font-mono font-bold">
                      <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                      <span>{look.likes}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-1.5">
                    <div className="text-[9px] font-mono text-sand-500 uppercase tracking-wider">
                      {look.category}
                    </div>
                    <h3 className="font-serif font-bold text-base text-[#181A18] line-clamp-1">
                      {look.title}
                    </h3>
                    <p className="text-[11px] text-sand-500 line-clamp-1">
                      {look.skinToneRecommendation}
                    </p>
                    <div className="text-xs font-mono font-bold text-charcoal-900 pt-1">
                      {look.priceRange}
                    </div>
                  </div>
                </div>

                {/* Card Direct CTA */}
                <div className="p-4 pt-0">
                  <Link
                    href={`/studio?look=${look.outfit.id}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#FAF8F5] hover:bg-charcoal-900 hover:text-white border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                  >
                    <span>Racik Look Ini ➔</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Explore Banner */}
          <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-sand-100 border border-sand-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="font-serif font-bold text-base sm:text-lg text-charcoal-900">
                Mencari Gaya Spesifik untuk Acara Mendatang?
              </h4>
              <p className="text-xs text-sand-500 mt-0.5">
                Koleksi lengkap mencakup batik tulis pria, office blazer, hingga resort linen pantai.
              </p>
            </div>
            <Link
              href="/lookbook"
              className="shrink-0 w-full sm:w-auto py-3 px-6 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              <Compass className="w-4 h-4 text-terracotta-400" />
              <span>Buka Seluruh Lookbook (16 Look) ➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Features & Curation Principles */}
      <div className="cv-auto">
        <FeaturesSection />
      </div>

      {/* 8. FAQ Section */}
      <div className="cv-auto">
        <FAQSection />
      </div>

      {/* 9. Final Conversion Card */}
      <section className="py-14 sm:py-20 bg-charcoal-900 text-sand-50 relative overflow-hidden border-t border-white/10">
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
            <Link
              href="/studio"
              className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Mulai Racik Outfit di Studio ➔</span>
            </Link>
            <button
              onClick={() => setIsQuizOpen(true)}
              className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-xs tracking-wider uppercase transition-all"
            >
              <span>Tes Personal Color (60s)</span>
            </button>
          </div>
        </div>
      </section>

        {/* 10. Footer */}
        <div className="cv-auto">
          <Footer />
        </div>
      </div>

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

      {isCloneModalOpen && (
        <InfluencerCloneModal
          isOpen={isCloneModalOpen}
          onClose={() => setIsCloneModalOpen(false)}
          onSelectDupeLook={(outfit) => {
            setIsCloneModalOpen(false);
            if (typeof window !== "undefined") {
              window.location.href = `/studio?look=${outfit.id}`;
            }
          }}
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
