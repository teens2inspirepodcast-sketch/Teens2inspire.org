"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** Request another signup email without exposing whether an address exists. */
export function VerificationEmailResend() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [isError, setIsError] = useState(false);

  async function resend(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending) return;
    setSending(true);
    setNotice("");
    setIsError(false);
    try {
      const callback = new URL("/auth/callback", process.env.NEXT_PUBLIC_MARKETING_URL || window.location.origin);
      callback.searchParams.set("next", "/email-verified");
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: callback.toString() },
      });
      if (error) {
        // Keep account existence private. Rate limits can be explained safely.
        if (/rate limit|too many|security purposes|only request/i.test(error.message)) {
          setIsError(true);
          setNotice("Please wait a little while before requesting another email.");
          return;
        }
        throw error;
      }
      setNotice("If this email has an account awaiting verification, a new link will be sent. Please check your inbox and spam folder.");
    } catch {
      setIsError(true);
      setNotice("We couldn't request another email right now. Please try again later or contact support.");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="verification-resend" onSubmit={resend}>
      <label htmlFor="verification-email">Didn't receive the email?</label>
      <p>Check your spam or promotions folder. You can also request another verification link.</p>
      <div className="verification-resend-row">
        <input
          id="verification-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your signup email address"
          aria-describedby={notice ? "verification-resend-notice" : undefined}
        />
        <button type="submit" disabled={sending} className="verification-resend-button">
          {sending ? "Sending…" : "Resend email"}
        </button>
      </div>
      {notice && (
        <p id="verification-resend-notice" className={isError ? "verification-notice-error" : "verification-notice-ok"} role="status">
          {notice}
        </p>
      )}
    </form>
  );
}
