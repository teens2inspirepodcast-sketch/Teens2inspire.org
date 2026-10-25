"use client";

import { redeemSchoolCode } from "@/lib/school-code";
import { useState } from "react";
export function SchoolCodeForm() {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setSuccess(false);
    try {
      const schoolName = await redeemSchoolCode(code);
      setSuccess(true); setMessage(`School access activated for ${schoolName}.`); setCode("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Could not redeem that code."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit} className="school-code-form"><label htmlFor="school-code">School access code</label><input id="school-code" value={code} onChange={e => setCode(e.target.value.toUpperCase())} autoComplete="off" maxLength={48} required placeholder="Enter the code from your school"/><button className="btn primary" disabled={busy}>{busy ? "Checking code…" : "Redeem school code"}</button>{message && <p className={success ? "notice success" : "notice"} role="status">{message}</p>}</form>;
}
