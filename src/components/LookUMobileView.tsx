"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface LookUMobileViewProps {
  onOpenQuiz?: () => void;
  onOpenSavedDrawer?: () => void;
  savedCount?: number;
}

export default function LookUMobileView({ onOpenQuiz, onOpenSavedDrawer }: LookUMobileViewProps) {
  const router = useRouter();

  const heroOutfit = {
    title: "Casual Campus Chiffon",
    subtitle: "LINEN CRINKLE KULOT — ADEM & MODEST",
    context: "JAKARTA 33°C — TROPIS SIANG HARI",
    price: "RP 895.000",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=900&auto=format&fit=crop",
    colors: ["#FDFBF7", "#E6D5C3", "#181A18"],
    lookId: "kuliah_hijab_panas_hemat"
  };

  return (
    <div className="relative w-full min-h-screen bg-white text-[#181A18] font-sans antialiased flex flex-col items-center justify-start lg:hidden">
      <div className="w-full max-w-md min-h-screen bg-white relative flex flex-col pb-24">
        
        {/* Luxury Minimal Header */}
        <header className="sticky top-0 z-30 w-full bg-white px-4 pt-[max(16px,env(safe-area-inset-top))] pb-4 transition-all flex items-center justify-between">
          <button className="p-2 -ml-2 text-charcoal-900" aria-label="Menu">
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
          
          <Link href="/" className="font-serif font-medium text-3xl tracking-[0.05em] text-[#181A18] flex items-baseline select-none">
            Look<span className="text-terracotta-500 font-bold">.</span>u
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="text-charcoal-900" aria-label="Search">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button onClick={onOpenSavedDrawer} className="text-charcoal-900" aria-label="Bag">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
            </button>
          </div>
        </header>

        {/* Full Bleed Image (No Text Overlays, No Gradients) */}
        <div className="w-full aspect-[4/5] relative bg-sand-100">
          <Image
            src={heroOutfit.image}
            alt={heroOutfit.title}
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Editorial Content Below Image */}
        <div className="w-full px-6 pt-10 flex flex-col items-center text-center">
          <h1 className="font-serif font-medium text-3xl text-[#181A18] leading-tight mb-3">
            {heroOutfit.title}
          </h1>
          
          <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#181A18]/70 mb-8">
            {heroOutfit.subtitle}
          </p>

          <div className="flex items-center gap-6 mb-8">
            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[#181A18]">
              Color
            </span>
            <div className="flex gap-4">
              {heroOutfit.colors.map((hex, i) => (
                <button 
                  key={i}
                  className={`w-4 h-4 rounded-full border border-black/20 ${i === 0 ? 'ring-1 ring-offset-2 ring-charcoal-900' : ''}`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
          </div>

          <p className="font-sans text-[9px] uppercase tracking-widest text-charcoal-900/60 font-semibold mb-6">
            {heroOutfit.context}
          </p>

          <div className="font-sans text-sm font-bold text-[#181A18] mb-10 tracking-widest">
            {heroOutfit.price}
          </div>
        </div>

      </div>
    </div>
  );
}

