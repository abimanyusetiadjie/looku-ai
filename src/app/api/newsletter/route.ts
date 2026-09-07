import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter, unsubscribeNewsletter } from "@/lib/supabase";
import { isValidEmail, isHoneypotTriggered } from "@/lib/security";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Honeypot check
    if (isHoneypotTriggered(body.hp_check)) {
      return NextResponse.json({
        success: true,
        message: "Selamat! Kamu berhasil berlangganan info tren OOTD mingguan look.u ✨",
      });
    }

    const email = body.email?.trim().toLowerCase();

    // 2. Strict RFC-5322 regex validation
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Format email tidak valid. Masukkan alamat email aktif (contoh: nama@domain.com)." },
        { status: 400 }
      );
    }

    const result = await subscribeNewsletter(email);
    if (!result.success && result.error) {
      console.warn("Newsletter DB save warning:", result.error);
    }

    return NextResponse.json({
      success: true,
      message: "Selamat! Kamu berhasil berlangganan info tren OOTD mingguan look.u ✨",
    });
  } catch (err) {
    console.error("Newsletter API error:", err);
    return NextResponse.json(
      { error: "Gagal memproses langganan newsletter." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ error: "Email wajib disertakan." }, { status: 400 });
    }

    const result = await unsubscribeNewsletter(email);
    return NextResponse.json({
      success: result.success,
      message: "Berhasil berhenti berlangganan newsletter.",
    });
  } catch (err) {
    return NextResponse.json({ error: "Gagal unsubscribe." }, { status: 500 });
  }
}
