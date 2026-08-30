"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ArrowDownRight, Sun, Check, ArrowRight, Palette } from "lucide-react";
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
    "✦ SIRKULASI UDARA KATUN RAYON & LINEN 98.4% (UJI IKLIM 33°C)",
    "✦ 100% UNISEX & MODEST COMPLIANT ARCHITECTURE",
    "✦ PERSONAL COLOR MATCH UNTUK 5 WARNA KULIT INDONESIA",
    "✦ TAUTAN BELANJA RESMI SHOPEE & TOKOPEDIA REALISTIS",
    "✦ EKSPOR INSTAGRAM STORY 9:16 HIGH-DPI",
    "✦ 14.800+ OUTFIT DICURASI MINGGU INI",
  ];

  return (
    <>
      <section className="relative pt-10 pb-12 sm:pt-16 sm:pb-20 border-b border-[#E8DFD1] overflow-hidden bg-[#FAF8F5]">
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
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
          >
            {/* Left Column: Headlines & Actions (7 cols) - Pure, Clean & Direct */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Catchy & Elegant Bold Headline */}
              <motion.h1
                variants={itemVariants}
                className="font-serif text-4xl sm:text-6xl lg:text-[62px] font-medium tracking-tight text-[#181A18] leading-[1.06]"
              >
                Your personal AI stylist untuk daily OOTD yang{" "}
                <span className="italic font-normal text-terracotta-500 underline decoration-[#D7CABC] underline-offset-8">
                  effortless
                </span>{" "}
                & nyaman.
              </motion.h1>

              {/* Conversational Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-sm sm:text-base text-[#181A18]/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0"
              >
                Tanpa ribet <i>&ldquo;bingung mau pakai baju apa&rdquo;</i> tiap pagi. Dari hangout santai, ngantor, sampai acara formal, <span className="font-serif italic font-bold">look<span className="text-terracotta-500 not-italic">.</span>u</span> bantu mix & match padu-padan warna yang pas untuk kulitmu, nyaman seharian, dan bikin kamu tampil percaya diri.
              </motion.p>

              <motion.div variants={itemVariants} className="flex justify-center lg:justify-start">
                <button
                  onClick={() => setIsQuizOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#D7CABC] text-[#181A18] text-xs font-bold tracking-wider uppercase shadow-sm hover:shadow-md hover:border-terracotta-300 transition-all group"
                >
                  <Palette className="w-4 h-4 text-terracotta-500 group-hover:scale-110 transition-transform" />
                  <span>Cek Personal Color Kamu (60s) ↗</span>
                </button>
              </motion.div>

              {/* Primary Action Button */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2"
              >
                <motion.a 
                  href="#studio" 
                  whileHover={{ scale: 1.02, y: -2 }} 
                  whileTap={{ scale: 0.98 }} 
                  className="w-full sm:w-auto py-4 px-8 rounded-2xl bg-charcoal-900 hover:bg-terracotta-500 text-sand-50 font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2.5 shadow-md group"
                >
                  <span>Mix & Match Outfit Kamu</span>
                  <ArrowDownRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
                </motion.a>

                <button 
                  onClick={() => setIsWaitlistOpen(true)} 
                  className="text-xs text-sand-500 hover:text-charcoal-900 font-semibold tracking-wider uppercase transition-colors py-2 px-3"
                >
                  Join VIP Early Access →
                </button>
              </motion.div>
            </div>

            {/* Right Column: Floating Unisex Duo Standing Side-by-Side (5 cols) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 relative w-full flex justify-center mt-4 lg:mt-0"
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

        {/* Social Proof & Credibility Trust Strip */}
        <div className="mt-10 pt-6 border-t border-sand-200/80 flex flex-wrap items-center justify-between gap-6 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Left: User Avatar Stack + Counter */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User" />
              <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User" />
              <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80" alt="User" />
              <img className="w-7 h-7 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80" alt="User" />
            </div>
            <div>
              <div className="text-xs font-bold text-charcoal-900">14.800+ Outfit Dicurasi</div>
              <div className="text-[10px] font-mono text-sand-500">Jakarta • Bandung • Surabaya</div>
            </div>
          </div>

          {/* Center: Rating & Comfort */}
          <div className="flex items-center gap-2 text-xs text-charcoal-900 font-medium">
            <span className="text-amber-500">★★★★★</span>
            <span className="font-bold">4.9/5</span>
            <span className="text-sand-500">• 100% Katun Rayon & Linen Adem</span>
          </div>

          {/* Right: Privacy Guarantee */}
          <div className="flex items-center gap-1.5 text-xs text-sand-500 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>100% BEBAS BIAYA • PRIVASI TERJAMIN</span>
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
