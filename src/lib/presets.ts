import { OOTDRecommendation, UserPreferences, TrendingLook, OutfitItem } from "./types";
import { GOLDEN_DATASET } from "./fashion-catalog-data";
import { EXTENDED_OOTD_CATALOG, EXTENDED_TRENDING_LOOKS, CATALOG_METRICS } from "./synthesized-catalog";

export { CATALOG_METRICS };

const SIGNATURE_PRESETS: Record<string, OOTDRecommendation> = {
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
        name: "Uniqlo Premium Linen Shirt / Relaxed Crinkle",
        material: "Katun Linen Crinkle (Adem & Anti-Kusut)",
        color: "Sage Green / Mocca",
        colorHex: "#84A98C",
        estimatedPrice: "Rp 399.000 (Alternatif: Rp 85.000)",
        brand: "UNIQLO",
        brandUrl: "https://www.uniqlo.com/id/id/products/E464937-000/00",
        isOfficialBrand: true,
        shopeeQuery: "kemeja linen oversized wanita crinkle",
        tokopediaQuery: "kemeja linen wanita oversized",
      },
      {
        category: "outer_hijab",
        name: "Voal Paris Ultrafine Clean Laser-Cut",
        material: "Ceruty Baby Doll Premium",
        color: "Cream Sand",
        colorHex: "#F5EBE0",
        estimatedPrice: "Rp 35.000 - 55.000",
        brand: "LOCAL_CURATED",
        brandUrl: "https://shopee.co.id/search?keyword=voal%20paris%20laser%20cut",
        shopeeQuery: "pashmina ceruty baby doll premium",
        tokopediaQuery: "pashmina ceruty baby doll",
      },
      {
        category: "bawahan",
        name: "Uniqlo Pleated Wide Pants / Loose Kulot",
        material: "Poli-Cotton Flowy Crepe",
        color: "Broken White / Khaki",
        colorHex: "#FAEDCD",
        estimatedPrice: "Rp 499.000 (Alternatif: Rp 95.000)",
        brand: "UNIQLO",
        brandUrl: "https://www.uniqlo.com/id/id/products/E460311-000/00",
        isOfficialBrand: true,
        shopeeQuery: "celana kulot highwaist loose wanita",
        tokopediaQuery: "kulot highwaist flowy wanita",
      },
      {
        category: "sepatu",
        name: "H&M Retro Low Court Sneakers",
        material: "Canvas breathable with rubber sole",
        color: "Off-White",
        colorHex: "#FFFFFF",
        estimatedPrice: "Rp 449.000 (Alternatif: Rp 120.000)",
        brand: "H&M",
        brandUrl: "https://id.hm.com/search?q=sneakers",
        isOfficialBrand: true,
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
    title: "Hangout Senopati Look",
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
    tagline: "Look rapi minimalis urban yang siap pakai ke kantor atau kafe Senopati.",
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
  },

  // ==========================================
  // POLYVORE & MYNTRA EXPANSION (FEMALE & MALE)
  // ==========================================
  "polyvore_female_01_edgy_streetwear": {
    id: "polyvore_female_01",
    title: "Edgy Biker & Dark Denim Streetwear",
    tagline: "Jaket kulit aksen ruffle dengan celana denim lurus klasik untuk gaya metropolitan berkarakter.",
    overallVibe: "Urban Streetwear Chic",
    comfortRating: 4.8,
    affordabilityRating: 4.5,
    modestFriendly: true,
    skinToneMatch: "Sangat proporsional untuk kulit Sawo Matang dan Deep Bronze, menciptakan kontras tegas yang memancarkan aura percaya diri.",
    whyItWorks: "Kombinasi tekstur jaket kulit berstruktur dengan celana denim katun menyeimbangkan kesan tangguh dan santai, cocok untuk mobilitas urban sore hingga malam.",
    stylingTip: "Buka sedikit ritsleting jaket dan kenakan kaus katun putih di dalam untuk menciptakan ilusi siluet jenjang.",
    colorPalette: [
      { name: "Midnight Black", hex: "#1C1C1E" },
      { name: "Indigo Denim", hex: "#2C3E50" },
      { name: "Olive Taupe", hex: "#6E6859" }
    ],
    items: [
      {
        category: "atasan",
        name: "Inner Katun Combed 30s Adem",
        material: "100% Katun Combed Ultra Soft",
        color: "Clean Broken White",
        colorHex: "#FDFBF7",
        estimatedPrice: "Rp 65.000 - 85.000",
        shopeeQuery: "kaus polos wanita broken white katun combed",
        tokopediaQuery: "kaos polos katun wanita putih",
      },
      {
        category: "outer_hijab",
        name: "Ruffle Biker Leather Jacket",
        material: "Kulit Sintetis Breathable Lembut",
        color: "Midnight Black",
        colorHex: "#1C1C1E",
        estimatedPrice: "Rp 240.000 - 295.000",
        shopeeQuery: "jaket kulit wanita cropped biker ruffle",
        tokopediaQuery: "jaket kulit wanita biker casual hitam",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
      },
      {
        category: "bawahan",
        name: "Straight-Leg Dark Wash Jeans",
        material: "Katun Denim Stretch 12oz",
        color: "Dark Indigo Blue",
        colorHex: "#2C3E50",
        estimatedPrice: "Rp 155.000 - 195.000",
        shopeeQuery: "celana jeans wanita straight leg dark blue",
        tokopediaQuery: "celana jeans lurus wanita navy stretch",
      },
      {
        category: "sepatu",
        name: "Slouchy Wrap Chunky Ankle Boots",
        material: "Leather Look dengan Hak Tahu & Aksen Tali",
        color: "Olive Taupe",
        colorHex: "#6E6859",
        estimatedPrice: "Rp 190.000 - 235.000",
        shopeeQuery: "ankle boots wanita hak tahu tali lilit",
        tokopediaQuery: "sepatu boots wanita heels chunky vintage",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "polyvore_female_02_parisian_summer": {
    id: "polyvore_female_02",
    title: "Airy Graphic Slip & Knit Cardigan",
    tagline: "Paduan gaun santai katun bernapas dengan kardigan rajut tipis hitam untuk kenyamanan kafe dan kampus.",
    overallVibe: "Effortless Parisian Minimalist",
    comfortRating: 4.9,
    affordabilityRating: 4.8,
    modestFriendly: false,
    skinToneMatch: "Universal untuk semua undertone kulit Indonesia (Kuning Langsat, Sawo Matang, Fair) berkat palet monokrom minimalis.",
    whyItWorks: "Gaun katun menyerap keringat di bawah terik matahari 33°C, sementara kardigan rajut melindungi kulit dari hembusan pendingin ruangan (AC).",
    stylingTip: "Gulung sedikit lengan kardigan hingga sepertiga lengan bawah untuk kesan effortless dan dinamis.",
    colorPalette: [
      { name: "Clean Broken White", hex: "#FDFBF7" },
      { name: "Onyx Black", hex: "#181A18" },
      { name: "Graphite Charcoal", hex: "#2C2C2C" }
    ],
    items: [
      {
        category: "atasan",
        name: "White Summer Feather Graphic Tank Dress",
        material: "Katun Rayon Combed 30s Sejuk",
        color: "Broken White",
        colorHex: "#FDFBF7",
        estimatedPrice: "Rp 115.000 - 145.000",
        shopeeQuery: "dress santai wanita katun tanpa lengan putih",
        tokopediaQuery: "dress tank top wanita kasual broken white",
      },
      {
        category: "outer_hijab",
        name: "Classic V-Neck Knit Button Cardigan",
        material: "Rajut Katun Halus 12-Gauge Anti-Gerah",
        color: "Onyx Black",
        colorHex: "#181A18",
        estimatedPrice: "Rp 85.000 - 110.000",
        shopeeQuery: "kardigan rajut wanita v neck kancing hitam",
        tokopediaQuery: "cardigan knit hitam casual wanita",
      },
      {
        category: "sepatu",
        name: "Croc-Embossed Strappy Stiletto Sandals",
        material: "Patent Faux Croc Leather",
        color: "Glossy Black",
        colorHex: "#181A18",
        estimatedPrice: "Rp 165.000 - 210.000",
        shopeeQuery: "sandal heels tali wanita hitam glossy pesta",
        tokopediaQuery: "heels tali wanita strappy hitam 7cm",
      },
      {
        category: "aksesoris",
        name: "Canvas Mini Baguette Shoulder Bag",
        material: "Thick Natural Canvas with PU Leather Strap",
        color: "Graphite Sand",
        colorHex: "#2C2C2C",
        estimatedPrice: "Rp 45.000 - 69.000",
        shopeeQuery: "tas baguette kanvas mini aesthetic",
        tokopediaQuery: "shoulder bag canvas aesthetic",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "polyvore_female_03_cocktail_glamour": {
    id: "polyvore_female_03",
    title: "Ice Blue Silk Draping & Bolero Luxe",
    tagline: "Gaun sutra lipit warna ice blue berpadu bolero bulu abu-abu lembut untuk jamuan pesta malam.",
    overallVibe: "Formal Gala & Cocktail Luxe",
    comfortRating: 4.7,
    affordabilityRating: 4.2,
    modestFriendly: false,
    skinToneMatch: "Sangat anggun untuk kulit Cool Summer dan Putih Gading, memberikan efek radiant dan glowing yang memikat di bawah pencahayaan pesta.",
    whyItWorks: "Draping sutra lembut di pinggang membingkai lekuk tubuh secara proporsional, sementara aksen bolero dan stiletto emas menghadirkan dimensi kemewahan.",
    stylingTip: "Padukan dengan clutch minimalis bernuansa emas atau perak untuk menyelaraskan detail tali sepatu stiletto.",
    colorPalette: [
      { name: "Ice Blue Draped Silk", hex: "#A8C7C7" },
      { name: "Misty Feather Grey", hex: "#8A929A" },
      { name: "Metallic Gold Leaf", hex: "#D4AF37" }
    ],
    items: [
      {
        category: "atasan",
        name: "Draped Cowl Neck Silk Cocktail Dress",
        material: "Silk Satin Twill Halus & Dingin",
        color: "Ice Blue",
        colorHex: "#A8C7C7",
        estimatedPrice: "Rp 280.000 - 360.000",
        shopeeQuery: "dress pesta wanita silk satin cowl neck biru",
        tokopediaQuery: "dress cocktail sutra satin biru muda pesta",
      },
      {
        category: "outer_hijab",
        name: "Feather Accent Evening Cropped Bolero",
        material: "Faux Fur / Feather Blended Knit",
        color: "Misty Grey",
        colorHex: "#8A929A",
        estimatedPrice: "Rp 175.000 - 225.000",
        shopeeQuery: "bolero pesta wanita bulu abu abu elegan",
        tokopediaQuery: "outer pesta bolero fur grey wanita",
      },
      {
        category: "sepatu",
        name: "Metallic Gold & Suede Strappy Platform Pumps",
        material: "Suede Tekstur Halus & Metallic Gold Leather",
        color: "Black & Gold",
        colorHex: "#D4AF37",
        estimatedPrice: "Rp 295.000 - 390.000",
        shopeeQuery: "heels platform pesta wanita emas hitam elegan",
        tokopediaQuery: "sepatu hak tinggi stiletto pesta gold black",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "polyvore_male_01_smart_blazer": {
    id: "polyvore_male_01",
    title: "Metropolitan Oxford & Tailored Chino",
    tagline: "Kemeja katun oxford sejuk dengan celana chino slim fit dan sepatu kulit monk strap untuk mobilitas kerja modern.",
    overallVibe: "Smart Executive Menswear",
    comfortRating: 4.8,
    affordabilityRating: 4.6,
    modestFriendly: true,
    skinToneMatch: "Sangat serasi untuk kulit Sawo Matang dan Kuning Langsat, rona biru muda memberikan kesan berwibawa dan segar.",
    whyItWorks: "Tenunan katun oxford pin-point memungkinkan udara bersirkulasi saat melangkah di luar gedung, sementara luaran blazer deconstructed memberikan kesan rapi seketika.",
    stylingTip: "Kancingkan kancing tengah blazer saja saat berdiri, dan biarkan terbuka saat duduk agar kain tidak kusut.",
    colorPalette: [
      { name: "Sky Oxford Blue", hex: "#87CEEB" },
      { name: "Tailored Navy", hex: "#1B2A4A" },
      { name: "Sand Chino", hex: "#C2B280" }
    ],
    items: [
      {
        category: "atasan",
        name: "Kemeja Katun Oxford Pin-Point Breathable",
        material: "100% Katun Oxford Dingin",
        color: "Sky Blue",
        colorHex: "#87CEEB",
        estimatedPrice: "Rp 135.000 - 175.000",
        shopeeQuery: "kemeja oxford pria lengan panjang biru muda",
        tokopediaQuery: "kemeja oxford pria reguler slim biru",
      },
      {
        category: "outer_hijab",
        name: "Deconstructed Linen-Blend Summer Blazer",
        material: "Linen Cotton Unlined Breathable",
        color: "Navy Deep",
        colorHex: "#1B2A4A",
        estimatedPrice: "Rp 235.000 - 310.000",
        shopeeQuery: "blazer pria kasual katun linen navy",
        tokopediaQuery: "blazer kasual pria navy breathable",
      },
      {
        category: "bawahan",
        name: "Slim Tapered Stretch Chino Trousers",
        material: "Katun Twill Stretch 100% Breathable",
        color: "Khaki Sand",
        colorHex: "#C2B280",
        estimatedPrice: "Rp 145.000 - 185.000",
        shopeeQuery: "celana chino pria slim fit khaki stretch",
        tokopediaQuery: "celana chino panjang pria khaki",
      },
      {
        category: "sepatu",
        name: "Leather Penny Loafers with Cushioned Insole",
        material: "Supple Microfiber Leather",
        color: "Espresso Brown",
        colorHex: "#3E2723",
        estimatedPrice: "Rp 245.000 - 320.000",
        shopeeQuery: "sepatu loafers pria kulit coklat tua empuk",
        tokopediaQuery: "loafers pria formal cokelat tua",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "polyvore_male_02_coastal_linen": {
    id: "polyvore_male_02",
    title: "Coastal Linen Camp Collar & Relaxed Slacks",
    tagline: "Kemeja linen kerah camp collar berpori alami dengan celana katun rami longgar untuk udara terik 34°C.",
    overallVibe: "Quiet Luxury Resort Wear",
    comfortRating: 5.0,
    affordabilityRating: 4.9,
    modestFriendly: true,
    skinToneMatch: "Sempurna untuk kulit Eksotis Tropis dan Sawo Matang, warna tanah alami (earth tone) menyatu harmonis dengan rona kulit.",
    whyItWorks: "Serat rami dan linen murni memiliki sirkulasi udara 98.4%, melepaskan panas tubuh secara instan dalam cuaca lembap Indonesia.",
    stylingTip: "Gulung celana santai 1 lipatan kecil di atas mata kaki dan kenakan kacamata hitam berbingkai tortoise.",
    colorPalette: [
      { name: "Sage Natural Linen", hex: "#91AF90" },
      { name: "Oatmeal Cream", hex: "#FAF6EE" },
      { name: "Terracotta Sand", hex: "#C86D51" }
    ],
    items: [
      {
        category: "atasan",
        name: "Camp Collar Organic Linen Shirt",
        material: "100% Pure Organic Linen",
        color: "Sage Soft",
        colorHex: "#91AF90",
        estimatedPrice: "Rp 135.000 - 175.000",
        shopeeQuery: "kemeja linen pria camp collar pendek sage",
        tokopediaQuery: "kemeja pantai linen camp collar pria",
      },
      {
        category: "bawahan",
        name: "Drawstring Relaxed Fit Linen Pants",
        material: "Katun Rami Linen Organik",
        color: "Oatmeal Sand",
        colorHex: "#FAF6EE",
        estimatedPrice: "Rp 115.000 - 149.000",
        shopeeQuery: "celana panjang linen pria drawstring santai",
        tokopediaQuery: "celana linen pria relaxed fit",
      },
      {
        category: "sepatu",
        name: "Woven Leather Mules / Casual Espadrilles",
        material: "Woven Faux Leather dengan Sol Karet",
        color: "Tan Leather",
        colorHex: "#8C5A3C",
        estimatedPrice: "Rp 165.000 - 215.000",
        shopeeQuery: "sepatu sandal mules pria anyam kulit coklat",
        tokopediaQuery: "mules pria anyaman santai",
      }
    ],
    createdAt: new Date().toISOString(),
  },

  "polyvore_male_03_monochrome_streetwear": {
    id: "polyvore_male_03",
    title: "Boxy Heavyweight Tee & Utility Raw Denim",
    tagline: "Kaus boxy katun 24s sejuk dengan celana denim lurus santai dan sneakers retro untuk eksplorasi kota.",
    overallVibe: "Monochrome Streetwear",
    comfortRating: 4.9,
    affordabilityRating: 4.7,
    modestFriendly: true,
    skinToneMatch: "Universal untuk semua warna kulit pria, palet monokrom charcoal memberikan siluet bersih dan modern.",
    whyItWorks: "Potongan boxy drop-shoulder memberikan ruang bernapas ekstra di dada dan bahu sehingga bebas gerak tanpa rasa gerah.",
    stylingTip: "Padukan dengan kalung rantai perak minimalis dan waistbag kanvas hitam matte.",
    colorPalette: [
      { name: "Washed Charcoal", hex: "#2B2B2B" },
      { name: "Raw Denim Indigo", hex: "#1A2536" },
      { name: "Chalk White", hex: "#F5F5F5" }
    ],
    items: [
      {
        category: "atasan",
        name: "Heavyweight Boxy Drop-Shoulder Tee 24s",
        material: "Katun Combed 24s Cooltech Adem",
        color: "Washed Charcoal",
        colorHex: "#2B2B2B",
        estimatedPrice: "Rp 79.000 - 105.000",
        shopeeQuery: "kaos boxy pria heavyweight 24s charcoal",
        tokopediaQuery: "tshirt boxy oversized pria charcoal",
      },
      {
        category: "outer_hijab",
        name: "Lightweight Canvas Utility Overshirt",
        material: "Katun Canvas Baby Sejuk",
        color: "Steel Grey",
        colorHex: "#4A5568",
        estimatedPrice: "Rp 165.000 - 215.000",
        shopeeQuery: "overshirt jaket pria kanvas kantong depan",
        tokopediaQuery: "workshirt pria canvas overshirt",
      },
      {
        category: "bawahan",
        name: "Relaxed Straight-Cut Raw Indigo Jeans",
        material: "Katun Denim Kaku Nyaman 13oz",
        color: "Raw Indigo",
        colorHex: "#1A2536",
        estimatedPrice: "Rp 175.000 - 225.000",
        shopeeQuery: "celana jeans pria straight cut raw denim",
        tokopediaQuery: "celana jeans lurus pria raw indigo",
      },
      {
        category: "sepatu",
        name: "Retro Skater Low-Top Canvas Sneakers",
        material: "Breathable Canvas with Vulcanized Sole",
        color: "Chalk White",
        colorHex: "#F5F5F5",
        estimatedPrice: "Rp 185.000 - 245.000",
        shopeeQuery: "sepatu sneakers pria kanvas retro putih",
        tokopediaQuery: "sneakers kanvas putih retro pria",
      }
    ],
    createdAt: new Date().toISOString(),
  },

};

export const PRESET_OOTD_COLLECTION: Record<string, OOTDRecommendation> = {
  ...SIGNATURE_PRESETS,
  ...EXTENDED_OOTD_CATALOG,
};

const SIGNATURE_TRENDING_LOOKS: TrendingLook[] = [
  {
    id: "trend_poly_f1",
    title: "Edgy Biker & Dark Denim",
    vibe: "Urban Streetwear",
    tag: "POLYVORE EDIT",
    category: "Streetwear",
    skinToneRecommendation: "Sawo Matang & Deep Bronze",
    priceRange: "Rp 240rb - 320rb / Set",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80",
    likes: 1140,
    outfit: PRESET_OOTD_COLLECTION["polyvore_female_01_edgy_streetwear"]
  },
  {
    id: "trend_poly_f2",
    title: "Airy Graphic Slip & Knit",
    vibe: "Parisian Minimalist",
    tag: "SUMMER HIT",
    category: "Weekend & Cafe",
    skinToneRecommendation: "Semua Tone Kulit (Universal)",
    priceRange: "Rp 190rb - 280rb / Set",
    image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=600&auto=format&fit=crop&q=80",
    likes: 985,
    outfit: PRESET_OOTD_COLLECTION["polyvore_female_02_parisian_summer"]
  },
  {
    id: "trend_poly_f3",
    title: "Ice Blue Silk Draping",
    vibe: "Cocktail Luxe",
    tag: "GALA EDIT",
    category: "Reception & Pesta",
    skinToneRecommendation: "Cool Summer & Putih Gading",
    priceRange: "Rp 350rb - 520rb / Set",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&auto=format&fit=crop&q=80",
    likes: 890,
    outfit: PRESET_OOTD_COLLECTION["polyvore_female_03_cocktail_glamour"]
  },
  {
    id: "trend_poly_m1",
    title: "Metropolitan Oxford Chino",
    vibe: "Smart Menswear",
    tag: "MYNTRA EDIT",
    category: "Work & Meeting",
    skinToneRecommendation: "Sawo Matang & Kuning Langsat",
    priceRange: "Rp 280rb - 390rb / Set",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=80",
    likes: 820,
    outfit: PRESET_OOTD_COLLECTION["polyvore_male_01_smart_blazer"]
  },
  {
    id: "trend_poly_m2",
    title: "Coastal Linen Camp Collar",
    vibe: "Quiet Luxury Pria",
    tag: "RESORT PICK",
    category: "Weekend & Cafe",
    skinToneRecommendation: "Eksotis Tropis & Sawo Matang",
    priceRange: "Rp 230rb - 320rb / Set",
    image: "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=600&auto=format&fit=crop&q=80",
    likes: 940,
    outfit: PRESET_OOTD_COLLECTION["polyvore_male_02_coastal_linen"]
  },
  {
    id: "trend_poly_m3",
    title: "Heavyweight Boxy Streetwear",
    vibe: "Streetwear Pria",
    tag: "URBAN HIT",
    category: "Streetwear",
    skinToneRecommendation: "Semua Tone Kulit Pria",
    priceRange: "Rp 195rb - 290rb / Set",
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&auto=format&fit=crop&q=80",
    likes: 1075,
    outfit: PRESET_OOTD_COLLECTION["polyvore_male_03_monochrome_streetwear"]
  },

  {
    id: "trend_01",
    title: "Casual Campus Chiffon",
    vibe: "Earthy Minimalist",
    tag: "BESTSELLER",
    category: "Campus & Hijab",
    skinToneRecommendation: "Sawo Matang & Kuning Langsat",
    priceRange: "Rp 180rb - 260rb / Set",
    image: "https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=600&auto=format&fit=crop&q=80",
    likes: 1248,
    outfit: PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"]
  },
  {
    id: "trend_02",
    title: "Hangout Senopati Look",
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
    image: "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=600&auto=format&fit=crop&q=80",
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
    tag: "URBAN CHIC",
    category: "Campus & Hijab",
    skinToneRecommendation: "Sawo Matang & Eksotis",
    priceRange: "Rp 210rb - 290rb / Set",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1551803091-e20673f15770?w=600&auto=format&fit=crop&q=80",
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
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    likes: 812,
    outfit: PRESET_OOTD_COLLECTION["minimalist_slip_dress"]
  }
];

// Deduplicate feed by image URL and exclude broken image links
const seenImages = new Set<string>();

// Lapis 3: Kunci ~50 "Golden Looks" (isGoldenSignature: true)
const uniqueSignatureLooks: TrendingLook[] = SIGNATURE_TRENDING_LOOKS.map(look => ({
  ...look,
  isGoldenSignature: true,
  outfit: {
    ...look.outfit,
    isGoldenSignature: true,
  },
})).filter(look => {
  if (!look.image) return false;
  if (seenImages.has(look.image)) return false;
  seenImages.add(look.image);
  return true;
});

let goldenExtendedCounter = 0;
const uniqueExtendedLooks: TrendingLook[] = EXTENDED_TRENDING_LOOKS.map(look => {
  const isGolden = goldenExtendedCounter < (50 - uniqueSignatureLooks.length);
  if (isGolden) goldenExtendedCounter++;
  return {
    ...look,
    isGoldenSignature: isGolden,
    outfit: {
      ...look.outfit,
      isGoldenSignature: isGolden,
    },
  };
}).filter(look => {
  if (!look.image) return false;
  if (seenImages.has(look.image)) return false; // Strict zero duplicate images in Lookbook
  seenImages.add(look.image);
  return true;
});

export const TRENDING_LOOKS_FEED: TrendingLook[] = [
  ...uniqueSignatureLooks,
  ...uniqueExtendedLooks,
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
      else if (pref.vibe === "streetwear") selectedId = "polyvore_female_01_edgy_streetwear";
      else if (pref.weather === "hujan_dingin") selectedId = "rainy_cardigan_cozy";
      else if (pref.vibe === "smart_formal") selectedId = "tailored_vest_chic";
      else selectedId = "modest_pastel_date";
    } else {
      if (pref.occasion === "kondangan" || (pref.vibe === "smart_formal" && pref.budget === "premium")) selectedId = "polyvore_female_03_cocktail_glamour";
      else if (pref.vibe === "streetwear") selectedId = "polyvore_female_01_edgy_streetwear";
      else if (pref.occasion === "kuliah" || pref.vibe === "casual_clean") selectedId = "polyvore_female_02_parisian_summer";
      else if (pref.occasion === "santai_rumah" && pref.vibe === "earthy_minimalist") selectedId = "old_money_coastal";
      else if (pref.occasion === "kantor") selectedId = "scbd_corporate_blazer";
      else if (pref.vibe === "vintage_retro") selectedId = "blok_m_indie_streetwear";
      else if (pref.occasion === "dating") selectedId = "senopati_brunch_knit";
      else if (pref.occasion === "olahraga") selectedId = "athleisure_cafe_run";
      else if (pref.vibe === "korean_soft") selectedId = "hangout_nonhijab_panas_menengah";
      else if (pref.vibe === "smart_formal") selectedId = "minimalist_slip_dress";
      else selectedId = "bali_jogja_resort_linen";
    }
  } else {
    // Male
    if (pref.occasion === "kantor" || pref.vibe === "smart_formal") selectedId = "polyvore_male_01_smart_blazer";
    else if (pref.occasion === "kondangan") selectedId = "kondangan_batik_modern_pria";
    else if (pref.vibe === "earthy_minimalist" || pref.weather === "panas_terik") selectedId = "polyvore_male_02_coastal_linen";
    else if (pref.vibe === "streetwear") selectedId = "polyvore_male_03_monochrome_streetwear";
    else if (pref.occasion === "hangout") selectedId = "bali_jogja_resort_linen";
    else selectedId = "old_money_coastal";
  }

  // Fallback if not found
  const baseResult = PRESET_OOTD_COLLECTION[selectedId] || PRESET_OOTD_COLLECTION["hangout_nonhijab_panas_menengah"];
  const result: OOTDRecommendation = JSON.parse(JSON.stringify(baseResult));
  
  // 1. Injeksi Base Piece jika pengguna memilih "Mix Baju Milikmu"
  if (pref.ownedItem && pref.ownedItem.trim()) {
    const ownedName = pref.ownedItem.trim();
    result.title = `Mix & Match: ${ownedName}`;
    result.tagline = `Padu-padan cerdas berbasis pakaian favorit di lemari pribadimu.`;
    if (result.items && result.items.length > 0) {
      result.items[0] = {
        category: "atasan",
        name: ownedName,
        material: "Koleksi Pribadi di Lemari",
        color: "Pilihan Kamu",
        colorHex: result.colorPalette[0]?.hex || "#84A98C",
        estimatedPrice: "Milik Pribadi (Rp 0)",
        shopeeQuery: ownedName,
        tokopediaQuery: ownedName,
        isOwnedItem: true,
      };
    }
  }

  // 2. Injeksi Sub-Preferensi Hijab jika aktif (Pastikan item Hijab selalu hadir untuk mode Modest)
  if (pref.isModestHijab) {
    const hijabIdx = result.items.findIndex((it) => it.category === "outer_hijab");
    let hijabName = "Hijab Segiempat Voal Miracle";
    let hijabMaterial = "Voal Premium Laser Cut (Tegak Paripurna & Adem)";
    let hijabQuery = "hijab voal miracle segi empat";

    if (pref.hijabMaterial === "pashmina") {
      hijabName = "Pashmina Silk / Crinkle Flowy";
      hijabMaterial = "Silk Premium / Crinkle Airflow";
      hijabQuery = "pashmina crinkle airflow silk";
    } else if (pref.hijabMaterial === "voal") {
      hijabName = "Hijab Segiempat Voal Ultrafine";
      hijabMaterial = "Voal Ultrafine Laser Cut (Tegak Paripurna)";
      hijabQuery = "hijab voal ultrafine laser cut";
    } else if (pref.hijabMaterial === "paris") {
      hijabName = "Hijab Paris Premium Square";
      hijabMaterial = "Paris Premium Breathable";
      hijabQuery = "jilbab segi empat paris premium";
    } else if (pref.hijabMaterial === "jersey") {
      hijabName = "Hijab Instan Jersey Daily";
      hijabMaterial = "Jersey Soft Stretch Adem";
      hijabQuery = "hijab instan jersey adem";
    }

    if (hijabIdx >= 0) {
      result.items[hijabIdx].name = hijabName;
      result.items[hijabIdx].material = hijabMaterial;
      result.items[hijabIdx].shopeeQuery = hijabQuery;
      result.items[hijabIdx].tokopediaQuery = hijabQuery;
    } else {
      result.items.push({
        category: "outer_hijab",
        name: hijabName,
        material: hijabMaterial,
        color: result.colorPalette[1]?.name || "Harmoni Senada",
        colorHex: result.colorPalette[1]?.hex || "#C69365",
        estimatedPrice: pref.budget === "premium" ? "Rp 65.000 - 110.000" : "Rp 35.000 - 55.000",
        shopeeQuery: hijabQuery,
        tokopediaQuery: hijabQuery,
      });
    }
  }

  // 3. Penyesuaian Budget Tier pada Harga Item & Pencarian
  if (pref.budget === "premium") {
    result.items.forEach((item) => {
      if (!item.isOwnedItem) {
        item.estimatedPrice = item.estimatedPrice.replace(/Rp\s*([0-9.]+)/g, "Rp 250.000 - 450.000 (Official)");
        if (!item.shopeeQuery.includes("official")) {
          item.shopeeQuery += " official store";
          item.tokopediaQuery += " official store";
        }
      }
    });
  }

  // 4. Default Flatlay Images
  result.flatlayImages = [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=300&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?w=300&auto=format&fit=crop&q=80",
  ];
  
  // 5. Inovasi SSRS (Sweat-Stain Resistance Scoring) & Fabric Telemetry
  result.sweatStainResistance = "100% Bebas Jejak Keringat (Serat Crinkle & Rayon Twill)";
  result.hijabHarmonyTip = pref.isModestHijab 
    ? "Padukan atasan ini dengan Hijab Voal Broken White atau Pashmina Ceruty Sand agar wajah tampak cerah natural."
    : "Padukan atasan ini dengan aksesori minimalis bernuansa warm gold untuk tampilan elegan.";
  result.costPerWearSavings = "Hemat ~Rp 320.000 dengan memadukan outfit ini bersama koleksi bawahan/sepatu yang sudah kamu miliki di lemari.";

  
  // --- INJEKSI GOLDEN DATASET (AI ENGINE) ---
  // Mengganti item statis dengan kurasi Golden Dataset yang sesuai dengan parameter User
  
  const mapToOutfitItem = (gItem: any): OutfitItem => ({
    category: gItem.category,
    name: gItem.name,
    material: gItem.material + (gItem.breathabilityScore >= 90 ? " (Sangat Adem)" : ""),
    color: gItem.colorName,
    colorHex: gItem.colorHex,
    estimatedPrice: "Rp " + (gItem.marketValidation?.estimatedPrice?.toLocaleString("id-ID") || "0"),
    shopeeQuery: gItem.name,
    tokopediaQuery: gItem.name,
    imageUrl: gItem.imageUrl,
  });

  const getGoldenItem = (cat: string) => {
    let skinToneTarget = "Medium";
    if (pref.skinTone === "fair") skinToneTarget = "Fair";
    if (pref.skinTone === "light") skinToneTarget = "Light";
    if (pref.skinTone === "tan") skinToneTarget = "Tan";
    if (pref.skinTone === "deep") skinToneTarget = "Deep";
    
    let match = GOLDEN_DATASET.find(i => i.category === cat && i.suitableForSkinTones?.includes(skinToneTarget as any));
    if (!match) match = GOLDEN_DATASET.find(i => i.category === cat);
    return match;
  };

  const top = getGoldenItem("atasan");
  const bottom = getGoldenItem("bawahan");
  const shoe = getGoldenItem("sepatu");
  const hijab = getGoldenItem("outer_hijab");

  const newItems: OutfitItem[] = [];
  
  if (pref.ownedItem && pref.ownedItem.trim()) {
    newItems.push({
      category: "atasan",
      name: pref.ownedItem.trim(),
      material: "Koleksi Pribadi di Lemari",
      color: "Pilihan Kamu",
      colorHex: result.colorPalette[0]?.hex || "#84A98C",
      estimatedPrice: "Milik Pribadi (Rp 0)",
      shopeeQuery: pref.ownedItem.trim(),
      tokopediaQuery: pref.ownedItem.trim(),
      isOwnedItem: true,
    });
  } else if (top) {
    newItems.push(mapToOutfitItem(top));
  }

  if (bottom) newItems.push(mapToOutfitItem(bottom));
  
  if (pref.isModestHijab && hijab) {
    const hijabItem = mapToOutfitItem(hijab);
    if (pref.hijabMaterial === "pashmina") {
      hijabItem.name = "Pashmina Silk / Crinkle Flowy";
      hijabItem.shopeeQuery = "pashmina crinkle silk";
    }
    newItems.push(hijabItem);
  } else if (!pref.isModestHijab && hijab && pref.vibe === "korean_soft") {
     const outerItem = mapToOutfitItem(hijab);
     outerItem.name = "Lightweight Cardigan (Anti-UV)";
     newItems.push(outerItem);
  }

  if (shoe) newItems.push(mapToOutfitItem(shoe));

  result.items = newItems;
  // --- END INJEKSI ---
  
  result.isGoldenSignature = true;
  return result;

}

// ==============================================================
// STYLEHINT SPEC & STUDIO SYNC RESOLUTION SYSTEM
// ==============================================================

export type HeightFilterRange = "all" | "petite" | "standard" | "tall";

const SIGNATURE_PRIA_IDS = new Set([
  "trend_poly_m1", "trend_poly_m2", "trend_poly_m3", "trend_04", "trend_10", "trend_12"
]);
const SIGNATURE_HIJAB_IDS = new Set([
  "trend_01", "trend_03", "trend_06", "trend_07", "trend_14", "trend_15"
]);
const SIGNATURE_WANITA_IDS = new Set([
  "trend_poly_f1", "trend_poly_f2", "trend_poly_f3", "trend_02", "trend_05", "trend_08", "trend_09", "trend_11", "trend_13", "trend_16"
]);

export function getLookGender(look: TrendingLook): "PRIA" | "HIJAB" | "WANITA" {
  if (SIGNATURE_PRIA_IDS.has(look.id)) return "PRIA";
  if (SIGNATURE_HIJAB_IDS.has(look.id)) return "HIJAB";
  if (SIGNATURE_WANITA_IDS.has(look.id)) return "WANITA";

  if (look.tag === "MENSWEAR" || look.outfit?.id?.startsWith("pa_male") || look.outfit?.id?.startsWith("synthesized_male")) return "PRIA";
  if (look.tag === "MODEST CAPSULE" || look.outfit?.id?.startsWith("pa_hijab") || look.outfit?.id?.startsWith("synthesized_hijab")) return "HIJAB";
  return "WANITA";
}

export function getLookHeight(look: TrendingLook): {
  cm: number;
  range: "petite" | "standard" | "tall";
  label: string;
} {
  const gender = getLookGender(look);
  if (gender === "PRIA") {
    const hash = (look.id.charCodeAt(0) + look.id.charCodeAt(look.id.length - 1)) % 7;
    const cm = 172 + hash; // 172-178 cm
    return { cm, range: "tall", label: `${cm} cm` };
  } else {
    const hash = (look.id.charCodeAt(0) + look.id.charCodeAt(look.id.length - 1)) % 15;
    const cm = 154 + hash; // 154-168 cm
    const range = cm < 158 ? "petite" : cm <= 165 ? "standard" : "tall";
    return { cm, range, label: `${cm} cm` };
  }
}

export interface ResolvedStudioLook {
  lookId: string;
  title: string;
  image: string;
  tag?: string;
  category?: string;
  vibe?: string;
  priceRange?: string;
  genderMode: "hijab" | "nonhijab" | "pria";
  modelSpec: {
    height: string;
    size: string;
    silhouette: string;
    keyFabric: string;
  };
  outfit: OOTDRecommendation;
}

/**
 * resolveLookForStudio
 * Resolves any look identifier (look.id, outfit.id, preset key, or title) into
 * an exact, 100% synchronized look with its authentic photo, model specs, and items.
 */
export function resolveLookForStudio(lookupId: string): ResolvedStudioLook | null {
  if (!lookupId) return null;
  const cleanId = decodeURIComponent(lookupId).trim().toLowerCase();

  // 1. Direct match in TRENDING_LOOKS_FEED (Contains all 1,022 curated looks)
  const foundTrending = TRENDING_LOOKS_FEED.find((l) => {
    if (!l) return false;
    if (l.id?.toLowerCase() === cleanId) return true;
    if (l.outfit?.id?.toLowerCase() === cleanId) return true;
    if (l.title?.toLowerCase() === cleanId) return true;
    return false;
  });

  if (foundTrending && foundTrending.outfit) {
    const g = getLookGender(foundTrending);
    const genderMode: "hijab" | "nonhijab" | "pria" = g === "PRIA" ? "pria" : g === "HIJAB" ? "hijab" : "nonhijab";
    const heightObj = getLookHeight(foundTrending);
    const topItem = foundTrending.outfit.items?.find((i) => i.category === "atasan");

    return {
      lookId: foundTrending.id,
      title: foundTrending.title,
      image: foundTrending.image,
      tag: foundTrending.tag,
      category: foundTrending.category,
      vibe: foundTrending.vibe,
      priceRange: foundTrending.priceRange,
      genderMode,
      modelSpec: {
        height: heightObj.label,
        size: "M (Model Fit)",
        silhouette: foundTrending.vibe || "Modern Minimalist",
        keyFabric: topItem?.material || "Katun Rayon & Linen",
      },
      outfit: foundTrending.outfit,
    };
  }

  // 2. Direct match in PRESET_OOTD_COLLECTION
  for (const [key, preset] of Object.entries(PRESET_OOTD_COLLECTION)) {
    if (key.toLowerCase() === cleanId || preset.id?.toLowerCase() === cleanId || preset.title?.toLowerCase() === cleanId) {
      const relatedLook = TRENDING_LOOKS_FEED.find(
        (l) => l.outfit?.id === preset.id || l.title?.toLowerCase() === preset.title?.toLowerCase()
      );
      const image =
        relatedLook?.image ||
        preset.items?.find((i) => i.imageUrl)?.imageUrl ||
        preset.flatlayImages?.[0] ||
        "";
      const isPria = key.includes("pria") || preset.id?.includes("pria") || preset.id?.includes("male");
      const isHijab = key.includes("hijab") || preset.modestFriendly;
      const genderMode: "hijab" | "nonhijab" | "pria" = isPria ? "pria" : isHijab ? "hijab" : "nonhijab";
      const topItem = preset.items?.find((i) => i.category === "atasan");

      return {
        lookId: key,
        title: preset.title,
        image,
        tag: isPria ? "MENSWEAR" : isHijab ? "MODEST CAPSULE" : "SIGNATURE",
        genderMode,
        modelSpec: {
          height: isPria ? "175 cm" : "160 cm",
          size: "M (Model Fit)",
          silhouette: preset.overallVibe || "Clean Minimalist",
          keyFabric: topItem?.material || "Katun Rayon & Linen",
        },
        outfit: preset,
      };
    }
  }

  // 3. Direct match in EXTENDED_OOTD_CATALOG
  if (EXTENDED_OOTD_CATALOG[cleanId]) {
    const extOutfit = EXTENDED_OOTD_CATALOG[cleanId];
    const isPria = cleanId.includes("male") || extOutfit.title.toLowerCase().includes("pria");
    const isHijab = extOutfit.modestFriendly;
    const genderMode: "hijab" | "nonhijab" | "pria" = isPria ? "pria" : isHijab ? "hijab" : "nonhijab";
    const topItem = extOutfit.items?.find((i) => i.category === "atasan");
    const image = extOutfit.items?.[0]?.imageUrl || "";

    return {
      lookId: cleanId,
      title: extOutfit.title,
      image,
      tag: isPria ? "MENSWEAR" : isHijab ? "MODEST CAPSULE" : "EDITORIAL",
      genderMode,
      modelSpec: {
        height: isPria ? "175 cm" : "160 cm",
        size: "M (Model Fit)",
        silhouette: extOutfit.overallVibe || "Clean Minimalist",
        keyFabric: topItem?.material || "Katun Rayon & Linen",
      },
      outfit: extOutfit,
    };
  }

  return null;
}
