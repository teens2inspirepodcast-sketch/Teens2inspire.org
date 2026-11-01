import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  let body: { name?: unknown; email?: unknown; subject?: unknown; message?: unknown; kind?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 }); }
  const name = typeof body.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 254) : "";
  const subject = typeof body.subject === "string" ? body.subject.trim().slice(0, 160) : "";
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 5000) : "";
  const kind = body.kind === "school" ? "school" : "contact";
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message || message.length < 10) return NextResponse.json({ error: "Enter your name, a valid email address, and a message of at least 10 characters." }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.from("inquiries").insert({ kind, name, email, subject, message });
  if (error) return NextResponse.json({ error: "Your message could not be saved. Please email Teens2Inspire directly." }, { status: 503 });
  return NextResponse.json({ success: true });
}
