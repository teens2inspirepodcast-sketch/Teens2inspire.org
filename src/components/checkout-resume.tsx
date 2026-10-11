"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";

type Plan = "personal" | "family";

export default function CheckoutResume() {
  const params = useSearchParams();
  const [status, setStatus] = useState<"idle" | "starting" | "error">("idle");
  const [message, setMessage] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const startedPlan = useRef<string | null>(null);
  const plan = params.get("checkout");

  useEffect(() => {
    if (plan !== "personal" && plan !== "family") return;
    if (startedPlan.current === plan) return;
    startedPlan.current = plan;
    setStatus("starting");
    (async () => {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      }).catch(() => null);
      const payload = await response?.json().catch(() => null);
      if (response?.ok && typeof payload?.url === "string") {
        window.location.assign(payload.url);
        return;
      }
      setStatus("error");
      setMessage(payload?.error || (response?.status === 401 || response?.status === 403
        ? "Please log in and confirm your email before continuing to checkout."
        : "We could not start checkout right now. Your account is safe; please try again."));
    })();
  }, [plan, retryCount]);

  if (plan !== "personal" && plan !== "family") return null;
  return <div className={status === "error" ? "form-error" : "form-success"} role={status === "error" ? "alert" : "status"}>
    {status === "starting" ? <><LoaderCircle size={16} className="spin" aria-hidden="true" /> Preparing secure checkout…</> : <>{message}{status === "error" && <button className="text-link" type="button" onClick={() => { startedPlan.current = null; setMessage(""); setStatus("starting"); setRetryCount((count) => count + 1); }}>Try again</button>}</>}
  </div>;
}
