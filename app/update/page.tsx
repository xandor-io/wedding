"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import GuestDetailsForm, { type GuestDetailsValues } from "@/app/components/GuestDetailsForm";

type Step = "lookup" | "not-found" | "edit" | "success";

interface ExistingGuest {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export default function UpdatePage() {
  const [step, setStep] = useState<Step>("lookup");
  const [email, setEmail] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState("");
  const [existing, setExisting] = useState<ExistingGuest | null>(null);

  async function handleLookup(e: FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setLookupError("Please enter your email.");
      return;
    }
    setLookupLoading(true);
    setLookupError("");
    try {
      const res = await fetch(`/api/guest/lookup?email=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setLookupError(data.error || "Couldn't look that up. Please try again.");
        setLookupLoading(false);
        return;
      }
      const data = await res.json();
      if (!data.found) {
        setStep("not-found");
        setLookupLoading(false);
        return;
      }
      setExisting(data.guest);
      setStep("edit");
      setLookupLoading(false);
    } catch {
      setLookupError("Couldn't reach the server. Please try again.");
      setLookupLoading(false);
    }
  }

  async function handleUpdate(values: GuestDetailsValues) {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Couldn't save your changes. Please try again.");
    }
    setStep("success");
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

        {step === "lookup" && (
          <>
            <h1>Update your details</h1>
            <p className="intro">
              Moved? New phone? Just enter the email you used when you first
              shared your information, and we'll pull up what we have.
            </p>
            <form onSubmit={handleLookup} className="lookup-form">
              <label>
                <span>Your email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </label>
              {lookupError && <div className="error">{lookupError}</div>}
              <button type="submit" disabled={lookupLoading}>
                {lookupLoading ? "Looking up…" : "Continue"}
              </button>
            </form>
            <Link href="/rsvp" className="alt-link">
              Haven't shared your details yet? Start here →
            </Link>
          </>
        )}

        {step === "not-found" && (
          <>
            <h1>We don't have you yet</h1>
            <p className="intro">
              We couldn't find an entry for <strong>{email}</strong>. If you
              think that's wrong, check the spelling or try the email you
              originally used. Otherwise, you can share your details for the
              first time below.
            </p>
            <Link href="/rsvp" className="btn-primary">
              Share your details →
            </Link>
            <button
              onClick={() => {
                setStep("lookup");
                setLookupError("");
              }}
              className="back-link-button"
              type="button"
            >
              ← Try a different email
            </button>
          </>
        )}

        {step === "edit" && existing && (
          <>
            <h1>Make any changes</h1>
            <p className="intro">
              Here's what we have on file. Update anything that's changed and
              save.
            </p>

            <GuestDetailsForm
              initialValues={existing}
              emailLocked
              submitLabel="Save changes"
              submittingLabel="Saving…"
              onSubmit={handleUpdate}
            />
          </>
        )}

        {step === "success" && (
          <>
            <h1>Saved</h1>
            <p className="intro">
              Your details are updated. Thanks for keeping us in the loop.
            </p>
            <p className="signoff">— Elexus &amp; Xandor</p>
            <Link href="/" className="btn-secondary">
              Back to our story
            </Link>
          </>
        )}

        {step !== "success" && (
          <Link href="/" className="back-link">
            ← Back
          </Link>
        )}
      </div>
    </main>
  );
}
