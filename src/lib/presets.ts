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
  },

  "scbd_corporate_blazer": {
    id: "rec_scbd_corporate_1",
    title: "SCBD BUMN Smart Corporate",
    tagline: "Wibawa eksekutif muda di jantung kota Jakarta.",
    overallVibe: "Professional & Sharp",
    comfortRating: 4.5,
    affordabilityRating: 4.3,
    modestFriendly: true,
    skinToneMatch: "Tone hitam dan emerald memancarkan aura tegas dan elegan untuk kulit Medium dan Deep.",
    whyItWorks: "Blazer berstruktur dengan kulot panjang menciptakan siluet profesional yang tetap bebas bergerak.",
    stylingTip: "Padukan dengan inner manset/kaos turtleneck tipis. Bawa structured tote bag untuk laptop.",
    colorPalette: [
      { name: "Jet Black", hex: "#111111" },
      { name: "Emerald Green", hex: "#50C878" },
      { name: "Crisp White", hex: "#FFFFFF" },
      { name: "Silver", hex: "#C0C0C0" }
    ],
    items: [
      {
        category: "atasan",
        name: "Structured Oversized Blazer + Inner",
        material: "Semi-wool Blend",
        color: "Jet Black / Emerald",
        colorHex: "#111111",
        estimatedPrice: "Rp 150.000 - 250.000",
        shopeeQuery: "blazer wanita formal korea",
        tokopediaQuery: "blazer wanita oversized hitam",
      },
      {
        category: "bawahan",
        name: "Highwaist Tailored Culottes",
        material: "Scuba / Premium Crepe",
        color: "Jet Black",
        colorHex: "#111111",
        estimatedPrice: "Rp 90.000 - 150.000",
        shopeeQuery: "celana kulot kerja wanita bahan scuba",
        tokopediaQuery: "kulot highwaist formal wanita",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "blok_m_indie_streetwear": {
    id: "rec_blok_m_indie_1",
    title: "Blok M Oversized Cargo & Baby Tee",
    tagline: "Vibe retro streetwear ala anak skena Blok M.",
    overallVibe: "Retro Streetwear & Edgy",
    comfortRating: 4.8,
    affordabilityRating: 4.7,
    modestFriendly: false,
    skinToneMatch: "Warna washed-out denim dan ashy gray cocok memberikan kesan cool pada kulit Fair dan Tan.",
    whyItWorks: "Baby tee yang pas badan diseimbangkan dengan bawahan kargo oversized memberi proporsi Y2K yang trendy.",
    stylingTip: "Pakai retro sneakers dan headphone besar sebagai aksesori statement.",
    colorPalette: [
      { name: "Washed Black", hex: "#333333" },
      { name: "Ashy Gray", hex: "#B2BEB5" },
      { name: "Cherry Red", hex: "#D2042D" },
      { name: "Denim Blue", hex: "#1560BD" }
    ],
    items: [
      {
        category: "atasan",
        name: "Graphic Baby Tee / Boxy Tee",
        material: "Cotton Combed 24s / 30s",
        color: "Washed Black / Ashy Gray",
        colorHex: "#333333",
        estimatedPrice: "Rp 50.000 - 90.000",
        shopeeQuery: "baby tee wanita y2k graphic",
        tokopediaQuery: "kaos boxy tee wanita vintage",
      },
      {
        category: "bawahan",
        name: "Oversized Parachute Cargo Pants",
        material: "Nylon Parachute",
        color: "Ashy Gray / Washed Black",
        colorHex: "#B2BEB5",
        estimatedPrice: "Rp 120.000 - 180.000",
        shopeeQuery: "celana kargo parasut wanita oversized",
        tokopediaQuery: "cargo pants y2k parachute",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "senopati_brunch_knit": {
    id: "rec_senopati_brunch_1",
    title: "Senopati Weekend Brunch & Pleated Skirt",
    tagline: "Classy & cozy look buat brunch cantik di Senopati.",
    overallVibe: "Classy Feminine",
    comfortRating: 4.7,
    affordabilityRating: 4.4,
    modestFriendly: true,
    skinToneMatch: "Warna nude & camel selalu memberikan efek hangat pada kulit Kuning Langsat dan Sawo Matang.",
    whyItWorks: "Knitwear premium dengan tekstur halus memberikan kesan mahal, dipadu rok plisket untuk siluet elegan.",
    stylingTip: "Lengkapi dengan kacamata hitam cat-eye dan handbag minimalis.",
    colorPalette: [
      { name: "Camel", hex: "#C19A6B" },
      { name: "Nude Beige", hex: "#E6D6C6" },
      { name: "Chocolate", hex: "#7B3F00" },
      { name: "Cream", hex: "#FFFDD0" }
    ],
    items: [
      {
        category: "atasan",
        name: "Sleeveless / Long-Sleeve Ribbed Knit Top",
        material: "Premium Rib Knit",
        color: "Camel / Chocolate",
        colorHex: "#C19A6B",
        estimatedPrice: "Rp 80.000 - 140.000",
        shopeeQuery: "atasan knit wanita premium lengan panjang",
        tokopediaQuery: "knit top wanita kerah square",
      },
      {
        category: "bawahan",
        name: "Maxi Pleated Skirt / Satin Skirt",
        material: "Silk Satin / Premium Chiffon",
        color: "Nude Beige",
        colorHex: "#E6D6C6",
        estimatedPrice: "Rp 90.000 - 160.000",
        shopeeQuery: "rok satin silk wanita panjang",
        tokopediaQuery: "rok plisket premium wanita panjang",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "kondangan_batik_modern_pria": {
    id: "rec_kondangan_batik_1",
    title: "Kemeja Batik Modern Tulis & Slim Chino",
    tagline: "Gagah maksimal dengan sentuhan warisan budaya.",
    overallVibe: "Formal Heritage",
    comfortRating: 4.6,
    affordabilityRating: 4.5,
    modestFriendly: true,
    skinToneMatch: "Warna sogan / cokelat gelap sangat masuk di semua skin tone pria.",
    whyItWorks: "Potongan slim-fit kemeja batik membuat tampilan tidak kaku, cocok dipadu chino gelap.",
    stylingTip: "Pakai sepatu loafers kulit dan jam tangan klasik untuk tampilan dapper.",
    colorPalette: [
      { name: "Sogan Brown", hex: "#5C4033" },
      { name: "Deep Black", hex: "#000000" },
      { name: "Gold Accent", hex: "#FFD700" },
      { name: "Navy Blue", hex: "#000080" }
    ],
    items: [
      {
        category: "atasan",
        name: "Kemeja Batik Modern Slim Fit",
        material: "Katun Primisima / Dobby",
        color: "Sogan / Navy",
        colorHex: "#5C4033",
        estimatedPrice: "Rp 150.000 - 300.000",
        shopeeQuery: "kemeja batik pria lengan panjang slim fit",
        tokopediaQuery: "batik pria modern katun",
      },
      {
        category: "bawahan",
        name: "Slim Fit Chino Pants / Trouser Hitam",
        material: "Cotton Twill / Semi-Wool",
        color: "Deep Black / Navy",
        colorHex: "#000000",
        estimatedPrice: "Rp 100.000 - 180.000",
        shopeeQuery: "celana chino pria hitam panjang",
        tokopediaQuery: "celana bahan pria slim fit hitam",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "bali_jogja_resort_linen": {
    id: "rec_resort_linen_1",
    title: "Bali Resort Camp Collar & Linen Culottes",
    tagline: "Outfit santai dengan vibes liburan tropis tanpa gerah.",
    overallVibe: "Tropical Resort Casual",
    comfortRating: 5.0,
    affordabilityRating: 4.8,
    modestFriendly: false,
    skinToneMatch: "Warna terang linen seperti putih dan mint mencerahkan kulit Eksotis dan Tan.",
    whyItWorks: "Bahan linen dan rayon sangat breathable, cocok untuk cuaca pantai yang lembab.",
    stylingTip: "Biarkan 1-2 kancing atas terbuka, pakai sandal jepit kulit / slide sandals.",
    colorPalette: [
      { name: "White Linen", hex: "#F3F4F6" },
      { name: "Terracotta", hex: "#E2725B" },
      { name: "Mint Green", hex: "#98FF98" },
      { name: "Sand", hex: "#C2B280" }
    ],
    items: [
      {
        category: "atasan",
        name: "Camp Collar Linen / Rayon Shirt",
        material: "Rayon Crinkle / Linen",
        color: "White / Mint",
        colorHex: "#F3F4F6",
        estimatedPrice: "Rp 70.000 - 120.000",
        shopeeQuery: "kemeja rayon pria polos santai",
        tokopediaQuery: "kemeja linen kerah cuban pria liburan",
      },
      {
        category: "bawahan",
        name: "Linen Drawstring Shorts / Culottes",
        material: "Linen Blend",
        color: "Sand / Terracotta",
        colorHex: "#C2B280",
        estimatedPrice: "Rp 60.000 - 100.000",
        shopeeQuery: "celana pendek pria katun linen",
        tokopediaQuery: "celana pendek pantai pria",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "athleisure_cafe_run": {
    id: "rec_athleisure_1",
    title: "Athleisure Morning Run to Cafe",
    tagline: "Dari jogging pagi langsung ngopi cantik tanpa ganti baju.",
    overallVibe: "Sporty & Active",
    comfortRating: 5.0,
    affordabilityRating: 4.8,
    modestFriendly: false,
    skinToneMatch: "Kontras warna hitam dan neon minimalis cocok untuk segala tone.",
    whyItWorks: "Bahan dry-fit spandex memeluk tubuh tanpa membatasi gerak, nyaman dipakai seharian.",
    stylingTip: "Ikat jaket windbreaker di pinggang dan pakai running shoes yang stylish.",
    colorPalette: [
      { name: "Matte Black", hex: "#1A1A1A" },
      { name: "Neon Lime Accent", hex: "#32CD32" },
      { name: "Cool Grey", hex: "#8C92AC" },
      { name: "White", hex: "#FFFFFF" }
    ],
    items: [
      {
        category: "atasan",
        name: "Seamless Sports Bra / Dri-fit Top + Windbreaker",
        material: "Spandex Blend / Nylon",
        color: "Matte Black / Cool Grey",
        colorHex: "#1A1A1A",
        estimatedPrice: "Rp 80.000 - 150.000",
        shopeeQuery: "jaket windbreaker wanita olahraga",
        tokopediaQuery: "atasan olahraga wanita dry fit",
      },
      {
        category: "bawahan",
        name: "Highwaist Leggings / Biker Shorts",
        material: "Nylon Spandex",
        color: "Matte Black",
        colorHex: "#1A1A1A",
        estimatedPrice: "Rp 90.000 - 140.000",
        shopeeQuery: "legging olahraga wanita highwaist tebal",
        tokopediaQuery: "biker shorts wanita olahraga",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "rainy_cardigan_cozy": {
    id: "rec_rainy_cardigan_1",
    title: "Rainy Day Soft Layering Knit & Pashmina",
    tagline: "Nyaman dan hangat di cuaca hujan, tetap stylish.",
    overallVibe: "Cozy & Warm",
    comfortRating: 4.9,
    affordabilityRating: 4.6,
    modestFriendly: true,
    skinToneMatch: "Warna plum dan navy memberi kedalaman pada kulit Kuning Langsat dan Fair.",
    whyItWorks: "Layering dengan cardigan tebal menjaga suhu tubuh saat hujan, dipadu dengan bawahan denim yang awet.",
    stylingTip: "Padukan dengan pashmina kasmir/voal dan sepatu bot tahan air atau sneakers kulit.",
    colorPalette: [
      { name: "Plum", hex: "#8E4585" },
      { name: "Navy", hex: "#000080" },
      { name: "Grey Marl", hex: "#BFC1C2" },
      { name: "Ivory", hex: "#FFFFF0" }
    ],
    items: [
      {
        category: "atasan",
        name: "Chunky Knit Cardigan",
        material: "Thick Cotton Acrylic Knit",
        color: "Plum / Grey Marl",
        colorHex: "#8E4585",
        estimatedPrice: "Rp 110.000 - 180.000",
        shopeeQuery: "cardigan rajut tebal wanita korea",
        tokopediaQuery: "chunky knit cardigan wanita tebal",
      },
      {
        category: "bawahan",
        name: "Straight Leg Denim / Corduroy Pants",
        material: "Denim / Corduroy",
        color: "Navy / Black",
        colorHex: "#000080",
        estimatedPrice: "Rp 130.000 - 200.000",
        shopeeQuery: "celana jeans wanita straight leg",
        tokopediaQuery: "celana corduroy wanita pinggang karet",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "modest_pastel_date": {
    id: "rec_modest_pastel_1",
    title: "Sweetheart Pastel Date & Voal Miracle",
    tagline: "Manis dan anggun untuk first date atau ngemal santai.",
    overallVibe: "Feminine & Soft",
    comfortRating: 4.8,
    affordabilityRating: 4.7,
    modestFriendly: true,
    skinToneMatch: "Warna pastel lilac dan baby blue memancarkan cahaya pada kulit Putih Gading dan Kuning Langsat.",
    whyItWorks: "Paduan tunik ruffles atau dress dengan detail feminin menonjolkan keanggunan modis tanpa berlebihan.",
    stylingTip: "Pilih hijab segiempat voal miracle polos warna senada, ikat rapi di leher.",
    colorPalette: [
      { name: "Soft Lilac", hex: "#C8A2C8" },
      { name: "Baby Blue", hex: "#89CFF0" },
      { name: "Blush Pink", hex: "#FFB6C1" },
      { name: "White", hex: "#FFFFFF" }
    ],
    items: [
      {
        category: "atasan",
        name: "Tunik Ruffle / Midi Dress Floral Tipis",
        material: "Crinkle Airflow / Katun Rayon",
        color: "Soft Lilac / Blush Pink",
        colorHex: "#C8A2C8",
        estimatedPrice: "Rp 85.000 - 140.000",
        shopeeQuery: "tunik ruffle wanita crinkle airflow",
        tokopediaQuery: "midi dress korean style wanita floral",
      },
      {
        category: "outer_hijab",
        name: "Hijab Segiempat Voal Miracle",
        material: "Voal Miracle Premium",
        color: "Senada",
        colorHex: "#FFB6C1",
        estimatedPrice: "Rp 35.000 - 55.000",
        shopeeQuery: "jilbab segiempat voal miracle polos",
        tokopediaQuery: "hijab voal miracle",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "monochrome_boxy_pria": {
    id: "rec_monochrome_boxy_pria_1",
    title: "Monochrome Boxy Streetwear",
    tagline: "Gaya streetwear bersih, anti-gerah untuk urban explorers.",
    overallVibe: "Clean Monochrome Streetwear",
    comfortRating: 4.9,
    affordabilityRating: 4.8,
    modestFriendly: false,
    skinToneMatch: "Dominasi hitam/putih netral di kulit Eksotis, Medium, dan Fair.",
    whyItWorks: "Kaos potongan boxy memberi ilusi bahu lebar, disandingkan celana wide leg yang sejuk.",
    stylingTip: "Gunakan chain necklace perak dan chunky sneakers untuk melengkapi siluet oversized.",
    colorPalette: [
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Silver", hex: "#C0C0C0" }
    ],
    items: [
      {
        category: "atasan",
        name: "Heavyweight Boxy Fit T-Shirt",
        material: "Cotton Combed 20s / 24s",
        color: "Black / White",
        colorHex: "#000000",
        estimatedPrice: "Rp 70.000 - 130.000",
        shopeeQuery: "kaos boxy fit pria oversized polos tebal",
        tokopediaQuery: "boxy t-shirt pria katun 20s",
      },
      {
        category: "bawahan",
        name: "Wide Leg Trousers / Parachute Pants",
        material: "Nylon / Drill",
        color: "Black / Charcoal",
        colorHex: "#36454F",
        estimatedPrice: "Rp 110.000 - 170.000",
        shopeeQuery: "celana wide leg pria panjang parasut",
        tokopediaQuery: "celana kargo pria wide fit",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "minimalist_slip_dress": {
    id: "rec_minimalist_slip_1",
    title: "Quiet Luxury Slip Dress & Linen Blazer",
    tagline: "Tampilan effortless mewah dengan silk dress dan blazer linen.",
    overallVibe: "Effortless Luxury",
    comfortRating: 4.7,
    affordabilityRating: 4.3,
    modestFriendly: false,
    skinToneMatch: "Kilau champagne dan hitam tegas memancarkan aura elegan di kulit Sawo Matang dan Kuning Langsat.",
    whyItWorks: "Slip dress yang feminin diseimbangkan dengan luaran blazer maskulin untuk chic look instan.",
    stylingTip: "Tarik lengan blazer hingga siku, gunakan strappy heels atau mules.",
    colorPalette: [
      { name: "Champagne", hex: "#F7E7CE" },
      { name: "Midnight Black", hex: "#000000" },
      { name: "Taupe", hex: "#483C32" },
      { name: "Ivory", hex: "#FFFFF0" }
    ],
    items: [
      {
        category: "atasan",
        name: "Silk Slip Dress Midi / Maxi",
        material: "Premium Silk Satin",
        color: "Champagne / Black",
        colorHex: "#F7E7CE",
        estimatedPrice: "Rp 120.000 - 200.000",
        shopeeQuery: "slip dress satin silk wanita midi",
        tokopediaQuery: "dress satin wanita elegan",
      },
      {
        category: "outer_hijab",
        name: "Linen Oversized Blazer (Optional)",
        material: "Linen Blend",
        color: "Ivory / Taupe",
        colorHex: "#FFFFF0",
        estimatedPrice: "Rp 150.000 - 250.000",
        shopeeQuery: "blazer linen wanita oversized",
        tokopediaQuery: "blazer wanita bahan linen korea",
      }
    ],
    createdAt: new Date().toISOString(),
  }
};

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
    title: "Chic Tailored Vest & Flowy Slacks",
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
    title: "SCBD BUMN Smart Corporate",
    vibe: "Professional & Sharp",
    tag: "OFFICE ESSENTIAL",
    category: "Work & Meeting",
    skinToneRecommendation: "Medium & Deep",
    priceRange: "Rp 250rb - 400rb / Set",
    image: "https://images.unsplash.com/photo-1574655563118-3e3eab32015d?w=600&auto=format&fit=crop&q=80",
    likes: 673,
    outfit: PRESET_OOTD_COLLECTION["scbd_corporate_blazer"]
  },
  {
    id: "trend_08",
    title: "Blok M Oversized Cargo",
    vibe: "Retro Streetwear & Edgy",
    tag: "STREETWEAR",
    category: "Weekend & Cafe",
    skinToneRecommendation: "Fair & Tan",
    priceRange: "Rp 170rb - 270rb / Set",
    image: "https://images.unsplash.com/photo-1517423568366-8b83523034fd?w=600&auto=format&fit=crop&q=80",
    likes: 1302,
    outfit: PRESET_OOTD_COLLECTION["blok_m_indie_streetwear"]
  },
  {
    id: "trend_09",
    title: "Bali Resort Camp Collar",
    vibe: "Tropical Resort Casual",
    tag: "VACATION",
    category: "Travel",
    skinToneRecommendation: "Eksotis & Tan",
    priceRange: "Rp 150rb - 250rb / Set",
    image: "https://images.unsplash.com/photo-1516826957135-700ede19c6ce?w=600&auto=format&fit=crop&q=80",
    likes: 890,
    outfit: PRESET_OOTD_COLLECTION["bali_jogja_resort_linen"]
  },
  {
    id: "trend_10",
    title: "Batik Modern Tulis",
    vibe: "Formal Heritage",
    tag: "CULTURE",
    category: "Reception & Pesta",
    skinToneRecommendation: "Sogan / Cokelat Gelap",
    priceRange: "Rp 300rb - 500rb / Set",
    image: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=600&auto=format&fit=crop&q=80",
    likes: 540,
    outfit: PRESET_OOTD_COLLECTION["kondangan_batik_modern_pria"]
  },
  {
    id: "trend_11",
    title: "Senopati Weekend Brunch",
    vibe: "Classy Feminine",
    tag: "LUXURY",
    category: "Weekend & Cafe",
    skinToneRecommendation: "Kuning Langsat & Sawo Matang",
    priceRange: "Rp 250rb - 350rb / Set",
    image: "https://images.unsplash.com/photo-1600881333168-2ef49b341f30?w=600&auto=format&fit=crop&q=80",
    likes: 1105,
    outfit: PRESET_OOTD_COLLECTION["senopati_brunch_knit"]
  },
  {
    id: "trend_12",
    title: "Monochrome Boxy Pria",
    vibe: "Clean Monochrome Streetwear",
    tag: "NEW DROP",
    category: "Streetwear",
    skinToneRecommendation: "Deep Bronze & Sawo Matang",
    priceRange: "Rp 260rb - 380rb / Set",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
    likes: 834,
    outfit: PRESET_OOTD_COLLECTION["monochrome_boxy_pria"]
  },
  {
    id: "trend_13",
    title: "Athleisure Morning Run to Cafe",
    vibe: "Sporty & Active",
    tag: "ACTIVEWEAR",
    category: "Weekend & Cafe",
    skinToneRecommendation: "Semua Tone Kulit",
    priceRange: "Rp 170rb - 290rb / Set",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=600&auto=format&fit=crop&q=80",
    likes: 720,
    outfit: PRESET_OOTD_COLLECTION["athleisure_cafe_run"]
  },
  {
    id: "trend_14",
    title: "Rainy Day Soft Layering Knit",
    vibe: "Cozy & Warm",
    tag: "ESSENTIAL",
    category: "Campus & Hijab",
    skinToneRecommendation: "Fair & Kuning Langsat",
    priceRange: "Rp 240rb - 380rb / Set",
    image: "https://images.unsplash.com/photo-1516089309489-0824b22db7dc?w=600&auto=format&fit=crop&q=80",
    likes: 1045,
    outfit: PRESET_OOTD_COLLECTION["rainy_cardigan_cozy"]
  },
  {
    id: "trend_15",
    title: "Sweetheart Pastel Date",
    vibe: "Feminine & Soft",
    tag: "DATE NIGHT",
    category: "Weekend & Cafe",
    skinToneRecommendation: "Putih Gading & Kuning Langsat",
    priceRange: "Rp 120rb - 195rb / Set",
    image: "https://images.unsplash.com/photo-1518151978160-c322b74070a7?w=600&auto=format&fit=crop&q=80",
    likes: 955,
    outfit: PRESET_OOTD_COLLECTION["modest_pastel_date"]
  },
  {
    id: "trend_16",
    title: "Quiet Luxury Slip Dress",
    vibe: "Effortless Luxury",
    tag: "EDITOR'S PICK",
    category: "Reception & Pesta",
    skinToneRecommendation: "Sawo Matang & Kuning Langsat",
    priceRange: "Rp 270rb - 450rb / Set",
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?w=600&auto=format&fit=crop&q=80",
    likes: 812,
    outfit: PRESET_OOTD_COLLECTION["minimalist_slip_dress"]
  }
];

export function generateHeuristicOOTD(pref: UserPreferences): OOTDRecommendation {
  const isFemale = pref.gender !== "male";

  // Multi-factor matching score logic
  let selectedId = "hangout_nonhijab_panas_menengah";

  if (isFemale) {
    if (pref.isModestHijab) {
      if (pref.occasion === "kondangan") selectedId = "kondangan_hijab_formal_menengah";
      else if (pref.occasion === "kantor") selectedId = "scbd_corporate_blazer";
      else if (pref.occasion === "kuliah") selectedId = "kuliah_hijab_panas_hemat";
      else if (pref.weather === "hujan_dingin") selectedId = "rainy_cardigan_cozy";
      else if (pref.vibe === "smart_formal") selectedId = "tailored_vest_chic";
      else selectedId = "modest_pastel_date";
    } else {
      if (pref.occasion === "santai_rumah" && pref.vibe === "earthy_minimalist") selectedId = "old_money_coastal";
      else if (pref.occasion === "kantor") selectedId = "scbd_corporate_blazer";
      else if (pref.vibe === "vintage_retro" || pref.vibe === "streetwear") selectedId = "blok_m_indie_streetwear";
      else if (pref.occasion === "dating") selectedId = "senopati_brunch_knit";
      else if (pref.occasion === "olahraga") selectedId = "athleisure_cafe_run";
      else if (pref.vibe === "korean_soft") selectedId = "hangout_nonhijab_panas_menengah";
      else if (pref.vibe === "smart_formal") selectedId = "minimalist_slip_dress";
      else selectedId = "bali_jogja_resort_linen";
    }
  } else {
    // Male
    if (pref.occasion === "kantor" || pref.vibe === "smart_formal") selectedId = "kantor_pria_ac_menengah";
    else if (pref.occasion === "kondangan") selectedId = "kondangan_batik_modern_pria";
    else if (pref.occasion === "hangout" || pref.weather === "panas_terik") selectedId = "bali_jogja_resort_linen";
    else if (pref.vibe === "streetwear") selectedId = "monochrome_boxy_pria";
    else selectedId = "old_money_coastal";
  }

  // Fallback if not found
  const baseResult = PRESET_OOTD_COLLECTION[selectedId] || PRESET_OOTD_COLLECTION["hangout_nonhijab_panas_menengah"];
  const result: OOTDRecommendation = JSON.parse(JSON.stringify(baseResult));
  
  // Dynamically customize the skinToneMatch text
  if (pref.skinTone === "medium") {
    result.skinToneMatch = "Harmonisasi warna earthy & warm gold menonjolkan kecantikan eksotis kulit Sawo Matang tanpa kesan kusam.";
  } else if (pref.skinTone === "light") {
    result.skinToneMatch = "Palet lembut ini memberikan efek radiant glowing pada kulit Kuning Langsat.";
  } else if (pref.skinTone === "fair") {
    result.skinToneMatch = "Kontras seimbang yang memberi rona segar alami pada kulit Putih Gading.";
  } else if (pref.skinTone === "tan" || pref.skinTone === "deep") {
    result.skinToneMatch = "Warna jewel tone & kontras tegas memancarkan kilau mewah kulit eksotis.";
  }

  return result;
}
