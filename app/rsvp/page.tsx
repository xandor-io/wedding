"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

type State = "idle" | "submitting" | "success" | "error";

export default function RsvpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, address }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error || "Something went wrong. Please try again.");
        setState("error");
        return;
      }
      setState("success");
    } catch {
      setErrorMsg("Couldn't reach the server. Please try again.");
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <main className="wrap">
        <div className="card success">
          <div className="ornament">
            <svg viewBox="0 0 80 30" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M 5 15 Q 20 5, 40 15 T 75 15" strokeLinecap="round" />
              <circle cx="40" cy="15" r="2" fill="currentColor" />
              <circle cx="15" cy="15" r="1" fill="currentColor" opacity="0.6" />
              <circle cx="65" cy="15" r="1" fill="currentColor" opacity="0.6" />
            </svg>
          </div>
          <h1>Thank you</h1>
          <p className="intro">We've got your details. We can't wait to celebrate with you in Antigua.</p>
          <p className="signoff">— Elexus &amp; Xandor</p>
          <Link href="/" className="btn-secondary">Back to our story</Link>
        </div>
        <style jsx>{formStyles}</style>
      </main>
    );
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
        <h1>Share your details</h1>
        <p className="intro">So we can send you the official save-the-date, travel information, and everything you'll need for the weekend in Antigua.</p>

        <form onSubmit={onSubmit}>
          <label>
            <span>Full name</span>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
          </label>
          <label>
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </label>
          <label>
            <span>Phone</span>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" placeholder="+1 (555) 123-4567" />
          </label>
          <label>
            <span>Mailing address</span>
            <textarea value={address} onChange={(e) => setAddress(e.target.value)} required autoComplete="street-address" rows={3} placeholder="Street, city, state/province, postal code, country" />
          </label>
          {errorMsg && <div className="error">{errorMsg}</div>}
          <button type="submit" disabled={state === "submitting"}>
            {state === "submitting" ? "Sending…" : "Send my details"}
          </button>
        </form>
        <Link href="/" className="back-link">← Back</Link>
      </div>
      <style jsx>{formStyles}</style>
    </main>
  );
}

const formStyles = `
  .wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 3rem 1.5rem; background: radial-gradient(ellipse at center, rgba(228,199,188,0.2), transparent 70%), var(--ivory); }
  .card { max-width: 520px; width: 100%; padding: 4rem 3rem; background: var(--ivory-warm); border: 1px solid rgba(124,138,106,0.25); box-shadow: 0 30px 80px -40px rgba(43,42,37,0.3); text-align: center; position: relative; }
  .ornament { color: var(--blush-rose); width: 80px; margin: 0 auto 1.5rem; }
  h1 { font-family: 'Fraunces', serif; font-style: italic; font-weight: 300; font-size: 2.3rem; color: var(--ink); line-height: 1.1; margin: 0 0 1.25rem; }
  .intro { font-family: 'Fraunces', serif; font-weight: 300; color: var(--ink-soft); font-size: 1rem; line-height: 1.7; margin: 0 0 2.5rem; }
  .signoff { font-family: 'Pinyon Script', cursive; color: var(--blush-rose); font-size: 1.6rem; margin: 2rem 0; }
  form { display: flex; flex-direction: column; gap: 1.25rem; text-align: left; }
  label { display: flex; flex-direction: column; gap: 0.5rem; }
  label span { font-family: 'Jost', sans-serif; font-size: 0.7rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--sage); }
  input, textarea { font-family: 'Jost', sans-serif; font-size: 0.95rem; padding: 0.85rem 1rem; background: var(--ivory); border: 1px solid rgba(124,138,106,0.35); color: var(--ink); outline: none; transition: border-color 0.2s; font-weight: 300; }
  textarea { resize: vertical; min-height: 80px; }
  input:focus, textarea:focus { border-color: var(--blush-rose); }
  .error { font-family: 'Fraunces', serif; font-style: italic; font-size: 0.9rem; color: var(--blush-rose); }
  button { font-family: 'Jost', sans-serif; font-size: 0.8rem; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--ivory); background: var(--sage-deep); padding: 1.1rem 2rem; border: none; cursor: pointer; transition: all 0.4s cubic-bezier(0.22,1,0.36,1); margin-top: 0.75rem; }
  button:hover:not(:disabled) { background: var(--blush-rose); letter-spacing: 0.45em; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
  .back-link { display: inline-block; margin-top: 2rem; font-family: 'Jost', sans-serif; font-size: 0.75rem; letter-spacing: 0.3em; text-transform: uppercase; color: var(--sage); text-decoration: none; }
  .back-link:hover { color: var(--blush-rose); }
  .btn-secondary { display: inline-block; margin-top: 1.5rem; font-family: 'Jost', sans-serif; font-size: 0.8rem; letter-spacing: 0.4em; text-transform: uppercase; color: var(--sage-deep); text-decoration: none; border-bottom: 1px solid var(--sage-deep); padding-bottom: 2px; }
  .btn-secondary:hover { color: var(--blush-rose); border-color: var(--blush-rose); }
  @media (max-width: 480px) { .card { padding: 3rem 1.75rem; } h1 { font-size: 2rem; } }
`;
