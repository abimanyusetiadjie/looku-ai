import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { REAL_SIGNATURE_LOOKS_28 } from "@/lib/real-looks-28";
import { OutfitItem, TrendingLook } from "@/lib/types";

export const maxDuration = 30;

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
  if (t.includes("suit") || t.includes("blazer") || t.includes("formal") || c.includes("formal")) {
    return "INDOOR AC / FORMAL";
  }
  if (t.includes("harrington") || t.includes("vest") || t.includes("trench") || t.includes("jacket")) {
    return "BREEZY / SEJUK 24°C";
  }
  return "AIRY TROPICAL · OPTIMAL 33°C";
}

// Convert a TrendingLook into a ChatOutfitCard
function buildChatOutfitCard(look: TrendingLook): ChatOutfitCard {
  const outfit = look.outfit;
  const items = outfit?.items || [];
  const itemsSummary = items.slice(0, 3).map((i) => i.name).join(" + ") || look.title;
  const fabricNote = items[0]?.material || "Linen & Katun Rayon · Breathable";

  const swatches = outfit?.colorPalette && outfit.colorPalette.length > 0
    ? outfit.colorPalette.slice(0, 3)
    : [
        { name: "Neutral 1", hex: "#E8DFD1" },
        { name: "Neutral 2", hex: "#7A8471" },
        { name: "Neutral 3", hex: "#F4EFE6" },
      ];

  return {
    id: look.id,
    presetKey: look.id,
    title: look.title,
    subtitle: `${look.tag} · ${look.vibe}`,
    tagline: outfit?.tagline || look.vibe,
    fabricNote,
    image: look.image,
    swatches,
    priceRange: (look.priceRange || "Rp 210.000 - Rp 350.000").replace(" / Set", ""),
    climateBadge: getClimateBadge(look.title, look.category),
    studioParam: look.id,
    itemsSummary,
    items,
  };
}

// Robust heuristic fallback for zero-downtime
function heuristicMatchLook(message: string, isPhoto = false): { card: ChatOutfitCard; note: string; followUps: string[] } {
  const lower = message.toLowerCase();
  let selected = REAL_SIGNATURE_LOOKS_28[0];
  let note = "";

  const isPria = lower.includes("pria") || lower.includes("cowok") || lower.includes("laki") || lower.includes("menswear") || lower.includes("masculine");
  const isHijab = lower.includes("hijab") || lower.includes("modest") || lower.includes("kerudung") || lower.includes("jilbab") || lower.includes("pashmina") || lower.includes("voal");

  if (isPria) {
    if (lower.includes("suit") || lower.includes("jas") || lower.includes("formal") || lower.includes("executive") || lower.includes("kantor") || lower.includes("scbd")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_p05") || REAL_SIGNATURE_LOOKS_28[14];
      note = "Untuk agenda formal eksekutif atau ruang ber-AC, setelan Navy Tailored Suit dengan kemeja poplin putih dan saputangan burgundy memberikan wibawa tajam tanpa rasa kaku.";
    } else if (lower.includes("blazer") || lower.includes("semi formal") || lower.includes("smart casual")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_p03") || REAL_SIGNATURE_LOOKS_28[12];
      note = "Kombinasi Knit Blazer kasual warna camel di atas kaos putih dan celana jeans denim santai adalah formula smart casual paling fleksibel untuk iklim tropis.";
    } else if (lower.includes("vest") || lower.includes("rompi") || lower.includes("korea") || lower.includes("minimalist")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_p04") || REAL_SIGNATURE_LOOKS_28[13];
      note = "Rompi rajut katun berpori warna oat beige dipadukan kemeja putih lengan pendek dan celana bahan hitam lebar memberikan estetika Korean Minimalist yang sejuk dan rapi.";
    } else if (lower.includes("jaket") || lower.includes("harrington") || lower.includes("street") || lower.includes("urban")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_p02") || REAL_SIGNATURE_LOOKS_28[11];
      note = "Jaket Harrington katun kanvas abu-abu gelap berpadu celana chino karamel hangat menciptakan siluet maskulin tegas yang sangat cocok untuk mobilitas sore di perkotaan.";
    } else {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_p01") || REAL_SIGNATURE_LOOKS_28[10];
      note = "Kemeja rayon dingin kerah terbuka (resort collar) warna putih dipadu celana chino sand semata kaki adalah pilihan nomor satu pria untuk cuaca panas 33°C.";
    }
  } else if (isHijab) {
    if (lower.includes("sage") || lower.includes("hijau") || lower.includes("botanical") || lower.includes("kuliah") || lower.includes("kampus")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_h04") || REAL_SIGNATURE_LOOKS_28[3];
      note = "Kemeja tunik linen sage green dipadukan kulot katun broken white dan voal cream memberikan sirkulasi udara maksimal serta ramah hijab untuk mobilitas kampus.";
    } else if (lower.includes("mustard") || lower.includes("kuning") || lower.includes("earthy") || lower.includes("warm")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_h02") || REAL_SIGNATURE_LOOKS_28[1];
      note = "Kemeja katun rayon mustard hangat beraksen tali samping berpadu chino sand memberikan efek mencerahkan rona kulit sawo matang secara natural.";
    } else if (lower.includes("biru") || lower.includes("blue") || lower.includes("trench") || lower.includes("pastel") || lower.includes("dingin")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_h03") || REAL_SIGNATURE_LOOKS_28[2];
      note = "Outer flowy drape biru pastel berpadu pashmina satin perak dan kulot flowy broken white memberi aura anggun berkelas untuk acara semi-formal ber-AC.";
    } else if (lower.includes("navy") || lower.includes("blouse") || lower.includes("kantor") || lower.includes("kerja")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_h05") || REAL_SIGNATURE_LOOKS_28[4];
      note = "Blus high-low navy berbelahan samping dipadukan chino sand dan pashmina tencel sand memberikan proporsi jenjang yang santun dan profesional.";
    } else {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_h01") || REAL_SIGNATURE_LOOKS_28[0];
      note = "Kemeja linen putih bersih dipadukan kulot jeans vintage wash yang longgar dan breathable adalah formula kasual harian nomor satu untuk iklim tropis.";
    }
  } else {
    // Wanita casual / chic
    if (lower.includes("mandarin") || lower.includes("linen") || lower.includes("cream") || lower.includes("chic") || lower.includes("slacks")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_w01") || REAL_SIGNATURE_LOOKS_28[5];
      note = "Blus linen kerah mandarin off-white dipadu celana bahan berlipit warna pasir memberikan estetika warm minimalist yang sangat bersih dan berkelas.";
    } else if (lower.includes("pink") || lower.includes("rose") || lower.includes("dusty") || lower.includes("feminin")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_w02") || REAL_SIGNATURE_LOOKS_28[6];
      note = "Kemeja linen dusty rose dengan tekstur crinkle yang sejuk dipadu kulot sand berpinggang tinggi menghadirkan nuansa feminin lembut tanpa membuat kulit kusam.";
    } else if (lower.includes("coral") || lower.includes("pantai") || lower.includes("resort") || lower.includes("liburan") || lower.includes("bali")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_w03") || REAL_SIGNATURE_LOOKS_28[7];
      note = "Blus ikat terracotta coral dipadu kulot linen lebar broken white sangat menyala cantik di kulit sawo matang saat terkena sinar matahari tropis.";
    } else if (lower.includes("hitam") || lower.includes("black") || lower.includes("monokrom") || lower.includes("edgy") || lower.includes("gallery")) {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_w04") || REAL_SIGNATURE_LOOKS_28[8];
      note = "Kemeja oversized hitam pekat dengan celana bahan lebar broken white dan bot kulit memberikan kontras monokrom tajam yang artistik dan berkarakter.";
    } else {
      selected = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === "look_real_w05") || REAL_SIGNATURE_LOOKS_28[9];
      note = "Kemeja boxy linen putih gading dipadukan celana jeans kulot longgar biru vintage dan penny loafers cokelat adalah perpaduan klasik yang tak lekang oleh waktu.";
    }
  }

  const card = buildChatOutfitCard(selected);
  const followUps = [
    "Lihat Komposisi Pakaian",
    "Ganti Palet Lebih Gelap",
    "Rekomendasi Sepatu Cocok",
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
    const message: string = (body.message || "").trim();
    const imageBase64: string | undefined = body.imageBase64;
    const isPhoto = Boolean(imageBase64);

    if (!message && !imageBase64) {
      return NextResponse.json({ error: "Pesan atau foto tidak boleh kosong." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Build catalog summary for Gemini prompt
    const catalogSummary = REAL_SIGNATURE_LOOKS_28.map((l) => ({
      id: l.id,
      title: l.title,
      category: l.category,
      tag: l.tag,
      vibe: l.vibe,
      skinTone: l.skinToneRecommendation,
      price: l.priceRange,
      items: l.outfit?.items?.map((it) => `${it.category}: ${it.name} (${it.color})`).join(", "),
    }));

    // If Gemini API is configured, use Gemini 2.5 Flash as the core brain
    if (apiKey) {
      try {
        const systemPrompt = `Kamu adalah "Look.u AI Concierge", Personal Fashion Stylist profesional nomor satu di Indonesia khusus kurasi busana iklim tropis (suhu 33°C, kelembapan tinggi, kain bersirkulasi udara seperti Linen Euro, Katun Rayon Twill, Tencel Modal, dan Voal Miracle) serta rona kulit nusantara (Sawo Matang, Kuning Langsat, Tan Eksotis, Putih Gading).

Berikut adalah 15 Koleksi Signature Looks resmi Look.u yang tersedia di katalog:
${JSON.stringify(catalogSummary, null, 2)}

ATURAN UTAMA:
1. Jawab pertanyaan pengguna dengan ramah, berkelas, solutif, dan ringkas (2-3 kalimat saja). Jelaskan mengapa jenis bahan kain (linen/rayon/voal) atau palet warna tersebut sangat cocok untuk iklim tropis dan rona kulit mereka.
2. WAJIB pilihkan 1 "matchedLookId" yang PALING TEPAT dari 15 koleksi di atas:
   - Jika pengguna PRIA / mencari baju cowok -> WAJIB pilih antara "look_real_p01" sampai "look_real_p05". DILARANG KERAS merekomendasikan pakaian wanita atau hijab untuk pria!
   - Jika pengguna HIJAB / mencari busana modest -> WAJIB pilih antara "look_real_h01" sampai "look_real_h05".
   - Jika pengguna WANITA modern non-hijab -> WAJIB pilih antara "look_real_w01" sampai "look_real_w05".
3. Berikan 3-4 opsi "followUps" singkat yang relevan untuk melanjutkan konsultasi.
${isPhoto ? "4. Pengguna menyertakan foto. Analisis foto tersebut (warna kulit/wajah atau jenis potongan pakaian) secara nyata dan hubungkan dengan kurasi setelan yang tepat." : ""}

Format balasan WAJIB HANYA JSON murni dengan format berikut:
{
  "reply": "Kalimat ulasan stylist profesional di sini...",
  "matchedLookId": "look_real_xxx",
  "followUps": ["Pilihan 1", "Pilihan 2", "Pilihan 3"]
}`;

        const parts: any[] = [{ text: `${systemPrompt}\n\nPesan Pengguna: "${message || "Tolong analisis fotoku dan berikan rekomendasi setelan adem yang paling cocok!"}"` }];

        if (imageBase64) {
          let cleanData = imageBase64;
          let mime = "image/jpeg";
          if (imageBase64.includes(";base64,")) {
            const split = imageBase64.split(";base64,");
            mime = split[0].replace("data:", "");
            cleanData = split[1];
          }
          parts.push({
            inlineData: {
              mimeType: mime,
              data: cleanData,
            },
          });
        }

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts }],
              generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 600,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const rawText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            const matchedLook = REAL_SIGNATURE_LOOKS_28.find((l) => l.id === parsed.matchedLookId) || REAL_SIGNATURE_LOOKS_28[0];
            const card = buildChatOutfitCard(matchedLook);

            return NextResponse.json({
              reply: parsed.reply,
              outfitMatch: card,
              followUps: parsed.followUps || [
                "Lihat Detail Komponen",
                "Opsi Warna Lain",
                "Buka di Studio AI ↗",
              ],
            });
          }
        } else {
          console.warn("Gemini API returned status:", geminiRes.status);
        }
      } catch (geminiErr) {
        console.error("Gemini invocation failed, falling back to heuristic:", geminiErr);
      }
    }

    // Heuristic Fallback
    const fallback = heuristicMatchLook(message, isPhoto);
    return NextResponse.json({
      reply: fallback.note,
      outfitMatch: fallback.card,
      followUps: fallback.followUps,
    });
  } catch (error) {
    console.error("Chat API fatal error:", error);
    const fallback = heuristicMatchLook("kuliah santai", false);
    return NextResponse.json({
      reply: fallback.note,
      outfitMatch: fallback.card,
      followUps: fallback.followUps,
    }, { status: 200 });
  }
}
