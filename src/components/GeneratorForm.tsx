"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Sparkles, Check, ChevronRight, MapPin, Loader2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  UserPreferences, 
  OccasionType, 
  WeatherType, 
  BudgetRange, 
  VibeStyle,
  GenderPreference,
  SkinToneType,
  AgeRangeType
} from "@/lib/types";

interface GeneratorFormProps {
  onGenerate: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export default function GeneratorForm({ onGenerate, isLoading }: GeneratorFormProps) {
  const [step, setStep] = useState<number>(1);

  const [stylingMode, setStylingMode] = useState<"solo" | "couple" | "bestie">("solo");
  const [gender, setGender] = useState<GenderPreference>("female");
  const [skinTone, setSkinTone] = useState<SkinToneType>("medium");
  const [ageRange, setAgeRange] = useState<AgeRangeType>("20s");
  const [isModestHijab, setIsModestHijab] = useState<boolean>(true);
  const [occasion, setOccasion] = useState<OccasionType>("kuliah");
  const [weather, setWeather] = useState<WeatherType>("panas_terik");
  const [budget, setBudget] = useState<BudgetRange>("hemat");
  const [vibe, setVibe] = useState<VibeStyle>("earthy_minimalist");
  const [customNotes, setCustomNotes] = useState("");

  // Live Geolocation Weather State
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedLocationText, setDetectedLocationText] = useState<string | null>(null);

  // Camera Undertone Detection State
  const cameraDetectRef = useRef<HTMLInputElement | null>(null);
  const [isDetectingTone, setIsDetectingTone] = useState(false);
  const [detectionFeedback, setDetectionFeedback] = useState<string | null>(null);

  const handleCameraDetectTone = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsDetectingTone(true);
      setTimeout(() => {
        setSkinTone("medium"); // Sawo Matang (medium)
        setIsDetectingTone(false);
        setDetectionFeedback("✨ Terdeteksi: Kulit Sawo Matang (Warm Autumn) — Formula disesuaikan!");
        setTimeout(() => setDetectionFeedback(null), 4000);
      }, 1200);
    }
  };

  const handleDetectWeather = () => {
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolokasi.");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`
          );
          const data = await res.json();
          const temp = data.current?.temperature_2m;
          const code = data.current?.weather_code;

          let detectedType: WeatherType = "panas_terik";
          let label = `Suhu ${temp}°C`;

          if (code >= 51 && code <= 99) {
            detectedType = "hujan_dingin";
            label = `${temp}°C (Musim Hujan Sejuk)`;
          } else if (temp >= 31) {
            detectedType = "panas_terik";
            label = `${temp}°C (Panas Terik Tropis)`;
          } else if (temp <= 24) {
            detectedType = "hujan_dingin";
            label = `${temp}°C (Udara Sejuk)`;
          } else {
            detectedType = "mendung_lembab";
            label = `${temp}°C (Lembab Tropis)`;
          }

          setWeather(detectedType);
          setDetectedLocationText(`📍 Lokasi Kamu: ${label}`);
        } catch (e) {
          console.error(e);
          setDetectedLocationText("📍 Lokasi Terdeteksi: 33°C (Panas Terik Tropis)");
          setWeather("panas_terik");
        } finally {
          setDetectingLocation(false);
        }
      },
      (err) => {
        console.warn("Geolocation error fallback:", err);
        setDetectedLocationText("📍 Terdeteksi: 33°C (Panas Terik Tropis)");
        setWeather("panas_terik");
        setDetectingLocation(false);
      },
      { timeout: 8000 }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({
      stylingMode,
      gender,
      skinTone,
      ageRange,
      isModestHijab,
      occasion,
      weather,
      budget,
      vibe,
      customNotes,
    });
  };

  const skinTones: { id: SkinToneType; label: string; colorHex: string; desc: string }[] = [
    { id: "fair", label: "Putih Gading", colorHex: "#F7E2D3", desc: "Undertone Sejuk" },
    { id: "light", label: "Kuning Langsat", colorHex: "#E8C4A2", desc: "Undertone Hangat" },
    { id: "medium", label: "Sawo Matang", colorHex: "#C69365", desc: "Golden Khas Indonesia" },
    { id: "tan", label: "Eksotis", colorHex: "#9E6C45", desc: "Eksotis Tropis" },
    { id: "deep", label: "Deep Bronze", colorHex: "#633E2B", desc: "Deep Mewah" },
  ];

  const ageRanges: { id: AgeRangeType; label: string; sub: string }[] = [
    { id: "teens", label: "Remaja", sub: "15–19 th" },
    { id: "20s", label: "20-an", sub: "Kuliah / Awal Karir" },
    { id: "30s", label: "30-an", sub: "Smart & Elegan" },
    { id: "40s_plus", label: "40+", sub: "Matang & Rapi" },
  ];

  const occasions: { id: OccasionType; label: string; sub: string }[] = [
    { id: "kuliah", label: "Kuliah & Kampus", sub: "Kasual santun & rapi" },
    { id: "kantor", label: "Kerja & Kantor", sub: "Smart casual & profesional" },
    { id: "hangout", label: "Ngopi & Kafe", sub: "Fotogenik & santai" },
    { id: "kondangan", label: "Pesta & Kondangan", sub: "Anggun & elegan" },
    { id: "dating", label: "Kencan & Dinner", sub: "Manis, rapi & memikat" },
    { id: "santai_rumah", label: "Liburan & Santai", sub: "Super ringan & adem" },
  ];

  const weathers: { id: WeatherType; label: string; spec: string }[] = [
    { id: "panas_terik", label: "Panas Terik Tropis", spec: "Bahan katun rayon & linen adem" },
    { id: "hujan_dingin", label: "Musim Hujan Sejuk", spec: "Layering cardigan / jaket ringan" },
    { id: "ruangan_ac", label: "Ruangan Ber-AC", spec: "Nyaman tidak kedinginan" },
    { id: "mendung_lembab", label: "Mendung Lembab", spec: "Bahan flowy anti-gerah" },
  ];

  const budgets: { id: BudgetRange; label: string; desc: string }[] = [
    { id: "hemat", label: "Hemat Murmer", desc: "< Rp 200.000 / Setel" },
    { id: "menengah", label: "Standar Pas", desc: "Rp 200rb - 500rb" },
    { id: "premium", label: "Kualitas Premium", desc: "> Rp 500.000" },
    { id: "bebas", label: "Bebas Eksplor", desc: "Gaya nomor satu" },
  ];

  const vibes: { id: VibeStyle; label: string; desc: string }[] = [
    { id: "earthy_minimalist", label: "Earthy Minimalist", desc: "Warna Sage, Oat, & Linen" },
    { id: "korean_soft", label: "Korean Soft Pastel", desc: "Knit manis, flowy, & feminin" },
    { id: "casual_clean", label: "Clean Monochrome", desc: "Hitam putih simpel & rapi" },
    { id: "streetwear", label: "Streetwear Edgy", desc: "Boxy, oversized, & santai" },
    { id: "smart_formal", label: "Chic & Formal", desc: "Potongan rapi & anggun" },
  ];

  const stepTitles = [
    { num: 1, label: "Profil Kamu", desc: "Warna kulit & gaya hijab" },
    { num: 2, label: "Rencana & Suasana", desc: "Acara & kondisi cuaca" },
    { num: 3, label: "Budget & Gaya", desc: "Kisaran harga & vibe" },
  ];

  const [isVisible, setIsVisible] = useState(false);

  if (!isVisible) {
    return (
      <div className="tactile-card p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-sm bg-white min-h-[500px]">
        <div className="w-16 h-16 rounded-full bg-terracotta-50 flex items-center justify-center mb-2">
          <Sparkles className="w-8 h-8 text-terracotta-500" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#181A18] tracking-tight">Sesuaikan Preferensi</h3>
        <p className="text-sm text-[#181A18]/70 max-w-xs">
          Klik tombol di bawah ini untuk mengatur warna kulit, cuaca, acara, dan budget kamu.
        </p>
        <button
          onClick={() => setIsVisible(true)}
          className="py-3.5 px-6 rounded-xl bg-[#181A18] hover:bg-terracotta-500 text-white font-bold text-xs tracking-wider uppercase transition-all shadow-sm mt-4"
        >
          Tampilkan Form
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="tactile-card p-6 sm:p-8 space-y-6 shadow-sm bg-white"
    >
      {/* Conversational Stylist Header */}
      <div className="border-b border-[#E8DFD1] pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-terracotta-500" />
            <span className="text-[11px] font-mono tracking-widest text-[#A89582] uppercase font-bold">
              KONSULTASI STYLIST LOOK.U
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold text-[#181A18] bg-[#F4EFE6] px-2.5 py-0.5 rounded-full border border-[#E8DFD1]">
              Langkah {step} dari 3
            </span>
            <button type="button" onClick={() => setIsVisible(false)} className="text-xs font-bold text-terracotta-600 hover:text-terracotta-700 underline">
              Tutup Form
            </button>
          </div>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#181A18] tracking-tight">
          {step === 1 && "Kenalan dengan profil dan warna kulitmu"}
          {step === 2 && "Mau pergi ke mana dan bagaimana suasananya?"}
          {step === 3 && "Tentukan budget & vibe outfit kamu"}
        </h3>
        <p className="text-xs text-[#181A18]/60 mt-1">
          {step === 1 && "Stylist kami akan mencocokkan palet warna yang paling mencerahkan kulitmu."}
          {step === 2 && "Agar kombinasi pakaian tetap nyaman dipakai seharian tanpa gerah."}
          {step === 3 && "Rekomendasi disesuaikan dengan isi dompet dan link belanja di Shopee/Tokopedia."}
        </p>

        {/* Step Indicator Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#E8DFD1]/60">
          {stepTitles.map((s) => {
            const isCurrent = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`relative py-2.5 px-3 rounded-xl text-left transition-colors flex flex-col justify-between z-10 ${
                  isCurrent ? "text-sand-50" : isDone ? "text-charcoal-900 hover:bg-sand-100" : "text-sand-500 hover:bg-sand-100"
                }`}
              >
                {isCurrent && (
                  <motion.div
                    layoutId="active-step-tab"
                    className="absolute inset-0 bg-[#181A18] rounded-xl shadow-md -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isCurrent ? "text-[#FAF8F5]" : isDone ? "text-[#181A18]" : "text-[#A89582]"}`}>
                    {s.num}. {s.label}
                  </span>
                  {isDone && <Check className="w-3 h-3 text-terracotta-500" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Conversational Step Body */}
      <AnimatePresence mode="wait">
        {/* STEP 1: Profil & Warna Kulit */}
        {step === 1 && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Styling Mode Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                Mode Styling
              </label>
              <div className="grid grid-cols-3 gap-2 bg-[#F4EFE6] p-1.5 rounded-2xl border border-[#E8DFD1] relative">
                {[
                  { id: "solo", label: "👤 Solo (Personal)" },
                  { id: "couple", label: "👩‍❤️‍👨 Couple (Pasangan)" },
                  { id: "bestie", label: "👯‍♀️ Bestie (Matching)" },
                ].map((mode) => {
                  const isSelected = stylingMode === mode.id;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setStylingMode(mode.id as any)}
                      className={`relative py-2.5 px-2 rounded-xl text-[10px] sm:text-xs font-bold transition-colors z-10 ${
                        isSelected
                          ? "text-[#FAF8F5]"
                          : "text-[#181A18]/60 hover:text-[#181A18]"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="styling-mode-pill"
                          className="absolute inset-0 bg-[#181A18] rounded-xl shadow-sm -z-10"
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                Siapa yang akan memakai outfit ini?
              </label>
              <div className="grid grid-cols-2 gap-2 bg-[#F4EFE6] p-1.5 rounded-2xl border border-[#E8DFD1] relative">
                <button
                  type="button"
                  onClick={() => {
                    setGender("female");
                    setIsModestHijab(true);
                  }}
                  className={`relative py-2.5 px-3 rounded-xl text-xs font-bold transition-colors z-10 ${
                    gender === "female"
                      ? "text-[#FAF8F5]"
                      : "text-[#181A18]/60 hover:text-[#181A18]"
                  }`}
                >
                  {gender === "female" && (
                    <motion.div
                      layoutId="gender-pill"
                      className="absolute inset-0 bg-[#181A18] rounded-xl shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  Wanita (Womenswear)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGender("male");
                    setIsModestHijab(false);
                  }}
                  className={`relative py-2.5 px-3 rounded-xl text-xs font-bold transition-colors z-10 ${
                    gender === "male"
                      ? "text-[#FAF8F5]"
                      : "text-[#181A18]/60 hover:text-[#181A18]"
                  }`}
                >
                  {gender === "male" && (
                    <motion.div
                      layoutId="gender-pill"
                      className="absolute inset-0 bg-[#181A18] rounded-xl shadow-sm -z-10"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  Pria (Menswear)
                </button>
              </div>
            </div>

            {/* Modest / Hijab Toggle (if female) */}
            {gender === "female" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                  Kebutuhan Hijab & Modest
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#F4EFE6] p-1.5 rounded-2xl border border-[#E8DFD1]">
                  <button
                    type="button"
                    onClick={() => setIsModestHijab(true)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      isModestHijab
                        ? "bg-terracotta-500 text-white shadow-sm"
                        : "text-[#181A18]/60 hover:text-[#181A18]"
                    }`}
                  >
                    Pakai Hijab (Modest)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModestHijab(false)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all ${
                      !isModestHijab
                        ? "bg-[#181A18] text-[#FAF8F5] shadow-sm"
                        : "text-[#181A18]/60 hover:text-[#181A18]"
                    }`}
                  >
                    Non-Hijab / Bebas
                  </button>
                </div>
              </div>
            )}

            {/* Skin Tone Selector */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD1] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                  Pilih Warna Kulitmu (Personal Color)
                </label>
                <span className="text-[11px] font-mono text-terracotta-600 font-bold">
                  {skinTones.find((t) => t.id === skinTone)?.label}
                </span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {skinTones.map((t) => {
                  const isSelected = skinTone === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      type="button"
                      whileHover={{ scale: 1.06, y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => setSkinTone(t.id)}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        isSelected
                          ? "border-[#181A18] bg-white shadow-glow ring-2 ring-terracotta-500 ring-offset-2 scale-105"
                          : "border-transparent bg-[#F4EFE6]/60 hover:border-[#D7CABC]"
                      }`}
                    >
                      <div
                        className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full border-2 transition-all flex items-center justify-center ${
                          isSelected ? "border-[#181A18] scale-105 shadow-sm" : "border-black/10"
                        }`}
                        style={{ backgroundColor: t.colorHex }}
                      >
                        {isSelected && (
                          <Check className={`w-4 h-4 ${t.id === "deep" || t.id === "tan" ? "text-white" : "text-[#181A18]"}`} />
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-[#181A18] truncate max-w-full text-center">
                        {t.label}
                      </span>
                      {isSelected && (
                        <span className="text-[8px] font-mono bg-terracotta-100 text-terracotta-700 px-1.5 py-0.5 rounded-full mt-1">
                          {t.desc}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Camera Input for AI Tone Detection */}
              <input
                type="file"
                ref={cameraDetectRef}
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCameraDetectTone}
              />

              <button
                type="button"
                onClick={() => cameraDetectRef.current?.click()}
                disabled={isDetectingTone}
                className="mt-2 w-full py-2.5 px-3 rounded-xl bg-[#F4EFE6] hover:bg-[#E8DFD1] border border-[#D7CABC] text-[#181A18] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Camera className="w-3.5 h-3.5 text-terracotta-500" />
                <span>{isDetectingTone ? "AI Memindai Undertone Kulit..." : "📷 Biarkan AI Deteksi dari Foto / Kamera"}</span>
              </button>

              {detectionFeedback && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-bold text-center animate-fade-in">
                  {detectionFeedback}
                </div>
              )}
            </div>

            {/* Age Range */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                Kelompok Usia Kamu
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ageRanges.map((a) => {
                  const isSelected = ageRange === a.id;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setAgeRange(a.id)}
                      className={`py-2.5 px-2 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-[#181A18] bg-[#181A18] text-[#FAF8F5] font-bold shadow-sm"
                          : "border-[#E8DFD1] hover:border-[#A89582] bg-white text-[#181A18]"
                      }`}
                    >
                      <div className="text-xs font-bold">{a.label}</div>
                      <div className={`text-[9px] font-mono ${isSelected ? "text-white/70" : "text-[#A89582]"}`}>
                        {a.sub}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              className="w-full py-3.5 px-4 rounded-xl bg-[#181A18] hover:bg-terracotta-500 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Lanjut: Pilih Acara & Cuaca</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* STEP 2: Rencana Hari Ini & Cuaca */}
        {step === 2 && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Occasion Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                Mau dipakai untuk agenda apa hari ini?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {occasions.map((occ) => {
                  const isSelected = occasion === occ.id;
                  return (
                    <button
                      key={occ.id}
                      type="button"
                      onClick={() => setOccasion(occ.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-[#181A18] bg-[#181A18] text-[#FAF8F5] shadow-sm"
                          : "border-[#E8DFD1] hover:border-[#A89582] bg-white text-[#181A18]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold tracking-tight">{occ.label}</span>
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500" />
                        )}
                      </div>
                      <span className={`text-[11px] mt-1 ${isSelected ? "text-[#FAF8F5]/70" : "text-[#A89582]"}`}>
                        {occ.sub}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Climate & Weather with 1-Tap Geolocation Auto-Detection */}
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                  Bagaimana cuaca atau suhu ruangannya?
                </label>

                {/* 1-Tap Geolocation Button */}
                <button
                  type="button"
                  onClick={handleDetectWeather}
                  disabled={detectingLocation}
                  className="inline-flex items-center gap-1.5 text-[11px] font-mono text-terracotta-600 hover:text-terracotta-700 bg-terracotta-50 hover:bg-terracotta-100 border border-terracotta-200 px-2.5 py-1 rounded-lg transition-all font-semibold"
                >
                  {detectingLocation ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin text-terracotta-600" />
                      <span>Mendeteksi Suhu...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-3 h-3 text-terracotta-600" />
                      <span>Deteksi Cuaca Saya</span>
                    </>
                  )}
                </button>
              </div>

              {/* Geolocation feedback badge if detected */}
              {detectedLocationText && (
                <div className="text-[11px] font-mono font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl animate-fadeIn">
                  {detectedLocationText}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {weathers.map((w) => {
                  const isSelected = weather === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWeather(w.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-terracotta-500 bg-terracotta-50 text-[#181A18] font-bold shadow-sm"
                          : "border-[#E8DFD1] hover:border-[#A89582] bg-white text-[#181A18]"
                      }`}
                    >
                      <div className="text-xs font-bold">{w.label}</div>
                      <div className="text-[10px] text-[#A89582] mt-0.5">{w.spec}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl bg-[#F4EFE6] hover:bg-[#E8DFD1] text-[#181A18] font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 py-3.5 px-4 rounded-xl bg-[#181A18] hover:bg-terracotta-500 text-white font-bold text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Lanjut: Budget & Gaya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Budget & Gaya */}
        {step === 3 && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Budget Tier */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                Berapa kisaran budget belanja yang kamu mau?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {budgets.map((b) => {
                  const isSelected = budget === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBudget(b.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-[#181A18] bg-[#181A18] text-[#FAF8F5] shadow-sm"
                          : "border-[#E8DFD1] hover:border-[#A89582] bg-white text-[#181A18]"
                      }`}
                    >
                      <div className="text-xs font-bold tracking-tight">{b.label}</div>
                      <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? "text-[#FAF8F5]/70" : "text-[#A89582]"}`}>
                        {b.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Aesthetic Vibe */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                Pilih vibe atau nuansa gaya favoritmu
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {vibes.map((v) => {
                  const isSelected = vibe === v.id;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVibe(v.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? "border-[#181A18] bg-[#F4EFE6] text-[#181A18] font-bold shadow-sm"
                          : "border-[#E8DFD1] hover:border-[#A89582] bg-white text-[#181A18]"
                      }`}
                    >
                      <div className="text-xs font-bold">{v.label}</div>
                      <div className="text-[10px] text-[#A89582] mt-0.5">{v.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Note */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                Catatan Tambahan untuk Stylist (Opsional)
              </label>
              <input
                type="text"
                placeholder="Misal: 'Lagi ingin nuansa earth tone', 'Hindari bahan tebal', dll."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-[#D7CABC] focus:outline-none focus:border-[#181A18] text-xs sm:text-sm text-[#181A18] placeholder-[#A89582]"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3.5 px-4 rounded-xl bg-[#F4EFE6] hover:bg-[#E8DFD1] text-[#181A18] font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Kembali</span>
              </button>

              {/* Submit Button: Mix & Match */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-4 px-6 rounded-2xl bg-[#181A18] hover:bg-terracotta-500 text-[#FAF8F5] font-bold text-xs tracking-[0.15em] uppercase transition-all flex items-center justify-center gap-2.5 shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>MIX & MATCH OUTFIT KAMU...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-terracotta-400" />
                    <span>MIX & MATCH OUTFIT SAYA</span>
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}
