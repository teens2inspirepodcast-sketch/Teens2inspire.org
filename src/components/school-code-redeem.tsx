"use client";
import { useEffect, useState } from "react";
export function SchoolCodeRedeem({ code }: { code?: string }) {
  const [message, setMessage] = useState(code ? "Applying your school access code…" : "");
  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch("/api/school/redeem", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code }) });
        const data = await response.json().catch(() => ({}));
        if (!cancelled) setMessage(response.ok ? `School access activated for ${data.schoolName || "your school"}. You can now open the Teens2Inspire app.` : (data.error || "We couldn't apply that school code. Please sign in and try again."));
      } catch { if (!cancelled) setMessage("We couldn't apply the school code. Please try again after signing in."); }
    })();
    return () => { cancelled = true; };
  }, [code]);
  return message ? <p className="notice" role="status">{message}</p> : null;
}
