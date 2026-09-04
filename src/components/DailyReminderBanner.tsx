"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, CloudSun, Sparkles, X, ArrowRight } from "lucide-react";

export default function DailyReminderBanner() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [weatherData, setWeatherData] = useState<{ temp: number; desc: string }>({
    temp: 33,
    desc: "Cerah Berawan Tropis",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cek apakah sudah pernah di-dismiss hari ini
    const today = new Date().toISOString().split("T")[0];
    const dismissedDate = localStorage.getItem("looku_reminder_dismissed_date");

    if (dismissedDate === today) {
      return;
    }

    // Ambil cuaca perkiraan dari koordinat Jakarta/lokal
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
            );
            const data = await res.json();
            if (data?.current_weather?.temperature) {
              const temp = Math.round(data.current_weather.temperature);
              let desc = "Cerah Tropis";
              if (temp >= 32) desc = "Panas Terik & Lembap";
              else if (temp <= 25) desc = "Sejuk / Berpotensi Hujan";
              setWeatherData({ temp, desc });
            }
          } catch (e) {
            console.log("Weather fetch fallback:", e);
          }
        },
        () => {
          // Default fallback Jakarta
        },
        { timeout: 5000 }
      );
    }

    // Tampilkan banner dengan delay halus 800ms
    const timer = setTimeout(() => setIsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem("looku_reminder_dismissed_date", today);
    }
  };

  const handleScrollToStudio = () => {
    handleDismiss();
    router.push("/studio");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="bg-gradient-to-r from-[#181A18] via-[#2B2620] to-[#181A18] text-sand-50 border-b border-white/10 overflow-hidden relative z-30"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Sun className="w-3.5 h-3.5 animate-spin [animation-duration:12s]" />
              </div>
              <div className="truncate">
                <span className="font-bold text-white font-serif">Selamat pagi!</span>{" "}
                <span className="text-[#D7CABC] hidden sm:inline">
                  Prakiraan cuaca hari ini{" "}
                  <b className="text-amber-400 font-mono">{weatherData.temp}°C {weatherData.desc}</b>.
                </span>{" "}
                <span className="text-sand-300">Siapkan formula OOTD adem & percaya diri.</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleScrollToStudio}
                className="py-1 px-3 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 transition-all shadow-xs"
              >
                <span>Kurasi Sekarang</span>
                <ArrowRight className="w-3 h-3" />
              </button>

              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                title="Tutup pengingat hari ini"
                aria-label="Tutup"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
