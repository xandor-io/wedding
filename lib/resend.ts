import { Resend } from "resend";

let client: Resend | null = null;

function getClient(): Resend {
  if (client) return client;
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("RESEND_API_KEY not set");
  client = new Resend(key);
  return client;
}

function fromAddress(): string {
  const email = process.env.RESEND_FROM_EMAIL;
  const name = process.env.RESEND_FROM_NAME || "Elexus & Xandor";
  if (!email) throw new Error("RESEND_FROM_EMAIL not set");
  return `${name} <${email}>`;
}

export interface SendResult {
  email: string;
  ok: boolean;
  error?: string;
}

export async function sendBulkEmail(
  recipients: { email: string; name: string }[],
  subject: string,
  htmlBody: string
): Promise<SendResult[]> {
  const resend = getClient();
  const from = fromAddress();

  // Send individually so we can personalize and track failures per-recipient.
  // Resend's free tier: 100 emails/day, 10 req/sec. We batch with small delays.
  const results: SendResult[] = [];
  for (const r of recipients) {
    try {
      const personalized = htmlBody.replace(/\{\{name\}\}/g, escapeHtml(r.name));
      await resend.emails.send({
        from,
        to: r.email,
        subject,
        html: personalized,
      });
      results.push({ email: r.email, ok: true });
    } catch (err) {
      results.push({
        email: r.email,
        ok: false,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    // Gentle throttle — 120ms between sends stays under rate limit
    await new Promise((r) => setTimeout(r, 120));
  }
  return results;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
