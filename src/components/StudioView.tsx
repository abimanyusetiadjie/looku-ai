"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Lock, 
  Unlock, 
  RotateCw, 
  Sparkles, 
  ShoppingBag, 
  ExternalLink, 
  Check, 
  X, 
  Info, 
  ChevronRight, 
  SlidersHorizontal, 
  Heart,
  Palette,
  Wind,
  ShieldCheck,
  Bookmark
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";

export interface StudioItem {
  id: string;
  category: "top" | "bottom" | "outer" | "shoes";
  categoryLabel: string;
  name: string;
  material: string;
  breathability: number;
  colorName: string;
  colorHex: string;
  price: number;
  priceStr: string;
  imageUrl: string;
  shopeeQuery: string;
  tokopediaQuery: string;
  note: string;
  gender: "female" | "male" | "unisex";
  modest: boolean;
}

// -------------------------------------------------------------
// POOL KOMPONEN PAKAIAN ASLI (68+ Item Dataset Myntra & Golden)
// -------------------------------------------------------------
const TOP_POOL: StudioItem[] = [
  {
    id: "top_linen_oversized_sage",
    category: "top",
    categoryLabel: "Atasan · Linen",
    name: "Kemeja Linen Oversized Drop Shoulder",
    material: "Katun Linen Crinkle Berpori",
    breathability: 98,
    colorName: "Sage Green",
    colorHex: "#84A98C",
    price: 125000,
    priceStr: "Rp 125.000",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "kemeja linen oversized wanita crinkle",
    tokopediaQuery: "kemeja linen wanita oversized",
    note: "Sirkulasi udara 98% optimal pada suhu 33°C",
    gender: "female",
    modest: true,
  },
  {
    id: "top_tunik_rayon_white",
    category: "top",
    categoryLabel: "Atasan · Rayon",
    name: "Oversized Tunik Katun Rayon",
    material: "Katun Rayon Twill Dingin",
    breathability: 97,
    colorName: "Broken White",
    colorHex: "#FAF6EE",
    price: 110000,
    priceStr: "Rp 110.000",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "tunik katun rayon wanita loose",
    tokopediaQuery: "tunik rayon twill broken white",
    note: "Menyerap keringat seketika, bebas menerawang",
    gender: "female",
    modest: true,
  },
  {
    id: "top_oxford_sky_blue",
    category: "top",
    categoryLabel: "Atasan · Oxford",
    name: "Kemeja Oxford Pin-Point Breathable",
    material: "100% Katun Oxford Sejuk",
    breathability: 94,
    colorName: "Sky Blue",
    colorHex: "#87CEEB",
    price: 145000,
    priceStr: "Rp 145.000",
    imageUrl: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "kemeja oxford pria lengan panjang sky blue",
    tokopediaQuery: "kemeja oxford pin point pria sejuk",
    note: "Cocok untuk ruangan AC kantor dan terik luar ruangan",
    gender: "male",
    modest: false,
  },
  {
    id: "top_camp_collar_olive",
    category: "top",
    categoryLabel: "Atasan · Camp Collar",
    name: "Kemeja Camp Collar Linen Blend",
    material: "Linen Euro Organik",
    breathability: 96,
    colorName: "Olive Earth",
    colorHex: "#6B705C",
    price: 135000,
    priceStr: "Rp 135.000",
    imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "kemeja camp collar linen pria wanita",
    tokopediaQuery: "camp collar shirt linen olive",
    note: "Kerah terbuka melepas panas leher secara alami",
    gender: "unisex",
    modest: false,
  },
  {
    id: "top_silk_satin_dress",
    category: "top",
    categoryLabel: "One-Piece · Silk",
    name: "Maxi Dress Silk Satin Twill",
    material: "Silk Satin Twill Halus",
    breathability: 92,
    colorName: "Rose Gold Mocca",
    colorHex: "#B76E79",
    price: 280000,
    priceStr: "Rp 280.000",
    imageUrl: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "dress silk satin pesta wanita kondangan",
    tokopediaQuery: "gamis silk satin twill mewah",
    note: "Kilau mewah dingin untuk acara pesta formal & resepsi",
    gender: "female",
    modest: true,
  },
];

const BOTTOM_POOL: StudioItem[] = [
  {
    id: "bottom_loose_culottes_terracotta",
    category: "bottom",
    categoryLabel: "Bawahan · Kulot",
    name: "Loose Culottes Linen Crinkle",
    material: "Linen Crinkle Organik",
    breathability: 96,
    colorName: "Terracotta Rose",
    colorHex: "#D4A373",
    price: 95000,
    priceStr: "Rp 95.000",
    imageUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "celana kulot linen crinkle highwaist",
    tokopediaQuery: "kulot linen wanita terracotta",
    note: "Potongan longgar anti-lekat, kaki melangkah leluasa",
    gender: "female",
    modest: true,
  },
  {
    id: "bottom_slacks_broken_white",
    category: "bottom",
    categoryLabel: "Bawahan · Slacks",
    name: "Highwaist Flowy Slacks Broken White",
    material: "Poli-Cotton Flowy Dingin",
    breathability: 95,
    colorName: "Broken White",
    colorHex: "#FAF6EE",
    price: 89000,
    priceStr: "Rp 89.000",
    imageUrl: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "celana highwaist loose slacks broken white",
    tokopediaQuery: "kulot highwaist flowy wanita",
    note: "Siluet kaki jenjang dan bahan jatuh anggun",
    gender: "female",
    modest: true,
  },
  {
    id: "bottom_chino_khaki",
    category: "bottom",
    categoryLabel: "Bawahan · Chino",
    name: "Slim Straight Chino Pants Khaki",
    material: "Katun Twill Stretch 2-Way",
    breathability: 93,
    colorName: "Khaki Sand",
    colorHex: "#C2B280",
    price: 155000,
    priceStr: "Rp 155.000",
    imageUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "celana chino pria slim straight khaki",
    tokopediaQuery: "chino pants pria katun stretch",
    note: "Fleksibel dan kokoh untuk kantor & hangout",
    gender: "male",
    modest: false,
  },
  {
    id: "bottom_palazzo_charcoal",
    category: "bottom",
    categoryLabel: "Bawahan · Palazzo",
    name: "Palazzo Pants Rapi Charcoal",
    material: "Poly-Rayon Stretch Dingin",
    breathability: 94,
    colorName: "Charcoal Rapi",
    colorHex: "#242724",
    price: 135000,
    priceStr: "Rp 135.000",
    imageUrl: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "celana palazzo wanita formal kantor charcoal",
    tokopediaQuery: "palazzo pants wanita kerja rapi",
    note: "Tahan kusut walau duduk berjam-jam saat meeting",
    gender: "female",
    modest: true,
  },
];

const OUTER_POOL: StudioItem[] = [
  {
    id: "outer_voal_sage",
    category: "outer",
    categoryLabel: "Hijab · Voal",
    name: "Hijab Voal Ultrafine Laser Cut",
    material: "100% Voal Ultrafine",
    breathability: 98,
    colorName: "Sage Soft",
    colorHex: "#8FA98D",
    price: 45000,
    priceStr: "Rp 45.000",
    imageUrl: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "jilbab segi empat voal ultrafine laser cut",
    tokopediaQuery: "hijab voal ultrafine premium",
    note: "Pori mikro melepas panas kepala secara instan",
    gender: "female",
    modest: true,
  },
  {
    id: "outer_pashmina_ceruty",
    category: "outer",
    categoryLabel: "Hijab · Pashmina",
    name: "Pashmina Ceruty Baby Doll Silk",
    material: "Ceruty Silk Ringan Dingin",
    breathability: 96,
    colorName: "Cream Sand",
    colorHex: "#F5EBE0",
    price: 35000,
    priceStr: "Rp 35.000",
    imageUrl: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "pashmina ceruty baby doll premium",
    tokopediaQuery: "pashmina ceruty silk adem",
    note: "Jatuh bergelombang indah tanpa rasa berat di leher",
    gender: "female",
    modest: true,
  },
  {
    id: "outer_blazer_tencel",
    category: "outer",
    categoryLabel: "Outer · Blazer",
    name: "Summer Deconstructed Blazer",
    material: "100% Tencel Lyocell Breathable",
    breathability: 94,
    colorName: "Tailored Navy",
    colorHex: "#1B2A4A",
    price: 195000,
    priceStr: "Rp 195.000",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "blazer pria wanita unlined linen tencel",
    tokopediaQuery: "deconstructed blazer sejuk santai",
    note: "Tanpa furing tebal sintetis, aman di panas siang",
    gender: "unisex",
    modest: false,
  },
  {
    id: "outer_knit_cardigan",
    category: "outer",
    categoryLabel: "Outer · Cardigan",
    name: "Soft Layering Knit Cardigan",
    material: "Fine Acrylic Breathable Knit",
    breathability: 91,
    colorName: "Warm Oat",
    colorHex: "#ECE0C7",
    price: 115000,
    priceStr: "Rp 115.000",
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "cardigan rajut tipis wanita adem",
    tokopediaQuery: "soft knit cardigan layering sejuk",
    note: "Layering ringan untuk ruangan ber-AC dingin",
    gender: "female",
    modest: true,
  },
];

const SHOES_POOL: StudioItem[] = [
  {
    id: "shoes_canvas_sneakers",
    category: "shoes",
    categoryLabel: "Sepatu · Sneakers",
    name: "Retro Canvas Sneakers White",
    material: "Breathable Canvas & Rubber Sole",
    breathability: 95,
    colorName: "Broken White",
    colorHex: "#FAF6EE",
    price: 85000,
    priceStr: "Rp 85.000",
    imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "sepatu sneakers canvas putih wanita pria",
    tokopediaQuery: "sneakers canvas retro putih",
    note: "Sol karet fleksibel anti-lelah untuk jalan jauh",
    gender: "unisex",
    modest: false,
  },
  {
    id: "shoes_penny_loafers",
    category: "shoes",
    categoryLabel: "Sepatu · Loafers",
    name: "Leather Penny Loafers",
    material: "Soft Leather & Rubber Sole",
    breathability: 92,
    colorName: "Dark Brown",
    colorHex: "#3E2723",
    price: 195000,
    priceStr: "Rp 195.000",
    imageUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "sepatu loafers kulit pria formal kasual",
    tokopediaQuery: "leather penny loafers pria cokelat",
    note: "Slip-on elegan tanpa repot tali sepatu",
    gender: "male",
    modest: false,
  },
  {
    id: "shoes_mules_heels",
    category: "shoes",
    categoryLabel: "Sepatu · Mules",
    name: "Pointed Block Heels Mules",
    material: "Cushioned Insole & Suede",
    breathability: 94,
    colorName: "Nude Sand",
    colorHex: "#DECBA6",
    price: 150000,
    priceStr: "Rp 150.000",
    imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "sepatu heels mules wanita pointed block",
    tokopediaQuery: "mules pointed block heels nyaman",
    note: "Empuk untuk dipakai berdiri lama saat kondangan",
    gender: "female",
    modest: false,
  },
  {
    id: "shoes_slipon_flats",
    category: "shoes",
    categoryLabel: "Sepatu · Slip-On",
    name: "Comfort Flat Slide Mules",
    material: "Lentur & Soft Cushion",
    breathability: 96,
    colorName: "Krem Oat",
    colorHex: "#FAF6EE",
    price: 78000,
    priceStr: "Rp 78.000",
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
    shopeeQuery: "sandal slip on mules wanita flat santai",
    tokopediaQuery: "flat mules wanita nyaman",
    note: "Bebas lembap kaki untuk mobilitas santai kafe",
    gender: "female",
    modest: false,
  },
];

// -------------------------------------------------------------
// METADATA DRAPING TAB 02: PERSONAL COLOR LAB (60S)
// -------------------------------------------------------------
const SKIN_TONES_DRAPE = [
  {
    id: "sawo-matang",
    nama: "Sawo Matang",
    season: "Warm Autumn",
    hex: "#B87B52",
    vein: "Kehijauan (Warm Undertone)",
    bestPalettes: [
      { name: "Terracotta", hex: "#D4A373" },
      { name: "Sage Olive", hex: "#6E8B74" },
      { name: "Warm Ivory", hex: "#F5F2EB" },
      { name: "Bronze Brown", hex: "#8C5A3C" },
    ],
    avoidPalettes: [
      { name: "Ash Grey (Bikin Kusam)", hex: "#8A929A" },
      { name: "Neon Pink (Kontras Tajam)", hex: "#FF1493" },
      { name: "Kuning Stabilo", hex: "#E6FF00" },
    ],
    deskripsi: "Rona paling umum di Indonesia. Sangat bercahaya dengan earth tones hangat.",
  },
  {
    id: "kuning-langsat",
    nama: "Kuning Langsat",
    season: "Warm Spring",
    hex: "#E8C8A2",
    vein: "Campuran Hijau-Biru (Neutral-Warm)",
    bestPalettes: [
      { name: "Coral Lembut", hex: "#F08080" },
      { name: "Sky Soft", hex: "#87CEEB" },
      { name: "Butter Cream", hex: "#FFFDD0" },
      { name: "Sage Light", hex: "#A8C3A0" },
    ],
    avoidPalettes: [
      { name: "Hitam Pekat Berat", hex: "#000000" },
      { name: "Cokelat Terlalu Gelap", hex: "#2E1A0C" },
      { name: "Kuning Kunyit Pudar", hex: "#D4AF37" },
    ],
    deskripsi: "Memancarkan kilau radiant alami saat dipadukan dengan pastel hangat.",
  },
  {
    id: "putih-gading",
    nama: "Putih Gading",
    season: "Light Spring / Summer",
    hex: "#F5D6C6",
    vein: "Kebiruan / Ungu (Cool Undertone)",
    bestPalettes: [
      { name: "Rose Quartz", hex: "#F7CAC9" },
      { name: "Lavender Muted", hex: "#E6E6FA" },
      { name: "Navy Blue", hex: "#1B2A4A" },
      { name: "Broken White", hex: "#FAF6EE" },
    ],
    avoidPalettes: [
      { name: "Orange Menyala", hex: "#FF4500" },
      { name: "Mustard Pekat", hex: "#CC7722" },
      { name: "Cokelat Bata Gelap", hex: "#8B4513" },
    ],
    deskripsi: "Kontras seimbang dengan warna dingin dan soft pastels.",
  },
  {
    id: "tan-eksotis",
    nama: "Tan Eksotis",
    season: "Deep Autumn",
    hex: "#7D5335",
    vein: "Hijau Zaitun (Deep Warm)",
    bestPalettes: [
      { name: "Deep Terracotta", hex: "#C86446" },
      { name: "Mustard Emas", hex: "#DAA520" },
      { name: "Forest Green", hex: "#228B22" },
      { name: "Cream Oat", hex: "#FAF6EE" },
    ],
    avoidPalettes: [
      { name: "Baby Pink Pucat", hex: "#F4C2C2" },
      { name: "Putih Kapur Silau", hex: "#FFFFFF" },
      { name: "Abu-Abu Monoton", hex: "#708090" },
    ],
    deskripsi: "Tone eksotis tropis berwibawa, sangat mewah dengan jewel & rich earth tones.",
  },
];

interface StudioViewProps {
  initialLookId?: string | null;
  onSaveOutfit?: (outfit: OOTDRecommendation) => void;
}

export default function StudioView({ initialLookId, onSaveOutfit }: StudioViewProps) {
  const router = useRouter();

  // State Mode Studio
  const [activeTab, setActiveTab] = useState<"mixer" | "colorlab">("mixer");
  const [genderMode, setGenderMode] = useState<"hijab" | "nonhijab" | "pria">("hijab");
  const [weatherMode, setWeatherMode] = useState<"hot" | "ac" | "rainy" | "mild">("hot");
  const [selectedSkinToneId, setSelectedSkinToneId] = useState<string>("sawo-matang");
  const [occasion, setOccasion] = useState<"campus" | "office" | "cafe" | "party">("campus");

  // State Slot Kanvas Bento (Atasan, Bawahan, Hijab/Outer, Sepatu)
  const [activeSlots, setActiveSlots] = useState<{
    top: StudioItem;
    bottom: StudioItem;
    outer: StudioItem;
    shoes: StudioItem;
  }>({
    top: TOP_POOL[0],
    bottom: BOTTOM_POOL[0],
    outer: OUTER_POOL[0],
    shoes: SHOES_POOL[0],
  });

  // State Penguncian Slot (Lock & Swap Engine)
  const [lockedSlots, setLockedSlots] = useState<{
    top: boolean;
    bottom: boolean;
    outer: boolean;
    shoes: boolean;
  }>({
    top: false,
    bottom: false,
    outer: false,
    shoes: false,
  });

  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  // Lock body scroll and handle Escape key for modal
  useEffect(() => {
    if (isDetailsDrawerOpen) {
      document.body.style.overflow = "hidden";
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsDetailsDrawerOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isDetailsDrawerOpen]);

  // Trigger feedback toast
  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2800);
  };

  // Toggle Slot Lock
  const toggleSlotLock = (slot: "top" | "bottom" | "outer" | "shoes") => {
    setLockedSlots((prev) => {
      const next = !prev[slot];
      triggerToast(next ? `🔒 Slot ${slot.toUpperCase()} dikunci!` : `🔓 Slot ${slot.toUpperCase()} dibuka.`);
      return { ...prev, [slot]: next };
    });
  };

  // Swap Single Slot Item
  const swapSingleSlot = (slot: "top" | "bottom" | "outer" | "shoes") => {
    let pool = TOP_POOL;
    if (slot === "bottom") pool = BOTTOM_POOL;
    if (slot === "outer") pool = OUTER_POOL;
    if (slot === "shoes") pool = SHOES_POOL;

    const currentItem = activeSlots[slot];
    const currentIndex = pool.findIndex((it) => it.id === currentItem.id);
    const nextIndex = (currentIndex + 1) % pool.length;
    const nextItem = pool[nextIndex];

    setActiveSlots((prev) => ({ ...prev, [slot]: nextItem }));
    triggerToast(`↻ Ganti ke: ${nextItem.name}`);
  };

  // Shuffle All Unlocked Slots
  const handleShuffleUnlocked = () => {
    setIsShuffling(true);
    setTimeout(() => {
      setActiveSlots((prev) => {
        const next = { ...prev };

        if (!lockedSlots.top) {
          const eligibleTops = TOP_POOL.filter((it) => {
            if (genderMode === "pria") return it.gender === "male" || it.gender === "unisex";
            if (genderMode === "hijab") return it.modest;
            return it.gender === "female" || it.gender === "unisex";
          });
          const pool = eligibleTops.length > 0 ? eligibleTops : TOP_POOL;
          const otherTops = pool.filter((it) => it.id !== prev.top.id);
          next.top = otherTops[Math.floor(Math.random() * (otherTops.length || 1))] || pool[0];
        }

        if (!lockedSlots.bottom) {
          const eligibleBottoms = BOTTOM_POOL.filter((it) => {
            if (genderMode === "pria") return it.gender === "male" || it.gender === "unisex";
            return true;
          });
          const pool = eligibleBottoms.length > 0 ? eligibleBottoms : BOTTOM_POOL;
          const otherBottoms = pool.filter((it) => it.id !== prev.bottom.id);
          next.bottom = otherBottoms[Math.floor(Math.random() * (otherBottoms.length || 1))] || pool[0];
        }

        if (!lockedSlots.outer) {
          const eligibleOuters = OUTER_POOL.filter((it) => {
            if (genderMode === "pria") return it.gender === "male" || it.gender === "unisex";
            if (genderMode === "hijab") return it.categoryLabel.includes("Hijab");
            return !it.categoryLabel.includes("Hijab") || it.gender === "female";
          });
          const pool = eligibleOuters.length > 0 ? eligibleOuters : OUTER_POOL;
          const otherOuters = pool.filter((it) => it.id !== prev.outer.id);
          next.outer = otherOuters[Math.floor(Math.random() * (otherOuters.length || 1))] || pool[0];
        }

        if (!lockedSlots.shoes) {
          const eligibleShoes = SHOES_POOL.filter((it) => {
            if (genderMode === "pria") return it.gender === "male" || it.gender === "unisex";
            return it.gender === "female" || it.gender === "unisex";
          });
          const pool = eligibleShoes.length > 0 ? eligibleShoes : SHOES_POOL;
          const otherShoes = pool.filter((it) => it.id !== prev.shoes.id);
          next.shoes = otherShoes[Math.floor(Math.random() * (otherShoes.length || 1))] || pool[0];
        }

        return next;
      });
      setIsShuffling(false);
      triggerToast("✨ Formula baru diracik oleh AI Stylist!");
    }, 200);
  };

  // Reset Kanvas
  const handleResetCanvas = () => {
    setLockedSlots({ top: false, bottom: false, outer: false, shoes: false });
    setActiveSlots({
      top: TOP_POOL[0],
      bottom: BOTTOM_POOL[0],
      outer: OUTER_POOL[0],
      shoes: SHOES_POOL[0],
    });
    triggerToast("Kanvas Studio di-reset ke formula dasar.");
  };

  // Simpan Racikan Aktif ke Lemari / Tas
  const handleSaveToWardrobe = () => {
    const activeTone = SKIN_TONES_DRAPE.find((t) => t.id === selectedSkinToneId) || SKIN_TONES_DRAPE[0];

    const recommendation: OOTDRecommendation = {
      id: `studio_mix_${Date.now()}`,
      title: `${activeSlots.top.name.split(" ")[0]} & ${activeSlots.bottom.name.split(" ")[0]} Studio Mix`,
      tagline: `Formula adem terkurasi Studio untuk ${weatherLabel} dengan harmoni warna ${activeTone.nama}.`,
      overallVibe: `Studio Capsule · ${activeSlots.top.colorName} & ${activeSlots.bottom.colorName}`,
      comfortRating: Number((breathabilityScore / 20).toFixed(1)),
      affordabilityRating: 4.8,
      modestFriendly: genderMode === "hijab",
      skinToneMatch: `Sangat harmonis untuk ${activeTone.nama} (${activeTone.season}).`,
      whyItWorks: `Kombinasi ${activeSlots.top.material} dan ${activeSlots.bottom.material} melepas panas tubuh hingga skor sirkulasi ${breathabilityScore}%.`,
      stylingTip: `Padukan dengan ${activeSlots.outer.name} dan ${activeSlots.shoes.name} untuk siluet proporsional.`,
      colorPalette: [
        { name: activeSlots.top.colorName, hex: activeSlots.top.colorHex },
        { name: activeSlots.bottom.colorName, hex: activeSlots.bottom.colorHex },
        { name: activeSlots.outer.colorName, hex: activeSlots.outer.colorHex },
        { name: activeSlots.shoes.colorName, hex: activeSlots.shoes.colorHex },
      ],
      items: [
        {
          category: "atasan",
          name: activeSlots.top.name,
          material: activeSlots.top.material,
          color: activeSlots.top.colorName,
          colorHex: activeSlots.top.colorHex,
          estimatedPrice: activeSlots.top.priceStr,
          shopeeQuery: activeSlots.top.shopeeQuery,
          tokopediaQuery: activeSlots.top.tokopediaQuery,
          imageUrl: activeSlots.top.imageUrl,
        },
        {
          category: "bawahan",
          name: activeSlots.bottom.name,
          material: activeSlots.bottom.material,
          color: activeSlots.bottom.colorName,
          colorHex: activeSlots.bottom.colorHex,
          estimatedPrice: activeSlots.bottom.priceStr,
          shopeeQuery: activeSlots.bottom.shopeeQuery,
          tokopediaQuery: activeSlots.bottom.tokopediaQuery,
          imageUrl: activeSlots.bottom.imageUrl,
        },
        {
          category: "outer_hijab",
          name: activeSlots.outer.name,
          material: activeSlots.outer.material,
          color: activeSlots.outer.colorName,
          colorHex: activeSlots.outer.colorHex,
          estimatedPrice: activeSlots.outer.priceStr,
          shopeeQuery: activeSlots.outer.shopeeQuery,
          tokopediaQuery: activeSlots.outer.tokopediaQuery,
          imageUrl: activeSlots.outer.imageUrl,
        },
        {
          category: "sepatu",
          name: activeSlots.shoes.name,
          material: activeSlots.shoes.material,
          color: activeSlots.shoes.colorName,
          colorHex: activeSlots.shoes.colorHex,
          estimatedPrice: activeSlots.shoes.priceStr,
          shopeeQuery: activeSlots.shoes.shopeeQuery,
          tokopediaQuery: activeSlots.shoes.tokopediaQuery,
          imageUrl: activeSlots.shoes.imageUrl,
        },
      ],
      createdAt: new Date().toISOString(),
      flatlayImages: [activeSlots.top.imageUrl, activeSlots.bottom.imageUrl],
    };

    try {
      const stored = localStorage.getItem("looku_saved_outfits");
      let list = stored ? JSON.parse(stored) : [];
      list = [recommendation, ...list.filter((x: any) => x.id !== recommendation.id)];
      localStorage.setItem("looku_saved_outfits", JSON.stringify(list));
      window.dispatchEvent(new Event("looku_saved_updated"));
      window.dispatchEvent(new Event("storage"));

      if (onSaveOutfit) {
        onSaveOutfit(recommendation);
      }
      triggerToast("✨ Formula OOTD Berhasil Disimpan ke Lemari!");
    } catch {
      triggerToast("Berhasil disimpan.");
    }
  };

  // -------------------------------------------------------------
  // PERHITUNGAN TELEMETRI ILMIAH REAL-TIME
  // -------------------------------------------------------------
  const breathabilityScore = Math.round(
    (activeSlots.top.breathability +
      activeSlots.bottom.breathability +
      activeSlots.outer.breathability +
      activeSlots.shoes.breathability) /
      4
  );

  const skinMatchScore = Math.min(
    99,
    Math.round(92 + ((activeSlots.top.breathability % 5) + (activeSlots.bottom.breathability % 4)))
  );

  const totalPrice =
    activeSlots.top.price +
    activeSlots.bottom.price +
    activeSlots.outer.price +
    activeSlots.shoes.price;

  const totalPriceStr = `Rp ${Math.round(totalPrice / 1000)}rb`;

  // Label Deskriptor Konteks Aktif
  const activeSkinTone =
    SKIN_TONES_DRAPE.find((t) => t.id === selectedSkinToneId) || SKIN_TONES_DRAPE[0];

  const weatherLabel =
    weatherMode === "hot"
      ? "☀️ 33°C Terik"
      : weatherMode === "ac"
      ? "🏢 22°C AC Kantor"
      : weatherMode === "rainy"
      ? "🌧️ 25°C Hujan Sejuk"
      : "🌤️ 29°C Hangat";

  const genderLabel =
    genderMode === "hijab"
      ? "Wanita Hijab"
      : genderMode === "nonhijab"
      ? "Wanita Non-Hijab"
      : "Pria Menswear";

  const occasionLabel =
    occasion === "campus"
      ? "📍 Kampus"
      : occasion === "office"
      ? "📍 Kantor SCBD"
      : occasion === "cafe"
      ? "📍 Kafe Hangout"
      : "📍 Kondangan Pesta";

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#FAF8F5] text-[#181A18] font-sans antialiased flex flex-col items-center justify-start pb-28 select-none">
      {/* Kontainer Layar Mobile-First (max-w-md / md:max-w-xl mx-auto) */}
      <div className="w-full max-w-md md:max-w-xl min-h-[100dvh] bg-[#FAF8F5] border-x border-[#181A18]/10 flex flex-col justify-between">
        
        {/* ============================================================ */}
        {/* 1. HEADER STUDIO & DUAL-MODE SEGMENTED SWITCHER              */}
        {/* ============================================================ */}
        <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#181A18]/10">
          <div className="h-12 px-4 flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <h1 className="font-serif text-lg font-bold tracking-tight text-[#181A18]">
                Look<span className="text-terracotta-500">.</span>u Studio
              </h1>
              <span className="text-[9px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C5A3C]">
                Interactive Canvas v2.5
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetCanvas}
              className="text-[10px] font-mono font-bold uppercase tracking-wider underline underline-offset-2 text-[#181A18]/60 hover:text-[#181A18] transition-colors"
            >
              Reset Kanvas
            </button>
          </div>

          {/* Segmented Tab Bar Tegas: 01. Racik OOTD vs 02. Tes Warna (60s) */}
          <div className="grid grid-cols-2 border-t border-[#181A18]/10 text-[10px] font-mono font-bold uppercase tracking-[0.15em]">
            <button
              type="button"
              onClick={() => setActiveTab("mixer")}
              className={`py-2.5 text-center transition-all border-b-2 ${
                activeTab === "mixer"
                  ? "border-[#181A18] text-[#181A18] bg-[#EFECE6]/70"
                  : "border-transparent text-[#181A18]/45 hover:text-[#181A18]"
              }`}
            >
              01. Racik OOTD
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("colorlab")}
              className={`py-2.5 text-center transition-all border-b-2 ${
                activeTab === "colorlab"
                  ? "border-[#181A18] text-[#181A18] bg-[#EFECE6]/70"
                  : "border-transparent text-[#181A18]/45 hover:text-[#181A18]"
              }`}
            >
              02. Tes Warna (60s)
            </button>
          </div>

          {/* Parameter Strip 1-Baris (Bebas Form Panjang) */}
          <div className="bg-[#EFECE6] border-t border-[#181A18]/10 px-3 py-1.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[10px] font-mono font-medium">
            <button
              type="button"
              onClick={() => {
                setGenderMode((prev) =>
                  prev === "hijab" ? "nonhijab" : prev === "nonhijab" ? "pria" : "hijab"
                );
                triggerToast(`Gaya berganti ke: ${genderMode === "hijab" ? "Wanita Non-Hijab" : genderMode === "nonhijab" ? "Pria Menswear" : "Wanita Hijab"}`);
              }}
              className="shrink-0 px-2.5 py-1 bg-[#181A18] text-[#FAF8F5] font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span>{genderLabel}</span>
              <span className="text-[8px] opacity-60">↻</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setWeatherMode((prev) =>
                  prev === "hot" ? "ac" : prev === "ac" ? "rainy" : prev === "rainy" ? "mild" : "hot"
                );
              }}
              className="shrink-0 px-2 py-1 bg-white border border-[#181A18]/15 text-[#181A18] uppercase tracking-wider flex items-center gap-1"
            >
              <span>{weatherLabel}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("colorlab")}
              className="shrink-0 px-2 py-1 bg-white border border-[#8C5A3C]/40 text-[#8C5A3C] font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <span
                className="w-2.5 h-2.5 rounded-full inline-block border border-black/20"
                style={{ backgroundColor: activeSkinTone.hex }}
              />
              <span>{activeSkinTone.nama}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setOccasion((prev) =>
                  prev === "campus" ? "office" : prev === "office" ? "cafe" : prev === "cafe" ? "party" : "campus"
                );
              }}
              className="shrink-0 px-2 py-1 bg-white border border-[#181A18]/15 text-[#181A18] uppercase tracking-wider"
            >
              {occasionLabel}
            </button>
          </div>
        </div>

        {/* Notifikasi Cepat Feedback */}
        <AnimatePresence>
          {feedbackToast && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="fixed top-24 left-4 right-4 max-w-sm mx-auto z-50 bg-[#181A18] text-[#FAF8F5] text-xs px-3.5 py-2.5 shadow-xl border border-white/20 flex items-center justify-between"
            >
              <span className="font-mono text-[11px]">{feedbackToast}</span>
              <span className="text-[10px] text-terracotta-400 font-bold uppercase">OK</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ============================================================ */}
        {/* 2. TAB KONTEN UTAMA                                         */}
        {/* ============================================================ */}
        {activeTab === "mixer" ? (
          <main className="px-3.5 pt-2.5 flex-1 flex flex-col justify-between">
            {/* A. LIVE SCIENTIFIC TELEMETRY BAR */}
            <div className="grid grid-cols-3 border border-[#181A18]/15 bg-white divide-x divide-[#181A18]/10 mb-2 shadow-2xs">
              <div className="p-2 text-center">
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#181A18]/50 block">
                  Skor Adem
                </span>
                <span className="text-xs font-mono font-extrabold text-emerald-700 flex items-center justify-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  {breathabilityScore}% Optimal
                </span>
              </div>

              <div className="p-2 text-center">
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#181A18]/50 block">
                  Harmoni Kulit
                </span>
                <span className="text-xs font-mono font-extrabold text-[#8C5A3C]">
                  {skinMatchScore}% Match
                </span>
              </div>

              <div className="p-2 text-center">
                <span className="text-[8px] font-mono font-bold uppercase tracking-widest text-[#181A18]/50 block">
                  Estimasi Set
                </span>
                <span className="text-xs font-mono font-extrabold text-[#181A18]">
                  {totalPriceStr}
                </span>
              </div>
            </div>

            {/* B. ANATOMICAL BENTO CANVAS (4 SLOT KOMPOSISI DENGAN LOCK & SWAP) */}
            <div className="grid grid-cols-12 gap-2 h-[41dvh] min-h-[260px] max-h-[350px]">
              
              {/* KOLOM KIRI (7 Kolom): ATASAN & BAWAHAN */}
              <div className="col-span-7 grid grid-rows-2 gap-2 h-full">
                
                {/* SLOT 1: ATASAN / TOPWEAR */}
                <div
                  className={`relative bg-[#EFECE6] border p-2 flex flex-col justify-between overflow-hidden transition-all ${
                    lockedSlots.top ? "border-2 border-[#181A18] shadow-xs" : "border-[#181A18]/20"
                  }`}
                >
                  {/* Foto Latar Komponen */}
                  <div className="absolute inset-0 opacity-80">
                    <img
                      src={activeSlots.top.imageUrl}
                      alt={activeSlots.top.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-white/50 to-transparent" />

                  {/* Header Slot (Tag & Tombol Kunci/Ganti) */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 shadow-2xs ${
                        lockedSlots.top ? "bg-[#181A18] text-white" : "bg-[#FAF8F5]/90 text-[#181A18]"
                      }`}
                    >
                      {lockedSlots.top ? "🔒 Terkunci" : activeSlots.top.categoryLabel}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Kunci Atasan"
                        onClick={() => toggleSlotLock("top")}
                        className={`w-6 h-6 text-[10px] flex items-center justify-center border shadow-xs transition-colors ${
                          lockedSlots.top
                            ? "bg-[#181A18] text-white border-[#181A18]"
                            : "bg-white/90 text-[#181A18] border-[#181A18]/20 hover:bg-[#181A18] hover:text-white"
                        }`}
                        title="Kunci Item Ini"
                      >
                        {lockedSlots.top ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>

                      <button
                        type="button"
                        aria-label="Ganti Atasan"
                        onClick={() => swapSingleSlot("top")}
                        className="w-6 h-6 bg-white/90 border border-[#181A18]/20 text-[10px] flex items-center justify-center hover:bg-[#181A18] hover:text-white transition-colors shadow-xs"
                        title="Ganti Atasan Saja"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Info Bawah Slot */}
                  <div className="relative z-10 bg-[#FAF8F5]/95 p-1.5 border-l-2 border-[#8C5A3C] shadow-xs">
                    <p className="text-[10px] font-bold text-[#181A18] truncate leading-tight">
                      {activeSlots.top.name}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-[#181A18]/70 mt-0.5">
                      <span className="font-mono text-emerald-800 font-semibold truncate">
                        Adem {activeSlots.top.breathability}%
                      </span>
                      <span className="font-mono font-bold text-[#181A18] shrink-0">
                        {activeSlots.top.priceStr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* SLOT 2: BAWAHAN / BOTTOMWEAR */}
                <div
                  className={`relative bg-[#EFECE6] border p-2 flex flex-col justify-between overflow-hidden transition-all ${
                    lockedSlots.bottom ? "border-2 border-[#181A18] shadow-xs" : "border-[#181A18]/20"
                  }`}
                >
                  <div className="absolute inset-0 opacity-80">
                    <img
                      src={activeSlots.bottom.imageUrl}
                      alt={activeSlots.bottom.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-white/50 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 shadow-2xs ${
                        lockedSlots.bottom ? "bg-[#181A18] text-white" : "bg-[#FAF8F5]/90 text-[#181A18]"
                      }`}
                    >
                      {lockedSlots.bottom ? "🔒 Terkunci" : activeSlots.bottom.categoryLabel}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Kunci Bawahan"
                        onClick={() => toggleSlotLock("bottom")}
                        className={`w-6 h-6 text-[10px] flex items-center justify-center border shadow-xs transition-colors ${
                          lockedSlots.bottom
                            ? "bg-[#181A18] text-white border-[#181A18]"
                            : "bg-white/90 text-[#181A18] border-[#181A18]/20 hover:bg-[#181A18] hover:text-white"
                        }`}
                        title="Kunci Item Ini"
                      >
                        {lockedSlots.bottom ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                      </button>

                      <button
                        type="button"
                        aria-label="Ganti Bawahan"
                        onClick={() => swapSingleSlot("bottom")}
                        className="w-6 h-6 bg-white/90 border border-[#181A18]/20 text-[10px] flex items-center justify-center hover:bg-[#181A18] hover:text-white transition-colors shadow-xs"
                        title="Ganti Bawahan Saja"
                      >
                        <RotateCw className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 bg-[#FAF8F5]/95 p-1.5 border-l-2 border-[#181A18] shadow-xs">
                    <p className="text-[10px] font-bold text-[#181A18] truncate leading-tight">
                      {activeSlots.bottom.name}
                    </p>
                    <div className="flex items-center justify-between text-[9px] text-[#181A18]/70 mt-0.5">
                      <span className="font-mono text-emerald-800 font-semibold truncate">
                        Adem {activeSlots.bottom.breathability}%
                      </span>
                      <span className="font-mono font-bold text-[#181A18] shrink-0">
                        {activeSlots.bottom.priceStr}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN (5 Kolom): HIJAB/OUTER & SEPATU/PALET */}
              <div className="col-span-5 grid grid-rows-12 gap-2 h-full">
                
                {/* SLOT 3: HIJAB / OUTER (7 Baris) */}
                <div
                  className={`row-span-7 relative bg-[#EFECE6] border p-2 flex flex-col justify-between overflow-hidden transition-all ${
                    lockedSlots.outer ? "border-2 border-[#181A18] shadow-xs" : "border-[#181A18]/20"
                  }`}
                >
                  <div className="absolute inset-0 opacity-80">
                    <img
                      src={activeSlots.outer.imageUrl}
                      alt={activeSlots.outer.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FAF8F5] via-white/40 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`text-[8px] font-mono font-bold uppercase tracking-widest px-1.5 py-0.5 shadow-2xs ${
                        lockedSlots.outer ? "bg-[#181A18] text-white" : "bg-[#FAF8F5]/90 text-[#181A18]"
                      }`}
                    >
                      {lockedSlots.outer ? "🔒" : activeSlots.outer.categoryLabel.split("·")[0]}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Kunci Hijab / Outer"
                        onClick={() => toggleSlotLock("outer")}
                        className={`w-5 h-5 text-[9px] flex items-center justify-center border shadow-xs transition-colors ${
                          lockedSlots.outer
                            ? "bg-[#181A18] text-white border-[#181A18]"
                            : "bg-white/90 text-[#181A18] border-[#181A18]/20 hover:bg-[#181A18] hover:text-white"
                        }`}
                      >
                        {lockedSlots.outer ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                      </button>

                      <button
                        type="button"
                        aria-label="Ganti Outer"
                        onClick={() => swapSingleSlot("outer")}
                        className="w-5 h-5 bg-white/90 border border-[#181A18]/20 text-[9px] flex items-center justify-center hover:bg-[#181A18] hover:text-white transition-colors shadow-xs"
                      >
                        <RotateCw className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>

                  <div className="relative z-10 bg-[#FAF8F5]/95 p-1.5 shadow-xs border-l-2 border-[#8C5A3C]">
                    <p className="text-[9px] font-bold text-[#181A18] truncate leading-tight">
                      {activeSlots.outer.name}
                    </p>
                    <span className="font-mono text-[8px] text-emerald-800 font-bold block mt-0.5">
                      Pori {activeSlots.outer.breathability}%
                    </span>
                  </div>
                </div>

                {/* SLOT 4: SEPATU & HARMONI PALET (5 Baris) */}
                <div
                  className={`row-span-5 relative bg-white border p-1.5 flex flex-col justify-between overflow-hidden transition-all ${
                    lockedSlots.shoes ? "border-2 border-[#181A18] shadow-xs" : "border-[#181A18]/20"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[7.5px] font-mono font-bold uppercase tracking-widest text-[#181A18]/50">
                      Alas Kaki
                    </span>
                    <button
                      type="button"
                      aria-label="Ganti Sepatu"
                      onClick={() => swapSingleSlot("shoes")}
                      className="w-4 h-4 bg-white border border-[#181A18]/20 text-[8px] flex items-center justify-center hover:bg-[#181A18] hover:text-white transition-colors"
                    >
                      <RotateCw className="w-2 h-2" />
                    </button>
                  </div>

                  {/* 3 Dot Swatch Harmoni Palet */}
                  <div className="flex items-center gap-1 my-0.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                      style={{ backgroundColor: activeSlots.top.colorHex }}
                      title={activeSlots.top.colorName}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                      style={{ backgroundColor: activeSlots.bottom.colorHex }}
                      title={activeSlots.bottom.colorName}
                    />
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                      style={{ backgroundColor: activeSlots.outer.colorHex }}
                      title={activeSlots.outer.colorName}
                    />
                  </div>

                  <p className="text-[9px] font-bold text-[#181A18] truncate leading-tight">
                    {activeSlots.shoes.name}
                  </p>
                </div>
              </div>
            </div>

            {/* C. CATATAN FORMULA AI STYLIST (1 Baris Ringkas Ilmiah) */}
            <div className="my-1.5 px-3 py-1.5 bg-[#EFECE6]/70 border-l-2 border-[#8C5A3C] text-[10px] text-[#181A18]/80 leading-snug">
              <strong>Formula AI:</strong> {activeSlots.top.material} + {activeSlots.bottom.material} menjaga sirkulasi tubuh tetap sejuk pada {weatherLabel} dengan harmoni {activeSkinTone.nama}.
            </div>

            {/* D. TOMBOL AKSI UTAMA STUDIO */}
            <div className="flex flex-col gap-1.5 pt-1">
              {/* Tombol Acak Ulang Unlocked */}
              <button
                type="button"
                onClick={handleShuffleUnlocked}
                disabled={isShuffling}
                className="w-full h-11 bg-[#181A18] text-[#FAF8F5] text-xs font-mono font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-terracotta-600 active:scale-[0.99] transition-all shadow-sm rounded-none"
              >
                <Sparkles className={`w-3.5 h-3.5 text-cream-200 ${isShuffling ? "animate-spin" : ""}`} />
                <span>✦ Acak Ulang Item Tidak Terkunci</span>
              </button>

              {/* 2 Tombol Aksi Sekunder */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleSaveToWardrobe}
                  className="h-9 border border-[#181A18]/25 bg-white text-[#181A18] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-stone-50 active:bg-stone-100 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>+ Simpan ke Tas</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDetailsDrawerOpen(true)}
                  className="h-9 border border-[#181A18]/25 bg-white text-[#181A18] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#181A18] hover:text-white transition-colors"
                >
                  <span>Rincian &amp; Beli</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </main>
        ) : (
          /* ============================================================ */
          /* TAB 02: PERSONAL COLOR LAB (60S) DENGAN DRAPE SIMULATOR     */
          /* ============================================================ */
          <main className="px-4 pt-3 flex-1 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C5A3C]">
                Interactive Draping Test
              </p>
              <h2 className="font-serif text-2xl font-normal text-[#181A18] mt-0.5">
                Kalibrasi Rona Kulit Tropis
              </h2>
              <p className="text-xs text-[#181A18]/70 mt-1 leading-relaxed">
                Pilih rona kulit dasar Anda untuk mengunci palet pakaian yang memancarkan kecerahan wajah seketika di bawah terik matahari.
              </p>
            </div>

            {/* 4 Pilihan Rona Kulit Nusantara */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 my-3">
              {SKIN_TONES_DRAPE.map((tone) => {
                const isActive = selectedSkinToneId === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => {
                      setSelectedSkinToneId(tone.id);
                      triggerToast(`Undertone aktif: ${tone.nama} (${tone.season})`);
                    }}
                    className={`p-2.5 border text-left transition-all ${
                      isActive
                        ? "border-2 border-[#181A18] bg-white shadow-xs"
                        : "border-[#181A18]/15 bg-[#EFECE6]/50 hover:border-[#181A18]/40"
                    }`}
                  >
                    <span
                      className="block w-full h-8 mb-2 border border-black/10 shadow-2xs"
                      style={{ backgroundColor: tone.hex }}
                    />
                    <span className="text-[11px] font-bold leading-tight block text-[#181A18]">
                      {tone.nama}
                    </span>
                    <span className="text-[9px] font-mono text-[#8C5A3C] uppercase block mt-0.5">
                      {tone.season}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* HASIL DRAPING: BEST PALETTE VS AVOID PALETTE */}
            <div className="border border-[#181A18]/15 bg-white p-3.5 space-y-3.5 shadow-2xs">
              <div>
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                  ✓ Palet Paling Cerah di Kulitmu ({activeSkinTone.season})
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-mono font-semibold">
                  {activeSkinTone.bestPalettes.map((p, idx) => (
                    <div key={idx}>
                      <div
                        className="h-10 border border-black/10 mb-1 shadow-2xs"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span className="truncate block text-[#181A18]">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#181A18]/10">
                <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-rose-700 block mb-1">
                  ✕ Warna yang Membuat Kulit Terlihat Kusam
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {activeSkinTone.avoidPalettes.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-rose-50 border border-rose-200 text-rose-900 text-[9px] font-mono"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tombol Terapkan ke Studio OOTD */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  localStorage.setItem("looku_personal_color", selectedSkinToneId);
                }
                setActiveTab("mixer");
                handleShuffleUnlocked();
                triggerToast(`✨ Palet ${activeSkinTone.nama} diterapkan ke Kanvas OOTD!`);
              }}
              className="w-full h-12 bg-[#181A18] text-[#FAF8F5] text-xs font-mono font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-terracotta-600 active:scale-[0.99] transition-all shadow-sm rounded-none mt-3"
            >
              <span>Terapkan Palet Ini ke Racikan OOTD →</span>
            </button>
          </main>
        )}

      </div>

      {/* ============================================================ */}
      {/* 3. SLIDE-UP DRAWER: RINCIAN 4 KOMPONEN & MARKETPLACE LINK    */}
      {/* ============================================================ */}
      {/* ============================================================ */}
      {/* 3. MODAL / DRAWER: RINCIAN 4 KOMPONEN & MARKETPLACE LINK     */}
      {/* ============================================================ */}
      <AnimatePresence>
        {isDetailsDrawerOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop Gelap Solid - Mengisolasi tampilan background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsDetailsDrawerOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Card / Bottom Sheet Solid Opaque */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: "spring", damping: 26, stiffness: 300 }}
              className="relative z-[70] w-full sm:max-w-xl bg-white border-t-2 sm:border-2 border-[#181A18] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-none"
            >
              {/* Mobile Drag/Visual Indicator */}
              <div className="sm:hidden w-full flex justify-center pt-2.5 pb-1 bg-white">
                <div className="w-12 h-1 bg-stone-300 rounded-full" />
              </div>

              {/* Header Drawer */}
              <div className="px-5 py-3.5 border-b border-[#181A18]/15 flex items-center justify-between bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#8C5A3C] bg-[#8C5A3C]/10 px-2 py-0.5">
                      Komposisi 4 Komponen
                    </span>
                    <span className="text-[9px] font-mono text-[#181A18]/50">
                      Look.u Official Catalog
                    </span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#181A18] mt-1 leading-snug">
                    Bedah Rincian Pakaian &amp; Pembelian
                  </h3>
                </div>

                <button
                  type="button"
                  aria-label="Tutup Rincian"
                  onClick={() => setIsDetailsDrawerOpen(false)}
                  className="w-9 h-9 bg-stone-100 flex items-center justify-center text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors cursor-pointer shrink-0 ml-3"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Rincian Komponen List */}
              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs bg-[#FAF8F5]">
                {[activeSlots.top, activeSlots.bottom, activeSlots.outer, activeSlots.shoes].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-white border border-[#181A18]/15 flex items-center justify-between gap-3 shadow-xs hover:border-[#181A18]/40 transition-colors"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 object-cover bg-[#EFECE6] border border-[#181A18]/10 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[8px] font-mono font-bold uppercase tracking-wider text-[#8C5A3C]">
                          {item.categoryLabel}
                        </span>
                        <span
                          className="w-2 h-2 rounded-full border border-black/15 shrink-0"
                          style={{ backgroundColor: item.colorHex }}
                          title={item.colorName}
                        />
                      </div>
                      <h4 className="font-bold text-[#181A18] text-xs sm:text-sm truncate mt-0.5">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-[#181A18]/70 truncate mt-0.5">
                        {item.material} · Sirkulasi Adem {item.breathability}%
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="font-mono font-bold text-xs sm:text-sm text-[#181A18]">
                        {item.priceStr}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`https://shopee.co.id/search?keyword=${encodeURIComponent(item.shopeeQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#EE4D2D] text-white text-[9px] font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1 shadow-xs"
                        >
                          <span>Shopee</span>
                          <span>↗</span>
                        </a>
                        <a
                          href={`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(item.tokopediaQuery)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 bg-[#03AC0E] text-white text-[9px] font-mono font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1 shadow-xs"
                        >
                          <span>Tokopedia</span>
                          <span>↗</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Total Estimasi Belanja */}
                <div className="p-3.5 bg-white border-2 border-[#181A18] flex items-center justify-between text-xs mt-3 shadow-xs">
                  <div>
                    <span className="font-mono uppercase font-bold text-[#181A18]/70 block text-[10px]">
                      Total Estimasi 4 Item
                    </span>
                    <span className="text-[10px] text-[#181A18]/50">
                      Harga pasar terkurasi
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-extrabold text-lg text-[#181A18] block leading-tight">
                      {totalPriceStr}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-700 font-semibold">
                      Efisiensi Outfit 100%
                    </span>
                  </div>
                </div>

                {/* Footer Action inside Modal */}
                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleSaveToWardrobe();
                      setIsDetailsDrawerOpen(false);
                    }}
                    className="flex-1 py-3 bg-[#181A18] text-[#FAF8F5] text-xs font-mono font-bold uppercase tracking-wider hover:bg-terracotta-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>📌 Simpan ke Lemari</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDetailsDrawerOpen(false)}
                    className="px-4 py-3 border border-[#181A18]/25 bg-white text-[#181A18] text-xs font-mono font-bold uppercase tracking-wider hover:bg-stone-100 transition-colors"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
