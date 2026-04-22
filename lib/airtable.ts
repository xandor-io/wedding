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
  const records = await base(tableName())
    .select({
      filterByFormula: `LOWER({Email}) = '${email.toLowerCase().replace(/'/g, "\\'")}'`,
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
