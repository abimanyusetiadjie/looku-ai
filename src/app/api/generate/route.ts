import { NextRequest, NextResponse } from "next/server";
import { UserPreferences } from "@/lib/types";
import { generateOOTDRecommendation } from "@/lib/ai-engine";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limitResult = rateLimit(`gen:${ip}`, { limit: 25, windowMs: 60 * 1000 });

    if (!limitResult.success) {
      return NextResponse.json(
        { error: "Batas frekuensi racik outfit tercapai. Mohon tunggu 1 menit." },
        {
          status: 429,
          headers: {
            "Retry-After": String(limitResult.reset - Math.ceil(Date.now() / 1000)),
          },
        }
      );
    }

    const body: UserPreferences = await req.json();

    if (!body.occasion || !body.budget || !body.weather) {
      return NextResponse.json(
        { error: "Parameter preferensi tidak lengkap." },
        { status: 400 }
      );
    }

    const recommendation = await generateOOTDRecommendation(body);

    return NextResponse.json({
      success: true,
      data: recommendation,
    });
  } catch (error) {
    console.error("API /api/generate error:", error);
    return NextResponse.json(
      { error: "Gagal memproses rekomendasi outfit." },
      { status: 500 }
    );
  }
}
