import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get("url");

  if (!targetUrl) {
    return NextResponse.json({ error: "URL wajib diisi" }, { status: 400 });
  }

  try {
    let rawUrl = targetUrl.trim();

    // 1. Check if it's a Google Images redirect link
    if (rawUrl.includes("google.") && rawUrl.includes("/imgres")) {
      try {
        const parsed = new URL(rawUrl);
        const imgurl = parsed.searchParams.get("imgurl");
        if (imgurl) {
          return NextResponse.json({
            success: true,
            imageUrl: decodeURIComponent(imgurl),
            source: "google_images",
          });
        }
      } catch {
        // Fallback to normal flow
      }
    }

    // 2. Check if it's already a direct image URL (file extension or image CDN)
    const isDirectImage =
      /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(rawUrl) ||
      rawUrl.includes("images.unsplash.com") ||
      rawUrl.includes("i.pinimg.com") ||
      rawUrl.includes("image.uniqlo.com") ||
      rawUrl.includes("lp2.hm.com") ||
      rawUrl.includes("static.zara.net");

    if (isDirectImage) {
      return NextResponse.json({
        success: true,
        imageUrl: rawUrl,
        source: "direct_image_cdn",
      });
    }

    // 3. Attempt to fetch webpage and extract OpenGraph/Twitter image
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const res = await fetch(rawUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return NextResponse.json(
        { error: `Gagal membaca halaman (HTTP ${res.status}). Silakan gunakan cara Klik Kanan pada foto lalu pilih 'Salin Alamat Gambar'.` },
        { status: 400 }
      );
    }

    const html = await res.text();

    // A. Match OpenGraph og:image
    const ogMatch =
      html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
      html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i) ||
      html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);

    if (ogMatch && ogMatch[1]) {
      let foundUrl = ogMatch[1];
      if (foundUrl.startsWith("//")) {
        foundUrl = "https:" + foundUrl;
      } else if (foundUrl.startsWith("/")) {
        const u = new URL(rawUrl);
        foundUrl = `${u.origin}${foundUrl}`;
      }
      return NextResponse.json({
        success: true,
        imageUrl: foundUrl,
        source: "opengraph_meta",
      });
    }

    // B. Pinterest Pin fallback
    if (rawUrl.includes("pinterest.")) {
      const pinMatch =
        html.match(/https:\/\/[^"']*i\.pinimg\.com\/originals\/[^"']*/i) ||
        html.match(/https:\/\/[^"']*i\.pinimg\.com\/736x\/[^"']*/i);
      if (pinMatch && pinMatch[0]) {
        return NextResponse.json({
          success: true,
          imageUrl: pinMatch[0],
          source: "pinterest_cdn",
        });
      }
    }

    return NextResponse.json(
      {
        error:
          "Halaman ini tidak menyediakan OpenGraph gambar publik. Cukup buka gambarnya, klik kanan pada foto baju/model, dan pilih 'Salin Alamat Gambar' (Copy Image Address).",
      },
      { status: 404 }
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        error:
          "Koneksi ke website tersebut dibatasi. Gunakan cara universal: Klik kanan foto ➔ 'Salin Alamat Gambar' (Copy Image Address).",
      },
      { status: 500 }
    );
  }
}
