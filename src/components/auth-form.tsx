"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const [busy, setBusy] = useState(false); const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setBusy(true); setMsg("");
    const f = new FormData(e.currentTarget); const email = String(f.get("email") || "").trim().toLowerCase(); const password = String(f.get("password") || "");
    try {
      const supabase = createClient();
      if (mode === "signup") {
        const mediaOrigin = process.env.NEXT_PUBLIC_MEDIA_URL || "https://media.teens2inspire.org";
        const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${mediaOrigin}/auth/callback?next=/app` } });
        if (error) throw error;
        setMsg("Check your email for a verification link. After verifying, you can open the media app.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) throw error;
        const rawNext = new URLSearchParams(location.search).get("next") || "/app";
        const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/app";
        const configuredMediaOrigin = process.env.NEXT_PUBLIC_MEDIA_URL;
        const mediaOrigin = configuredMediaOrigin || (location.hostname === "localhost" ? "http://localhost:3001" : "https://media.teens2inspire.org");
        if (location.origin === new URL(mediaOrigin).origin) location.assign(next);
        else {
          const mediaPath = next === "/app" ? "/" : next;
          location.assign(new URL(mediaPath, mediaOrigin).toString());
        }
      }
    } catch (error) { setMsg(error instanceof Error ? error.message : "Authentication failed."); }
    finally { setBusy(false); }
  }
  return <form onSubmit={submit}><label htmlFor="auth-email">Email address</label><input id="auth-email" name="email" type="email" required autoComplete="email"/><label htmlFor="auth-password">Password (at least 8 characters)</label><input id="auth-password" name="password" type="password" required minLength={8} autoComplete={mode === "signup" ? "new-password" : "current-password"}/>{msg && <div className="notice" role="status">{msg}</div>}<button className="btn primary" style={{ width: "100%", marginTop: 20 }} disabled={busy}>{busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}</button><p style={{ fontSize: 13 }}>{mode === "signup" ? "Already have an account? " : "Need an account? "}<Link href={mode === "signup" ? "/login" : "/signup"}>{mode === "signup" ? "Sign in" : "Sign up"}</Link></p></form>;
}
