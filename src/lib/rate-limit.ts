import { NextRequest } from "next/server";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory sliding window rate limit map
const rateLimitMap = new Map<string, RateLimitStore>();

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitMap.forEach((store, key) => {
      if (now > store.resetTime) {
        rateLimitMap.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitConfig {
  limit: number;       // Max requests allowed in the window
  windowMs: number;    // Time window in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;       // Unix timestamp (seconds)
}

/**
 * Extracts a robust client IP identifier from request headers
 */
export function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}

/**
 * Checks and increments rate limit for a specific key/endpoint
 */
export function rateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 30, windowMs: 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const store = rateLimitMap.get(identifier);

  if (!store || now > store.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    return {
      success: true,
      limit: config.limit,
      remaining: config.limit - 1,
      reset: Math.ceil(resetTime / 1000),
    };
  }

  if (store.count >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      reset: Math.ceil(store.resetTime / 1000),
    };
  }

  store.count += 1;
  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - store.count,
    reset: Math.ceil(store.resetTime / 1000),
  };
}
