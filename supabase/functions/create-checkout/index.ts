import Stripe from "https://esm.sh/stripe@18.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const allowedOrigins = new Set(["https://teens2inspire.org", "https://media.teens2inspire.org"]);

Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const authorization = request.headers.get("Authorization");
  if (!authorization) return Response.json({ error: "Sign in before starting membership." }, { status: 401 });
  const url = Deno.env.get("SUPABASE_URL")!;
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const db = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
  const { data: { user }, error: userError } = await db.auth.getUser();
  if (userError || !user) return Response.json({ error: "Please sign in again before starting membership." }, { status: 401 });
  if (!user.email_confirmed_at) return Response.json({ error: "Confirm your email before starting membership." }, { status: 403 });
  let body: { plan?: unknown };
  try { body = await request.json(); } catch { return Response.json({ error: "Choose a valid membership plan." }, { status: 400 }); }
  const plan = body.plan === "family" ? "family" : body.plan === "personal" || body.plan === undefined ? "personal" : null;
  if (!plan) return Response.json({ error: "Choose a valid membership plan." }, { status: 400 });
  const priceId = plan === "family" ? Deno.env.get("STRIPE_PRICE_ID_FAMILY") : Deno.env.get("STRIPE_PRICE_ID_PERSONAL");
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  if (!priceId || !stripeSecret) return Response.json({ error: "Membership checkout is not available yet." }, { status: 503 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2025-07-30.basil" });
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  try {
    const { data: profile, error: profileError } = await admin.from("profiles").select("first_name,display_name,stripe_customer_id").eq("id", user.id).maybeSingle();
    if (profileError) throw profileError;
    const { data: existing } = await admin.from("subscriptions").select("id,status,current_period_end").eq("user_id", user.id).in("status", ["active", "trialing", "past_due"]).limit(1).maybeSingle();
    if (existing && (!existing.current_period_end || Date.parse(existing.current_period_end) > Date.now())) return Response.json({ error: "You already have a subscription. Open membership settings to manage it." }, { status: 409 });
    let customerId = profile?.stripe_customer_id ?? null;
    if (!customerId) {
      const customer = await stripe.customers.create({ email: user.email, name: profile?.display_name || profile?.first_name || undefined, metadata: { supabase_user_id: user.id } }, { idempotencyKey: `teens2inspire-customer-${user.id}` });
      customerId = customer.id;
      const { error } = await admin.from("profiles").update({ stripe_customer_id: customerId }).eq("id", user.id);
      if (error) throw error;
    }
    const originHeader = request.headers.get("origin") || "https://teens2inspire.org";
    const origin = allowedOrigins.has(originHeader) ? originHeader : "https://teens2inspire.org";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription", customer: customerId, client_reference_id: user.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/download?checkout=complete&plan=${plan}`,
      cancel_url: `${origin}/download?checkout=cancelled&plan=${plan}`,
      metadata: { supabase_user_id: user.id, membership_plan: plan },
      subscription_data: { metadata: { supabase_user_id: user.id, membership_plan: plan } },
      allow_promotion_codes: true,
    });
    if (!session.url) throw new Error("No checkout URL returned");
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: "Membership checkout could not be started. Please try again." }, { status: 502 });
  }
});
