import Airtable from "airtable";

export type GuestStatus =
  | "info_submitted"
  | "invited"
  | "rsvp_yes"
  | "rsvp_no";

export interface GuestRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  status: GuestStatus;
  notes?: string;
  createdAt?: string;
}

// Lazy-init Airtable so missing env vars don't break the build
let cachedBase: Airtable.Base | null = null;

function getBase(): Airtable.Base {
  if (cachedBase) return cachedBase;
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) {
    throw new Error(
      "Airtable not configured. Set AIRTABLE_API_KEY and AIRTABLE_BASE_ID."
    );
  }
  cachedBase = new Airtable({ apiKey }).base(baseId);
  return cachedBase;
}

function tableName(): string {
  return process.env.AIRTABLE_TABLE_NAME || "Guests";
}

export async function createGuest(
  input: Omit<GuestRecord, "id" | "createdAt">
): Promise<GuestRecord> {
  const base = getBase();
  const created = await base(tableName()).create([
    {
      fields: {
        Name: input.name,
        Email: input.email,
        Phone: input.phone || "",
        Address: input.address || "",
        Status: input.status,
        Notes: input.notes || "",
      },
    },
  ]);
  const rec = created[0];
  return mapRecord(rec);
}

/**
 * Upsert by email. If a guest with this email exists, update the editable
 * fields (name, phone, address). NEVER touches Status or Notes — those are
 * for Elexus to manage in Airtable.
 * If no match, creates a new guest with status "info_submitted".
 */
export async function upsertGuestByEmail(
  input: Omit<GuestRecord, "id" | "createdAt" | "status" | "notes">
): Promise<{ guest: GuestRecord; created: boolean }> {
  const existing = await findGuestByEmail(input.email);
  if (existing) {
    const base = getBase();
    const updated = await base(tableName()).update([
      {
        id: existing.id,
        fields: {
          Name: input.name,
          Phone: input.phone || "",
          Address: input.address || "",
        },
      },
    ]);
    return { guest: mapRecord(updated[0]), created: false };
  }
  const guest = await createGuest({
    name: input.name,
    email: input.email,
    phone: input.phone,
    address: input.address,
    status: "info_submitted",
  });
  return { guest, created: true };
}

export async function listGuests(): Promise<GuestRecord[]> {
  const base = getBase();
  const records = await base(tableName())
    .select({ sort: [{ field: "Created", direction: "desc" }] })
    .all();
  return records.map(mapRecord);
}

export async function findGuestByEmail(
  email: string
): Promise<GuestRecord | null> {
  const base = getBase();
  // Defense in depth: callers (API routes) already validate against EMAIL_RE,
  // but strip anything outside the email charset here too so a future caller
  // that forgets to validate can't inject into the filterByFormula string.
  // Airtable formulas have no documented single-quote escape, so our only
  // safe move is to ensure the value can never contain one.
  const safe = email.toLowerCase().replace(/[^a-z0-9._%+\-@]/g, "");
  const records = await base(tableName())
    .select({
      filterByFormula: `LOWER({Email}) = '${safe}'`,
      maxRecords: 1,
    })
    .firstPage();
  if (records.length === 0) return null;
  return mapRecord(records[0]);
}

function mapRecord(rec: Airtable.Record<Airtable.FieldSet>): GuestRecord {
  const f = rec.fields;
  return {
    id: rec.id,
    name: String(f.Name || ""),
    email: String(f.Email || ""),
    phone: f.Phone ? String(f.Phone) : undefined,
    address: f.Address ? String(f.Address) : undefined,
    status: (f.Status as GuestStatus) || "info_submitted",
    notes: f.Notes ? String(f.Notes) : undefined,
    createdAt: f.Created ? String(f.Created) : undefined,
  };
}
