import { NextRequest, NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const limit = rateLimit(`telem:${ip}`, { limit: 120, windowMs: 60 * 1000 });

    if (!limit.success) {
      return NextResponse.json({ status: "rate_limited" }, { status: 429 });
    }

    const payload = await req.json();

    if (!payload.event) {
      return NextResponse.json({ error: "Event type is required." }, { status: 400 });
    }

    // If Supabase is configured, record into telemetry_events table
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from("telemetry_events").insert([
          {
            event_name: payload.event,
            session_id: payload.sessionId || "anonymous",
            url: payload.url || "",
            metadata: payload.metadata || {},
            created_at: payload.timestamp || new Date().toISOString(),
          },
        ]);
      } catch (dbError) {
        console.warn("Failed to write event to Supabase:", dbError);
      }
    }

    return NextResponse.json({ success: true, recorded: payload.event });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
