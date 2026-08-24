import { OOTDRecommendation, UserPreferences } from "./types";
import { generateHeuristicOOTD } from "./presets";

const SYSTEM_FASHION_PROMPT = `
Kamu adalah "Looku AI", personal stylist profesional nomor 1 di Indonesia yang sangat menguasai analisis Personal Color (Skin Tone) & Fashion Harian Indonesia.
Prinsip utama rekomendasi kamu:
1. Personal Color & Skin Tone Match: Analisis warna kulit user (Putih Gading/Fair, Kuning Langsat/Light, Sawo Matang/Medium, Eksotis/Tan, Deep Bronze). Pilih palet warna yang memberi efek glowing, tidak membuat kulit tampak kusam atau washed out.
2. Cuaca Tropis Indonesia: Prioritaskan bahan yang adem & breathable (katun linen, rayon crinkle, voal).
3. Modest Architecture: Jika user memilih Modest/Hijab, pastikan atasan tertutup, tidak terawang, bawahan sopan, serta jenis hijab yang senada.
4. Realistis & Budget Shopee/Tokopedia: Sesuaikan harga dalam kisaran Rupiah yang wajar.
5. Format Output: Wajib mengembalikan JSON murni sesuai format tanpa teks pengantar.
`;

export async function generateOOTDRecommendation(
  pref: UserPreferences,
  apiKey?: string
): Promise<OOTDRecommendation> {
  const effectiveApiKey = apiKey || process.env.GEMINI_API_KEY;

  if (!effectiveApiKey) {
    console.log("No GEMINI_API_KEY found, using Smart Heuristic Fallback Engine.");
    return generateHeuristicOOTD(pref);
  }

  const promptText = `
Berikan 1 rekomendasi OOTD terbaik untuk profil berikut:
- Gender: ${pref.gender}
- Warna Kulit (Skin Tone): ${pref.skinTone} (Fair / Light / Medium / Tan / Deep)
- Kelompok Usia (Age): ${pref.ageRange} (Teens / 20s / 30s / 40s+)
- Acara/Kegiatan: ${pref.occasion}
- Hijab / Modest: ${pref.isModestHijab ? "YA (Wajib Modest/Hijab Friendly)" : "TIDAK (Bebas)"}
- Cuaca: ${pref.weather}
- Kategori Budget: ${pref.budget}
- Vibe / Gaya Favorit: ${pref.vibe}
- Catatan Tambahan: ${pref.customNotes || "Tidak ada"}

Balas HANYA dalam JSON format persis seperti ini:
{
  "id": "rec_${Date.now()}",
  "title": "Nama Konsep Outfit (contoh: Earthy Coffee Date)",
  "tagline": "Satu kalimat catchy kenapa outfit ini keren",
  "overallVibe": "Deskripsi singkat vibe (contoh: Minimalist Chic & Breathable)",
  "comfortRating": 4.9,
  "affordabilityRating": 4.7,
  "modestFriendly": ${pref.isModestHijab},
  "skinToneMatch": "Analisis singkat kenapa warna ini sangat flattering dan glowing untuk tone kulit ${pref.skinTone} dalam 1-2 kalimat.",
  "whyItWorks": "Penjelasan kenapa kombinasi ini cocok untuk cuaca, acara, dan usia user.",
  "stylingTip": "Tips styling praktis (cara tuck-in, paduan jilbab/tas).",
  "colorPalette": [
    {"name": "Nama Warna 1", "hex": "#HEXCODE"},
    {"name": "Nama Warna 2", "hex": "#HEXCODE"},
    {"name": "Nama Warna 3", "hex": "#HEXCODE"},
    {"name": "Nama Warna 4", "hex": "#HEXCODE"}
  ],
  "items": [
    {
      "category": "atasan",
      "name": "Nama Spesifik Atasan",
      "material": "Nama Bahan Adem/Cocok",
      "color": "Warna Item",
      "colorHex": "#HEXCODE",
      "estimatedPrice": "Rp 75.000 - 110.000",
      "shopeeQuery": "kata kunci pencarian shopee",
      "tokopediaQuery": "kata kunci pencarian tokopedia"
    },
    {
      "category": "bawahan",
      "name": "Nama Spesifik Bawahan",
      "material": "Nama Bahan",
      "color": "Warna Item",
      "colorHex": "#HEXCODE",
      "estimatedPrice": "Rp 85.000 - 130.000",
      "shopeeQuery": "kata kunci shopee",
      "tokopediaQuery": "kata kunci tokopedia"
    },
    {
      "category": "outer_hijab",
      "name": "Nama Hijab / Outer",
      "material": "Nama Bahan",
      "color": "Warna Item",
      "colorHex": "#HEXCODE",
      "estimatedPrice": "Rp 35.000 - 65.000",
      "shopeeQuery": "kata kunci shopee",
      "tokopediaQuery": "kata kunci tokopedia"
    },
    {
      "category": "sepatu",
      "name": "Nama Sepatu / Sandal",
      "material": "Nama Bahan",
      "color": "Warna Item",
      "colorHex": "#HEXCODE",
      "estimatedPrice": "Rp 120.000 - 180.000",
      "shopeeQuery": "kata kunci shopee",
      "tokopediaQuery": "kata kunci tokopedia"
    },
    {
      "category": "aksesoris",
      "name": "Nama Tas / Aksesoris",
      "material": "Nama Bahan",
      "color": "Warna Item",
      "colorHex": "#HEXCODE",
      "estimatedPrice": "Rp 45.000 - 85.000",
      "shopeeQuery": "kata kunci shopee",
      "tokopediaQuery": "kata kunci tokopedia"
    }
  ]
}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${effectiveApiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${SYSTEM_FASHION_PROMPT}\n\n${promptText}` }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1200,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!response.ok) {
      return generateHeuristicOOTD(pref);
    }

    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) {
      return generateHeuristicOOTD(pref);
    }

    const parsed: OOTDRecommendation = JSON.parse(rawText);
    parsed.createdAt = new Date().toISOString();
    return parsed;
  } catch (error) {
    console.error("AI Engine error:", error);
    return generateHeuristicOOTD(pref);
  }
}
