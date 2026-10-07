const fs = require('fs');
const path = require('path');

const pageFile = path.join(process.cwd(), 'src/app/lemari/page.tsx');

const newContent = `"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, Trash2 } from "lucide-react";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";

// Helper SVG for thin hanger
const HangerIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C10.8954 2 10 2.89543 10 4C10 5.10457 10.8954 6 12 6C12.5523 6 13 6.44772 13 7V8L4 16C3.44772 16.4969 3.5 17.5 4.5 17.5H19.5C20.5 17.5 20.5523 16.4969 20 16L11 8V7C11 5.34315 12.3431 4 14 4" />
  </svg>
);

export default function WardrobePage() {
  const [savedOutfits, setSavedOutfits] = useState<OOTDRecommendation[]>([]);
  const [myItems, setMyItems] = useState<OutfitItem[]>([]);
  const [boardItems, setBoardItems] = useState<OutfitItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem("looku_saved_outfits");
    if (stored) {
      try {
        const outfits: OOTDRecommendation[] = JSON.parse(stored);
        setSavedOutfits(outfits);
        
        // Extract unique items from outfits to populate MY ITEMS
        const items: OutfitItem[] = [];
        outfits.forEach(o => {
          o.items.forEach(i => {
            if (!items.find(existing => existing.name === i.name)) {
              items.push(i);
            }
          });
        });
        
        // For the sake of the pitch innovation, if there are no items, let's provide realistic mock data
        if (items.length < 3) {
           setMyItems([
             { name: "Linen Crinkle Kulot", category: "bawahan", color: "Rose Pink", estimatedPrice: "Rp 150.000", material: "Linen", imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80", shopeeQuery: "", tokopediaQuery: "" },
             { name: "Linen Shirt", category: "atasan", color: "Off White", estimatedPrice: "Rp 120.000", material: "Linen", imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", shopeeQuery: "", tokopediaQuery: "" },
             { name: "Cotton Hijab", category: "outer_hijab", color: "Natural", estimatedPrice: "Rp 85.000", material: "Cotton", imageUrl: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=400&q=80", shopeeQuery: "", tokopediaQuery: "" },
           ]);
        } else {
           setMyItems(items.slice(0, 3)); // Keep it clean to 3 items for the UX demo
        }
      } catch (e) {}
    }
  }, []);

  const handleDragStart = (e: React.DragEvent, item: OutfitItem) => {
    e.dataTransfer.setData("application/json", JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const data = e.dataTransfer.getData("application/json");
      const item = JSON.parse(data);
      if (!boardItems.find(i => i.name === item.name)) {
        setBoardItems([...boardItems, item]);
      }
    } catch (e) {}
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const removeFromBoard = (name: string) => {
    setBoardItems(boardItems.filter(i => i.name !== name));
  };

  if (!isClient) return null;

  const isEmpty = savedOutfits.length === 0 && myItems.length === 0;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black pb-20">
      
      {/* Header matching the Mockup */}
      <div className="w-full pt-12 pb-8 px-6 lg:px-12 border-b border-black">
        <h1 className="font-serif text-4xl lg:text-5xl text-black uppercase tracking-tight mb-4">
          WARDROBE — YOUR CURATED CLOSET.
        </h1>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-black/70">
          <div className="font-sans text-[13px] tracking-wide">
            Curated for Pontianak 33°C • Breathable • Modest • {isEmpty ? 0 : myItems.length} items.
          </div>
          <div className="border border-black rounded-full px-4 py-1.5 flex items-center gap-2 text-[11px] font-mono uppercase bg-[#F5F1EB] text-black w-fit">
            <span>🌤️</span> Pontianak 33°C
          </div>
        </div>
      </div>

      {isEmpty ? (
        /* BAGIAN 1: EMPTY STATE */
        <div className="mt-12 mx-6 lg:mx-12 bg-[#F5F1EB] border border-black rounded-[12px] py-24 px-6 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-black mb-6">
             <HangerIcon />
          </div>
          <h2 className="font-serif text-3xl md:text-4xl text-black mb-3">Your wardrobe is empty, curated for 33°C.</h2>
          <p className="font-sans text-sm text-black/60 mb-10">Start with AI Stylist to build your first breathable look.</p>
          <div className="flex flex-col sm:flex-row gap-4">
             <Link href="/studio" className="bg-black text-white px-8 py-3.5 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-black/80 transition-colors">
               START WITH AI STYLIST
             </Link>
             <Link href="/lookbook" className="border border-black bg-transparent text-black px-8 py-3.5 rounded-full text-[10px] font-bold tracking-[0.15em] uppercase hover:bg-black/5 transition-colors">
               BROWSE LOOKBOOK
             </Link>
          </div>
        </div>
      ) : (
        /* BAGIAN 2: FILLED STATE (Mix & Match Canvas) */
        <div className="mt-10 mx-6 lg:mx-12">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Col 1: MY ITEMS */}
            <div className="lg:col-span-5 flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {myItems.map((item, idx) => (
                <div key={idx} className="flex-1 min-w-[140px] flex flex-col">
                  <div className="text-center mb-3">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-black line-clamp-1">{item.name}</div>
                    <div className="text-[9px] font-mono uppercase tracking-[0.1em] text-black/60">{item.color}</div>
                  </div>
                  
                  <div 
                    draggable 
                    onDragStart={(e) => handleDragStart(e, item)}
                    className="bg-[#F5F1EB] border border-black rounded-[12px] p-3 flex flex-col cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group h-full"
                  >
                    <div className="w-full aspect-square relative bg-black/5 rounded-md mb-4 overflow-hidden">
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    
                    <div className="mt-auto border border-black rounded-full py-2 px-2 text-[8px] font-bold uppercase tracking-widest text-center text-black/80 flex items-center justify-center gap-1">
                      <span>↘ DRAG TO MIX & MATCH </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Col 2: MIX & MATCH BOARD */}
            <div className="lg:col-span-5">
              <div className="text-center mb-3">
                <div className="text-[10px] font-bold uppercase tracking-widest text-black">MIX & MATCH BOARD</div>
              </div>
              <div 
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="bg-[#F5F1EB] border border-black rounded-[12px] p-6 relative flex flex-col items-center justify-center min-h-[400px] shadow-inner"
              >
                <div className="text-[10px] font-mono uppercase tracking-[0.1em] absolute top-6 text-black/60 text-center w-full">Mix & Match Canvas</div>
                
                {boardItems.length === 0 ? (
                  <div className="text-black/30 font-serif italic text-xl border-2 border-dashed border-black/20 w-3/4 h-64 flex items-center justify-center rounded-xl">
                    Drag items here
                  </div>
                ) : (
                  <div className="relative w-full h-full flex flex-col items-center justify-center min-h-[300px] gap-2 pt-10">
                     {boardItems.map((item, idx) => (
                       <div key={idx} onClick={() => removeFromBoard(item.name)} className="relative group cursor-pointer w-48 h-48 bg-white border border-black/10 rounded-lg shadow-sm overflow-hidden z-10 hover:z-20 transform transition-transform hover:scale-105" style={{ marginTop: idx > 0 ? '-60px' : '0' }}>
                         <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-mono font-bold uppercase">Click to remove</div>
                       </div>
                     ))}
                  </div>
                )}

                <div className="mt-8 border border-black rounded-full px-4 py-1.5 flex items-center justify-between text-[8px] sm:text-[9px] font-mono uppercase bg-[#F5F1EB] text-black w-full max-w-sm">
                  <span>LOOK 05 — DAILY BREATHE • 33°C • BREATHABLE • HIJAB FRIENDLY</span>
                  <span className="flex items-center gap-1 border-l border-black/30 pl-2">🌤️ 33°C</span>
                </div>
              </div>
            </div>

            {/* Col 3: ACTIONS & AI LOGIC */}
            <div className="lg:col-span-2 flex flex-col gap-3">
               <div className="text-center lg:text-left mb-1">
                 <div className="text-[10px] font-bold uppercase tracking-widest text-black">ACTIONS</div>
               </div>
               
               <button className="w-full bg-black text-white rounded-full py-3.5 text-[9px] uppercase font-bold tracking-widest hover:bg-black/80 transition-colors">SAVE LOOK</button>
               <button className="w-full border border-black rounded-full py-3.5 text-[9px] uppercase font-bold tracking-widest hover:bg-black/5 transition-colors">SHOP THE LOOK</button>
               <button className="w-full border border-black rounded-full py-3.5 text-[9px] uppercase font-bold tracking-widest hover:bg-black/5 transition-colors">SHARE TO LOOKBOOK</button>
               
               <div className="mt-4 bg-[#F5F1EB] border border-black rounded-[12px] p-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 border-b border-black/20 pb-3">
                     <span className="text-sm">🌡️</span>
                     <span className="text-[9px] font-bold uppercase tracking-widest text-black leading-tight">Temperature<br/>Recommendation</span>
                  </div>
                  
                  <div className="text-xs font-serif italic text-black mb-4">Perfect for 33°C tropical</div>
                  
                  <div className="mb-4">
                     <div className="flex justify-between text-[9px] font-bold font-mono text-black uppercase mb-1">
                       <span>Breathable Score</span>
                       <span>98%</span>
                     </div>
                     <div className="w-full h-1.5 bg-black/10 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full bg-black rounded-full"></div>
                     </div>
                  </div>
                  
                  <ul className="text-[9px] text-black/70 space-y-1.5 mb-4 list-disc pl-3">
                    <li>Highly breathable</li>
                    <li>Lightweight</li>
                    <li>Modest coverage</li>
                    <li>Sweat-wicking</li>
                  </ul>
                  
                  <div className="text-[10px] text-black leading-relaxed border-t border-black/20 pt-3">
                    <span className="font-bold">AI recommendation:</span> Ideal for humid 33°C weather. Linen fabrics keep you cool and modest.
                  </div>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(pageFile, newContent, 'utf8');
console.log("Wardrobe page overhauled with Interactive Drag & Drop Canvas!");
