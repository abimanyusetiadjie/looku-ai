"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Sun, 
  CloudRain, 
  Briefcase, 
  Sparkles, 
  Palette, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag, 
  Wind, 
  Check, 
  Flame, 
  Shirt,
  Layers,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import WaitlistModal from "./WaitlistModal";
import PersonalColorQuizModal from "./PersonalColorQuizModal";

interface HeroSectionProps {
  onOpenQuiz?: () => void;
}

interface HeroScenario {
  id: string;
  icon: string;
  pillLabel: string;
  tempLabel: string;
  badge: string;
  badgeColor: string;
  title: string;
  tagline: string;
  material: string;
  breathability: string;
  skinToneMatch: string;
  palette: { name: string; hex: string }[];
  priceRange: string;
  image: string;
  lookId: string;
  modestTag: string;
}

const HERO_SCENARIOS: HeroScenario[] = [
  {
    id: "hijab_panas",
    icon: "☀️",
    pillLabel: "33°C Hijab Modest",
    tempLabel: "Siang Hari • 33°C Lembap",
    badge: "98.4% AIRFLOW",
    badgeColor: "bg-amber-500/90 text-white",
    title: "Casual Campus Chiffon & Linen",
    tagline: "Kemeja Linen Crinkle + Loose Kulot Sand",
    material: "Katun Linen Crinkle (Adem & Anti-Kusut)",
    breathability: "Sirkulasi Udara 98.4%",
    skinToneMatch: "Flattering untuk Sawo Matang & Kuning Langsat",
    palette: [
      { name: "Sage", hex: "#84A98C" },
      { name: "Cream", hex: "#F5EBE0" },
      { name: "Sand", hex: "#D4A373" },
      { name: "Charcoal", hex: "#181A18" },
    ],
    priceRange: "Rp 180rb - 260rb / Set",
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=800&auto=format&fit=crop&q=80",
    lookId: "kuliah_hijab_panas_hemat",
    modestTag: "100% Modest Hijab",
  },
  {
    id: "casual_nonhijab",
    icon: "✨",
    pillLabel: "33°C Casual Non-Hijab",
    tempLabel: "Siang Hari • 33°C Lembap",
    badge: "SENOPATI CHIC",
    badgeColor: "bg-terracotta-600/90 text-white",
    title: "Seoul Cafe Hopping & Pleated Linen",
    tagline: "Linen Camp Collar + Pleated Wide Slacks",
    material: "Katun Linen Euro & Tencel Breathable",
    breathability: "Sirkulasi Udara 98.2%",
    skinToneMatch: "Flattering Kuning Langsat & Sawo Matang",
    palette: [
      { name: "Oatmeal", hex: "#E3D5CA" },
      { name: "Sage", hex: "#84A98C" },
      { name: "Olive", hex: "#6B705C" },
      { name: "Sand", hex: "#D4A373" },
    ],
    priceRange: "Rp 195rb - 285rb / Set",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
    lookId: "hangout_nonhijab_panas_menengah",
    modestTag: "Casual Senopati",
  },
  {
    id: "kantor_scbd",
    icon: "🏢",
    pillLabel: "22°C SCBD Smart Chic",
    tempLabel: "Meeting Room • 22°C AC",
    badge: "CORPORATE CHIC",
    badgeColor: "bg-charcoal-900/90 text-white",
    title: "SCBD Smart Unlined Linen Blazer",
    tagline: "Blazer Linen Bernapas + Highwaist Slacks",
    material: "Linen-Rayon Blend (Tak Kaku & Flowy)",
    breathability: "Sirkulasi 96.2% Nyaman Seharian",
    skinToneMatch: "Nuansa Elegan Kuning Langsat & Sawo Matang",
    palette: [
      { name: "Navy", hex: "#1D3557" },
      { name: "Sand", hex: "#E9D8A6" },
      { name: "White", hex: "#FAFAFA" },
      { name: "Walnut", hex: "#582F0E" },
    ],
    priceRange: "Rp 260rb - 390rb / Set",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&auto=format&fit=crop&q=80",
    lookId: "scbd_corporate_blazer",
    modestTag: "Smart Corporate",
  },
  {
    id: "pria_clean",
    icon: "👔",
    pillLabel: "Pria Clean Cut",
    tempLabel: "Daily Menswear • Tropis Fleksibel",
    badge: "100% UNISEX / PRIA",
    badgeColor: "bg-emerald-700/90 text-white",
    title: "Clean Oxford Nomad & Chino Stretch",
    tagline: "Kemeja Oxford Katun + Celana Chino Elastis",
    material: "100% Oxford Cotton Cooltech & Twill",
    breathability: "Sirkulasi Alami 97.8%",
    skinToneMatch: "Flattering untuk Seluruh Kulit Pria",
    palette: [
      { name: "Sky", hex: "#457B9D" },
      { name: "Khaki", hex: "#E9C46A" },
      { name: "Clean", hex: "#FFFFFF" },
      { name: "Dark", hex: "#1D3557" },
    ],
    priceRange: "Rp 230rb - 335rb / Set",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
    lookId: "kantor_pria_ac_menengah",
    modestTag: "Menswear Modern",
  },
];

export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  const [selectedScenario, setSelectedScenario] = useState<HeroScenario>(HERO_SCENARIOS[0]);
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const renderSpecimenCard = (isMobile = false) => (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedScenario.id}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`relative w-full ${
          isMobile ? "max-w-md mx-auto my-2" : "max-w-sm sm:max-w-md"
        } bg-white rounded-3xl p-3.5 sm:p-5 shadow-xl sm:shadow-2xl border border-[#D7CABC] space-y-3 sm:space-y-4 text-left`}
      >
        {/* Visual Image Banner with Model and Dynamic Floating Badges */}
        <div
          className={`relative w-full ${
            isMobile ? "aspect-[4/3] max-h-[250px]" : "aspect-[4/5]"
          } rounded-2xl bg-[#E8DFD1] overflow-hidden group`}
        >
          <Image
            src={selectedScenario.image}
            alt={selectedScenario.title}
            fill
            sizes="(max-width: 768px) 95vw, 400px"
            className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#181A18]/90 via-transparent to-black/25 pointer-events-none" />

          {/* Top Floating Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-[#181A18]/85 text-[#FAF8F5] text-[8px] sm:text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border border-white/10 shadow-sm">
              <span>{selectedScenario.icon}</span>
              <span>{selectedScenario.pillLabel}</span>
            </div>

            <span
              className={`px-2 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-sm ${selectedScenario.badgeColor}`}
            >
              {selectedScenario.badge}
            </span>
          </div>

          {/* Floating Modest / Style Indicator Pin */}
          <div className="absolute top-1/4 left-3 pointer-events-none">
            <div className="px-2 py-0.5 rounded-lg bg-white/95 text-[#181A18] text-[8px] font-mono font-bold uppercase shadow-lg border border-black/10 flex items-center gap-1 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
              <span>{selectedScenario.modestTag}</span>
            </div>
          </div>

          {/* Bottom Title & Specs on Image */}
          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white space-y-0.5 sm:space-y-1">
            <div className="text-[8px] sm:text-[9px] font-mono font-bold uppercase text-terracotta-400 tracking-widest">
              FORMULA REKOMENDASI AI
            </div>
            <h4 className="font-serif font-bold text-base sm:text-xl leading-tight text-white">
              {selectedScenario.title}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-sand-200 line-clamp-1">
              {selectedScenario.material}
            </p>
          </div>
        </div>

        {/* Card Bottom: Color Harmony Swatches & Price */}
        <div className="space-y-2 pt-0.5">
          <div className="flex items-center justify-between gap-2 text-xs">
            <div>
              <div className="text-[9px] font-mono text-[#A89582] uppercase tracking-wider font-bold">
                PALET WARNA HARMONIS
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {selectedScenario.palette.map((color, idx) => (
                  <div
                    key={idx}
                    title={color.name}
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full border border-black/10 shadow-xs"
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
                <span className="text-[9px] sm:text-[10px] font-mono text-[#181A18] font-bold ml-1">
                  {selectedScenario.skinToneMatch.split(" ")[2] || "Flattering"}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[8px] sm:text-[9px] font-mono text-sand-500 uppercase">
                ESTIMASI BELANJA
              </div>
              <div className="text-xs font-mono font-bold text-charcoal-900 mt-0.5">
                {selectedScenario.priceRange}
              </div>
            </div>
          </div>

          {/* Direct CTA link to Studio */}
          <Link
            href={`/studio?look=${selectedScenario.lookId}`}
            className="w-full py-2 px-3 rounded-xl bg-sand-100 hover:bg-charcoal-900 hover:text-white border border-sand-300 text-charcoal-900 font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            <span>Buka &amp; Kustomisasi di Studio</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return (
    <>
      <section className="relative pt-4 pb-8 sm:pt-14 sm:pb-16 border-b border-[#E8DFD1] overflow-hidden bg-[#FAF8F5]">
        {/* Background Architectural Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#D7CABC_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

        {/* Ambient Warm Glows */}
        <div className="absolute top-10 right-10 w-80 h-80 sm:w-[450px] sm:h-[450px] bg-terracotta-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 sm:w-[350px] sm:h-[350px] bg-[#E8DFD1]/60 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-center"
          >
            {/* Left Column: Hooks, Headlines & Interactive Selector */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              {/* Micro Identity Pill */}
              <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#D7CABC] shadow-2xs">
                  <span className="w-2 h-2 rounded-full bg-terracotta-500 animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase text-charcoal-900">
                    AI STYLIST IKLIM TROPIS &amp; WARNA KULIT NUSANTARA
                  </span>
                </div>
              </motion.div>

              {/* Emotional & Catchy Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-serif text-[26px] xs:text-3xl sm:text-5xl lg:text-[56px] font-bold tracking-tight text-[#181A18] leading-[1.12] sm:leading-[1.08]"
              >
                Bingung Mau Pakai Baju Apa Hari Ini Biar{" "}
                <span className="italic font-normal text-terracotta-500 underline decoration-[#D7CABC] underline-offset-8">
                  Nggak Gerah
                </span>{" "}
                di 33°C?
              </motion.h1>

              {/* Sub-headline: Value Proposition */}
              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-base text-[#181A18]/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                look.u AI meracik formula pakaian katun rayon &amp; linen bernapas tinggi, 100% ramah hijab &amp; unisex, serta disesuaikan dengan undertone kulitmu dalam 1 detik.
              </motion.p>

              {/* 1-Tap Live Climate & Scenario Switcher (THE 3-SECOND AHA! MOMENT) */}
              <motion.div variants={itemVariants} className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-sand-500 uppercase tracking-wider">
                    ⚡ SENTUH UNTUK SIMULASI OOTD OTOMATIS:
                  </span>
                  <span className="text-[10px] font-mono text-terracotta-600 font-semibold hidden sm:inline">
                    LIVE AI PREVIEW
                  </span>
                </div>

                {/* Switcher Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {HERO_SCENARIOS.map((sc) => {
                    const isSelected = selectedScenario.id === sc.id;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedScenario(sc)}
                        className={`p-2.5 rounded-xl sm:rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? "bg-white border-charcoal-900 shadow-md ring-1 ring-charcoal-900"
                            : "bg-white/70 hover:bg-white border-sand-300 text-charcoal-900/70 hover:text-charcoal-900"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-base sm:text-lg">{sc.icon}</span>
                          {isSelected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                          )}
                        </div>
                        <div>
                          <div className={`text-xs font-bold leading-tight ${isSelected ? "text-charcoal-900" : "text-charcoal-900/80"}`}>
                            {sc.pillLabel}
                          </div>
                          <div className="text-[10px] text-sand-500 font-mono mt-0.5 line-clamp-1">
                            {sc.badge}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Mobile-Only Live Specimen Card (Above-The-Fold in 2 Seconds!) */}
              <div className="block lg:hidden pt-2">
                {renderSpecimenCard(true)}
              </div>

              {/* Single Dominant Primary CTA + Engaging Personal Color Hook */}
              <motion.div
                variants={itemVariants}
                className="space-y-2.5 pt-2"
              >
                <Link
                  href={`/studio?look=${selectedScenario.lookId}`}
                  className="w-full sm:w-auto py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md group"
                >
                  <Sparkles className="w-4 h-4 text-terracotta-400 group-hover:rotate-12 transition-transform" />
                  <span>Mulai Styling Outfit Kamu (Gratis)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Secondary Discovery Link (Zero Dilemma, Contextual Helper) */}
                <div className="flex items-center justify-center lg:justify-start gap-1.5 text-xs pt-0.5">
                  <span className="text-charcoal-900/60 font-medium text-[11px] sm:text-xs">
                    Belum tahu palet warna kulitmu?
                  </span>
                  <button
                    type="button"
                    onClick={onOpenQuiz}
                    className="font-bold text-terracotta-600 hover:text-charcoal-900 underline underline-offset-4 flex items-center gap-0.5 transition-colors text-[11px] sm:text-xs"
                  >
                    <span>Cek Personal Color (60s)</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>

              {/* Instant Reassurance Trust Chips */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1 text-[9px] sm:text-[10px] font-mono text-sand-500 uppercase tracking-wider"
              >
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  100% GRATIS • TANPA LOGIN
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-terracotta-500" />
                  KATUN RAYON &amp; LINEN ADEM
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3 text-blue-600" />
                  SHOPEE &amp; TOKOPEDIA RESMI
                </span>
              </motion.div>
            </div>

            {/* Right Column: Live Interactive Specimen Card (Desktop only, mobile renders above) */}
            <motion.div
              variants={itemVariants}
              className="hidden lg:flex lg:col-span-5 relative w-full justify-center mt-2 lg:mt-0"
            >
              {renderSpecimenCard(false)}
              {/* Decorative Background Offset Layer */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-terracotta-500/20 to-transparent rounded-3xl -rotate-2 -z-10 blur-sm pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>

        {/* High-Trust Editorial Curator Strip */}
        <div className="mt-8 sm:mt-12 pt-6 border-t border-sand-200/80 flex flex-wrap items-center justify-between gap-4 sm:gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left: Official Marketplace Curator */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EE4D2D]/10 text-[#EE4D2D] flex items-center justify-center font-bold text-xs border border-[#EE4D2D]/20">
              🛍️
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-900 font-serif">Kurator Toko Resmi</div>
              <div className="text-[10px] font-mono text-sand-500">Shopee Mall &amp; Tokopedia Official Store 4.8★</div>
            </div>
          </div>

          {/* Center: Material Quality */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
              🌿
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-900 font-serif">100% Material Adem Tropis</div>
              <div className="text-[10px] font-mono text-sand-500">Katun Rayon Twill, Linen Euro &amp; Crinkle</div>
            </div>
          </div>

          {/* Right: Privacy & Free */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-charcoal-900/5 text-charcoal-900 flex items-center justify-center font-bold text-xs border border-charcoal-900/10">
              🔒
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-900 font-serif">Privasi Terjamin</div>
              <div className="text-[10px] font-mono text-sand-500">Bebas Akses Tanpa Registrasi Paksa</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {isWaitlistOpen && <WaitlistModal onClose={() => setIsWaitlistOpen(false)} />}
    </>
  );
}
