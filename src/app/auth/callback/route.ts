import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function safeNext(rawNext: string | null): string {
  // Checkout happens before email verification, so a dropped `next` returns to membership.
  const fallback = "/membership";
  if (!rawNext || !rawNext.startsWith("/") || rawNext.startsWith("//")) return fallback;

  try {
    const parsed = new URL(rawNext, "https://teens2inspire.org");
    if (parsed.origin !== "https://teens2inspire.org") return fallback;
    // The marketing site does not host the media app's /app route.
    if (parsed.pathname === "/app" || parsed.pathname === "/") return fallback;
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const next = safeNext(url.searchParams.get("next"));
  const supabase = await createClient();

  // Support both Supabase PKCE confirmation links and token-hash email links.
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return verificationError(url.origin, next);
  } else if (tokenHash && (type === "signup" || type === "email")) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "email",
    });
    if (error) return verificationError(url.origin, next);
  } else {
    return verificationError(url.origin, next);
  }

  // Return to the saved destination after email verification; checkout has already been started.
  return NextResponse.redirect(new URL(next, url.origin));
}

function verificationError(origin: string, next: string) {
  const failed = new URL("/login", origin);
  failed.searchParams.set("error", "verification");
  failed.searchParams.set("next", next);
  return NextResponse.redirect(failed);
}
