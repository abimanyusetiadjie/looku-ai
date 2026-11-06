"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Splash hanya sekali per sesi browser agar navigasi berikutnya terasa instan.
    if (sessionStorage.getItem("looku_splash_seen")) {
      setIsVisible(false);
      return;
    }
    sessionStorage.setItem("looku_splash_seen", "true");
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 1600);

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
            filter: "blur(15px)" // Efek memudar sinematik
          }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} 
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#FAF8F5]" // Background Warm Editorial Cream Sesuai Identitas Aplikasi
        >
          {/* Subtle Ambient Radial Warmth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.85)_0%,_rgba(250,248,245,1)_70%)] pointer-events-none" />

          {/* Elemen Tengah (Logo + Subtitle) */}
          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* Logo Look.u High-End Serif dengan teks Charcoal #181A18 & Terracotta Dot */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.96, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.15 }}
              className="font-serif text-[#181A18] text-6xl md:text-7xl font-medium tracking-[0.04em] select-none"
              style={{
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              Look<span className="text-[#C86D51] font-bold">.</span>u
            </motion.h1>

            {/* Subtitle / Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeOut", delay: 0.5 }}
              className="mt-3.5 text-[10px] md:text-[11px] font-sans text-[#736B63] font-bold tracking-[0.38em] uppercase select-none"
            >
              Tropical AI Stylist
            </motion.div>
          </div>

          {/* Elegant Loading Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="absolute bottom-16 w-44 h-[2.5px] bg-[#E8DFD1] rounded-full overflow-hidden shadow-2xs"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="h-full bg-gradient-to-r from-[#C86D51] via-[#8C5A3C] to-[#181A18]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

