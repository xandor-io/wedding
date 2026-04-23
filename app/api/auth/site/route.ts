import { NextRequest, NextResponse } from "next/server";
import { passwordMatches, setSiteCookie } from "@/lib/auth";
import {
  checkRateLimit,
  registerFailure,
  resetRateLimit,
  getClientIp,
  type RateLimitOpts,
} from "@/lib/rate-limit";

// Looser than admin: a whole household may share the link via group chat,
// hit the gate from the same IP, mis-type a few times before getting it.
const SITE_LIMIT: RateLimitOpts = { limit: 20, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  try {
    const key = `site-auth:${getClientIp(req)}`;

    const rate = checkRateLimit(key, SITE_LIMIT);
    if (!rate.allowed) {
      return NextResponse.json(
        { error: `Too many attempts. Try again in ${rate.retryAfter}s.` },
        {
          status: 429,
          headers: { "Retry-After": String(rate.retryAfter) },
        }
      );
    }

    const { password } = await req.json();
    const expected = process.env.SITE_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: "Site not configured" },
        { status: 500 }
      );
    }

    if (typeof password !== "string" || !passwordMatches(password, expected)) {
      registerFailure(key, SITE_LIMIT);
      return NextResponse.json(
        { error: "That password isn't right." },
        { status: 401 }
      );
    }

    resetRateLimit(key);
    await setSiteCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
