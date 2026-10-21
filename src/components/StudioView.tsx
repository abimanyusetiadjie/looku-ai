"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Lock,
  Unlock,
  RotateCw,
  ExternalLink,
  X,
  Bookmark,
  ShoppingBag,
  Store,
  SlidersHorizontal,
  ChevronRight,
  Check,
  Eye,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OOTDRecommendation, OutfitItem } from "@/lib/types";
import { PRESET_OOTD_COLLECTION, resolveLookForStudio } from "@/lib/presets";
import {
  resolveSmartItemVisual,
  resolveCleanShoePackshot,
  CLEAN_PACKSHOT_DICTIONARY,
} from "@/lib/packshot-dictionary";

export interface StudioItem {
  id: string;
  category: "top" | "bottom" | "outer" | "shoes";
  categoryLabel: string;
  categoryOrder: number;
  pinNumber: number;
  brand: string;
  dupeBrand: string;
  officialUrl: string;
  officialPriceStr: string;
  name: string;
  material: string;
  breathability: number;
  colorName: string;
  colorHex: string;
  price: number;
  priceStr: string; // Dupe price estimate
  imageUrl: string;
  cropConfig?: {
    isCrop: boolean;
    position: string;
    scale: string;
    heroUrl: string;
  };
  shopeeQuery: string;
  tokopediaQuery: string;
  note: string;
  gender: "female" | "male" | "unisex";
  modest: boolean;
  isHijab?: boolean;
  suitableWeather: ("hot" | "ac" | "rainy" | "mild")[];
}

export interface SkenaVibePreset {
  id: string;
  label: string;
  shortLabel: string;
  badge: string;
  gender: "hijab" | "nonhijab" | "pria";
  weather: "hot" | "ac" | "rainy" | "mild";
  occasion: "campus" | "office" | "cafe" | "party";
  modelSpec: {
    height: string;
    size: string;
    silhouette: string;
    keyFabric: string;
  };
  heroImage: string;
  altImages: string[];
  tagline: string;
  topId: string;
  bottomId: string;
  outerId: string;
  shoesId: string;
  pinCoords: {
    outer: { top: string; left: string };
    top: { top: string; left: string };
    bottom: { top: string; left: string };
    shoes: { top: string; left: string };
  };
}

// -------------------------------------------------------------
// POOL KOMPONEN BRAND RESMI & SKENA
// Menggunakan Packshot Satuan Bersih (Bebas Duplikasi Foto Model Hero)
// -------------------------------------------------------------
const TOP_POOL: StudioItem[] = [
  {
    id: "top_cottonink_rayon_mocca",
    category: "top",
    categoryLabel: "Tops · Blouse",
    categoryOrder: 2,
    pinNumber: 2,
    brand: "COTTONINK",
    dupeBrand: "Shopatvelvet",
    officialUrl: "https://www.zalora.co.id/search?q=Cottonink+Rayon+Blouse",
    officialPriceStr: "Rp 279.000",
    name: "Blus Rayon Flowy Dropped Shoulder",
    material: "100% Rayon Twill",
    breathability: 98,
    colorName: "Mocca Oat",
    colorHex: "#C4A482",
    price: 95000,
    priceStr: "Rp 95.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.top.rayon_blouse,
    shopeeQuery: "Shopatvelvet Blouse Rayon Twill Oversize Wanita Adem",
    tokopediaQuery: "Tunik Rayon Wanita Adem Flowy Shopatvelvet",
    note: "Sirkulasi udara optimal pada suhu 33°C, jatuh lembut & anti-lecek",
    gender: "female",
    modest: true,
    suitableWeather: ["hot", "mild"],
  },
  {
    id: "top_uniqlo_linen_relaxed",
    category: "top",
    categoryLabel: "Tops · Pure Linen",
    categoryOrder: 2,
    pinNumber: 2,
    brand: "UNIQLO",
    dupeBrand: "Thenblank",
    officialUrl: "https://www.uniqlo.com/id/id/search?q=Kemeja+Premium+Linen+Lengan+Panjang",
    officialPriceStr: "Rp 399.000",
    name: "Kemeja Premium Linen Relaxed Lengan Panjang",
    material: "100% European Flax Linen",
    breathability: 98,
    colorName: "Sage Green",
    colorHex: "#8A9A86",
    price: 115000,
    priceStr: "Rp 115.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.top.linen_sage,
    shopeeQuery: "Thenblank Kemeja Linen Rami Oversize Lengan Panjang Adem",
    tokopediaQuery: "Thenblank Kemeja Linen Panjang Relaxed Fit",
    note: "Serat flax alami melepas hawa panas tubuh seketika di cuaca terik",
    gender: "unisex",
    modest: true,
    suitableWeather: ["hot", "mild"],
  },
  {
    id: "top_uniqlo_airism_boxy",
    category: "top",
    categoryLabel: "Tops · Boxy Tee",
    categoryOrder: 2,
    pinNumber: 2,
    brand: "UNIQLO",
    dupeBrand: "Erigo",
    officialUrl: "https://www.uniqlo.com/id/id/search?q=AIRism+Katun+T-Shirt+Oversize",
    officialPriceStr: "Rp 199.000",
    name: "AIRism Katun T-Shirt Oversize Kerah Bulat",
    material: "AIRism Tech Cotton 24s",
    breathability: 96,
    colorName: "Charcoal Black",
    colorHex: "#181A18",
    price: 89000,
    priceStr: "Rp 89.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.top.boxy_tee_black,
    shopeeQuery: "Erigo Kaos Oversize Boxy Cotton Bamboo 24s Cooltech",
    tokopediaQuery: "Erigo Kaos Polos Oversize Cooltech Katun Adem Pria",
    note: "Siluet Japanese City Boy boxy dengan lapisan dalam sejuk",
    gender: "male",
    modest: false,
    suitableWeather: ["hot", "mild"],
  },
  {
    id: "top_zara_poplin_scbd",
    category: "top",
    categoryLabel: "Tops · Structured Poplin",
    categoryOrder: 2,
    pinNumber: 2,
    brand: "ZARA",
    dupeBrand: "This Is April",
    officialUrl: "https://www.zara.com/id/id/search?searchTerm=Poplin+Shirt",
    officialPriceStr: "Rp 599.000",
    name: "Structured Poplin Shirt Clean Collar",
    material: "Crisp Cotton Poplin",
    breathability: 94,
    colorName: "Broken White",
    colorHex: "#FAF8F5",
    price: 129000,
    priceStr: "Rp 129.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.top.linen_white,
    shopeeQuery: "This Is April Kemeja Katun Poplin Wanita Kerja Kerah Rapi",
    tokopediaQuery: "This Is April Kemeja Putih Kerja Wanita Oversize Poplin",
    note: "Tegas dan rapi seharian untuk mobilitas komuter & ruang AC SCBD",
    gender: "female",
    modest: true,
    suitableWeather: ["ac", "rainy", "mild"],
  },
  {
    id: "top_erigo_vintage_boxy",
    category: "top",
    categoryLabel: "Tops · Cool-Touch Tee",
    categoryOrder: 2,
    pinNumber: 2,
    brand: "ERIGO",
    dupeBrand: "Erigo",
    officialUrl: "https://www.zalora.co.id/search?q=Erigo+Boxy+T-Shirt",
    officialPriceStr: "Rp 150.000",
    name: "Boxy Graphic Vintage Cool-Touch Tee",
    material: "Cotton Combed 24s/30s Cool-Touch",
    breathability: 95,
    colorName: "Washed Faded Grey",
    colorHex: "#4A4E51",
    price: 79000,
    priceStr: "Rp 79.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.top.boxy_tee_grey,
    shopeeQuery: "Erigo Kaos Vintage Washed Cotton Combed 24s Boxy Cut",
    tokopediaQuery: "Erigo Kaos Faded Washed Oversized Blok M Indie",
    note: "Katun Combed 24s/30s Cool-Touch berpori adem untuk skena kasual tropis",
    gender: "unisex",
    modest: false,
    suitableWeather: ["hot", "mild", "rainy"],
  },
  {
    id: "top_thenblank_cropped_blouse",
    category: "top",
    categoryLabel: "Tops · Cropped Linen",
    categoryOrder: 2,
    pinNumber: 2,
    brand: "THENBLANK",
    dupeBrand: "Shopatvelvet",
    officialUrl: "https://www.zalora.co.id/search?q=Thenblank+Linen+Top",
    officialPriceStr: "Rp 249.000",
    name: "Minimalist Square Neck Linen Top",
    material: "Soft Pure Crinkle Linen",
    breathability: 96,
    colorName: "Butter Cream",
    colorHex: "#F3E5AB",
    price: 99000,
    priceStr: "Rp 99.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.top.silk_satin,
    shopeeQuery: "Shopatvelvet Atasan Linen Square Neck Katun",
    tokopediaQuery: "Thenblank Blouse Linen Square Neck Wanita Adem",
    note: "Siluet kontemporer untuk brunch santai di Senopati atau kafe aesthetic",
    gender: "female",
    modest: false,
    suitableWeather: ["hot", "mild", "ac"],
  },
];

const BOTTOM_POOL: StudioItem[] = [
  {
    id: "bot_uniqlo_pleated_wide",
    category: "bottom",
    categoryLabel: "Bottoms · Wide Pants",
    categoryOrder: 3,
    pinNumber: 3,
    brand: "UNIQLO",
    dupeBrand: "Thenblank",
    officialUrl: "https://www.uniqlo.com/id/id/search?q=Celana+Lebar+Lipit+Pleated+Wide+Pants",
    officialPriceStr: "Rp 499.000",
    name: "Celana Lebar Lipit Pleated Wide Pants",
    material: "Rayon Blend 2-Way Stretch",
    breathability: 97,
    colorName: "Warm Sand Taupe",
    colorHex: "#D8C7B5",
    price: 110000,
    priceStr: "Rp 110.000",
    imageUrl: "https://i.pinimg.com/originals/73/2b/97/732b9765f65e63ebf02595822e3524d3.jpg",
    shopeeQuery: "Thenblank Kulot Highwaist Pleated Flowy Wanita Bahan Jatuh",
    tokopediaQuery: "Thenblank Celana Kulot Lipit Wanita Pinggang Karet",
    note: "Draping jatuh sangat anggun, menyamarkan lekuk tubuh & anti-gerah",
    gender: "female",
    modest: true,
    suitableWeather: ["hot", "mild", "ac"],
  },
  {
    id: "bot_uniqlo_geared_shorts",
    category: "bottom",
    categoryLabel: "Bottoms · Geared Cargo",
    categoryOrder: 3,
    pinNumber: 3,
    brand: "UNIQLO",
    dupeBrand: "Erigo",
    officialUrl: "https://www.uniqlo.com/id/id/search?q=Celana+Pendek+Geared",
    officialPriceStr: "Rp 299.000",
    name: "Celana Pendek Geared Ripstop Ringan",
    material: "Water-Repellent Ripstop Nylon",
    breathability: 95,
    colorName: "Olive Military",
    colorHex: "#556B2F",
    price: 85000,
    priceStr: "Rp 85.000",
    imageUrl: "https://i.pinimg.com/originals/fa/77/80/fa7780f2eb19143c746bc5cfbe637dbf.png",
    shopeeQuery: "Erigo Celana Cargo Pendek Ripstop Quickdry Pria",
    tokopediaQuery: "Erigo Celana Geared Pendek Taktikal Ringan",
    note: "Sangat fleksibel untuk mobilitas perkotaan & gowes sore santai",
    gender: "male",
    modest: false,
    suitableWeather: ["hot", "rainy"],
  },
  {
    id: "bot_hm_loose_straight_slacks",
    category: "bottom",
    categoryLabel: "Bottoms · Straight Slacks",
    categoryOrder: 3,
    pinNumber: 3,
    brand: "H&M",
    dupeBrand: "This Is April",
    officialUrl: "https://id.hm.com/id_id/search-results.html?q=tailored+trousers",
    officialPriceStr: "Rp 449.000",
    name: "Loose Fit Tailored Straight Trousers",
    material: "Viscose Twill Breathable Weave",
    breathability: 95,
    colorName: "Dark Slate Grey",
    colorHex: "#2F4F4F",
    price: 125000,
    priceStr: "Rp 125.000",
    imageUrl: "https://i.pinimg.com/originals/e8/37/10/e8371077ea4144fb4a2d8ebf5139aa2c.jpg",
    shopeeQuery: "This Is April Celana Bahan Wanita Semi Formal Highwaist Lurus",
    tokopediaQuery: "This Is April Celana Kantor Wanita Straight Trousers Adem",
    note: "Garis siluet tegas melangsingkan kaki untuk busana profesional kantor",
    gender: "female",
    modest: true,
    suitableWeather: ["ac", "rainy", "mild"],
  },
  {
    id: "bot_cottonink_satin_skirt",
    category: "bottom",
    categoryLabel: "Bottoms · Satin Skirt",
    categoryOrder: 3,
    pinNumber: 3,
    brand: "COTTONINK",
    dupeBrand: "Shopatvelvet",
    officialUrl: "https://www.zalora.co.id/search?q=Cottonink+Satin+Midi+Skirt",
    officialPriceStr: "Rp 329.000",
    name: "Bias Cut Satin Midi Skirt Silky Touch",
    material: "Airflow Matte Silk Rayon",
    breathability: 96,
    colorName: "Champagne Pearl",
    colorHex: "#EAE0D5",
    price: 105000,
    priceStr: "Rp 105.000",
    imageUrl: "https://i.pinimg.com/originals/40/70/7a/40707a334f8badcd3a4e39b4643da309.png",
    shopeeQuery: "Shopatvelvet Rok Satin Midi Silk Wanita Flare A-Line",
    tokopediaQuery: "Shopatvelvet Rok Satin Panjang High Waist Cantik",
    note: "Kilau matte mewah tanpa rasa panas lengket saat dipakai jalan siang",
    gender: "female",
    modest: true,
    suitableWeather: ["hot", "mild", "ac"],
  },
  {
    id: "bot_erigo_vintage_denim",
    category: "bottom",
    categoryLabel: "Bottoms · Chino & Light Denim",
    categoryOrder: 3,
    pinNumber: 3,
    brand: "ERIGO",
    dupeBrand: "Erigo",
    officialUrl: "https://www.zalora.co.id/search?q=Erigo+Loose+Denim+Chino",
    officialPriceStr: "Rp 299.000",
    name: "Relaxed Baggy 90s Breathable Denim",
    material: "10oz Breathable Washed Cotton Denim",
    breathability: 93,
    colorName: "Medium Vintage Indigo",
    colorHex: "#3B5998",
    price: 135000,
    priceStr: "Rp 135.000",
    imageUrl: "https://i.pinimg.com/originals/1e/8a/a5/1e8aa5fa0466487e49f87c95e1e5b1eb.jpg",
    shopeeQuery: "Erigo Celana Jeans Baggy 90s Vintage Pria Wanita Loose",
    tokopediaQuery: "Erigo Celana Jeans Loose Wide Leg Vintage Washed",
    note: "Potongan longgar 90-an yang memberi sirkulasi udara bebas di paha",
    gender: "unisex",
    modest: false,
    suitableWeather: ["mild", "ac", "rainy"],
  },
];

const OUTER_POOL: StudioItem[] = [
  {
    id: "outer_voal_miracle",
    category: "outer",
    categoryLabel: "Hijab · Voal Miracle",
    categoryOrder: 1,
    pinNumber: 1,
    brand: "KAMI.",
    dupeBrand: "Vanilla Hijab",
    officialUrl: "https://www.zalora.co.id/search?q=Kami+Voal+Hijab",
    officialPriceStr: "Rp 185.000",
    name: "Hijab Voal Miracle Ultrafine Laser Cut",
    material: "100% Voal Ultrafine",
    breathability: 98,
    colorName: "Warm Sand",
    colorHex: "#EAE4DC",
    price: 45000,
    priceStr: "Rp 45.000",
    imageUrl: "https://i.pinimg.com/originals/f1/ff/32/f1ff32036ab3216cbb743dffcbadda35.jpg",
    shopeeQuery: "Vanilla Hijab Voal Miracle Laser Cut 115x115 Adem",
    tokopediaQuery: "Vanilla Hijab Segiempat Voal Miracle Lasercut",
    note: "Tegak di dahi, sangat ringan, dan bebas kedap di telinga",
    gender: "female",
    modest: true,
    isHijab: true,
    suitableWeather: ["hot", "mild", "ac", "rainy"],
  },
  {
    id: "outer_pashmina_ceruty",
    category: "outer",
    categoryLabel: "Hijab · Ceruty Silk",
    categoryOrder: 1,
    pinNumber: 1,
    brand: "LAFIYE",
    dupeBrand: "Vanilla Hijab",
    officialUrl: "https://www.zalora.co.id/search?q=Pashmina+Hijab+Modest",
    officialPriceStr: "Rp 129.000",
    name: "Pashmina Ceruty Baby Doll Silk Flowy",
    material: "Ceruty Babydoll Silk",
    breathability: 96,
    colorName: "Sage Muted",
    colorHex: "#8A9A86",
    price: 42000,
    priceStr: "Rp 42.000",
    imageUrl: "https://i.pinimg.com/originals/22/49/32/22493275ad9b0132d65280c7e3049265.png",
    shopeeQuery: "Lafiye Pashmina Ceruty Babydoll Premium Jahit Tepi",
    tokopediaQuery: "Lafiye Pashmina Shawl Ceruty Panjang Adem",
    note: "Draping jatuh anggun untuk gaya kampus & kafe",
    gender: "female",
    modest: true,
    isHijab: true,
    suitableWeather: ["hot", "mild", "ac"],
  },
  {
    id: "outer_lafiye_crinkle_shawl",
    category: "outer",
    categoryLabel: "Hijab · Airy Crinkle",
    categoryOrder: 1,
    pinNumber: 1,
    brand: "VANILLA HIJAB",
    dupeBrand: "Lafiye",
    officialUrl: "https://www.zalora.co.id/search?q=Crinkle+Shawl+Hijab",
    officialPriceStr: "Rp 119.000",
    name: "Pashmina Crinkle Cotton Voile Tanpa Setrika",
    material: "100% Airy Crinkle Cotton Voile",
    breathability: 98,
    colorName: "Oatmeal Latte",
    colorHex: "#D8C7B5",
    price: 39000,
    priceStr: "Rp 39.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.hijab.earth_tone,
    shopeeQuery: "Lafiye Pashmina Crinkle Airflow Cotton Voile Adem",
    tokopediaQuery: "Vanilla Hijab Pashmina Crinkle Cotton Ironless",
    note: "Tekstur crinkle bernapas dengan sirkulasi udara alami untuk 33°C",
    gender: "female",
    modest: true,
    isHijab: true,
    suitableWeather: ["hot", "rainy", "mild"],
  },
  {
    id: "outer_thenblank_linen_blazer",
    category: "outer",
    categoryLabel: "Outerwear · Linen Blazer",
    categoryOrder: 1,
    pinNumber: 1,
    brand: "THENBLANK",
    dupeBrand: "This Is April",
    officialUrl: "https://www.zalora.co.id/search?q=Thenblank+Linen+Blazer",
    officialPriceStr: "Rp 379.000",
    name: "Tailored Semi-Relaxed Unlined Linen Blazer",
    material: "Linen Tencel Unlined",
    breathability: 95,
    colorName: "Espresso Charcoal",
    colorHex: "#2C3539",
    price: 145000,
    priceStr: "Rp 145.000",
    imageUrl: "https://i.pinimg.com/originals/3c/9c/d7/3c9cd7ce6ed7158cc75cbe999b745984.jpg",
    shopeeQuery: "Thenblank Blazer Kerja Semi Formal Linen Unlined Adem",
    tokopediaQuery: "This Is April Deconstructed Blazer Linen Wanita",
    note: "Struktur bahu rapi tanpa furing poliester yang bikin gerah",
    gender: "unisex",
    modest: true,
    isHijab: false,
    suitableWeather: ["ac", "mild", "rainy"],
  },
  {
    id: "outer_uniqlo_uv_parka",
    category: "outer",
    categoryLabel: "Outerwear · UV Protection",
    categoryOrder: 1,
    pinNumber: 1,
    brand: "UNIQLO",
    dupeBrand: "Erigo",
    officialUrl: "https://www.uniqlo.com/id/id/search?q=Jaket+Parka+Saku+Proteksi+Sinar+UV",
    officialPriceStr: "Rp 399.000",
    name: "Jaket Parka Saku Proteksi Sinar UV (Airy Mesh)",
    material: "AIRism UV-Cut Mesh",
    breathability: 96,
    colorName: "Light Stone",
    colorHex: "#EFECE6",
    price: 120000,
    priceStr: "Rp 120.000",
    imageUrl: "https://i.pinimg.com/originals/15/c1/5f/15c15f2bff7e8c9ea2a19922696ab2f6.jpg",
    shopeeQuery: "Erigo Jaket Parasut UV Protection Mesh Ringan",
    tokopediaQuery: "Thenblank Jaket UV Protection Quick Dry Unisex",
    note: "Menangkal terik UV matahari UPF50+ sekaligus mengalirkan angin",
    gender: "unisex",
    modest: false,
    isHijab: false,
    suitableWeather: ["hot", "rainy", "mild"],
  },
];

const SHOES_POOL: StudioItem[] = [
  {
    id: "shoes_hm_retro_court",
    category: "shoes",
    categoryLabel: "Footwear · Sneakers",
    categoryOrder: 4,
    pinNumber: 4,
    brand: "H&M",
    dupeBrand: "Brodo",
    officialUrl: "https://id.hm.com/id_id/search-results.html?q=court+sneakers",
    officialPriceStr: "Rp 499.000",
    name: "Retro Court Chunky Leather Sneakers",
    material: "Vegan Leather & Mesh",
    breathability: 95,
    colorName: "Clean White",
    colorHex: "#FAF8F5",
    price: 155000,
    priceStr: "Rp 155.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.shoes.sneakers.white,
    shopeeQuery: "Brodo Sepatu Retro Court Sneakers Putih Vintage Kasual",
    tokopediaQuery: "Brodo Sneakers Retro Vintage Casual Low Cut Unisex",
    note: "Bantalan empuk untuk mobilitas jalan kaki antar stasiun & kafe",
    gender: "unisex",
    modest: true,
    suitableWeather: ["hot", "ac", "rainy", "mild"],
  },
  {
    id: "shoes_zara_chunky_loafers",
    category: "shoes",
    categoryLabel: "Footwear · Penny Loafers",
    categoryOrder: 4,
    pinNumber: 4,
    brand: "ZARA",
    dupeBrand: "Brodo",
    officialUrl: "https://www.zara.com/id/id/search?searchTerm=Leather+Loafers",
    officialPriceStr: "Rp 899.000",
    name: "Chunky Lug Sole Leather Penny Loafers",
    material: "Matte Leather & Rubber",
    breathability: 93,
    colorName: "Espresso Black",
    colorHex: "#181A18",
    price: 185000,
    priceStr: "Rp 185.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.shoes.loafers.black,
    shopeeQuery: "Brodo Sepatu Loafers Kulit Chunky Sol Tebal",
    tokopediaQuery: "Brodo Sepatu Penny Loafers Pria Wanita Sol Tebal",
    note: "Aksen kontemporer yang langsung mengangkat wibawa smart-casual",
    gender: "unisex",
    modest: true,
    suitableWeather: ["ac", "rainy", "mild"],
  },
  {
    id: "shoes_zara_strappy_mules",
    category: "shoes",
    categoryLabel: "Footwear · Mule Sandals",
    categoryOrder: 4,
    pinNumber: 4,
    brand: "ZARA",
    dupeBrand: "Shopatvelvet",
    officialUrl: "https://www.zara.com/id/id/search?searchTerm=Flat+Mules+Sandals",
    officialPriceStr: "Rp 699.000",
    name: "Minimalist Suede & Leather Mule Sandals",
    material: "Cushioned Footbed",
    breathability: 97,
    colorName: "Nude Oatmeal",
    colorHex: "#D4B996",
    price: 135000,
    priceStr: "Rp 135.000",
    imageUrl: CLEAN_PACKSHOT_DICTIONARY.shoes.mules.cream,
    shopeeQuery: "Shopatvelvet Sandal Mules Wanita Slip On Minimalis",
    tokopediaQuery: "This Is April Mules Sandal Wanita Flat Kasual Elegan",
    note: "Bebas lembap untuk brunch akhir pekan & acara semi-formal",
    gender: "female",
    modest: false,
    suitableWeather: ["hot", "mild"],
  },
];

// -------------------------------------------------------------
// 6 PRESET GAYA SKENA DENGAN MODEL SPECS & HOTSPOT COORDS
// -------------------------------------------------------------
const SKENA_VIBES: SkenaVibePreset[] = [
  {
    id: "earthy_hijab",
    label: "Earthy Modest Hijab",
    shortLabel: "Earthy Hijab",
    badge: "MODEST CASUAL",
    gender: "hijab",
    weather: "hot",
    occasion: "cafe",
    modelSpec: {
      height: "162 cm",
      size: "M",
      silhouette: "Relaxed Flowy",
      keyFabric: "Rayon Twill & Pure Linen",
    },
    heroImage: "https://i.pinimg.com/originals/54/2c/ad/542cadb7970189fddff971caf303b24b.png",
    altImages: [
      "https://i.pinimg.com/originals/f1/ff/32/f1ff32036ab3216cbb743dffcbadda35.jpg",
      "https://i.pinimg.com/originals/1b/3d/24/1b3d240b29e3ea29a9f1d8fdcb0fa1dc.png",
      "https://i.pinimg.com/originals/73/2b/97/732b9765f65e63ebf02595822e3524d3.jpg",
    ],
    tagline: "Paduan blus rayon dingin Cottonink & kulot jatuh Uniqlo untuk ngopi sore bebas gerah.",
    topId: "top_cottonink_rayon_mocca",
    bottomId: "bot_uniqlo_pleated_wide",
    outerId: "outer_voal_miracle",
    shoesId: "shoes_hm_retro_court",
    pinCoords: {
      outer: { top: "18%", left: "48%" },
      top: { top: "42%", left: "44%" },
      bottom: { top: "68%", left: "54%" },
      shoes: { top: "90%", left: "48%" },
    },
  },
  {
    id: "city_boy",
    label: "Japanese City Boy",
    shortLabel: "City Boy",
    badge: "JAPANESE STREET",
    gender: "pria",
    weather: "hot",
    occasion: "campus",
    modelSpec: {
      height: "176 cm",
      size: "L",
      silhouette: "Boxy Oversized",
      keyFabric: "AIRism Cotton & Ripstop",
    },
    heroImage: "https://i.pinimg.com/originals/8b/37/01/8b370169218458e48e093fd8140c898a.jpg",
    altImages: [
      "https://i.pinimg.com/originals/fa/77/80/fa7780f2eb19143c746bc5cfbe637dbf.png",
      "https://i.pinimg.com/originals/18/eb/9c/18eb9ca35a782410a768e9e1bb34a81e.jpg",
    ],
    tagline: "Karakter Tokyo street minimalis: kaos boxy sejuk AIRism & ripstop shorts fungsional.",
    topId: "top_uniqlo_airism_boxy",
    bottomId: "bot_uniqlo_geared_shorts",
    outerId: "outer_uniqlo_uv_parka",
    shoesId: "shoes_hm_retro_court",
    pinCoords: {
      outer: { top: "25%", left: "68%" },
      top: { top: "38%", left: "45%" },
      bottom: { top: "64%", left: "46%" },
      shoes: { top: "88%", left: "46%" },
    },
  },
  {
    id: "scbd_corporate",
    label: "SCBD Smart Corporate",
    shortLabel: "SCBD Smart",
    badge: "COMMUTER SMART",
    gender: "nonhijab",
    weather: "ac",
    occasion: "office",
    modelSpec: {
      height: "165 cm",
      size: "S",
      silhouette: "Tailored Crisp",
      keyFabric: "Crisp Poplin & Viscose",
    },
    heroImage: "https://i.pinimg.com/originals/be/35/11/be3511d3523f1db782d53ca53864b245.jpg",
    altImages: [
      "https://i.pinimg.com/originals/e8/37/10/e8371077ea4144fb4a2d8ebf5139aa2c.jpg",
      "https://i.pinimg.com/originals/3c/9c/d7/3c9cd7ce6ed7158cc75cbe999b745984.jpg",
    ],
    tagline: "Kemeja crisp poplin Zara & loose slacks lurus yang tahan kusut dan wibawa seharian.",
    topId: "top_zara_poplin_scbd",
    bottomId: "bot_hm_loose_straight_slacks",
    outerId: "outer_thenblank_linen_blazer",
    shoesId: "shoes_zara_chunky_loafers",
    pinCoords: {
      outer: { top: "32%", left: "70%" },
      top: { top: "40%", left: "44%" },
      bottom: { top: "67%", left: "50%" },
      shoes: { top: "89%", left: "48%" },
    },
  },
  {
    id: "blok_m_vintage",
    label: "Blok M Vintage Streetwear",
    shortLabel: "Blok M Street",
    badge: "VINTAGE CASUAL",
    gender: "pria",
    weather: "mild",
    occasion: "cafe",
    modelSpec: {
      height: "172 cm",
      size: "L",
      silhouette: "Baggy 90s",
      keyFabric: "Cotton Combed 24s/30s Cool-Touch",
    },
    heroImage: "https://i.pinimg.com/originals/18/eb/9c/18eb9ca35a782410a768e9e1bb34a81e.jpg",
    altImages: [
      "https://i.pinimg.com/originals/1e/8a/a5/1e8aa5fa0466487e49f87c95e1e5b1eb.jpg",
      "https://i.pinimg.com/originals/8b/37/01/8b370169218458e48e093fd8140c898a.jpg",
    ],
    tagline: "Kaos boxy vintage Erigo berbahan Cotton Combed 24s/30s Cool-Touch dan baggy denim ringan untuk Blok M.",
    topId: "top_erigo_vintage_boxy",
    bottomId: "bot_erigo_vintage_denim",
    outerId: "outer_uniqlo_uv_parka",
    shoesId: "shoes_hm_retro_court",
    pinCoords: {
      outer: { top: "28%", left: "66%" },
      top: { top: "42%", left: "48%" },
      bottom: { top: "68%", left: "46%" },
      shoes: { top: "89%", left: "48%" },
    },
  },
  {
    id: "old_money_coastal",
    label: "Old Money Coastal Linen",
    shortLabel: "Old Money",
    badge: "QUIET LUXURY",
    gender: "hijab",
    weather: "hot",
    occasion: "cafe",
    modelSpec: {
      height: "168 cm",
      size: "M",
      silhouette: "Relaxed Resort",
      keyFabric: "100% European Flax Linen",
    },
    heroImage: "https://i.pinimg.com/originals/1b/3d/24/1b3d240b29e3ea29a9f1d8fdcb0fa1dc.png",
    altImages: [
      "https://i.pinimg.com/originals/73/2b/97/732b9765f65e63ebf02595822e3524d3.jpg",
      "https://i.pinimg.com/originals/54/2c/ad/542cadb7970189fddff971caf303b24b.png",
    ],
    tagline: "Kemeja linen murni Uniqlo sage green & kulot pasir: estetika coastal resort mewah.",
    topId: "top_uniqlo_linen_relaxed",
    bottomId: "bot_uniqlo_pleated_wide",
    outerId: "outer_pashmina_ceruty",
    shoesId: "shoes_zara_strappy_mules",
    pinCoords: {
      outer: { top: "16%", left: "50%" },
      top: { top: "42%", left: "45%" },
      bottom: { top: "66%", left: "52%" },
      shoes: { top: "88%", left: "50%" },
    },
  },
  {
    id: "senopati_brunch",
    label: "Senopati Chic Brunch",
    shortLabel: "Senopati Chic",
    badge: "MODERN CONTEMPORARY",
    gender: "nonhijab",
    weather: "mild",
    occasion: "cafe",
    modelSpec: {
      height: "163 cm",
      size: "S",
      silhouette: "Clean A-Line",
      keyFabric: "Crinkle Linen & Matte Satin",
    },
    heroImage: "https://i.pinimg.com/originals/d0/e1/79/d0e179729344bf55f3b2454ae8f10098.jpg",
    altImages: [
      "https://i.pinimg.com/originals/40/70/7a/40707a334f8badcd3a4e39b4643da309.png",
      "https://i.pinimg.com/originals/b9/26/7d/b9267d7260917f982132bdb2bef3242b.jpg",
    ],
    tagline: "Atasan square neck linen THENBLANK & rok satin midi Cottonink untuk brunch akhir pekan.",
    topId: "top_thenblank_cropped_blouse",
    bottomId: "bot_cottonink_satin_skirt",
    outerId: "outer_thenblank_linen_blazer",
    shoesId: "shoes_zara_strappy_mules",
    pinCoords: {
      outer: { top: "30%", left: "66%" },
      top: { top: "42%", left: "46%" },
      bottom: { top: "66%", left: "50%" },
      shoes: { top: "89%", left: "48%" },
    },
  },
];

const SKIN_TONES_DRAPE = [
  {
    id: "sawo-matang",
    nama: "Sawo Matang",
    season: "Warm Autumn",
    hex: "#B87B52",
    vein: "Greenish (Warm Undertone)",
    bestPalettes: [
      { name: "Terracotta", hex: "#D4A373" },
      { name: "Sage Olive", hex: "#6E8B74" },
      { name: "Warm Ivory", hex: "#F5F2EB" },
      { name: "Bronze Brown", hex: "#8C5A3C" },
    ],
    avoidPalettes: [
      { name: "Ash Grey", hex: "#8A929A" },
      { name: "Neon Pink", hex: "#FF1493" },
      { name: "Electric Yellow", hex: "#E6FF00" },
    ],
    deskripsi: "Rona hangat paling dominan di Indonesia. Sangat bercahaya dengan palet earth tones alami.",
  },
  {
    id: "kuning-langsat",
    nama: "Kuning Langsat",
    season: "Warm Spring",
    hex: "#E8C8A2",
    vein: "Blue-Green (Neutral Warm)",
    bestPalettes: [
      { name: "Soft Coral", hex: "#F08080" },
      { name: "Sky Soft", hex: "#87CEEB" },
      { name: "Butter Cream", hex: "#FFFDD0" },
      { name: "Light Sage", hex: "#A8C3A0" },
    ],
    avoidPalettes: [
      { name: "Pitch Black", hex: "#000000" },
      { name: "Deep Mud Brown", hex: "#2E1A0C" },
    ],
    deskripsi: "Memancarkan kilau radiant alami saat dipadukan dengan pastel hangat dan soft earth tones.",
  },
  {
    id: "putih-gading",
    nama: "Putih Gading",
    season: "Light Spring / Summer",
    hex: "#F5D6C6",
    vein: "Bluish / Purple (Cool Undertone)",
    bestPalettes: [
      { name: "Rose Quartz", hex: "#F7CAC9" },
      { name: "Muted Lavender", hex: "#E6E6FA" },
      { name: "Navy Blue", hex: "#1B2A4A" },
      { name: "Broken White", hex: "#FAF6EE" },
    ],
    avoidPalettes: [
      { name: "Neon Orange", hex: "#FF4500" },
      { name: "Dark Rust", hex: "#8B4513" },
    ],
    deskripsi: "Kontras seimbang dengan warna dingin, pastel lembut, dan broken white.",
  },
  {
    id: "tan-eksotis",
    nama: "Tan Eksotis",
    season: "Deep Autumn",
    hex: "#7D5335",
    vein: "Deep Olive (Deep Warm)",
    bestPalettes: [
      { name: "Deep Terracotta", hex: "#C86446" },
      { name: "Mustard Gold", hex: "#DAA520" },
      { name: "Forest Green", hex: "#228B22" },
      { name: "Cream Oat", hex: "#FAF6EE" },
    ],
    avoidPalettes: [
      { name: "Chalk White", hex: "#FFFFFF" },
      { name: "Monotone Cool Grey", hex: "#708090" },
    ],
    deskripsi: "Tone eksotis tropis berwibawa, sangat mewah dengan perpaduan warna rich jewel tones.",
  },
];

function buildSpecificOfficialSearchUrl(brand: string, itemName: string, rawUrl?: string): string {
  const q = encodeURIComponent(itemName);
  const b = (brand || "").toUpperCase();
  if (rawUrl && rawUrl.includes("?")) return rawUrl;
  if (b.includes("UNIQLO")) return `https://www.uniqlo.com/id/id/search?q=${q}`;
  if (b.includes("ZARA")) return `https://www.zara.com/id/id/search?searchTerm=${q}`;
  if (b.includes("H&M") || b.includes("HM")) return `https://id.hm.com/id_id/search-results.html?q=${q}`;
  return `https://www.zalora.co.id/search?q=${encodeURIComponent(`${brand} ${itemName}`.trim())}`;
}

function resolveAuthenticLocalDupeBrand(slotKey: "top" | "bottom" | "outer" | "shoes", itemName: string): string {
  const n = (itemName || "").toLowerCase();
  if (slotKey === "outer" && (n.includes("hijab") || n.includes("voal") || n.includes("pashmina") || n.includes("shawl"))) {
    return n.includes("voal") ? "Vanilla Hijab" : "Lafiye";
  }
  if (slotKey === "shoes") {
    return n.includes("mule") || n.includes("heels") || n.includes("sandal") ? "Shopatvelvet" : "Brodo";
  }
  if (slotKey === "top") {
    if (n.includes("kaos") || n.includes("tee") || n.includes("t-shirt") || n.includes("boxy")) return "Erigo";
    if (n.includes("blus") || n.includes("blouse") || n.includes("satin") || n.includes("tunik")) return "Shopatvelvet";
    if (n.includes("poplin") || n.includes("knit") || n.includes("cardigan")) return "This Is April";
    return "Thenblank";
  }
  if (slotKey === "bottom") {
    if (n.includes("rok") || n.includes("skirt")) return "Shopatvelvet";
    if (n.includes("cargo") || n.includes("denim") || n.includes("jeans") || n.includes("pendek")) return "Erigo";
    if (n.includes("slacks") || n.includes("trousers") || n.includes("tailored")) return "This Is April";
    return "Thenblank";
  }
  return "Thenblank";
}

function outfitItemToStudioItem(
  item: OutfitItem | undefined,
  slotKey: "top" | "bottom" | "outer" | "shoes",
  fallback: StudioItem,
  fallbackImage: string
): StudioItem {
  if (!item) return fallback;

  let price = fallback.price;
  const numMatches = (item.estimatedPrice || "").match(/\d+[\d.]*/g);
  if (numMatches && numMatches.length > 0) {
    const rawNum = parseInt(numMatches[0].replace(/\./g, ""), 10);
    if (!isNaN(rawNum) && rawNum > 1000) {
      price = rawNum;
    }
  }

  const isHijabPiece =
    slotKey === "outer" &&
    /hijab|voal|pashmina|shawl|kerudung/i.test(`${item.name} ${item.material || ""}`);

  const categoryLabels: Record<string, string> = {
    outer: isHijabPiece ? "Hijab · Modest Headwear" : "Outerwear · Layering",
    top: "Tops · Atasan Utama",
    bottom: "Bottoms · Bawahan",
    shoes: "Footwear · Sepatu & Sandal",
  };

  const pinNumbers: Record<string, number> = {
    outer: 1,
    top: 2,
    bottom: 3,
    shoes: 4,
  };

  const cleanPriceStr = item.estimatedPrice || fallback.priceStr;
  const dupePriceStr = cleanPriceStr.includes("Dupe:")
    ? cleanPriceStr.split("Dupe:")[1]?.replace(")", "").trim() || cleanPriceStr
    : cleanPriceStr;

  // Lapis 1 & Lapis 2 Hybrid Visual Resolver (Pure Standalone Packshot)
  const visual = resolveSmartItemVisual(item, slotKey, fallbackImage);
  const resolvedBrand = item.brand || (item.isOfficialBrand ? "UNIQLO" : "THENBLANK");
  const resolvedDupeBrand = resolveAuthenticLocalDupeBrand(slotKey, item.name);

  return {
    id: `item_${slotKey}_${(item.name || "garment").replace(/\s+/g, "_").toLowerCase()}`,
    category: slotKey,
    categoryLabel: categoryLabels[slotKey] || fallback.categoryLabel,
    categoryOrder: pinNumbers[slotKey] || fallback.categoryOrder,
    pinNumber: pinNumbers[slotKey] || fallback.pinNumber,
    brand: resolvedBrand,
    dupeBrand: resolvedDupeBrand,
    officialUrl: buildSpecificOfficialSearchUrl(resolvedBrand, item.name, item.brandUrl),
    officialPriceStr: cleanPriceStr.split("(")[0].trim() || fallback.officialPriceStr,
    name: item.name,
    material: item.material || "Katun Rayon & Linen",
    breathability: 96,
    colorName: item.color || "Harmonis",
    colorHex: item.colorHex || fallback.colorHex,
    price: price,
    priceStr: dupePriceStr,
    imageUrl: visual.imageUrl || fallback.imageUrl,
    shopeeQuery: item.shopeeQuery || `${resolvedDupeBrand} ${item.name}`,
    tokopediaQuery: item.tokopediaQuery || `${resolvedDupeBrand} ${item.name}`,
    note: `Kombinasi material ${item.material || "adem"} dengan sirkulasi udara optimal`,
    gender: "female",
    modest: true,
    isHijab: isHijabPiece,
    suitableWeather: fallback.suitableWeather,
  };
}

interface StudioViewProps {
  initialLookId?: string | null;
  onSaveOutfit?: (outfit: OOTDRecommendation) => void;
}

export default function StudioView({ initialLookId, onSaveOutfit }: StudioViewProps) {
  const [activeTab, setActiveTab] = useState<"mixer" | "colorlab">("mixer");
  const [selectedVibeId, setSelectedVibeId] = useState<string>("earthy_hijab");
  const [heroImageIndex, setHeroImageIndex] = useState<number>(0);
  const [customHeroImage, setCustomHeroImage] = useState<string | null>(null);
  const [customLookTitle, setCustomLookTitle] = useState<string | null>(null);
  const [customLookTag, setCustomLookTag] = useState<string | null>(null);
  const [customModelSpec, setCustomModelSpec] = useState<{
    height: string;
    size: string;
    silhouette: string;
    keyFabric: string;
  } | null>(null);

  const [genderMode, setGenderMode] = useState<"hijab" | "nonhijab" | "pria">("hijab");
  const [weatherMode, setWeatherMode] = useState<"hot" | "ac" | "rainy" | "mild">("hot");
  const [selectedSkinToneId, setSelectedSkinToneId] = useState<string>("sawo-matang");

  // State Hotspot Interaktif (Point 2: Shoppable Pins)
  const [activeHotspot, setActiveHotspot] = useState<"top" | "bottom" | "outer" | "shoes" | null>(null);

  // State 4 Slot Pakaian Aktif
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

  // State Penguncian Slot
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

  // Sinkronisasi Deep-Link dari Hero/Lookbook (?vibe=... atau ?look=...) & LocalStorage
  useEffect(() => {
    const applyResolvedLook = (
      image: string,
      title: string,
      tag: string | undefined,
      outfit: OOTDRecommendation | undefined,
      modelSpec?: { height: string; size: string; silhouette: string; keyFabric: string },
      gMode?: "hijab" | "nonhijab" | "pria"
    ) => {
      if (image) setCustomHeroImage(image);
      if (title) setCustomLookTitle(title);
      if (tag) setCustomLookTag(tag);
      if (modelSpec) setCustomModelSpec(modelSpec);
      if (gMode) setGenderMode(gMode);

      if (outfit?.items && outfit.items.length > 0) {
        const topItem = outfit.items.find((i) => i.category === "atasan");
        const botItem = outfit.items.find((i) => i.category === "bawahan");
        const outItem = outfit.items.find((i) => i.category === "outer_hijab");
        const shoItem = outfit.items.find((i) => i.category === "sepatu");

        setActiveSlots({
          top: outfitItemToStudioItem(topItem, "top", TOP_POOL[0], image),
          bottom: outfitItemToStudioItem(botItem, "bottom", BOTTOM_POOL[0], image),
          outer: outfitItemToStudioItem(outItem, "outer", OUTER_POOL[0], image),
          shoes: outfitItemToStudioItem(shoItem, "shoes", SHOES_POOL[0], image),
        });
      }
    };

    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      const vibeParam = p.get("vibe");
      if (vibeParam) {
        const matchedVibe = SKENA_VIBES.find((v) => v.id === vibeParam);
        if (matchedVibe) {
          handleSelectSkenaVibe(matchedVibe);
          return;
        }
      }
    }

    // 1. Prioritas Utama: URL param look
    let targetId = initialLookId;
    if (!targetId && typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      targetId = p.get("look");
    }

    if (targetId) {
      const matchedVibeById = SKENA_VIBES.find((v) => v.id === targetId);
      if (matchedVibeById) {
        handleSelectSkenaVibe(matchedVibeById);
        return;
      }

      const resolved = resolveLookForStudio(targetId);
      if (resolved) {
        applyResolvedLook(
          resolved.image,
          resolved.title,
          resolved.tag,
          resolved.outfit,
          resolved.modelSpec,
          resolved.genderMode
        );
        triggerToast(`Formula '${resolved.title}' berhasil dimuat.`);
        return;
      }
    }

    // 2. Prioritas Kedua: Storage Sync dari klik Lookbook
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("looku_selected_studio_look");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed && (parsed.image || parsed.title)) {
            if (!targetId || targetId === parsed.lookId || targetId === parsed.outfitId) {
              const isPria = parsed.tag?.toUpperCase() === "MENSWEAR" || parsed.category?.toLowerCase().includes("pria");
              const isHijab = parsed.tag?.toUpperCase().includes("HIJAB") || parsed.outfit?.modestFriendly;
              const gMode = isPria ? "pria" : isHijab ? "hijab" : "nonhijab";
              const topItem = parsed.outfit?.items?.find((i: any) => i.category === "atasan");

              applyResolvedLook(
                parsed.image,
                parsed.title,
                parsed.tag,
                parsed.outfit,
                {
                  height: isPria ? "175 cm" : isHijab ? "160 cm" : "162 cm",
                  size: "M (Model Fit)",
                  silhouette: parsed.vibe || "Modern Minimalist",
                  keyFabric: topItem?.material || "Katun Rayon & Linen",
                },
                gMode
              );
              triggerToast(`Formula '${parsed.title}' berhasil dimuat.`);
            }
          }
        }
      } catch (e) {
        console.warn("Failed to read studio look from localStorage", e);
      }
    }
  }, [initialLookId]);

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => {
      setFeedbackToast((current) => (current === msg ? null : current));
    }, 2800);
  };

  const filterPoolByContext = (
    pool: StudioItem[],
    slotKey: "top" | "bottom" | "outer" | "shoes",
    gMode: "hijab" | "nonhijab" | "pria",
    wMode: "hot" | "ac" | "rainy" | "mild"
  ): StudioItem[] => {
    // 1. Filter wajib berdasarkan Gender & penguncian komponen Hijab pada mode Modest/Hijab
    const genderFiltered = pool.filter((item) => {
      if (slotKey === "outer") {
        // Saat mode Modest / Hijab aktif, slot ke-3 (outer) WAJIB mempertahankan komponen Hijab
        if (gMode === "hijab") return Boolean(item.isHijab);
        // Saat mode non-hijab atau pria, hanya tampilkan outerwear non-hijab
        return !item.isHijab;
      }
      if (gMode === "hijab" && !item.modest && item.gender === "female") return false;
      if (gMode === "pria" && item.gender === "female") return false;
      if (gMode === "nonhijab" && item.gender === "male") return false;
      return true;
    });

    const basePool = genderFiltered.length > 0 ? genderFiltered : pool;

    // 2. Prioritaskan item yang sesuai dengan suhu weatherMode aktif (33°C Hot, 22°C AC, 25°C Rainy, 29°C Mild)
    const weatherMatched = basePool.filter((item) => item.suitableWeather?.includes(wMode));
    if (weatherMatched.length > 1) {
      return weatherMatched;
    }
    if (weatherMatched.length === 1 && basePool.length > 1) {
      // Tempatkan item yang paling cocok dengan cuaca di urutan pertama diikuti opsi kompatibel lainnya
      return [weatherMatched[0], ...basePool.filter((i) => i.id !== weatherMatched[0].id)];
    }
    return basePool;
  };

  const handleChangeGenderMode = () => {
    const nextG: "hijab" | "nonhijab" | "pria" =
      genderMode === "hijab" ? "nonhijab" : genderMode === "nonhijab" ? "pria" : "hijab";
    setGenderMode(nextG);

    // Pastikan slot Hijab terjaga saat masuk ke mode Modest Hijab, atau diganti outer saat keluar dari mode Hijab
    setActiveSlots((prev) => {
      let nextOuter = prev.outer;
      if (nextG === "hijab" && !prev.outer.isHijab) {
        nextOuter = OUTER_POOL.find((o) => o.isHijab) || OUTER_POOL[0];
      } else if (nextG !== "hijab" && prev.outer.isHijab) {
        nextOuter = OUTER_POOL.find((o) => !o.isHijab) || OUTER_POOL[3];
      }
      return {
        ...prev,
        outer: nextOuter,
      };
    });

    triggerToast(
      `Mode: ${
        nextG === "hijab"
          ? "Modest Hijab (Slot Hijab Terkunci)"
          : nextG === "nonhijab"
          ? "Women"
          : "Men"
      }`
    );
  };

  const handleChangeWeatherMode = () => {
    const nextW: "hot" | "ac" | "rainy" | "mild" =
      weatherMode === "hot"
        ? "ac"
        : weatherMode === "ac"
        ? "rainy"
        : weatherMode === "rainy"
        ? "mild"
        : "hot";
    setWeatherMode(nextW);

    // Prioritaskan otomatis pakaian pada slot yang tidak dikunci agar selaras dengan suhu baru
    setActiveSlots((prev) => {
      const pickForWeather = (pool: StudioItem[], slotKey: "top" | "bottom" | "outer" | "shoes", current: StudioItem) => {
        const candidates = filterPoolByContext(pool, slotKey, genderMode, nextW);
        const weatherStrict = candidates.filter((i) => i.suitableWeather?.includes(nextW));
        if (weatherStrict.length > 0) {
          const different = weatherStrict.find((i) => i.id !== current.id);
          return different || weatherStrict[0];
        }
        return candidates[0] || current;
      };

      return {
        top: lockedSlots.top ? prev.top : pickForWeather(TOP_POOL, "top", prev.top),
        bottom: lockedSlots.bottom ? prev.bottom : pickForWeather(BOTTOM_POOL, "bottom", prev.bottom),
        outer: lockedSlots.outer ? prev.outer : pickForWeather(OUTER_POOL, "outer", prev.outer),
        shoes: lockedSlots.shoes ? prev.shoes : pickForWeather(SHOES_POOL, "shoes", prev.shoes),
      };
    });

    const wText =
      nextW === "hot"
        ? "33°C Hot (Prioritas Linen & Rayon Tipis)"
        : nextW === "ac"
        ? "22°C AC (Prioritas Blazer & Tailored)"
        : nextW === "rainy"
        ? "25°C Rainy (Prioritas Quick-Dry & Outer)"
        : "29°C Mild (Prioritas Katun Sejuk)";
    triggerToast(`Filter Suhu: ${wText}`);
  };

  const handleSelectSkenaVibe = (vibe: SkenaVibePreset) => {
    setSelectedVibeId(vibe.id);
    setHeroImageIndex(0);
    setCustomHeroImage(null);
    setCustomLookTitle(null);
    setCustomLookTag(null);
    setCustomModelSpec(null);
    setGenderMode(vibe.gender);
    setWeatherMode(vibe.weather);

    const newTop = TOP_POOL.find((t) => t.id === vibe.topId) || TOP_POOL[0];
    const newBottom = BOTTOM_POOL.find((b) => b.id === vibe.bottomId) || BOTTOM_POOL[0];
    const newOuter = OUTER_POOL.find((o) => o.id === vibe.outerId) || OUTER_POOL[0];
    const newShoes = SHOES_POOL.find((s) => s.id === vibe.shoesId) || SHOES_POOL[0];

    setActiveSlots({
      top: lockedSlots.top ? activeSlots.top : newTop,
      bottom: lockedSlots.bottom ? activeSlots.bottom : newBottom,
      outer: lockedSlots.outer ? activeSlots.outer : newOuter,
      shoes: lockedSlots.shoes ? activeSlots.shoes : newShoes,
    });

    triggerToast(`Gaya ${vibe.label} dipilih.`);
  };

  const toggleSlotLock = (slotKey: "top" | "bottom" | "outer" | "shoes") => {
    setLockedSlots((prev) => {
      const next = !prev[slotKey];
      triggerToast(next ? `Item terkunci.` : `Item terbuka.`);
      return { ...prev, [slotKey]: next };
    });
  };

  const swapSingleSlot = (slotKey: "top" | "bottom" | "outer" | "shoes") => {
    let pool: StudioItem[] = [];
    if (slotKey === "top") pool = TOP_POOL;
    if (slotKey === "bottom") pool = BOTTOM_POOL;
    if (slotKey === "outer") pool = OUTER_POOL;
    if (slotKey === "shoes") pool = SHOES_POOL;

    const activePool = filterPoolByContext(pool, slotKey, genderMode, weatherMode);
    const currentIndex = activePool.findIndex((i) => i.id === activeSlots[slotKey].id);
    const nextIndex = (currentIndex + 1) % activePool.length;
    const nextItem = activePool[nextIndex];

    setActiveSlots((prev) => ({
      ...prev,
      [slotKey]: nextItem,
    }));

    triggerToast(`${nextItem.name} (${nextItem.brand} / Dupe ${nextItem.dupeBrand}) dipilih.`);
  };

  const handleShuffleUnlocked = () => {
    setIsShuffling(true);

    setTimeout(() => {
      const getRandomUnpicked = (
        pool: StudioItem[],
        slotKey: "top" | "bottom" | "outer" | "shoes",
        currentId: string
      ) => {
        const contextPool = filterPoolByContext(pool, slotKey, genderMode, weatherMode);
        const weatherPreferred = contextPool.filter(
          (item) => item.suitableWeather?.includes(weatherMode) && item.id !== currentId
        );
        const nonCurrent = contextPool.filter((item) => item.id !== currentId);
        const candidatePool =
          weatherPreferred.length > 0
            ? weatherPreferred
            : nonCurrent.length > 0
            ? nonCurrent
            : contextPool;
        return candidatePool[Math.floor(Math.random() * candidatePool.length)];
      };

      setActiveSlots((prev) => ({
        top: lockedSlots.top ? prev.top : getRandomUnpicked(TOP_POOL, "top", prev.top.id),
        bottom: lockedSlots.bottom ? prev.bottom : getRandomUnpicked(BOTTOM_POOL, "bottom", prev.bottom.id),
        outer: lockedSlots.outer ? prev.outer : getRandomUnpicked(OUTER_POOL, "outer", prev.outer.id),
        shoes: lockedSlots.shoes ? prev.shoes : getRandomUnpicked(SHOES_POOL, "shoes", prev.shoes.id),
      }));

      setIsShuffling(false);
      triggerToast(`Kombinasi OOTD ${weatherLabel} diterapkan.`);
    }, 250);
  };

  const handleResetCanvas = () => {
    setLockedSlots({ top: false, bottom: false, outer: false, shoes: false });
    handleSelectSkenaVibe(SKENA_VIBES[0]);
    triggerToast("Studio direset ke konfigurasi awal.");
  };

  const handleSaveToWardrobe = () => {
    const currentVibe = SKENA_VIBES.find((v) => v.id === selectedVibeId) || SKENA_VIBES[0];
    const recommendation: OOTDRecommendation = {
      id: `studio_${Date.now()}`,
      title: customLookTitle || `${currentVibe.label} Look`,
      tagline: currentVibe.tagline,
      overallVibe: currentVibe.badge,
      comfortRating: 5,
      affordabilityRating: 4,
      modestFriendly: genderMode === "hijab",
      skinToneMatch: `Harmonisasi sempurna untuk kulit ${activeSkinTone.nama}`,
      whyItWorks: currentVibe.tagline,
      stylingTip: "Sirkulasi Udara Optimal · Serat Bernapas untuk cuaca tropis",
      colorPalette: [
        { name: activeSlots.top.colorName, hex: activeSlots.top.colorHex },
        { name: activeSlots.bottom.colorName, hex: activeSlots.bottom.colorHex },
        { name: activeSlots.outer.colorName, hex: activeSlots.outer.colorHex },
        { name: activeSlots.shoes.colorName, hex: activeSlots.shoes.colorHex },
      ],
      flatlayImages: [activeHeroImage, activeSlots.top.imageUrl, activeSlots.bottom.imageUrl],
      sweatStainResistance: "Optimal Anti-Stain",
      costPerWearSavings: totalDupePriceStr,
      items: [
        {
          category: "atasan",
          brand: activeSlots.top.brand,
          brandUrl: activeSlots.top.officialUrl,
          isOfficialBrand: true,
          name: activeSlots.top.name,
          material: activeSlots.top.material,
          color: activeSlots.top.colorName,
          colorHex: activeSlots.top.colorHex,
          estimatedPrice: `${activeSlots.top.officialPriceStr} (Dupe ${activeSlots.top.dupeBrand}: ${activeSlots.top.priceStr})`,
          shopeeQuery: activeSlots.top.shopeeQuery,
          tokopediaQuery: activeSlots.top.tokopediaQuery,
          imageUrl: activeSlots.top.imageUrl,
        },
        {
          category: "bawahan",
          brand: activeSlots.bottom.brand,
          brandUrl: activeSlots.bottom.officialUrl,
          isOfficialBrand: true,
          name: activeSlots.bottom.name,
          material: activeSlots.bottom.material,
          color: activeSlots.bottom.colorName,
          colorHex: activeSlots.bottom.colorHex,
          estimatedPrice: `${activeSlots.bottom.officialPriceStr} (Dupe ${activeSlots.bottom.dupeBrand}: ${activeSlots.bottom.priceStr})`,
          shopeeQuery: activeSlots.bottom.shopeeQuery,
          tokopediaQuery: activeSlots.bottom.tokopediaQuery,
          imageUrl: activeSlots.bottom.imageUrl,
        },
        {
          category: "outer_hijab",
          brand: activeSlots.outer.brand,
          brandUrl: activeSlots.outer.officialUrl,
          isOfficialBrand: true,
          name: activeSlots.outer.name,
          material: activeSlots.outer.material,
          color: activeSlots.outer.colorName,
          colorHex: activeSlots.outer.colorHex,
          estimatedPrice: `${activeSlots.outer.officialPriceStr} (Dupe ${activeSlots.outer.dupeBrand}: ${activeSlots.outer.priceStr})`,
          shopeeQuery: activeSlots.outer.shopeeQuery,
          tokopediaQuery: activeSlots.outer.tokopediaQuery,
          imageUrl: activeSlots.outer.imageUrl,
        },
        {
          category: "sepatu",
          brand: activeSlots.shoes.brand,
          brandUrl: activeSlots.shoes.officialUrl,
          isOfficialBrand: true,
          name: activeSlots.shoes.name,
          material: activeSlots.shoes.material,
          color: activeSlots.shoes.colorName,
          colorHex: activeSlots.shoes.colorHex,
          estimatedPrice: `${activeSlots.shoes.officialPriceStr} (Dupe ${activeSlots.shoes.dupeBrand}: ${activeSlots.shoes.priceStr})`,
          shopeeQuery: activeSlots.shoes.shopeeQuery,
          tokopediaQuery: activeSlots.shoes.tokopediaQuery,
          imageUrl: activeSlots.shoes.imageUrl,
        },
      ],
      createdAt: new Date().toISOString(),
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
      triggerToast("Outfit tersimpan di lemari.");
    } catch {
      triggerToast("Tersimpan.");
    }
  };

  // -------------------------------------------------------------
  // METRIK TELEMETRI
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
    Math.round(93 + ((activeSlots.top.breathability % 4) + (activeSlots.bottom.breathability % 3)))
  );

  const totalDupePrice =
    activeSlots.top.price +
    activeSlots.bottom.price +
    activeSlots.outer.price +
    activeSlots.shoes.price;

  const totalOfficialPrice =
    (activeSlots.top.brand === "UNIQLO" ? 399000 : 279000) +
    (activeSlots.bottom.brand === "UNIQLO" ? 499000 : 329000) +
    (activeSlots.outer.brand === "UNIQLO" ? 399000 : 120000) +
    (activeSlots.shoes.brand === "ZARA" ? 899000 : 499000);

  const totalDupePriceStr = `Rp ${totalDupePrice.toLocaleString("id-ID")}`;
  const totalOfficialPriceStr = `Rp ${totalOfficialPrice.toLocaleString("id-ID")}`;

  const currentVibeObj = SKENA_VIBES.find((v) => v.id === selectedVibeId) || SKENA_VIBES[0];
  const allCurrentVibeImgs = [currentVibeObj.heroImage, ...currentVibeObj.altImages];
  const activeHeroImage = customHeroImage || allCurrentVibeImgs[heroImageIndex % allCurrentVibeImgs.length];

  const activeSkinTone =
    SKIN_TONES_DRAPE.find((t) => t.id === selectedSkinToneId) || SKIN_TONES_DRAPE[0];

  const weatherLabel =
    weatherMode === "hot"
      ? "33°C Hot"
      : weatherMode === "ac"
      ? "22°C AC"
      : weatherMode === "rainy"
      ? "25°C Rainy"
      : "29°C Mild";

  const genderLabel =
    genderMode === "hijab"
      ? "Modest"
      : genderMode === "nonhijab"
      ? "Women"
      : "Men";

  const slotEntries: { key: "top" | "bottom" | "outer" | "shoes"; item: StudioItem }[] = [
    { key: "outer", item: activeSlots.outer },
    { key: "top", item: activeSlots.top },
    { key: "bottom", item: activeSlots.bottom },
    { key: "shoes", item: activeSlots.shoes },
  ];

  return (
    <div className="relative w-full min-h-[100dvh] bg-white text-neutral-900 font-sans antialiased selection:bg-neutral-900 selection:text-white">
      {/* Toast Feedback StyleHint Minimalis */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 md:top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 text-white text-[11px] font-medium tracking-wide px-4 py-2.5 rounded-full shadow-lg border border-neutral-700/50 flex items-center gap-2 pointer-events-none"
          >
            <span>{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 📱 1. MOBILE VIEW (< 768px): STYLEHINT CLEAN STANDARDS                */}
      {/* ===================================================================== */}
      <div className="block md:hidden w-full max-w-md mx-auto min-h-[100dvh] bg-white pb-36">
        {/* Top Minimalist Header */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-neutral-100 pt-[max(0px,env(safe-area-inset-top))]">
          <div className="h-12 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-neutral-900">
                LOOK.U STUDIO
              </span>
              <span className="text-[10px] tracking-widest uppercase text-neutral-400 font-mono">
                STYLEHINT
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetCanvas}
                className="text-[11px] font-medium text-neutral-400 hover:text-neutral-900 px-2 py-1 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Mode Switcher Minimalis */}
          <div className="grid grid-cols-2 border-t border-neutral-100 text-[11px] font-medium uppercase tracking-[0.12em]">
            <button
              type="button"
              onClick={() => setActiveTab("mixer")}
              className={`py-2.5 text-center transition-all border-b-2 ${
                activeTab === "mixer"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-400"
              }`}
            >
              Outfit Curator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("colorlab")}
              className={`py-2.5 text-center transition-all border-b-2 ${
                activeTab === "colorlab"
                  ? "border-neutral-900 text-neutral-900"
                  : "border-transparent text-neutral-400"
              }`}
            >
              Skin Color Lab
            </button>
          </div>

          {/* 6 Skena Vibe Filter Rail */}
          {activeTab === "mixer" && (
            <div className="border-t border-neutral-100 px-3 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar bg-neutral-50/50">
              {SKENA_VIBES.map((vibe) => {
                const isSelected = selectedVibeId === vibe.id && !customLookTitle;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => handleSelectSkenaVibe(vibe)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] tracking-wide transition-all ${
                      isSelected
                        ? "bg-neutral-900 text-white font-medium"
                        : "bg-white text-neutral-600 border border-neutral-200/80 hover:border-neutral-400"
                    }`}
                  >
                    {vibe.shortLabel}
                  </button>
                );
              })}
            </div>
          )}
        </header>

        {activeTab === "mixer" ? (
          <div className="space-y-4 pt-2">
            {/* Context Anchor Pill when routed from Lookbook */}
            {customLookTitle && (
              <div className="mx-4 p-2.5 bg-[#FAF8F5] border border-sand-300 rounded-xl flex items-center justify-between gap-2 shadow-2xs">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                  <span className="text-[11px] font-mono text-[#5C554E] uppercase tracking-wider shrink-0">Lookbook:</span>
                  <span className="text-xs font-bold text-charcoal-900 truncate">{customLookTitle}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCustomLookTitle(null);
                    setCustomHeroImage(null);
                    setCustomLookTag(null);
                    setCustomModelSpec(null);
                    triggerToast("Kembali ke kurasi preset Studio");
                  }}
                  className="text-[11px] font-mono font-semibold text-terracotta-600 hover:text-terracotta-700 underline shrink-0 min-h-[32px] px-2 flex items-center"
                >
                  Ganti Vibe ✕
                </button>
              </div>
            )}

            {/* Context Filters Strip (Clean & Uncluttered) */}
            <div className="px-4 flex items-center justify-between text-[11px] text-neutral-500 font-medium">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleChangeGenderMode}
                  className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors flex items-center gap-1"
                >
                  <span>{genderLabel}</span>
                  <span className="text-neutral-400">↻</span>
                </button>

                <button
                  type="button"
                  onClick={handleChangeWeatherMode}
                  className="px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                >
                  {weatherLabel}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("colorlab")}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded border border-neutral-200 hover:border-neutral-400 text-neutral-700 transition-colors"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/10"
                  style={{ backgroundColor: activeSkinTone.hex }}
                />
                <span className="truncate max-w-[85px]">{activeSkinTone.nama}</span>
              </button>
            </div>

            {/* POINT 2: HERO OOTD DENGAN SHOPPABLE INTERACTIVE PINS */}
            <div className="px-4">
              <div className="relative w-full aspect-[4/5] bg-neutral-100 overflow-hidden rounded-xl shadow-xs border border-neutral-200/70">
                <img
                  src={activeHeroImage}
                  alt={customLookTitle || currentVibeObj.label}
                  className="w-full h-full object-cover object-top transition-all duration-500"
                />

                {/* Micro Header Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-1 bg-white/90 backdrop-blur-md text-neutral-900 text-[10px] font-mono uppercase tracking-[0.14em] font-medium rounded-full shadow-2xs">
                    {customLookTag || currentVibeObj.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomHeroImage(null);
                      setHeroImageIndex((prev) => prev + 1);
                      triggerToast("Visual gaya diperbarui");
                    }}
                    className="pointer-events-auto px-2.5 py-1 bg-white/90 backdrop-blur-md text-neutral-900 hover:bg-neutral-900 hover:text-white text-[10px] font-medium rounded-full shadow-2xs flex items-center gap-1 transition-all"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
                    <span>Foto Lain</span>
                  </button>
                </div>

                {/* SHOPPABLE HOTSPOT PINS (4 TITIK INTERAKTIF) */}
                {slotEntries.map(({ key, item }) => {
                  const coords = currentVibeObj.pinCoords[key];
                  const isActive = activeHotspot === key;
                  return (
                    <div
                      key={key}
                      style={{ top: coords.top, left: coords.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      {/* Pulse Halo */}
                      <button
                        type="button"
                        aria-label={`Lihat ${item.name}`}
                        onClick={() => setActiveHotspot(isActive ? null : key)}
                        className="group relative flex items-center justify-center p-2"
                      >
                        <span className={`absolute w-7 h-7 rounded-full bg-white/70 transition-transform ${isActive ? "scale-125 bg-white" : "group-hover:scale-110"}`} />
                        <span className={`relative w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-mono font-bold transition-all shadow-md ${isActive ? "bg-neutral-900 text-white ring-2 ring-white" : "bg-white text-neutral-900 border border-neutral-300"}`}>
                          {item.pinNumber}
                        </span>
                      </button>

                      {/* Micro Popover Tooltip saat Pin Diklik */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 4 }}
                            className="absolute left-1/2 -translate-x-1/2 top-8 z-30 w-52 p-2.5 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-xl shadow-xl text-neutral-900 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                                {item.categoryLabel}
                              </span>
                              <span className="text-[8px] font-bold bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                                {item.brand}
                              </span>
                            </div>

                            <p className="text-[11px] font-semibold text-neutral-900 line-clamp-1">
                              {item.name}
                            </p>

                            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-100 font-mono">
                              <span className="text-neutral-500">Resmi: {item.officialPriceStr}</span>
                              <span className="font-semibold text-neutral-900">Dupe ({item.dupeBrand}): {item.priceStr}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-1.5 pt-1">
                              <button
                                type="button"
                                onClick={() => swapSingleSlot(key)}
                                className="py-1 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[9px] font-medium rounded flex items-center justify-center gap-1"
                              >
                                <RotateCw className="w-2.5 h-2.5" />
                                <span>Ganti</span>
                              </button>
                              <a
                                href={item.officialUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="py-1 px-2 bg-neutral-900 text-white text-[9px] font-medium rounded text-center flex items-center justify-center gap-1"
                              >
                                <span>Toko</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* POINT 3: MODEL SPEC & RELATABILITY TAG (Ala StyleHint) */}
              <div className="mt-2.5 px-3 py-2 bg-neutral-50 border border-neutral-200/70 rounded-lg flex items-center justify-between text-[10px] text-neutral-600 font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-neutral-800">
                    {customModelSpec?.height || currentVibeObj.modelSpec.height}
                  </span>
                  <span>•</span>
                  <span>Size {customModelSpec?.size || currentVibeObj.modelSpec.size}</span>
                  <span>•</span>
                  <span>{customModelSpec?.silhouette || currentVibeObj.modelSpec.silhouette}</span>
                </div>
                <span className="text-neutral-500 font-medium">
                  Sirkulasi Udara Optimal · Serat Bernapas
                </span>
              </div>
            </div>

            {/* POINT 4: HORIZONTAL PRODUCT SHELF ALA STYLEHINT */}
            <div className="px-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-neutral-400 font-semibold block">
                    ITEMS WORN IN THIS LOOK (4)
                  </span>
                  <span className="text-xs font-semibold text-neutral-900 block truncate max-w-[220px]">
                    {customLookTitle ? `Formula: ${customLookTitle}` : "Sentuh pin di foto atau pilih item di bawah"}
                  </span>
                </div>

                <span className="text-[11px] font-mono font-medium text-neutral-500">
                  Total Dupe ~{totalDupePriceStr}
                </span>
              </div>

              {/* Horizontal Scrollable Product Shelf */}
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 snap-x">
                {slotEntries.map(({ key, item }) => {
                  const isLocked = lockedSlots[key];
                  const isHotspotActive = activeHotspot === key;

                  return (
                    <div
                      key={key}
                      onClick={() => setActiveHotspot(key)}
                      className={`snap-start shrink-0 w-44 bg-white border rounded-xl overflow-hidden p-2.5 transition-all cursor-pointer ${
                        isHotspotActive
                          ? "border-neutral-900 ring-2 ring-neutral-900 shadow-sm"
                          : "border-neutral-200/90 hover:border-neutral-400"
                      }`}
                    >
                      {/* Product Image Frame */}
                      <div className="relative w-full aspect-[4/4.5] bg-[#EFECE6] rounded-lg overflow-hidden border border-neutral-100">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover object-top transition-transform duration-300"
                        />
                        <span className="absolute top-1.5 left-1.5 w-4 h-4 rounded-full bg-white text-neutral-900 text-[8px] font-mono font-bold flex items-center justify-center shadow-xs">
                          {item.pinNumber}
                        </span>
                        <span
                          className="absolute bottom-1.5 right-1.5 w-3 h-3 rounded-full border border-white shadow-2xs"
                          style={{ backgroundColor: item.colorHex }}
                          title={item.colorName}
                        />
                      </div>

                      {/* Brand & Category */}
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-800">
                          {item.brand}
                        </span>
                        <span className="text-[8px] font-mono text-neutral-400">
                          {key === "outer" && genderMode === "hijab"
                            ? "Hijab · Modest"
                            : item.categoryLabel.split("·")[1]?.trim() || item.categoryLabel}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-[11px] font-semibold text-neutral-900 truncate mt-0.5" title={item.name}>
                        {item.name}
                      </h4>

                      {/* Price Comparison */}
                      <div className="mt-1 text-[10px] font-mono leading-tight">
                        <span className="text-neutral-400 block text-[9px]">Resmi: {item.officialPriceStr}</span>
                        <span className="font-semibold text-neutral-900 block">Dupe ({item.dupeBrand}): {item.priceStr}</span>
                      </div>

                      {/* Action Bar (Lock & Swap) */}
                      <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSlotLock(key);
                          }}
                          className={`flex-1 h-7 rounded text-[9px] font-mono font-medium flex items-center justify-center gap-1 transition-colors ${
                            isLocked
                              ? "bg-neutral-900 text-white"
                              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                          }`}
                          title="Kunci item saat acak"
                        >
                          {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                          <span>{isLocked ? "Terkunci" : "Kunci"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            swapSingleSlot(key);
                          }}
                          className="w-7 h-7 rounded bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 flex items-center justify-center transition-colors"
                          title={key === "outer" && genderMode === "hijab" ? "Ganti variasi Hijab" : "Ganti variasi pakaian"}
                        >
                          <RotateCw className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 02: PERSONAL COLOR LAB (CLEAN EDITORIAL) */
          <div className="px-4 pt-3 space-y-4">
            <div>
              <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.16em] text-neutral-400">
                PERSONAL COLOR LAB
              </span>
              <h2 className="text-xl font-serif text-neutral-900 mt-0.5">
                Kalibrasi Rona Kulit Tropis
              </h2>
              <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
                Pilih rona kulit dasar Anda untuk mengunci palet warna yang mencerahkan paras di bawah cahaya tropis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {SKIN_TONES_DRAPE.map((tone) => {
                const isActive = selectedSkinToneId === tone.id;
                return (
                  <button
                    key={tone.id}
                    type="button"
                    onClick={() => {
                      setSelectedSkinToneId(tone.id);
                      triggerToast(`Undertone: ${tone.nama}`);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isActive
                        ? "border-neutral-900 ring-2 ring-neutral-900 bg-neutral-50"
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    }`}
                  >
                    <span
                      className="block w-full h-8 rounded-lg mb-2 border border-black/5"
                      style={{ backgroundColor: tone.hex }}
                    />
                    <span className="text-xs font-semibold block text-neutral-900">{tone.nama}</span>
                    <span className="text-[9px] font-mono text-neutral-400 uppercase block">
                      {tone.season}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Palet Terbaik */}
            <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2">
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-neutral-500 block">
                Palet Harmonis: {activeSkinTone.nama}
              </span>
              <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-mono">
                {activeSkinTone.bestPalettes.map((p, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="h-10 rounded-md border border-black/5" style={{ backgroundColor: p.hex }} />
                    <span className="text-neutral-700 block truncate">{p.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveTab("mixer");
                handleShuffleUnlocked();
              }}
              className="w-full h-11 bg-neutral-900 text-white text-xs font-medium tracking-wide rounded-lg flex items-center justify-center gap-1.5 active:scale-[0.99] transition-transform"
            >
              <span>Terapkan ke Studio OOTD</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* DOCKED BOTTOM ACTION BAR (CLEAN STYLEHINT) */}
        <div className="fixed bottom-[60px] left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 px-4 py-2.5 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffleUnlocked}
              disabled={isShuffling}
              className="flex-1 h-11 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-lg flex items-center justify-center gap-2 active:scale-[0.99] transition-all shadow-xs"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isShuffling ? "animate-spin" : ""}`} />
              <span>Acak Kombinasi</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToWardrobe}
              className="h-11 px-4 bg-white border border-neutral-200 text-neutral-800 hover:border-neutral-400 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              title="Simpan ke Lemari"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDetailsDrawerOpen(true)}
              className="h-11 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-medium rounded-lg flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Belanja</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 🖥️ 2. DESKTOP VIEW (>= 768px): 2-COLUMN SPLIT WORKSTATION (STYLEHINT) */}
      {/* ===================================================================== */}
      <div className="hidden md:block w-full max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-neutral-400 font-semibold">
                LOOK.U STUDIO
              </span>
              <span className="text-xs text-neutral-400">•</span>
              <span className="text-xs font-medium text-neutral-500">
                StyleHint Curation Edition
              </span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-serif text-neutral-900 mt-1 font-normal tracking-tight">
              Outfit Curator &amp; Garment Workbench
            </h1>
          </div>

          <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("mixer")}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${
                activeTab === "mixer"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              01. Garment Workbench
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("colorlab")}
              className={`px-4 py-2 text-xs font-medium rounded-md transition-all ${
                activeTab === "colorlab"
                  ? "bg-white text-neutral-900 shadow-xs"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              02. Color Calibration ({activeSkinTone.nama})
            </button>
          </div>
        </div>

        {/* Preset Skena Filter Bar */}
        <div className="py-4 border-b border-neutral-100 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-400 mr-1 font-semibold">
              PRESET:
            </span>
            {SKENA_VIBES.map((vibe) => {
              const isSelected = selectedVibeId === vibe.id && !customLookTitle;
              return (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => handleSelectSkenaVibe(vibe)}
                  className={`px-3.5 py-1.5 text-xs rounded-full transition-all border ${
                    isSelected
                      ? "bg-neutral-900 text-white border-neutral-900 font-medium"
                      : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400"
                  }`}
                >
                  {vibe.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-medium">
            <button
              type="button"
              onClick={handleChangeGenderMode}
              className="px-3 py-1.5 rounded-md border border-neutral-200 hover:border-neutral-400 text-neutral-700 transition-colors"
            >
              {genderLabel} ↻
            </button>
            <button
              type="button"
              onClick={handleChangeWeatherMode}
              className="px-3 py-1.5 rounded-md border border-neutral-200 hover:border-neutral-400 text-neutral-700 transition-colors"
            >
              {weatherLabel} ↻
            </button>
            <button
              type="button"
              onClick={handleResetCanvas}
              className="px-3 py-1.5 text-neutral-400 hover:text-neutral-900 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>

        {activeTab === "mixer" ? (
          /* 12-COLUMN DESKTOP WORKSTATION */
          <div className="grid grid-cols-12 gap-8 mt-6 items-start">
            {/* LEFT 5-COL: EDITORIAL PHOTO DENGAN SHOPPABLE PINS & MODEL SPECS */}
            <div className="col-span-5 space-y-4 sticky top-24">
              {/* Context Anchor Pill when routed from Lookbook */}
              {customLookTitle && (
                <div className="p-3 bg-[#FAF8F5] border border-sand-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse shrink-0" />
                    <span className="text-xs font-mono text-[#5C554E] uppercase tracking-wider shrink-0">Kurasi Lookbook:</span>
                    <span className="text-sm font-bold text-charcoal-900 truncate">{customLookTitle}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLookTitle(null);
                      setCustomHeroImage(null);
                      setCustomLookTag(null);
                      setCustomModelSpec(null);
                      triggerToast("Kembali ke kurasi preset Studio");
                    }}
                    className="text-xs font-mono font-semibold text-terracotta-600 hover:text-terracotta-700 underline shrink-0 px-2 py-1"
                  >
                    Ganti Vibe ✕
                  </button>
                </div>
              )}
              <div className="relative w-full aspect-[4/5] bg-neutral-100 rounded-2xl overflow-hidden border border-neutral-200 shadow-sm group">
                <img
                  src={activeHeroImage}
                  alt={customLookTitle || currentVibeObj.label}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102"
                />

                {/* Top Overlay Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 bg-white/95 backdrop-blur-md text-neutral-900 text-[10px] font-mono font-medium uppercase tracking-[0.16em] rounded-full shadow-2xs">
                    {customLookTag || currentVibeObj.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomHeroImage(null);
                      setHeroImageIndex((prev) => prev + 1);
                      triggerToast("Visual gaya diperbarui");
                    }}
                    className="px-3 py-1 bg-white/95 backdrop-blur-md hover:bg-neutral-900 hover:text-white text-neutral-800 text-[10px] font-medium rounded-full shadow-2xs flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Ganti Foto</span>
                  </button>
                </div>

                {/* SHOPPABLE HOTSPOT PINS DI DESKTOP */}
                {slotEntries.map(({ key, item }) => {
                  const coords = currentVibeObj.pinCoords[key];
                  const isActive = activeHotspot === key;
                  return (
                    <div
                      key={key}
                      style={{ top: coords.top, left: coords.left }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveHotspot(isActive ? null : key)}
                        className="group relative flex items-center justify-center p-2.5"
                      >
                        <span className={`absolute w-8 h-8 rounded-full bg-white/70 transition-transform ${isActive ? "scale-125 bg-white" : "group-hover:scale-110"}`} />
                        <span className={`relative w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold transition-all shadow-md ${isActive ? "bg-neutral-900 text-white ring-2 ring-white" : "bg-white text-neutral-900 border border-neutral-300"}`}>
                          {item.pinNumber}
                        </span>
                      </button>

                      {/* Tooltip Hover/Click Desktop */}
                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 4 }}
                            className="absolute left-1/2 -translate-x-1/2 top-9 z-30 w-56 p-3 bg-white/95 backdrop-blur-md border border-neutral-200 rounded-xl shadow-xl text-neutral-900 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                                {item.categoryLabel}
                              </span>
                              <span className="text-[8px] font-bold bg-neutral-900 text-white px-1.5 py-0.5 rounded">
                                {item.brand}
                              </span>
                            </div>

                            <p className="text-xs font-semibold text-neutral-900 line-clamp-1">
                              {item.name}
                            </p>

                            <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-100 font-mono">
                              <span className="text-neutral-500">Resmi: {item.officialPriceStr}</span>
                              <span className="font-semibold text-neutral-900">Dupe ({item.dupeBrand}): {item.priceStr}</span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

              {/* MODEL SPECS CARD DESKTOP */}
              <div className="p-3.5 bg-neutral-50 border border-neutral-200/80 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-neutral-700">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">{customModelSpec?.height || currentVibeObj.modelSpec.height}</span>
                    <span>•</span>
                    <span>Size {customModelSpec?.size || currentVibeObj.modelSpec.size}</span>
                    <span>•</span>
                    <span>{customModelSpec?.silhouette || currentVibeObj.modelSpec.silhouette}</span>
                  </div>
                  <span className="text-neutral-500 font-medium">Sirkulasi Udara Optimal · Serat Bernapas</span>
                </div>
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {customLookTitle ? `Formula: ${customLookTitle}. ${currentVibeObj.tagline}` : currentVibeObj.tagline}
                </p>
              </div>

              {/* Action Buttons Desktop */}
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleShuffleUnlocked}
                  disabled={isShuffling}
                  className="flex-1 h-12 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isShuffling ? "animate-spin" : ""}`} />
                  <span>Acak Kombinasi</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToWardrobe}
                  className="h-12 px-5 bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-800 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Simpan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDetailsDrawerOpen(true)}
                  className="h-12 px-5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Belanja (4)</span>
                </button>
              </div>
            </div>

            {/* RIGHT 7-COL: 2x2 CLEAN PRODUCT WORKBENCH (STYLEHINT SHELF) */}
            <div className="col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-1">
                <div>
                  <span className="text-[10px] font-mono tracking-[0.16em] uppercase text-neutral-400 font-semibold block">
                    GARMENT COMPONENTS (4)
                  </span>
                  <span className="text-xs text-neutral-600">
                    Klik pin pada foto atau sesuaikan item pakaian di bawah ini
                  </span>
                </div>

                <div className="text-right text-xs font-mono">
                  <span className="text-neutral-400 block text-[10px]">Estimasi Total Dupe</span>
                  <span className="font-bold text-neutral-900">{totalDupePriceStr}</span>
                </div>
              </div>

              {/* 2x2 Grid of Elegant Clean Cards */}
              <div className="grid grid-cols-2 gap-4">
                {slotEntries.map(({ key, item }) => {
                  const isLocked = lockedSlots[key];
                  const isHotspotActive = activeHotspot === key;

                  return (
                    <div
                      key={key}
                      onMouseEnter={() => setActiveHotspot(key)}
                      onMouseLeave={() => setActiveHotspot(null)}
                      className={`p-3.5 bg-white border rounded-2xl transition-all space-y-3 ${
                        isHotspotActive
                          ? "border-neutral-900 ring-2 ring-neutral-900 shadow-sm"
                          : isLocked
                          ? "border-neutral-800 bg-neutral-50/40"
                          : "border-neutral-200/90 hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Clean Product Cutout/Image */}
                        <div className="relative w-20 h-24 bg-[#EFECE6] rounded-lg overflow-hidden border border-neutral-100 shrink-0">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover object-top transition-transform duration-300"
                          />
                          <span className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white text-neutral-900 text-[8px] font-mono font-bold flex items-center justify-center shadow-xs">
                            {item.pinNumber}
                          </span>
                          <span
                            className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-2xs"
                            style={{ backgroundColor: item.colorHex }}
                            title={item.colorName}
                          />
                        </div>

                        {/* Product Data */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-neutral-900">
                              {item.brand}
                            </span>
                            <span className="text-[9px] font-mono text-neutral-400 truncate">
                              {key === "outer" && genderMode === "hijab"
                                ? "Hijab · Modest"
                                : item.categoryLabel.split("·")[1]?.trim() || item.categoryLabel}
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-neutral-900 truncate mt-1" title={item.name}>
                            {item.name}
                          </h4>

                          <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                            {item.material}
                          </p>

                          <div className="mt-2 text-[10px] font-mono space-y-0.5">
                            <span className="text-neutral-400 block text-[9px]">Resmi: {item.officialPriceStr}</span>
                            <span className="font-semibold text-neutral-900 block">Dupe ({item.dupeBrand}): {item.priceStr}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom Controls */}
                      <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => toggleSlotLock(key)}
                            className={`h-7 px-2.5 rounded text-[10px] font-mono font-medium flex items-center gap-1 transition-colors ${
                              isLocked
                                ? "bg-neutral-900 text-white"
                                : "bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                            }`}
                          >
                            {isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                            <span>{isLocked ? "Terkunci" : "Kunci"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => swapSingleSlot(key)}
                            className="h-7 px-2.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-mono font-medium flex items-center gap-1 transition-colors"
                          >
                            <RotateCw className="w-2.5 h-2.5" />
                            <span>{key === "outer" && genderMode === "hijab" ? "Ganti Hijab" : "Ganti"}</span>
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <a
                            href={item.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="h-7 px-2 rounded bg-neutral-100 hover:bg-neutral-900 hover:text-white text-neutral-700 text-[9px] font-mono font-medium flex items-center justify-center transition-colors"
                            title="Toko Resmi"
                          >
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* TAB 02: PERSONAL COLOR LAB DESKTOP */
          <div className="mt-8 grid grid-cols-12 gap-8 items-start">
            <div className="col-span-5 space-y-4">
              <span className="text-xs font-mono font-medium uppercase tracking-[0.16em] text-neutral-400">
                PERSONAL COLOR LAB
              </span>
              <h2 className="text-2xl font-serif text-neutral-900">
                Kalibrasi Rona Kulit Nusantara
              </h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Pilih rona kulit dasar Anda untuk mengunci palet pakaian yang memancarkan kecerahan wajah alami di bawah pencahayaan tropis.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                {SKIN_TONES_DRAPE.map((tone) => {
                  const isActive = selectedSkinToneId === tone.id;
                  return (
                    <button
                      key={tone.id}
                      type="button"
                      onClick={() => {
                        setSelectedSkinToneId(tone.id);
                        triggerToast(`Undertone: ${tone.nama}`);
                      }}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        isActive
                          ? "border-neutral-900 ring-2 ring-neutral-900 bg-neutral-50 shadow-xs"
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                    >
                      <span
                        className="block w-full h-10 mb-2.5 rounded-lg border border-black/5"
                        style={{ backgroundColor: tone.hex }}
                      />
                      <span className="text-sm font-semibold block text-neutral-900">{tone.nama}</span>
                      <span className="text-[10px] font-mono text-neutral-400 uppercase block mt-0.5">
                        {tone.season}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-7 bg-white border border-neutral-200 rounded-2xl p-6 space-y-6 shadow-xs">
              <div>
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-neutral-600 block mb-2">
                  Palet Paling Cerah: {activeSkinTone.nama} ({activeSkinTone.season})
                </span>
                <p className="text-xs text-neutral-500 mb-4">{activeSkinTone.deskripsi}</p>
                <div className="grid grid-cols-4 gap-3 text-center text-xs font-mono">
                  {activeSkinTone.bestPalettes.map((p, idx) => (
                    <div key={idx} className="p-2.5 border border-neutral-100 bg-neutral-50 rounded-xl space-y-1">
                      <div className="h-14 rounded-lg border border-black/5 mb-2" style={{ backgroundColor: p.hex }} />
                      <span className="block font-semibold text-neutral-900">{p.name}</span>
                      <span className="text-[10px] text-neutral-400">{p.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <span className="text-xs font-mono font-medium uppercase tracking-wider text-neutral-400 block mb-2">
                  Hindari Warna Ini (Washed Out)
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeSkinTone.avoidPalettes.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-neutral-100 rounded-md text-neutral-700 text-xs font-mono"
                    >
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("mixer");
                  handleShuffleUnlocked();
                }}
                className="w-full h-12 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-medium tracking-wide rounded-xl transition-colors"
              >
                Terapkan Palet {activeSkinTone.nama} ke Workbench OOTD →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. MODAL RINCIAN BELANJA (RESMI VS DUPE)                              */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isDetailsDrawerOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsDrawerOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              className="relative z-[70] w-full sm:max-w-xl bg-white border border-neutral-200 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden rounded-t-2xl sm:rounded-2xl"
            >
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-white shrink-0">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                    STYLEHINT BRAND AGGREGATOR
                  </span>
                  <h3 className="font-serif text-lg font-medium text-neutral-900 mt-0.5">
                    Rincian Belanja Resmi &amp; Alternatif Dupe
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailsDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs bg-white">
                {slotEntries.map(({ key, item }) => (
                  <div
                    key={key}
                    className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-16 bg-[#EFECE6] rounded-md border border-neutral-200 shrink-0 overflow-hidden relative">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover object-top transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-neutral-900 text-white text-[8px] font-mono font-bold uppercase rounded">
                            {item.brand}
                          </span>
                          <span className="text-[9px] font-mono text-neutral-400 uppercase">
                            {item.categoryLabel}
                          </span>
                        </div>
                        <h4 className="font-semibold text-neutral-900 text-xs sm:text-sm truncate mt-1">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-neutral-500">
                          Resmi: {item.officialPriceStr} • Dupe ({item.dupeBrand}): {item.priceStr}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-neutral-900 text-white text-[10px] font-medium rounded hover:bg-neutral-800 transition-colors"
                      >
                        Resmi
                      </a>
                      <a
                        href={`https://shopee.co.id/search?keyword=${encodeURIComponent(item.shopeeQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#EE4D2D] text-white text-[10px] font-medium rounded hover:opacity-90 transition-opacity"
                      >
                        Shopee
                      </a>
                      <a
                        href={`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(item.tokopediaQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-[#03AC0E] text-white text-[10px] font-medium rounded hover:opacity-90 transition-opacity"
                      >
                        Tokopedia
                      </a>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between mt-3">
                  <div>
                    <span className="font-mono uppercase font-semibold text-neutral-500 block text-[10px]">
                      Estimasi Total Belanja (Opsi Dupe Hemat)
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Hemat ~65% dibanding harga ritel penuh ({totalOfficialPriceStr})
                    </span>
                  </div>
                  <span className="font-mono font-bold text-lg text-neutral-900">
                    {totalDupePriceStr}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
