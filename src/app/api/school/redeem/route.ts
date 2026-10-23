import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Create an account or sign in before redeeming a school code." }, { status: 401 });
  let body: { code?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Enter a valid school code." }, { status: 400 }); }
  const code = typeof body.code === "string" ? body.code.trim().toUpperCase().replace(/\s+/g, "") : "";
  if (!/^[A-Z0-9-]{6,48}$/.test(code)) return NextResponse.json({ error: "Enter a valid school code." }, { status: 400 });
  const codeHash = createHash("sha256").update(code).digest("hex");
  const { data, error } = await supabase.rpc("redeem_school_code", { p_code_hash: codeHash, p_user_id: user.id });
  if (error) return NextResponse.json({ error: "School-code redemption is not configured. Please contact support." }, { status: 503 });
  if (!data?.ok) return NextResponse.json({ error: data?.message || "That code is invalid, expired, or has reached its use limit." }, { status: 400 });
  return NextResponse.json({ success: true, schoolName: data.school_name || "your school" });
}
