export type TelemetryEventType =
  | "page_view"
  | "generate_ootd"
  | "save_wardrobe"
  | "unsave_wardrobe"
  | "export_story"
  | "copy_share_link"
  | "quiz_complete"
  | "affiliate_shop_click"
  | "chat_message_sent"
  | "camera_scan_undertone"
  | "camera_scan_garment"
  | "pwa_install_prompt";

export interface TelemetryPayload {
  event: TelemetryEventType;
  metadata?: Record<string, any>;
  timestamp?: string;
  sessionId?: string;
  url?: string;
  referrer?: string;
}

/**
 * Gets or creates a persistent anonymous session ID in localStorage
 */
export function getAnonymousSessionId(): string {
  if (typeof window === "undefined") return "server_session";
  let sid = localStorage.getItem("looku_telemetry_session_id");
  if (!sid) {
    sid = "sid_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now().toString(36);
    localStorage.setItem("looku_telemetry_session_id", sid);
  }
  return sid;
}

/**
 * Client-side event tracking utility
 */
export async function trackEvent(
  event: TelemetryEventType,
  metadata: Record<string, any> = {}
): Promise<void> {
  if (typeof window === "undefined") return;

  const payload: TelemetryPayload = {
    event,
    metadata,
    timestamp: new Date().toISOString(),
    sessionId: getAnonymousSessionId(),
    url: window.location.href,
    referrer: document.referrer || undefined,
  };

  // Local storage telemetry log (stores last 50 events for debugging and profile analytics)
  try {
    const raw = localStorage.getItem("looku_telemetry_events");
    const events: TelemetryPayload[] = raw ? JSON.parse(raw) : [];
    events.unshift(payload);
    if (events.length > 50) events.pop();
    localStorage.setItem("looku_telemetry_events", JSON.stringify(events));
  } catch (e) {
    // Ignore storage quota errors
  }

  // Fire beacon or fetch to telemetry endpoint asynchronously
  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/telemetry", JSON.stringify(payload));
    } else {
      fetch("/api/telemetry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Fail silently in telemetry
  }
}
