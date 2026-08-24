import { NextRequest, NextResponse } from "next/server";
import { UserPreferences } from "@/lib/types";
import { generateOOTDRecommendation } from "@/lib/ai-engine";

export async function POST(req: NextRequest) {
  try {
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
