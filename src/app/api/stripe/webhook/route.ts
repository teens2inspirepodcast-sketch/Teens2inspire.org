import { NextResponse } from "next/server";

// Stripe webhooks are handled by the Supabase Edge Function, not by Vercel.
// Configure Stripe to send events to:
// https://mphswidvmesdkefkgwjz.supabase.co/functions/v1/stripe-webhook
export async function POST() {
  return NextResponse.json(
    { error: "Stripe webhooks are handled by the Supabase Edge Function." },
    { status: 410 }
  );
}
