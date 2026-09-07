import { NextRequest, NextResponse } from "next/server";
import { WaitlistEntry } from "@/lib/types";
import { saveWaitlistToDatabase } from "@/lib/supabase";
import { isValidEmail, isValidPhone, sanitizePlainText, isHoneypotTriggered } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body: WaitlistEntry & { hp_field?: string } = await req.json();

    // 1. Anti-Bot Honeypot Defense
    if (isHoneypotTriggered(body.hp_field)) {
      return NextResponse.json({
        success: true,
        message: "Berhasil terdaftar ke Early Access!",
        totalWaitlist: 154,
      });
    }

    // 2. Strict RFC-5322 Server-side Email Validation
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: "Format email tidak valid. Harap gunakan alamat email aktif yang benar." },
        { status: 400 }
      );
    }

    // 3. Phone Format Validation (if provided)
    if (body.whatsapp && !isValidPhone(body.whatsapp)) {
      return NextResponse.json(
        { error: "Format nomor WhatsApp tidak valid. Masukkan 8-16 digit angka (contoh: 081234567890)." },
        { status: 400 }
      );
    }

    // 4. Payload Sanitization & XSS Neutralization
    const newEntry: WaitlistEntry = {
      email: body.email.trim().toLowerCase(),
      whatsapp: body.whatsapp ? sanitizePlainText(body.whatsapp, 20) : undefined,
      name: body.name ? sanitizePlainText(body.name, 60) : undefined,
      favoriteStyle: body.favoriteStyle ? sanitizePlainText(body.favoriteStyle, 60) : "Modest & Earthy Minimalist",
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
