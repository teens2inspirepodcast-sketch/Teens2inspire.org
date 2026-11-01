import { Page } from "@/components/site";
import { MembershipCheckout } from "@/components/membership-checkout";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Membership({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; plan?: string; autoCheckout?: string }>;
}) {
  const params = await searchParams;

  // The existing Stripe Edge Function returns to this URL after checkout.
  // An unconfirmed signup cannot sign in yet, so explain verification first.
  // Keep the Edge Function, prices, webhooks, and Stripe session creation unchanged.
  if (params.checkout === "success") {
    // Existing, already-verified members can proceed directly to sign-in.
    // Newly created accounts normally have no authenticated session until
    // they follow their verification email, so they see the check-email page.
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email_confirmed_at) redirect("/email-verified?from=checkout");
    redirect("/check-email?from=checkout");
  }

  return (
    <Page title="A little more inspiration, all in one place.">
      {params.checkout === "cancelled" && (
        <p className="notice" role="status">
          Checkout was cancelled. You have not completed a membership purchase.
        </p>
      )}
      <p className="lead">
        Choose the membership that fits your household. School access is available through participating schools.
      </p>
      <div className="grid membership-grid">
        <article className={`card ${params.plan === "personal" ? "featured-card" : ""}`}>
          <div className="eyebrow">PERSONAL</div>
          <h2>$7.99 <small>/ month</small></h2>
          <p>One profile for one listener or viewer.</p>
          <MembershipCheckout plan="personal" label="Choose Personal" autoStart={params.autoCheckout === "1" && params.plan === "personal"} />
        </article>
        <article className={`card ${params.plan === "family" ? "featured-card" : ""}`}>
          <div className="eyebrow">FAMILY</div>
          <h2>$9.99 <small>/ month</small></h2>
          <p>Up to three profiles for your family.</p>
          <MembershipCheckout plan="family" label="Choose Family" autoStart={params.autoCheckout === "1" && params.plan === "family"} />
        </article>
        <article className="card">
          <div className="eyebrow">SCHOOL ACCESS</div>
          <h2>Free</h2>
          <p>For students with a valid participating-school code.</p>
          <Link className="btn secondary" href="/school">Learn about school access</Link>
        </article>
      </div>
      <p className="notice">
        Payments are processed securely. Paid access begins after successful payment confirmation.
        New members must also verify their email before signing in.
      </p>
    </Page>
  );
}
