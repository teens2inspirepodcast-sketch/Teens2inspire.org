import Stripe from "https://esm.sh/stripe@18.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const authorization = request.headers.get("Authorization");
  if (!authorization) return Response.json({ error: "Sign in to manage billing." }, { status: 401 });
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecret) return Response.json({ error: "Billing management is not configured yet." }, { status: 503 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2025-07-30.basil" });
  const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authorization } } });
  const { data: { user } } = await db.auth.getUser();
  if (!user) return Response.json({ error: "Please sign in again to manage billing." }, { status: 401 });
  const { data: profile } = await db.from("profiles").select("stripe_customer_id").eq("id", user.id).maybeSingle();
  if (!profile?.stripe_customer_id) return Response.json({ error: "There is no billing account to manage yet." }, { status: 409 });
  const originHeader = request.headers.get("origin") || "https://teens2inspire.org";
  const origin = new Set(["https://teens2inspire.org", "https://media.teens2inspire.org"]).has(originHeader) ? originHeader : "https://teens2inspire.org";
  try {
    const session = await stripe.billingPortal.sessions.create({ customer: profile.stripe_customer_id, return_url: `${origin}/account` });
    return Response.json({ url: session.url });
  } catch {
    return Response.json({ error: "Billing could not be opened. Please try again." }, { status: 502 });
  }
});
