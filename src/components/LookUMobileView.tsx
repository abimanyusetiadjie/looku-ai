"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Search, ShoppingBag, Sun, House, Sparkles, Palette, BookOpen, Shirt, Wind, ChevronRight, ArrowRight, Check, X, Heart, ThermometerSun, Layers, Bookmark, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


















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

// 4 Skenario Iklim Tropis Riil LookU AI untuk Hero Swipe Carousel
const OUTFIT_HERO_LIST: MobileOutfit[] = [
  {
    id: "casual-campus-chiffon",
    judul: "Casual Campus Chiffon",
    subjudul: "100% Adem & Modest",
    tagline: "Kombinasi linen crinkle dan kulot jatuh bebas gerah untuk aktivitas seharian.",
    suhu: "33°C Tropis Siang Hari",
    sirkulasiUdara: "98.4% Sirkulasi Udara Optimal",
    alasanCocok: "Kombinasi serat linen alami dan voal paris berpori mikro melepas panas tubuh seketika tanpa menerawang, sangat santun untuk hijab santai maupun semi-formal.",
    gambar: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=900&auto=format&fit=crop&q=85",
    paletWarna: [
      { nama: "Krem Oat", hex: "#FAF6EE" },
      { nama: "Sage Green", hex: "#6B8E68" },
      { nama: "Sand Cokelat", hex: "#D4A373" },
    ],
    warnaKulitCocok: "Sawo Matang & Kuning Langsat",
    rentangHarga: "Rp 240rb - 320rb",
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
        kategori: "Alas Kaki & Tas",
        nama: "Mules Slip-On & Tas Kanvas Mini",
        bahan: "Kulit Sintetis Lentur & Kanvas",
        warna: "Krem Sand",
        warnaHex: "#ECE0C7",
        estimasiHarga: "Rp 85.000",
        keunggulanAdem: "Bebas lembap pada kaki, praktis untuk mobilitas tinggi.",
      },
    ],
  },
  {
    id: "seoul-cafe-hopping",
    judul: "Seoul Cafe Hopping",
    subjudul: "100% Adem & Estetik",
    tagline: "Paduan kemeja camp collar dan linen trousers bergaya minimalis tropis.",
    suhu: "33°C Cuaca Terik",
    sirkulasiUdara: "97.8% Aliran Udara Bebas",
    alasanCocok: "Potongan kerah terbuka dan siluet santai menghasilkan tampilan urban kafe yang fotogenik sekaligus anti-keringat berlebih.",
    gambar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=85",
    paletWarna: [
      { nama: "Putih Gading", hex: "#FDFBF7" },
      { nama: "Sage Soft", hex: "#91AF90" },
      { nama: "Sand Terang", hex: "#DECBA6" },
    ],
    warnaKulitCocok: "Semua Tone Kulit Nusantara",
    rentangHarga: "Rp 240rb - 350rb",
    studioParam: "hangout_nonhijab_panas_menengah",
    itemPakaian: [
      {
        kategori: "Atasan",
        nama: "Kemeja Camp Collar Linen",
        bahan: "Linen Euro Blend",
        warna: "Sage Soft",
        warnaHex: "#91AF90",
        estimasiHarga: "Rp 135.000",
        keunggulanAdem: "Kerah rileks menyerap keringat di area leher.",
      },
      {
        kategori: "Bawahan",
        nama: "Celana Lurus Linen Blend",
        bahan: "Katun Linen Organik",
        warna: "Putih Gading",
        warnaHex: "#FDFBF7",
        estimasiHarga: "Rp 115.000",
        keunggulanAdem: "Daya serap tinggi dan cepat kering di cuaca lembap.",
      },
    ],
  },
  {
    id: "scbd-smart-chic",
    judul: "SCBD Smart Chic",
    subjudul: "Anti-Gerah & AC Meeting",
    tagline: "Blazer tencel sejuk dan celana palazzo rapi untuk mobilitas kerja ibu kota.",
    suhu: "22°C AC & 33°C Terik Jalanan",
    sirkulasiUdara: "96.5% Adaptif Dua Suhu",
    alasanCocok: "Kain Tencel Lyocell memberikan kehangatan lembut di ruang kantor ber-AC namun melepas panas seketika saat melangkah di luar ruangan.",
    gambar: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&auto=format&fit=crop&q=85",
    paletWarna: [
      { nama: "Olive Lembut", hex: "#6B705C" },
      { nama: "Oatmeal", hex: "#FAF6EE" },
      { nama: "Charcoal Rapi", hex: "#242724" },
    ],
    warnaKulitCocok: "Kuning Langsat & Fair",
    rentangHarga: "Rp 280rb - 390rb",
    studioParam: "kantor_scbd_formal",
    itemPakaian: [
      {
        kategori: "Outerwear",
        nama: "Blazer Tencel Breathable",
        bahan: "100% Tencel Lyocell",
        warna: "Olive Lembut",
        warnaHex: "#6B705C",
        estimasiHarga: "Rp 195.000",
        keunggulanAdem: "Serat lembut ramah kulit dengan kontrol kelembapan optimal.",
      },
      {
        kategori: "Bawahan",
        nama: "Palazzo High-Waist Rapi",
        bahan: "Poly-Rayon Stretch Dingin",
        warna: "Charcoal Rapi",
        warnaHex: "#242724",
        estimasiHarga: "Rp 135.000",
        keunggulanAdem: "Potongan lurus rapi tanpa membatasi langkah kaki.",
      },
    ],
  },
  {
    id: "santai-sore-senopati",
    judul: "Santai Sore Senopati",
    subjudul: "100% Santai & Rileks",
    tagline: "Kemeja oversized katun rami dan celana pendek bermuda untuk sore santai.",
    suhu: "31°C Lembap Sore Hari",
    sirkulasiUdara: "99.1% Sirkulasi Maksimal",
    alasanCocok: "Katun rami alami tenun terbuka memaksimalkan sirkulasi udara sore hari di kafe semi-outdoor.",
    gambar: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&auto=format&fit=crop&q=85",
    paletWarna: [
      { nama: "Sage Hijau", hex: "#557352" },
      { nama: "Krem Alami", hex: "#FAF6EE" },
      { nama: "Sand Cokelat", hex: "#D4A373" },
    ],
    warnaKulitCocok: "Sawo Matang & Tan Eksotis",
    rentangHarga: "Rp 210rb - 295rb",
    studioParam: "santai_weekend_kafe",
    itemPakaian: [
      {
        kategori: "Atasan",
        nama: "Kemeja Oversized Katun Rami",
        bahan: "Tenun Rami Alami",
        warna: "Sage Hijau",
        warnaHex: "#557352",
        estimasiHarga: "Rp 130.000",
        keunggulanAdem: "Anyaman berongga membiarkan angin sepoi-sepoi masuk bebas.",
      },
      {
        kategori: "Bawahan",
        nama: "Celana Relaxed Drawstring",
        bahan: "Linen Katun Ringan",
        warna: "Sand Cokelat",
        warnaHex: "#D4A373",
        estimasiHarga: "Rp 110.000",
        keunggulanAdem: "Pinggang elastis nyaman tanpa tekanan berlebih.",
      },
    ],
  },
];

// Data Tren Mingguan Horisontal
const TRENDING_OOTD_LIST = [
  {
    id: "tren-1",
    judul: "Seoul Cafe Hopping",
    kategori: "Kasual Kafe",
    rentangHarga: "Rp 240rb - 350rb",
    sirkulasi: "98% Adem",
    tagModest: "Hijab Friendly",
    studioParam: "hangout_nonhijab_panas_menengah",
    gambar: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "tren-2",
    judul: "SCBD Smart Chic",
    kategori: "Kantor & Rapat",
    rentangHarga: "Rp 280rb - 390rb",
    sirkulasi: "96% AC & Terik",
    tagModest: "Formal Santun",
    studioParam: "kantor_scbd_formal",
    gambar: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "tren-3",
    judul: "Santai Senopati Matcha",
    kategori: "Akhir Pekan",
    rentangHarga: "Rp 210rb - 295rb",
    sirkulasi: "99% Super Adem",
    tagModest: "Gaya Rileks",
    studioParam: "santai_weekend_kafe",
    gambar: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "tren-4",
    judul: "Kondangan Pastel Modest",
    kategori: "Pesta Santun",
    rentangHarga: "Rp 320rb - 450rb",
    sirkulasi: "95% Sutra Adem",
    tagModest: "100% Modest",
    studioParam: "kondangan_hijab_pastel",
    gambar: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&auto=format&fit=crop&q=80",
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

  // State Interaktif
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [selectedSkinTone, setSelectedSkinTone] = useState<string>("sawo-matang");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [activeSheetOutfit, setActiveSheetOutfit] = useState<MobileOutfit>(OUTFIT_HERO_LIST[0]);
  const [activeNavTab, setActiveNavTab] = useState<string>("beranda");
  const [isSavedLocally, setIsSavedLocally] = useState(false);
  const [notifFeedback, setNotifFeedback] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const heroOutfit = OUTFIT_HERO_LIST[currentHeroIndex];

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
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
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
      let list: Array<{ id: string; title: string; price: string }> = stored ? JSON.parse(stored) : [];
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
    <div className="relative w-full min-h-screen bg-[#FAF8F5] text-[#181A18] font-sans antialiased selection:bg-sage-200 flex flex-col items-center justify-start">
      {/* Kontainer Layar Ponsel (max-w-md mx-auto) */}
      <div className="w-full max-w-md min-h-screen bg-[#FAF8F5] border-x border-[#E8DFD1]/50 shadow-2xl relative flex flex-col pb-24">
        
        {/* ============================================================ */}
        {/* 1. HEADER ATAS (Sticky / Safe Area dengan Brand look.u)       */}
        {/* ============================================================ */}
        <header className="sticky top-0 z-30 w-full bg-white px-4 pt-[max(16px,env(safe-area-inset-top))] pb-4 transition-all flex items-center justify-between border-b border-[#F0EBE1]">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-charcoal-900" aria-label="Menu">
            <Menu className="w-5 h-5 stroke-[1.5]" />
          </button>
          
          <Link href="/" className="font-serif font-medium text-3xl tracking-[0.05em] text-[#181A18] flex items-baseline select-none">
            Look<span className="text-terracotta-500 font-bold">.</span>u
          </Link>
          
          <div className="flex items-center gap-4">
            <button className="text-charcoal-900" aria-label="Search">
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            <button onClick={onOpenSavedDrawer} className="text-charcoal-900" aria-label="Bag">
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
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
                <button onClick={() => { setIsMobileMenuOpen(false); router.push('/lemari') }} className="text-left font-sans font-semibold tracking-widest uppercase text-sm hover:text-terracotta-500 transition-colors">Wardrobe / Lemari</button>
                <button onClick={() => { setIsMobileMenuOpen(false); if(onOpenQuiz) onOpenQuiz(); }} className="text-left font-sans font-semibold tracking-widest uppercase text-sm hover:text-terracotta-500 transition-colors">Personal Color Quiz</button>
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
        <main className="flex-1 w-full space-y-6">
          
          {/* ============================================================ */}
          {/* 2. HERO SECTION (Look of the Day)                           */}
          {/* ============================================================ */}
          <section aria-label="Gaya Pilihan Hari Ini" className="bg-white w-full flex flex-col items-center">
            <div
              onClick={() => handleOpenOutfitDetails(heroOutfit)}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full relative cursor-pointer active:scale-[0.99] transition-all flex flex-col items-center"
            >
              {/* Image Container - Constrained Height for Mobile Responsiveness */}
              <div className="w-full h-[55vh] min-h-[400px] max-h-[500px] relative bg-sand-50">
                <Image
                  src={heroOutfit.gambar}
                  alt={heroOutfit.judul}
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="100vw"
                />
                
                {/* Floating Save Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleSaveOutfit(heroOutfit);
                  }}
                  className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#181A18] shadow-sm border border-black/5"
                >
                  <Heart className={`w-4 h-4 ${isSavedLocally ? "fill-[#181A18] text-[#181A18]" : "text-stone-700"}`} />
                </button>
              </div>

              {/* Minimal Text Content */}
              <div className="w-full max-w-sm px-6 pt-8 pb-4 flex flex-col items-center text-center">
                <h1 className="font-serif font-medium text-[28px] text-[#181A18] leading-tight mb-2">
                  {heroOutfit.judul}
                </h1>
                
                <p className="font-sans text-[8px] font-semibold uppercase tracking-[0.15em] text-[#181A18]/60 mb-6 leading-relaxed max-w-[280px]">
                  {heroOutfit.subjudul} — {heroOutfit.tagline}
                </p>

                <div className="flex items-center gap-4 mb-6">
                  <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-[#181A18]">
                    COLOR
                  </span>
                  <div className="flex gap-2.5">
                    {heroOutfit.paletWarna.slice(0, 3).map((warna, idx) => (
                      <span
                        key={idx}
                        className={`w-4 h-4 rounded-full border border-black/20 ${idx === 0 ? 'ring-1 ring-offset-[2px] ring-charcoal-900' : ''}`}
                        style={{ backgroundColor: warna.hex }}
                      />
                    ))}
                  </div>
                </div>

                <p className="font-sans text-[8px] uppercase tracking-widest text-[#181A18]/50 font-semibold mb-3">
                  {heroOutfit.suhu}
                </p>

                <div className="font-sans text-sm font-bold text-[#181A18] mb-6 tracking-widest">
                  {heroOutfit.rentangHarga}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); handleLaunchStudio(heroOutfit); }} 
                  className="w-full max-w-[240px] py-3.5 rounded-full border border-[#181A18] text-center font-sans text-[10px] font-bold uppercase tracking-widest text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors mb-2"
                >
                  Add to Wardrobe
                </button>

                {/* Swipe Indicators */}
                <div className="flex items-center justify-center gap-1.5 mt-2 h-4">
                  {OUTFIT_HERO_LIST.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-[3px] rounded-full transition-all ${
                        idx === currentHeroIndex ? "w-5 bg-[#181A18]" : "w-1.5 bg-black/10"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 3. QUICK ACTION WIDGET (Gamified Personal Color)             */}
          {/* ============================================================ */}
          <section aria-label="Widget Personal Color">
            <div className="p-4 sm:p-5 rounded-3xl bg-white border border-[#E8DFD1] shadow-tactile space-y-3.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5">
                    <Palette className="w-4 h-4 text-terracotta-500" />
                    <h3 className="text-base font-bold text-[#181A18]">
                      Bingung warna yang cocok?
                    </h3>
                  </div>
                  <p className="text-xs text-sand-500 mt-0.5">
                    Ketahui palet warna pakaian yang bikin wajah cerah seketika di terik tropis.
                  </p>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                  GRATIS
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
                      <span className="text-[9px] text-sand-500 font-medium">
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
                <span>Mulai Tes Personal Color Lengkap (60 Detik) ✨</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-700" />
              </button>
            </div>
          </section>

          {/* ============================================================ */}
          {/* 4. TRENDING CAROUSEL (Horizontal Scroll Snap-X)             */}
          {/* ============================================================ */}
          <section aria-label="Tren OOTD Minggu Ini" className="space-y-3">
            <div className="flex items-center justify-between px-0.5">
              <div>
                <h3 className="text-base font-bold text-[#181A18] flex items-center gap-1.5">
                  <span>Tren OOTD Minggu Ini 🔥</span>
                </h3>
                <p className="text-xs text-sand-500 mt-0.5">
                  Favorit pekan ini untuk cuaca 33°C &amp; hangout kafe
                </p>
              </div>
              
              <button 
                type="button"
                onClick={() => router.push("/lookbook")}
                className="text-xs font-bold text-sage-700 hover:text-sage-800 flex items-center min-h-[44px] px-1"
              >
                Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2 -mx-4 px-4 pt-1">
              {TRENDING_OOTD_LIST.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    handleOpenOutfitDetails({
                      ...heroOutfit,
                      id: item.id,
                      judul: item.judul,
                      subjudul: item.tagModest,
                      gambar: item.gambar,
                      rentangHarga: item.rentangHarga,
                      studioParam: item.studioParam,
                    });
                  }}
                  className="snap-start shrink-0 w-[185px] bg-white rounded-2xl border border-[#E8DFD1] overflow-hidden shadow-2xs hover:shadow-tactile active:scale-[0.98] transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative w-full aspect-[4/4.5] bg-stone-100 overflow-hidden">
                    <Image
                      src={item.gambar}
                      alt={item.judul}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform"
                      sizes="185px"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-xs text-white text-[9px] font-bold">
                      {item.sirkulasi}
                    </div>
                  </div>

                  <div className="p-3 space-y-1">
                    <span className="text-[9px] font-bold text-sage-600 uppercase tracking-wider block">
                      {item.kategori}
                    </span>
                    <h4 className="text-xs font-bold text-[#181A18] line-clamp-1 leading-snug">
                      {item.judul}
                    </h4>
                    <p className="text-[11px] font-semibold text-stone-600 pt-0.5">
                      {item.rentangHarga}
                    </p>
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
        {/* 6. BOTTOM NAVIGATION BAR (Fixed di Bawah dengan Safe Area)    */}
        {/* ============================================================ */}
        <nav
          aria-label="Navigasi Utama Ponsel"
          className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8DFD1] pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.04)]"
        >
          <div className="max-w-md mx-auto grid grid-cols-5 h-[58px] items-center px-1">
            
            {/* 1. Beranda */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab("beranda");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors ${
                activeNavTab === "beranda" ? "text-sage-700 font-bold" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <House className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] mt-1">Beranda</span>
            </button>

            {/* 2. Studio AI */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab("studio");
                router.push("/studio");
              }}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors ${
                activeNavTab === "studio" ? "text-sage-700 font-bold" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <Sparkles className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] mt-1">Studio AI</span>
            </button>

            {/* 3. Kuis Warna (DISOROT SPESIAL / AKTIF MELAYANG) */}
            <div className="relative flex flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => {
                  setActiveNavTab("kuis-warna");
                  if (onOpenQuiz) {
                    onOpenQuiz();
                  } else {
                    triggerNotification("Membuka kuis personal color...");
                  }
                }}
                className="relative -top-4 w-12 h-12 rounded-full bg-sage-600 text-white flex items-center justify-center shadow-[0_6px_16px_rgba(85,115,82,0.45)] border-3 border-white active:scale-95 transition-transform"
                aria-label="Kuis Warna - Fitur Utama"
              >
                <Palette className="w-5 h-5" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-amber-400 rounded-full border-2 border-white animate-pulse" />
              </button>
              <span className="text-[10px] font-bold text-sage-800 -mt-2">
                Kuis Warna
              </span>
            </div>

            {/* 4. Lookbook */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab("lookbook");
                router.push("/lookbook");
              }}
              className={`flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors ${
                activeNavTab === "lookbook" ? "text-sage-700 font-bold" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <BookOpen className="w-5 h-5 stroke-[1.8]" />
              <span className="text-[10px] mt-1">Lookbook</span>
            </button>

            {/* 5. Lemari */}
            <button
              type="button"
              onClick={() => {
                setActiveNavTab("lemari");
                if (onOpenSavedDrawer) {
                  onOpenSavedDrawer();
                } else {
                  router.push("/lemari");
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 min-h-[44px] transition-colors ${
                activeNavTab === "lemari" ? "text-sage-700 font-bold" : "text-stone-500 hover:text-stone-800"
              }`}
            >
              <div className="relative">
                <Shirt className="w-5 h-5 stroke-[1.8]" />
                {savedCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 min-w-[15px] h-[15px] px-1 rounded-full bg-terracotta-500 text-white text-[8px] font-mono font-bold flex items-center justify-center border border-white">
                    {savedCount > 9 ? "9+" : savedCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">Lemari</span>
            </button>
          </div>
        </nav>

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
                      <span className="px-2 py-0.5 rounded-full bg-sage-50 text-sage-700 font-bold text-[10px] uppercase border border-sage-200">
                        {activeSheetOutfit.subjudul}
                      </span>
                      <span className="text-[10px] font-mono text-sand-500">
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
                      <span className="text-sand-500 font-mono text-[10px]">
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
                              <span className="text-[9px] font-bold text-sand-500 uppercase">
                                {item.kategori}
                              </span>
                              <h4 className="font-bold text-[#181A18] text-xs">
                                {item.nama}
                              </h4>
                              <p className="text-[10px] text-stone-500">
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






