"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  MapPin,
  Sun,
  Palette,
  Eye,
  Check,
  Shirt,
  ShieldCheck,
} from "lucide-react";

export interface QuizDiagnosticSummary {
  skinToneId: "fair" | "light" | "medium" | "tan" | "deep";
  domicileZone: "coastal_hot" | "commuter_ac" | "highland_cool";
  domicileLabel: string;
  skinProfileName: string;
  personaTitle: string;
  personaDesc: string;
  recommendedFabrics: { name: string; reason: string; brands: string }[];
  favoriteColors: { id: string; name: string; hex: string; role: string }[];
  balancingColors: { name: string; hex: string; role: string }[];
  stylingRule: string;
}

interface PersonalColorQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyResult: (
    skinToneId: "fair" | "light" | "medium" | "tan" | "deep",
    summary?: QuizDiagnosticSummary
  ) => void;
}

type DomicileId = "coastal_hot" | "commuter_ac" | "highland_cool";
type HeritageSkinId = "langsat_light" | "sawo_medium" | "eksotis_tan";

const DOMICILE_OPTIONS: {
  id: DomicileId;
  badge: string;
  title: string;
  regions: string;
  tempInfo: string;
  fabricFocus: string;
}[] = [
  {
    id: "coastal_hot",
    badge: "ZONA TERIK PESISIR • 32°C–35°C",
    title: "Kota Pesisir & Dataran Rendah Terik",
    regions: "Jakarta, Surabaya, Medan, Makassar, Semarang, Bali Pesisir, Kalimantan & Sumatera Pesisir",
    tempInfo: "Panas menyengat & kelembapan tinggi (>75%)",
    fabricFocus: "Wajib serat berpori maksimal: 100% Pure Linen, Katun Rayon Twill, Tencel & Voal Ultrafine.",
  },
  {
    id: "commuter_ac",
    badge: "ZONA KOMUTER & RUANG AC • 22°C–31°C",
    title: "Transisi Luar Ruangan & Gedung Ber-AC",
    regions: "Yogyakarta, Solo, Palembang, Balikpapan, Pekanbaru, atau Mobilitas Kampus/Kantor Ber-AC",
    tempInfo: "Berpindah dari panas jalanan ke dingin AC 20°C",
    fabricFocus: "Butuh bahan adaptif anti-gerah & anti-kusut: Katun Oxford Breathable, Crinkle Airflow & Smart Outer.",
  },
  {
    id: "highland_cool",
    badge: "ZONA SEJUK & PENGHUJAN • 20°C–26°C",
    title: "Dataran Tinggi Sejuk & Curah Hujan Tinggi",
    regions: "Bandung, Malang, Bogor, Batu, Bukittinggi, Dataran Tinggi Jawa, Sumatera & Sulawesi",
    tempInfo: "Udara sejuk berangin & sering turun hujan",
    fabricFocus: "Cocok dengan bahan bertekstur hangat namun bernapas: Knitwear Katun, Twill, Denim & Cardigan.",
  },
];

const HERITAGE_SKIN_OPTIONS: {
  id: HeritageSkinId;
  mappedTone: "light" | "medium" | "tan";
  badge: string;
  title: string;
  heritageRef: string;
  colorblindCue: string;
  hexPreview: string;
}[] = [
  {
    id: "langsat_light",
    mappedTone: "light",
    badge: "PROFIL RONA 01 • CERAH HANGAT",
    title: "Putih Gading / Kuning Langsat Cerah",
    heritageRef:
      "Umum dijumpai pada tipikal keturunan Melayu-Sumatera, Kalimantan, Sulawesi Utara (Minahasa), atau Tionghoa-Indonesia.",
    colorblindCue:
      "Panduan Non-Visual: Kulit cenderung cepat memerah atau terasa perih jika terpapar terik matahari siang tanpa pelindung.",
    hexPreview: "#F3D6B6",
  },
  {
    id: "sawo_medium",
    mappedTone: "medium",
    badge: "PROFIL RONA 02 • MAYORITAS NUSANTARA",
    title: "Sawo Matang Hangat (Natural Tropis)",
    heritageRef:
      "Rona alami mayoritas masyarakat Jawa, Sunda, Bali, Madura, Bugis-Makassar, Banjar, dan wilayah kepulauan barat-tengah.",
    colorblindCue:
      "Panduan Non-Visual: Kulit jarang memerah saat panas, melainkan menggelap secara perlahan dan merata dengan rona hangat.",
    hexPreview: "#C69365",
  },
  {
    id: "eksotis_tan",
    mappedTone: "tan",
    badge: "PROFIL RONA 03 • KAYA PIGMEN TROPIS",
    title: "Eksotis Tropis / Cokelat Tembaga",
    heritageRef:
      "Khas wilayah Pesisir Nusantara, Nusa Tenggara (NTT/NTB), Maluku, Papua, atau kamu yang sering beraktivitas di luar ruangan.",
    colorblindCue:
      "Panduan Non-Visual: Pigmen kulit sangat tangguh terhadap sinar UV matahari, tidak mudah terbakar, dan tampak berkilau tegas.",
    hexPreview: "#8D5B3C",
  },
];

const FAVORITE_COLOR_CHOICES: {
  id: string;
  name: string;
  codeLabel: string;
  hex: string;
  vibeGroup: "earthy" | "monochrome" | "pastel" | "clean";
  psychMeaning: string;
  garmentRole: string;
}[] = [
  {
    id: "ivory_white",
    name: "Putih Tulang (Ivory)",
    codeLabel: "TERANG • PEMANTUL PANAS",
    hex: "#F5F2EB",
    vibeGroup: "clean",
    psychMeaning: "Bersih, Rapi, Terbuka",
    garmentRole: "Sangat baik untuk Atasan / Kemeja Linen agar memantulkan panas matahari.",
  },
  {
    id: "sage_green",
    name: "Hijau Daun Sage",
    codeLabel: "ALAMI • SEJUK DI MATA",
    hex: "#84A98C",
    vibeGroup: "earthy",
    psychMeaning: "Kalem, Tenang, Natural",
    garmentRole: "Cocok untuk Kemeja, Blus Rayon, maupun Hijab karena menyejukkan rona wajah.",
  },
  {
    id: "oat_sand",
    name: "Krem Oat / Khaki Pasir",
    codeLabel: "NETRAL HANGAT • OLD MONEY",
    hex: "#D7CABC",
    vibeGroup: "earthy",
    psychMeaning: "Santai, Dewasa, Elegan",
    garmentRole: "Ideal untuk Celana Kulot, Chino, atau Outer Linen yang mudah dipadukan.",
  },
  {
    id: "charcoal_black",
    name: "Hitam Arang (Charcoal)",
    codeLabel: "GELAP TEGAS • KONTRAS TINGGI",
    hex: "#232629",
    vibeGroup: "monochrome",
    psychMeaning: "Tegas, Praktis, Percaya Diri",
    garmentRole: "Disarankan untuk Bawahan atau acara Indoor AC agar tidak menyerap panas terik.",
  },
  {
    id: "navy_ocean",
    name: "Biru Navy Samudra",
    codeLabel: "GELAP SEJUK • PROFESIONAL",
    hex: "#1B2A4A",
    vibeGroup: "monochrome",
    psychMeaning: "Terstruktur, Cerdas, Wibawa",
    garmentRole: "Sangat bagus untuk Blazer Kantor, Kemeja Oxford, atau Celana Ankle Pants.",
  },
  {
    id: "terracotta_coffee",
    name: "Cokelat Terracotta / Kopi",
    codeLabel: "HANGAT BUMI • EKSOTIS",
    hex: "#A65E44",
    vibeGroup: "earthy",
    psychMeaning: "Hangat, Ramah, Berkarakter",
    garmentRole: "Membuat kulit Sawo Matang & Eksotis tampak glowing tanpa terlihat pucat.",
  },
  {
    id: "misty_grey",
    name: "Abu-Abu Misty / Slate",
    codeLabel: "NETRAL SEJUK • KASUAL URBAN",
    hex: "#8C92AC",
    vibeGroup: "monochrome",
    psychMeaning: "Modern, Objektif, Rileks",
    garmentRole: "Pilihan aman untuk Kaos Boxy, Cardigan Rajut, atau Celana Santai.",
  },
  {
    id: "dusty_rose",
    name: "Dusty Rose / Pastel Sejuk",
    codeLabel: "LEMBUT • CERAH SEGAR",
    hex: "#DCAE96",
    vibeGroup: "pastel",
    psychMeaning: "Manis, Segar, Ekspresif",
    garmentRole: "Memberikan rona segar alami pada wajah untuk Blus atau Pashmina.",
  },
];

export default function PersonalColorQuizModal({
  isOpen,
  onClose,
  onApplyResult,
}: PersonalColorQuizModalProps) {
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0=Domisili, 1=Rona Nusantara, 2=3 Warna Favorit, 3=Hasil
  const [colorblindMode, setColorblindMode] = useState<boolean>(false);

  const [selectedDomicile, setSelectedDomicile] = useState<DomicileId>("coastal_hot");
  const [selectedSkin, setSelectedSkin] = useState<HeritageSkinId>("sawo_medium");
  const [selectedFavColors, setSelectedFavColors] = useState<string[]>([
    "ivory_white",
    "sage_green",
    "oat_sand",
  ]);
  const [activeDrapeHex, setActiveDrapeHex] = useState<string | null>(null);

  const toggleFavColor = (id: string) => {
    if (selectedFavColors.includes(id)) {
      if (selectedFavColors.length > 1) {
        setSelectedFavColors(selectedFavColors.filter((c) => c !== id));
      }
      return;
    }
    if (selectedFavColors.length >= 3) {
      setSelectedFavColors([...selectedFavColors.slice(1), id]);
    } else {
      setSelectedFavColors([...selectedFavColors, id]);
    }
  };

  const buildDiagnosticResult = (): QuizDiagnosticSummary => {
    const domObj = DOMICILE_OPTIONS.find((d) => d.id === selectedDomicile) || DOMICILE_OPTIONS[0];
    const skinObj = HERITAGE_SKIN_OPTIONS.find((s) => s.id === selectedSkin) || HERITAGE_SKIN_OPTIONS[1];
    const pickedColors = FAVORITE_COLOR_CHOICES.filter((c) => selectedFavColors.includes(c.id));

    const earthyCount = pickedColors.filter((c) => c.vibeGroup === "earthy" || c.vibeGroup === "clean").length;
    const monoCount = pickedColors.filter((c) => c.vibeGroup === "monochrome").length;

    let personaTitle = "Earthy Tropical Minimalist";
    let personaDesc =
      "Berdasarkan 3 warna kesukaanmu, kamu memiliki karakter berpakaian yang kalem, mengutamakan kesejukan serat alami, dan tampil rapi berkelas tanpa kesan berlebihan (effortless).";

    if (monoCount >= 2) {
      personaTitle = "Smart Urban & Clean Monochrome";
      personaDesc =
        "Berdasarkan 3 warna kesukaanmu, kamu berkarakter tegas, praktis, dan menyukai siluet pakaian yang rapi terstruktur baik untuk suasana kasual maupun profesional.";
    } else if (pickedColors.some((c) => c.vibeGroup === "pastel") && earthyCount >= 1) {
      personaTitle = "Soft Tropical Chic & Fresh Harmony";
      personaDesc =
        "Berdasarkan 3 warna kesukaanmu, kamu memiliki karakter yang ramah, segar, dan pandai memadukan warna lembut dengan warna netral yang mencerahkan wajah.";
    }

    const fabricMap: Record<DomicileId, { name: string; reason: string; brands: string }[]> = {
      coastal_hot: [
        {
          name: "100% European Flax Linen & Katun Crinkle",
          reason: "Melepas panas tubuh tercepat di suhu pesisir 33°C–35°C dan tidak menempel di kulit.",
          brands: "Uniqlo, Cottonink, H&M, Lokal Shopee",
        },
        {
          name: "Rayon Twill & Tencel Lyocell",
          reason: "Permukaan serat terasa dingin di kulit dan jatuh flowy untuk mobilitas tinggi.",
          brands: "Uniqlo AIRism, Zara, Shopatvelvet",
        },
        {
          name: "Voal Ultrafine (Untuk Hijab)",
          reason: "Pori mikro tertinggi, tegak di dahi, dan anti-pengap di telinga.",
          brands: "Buttonscarves, Kami., Lokal Premium",
        },
      ],
      commuter_ac: [
        {
          name: "Katun Oxford Breathable & Poplin",
          reason: "Tetap rapi saat meeting di ruang AC 20°C namun tetap menyerap keringat saat di luar ruangan.",
          brands: "Uniqlo, COS, Executive, Thenblank",
        },
        {
          name: "Crinkle Airflow & Semi-Wool Light",
          reason: "Anti-kusut sepanjang hari bagi komuter kampus maupun pekerja kantor.",
          brands: "H&M, Colorbox, Lokal Kurasi Shopee",
        },
      ],
      highland_cool: [
        {
          name: "Soft Cotton Knitwear (Rajut Katun Berpori)",
          reason: "Memberikan kehangatan nyaman di suhu 20°C–26°C tanpa membuat gerah saat matahari muncul.",
          brands: "Uniqlo Knit, Zara, Berrybenka",
        },
        {
          name: "Cotton Twill & Lightweight Overshirt",
          reason: "Menahan angin sejuk dan mudah dilepas-pasang (layering) sesuai perubahan cuaca.",
          brands: "Uniqlo, Pull&Bear, Erigo, Lokal Shopee",
        },
      ],
    };

    const balancingPool: Record<HeritageSkinId, { name: string; hex: string; role: string }[]> = {
      langsat_light: [
        { name: "Sage Green Daun", hex: "#84A98C", role: "Penyeimbang rona agar kulit tidak tampak pucat" },
        { name: "Navy Samudra", hex: "#1B2A4A", role: "Memberi kontras tegas & bersih di sekitar wajah" },
      ],
      sawo_medium: [
        { name: "Krem Oat Bersih", hex: "#F5EBE0", role: "Memantulkan cahaya alami ke wajah Sawo Matang" },
        { name: "Terracotta Hangat", hex: "#C86D51", role: "Menonjolkan rona keemasan kulit khas Nusantara" },
      ],
      eksotis_tan: [
        { name: "Putih Gading (Ivory)", hex: "#FAF6EE", role: "Kontras bersih yang memancarkan kilau kulit eksotis" },
        { name: "Olive / Khaki Tropis", hex: "#6B705C", role: "Harmoni bumi yang elegan dan tahan terik" },
      ],
    };

    const hasDarkPicked = pickedColors.some((c) => c.id === "charcoal_black" || c.id === "navy_ocean");
    const stylingRule =
      selectedDomicile === "coastal_hot" && hasDarkPicked
        ? "Tips Cuaca Terik: Karena kamu menyukai warna gelap (Hitam/Navy) dan tinggal di zona terik, gunakan warna gelap pada Bawahan (Celana/Rok) dan pasang warna terang/sejuk pada Atasan agar tidak menyerap panas matahari."
        : "Tips Padu Padan: Gunakan 1 warna terang di dekat wajah (Atasan/Hijab) untuk efek wajah cerah seketika, lalu padukan dengan 2 warna favoritmu lainnya pada Bawahan dan Sepatu.";

    return {
      skinToneId: skinObj.mappedTone,
      domicileZone: selectedDomicile,
      domicileLabel: domObj.title,
      skinProfileName: skinObj.title,
      personaTitle,
      personaDesc,
      recommendedFabrics: fabricMap[selectedDomicile],
      favoriteColors: pickedColors.map((c) => ({
        id: c.id,
        name: c.name,
        hex: c.hex,
        role: c.garmentRole,
      })),
      balancingColors: balancingPool[selectedSkin],
      stylingRule,
    };
  };

  if (!isOpen) return null;

  const summary = buildDiagnosticResult();
  const activeDrapeItem =
    summary.favoriteColors.find((c) => c.hex === activeDrapeHex) ||
    summary.balancingColors.find((c) => c.hex === activeDrapeHex) ||
    summary.favoriteColors[0];

  const handleFinishAndApply = () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("looku_personal_color", summary.skinToneId);
        localStorage.setItem("looku_quiz_summary", JSON.stringify(summary));
      } catch {}
    }
    onApplyResult(summary.skinToneId, summary);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/65 backdrop-blur-xs"
        />

        {/* Modal Container: Bottom-Sheet di Mobile, Dialog di Desktop */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", damping: 26, stiffness: 290 }}
          className="relative w-full max-w-md sm:max-w-lg bg-[#FAF8F5] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E8DFD1] overflow-hidden flex flex-col h-[92dvh] sm:h-auto sm:max-h-[90vh]"
        >
          {/* Mobile Pull Handle */}
          <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 shrink-0">
            <div className="w-10 h-1.5 rounded-full bg-sand-300" />
          </div>

          {/* Top Header + Colorblind Mode Toggle */}
          <div className="px-4 sm:px-6 py-3 border-b border-[#E8DFD1] bg-white shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-terracotta-50 border border-terracotta-200 flex items-center justify-center text-terracotta-600">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#181A18] leading-tight">
                    Diagnosa Warna &amp; Bahan Tropis
                  </h2>
                  <p className="text-[10px] font-mono text-sand-500 uppercase tracking-wider">
                    Domisili • Rona Nusantara • 3 Warna Favorit
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 -mr-1 min-w-[40px] min-h-[40px] flex items-center justify-center text-[#181A18]/60 hover:text-[#181A18] hover:bg-sand-100 rounded-full transition-colors"
                aria-label="Tutup Kuis"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Baris Progress & Tombol Aksesibilitas Buta Warna */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 flex-1">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                      idx <= step ? "bg-terracotta-500" : "bg-[#E8DFD1]"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setColorblindMode(!colorblindMode)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border transition-all shrink-0 ${
                  colorblindMode
                    ? "bg-[#181A18] text-white border-[#181A18]"
                    : "bg-sand-100 text-charcoal-900 border-sand-300 hover:bg-sand-200"
                }`}
                title="Aktifkan panduan teks deskriptif bagi pengguna buta warna"
              >
                <Eye className="w-3 h-3" />
                <span>{colorblindMode ? "Mode Buta Warna: ON" : "Bantu Buta Warna"}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Body Content */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
            {/* ============================================================ */}
            {/* LANGKAH 1: ZONA DOMISILI & IKLIM HARIAN                      */}
            {/* ============================================================ */}
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3.5"
              >
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
                    <MapPin className="w-3 h-3" /> Langkah 1 dari 3 • Geografis &amp; Suhu
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#181A18]">
                    Di mana zona domisili &amp; cuaca harianmu?
                  </h3>
                  <p className="text-xs text-sand-600 leading-relaxed">
                    Tempat tinggal menentukan jenis serat kain terbaik agar pakaianmu adem dan tidak salah bahan.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {DOMICILE_OPTIONS.map((opt) => {
                    const isSelected = selectedDomicile === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedDomicile(opt.id)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all space-y-1.5 ${
                          isSelected
                            ? "border-[#181A18] bg-white shadow-md ring-1 ring-[#181A18]/10"
                            : "border-[#E8DFD1] bg-white/70 hover:bg-white hover:border-sand-400"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2 py-0.5 rounded-md">
                            {opt.badge}
                          </span>
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-[#181A18] border-[#181A18] text-white"
                                : "border-sand-300 bg-sand-50"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <div className="font-bold text-sm text-[#181A18]">{opt.title}</div>
                        <p className="text-[11px] text-sand-600 leading-snug">
                          <b>Wilayah:</b> {opt.regions}
                        </p>
                        <div className="pt-1 text-[11px] text-emerald-800 bg-emerald-50/80 border border-emerald-200/80 px-2.5 py-1.5 rounded-xl font-medium">
                          🧵 {opt.fabricFocus}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* LANGKAH 2: PROFIL RONA KULIT NUSANTARA (TANPA URAT NADI)     */}
            {/* ============================================================ */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3.5"
              >
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
                    <Sun className="w-3 h-3" /> Langkah 2 dari 3 • Rona Alami Nusantara
                  </span>
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#181A18]">
                    Pilih karakteristik rona kulit / keturunan daerahmu:
                  </h3>
                  <p className="text-xs text-sand-600 leading-relaxed">
                    Tidak perlu menebak warna urat nadi! Gunakan panduan wilayah Nusantara atau reaksi kulitmu terhadap matahari.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {HERITAGE_SKIN_OPTIONS.map((opt) => {
                    const isSelected = selectedSkin === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setSelectedSkin(opt.id)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border-2 transition-all space-y-2 ${
                          isSelected
                            ? "border-[#181A18] bg-white shadow-md ring-1 ring-[#181A18]/10"
                            : "border-[#E8DFD1] bg-white/70 hover:bg-white hover:border-sand-400"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span
                              className="w-7 h-7 rounded-full border-2 border-white shadow-sm shrink-0"
                              style={{ backgroundColor: opt.hexPreview }}
                            />
                            <div>
                              <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-sand-500 block">
                                {opt.badge}
                              </span>
                              <span className="font-bold text-sm text-[#181A18]">{opt.title}</span>
                            </div>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-[#181A18] border-[#181A18] text-white"
                                : "border-sand-300 bg-sand-50"
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>

                        <p className="text-[11px] text-charcoal-800 leading-snug">
                          🌏 <b>Referensi Daerah/Keturunan:</b> {opt.heritageRef}
                        </p>

                        <div
                          className={`p-2 rounded-xl text-[11px] leading-snug border ${
                            colorblindMode
                              ? "bg-amber-50 border-amber-300 text-amber-950 font-semibold"
                              : "bg-sand-50 border-sand-200 text-sand-600"
                          }`}
                        >
                          👁️ {opt.colorblindCue}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* LANGKAH 3: PILIH 3 WARNA OUTFIT KESUKAANMU                   */}
            {/* ============================================================ */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-3.5"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider text-terracotta-600 bg-terracotta-50 px-2.5 py-0.5 rounded-full border border-terracotta-200">
                      <Palette className="w-3 h-3" /> Langkah 3 dari 3 • Comfort Palette
                    </span>
                    <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#181A18] text-white">
                      Terpilih: {selectedFavColors.length} / 3
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#181A18]">
                    Pilih 3 warna baju yang paling kamu sukai:
                  </h3>
                  <p className="text-xs text-sand-600 leading-relaxed">
                    Dari 3 warna favoritmu, sistem akan membaca karakter berpakaianmu sekaligus memasangkannya dengan warna penyeimbang kulit.
                  </p>
                </div>

                {/* Grid 2 Kolom Mobile-Friendly */}
                <div className="grid grid-cols-2 gap-2.5">
                  {FAVORITE_COLOR_CHOICES.map((color) => {
                    const isPicked = selectedFavColors.includes(color.id);
                    const pickIndex = selectedFavColors.indexOf(color.id) + 1;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => toggleFavColor(color.id)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all flex flex-col justify-between space-y-2 ${
                          isPicked
                            ? "border-[#181A18] bg-white shadow-md ring-1 ring-[#181A18]/10"
                            : "border-[#E8DFD1] bg-white/70 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="w-8 h-8 rounded-xl border border-black/15 shadow-xs shrink-0 flex items-center justify-center font-mono text-[10px] font-bold"
                            style={{
                              backgroundColor: color.hex,
                              color:
                                color.id === "charcoal_black" || color.id === "navy_ocean" || color.id === "terracotta_coffee"
                                  ? "#FFFFFF"
                                  : "#181A18",
                            }}
                          >
                            {colorblindMode ? color.name.slice(0, 2).toUpperCase() : ""}
                          </span>

                          {isPicked ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#181A18] text-white font-mono text-[10px] font-bold">
                              #{pickIndex} ✓
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full border border-sand-300 bg-sand-50 block" />
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-xs text-[#181A18] leading-snug">
                            {color.name}
                          </div>
                          <div className="text-[9px] font-mono font-bold text-terracotta-600 uppercase mt-0.5">
                            {color.codeLabel}
                          </div>
                          <p className="text-[10px] text-sand-600 mt-1 line-clamp-2 leading-tight">
                            Kesan: {color.psychMeaning}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* LANGKAH 4: HASIL DIAGNOSA KARAKTER, BAHAN & WARNA            */}
            {/* ============================================================ */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* 1. Header Karakter Gaya Berpakaian */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFD1] shadow-xs space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-terracotta-50 text-terracotta-700 border border-terracotta-200">
                      KARAKTER GAYA BERPAKAIANMU
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✓ {summary.skinProfileName}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-[#181A18]">
                    {summary.personaTitle}
                  </h3>
                  <p className="text-xs text-charcoal-800/80 leading-relaxed">
                    {summary.personaDesc}
                  </p>
                </div>

                {/* 2. Simulasi Draping & Harmoni 3 Warna Favorit + Penyeimbang */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFD1] shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-charcoal-900">
                      🎨 PALET KOMBINASI BAJUMU (TAP UNTUK DETAIL POSISI)
                    </span>
                  </div>

                  {/* Preview Drape Bar */}
                  {activeDrapeItem && (
                    <div
                      className="p-3 rounded-xl border border-black/10 transition-all duration-300 flex items-center justify-between gap-3"
                      style={{ backgroundColor: activeDrapeItem.hex }}
                    >
                      <div className="bg-white/95 backdrop-blur-xs px-3 py-2 rounded-lg border border-black/10 shadow-2xs w-full space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#181A18]">
                            {activeDrapeItem.name}
                          </span>
                          <span className="font-mono text-[10px] font-bold text-sand-600">
                            {activeDrapeItem.hex}
                          </span>
                        </div>
                        <p className="text-[11px] text-charcoal-800 leading-snug">
                          👕 <b>Saran Posisi:</b> {activeDrapeItem.role}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 3 Warna Favorit Pilihan User */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono font-bold text-sand-600 uppercase">
                      3 Warna Kesukaanmu (Comfort Zone):
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {summary.favoriteColors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setActiveDrapeHex(c.hex)}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            activeDrapeItem?.hex === c.hex
                              ? "border-[#181A18] bg-sand-50 font-bold"
                              : "border-sand-200 bg-white"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[11px] text-[#181A18] truncate">{c.name.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2 Warna Penyeimbang Kulit Nusantara */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold text-terracotta-600 uppercase">
                      +2 Warna Penyeimbang Rona {summary.skinProfileName.split(" ")[0]}:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {summary.balancingColors.map((c, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setActiveDrapeHex(c.hex)}
                          className={`p-2 rounded-xl border text-left transition-all flex items-center gap-2 ${
                            activeDrapeItem?.hex === c.hex
                              ? "border-[#181A18] bg-sand-50 font-bold"
                              : "border-sand-200 bg-white"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span className="text-[11px] text-[#181A18] truncate">{c.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aturan Pakai Tropis */}
                  <div className="p-2.5 rounded-xl bg-amber-50/90 border border-amber-200 text-[11px] text-amber-950 leading-snug">
                    💡 {summary.stylingRule}
                  </div>
                </div>

                {/* 3. Rekomendasi Bahan Kain Berkualitas Sesuai Domisili */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8DFD1] shadow-xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                      <Shirt className="w-3.5 h-3.5" /> REKOMENDASI BAHAN KAIN ({summary.domicileLabel})
                    </span>
                  </div>

                  <div className="space-y-2">
                    {summary.recommendedFabrics.map((fab, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-sand-50/80 border border-sand-200 space-y-0.5"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs text-[#181A18]">{fab.name}</span>
                          <span className="text-[9px] font-mono font-bold text-terracotta-600 bg-white px-2 py-0.5 rounded border border-sand-200 shrink-0">
                            {fab.brands}
                          </span>
                        </div>
                        <p className="text-[11px] text-sand-600 leading-snug">{fab.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sticky Bottom Navigation Bar (Sangat Ergonomis untuk Jempol Mobile) */}
          <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-[#E8DFD1] shrink-0 pb-[max(0.875rem,env(safe-area-inset-bottom,0px))]">
            {step < 3 ? (
              <div className="flex items-center gap-2.5">
                {step > 0 && (
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s - 1) as 0 | 1 | 2 | 3)}
                    className="py-3 px-4 rounded-2xl bg-sand-100 hover:bg-sand-200 text-[#181A18] font-bold text-xs flex items-center gap-1.5 transition-colors min-h-[46px]"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as 0 | 1 | 2 | 3)}
                  className="flex-1 py-3.5 px-5 rounded-2xl bg-[#181A18] hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md min-h-[46px]"
                >
                  <span>
                    {step === 2
                      ? `Lihat Hasil Diagnosa (${selectedFavColors.length}/3 Warna)`
                      : "Lanjut ke Langkah Berikutnya"}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleFinishAndApply}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#181A18] hover:bg-terracotta-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md min-h-[48px]"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Terapkan Karakter &amp; Bahan Ini ke Aplikasi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="w-full py-1.5 text-[11px] font-semibold text-sand-500 hover:text-[#181A18] transition-colors"
                >
                  Ulangi Diagnosa dari Awal
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
