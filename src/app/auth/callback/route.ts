import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
function safeNext(value: string | null) { if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/v2")) return "/download"; return value; }
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = safeNext(request.nextUrl.searchParams.get("next"));
  if (code) {
    const supabase = await createServerSupabase();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      const schoolCodeHash = typeof user?.user_metadata?.school_code_hash === "string" ? user.user_metadata.school_code_hash : "";
      if (user?.user_metadata?.account_type === "school" && schoolCodeHash) {
        const { data: redeemed, error: redeemError } = await supabase.rpc("redeem_school_code", { p_code_hash: schoolCodeHash });
        if (redeemError || !redeemed) return NextResponse.redirect(new URL("/school?access=needs-help", request.url));
      }
      return NextResponse.redirect(new URL(next, request.url));
    }
  }
  return NextResponse.redirect(new URL("/login?message=link-expired", request.url));
}
