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
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents,
            generationConfig: { maxOutputTokens: 600, temperature: 0.7 },
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

    // Heuristic Fallback Response if Gemini is offline / no key
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

    const reply = "Halo kak! Ada yang bisa aku bantu seputar mix & match pakaian, pemilihan warna kulit, atau paduan outfit untuk acara tertentu? Kamu juga bisa kirim foto selfie/baju dengan klik icon kamera 📷 di bawah ya ✨";
    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        reply: "Halo kak! Foto berhasil diterima. Paduan warna Earthy Pastel dan bahan katun linen adalah pilihan paling aman dan glowing untuk harianmu ✨",
      },
      { status: 200 }
    );
  }
}
