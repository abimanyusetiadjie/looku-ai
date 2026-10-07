"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Bagaimana look.u menentukan apakah pakaian cocok untuk cuaca & kulit?",
      a: "Sistem kami memetakan Personal Color Undertone Anda dengan sirkulasi kain tropis. AI secara ketat menyaring bahan linen, katun rayon, dan crinkle yang optimal untuk cuaca 33°C, lalu mencocokkannya dengan palet warna yang memancarkan kilau alami kulit Anda.",
    },
    {
      q: "Apakah seluruh koleksi mengakomodasi Modest Fashion & Hijab?",
      a: "Tentu. Algoritma kami memiliki filter Modest Architecture yang memastikan siluet flowy, bahan tidak terawang, dan paduan jilbab (seperti pashmina atau voal) yang proporsional secara warna dan tekstur.",
    },
    {
      q: "Bagaimana cara mendapatkan pakaian yang direkomendasikan?",
      a: "Kami telah mengintegrasikan kata kunci spesifik untuk setiap setelan. Dengan satu klik, Anda akan diarahkan ke hasil pencarian paling relevan di Official Store Shopee atau Tokopedia.",
    },
    {
      q: "Apakah layanan ini memiliki biaya langganan?",
      a: "Akses ke Studio OOTD, analisis Personal Color, dan kurasi Lookbook saat ini sepenuhnya gratis untuk publik.",
    },
  ];

  return (
    <section id="faq" className="py-32 bg-white max-w-[1000px] mx-auto px-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center sm:text-left"
      >
        <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-sand-500">
          Inquiries & Clarification
        </span>
        <h2 className="font-serif text-4xl lg:text-5xl text-charcoal-900 tracking-tight mt-4">
          Frequently Asked.
        </h2>
      </motion.div>

      <div className="border-t border-charcoal-900">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="border-b border-sand-300"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full py-8 text-left flex items-center justify-between gap-8 group"
              >
                <span className="font-serif text-xl sm:text-2xl text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                  {faq.q}
                </span>
                <span className="text-sand-400 group-hover:text-charcoal-900 transition-colors shrink-0">
                  {isOpen ? <Minus className="w-5 h-5 stroke-[1.5]" /> : <Plus className="w-5 h-5 stroke-[1.5]" />}
                </span>
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
                    <div className="pb-8 pt-2 font-sans text-sm text-sand-600 leading-relaxed max-w-2xl">
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
