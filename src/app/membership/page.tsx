import { Page } from "@/components/site";
import { MembershipCheckout } from "@/components/membership-checkout";
import Link from "next/link";

export default async function Membership({
  searchParams,
}: {
  searchParams: Promise<{ checkout?: string; plan?: string; autoCheckout?: string }>
}) {
  const params = await searchParams;

  return (
    <Page title="A little more inspiration, all in one place.">
      {params.checkout === "success" && (
        <p className="notice" role="status">
          Checkout completed. Your membership will activate after Stripe confirms the payment.
          If access does not update shortly, please contact support.
        </p>
      )}
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
        Payment is processed by Stripe. A paid membership activates only after the Supabase webhook verifies the subscription.
      </p>
    </Page>
  );
}
