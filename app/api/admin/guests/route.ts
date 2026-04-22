import { NextResponse } from "next/server";
import { listGuests } from "@/lib/airtable";

export async function GET() {
  try {
    const guests = await listGuests();
    return NextResponse.json({ guests });
  } catch (err) {
    console.error("List guests error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load" },
      { status: 500 }
    );
  }
}
