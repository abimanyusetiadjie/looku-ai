"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Heart } from "lucide-react";
import { TRENDING_LOOKS_FEED } from "@/lib/presets";
import { OOTDRecommendation } from "@/lib/types";

interface TrendingFeedProps {
  isStandalone?: boolean;
  onSelectLook?: (outfit: OOTDRecommendation) => void;
}

const FILTERS = ["ALL", "CAMPUS", "HIJAB", "EVENING", "TEXTURE", "FLATLAY"];

export default function TrendingFeed({ isStandalone, onSelectLook }: TrendingFeedProps) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedLookId, setSelectedLookId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<string[]>([]);

  const toggleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setLikedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  // Map real data to the editorial aesthetic requested by user
  const editorialLooks = TRENDING_LOOKS_FEED.map((trend, index) => {
    const isDetail = index === 1; // Arbitrarily make the second item a "DETAIL" shot
    const isFlatlay = index === 3; // Make the fourth a "FLATLAY"
    
    let line1 = `LOOK ${String(index + 1).padStart(2, '0')}`;
    if (isDetail) line1 = "DETAIL";
    else if (isFlatlay) line1 = `LOOK ${String(index + 1).padStart(2, '0')} — FLATLAY`;
    else line1 = `${line1} — ${trend.category.split(' ')[0].toUpperCase()}`;

    let line2 = `${("33°C TROPICAL")} • ${trend.vibe.toUpperCase()}`;
    if (isDetail) line2 = "FABRIC TEXTURE";

    return {
      ...trend,
      line1,
      line2,
      tags: [
        trend.tag.toUpperCase(), 
        trend.category.split(' ')[0].toUpperCase(), 
        isDetail ? "TEXTURE" : (isFlatlay ? "FLATLAY" : "")
      ].filter(Boolean),
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleFilterClick = (f: string) => {
    if (f === activeFilter) return;
    setIsLoading(true);
    setActiveFilter(f);
    setTimeout(() => setIsLoading(false), 400); // 400ms shimmer
  };

  const filteredLooks = activeFilter === "ALL" 
    ? editorialLooks 
    : editorialLooks.filter(look => 
        look.tags.some(tag => tag.includes(activeFilter)) || 
        look.category.toUpperCase().includes(activeFilter) ||
        look.vibe.toUpperCase().includes(activeFilter)
      );

  const selectedLook = editorialLooks.find(l => l.id === selectedLookId);

  return (
    <section className="w-full bg-[#FAF8F5] min-h-screen pb-24">
      {/* Editorial Header */}
      <div className="text-center pt-8 md:pt-12 mb-6 max-w-[1200px] mx-auto px-4 sm:px-8">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#181A18] tracking-tight mb-6">
          LOOKBOOK — EDITORIAL
        </h2>
        
        {/* Horizontal Swipeable Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 justify-start sm:justify-center">
          {FILTERS.map(f => (
            <motion.button
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              key={f}
              onClick={() => handleFilterClick(f)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-[11px] font-sans font-semibold tracking-widest uppercase transition-colors ${
                activeFilter === f 
                  ? 'bg-[#181A18] text-white' 
                  : 'bg-transparent border border-[#181A18]/15 text-[#181A18] hover:border-[#181A18]/40'
              }`}
            >
              {f}
            </motion.button>
          ))}
        </div>
      </div>

      {/* 4:5 Image-First Grid */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 md:gap-5">
          {isLoading ? (
            /* Skeleton Loading State */
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`flex flex-col gap-2 ${i === 0 ? "md:col-span-2" : "col-span-1"}`}>
                <div className={`w-full bg-[#E8DFD1]/50 animate-pulse rounded-xl md:rounded-2xl ${i === 0 ? "aspect-[4/5] md:aspect-[8/5]" : "aspect-[4/5]"}`} />
                <div className="h-3 w-2/3 bg-[#E8DFD1]/50 animate-pulse rounded mt-1" />
                <div className="h-2 w-1/2 bg-[#E8DFD1]/50 animate-pulse rounded" />
              </div>
            ))
          ) : filteredLooks.length > 0 ? (
            /* Actual Grid */
            filteredLooks.map((look, index) => (
              <article 
                key={look.id}
                className={`group cursor-pointer ${
                  index === 0 ? "md:col-span-2" : "col-span-1"
                }`}
              >
                {/* Image Container */}
                <div 
                  onClick={() => setSelectedLookId(look.id)}
                  className={`relative overflow-hidden rounded-xl md:rounded-2xl bg-[#F0EBE1] ${
                    index === 0 ? "aspect-[4/5] md:aspect-[8/5]" : "aspect-[4/5]"
                  }`}
                >
                  <img 
                    src={look.image} 
                    alt={look.line1}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  {/* Subtle Darkening Overlay on Hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />

                  {/* Heart Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(look.id, e);
                    }}
                    className="absolute top-2.5 right-2.5 md:top-4 md:right-4 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-[#181A18] opacity-90 hover:opacity-100 transition-opacity z-10 hover:scale-110"
                    aria-label="Save Look"
                  >
                    <Heart className={`w-[14px] h-[14px] ${likedIds.includes(look.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>

                {/* External Caption */}
                <div className="mt-2.5 px-0.5" onClick={() => setSelectedLookId(look.id)}>
                  <p className="font-sans text-[10px] sm:text-[11px] font-semibold tracking-widest uppercase text-[#181A18] truncate">
                    {look.title}
                  </p>
                  <p className="font-sans text-[9px] sm:text-[10px] tracking-wide text-[#181A18]/60 mt-0.5 truncate flex items-center gap-1.5">
                    {look.line1} <span className="w-1 h-1 bg-[#181A18]/30 rounded-full" /> {look.line2}
                  </p>
                </div>
              </article>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-2 md:col-span-3 flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-[#F0EBE1] flex items-center justify-center">
                <Heart className="w-6 h-6 text-[#181A18]/40" />
              </div>
              <h3 className="font-serif text-xl text-[#181A18] mb-2">Tidak Ada Gaya Ditemukan</h3>
              <p className="text-sm text-[#181A18]/60 max-w-sm">
                Koleksi editorial untuk filter <strong>"{activeFilter}"</strong> belum tersedia saat ini. Coba eksplorasi gaya lainnya.
              </p>
              <button 
                onClick={() => handleFilterClick("ALL")}
                className="mt-6 border border-[#181A18] rounded-full px-6 py-2.5 text-[10px] font-sans font-bold tracking-widest uppercase text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors"
              >
                KEMBALI KE SEMUA LOOK
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Shoppable + Weather-Aware Modal */}
      <AnimatePresence>
        {selectedLook && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-[#F5F1EB] border border-black rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row relative"
            >
              <button 
                onClick={() => setSelectedLookId(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white border border-black rounded-full text-black hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left: Image */}
              <div className="w-full md:w-1/2 p-6 md:pr-3">
                <img 
                  src={selectedLook.image} 
                  alt={selectedLook.line1}
                  className="w-full h-full object-cover border border-black rounded-md aspect-[4/5] md:aspect-auto"
                />
              </div>

              {/* Right: Weather & Shoppable details */}
              <div className="w-full md:w-1/2 p-6 md:pl-3 flex flex-col justify-center">
                <div className="mb-8 border-b border-black/20 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-mono tracking-[0.1em] text-black uppercase">
                      {selectedLook.line1}
                    </div>
                    <button onClick={() => toggleLike(selectedLook.id)} className="flex items-center gap-1 text-[10px] font-mono uppercase font-bold">
                      <Heart className={`w-3 h-3 ${likedIds.includes(selectedLook.id) ? 'fill-rose-500 text-rose-500' : ''}`} />
                      {selectedLook.likes + (likedIds.includes(selectedLook.id) ? 1 : 0)} LIKES
                    </button>
                  </div>

                  <h3 className="font-serif text-3xl md:text-4xl text-black mb-4 leading-tight italic">
                    {selectedLook.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedLook.tags.map((tag: string) => (
                      <span key={tag} className="border border-black rounded-full px-3 py-1 text-[9px] font-mono tracking-widest uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="bg-white border border-black rounded-md p-3 flex items-center gap-3">
                    <span className="text-2xl">🌤️</span>
                    <div>
                      <div className="text-[9px] font-mono tracking-widest uppercase text-black/60">Kondisi Saat Difoto</div>
                      <div className="text-[11px] font-mono tracking-widest uppercase text-black font-bold">{"33°C TROPICAL"}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono tracking-[0.1em] text-black uppercase mb-4 font-bold">
                    Item dalam Look Ini
                  </div>
                  <div className="space-y-3 mb-6">
                    {selectedLook.outfit.items.slice(0, 3).map((prod: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 bg-white border border-black rounded-md p-2">
                        <img src={prod.imageUrl || "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80"} alt={prod.name} className="w-12 h-12 object-cover rounded-sm border border-black/10" />
                        <div className="flex-1">
                          <div className="text-[11px] font-bold text-black font-sans uppercase line-clamp-1">{prod.name}</div>
                          <div className="text-[10px] font-mono text-black/60">{prod.estimatedPrice}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => onSelectLook && onSelectLook(selectedLook.outfit)}
                    className="w-full bg-black text-white rounded-full py-4 text-[10px] font-bold font-mono tracking-[0.1em] uppercase hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
                  >
                    RACIK DI STUDIO <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
