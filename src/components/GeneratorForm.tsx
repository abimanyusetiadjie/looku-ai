"use client";
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
      vibe: "earthy_minimalist",
      skinTone: "medium",
      ageRange: "18-24"
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
