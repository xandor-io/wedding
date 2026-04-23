/**
 * Minimal in-memory IP-based rate limiter for auth endpoints.
 *
 * Counts FAILED attempts per key within a rolling window. Successful logins
 * reset the counter so a legitimate user who mis-types once isn't penalized.
 *
 * Scope caveat: each serverless instance keeps its own Map, so the effective
 * limit across a horizontally-scaled deployment is `limit × instance_count`.
 * Acceptable for this site's threat model (slowing down brute-force, not
 * preventing a distributed attack). If the app ever needs distributed
 * limiting, swap this for @upstash/ratelimit — same API shape.
 */
import type { NextRequest } from "next/server";

interface Bucket {
  failures: number;
  windowEnd: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOpts {
  /** Max failed attempts within the window before blocking. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the current window expires (only set when !allowed). */
  retryAfter?: number;
}

export function checkRateLimit(key: string, opts: RateLimitOpts): RateLimitResult {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.windowEnd <= now) return { allowed: true };
  if (b.failures >= opts.limit) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((b.windowEnd - now) / 1000)),
    };
  }
  return { allowed: true };
}

export function registerFailure(key: string, opts: RateLimitOpts): void {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.windowEnd <= now) {
    buckets.set(key, { failures: 1, windowEnd: now + opts.windowMs });
    return;
  }
  b.failures++;
}

export function resetRateLimit(key: string): void {
  buckets.delete(key);
}

/**
 * Best-effort extraction of the client IP from a request.
 * On Vercel, `x-forwarded-for` is set by the platform edge and is trustworthy.
 * Falls back to `x-real-ip`, then a literal "local" for dev mode.
 */
export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "local";
}
