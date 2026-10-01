"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import WaitlistModal from "./WaitlistModal"; // Keep this if used elsewhere, or remove.

interface HeroSectionProps {
  onOpenQuiz: () => void;
}

export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  // Using the first preset scenario for the hero showcase
  const heroOutfit = {
    title: "Casual Campus Chiffon",
    subtitle: "LINEN CRINKLE KULOT — ADEM & MODEST",
    context: "JAKARTA 33°C — TROPIS SIANG HARI",
    price: "RP 895.000",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    colors: ["#FDFBF7", "#E6D5C3", "#181A18"],
    lookId: "kuliah_hijab_panas_hemat"
  };

  return (
    <section className="relative w-full bg-white hidden lg:block overflow-hidden" style={{ minHeight: "calc(100vh - 80px)" }}>
      <div className="flex w-full h-full min-h-[calc(100vh-80px)]">
        
        {/* Left: 50% Full Bleed Image */}
        <div className="w-1/2 relative h-full min-h-[calc(100vh-80px)] bg-sand-100">
          <Image
            src={heroOutfit.image}
            alt={heroOutfit.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Right: 50% Content / Details */}
        <div className="w-1/2 flex items-center justify-center bg-[#FAF8F5]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-md w-full px-12 py-16 flex flex-col items-start"
          >
            <h1 className="font-serif font-medium text-5xl text-[#181A18] leading-tight mb-3">
              {heroOutfit.title}
            </h1>
            
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#181A18]/70 mb-8">
              {heroOutfit.subtitle}
            </p>

            <div className="mb-8">
              <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#181A18] block mb-3">
                Color
              </span>
              <div className="flex gap-3">
                {heroOutfit.colors.map((hex, i) => (
                  <button 
                    key={i}
                    className={`w-5 h-5 rounded-full border border-black/20 ${i === 0 ? 'ring-1 ring-offset-2 ring-charcoal-900' : ''}`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            <div className="bg-[#EFEAE1] px-4 py-2.5 rounded-md mb-6 border border-[#E8DFD1]">
              <p className="font-sans text-[10px] uppercase tracking-wider text-charcoal-900 font-semibold mb-1">
                {heroOutfit.context}
              </p>
              <p className="font-sans text-[11px] text-charcoal-900/80">
                Siap tampil stylish tanpa gerah
              </p>
            </div>

            <div className="font-sans text-lg font-bold text-[#181A18] mb-8">
              {heroOutfit.price}
            </div>

            <Link
              href={`/studio?look=${heroOutfit.lookId}`}
              className="w-full py-3.5 border border-[#181A18] rounded-full text-center font-sans text-xs font-bold uppercase tracking-widest text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors mb-6"
            >
              Add to Wardrobe
            </Link>

            <button 
              onClick={onOpenQuiz}
              className="font-sans text-[11px] font-bold underline underline-offset-4 text-[#181A18]/60 hover:text-[#181A18] transition-colors mb-8"
            >
              Size Guide / Cek Personal Color
            </button>

            <div className="font-sans text-[10px] text-[#181A18]/50">
              Free shipping on orders over RP 500.000 • Easy 30-day returns
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
