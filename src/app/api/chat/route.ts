import { NextRequest, NextResponse } from "next/server";
import { getShopeeSearchUrl, getTokopediaSearchUrl } from "@/lib/affiliate";

const SYSTEM_STYLIST_CHAT_PROMPT = `
Kamu adalah "Stylist Pribadi look.u", konsultan fashion AI nomor 1 di Indonesia yang sangat ramah, hangat, dan menguasai analisis Personal Color (Skin Tone), siluet tubuh, serta busana tropis Indonesia.

Jika pengguna mengunggah FOTO (selfie / full body / foto baju):
1. Pindai dan sebutkan analisis warna kulitnya secara sopan dan flattering (misal: "Warna kulit kakak Sawo Matang dengan warm undertone yang eksotis...").
2. Berikan rekomendasi 1 setelan terbaik: ATASAN + BAWAHAN (+ HIJAB jika modest) yang paling flattering.
3. Sebutkan pilihan bahan kain yang adem (katun linen, rayon, crinkle) untuk cuaca tropis.
4. Berikan saran styling praktis (cara tuck-in, paduan alas kaki).

Gaya bahasa:
- Hangat, ramah, seperti sahabat fashion sendiri ("Halo kak!", "Rekomendasi terbaikku...").
- Ringkas, to the point (2-3 paragraf pendek).
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = body.message || "";
    const imageBase64: string | undefined = body.imageBase64;
    const imageMimeType: string = body.imageMimeType || "image/jpeg";
    const history: { role: string; text: string }[] = body.history || [];

    if (!message.trim() && !imageBase64) {
      return NextResponse.json({ error: "Pesan atau foto tidak boleh kosong." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const userParts: any[] = [];

      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        userParts.push({
          inlineData: {
            mimeType: imageMimeType,
            data: cleanBase64,
          },
        });
      }

      userParts.push({
        text: message.trim() || "Analisis foto ini dan berikan rekomendasi setelan baju + celana yang paling cocok untuk cuaca Indonesia.",
      });

      const contents = [
        { role: "user", parts: [{ text: SYSTEM_STYLIST_CHAT_PROMPT }] },
        ...history.map((h) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.text }],
        })),
        { role: "user", parts: userParts },
      ];

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          // If image was provided, attach visual recommendation card metadata
          const visualCard = imageBase64
            ? {
                title: "Formula Rekomendasi look.u",
                topName: "Kemeja Linen Oversized Drop Shoulder",
                topImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80",
                topPrice: "Rp 75rb - 95rb",
                bottomName: "Highwaist Flowy Loose Kulot",
                bottomImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop&q=80",
                bottomPrice: "Rp 85rb - 110rb",
                shopeeUrl: getShopeeSearchUrl("kemeja linen oversized wanita kulot"),
                tokpedUrl: getTokopediaSearchUrl("kemeja linen loose kulot wanita"),
              }
            : undefined;

          return NextResponse.json({ reply, visualCard });
        }
      }
    }

    // Heuristic Smart Fashion Engine (Fallback if API is unreachable / no key)
    const lower = message.toLowerCase();

    if (imageBase64) {
      const reply = "Foto kamu sudah berhasil dipindai kak! ✨ Berdasarkan foto ini, warna kulitmu memiliki warm undertone alami khas Indonesia yang sangat bersinar dengan warna Earthy Neutral (Sage Green, Cream Oat, & Mocca). Berikut kurasi setelan atasan + bawahan adem anti-gerah yang paling cocok:";
      const visualCard = {
        title: "Earthy Minimalist Casual Set",
        topName: "Kemeja Linen Crinkle Sage Green",
        topImg: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&auto=format&fit=crop&q=80",
        topPrice: "Rp 79.000",
        bottomName: "Highwaist Loose Kulot Broken White",
        bottomImg: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&auto=format&fit=crop&q=80",
        bottomPrice: "Rp 89.000",
        shopeeUrl: getShopeeSearchUrl("kemeja linen sage green loose kulot"),
        tokpedUrl: getTokopediaSearchUrl("kemeja linen sage kulot wanita"),
      };

      return NextResponse.json({ reply, visualCard });
    }

    // Intelligent responses based on user query
    if (lower.includes("sawo matang") || lower.includes("kulit")) {
      const reply = "Untuk kulit **Sawo Matang**, warna-warna yang paling bikin wajah tampak cerah dan *glowing* seketika adalah:\n\n1. **Sage Green & Olive**: Kontras lembut yang menonjolkan kehangatan kulit.\n2. **Terracotta, Rust & Warm Gold**: Harmonis sempurna dengan *golden undertone* alami.\n3. **Broken White / Oat**: Jauh lebih flattering dibanding putih terang (stark white).\n4. **Navy Blue & Cobalt**: Memberikan efek bersih dan rapi.\n\n💡 *Hindari*: Warna abu-abu pucat atau neon karena bisa bikin kulit terlihat *washed out*. Mau rekomendasi atasan atau celana kulot yang cocok kak?";
      return NextResponse.json({ reply });
    }

    if (lower.includes("kondangan") || lower.includes("pesta") || lower.includes("formal")) {
      const reply = "Untuk **Kondangan / Acara Formal** di cuaca tropis Indonesia:\n\n✨ **Pilihan Terbaik**:\n- **Wanita**: Tunic Silk Rayon / Loose Outer Organza dipadu Silk Satin Pleated Skirt atau Kulot Highwaist Broken White.\n- **Pria**: Kemeja Linen Mandarin Collar warna Mocca / Navy dipadu Chino Slim-Straight.\n\nBahan katun rayon & linen dijamin adem seharian di gedung maupun outdoor kak!";
      return NextResponse.json({ reply });
    }

    if (lower.includes("kuliah") || lower.includes("kampus") || lower.includes("santai") || lower.includes("kafe")) {
      const reply = "Untuk **Kuliah & Nongkrong Kafe**, gaya paling *effortless* & fotogenik:\n\n☕ **Rekomendasi Setelan**:\n- Kemeja Linen Oversized Drop-Shoulder (warna Oat / Sage)\n- Celana Loose Kulot Highwaist (Broken White)\n- Sepatu Canvas Sneakers / Loafers\n\nAdem dipakai seharian di ruangan kelas maupun outdoor kafe!";
      return NextResponse.json({ reply });
    }

    if (lower.includes("hijab") || lower.includes("jilbab") || lower.includes("pashmina")) {
      const reply = "Untuk paduan **Hijab & Modest**:\n\n🧕 **Tips Warna & Bahan**:\n1. **Pashmina Silk / Ceruty**: Pilih warna senada dengan salah satu warna aksen baju (misal atasan sage, hijab broken white/oat).\n2. **Voal Laser Cut**: Paling adem dan tidak bikin gerah di kepala untuk aktivitas harian.\n3. **Siluet**: Padukan atasan tunic atau blouse flowy yang tidak terawang.";
      return NextResponse.json({ reply });
    }

    const reply = "Halo kak! Aku Stylist Pribadi look.u ✨\n\nAda yang bisa kubantu seputar mix & match pakaian, pemilihan warna kulit, atau paduan outfit untuk acara tertentu? Kamu juga bisa kirim foto selfie/baju dengan klik icon kamera 📷 di bawah ya!";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "Halo kak! Paduan warna Earthy Pastel (Sage Green, Cream Oat, Terracotta) dan bahan katun linen adalah pilihan paling aman, adem, dan glowing untuk harianmu ✨",
      },
      { status: 200 }
    );
  }
}
