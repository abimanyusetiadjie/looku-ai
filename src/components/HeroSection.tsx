"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, Sun, Check, ArrowRight, Palette, Sparkles } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import WaitlistModal from "./WaitlistModal";
import PersonalColorQuizModal from "./PersonalColorQuizModal";

interface HeroSectionProps {
  onOpenQuiz?: () => void;
}

export default function HeroSection({ onOpenQuiz }: HeroSectionProps) {
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const tickerItems = [
    "✦ 100% KATUN RAYON & LINEN ASLI",
    "✦ KURASI RESMI SHOPEE MALL & TOKOPEDIA OFFICIAL STORE",
    "✦ PERSONAL COLOR MATCH 5 WARNA KULIT NUSANTARA",
    "✦ MODEST, HIJAB & UNISEX COMPLIANT",
    "✦ EKSPOR INSTAGRAM STORY 9:16 EDITORIAL",
    "✦ PILIHAN TOKO DENGAN RATING 4.8★ TERVERIFIKASI",
  ];

  return (
    <>
      <section className="relative pt-6 pb-10 sm:pt-16 sm:pb-20 border-b border-[#E8DFD1] overflow-hidden bg-[#FAF8F5]">
        {/* Background Architectural Dot Grid Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#D7CABC_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

        {/* Ambient Warm Atmosphere Glows (GPU-Optimized Static Ambient) */}
        <div className="absolute top-10 right-10 w-[450px] h-[450px] bg-terracotta-500/10 rounded-full blur-2xl pointer-events-none -z-10" />
        <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-[#E8DFD1]/60 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Main Hero Grid: Left Typography + Right Floating Unisex Duo Visual Showcase */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center"
          >
            {/* Left Column: Headlines & Actions (7 cols) - Pure, Clean & Direct */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6 text-center lg:text-left">
              {/* Catchy & Elegant Bold Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-serif text-[28px] xs:text-3xl sm:text-5xl lg:text-[62px] font-medium tracking-tight text-[#181A18] leading-[1.14] sm:leading-[1.06]"
              >
                Your personal AI stylist untuk daily OOTD yang{" "}
                <span className="italic font-normal text-terracotta-500 underline decoration-[#D7CABC] underline-offset-8">
                  effortless
                </span>{" "}
                & nyaman.
              </motion.h1>

              {/* Conversational Subtitle with High-Contrast WCAG AAA Typography */}
              <motion.p
                variants={itemVariants}
                className="text-xs sm:text-base text-[#181A18]/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Kurasi paduan outfit adem di cuaca tropis 33°C, ramah hijab, dan langsung terhubung ke official store Shopee &amp; Tokopedia.
              </motion.p>

              <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white border border-[#D7CABC] text-[#181A18] text-[11px] sm:text-xs font-bold tracking-wider uppercase shadow-sm hover:shadow-md hover:border-terracotta-300 transition-all group"
                >
                  <Palette className="w-3.5 h-3.5 text-terracotta-500 group-hover:scale-110 transition-transform" />
                  <span>Cek Personal Color Kamu (60s) ↗</span>
                </button>
              </motion.div>

              {/* Distinct CTA Hierarchy: Dominant Primary + Elegant Outline Secondary */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2.5 sm:gap-3 pt-1 sm:pt-2"
              >
                <Link 
                  href="/studio" 
                  className="w-full sm:w-auto py-3.5 sm:py-4 px-6 sm:px-8 rounded-2xl bg-charcoal-900 hover:bg-terracotta-500 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-md group"
                >
                  <span>Mulai Racik Outfit (Gratis)</span>
                  <Sparkles className="w-4 h-4 text-terracotta-400 group-hover:rotate-12 transition-transform" />
                </Link>

                <motion.button 
                  onClick={() => setIsWaitlistOpen(true)} 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="w-full sm:w-auto py-3 sm:py-3.5 px-5 sm:px-6 rounded-2xl bg-white hover:bg-sand-100 border border-sand-300 hover:border-charcoal-900 text-charcoal-900 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <span>👑 VIP Atelier</span>
                  <ArrowRight className="w-3.5 h-3.5 text-sand-500" />
                </motion.button>
              </motion.div>

              {/* Instant Access Reassurance */}
              <div className="flex items-center justify-center lg:justify-start gap-2 pt-1 text-[9px] sm:text-[10px] font-mono text-sand-500 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>100% GRATIS • TANPA PERLU LOGIN • LANGSUNG RACIK</span>
              </div>
            </div>

            {/* Right Column: Floating Unisex Duo Standing Side-by-Side (5 cols) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 relative w-full flex justify-center mt-2 lg:mt-0"
            >
              {/* Layered Floating Unisex Duo Specimen Card */}
              <motion.div
                whileHover={{ y: -4 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="relative w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-4 sm:p-5 shadow-2xl border border-[#D7CABC] space-y-4"
              >
                {/* Visual Image Banner with Side-by-Side Model Duo */}
                <div className="relative w-full aspect-[4/5] rounded-2xl bg-[#E8DFD1] overflow-hidden group">
                  <Image
                    src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80"
                    alt="Looku Unisex Fashion Duo"
                    fill
                    sizes="(max-width: 768px) 90vw, 400px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
                    priority
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181A18]/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Floating Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181A18]/85 text-[#FAF8F5] text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md border border-white/10 shadow-sm">
                      <Sun className="w-3 h-3 text-amber-400" />
                      <span>33°C Panas Terik</span>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[9px] font-mono font-bold tracking-wider uppercase backdrop-blur-md shadow-sm">
                      ✓ Unisex & Modest
                    </span>
                  </div>

                  {/* Dual Hotspot Floating Pins */}
                  <div className="absolute top-1/4 left-4 pointer-events-none">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      className="px-2.5 py-1 rounded-lg bg-white/95 text-[#181A18] text-[8px] font-mono font-bold uppercase shadow-lg border border-black/10 flex items-center gap-1 backdrop-blur-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                      <span>Womenswear Set</span>
                    </motion.div>
                  </div>

                  <div className="absolute top-1/3 right-4 pointer-events-none">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                      className="px-2.5 py-1 rounded-lg bg-white/95 text-[#181A18] text-[8px] font-mono font-bold uppercase shadow-lg border border-black/10 flex items-center gap-1 backdrop-blur-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                      <span>Menswear Tailored</span>
                    </motion.div>
                  </div>

                  {/* Bottom Tagline on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[9px] font-mono font-bold uppercase text-terracotta-400 tracking-widest">
                      UNISEX & COUPLE LOOKBOOK 2026
                    </span>
                    <h4 className="font-serif font-bold text-lg leading-tight">
                      Urban Tailored & Minimalist Duo
                    </h4>
                  </div>
                </div>

                {/* Card Bottom: Color Harmony Swatches & Quick CTA */}
                <div className="flex items-center justify-between gap-3 pt-1">
                  <div>
                    <div className="text-[9px] font-mono text-[#A89582] uppercase tracking-wider font-bold">
                      PALET WARNA HARMONIS
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      {["#E8DFD1", "#84A98C", "#181A18", "#D4A373"].map((hex, idx) => (
                        <div
                          key={idx}
                          className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                          style={{ backgroundColor: hex }}
                        />
                      ))}
                      <span className="text-[10px] font-mono text-[#181A18] font-bold ml-1">
                        Sage & Charcoal
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-charcoal-900/60 tracking-wider uppercase">→ Studio</span>
                </div>
              </motion.div>

              {/* Decorative Background Offset Layer Card */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-terracotta-500/20 to-transparent rounded-3xl -rotate-2 -z-10 blur-sm pointer-events-none" />
            </motion.div>
          </motion.div>
        </div>

        {/* High-Trust Editorial Curator Strip */}
        <div className="mt-10 pt-6 border-t border-sand-200/80 flex flex-wrap items-center justify-between gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left: Official Marketplace Curator */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EE4D2D]/10 text-[#EE4D2D] flex items-center justify-center font-bold text-xs border border-[#EE4D2D]/20">
              🛍️
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-900 font-serif">Kurator Belanja Terpercaya</div>
              <div className="text-[10px] font-mono text-sand-500">Shopee Mall & Tokopedia Official Store</div>
            </div>
          </div>

          {/* Center: Material Quality */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-500/20">
              🌿
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-900 font-serif">100% Material Adem Tropis</div>
              <div className="text-[10px] font-mono text-sand-500">Katun Rayon, Linen Euro & Crinkle Airflow</div>
            </div>
          </div>

          {/* Right: Privacy & Free */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-charcoal-900/5 text-charcoal-900 flex items-center justify-center font-bold text-xs border border-charcoal-900/10">
              🔒
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-900 font-serif">Konsultasi Bebas Biaya</div>
              <div className="text-[10px] font-mono text-sand-500">Privasi Foto & Rekomendasi Terjamin</div>
            </div>
          </div>
        </div>

        {/* Boutique Running Ticker Tape (Continuous Marquee) */}
        <div className="mt-12 pt-4 border-t border-[#E8DFD1] bg-[#F4EFE6]/60 py-3 overflow-hidden">
          <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
            {[...tickerItems, ...tickerItems].map((item, index) => (
              <span
                key={index}
                className="text-[10px] font-mono tracking-[0.2em] uppercase font-bold text-[#181A18]/60 flex items-center gap-2"
              >
                <span>{item}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {isWaitlistOpen && (
        <WaitlistModal onClose={() => setIsWaitlistOpen(false)} />
      )}
      <PersonalColorQuizModal 
        isOpen={isQuizOpen} 
        onClose={() => setIsQuizOpen(false)} 
        onApplyResult={(skinToneId) => {
          console.log("Applied skin tone:", skinToneId);
          setIsQuizOpen(false);
          const studioEl = document.getElementById("studio");
          if (studioEl) studioEl.scrollIntoView({ behavior: "smooth" });
        }} 
      />
    </>
  );
}
