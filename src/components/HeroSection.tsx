"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWeather } from "@/hooks/useWeather";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onOpenQuiz?: () => void;
}

const DESKTOP_HERO_SLIDES = [
  {
    id: "hero_01",
    title: "Casual Campus Chiffon",
    subjudul: "Adem Seharian di Kampus",
    tagline: "Kemeja katun linen oversized berpori sejuk dan kulot broken white santun.",
    suhu: "33°C Terik Tropis",
    climateBadge: "AIRY TROPICAL · OPTIMAL 33°C",
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=900&auto=format&fit=crop&q=85",
    swatches: [
      { name: "Cream Oat", hex: "#F5EBE0" },
      { name: "Sage Green", hex: "#84A98C" },
      { name: "Broken White", hex: "#FAEDCD" },
    ],
    undertoneTag: "Sawo Matang & Kuning Langsat",
    fabricNote: "Katun Linen Crinkle · Anti-Kusut",
    priceRange: "Rp 180rb - 260rb",
  },
  {
    id: "hero_02",
    title: "Metropolitan Oxford & Chino",
    subjudul: "Smart Executive Menswear",
    tagline: "Kemeja oxford breathable dengan deconstructed summer blazer dan chino rapi.",
    suhu: "22°C AC & 33°C Luar",
    climateBadge: "INDOOR AC / WORKWEAR",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=85",
    swatches: [
      { name: "Sky Blue", hex: "#87CEEB" },
      { name: "Tailored Navy", hex: "#1B2A4A" },
      { name: "Khaki Sand", hex: "#C2B280" },
    ],
    undertoneTag: "Semua Tone Kulit Pria",
    fabricNote: "Katun Oxford Pin-Point · Sejuk",
    priceRange: "Rp 280rb - 390rb",
  },
  {
    id: "hero_03",
    title: "Airy Graphic Slip & Knit",
    subjudul: "Parisian Minimalist Summer",
    tagline: "Gaun santai katun bernapas dengan kardigan rajut tipis hitam untuk mobilitas kafe.",
    suhu: "31°C Lembap Sore",
    climateBadge: "AIRY TROPICAL · OPTIMAL 31°C",
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=900&auto=format&fit=crop&q=85",
    swatches: [
      { name: "Broken White", hex: "#FDFBF7" },
      { name: "Onyx Black", hex: "#181A18" },
      { name: "Graphite", hex: "#2C2C2C" },
    ],
    undertoneTag: "Universal Semua Warna Kulit",
    fabricNote: "Katun Rayon Combed 30s Sejuk",
    priceRange: "Rp 190rb - 280rb",
  },
  {
    id: "hero_04",
    title: "Ice Blue Silk Draping",
    subjudul: "Formal Cocktail Gala",
    tagline: "Gaun sutra lipit warna ice blue berpadu bolero bulu abu-abu lembut untuk pesta malam.",
    suhu: "20°C AC Gala Malam",
    climateBadge: "INDOOR AC / EVENING",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&auto=format&fit=crop&q=85",
    swatches: [
      { name: "Ice Blue", hex: "#A8C7C7" },
      { name: "Misty Grey", hex: "#8A929A" },
      { name: "Gold Leaf", hex: "#D4AF37" },
    ],
    undertoneTag: "Cool Summer & Putih Gading",
    fabricNote: "Silk Satin Twill Halus & Dingin",
    priceRange: "Rp 350rb - 520rb",
  },
];

export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  const { weather } = useWeather();
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [savedLooks, setSavedLooks] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const local = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
        setSavedLooks(local.map((item: any) => item.id || item.title));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const currentHero = DESKTOP_HERO_SLIDES[activeSlide];
  const isSaved = savedLooks.includes(currentHero.id) || savedLooks.includes(currentHero.title);

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      try {
        const local = JSON.parse(localStorage.getItem("looku_saved_outfits") || "[]");
        let next;
        if (isSaved) {
          next = local.filter((item: any) => item.id !== currentHero.id && item.title !== currentHero.title);
        } else {
          next = [...local, currentHero];
        }
        localStorage.setItem("looku_saved_outfits", JSON.stringify(next));
        setSavedLooks(next.map((item: any) => item.id || item.title));
        window.dispatchEvent(new Event("looku_saved_updated"));
      } catch (err) {
        // ignore
      }
    }
  };

  return (
    <section className="relative w-full bg-[#FAF8F5]">
      {/* ============================================================ */}
      {/* 1. UTILITY CLIMATE STRIP (Satu Baris Bersih ala Uniqlo)      */}
      {/* ============================================================ */}
      <div className="w-full h-9 px-4 lg:px-8 bg-[#EFECE6] border-b border-[#181A18]/10 flex items-center justify-between text-[11px] select-none">
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0 animate-pulse" />
          <span className="font-semibold tracking-wider uppercase text-[#181A18]">
            {weather.location} {weather.temperature}°C · {weather.condition}
          </span>
          <span className="text-[#181A18]/30">|</span>
          <span className="text-[#181A18]/70 truncate">SIRKULASI ADEM OPTIMAL (UJI TROPIS 33°C)</span>
        </div>
        <button
          type="button"
          onClick={() => {
            if (onOpenQuiz) onOpenQuiz();
            else router.push("/?quiz=true");
          }}
          className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-2 text-[#181A18] shrink-0 ml-2 hover:text-terracotta-600 transition-colors"
        >
          UBAH FILTER
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. DESKTOP HERO SPLIT LAYOUT (5 Kolom Kiri : 7 Kolom Kanan)  */}
      {/* ============================================================ */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10 lg:py-16">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 lg:items-center">
          
          {/* Kolom Kiri (5 Kolom): Tipografi Hero Editorial & Tombol Tegas */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <div className="inline-flex items-center gap-2">
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-[0.2em] bg-[#181A18] text-[#FAF8F5]">
                AI Daily Curated · 0{activeSlide + 1} / 0{DESKTOP_HERO_SLIDES.length}
              </span>
              <span className="text-xs font-mono text-[#8C5A3C] uppercase tracking-wider font-semibold">
                Look.u Luxe
              </span>
            </div>

            <h1 className="font-serif text-4xl lg:text-5xl xl:text-6xl text-[#181A18] font-normal tracking-tight leading-[1.12]">
              Personal Stylist AI.<br />
              <span className="italic font-light">Didesain Khusus Tropis.</span>
            </h1>

            <p className="font-sans text-sm lg:text-base text-[#181A18]/75 font-normal leading-relaxed max-w-md">
              Formula kurasi pakaian adem berpori mikro, 100% modest compliant, dan selaras dengan warna kulit nusantara untuk cuaca terik 33°C hingga ruang ber-AC.
            </p>

            {/* Grup Tombol CTA Bersegi Tegas ala Uniqlo */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                href="/studio"
                className="h-12 px-8 bg-[#181A18] text-[#FAF8F5] text-xs font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-terracotta-600 active:opacity-90 transition-all rounded-none shadow-sm"
              >
                <span>✦ Racik OOTD Sekarang</span>
                <span>→</span>
              </Link>
              
              <button
                type="button"
                onClick={onOpenQuiz}
                className="h-12 px-6 border border-[#181A18]/25 bg-transparent text-[#181A18] text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#181A18]/5 transition-colors rounded-none"
              >
                Tes Warna (60s)
              </button>

              <Link
                href="/lookbook"
                className="h-12 px-6 border border-[#181A18]/25 bg-transparent text-[#181A18] text-[11px] font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#181A18]/5 transition-colors rounded-none"
              >
                Lookbook ↗
              </Link>
            </div>

            {/* Quick Slide Switcher Tabs */}
            <div className="pt-4 border-t border-[#181A18]/10 flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#181A18]/50 mr-2">
                PILIH GAYA:
              </span>
              {DESKTOP_HERO_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-7 px-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-all rounded-none ${
                    activeSlide === idx
                      ? "bg-[#181A18] text-white"
                      : "bg-[#EFECE6] text-[#181A18]/70 hover:text-[#181A18]"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Kolom Kanan (7 Kolom): Hero Showcase Card dengan Uniqlo Clean Geometry */}
          <div className="mt-8 lg:mt-0 lg:col-span-7">
            <div className="bg-white border border-[#181A18]/10 p-3 sm:p-4 rounded-none shadow-sm">
              
              {/* Kanvas Foto 4:5 Bebas Clutter */}
              <div className="relative w-full aspect-[4/5] max-h-[580px] bg-[#EFECE6] overflow-hidden">
                <Image
                  src={currentHero.image}
                  alt={currentHero.title}
                  fill
                  priority
                  className="object-cover object-top transition-transform duration-700 hover:scale-[1.02]"
                  sizes="(max-width: 1024px) 100vw, 700px"
                />

                {/* HANYA 1 Badge Iklim Tegas di Kiri Atas */}
                <div className="absolute top-3.5 left-3.5 bg-[#181A18]/90 backdrop-blur-sm text-[#FAF8F5] px-3 py-1 text-[10px] font-bold font-mono tracking-widest uppercase shadow-xs">
                  {currentHero.climateBadge}
                </div>

                {/* Tombol Wishlist Minimalis di Kanan Atas */}
                <button
                  type="button"
                  aria-label="Simpan Outfit"
                  onClick={toggleSave}
                  className="absolute top-3.5 right-3.5 w-8 h-8 bg-white/85 backdrop-blur-sm flex items-center justify-center text-[#181A18] shadow-xs hover:scale-110 active:scale-95 transition-all"
                >
                  <Heart className={`w-4 h-4 ${isSaved ? "fill-[#181A18] text-[#181A18]" : "text-stone-700"}`} />
                </button>

                {/* Thin 1px Slide Progress Bar at the Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 flex">
                  <div
                    className="h-full bg-[#181A18] transition-all duration-300"
                    style={{
                      width: `${100 / DESKTOP_HERO_SLIDES.length}%`,
                      marginLeft: `${(activeSlide * 100) / DESKTOP_HERO_SLIDES.length}%`,
                    }}
                  />
                </div>
              </div>

              {/* Metadata Bersih di Luar dan di Bawah Foto (Uniqlo Architecture) */}
              <div className="pt-3.5 pb-2 px-1 border-b border-[#181A18]/10 flex items-start justify-between gap-4">
                <div>
                  {/* Dot Swatches Warna Harmonis */}
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {currentHero.swatches.map((warna, idx) => (
                      <span
                        key={idx}
                        className="w-3.5 h-3.5 rounded-full border border-[#181A18]/25 shadow-2xs"
                        style={{ backgroundColor: warna.hex }}
                        title={warna.name}
                      />
                    ))}
                    <span className="text-[10px] uppercase tracking-wider text-[#181A18]/60 ml-1.5 font-medium">
                      {currentHero.undertoneTag}
                    </span>
                  </div>

                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#181A18] leading-snug">
                    {currentHero.title}
                  </h2>
                  <p className="text-xs text-[#181A18]/65 mt-0.5 line-clamp-1">
                    {currentHero.tagline}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] uppercase tracking-wider text-[#181A18]/50 block font-mono">
                    Estimasi Set
                  </span>
                  <span className="text-sm sm:text-base font-bold font-mono text-[#181A18]">
                    {currentHero.priceRange}
                  </span>
                </div>
              </div>

              {/* Quick Actions Bawah Foto */}
              <div className="pt-3 px-1 flex items-center justify-between text-xs">
                <span className="text-[11px] font-mono text-[#181A18]/60">
                  Bahan: <strong className="text-[#181A18]">{currentHero.fabricNote}</strong>
                </span>
                <Link
                  href="/studio"
                  className="text-[11px] font-bold uppercase tracking-wider text-terracotta-600 hover:text-[#181A18] flex items-center gap-1 transition-colors"
                >
                  Kustomisasi di Studio ➔
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. THE TROPICAL EDIT (Uniqlo-Grade Fabric & Climate Cards)    */}
      {/* ============================================================ */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-10 border-t border-[#181A18]/10">
        <div className="flex items-end justify-between mb-8 border-b border-[#181A18]/10 pb-4">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C5A3C] mb-1">
              Curated by AI
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#181A18] tracking-tight">
              The Tropical Edit — Koleksi Pilihan
            </h2>
          </div>
          <Link href="/lookbook" className="text-xs font-sans font-bold text-[#8C5A3C] hover:text-[#181A18] uppercase tracking-wider flex items-center gap-1.5 transition-colors">
            Lihat Semua (22) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {/* Strict Grid: 2-Col Mobile / 4-Col Desktop */}
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-6 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          {[
            {
              id: "trop-1",
              img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600",
              title: "Linen Camp Collar Shirt",
              climateBadge: "AIRY TROPICAL · OPTIMAL",
              swatches: ["#FAF6EE", "#8FA98D", "#D4A373"],
              undertoneTag: "Warm Spring",
              fabricNote: "Katun Rayon Twill · Sirkulasi Dingin",
              price: "Rp 189.000",
            },
            {
              id: "trop-2",
              img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
              title: "Wide-Leg Flowy Pants",
              climateBadge: "AIRY TROPICAL · OPTIMAL",
              swatches: ["#FAF6EE", "#D4A373", "#242724"],
              undertoneTag: "Warm Autumn",
              fabricNote: "Rayon Twill Premium · Potongan Loose",
              price: "Rp 215.000",
            },
            {
              id: "trop-3",
              img: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600",
              title: "Voal Paris Square Hijab",
              climateBadge: "AIRY TROPICAL · OPTIMAL",
              swatches: ["#FDFBF7", "#91AF90", "#DECBA6"],
              undertoneTag: "Semua Tone",
              fabricNote: "Voal Ultrafine · Ringan & Santun",
              price: "Rp 85.000",
            },
            {
              id: "trop-4",
              img: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600",
              title: "Biker Leather & Ruffle",
              climateBadge: "INDOOR AC / EVENING",
              swatches: ["#1C1C1E", "#2C3E50", "#6E6859"],
              undertoneTag: "Sawo Matang & Deep",
              fabricNote: "Breathable Vegan Leather · Cropped",
              price: "Rp 265.000",
            }
          ].map((item) => (
            <Link href="/studio" key={item.id} className="group flex flex-col bg-white border border-[#181A18]/10 p-2.5 sm:p-3 hover:shadow-md transition-all duration-300 rounded-none">
              {/* 1. Foto Rasio Mutlak 4:5 Kanvas Warm Stone */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EFECE6] rounded-none">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 50vw, 300px"
                />
                {/* 2. Badge Iklim/Bahan Persegi Tegas */}
                <div className="absolute top-2.5 left-2.5">
                  <span className="inline-block px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#181A18]/90 text-white shadow-xs">
                    {item.climateBadge}
                  </span>
                </div>
              </div>

              {/* 3. Dot Swatches Palet Warna Harmonis (3 Titik) */}
              <div className="flex items-center gap-1.5 mt-2.5 mb-1">
                {item.swatches.map((hex, idx) => (
                  <span
                    key={idx}
                    className="w-3 h-3 rounded-full border border-[#181A18]/20 shadow-2xs"
                    style={{ backgroundColor: hex }}
                  />
                ))}
                <span className="text-[10px] text-[#181A18]/50 ml-1 font-medium truncate">
                  {item.undertoneTag}
                </span>
              </div>

              {/* 4. Tipografi Terkunci (Anti Tinggi Belang) */}
              <h3 className="font-serif text-sm font-bold text-[#181A18] group-hover:text-terracotta-600 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#181A18]/60 line-clamp-1 mt-0.5">
                {item.fabricNote}
              </p>
              <p className="font-mono text-xs font-bold text-[#181A18] mt-2 pt-1 border-t border-[#181A18]/10">
                {item.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
