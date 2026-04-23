import { NextRequest, NextResponse } from "next/server";
import { upsertGuestByEmail } from "@/lib/airtable";
import { isValidEmail } from "@/lib/validation";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const address = String(body.address || "").trim();

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const result = await upsertGuestByEmail({
      name,
      email,
      phone,
      address,
    });

    return NextResponse.json({ ok: true, created: result.created });
  } catch (err) {
    console.error("RSVP error:", err);
    return NextResponse.json(
      { error: "Couldn't save your details. Please try again." },
      { status: 500 }
    );
  }
}
