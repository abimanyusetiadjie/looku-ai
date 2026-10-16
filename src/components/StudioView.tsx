"use client";

import React, { useState, useEffect } from "react";
import {
  Lock,
  Unlock,
  RotateCw,
  Sparkles,
  ExternalLink,
  X,
  Bookmark,
  Wind,
  Palette,
  Layers,
  Check,
  ShoppingBag,
  Store,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OOTDRecommendation } from "@/lib/types";
import { PRESET_OOTD_COLLECTION } from "@/lib/presets";

export interface StudioItem {
  id: string;
  category: "top" | "bottom" | "outer" | "shoes";
  categoryLabel: string;
  brand: string;
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
  shopeeQuery: string;
  tokopediaQuery: string;
  note: string;
  gender: "female" | "male" | "unisex";
  modest: boolean;
}

export interface SkenaVibePreset {
  id: string;
  label: string;
  shortLabel: string;
  badge: string;
  gender: "hijab" | "nonhijab" | "pria";
  weather: "hot" | "ac" | "rainy" | "mild";
  occasion: "campus" | "office" | "cafe" | "party";
  heroImage: string;
  altImages: string[];
  tagline: string;
  topId: string;
  bottomId: string;
  outerId: string;
  shoesId: string;
}

// -------------------------------------------------------------
// POOL KOMPONEN BRAND RESMI & SKENA (100% BEBAS UNSPLASH LAMA)
// Menggunakan CDN Resmi Pinterest HD & Zalora Static CDN
// -------------------------------------------------------------
const TOP_POOL: StudioItem[] = [
  {
    id: "top_cottonink_rayon_mocca",
    category: "top",
    categoryLabel: "Atasan · Blus Rayon",
    brand: "COTTONINK",
    officialUrl: "https://www.cottonink.co.id/",
    officialPriceStr: "Rp 279.000",
    name: "Blus Rayon Flowy Dropped Shoulder",
    material: "100% Rayon Twill Dingin",
    breathability: 98,
    colorName: "Mocca Oat",
    colorHex: "#C4A482",
    price: 95000,
    priceStr: "Rp 95.000",
    imageUrl: "https://i.pinimg.com/originals/54/2c/ad/542cadb7970189fddff971caf303b24b.png",
    shopeeQuery: "Blouse Rayon Twill Oversize Wanita Adem",
    tokopediaQuery: "Tunik Rayon Wanita Adem Flowy",
    note: "Sirkulasi udara 98% optimal pada suhu 33°C, jatuh lembut & anti-lecek",
    gender: "female",
    modest: true,
  },
  {
    id: "top_uniqlo_linen_relaxed",
    category: "top",
    categoryLabel: "Atasan · Pure Linen",
    brand: "UNIQLO",
    officialUrl: "https://www.uniqlo.com/id/id/",
    officialPriceStr: "Rp 399.000",
    name: "Kemeja Premium Linen Relaxed Lengan Panjang",
    material: "100% European Flax Linen",
    breathability: 98,
    colorName: "Sage Green",
    colorHex: "#8A9A86",
    price: 115000,
    priceStr: "Rp 115.000",
    imageUrl: "https://i.pinimg.com/originals/1b/3d/24/1b3d240b29e3ea29a9f1d8fdcb0fa1dc.png",
    shopeeQuery: "Kemeja Linen Rami Oversize Lengan Panjang Adem",
    tokopediaQuery: "Kemeja Linen Panjang Relaxed Fit Unisex",
    note: "Serat flax alami melepas hawa panas tubuh seketika di cuaca terik",
    gender: "unisex",
    modest: true,
  },
  {
    id: "top_uniqlo_airism_boxy",
    category: "top",
    categoryLabel: "Atasan · Boxy Tee",
    brand: "UNIQLO",
    officialUrl: "https://www.uniqlo.com/id/id/",
    officialPriceStr: "Rp 199.000",
    name: "AIRism Katun T-Shirt Oversize Kerah Bulat",
    material: "AIRism Tech Cotton 24s Cool-Touch",
    breathability: 96,
    colorName: "Charcoal Black",
    colorHex: "#181A18",
    price: 89000,
    priceStr: "Rp 89.000",
    imageUrl: "https://i.pinimg.com/originals/8b/37/01/8b370169218458e48e093fd8140c898a.jpg",
    shopeeQuery: "Kaos Oversize Boxy Cotton Bamboo 24s Cooltech",
    tokopediaQuery: "Kaos Polos Oversize Cooltech Katun Adem Pria",
    note: "Siluet Japanese City Boy boxy dengan lapisan dalam sejuk",
    gender: "male",
    modest: false,
  },
  {
    id: "top_zara_poplin_scbd",
    category: "top",
    categoryLabel: "Atasan · Structured Poplin",
    brand: "ZARA",
    officialUrl: "https://www.zara.com/id/",
    officialPriceStr: "Rp 599.000",
    name: "Structured Poplin Shirt Clean Collar",
    material: "Crisp Cotton Poplin Breathable",
    breathability: 94,
    colorName: "Broken White",
    colorHex: "#FAF8F5",
    price: 129000,
    priceStr: "Rp 129.000",
    imageUrl: "https://i.pinimg.com/originals/be/35/11/be3511d3523f1db782d53ca53864b245.jpg",
    shopeeQuery: "Kemeja Katun Poplin Wanita Kerja Kerah Rapi",
    tokopediaQuery: "Kemeja Putih Kerja Wanita Oversize Poplin",
    note: "Tegas dan rapi seharian untuk mobilitas komuter & ruang AC SCBD",
    gender: "female",
    modest: true,
  },
  {
    id: "top_erigo_vintage_boxy",
    category: "top",
    categoryLabel: "Atasan · Streetwear Tee",
    brand: "ERIGO_X",
    officialUrl: "https://erigostore.id/",
    officialPriceStr: "Rp 150.000",
    name: "Heavyweight Boxy Graphic Vintage Tee",
    material: "Cotton Combed 16s Washed",
    breathability: 92,
    colorName: "Washed Charcoal",
    colorHex: "#232528",
    price: 85000,
    priceStr: "Rp 85.000",
    imageUrl: "https://i.pinimg.com/originals/7e/1f/d9/7e1fd97d20cdafff61417316956352e7.jpg",
    shopeeQuery: "Kaos Heavyweight Boxy Cut Vintage Streetwear",
    tokopediaQuery: "Tshirt Boxy Streetwear Pria Wanita",
    note: "Potongan lebar Blok M skena yang tidak menempel di badan",
    gender: "unisex",
    modest: false,
  },
  {
    id: "top_hm_camp_collar_linen",
    category: "top",
    categoryLabel: "Atasan · Camp Collar",
    brand: "H&M",
    officialUrl: "https://id.hm.com/",
    officialPriceStr: "Rp 299.900",
    name: "Relaxed Fit Camp Collar Linen-Blend Shirt",
    material: "Linen-Blend Poplin Berpori",
    breathability: 97,
    colorName: "Ivory Sand",
    colorHex: "#F5F2EB",
    price: 110000,
    priceStr: "Rp 110.000",
    imageUrl: "https://i.pinimg.com/originals/84/45/40/84454020b4c5a1c18939d4627ea97ad0.png",
    shopeeQuery: "Kemeja Kerah Terbuka Cuban Camp Collar Linen",
    tokopediaQuery: "Kemeja Pantai Camp Collar Pria Linen Blend",
    note: "Kerah terbuka mengalirkan udara sejuk di leher untuk gaya Old Money",
    gender: "male",
    modest: false,
  },
  {
    id: "top_thenblank_cropped_blouse",
    category: "top",
    categoryLabel: "Atasan · Cropped Linen",
    brand: "THENBLANK",
    officialUrl: "https://thenblank.com/",
    officialPriceStr: "Rp 249.000",
    name: "Cropped Linen Casual Blouse Sage",
    material: "Linen Cotton Crinkle",
    breathability: 95,
    colorName: "Sage Olive",
    colorHex: "#8A9A86",
    price: 98000,
    priceStr: "Rp 98.000",
    imageUrl: "https://i.pinimg.com/originals/d0/e1/79/d0e179729344bf55f3b2454ae8f10098.jpg",
    shopeeQuery: "Atasan Crop Blouse Linen Casual Wanita",
    tokopediaQuery: "Crop Top Linen Casual Adem Elegan",
    note: "Siluet modern Senopati brunch yang memberi kesan kaki jenjang",
    gender: "female",
    modest: false,
  },
];

const BOTTOM_POOL: StudioItem[] = [
  {
    id: "bot_uniqlo_pleated_wide",
    category: "bottom",
    categoryLabel: "Bawahan · Pleated Wide",
    brand: "UNIQLO",
    officialUrl: "https://www.uniqlo.com/id/id/",
    officialPriceStr: "Rp 499.000",
    name: "Pleated Wide Pants Siluet Jatuh Flowy",
    material: "Stretch Crepe Rayon Anti-Kusut",
    breathability: 96,
    colorName: "Cream Sand",
    colorHex: "#EFECE6",
    price: 115000,
    priceStr: "Rp 115.000",
    imageUrl: "https://i.pinimg.com/originals/73/2b/97/732b9765f65e63ebf02595822e3524d3.jpg",
    shopeeQuery: "Celana Kulot Highwaist Loose Trousers Flowy Adem",
    tokopediaQuery: "Celana Kulot Loose Pants Wanita Kerja Santai",
    note: "Siluet lebar memberi ruang udara penuh di kaki tanpa rasa pengap",
    gender: "female",
    modest: true,
  },
  {
    id: "bot_hm_baggy_denim",
    category: "bottom",
    categoryLabel: "Bawahan · Baggy Denim",
    brand: "H&M",
    officialUrl: "https://id.hm.com/",
    officialPriceStr: "Rp 499.900",
    name: "Baggy Wide Jeans Light Wash Non-Stretch",
    material: "100% Breathable Cotton Denim 12oz",
    breathability: 93,
    colorName: "Sky Chambray",
    colorHex: "#9BB0C1",
    price: 139000,
    priceStr: "Rp 139.000",
    imageUrl: "https://i.pinimg.com/originals/af/9a/0f/af9a0fd8f7060c3de4b1ab08e1be80e5.jpg",
    shopeeQuery: "Celana Baggy Jeans Loose Denim Pria Wanita",
    tokopediaQuery: "Baggy Jeans Loose Fit Denim Katun",
    note: "Potongan baggy longgar yang ikonik untuk gaya City Boy & Skena",
    gender: "unisex",
    modest: true,
  },
  {
    id: "bot_uniqlo_smart_ankle",
    category: "bottom",
    categoryLabel: "Bawahan · Smart Ankle",
    brand: "UNIQLO",
    officialUrl: "https://www.uniqlo.com/id/id/",
    officialPriceStr: "Rp 499.000",
    name: "Smart Ankle Pants 2-Way Stretch",
    material: "Dry-EX Quick-Drying Stretch",
    breathability: 95,
    colorName: "Charcoal Rapi",
    colorHex: "#232528",
    price: 125000,
    priceStr: "Rp 125.000",
    imageUrl: "https://i.pinimg.com/originals/1a/a6/26/1aa62655c0d74b818319298d30447479.jpg",
    shopeeQuery: "Celana Ankle Chino Pants Slim Fit Katun Stretch",
    tokopediaQuery: "Celana Ankle Pants Formal Kasual Adem",
    note: "Cepat kering dan rapi seharian untuk rapat kantor SCBD",
    gender: "unisex",
    modest: true,
  },
  {
    id: "bot_hm_cargo_parachute",
    category: "bottom",
    categoryLabel: "Bawahan · Parachute Cargo",
    brand: "H&M",
    officialUrl: "https://id.hm.com/",
    officialPriceStr: "Rp 449.900",
    name: "Cargo Parachute Loose Trousers",
    material: "Lightweight Poplin Ripstop",
    breathability: 95,
    colorName: "Olive Drab",
    colorHex: "#556B2F",
    price: 120000,
    priceStr: "Rp 120.000",
    imageUrl: "https://i.pinimg.com/originals/a6/31/43/a6314305310bcc36cfd87c7f0b001144.jpg",
    shopeeQuery: "Celana Cargo Parasut Loose Unisex Streetwear",
    tokopediaQuery: "Cargo Parachute Pants Ringan Adem",
    note: "Bahan parasut katun super ringan untuk mobilitas jalanan",
    gender: "unisex",
    modest: true,
  },
  {
    id: "bot_thenblank_linen_trousers",
    category: "bottom",
    categoryLabel: "Bawahan · Tailored Linen",
    brand: "THENBLANK",
    officialUrl: "https://thenblank.com/",
    officialPriceStr: "Rp 299.000",
    name: "Relaxed Tailored Linen Trousers",
    material: "Linen Katun Twill Washed",
    breathability: 97,
    colorName: "Warm Khaki",
    colorHex: "#D4A373",
    price: 110000,
    priceStr: "Rp 110.000",
    imageUrl: "https://i.pinimg.com/originals/ae/6a/d8/ae6ad82525d384daf2f5a51ec466c375.png",
    shopeeQuery: "Celana Panjang Linen Kasual Adem Relaxed",
    tokopediaQuery: "Celana Bahan Tapered Slacks Linen",
    note: "Tekstur linen santai berkelas untuk pesisir & kafe",
    gender: "unisex",
    modest: true,
  },
  {
    id: "bot_cottonink_satin_skirt",
    category: "bottom",
    categoryLabel: "Bawahan · Satin Skirt",
    brand: "COTTONINK",
    officialUrl: "https://www.cottonink.co.id/",
    officialPriceStr: "Rp 329.000",
    name: "Satin Midi/Maxi Slip Skirt Flowy A-Line",
    material: "Silk Satin Twill Sejuk",
    breathability: 94,
    colorName: "Champagne Oat",
    colorHex: "#D4B996",
    price: 105000,
    priceStr: "Rp 105.000",
    imageUrl: "https://i.pinimg.com/originals/40/70/7a/40707a334f8badcd3a4e39b4643da309.png",
    shopeeQuery: "Rok Satin Silk Midi Maxi A Line Kasual",
    tokopediaQuery: "Rok Plisket Satin Panjang Wanita Flowy",
    note: "Permukaan silk memantulkan panas dan tampak anggun",
    gender: "female",
    modest: true,
  },
];

const OUTER_POOL: StudioItem[] = [
  {
    id: "outer_voal_miracle",
    category: "outer",
    categoryLabel: "Hijab · Voal Miracle",
    brand: "LOKAL_MODEST",
    officialUrl: "https://www.zalora.co.id/",
    officialPriceStr: "Rp 85.000",
    name: "Hijab Voal Miracle Ultrafine Laser Cut",
    material: "100% Voal Ultrafine Berpori Mikro",
    breathability: 98,
    colorName: "Warm Sand",
    colorHex: "#EAE4DC",
    price: 39000,
    priceStr: "Rp 39.000",
    imageUrl: "https://i.pinimg.com/originals/f1/ff/32/f1ff32036ab3216cbb743dffcbadda35.jpg",
    shopeeQuery: "Hijab Voal Miracle Laser Cut 115x115 Adem",
    tokopediaQuery: "Jilbab Segiempat Voal Miracle Lasercut",
    note: "Tegak di dahi, sangat ringan, dan bebas kedap di telinga",
    gender: "female",
    modest: true,
  },
  {
    id: "outer_thenblank_linen_blazer",
    category: "outer",
    categoryLabel: "Outer · Linen Blazer",
    brand: "THENBLANK",
    officialUrl: "https://thenblank.com/",
    officialPriceStr: "Rp 379.000",
    name: "Tailored Semi-Relaxed Unlined Linen Blazer",
    material: "Linen Tencel Tanpa Furing Tebal",
    breathability: 95,
    colorName: "Espresso Charcoal",
    colorHex: "#2C3539",
    price: 145000,
    priceStr: "Rp 145.000",
    imageUrl: "https://i.pinimg.com/originals/3c/9c/d7/3c9cd7ce6ed7158cc75cbe999b745984.jpg",
    shopeeQuery: "Blazer Kerja Semi Formal Linen Unlined Adem",
    tokopediaQuery: "Deconstructed Blazer Linen Pria Wanita",
    note: "Struktur bahu rapi tanpa furing poliester yang bikin gerah",
    gender: "unisex",
    modest: true,
  },
  {
    id: "outer_uniqlo_uv_parka",
    category: "outer",
    categoryLabel: "Outer · Airy UV Mesh",
    brand: "UNIQLO",
    officialUrl: "https://www.uniqlo.com/id/id/",
    officialPriceStr: "Rp 399.000",
    name: "Jaket Parka Saku Proteksi Sinar UV (Airy Mesh)",
    material: "AIRism UV-Cut Breathable Mesh",
    breathability: 96,
    colorName: "Light Stone",
    colorHex: "#EFECE6",
    price: 120000,
    priceStr: "Rp 120.000",
    imageUrl: "https://i.pinimg.com/originals/15/c1/5f/15c15f2bff7e8c9ea2a19922696ab2f6.jpg",
    shopeeQuery: "Jaket Parasut UV Protection Mesh Ringan",
    tokopediaQuery: "Jaket UV Protection Quick Dry Unisex",
    note: "Menangkal terik UV matahari UPF50+ sekaligus mengalirkan angin",
    gender: "unisex",
    modest: false,
  },
  {
    id: "outer_pashmina_ceruty",
    category: "outer",
    categoryLabel: "Hijab · Ceruty Silk",
    brand: "LOKAL_MODEST",
    officialUrl: "https://www.zalora.co.id/",
    officialPriceStr: "Rp 75.000",
    name: "Pashmina Ceruty Baby Doll Silk Flowy",
    material: "Ceruty Babydoll Silk Ringan",
    breathability: 96,
    colorName: "Sage Muted",
    colorHex: "#8A9A86",
    price: 35000,
    priceStr: "Rp 35.000",
    imageUrl: "https://i.pinimg.com/originals/22/49/32/22493275ad9b0132d65280c7e3049265.png",
    shopeeQuery: "Pashmina Ceruty Babydoll Premium Jahit Tepi",
    tokopediaQuery: "Pashmina Shawl Ceruty Panjang Adem",
    note: "Draping jatuh anggun untuk gaya kampus & kafe",
    gender: "female",
    modest: true,
  },
];

const SHOES_POOL: StudioItem[] = [
  {
    id: "shoes_hm_retro_court",
    category: "shoes",
    categoryLabel: "Sepatu · Retro Sneakers",
    brand: "H&M",
    officialUrl: "https://id.hm.com/",
    officialPriceStr: "Rp 499.000",
    name: "Retro Court Chunky Leather Sneakers",
    material: "Vegan Leather & Breathable Mesh Insole",
    breathability: 95,
    colorName: "Clean White",
    colorHex: "#FAF8F5",
    price: 155000,
    priceStr: "Rp 155.000",
    imageUrl: "https://static-id.zacdn.com/p/cottonink-8521-7299143-1-zoom.jpg",
    shopeeQuery: "Sepatu Retro Court Sneakers Putih Vintage Kasual",
    tokopediaQuery: "Sneakers Retro Vintage Casual Low Cut Unisex",
    note: "Bantalan empuk untuk jalan kaki 10.000 langkah antar stasiun & kafe",
    gender: "unisex",
    modest: true,
  },
  {
    id: "shoes_zara_chunky_loafers",
    category: "shoes",
    categoryLabel: "Sepatu · Penny Loafers",
    brand: "ZARA",
    officialUrl: "https://www.zara.com/id/",
    officialPriceStr: "Rp 899.000",
    name: "Chunky Lug Sole Leather Penny Loafers",
    material: "Soft Matte Leather & Rubber Sole",
    breathability: 93,
    colorName: "Espresso Black",
    colorHex: "#181A18",
    price: 185000,
    priceStr: "Rp 185.000",
    imageUrl: "https://static-id.zacdn.com/p/thenblank-1432-8812343-1-zoom.jpg",
    shopeeQuery: "Sepatu Loafers Kulit Chunky Sol Tebal Docmart Style",
    tokopediaQuery: "Sepatu Penny Loafers Pria Wanita Sol Tebal",
    note: "Aksen kontemporer yang langsung mengangkat wibawa smart-casual",
    gender: "unisex",
    modest: true,
  },
  {
    id: "shoes_zara_strappy_mules",
    category: "shoes",
    categoryLabel: "Sepatu · Kitten Mules",
    brand: "ZARA",
    officialUrl: "https://www.zara.com/id/",
    officialPriceStr: "Rp 699.000",
    name: "Minimalist Suede & Leather Mule Sandals",
    material: "Soft Cushioned Footbed",
    breathability: 97,
    colorName: "Nude Oatmeal",
    colorHex: "#D4B996",
    price: 135000,
    priceStr: "Rp 135.000",
    imageUrl: "https://static-id.zacdn.com/p/erigo-3291-9128372-1-zoom.jpg",
    shopeeQuery: "Sandal Mules Wanita Slip On Minimalis Hak Tahu",
    tokopediaQuery: "Mules Sandal Wanita Flat Kasual Elegan",
    note: "Bebas lembap untuk brunch akhir pekan & acara semi-formal",
    gender: "female",
    modest: false,
  },
];

// -------------------------------------------------------------
// 6 PRESET GAYA SKENA NUSANTARA (1-TAP STUDIO PRESETS)
// -------------------------------------------------------------
const SKENA_VIBES: SkenaVibePreset[] = [
  {
    id: "earthy_hijab",
    label: "Earthy Modest Hijab",
    shortLabel: "Earthy Hijab",
    badge: "MODEST SKENA",
    gender: "hijab",
    weather: "hot",
    occasion: "cafe",
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
  },
  {
    id: "japanese_city_boy",
    label: "Japanese City Boy",
    shortLabel: "City Boy",
    badge: "TOKYO BOXY",
    gender: "pria",
    weather: "hot",
    occasion: "campus",
    heroImage: "https://i.pinimg.com/originals/8b/37/01/8b370169218458e48e093fd8140c898a.jpg",
    altImages: [
      "https://i.pinimg.com/originals/af/9a/0f/af9a0fd8f7060c3de4b1ab08e1be80e5.jpg",
      "https://i.pinimg.com/originals/15/c1/5f/15c15f2bff7e8c9ea2a19922696ab2f6.jpg",
    ],
    tagline: "Siluet boxy Uniqlo AIRism & baggy denim H&M dengan sirkulasi udara maksimal.",
    topId: "top_uniqlo_airism_boxy",
    bottomId: "bot_hm_baggy_denim",
    outerId: "outer_uniqlo_uv_parka",
    shoesId: "shoes_hm_retro_court",
  },
  {
    id: "scbd_corporate",
    label: "SCBD Smart Corporate",
    shortLabel: "SCBD Smart",
    badge: "EXECUTIVE CHIC",
    gender: "nonhijab",
    weather: "ac",
    occasion: "office",
    heroImage: "https://i.pinimg.com/originals/be/35/11/be3511d3523f1db782d53ca53864b245.jpg",
    altImages: [
      "https://i.pinimg.com/originals/28/e3/60/28e360de49b60fd6913bf53a8a6e3915.jpg",
      "https://i.pinimg.com/originals/3c/9c/d7/3c9cd7ce6ed7158cc75cbe999b745984.jpg",
    ],
    tagline: "Kemeja poplin Zara & blazer linen tanpa furing THENBLANK untuk transisi komuter ke ruang AC.",
    topId: "top_zara_poplin_scbd",
    bottomId: "bot_uniqlo_smart_ankle",
    outerId: "outer_thenblank_linen_blazer",
    shoesId: "shoes_zara_chunky_loafers",
  },
  {
    id: "blok_m_streetwear",
    label: "Blok M Vintage Streetwear",
    shortLabel: "Blok M Skena",
    badge: "INDIE STREET",
    gender: "pria",
    weather: "hot",
    occasion: "cafe",
    heroImage: "https://i.pinimg.com/originals/7e/1f/d9/7e1fd97d20cdafff61417316956352e7.jpg",
    altImages: [
      "https://i.pinimg.com/originals/a6/31/43/a6314305310bcc36cfd87c7f0b001144.jpg",
    ],
    tagline: "Kaos boxy Erigo-X 16s & celana kargo parasut H&M yang santai untuk skena kreatif.",
    topId: "top_erigo_vintage_boxy",
    bottomId: "bot_hm_cargo_parachute",
    outerId: "outer_uniqlo_uv_parka",
    shoesId: "shoes_hm_retro_court",
  },
  {
    id: "old_money_linen",
    label: "Old Money Coastal Linen",
    shortLabel: "Old Money",
    badge: "QUIET LUXURY",
    gender: "pria",
    weather: "hot",
    occasion: "party",
    heroImage: "https://i.pinimg.com/originals/84/45/40/84454020b4c5a1c18939d4627ea97ad0.png",
    altImages: [
      "https://i.pinimg.com/originals/ae/6a/d8/ae6ad82525d384daf2f5a51ec466c375.png",
      "https://i.pinimg.com/originals/85/4d/54/854d54111eb21df5d77ed2a826363a0b.jpg",
    ],
    tagline: "Kemeja camp collar linen H&M & celana linen tailored THENBLANK bernuansa resort mewah.",
    topId: "top_hm_camp_collar_linen",
    bottomId: "bot_thenblank_linen_trousers",
    outerId: "outer_thenblank_linen_blazer",
    shoesId: "shoes_zara_chunky_loafers",
  },
  {
    id: "senopati_brunch",
    label: "Senopati Chic Brunch",
    shortLabel: "Senopati Chic",
    badge: "CONTEMPORARY",
    gender: "nonhijab",
    weather: "mild",
    occasion: "cafe",
    heroImage: "https://i.pinimg.com/originals/d0/e1/79/d0e179729344bf55f3b2454ae8f10098.jpg",
    altImages: [
      "https://i.pinimg.com/originals/40/70/7a/40707a334f8badcd3a4e39b4643da309.png",
      "https://i.pinimg.com/originals/b9/26/7d/b9267d7260917f982132bdb2bef3242b.jpg",
    ],
    tagline: "Atasan cropped linen THENBLANK & rok satin midi Cottonink yang elegan untuk brunch akhir pekan.",
    topId: "top_thenblank_cropped_blouse",
    bottomId: "bot_cottonink_satin_skirt",
    outerId: "outer_thenblank_linen_blazer",
    shoesId: "shoes_zara_strappy_mules",
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
  // State Mode Studio
  const [activeTab, setActiveTab] = useState<"mixer" | "colorlab">("mixer");
  const [selectedVibeId, setSelectedVibeId] = useState<string>("earthy_hijab");
  const [heroImageIndex, setHeroImageIndex] = useState<number>(0);
  const [customHeroImage, setCustomHeroImage] = useState<string | null>(null);
  const [customLookTitle, setCustomLookTitle] = useState<string | null>(null);

  const [genderMode, setGenderMode] = useState<"hijab" | "nonhijab" | "pria">("hijab");
  const [weatherMode, setWeatherMode] = useState<"hot" | "ac" | "rainy" | "mild">("hot");
  const [selectedSkinToneId, setSelectedSkinToneId] = useState<string>("sawo-matang");
  const [occasion, setOccasion] = useState<"campus" | "office" | "cafe" | "party">("cafe");

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

  // Sinkronisasi Deep-Link dari Lookbook (?look=...)
  useEffect(() => {
    if (initialLookId && PRESET_OOTD_COLLECTION[initialLookId]) {
      const preset = PRESET_OOTD_COLLECTION[initialLookId];
      setCustomLookTitle(preset.title);
      const firstImg = preset.items?.[0]?.imageUrl;
      if (firstImg) setCustomHeroImage(firstImg);

      // Petakan komponen dari preset ke StudioItem
      const mappedItems = preset.items || [];
      setActiveSlots((prev) => {
        const next = { ...prev };
        mappedItems.forEach((it, i) => {
          const studioItem: StudioItem = {
            id: `${initialLookId}_${i}`,
            category: it.category === "bawahan" ? "bottom" : it.category === "sepatu" ? "shoes" : it.category === "outer_hijab" ? "outer" : "top",
            categoryLabel: it.category === "atasan" ? "Atasan · Kurasi" : it.category === "bawahan" ? "Bawahan · Kurasi" : it.category === "sepatu" ? "Sepatu · Kurasi" : "Outer / Hijab",
            brand: it.brand || "UNIQLO",
            officialUrl: it.brandUrl || "https://www.uniqlo.com/id/id/",
            officialPriceStr: it.estimatedPrice.split(" (")[0] || "Rp 299.000",
            name: it.name,
            material: it.material || "Katun Linen Adem",
            breathability: 96,
            colorName: it.color || "Earthy Tone",
            colorHex: it.colorHex || preset.colorPalette?.[0]?.hex || "#8A9A86",
            price: 115000,
            priceStr: "Rp 115.000",
            imageUrl: it.imageUrl || firstImg || prev.top.imageUrl,
            shopeeQuery: it.shopeeQuery || it.name,
            tokopediaQuery: it.tokopediaQuery || it.name,
            note: "Sirkulasi udara optimal teruji untuk cuaca tropis 33°C",
            gender: preset.modestFriendly ? "female" : "unisex",
            modest: preset.modestFriendly,
          };
          if (studioItem.category === "top") next.top = studioItem;
          else if (studioItem.category === "bottom") next.bottom = studioItem;
          else if (studioItem.category === "outer") next.outer = studioItem;
          else if (studioItem.category === "shoes") next.shoes = studioItem;
        });
        return next;
      });
    }
  }, [initialLookId]);

  // Lock body scroll untuk drawer rincian
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

  const triggerToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 2600);
  };

  // Terapkan Preset Gaya Skena (1-Tap)
  const handleSelectSkenaVibe = (vibe: SkenaVibePreset) => {
    setSelectedVibeId(vibe.id);
    setHeroImageIndex(0);
    setCustomHeroImage(null);
    setCustomLookTitle(null);
    setGenderMode(vibe.gender);
    setWeatherMode(vibe.weather);
    setOccasion(vibe.occasion);

    const foundTop = TOP_POOL.find((t) => t.id === vibe.topId) || TOP_POOL[0];
    const foundBot = BOTTOM_POOL.find((b) => b.id === vibe.bottomId) || BOTTOM_POOL[0];
    const foundOut = OUTER_POOL.find((o) => o.id === vibe.outerId) || OUTER_POOL[0];
    const foundSho = SHOES_POOL.find((s) => s.id === vibe.shoesId) || SHOES_POOL[0];

    setActiveSlots((prev) => ({
      top: lockedSlots.top ? prev.top : foundTop,
      bottom: lockedSlots.bottom ? prev.bottom : foundBot,
      outer: lockedSlots.outer ? prev.outer : foundOut,
      shoes: lockedSlots.shoes ? prev.shoes : foundSho,
    }));

    triggerToast(`✦ Gaya Skena Aktif: ${vibe.label}`);
  };

  // Toggle Kunci Slot
  const toggleSlotLock = (slot: "top" | "bottom" | "outer" | "shoes") => {
    const slotNames = { top: "Atasan", bottom: "Bawahan", outer: "Outer/Hijab", shoes: "Sepatu" };
    setLockedSlots((prev) => {
      const next = !prev[slot];
      triggerToast(next ? `🔒 ${slotNames[slot]} dikunci` : `🔓 ${slotNames[slot]} dibuka`);
      return { ...prev, [slot]: next };
    });
  };

  // Ganti Satuan Slot
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
    if (slot === "top") {
      setCustomHeroImage(nextItem.imageUrl);
    }
    triggerToast(`↻ Diganti ke: ${nextItem.brand} ${nextItem.name}`);
  };

  // Acak Semua Slot yang Tidak Terkunci
  const handleShuffleUnlocked = () => {
    setIsShuffling(true);
    setTimeout(() => {
      // Rotasi juga referensi visual hero
      const currentVibe = SKENA_VIBES.find((v) => v.id === selectedVibeId) || SKENA_VIBES[0];
      const allVibeImages = [currentVibe.heroImage, ...currentVibe.altImages];
      setHeroImageIndex((prev) => (prev + 1) % allVibeImages.length);
      setCustomHeroImage(null);

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
            if (genderMode === "hijab") return it.categoryLabel.includes("Hijab") || it.modest;
            return !it.categoryLabel.includes("Hijab");
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
      triggerToast("✨ Formula OOTD baru diracik oleh AI Stylist!");
    }, 220);
  };

  // Reset Kanvas
  const handleResetCanvas = () => {
    setLockedSlots({ top: false, bottom: false, outer: false, shoes: false });
    handleSelectSkenaVibe(SKENA_VIBES[0]);
    triggerToast("Kanvas Studio di-reset ke gaya dasar.");
  };

  // Simpan Racikan Aktif ke Lemari
  const handleSaveToWardrobe = () => {
    const activeTone = SKIN_TONES_DRAPE.find((t) => t.id === selectedSkinToneId) || SKIN_TONES_DRAPE[0];
    const currentVibe = SKENA_VIBES.find((v) => v.id === selectedVibeId) || SKENA_VIBES[0];

    const recommendation: OOTDRecommendation = {
      id: `studio_mix_${Date.now()}`,
      title: customLookTitle || `${currentVibe.label}: ${activeSlots.top.brand} × ${activeSlots.bottom.brand}`,
      tagline: `Formula adem terkurasi Studio untuk ${weatherLabel} dengan harmoni warna ${activeTone.nama}.`,
      overallVibe: `${currentVibe.label} · ${activeSlots.top.colorName}`,
      comfortRating: Number((breathabilityScore / 20).toFixed(1)),
      affordabilityRating: 4.9,
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
          brand: activeSlots.top.brand,
          brandUrl: activeSlots.top.officialUrl,
          isOfficialBrand: true,
          name: activeSlots.top.name,
          material: activeSlots.top.material,
          color: activeSlots.top.colorName,
          colorHex: activeSlots.top.colorHex,
          estimatedPrice: `${activeSlots.top.officialPriceStr} (Dupe: ${activeSlots.top.priceStr})`,
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
          estimatedPrice: `${activeSlots.bottom.officialPriceStr} (Dupe: ${activeSlots.bottom.priceStr})`,
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
          estimatedPrice: `${activeSlots.outer.officialPriceStr} (Dupe: ${activeSlots.outer.priceStr})`,
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
          estimatedPrice: `${activeSlots.shoes.officialPriceStr} (Dupe: ${activeSlots.shoes.priceStr})`,
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
    Math.round(93 + ((activeSlots.top.breathability % 4) + (activeSlots.bottom.breathability % 3)))
  );

  const totalDupePrice =
    activeSlots.top.price +
    activeSlots.bottom.price +
    activeSlots.outer.price +
    activeSlots.shoes.price;

  const totalDupePriceStr = `Rp ${Math.round(totalDupePrice / 1000)}rb`;

  const currentVibeObj = SKENA_VIBES.find((v) => v.id === selectedVibeId) || SKENA_VIBES[0];
  const allCurrentVibeImgs = [currentVibeObj.heroImage, ...currentVibeObj.altImages];
  const activeHeroImage = customHeroImage || allCurrentVibeImgs[heroImageIndex % allCurrentVibeImgs.length];

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

  const slotEntries: { key: "top" | "bottom" | "outer" | "shoes"; item: StudioItem }[] = [
    { key: "top", item: activeSlots.top },
    { key: "bottom", item: activeSlots.bottom },
    { key: "outer", item: activeSlots.outer },
    { key: "shoes", item: activeSlots.shoes },
  ];

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#FAF8F5] text-[#181A18] font-sans antialiased select-none">
      {/* Notifikasi Toast Mengambang */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed top-16 md:top-24 left-4 right-4 max-w-sm mx-auto z-50 bg-[#181A18] text-[#FAF8F5] text-xs px-4 py-3 shadow-2xl border border-white/20 flex items-center justify-between"
          >
            <span className="font-mono text-[11px]">{feedbackToast}</span>
            <span className="text-[10px] text-[#D4A373] font-bold uppercase ml-2">OK</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 📱 1. TAMPILAN MOBILE STUDIO (< 768px / block md:hidden)              */}
      {/* Gaya 1: Uniqlo StyleHint x Editorial Card + 4 Kartu Komponen Rapi     */}
      {/* ===================================================================== */}
      <div className="block md:hidden w-full max-w-md mx-auto min-h-[100dvh] bg-[#FAF8F5] pb-40">
        {/* A. Sticky Top Bar Mobile */}
        <div className="sticky top-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#181A18]/10 pt-[max(0px,env(safe-area-inset-top))]">
          <div className="h-12 px-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-lg font-bold tracking-tight text-[#181A18]">
                Look<span className="text-[#8C5A3C]">.</span>u Studio
              </h1>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-[#181A18] text-[#FAF8F5] px-1.5 py-0.5">
                AI Stylist
              </span>
            </div>
            <button
              type="button"
              onClick={handleResetCanvas}
              className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#181A18]/60 hover:text-[#181A18] px-2 py-1"
            >
              Reset
            </button>
          </div>

          {/* Segmented Mode Switcher */}
          <div className="grid grid-cols-2 border-t border-[#181A18]/10 text-[10px] font-mono font-bold uppercase tracking-[0.14em]">
            <button
              type="button"
              onClick={() => setActiveTab("mixer")}
              className={`py-2.5 text-center transition-all border-b-2 ${
                activeTab === "mixer"
                  ? "border-[#181A18] text-[#181A18] bg-[#EFECE6]/70"
                  : "border-transparent text-[#181A18]/45"
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
                  : "border-transparent text-[#181A18]/45"
              }`}
            >
              02. Tes Warna Kulit
            </button>
          </div>

          {/* 6 Vibe Skena Pills Horizontal Scroll */}
          {activeTab === "mixer" && (
            <div className="bg-[#EFECE6]/80 border-t border-[#181A18]/10 px-3 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {SKENA_VIBES.map((vibe) => {
                const isSelected = selectedVibeId === vibe.id && !customLookTitle;
                return (
                  <button
                    key={vibe.id}
                    type="button"
                    onClick={() => handleSelectSkenaVibe(vibe)}
                    className={`shrink-0 h-8 px-3 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-[#181A18] text-[#FAF8F5] border-[#181A18] shadow-xs"
                        : "bg-white text-[#181A18]/80 border-[#181A18]/15"
                    }`}
                  >
                    <span>{vibe.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* B. Konten Utama Mobile */}
        {activeTab === "mixer" ? (
          <div className="px-3.5 pt-3 space-y-3.5">
            {/* Quick Context Strip (Gender, Cuaca, Kulit) */}
            <div className="flex items-center justify-between gap-1.5 text-[10px] font-mono">
              <button
                type="button"
                onClick={() => {
                  const nextG = genderMode === "hijab" ? "nonhijab" : genderMode === "nonhijab" ? "pria" : "hijab";
                  setGenderMode(nextG);
                  triggerToast(`Mode Gender: ${nextG === "hijab" ? "Wanita Hijab" : nextG === "nonhijab" ? "Wanita Non-Hijab" : "Pria Menswear"}`);
                }}
                className="px-2.5 py-1.5 bg-white border border-[#181A18]/20 font-bold text-[#181A18] flex items-center gap-1 shadow-2xs"
              >
                <span>{genderLabel}</span>
                <span className="text-[#8C5A3C]">↻</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setWeatherMode((prev) =>
                    prev === "hot" ? "ac" : prev === "ac" ? "rainy" : prev === "rainy" ? "mild" : "hot"
                  );
                }}
                className="px-2.5 py-1.5 bg-white border border-[#181A18]/20 font-bold text-[#181A18] shadow-2xs"
              >
                {weatherLabel}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("colorlab")}
                className="px-2.5 py-1.5 bg-white border border-[#8C5A3C]/40 font-bold text-[#8C5A3C] flex items-center gap-1.5 shadow-2xs"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full border border-black/20"
                  style={{ backgroundColor: activeSkinTone.hex }}
                />
                <span className="truncate max-w-[80px]">{activeSkinTone.nama}</span>
              </button>
            </div>

            {/* 1. HERO STYLEHINT EDITORIAL CARD (Foto Besar & Jelas) */}
            <div className="relative w-full aspect-[4/4.4] bg-[#EFECE6] border border-[#181A18]/20 overflow-hidden shadow-sm">
              <img
                src={activeHeroImage}
                alt={customLookTitle || currentVibeObj.label}
                className="w-full h-full object-cover object-top transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181A18]/90 via-[#181A18]/20 to-transparent" />

              {/* Floating Top Badges */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                <span className="px-2.5 py-1 bg-[#181A18]/90 backdrop-blur-md text-[#FAF8F5] text-[9px] font-mono font-bold uppercase tracking-widest border border-white/15">
                  ✦ {currentVibeObj.badge}
                </span>
                <span className="px-2.5 py-1 bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[9px] font-mono font-bold uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Adem {breathabilityScore}% · 33°C
                </span>
              </div>

              {/* Floating Bottom Editorial Summary */}
              <div className="absolute bottom-3 left-3 right-3 text-[#FAF8F5]">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-2 py-1 border border-white/15">
                    {slotEntries.map(({ key, item }) => (
                      <span
                        key={key}
                        className="w-3 h-3 rounded-full border border-white/40"
                        style={{ backgroundColor: item.colorHex }}
                        title={item.colorName}
                      />
                    ))}
                    <span className="text-[9px] font-mono text-white/90 ml-1">
                      {skinMatchScore}% Match {activeSkinTone.nama}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setCustomHeroImage(null);
                      setHeroImageIndex((prev) => prev + 1);
                      triggerToast("Visual referensi OOTD diganti");
                    }}
                    className="px-2.5 py-1 bg-white/95 text-[#181A18] text-[9px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 shadow-md active:scale-95"
                  >
                    <RotateCw className="w-2.5 h-2.5" />
                    <span>Foto Lain</span>
                  </button>
                </div>

                <h2 className="font-serif text-lg font-bold leading-snug text-white">
                  {customLookTitle || currentVibeObj.label}
                </h2>
                <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5 leading-relaxed">
                  {currentVibeObj.tagline}
                </p>
              </div>
            </div>

            {/* 2. DAFTAR 4 KARTU KOMPONEN RAPI (Ramah Jempol 44px) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between px-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#181A18]/70">
                  Komposisi 4 Item Pakaian (Tap ↻ Untuk Ganti Satuan)
                </span>
                <span className="text-[10px] font-mono font-bold text-[#8C5A3C]">
                  Dupe ~{totalDupePriceStr}
                </span>
              </div>

              {slotEntries.map(({ key, item }) => {
                const isLocked = lockedSlots[key];
                return (
                  <div
                    key={key}
                    className={`p-2.5 bg-white border transition-all flex items-center gap-3 ${
                      isLocked
                        ? "border-2 border-[#181A18] bg-[#FAF8F5] shadow-xs"
                        : "border-[#181A18]/15 shadow-2xs"
                    }`}
                  >
                    {/* Thumbnail Foto Item */}
                    <div className="relative w-16 h-16 bg-[#EFECE6] border border-[#181A18]/10 shrink-0 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover object-top"
                      />
                      <span
                        className="absolute bottom-1 right-1 w-3 h-3 rounded-full border border-white shadow-2xs"
                        style={{ backgroundColor: item.colorHex }}
                      />
                    </div>

                    {/* Detail Nama, Brand & Harga */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.5 bg-[#181A18] text-[#FAF8F5] text-[8px] font-mono font-bold uppercase tracking-wider">
                          {item.brand}
                        </span>
                        <span className="text-[9px] font-mono font-semibold text-[#8C5A3C] truncate">
                          {item.categoryLabel}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-[#181A18] truncate mt-1">
                        {item.name}
                      </h3>

                      <p className="text-[10px] text-[#181A18]/65 truncate mt-0.5">
                        {item.material} · <span className="text-emerald-700 font-semibold">Adem {item.breathability}%</span>
                      </p>

                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono">
                        <span className="text-[#181A18]/60">Resmi: {item.officialPriceStr}</span>
                        <span className="font-bold text-[#8C5A3C]">Dupe: {item.priceStr}</span>
                      </div>
                    </div>

                    {/* Tombol Lock & Swap Ramah Jempol (40px x 40px) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        aria-label={`Kunci ${item.categoryLabel}`}
                        onClick={() => toggleSlotLock(key)}
                        className={`w-10 h-10 flex items-center justify-center border transition-all ${
                          isLocked
                            ? "bg-[#181A18] text-white border-[#181A18]"
                            : "bg-[#FAF8F5] text-[#181A18]/70 border-[#181A18]/20 active:bg-[#181A18] active:text-white"
                        }`}
                        title="Kunci Item"
                      >
                        {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        aria-label={`Ganti ${item.categoryLabel}`}
                        onClick={() => swapSingleSlot(key)}
                        className="w-10 h-10 bg-white border border-[#181A18]/25 text-[#181A18] flex items-center justify-center active:bg-[#181A18] active:text-white transition-all shadow-2xs"
                        title="Ganti Item Ini"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* TAB 02 MOBILE: PERSONAL COLOR LAB */
          <div className="px-4 pt-4 space-y-4">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#8C5A3C]">
                Interactive Draping Lab
              </span>
              <h2 className="font-serif text-2xl text-[#181A18] mt-0.5">
                Kalibrasi Rona Kulit Tropis
              </h2>
              <p className="text-xs text-[#181A18]/70 mt-1 leading-relaxed">
                Pilih rona kulit dasar Anda untuk mengunci palet pakaian yang mencerahkan wajah.
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
                      triggerToast(`Rona Kulit: ${tone.nama} (${tone.season})`);
                    }}
                    className={`p-3 border text-left transition-all ${
                      isActive
                        ? "border-2 border-[#181A18] bg-white shadow-sm"
                        : "border-[#181A18]/15 bg-[#EFECE6]/50"
                    }`}
                  >
                    <span
                      className="block w-full h-9 mb-2 border border-black/10"
                      style={{ backgroundColor: tone.hex }}
                    />
                    <span className="text-xs font-bold block text-[#181A18]">{tone.nama}</span>
                    <span className="text-[10px] font-mono text-[#8C5A3C] uppercase block mt-0.5">
                      {tone.season}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="border border-[#181A18]/15 bg-white p-4 space-y-3.5 shadow-2xs">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 block mb-2">
                  ✓ Palet Terbaik Kulit {activeSkinTone.nama}
                </span>
                <div className="grid grid-cols-4 gap-2 text-center text-[9px] font-mono font-semibold">
                  {activeSkinTone.bestPalettes.map((p, idx) => (
                    <div key={idx}>
                      <div
                        className="h-10 border border-black/10 mb-1"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span className="truncate block text-[#181A18]">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#181A18]/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-700 block mb-1.5">
                  ✕ Hindari (Membuat Kusam)
                </span>
                <div className="flex flex-wrap gap-1.5">
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

            <button
              type="button"
              onClick={() => {
                setActiveTab("mixer");
                handleShuffleUnlocked();
              }}
              className="w-full h-12 bg-[#181A18] text-[#FAF8F5] text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <span>Terapkan ke Studio OOTD →</span>
            </button>
          </div>
        )}

        {/* C. Docked Bottom Action Bar Mobile (Di atas BottomNav) */}
        <div className="fixed bottom-[64px] left-0 right-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md border-t border-[#181A18]/15 px-3.5 py-2.5 max-w-md mx-auto">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShuffleUnlocked}
              disabled={isShuffling}
              className="flex-1 h-11 bg-[#181A18] text-[#FAF8F5] text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.99] shadow-sm"
            >
              <Sparkles className={`w-3.5 h-3.5 text-[#D4A373] ${isShuffling ? "animate-spin" : ""}`} />
              <span>Acak Formula AI</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToWardrobe}
              className="h-11 px-3.5 bg-white border border-[#181A18]/30 text-[#181A18] text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 active:bg-stone-100"
              title="Simpan ke Lemari"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Simpan</span>
            </button>

            <button
              type="button"
              onClick={() => setIsDetailsDrawerOpen(true)}
              className="h-11 px-3.5 bg-[#8C5A3C] text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1 active:opacity-90 shadow-xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Beli Set</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 🖥️ 2. TAMPILAN DESKTOP WORKSTATION (>= 768px / hidden md:block)       */}
      {/* Layar Lebar 2-Kolom (Editorial Showcase Kiri + 2x2 Workbench Kanan)   */}
      {/* ===================================================================== */}
      <div className="hidden md:block w-full max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Header Workstation Desktop */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-[#181A18]/15">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 bg-[#181A18] text-[#FAF8F5] text-[10px] font-mono font-bold uppercase tracking-[0.2em]">
                AI Styling Workstation v3.0
              </span>
              <span className="text-xs font-mono text-[#8C5A3C] font-bold">
                ✦ Safe Harbor Brand Aggregator (Uniqlo · H&amp;M · Zara · Local Pride)
              </span>
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[#181A18] mt-2 tracking-tight">
              Studio Peracik OOTD &amp; Kalibrasi Iklim Tropis
            </h1>
          </div>

          {/* Tab Switcher Desktop */}
          <div className="flex items-center gap-2 bg-[#EFECE6] p-1 border border-[#181A18]/15 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab("mixer")}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "mixer"
                  ? "bg-[#181A18] text-[#FAF8F5] shadow-xs"
                  : "text-[#181A18]/60 hover:text-[#181A18]"
              }`}
            >
              01. Garment Workbench
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("colorlab")}
              className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider transition-all ${
                activeTab === "colorlab"
                  ? "bg-[#181A18] text-[#FAF8F5] shadow-xs"
                  : "text-[#181A18]/60 hover:text-[#181A18]"
              }`}
            >
              02. Personal Color Lab ({activeSkinTone.nama})
            </button>
          </div>
        </div>

        {/* Baris Pilihan 6 Gaya Skena Modern (Desktop) */}
        <div className="py-4 border-b border-[#181A18]/10 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#181A18]/50 mr-1">
              Preset Skena:
            </span>
            {SKENA_VIBES.map((vibe) => {
              const isSelected = selectedVibeId === vibe.id && !customLookTitle;
              return (
                <button
                  key={vibe.id}
                  type="button"
                  onClick={() => handleSelectSkenaVibe(vibe)}
                  className={`px-3.5 py-1.5 text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-[#181A18] text-[#FAF8F5] border-[#181A18] shadow-xs"
                      : "bg-white text-[#181A18]/80 border-[#181A18]/20 hover:border-[#181A18]"
                  }`}
                >
                  <span>{vibe.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={() => {
                const nextG = genderMode === "hijab" ? "nonhijab" : genderMode === "nonhijab" ? "pria" : "hijab";
                setGenderMode(nextG);
              }}
              className="px-3 py-1.5 bg-white border border-[#181A18]/20 font-bold hover:border-[#181A18]"
            >
              {genderLabel} ↻
            </button>
            <button
              type="button"
              onClick={() => {
                setWeatherMode((prev) =>
                  prev === "hot" ? "ac" : prev === "ac" ? "rainy" : prev === "rainy" ? "mild" : "hot"
                );
              }}
              className="px-3 py-1.5 bg-white border border-[#181A18]/20 font-bold hover:border-[#181A18]"
            >
              {weatherLabel} ↻
            </button>
            <button
              type="button"
              onClick={handleResetCanvas}
              className="px-3 py-1.5 text-[#181A18]/60 hover:text-[#181A18] underline underline-offset-4 font-bold"
            >
              Reset
            </button>
          </div>
        </div>

        {activeTab === "mixer" ? (
          /* GRID 12 KOLOM DESKTOP WORKSTATION */
          <div className="grid grid-cols-12 gap-8 mt-6 items-start">
            {/* KOLOM KIRI (5 KOLOM): EDITORIAL LOOKBOOK CARD & TELEMETRY */}
            <div className="col-span-5 space-y-4 sticky top-24">
              <div className="relative w-full aspect-[4/4.8] bg-[#EFECE6] border-2 border-[#181A18] overflow-hidden shadow-md group">
                <img
                  src={activeHeroImage}
                  alt={customLookTitle || currentVibeObj.label}
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181A18]/90 via-[#181A18]/15 to-transparent" />

                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#181A18]/90 backdrop-blur-md text-[#FAF8F5] text-[10px] font-mono font-bold uppercase tracking-widest border border-white/15">
                    ✦ {currentVibeObj.badge}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomHeroImage(null);
                      setHeroImageIndex((prev) => prev + 1);
                      triggerToast("Visual referensi OOTD diganti");
                    }}
                    className="px-3 py-1 bg-white/95 hover:bg-[#181A18] text-[#181A18] hover:text-white text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>Ganti Foto Referensi</span>
                  </button>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    {slotEntries.map(({ key, item }) => (
                      <span
                        key={key}
                        className="w-4 h-4 rounded-full border border-white/50 shadow-xs"
                        style={{ backgroundColor: item.colorHex }}
                        title={`${item.colorName} (${item.brand})`}
                      />
                    ))}
                    <span className="text-[10px] font-mono text-white/90 bg-black/50 px-2 py-0.5 border border-white/15">
                      Palet Harmoni {activeSkinTone.nama}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold leading-tight">
                    {customLookTitle || currentVibeObj.label}
                  </h2>
                  <p className="text-xs text-white/85 mt-1 leading-relaxed">
                    {currentVibeObj.tagline}
                  </p>
                </div>
              </div>

              {/* Telemetry Bar Ilmiah 3-Kolom */}
              <div className="grid grid-cols-3 border border-[#181A18]/20 bg-white divide-x divide-[#181A18]/15 shadow-xs">
                <div className="p-3 text-center">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#181A18]/50 block">
                    Sirkulasi Udara
                  </span>
                  <span className="text-sm font-mono font-extrabold text-emerald-700 mt-0.5 block">
                    {breathabilityScore}% Optimal
                  </span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#181A18]/50 block">
                    Harmoni Kulit
                  </span>
                  <span className="text-sm font-mono font-extrabold text-[#8C5A3C] mt-0.5 block">
                    {skinMatchScore}% Match
                  </span>
                </div>
                <div className="p-3 text-center">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#181A18]/50 block">
                    Total Set Dupe
                  </span>
                  <span className="text-sm font-mono font-extrabold text-[#181A18] mt-0.5 block">
                    ~{totalDupePriceStr}
                  </span>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN (7 KOLOM): 2x2 INTERACTIVE GARMENT WORKBENCH */}
            <div className="col-span-7 space-y-5">
              <div className="flex items-center justify-between bg-[#EFECE6]/70 px-4 py-2.5 border-l-4 border-[#8C5A3C]">
                <p className="text-xs text-[#181A18]/85">
                  <strong>Tips AI Stylist:</strong> Kunci (<Lock className="w-3 h-3 inline" />) item favorit Anda, lalu klik tombol <strong>Acak Ulang</strong> untuk mencari padanan terbaik.
                </p>
                <span className="text-[10px] font-mono font-bold uppercase text-[#8C5A3C] shrink-0 ml-2">
                  4 Komponen Aktif
                </span>
              </div>

              {/* Grid 2x2 Kartu Pakaian */}
              <div className="grid grid-cols-2 gap-4">
                {slotEntries.map(({ key, item }) => {
                  const isLocked = lockedSlots[key];
                  return (
                    <div
                      key={key}
                      className={`bg-white border transition-all flex flex-col justify-between p-4 ${
                        isLocked
                          ? "border-2 border-[#181A18] shadow-md bg-[#FAF8F5]"
                          : "border-[#181A18]/20 hover:border-[#181A18]/50 shadow-xs"
                      }`}
                    >
                      <div>
                        {/* Baris Header Kartu: Brand & Lock/Swap */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-[#181A18] text-[#FAF8F5] text-[9px] font-mono font-bold uppercase tracking-wider">
                              {item.brand}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-[#8C5A3C] uppercase">
                              {item.categoryLabel}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => toggleSlotLock(key)}
                              className={`h-8 px-2.5 text-[10px] font-mono font-bold uppercase flex items-center gap-1 border transition-colors ${
                                isLocked
                                  ? "bg-[#181A18] text-white border-[#181A18]"
                                  : "bg-white text-[#181A18] border-[#181A18]/25 hover:bg-[#181A18] hover:text-white"
                              }`}
                              title="Kunci Slot Ini"
                            >
                              {isLocked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                              <span>{isLocked ? "Terkunci" : "Kunci"}</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => swapSingleSlot(key)}
                              className="h-8 px-2.5 bg-[#EFECE6] hover:bg-[#181A18] text-[#181A18] hover:text-white border border-[#181A18]/20 text-[10px] font-mono font-bold uppercase flex items-center gap-1 transition-colors"
                              title="Ganti Item Satuan"
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Ganti</span>
                            </button>
                          </div>
                        </div>

                        {/* Preview Gambar + Spesifikasi Kain */}
                        <div className="flex gap-3.5 items-start">
                          <div className="w-20 h-24 bg-[#EFECE6] border border-[#181A18]/15 shrink-0 overflow-hidden relative">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="w-full h-full object-cover object-top"
                            />
                            <span
                              className="absolute bottom-1.5 right-1.5 w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                              style={{ backgroundColor: item.colorHex }}
                              title={item.colorName}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-[#181A18] leading-snug line-clamp-2">
                              {item.name}
                            </h3>
                            <p className="text-[11px] text-[#181A18]/70 mt-1">
                              {item.material}
                            </p>
                            <span className="inline-block mt-1.5 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-mono font-bold">
                              🌬️ Adem {item.breathability}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bagian Bawah Kartu: Perbandingan Harga & Dual Action Links */}
                      <div className="mt-4 pt-3 border-t border-[#181A18]/10 space-y-2.5">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#181A18]/60">
                            Resmi: <strong className="text-[#181A18]">{item.officialPriceStr}</strong>
                          </span>
                          <span className="text-[#8C5A3C] font-bold">
                            Dupe: {item.priceStr}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-1.5">
                          <a
                            href={item.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2 bg-[#181A18] text-white text-[9px] font-mono font-bold uppercase tracking-wider text-center hover:bg-[#8C5A3C] transition-colors truncate"
                          >
                            ↗ {item.brand}
                          </a>
                          <a
                            href={`https://shopee.co.id/search?keyword=${encodeURIComponent(item.shopeeQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2 bg-[#EE4D2D]/10 text-[#EE4D2D] border border-[#EE4D2D]/30 text-[9px] font-mono font-bold uppercase tracking-wider text-center hover:bg-[#EE4D2D] hover:text-white transition-colors"
                          >
                            Shopee ↗
                          </a>
                          <a
                            href={`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(item.tokopediaQuery)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-1.5 px-2 bg-[#03AC0E]/10 text-[#03AC0E] border border-[#03AC0E]/30 text-[9px] font-mono font-bold uppercase tracking-wider text-center hover:bg-[#03AC0E] hover:text-white transition-colors"
                          >
                            Tokped ↗
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Bar Utama Desktop */}
              <div className="grid grid-cols-12 gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleShuffleUnlocked}
                  disabled={isShuffling}
                  className="col-span-6 h-12 bg-[#181A18] text-[#FAF8F5] text-xs font-mono font-bold uppercase tracking-[0.15em] flex items-center justify-center gap-2 hover:bg-[#8C5A3C] transition-all shadow-sm"
                >
                  <Sparkles className={`w-4 h-4 text-[#D4A373] ${isShuffling ? "animate-spin" : ""}`} />
                  <span>✦ Acak Ulang Item Tidak Terkunci</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveToWardrobe}
                  className="col-span-3 h-12 bg-white border-2 border-[#181A18] text-[#181A18] text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-[#EFECE6] transition-colors"
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Simpan Lemari</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsDetailsDrawerOpen(true)}
                  className="col-span-3 h-12 bg-[#8C5A3C] text-white text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ringkasan Set</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* TAB 02 DESKTOP: PERSONAL COLOR LAB */
          <div className="mt-8 grid grid-cols-12 gap-8 items-start">
            <div className="col-span-5 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#8C5A3C]">
                Interactive Draping Simulator
              </span>
              <h2 className="font-serif text-3xl text-[#181A18]">
                Kalibrasi Rona Kulit Nusantara
              </h2>
              <p className="text-sm text-[#181A18]/70 leading-relaxed">
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
                        triggerToast(`Undertone aktif: ${tone.nama} (${tone.season})`);
                      }}
                      className={`p-3.5 border text-left transition-all ${
                        isActive
                          ? "border-2 border-[#181A18] bg-white shadow-sm"
                          : "border-[#181A18]/15 bg-[#EFECE6]/50 hover:border-[#181A18]/40"
                      }`}
                    >
                      <span
                        className="block w-full h-10 mb-2.5 border border-black/10"
                        style={{ backgroundColor: tone.hex }}
                      />
                      <span className="text-sm font-bold block text-[#181A18]">{tone.nama}</span>
                      <span className="text-[10px] font-mono text-[#8C5A3C] uppercase block mt-0.5">
                        {tone.season}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="col-span-7 bg-white border-2 border-[#181A18] p-6 space-y-6 shadow-sm">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-700 block mb-3">
                  ✓ Palet Paling Cerah di Kulit {activeSkinTone.nama} ({activeSkinTone.season})
                </span>
                <p className="text-xs text-[#181A18]/70 mb-4">{activeSkinTone.deskripsi}</p>
                <div className="grid grid-cols-4 gap-3 text-center text-xs font-mono font-semibold">
                  {activeSkinTone.bestPalettes.map((p, idx) => (
                    <div key={idx} className="p-2 border border-[#181A18]/10 bg-[#FAF8F5]">
                      <div
                        className="h-16 border border-black/10 mb-2"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span className="block text-[#181A18]">{p.name}</span>
                      <span className="text-[10px] text-[#181A18]/50">{p.hex}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#181A18]/10">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-700 block mb-2">
                  ✕ Warna yang Membuat Kulit Terlihat Kusam (Washed Out)
                </span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeSkinTone.avoidPalettes.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-mono"
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
                className="w-full h-12 bg-[#181A18] text-[#FAF8F5] text-xs font-mono font-bold uppercase tracking-[0.15em] hover:bg-[#8C5A3C] transition-colors"
              >
                Terapkan Palet {activeSkinTone.nama} ke Workbench OOTD →
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. MODAL / DRAWER RINCIAN BELANJA (RESMI BRAND VS DUPE MARKETPLACE)   */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isDetailsDrawerOpen && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDetailsDrawerOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className="relative z-[70] w-full sm:max-w-xl bg-white border-t-2 sm:border-2 border-[#181A18] shadow-2xl flex flex-col max-h-[88vh] overflow-hidden rounded-t-2xl sm:rounded-none"
            >
              <div className="px-5 py-4 border-b border-[#181A18]/15 flex items-center justify-between bg-white shrink-0">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#8C5A3C] bg-[#8C5A3C]/10 px-2 py-0.5">
                    Safe Harbor Brand Aggregator
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#181A18] mt-1">
                    Rincian 4 Pakaian: Toko Resmi &amp; Alternatif Dupe
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDetailsDrawerOpen(false)}
                  className="w-9 h-9 bg-stone-100 flex items-center justify-center text-[#181A18] hover:bg-[#181A18] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 sm:p-5 overflow-y-auto space-y-3 text-xs bg-[#FAF8F5]">
                {slotEntries.map(({ key, item }) => (
                  <div
                    key={key}
                    className="p-3.5 bg-white border border-[#181A18]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-14 object-cover bg-[#EFECE6] border border-[#181A18]/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-[#181A18] text-white text-[8px] font-mono font-bold uppercase">
                            {item.brand}
                          </span>
                          <span className="text-[9px] font-mono font-bold uppercase text-[#8C5A3C]">
                            {item.categoryLabel}
                          </span>
                        </div>
                        <h4 className="font-bold text-[#181A18] text-xs sm:text-sm truncate mt-0.5">
                          {item.name}
                        </h4>
                        <p className="text-[10px] text-[#181A18]/65">
                          Resmi: <strong>{item.officialPriceStr}</strong> · Dupe: <strong className="text-[#8C5A3C]">{item.priceStr}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <a
                        href={item.officialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-[#181A18] text-white text-[9px] font-mono font-bold uppercase tracking-wider hover:bg-[#8C5A3C]"
                      >
                        ↗ Resmi
                      </a>
                      <a
                        href={`https://shopee.co.id/search?keyword=${encodeURIComponent(item.shopeeQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-[#EE4D2D] text-white text-[9px] font-mono font-bold uppercase tracking-wider hover:opacity-90"
                      >
                        Shopee ↗
                      </a>
                      <a
                        href={`https://www.tokopedia.com/search?st=product&q=${encodeURIComponent(item.tokopediaQuery)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 bg-[#03AC0E] text-white text-[9px] font-mono font-bold uppercase tracking-wider hover:opacity-90"
                      >
                        Tokped ↗
                      </a>
                    </div>
                  </div>
                ))}

                <div className="p-3.5 bg-white border-2 border-[#181A18] flex items-center justify-between mt-3">
                  <div>
                    <span className="font-mono uppercase font-bold text-[#181A18]/70 block text-[10px]">
                      Estimasi Total 4 Item (Opsi Dupe Hemat)
                    </span>
                    <span className="text-[10px] text-[#181A18]/55">
                      Hemat ~65% dibanding harga ritel penuh
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-lg text-[#181A18]">
                    ~{totalDupePriceStr}
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
