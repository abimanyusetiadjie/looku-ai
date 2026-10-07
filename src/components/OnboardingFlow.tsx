"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Palette, User, ChevronRight } from "lucide-react";
import Image from "next/image";

interface OnboardingFlowProps {
  /** startQuiz = true when the user finished the slides, false when they skipped. */
  onComplete: (startQuiz: boolean) => void;
}

const ONBOARDING_SLIDES = [
  {
    id: "weather",
    title: "Cuaca Berubah,\nGaya Tetap Sempurna",
    desc: "Rekomendasi outfit otomatis menyesuaikan iklim tropis dan suhu sekitarmu secara real-time.",
    icon: Sun,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "color",
    title: "Warna yang\nMemancarkan Auramu",
    desc: "Analisis personal color untuk menemukan palet warna yang membuat kulitmu bercahaya alami.",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "body",
    title: "Siluet Terbaik\nuntuk Tubuhmu",
    desc: "Temukan potongan pakaian yang merangkul dan menonjolkan fitur terbaik bentuk tubuhmu.",
    icon: User,
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80",
  },
];

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide === ONBOARDING_SLIDES.length - 1) {
      onComplete(true);
    } else {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const slide = ONBOARDING_SLIDES[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full h-[65vh]"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="flex-1 bg-white px-8 pt-6 pb-12 flex flex-col justify-between relative z-10 -mt-10 rounded-t-[40px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-full bg-sand-100 flex items-center justify-center mb-6 text-charcoal-900 border border-sand-200">
              <Icon className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h1 className="font-serif text-[28px] leading-[1.15] text-[#181A18] mb-4 whitespace-pre-line">
              {slide.title}
            </h1>
            <p className="font-sans text-[11px] text-[#181A18]/60 leading-relaxed max-w-[280px]">
              {slide.desc}
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="flex flex-col items-center gap-6 mt-8">
          <div className="flex items-center gap-2">
            {ONBOARDING_SLIDES.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? "w-6 bg-[#181A18]" : "w-1.5 bg-[#E8DFD1]"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full max-w-[280px] py-4 rounded-full bg-[#181A18] text-white font-sans text-[11px] font-bold uppercase tracking-widest hover:bg-terracotta-500 transition-colors flex items-center justify-center gap-2"
          >
            <span>{currentSlide === ONBOARDING_SLIDES.length - 1 ? "Mulai Personalisasi" : "Selanjutnya"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button 
            onClick={() => onComplete(false)}
            className="min-h-[44px] px-4 text-[11px] font-sans font-semibold text-[#181A18]/60 uppercase tracking-widest hover:text-[#181A18] transition-colors"
          >
            Lewati
          </button>
        </div>
      </div>
    </div>
  );
}

