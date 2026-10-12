"use client";
import { useState } from "react";
export function ContactForm({ kind = "contact" }: { kind?: "contact" | "school" }) {
  const [busy,setBusy]=useState(false); const [message,setMessage]=useState(""); const [done,setDone]=useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setMessage(""); setDone(false);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ kind, name: form.get("name"), email: form.get("email"), subject: form.get("subject"), message: form.get("message") }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Your message could not be sent.");
      setDone(true); setMessage("Your message has been received. Thank you for reaching out."); formElement.reset();
    } catch(error) { setMessage(error instanceof Error ? error.message : "Your message could not be sent."); }
    finally { setBusy(false); }
  }
  return <form className="form contact-form" onSubmit={submit}><label>Name<input name="name" required maxLength={120}/></label><label>Email<input name="email" type="email" required maxLength={254}/></label><label>Subject<input name="subject" maxLength={160}/></label><label>Message<textarea name="message" rows={5} minLength={10} maxLength={5000} required/></label>{message&&<p className="notice" role="status">{message}</p>}<button className="btn primary" disabled={busy}>{busy?"Sending…":done?"Send another message":"Send message"}</button></form>;
}
