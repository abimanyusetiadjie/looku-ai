"use client";

import React from "react";
import { Sun, Palette, Layers } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-24 sm:py-32 bg-[#FAF8F5] border-t border-sand-300">
      <div className="max-w-[1200px] mx-auto px-8 text-center">
        <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 tracking-tight">
          The Logic Behind the Looks
        </h2>
        <div className="h-[1px] w-12 bg-charcoal-900 mx-auto mt-6 mb-20" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 sm:gap-20">
          {/* Feature 1 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full border border-charcoal-900/20 bg-white mb-6">
              <Sun className="w-6 h-6 text-charcoal-900" strokeWidth={1.5} />
            </div>
            <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-charcoal-900 mb-4">
              Climate Intelligence
            </h3>
            <p className="font-sans text-[13px] text-charcoal-900/70 leading-relaxed max-w-[260px] text-center">
              Material kurasi algoritma khusus seperti premium linen dan katun airflow yang dipetakan secara presisi untuk kelembapan tropis 33°C.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full border border-charcoal-900/20 bg-white mb-6">
              <Palette className="w-6 h-6 text-charcoal-900" strokeWidth={1.5} />
            </div>
            <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-charcoal-900 mb-4">
              Skin-Tone Analytics
            </h3>
            <p className="font-sans text-[13px] text-charcoal-900/70 leading-relaxed max-w-[260px] text-center">
              Pencocokan teori warna tingkat lanjut. Kami menganalisis *undertone* Anda untuk merekomendasikan palet yang memberikan kilau alami seketika.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full border border-charcoal-900/20 bg-white mb-6">
              <Layers className="w-6 h-6 text-charcoal-900" strokeWidth={1.5} />
            </div>
            <h3 className="font-sans text-xs uppercase tracking-widest font-bold text-charcoal-900 mb-4">
              Modest Architecture
            </h3>
            <p className="font-sans text-[13px] text-charcoal-900/70 leading-relaxed max-w-[260px] text-center">
              Logika khusus untuk mode Hijab & Modest yang memastikan siluet *flowy* elegan dan material 100% bebas terawang tanpa mengorbankan gaya.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
