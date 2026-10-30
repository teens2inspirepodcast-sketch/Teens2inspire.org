import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Header } from "@/components/site-header";
import { getMarketingSettings } from "@/lib/marketing-settings";
import { Footer } from "@/components/site";

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const marketingSettings = await getMarketingSettings();
  const selectedPlan = params.plan === "family" ? "family" : params.plan === "personal" ? "personal" : params.plan === "school" ? "school" : null;

  return (
    <>
      <Header logoSrc={marketingSettings.brand_logo_url}/>
      <main className="auth-page">
        <div className="auth-orb" />
        <section className="auth-panel">
          <div className="eyebrow"><span className="eyebrow-dot" /> MAKE YOURSELF AT HOME</div>
          <h1>A little inspiration starts here.</h1>
          <p className="auth-intro">
            Your place for meaningful media, thoughtful conversations, and a little perspective.
          </p>

          <div className="signup-pricing">
            <div className="signup-pricing-heading">
              <span className="eyebrow">MEMBERSHIP OPTIONS</span>
              <p>Choose a plan to get started. Paid memberships continue through secure checkout.</p>
            </div>
            <div className="signup-pricing-grid">
              <Link
                className={`signup-plan ${selectedPlan === "personal" ? "selected" : ""}`}
                href="/signup?plan=personal"
                aria-current={selectedPlan === "personal" ? "page" : undefined}
              >
                <span>PERSONAL</span>
                <strong>$7.99 <small>/ month</small></strong>
                <em>One profile</em>
                <b>{selectedPlan === "personal" ? "Selected" : "Choose Personal"}</b>
              </Link>
              <Link
                className={`signup-plan ${selectedPlan === "family" ? "selected" : ""}`}
                href="/signup?plan=family"
                aria-current={selectedPlan === "family" ? "page" : undefined}
              >
                <span>FAMILY</span>
                <strong>$9.99 <small>/ month</small></strong>
                <em>Up to three profiles</em>
                <b>{selectedPlan === "family" ? "Selected" : "Choose Family"}</b>
              </Link>
              <Link
                className={`signup-plan ${selectedPlan === "school" ? "selected" : ""}`}
                href="/signup?plan=school"
                aria-current={selectedPlan === "school" ? "page" : undefined}
              >
                <span>SCHOOL</span>
                <strong>Free</strong>
                <em>Free access for students through participating schools</em>
                <b>{selectedPlan === "school" ? "Selected" : "Enter school code"}</b>
              </Link>
            </div>
            <p className="signup-school-note">School access is free for students with a valid code from a participating school. Schools can still <Link href="/school">apply for access</Link>.</p>
          </div>

          <div className="form auth-form"><AuthForm mode="signup" initialPlan={selectedPlan} /></div>
          <p className="auth-fineprint">
            Paid membership starts after payment confirmation. You may be asked to verify your email address.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
