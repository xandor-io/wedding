"use client";

import { useState, FormEvent, ReactNode } from "react";

export interface GuestDetailsValues {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Props {
  initialValues?: Partial<GuestDetailsValues>;
  emailLocked?: boolean;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (values: GuestDetailsValues) => Promise<void>;
  footer?: ReactNode;
}

export default function GuestDetailsForm({
  initialValues,
  emailLocked = false,
  submitLabel,
  submittingLabel,
  onSubmit,
  footer,
}: Props) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [email, setEmail] = useState(initialValues?.email ?? "");
  const [phone, setPhone] = useState(initialValues?.phone ?? "");
  const [address, setAddress] = useState(initialValues?.address ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit({ name, email, phone, address });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="guest-form">
      <label>
        <span>Full name</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </label>
      <label>
        <span>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          readOnly={emailLocked}
          disabled={emailLocked}
        />
      </label>
      <label>
        <span>Phone</span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          autoComplete="tel"
          placeholder="+1 (555) 123-4567"
        />
      </label>
      <label>
        <span>Mailing address</span>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          autoComplete="street-address"
          rows={3}
          placeholder="Street, city, state/province, postal code, country"
        />
      </label>
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={submitting}>
        {submitting ? submittingLabel : submitLabel}
      </button>
      {footer}
    </form>
  );
}
