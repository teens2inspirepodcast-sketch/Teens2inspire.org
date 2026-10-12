import { Page } from "@/components/site";
import { MembershipCheckout } from "@/components/membership-checkout";
import Link from "next/link";

export default function Membership() {
  return <Page title="A little more inspiration, all in one place.">
    <p className="lead">Choose the membership that fits your household. School access is available through participating schools.</p>
    <div className="grid membership-grid">
      <article className="card"><div className="eyebrow">PERSONAL</div><h2>$7.99 <small>/ month</small></h2><p>One profile for one listener or viewer.</p><MembershipCheckout plan="personal" label="Choose Personal" /></article>
      <article className="card featured-card"><div className="eyebrow">FAMILY</div><h2>$9.99 <small>/ month</small></h2><p>Up to three profiles for your family.</p><MembershipCheckout plan="family" label="Choose Family" /></article>
      <article className="card"><div className="eyebrow">SCHOOL ACCESS</div><h2>Free</h2><p>For students with a valid participating-school code.</p><Link className="btn secondary" href="/school">Learn about school access</Link></article>
    </div>
    <p className="notice">Paid checkout only works after Stripe live/test price IDs and a verified webhook are configured. School-code validation must be enabled before issuing free access.</p>
  </Page>;
}
