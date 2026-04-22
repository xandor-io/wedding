"use client";

import { useEffect, useMemo, useState } from "react";
import type { GuestRecord } from "@/lib/airtable";

export default function AdminGuests() {
  const [guests, setGuests] = useState<GuestRecord[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/admin/guests")
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => setGuests(data.guests))
      .catch(() => setError("Couldn't load guests."));
  }, []);

  const filtered = useMemo(() => {
    if (!guests) return [];
    const q = query.trim().toLowerCase();
    if (!q) return guests;
    return guests.filter((g) =>
      [g.name, g.email, g.phone, g.address].filter(Boolean).some((v) => v!.toLowerCase().includes(q))
    );
  }, [guests, query]);

  function downloadCsv() {
    if (!guests) return;
    const header = ["Name", "Email", "Phone", "Address", "Status", "Submitted"];
    const rows = guests.map((g) => [
      g.name, g.email, g.phone || "", g.address || "", g.status, g.createdAt || ""
    ]);
    const csv = [header, ...rows].map((r) => r.map(csvField).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: "2rem", margin: 0 }}>
          Guests {guests && <span style={{ fontSize: "1rem", color: "var(--sage)", fontStyle: "normal", marginLeft: "0.5rem" }}>({guests.length})</span>}
        </h1>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <input
            type="search"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", padding: "0.6rem 0.9rem", background: "var(--ivory-warm)", border: "1px solid rgba(124,138,106,0.3)", outline: "none" }}
          />
          <button
            onClick={downloadCsv}
            disabled={!guests}
            style={{ fontFamily: "'Jost', sans-serif", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", padding: "0.6rem 1rem", background: "var(--sage-deep)", color: "var(--ivory)", border: "none", cursor: guests ? "pointer" : "not-allowed", opacity: guests ? 1 : 0.6 }}
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && <div style={{ padding: "1rem", background: "rgba(201,145,139,0.12)", border: "1px solid var(--blush-rose)", marginBottom: "1.5rem" }}>{error}</div>}
      {guests === null && !error && <p style={{ color: "var(--sage)" }}>Loading…</p>}

      {guests && (
        <div style={{ overflowX: "auto", background: "var(--ivory-warm)", border: "1px solid rgba(124,138,106,0.2)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ background: "rgba(124,138,106,0.08)", textAlign: "left" }}>
                {["Name", "Email", "Phone", "Address", "Status", "Submitted"].map((h) => (
                  <th key={h} style={{ padding: "0.75rem 1rem", fontSize: "0.7rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage)", fontWeight: 400, borderBottom: "1px solid rgba(124,138,106,0.2)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((g) => (
                <tr key={g.id} style={{ borderBottom: "1px solid rgba(124,138,106,0.12)" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{g.name}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--ink-soft)" }}>{g.email}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--ink-soft)" }}>{g.phone || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--ink-soft)", maxWidth: 240 }}>{g.address || "—"}</td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <span style={{ fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.2rem 0.55rem", background: statusBg(g.status), color: statusFg(g.status) }}>
                      {g.status.replace("_", " ")}
                    </span>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: "var(--ink-soft)", fontSize: "0.8rem" }}>
                    {g.createdAt && new Date(g.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", fontStyle: "italic", color: "var(--sage)" }}>
                  {query ? "No matches." : "No guests yet."}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function statusBg(s: string): string {
  if (s === "rsvp_yes") return "rgba(124,138,106,0.2)";
  if (s === "rsvp_no") return "rgba(201,145,139,0.2)";
  return "rgba(228,199,188,0.3)";
}
function statusFg(s: string): string {
  if (s === "rsvp_yes") return "var(--sage-deep)";
  if (s === "rsvp_no") return "var(--blush-rose)";
  return "var(--ink-soft)";
}

function csvField(v: string): string {
  if (v.includes(",") || v.includes('"') || v.includes("\n")) {
    return `"${v.replace(/"/g, '""')}"`;
  }
  return v;
}
