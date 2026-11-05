"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  Wind, 
  Sun, 
  Thermometer, 
  Palette, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  ShoppingBag, 
  Share2,
  SlidersHorizontal,
  ChevronRight
} from "lucide-react";

interface AtelierBentoGridProps {
  onOpenQuiz?: () => void;
}

const SKIN_TONE_DATA = {
  sawo_matang: {
    label: "Sawo Matang",
    undertone: "Warm Golden",
    colors: [
      { name: "Terracotta", hex: "#C86D51" },
      { name: "Warm Olive", hex: "#606C38" },
      { name: "Sand Dune", hex: "#DDA15E" },
      { name: "Deep Navy", hex: "#1D2D44" },
    ],
    tip: "Earth tone hangat memberi kontras alami yang membuat rona kulit sawo matang tampak segar bercahaya tanpa kusam."
  },
  kuning_langsat: {
    label: "Kuning Langsat",
    undertone: "Neutral Warm",
    colors: [
      { name: "Sage Green", hex: "#8FA98D" },
      { name: "Dusty Peach", hex: "#E09F84" },
      { name: "Soft Ivory", hex: "#FAF6EE" },
      { name: "Espresso", hex: "#3E2723" },
    ],
    tip: "Warna sage dan dusty peach menyeimbangkan pigmen kuning kulit sehingga rona wajah terlihat bersih dan cerah."
  },
  putih_gading: {
    label: "Putih Gading",
    undertone: "Cool Porcelain",
    colors: [
      { name: "Sky Blue", hex: "#8DA9C4" },
      { name: "Dusty Rose", hex: "#D8A48F" },
      { name: "Soft Charcoal", hex: "#2B2D42" },
      { name: "Pearl Cream", hex: "#F4F1DE" },
    ],
    tip: "Padukan dengan pastel sejuk dan kontras lembut untuk mencegah kulit pucat akibat paparan terik sinar matahari tropis."
  },
  eksotis_tan: {
    label: "Eksotis Tropis",
    undertone: "Rich Bronze",
    colors: [
      { name: "Burnt Orange", hex: "#BC4749" },
      { name: "Mustard Gold", hex: "#C98A2C" },
      { name: "Rich Sand", hex: "#D4A373" },
      { name: "Pure White", hex: "#FFFFFF" },
    ],
    tip: "Warna putih bersih dan gold mustard menciptakan efek siluet tegas nan mewah pada kulit sawo matang pekat."
  }
};

type SkinToneKey = keyof typeof SKIN_TONE_DATA;

export default function AtelierBentoGrid({ onOpenQuiz }: AtelierBentoGridProps) {
  // State untuk Tile 1: Mode Cuaca Tropis
  const [climateMode, setClimateMode] = useState<"outdoor" | "ac">("outdoor");
  
  // State untuk Tile 2: Tone Kulit Aktif
  const [activeSkinTone, setActiveSkinTone] = useState<SkinToneKey>("sawo_matang");

  const currentSkinData = SKIN_TONE_DATA[activeSkinTone];

  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#181A18]/10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 border-b border-[#181A18]/10 pb-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#181A18]/5 border border-[#181A18]/10 text-[#8C5A3C] text-[10px] font-mono font-bold uppercase tracking-[0.2em] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#8C5A3C]" />
              Context-Aware Architecture
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#181A18] tracking-tight leading-tight">
              The LookU Style Matrix
            </h2>
            <p className="font-sans text-xs sm:text-sm text-[#181A18]/65 mt-3 leading-relaxed">
              Logika berpakaian cerdas yang disesuaikan dengan iklim tropis lembap 33°C, 
              undertone kulit khas Nusantara, dan kalkulasi anggaran belanja marketplace lokal tanpa biaya tersembunyi.
            </p>
          </div>

          <div className="mt-6 md:mt-0 flex items-center gap-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#181A18]/50">
              5 Dimensi Kurasi
            </span>
            <div className="h-4 w-[1px] bg-[#181A18]/20" />
            <Link
              href="/studio"
              className="text-xs font-sans font-bold text-[#8C5A3C] hover:text-[#181A18] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors"
            >
              Buka Studio AI <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* BENTO GRID: Asymmetric 3-Column Atelier Layout              */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ============================================================ */}
          {/* TILE 1 (Hero Bento - Col Span 2): Climate & Breathability    */}
          {/* ============================================================ */}
          <div className="lg:col-span-2 relative overflow-hidden bg-[#181A18] text-[#FAF8F5] p-7 sm:p-9 flex flex-col justify-between min-h-[420px] group">
            {/* Background Texture Drape */}
            <div className="absolute inset-0 z-0">
              <Image
                src="https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=900&auto=format&fit=crop&q=80"
                alt="Organic Breathable Linen Weave Texture"
                fill
                className="object-cover opacity-25 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000 ease-out"
                sizes="(max-width: 1024px) 100vw, 850px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181A18] via-[#181A18]/70 to-[#181A18]/40" />
            </div>

            {/* Top Row: Climate Switcher Pills */}
            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-white/10 backdrop-blur-md text-[10px] font-mono uppercase tracking-widest text-[#D4A373] border border-white/15">
                  Climate Engine v2.4
                </span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-white/70">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Live Jakarta
                </span>
              </div>

              {/* Toggle Tab */}
              <div className="flex items-center bg-black/40 backdrop-blur-md p-1 border border-white/10 rounded-full">
                <button
                  type="button"
                  onClick={() => setClimateMode("outdoor")}
                  className={`px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full transition-all ${
                    climateMode === "outdoor"
                      ? "bg-[#D4A373] text-[#181A18] shadow-xs"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Panas Tropis 33°C
                </button>
                <button
                  type="button"
                  onClick={() => setClimateMode("ac")}
                  className={`px-3 py-1 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full transition-all ${
                    climateMode === "ac"
                      ? "bg-[#D4A373] text-[#181A18] shadow-xs"
                      : "text-white/60 hover:text-white"
                  }`}
                >
                  Ruang AC 22°C
                </button>
              </div>
            </div>

            {/* Mid: Content Dynamic to Switcher */}
            <div className="relative z-10 my-8 max-w-xl">
              <p className="text-[11px] font-mono font-bold uppercase tracking-[0.2em] text-[#D4A373] mb-2 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5" />
                {climateMode === "outdoor" ? "Termal Tropis Terbuka" : "Adaptasi Suhu AC & Formalitas"}
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal leading-tight text-white tracking-tight">
                {climateMode === "outdoor"
                  ? "Sirkulasi Udara 98% Bebas Pengap dengan Katun Rayon & Pure Linen."
                  : "Struktur Blazer Unstructured Ringan: Hangat di Meja Rapat, Tetap Bernapas di Luar."}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/75 mt-3 leading-relaxed">
                {climateMode === "outdoor"
                  ? "Dieliminasi dari furing poliester sintetis yang memerangkap keringat. Setiap serat divalidasi memiliki sirkulasi udara mikro (breathability score 98/100)."
                  : "Transisi mulus antara dinginnya ruangan kantor SCBD dan teriknya jalan raya Jakarta tanpa perlu berganti pakaian total."}
              </p>
            </div>

            {/* Bottom Row: 3 Micro Metrics */}
            <div className="relative z-10 pt-6 border-t border-white/15 grid grid-cols-3 gap-4">
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Airflow Index</p>
                <p className="text-lg sm:text-xl font-serif font-semibold text-[#D4A373] mt-0.5">
                  {climateMode === "outdoor" ? "98% Optimal" : "85% Balanced"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Gramasi Bahan (GSM)</p>
                <p className="text-lg sm:text-xl font-serif font-semibold text-white mt-0.5">
                  {climateMode === "outdoor" ? "120–140 GSM" : "180–220 GSM"}
                </p>
              </div>
              <div>
                <p className="text-[9px] font-mono uppercase tracking-wider text-white/50">Kerapatan Modest</p>
                <p className="text-lg sm:text-xl font-serif font-semibold text-white mt-0.5">
                  100% Anti-Terawang
                </p>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* TILE 2 (Col Span 1): Personal Color & Undertone Matrix       */}
          {/* ============================================================ */}
          <div className="bg-[#FAF8F5] border border-[#181A18]/15 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Color Analytics
                </span>
                <Palette className="w-4 h-4 text-[#8C5A3C]" />
              </div>

              <h3 className="font-serif text-2xl text-[#181A18] tracking-tight">
                Spektrum Undertone Kulit
              </h3>
              <p className="font-sans text-xs text-[#181A18]/65 mt-1.5 leading-relaxed">
                Pilih rona kulitmu untuk melihat 4 palet outfit komplementer yang memancarkan kilau alami:
              </p>

              {/* Selector Chips */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {(Object.keys(SKIN_TONE_DATA) as SkinToneKey[]).map((key) => {
                  const item = SKIN_TONE_DATA[key];
                  const isSelected = activeSkinTone === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveSkinTone(key)}
                      className={`px-3 py-2 text-left text-xs font-sans transition-all border ${
                        isSelected
                          ? "bg-[#181A18] text-white border-[#181A18] font-bold shadow-xs"
                          : "bg-white text-[#181A18]/80 border-[#181A18]/15 hover:border-[#181A18]/40"
                      }`}
                    >
                      <span className="block truncate">{item.label}</span>
                      <span className={`block text-[9px] font-mono uppercase tracking-wider ${isSelected ? "text-[#D4A373]" : "text-[#181A18]/45"}`}>
                        {item.undertone}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Live Palette Display */}
              <div className="mt-5 p-3.5 bg-white border border-[#181A18]/10">
                <p className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#181A18]/50 mb-2">
                  Palet Harmonis: {currentSkinData.label}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {currentSkinData.colors.map((c, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <span
                        className="w-full aspect-square rounded-sm border border-black/10 shadow-2xs transition-transform hover:scale-105"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                      <span className="text-[9px] font-sans text-[#181A18]/60 mt-1 truncate max-w-full text-center">
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] font-sans text-[#181A18]/70 mt-3 pt-2.5 border-t border-[#181A18]/10 leading-relaxed italic">
                  "{currentSkinData.tip}"
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button
              type="button"
              onClick={onOpenQuiz}
              className="mt-6 w-full py-3 bg-[#181A18] text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#8C5A3C] transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D4A373]" />
              Ambil Color Diagnostic (1 Menit)
            </button>
          </div>

          {/* ============================================================ */}
          {/* TILE 3 (Col Span 1): 1-Tap Occasion & Vibe Switcher          */}
          {/* ============================================================ */}
          <div className="bg-[#FAF8F5] border border-[#181A18]/15 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Occasion Engine
                </span>
                <SlidersHorizontal className="w-4 h-4 text-[#8C5A3C]" />
              </div>

              <h3 className="font-serif text-2xl text-[#181A18] tracking-tight">
                Skenario Aktivitas Harian
              </h3>
              <p className="font-sans text-xs text-[#181A18]/65 mt-1.5 leading-relaxed">
                Pilih kebutuhan acaramu hari ini dan biarkan kurator AI menyusun proporsinya:
              </p>

              {/* 4 Clickable Skenario Cards */}
              <div className="space-y-2.5 mt-5">
                {[
                  {
                    icon: "🏢",
                    title: "SCBD Executive",
                    spec: "Kemeja Oxford + Relaxed Pleated Slacks",
                    tag: "Ruang AC 20–24°C",
                    href: "/studio?occasion=office"
                  },
                  {
                    icon: "☕",
                    title: "Senopati Brunch",
                    spec: "Linen Camp Collar + Sand Loafers",
                    tag: "Semi-Kasual Hangat",
                    href: "/studio?occasion=dating"
                  },
                  {
                    icon: "🛹",
                    title: "Blok M Streetwear",
                    spec: "Heavyweight Boxy Tee + Parachute Cargo",
                    tag: "Outdoor Tropis",
                    href: "/studio?occasion=weekend"
                  },
                  {
                    icon: "🧕",
                    title: "Modest Kampus & Office",
                    spec: "Voal Ultrafine + Flowy A-Line Culottes",
                    tag: "Sopan & Bernapas",
                    href: "/studio?occasion=campus"
                  }
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="group/item flex items-center justify-between p-3 bg-white border border-[#181A18]/10 hover:border-[#181A18] hover:shadow-xs transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl shrink-0">{item.icon}</span>
                      <div>
                        <p className="font-serif text-sm font-semibold text-[#181A18] group-hover/item:text-[#8C5A3C] transition-colors">
                          {item.title}
                        </p>
                        <p className="text-[11px] font-sans text-[#181A18]/60 line-clamp-1">
                          {item.spec}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#181A18]/30 group-hover/item:text-[#181A18] group-hover/item:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>

            <p className="text-[10px] font-mono text-[#181A18]/50 mt-5 uppercase tracking-wider text-center">
              1.000+ Formula Outfit Terkalibrasi
            </p>
          </div>

          {/* ============================================================ */}
          {/* TILE 4 (Col Span 1): Smart Budget & Marketplace Matcher     */}
          {/* ============================================================ */}
          <div className="bg-[#FAF8F5] border border-[#181A18]/15 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Budget Matrix
                </span>
                <ShoppingBag className="w-4 h-4 text-[#8C5A3C]" />
              </div>

              <h3 className="font-serif text-2xl text-[#181A18] tracking-tight">
                Kurasi Anggaran Jujur
              </h3>
              <p className="font-sans text-xs text-[#181A18]/65 mt-1.5 leading-relaxed">
                Tampilan mewah selevel ritel high-street global dengan harga bersahabat langsung dari marketplace lokal:
              </p>

              {/* Cart Simulation Card */}
              <div className="mt-5 p-4 bg-white border border-[#181A18]/10 divide-y divide-[#181A18]/10">
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="font-sans text-[#181A18]/70">Atasan Rayon Breathable</span>
                  <span className="font-mono font-semibold text-[#181A18]">Rp 75.000</span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="font-sans text-[#181A18]/70">Bawahan Linen Loose Fit</span>
                  <span className="font-mono font-semibold text-[#181A18]">Rp 125.000</span>
                </div>
                <div className="flex items-center justify-between py-2 text-xs">
                  <span className="font-sans text-[#181A18]/70">Aksesori / Voal Berpori</span>
                  <span className="font-mono font-semibold text-[#181A18]">Rp 45.000</span>
                </div>
                <div className="flex items-center justify-between pt-3 pb-1">
                  <div>
                    <span className="block font-serif text-sm font-bold text-[#181A18]">Total 1 Set Lengkap</span>
                    <span className="block text-[9px] font-mono text-emerald-700 font-semibold uppercase">Tanpa Markup Butik</span>
                  </div>
                  <span className="font-mono text-base font-bold text-[#8C5A3C]">
                    Rp 245.000
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[11px] text-[#181A18]/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Terhubung ke tautan resmi Shopee & Tokopedia terverifikasi.</span>
              </div>
            </div>

            <Link
              href="/lookbook"
              className="mt-6 w-full py-3 border border-[#181A18] text-[#181A18] font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#181A18] hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              Lihat Katalog Terjangkau <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* ============================================================ */}
          {/* TILE 5 (Col Span 1): 9:16 Story Card Studio                  */}
          {/* ============================================================ */}
          <div className="bg-[#FAF8F5] border border-[#181A18]/15 p-7 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.18em] text-[#8C5A3C]">
                  Story Studio
                </span>
                <Share2 className="w-4 h-4 text-[#8C5A3C]" />
              </div>

              <h3 className="font-serif text-2xl text-[#181A18] tracking-tight">
                9:16 Instagram Story
              </h3>
              <p className="font-sans text-xs text-[#181A18]/65 mt-1.5 leading-relaxed">
                Ekspor outfit pilihanmu menjadi story card vertikal berestetika majalah editorial dalam 1-klik:
              </p>

              {/* Visual 9:16 Mini Preview Frame */}
              <div className="mt-5 relative w-full aspect-[16/10] bg-[#181A18] text-[#FAF8F5] p-3.5 flex flex-col justify-between overflow-hidden group/story">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80"
                  alt="Story Export Aesthetic"
                  fill
                  className="object-cover opacity-40 mix-blend-overlay group-hover/story:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
                <div className="relative z-10 flex items-center justify-between text-[9px] font-mono tracking-widest text-[#D4A373] uppercase">
                  <span>LOOKU ATELIER</span>
                  <span>9:16 OOTD</span>
                </div>
                <div className="relative z-10">
                  <p className="font-serif text-base text-white font-medium leading-snug">
                    Minimalist Slip Dress & Light Linen
                  </p>
                  <p className="text-[10px] font-sans text-white/70 mt-0.5">
                    Jakarta 33°C · Sawo Matang · Rp 265.000
                  </p>
                </div>
              </div>

              <p className="text-[11px] font-sans text-[#181A18]/65 mt-3 leading-relaxed">
                Siap dibagikan langsung ke Instagram Stories, Lemon8, atau Pinterest dengan proporsi tipografi Kinfolk.
              </p>
            </div>

            <Link
              href="/studio"
              className="mt-6 w-full py-3 bg-[#181A18] text-white font-sans text-xs font-bold uppercase tracking-widest hover:bg-[#8C5A3C] transition-colors flex items-center justify-center gap-2"
            >
              Buat & Ekspor Story Sekarang
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
