import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site";

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string }>;
}) {
  const params = await searchParams;
  const selectedPlan = params.plan === "family" ? "family" : params.plan === "personal" ? "personal" : null;

  return (
    <>
      <Header />
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
              <p>Choose now or decide after you verify your email.</p>
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
            </div>
            <p className="signup-school-note">
              Need school access? <Link href="/school">Use your school code</Link>.
            </p>
          </div>

          <div className="form auth-form"><AuthForm mode="signup" /></div>
          <p className="auth-fineprint">
            You will not be charged unless you choose a paid plan and complete Stripe checkout.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
