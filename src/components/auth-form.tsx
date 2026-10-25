"use client";

import { redeemSchoolCode } from "@/lib/school-code";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function selectedPlan(): "personal" | "family" | "school" | null {
  const value = new URLSearchParams(window.location.search).get("plan");
  return value === "personal" || value === "family" || value === "school" ? value : null;
}

export function AuthForm({ mode, initialPlan = null }: { mode: "signup" | "login"; initialPlan?: "personal" | "family" | "school" | null }) {
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setMsg("");

    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") || "").trim().toLowerCase();
    const password = String(form.get("password") || "");
    const plan = initialPlan || selectedPlan();
    const schoolCode = String(new FormData(e.currentTarget).get("school-code") || "").trim();
    const discountCode = String(new FormData(e.currentTarget).get("discount-code") || "").trim();
    const membershipPath = plan ? `/membership?plan=${plan}` : "/membership";
    if (mode === "signup" && plan === "school" && !schoolCode) {
      setMsg("Enter the school access code provided by your school.");
      setBusy(false);
      return;
    }

    try {
      const supabase = createClient();

      if (mode === "signup") {
        const marketingOrigin =
          process.env.NEXT_PUBLIC_MARKETING_URL || "https://teens2inspire.org";
        const callback = new URL("/auth/callback", marketingOrigin);
        callback.searchParams.set("next", plan === "school" && schoolCode ? `/school?redeemCode=${encodeURIComponent(schoolCode)}` : membershipPath);

        const ageConfirmed = form.get("age-13plus") === "on";
        if (!ageConfirmed) {
          throw new Error("You must be at least 13 years old to create a Teens2Inspire account.");
        }
        const termsAccepted = form.get("accept-terms") === "on";
        if (!termsAccepted) {
          throw new Error("Please accept the Terms of Service and Privacy Policy to create an account.");
        }

        // Validate School access with Supabase before creating the account or sending an email.
        // The public preflight checks the hash, school status, expiry, usage limit, and rate limit.
        if (plan === "school") {
          const validation = await supabase.functions.invoke("school-code-validation", { body: { code: schoolCode } });
          if (validation.error || validation.data?.valid !== true) {
            throw new Error("That school access code is invalid, expired, or has reached its use limit. Ask your school for the correct code.");
          }
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
        if (!data.user?.id) {
          throw new Error("We couldn't create a new account with that email. If you already signed up, please sign in instead. If this is a new account, check your email for a confirmation link and try signing in after confirming.");
        }

        if (plan === "school") {
          if (!schoolCode) throw new Error("Enter the school access code provided by your school.");
          if (data.session) {
            await redeemSchoolCode(schoolCode);
            window.location.assign(new URL("/login?schoolAccess=activated", process.env.NEXT_PUBLIC_MEDIA_URL || "https://media.teens2inspire.org").toString());
            return;
          }
          setMsg("Your account is created. Confirm your email to finish setting up school access; your school code will be applied when you return from the confirmation link.");
          return;
        }

        const checkoutResponse = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ plan: plan || "personal", email, userId: data.user.id, accessToken: data.session?.access_token, discountCode }),
        });
        const checkout = await checkoutResponse.json().catch(() => ({}));
        if (!checkoutResponse.ok) throw new Error(checkout.error || "Your account was created, but checkout could not be opened. Sign in and try again.");
        if (typeof checkout.url !== "string" || !checkout.url.startsWith("https://checkout.stripe.com/")) throw new Error("Stripe did not return a valid secure checkout link.");
        window.location.assign(checkout.url);
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const rawNext = new URLSearchParams(window.location.search).get("next") || "/app";
        const next =
          rawNext.startsWith("/") && !rawNext.startsWith("//")
            ? rawNext
            : "/app";

        // Paid membership checkout belongs on the marketing domain. School pages are
        // marketing/application pages; a signed-in school member should enter the media app.
        if (next.startsWith("/membership")) {
          window.location.assign(new URL(next, window.location.origin).toString());
          return;
        }

        const configuredMediaOrigin = process.env.NEXT_PUBLIC_MEDIA_URL;
        const mediaOrigin =
          configuredMediaOrigin ||
          (window.location.hostname === "localhost"
            ? "http://localhost:3001"
            : "https://media.teens2inspire.org");
        const mediaPath = next === "/app" || next.startsWith("/school") ? "/" : next;
        window.location.assign(new URL(mediaPath, mediaOrigin).toString());
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed.";
      if (/over_email_send_rate_limit|security purposes|only request this after/i.test(message)) {
        setMsg("Supabase is temporarily limiting confirmation emails. Wait for the cooldown shown in the message before trying again; do not repeatedly submit the form.");
      } else {
        setMsg(message);
      }
    } finally {
      setBusy(false);
    }
  }

  const plan = initialPlan || (typeof window !== "undefined" ? selectedPlan() : null);
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
            <span>I confirm that I am at least 13 years old.</span>
          </label>
          <label style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 12, fontSize: 13, lineHeight: 1.5 }}>
            <input name="accept-terms" type="checkbox" required style={{ width: 16, height: 16, marginTop: 2, flexShrink: 0 }} />
            <span>I have read and agree to the Terms of Service and Privacy Policy.</span>
          </label>
          <div className="auth-policy-links" aria-label="Read our policies">
            <Link href="/terms" target="_blank" rel="noreferrer">Read Terms of Service ↗</Link>
            <Link href="/privacy" target="_blank" rel="noreferrer">Read Privacy Policy ↗</Link>
          </div>
        </>
      )}
      {mode === "signup" && plan === "school" && (
        <>
          <label htmlFor="school-code" style={{ marginTop: 18 }}>School access code</label>
          <input id="school-code" name="school-code" type="text" required autoCapitalize="characters" placeholder="Enter the code from your school" />
          <p style={{ fontSize: 12, marginTop: 6 }}>Free access is available through participating schools.</p>
        </>
      )}
      {mode === "signup" && plan !== "school" && (
        <>
          <label htmlFor="discount-code" style={{ marginTop: 18 }}>Discount code (optional)</label>
          <input id="discount-code" name="discount-code" type="text" autoCapitalize="characters" placeholder="Enter a promo code" />
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
        {busy ? "Please wait…" : mode === "signup" ? (plan === "school" ? "Create free school account" : "Continue to secure checkout") : "Sign in"}
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
