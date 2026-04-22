import { NextRequest, NextResponse } from "next/server";
import { findGuestByEmail } from "@/lib/airtable";

export async function GET(req: NextRequest) {
  try {
    const email = (req.nextUrl.searchParams.get("email") || "").trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email required." }, { status: 400 });
    }
    const guest = await findGuestByEmail(email);
    if (!guest) {
      return NextResponse.json({ found: false });
    }
    // Only return editable fields — don't leak status or notes
    return NextResponse.json({
      found: true,
      guest: {
        name: guest.name,
        email: guest.email,
        phone: guest.phone || "",
        address: guest.address || "",
      },
    });
  } catch (err) {
    console.error("Lookup error:", err);
    return NextResponse.json({ error: "Lookup failed." }, { status: 500 });
  }
}
