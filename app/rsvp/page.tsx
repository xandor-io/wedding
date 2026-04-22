"use client";

import { useState } from "react";
import Link from "next/link";
import GuestDetailsForm, { type GuestDetailsValues } from "@/app/components/GuestDetailsForm";

type State = "idle" | "success";

export default function RsvpPage() {
  const [state, setState] = useState<State>("idle");

  async function onSubmit(values: GuestDetailsValues) {
    const res = await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "Something went wrong. Please try again.");
    }
    setState("success");
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
        <p className="intro">
          So we can send you the official save-the-date, travel information, and
          everything you'll need for the weekend in Antigua.
        </p>

        <GuestDetailsForm
          submitLabel="Send my details"
          submittingLabel="Sending…"
          onSubmit={onSubmit}
        />

        <Link href="/update" className="update-link">
          Already shared? Update your details →
        </Link>
        <Link href="/" className="back-link">← Back</Link>
      </div>
    </main>
  );
}
