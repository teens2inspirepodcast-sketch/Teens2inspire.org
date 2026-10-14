"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function selectedPlan(): "personal" | "family" | null {
  const value = new URLSearchParams(window.location.search).get("plan");
  return value === "personal" || value === "family" ? value : null;
}

export function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMsg("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const plan = selectedPlan();
    const membershipPath = plan ? `/membership?plan=${plan}&autoCheckout=1` : "/membership";

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const marketingOrigin =
          process.env.NEXT_PUBLIC_MARKETING_URL || "https://teens2inspire.org";
        const callback = new URL("/auth/callback", marketingOrigin);
        callback.searchParams.set("next", membershipPath);

        const ageConfirmed = form.get("age-13plus") === "on";
        if (!ageConfirmed) {
          throw new Error("Please confirm that you are at least 13 years old. If you are under 13, a parent or guardian must complete the required consent process before you can create an account.");
        }
        const termsAccepted = form.get("accept-terms") === "on";
        if (!termsAccepted) {
          throw new Error("Please accept the Terms of Service and Privacy Policy to create an account.");
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: callback.toString(),
            // These values satisfy the database's signup checks. The terms timestamp
            // is only sent after the user actively checks the required terms box.
            data: {
              age_group: "13plus",
              accepted_terms_at: new Date().toISOString(),
              membership_tier: plan || "personal",
            },
          },
        });

        if (error) throw error;

        // Some Supabase projects allow immediate sessions; others require email verification.
        if (data.session) {
          window.location.assign(membershipPath);
          return;
        }

        setMsg(
          `Your account was created. Check your email to verify it, then you'll return to membership options: Personal ($7.99/month) or Family ($9.99/month).`
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const rawNext = new URLSearchParams(window.location.search).get("next") || "/app";
        const next =
          rawNext.startsWith("/") && !rawNext.startsWith("//")
            ? rawNext
            : "/app";

        // Membership checkout belongs on the marketing domain. Member content belongs in the app.
        if (next.startsWith("/membership") || next.startsWith("/school")) {
          window.location.assign(new URL(next, window.location.origin).toString());
          return;
        }

        const configuredMediaOrigin = process.env.NEXT_PUBLIC_MEDIA_URL;
        const mediaOrigin =
          configuredMediaOrigin ||
          (window.location.hostname === "localhost"
            ? "http://localhost:3001"
            : "https://media.teens2inspire.org");
        const mediaPath = next === "/app" ? "/" : next;
        window.location.assign(new URL(mediaPath, mediaOrigin).toString());
      }
    } catch (error) {
      setMsg(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  const plan = typeof window !== "undefined" ? selectedPlan() : null;
  const signupHref = plan ? `/signup?plan=${plan}` : "/signup";
  const loginHref = plan ? `/login?next=${encodeURIComponent(`/membership?plan=${plan}`)}` : "/login";

  return (
    <form onSubmit={submit}>
      <label htmlFor="auth-email">Email address</label>
      <input id="auth-email" name="email" type="email" required autoComplete="email" />
      {mode === "signup" && (
        <>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 16, fontSize: 13, lineHeight: 1.5 }}>
            <input
              name="age-13plus"
              type="checkbox"
              required
              style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
            />
            <span>I confirm that I am at least 13 years old. If I am under 13, a parent or guardian must complete a verified consent process before an account can be created.</span>
          </label>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 12, fontSize: 13, lineHeight: 1.5 }}>
            <input
              name="accept-terms"
              type="checkbox"
              required
              style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }}
            />
            <span>I have read and agree to the Terms of Service and Privacy Policy.</span>
          </label>
        </>
      )}
      <label htmlFor="auth-password">Password (at least 8 characters)</label>
      <input
        id="auth-password"
        name="password"
        type="password"
        required
        minLength={8}
        autoComplete={mode === "signup" ? "new-password" : "current-password"}
      />
      {msg && <div className="notice" role="status">{msg}</div>}
      <button className="btn primary" style={{ width: "100%", marginTop: 20 }} disabled={busy}>
        {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
      </button>
      <p style={{ fontSize: 13 }}>
        {mode === "signup" ? "Already have an account? " : "Need an account? "}
        <Link href={mode === "signup" ? loginHref : signupHref}>
          {mode === "signup" ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}
