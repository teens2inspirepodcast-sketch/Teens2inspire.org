import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: "Membership checkout is not configured yet." }, { status: 503 });

  let body: { plan?: unknown };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (body.plan !== "personal" && body.plan !== "family") {
    return NextResponse.json({ error: "Choose a valid membership plan." }, { status: 400 });
  }

  const priceId = body.plan === "personal" ? process.env.STRIPE_PERSONAL_PRICE_ID : process.env.STRIPE_FAMILY_PRICE_ID;
  if (!priceId) return NextResponse.json({ error: "This membership plan is not configured yet." }, { status: 503 });

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) return NextResponse.json({ error: "Please sign in before starting membership." }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("stripe_customer_id,stripe_subscription_id,email,membership_status,membership_tier").eq("id", user.id).maybeSingle();
  if (profile?.stripe_subscription_id && ["active", "past_due", "pending_payment"].includes(profile.membership_status || "")) {
    return NextResponse.json({ error: "Your account already has a membership subscription. Contact support if you need help changing it." }, { status: 409 });
  }

  const stripe = new Stripe(secret);
  const origin = process.env.NEXT_PUBLIC_MEDIA_URL || "https://media.teens2inspire.org";
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      ...(profile?.stripe_customer_id ? { customer: profile.stripe_customer_id } : { customer_email: user.email || profile?.email || undefined }),
      client_reference_id: user.id,
      metadata: { supabaseUserId: user.id, membershipTier: body.plan },
      subscription_data: { metadata: { supabaseUserId: user.id, membershipTier: body.plan } },
      allow_promotion_codes: true,
      success_url: `${origin}/app/profile?membership=success`,
      cancel_url: `${origin}/app/profile?membership=cancelled`,
    });
    if (!session.url) return NextResponse.json({ error: "Stripe did not return a checkout URL." }, { status: 502 });
    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Unable to start checkout. Please try again later." }, { status: 502 });
  }
}
