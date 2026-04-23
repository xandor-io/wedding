import { NextRequest, NextResponse } from "next/server";
import { passwordMatches, setAdminCookie, clearAdminCookie } from "@/lib/auth";
import {
  checkRateLimit,
  registerFailure,
  resetRateLimit,
  getClientIp,
  type RateLimitOpts,
} from "@/lib/rate-limit";

const ADMIN_LIMIT: RateLimitOpts = { limit: 5, windowMs: 60_000 };

export async function POST(req: NextRequest) {
  try {
    const key = `admin-auth:${getClientIp(req)}`;

    const rate = checkRateLimit(key, ADMIN_LIMIT);
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
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    if (typeof password !== "string" || !passwordMatches(password, expected)) {
      registerFailure(key, ADMIN_LIMIT);
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

    resetRateLimit(key);
    await setAdminCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
