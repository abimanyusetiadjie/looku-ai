const fs = require('fs');
const path = require('path');

// 1. UPDATE LOOKBOOK PAGE
const lookbookPage = path.join(process.cwd(), 'src/app/lookbook/page.tsx');
let pageContent = fs.readFileSync(lookbookPage, 'utf8');

// Remove the old sticky header completely to match the clean design
const headerRegex = /\{\/\* Lookbook App Header Bar \*\/\}(.|\n)*?\{\/\* Main Content Area \*\/\}/g;
if (pageContent.match(headerRegex)) {
  pageContent = pageContent.replace(headerRegex, '{/* Main Content Area */}');
}

// Remove the community challenge section since the user's mockup is strictly the Editorial Grid
const challengeRegex = /\{\/\* Community OOTD Challenge Section \*\/\}(.|\n)*?<\/main>/g;
if (pageContent.match(challengeRegex)) {
  pageContent = pageContent.replace(challengeRegex, '</main>');
}

fs.writeFileSync(lookbookPage, pageContent, 'utf8');

// 2. REWRITE TRENDING FEED
const feedFile = path.join(process.cwd(), 'src/components/TrendingFeed.tsx');

const newFeedContent = `"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";

interface LookbookItem {
  id: string;
  imgUrl: string;
  line1: string;
  line2: string;
  tags: string[];
  weather: string;
  products: { name: string; price: string; img: string }[];
}

const LOOKBOOK_DATA: LookbookItem[] = [
  {
    id: "l1",
    imgUrl: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=800&q=80",
    line1: "LOOK 01 — CAMPUS",
    line2: "33°C • BREATHABLE",
    tags: ["BREATHABLE", "MODEST"],
    weather: "33°C Panas Terik",
    products: [
      { name: "Linen Crinkle Kulot", price: "Rp 145.000", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80" },
      { name: "Airflow Oversized Shirt", price: "Rp 120.000", img: "https://images.unsplash.com/photo-1620799140408-35632e1ea25c?w=400&q=80" }
    ]
  },
  {
    id: "l2",
    imgUrl: "https://images.unsplash.com/photo-1620799140408-35632e1ea25c?w=800&q=80",
    line1: "DETAIL",
    line2: "LINEN CRINKLE",
    tags: ["TEXTURE", "COOLING"],
    weather: "Semua Cuaca",
    products: [
      { name: "Premium Linen Crinkle Fabric", price: "Rp 45.000/m", img: "https://images.unsplash.com/photo-1620799140408-35632e1ea25c?w=400&q=80" }
    ]
  },
  {
    id: "l3",
    imgUrl: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800&q=80",
    line1: "LOOK 02",
    line2: "HIJAB ADEM • MODEST",
    tags: ["HIJAB", "EFFORTLESS", "MODEST"],
    weather: "30°C Lembab",
    products: [
      { name: "Voal Miracle Hijab", price: "Rp 85.000", img: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400&q=80" },
      { name: "Cotton Rayon Blouse", price: "Rp 110.000", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" }
    ]
  },
  {
    id: "l4",
    imgUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
    line1: "LOOK 03",
    line2: "FLATLAY • CURATED",
    tags: ["FLATLAY", "ESSENTIAL"],
    weather: "Indoor AC",
    products: [
      { name: "Earthy Minimalist Set", price: "Rp 250.000", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80" }
    ]
  },
  {
    id: "l5",
    imgUrl: "https://images.unsplash.com/photo-1434389670869-c41936336be0?w=800&q=80",
    line1: "LOOK 04",
    line2: "NONGKRONG SORE",
    tags: ["EVENING", "CHIC"],
    weather: "28°C Berangin",
    products: [
      { name: "Knit Vest Premium", price: "Rp 135.000", img: "https://images.unsplash.com/photo-1434389670869-c41936336be0?w=400&q=80" },
      { name: "Wide Leg Trousers", price: "Rp 160.000", img: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80" }
    ]
  },
  {
    id: "l6",
    imgUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80",
    line1: "LOOK 05",
    line2: "EFFORTLESS",
    tags: ["CAMPUS", "STREETWEAR"],
    weather: "32°C Panas Terik",
    products: [
      { name: "Oversized Cotton Tee", price: "Rp 90.000", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80" },
      { name: "Flowy Skirt", price: "Rp 125.000", img: "https://images.unsplash.com/photo-1620799140408-35632e1ea25c?w=400&q=80" }
    ]
  }
];

const FILTERS = ["ALL", "CAMPUS", "HIJAB", "EVENING", "TEXTURE", "FLATLAY"];

export default function TrendingFeed({ isStandalone }: { isStandalone?: boolean }) {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selectedLook, setSelectedLook] = useState<LookbookItem | null>(null);

  const filteredLooks = activeFilter === "ALL" 
    ? LOOKBOOK_DATA 
    : LOOKBOOK_DATA.filter(look => look.tags.includes(activeFilter));

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
              className={\`shrink-0 border border-black rounded-full px-6 py-2 text-[10px] font-mono tracking-[0.1em] uppercase transition-colors \${
                activeFilter === f 
                  ? "bg-black text-white" 
                  : "bg-transparent text-black hover:bg-black/5"
              }\`}
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
            onClick={() => setSelectedLook(look)}
            className="bg-[#F5F1EB] border border-black rounded-xl aspect-[4/3] p-4 flex flex-col cursor-pointer hover:shadow-lg transition-all group"
          >
            <div className="w-full flex-1 relative overflow-hidden mb-3">
              <img 
                src={look.imgUrl} 
                alt={look.line1}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="text-center">
              <div className="text-[10px] font-mono tracking-[0.1em] uppercase text-black leading-tight">
                {look.line1}
              </div>
              <div className="text-[10px] font-mono tracking-[0.1em] uppercase text-black leading-tight">
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
                onClick={() => setSelectedLook(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white border border-black rounded-full text-black hover:bg-black hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Left: Image */}
              <div className="w-full md:w-1/2 p-6 md:pr-3">
                <img 
                  src={selectedLook.imgUrl} 
                  alt={selectedLook.line1}
                  className="w-full h-full object-cover border border-black rounded-md aspect-[4/5] md:aspect-auto"
                />
              </div>

              {/* Right: Weather & Shoppable details */}
              <div className="w-full md:w-1/2 p-6 md:pl-3 flex flex-col justify-center">
                <div className="mb-8 border-b border-black/20 pb-6">
                  <div className="text-[10px] font-mono tracking-[0.1em] text-black uppercase mb-2">
                    {selectedLook.line1}
                  </div>
                  <h3 className="font-serif text-3xl md:text-4xl text-black mb-4 leading-tight italic">
                    {selectedLook.line2.replace(" • ", " & ")}
                  </h3>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedLook.tags.map(tag => (
                      <span key={tag} className="border border-black rounded-full px-3 py-1 text-[9px] font-mono tracking-widest uppercase">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="bg-white border border-black rounded-md p-3 flex items-center gap-3">
                    <span className="text-2xl">🌤️</span>
                    <div>
                      <div className="text-[9px] font-mono tracking-widest uppercase text-black/60">Kondisi Saat Difoto</div>
                      <div className="text-[11px] font-mono tracking-widest uppercase text-black font-bold">{selectedLook.weather}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-mono tracking-[0.1em] text-black uppercase mb-4 font-bold">
                    Item dalam Look Ini
                  </div>
                  <div className="space-y-3 mb-6">
                    {selectedLook.products.map((prod, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white border border-black rounded-md p-2">
                        <img src={prod.img} alt={prod.name} className="w-12 h-12 object-cover rounded-sm border border-black/10" />
                        <div className="flex-1">
                          <div className="text-[11px] font-bold text-black font-sans uppercase">{prod.name}</div>
                          <div className="text-[10px] font-mono text-black/60">{prod.price}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full bg-black text-white rounded-full py-4 text-[10px] font-bold font-mono tracking-[0.1em] uppercase hover:bg-black/80 transition-colors flex items-center justify-center gap-2">
                    SHOP THIS LOOK <ArrowRight className="w-4 h-4" />
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
`;

fs.writeFileSync(feedFile, newFeedContent, 'utf8');

console.log("Lookbook completely overhauled to Editorial spec.");
