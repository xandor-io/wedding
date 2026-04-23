"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { GuestRecord } from "@/lib/airtable";

export default function AdminOverview() {
  const [guests, setGuests] = useState<GuestRecord[] | null>(null);
  const [error, setError] = useState("");
  // Capture "now" once on mount so render logic stays pure under React 19's
  // purity rules. Close enough for the "last 24 hours" dashboard stat — the
  // counter doesn't need to tick in realtime.
  const [mountNow] = useState(() => Date.now());

  useEffect(() => {
    fetch("/api/admin/guests")
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => setGuests(data.guests))
      .catch(() => setError("Couldn't load guests. Is Airtable configured?"));
  }, []);

  const total = guests?.length ?? 0;
  const withPhone = guests?.filter((g) => g.phone).length ?? 0;
  const withAddress = guests?.filter((g) => g.address).length ?? 0;
  const last24h = guests?.filter((g) => {
    if (!g.createdAt) return false;
    return mountNow - new Date(g.createdAt).getTime() < 86_400_000;
  }).length ?? 0;

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: "2rem", margin: "0 0 2rem" }}>
        Overview
      </h1>

      {error && (
        <div style={{ padding: "1rem", background: "rgba(201,145,139,0.12)", border: "1px solid var(--blush-rose)", fontSize: "0.9rem", marginBottom: "2rem", color: "var(--ink)" }}>
          {error}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <StatCard label="Total submitted" value={guests === null ? "—" : String(total)} />
        <StatCard label="With phone" value={guests === null ? "—" : String(withPhone)} />
        <StatCard label="With address" value={guests === null ? "—" : String(withAddress)} />
        <StatCard label="Last 24 hours" value={guests === null ? "—" : String(last24h)} />
      </div>

      <h2 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: "1.3rem", margin: "2rem 0 1rem" }}>
        Recent submissions
      </h2>

      {guests === null && !error && <p style={{ color: "var(--sage)" }}>Loading…</p>}
      {guests && guests.length === 0 && <p style={{ color: "var(--sage)", fontStyle: "italic" }}>No submissions yet.</p>}
      {guests && guests.length > 0 && (
        <div style={{ background: "var(--ivory-warm)", border: "1px solid rgba(124,138,106,0.2)" }}>
          {guests.slice(0, 8).map((g, i) => (
            <div key={g.id} style={{
              padding: "0.9rem 1.25rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              borderBottom: i === Math.min(guests.length, 8) - 1 ? "none" : "1px solid rgba(124,138,106,0.15)",
              fontSize: "0.9rem",
            }}>
              <div>
                <div style={{ fontWeight: 400 }}>{g.name}</div>
                <div style={{ fontSize: "0.8rem", color: "var(--sage)" }}>{g.email}</div>
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--ink-soft)", textAlign: "right" }}>
                {g.createdAt && formatDate(g.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}

      {guests && guests.length > 8 && (
        <Link href="/admin/guests" style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.8rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--sage-deep)", textDecoration: "none", borderBottom: "1px solid var(--sage-deep)" }}>
          See all →
        </Link>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "var(--ivory-warm)", border: "1px solid rgba(124,138,106,0.2)", padding: "1.25rem 1.5rem" }}>
      <div style={{ fontSize: "0.7rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.5rem" }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 300, fontSize: "2rem", color: "var(--ink)" }}>
        {value}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
