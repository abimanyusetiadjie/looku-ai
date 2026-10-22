"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useWeather } from "@/hooks/useWeather";
import { ArrowRight, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { TRENDING_LOOKS_FEED } from "@/lib/presets";

interface HeroSectionProps {
  onOpenQuiz?: () => void;
}

const DESKTOP_HERO_SLIDES = [
  {
    id: "hero_01",
    lookName: "Kampus Pagi",
    fabricName: "Linen Set",
    title: "Casual Campus Chiffon",
    skinTone: "Sawo Matang",
    priceRange: "Rp 180–260rb",
    image: "/hero-kampus-linen.jpg",
    studioParam: "kuliah_hijab_panas_hemat",
    studioHref: "/studio?vibe=earthy_hijab",
  },
  {
    id: "hero_02",
    lookName: "Linen Tropis Set",
    fabricName: "Camp Linen",
    title: "Old Money Coastal Linen",
    skinTone: "Kuning Langsat",
    priceRange: "Rp 195–280rb",
    image: "/hero-linen-cream.jpg",
    studioParam: "old_money_coastal",
    studioHref: "/studio?look=old_money_coastal",
  },
  {
    id: "hero_03",
    lookName: "SCBD Meeting",
    fabricName: "Smart Blazer",
    title: "SCBD Corporate Blazer",
    skinTone: "Semua Tone",
    priceRange: "Rp 290–420rb",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&auto=format&fit=crop&q=85",
    studioParam: "scbd_corporate_blazer",
    studioHref: "/studio?look=scbd_corporate_blazer",
  },
  {
    id: "hero_04",
    lookName: "Weekend Hangout",
    fabricName: "Camp Collar",
    title: "Coastal Linen Camp Collar",
    skinTone: "Sawo Matang & Tan",
    priceRange: "Rp 240–350rb",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&auto=format&fit=crop&q=85",
    studioParam: "old_money_coastal",
    studioHref: "/studio?look=old_money_coastal",
  },
  {
    id: "hero_05",
    lookName: "Senopati Brunch",
    fabricName: "Knit & Pleats",
    title: "Senopati Weekend Hangout",
    skinTone: "Putih Gading",
    priceRange: "Rp 210–310rb",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=85",
    studioParam: "senopati_brunch_knit",
    studioHref: "/studio?look=senopati_brunch_knit",
  },
];

export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  const { weather } = useWeather();
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [savedLooks, setSavedLooks] = useState<string[]>([]);

  // Living Lookbook Auto-Play (4.5s) dengan Pause-on-Hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % DESKTOP_HERO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

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
          next = [...local, { ...currentHero, items: (currentHero as any).items || [] }];
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
      {/* EDITORIAL HERO SECTION (Persis Desain Referensi Pilihan 1)    */}
      {/* ============================================================ */}
      <div className="max-w-[1320px] mx-auto px-6 sm:px-8 lg:px-12 pt-8 sm:pt-12 lg:pt-16 pb-16 lg:pb-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16 lg:items-center">
          
          {/* Kolom Kiri (7 Kolom): Tipografi Bersih, Eyebrow Cuaca, & Aksi Utama */}
          <div className="lg:col-span-7 flex flex-col justify-start">
            
            {/* 1. Eyebrow Cuaca Elegan (Persis Gambar 1, Tanpa Strip Kaku) */}
            <div className="flex items-center gap-2 mb-6 sm:mb-8 text-xs sm:text-[13px] lg:text-[14px] text-[#181A18]/80 select-none">
              <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 inline-block animate-pulse" />
              <span className="font-normal tracking-wide">
                {weather.location} {weather.temperature}°C &nbsp;•&nbsp; {weather.condition || "Mendung"} &nbsp;•&nbsp; Cocok bahan adem
              </span>
            </div>

            {/* 2. Judul Utama Serif Anggun */}
            <h1 className="font-serif text-[2.75rem] sm:text-5xl lg:text-[4rem] xl:text-[4.5rem] text-[#181A18] font-normal tracking-tight leading-[1.08] mb-6">
              Personal Stylist AI.<br />
              <span className="italic font-normal">Didesain Khusus Tropis.</span>
            </h1>

            {/* 3. Deskripsi Singkat & Hangat */}
            <p className="font-sans text-sm sm:text-base lg:text-[17px] text-[#181A18]/75 leading-relaxed max-w-lg mb-8 sm:mb-10 font-normal">
              OOTD adem untuk {weather.temperature}°C yang disesuaikan dengan warna kulit, siluet nyaman, serta suasana hari ini.
            </p>

            {/* 4. Hierarki Tombol Aksi (Persis Gambar 1) */}
            <div className="flex flex-col items-start gap-4 sm:gap-5">
              <Link
                href={currentHero.studioHref || `/studio?look=${currentHero.studioParam || currentHero.id}`}
                className="h-12 px-7 bg-[#181A18] hover:bg-terracotta-600 active:scale-[0.99] text-[#FAF8F5] text-xs sm:text-sm font-medium tracking-wide inline-flex items-center gap-2.5 transition-all shadow-xs rounded-none"
              >
                <span>Racik OOTD Sekarang</span>
                <span>→</span>
              </Link>

              <div className="flex items-center gap-3 text-xs sm:text-sm text-[#181A18]/70 pt-1 select-none">
                <button
                  type="button"
                  onClick={onOpenQuiz}
                  className="hover:text-[#181A18] hover:underline underline-offset-4 transition-colors font-normal cursor-pointer"
                >
                  Tes warna kulit
                </button>
                <span className="text-[#181A18]/30">|</span>
                <Link
                  href="/lookbook"
                  className="hover:text-[#181A18] hover:underline underline-offset-4 transition-colors font-normal"
                >
                  Lihat lookbook
                </Link>
              </div>
            </div>

          </div>

          {/* Kolom Kanan (5 Kolom): Kanvas Foto Editorial Living Lookbook Murni */}
          <div 
            className="mt-10 lg:mt-0 lg:col-span-5 flex flex-col items-center lg:items-end justify-center w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Foto Murni Borderless Tanpa Kotak Ganda ala Gambar 1 */}
            <div 
              onClick={() => router.push(currentHero.studioHref || `/studio?look=${currentHero.studioParam || currentHero.id}`)}
              className="relative w-full max-w-[380px] sm:max-w-[400px] xl:max-w-[420px] aspect-[4/5] overflow-hidden cursor-pointer group bg-[#EFECE6] shadow-xs"
            >
              {/* Horizontal Living Lookbook Track (Auto-slide 4.5s) */}
              <div
                className="flex w-full h-full transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {DESKTOP_HERO_SLIDES.map((slide, idx) => (
                  <div key={slide.id} className="w-full h-full shrink-0 relative overflow-hidden bg-[#EFECE6]">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      priority={idx === 0}
                      className={`w-full h-full object-cover object-top mix-blend-multiply transition-transform ease-out ${
                        idx === activeSlide && !isPaused ? "scale-105 duration-[4500ms]" : "scale-100 duration-700"
                      }`}
                      sizes="(max-width: 1024px) 100vw, 420px"
                    />
                  </div>
                ))}
              </div>

              {/* Tombol Wishlist Halus di Kanan Atas */}
              <button
                type="button"
                aria-label="Simpan Outfit"
                onClick={toggleSave}
                className="absolute top-3.5 right-3.5 w-8 h-8 bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#181A18] shadow-xs hover:scale-110 active:scale-95 transition-all z-10"
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-[#181A18] text-[#181A18]" : "text-stone-700"}`} />
              </button>
            </div>

            {/* Keterangan Tipografi Bersih di Bawah Foto (Persis Gambar 1) */}
            <div className="w-full max-w-[380px] sm:max-w-[400px] xl:max-w-[420px] pt-3.5 text-left select-none">
              <p className="font-serif text-base sm:text-lg text-[#181A18] font-normal leading-snug">
                {currentHero.lookName} &nbsp;•&nbsp; {currentHero.fabricName}
              </p>
              <p className="text-xs sm:text-sm text-[#181A18]/65 font-sans mt-0.5 font-normal">
                {currentHero.skinTone} &nbsp;•&nbsp; {currentHero.priceRange}
              </p>
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
              Sirkulasi Udara Optimal · Serat Bernapas
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#181A18] tracking-tight">
              The Tropical Edit — Koleksi Pilihan
            </h2>
          </div>
          <Link href="/lookbook" className="text-xs font-sans font-bold text-[#8C5A3C] hover:text-[#181A18] uppercase tracking-wider flex items-center gap-1.5 transition-colors">
            Lihat Semua ({TRENDING_LOOKS_FEED.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {/* Strict Grid: 2-Col Mobile / 4-Col Desktop */}
        <div className="grid grid-cols-2 gap-x-2.5 gap-y-6 sm:gap-x-4 lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10">
          {[
            {
              id: "trop-1",
              img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600",
              title: "Linen Camp Collar Shirt",
              climateBadge: "31–35°C · AIRY",
              swatches: ["#FAF6EE", "#8FA98D", "#D4A373"],
              tag: "CASUAL",
              height: "174 CM",
              undertoneTag: "Warm Spring",
              fabricNote: "Katun Rayon Twill · Sirkulasi Dingin",
              price: "Rp 189.000",
            },
            {
              id: "trop-2",
              img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
              title: "Wide-Leg Flowy Pants",
              climateBadge: "31–35°C · AIRY",
              swatches: ["#FAF6EE", "#D4A373", "#242724"],
              tag: "RELAXED",
              height: "162 CM",
              undertoneTag: "Warm Autumn",
              fabricNote: "Rayon Twill Premium · Potongan Loose",
              price: "Rp 215.000",
            },
            {
              id: "trop-3",
              img: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600",
              title: "Voal Paris Square Hijab",
              climateBadge: "31–35°C · AIRY",
              swatches: ["#FDFBF7", "#91AF90", "#DECBA6"],
              tag: "HIJAB",
              height: "158 CM",
              undertoneTag: "Semua Tone",
              fabricNote: "Voal Ultrafine · Ringan & Santun",
              price: "Rp 85.000",
            },
            {
              id: "trop-4",
              img: "https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600",
              title: "Linen Vest & Flowy Culottes",
              climateBadge: "31–35°C · AIRY",
              swatches: ["#FAF6EE", "#D4A373", "#8FA98D"],
              tag: "MINIMALIST",
              height: "165 CM",
              undertoneTag: "Sawo Matang & Kuning Langsat",
              fabricNote: "100% Pure Flax Linen & Rayon Twill",
              price: "Rp 195.000",
            }
          ].map((item) => (
            <Link
              href="/studio"
              key={item.id}
              className="group flex flex-col bg-transparent cursor-pointer select-none"
            >
              {/* 1. Foto Rasio 4:5 Bleed */}
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EFECE6]">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  sizes="(max-width: 1024px) 50vw, 300px"
                />

              </div>

              {/* Metadata Bersih Bawah Foto */}
              <div className="pt-2.5 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1">
                    {item.swatches.map((hex, idx) => (
                      <span
                        key={idx}
                        className="w-2.5 h-2.5 rounded-full ring-1 ring-black/15 shadow-2xs shrink-0"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#181A18]/50 truncate">
                    {item.tag} · {item.height}
                  </span>
                </div>

                <h3 className="font-serif text-[15px] sm:text-base font-semibold text-[#181A18] group-hover:text-[#8C5A3C] transition-colors line-clamp-1 leading-snug">
                  {item.title}
                </h3>
                <p className="font-sans text-[11px] text-[#181A18]/55 line-clamp-1 mt-0.5">
                  {item.fabricNote}
                </p>
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="font-sans text-xs font-semibold text-[#181A18] tracking-tight">
                    {item.price}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
