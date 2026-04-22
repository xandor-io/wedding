"use client";

import { useEffect, useMemo, useState } from "react";
import type { GuestRecord } from "@/lib/airtable";

type SendStatus = "idle" | "sending" | "done" | "error";

export default function AdminMessages() {
  const [guests, setGuests] = useState<GuestRecord[] | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(
    "Hi {{name}},\n\nJust a quick update on our wedding plans…\n\n— Elexus & Xandor"
  );
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<SendStatus>("idle");
  const [results, setResults] = useState<{ email: string; ok: boolean; error?: string }[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/guests")
      .then((r) => r.ok ? r.json() : Promise.reject(r))
      .then((data) => {
        setGuests(data.guests);
        setSelected(new Set(data.guests.map((g: GuestRecord) => g.id)));
      })
      .catch(() => setError("Couldn't load guests."));
  }, []);

  const recipients = useMemo(
    () => guests?.filter((g) => selected.has(g.id) && g.email) || [],
    [guests, selected]
  );

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  function toggleAll() {
    if (!guests) return;
    if (selected.size === guests.length) setSelected(new Set());
    else setSelected(new Set(guests.map((g) => g.id)));
  }

  async function send() {
    if (!confirm(`Send to ${recipients.length} recipient${recipients.length === 1 ? "" : "s"}?`)) return;
    setStatus("sending");
    setError("");
    setResults([]);
    try {
      const res = await fetch("/api/admin/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          recipients: recipients.map((r) => ({ email: r.email, name: r.name })),
        }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Send failed.");
        setStatus("error");
        return;
      }
      const data = await res.json();
      setResults(data.results);
      setStatus("done");
    } catch {
      setError("Network error.");
      setStatus("error");
    }
  }

  const bodyHtml = useMemo(() => bodyToHtml(body), [body]);
  const previewGuest = recipients[0];

  return (
    <div>
      <h1 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: "2rem", margin: "0 0 0.5rem" }}>
        Send a message
      </h1>
      <p style={{ color: "var(--ink-soft)", fontSize: "0.9rem", marginBottom: "2rem" }}>
        Use <code style={{ background: "rgba(124,138,106,0.15)", padding: "0.1rem 0.35rem" }}>{`{{name}}`}</code> to personalize the email with each recipient's name.
      </p>

      {error && <div style={{ padding: "1rem", background: "rgba(201,145,139,0.12)", border: "1px solid var(--blush-rose)", marginBottom: "1.5rem" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Compose */}
        <div>
          <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.75rem" }}>Compose</h2>
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            style={{ width: "100%", fontFamily: "'Jost', sans-serif", fontSize: "0.95rem", padding: "0.75rem 1rem", background: "var(--ivory-warm)", border: "1px solid rgba(124,138,106,0.3)", outline: "none", marginBottom: "0.75rem" }}
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={14}
            style={{ width: "100%", fontFamily: "'Jost', sans-serif", fontSize: "0.9rem", padding: "1rem", background: "var(--ivory-warm)", border: "1px solid rgba(124,138,106,0.3)", outline: "none", resize: "vertical", lineHeight: 1.6 }}
          />

          <div style={{ marginTop: "1.5rem", background: "var(--ivory-warm)", border: "1px solid rgba(124,138,106,0.2)", padding: "1rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--sage)", margin: 0 }}>
                Recipients {guests && `(${selected.size}/${guests.length})`}
              </h3>
              <button onClick={toggleAll} style={{ fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", background: "transparent", border: "none", color: "var(--sage-deep)", cursor: "pointer", textDecoration: "underline" }}>
                {selected.size === (guests?.length || 0) ? "Deselect all" : "Select all"}
              </button>
            </div>
            <div style={{ maxHeight: 220, overflowY: "auto" }}>
              {guests?.map((g) => (
                <label key={g.id} style={{ display: "flex", gap: "0.6rem", padding: "0.35rem 0", alignItems: "center", fontSize: "0.85rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={selected.has(g.id)} onChange={() => toggle(g.id)} />
                  <span style={{ flex: 1 }}>{g.name}</span>
                  <span style={{ color: "var(--sage)", fontSize: "0.78rem" }}>{g.email}</span>
                </label>
              ))}
              {guests?.length === 0 && <p style={{ color: "var(--sage)", fontStyle: "italic", fontSize: "0.85rem" }}>No guests yet.</p>}
            </div>
          </div>

          <button
            onClick={send}
            disabled={status === "sending" || recipients.length === 0 || !subject.trim() || !body.trim()}
            style={{
              marginTop: "1.5rem",
              width: "100%",
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              padding: "1rem 2rem",
              background: "var(--sage-deep)",
              color: "var(--ivory)",
              border: "none",
              cursor: status === "sending" ? "not-allowed" : "pointer",
              opacity: (status === "sending" || recipients.length === 0) ? 0.5 : 1,
            }}
          >
            {status === "sending" ? "Sending…" : `Send to ${recipients.length} ${recipients.length === 1 ? "person" : "people"}`}
          </button>
        </div>

        {/* Preview */}
        <div>
          <h2 style={{ fontSize: "0.75rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "var(--sage)", marginBottom: "0.75rem" }}>
            Preview {previewGuest && `(for ${previewGuest.name})`}
          </h2>
          <div style={{ background: "#fff", border: "1px solid rgba(124,138,106,0.2)", padding: "1.5rem", fontFamily: "'Jost', sans-serif" }}>
            <div style={{ fontSize: "0.75rem", color: "var(--sage)", marginBottom: "0.75rem", paddingBottom: "0.5rem", borderBottom: "1px solid rgba(124,138,106,0.15)" }}>
              <strong>To:</strong> {previewGuest?.email || "—"}<br/>
              <strong>Subject:</strong> {subject || "(no subject)"}
            </div>
            <div style={{ fontSize: "0.9rem", lineHeight: 1.7, color: "var(--ink)" }}
              dangerouslySetInnerHTML={{
                __html: previewGuest ? bodyHtml.replace(/\{\{name\}\}/g, previewGuest.name) : bodyHtml
              }}
            />
          </div>
        </div>
      </div>

      {status === "done" && (
        <div style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--ivory-warm)", border: "1px solid rgba(124,138,106,0.2)" }}>
          <h3 style={{ fontFamily: "'Fraunces', serif", fontStyle: "italic", fontWeight: 300, fontSize: "1.2rem", margin: "0 0 0.75rem" }}>
            Send complete — {results.filter((r) => r.ok).length}/{results.length} delivered
          </h3>
          {results.filter((r) => !r.ok).length > 0 && (
            <div style={{ fontSize: "0.85rem" }}>
              <div style={{ color: "var(--blush-rose)", marginBottom: "0.5rem" }}>Failed:</div>
              {results.filter((r) => !r.ok).map((r) => (
                <div key={r.email} style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}>
                  {r.email} — {r.error}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function bodyToHtml(body: string): string {
  return body
    .split(/\n\n+/)
    .map((p) => `<p style="margin: 0 0 1em;">${escapeHtml(p).replace(/\n/g, "<br/>")}</p>`)
    .join("");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
