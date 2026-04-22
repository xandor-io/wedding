import { NextRequest, NextResponse } from "next/server";
import { passwordMatches, setAdminCookie, clearAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expected = process.env.ADMIN_PASSWORD;

    if (!expected) {
      return NextResponse.json({ error: "Not configured" }, { status: 500 });
    }

    if (typeof password !== "string" || !passwordMatches(password, expected)) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }

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
