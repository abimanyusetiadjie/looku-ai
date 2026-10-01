"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Tahan splash screen selama 2.8 detik (memberi waktu loading bar selesai)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800);

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
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal-900" // Background Hitam Arang Mewah
        >
          {/* Elemen Tengah (Logo + Subtitle) */}
          <div className="flex flex-col items-center justify-center">
            {/* Logo Look.u High-End Serif dengan teks Off-White */}
            <motion.h1
              initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: "easeOut", delay: 0.2 }}
              className="font-serif text-sand-50 text-6xl md:text-7xl font-medium tracking-[0.05em]"
              style={{
                fontFamily: "var(--font-playfair), serif",
              }}
            >
              Look<span className="text-terracotta-500 font-bold">.</span>u
            </motion.h1>

            {/* Subtitle / Tagline */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.8 }}
              className="mt-4 text-[9px] md:text-[10px] font-sans text-sand-100/60 font-bold tracking-[0.4em] uppercase"
            >
              Tropical AI Stylist
            </motion.div>
          </div>

          {/* Elegant Loading Bar */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="absolute bottom-16 w-48 h-[2px] bg-white/10 rounded-full overflow-hidden shadow-sm"
          >
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.6 }} // Bergerak elegan selama 2 detik
              className="h-full bg-gradient-to-r from-sand-300 to-terracotta-400"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
