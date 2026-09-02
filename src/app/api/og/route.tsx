import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title") || "Formula OOTD Tropis 33°C";
    const vibe = searchParams.get("vibe") || "Earthy Minimalist & Breathable";
    const tone = searchParams.get("tone") || "Harmoni Personal Color Nusantara";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#181A18",
            backgroundImage:
              "radial-gradient(circle at 90% 10%, rgba(186, 93, 56, 0.25) 0%, transparent 60%), radial-gradient(circle at 10% 90%, rgba(215, 202, 188, 0.1) 0%, transparent 50%)",
            padding: "60px 70px",
            fontFamily: "sans-serif",
            color: "#FAF8F5",
          }}
        >
          {/* Top Brand Bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "baseline" }}>
              <span style={{ fontSize: "42px", fontWeight: "900", fontStyle: "italic", letterSpacing: "-1px" }}>
                look
              </span>
              <span style={{ fontSize: "42px", fontWeight: "900", color: "#BA5D38" }}>.</span>
              <span style={{ fontSize: "42px", fontWeight: "900", fontStyle: "italic", letterSpacing: "-1px" }}>
                u
              </span>
              <span
                style={{
                  fontSize: "14px",
                  letterSpacing: "3px",
                  textTransform: "uppercase",
                  marginLeft: "16px",
                  color: "#D7CABC",
                  borderLeft: "2px solid #BA5D38",
                  paddingLeft: "12px",
                }}
              >
                AI FASHION ATELIER
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                padding: "8px 18px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: "700",
                color: "#E8DFD1",
                letterSpacing: "1px",
              }}
            >
              ☀️ UJI IKLIM 33°C ADEM
            </div>
          </div>

          {/* Middle Main Showcase */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                fontSize: "16px",
                color: "#BA5D38",
                fontWeight: "800",
                letterSpacing: "2px",
                textTransform: "uppercase",
              }}
            >
              <span>✦</span>
              <span>KURASI STYLIST PRIBADI</span>
            </div>

            <div
              style={{
                fontSize: "56px",
                fontWeight: "800",
                lineHeight: "1.15",
                letterSpacing: "-1.5px",
                color: "#FFFFFF",
              }}
            >
              {title}
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "8px",
              }}
            >
              <span
                style={{
                  backgroundColor: "rgba(186, 93, 56, 0.2)",
                  border: "1px solid rgba(186, 93, 56, 0.5)",
                  color: "#F4EFE6",
                  fontSize: "16px",
                  padding: "6px 16px",
                  borderRadius: "12px",
                }}
              >
                Vibe: {vibe}
              </span>
              <span
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#D7CABC",
                  fontSize: "16px",
                  padding: "6px 16px",
                  borderRadius: "12px",
                }}
              >
                {tone}
              </span>
            </div>
          </div>

          {/* Bottom Colophon */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.15)",
              paddingTop: "24px",
              fontSize: "14px",
              color: "#A89582",
            }}
          >
            <div>looku.ai • Racik OOTD Harianmu Bebas Gerah</div>
            <div style={{ color: "#BA5D38", fontWeight: "700", letterSpacing: "1px" }}>
              100% KATUN RAYON & LINEN ADEM
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
