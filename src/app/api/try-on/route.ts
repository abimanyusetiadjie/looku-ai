import { NextRequest, NextResponse } from "next/server";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import fs from "fs";
import path from "path";

export const maxDuration = 45;

export interface TryOnItemSummary {
  category: string;
  name: string;
  brand: string;
  colorName: string;
  colorHex: string;
  material: string;
  priceStr: string;
  shopeeUrl: string;
}

interface TryOnRequestBody {
  userImage: string; // Base64 data URI from Camera or Gallery
  outfitImage: string; // Local path (/lookbook/...) or remote URL
  lookTitle?: string;
  genderMode?: string;
  items?: TryOnItemSummary[];
}

export interface TryOnAlignmentData {
  userFace: { centerX: number; centerY: number; width: number; height: number };
  userTorso: { centerX: number; topY: number; width: number; height: number };
  modelHead: { centerX: number; centerY: number; width: number; height: number };
  modelGarment: { centerX: number; topY: number; width: number; height: number };
}

export interface TryOnAnalysisResult {
  detectedSkinTone: string;
  undertone: "Warm" | "Cool" | "Neutral";
  fitScore: number;
  colorHarmonyScore: number;
  breathabilityScore: number;
  verdictTitle: string;
  stylistAnalysis: string;
  stylingTip: string;
  alignment: TryOnAlignmentData;
}

const DEFAULT_ALIGNMENT: TryOnAlignmentData = {
  userFace: { centerX: 0.5, centerY: 0.22, width: 0.24, height: 0.22 },
  userTorso: { centerX: 0.5, topY: 0.30, width: 0.62, height: 0.65 },
  modelHead: { centerX: 0.5, centerY: 0.16, width: 0.18, height: 0.16 },
  modelGarment: { centerX: 0.5, topY: 0.23, width: 0.56, height: 0.72 },
};

async function loadOutfitImageAsBase64(outfitImage: string): Promise<{ mimeType: string; data: string } | null> {
  try {
    if (!outfitImage) return null;

    if (outfitImage.includes(";base64,")) {
      const parts = outfitImage.split(";base64,");
      return {
        mimeType: parts[0].replace("data:", "") || "image/jpeg",
        data: parts[1],
      };
    }

    // Check if local public asset (e.g., /lookbook/hijab_1.png)
    if (outfitImage.startsWith("/")) {
      const cleanRelPath = outfitImage.split("?")[0].replace(/^\/+/, "");
      const fullPath = path.join(process.cwd(), "public", cleanRelPath);
      if (fs.existsSync(fullPath)) {
        const buffer = fs.readFileSync(fullPath);
        const ext = path.extname(fullPath).toLowerCase();
        const mimeType =
          ext === ".png"
            ? "image/png"
            : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";
        return {
          mimeType,
          data: buffer.toString("base64"),
        };
      }
    }

    // Remote URL fetch
    if (outfitImage.startsWith("http://") || outfitImage.startsWith("https://")) {
      const res = await fetch(outfitImage);
      if (res.ok) {
        const arrayBuffer = await res.arrayBuffer();
        const mimeType = res.headers.get("content-type") || "image/jpeg";
        return {
          mimeType,
          data: Buffer.from(arrayBuffer).toString("base64"),
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Server-side IP Rate Limit Protection (protects API quota)
    const ip = getClientIp(req);
    const limitResult = rateLimit(`tryon:${ip}`, {
      limit: 12,
      windowMs: 60 * 60 * 1000, // 12 requests per hour per IP on server
    });

    if (!limitResult.success) {
      return NextResponse.json(
        {
          error:
            "Batas penggunaan server Virtual Try-On tercapai. Silakan coba kembali nanti.",
        },
        { status: 429 }
      );
    }

    const body: TryOnRequestBody = await req.json();

    if (!body.userImage) {
      return NextResponse.json(
        { error: "Foto pengguna tidak ditemukan. Silakan ambil foto atau pilih dari galeri." },
        { status: 400 }
      );
    }

    // Extract clean base64 from userImage
    let userBase64 = body.userImage;
    let userMimeType = "image/jpeg";
    if (body.userImage.includes(";base64,")) {
      const parts = body.userImage.split(";base64,");
      userMimeType = parts[0].replace("data:", "") || "image/jpeg";
      userBase64 = parts[1];
    }

    const outfitData = await loadOutfitImageAsBase64(body.outfitImage || "");
    const apiKey = process.env.GEMINI_API_KEY;

    const itemDescriptions = (body.items || [])
      .map(
        (it) =>
          `${it.category}: ${it.brand} ${it.name} (${it.colorName}, bahan ${it.material})`
      )
      .join("; ");

    let generatedTryOnImage: string | null = null;
    let activeEngine = "hybrid_gemini_vision_compositor";

    // =========================================================================
    // ENGINE 1: Attempt Direct Multimodal Image Try-On (gemini-2.5-flash-image)
    // =========================================================================
    if (apiKey) {
      try {
        const imagePrompt = `VIRTUAL TRY-ON TASK:
Image 1 is the user's photo. ${
          outfitData ? "Image 2 is the reference studio outfit." : ""
        }
Generate a photorealistic vertical portrait of the EXACT person from Image 1 (preserving their face, facial identity, skin tone, glasses, hair/hijab style, body proportions, and natural lighting) wearing the complete outfit: ${
          body.lookTitle || "Tropical Editorial Look"
        } consisting of: ${itemDescriptions || "breathable tropical linen & cotton outfit"}.
Ensure realistic fabric drape, accurate colors, natural collar transition, and clean studio editorial aesthetics.`;

        const imageParts: Array<Record<string, unknown>> = [
          { text: imagePrompt },
          {
            inlineData: {
              mimeType: userMimeType,
              data: userBase64,
            },
          },
        ];

        if (outfitData) {
          imageParts.push({
            inlineData: {
              mimeType: outfitData.mimeType,
              data: outfitData.data,
            },
          });
        }

        const imgGenResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: imageParts }],
              generationConfig: {
                responseModalities: ["TEXT", "IMAGE"],
              },
            }),
          }
        );

        if (imgGenResponse.ok) {
          const imgGenJson = await imgGenResponse.json();
          const candidateParts =
            imgGenJson.candidates?.[0]?.content?.parts || [];
          for (const part of candidateParts) {
            if (part.inlineData?.data) {
              const outMime = part.inlineData.mimeType || "image/png";
              generatedTryOnImage = `data:${outMime};base64,${part.inlineData.data}`;
              activeEngine = "gemini_2.5_flash_multimodal_image";
              break;
            }
          }
        }
      } catch {
        // Proceed seamlessly to Engine 2 (Gemini 2.5 Flash Vision Calibration)
      }
    }

    // =========================================================================
    // ENGINE 2: Gemini 2.5 Flash Vision Calibration & Body Alignment
    // =========================================================================
    let analysisResult: TryOnAnalysisResult = {
      detectedSkinTone: "Sawo Matang Nusantara (Warm Neutral)",
      undertone: "Warm",
      fitScore: 96,
      colorHarmonyScore: 95,
      breathabilityScore: 98,
      verdictTitle: "Sangat Cocok & Harmonis di Kulit Anda",
      stylistAnalysis: `Kombinasi ${
        body.lookTitle || "setelan Studio ini"
      } memberikan kontras warna yang mencerahkan rona wajah Anda sekaligus menjaga sirkulasi udara tetap sejuk di suhu tropis 33°C.`,
      stylingTip:
        "Gunakan mode geser di kanvas untuk menyesuaikan tinggi bahu atau proporsi siluet sesuai selera Anda.",
      alignment: DEFAULT_ALIGNMENT,
    };

    if (apiKey) {
      try {
        const visionPrompt = `Kamu adalah AI Virtual Try-On & Personal Stylist Engine untuk platform Look.u Indonesia.
Tugasmu adalah menganalisis Foto 1 (Foto Pengguna) ${
          outfitData ? "dan Foto 2 (Foto Model Setelan Referensi)" : ""
        } untuk fitur Virtual Try-On setelan "${
          body.lookTitle || "Tropical Signature Look"
        }" dengan komponen: ${itemDescriptions}.

Analisis secara presisi:
1. Rona kulit Nusantara pengguna di Foto 1 (contoh: "Kuning Langsat (Warm Spring)", "Sawo Matang (Warm Autumn)", "Putih Gading (Cool/Neutral)", "Eksotis Tan").
2. Skor kecocokan siluet & warna pakaian terhadap pengguna (fitScore 88-99, colorHarmonyScore 88-99, breathabilityScore 94-99).
3. Kalibrasi titik koordinat wajah & tubuh (nilai desimal 0.0 sampai 1.0 terhadap lebar & tinggi gambar) agar pakaian menempel presisi:
   - userFace: titik tengah wajah pengguna di Foto 1 (centerX, centerY, width, height)
   - userTorso: titik bahu atas hingga pinggul/kaki pengguna di Foto 1 (centerX, topY, width, height)
   - modelHead: titik kepala/wajah model di Foto 2 (centerX, centerY, width, height)
   - modelGarment: area pakaian dari bahu/kerah hingga bawah di Foto 2 (centerX, topY, width, height)

Kembalikan HANYA JSON murni dengan format:
{
  "detectedSkinTone": "Sawo Matang (Warm Autumn)",
  "undertone": "Warm",
  "fitScore": 96,
  "colorHarmonyScore": 95,
  "breathabilityScore": 98,
  "verdictTitle": "Harmoni Warna & Siluet Sangat Pas",
  "stylistAnalysis": "Penjelasan 2 kalimat mengapa warna dan potongan baju ini cocok dengan wajah, skin tone, dan postur pengguna di foto.",
  "stylingTip": "1 kalimat tips singkat cara mengenakan setelan ini agar makin maksimal.",
  "alignment": {
    "userFace": { "centerX": 0.5, "centerY": 0.22, "width": 0.24, "height": 0.22 },
    "userTorso": { "centerX": 0.5, "topY": 0.30, "width": 0.62, "height": 0.65 },
    "modelHead": { "centerX": 0.5, "centerY": 0.16, "width": 0.18, "height": 0.16 },
    "modelGarment": { "centerX": 0.5, "topY": 0.23, "width": 0.56, "height": 0.72 }
  }
}`;

        const visionParts: Array<Record<string, unknown>> = [
          { text: visionPrompt },
          {
            inlineData: {
              mimeType: userMimeType,
              data: userBase64,
            },
          },
        ];

        if (outfitData) {
          visionParts.push({
            inlineData: {
              mimeType: outfitData.mimeType,
              data: outfitData.data,
            },
          });
        }

        const visionRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ role: "user", parts: visionParts }],
              generationConfig: {
                temperature: 0.3,
                maxOutputTokens: 900,
                responseMimeType: "application/json",
              },
            }),
          }
        );

        if (visionRes.ok) {
          const visionJson = await visionRes.json();
          const rawText =
            visionJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            analysisResult = {
              detectedSkinTone:
                parsed.detectedSkinTone || analysisResult.detectedSkinTone,
              undertone: parsed.undertone || analysisResult.undertone,
              fitScore: Number(parsed.fitScore) || 96,
              colorHarmonyScore: Number(parsed.colorHarmonyScore) || 95,
              breathabilityScore: Number(parsed.breathabilityScore) || 98,
              verdictTitle: parsed.verdictTitle || analysisResult.verdictTitle,
              stylistAnalysis:
                parsed.stylistAnalysis || analysisResult.stylistAnalysis,
              stylingTip: parsed.stylingTip || analysisResult.stylingTip,
              alignment: {
                userFace: {
                  centerX:
                    Number(parsed.alignment?.userFace?.centerX) ||
                    DEFAULT_ALIGNMENT.userFace.centerX,
                  centerY:
                    Number(parsed.alignment?.userFace?.centerY) ||
                    DEFAULT_ALIGNMENT.userFace.centerY,
                  width:
                    Number(parsed.alignment?.userFace?.width) ||
                    DEFAULT_ALIGNMENT.userFace.width,
                  height:
                    Number(parsed.alignment?.userFace?.height) ||
                    DEFAULT_ALIGNMENT.userFace.height,
                },
                userTorso: {
                  centerX:
                    Number(parsed.alignment?.userTorso?.centerX) ||
                    DEFAULT_ALIGNMENT.userTorso.centerX,
                  topY:
                    Number(parsed.alignment?.userTorso?.topY) ||
                    DEFAULT_ALIGNMENT.userTorso.topY,
                  width:
                    Number(parsed.alignment?.userTorso?.width) ||
                    DEFAULT_ALIGNMENT.userTorso.width,
                  height:
                    Number(parsed.alignment?.userTorso?.height) ||
                    DEFAULT_ALIGNMENT.userTorso.height,
                },
                modelHead: {
                  centerX:
                    Number(parsed.alignment?.modelHead?.centerX) ||
                    DEFAULT_ALIGNMENT.modelHead.centerX,
                  centerY:
                    Number(parsed.alignment?.modelHead?.centerY) ||
                    DEFAULT_ALIGNMENT.modelHead.centerY,
                  width:
                    Number(parsed.alignment?.modelHead?.width) ||
                    DEFAULT_ALIGNMENT.modelHead.width,
                  height:
                    Number(parsed.alignment?.modelHead?.height) ||
                    DEFAULT_ALIGNMENT.modelHead.height,
                },
                modelGarment: {
                  centerX:
                    Number(parsed.alignment?.modelGarment?.centerX) ||
                    DEFAULT_ALIGNMENT.modelGarment.centerX,
                  topY:
                    Number(parsed.alignment?.modelGarment?.topY) ||
                    DEFAULT_ALIGNMENT.modelGarment.topY,
                  width:
                    Number(parsed.alignment?.modelGarment?.width) ||
                    DEFAULT_ALIGNMENT.modelGarment.width,
                  height:
                    Number(parsed.alignment?.modelGarment?.height) ||
                    DEFAULT_ALIGNMENT.modelGarment.height,
                },
              },
            };
          }
        }
      } catch {
        // Fallback to default calibrated analysisResult
      }
    }

    return NextResponse.json({
      success: true,
      engine: activeEngine,
      generatedImage: generatedTryOnImage,
      analysis: analysisResult,
    });
  } catch (error) {
    console.error("Virtual Try-On API Error:", error);
    return NextResponse.json(
      {
        error: "Terjadi kesalahan saat memproses Virtual Try-On.",
      },
      { status: 500 }
    );
  }
}
