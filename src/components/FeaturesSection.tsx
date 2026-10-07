"use client";

import React from "react";

export default function FeaturesSection() {
  const features = [
    {
      title: "Climate Intelligence",
      description: "Material linen & airflow yang dipetakan presisi untuk suhu tropis 33°C.",
      image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&q=80",
      colors: null
    },
    {
      title: "Skin-Tone Analytics",
      description: "Analisis undertone untuk palet warna yang memancarkan kilau alami kulit Anda.",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80",
      colors: ["#D4A373", "#FAEDCD", "#CCD5AE", "#E9EDC9"]
    },
    {
      title: "Modest Architecture",
      description: "Siluet flowy proporsional & material 100% bebas terawang.",
      image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80",
      colors: null
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-[#FAF8F5]">
      <div className="max-w-[1200px] mx-auto px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl sm:text-4xl text-charcoal-900 tracking-tight">
            The Logic Behind the Looks
          </h2>
          <div className="h-[1px] w-12 bg-terracotta-500 mx-auto mt-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10">
          {features.map((item, idx) => (
            <div key={idx} className="group relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 cursor-pointer">
              {/* Background Image with Zoom */}
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" 
              />
              
              {/* Elegant Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/90 via-charcoal-900/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

              {/* Content Positioned at Bottom */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {/* Fake Color Swatch for Skin Tone Card */}
                {item.colors && (
                  <div className="flex gap-2 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.colors.map((hex, i) => (
                      <div key={i} className="w-5 h-5 rounded-full border border-white/40 shadow-sm" style={{ backgroundColor: hex }} />
                    ))}
                  </div>
                )}
                
                <h3 className="font-serif text-2xl text-white mb-2 tracking-wide">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-white/80 leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
