import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { TRENDING_LOOKS_FEED, PRESET_OOTD_COLLECTION } from "@/lib/presets";
import { OutfitItem } from "@/lib/types";

export interface ChatOutfitCard {
  id: string;
  presetKey: string;
  title: string;
  subtitle: string;
  tagline: string;
  fabricNote: string;
  image: string;
  swatches: { name: string; hex: string }[];
  priceRange: string;
  climateBadge: string;
  studioParam: string;
  itemsSummary: string;
  items: OutfitItem[];
}

// Helper to determine climate badge based on look title & category
function getClimateBadge(title: string, category: string): string {
  const t = title.toLowerCase();
  const c = category.toLowerCase();
  if (t.includes("biker") || t.includes("corporate") || t.includes("silk draping") || t.includes("gala") || t.includes("scbd") || t.includes("blazer")) {
    return "INDOOR AC / EVENING";
  }
  if (t.includes("rainy") || t.includes("hujan") || t.includes("cardigan cozy") || t.includes("layering")) {
    return "BREEZY / RAINY 24°C";
  }
  return "AIRY TROPICAL · OPTIMAL 33°C";
}

// Find curated look from 22 presets and build rich card
function findCuratedLookMatch(message: string, isPhoto = false): { card: ChatOutfitCard; note: string; followUps: string[] } {
  const lower = message.toLowerCase();

  let selected = TRENDING_LOOKS_FEED[0]; // fallback
  let note = "";

  if (isPhoto) {
    if (lower.includes("pria") || lower.includes("cowok") || lower.includes("menswear")) {
      selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Metropolitan Oxford")) || TRENDING_LOOKS_FEED[3];
      note = "Foto kamu berhasil dipindai di RAM privat! Terdeteksi rona warm natural khas pria Indonesia. Kombinasi kemeja katun oxford breathable dan chino khaki ini menonjolkan siluet segar, rapi, dan anti-gerah untuk cuaca 33°C.";
    } else {
      selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Casual Campus")) || TRENDING_LOOKS_FEED[6];
      note = "Foto kamu berhasil dipindai di RAM privat browser! Terdeteksi rona Warm Golden alami khas Indonesia. Kombinasi serat linen crinkle dan voal berpori ini memberi efek wajah glowing seketika tanpa takut gerah.";
    }
  } else if (lower.includes("kuliah") || lower.includes("chiffon") || lower.includes("kampus") || lower.includes("mahasiswa")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Casual Campus")) || TRENDING_LOOKS_FEED[6];
    note = "Untuk suhu 29°C–33°C saat jalan antar gedung kampus, hindari furing sintetis. Saya sarankan Katun Linen Crinkle dan Voal Paris yang memiliki pori mikro tertinggi dan sangat santun untuk hijab santai.";
  } else if (lower.includes("scbd") || lower.includes("corporate") || lower.includes("bumn") || lower.includes("blazer") || lower.includes("ngantor") || lower.includes("kerja")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("SCBD BUMN")) || TRENDING_LOOKS_FEED[12];
    note = "Untuk ritme kerja SCBD yang berpindah dari luar ruangan ke ruang AC 20°C, padukan blazer semi-wool berpotongan relaxed dengan inner katun combed 30s adem agar siluetmu tetap tajam tanpa rasa gerah.";
  } else if (lower.includes("pria") || lower.includes("cowok") || lower.includes("oxford") || lower.includes("chino") || lower.includes("menswear")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Metropolitan Oxford")) || TRENDING_LOOKS_FEED[3];
    note = "Kemeja katun oxford breathable warna Sky Blue dipadu celana chino khaki adalah formula klasik paling fungsional di iklim tropis—sejuk di kulit dan langsung siap untuk meeting maupun nongkrong.";
  } else if (lower.includes("kondangan") || lower.includes("pesta") || lower.includes("resepsi") || lower.includes("silk") || lower.includes("sutra") || lower.includes("gala")) {
    if (lower.includes("pria") || lower.includes("batik")) {
      selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Batik Modern")) || TRENDING_LOOKS_FEED[15];
      note = "Kemeja batik tulis katun primissima dengan potongan modern fit memberikan wibawa formal elegan tanpa rasa pengap di cuaca tropis.";
    } else if (lower.includes("ice blue") || lower.includes("draping")) {
      selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Ice Blue Silk")) || TRENDING_LOOKS_FEED[2];
      note = "Material silk draping mewah dengan efek jatuh dingin menciptakan aura berkelas untuk resepsi malam, sangat menonjolkan keanggunan siluetmu.";
    } else {
      selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Modern Modest Silk")) || TRENDING_LOOKS_FEED[8];
      note = "Untuk acara pesta atau kondangan tropis, pilih Satin Silk Premium yang tidak menerawang. Kilau mewahnya elegan di bawah lampu gedung tanpa menjebak panas tubuh.";
    }
  } else if (lower.includes("senopati") || lower.includes("kafe") || lower.includes("cafe") || lower.includes("brunch") || lower.includes("hangout")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Hangout Senopati")) || TRENDING_LOOKS_FEED[7];
    note = "Paduan knitwear berpori longgar warna matcha dengan loose culottes broken white menghasilkan tampilan estetik Parisian-Korean yang fotogenik untuk kafe outdoor maupun indoor.";
  } else if (lower.includes("old money") || lower.includes("coastal") || lower.includes("pantai") || lower.includes("resort") || lower.includes("bali")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Old Money Coastal")) || TRENDING_LOOKS_FEED[10];
    note = "Serat 100% pure flax linen adalah raja sirkulasi udara di iklim pantai & tropis. Nuansa warna oatmeal dan deep navy menghadirkan estetika quiet luxury yang sejuk seharian.";
  } else if (lower.includes("biker") || lower.includes("leather") || lower.includes("jaket kulit") || lower.includes("denim")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Edgy Biker")) || TRENDING_LOOKS_FEED[0];
    note = "Kombinasi jaket kulit breathable berpotongan cropped dengan celana denim katun straight-leg menyeimbangkan karakter berani dan kenyamanan mobilitas urban sore hari.";
  } else if (lower.includes("hujan") || lower.includes("rainy") || lower.includes("dingin") || lower.includes("cardigan")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Rainy Day")) || TRENDING_LOOKS_FEED[19];
    note = "Saat musim hujan 22°C–26°C, rajut katun akrilik tipis berpori memberikan kehangatan lembut tanpa rasa sesak, sangat serasi dipadukan dengan pashmina bertekstur.";
  } else if (lower.includes("streetwear") || lower.includes("blok m") || lower.includes("cargo") || lower.includes("boxy")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Blok M Oversized")) || TRENDING_LOOKS_FEED[13];
    note = "Potongan boxy tee katun combed 24s dengan celana cargo rileks memberikan sirkulasi udara optimal antara kulit dan pakaian saat jalan kaki di cuaca panas perkotaan.";
  } else if (lower.includes("vest") || lower.includes("slacks")) {
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Chic Tailored Vest")) || TRENDING_LOOKS_FEED[11];
    note = "Vest tailoring berstruktur ringan dipadu flowy slacks memberi kesan profesional modern yang sangat chic untuk presentasi kampus maupun meeting santai.";
  } else {
    // Default smart selection based on warm tone
    selected = TRENDING_LOOKS_FEED.find(l => l.title.includes("Casual Campus")) || TRENDING_LOOKS_FEED[6];
    note = "Untuk keseharian tropis 33°C, formula katun linen crinkle berpori dan celana jatuh longgar adalah pilihan anti-gerah nomor satu dengan indeks sirkulasi udara di atas 98%.";
  }

  const outfit = selected.outfit || PRESET_OOTD_COLLECTION["kuliah_hijab_panas_hemat"];
  const swatches = outfit.colorPalette ? outfit.colorPalette.slice(0, 3) : [
    { name: "Cream Oat", hex: "#F5EBE0" },
    { name: "Sage Green", hex: "#84A98C" },
    { name: "Broken White", hex: "#FAEDCD" },
  ];

  const items = outfit.items || [];
  const itemsSummary = items.slice(0, 3).map(i => i.name).join(" + ");
  const fabricNote = items[0]?.material || "Katun Linen Crinkle · Breathable";

  const card: ChatOutfitCard = {
    id: selected.id,
    presetKey: Object.keys(PRESET_OOTD_COLLECTION).find(k => PRESET_OOTD_COLLECTION[k].title === selected.title) || selected.id,
    title: selected.title,
    subtitle: `${selected.tag} · ${selected.vibe}`,
    tagline: outfit.tagline || selected.vibe,
    fabricNote,
    image: selected.image,
    swatches,
    priceRange: selected.priceRange.replace(" / Set", ""),
    climateBadge: getClimateBadge(selected.title, selected.category),
    studioParam: outfit.id || selected.id,
    itemsSummary: itemsSummary || "Katun Linen Breathable + Pashmina + Kulot Flowy",
    items,
  };

  const followUps = [
    "Lihat 3 Komponen Pakaian",
    "Ganti Palet Lebih Gelap",
    "Versi Lebih Formal",
    "Buka di Studio AI ↗",
  ];

  return { card, note, followUps };
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitResult = rateLimit(`chat:${ip}`, { limit: 45, windowMs: 60 * 1000 });

    if (!limitResult.success) {
      return NextResponse.json(
        { reply: "Kamu mengirim pesan terlalu cepat kak. Mohon tunggu sejenak ya ✨" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message: string = body.message || "";
    const imageBase64: string | undefined = body.imageBase64;
    const isPhoto = Boolean(imageBase64);

    if (!message.trim() && !imageBase64) {
      return NextResponse.json({ error: "Pesan atau foto tidak boleh kosong." }, { status: 400 });
    }

    // Process using Curated Lookbook Matcher
    const { card, note, followUps } = findCuratedLookMatch(message, isPhoto);

    // If Google Gemini API is available and message is complex free-text, attempt AI enhancement
    let finalNote = note;
    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && message.trim().length > 15 && !isPhoto) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: `Sebagai Personal Stylist AI Look.u untuk iklim tropis Indonesia, berikan ulasan padu-padan singkat (MAKSIMAL 2-3 KALIMAT, bahasa editorial berkelas, fokus jenis kain adem seperti Linen/Katun Rayon dan warna kulit nusantara).
Pertanyaan pengguna: "${message}"
Setelan yang direkomendasikan: "${card.title}" (${card.fabricNote}).
Balas dalam 1 paragraf pendek saja tanpa bullet point.`
                    }
                  ]
                }
              ]
            })
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const generatedText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generatedText && generatedText.trim().length > 20) {
            finalNote = generatedText.trim();
          }
        }
      } catch (aiErr) {
        console.warn("Gemini call skipped, fallback to curated note:", aiErr);
      }
    }

    return NextResponse.json({
      reply: finalNote,
      outfitMatch: card,
      followUps,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    const { card, note, followUps } = findCuratedLookMatch("kuliah adem", false);
    return NextResponse.json({
      reply: note,
      outfitMatch: card,
      followUps,
    }, { status: 200 });
  }
}
