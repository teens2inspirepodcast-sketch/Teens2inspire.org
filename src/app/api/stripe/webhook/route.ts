import Stripe from "stripe";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase server credentials are missing.");
  return createSupabaseClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(request: Request) {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!stripeSecret || !webhookSecret || !signature) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 503 });
  }

  const stripe = new Stripe(stripeSecret);
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(await request.arrayBuffer()), signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature." }, { status: 400 });
  }

  try {
    const supabase = adminClient();
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabaseUserId || session.client_reference_id;
      if (userId) {
        const { error } = await supabase.from("profiles").update({
          stripe_customer_id: typeof session.customer === "string" ? session.customer : null,
          stripe_subscription_id: typeof session.subscription === "string" ? session.subscription : null,
          membership_tier: session.metadata?.membershipTier === "family" ? "family" : "personal",
        }).eq("id", userId);
        if (error) throw error;
      }
    }

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabaseUserId;
      if (userId) {
        const active = subscription.status === "active" || subscription.status === "trialing";
        const status = event.type === "customer.subscription.deleted" ? "canceled" : active ? "active" : subscription.status === "past_due" ? "past_due" : "pending_payment";
        const periodEnd = "current_period_end" in subscription ? (subscription as Stripe.Subscription & { current_period_end: number }).current_period_end : null;
        const { error } = await supabase.from("profiles").update({
          stripe_customer_id: typeof subscription.customer === "string" ? subscription.customer : null,
          stripe_subscription_id: subscription.id,
          membership_tier: subscription.metadata?.membershipTier === "family" ? "family" : "personal",
          membership_status: status,
          membership_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
          cancel_at_period_end: subscription.cancel_at_period_end,
        }).eq("id", userId);
        if (error) throw error;
      }
    }
    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Webhook processing failed." }, { status: 500 });
  }
}
