import { NextRequest, NextResponse } from "next/server";
import { subscribeNewsletter, unsubscribeNewsletter } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = body.email?.trim().toLowerCase();

    if (!email || !email.includes("@") || !email.includes(".")) {
      return NextResponse.json(
        { error: "Format email tidak valid. Masukkan email yang benar." },
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
