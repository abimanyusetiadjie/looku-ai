const fs = require('fs');
const path = require('path');

// ==========================================
// 1. REWRITE GENERATOR FORM AS CHAT UI
// ==========================================
const generatorFile = path.join(process.cwd(), 'src/components/GeneratorForm.tsx');
const chatUIContent = `"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserPreferences } from "@/lib/types";

interface ChatFormProps {
  onGenerate: (prefs: UserPreferences) => void;
  isLoading: boolean;
  externalPrefs?: Partial<UserPreferences>;
}

export default function GeneratorForm({ onGenerate, isLoading }: ChatFormProps) {
  const [selectedReply, setSelectedReply] = useState<string | null>(null);

  const handleSelect = (reply: string, occasion: "kuliah" | "santai_rumah" | "hangout") => {
    setSelectedReply(reply);
    onGenerate({
      stylingMode: "solo",
      gender: "female",
      isModestHijab: true,
      occasion: occasion,
      weather: "panas_terik",
      budget: "menengah",
      vibe: "earthy_minimalist"
    });
  };

  return (
    <div className="w-full bg-[#F4EFE6] rounded-xl border border-charcoal-900 overflow-hidden shadow-sm mb-6">
      <div className="flex items-center gap-2 p-4 border-b border-charcoal-900">
        <span className="text-[10px] font-mono tracking-widest text-charcoal-900 font-bold uppercase">
          ✦ AI STYLIST STUDIO • CHAT
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* AI Bubble */}
        <div>
          <span className="text-[9px] font-mono uppercase bg-charcoal-900 text-white px-2 py-0.5 rounded-full ml-2 mb-1.5 inline-block font-bold tracking-wider">
            AI STYLIST • LOOK.U
          </span>
          <div className="bg-charcoal-900 text-white p-5 rounded-2xl rounded-tl-sm w-11/12 shadow-md">
            <p className="font-sans text-[13px] leading-relaxed">
              Hai, di suhu 33°C hari ini. Mau look adem untuk kampus atau hangout sore?
            </p>
          </div>
        </div>

        {/* Quick Replies */}
        {!selectedReply && (
          <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-2 pt-2">
            <button 
              onClick={() => handleSelect("Iya, yang adem dan effortless untuk kuliah. Hijab juga ya.", "kuliah")} 
              className="px-4 py-2.5 rounded-full border border-charcoal-900 text-charcoal-900 text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal-900 hover:text-white transition-colors"
            >
              LOOK UNTUK KAMPUS 33°C
            </button>
            <button 
              onClick={() => handleSelect("Mau yang adem, flowy, dan tetap modest.", "santai_rumah")} 
              className="px-4 py-2.5 rounded-full border border-charcoal-900 text-charcoal-900 text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal-900 hover:text-white transition-colors"
            >
              HIJAB ADEM
            </button>
            <button 
              onClick={() => handleSelect("Outfit nongkrong sore yang santai tapi chic.", "hangout")} 
              className="px-4 py-2.5 rounded-full border border-charcoal-900 text-charcoal-900 text-[10px] font-bold uppercase tracking-widest hover:bg-charcoal-900 hover:text-white transition-colors"
            >
              NONGKRONG SORE
            </button>
          </motion.div>
        )}

        {/* User Bubble */}
        {selectedReply && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end pt-4">
            <div className="bg-white border border-charcoal-900 text-charcoal-900 p-5 rounded-2xl rounded-tr-sm w-10/12 shadow-md">
              <p className="font-sans text-[13px] leading-relaxed font-medium">
                {selectedReply}
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading State inside chat */}
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start pt-4">
            <span className="text-[10px] font-mono animate-pulse text-charcoal-900 font-bold uppercase tracking-widest">
              Meracik Outfit...
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
`;
fs.writeFileSync(generatorFile, chatUIContent, 'utf8');

// ==========================================
// 2. REWRITE PAGE.TSX
// ==========================================
const pageFile = path.join(process.cwd(), 'src/app/studio/page.tsx');
let pageContent = fs.readFileSync(pageFile, 'utf8');

// We need to inject the layout. Wait, I will use replace_file_content logic if it's too big, 
// but rewriting it completely is cleaner. I will use a regex to replace the main grid layout in page.tsx.

const gridRegex = /\{\/\* Studio Grid \*\/\}(.|\n)*?\{\/\* Weekly Outfit Calendar \(7-Day Planner Accordion\) \*\/\}/g;

const newGridLayout = `{/* Top Header Bar Minimalist Beige */}
        <div className="w-full text-center pb-8 pt-4">
           <p className="text-[9px] font-mono tracking-[0.25em] font-bold uppercase text-charcoal-900 mb-4">
             DESIGN • LOOK.U LUXURY AI STYLIST STUDIO
           </p>
           <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal-900 tracking-tight">
             Look.u
           </h1>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start bg-[#F4EFE6] p-4 sm:p-8 rounded-2xl">
          {/* Left Panel: Chat + Recommendations */}
          <div className="w-full flex flex-col gap-6">
            <GeneratorForm
              onGenerate={handleGenerate}
              isLoading={isLoading}
              externalPrefs={externalPrefs}
            />
            {currentOutfit && !isLoading && (
              <div className="w-full">
                <div className="text-center mb-4">
                  <span className="text-[10px] font-mono tracking-widest font-bold text-charcoal-900 uppercase">
                    REKOMENDASI PRODUK • {currentOutfit.items.length} ITEM
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {currentOutfit.items.slice(0,2).map((item: any, idx: number) => (
                    <div key={idx} className="bg-white border border-charcoal-900 rounded-xl overflow-hidden p-4 flex flex-col items-center">
                      <img src={item.imageUrl || "https://images.unsplash.com/photo-1620799140408-35632e1ea25c?w=400&q=80"} alt={item.name} className="w-full aspect-square object-cover rounded-md mb-4" />
                      <h3 className="font-serif text-sm font-bold text-charcoal-900 text-center uppercase leading-tight mb-1">{item.name}</h3>
                      <p className="font-sans text-[9px] text-charcoal-900/60 mb-4 text-center">{item.material} • {item.breathability}</p>
                      <button className="w-full py-2 border border-charcoal-900 rounded-full text-[9px] font-bold uppercase tracking-widest text-charcoal-900 hover:bg-charcoal-900 hover:text-white transition-colors">
                        ADD TO WARDROBE +
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel: Curated Look Preview */}
          <div className="w-full bg-[#F4EFE6] border border-charcoal-900 rounded-xl p-6 lg:p-10 flex flex-col items-center">
            <div className="text-center mb-6">
              <span className="text-[10px] font-mono tracking-widest font-bold text-charcoal-900 uppercase">
                CURATED LOOK PREVIEW
              </span>
            </div>

            <AnimatePresence mode="wait">
              {isLoading ? (
                <MultiStageLoader key="loader" />
              ) : currentOutfit ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={currentOutfit.id} 
                  className="w-full flex flex-col items-center"
                >
                  <img 
                    src={currentOutfit.flatlayImages?.[0] || "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=800&q=80"} 
                    alt="Curated Preview" 
                    className="w-full max-w-sm aspect-[3/4] object-cover border border-charcoal-900 rounded-sm mb-8 shadow-sm" 
                  />
                  
                  <span className="text-[10px] font-mono tracking-widest text-charcoal-900 uppercase font-bold mb-2">LOOK:</span>
                  <h2 className="font-serif text-2xl lg:text-3xl font-medium text-charcoal-900 italic text-center mb-6 leading-tight">
                    {currentOutfit.title}
                  </h2>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-10">
                    <span className="px-3 py-1.5 border border-charcoal-900 rounded-full text-[9px] font-bold uppercase tracking-widest">BREATHABLE</span>
                    <span className="px-3 py-1.5 border border-charcoal-900 rounded-full text-[9px] font-bold uppercase tracking-widest">COOL</span>
                    <span className="px-3 py-1.5 border border-charcoal-900 rounded-full text-[9px] font-bold uppercase tracking-widest">EFFORTLESS</span>
                  </div>

                  <button className="w-full max-w-sm py-4 bg-charcoal-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-xl">
                    SAVE TO LOOKBOOK
                  </button>
                  <div className="mt-8 text-center text-[9px] font-mono uppercase tracking-[0.2em] text-charcoal-900/50">
                    CURATED LOOK PREVIEW
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex items-center justify-center min-h-[400px]">
                  <p className="font-serif italic text-charcoal-900/50 text-xl text-center">Menunggu respons Anda di panel chat...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Weekly Outfit Calendar (7-Day Planner Accordion) */}`;

pageContent = pageContent.replace(gridRegex, newGridLayout);
fs.writeFileSync(pageFile, pageContent, 'utf8');

console.log("Massive Luxury UI Chat Overhaul completed!");
