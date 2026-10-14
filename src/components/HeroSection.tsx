"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWeather } from "@/hooks/useWeather";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  onOpenQuiz?: () => void;
}

export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  const { weather } = useWeather();
  
  return (
    <section className="relative w-full bg-[#FAF8F5]">
      {/* Editorial Zara-style Hero for Desktop */}
      <div className="hidden lg:flex w-full h-[85vh] relative overflow-hidden">
        {/* Full-bleed Image Container */}
        <div className="absolute inset-0 w-full h-full">
          <Image
            src="https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=2000&auto=format&fit=crop&q=80"
            alt="Editorial Fashion Campaign"
            fill
            priority
            className="object-cover object-[center_30%] scale-105"
            style={{
              animation: "kenburns 20s ease-out forwards"
            }}
          />
          {/* Subtle Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        </div>

        {/* Content Box (Left-aligned, elegant typography) */}
        <div className="relative z-10 h-full max-w-[1400px] mx-auto w-full px-8 flex flex-col justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl space-y-6"
          >
            {/* Weather Context Badge */}
            <div className="inline-block px-3 py-1.5 border border-white/30 backdrop-blur-sm bg-white/10 text-white/90 text-xs tracking-[0.2em] uppercase font-sans">
              {weather.location} {weather.temperature}°C — {weather.condition}
            </div>

            <h1 className="font-serif text-5xl xl:text-6xl text-white font-medium tracking-tight leading-[1.15]">
              Personal Stylist AI.<br />
              <span className="italic font-light">Didesain Khusus Tropis.</span>
            </h1>
            
            <p className="font-sans text-sm md:text-base text-white/80 font-light tracking-wide max-w-md leading-relaxed">
              Formula kurasi pakaian adem, modest, dan selaras dengan warna kulit nusantara untuk cuaca terik dan lembap.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Link
                href="/studio"
                className="px-8 py-4 bg-white text-charcoal-900 font-sans text-xs font-bold uppercase tracking-[0.15em] hover:bg-sand-100 transition-colors shadow-sm"
              >
                Racik OOTD Sekarang ➔
              </Link>
              <button
                onClick={onOpenQuiz}
                className="px-8 py-4 border border-white text-white font-sans text-xs font-bold uppercase tracking-[0.15em] hover:bg-white hover:text-charcoal-900 transition-colors"
              >
                Tes Personal Color (60s)
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* The Tropical Edit (Uniqlo-Grade Fabric & Climate Micro-Anatomy) */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex items-end justify-between mb-8 border-b border-sand-300 pb-4">
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-terracotta-600 mb-1">
              Curated by AI
            </p>
            <h2 className="font-serif text-2xl lg:text-3xl text-charcoal-900 tracking-tight">
              The Tropical Edit — Koleksi Pilihan
            </h2>
          </div>
          <Link href="/lookbook" className="text-xs font-sans font-bold text-terracotta-600 hover:text-charcoal-900 uppercase tracking-wider flex items-center gap-1.5 transition-colors">
            Lihat Semua <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {[
            {
              id: "trop-1",
              img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600",
              title: "Linen Camp Collar Shirt",
              climateBadge: "Optimal 33°C · Katun Rayon",
              swatches: ["#FAF6EE", "#8FA98D", "#D4A373"],
              undertoneTag: "Warm Spring",
              fabricNote: "Katun Rayon Twill · Sirkulasi Dingin",
              price: "Rp 189.000",
            },
            {
              id: "trop-2",
              img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600",
              title: "Wide-Leg Flowy Pants",
              climateBadge: "Anti-Gerah · Rayon Dingin",
              swatches: ["#FAF6EE", "#D4A373", "#242724"],
              undertoneTag: "Warm Autumn",
              fabricNote: "Rayon Twill Premium · Potongan Loose",
              price: "Rp 215.000",
            },
            {
              id: "trop-3",
              img: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600",
              title: "Voal Paris Square Hijab",
              climateBadge: "Pori Mikro · Voal 100%",
              swatches: ["#FDFBF7", "#91AF90", "#DECBA6"],
              undertoneTag: "Semua Tone",
              fabricNote: "Voal Ultrafine · Ringan & Santun",
              price: "Rp 85.000",
            },
            {
              id: "trop-4",
              img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600",
              title: "Tunik Rayon Panjang",
              climateBadge: "AC & Terik · 100% Modest",
              swatches: ["#6B705C", "#FAF6EE", "#242724"],
              undertoneTag: "Kuning Langsat",
              fabricNote: "Katun Rami Organik · Daya Serap Tinggi",
              price: "Rp 95.000",
            }
          ].map((item) => (
            <Link href="/studio" key={item.id} className="group flex flex-col bg-white rounded-2xl border border-sand-300 p-3 hover:shadow-tactile transition-all duration-300">
              {/* 1. Foto Rasio Mutlak 4:5 */}
              <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#EFECE6]">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 1024px) 50vw, 300px"
                />
                {/* 2. Badge Iklim/Bahan ala Uniqlo AIRism */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <span className="inline-block px-2.5 py-1 text-[9px] font-mono font-bold uppercase tracking-wider bg-[#FAF8F5]/95 backdrop-blur-md text-[#181A18] rounded-md shadow-xs">
                    {item.climateBadge}
                  </span>
                </div>
              </div>

              {/* 3. Dot Swatches Palet Warna Harmonis (3 Titik) */}
              <div className="flex items-center gap-1.5 mt-3 mb-1">
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
              <h3 className="font-serif text-sm font-bold text-charcoal-900 group-hover:text-terracotta-600 transition-colors line-clamp-1">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#181A18]/60 line-clamp-1 mt-0.5">
                {item.fabricNote}
              </p>
              <p className="font-mono text-xs font-bold text-charcoal-900 mt-2 pt-1 border-t border-sand-200">
                {item.price}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
