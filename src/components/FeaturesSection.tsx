"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Sparkles, 
  Check, 
  ShoppingBag, 
  Share2, 
  Layers, 
  ArrowUpRight,
  Wind
} from "lucide-react";

export default function FeaturesSection() {
  const [activeSkinIndex, setActiveSkinIndex] = useState(2); // default Sawo Matang

  const skinToneDemos = [
    { name: "Putih Gading", hex: "#F7E2D3", bestColors: ["#84A98C", "#D4A373", "#606C38"], colorName: "Sage & Oat" },
    { name: "Kuning Langsat", hex: "#E8C4A2", bestColors: ["#BA5D38", "#E8DFD1", "#283618"], colorName: "Terracotta & Sand" },
    { name: "Sawo Matang", hex: "#C69365", bestColors: ["#D4A373", "#FAEDCD", "#181A18"], colorName: "Warm Gold & Cream" },
    { name: "Eksotis", hex: "#9E6C45", bestColors: ["#CCD5AE", "#E9EDC9", "#A24E2D"], colorName: "Olive & Bronze" },
    { name: "Deep Bronze", hex: "#633E2B", bestColors: ["#FAF8F5", "#BA5D38", "#DDA15E"], colorName: "Ivory & Copper" },
  ];

  return (
    <section id="manifesto" className="py-16 sm:py-24 bg-white border-b border-sand-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between border-b border-sand-300 pb-8 mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-terracotta-500" />
              <span className="lookbook-label">CURATION PRINCIPLES</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-charcoal-900 tracking-tight">
              Standar Kurasi Looku
            </h2>
          </div>
          <p className="text-sm text-charcoal-900/70 max-w-md font-normal leading-relaxed">
            Menolak estetika generik. Setiap formula OOTD diukur dengan tiga pilar: <b>iklim tropis</b>, <b>kesopanan budaya</b>, dan <b>personal color tone</b> Anda.
          </p>
        </motion.div>

        {/* Asymmetric Editorial Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
          {/* BENTO 1 (Hero Wide - 7 Cols): Tropical Climate Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="md:col-span-12 lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-sand-50 border border-sand-200 shadow-tactile flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Ambient Breeze Glow Background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100/80 text-amber-700">
                    <Sun className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-100">
                    AIRFLOW & 33°C READY
                  </span>
                </div>
                <span className="text-[11px] font-mono text-sand-500 font-bold">SPEC 01</span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal-900 tracking-tight">
                  100% Anti-Gerah di Cuaca Panas Tropis
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-900/70 mt-2 leading-relaxed max-w-lg">
                  Dirancang khusus untuk kelembapan 32°C–35°C Indonesia. AI hanya merekomendasikan kain berongga sirkulasi alami yang dingin di kulit seharian.
                </p>
              </div>
            </div>

            {/* Visual Interactive Climate & Fabric Widget */}
            <div className="mt-6 pt-6 border-t border-sand-200/80 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-2 text-charcoal-900 font-bold">
                  <Wind className="w-3.5 h-3.5 text-terracotta-500 animate-pulse" />
                  <span>Sirkulasi Udara: 98.4% Optimal</span>
                </div>
                <span className="text-sand-500 text-[11px]">MATRIKS BAHAN</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-2xl bg-white border border-sand-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-bold text-charcoal-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Katun Rayon
                  </div>
                  <div className="text-[10px] text-sand-500 font-mono">Ultra Lembut & Adem</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-sand-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-bold text-charcoal-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Linen Crinkle
                  </div>
                  <div className="text-[10px] text-sand-500 font-mono">Tekstur Ringan & Berpori</div>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-sand-200 shadow-2xs space-y-1">
                  <div className="text-[11px] font-bold text-charcoal-900 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Voal Breathable
                  </div>
                  <div className="text-[10px] text-sand-500 font-mono">Anti-Pusing & Flowy</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* BENTO 2 (Tall - 5 Cols): Personal Color Undertone Match */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="md:col-span-12 lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-white border border-sand-200 shadow-tactile flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-100/80 text-purple-700">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-terracotta-600 bg-terracotta-50 px-2.5 py-1 rounded-full border border-terracotta-100">
                    COLOR HARMONY
                  </span>
                </div>
                <span className="text-[11px] font-mono text-sand-500 font-bold">SPEC 02</span>
              </div>

              <div>
                <h3 className="font-serif text-2xl font-bold text-charcoal-900 tracking-tight">
                  Personal Color Undertone Match
                </h3>
                <p className="text-xs sm:text-sm text-charcoal-900/70 mt-2 leading-relaxed">
                  Menyelaraskan palet pakaian dengan warna kulit khas Indonesia agar wajah tampak cerah alami & glowing.
                </p>
              </div>
            </div>

            {/* Interactive Color Undertone Simulator */}
            <div className="mt-6 pt-5 border-t border-sand-200 space-y-3">
              <div className="text-[10px] font-mono text-sand-500 uppercase tracking-wider font-bold">
                PILIH WARNA KULIT KAMU (INTERAKTIF):
              </div>

              <div className="flex items-center justify-between gap-1.5 bg-sand-50 p-2 rounded-2xl border border-sand-200">
                {skinToneDemos.map((tone, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSkinIndex(idx)}
                    className={`flex flex-col items-center gap-1 p-1.5 rounded-xl transition-all ${
                      activeSkinIndex === idx
                        ? "bg-white shadow-sm ring-2 ring-terracotta-500"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div
                      className="w-5 h-5 rounded-full border border-black/10 shadow-xs"
                      style={{ backgroundColor: tone.hex }}
                    />
                    <span className="text-[8px] font-mono text-charcoal-900 font-bold">
                      #{idx + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* Dynamic Harmony Palette Output */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSkinIndex}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="p-3 rounded-2xl bg-sand-100/60 border border-sand-200 flex items-center justify-between"
                >
                  <div>
                    <div className="text-[10px] font-mono text-sand-500 uppercase">
                      Kulit: <b>{skinToneDemos[activeSkinIndex].name}</b>
                    </div>
                    <div className="text-xs font-bold text-charcoal-900 mt-0.5">
                      Cocok: {skinToneDemos[activeSkinIndex].colorName}
                    </div>
                  </div>

                  <div className="flex -space-x-1.5">
                    {skinToneDemos[activeSkinIndex].bestColors.map((hex, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                        style={{ backgroundColor: hex }}
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* BENTO 3 (4 Cols): Modest & Hijab Friendly */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -4 }}
            className="md:col-span-6 lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-sand-200 shadow-tactile flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-lg">🧕</span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-olive-700 bg-olive-50 border border-olive-100 px-2.5 py-0.5 rounded-full">
                  MODEST READY
                </span>
              </div>
              <h4 className="font-serif text-xl font-bold text-charcoal-900 group-hover:text-terracotta-500 transition-colors">
                Native Modest & Hijab
              </h4>
              <p className="text-xs text-charcoal-900/70 leading-relaxed">
                Siluet longgar yang anggun, atasan tidak terawang, serta padu-padan pashmina dan voal yang proporsional.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-sand-200 space-y-2">
              <div className="flex items-center gap-2 text-[11px] text-charcoal-900 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Siluet Flowy Anti-Ketat</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-charcoal-900 font-medium">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Bahan Tidak Terawang 100%</span>
              </div>
            </div>
          </motion.div>

          {/* BENTO 4 (4 Cols): 1-Tap 9:16 Instagram Story Export */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ y: -4 }}
            className="md:col-span-6 lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-charcoal-900 text-sand-50 border border-charcoal-800 shadow-xl flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Ambient Terracotta Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-terracotta-500/20 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-xl bg-white/10 text-sand-50">
                  <Share2 className="w-4 h-4" />
                </span>
                <span className="text-[9px] font-mono font-bold tracking-widest text-terracotta-400 border border-white/20 px-2.5 py-0.5 rounded-full">
                  VIRAL 9:16 STORY
                </span>
              </div>
              <h4 className="font-serif text-xl font-bold text-white tracking-tight">
                1-Tap Story Card Export
              </h4>
              <p className="text-xs text-sand-300 leading-relaxed">
                Download rangkuman OOTD beresolusi tinggi rasio 9:16 dengan layout majalah fashion editorial siap post di IG Story.
              </p>
            </div>

            {/* Mini Magazine Story Preview Mockup */}
            <div className="mt-5 pt-4 border-t border-white/15 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-9 rounded bg-white/15 border border-white/25 flex flex-col justify-between p-0.5">
                  <div className="w-2 h-0.5 bg-terracotta-500 rounded" />
                  <div className="w-full h-1 bg-white/40 rounded" />
                </div>
                <span className="text-[10px] font-mono text-sand-300">LOOK.U ARCHIVE 9:16</span>
              </div>
              <span className="text-xs font-bold text-terracotta-400 group-hover:translate-x-1 transition-transform">
                HD Export ↗
              </span>
            </div>
          </motion.div>

          {/* BENTO 5 (4 Cols): Accessible Local Budget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            whileHover={{ y: -4 }}
            className="md:col-span-12 lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-sand-200 shadow-tactile flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="p-1.5 rounded-xl bg-emerald-50 text-emerald-700">
                  <ShoppingBag className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-charcoal-900 bg-sand-100 px-2.5 py-0.5 rounded-full border border-sand-200">
                  REALISTIC PRICING
                </span>
              </div>
              <h4 className="font-serif text-xl font-bold text-charcoal-900 group-hover:text-terracotta-500 transition-colors">
                Ramah Budget Shopee & Tokped
              </h4>
              <p className="text-xs text-charcoal-900/70 leading-relaxed">
                Bukan fashion jutaan rupiah yang mustahil dibeli. Seluruh komponen dapat langsung ditemukan di marketplace dengan rating toko terbaik.
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-sand-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-orange-50 text-orange-600 font-bold text-[10px] border border-orange-200">
                  Shopee
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                  Tokopedia
                </span>
              </div>
              <span className="font-mono font-bold text-charcoal-900 text-[11px]">
                Mulai Rp 85rb
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

