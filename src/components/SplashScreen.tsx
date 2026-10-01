"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tahan splash screen selama 2.5 detik
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash-screen"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -20, // Bergerak sedikit ke atas saat menghilang
            filter: "blur(10px)" 
          }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} // Apple-like easing
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5]"
        >
          {/* Elemen Tengah (Logo + Subtitle) */}
          <div className="flex flex-col items-center justify-center">
            {/* Logo Look.u High-End Serif */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="font-serif text-[#181A18] text-6xl md:text-7xl font-medium tracking-[0.05em]"
              style={{
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              Look.u
            </motion.h1>

            {/* Subtitle / Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
              className="mt-4 text-[9px] md:text-[10px] font-sans text-sand-500 font-bold tracking-[0.4em] uppercase"
            >
              Tropical AI Stylist
            </motion.div>
          </div>

          {/* Garis Dekoratif (Garis emas tipis untuk kesan mahal) */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
            className="absolute bottom-16 w-24 h-[1px] bg-[#181A18]/20"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
