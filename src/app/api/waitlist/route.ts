import { NextRequest, NextResponse } from "next/server";
import { WaitlistEntry } from "@/lib/types";
import { saveWaitlistToDatabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body: WaitlistEntry = await req.json();

    if (!body.email || !body.email.includes("@")) {
      return NextResponse.json(
        { error: "Format email tidak valid." },
        { status: 400 }
      );
    }

    const newEntry: WaitlistEntry = {
      email: body.email.trim().toLowerCase(),
      whatsapp: body.whatsapp?.trim(),
      name: body.name?.trim(),
      favoriteStyle: body.favoriteStyle,
      createdAt: new Date().toISOString(),
    };

    // Save directly to Supabase database
    const dbResult = await saveWaitlistToDatabase(newEntry);
    if (!dbResult.success && dbResult.error) {
      console.warn("DB save warning:", dbResult.error);
    }

    console.log("🎉 New Early Access Waitlist Signup persisted:", newEntry);

    return NextResponse.json({
      success: true,
      message: "Berhasil terdaftar ke Early Access!",
      totalWaitlist: 154, // Live VIP Counter
    });
  } catch (error) {
    console.error("API /api/waitlist error:", error);
    return NextResponse.json(
      { error: "Gagal mendaftar waitlist." },
      { status: 500 }
    );
  }
}
