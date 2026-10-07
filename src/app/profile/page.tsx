"use client";

import React, { useState } from "react";
import { MapPin, CloudSun, Check, ChevronDown } from "lucide-react";
import BottomNav from "@/components/BottomNav";

export default function ProfilePage() {
  const [name, setName] = useState("Alya");
  const [height, setHeight] = useState("162 cm");
  const [size, setSize] = useState("S");
  const [hijab, setHijab] = useState("Yes");
  const [preferences, setPreferences] = useState([
    { id: "hijab_friendly", label: "HIJAB FRIENDLY", active: true },
    { id: "breathable", label: "BREATHABLE", active: true },
    { id: "lightweight", label: "LIGHTWEIGHT", active: true },
    { id: "modest", label: "MODEST", active: true },
    { id: "campus", label: "CAMPUS", active: true },
  ]);

  const togglePreference = (id: string) => {
    setPreferences(prev => 
      prev.map(p => p.id === id ? { ...p, active: !p.active } : p)
    );
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-24 font-sans text-[#181A18] selection:bg-[#181A18] selection:text-[#FAF8F5]">
      {/* Header Mobile - Just for visual spacing on mobile */}
      <div className="md:hidden h-10" />

      <main className="max-w-[1200px] mx-auto px-4 sm:px-8 md:pt-12">
        {/* Page Title */}
        <h1 className="font-serif text-4xl sm:text-4xl md:text-5xl text-[#181A18] tracking-tight mb-8">
          PROFILE —<br />YOUR STYLE IDENTITY.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: Identity Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#F5F1EB] border border-[#181A18] rounded-[16px] p-8 flex flex-col items-center text-center relative h-full">
              
              {/* Avatar */}
              <div className="w-24 h-24 sm:w-[120px] sm:h-[120px] bg-[#181A18] text-[#FAF8F5] rounded-full flex items-center justify-center font-serif text-5xl sm:text-6xl mb-6">
                {name.charAt(0).toUpperCase()}
              </div>
              
              {/* Info */}
              <h2 className="font-serif text-3xl mb-2">{name}</h2>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-[#181A18]/80 mb-4">
                <MapPin className="w-3 h-3" /> Pontianak 33°C
              </div>
              <p className="font-serif italic text-[#181A18] text-[15px] max-w-[250px] mb-8 leading-relaxed">
                Curated for tropical, modest & breathable looks.
              </p>
              
              {/* Edit Button */}
              <button className="border border-[#181A18] rounded-full px-10 py-2.5 text-[10px] font-bold tracking-[0.1em] uppercase hover:bg-[#181A18] hover:text-[#FAF8F5] transition-colors mb-12">
                Edit
              </button>

              {/* Stats Pills */}
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 w-full mt-auto">
                <div className="border border-[#181A18] rounded-full py-2.5 px-4 text-center min-w-[90px] flex-1 sm:flex-none bg-[#F5F1EB]">
                  <div className="text-[11px] font-bold tracking-widest uppercase">3 ITEMS</div>
                  <div className="text-[9px] text-[#181A18]/60 uppercase tracking-widest mt-0.5">in wardrobe</div>
                </div>
                <div className="border border-[#181A18] rounded-full py-2.5 px-4 text-center min-w-[90px] flex-1 sm:flex-none bg-[#F5F1EB]">
                  <div className="text-[11px] font-bold tracking-widest uppercase">5 LOOKS</div>
                  <div className="text-[9px] text-[#181A18]/60 uppercase tracking-widest mt-0.5">saved</div>
                </div>
                <div className="border border-[#181A18] rounded-full py-2.5 px-4 text-center min-w-[90px] flex-1 sm:flex-none bg-[#F5F1EB]">
                  <div className="text-[11px] font-bold tracking-widest uppercase">33°C</div>
                  <div className="text-[9px] text-[#181A18]/60 uppercase tracking-widest mt-0.5">curated</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Settings Stack */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* 1. Style Preferences */}
            <div className="bg-[#F5F1EB] border border-[#181A18] rounded-[16px] p-6 sm:p-8">
              <h3 className="font-serif text-center text-sm tracking-[0.2em] uppercase mb-6">Style Preferences</h3>
              <div className="flex flex-wrap justify-center gap-2.5">
                {preferences.map((pref) => (
                  <button
                    key={pref.id}
                    onClick={() => togglePreference(pref.id)}
                    className={`flex items-center gap-2 border border-[#181A18] rounded-full py-3 px-5 text-[10px] font-bold tracking-[0.5px] uppercase transition-colors ${
                      pref.active ? "bg-[#181A18] text-[#FAF8F5]" : "bg-transparent text-[#181A18] hover:bg-[#181A18]/5"
                    }`}
                  >
                    <div className={`w-[14px] h-[14px] rounded-full border flex items-center justify-center ${pref.active ? "border-transparent bg-[#FAF8F5] text-[#181A18]" : "border-[#181A18]"}`}>
                      {pref.active && <Check className="w-[10px] h-[10px] stroke-[3]" />}
                    </div>
                    {pref.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. My Measurements */}
            <div className="bg-[#F5F1EB] border border-[#181A18] rounded-[16px] p-6 sm:p-8">
              <h3 className="font-serif text-center text-sm tracking-[0.2em] uppercase mb-6">My Measurements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest pl-1">Height</label>
                  <input 
                    type="text" 
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="bg-[#F5F1EB] border border-[#181A18] rounded-xl px-4 h-11 text-sm font-semibold w-full focus:outline-none focus:ring-1 focus:ring-[#181A18] transition-shadow"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest pl-1">Size (S/M/L)</label>
                  <input 
                    type="text" 
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    className="bg-[#F5F1EB] border border-[#181A18] rounded-xl px-4 h-11 text-sm font-semibold w-full focus:outline-none focus:ring-1 focus:ring-[#181A18] transition-shadow"
                  />
                </div>
                <div className="flex flex-col gap-2 relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest pl-1">Hijab</label>
                  <div className="relative">
                    <select 
                      value={hijab}
                      onChange={(e) => setHijab(e.target.value)}
                      className="bg-[#F5F1EB] border border-[#181A18] rounded-xl px-4 h-11 text-sm font-semibold w-full appearance-none focus:outline-none focus:ring-1 focus:ring-[#181A18] transition-shadow cursor-pointer"
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                    <ChevronDown className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Curated For You & Account Actions */}
            <div className="bg-[#F5F1EB] border border-[#181A18] rounded-[16px] p-6 sm:p-8 flex flex-col">
              <h3 className="font-serif text-center text-sm tracking-[0.2em] uppercase mb-6">Curated For You</h3>
              
              <div className="border border-[#181A18] rounded-[12px] p-5 mb-8 bg-[#EBE5D9]/50">
                <div className="flex items-center gap-2 text-sm font-bold tracking-wide mb-2">
                  <CloudSun className="w-4 h-4" />
                  Pontianak • 33°C • Sunny now
                </div>
                <p className="text-[12px] leading-relaxed text-[#181A18]/80 sm:max-w-[85%] font-medium">
                  Recommendation: Opt for breathable cotton voil + layered open abaya. Stay cool and modest for tropical humidity.
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <button className="flex items-center justify-center border border-[#181A18] rounded-full px-6 py-2.5 text-[10px] font-bold tracking-widest uppercase hover:bg-[#181A18] hover:text-[#FAF8F5] transition-colors">
                  LOGOUT
                </button>
                <button className="text-[10px] font-bold tracking-widest uppercase text-[#181A18]/50 hover:text-[#181A18] transition-colors underline decoration-[#181A18]/30 underline-offset-4 hover:decoration-[#181A18]">
                  DELETE ACCOUNT
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </main>

      {/* Docked Native Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
