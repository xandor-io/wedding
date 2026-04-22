import { NextRequest, NextResponse } from "next/server";
import { passwordMatches, setSiteCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expected = process.env.SITE_PASSWORD;

    if (!expected) {
      return NextResponse.json(
        { error: "Site not configured" },
        { status: 500 }
      );
    }

    if (typeof password !== "string" || !passwordMatches(password, expected)) {
      return NextResponse.json(
        { error: "That password isn't right." },
        { status: 401 }
      );
    }

    await setSiteCookie();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
