"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, Sun, House, Sparkles, Palette, BookOpen, Shirt, Wind, ChevronRight, ChevronLeft, ArrowRight, Check, X, Heart, ThermometerSun, Layers, Bookmark, User, Bell, CloudSun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWeather } from "@/hooks/useWeather";
import BrandMarquee from "@/components/BrandMarquee";


















export interface MobileOutfitItem {
  kategori: string;
  nama: string;
  bahan: string;
  warna: string;
  warnaHex: string;
  estimasiHarga: string;
  keunggulanAdem: string;
}

export interface MobileOutfit {
  id: string;
  judul: string;
  subjudul: string;
  tagline: string;
  suhu: string;
  sirkulasiUdara: string;
  alasanCocok: string;
  gambar: string;
  paletWarna: { nama: string; hex: string }[];
  warnaKulitCocok: string;
  rentangHarga: string;
  studioParam: string;
  itemPakaian: MobileOutfitItem[];
}

export interface LookUMobileViewProps {
  onOpenQuiz?: () => void;
  onOpenSavedDrawer?: () => void;
  savedCount?: number;
}

// 4 Skenario Iklim Tropis Riil LookU AI untuk Hero Auto-Animated Editorial Showcase
const OUTFIT_HERO_LIST: MobileOutfit[] = [
  {
    id: "casual-campus-chiffon",
    judul: "Casual Campus Chiffon",
    subjudul: "Adem Optimal · 100% Modest",
    tagline: "Kombinasi katun linen berpori sejuk dan kulot santun bebas gerah di kelas.",
    suhu: "33°C Tropis Siang Hari",
    sirkulasiUdara: "Sirkulasi Udara Maksimal",
    alasanCocok: "Kombinasi serat linen alami dan voal paris berpori mikro melepas panas tubuh seketika tanpa menerawang, sangat santun untuk hijab kampus maupun semi-formal.",
    gambar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=900&auto=format&fit=crop&q=85",
    paletWarna: [
      { nama: "Krem Oat", hex: "#FAF6EE" },
      { nama: "Sage Green", hex: "#84A98C" },
      { nama: "Sand Cokelat", hex: "#D4A373" },
    ],
    warnaKulitCocok: "Sawo Matang & Kuning Langsat",
    rentangHarga: "Rp 180rb - 260rb",
    studioParam: "kuliah_hijab_panas_hemat",
    itemPakaian: [
      {
        kategori: "Hijab / Kerudung",
        nama: "Voal Paris Airy Lembut",
        bahan: "100% Voal Ultrafine",
        warna: "Sage Green Halus",
        warnaHex: "#8FA98D",
        estimasiHarga: "Rp 45.000",
        keunggulanAdem: "Sangat ringan, tidak panas di telinga, dan mudah dibentuk tegak.",
      },
      {
        kategori: "Atasan",
        nama: "Kemeja Linen Crinkle Relaxed",
        bahan: "Katun Linen Crinkle Berpori",
        warna: "Krem Oat",
        warnaHex: "#FAF6EE",
        estimasiHarga: "Rp 125.000",
        keunggulanAdem: "Tekstur crinkle menjaga sirkulasi udara antara kulit dan kain.",
      },
      {
        kategori: "Bawahan",
        nama: "Kulot Loose Pleated Sand",
        bahan: "Rayon Twill Premium Dingin",
        warna: "Sand Cokelat Alami",
        warnaHex: "#D4A373",
        estimasiHarga: "Rp 95.000",
        keunggulanAdem: "Potongan longgar anti-lekat, fleksibel melangkah di terik matahari.",
      },
      {
        kategori: "Alas Kaki",
        nama: "Canvas Slip-on Retro White",
        bahan: "Breathable Canvas & Rubber Sole",
        warna: "Broken White",
        warnaHex: "#FAF6EE",
        estimasiHarga: "Rp 85.000",
        keunggulanAdem: "Bebas lembap pada kaki, praktis untuk mobilitas tinggi.",
      },
    ],
  },
  {
    id: "scbd-corporate-blazer",
    judul: "SCBD Corporate Blazer",
    subjudul: "Indoor AC & Urban · Semi-Wool",
    tagline: "Blazer semi-wool berstruktur ringan dengan inner tencel anti-gerah.",
    suhu: "22°C AC & 33°C Luar",
    sirkulasiUdara: "Sirkulasi Adaptif Tropis",
    alasanCocok: "Material semi-wool ultra-ringan dengan lining katun menjaga siluet rapi dan formal saat meeting klien tanpa rasa sesak saat berjalan di terik Jakarta.",
    gambar: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&auto=format&fit=crop&q=85",
    paletWarna: [
      { nama: "Tailored Navy", hex: "#1B2A4A" },
      { nama: "Charcoal Grey", hex: "#3A3F47" },
      { nama: "Crisp Off-White", hex: "#F8F7F4" },
    ],
    warnaKulitCocok: "Semua Tone Kulit Urban",
    rentangHarga: "Rp 290rb - 420rb",
    studioParam: "scbd_corporate_blazer",
    itemPakaian: [
      {
        kategori: "Atasan",
        nama: "Structured Oversized Blazer",
        bahan: "Semi-Wool Light Blend",
        warna: "Tailored Navy",
        warnaHex: "#1B2A4A",
        estimasiHarga: "Rp 165.000",
        keunggulanAdem: "Potongan rapi berstruktur dengan furing katun adem.",
      },
      {
        kategori: "Inner",
        nama: "Tencel Modal Crewneck Inner",
        bahan: "100% Tencel Dingin",
        warna: "Crisp Off-White",
        warnaHex: "#F8F7F4",
        estimasiHarga: "Rp 75.000",
        keunggulanAdem: "Menyerap keringat 50% lebih cepat dari katun biasa.",
      },
      {
        kategori: "Bawahan",
        nama: "Highwaist Tailored Culottes",
        bahan: "Premium Crepe Flowy",
        warna: "Charcoal Grey",
        warnaHex: "#3A3F47",
        estimasiHarga: "Rp 120.000",
        keunggulanAdem: "Jatuh berbobot tapi tetap adem dan tidak kaku.",
      },
      {
        kategori: "Alas Kaki",
        nama: "Pointed Block Heels Mules",
        bahan: "Cushioned Insole & Suede",
        warna: "Dark Navy",
        warnaHex: "#1B2A4A",
        estimasiHarga: "Rp 140.000",
        keunggulanAdem: "Empuk untuk mobilitas aktif dari ruang kantor ke kafe.",
      },
    ],
  },
  {
    id: "coastal-linen-camp-collar",
    judul: "Coastal Linen Camp Collar",
    subjudul: "Pure Flax Linen · Menswear",
    tagline: "Kemeja kerah terbuka tenun linen alami dengan celana chino bernapas.",
    suhu: "33°C Tropis Siang Hari",
    sirkulasiUdara: "Sirkulasi Udara Optimal · Serat Bernapas",
    alasanCocok: "Serat flax linen memiliki rongga alami yang mengalirkan angin bebas hambatan, menjaga suhu tubuh tetap adem meski di terik pantai atau kafe outdoor.",
    gambar: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=900&auto=format&fit=crop&q=85",
    paletWarna: [
      { nama: "Oatmeal Linen", hex: "#E8DFD1" },
      { nama: "Sky Blue", hex: "#87CEEB" },
      { nama: "Khaki Sand", hex: "#C2B280" },
    ],
    warnaKulitCocok: "Sawo Matang & Deep Bronze",
    rentangHarga: "Rp 240rb - 350rb",
    studioParam: "old_money_coastal",
    itemPakaian: [
      {
        kategori: "Atasan",
        nama: "Kemeja Linen Camp Collar Cuban",
        bahan: "100% Pure Flax Linen",
        warna: "Sky Blue",
        warnaHex: "#87CEEB",
        estimasiHarga: "Rp 135.000",
        keunggulanAdem: "Kerah terbuka mempermudah sirkulasi angin di area leher.",
      },
      {
        kategori: "Bawahan",
        nama: "Slim Straight Chino Pants",
        bahan: "Katun Twill Stretch Sejuk",
        warna: "Khaki Sand",
        warnaHex: "#C2B280",
        estimasiHarga: "Rp 145.000",
        keunggulanAdem: "Elastis dan fleksibel untuk mobilitas perkotaan.",
      },
      {
        kategori: "Alas Kaki",
        nama: "Suede Penny Loafers",
        bahan: "Breathable Leather & Rubber Sol",
        warna: "Dark Brown",
        warnaHex: "#3E2723",
        estimasiHarga: "Rp 160.000",
        keunggulanAdem: "Nyaman tanpa kaos kaki, sirkulasi kaki tetap segar.",
      },
    ],
  },
  {
    id: "senopati-weekend-hangout",
    judul: "Senopati Weekend Hangout",
    subjudul: "Hangout Chic · Airy Knit",
    tagline: "Paduan knitwear berpori halus dan pleated flowy skirt yang fotogenik.",
    suhu: "31°C Kafe & Semi-Outdoor",
    sirkulasiUdara: "Sirkulasi Halus Lembut",
    alasanCocok: "Rajutan benang katun berongga mikro memberikan kesan berkelas untuk foto OOTD kafe tanpa membuat gerah di bawah terik matahari siang.",
    gambar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=85",
    paletWarna: [
      { nama: "Buttercream", hex: "#FEFAE0" },
      { nama: "Soft Matcha", hex: "#CCD5AE" },
      { nama: "Terra Blush", hex: "#D4A373" },
    ],
    warnaKulitCocok: "Kuning Langsat & Putih Gading",
    rentangHarga: "Rp 210rb - 310rb",
    studioParam: "senopati_brunch_knit",
    itemPakaian: [
      {
        kategori: "Atasan",
        nama: "Fine Knitwear Drop Shoulder",
        bahan: "Katun Berpori Mikro",
        warna: "Buttercream Soft",
        warnaHex: "#FEFAE0",
        estimasiHarga: "Rp 115.000",
        keunggulanAdem: "Rajutan anyaman longgar anti-gerah saat nongkrong di kafe.",
      },
      {
        kategori: "Bawahan",
        nama: "Flowy Pleated A-Line Skirt",
        bahan: "Chiffon Crepe Dingin",
        warna: "Soft Matcha",
        warnaHex: "#CCD5AE",
        estimasiHarga: "Rp 110.000",
        keunggulanAdem: "Jatuh melayang, memberi angin sejuk saat melangkah.",
      },
      {
        kategori: "Alas Kaki",
        nama: "Chunky Loafers / Mary Jane",
        bahan: "Soft Cushioned Insole",
        warna: "Off-White",
        warnaHex: "#FAF6EE",
        estimasiHarga: "Rp 135.000",
        keunggulanAdem: "Sol empuk untuk jalan santai seharian.",
      },
    ],
  },
];

// Data Tren Mingguan Horisontal
const TROPICAL_EDIT_LIST = [
  {
    id: "trop-1",
    judul: "Linen Camp Collar Shirt",
    kategori: "Atasan Kasual",
    rentangHarga: "Rp 189.000",
    climateBadge: "Optimal 33°C · Katun Rayon",
    swatches: ["#FAF6EE", "#8FA98D", "#D4A373"],
    undertoneTag: "Warm Spring",
    fabricNote: "Katun Rayon Twill · Dingin",
    studioParam: "hangout_nonhijab_panas_menengah",
    gambar: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "trop-2",
    judul: "Wide-Leg Flowy Pants",
    kategori: "Bawahan Longgar",
    rentangHarga: "Rp 215.000",
    climateBadge: "Anti-Gerah · Rayon Dingin",
    swatches: ["#FAF6EE", "#D4A373", "#242724"],
    undertoneTag: "Warm Autumn",
    fabricNote: "Rayon Twill · Potongan Loose",
    studioParam: "santai_weekend_kafe",
    gambar: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "trop-3",
    judul: "Voal Paris Square Hijab",
    kategori: "Hijab & Aksesori",
    rentangHarga: "Rp 85.000",
    climateBadge: "Pori Mikro · Voal 100%",
    swatches: ["#FDFBF7", "#91AF90", "#DECBA6"],
    undertoneTag: "Semua Tone",
    fabricNote: "Voal Ultrafine · Sangat Ringan",
    studioParam: "kuliah_hijab_panas_hemat",
    gambar: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "trop-4",
    judul: "Tunik Rayon Panjang",
    kategori: "Tunik Modest",
    rentangHarga: "Rp 95.000",
    climateBadge: "AC & Terik · 100% Modest",
    swatches: ["#6B705C", "#FAF6EE", "#242724"],
    undertoneTag: "Kuning Langsat",
    fabricNote: "Katun Rami Organik · Cepat Kering",
    studioParam: "kondangan_hijab_pastel",
    gambar: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=600&auto=format&fit=crop&q=80",
  },
];

// Swatch Warna Kulit Nusantara untuk Gamifikasi Personal Color
const SKIN_TONES = [
  {
    id: "kuning-langsat",
    nama: "Kuning Langsat",
    subnama: "Warm Spring",
    hex: "#E8C8A2",
    rekomendasiWarna: "Sage, Krem Oat, & Coral Lembut",
  },
  {
    id: "sawo-matang",
    nama: "Sawo Matang",
    subnama: "Warm Autumn",
    hex: "#B87B52",
    rekomendasiWarna: "Terracotta, Earth Sand, & Olive",
  },
  {
    id: "tan-eksotis",
    nama: "Tan Eksotis",
    subnama: "Deep Autumn",
    hex: "#7D5335",
    rekomendasiWarna: "Krem Hangat, Mustard, & Deep Bronze",
  },
];

export default function LookUMobileView({
  onOpenQuiz,
  onOpenSavedDrawer,
  savedCount = 0,
}: LookUMobileViewProps) {
  const router = useRouter();
  const { weather } = useWeather();

  // State Interaktif
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>("sawo-matang");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [activeSheetOutfit, setActiveSheetOutfit] = useState<MobileOutfit>(OUTFIT_HERO_LIST[0]);
  const [activeNavTab, setActiveNavTab] = useState<string>("beranda");
  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [notifFeedback, setNotifFeedback] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [personalColor, setPersonalColor] = useState<{ label: string; hex: string; undertone: string } | null>(null);

  useEffect(() => {
    const syncColor = () => {
      try {
        const stored = localStorage.getItem("looku_personal_color");
        const map: Record<string, { label: string; hex: string; undertone: string }> = {
          fair: { label: "Putih Gading", hex: "#F7E6D8", undertone: "Cool" },
          fair_porcelain: { label: "Putih Gading", hex: "#F7E6D8", undertone: "Cool" },
          light: { label: "Kuning Langsat", hex: "#EAD0B3", undertone: "Neutral" },
          light_medium: { label: "Kuning Langsat", hex: "#EAD0B3", undertone: "Neutral" },
          medium: { label: "Sawo Matang", hex: "#C78E5F", undertone: "Warm" },
          sawo_matang: { label: "Sawo Matang", hex: "#C78E5F", undertone: "Warm" },
          tan: { label: "Eksotis", hex: "#9E6738", undertone: "Warm" },
          tan_exotic: { label: "Eksotis", hex: "#9E6738", undertone: "Warm" },
          deep: { label: "Bronze", hex: "#5D3B22", undertone: "Deep" },
          dark_ebony: { label: "Bronze", hex: "#5D3B22", undertone: "Deep" },
        };
        if (stored && map[stored]) {
          setPersonalColor(map[stored]);
        } else {
          setPersonalColor(null);
        }
      } catch {
        setPersonalColor(null);
      }
    };
    syncColor();
    window.addEventListener("storage", syncColor);
    window.addEventListener("looku_personal_color_updated", syncColor);
    return () => {
      window.removeEventListener("storage", syncColor);
      window.removeEventListener("looku_personal_color_updated", syncColor);
    };
  }, []);

  const heroOutfit = OUTFIT_HERO_LIST[currentHeroIndex];

  // Auto-Play Living Lookbook (4.5s) dengan Pause-on-Touch
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % OUTFIT_HERO_LIST.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Sinkronisasi status simpan dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("looku_saved_outfits");
      if (stored) {
        const list = JSON.parse(stored);
        const exists = list.some((item: { id?: string }) => item.id === heroOutfit.id);
        setIsSavedLocally(exists);
      }
    } catch {
      // Abaikan error localStorage jika ada
    }
  }, [heroOutfit.id]);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Fungsi Swipe / Ganti Hero
  const handleNextHero = () => {
    setCurrentHeroIndex((prev) => (prev + 1) % OUTFIT_HERO_LIST.length);
  };

  const handlePrevHero = () => {
    setCurrentHeroIndex((prev) => (prev === 0 ? OUTFIT_HERO_LIST.length - 1 : prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      // Geser jari ke kiri -> Tampilkan inspirasi berikutnya
      handleNextHero();
    } else if (diff < -45) {
      // Geser jari ke kanan -> Tampilkan inspirasi sebelumnya
      handlePrevHero();
    }
    setTouchStartX(null);
  };

  // Tampilkan Notifikasi Umpan Balik Sederhana
  const triggerNotification = (pesan: string) => {
    setNotifFeedback(pesan);
    setTimeout(() => {
      setNotifFeedback(null);
    }, 2800);
  };

  // Simpan/Hapus Outfit ke localStorage sesungguhnya
  const handleToggleSaveOutfit = (outfit: MobileOutfit) => {
    try {
      const stored = localStorage.getItem("looku_saved_outfits");
      let list: Array<{ id: string; title: string; price: string; items?: unknown[] }> = stored ? JSON.parse(stored) : [];
      const alreadySaved = list.some((item) => item.id === outfit.id);

      if (alreadySaved) {
        list = list.filter((item) => item.id !== outfit.id);
        localStorage.setItem("looku_saved_outfits", JSON.stringify(list));
        setIsSavedLocally(false);
        triggerNotification("Outfit dihapus dari Lemari Digital.");
      } else {
        list.push({
          id: outfit.id,
          title: outfit.judul,
          price: outfit.rentangHarga,
          items: [],
        });
        localStorage.setItem("looku_saved_outfits", JSON.stringify(list));
        setIsSavedLocally(true);
        triggerNotification("✨ Berhasil disimpan ke Lemari Digital!");
      }
      window.dispatchEvent(new Event("storage"));
    } catch {
      triggerNotification("Berhasil diperbarui.");
    }
  };

  const handleSelectSkinTone = (tone: typeof SKIN_TONES[0]) => {
    setSelectedSkinTone(tone.id);
    if (typeof window !== "undefined") {
      localStorage.setItem("looku_personal_color", tone.id);
    }
    triggerNotification(`Warna kulit ${tone.nama} aktif! Palet cocok: ${tone.rekomendasiWarna}`);
  };

  const handleOpenOutfitDetails = (outfit: MobileOutfit) => {
    setActiveSheetOutfit(outfit);
    setIsBottomSheetOpen(true);
  };

  const handleLaunchStudio = (outfit: MobileOutfit) => {
    setIsBottomSheetOpen(false);
    router.push(`/studio?look=${outfit.studioParam || outfit.id}`);
  };

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#FAF8F5] text-[#181A18] font-sans antialiased selection:bg-sage-200 flex flex-col items-center justify-start">
      {/* Kontainer Layar Ponsel (max-w-md mx-auto) */}
      <div className="w-full max-w-md min-h-[100dvh] bg-[#FAF8F5] border-x border-[#E8DFD1]/50 shadow-2xl relative flex flex-col pb-32">
        
        {/* ============================================================ */}
        {/* 1. HEADER ATAS (Persis Konsep Referensi Mobile)             */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-30 w-full bg-[#FAF8F5]/90 backdrop-blur-md px-5 pt-[max(12px,env(safe-area-inset-top))] pb-3 transition-all flex items-center justify-between border-b border-[#181A18]/5">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-[#181A18] active:scale-95 transition-transform" aria-label="Menu">
            <Menu className="w-6 h-6 stroke-[1.5]" />
          </button>
          
          <div className="font-serif text-[1.85rem] font-medium tracking-tight text-[#181A18] leading-none select-none">
            Look<span className="text-terracotta-500 font-bold">.</span>u
          </div>
          
          <div className="flex items-center gap-2">
            {personalColor && (
              <button
                type="button"
                onClick={() => onOpenQuiz ? onOpenQuiz() : router.push("/profile?tab=palette")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FAF6EE] border border-[#E8DFD1] text-[10px] font-sans font-semibold text-charcoal-900 shadow-2xs active:scale-95 transition-transform"
                title="Warna kulit aktif. Klik untuk ganti."
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: personalColor.hex }} />
                <span>{personalColor.label}</span>
              </button>
            )}
            <button 
              onClick={() => triggerNotification(`Suhu Jakarta ${weather.temperature || 33}°C: Rekomendasi busana adem aktif!`)}
              className="p-2 -mr-2 text-[#181A18] relative active:scale-95 transition-transform" 
              aria-label="Notifikasi"
            >
              <Bell className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-terracotta-500 rounded-full" />
            </button>
          </div>
        </header>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-0 left-0 w-full bg-white z-40 border-b border-[#F0EBE1] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between px-4 pt-[max(16px,env(safe-area-inset-top))] pb-4 border-b border-[#F0EBE1]">
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -ml-2 text-charcoal-900" aria-label="Tutup Menu">
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
                <div className="font-serif font-medium text-3xl tracking-[0.05em] text-[#181A18] flex items-baseline select-none">
                  Look<span className="text-terracotta-500 font-bold">.</span>u
                </div>
                <div className="w-9" />
              </div>
              <div className="flex flex-col px-6 py-8 gap-6 text-[#181A18]">
                <button onClick={() => { setIsMobileMenuOpen(false); router.push('/studio') }} className="text-left font-sans font-semibold tracking-widest uppercase text-sm hover:text-terracotta-500 transition-colors">Studio AI</button>
                <button onClick={() => { setIsMobileMenuOpen(false); router.push('/lookbook') }} className="text-left font-sans font-semibold tracking-widest uppercase text-sm hover:text-terracotta-500 transition-colors">Lookbook</button>
                <button onClick={() => { setIsMobileMenuOpen(false); router.push('/profile?tab=wardrobe') }} className="text-left font-sans font-semibold tracking-widest uppercase text-sm hover:text-terracotta-500 transition-colors">Wardrobe / Lemari</button>
                <button onClick={() => { setIsMobileMenuOpen(false); if(onOpenQuiz) onOpenQuiz(); }} className="text-left font-sans font-semibold tracking-widest uppercase text-sm hover:text-terracotta-500 transition-colors">Personal Color Quiz</button>
                <button onClick={() => { setIsMobileMenuOpen(false); router.push('/admin') }} className="text-left font-sans font-semibold tracking-widest uppercase text-xs text-[#8C5A3C] hover:text-charcoal-900 pt-3 border-t border-[#F0EBE1] flex items-center justify-between">
                  <span>Portal Admin (CMS &amp; CRUD)</span>
                  <span>↗</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Notifikasi Pop-up Lembut */}
        <AnimatePresence>
          {notifFeedback && (
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="fixed top-16 left-4 right-4 max-w-sm mx-auto z-50 bg-stone-900/95 text-white text-xs px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-white/10 backdrop-blur-md"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              <p className="flex-1 font-medium">{notifFeedback}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Konten Scroll Utama */}
        <main className="flex-1 w-full space-y-7">
          
          {/* ============================================================ */}
          {/* 1. EDITORIAL STATEMENT HERO (Persis Konsep Referensi Mobile)  */}
          {/* ============================================================ */}
          <section aria-label="Editorial Brand Hero" className="px-5 pt-3 pb-2 flex flex-col items-start w-full select-none">
            {/* Weather Context Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F0EBE1] border border-[#E3DBD0] text-xs font-medium text-[#181A18] shadow-2xs mb-5">
              <CloudSun className="w-4 h-4 text-[#181A18]/80 stroke-[1.75]" />
              <span className="tracking-tight">{weather.location || "Jakarta"} {weather.temperature || 33}°C</span>
            </div>

            {/* Headline Serif Anggun */}
            <h1 className="font-serif text-[2.6rem] leading-[1.08] tracking-tight text-[#181A18] font-normal mb-3">
              Personal Stylist AI<br />
              Didesain Khusus<br />
              Tropis
            </h1>

            {/* Subtitle Ringan & Hangat */}
            <p className="font-sans text-[13.5px] leading-relaxed text-[#181A18]/70 max-w-xs mb-6 font-normal">
              AI stylist yang memahami iklim tropis, warna kulitmu, dan gaya pribadimu.
            </p>

            {/* 2 Tombol Aksi Utama Sesuai Referensi Gambar */}
            <div className="flex flex-col gap-2.5 w-full">
              <button
                type="button"
                onClick={() => handleLaunchStudio(heroOutfit)}
                className="w-full h-12 bg-[#181A18] hover:bg-terracotta-600 active:scale-[0.99] text-[#FAF8F5] text-sm font-medium rounded-xl flex items-center justify-center transition-all shadow-xs"
              >
                Racik OOTD Sekarang
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenQuiz) onOpenQuiz();
                  else router.push("/?quiz=true");
                }}
                className="w-full h-12 bg-transparent border border-[#181A18]/25 hover:bg-[#181A18]/5 active:scale-[0.99] text-[#181A18] text-sm font-medium rounded-xl flex items-center justify-center transition-colors"
              >
                Tes Warna Kulit
              </button>
            </div>
          </section>

          {/* Marquee Brand Strip Halus */}
          <div className="w-full -my-1">
            <BrandMarquee />
          </div>

          {/* ============================================================ */}
          {/* 2. LIVING LOOKBOOK SHOWCASE (Auto-Play 4.5s & Micro-Zoom)    */}
          {/* ============================================================ */}
          <section aria-label="Living Lookbook Carousel" className="px-5 pt-1 pb-2 w-full flex flex-col gap-2.5">
            {/* Header Seksi Ringkas dengan Tombol Carousel */}
            <div className="pt-1 pb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                <p className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-[#8C5A3C]">
                  Inspirasi Tropis Hari Ini · 0{currentHeroIndex + 1} / 0{OUTFIT_HERO_LIST.length}
                </p>
              </div>

              {/* Tombol Panah Ganti Slide Cepat */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  aria-label="Outfit Sebelumnya"
                  onClick={handlePrevHero}
                  className="w-7 h-7 bg-white border border-[#181A18]/20 rounded-lg flex items-center justify-center text-[#181A18] active:bg-[#181A18] active:text-white transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Outfit Berikutnya"
                  onClick={handleNextHero}
                  className="w-7 h-7 bg-white border border-[#181A18]/20 rounded-lg flex items-center justify-center text-[#181A18] active:bg-[#181A18] active:text-white transition-colors"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Kanvas Foto Editorial Living Lookbook (Rasio Terkunci, Auto-Play Track, Micro-Zoom) */}
            <div 
              onClick={() => handleOpenOutfitDetails(heroOutfit)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="group cursor-pointer active:scale-[0.99] transition-all"
            >
              <div className="relative w-full h-[33dvh] min-h-[220px] max-h-[285px] bg-[#EFECE6] overflow-hidden rounded-2xl border border-[#181A18]/10 shadow-xs">
                {/* Horizontal Auto-Sliding Track */}
                <div
                  className="flex w-full h-full transition-transform duration-700 ease-out"
                  style={{ transform: `translateX(-${currentHeroIndex * 100}%)` }}
                >
                  {OUTFIT_HERO_LIST.map((outfit, idx) => (
                    <div key={outfit.id} className="w-full h-full shrink-0 relative overflow-hidden bg-[#EFECE6]">
                      <Image
                        src={outfit.gambar}
                        alt={outfit.judul}
                        fill
                        priority={idx === 0}
                        className={`w-full h-full object-cover object-top mix-blend-multiply transition-transform ease-out ${
                          idx === currentHeroIndex && !isPaused ? "scale-105 duration-[4500ms]" : "scale-100 duration-700"
                        }`}
                        sizes="(max-width: 480px) 100vw, 420px"
                      />

                      {/* Badge Teknologi Bahan di Kiri Atas */}
                      <div className="absolute top-2.5 left-2.5 bg-[#181A18]/85 backdrop-blur-sm text-[#FAF8F5] px-2.5 py-1 text-[11px] font-bold font-mono tracking-wider uppercase rounded-md shadow-xs z-10">
                        {outfit.subjudul}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tombol Wishlist Bersih */}
                <button
                  type="button"
                  aria-label="Simpan Outfit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSaveOutfit(heroOutfit);
                  }}
                  className="absolute top-2.5 right-2.5 w-7 h-7 bg-white/85 backdrop-blur-sm rounded-full flex items-center justify-center text-[#181A18] shadow-xs active:scale-90 transition-transform z-10"
                >
                  <Heart className={`w-3.5 h-3.5 ${isSavedLocally ? "fill-[#181A18] text-[#181A18]" : "text-stone-700"}`} />
                </button>
              </div>

              {/* 4-Segment Live Progress Bar (Tap-to-Slide) */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 pb-0.5 w-full">
                {OUTFIT_HERO_LIST.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Lihat inspirasi 0${i + 1}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentHeroIndex(i);
                    }}
                    className="h-1 rounded-full overflow-hidden bg-[#181A18]/15 relative focus:outline-none"
                  >
                    <div
                      className={`h-full bg-[#181A18] transition-all duration-300 ${
                        i === currentHeroIndex ? "w-full" : i < currentHeroIndex ? "w-full opacity-40" : "w-0"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {/* METADATA DI LUAR FOTO */}
              <div className="pt-2 pb-2.5 border-b border-[#181A18]/10 flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="flex items-center gap-1 shrink-0">
                      {heroOutfit.paletWarna.slice(0, 3).map((warna, idx) => (
                        <span
                          key={idx}
                          className="w-3 h-3 rounded-full border border-[#181A18]/25 shadow-2xs shrink-0"
                          style={{ backgroundColor: warna.hex }}
                          title={warna.nama}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] uppercase tracking-wider text-[#181A18]/80 font-mono font-bold truncate">
                      {heroOutfit.warnaKulitCocok}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold font-mono text-[#181A18] whitespace-nowrap">
                      {heroOutfit.rentangHarga}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className="font-serif text-lg font-bold text-[#181A18] leading-tight truncate">
                    {heroOutfit.judul}
                  </h2>
                  <p className="text-[11px] text-[#181A18]/75 mt-0.5 leading-snug line-clamp-1">
                    {heroOutfit.tagline}
                  </p>
                </div>
              </div>
            </div>

            {/* Tombol Lihat Rincian Komponen */}
            <button
              type="button"
              onClick={() => handleOpenOutfitDetails(heroOutfit)}
              className="w-full h-10 border border-[#181A18]/20 bg-white/80 hover:bg-[#181A18] hover:text-white text-[#181A18] text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <span>Lihat 4 Komponen & Rincian Bahan</span>
              <span>↗</span>
            </button>
          </section>

          {/* 3. QUICK ACTION WIDGET (Gamified Personal Color)             */}
          {/* ============================================================ */}
          <section aria-label="Widget Personal Color">
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-terracotta-500" />
                    <h3 className="text-base font-bold text-[#181A18]">
                      Diagnosa Warna, Bahan &amp; Domisili
                    </h3>
                  </div>
                  <p className="text-xs text-sand-500 mt-0.5">
                    Pilih zona domisili, profil rona Nusantara (tanpa tebak nadi), dan 3 warna baju favoritmu.
                  </p>
                </div>
                <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full shrink-0">
                  RAMAH BUTA WARNA
                </span>
              </div>

              {/* 3 Swatch Warna Kulit Interaktif */}
              <div className="grid grid-cols-3 gap-2.5 pt-1">
                {SKIN_TONES.map((tone) => {
                  const isSelected = selectedSkinTone === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => handleSelectSkinTone(tone)}
                      aria-label={`Pilih warna kulit ${tone.nama}`}
                      className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all min-h-[64px] ${
                        isSelected
                          ? "bg-sage-50/80 border-sage-600 ring-2 ring-sage-600/30 shadow-xs"
                          : "bg-stone-50/70 border-sand-200 hover:border-sand-300 active:scale-95"
                      }`}
                    >
                      <div className="relative">
                        <span
                          className="w-9 h-9 rounded-full block border-2 border-white shadow-xs"
                          style={{ backgroundColor: tone.hex }}
                        />
                        {isSelected && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-sage-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      
                      <span className="text-[11px] font-bold text-[#181A18] mt-1.5 line-clamp-1">
                        {tone.nama}
                      </span>
                      <span className="text-[11px] text-[#5C554E] font-medium">
                        {tone.subnama}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Tombol CTA yang memicu Modal Kuis Nyata */}
              <button
                type="button"
                onClick={() => {
                  if (onOpenQuiz) {
                    onOpenQuiz();
                  } else {
                    const activeTone = SKIN_TONES.find((t) => t.id === selectedSkinTone) || SKIN_TONES[0];
                    triggerNotification(`Undertone ${activeTone.nama} aktif: Pilihan warna ${activeTone.rekomendasiWarna}.`);
                  }
                }}
                className="w-full py-2.5 px-4 rounded-2xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200/90 text-amber-900 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-[0.99] min-h-[44px]"
              >
                <span>Mulai Diagnosa Domisili &amp; 3 Warna Favorit ✨</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. THE TROPICAL EDIT (Disiplin 2 Kolom Uniqlo Grade)         */}
          {/* ============================================================ */}
          <section aria-label="The Tropical Edit" className="space-y-3">
            <div className="flex items-end justify-between px-0.5">
              <div>
                <p className="text-[11px] font-mono font-bold uppercase tracking-[0.16em] text-terracotta-600 mb-0.5">
                  Sirkulasi Udara Optimal · Serat Bernapas
                </p>
                <h3 className="text-base font-bold text-[#181A18] font-serif">
                  The Tropical Edit
                </h3>
              </div>
              
              <button 
                type="button"
                onClick={() => router.push("/lookbook")}
                className="text-xs font-semibold text-charcoal-900/70 hover:text-charcoal-900 underline underline-offset-4 flex items-center min-h-[44px] px-1"
              >
                Lihat Semua
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-2.5 gap-y-6 pt-1">
              {TROPICAL_EDIT_LIST.map((item) => (
                <div
                  key={item.id}
                  onClick={() => router.push(`/studio?look=${item.studioParam}`)}
                  className="group flex flex-col bg-transparent active:scale-[0.98] transition-transform cursor-pointer select-none"
                >
                  {/* 1. Foto Rasio Mutlak 4:5 Bleed */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EFECE6]">
                    <Image
                      src={item.gambar}
                      alt={item.judul}
                      fill
                      className="object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
                      sizes="(max-width: 480px) 50vw, 200px"
                    />

                  </div>

                  {/* Metadata Bersih */}
                  <div className="pt-2 flex flex-col">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1">
                        {item.swatches.map((hex, idx) => (
                          <span
                            key={idx}
                            className="w-2.5 h-2.5 rounded-full ring-1 ring-black/15 shadow-2xs shrink-0"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-[#181A18]/50 truncate">
                        {item.kategori.replace("Kasual", "").replace("Longgar", "").trim() || "AIRISM"} · 161 CM
                      </span>
                    </div>

                    <h4 className="font-serif text-[13px] font-semibold text-[#181A18] line-clamp-1 leading-snug">
                      {item.judul}
                    </h4>
                    <p className="font-sans text-[11px] text-[#181A18]/55 line-clamp-1 mt-0.5">
                      {item.fabricNote}
                    </p>
                    <div className="mt-1 flex items-baseline">
                      <span className="font-sans text-xs font-semibold text-[#181A18] tracking-tight">
                        {item.rentangHarga}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Tips Hijab Adem */}
          <section className="p-3.5 rounded-2xl bg-sage-50/70 border border-sage-200/70 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-600/10 flex items-center justify-center shrink-0 text-sage-700">
              <ThermometerSun className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <span className="font-bold text-sage-800 block">
                Tips Anti-Gerah 33°C Hari Ini:
              </span>
              <p className="text-stone-600 text-[11px] leading-relaxed">
                Pilih hijab voal berpori &amp; hindari furing sintetis agar sirkulasi udara kepala tetap segar.
              </p>
            </div>
          </section>
        </main>

        

        {/* ============================================================ */}
        {/* 7. PROGRESSIVE DISCLOSURE: BOTTOM SHEET INTERAKTIF            */}
        {/* ============================================================ */}
        <AnimatePresence>
          {isBottomSheetOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsBottomSheetOpen(false)}
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs"
              />

              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 z-55 max-w-md mx-auto max-h-[85vh] bg-white rounded-t-[32px] shadow-2xl border-t border-[#E8DFD1] flex flex-col overflow-hidden pb-[max(20px,env(safe-area-inset-bottom))]"
              >
                {/* Drag Handle */}
                <div className="w-full pt-3 pb-2 flex items-center justify-center cursor-pointer" onClick={() => setIsBottomSheetOpen(false)}>
                  <div className="w-12 h-1.5 rounded-full bg-stone-300" />
                </div>

                <div className="px-5 pb-3 border-b border-sand-200 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-sage-50 text-sage-700 font-bold text-[11px] uppercase border border-sage-200">
                        {activeSheetOutfit.subjudul}
                      </span>
                      <span className="text-[11px] font-mono text-[#5C554E] font-medium">
                        {activeSheetOutfit.rentangHarga}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold font-serif text-[#181A18] mt-1">
                      {activeSheetOutfit.judul}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsBottomSheetOpen(false)}
                    className="w-9 h-9 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 min-h-[44px] min-w-[44px]"
                    aria-label="Tutup Rincian"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-5 overflow-y-auto space-y-4 text-xs">
                  {/* Statistik Sirkulasi & Harmoni Kulit */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="p-3 rounded-2xl bg-sage-50/70 border border-sage-200">
                      <div className="flex items-center gap-1.5 text-sage-800 font-bold">
                        <Wind className="w-4 h-4 text-sage-600" />
                        <span>Sirkulasi Udara</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        {activeSheetOutfit.sirkulasiUdara}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                      <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                        <Palette className="w-4 h-4 text-amber-600" />
                        <span>Harmoni Kulit</span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        {activeSheetOutfit.warnaKulitCocok}
                      </p>
                    </div>
                  </div>

                  {/* Mengapa Formula Ini Berhasil */}
                  <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-sand-200">
                    <span className="font-bold text-[#181A18] block mb-1">
                      Mengapa Formula Ini Nyaman?
                    </span>
                    <p className="text-stone-600 leading-relaxed text-[11px]">
                      {activeSheetOutfit.alasanCocok}
                    </p>
                  </div>

                  {/* Bedah Komponen Pakaian */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#181A18] uppercase tracking-wider text-[11px]">
                        Bedah Rincian Item Pakaian:
                      </span>
                      <span className="text-[#5C554E] font-mono text-[11px] font-bold">
                        {activeSheetOutfit.itemPakaian.length} Komponen
                      </span>
                    </div>

                    <div className="space-y-2">
                      {activeSheetOutfit.itemPakaian.map((item, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl border border-sand-200 bg-white shadow-2xs flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className="w-5 h-5 rounded-full border border-black/10 shrink-0 shadow-2xs"
                              style={{ backgroundColor: item.warnaHex }}
                            />
                            <div>
                              <span className="text-[11px] font-bold text-[#5C554E] uppercase">
                                {item.kategori}
                              </span>
                              <h4 className="font-bold text-[#181A18] text-xs">
                                {item.nama}
                              </h4>
                              <p className="text-[11px] text-stone-600">
                                {item.bahan} • {item.keunggulanAdem}
                              </p>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className="font-mono font-bold text-xs text-[#181A18]">
                              {item.estimasiHarga}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Palet Warna Acuan */}
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-[#181A18] block mb-2">
                      Palet Warna Harmonis:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeSheetOutfit.paletWarna.map((color, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-50 border border-sand-200 text-[11px]"
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span className="font-medium text-stone-700">{color.nama}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tombol Aksi di Lembar Bawah */}
                  <div className="pt-3 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleSaveOutfit(activeSheetOutfit)}
                      className="py-3 px-4 rounded-2xl border border-sand-300 font-bold text-xs text-[#181A18] hover:bg-stone-50 flex items-center justify-center gap-1.5 min-h-[44px]"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>{isSavedLocally ? "Tersimpan" : "Simpan ke Lemari"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleLaunchStudio(activeSheetOutfit)}
                      className="py-3 px-4 rounded-2xl bg-sage-600 hover:bg-sage-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm min-h-[44px]"
                    >
                      <Sparkles className="w-4 h-4 text-cream-200" />
                      <span>Racik di Studio AI</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}









