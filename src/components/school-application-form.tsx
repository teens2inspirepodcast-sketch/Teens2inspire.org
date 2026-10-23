"use client";
import { useState } from "react";

export function SchoolApplicationForm() {
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [done, setDone] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setStatus(""); setDone(false);
    const formEl = event.currentTarget; const form = new FormData(formEl);
    const school = String(form.get("school") || "").trim();
    const contact = String(form.get("contact") || "").trim();
    const email = String(form.get("email") || "").trim();
    const role = String(form.get("role") || "").trim();
    const students = String(form.get("students") || "").trim();
    const website = String(form.get("website") || "").trim();
    const notes = String(form.get("notes") || "").trim();
    const message = [`School: ${school}`, `Contact person: ${contact}`, `Role: ${role || "Not provided"}`, `Estimated student count: ${students || "Not provided"}`, `School website: ${website || "Not provided"}`, `Additional details: ${notes || "None provided"}`].join("\n");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind: "school", name: contact, email, subject: `School free-access application — ${school}`, message }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "The application could not be submitted. Please try again.");
      setDone(true); setStatus("Your school application has been received. We will follow up with the contact email provided."); formEl.reset();
    } catch (error) { setStatus(error instanceof Error ? error.message : "The application could not be submitted."); }
    finally { setBusy(false); }
  }
  return <form className="form contact-form" onSubmit={submit}>
    <label>School name<input name="school" required maxLength={160} /></label>
    <label>Contact person<input name="contact" required maxLength={120} /></label>
    <label>Official school email<input name="email" type="email" required maxLength={254} /></label>
    <label>Your role at the school<input name="role" required maxLength={120} placeholder="e.g. Principal, administrator, teacher" /></label>
    <label>Approximate number of students<input name="students" inputMode="numeric" pattern="[0-9]{1,6}" maxLength={6} placeholder="Optional" /></label>
    <label>School website<input name="website" type="url" maxLength={300} placeholder="https://" /></label>
    <label>Anything else we should know?<textarea name="notes" rows={4} maxLength={2500} /></label>
    {status && <p className="notice" role="status">{status}</p>}
    <button className="btn primary" disabled={busy}>{busy ? "Submitting…" : done ? "Submit another application" : "Apply for a free school code"}</button>
  </form>;
}
