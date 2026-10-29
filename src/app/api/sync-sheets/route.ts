import { NextRequest, NextResponse } from "next/server";
import { parseCsvToTrendingLooks } from "@/lib/cms-store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sheetUrl = (body.url || "").trim();

    if (!sheetUrl) {
      return NextResponse.json(
        { success: false, error: "URL Google Sheets tidak boleh kosong." },
        { status: 400 }
      );
    }

    // Convert standard Google Sheets URL to CSV export URL if needed
    let csvUrl = sheetUrl;
    const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      const sheetId = match[1];
      // Check if specific gid is provided
      const gidMatch = sheetUrl.match(/gid=([0-9]+)/);
      const gid = gidMatch ? gidMatch[1] : "0";
      csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
    }

    const response = await fetch(csvUrl, {
      headers: {
        "User-Agent": "Looku-AI-Agent/1.0",
      },
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Gagal mengunduh spreadsheet dari Google (Status: ${response.status}). Pastikan Google Sheet Anda disetel "Siapa saja yang memiliki link dapat melihat" (Public/Anyone with link can view).`,
        },
        { status: 400 }
      );
    }

    const csvText = await response.text();
    const parsedLooks = parseCsvToTrendingLooks(csvText);

    if (parsedLooks.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Spreadsheet berhasil diunduh namun tidak ada baris data valid yang terbaca. Pastikan header kolom sesuai template.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      count: parsedLooks.length,
      looks: parsedLooks,
      message: `${parsedLooks.length} outfit dari Google Sheet berhasil disinkronkan.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Terjadi kesalahan saat memproses sinkronisasi Google Sheets.",
      },
      { status: 500 }
    );
  }
}
