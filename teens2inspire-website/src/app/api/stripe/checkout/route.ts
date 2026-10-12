import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: { plan?: unknown };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid checkout request." }, { status: 400 });
  }

  if (payload.plan !== "personal" && payload.plan !== "family") {
    return NextResponse.json({ error: "Choose a valid membership plan." }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Please sign in before starting membership." },
        { status: 401 }
      );
    }

    // Stripe credentials stay in Supabase Edge Function secrets, never in Vercel.
    const { data, error } = await supabase.functions.invoke("stripe-checkout", {
      body: { plan: payload.plan },
    });

    if (error) {
      const context = (error as { context?: unknown }).context;
      if (context instanceof Response) {
        const detail = await context.json().catch(() => ({})) as { error?: string };
        return NextResponse.json(
          { error: detail.error || "Secure checkout is not configured yet." },
          { status: context.status }
        );
      }
      console.error("Supabase stripe-checkout invocation failed", error.message);
      return NextResponse.json(
        { error: "We couldn't connect to secure checkout. Please try again." },
        { status: 502 }
      );
    }

    if (data?.error) {
      return NextResponse.json({ error: data.error }, { status: 502 });
    }
    if (typeof data?.url !== "string" || !data.url.startsWith("https://checkout.stripe.com/")) {
      return NextResponse.json({ error: "Stripe did not return a valid checkout link." }, { status: 502 });
    }

    return NextResponse.json({ url: data.url }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Membership checkout route failed", error);
    return NextResponse.json(
      { error: "We couldn't start checkout. Please try again." },
      { status: 500 }
    );
  }
}
