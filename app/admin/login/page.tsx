"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setError("Wrong password.");
        setLoading(false);
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem",
      background: "var(--ivory)",
    }}>
      <div style={{
        maxWidth: 400,
        width: "100%",
        padding: "3rem 2.5rem",
        background: "var(--ivory-warm)",
        border: "1px solid rgba(124,138,106,0.25)",
      }}>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontStyle: "italic",
          fontWeight: 300,
          fontSize: "1.6rem",
          textAlign: "center",
          margin: "0 0 0.5rem",
          color: "var(--ink)",
        }}>
          Admin
        </h1>
        <p style={{
          textAlign: "center",
          fontSize: "0.75rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "var(--sage)",
          margin: "0 0 2.5rem",
        }}>
          Elexus &amp; Xandor
        </p>
        <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin password"
            autoFocus
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.95rem",
              padding: "0.85rem 1rem",
              background: "var(--ivory)",
              border: "1px solid rgba(124,138,106,0.35)",
              outline: "none",
              textAlign: "center",
              letterSpacing: "0.1em",
            }}
          />
          {error && <div style={{ color: "var(--blush-rose)", fontSize: "0.85rem", fontStyle: "italic", textAlign: "center" }}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: "0.8rem",
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "var(--ivory)",
              background: "var(--sage-deep)",
              padding: "0.9rem 1.5rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "…" : "Enter"}
          </button>
        </form>
      </div>
    </main>
  );
}
