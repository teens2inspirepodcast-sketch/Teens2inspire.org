"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function MembershipCheckout({
  plan,
  label,
  autoStart = false,
}: {
  plan: "personal" | "family";
  label: string;
  autoStart?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const autoStarted = useRef(false);

  const start = useCallback(async () => {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.status === 401) {
        window.location.assign(`/signup?plan=${plan}`);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Checkout could not be started.");
      }

      if (
        typeof data.url !== "string" ||
        !data.url.startsWith("https://checkout.stripe.com/")
      ) {
        throw new Error("We could not open secure checkout. Please try again.");
      }

      window.location.assign(data.url);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout could not be started.");
      setBusy(false);
    }
  }, [plan]);

  useEffect(() => {
    if (autoStart && !autoStarted.current) {
      autoStarted.current = true;
      void start();
    }
  }, [autoStart, start]);

  return (
    <div>
      <button className="btn primary" type="button" onClick={start} disabled={busy}>
        {busy ? "Opening secure checkout…" : label}
      </button>
      {message && <p role="alert" className="notice">{message}</p>}
    </div>
  );
}
