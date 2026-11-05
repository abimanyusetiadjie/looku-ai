"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface BentoItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tag: string;
  image: string;
  href: string;
  className: string;
  aspectClass?: string;
}

const BENTO_GALLERY: BentoItem[] = [
  {
    id: "bento-1",
    number: "01",
    title: "Architectural Drape & Pure Linen",
    subtitle: "Siluet rileks katun crinkle dan linen murni untuk sirkulasi udara optimal di iklim 33°C.",
    tag: "TROPICAL SILHOUETTE",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&auto=format&fit=crop&q=85",
    href: "/studio?vibe=earthy_minimalist",
    className: "lg:col-span-8 lg:row-span-2 min-h-[380px] lg:min-h-[580px]",
    aspectClass: "aspect-[16/10] sm:aspect-[16/10] lg:aspect-auto",
  },
  {
    id: "bento-2",
    number: "02",
    title: "Tactile Organic Weave",
    subtitle: "Tekstur serat bernapas alami bebas furing sintetis.",
    tag: "MATERIAL ARCHIVE",
    image: "https://images.unsplash.com/photo-1579656381226-5fc0f0100c3b?w=800&auto=format&fit=crop&q=85",
    href: "/lookbook?cat=atasan",
    className: "sm:col-span-6 lg:col-span-4 min-h-[260px] lg:min-h-[275px]",
    aspectClass: "aspect-[4/3] sm:aspect-auto",
  },
  {
    id: "bento-3",
    number: "03",
    title: "Relaxed Resort Tailoring",
    subtitle: "Camp collar linen dan pleated slacks untuk transisi semi-formal santai.",
    tag: "MENSWEAR ATELIER",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=85",
    href: "/studio?vibe=smart_formal",
    className: "sm:col-span-6 lg:col-span-4 min-h-[260px] lg:min-h-[275px]",
    aspectClass: "aspect-[4/3] sm:aspect-auto",
  },
  {
    id: "bento-4",
    number: "04",
    title: "Fluid Modest Flow",
    subtitle: "Proporsi santun 100% bebas terawang dengan paduan voal ultrafine.",
    tag: "MODEST ESSENTIAL",
    image: "/looks/look_hijab_navy_sand_chino.jpg",
    href: "/studio?modest=true",
    className: "sm:col-span-6 lg:col-span-4 min-h-[320px] lg:min-h-[380px]",
    aspectClass: "aspect-[4/5] sm:aspect-auto",
  },
  {
    id: "bento-5",
    number: "05",
    title: "Sawo Matang Warm Spectrum",
    subtitle: "Harmoni earth-tone hangat yang memancarkan kilau alami kulit Nusantara.",
    tag: "UNDERTONE HARMONY",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=85",
    href: "/lookbook?tone=sawo_matang",
    className: "sm:col-span-6 lg:col-span-4 min-h-[320px] lg:min-h-[380px]",
    aspectClass: "aspect-[4/5] sm:aspect-auto",
  },
  {
    id: "bento-6",
    number: "06",
    title: "Transitional Minimalist",
    subtitle: "Nyaman dari terik matahari siang hingga dinginnya ruangan AC SCBD.",
    tag: "CITY TRANSITION",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=85",
    href: "/studio?vibe=vintage_retro",
    className: "sm:col-span-12 lg:col-span-4 min-h-[320px] lg:min-h-[380px]",
    aspectClass: "aspect-[4/5] sm:aspect-auto",
  },
];

export default function AtelierBentoGrid({ onOpenQuiz }: { onOpenQuiz?: () => void }) {
  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] border-t border-[#181A18]/10 select-none">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        
        {/* Minimalist Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 border-b border-[#181A18]/10 pb-6">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] text-[#8C5A3C] block mb-2">
              Visual Editorial Campaign
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#181A18] tracking-tight leading-tight">
              The Tropical Atmosphere
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-6">
            <p className="font-sans text-xs text-[#181A18]/60 max-w-sm hidden sm:block">
              Eksplorasi estetika serat bernapas, siluet proporsional, dan harmoni rona kulit Nusantara dalam satu komposisi editorial.
            </p>
            <Link
              href="/lookbook"
              className="text-xs font-sans font-bold text-[#8C5A3C] hover:text-[#181A18] uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shrink-0"
            >
              Katalog Lengkap <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ============================================================ */}
        {/* FULL-IMAGE BENTO GRID: Pure Editorial Mosaic (Zero AI Slop)  */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5">
          {BENTO_GALLERY.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`group relative overflow-hidden bg-[#EFECE6] flex flex-col justify-between ${item.className} ${item.aspectClass || ""}`}
            >
              {/* 1. Full-Bleed Photograph */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center group-hover:scale-[1.035] transition-transform duration-1000 ease-out"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                />
                {/* 2. Soft Cinema Vignette Overlay (Top & Bottom only for Legibility) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/35 opacity-90 group-hover:opacity-95 transition-opacity duration-500" />
              </div>

              {/* 3. Top Tag & Number */}
              <div className="relative z-10 p-5 sm:p-6 flex items-center justify-between text-white/90">
                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] font-medium px-2 py-1 bg-black/30 backdrop-blur-md border border-white/15">
                  {item.tag}
                </span>
                <span className="text-[11px] font-mono tracking-widest text-[#D4A373] font-semibold">
                  {item.number}
                </span>
              </div>

              {/* 4. Bottom Editorial Typography & Discreet Arrow */}
              <div className="relative z-10 p-5 sm:p-6 sm:pt-0">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl lg:text-2xl text-white font-normal leading-snug group-hover:text-[#FAF6EE] transition-colors">
                      {item.title}
                    </h3>
                    <p className="font-sans text-[11px] sm:text-xs text-white/75 mt-1 leading-relaxed max-w-lg font-light line-clamp-2">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Discreet Circle Arrow on Hover */}
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center shrink-0 group-hover:bg-[#FAF8F5] group-hover:text-[#181A18] transition-all duration-300">
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
