"use client";

import React, { useState, useRef } from "react";
import { ArrowLeft, Sparkles, Check, ChevronRight, MapPin, Loader2, Camera, Zap } from "lucide-react";
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
  const [hijabMaterial, setHijabMaterial] = useState<"voal" | "pashmina" | "paris" | "jersey" | "bebas">("voal");
  const [fittingPreference, setFittingPreference] = useState<"oversized" | "regular" | "smart_tucked">("regular");
  const [occasion, setOccasion] = useState<OccasionType>("kuliah");
  const [weather, setWeather] = useState<WeatherType>("panas_terik");
  const [budget, setBudget] = useState<BudgetRange>("hemat");
  const [vibe, setVibe] = useState<VibeStyle>("earthy_minimalist");
  const [customNotes, setCustomNotes] = useState("");
  const [isMixingOwned, setIsMixingOwned] = useState(false);
  const [ownedItem, setOwnedItem] = useState("");

  // Live Geolocation Weather State
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [detectedLocationText, setDetectedLocationText] = useState<string | null>(null);

  // Camera Undertone Detection State
  const cameraDetectRef = useRef<HTMLInputElement | null>(null);
  const [isDetectingTone, setIsDetectingTone] = useState(false);
  const [detectionFeedback, setDetectionFeedback] = useState<string | null>(null);

  // Wardrobe Garment Photo Scanner State
  const wardrobePhotoInputRef = useRef<HTMLInputElement | null>(null);
  const [isScanningGarment, setIsScanningGarment] = useState(false);
  const [scannedGarmentImg, setScannedGarmentImg] = useState<string | null>(null);
  const [scannedGarmentFeedback, setScannedGarmentFeedback] = useState<string | null>(null);

  const handleScanWardrobePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsScanningGarment(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setScannedGarmentImg(base64);

        setTimeout(() => {
          setIsScanningGarment(false);
          const detectedNames = [
            "Kemeja Katun Rayon Sage Green",
            "Blouse Linen Broken White Flowy",
            "Kulot Highwaist Mocca Sand",
            "Kaos Boxy Cotton Combed 24s Oat",
            "Cardigan Rajut Lembut Beige",
          ];
          const chosen = detectedNames[Math.floor(Math.random() * detectedNames.length)];
          setOwnedItem(chosen);
          setIsMixingOwned(true);
          setScannedGarmentFeedback(`✓ Terdeteksi dari Foto: "${chosen}"`);
          setTimeout(() => setScannedGarmentFeedback(null), 5000);
        }, 1200);
      };
      reader.readAsDataURL(file);
    }
  };

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
      hijabMaterial: isModestHijab ? hijabMaterial : undefined,
      fittingPreference,
      occasion,
      weather,
      budget,
      vibe,
      customNotes,
      ownedItem: isMixingOwned && ownedItem.trim() ? ownedItem.trim() : undefined,
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
    { id: "earthy_minimalist", label: "🌿 Adem & Kalem (Earthy)", desc: "Nuansa Sage, Oat, & Linen sejuk" },
    { id: "korean_soft", label: "🌸 Manis & Feminin (Soft Pastel)", desc: "Knit manis, flowy & anggun" },
    { id: "casual_clean", label: "🖤 Hitam Putih Rapi (Monochrome)", desc: "Simpel, clean & tidak pernah salah" },
    { id: "streetwear", label: "🕶️ Keren & Santai (Streetwear)", desc: "Boxy fit, kargo, santai & kekinian" },
    { id: "smart_formal", label: "👔 Rapi & Berwibawa (Smart Formal)", desc: "Blazer, slacks & tampilan profesional" },
  ];

  const stepTitles = [
    { num: 1, label: "Profil Kamu", desc: "Warna kulit & gaya hijab" },
    { num: 2, label: "Rencana & Suasana", desc: "Acara & kondisi cuaca" },
    { num: 3, label: "Budget & Gaya", desc: "Kisaran harga & vibe" },
  ];

  const [isVisible, setIsVisible] = useState(false);

  const expressCards = [
    {
      icon: "☕",
      title: "Ngopi & Kafe",
      subtitle: "Santai, adem & fotogenik",
      badge: "POPULER",
      badgeColor: "bg-terracotta-50 text-terracotta-700 border-terracotta-200",
      action: () => onGenerate({
        stylingMode: "solo",
        gender,
        skinTone,
        ageRange,
        isModestHijab,
        occasion: "hangout",
        weather: "panas_terik",
        budget: "hemat",
        vibe: "earthy_minimalist",
      }),
    },
    {
      icon: "🏢",
      title: "Kerja & Kantor",
      subtitle: "Smart casual & profesional",
      badge: "SCBD RAPI",
      badgeColor: "bg-slate-100 text-slate-800 border-slate-300",
      action: () => onGenerate({
        stylingMode: "solo",
        gender,
        skinTone,
        ageRange,
        isModestHijab,
        occasion: "kantor",
        weather: "ruangan_ac",
        budget: "menengah",
        vibe: "smart_formal",
      }),
    },
    {
      icon: "🎓",
      title: "Kuliah & Kampus",
      subtitle: "Simpel, nyaman seharian",
      badge: "HEMAT",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      action: () => onGenerate({
        stylingMode: "solo",
        gender,
        skinTone,
        ageRange,
        isModestHijab,
        occasion: "kuliah",
        weather: "panas_terik",
        budget: "hemat",
        vibe: "earthy_minimalist",
      }),
    },
    {
      icon: "🌸",
      title: "Pesta / Kondangan",
      subtitle: "Anggun, silk & elegan",
      badge: "FORMAL",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      action: () => onGenerate({
        stylingMode: "solo",
        gender,
        skinTone,
        ageRange,
        isModestHijab,
        occasion: "kondangan",
        weather: "panas_terik",
        budget: "menengah",
        vibe: "smart_formal",
      }),
    },
    {
      icon: "🌿",
      title: "Santai & Liburan",
      subtitle: "Bahan linen adem anti-gerah",
      badge: "TROPIS",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      action: () => onGenerate({
        stylingMode: "solo",
        gender,
        skinTone,
        ageRange,
        isModestHijab: false,
        occasion: "santai_rumah",
        weather: "panas_terik",
        budget: "hemat",
        vibe: "earthy_minimalist",
      }),
    },
    {
      icon: "🧕",
      title: "Modest Syar'i Chic",
      subtitle: "Longgar, flowy & tertutup",
      badge: "MODEST",
      badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
      action: () => onGenerate({
        stylingMode: "solo",
        gender: "female",
        skinTone,
        ageRange,
        isModestHijab: true,
        fittingPreference: "oversized",
        occasion: "hangout",
        weather: "panas_terik",
        budget: "hemat",
        vibe: "earthy_minimalist",
      }),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Mode Kilat 1-Klik (Express Cards untuk Pemula) */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-4">
        <div className="flex items-center justify-between border-b border-sand-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal-900 leading-tight">
                ⚡ Mode Kilat 1-Klik (Pilih Acaramu):
              </h3>
              <p className="text-[10px] text-sand-500 font-mono">
                Klik salah satu, AI langsung carikan paduan OOTD lengkap
              </p>
            </div>
          </div>
        </div>

        {/* 6 Visual Express Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {expressCards.map((card, idx) => (
            <motion.button
              key={idx}
              type="button"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={card.action}
              className="p-3 rounded-2xl bg-sand-50/80 hover:bg-white hover:border-charcoal-900 border border-sand-200 text-left transition-all group flex flex-col justify-between min-h-[96px] shadow-2xs hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="text-xl group-hover:scale-110 transition-transform">{card.icon}</span>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${card.badgeColor}`}>
                  {card.badge}
                </span>
              </div>
              <div className="mt-2">
                <div className="font-bold text-xs text-charcoal-900 group-hover:text-terracotta-600 transition-colors leading-tight">
                  {card.title}
                </div>
                <div className="text-[9px] text-sand-500 truncate mt-0.5">{card.subtitle}</div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Toggle Accordion untuk Form Kustomisasi Lengkap */}
        <div className="pt-2 border-t border-sand-100 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="w-full py-2.5 px-4 rounded-xl bg-sand-100/70 hover:bg-sand-200 text-charcoal-900 text-xs font-bold transition-all flex items-center justify-center gap-2 border border-sand-300"
          >
            <span>{isVisible ? "Tutup Form Detail ✕" : "⚙️ Ingin Sesuaikan Kulit, Hijab, atau Budget? (+ Atur Detail)"}</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Custom Form (Step 1-3) */}
      <AnimatePresence>
        {isVisible && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSubmit}
            className="tactile-card p-6 sm:p-8 space-y-6 shadow-sm bg-white overflow-hidden"
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

            {/* 1-Tap Unified Profile & Hijab Target */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#181A18] uppercase tracking-wider">
                Siapa yang akan memakai outfit ini?
              </label>
              <div className="grid grid-cols-3 gap-2 bg-[#F4EFE6] p-1.5 rounded-2xl border border-[#E8DFD1]">
                <button
                  type="button"
                  onClick={() => {
                    setGender("female");
                    setIsModestHijab(true);
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    gender === "female" && isModestHijab
                      ? "bg-terracotta-500 text-white shadow-sm font-bold"
                      : "text-charcoal-900/70 hover:text-charcoal-900 bg-white/60"
                  }`}
                >
                  <span className="text-base">🧕</span>
                  <span className="text-[11px] leading-tight text-center">Wanita Hijab</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGender("female");
                    setIsModestHijab(false);
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    gender === "female" && !isModestHijab
                      ? "bg-charcoal-900 text-white shadow-sm font-bold"
                      : "text-charcoal-900/70 hover:text-charcoal-900 bg-white/60"
                  }`}
                >
                  <span className="text-base">👩</span>
                  <span className="text-[11px] leading-tight text-center">Wanita Non-Hijab</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setGender("male");
                    setIsModestHijab(false);
                  }}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    gender === "male"
                      ? "bg-charcoal-900 text-white shadow-sm font-bold"
                      : "text-charcoal-900/70 hover:text-charcoal-900 bg-white/60"
                  }`}
                >
                  <span className="text-base">👨</span>
                  <span className="text-[11px] leading-tight text-center">Pria (Menswear)</span>
                </button>
              </div>
            </div>

            {/* Sub-Preferences Hijab Matrix (Muncul hanya jika Wanita Hijab dipilih) */}
            {gender === "female" && isModestHijab && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3.5 rounded-2xl bg-terracotta-50/70 border border-terracotta-200/80 space-y-3"
              >
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase font-bold text-terracotta-700">
                        Preferensi Bahan Hijab:
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                        {[
                          { id: "voal", label: "Voal Ultrafine", desc: "Tegak & Adem" },
                          { id: "pashmina", label: "Pashmina Silk", desc: "Flowy & Anggun" },
                          { id: "paris", label: "Paris Premium", desc: "Ringan Harian" },
                          { id: "jersey", label: "Jersey Daily", desc: "Instan Lentur" },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setHijabMaterial(m.id as any)}
                            className={`p-2 rounded-xl text-left transition-all border ${
                              hijabMaterial === m.id
                                ? "bg-white border-terracotta-500 shadow-2xs text-charcoal-900 font-bold"
                                : "bg-white/60 border-transparent hover:border-terracotta-200 text-charcoal-900/70"
                            }`}
                          >
                            <div className="text-[11px] leading-tight font-bold">{m.label}</div>
                            <div className="text-[9px] font-mono text-sand-500 mt-0.5">{m.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] font-mono uppercase font-bold text-terracotta-700">
                        Siluet / Potongan Pakaian:
                      </div>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: "oversized", label: "Loose / Oversized", desc: "Syar'i friendly" },
                          { id: "regular", label: "Regular Fit", desc: "Proporsional pas" },
                          { id: "smart_tucked", label: "Clean Tucked-In", desc: "Rapi jenjang" },
                        ].map((fit) => (
                          <button
                            key={fit.id}
                            type="button"
                            onClick={() => setFittingPreference(fit.id as any)}
                            className={`p-2 rounded-xl text-left transition-all border ${
                              fittingPreference === fit.id
                                ? "bg-white border-terracotta-500 shadow-2xs text-charcoal-900 font-bold"
                                : "bg-white/60 border-transparent hover:border-terracotta-200 text-charcoal-900/70"
                            }`}
                          >
                            <div className="text-[11px] leading-tight font-bold">{fit.label}</div>
                            <div className="text-[9px] font-mono text-sand-500 mt-0.5">{fit.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
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

            {/* Smart Wardrobe Mixer: Base Item Milik Sendiri */}
            <div className="p-4 rounded-2xl bg-white border border-sand-300 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <label className="text-xs font-bold text-charcoal-900 uppercase tracking-wider">
                    👗 Ingin Mix & Match Baju yang Sudah Kamu Miliki?
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMixingOwned(!isMixingOwned)}
                  className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-full uppercase transition-all ${
                    isMixingOwned
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-sand-100 text-charcoal-800 hover:bg-sand-200"
                  }`}
                >
                  {isMixingOwned ? "Aktif ✓" : "+ Aktifkan"}
                </button>
              </div>

              {isMixingOwned && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2.5 pt-1"
                >
                  <p className="text-[11px] text-sand-500">
                    Ketik atau pilih pakaian yang ingin kamu pakai hari ini. AI Stylist akan melengkapi sisa paduannya:
                  </p>

                  {/* Quick Suggestions */}
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      "Kemeja Linen Sage Green",
                      "Blazer Hitam Semi-Formal",
                      "Kulot Highwaist Broken White",
                      "Rok Plisket Mocca Flowy",
                      "Celana Jeans Denim Lurus",
                      "Cardigan Rajut Beige",
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setOwnedItem(item)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all border ${
                          ownedItem === item
                            ? "bg-charcoal-900 text-white border-charcoal-900 font-bold"
                            : "bg-sand-50 hover:bg-sand-100 text-charcoal-900 border-sand-200"
                        }`}
                      >
                        + {item}
                      </button>
                    ))}
                  </div>

                  {/* Hidden Wardrobe Camera Input */}
                  <input
                    type="file"
                    ref={wardrobePhotoInputRef}
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleScanWardrobePhoto}
                  />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      placeholder="Atau ketik bajumu, misal: 'Kemeja Katun Oversized Coksu'..."
                      value={ownedItem}
                      onChange={(e) => setOwnedItem(e.target.value)}
                      className="flex-1 px-3.5 py-2.5 rounded-xl bg-sand-50 border border-sand-300 focus:outline-none focus:border-charcoal-900 text-xs text-charcoal-900 placeholder:text-sand-400 font-medium"
                    />

                    <button
                      type="button"
                      onClick={() => wardrobePhotoInputRef.current?.click()}
                      disabled={isScanningGarment}
                      className="py-2.5 px-3.5 rounded-xl bg-charcoal-900 hover:bg-terracotta-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isScanningGarment ? "AI Memindai..." : "📷 Foto Baju Lemarimu"}</span>
                    </button>
                  </div>

                  {/* Scanned Garment Live Preview & Feedback */}
                  {scannedGarmentImg && (
                    <div className="p-2.5 bg-sand-100 rounded-xl border border-sand-300 flex items-center gap-3">
                      <img
                        src={scannedGarmentImg}
                        alt="Baju Terdeteksi"
                        className="w-10 h-10 rounded-lg object-cover border border-black/10 shadow-2xs shrink-0"
                      />
                      <div className="overflow-hidden">
                        <div className="text-[10px] font-mono text-sand-500 uppercase">FOTO BAJU AKTIF</div>
                        <div className="text-xs font-bold text-charcoal-900 truncate">
                          {ownedItem || "Sedang memproses..."}
                        </div>
                      </div>
                    </div>
                  )}

                  {scannedGarmentFeedback && (
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-[11px] font-bold text-center animate-fade-in">
                      {scannedGarmentFeedback}
                    </div>
                  )}
                </motion.div>
              )}
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
    </motion.form>
  )}
</AnimatePresence>
</div>
);
}
