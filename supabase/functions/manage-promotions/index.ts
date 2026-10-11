import Stripe from "https://esm.sh/stripe@18.5.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
Deno.serve(async (request) => {
  if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const authorization = request.headers.get("Authorization");
  if (!authorization) return Response.json({ error: "Sign in to manage discounts." }, { status: 401 });
  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  if (!stripeSecret) return Response.json({ error: "Discount management is not configured yet." }, { status: 503 });
  const stripe = new Stripe(stripeSecret, { apiVersion: "2025-07-30.basil" });
  const url = Deno.env.get("SUPABASE_URL")!;
  const db = createClient(url, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authorization } } });
  const { data: { user } } = await db.auth.getUser();
  if (!user) return Response.json({ error: "Please sign in again." }, { status: 401 });
  const admin = createClient(url, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data: profile } = await admin.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (profile?.role !== "administrator") return Response.json({ error: "You do not have permission to manage discounts." }, { status: 403 });
  let body: { action?: string; name?: string; code?: string; percent_off?: number; max_redemptions?: number | null; id?: string };
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid discount request." }, { status: 400 }); }
  try {
    if (body.action === "list") {
      const response = await stripe.promotionCodes.list({ limit: 100, expand: ["data.promotion.coupon"] });
      const promotions = response.data.map((item) => {
        const promotion = item.promotion as unknown as { coupon?: string | Stripe.Coupon };
        const couponValue = promotion?.coupon;
        const coupon = typeof couponValue === "string" ? null : couponValue;
        return { id: item.id, code: item.code, active: item.active, max_redemptions: item.max_redemptions, times_redeemed: item.times_redeemed, expires_at: item.expires_at, name: coupon?.name || "Membership discount", percent_off: coupon?.percent_off ?? null, amount_off: coupon?.amount_off ?? null, currency: coupon?.currency ?? null };
      });
      return Response.json({ promotions });
    }
    if (body.action === "create") {
      const name = String(body.name ?? "").trim().slice(0, 100);
      const code = String(body.code ?? "").trim().toUpperCase();
      const percent = Number(body.percent_off);
      const maxRedemptions = body.max_redemptions == null ? undefined : Number(body.max_redemptions);
      if (name.length < 2 || !/^[A-Z0-9_-]{4,32}$/.test(code) || !Number.isInteger(percent) || percent < 1 || percent > 100 || (maxRedemptions !== undefined && (!Number.isInteger(maxRedemptions) || maxRedemptions < 1))) {
        return Response.json({ error: "Enter a name, a 4–32 character code, a 1–100% discount, and a valid optional redemption limit." }, { status: 400 });
      }
      const coupon = await stripe.coupons.create({ name, percent_off: percent, duration: "once" });
      const promotion = await stripe.promotionCodes.create({ promotion: { type: "coupon", coupon: coupon.id }, code, active: true, max_redemptions: maxRedemptions });
      return Response.json({ ok: true, promotion: { id: promotion.id, code: promotion.code, active: promotion.active, max_redemptions: promotion.max_redemptions, times_redeemed: promotion.times_redeemed, name, percent_off: percent } });
    }
    if (body.action === "deactivate") {
      if (typeof body.id !== "string" || !body.id.startsWith("promo_")) return Response.json({ error: "Choose a valid promotion code." }, { status: 400 });
      const promotion = await stripe.promotionCodes.update(body.id, { active: false });
      return Response.json({ ok: true, id: promotion.id, active: promotion.active });
    }
    return Response.json({ error: "Choose a valid discount action." }, { status: 400 });
  } catch {
    return Response.json({ error: "The discount could not be processed. Check that the code is unique and try again." }, { status: 502 });
  }
});
