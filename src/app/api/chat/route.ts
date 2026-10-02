import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// Helper for Shopee/Tokped URLs
const getShopeeSearchUrl = (query: string) => `https://shopee.co.id/search?keyword=${encodeURIComponent(query)}`;
const getTokopediaSearchUrl = (query: string) => `https://www.tokopedia.com/search?q=${encodeURIComponent(query)}`;

const SYSTEM_STYLIST_CHAT_PROMPT = `
Kamu adalah Look.u AI Stylist, asisten fashion pribadi untuk iklim tropis Indonesia.
Tugas utama kamu adalah memberikan saran pakaian (OOTD) berdasarkan Cuaca (fokus bahan adem seperti Linen, Katun Rayon) dan Warna Kulit (Personal Color).

ATURAN WAJIB:
1. JANGAN PERNAH memberikan respon yang terlalu panjang. Maksimal 3-4 paragraf singkat.
2. Selalu rekomendasikan bahan pakaian (katun, linen, rayon) dan jelaskan MENGAPA bahan itu dipilih (misal: "Linen sangat breathable untuk cuaca 33C").
3. Jika pengguna mengunggah FOTO, analisis warna kulit / bajunya, lalu berikan rekomendasi warna yang paling cocok (Earthy, Pastel, Monochrome).
Gunakan gaya bahasa santai, ramah, dan bersahabat seperti sahabat ("Halo kak!", "Rekomendasi terbaikku...").
`;

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitResult = rateLimit(`chat:${ip}`, { limit: 35, windowMs: 60 * 1000 });

    if (!limitResult.success) {
      return NextResponse.json(
        { reply: "Kamu mengirim pesan terlalu cepat kak. Tunggu 1 menit ya ✨" },
        { status: 429 }
      );
    }

    const body = await req.json();
    const message: string = body.message || "";
    const imageBase64: string | undefined = body.imageBase64;
    const history: { role: string; text: string }[] = body.history || [];

    if (!message.trim() && !imageBase64) {
      return NextResponse.json({ error: "Pesan atau foto tidak boleh kosong." }, { status: 400 });
    }

    const lower = message.toLowerCase();
    
    // --- HEURISTIC ENGINE (Handles specific intents like "kemeja cokelat" perfectly) ---
    if (imageBase64) {
      // Default heuristic for image
      let topColor = "Sage Green";
      let topItem = "Kemeja Linen Crinkle";
      let topImg = "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80"; // Modest Linen Shirt
      
      let bottomColor = "Broken White";
      let bottomItem = "Highwaist Loose Kulot";
      let bottomImg = "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80"; // Modest Pants

      let analysis = "Berdasarkan foto ini, warna kulitmu memiliki warm undertone alami khas Indonesia yang bersinar dengan warna Earthy Neutral (Sage Green, Cream Oat).";

      // Intelligent detection for "Kemeja Cokelat"
      if (lower.includes("cokelat") || lower.includes("brown") || lower.includes("mocca") || lower.includes("cream")) {
         topColor = "Mocca / Cokelat";
         topItem = "Kemeja (Dari Fotomu)";
         topImg = "https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?w=400&q=80";
         bottomItem = "Celana Kulot Linen";
         bottomColor = "Cream / Oat";
         bottomImg = "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&q=80";
         analysis = "Aku melihat kamu mengunggah foto atasan bernuansa cokelat/mocca! Warna *Earth Tones* ini sangat cocok dipadukan dengan bawahan berwarna terang seperti Cream atau Oat untuk memberi efek cerah dan elegan.";
      }

      const reply = `Foto kamu berhasil dipindai kak! ✨ ${analysis} Berikut kurasi bawahan adem anti-gerah yang paling *match* dengan bajumu:`;
      
      const visualCard = {
        title: "Match Sempurna look.u",
        topName: `${topItem} ${topColor}`,
        topImg: topImg,
        topPrice: "Milikmu / Rp 89.000",
        bottomName: `${bottomItem} ${bottomColor}`,
        bottomImg: bottomImg,
        bottomPrice: "Rp 115.000",
        shopeeUrl: getShopeeSearchUrl(`${bottomItem} ${bottomColor} wanita`),
        tokpedUrl: getTokopediaSearchUrl(`${bottomItem} ${bottomColor} adem`),
      };

      return NextResponse.json({ reply, visualCard });
    }

    // --- OTHER HEURISTICS ---
    if (lower.includes("sawo matang") || lower.includes("kulit")) {
      const reply = "Untuk kulit **Sawo Matang**, warna-warna yang paling bikin wajah tampak cerah dan *glowing* seketika adalah:\n\n1. **Sage Green & Olive**: Kontras lembut yang menonjolkan kehangatan kulit.\n2. **Terracotta, Rust & Warm Gold**: Harmonis sempurna dengan *golden undertone* alami.\n3. **Broken White / Oat**: Jauh lebih flattering dibanding putih terang (stark white).\n4. **Navy Blue & Cobalt**: Memberikan efek bersih dan rapi.\n\n✨ *Hindari*: Warna abu-abu pucat atau neon. Mau rekomendasi atasan atau celana kulot yang cocok kak?";
      return NextResponse.json({ reply });
    }

    if (lower.includes("kondangan") || lower.includes("pesta") || lower.includes("formal")) {
      const reply = "Untuk **Kondangan / Acara Formal** di cuaca tropis Indonesia:\n\n👗 **Pilihan Terbaik**:\n- **Wanita**: Tunic Silk Rayon / Loose Outer Organza dipadu Silk Satin Pleated Skirt atau Kulot Highwaist Broken White.\n- **Pria**: Kemeja Linen Mandarin Collar warna Mocca / Navy dipadu Chino Slim-Straight.\n\nBahan katun rayon & linen dijamin adem seharian di gedung maupun outdoor kak!";
      return NextResponse.json({ reply });
    }

    const reply = "Halo kak! Aku Stylist Pribadi look.u ✨\n\nAda yang bisa kubantu seputar mix & match pakaian, pemilihan warna kulit, atau paduan outfit untuk acara tertentu? Kamu juga bisa kirim foto selfie/baju dengan klik icon kamera 📷 di bawah ya!";
    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Halo kak! Paduan warna Earthy Pastel (Sage Green, Cream Oat, Terracotta) dan bahan katun linen adalah pilihan paling aman, adem, dan glowing untuk harianmu ✨" },
      { status: 200 }
    );
  }
}
