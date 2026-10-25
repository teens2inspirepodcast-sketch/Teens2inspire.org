import { createClient } from "@/lib/supabase/client";

export async function redeemSchoolCode(rawCode: string): Promise<string> {
  const code = rawCode.trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z0-9-]{6,48}$/.test(code)) {
    throw new Error("Enter a valid school access code.");
  }

  const supabase = createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Sign in before redeeming a school code.");

  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(code));
  const codeHash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  const { data, error } = await supabase.rpc("redeem_school_code", { p_code_hash: codeHash, p_user_id: user.id });
  if (error) {
    console.error("School-code redemption failed", error.code);
    throw new Error("School-code redemption is temporarily unavailable. Please try again or contact your school.");
  }
  if (!data?.ok) throw new Error(data?.message || "That code is invalid, expired, or has reached its use limit.");
  return typeof data.school_name === "string" && data.school_name ? data.school_name : "your school";
}
