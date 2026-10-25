import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MEDIA_ORIGIN = process.env.NEXT_PUBLIC_MEDIA_URL || "https://media.teens2inspire.org";

function safeNext(rawNext: string | null): string {
  const fallback = "/membership";
  if (!rawNext || !rawNext.startsWith("/") || rawNext.startsWith("//")) return fallback;
  try {
    const parsed = new URL(rawNext, "https://teens2inspire.org");
    if (parsed.origin !== "https://teens2inspire.org") return fallback;
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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return verificationError(url.origin, next);
  } else if (tokenHash && (type === "signup" || type === "email")) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: type as "signup" | "email" });
    if (error) return verificationError(url.origin, next);
  } else {
    return verificationError(url.origin, next);
  }

  // School signup carries its code through email confirmation. Redeem it after
  // the verified session exists, then send the student directly to the media app.
  const destination = new URL(next, url.origin);
  const schoolCode = destination.pathname === "/school" ? destination.searchParams.get("redeemCode") : null;
  if (schoolCode) {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) return schoolAccessError(url.origin, "Please sign in to finish activating school access.");
    const normalizedCode = schoolCode.trim().toUpperCase().replace(/\s+/g, "");
    if (!/^[A-Z0-9-]{6,48}$/.test(normalizedCode)) return schoolAccessError(url.origin, "The school access code is invalid. Please contact your school.");
    const codeHash = createHash("sha256").update(normalizedCode).digest("hex");
    const { data, error } = await supabase.rpc("redeem_school_code", { p_code_hash: codeHash, p_user_id: user.id });
    if (error || !data?.ok) {
      return schoolAccessError(url.origin, data?.message || "We couldn't activate school access. Please sign in again or contact your school.");
    }
    // Supabase's browser session is scoped to the marketing origin. Send the
    // student to media login to establish a session on the app's own origin.
    const mediaLogin = new URL("/login", MEDIA_ORIGIN);
    mediaLogin.searchParams.set("schoolAccess", "activated");
    return NextResponse.redirect(mediaLogin);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}

function verificationError(origin: string, next: string) {
  const failed = new URL("/login", origin);
  failed.searchParams.set("error", "verification");
  failed.searchParams.set("next", next);
  return NextResponse.redirect(failed);
}

function schoolAccessError(origin: string, message: string) {
  const failed = new URL("/login", origin);
  failed.searchParams.set("error", "school_access");
  failed.searchParams.set("message", message.slice(0, 180));
  return NextResponse.redirect(failed);
}
