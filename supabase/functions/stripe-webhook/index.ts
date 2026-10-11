import Stripe from "https://esm.sh/stripe@18.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const iso = (seconds: number | null | undefined) => seconds ? new Date(seconds * 1000).toISOString() : null;
Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const signature = request.headers.get("Stripe-Signature");
  const rawBody = await request.text();
  if (!signature) return new Response("Missing signature", { status: 400 });
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeSecret || !webhookSecret) return new Response("Webhook is not configured", { status: 503 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2025-07-30.basil" });
  const cryptoProvider = Stripe.createSubtleCryptoProvider();
  let event: Stripe.Event;
  try { event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret, cryptoProvider); }
  catch { return new Response("Invalid webhook signature", { status: 400 }); }
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: claimed, error: claimError } = await db.rpc("claim_stripe_event", { p_event_id: event.id, p_event_type: event.type, p_livemode: event.livemode });
  if (claimError) return new Response("Webhook could not be claimed", { status: 500 });
  if (claimed === false) return new Response("Already processed", { status: 200 });
  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.supabase_user_id;
      if (userId && session.subscription) {
        const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
        const priceId = subscription.items.data[0]?.price.id;
        const familyPrice = Deno.env.get("STRIPE_PRICE_ID_FAMILY");
        const tier = priceId && priceId === familyPrice ? "family" : "personal";
        const { error: profileUpdateError } = await db.from("profiles").update({ membership_tier: tier, membership_status: subscription.status === "active" || subscription.status === "trialing" ? "active" : subscription.status, stripe_customer_id: String(session.customer), stripe_subscription_id: subscription.id, membership_period_end: iso(subscription.current_period_end), cancel_at_period_end: subscription.cancel_at_period_end }).eq("id", userId);
        if (profileUpdateError) throw profileUpdateError;
        if (priceId) { const { error: subscriptionError } = await db.from("subscriptions").upsert({ user_id: userId, stripe_customer_id: String(session.customer), stripe_subscription_id: subscription.id, stripe_price_id: priceId, status: subscription.status, current_period_start: iso(subscription.current_period_start), current_period_end: iso(subscription.current_period_end), cancel_at_period_end: subscription.cancel_at_period_end }, { onConflict: "stripe_subscription_id" }); if (subscriptionError) throw subscriptionError; }
      }
    } else if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      const { data: row } = await db.from("subscriptions").select("user_id").eq("stripe_subscription_id", subscription.id).maybeSingle();
      const userId = subscription.metadata?.supabase_user_id || row?.user_id;
      const priceId = subscription.items.data[0]?.price.id;
      if (userId && priceId) {
        const { error: subscriptionError } = await db.from("subscriptions").upsert({ user_id: userId, stripe_customer_id: String(subscription.customer), stripe_subscription_id: subscription.id, stripe_price_id: priceId, status: subscription.status, current_period_start: iso(subscription.current_period_start), current_period_end: iso(subscription.current_period_end), cancel_at_period_end: subscription.cancel_at_period_end, canceled_at: iso(subscription.canceled_at) }, { onConflict: "stripe_subscription_id" });
        if (subscriptionError) throw subscriptionError;
        const { error: profileUpdateError } = await db.from("profiles").update({ membership_status: subscription.status === "active" || subscription.status === "trialing" ? "active" : subscription.status, membership_period_end: iso(subscription.current_period_end), cancel_at_period_end: subscription.cancel_at_period_end }).eq("id", userId);
        if (profileUpdateError) throw profileUpdateError;
      }
    } else if (event.type === "invoice.paid" || event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | Stripe.Subscription | null; parent?: { subscription_details?: { subscription?: string | Stripe.Subscription | null } } };
      const linkedSubscription = invoice.subscription ?? invoice.parent?.subscription_details?.subscription;
      const subscriptionId = typeof linkedSubscription === "string" ? linkedSubscription : linkedSubscription?.id;
      if (subscriptionId) {
        const status = event.type === "invoice.paid" ? "active" : "past_due";
        const { error: subscriptionError } = await db.from("subscriptions").update({ status }).eq("stripe_subscription_id", subscriptionId);
        if (subscriptionError) throw subscriptionError;
        const { data: row, error: lookupError } = await db.from("subscriptions").select("user_id").eq("stripe_subscription_id", subscriptionId).maybeSingle();
        if (lookupError) throw lookupError;
        if (row?.user_id) { const { error: profileUpdateError } = await db.from("profiles").update({ membership_status: status }).eq("id", row.user_id); if (profileUpdateError) throw profileUpdateError; }
      }
    }
    await db.rpc("finish_stripe_event", { p_event_id: event.id, p_success: true, p_error: null });
    return new Response("ok", { status: 200 });
  } catch {
    await db.rpc("finish_stripe_event", { p_event_id: event.id, p_success: false, p_error: "Stripe webhook processing failed" });
    return new Response("Webhook processing failed", { status: 500 });
  }
});
