"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <PasswordForm />
    </Suspense>
  );
}

function PasswordForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const from = params.get("from") || "/";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "That's not quite right — try again.");
        setLoading(false);
        return;
      }
      router.push(from);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="wrap">
      <div className="card">
        <div className="ornament">
          <svg viewBox="0 0 80 30" fill="none" stroke="currentColor" strokeWidth="1">
            <path d="M 5 15 Q 20 5, 40 15 T 75 15" strokeLinecap="round" />
            <circle cx="40" cy="15" r="2" fill="currentColor" />
            <circle cx="15" cy="15" r="1" fill="currentColor" opacity="0.6" />
            <circle cx="65" cy="15" r="1" fill="currentColor" opacity="0.6" />
          </svg>
        </div>
        <h1>Elexus &amp; Xandor</h1>
        <p className="subtitle">
          Please enter the password from your save-the-date message.
        </p>

        <form onSubmit={onSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            autoComplete="off"
            placeholder="password"
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? "One moment…" : "Enter"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          background: radial-gradient(
              ellipse at center,
              rgba(228, 199, 188, 0.2),
              transparent 70%
            ),
            var(--ivory);
        }
        .card {
          max-width: 440px;
          width: 100%;
          padding: 4rem 3rem;
          background: var(--ivory-warm);
          border: 1px solid rgba(124, 138, 106, 0.25);
          box-shadow: 0 30px 80px -40px rgba(43, 42, 37, 0.3);
          text-align: center;
        }
        .ornament {
          color: var(--blush-rose);
          width: 80px;
          margin: 0 auto 1.5rem;
        }
        h1 {
          font-family: "Pinyon Script", cursive;
          font-size: 3rem;
          color: var(--ink);
          line-height: 1;
          margin: 0 0 1.5rem;
        }
        .subtitle {
          font-family: "Fraunces", serif;
          font-style: italic;
          font-weight: 300;
          color: var(--ink-soft);
          font-size: 1rem;
          line-height: 1.6;
          margin: 0 0 2.5rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        input {
          font-family: "Jost", sans-serif;
          font-size: 0.95rem;
          padding: 1rem 1.25rem;
          background: var(--ivory);
          border: 1px solid rgba(124, 138, 106, 0.35);
          color: var(--ink);
          text-align: center;
          letter-spacing: 0.1em;
          outline: none;
          transition: border-color 0.2s;
        }
        input:focus {
          border-color: var(--blush-rose);
        }
        .error {
          font-family: "Fraunces", serif;
          font-style: italic;
          font-size: 0.9rem;
          color: var(--blush-rose);
          margin-top: -0.5rem;
        }
        button {
          font-family: "Jost", sans-serif;
          font-size: 0.8rem;
          font-weight: 400;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          color: var(--ivory);
          background: var(--sage-deep);
          padding: 1rem 2rem;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          margin-top: 0.5rem;
        }
        button:hover:not(:disabled) {
          background: var(--blush-rose);
          letter-spacing: 0.45em;
        }
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        @media (max-width: 480px) {
          .card {
            padding: 3rem 1.75rem;
          }
          h1 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </main>
  );
}
