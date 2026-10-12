"use client";
import { useState } from "react";

export function MembershipCheckout({ plan, label }: { plan: "personal" | "family"; label: string }) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function start() {
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/stripe/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ plan }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Checkout could not be started.");
      if (typeof data.url !== "string" || !data.url.startsWith("https://checkout.stripe.com/")) throw new Error("The checkout link was not valid.");
      window.location.assign(data.url);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Checkout could not be started."); setBusy(false); }
  }
  return <div><button className="btn primary" type="button" onClick={start} disabled={busy}>{busy ? "Opening secure checkout…" : label}</button>{message && <p role="alert" className="notice">{message}</p>}</div>;
}
