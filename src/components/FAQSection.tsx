"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana Looku AI menentukan apakah pakaian cocok untuk cuaca & warna kulit saya?",
      a: "Engine Looku dilatih dengan matriks Personal Color Undertone dan sirkulasi kain tropis. AI secara otomatis memilih bahan katun linen/rayon/crinkle yang adem serta warna palet yang memberi efek mencerahkan kulit pengguna.",
    },
    {
      q: "Apakah seluruh rekomendasi ramah untuk pengguna Hijab & Modest?",
      a: "Ya. Saat mode 'Hijab Spec' aktif, sistem memfilter pakaian yang tidak terawang, berpotongan longgar/flowy, serta memadukan jenis jilbab (pashmina ceruty / voal laser cut) yang senada dengan palet warna utama.",
    },
    {
      q: "Bagaimana cara membeli piece yang direkomendasikan?",
      a: "Setiap kartu OOTD dilengkapi tautan 'Cari Shopee' & 'Cari Tokopedia' yang telah dikurasi kata kuncinya agar Anda langsung menemukan model serupa dengan ulasan terbaik dan harga terjangkau.",
    },
    {
      q: "Apakah layanan Looku berbayar?",
      a: "Fitur kurasi OOTD harian, analisis personal color, dan ekspor kartu Instagram Story dapat digunakan 100% gratis.",
    },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border-b border-[#D7CABC] pb-6 mb-10 text-center sm:text-left"
      >
        <span className="lookbook-label">INQUIRIES & CLARIFICATION</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#181A18] tracking-tight mt-1">
          Pertanyaan Umum
        </h2>
      </motion.div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.06 }}
              className="bg-white rounded-2xl border border-[#E8DFD1] overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left font-serif font-bold text-[#181A18] flex items-center justify-between gap-4 hover:bg-[#FAF8F5] transition-colors text-base sm:text-lg"
              >
                <span>{faq.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="p-1 rounded-full bg-[#F4EFE6] text-[#181A18] shrink-0"
                >
                  {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                </motion.span>
              </button>
              
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#181A18]/70 leading-relaxed border-t border-[#E8DFD1]">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
