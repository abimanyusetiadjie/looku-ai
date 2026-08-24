import { OOTDRecommendation, UserPreferences, TrendingLook } from "./types";

export const PRESET_OOTD_COLLECTION: Record<string, OOTDRecommendation> = {
  "kuliah_hijab_panas_hemat": {
    id: "rec_kuliah_hijab_1",
    title: "Casual Campus Chiffon",
    tagline: "Adem seharian di kelas tanpa kegerahan, tetep sopan & estetik.",
    overallVibe: "Earthy Minimalist & Breathable",
    comfortRating: 5.0,
    affordabilityRating: 5.0,
    modestFriendly: true,
    skinToneMatch: "Sangat kontras & mencerahkan warna kulit Sawo Matang dan Kuning Langsat.",
    whyItWorks: "Kombinasi kemeja katun linen oversized dengan pashmina ceruty memberikan sirkulasi udara maksimal saat jalan antar gedung kampus di bawah terik matahari.",
    stylingTip: "Tuck-in bagian depan kemeja dalam celana kulot untuk siluet kaki yang lebih jenjang, lalu padukan dengan totebag kanvas.",
    colorPalette: [
      { name: "Cream Oat", hex: "#F5EBE0" },
      { name: "Sage Green", hex: "#84A98C" },
      { name: "Broken White", hex: "#FAEDCD" },
      { name: "Sand Brown", hex: "#D4A373" }
    ],
    items: [
      {
        category: "atasan",
        name: "Kemeja Linen Oversized Drop Shoulder",
        material: "Katun Linen Crinkle (Adem & Anti-Kusut)",
        color: "Sage Green / Mocca",
        colorHex: "#84A98C",
        estimatedPrice: "Rp 65.000 - 89.000",
        shopeeQuery: "kemeja linen oversized wanita crinkle",
        tokopediaQuery: "kemeja linen wanita oversized",
      },
      {
        category: "outer_hijab",
        name: "Pashmina Ceruty Baby Doll / Voal Miracle",
        material: "Ceruty Baby Doll Premium",
        color: "Cream Sand",
        colorHex: "#F5EBE0",
        estimatedPrice: "Rp 25.000 - 38.000",
        shopeeQuery: "pashmina ceruty baby doll premium",
        tokopediaQuery: "pashmina ceruty baby doll",
      },
      {
        category: "bawahan",
        name: "Highwaist Loose Kulot Pants",
        material: "Poli-Cotton Flowy",
        color: "Broken White / Khaki",
        colorHex: "#FAEDCD",
        estimatedPrice: "Rp 68.000 - 95.000",
        shopeeQuery: "celana kulot highwaist loose wanita",
        tokopediaQuery: "kulot highwaist flowy wanita",
      },
      {
        category: "sepatu",
        name: "Canvas Slip-on / Retro White Sneakers",
        material: "Canvas breathable with rubber sole",
        color: "Off-White",
        colorHex: "#FFFFFF",
        estimatedPrice: "Rp 99.000 - 149.000",
        shopeeQuery: "sneakers putih wanita kanvas retro",
        tokopediaQuery: "sepatu sneakers kanvas putih wanita",
      },
      {
        category: "aksesoris",
        name: "Totebag Kanvas Aesthetic + Jam Tangan Leather",
        material: "Thick Canvas with zipper",
        color: "Natural Beige",
        colorHex: "#D4A373",
        estimatedPrice: "Rp 29.000 - 55.000",
        shopeeQuery: "totebag kanvas resleting aesthetic",
        tokopediaQuery: "totebag kanvas aesthetic wanita",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "hangout_nonhijab_panas_menengah": {
    id: "rec_hangout_nonhijab_1",
    title: "Seoul Cafe Hopping Look",
    tagline: "Fotogenik buat konten aesthetic Instagram, ringan dipakai seharian.",
    overallVibe: "Korean Soft Pastel & Chic",
    comfortRating: 4.8,
    affordabilityRating: 4.7,
    modestFriendly: false,
    skinToneMatch: "Tone soft pastel memberi efek wajah segar & radiant pada kulit Putih Gading & Kuning Langsat.",
    whyItWorks: "Cardigan knit tipis berpori lebar dipadukan dengan pleated tennis skirt atau celana flare berpotongan santai.",
    stylingTip: "Biarkan 2 kancing teratas cardigan terbuka, kenakan kalung rantai tipis dan shoulder bag mini.",
    colorPalette: [
      { name: "Soft Matcha", hex: "#CCD5AE" },
      { name: "Vanilla Butter", hex: "#FEFAE0" },
      { name: "Dusty Cedar", hex: "#E07A5F" },
      { name: "Cloud White", hex: "#F7F7F9" }
    ],
    items: [
      {
        category: "atasan",
        name: "Crop Cardigan Knit Berpori Tipis",
        material: "Fine Acrylic Breathable Knit",
        color: "Matcha Milk / Buttercream",
        colorHex: "#CCD5AE",
        estimatedPrice: "Rp 79.000 - 119.000",
        shopeeQuery: "crop cardigan knit tipis korea wanita",
        tokopediaQuery: "crop knit cardigan wanita korea",
      },
      {
        category: "bawahan",
        name: "A-Line Flare Skirt / Loose Tailored Trousers",
        material: "Semi-Wool Lightweight",
        color: "Vanilla Butter",
        colorHex: "#FEFAE0",
        estimatedPrice: "Rp 89.000 - 125.000",
        shopeeQuery: "rok a line korea wanita tennis skirt",
        tokopediaQuery: "a line skirt wanita korea",
      },
      {
        category: "sepatu",
        name: "Chunky Loafers / Mary Jane Platform",
        material: "Vegan Leather with Soft Insole",
        color: "Black Gloss / Warm Ivory",
        colorHex: "#181A18",
        estimatedPrice: "Rp 115.000 - 170.000",
        shopeeQuery: "mary jane shoes wanita korea empuk",
        tokopediaQuery: "chunky loafers wanita",
      },
      {
        category: "aksesoris",
        name: "Baguette Shoulder Bag + Silver Necklace",
        material: "Synthetic PU Leather",
        color: "Cloud White",
        colorHex: "#F7F7F9",
        estimatedPrice: "Rp 45.000 - 79.000",
        shopeeQuery: "tas bahu wanita baguette vintage korea",
        tokopediaQuery: "shoulder bag wanita baguette",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "kondangan_hijab_formal_menengah": {
    id: "rec_kondangan_hijab_1",
    title: "Modern Modest Silk Elegance",
    tagline: "Mewah, sopan, dan anggun tanpa ribet pakai kebaya berat.",
    overallVibe: "Smart Glamour & Modest",
    comfortRating: 4.6,
    affordabilityRating: 4.2,
    modestFriendly: true,
    skinToneMatch: "Kilau dusty rose & champagne memberi rona hangat mempesona pada kulit Sawo Matang dan Eksotis.",
    whyItWorks: "Tunik berbahan satin silk premium dengan aksen drapery menyamarkan bentuk tubuh sekaligus memberi kilau elegan saat pesta malam maupun siang.",
    stylingTip: "Padukan dengan hijab voal motif printing bernuansa senada dan heels berujung lancip (pointed-toe).",
    colorPalette: [
      { name: "Dusty Rose", hex: "#D4A5A5" },
      { name: "Pearl Rose", hex: "#FAEDCD" },
      { name: "Gold Brass", hex: "#D4AF37" },
      { name: "Warm Taupe", hex: "#9A8C98" }
    ],
    items: [
      {
        category: "atasan",
        name: "Tunik Silk Draped Loose Fit",
        material: "Satin Silk Premium (Tidak Terawang)",
        color: "Dusty Rose / Mocca",
        colorHex: "#D4A5A5",
        estimatedPrice: "Rp 135.000 - 195.000",
        shopeeQuery: "tunik satin silk kondangan drapery mewah",
        tokopediaQuery: "tunik silk pesta kondangan modern",
      },
      {
        category: "outer_hijab",
        name: "Hijab Voal Motif Laser Cut / Paris Silk",
        material: "Voal Premium Japanese",
        color: "Matching Dusty Rose Accent",
        colorHex: "#E7C6C6",
        estimatedPrice: "Rp 45.000 - 75.000",
        shopeeQuery: "jilbab voal motif laser cut mewah lembut",
        tokopediaQuery: "hijab voal motif premium kondangan",
      },
      {
        category: "bawahan",
        name: "Rok Plisket Premium A-Line / Satin Skirt",
        material: "Pleated Silk Chiffon",
        color: "Warm Taupe / Champagne",
        colorHex: "#9A8C98",
        estimatedPrice: "Rp 70.000 - 110.000",
        shopeeQuery: "rok plisket premium tebal kondangan flowy",
        tokopediaQuery: "rok lilit satin kondangan",
      },
      {
        category: "sepatu",
        name: "Block Heels Pointed-Toe 5cm",
        material: "Glossy Leather with padded insole",
        color: "Champagne Nude",
        colorHex: "#FAEDCD",
        estimatedPrice: "Rp 125.000 - 180.000",
        shopeeQuery: "sepatu heels wanita 5cm hak tahu pointed kondangan",
        tokopediaQuery: "block heels pointed toe wanita",
      },
      {
        category: "aksesoris",
        name: "Mini Pearl Clutch Bag + Bross Hijab Emas",
        material: "Hardcase with pearl embellishment",
        color: "Gold / Pearl White",
        colorHex: "#D4AF37",
        estimatedPrice: "Rp 50.000 - 85.000",
        shopeeQuery: "tas clutch pesta mutiara mewah wanita",
        tokopediaQuery: "clutch bag pesta kondangan",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "kantor_pria_ac_menengah": {
    id: "rec_kantor_pria_1",
    title: "Smart Casual Office Nomad",
    tagline: "Rapi di ruang meeting, santai dan fleksibel saat ngopi sore.",
    overallVibe: "Clean Cut Menswear",
    comfortRating: 4.9,
    affordabilityRating: 4.6,
    modestFriendly: true,
    skinToneMatch: "Perpaduan Navy & Khaki sangat maskulin dan flattering di segala warna kulit pria Indonesia.",
    whyItWorks: "Kemeja oxford berpotongan modern dengan celana chino stretch memberikan kenyamanan duduk berjam-jam di kantor ber-AC tanpa terlihat terlalu kaku.",
    stylingTip: "Gulung lengan kemeja 2 lipatan di bawah siku untuk sentuhan dinamis dan kenakan sabuk kulit berwarna senada dengan sepatu.",
    colorPalette: [
      { name: "Navy Blue", hex: "#1D3557" },
      { name: "Heather Grey", hex: "#A8DADC" },
      { name: "Khaki Tan", hex: "#E9C46A" },
      { name: "Deep Walnut", hex: "#457B9D" }
    ],
    items: [
      {
        category: "atasan",
        name: "Kemeja Oxford Button-Down Slim-Regular",
        material: "100% Oxford Cotton",
        color: "Navy Blue / Sky Blue",
        colorHex: "#1D3557",
        estimatedPrice: "Rp 110.000 - 160.000",
        shopeeQuery: "kemeja oxford pria lengan panjang slim fit",
        tokopediaQuery: "kemeja oxford pria button down",
      },
      {
        category: "bawahan",
        name: "Chino Pants Stretch Slim Fit",
        material: "Cotton Twill Stretch 3% Spandex",
        color: "Khaki Beige / Charcoal Grey",
        colorHex: "#E9C46A",
        estimatedPrice: "Rp 120.000 - 175.000",
        shopeeQuery: "celana chino panjang pria stretch slim fit",
        tokopediaQuery: "celana chino pria stretch khaki",
      },
      {
        category: "sepatu",
        name: "Clean White Leather Sneakers / Suede Derby",
        material: "Action Leather with Ortholite Insole",
        color: "Monochrome White",
        colorHex: "#F1FAEE",
        estimatedPrice: "Rp 160.000 - 240.000",
        shopeeQuery: "sepatu sneakers kulit putih pria formal casual",
        tokopediaQuery: "sneakers kulit putih pria casual",
      },
      {
        category: "aksesoris",
        name: "Leather Minimalist Watch + Slim Laptop Backpack",
        material: "Waterproof Cordura + Genuine Leather Strap",
        color: "Matte Black",
        colorHex: "#264653",
        estimatedPrice: "Rp 110.000 - 190.000",
        shopeeQuery: "tas ransel laptop pria slim kerja waterproof",
        tokopediaQuery: "ransel laptop pria minimalis kerja",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "old_money_coastal": {
    id: "rec_old_money_1",
    title: "Old Money Coastal Linen",
    tagline: "Kemewahan yang tenang (quiet luxury) dengan palet oatmeal alami.",
    overallVibe: "Old Money Minimalist",
    comfortRating: 5.0,
    affordabilityRating: 4.8,
    modestFriendly: true,
    skinToneMatch: "Sangat bersinar untuk warna kulit Kuning Langsat dan Putih Gading.",
    whyItWorks: "Bahan katun linen alami berpotongan rileks memberi kesan berkelas tanpa terlihat berusaha terlalu keras.",
    stylingTip: "Padukan dengan kacamata berbingkai tortoise dan sandal slide kulit minimalis.",
    colorPalette: [
      { name: "Oatmeal Linen", hex: "#E8DFD1" },
      { name: "Deep Navy", hex: "#1A2530" },
      { name: "Chalk White", hex: "#FBFBFA" },
      { name: "Tan Cognac", hex: "#A67C52" }
    ],
    items: [
      {
        category: "atasan",
        name: "Kemeja Linen Kerah Camp / Cuban",
        material: "100% Pure Flax Linen",
        color: "Oatmeal Natural",
        colorHex: "#E8DFD1",
        estimatedPrice: "Rp 95.000 - 139.000",
        shopeeQuery: "kemeja linen cuban collar loose",
        tokopediaQuery: "kemeja linen kerah cuban santai",
      },
      {
        category: "bawahan",
        name: "Pleated Trousers Relaxed Cut",
        material: "Rayon Linen Blend",
        color: "Deep Navy / Bone White",
        colorHex: "#1A2530",
        estimatedPrice: "Rp 85.000 - 120.000",
        shopeeQuery: "celana panjang pleated linen relaxed",
        tokopediaQuery: "pleated trousers relaxed fit",
      },
      {
        category: "sepatu",
        name: "Woven Leather Sandals / Espadrilles",
        material: "Suede & Jute Insole",
        color: "Cognac Brown",
        colorHex: "#A67C52",
        estimatedPrice: "Rp 120.000 - 165.000",
        shopeeQuery: "sandal kulit pria slide minimalist",
        tokopediaQuery: "sandal slide kulit pria",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "tailored_vest_chic": {
    id: "rec_tailored_vest_1",
    title: "Chic Tailored Vest & Flowy Slacks",
    tagline: "Look kekinian ala Seoul Fashion Week yang siap pakai ke kantor atau kafe.",
    overallVibe: "Smart Minimalist & Chic",
    comfortRating: 4.8,
    affordabilityRating: 4.5,
    modestFriendly: true,
    skinToneMatch: "Sangat kontras dan menonjolkan kecantikan kulit Sawo Matang dan Eksotis.",
    whyItWorks: "Vest berstruktur rapi memberi siluet tegas yang elegan, sementara kemeja dalaman flowy menjaga kenyamanan tubuh.",
    stylingTip: "Gunakan kalung rantai tipis dan bawa tas model hobo bag untuk sentuhan urban.",
    colorPalette: [
      { name: "Charcoal Slate", hex: "#3A3F47" },
      { name: "Butter Cream", hex: "#F3EBDD" },
      { name: "Camel", hex: "#C19A6B" },
      { name: "Ivory", hex: "#FFFFF0" }
    ],
    items: [
      {
        category: "atasan",
        name: "Tailored Button Vest + Inner Shirt",
        material: "Semi Wool & Katun Rayon",
        color: "Charcoal Slate",
        colorHex: "#3A3F47",
        estimatedPrice: "Rp 85.000 - 129.000",
        shopeeQuery: "vest rompi wanita tailored korea",
        tokopediaQuery: "vest wanita tailored semi wool",
      },
      {
        category: "bawahan",
        name: "Wide Leg Highwaist Slacks",
        material: "Poli Crepe Flowy Anti Kusut",
        color: "Butter Cream",
        colorHex: "#F3EBDD",
        estimatedPrice: "Rp 79.000 - 110.000",
        shopeeQuery: "celana bahan wide leg highwaist wanita",
        tokopediaQuery: "celana bahan wanita flowy",
      }
    ],
    createdAt: new Date().toISOString(),
  }
};

/**
 * Trending Curated Lookbook Feed (8 Lookbook Pilihan Kaya Kategori)
 */
export const TRENDING_LOOKS_FEED: TrendingLook[] = [
  {
    id: "trend_01",
    title: "Casual Campus Chiffon",
    vibe: "Earthy Minimalist",
    tag: "BESTSELLER",
    category: "Campus & Hijab",
    skinToneRecommendation: "Sawo Matang & Kuning Langsat",
    priceRange: "Rp 180rb - 260rb / Set",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    likes: 1248,
    outfit: PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"]
  },
  {
    id: "trend_02",
    title: "Seoul Cafe Hopping Look",
    vibe: "Korean Soft Pastel",
    tag: "TRENDING",
    category: "Weekend & Cafe",
    skinToneRecommendation: "Putih Gading & Kuning Langsat",
    priceRange: "Rp 240rb - 350rb / Set",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80",
    likes: 982,
    outfit: PRESET_OOTD_COLLECTION["hangout_nonhijab_panas_menengah"]
  },
  {
    id: "trend_03",
    title: "Modern Modest Silk Elegance",
    vibe: "Smart Glamour",
    tag: "FORMAL HIT",
    category: "Reception & Pesta",
    skinToneRecommendation: "Sawo Matang & Eksotis",
    priceRange: "Rp 320rb - 480rb / Set",
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&auto=format&fit=crop&q=80",
    likes: 856,
    outfit: PRESET_OOTD_COLLECTION["kondangan_hijab_formal_menengah"]
  },
  {
    id: "trend_04",
    title: "Smart Casual Office Nomad",
    vibe: "Clean Cut Menswear",
    tag: "MENSWEAR",
    category: "Work & Meeting",
    skinToneRecommendation: "Semua Warna Kulit Pria",
    priceRange: "Rp 290rb - 420rb / Set",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&auto=format&fit=crop&q=80",
    likes: 645,
    outfit: PRESET_OOTD_COLLECTION["kantor_pria_ac_menengah"]
  },
  {
    id: "trend_05",
    title: "Old Money Coastal Linen",
    vibe: "Quiet Luxury",
    tag: "EDITOR'S PICK",
    category: "Weekend & Cafe",
    skinToneRecommendation: "Kuning Langsat & Putih Gading",
    priceRange: "Rp 220rb - 320rb / Set",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    likes: 789,
    outfit: PRESET_OOTD_COLLECTION["old_money_coastal"]
  },
  {
    id: "trend_06",
    title: "Chic Tailored Vest & Slacks",
    vibe: "Smart Minimalist",
    tag: "SEOUL VIBE",
    category: "Campus & Hijab",
    skinToneRecommendation: "Sawo Matang & Eksotis",
    priceRange: "Rp 210rb - 290rb / Set",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80",
    likes: 912,
    outfit: PRESET_OOTD_COLLECTION["tailored_vest_chic"]
  },
  {
    id: "trend_07",
    title: "Monochrome Boxy Streetwear",
    vibe: "Clean Monochrome",
    tag: "NEW DROP",
    category: "Streetwear",
    skinToneRecommendation: "Deep Bronze & Sawo Matang",
    priceRange: "Rp 260rb - 380rb / Set",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    likes: 834,
    outfit: PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"]
  },
  {
    id: "trend_08",
    title: "Sunset Terracotta Voal",
    vibe: "Warm Terracotta",
    tag: "VIRAL LOOK",
    category: "Reception & Pesta",
    skinToneRecommendation: "Kuning Langsat & Sawo Matang",
    priceRange: "Rp 310rb - 450rb / Set",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&auto=format&fit=crop&q=80",
    likes: 1105,
    outfit: PRESET_OOTD_COLLECTION["kondangan_hijab_formal_menengah"]
  }
];

export function generateHeuristicOOTD(pref: UserPreferences): OOTDRecommendation {
  const isFemale = pref.gender !== "male";
  
  if (pref.isModestHijab) {
    if (pref.occasion === "kondangan") {
      return PRESET_OOTD_COLLECTION["kondangan_hijab_formal_menengah"];
    }
    if (pref.vibe === "smart_formal") {
      return PRESET_OOTD_COLLECTION["tailored_vest_chic"];
    }
    return PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"];
  }

  if (!isFemale) {
    return PRESET_OOTD_COLLECTION["kantor_pria_ac_menengah"];
  }

  if (pref.vibe === "earthy_minimalist") {
    return PRESET_OOTD_COLLECTION["old_money_coastal"];
  }

  return PRESET_OOTD_COLLECTION["hangout_nonhijab_panas_menengah"];
}
