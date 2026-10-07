"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      id: "01",
      title: "Climate Intelligence",
      description: "Algorithmically curated fabrics like premium linen and breathable cotton blends, specifically mapped to 33°C tropical humidity."
    },
    {
      id: "02",
      title: "Skin-Tone Analytics",
      description: "Advanced color theory matching. We analyze your undertone to recommend palettes that provide an instant natural glow."
    },
    {
      id: "03",
      title: "Modest Architecture",
      description: "Dedicated algorithms for Hijab and modest wear. Ensuring flowy silhouettes and zero-transparency materials without compromising style."
    },
    {
      id: "04",
      title: "Seamless Commerce",
      description: "Direct integration with Shopee and Tokopedia official stores. Turning AI recommendations into reality instantly."
    }
  ];

  return (
    <section className="py-32 bg-[#FAF8F5] border-t border-sand-300">
      <div className="max-w-[1400px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Massive Typography */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="sticky top-32"
            >
              <h2 className="font-serif text-5xl lg:text-6xl text-charcoal-900 tracking-tight leading-[1.1]">
                The Logic<br />
                <span className="italic text-sand-500 font-light">Behind the Looks.</span>
              </h2>
              <p className="mt-8 font-sans text-sm text-charcoal-900/70 max-w-sm leading-relaxed tracking-wide">
                We bridge the gap between high fashion and everyday tropical reality. Our system considers multiple physical and environmental parameters to generate the perfect outfit formula.
              </p>
              <div className="mt-12 flex items-center gap-4">
                <div className="h-px w-12 bg-charcoal-900" />
                <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-charcoal-900">Proprietary AI Engine</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Minimalist List */}
          <div className="lg:col-span-7 flex flex-col gap-0 border-t border-sand-300">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group flex flex-col sm:flex-row items-start gap-6 sm:gap-12 py-10 border-b border-sand-300 hover:bg-white transition-colors px-6 -mx-6 sm:mx-0 sm:px-0"
              >
                <div className="font-mono text-sm text-sand-400 group-hover:text-terracotta-500 transition-colors pt-1">
                  {feature.id}
                </div>
                <div className="flex-1">
                  <h3 className="font-serif text-2xl text-charcoal-900 group-hover:text-terracotta-600 transition-colors mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-sand-600 leading-relaxed max-w-md">
                    {feature.description}
                  </p>
                </div>
                <div className="hidden sm:block pt-2">
                  <ArrowRight className="w-5 h-5 text-sand-300 group-hover:text-terracotta-500 group-hover:-rotate-45 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
