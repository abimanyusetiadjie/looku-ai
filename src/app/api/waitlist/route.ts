import { NextRequest, NextResponse } from "next/server";
import { WaitlistEntry } from "@/lib/types";

// In-memory list untuk MVP & logging
const waitlistSubmissions: WaitlistEntry[] = [];

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

    waitlistSubmissions.push(newEntry);
    console.log("🎉 New Early Access Waitlist Signup:", newEntry);

    return NextResponse.json({
      success: true,
      message: "Berhasil terdaftar ke Early Access!",
      totalWaitlist: waitlistSubmissions.length + 128, // Social proof offset
    });
  } catch (error) {
    console.error("API /api/waitlist error:", error);
    return NextResponse.json(
      { error: "Gagal mendaftar waitlist." },
      { status: 500 }
    );
  }
}
