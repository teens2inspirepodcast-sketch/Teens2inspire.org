"use client";

import { redeemSchoolCode } from "@/lib/school-code";
import { useEffect, useState } from "react";
export function SchoolCodeRedeem({ code }: { code?: string }) {
  const [message, setMessage] = useState(code ? "Applying your school access code…" : "");
  useEffect(() => {
    if (!code) return;
    let cancelled = false;
    (async () => {
      try {
        const schoolName = await redeemSchoolCode(code);
        if (!cancelled) setMessage(`School access activated for ${schoolName}. You can now open the Teens2Inspire app.`);
      } catch (error) { if (!cancelled) setMessage(error instanceof Error ? error.message : "We couldn't apply the school code. Please try again after signing in."); }
    })();
    return () => { cancelled = true; };
  }, [code]);
  return message ? <p className="notice" role="status">{message}</p> : null;
}
