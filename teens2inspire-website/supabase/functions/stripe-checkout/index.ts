import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.0";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY") ?? "";
const PERSONAL_PRICE = "price_1USQZaKODAXtSQtWzu17zI5c";
const FAMILY_PRICE = "price_1USQZeKODAXtSQtWc72UR4jL";
const SITE_ORIGIN = "https://teens2inspire.org";
const ALLOWED_ORIGINS = new Set([SITE_ORIGIN, "https://www.teens2inspire.org", "http://localhost:3000"]);
const corsHeaders = (origin: string | null) => ({ "Access-Control-Allow-Origin": origin && ALLOWED_ORIGINS.has(origin) ? origin : SITE_ORIGIN, "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type", "Access-Control-Allow-Methods": "POST, OPTIONS", "Vary": "Origin" });
function json(body: Record<string, unknown>, status = 200, origin: string | null = null) { return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(origin), "Content-Type": "application/json", "Cache-Control": "no-store" } }); }
Deno.serve(async (req: Request) => {
 const origin = req.headers.get("origin");
 if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders(origin) });
 if (req.method !== "POST") return json({ error: "Method not allowed." }, 405, origin);
 if (origin && !ALLOWED_ORIGINS.has(origin)) return json({ error: "Origin not allowed." }, 403, origin);
 if (!SUPABASE_URL || !ANON_KEY || !SERVICE_ROLE_KEY || !STRIPE_SECRET_KEY) return json({ error: "Checkout is not fully configured yet. Please try again later." }, 503, origin);
 let payload: { plan?: unknown; email?: unknown; userId?: unknown; discountCode?: unknown };
 try { payload = await req.json(); } catch { return json({ error: "Invalid request." }, 400, origin); }
 if (payload.plan !== "personal" && payload.plan !== "family") return json({ error: "Choose a valid membership plan." }, 400, origin);
 const authHeader = req.headers.get("Authorization") ?? ""; const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
 const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, { auth: { persistSession: false, autoRefreshToken: false } });
 let user: { id: string; email?: string; email_confirmed_at?: string | null } | null = null;
 if (token && token !== ANON_KEY) {
   const authClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } });
   const { data } = await authClient.auth.getUser(token); user = data.user as typeof user;
 }
 if (!user) {
   if (typeof payload.userId !== "string" || typeof payload.email !== "string") return json({ error: "Please create your account first." }, 401, origin);
   const { data, error } = await admin.auth.admin.getUserById(payload.userId);
   if (error || !data.user || data.user.email?.toLowerCase() !== payload.email.trim().toLowerCase()) return json({ error: "We couldn't verify the signup details. Please try signing in again." }, 401, origin);
   if (data.user.email_confirmed_at) return json({ error: "This email is already verified. Please sign in to continue to checkout." }, 409, origin);
   user = data.user as typeof user;
 }
 if (!user?.id || !user.email) return json({ error: "Your account email is missing. Please sign in again." }, 401, origin);
 const adminProfile = await admin.from("profiles").select("stripe_customer_id,stripe_subscription_id,membership_status").eq("id", user.id).maybeSingle();
 if (adminProfile.error) return json({ error: "We couldn't verify your membership. Please try again." }, 500, origin);
 const profile = adminProfile.data;
 if (profile?.stripe_subscription_id && ["active", "past_due", "pending_payment"].includes(profile.membership_status ?? "")) return json({ error: "This account already has a membership. Sign in to manage it." }, 409, origin);
 const stripe = new Stripe(STRIPE_SECRET_KEY); const priceId = payload.plan === "personal" ? PERSONAL_PRICE : FAMILY_PRICE; const tier = payload.plan;
 const sessionMetadata = { supabase_user_id: user.id, membership_tier: tier };
 const rawCode = typeof payload.discountCode === "string" ? payload.discountCode.trim() : "";
 try {
   let promo: string | undefined;
   if (rawCode) {
     const matches = await stripe.promotionCodes.list({ code: rawCode, active: true, limit: 1 });
     promo = matches.data[0]?.id;
     if (!promo) return json({ error: "That discount code is invalid or expired. Check the code and try again." }, 400, origin);
   }
   const session = await stripe.checkout.sessions.create({ mode: "subscription", line_items: [{ price: priceId, quantity: 1 }], ...(profile?.stripe_customer_id ? { customer: profile.stripe_customer_id } : { customer_email: user.email }), client_reference_id: user.id, metadata: sessionMetadata, subscription_data: { metadata: sessionMetadata }, ...(promo ? { discounts: [{ promotion_code: promo }] } : { allow_promotion_codes: true }), success_url: `${SITE_ORIGIN}/membership?checkout=success`, cancel_url: `${SITE_ORIGIN}/membership?checkout=cancelled` });
   if (!session.url) return json({ error: "Stripe did not return a checkout link." }, 502, origin);
   return json({ url: session.url }, 200, origin);
 } catch (error) { console.error("stripe-checkout failed", error instanceof Error ? error.message : "unknown error"); return json({ error: "We couldn't open secure checkout. Please try again shortly." }, 502, origin); }
});
