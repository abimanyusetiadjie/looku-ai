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

            <h1 className="font-serif text-6xl xl:text-7xl text-white font-medium tracking-tight leading-[1.1]">
              The Tropical<br />
              <span className="italic font-light">Edit.</span>
            </h1>
            
            <p className="font-sans text-sm md:text-base text-white/80 font-light tracking-wide max-w-md leading-relaxed">
              Curated minimalist collections crafted from breathable linen and rayon, perfectly optimized for hot and humid climates.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <Link
                href="/lookbook"
                className="px-8 py-4 bg-white text-charcoal-900 font-sans text-xs font-bold uppercase tracking-[0.15em] hover:bg-sand-100 transition-colors"
              >
                Discover Collection
              </Link>
              <button
                onClick={onOpenQuiz}
                className="px-8 py-4 border border-white text-white font-sans text-xs font-bold uppercase tracking-[0.15em] hover:bg-white hover:text-charcoal-900 transition-colors"
              >
                Color Diagnostic
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Shopee/Tokopedia Style Grid (Below Hero, Desktop) */}
      <div className="hidden lg:block max-w-[1400px] mx-auto px-8 py-16">
        <div className="flex items-center justify-between mb-8 border-b border-sand-300 pb-4">
          <h2 className="font-serif text-2xl text-charcoal-900 uppercase tracking-widest">New Arrivals</h2>
          <Link href="/lookbook" className="text-sm font-sans font-bold text-terracotta-600 hover:text-charcoal-900 uppercase tracking-wider flex items-center gap-1 transition-colors">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {[
            { img: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600", title: "Linen Camp Collar Shirt", price: "Rp 189.000", cat: "Tops" },
            { img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600", title: "Wide-Leg Flowy Pants", price: "Rp 215.000", cat: "Bottoms" },
            { img: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600", title: "Voal Square Hijab", price: "Rp 85.000", cat: "Accessories" },
            { img: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600", title: "Tunik Rayon Panjang", price: "Rp 95.000", cat: "Tops" }
          ].map((item, idx) => (
            <Link href="/studio" key={idx} className="group flex flex-col gap-3">
              <div className="relative aspect-[3/4] overflow-hidden bg-sand-200">
                <Image src={item.img} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-sand-500 font-bold mb-1">{item.cat}</p>
                <h3 className="font-serif text-base text-charcoal-900 group-hover:text-terracotta-600 transition-colors">{item.title}</h3>
                <p className="font-sans text-sm font-semibold text-charcoal-900 mt-1">{item.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* MOBILE HERO (Keep existing or simplify) */}
      <div className="block lg:hidden w-full px-4 pt-6 pb-12">
         {/* Mobile content placeholder - handled by LookUMobileView typically, but we render a minimal fallback if needed */}
         <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-6">
            <Image
              src="https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&auto=format&fit=crop&q=80"
              alt="Editorial Fashion Campaign"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
              <div className="inline-block px-2 py-1 mb-3 border border-white/30 backdrop-blur-sm bg-white/10 text-white text-[10px] tracking-widest uppercase font-sans w-max">
                {weather.location} {weather.temperature}°C
              </div>
              <h1 className="font-serif text-4xl text-white mb-2 leading-tight">The<br/>Tropical Edit.</h1>
              <Link
                href="/lookbook"
                className="mt-4 px-6 py-3 bg-white text-charcoal-900 font-sans text-xs font-bold uppercase tracking-widest text-center"
              >
                Discover
              </Link>
            </div>
         </div>
      </div>
    </section>
  );
}
