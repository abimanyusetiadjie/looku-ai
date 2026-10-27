"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

const BRANDS = [
  "COTTONINK",
  "JINISO",
  "LOZY HIJAB",
  "BUTTONSCARVES",
  "VENTELA",
  "THIS IS APRIL",
  "RIA MIRANDA",
  "ERIGO",
  "KASUAL ID",
  "BRODO",
  "ZASKIA MECCA",
  "KAMI IDEA",
  "AEROSTREET",
  "SHOPATVELVET",
  "THENBLANK",
  "UNIQLO ID",
];

export default function BrandMarquee() {
  const [isPaused, setIsPaused] = useState(false);

  // Duplikasi array 3x untuk perulangan mulus tanpa jeda
  const marqueeList = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section 
      aria-label="Curated Fashion Ecosystem Brands"
      className="relative w-full overflow-hidden bg-[#FAF6EE]/90 border-y border-[#E8DFD1] py-3.5 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Gradient Mask kiri & kanan untuk transisi halus ala majalah mode */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10" />

      <motion.div
        className="flex items-center gap-6 sm:gap-9 whitespace-nowrap will-change-transform"
        animate={{ x: isPaused ? undefined : ["0%", "-33.333%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 38,
        }}
      >
        {marqueeList.map((brand, idx) => (
          <div key={idx} className="flex items-center gap-6 sm:gap-9 shrink-0">
            <span className="font-sans font-bold text-[10px] sm:text-[11px] tracking-[0.24em] uppercase text-charcoal-900/65 hover:text-charcoal-900 transition-colors">
              {brand}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500/80 shrink-0" />
          </div>
        ))}
      </motion.div>
    </section>
  );
}
