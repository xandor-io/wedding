import { NextRequest, NextResponse } from "next/server";
import { sendBulkEmail } from "@/lib/resend";

// Allow up to 5 minutes so a bulk send of ~150 recipients can complete
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  try {
    const { subject, body, recipients } = await req.json();
    if (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
      return NextResponse.json({ error: "subject, body, and recipients are required" }, { status: 400 });
    }

    const htmlBody = bodyToHtml(body);
    const results = await sendBulkEmail(recipients, subject, htmlBody);
    return NextResponse.json({ results });
  } catch (err) {
    console.error("Bulk email error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed" },
      { status: 500 }
    );
  }
}

// Server-side HTML wrap — same as the client preview logic but trusted
function bodyToHtml(body: string): string {
  const escaped = String(body)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const paragraphs = escaped
    .split(/\n\n+/)
    .map((p) => `<p style="margin: 0 0 1em; line-height: 1.7; color: #2B2A25; font-family: Georgia, serif; font-size: 15px;">${p.replace(/\n/g, "<br/>")}</p>`)
    .join("");
  return `
    <div style="background:#F6F1E6; padding: 40px 20px; font-family: Georgia, serif;">
      <div style="max-width: 560px; margin: 0 auto; background: #FAF6EC; padding: 48px 40px; border: 1px solid rgba(124,138,106,0.25);">
        <div style="text-align:center; margin-bottom: 32px; color: #C9918B; font-family: Georgia, serif; font-style: italic; font-size: 24px;">
          Elexus &amp; Xandor
        </div>
        ${paragraphs}
      </div>
      <div style="text-align:center; margin-top: 24px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: #7C8A6A;">
        25 April 2027 · Antigua Guatemala
      </div>
    </div>
  `;
}
