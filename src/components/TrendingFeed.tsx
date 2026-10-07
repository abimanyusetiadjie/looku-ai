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

  const filteredLooks = activeFilter === "ALL" 
    ? editorialLooks 
    : editorialLooks.filter(look => 
        look.tags.some(tag => tag.includes(activeFilter)) || 
        look.category.toUpperCase().includes(activeFilter) ||
        look.vibe.toUpperCase().includes(activeFilter)
      );

  const selectedLook = editorialLooks.find(l => l.id === selectedLookId);

  return (
    <section className="w-full">
      {/* Editorial Header */}
      <div className="text-center mb-8 mt-4">
        <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-black tracking-tight mb-6">
          LOOKBOOK — EDITORIAL
        </h2>
        
        {/* Horizontal Swipeable Filters */}
        <div className="flex overflow-x-auto no-scrollbar justify-start md:justify-center gap-3 px-4 pb-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 border border-black rounded-full px-6 py-2 text-[10px] font-mono tracking-[0.1em] uppercase transition-colors ${
                activeFilter === f 
                  ? "bg-black text-white" 
                  : "bg-transparent text-black hover:bg-black/5"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 4:3 Editorial Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0 max-w-6xl mx-auto">
        {filteredLooks.map((look) => (
          <div 
            key={look.id}
            onClick={() => setSelectedLookId(look.id)}
            className="bg-[#F5F1EB] border border-black rounded-xl aspect-[4/3] p-4 flex flex-col cursor-pointer hover:shadow-lg transition-all group relative"
          >
            {/* Standard "Like" feature */}
            <button
              onClick={(e) => toggleLike(look.id, e)}
              className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/50 backdrop-blur-md hover:bg-white transition-colors"
            >
              <Heart className={`w-4 h-4 ${likedIds.includes(look.id) ? 'fill-black text-black' : 'text-black'}`} />
            </button>

            <div className="w-full flex-1 relative overflow-hidden mb-3">
              <img 
                src={look.image} 
                alt={look.line1}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="text-center">
              <div className="text-[10px] font-mono tracking-[0.1em] uppercase text-black leading-tight">
                {look.line1}
              </div>
              <div className="text-[10px] font-mono tracking-[0.1em] uppercase text-black leading-tight truncate">
                {look.line2}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button className="border border-black rounded-full px-8 py-3 text-[10px] font-mono tracking-[0.1em] uppercase text-black hover:bg-black hover:text-white transition-colors">
          VIEW ALL EDITORIAL
        </button>
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
