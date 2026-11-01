import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Mail, ShieldCheck } from "lucide-react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site";
import { getMarketingSettings } from "@/lib/marketing-settings";
import { VerificationEmailResend } from "@/components/verification-email-resend";

export const metadata: Metadata = {
  title: "Check your email",
  description: "Confirm your email address to finish setting up your Teens2Inspire account.",
};

export default async function CheckEmail({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; error?: string }>;
}) {
  const [settings, params] = await Promise.all([getMarketingSettings(), searchParams]);
  const returnedFromCheckout = params.from === "checkout";
  const expiredLink = params.error === "verification";
  const mediaLogin = `${process.env.NEXT_PUBLIC_MEDIA_URL || "https://media.teens2inspire.org"}/login`;

  return (
    <>
      <Header logoSrc={settings.brand_logo_url} />
      <main className="auth-page verification-page">
        <section className="auth-panel verification-panel" aria-labelledby="verification-title">
          <div className="verification-icon" aria-hidden="true"><Mail size={30} strokeWidth={1.7} /></div>
          <span className="verification-eyebrow">ONE LAST STEP</span>
          <h1 id="verification-title">Check your email.</h1>
          <p className="verification-lead">
            {returnedFromCheckout
              ? "You've returned from secure checkout. Before you can sign in, please verify the email address you used to create your account."
              : "We sent a verification link to the email address you used to sign up. Open it to confirm your account."}
          </p>
          {expiredLink && (
            <div className="verification-alert" role="alert">
              That verification link may have expired or already been used. You can request a new one below.
            </div>
          )}
          <ol className="verification-steps">
            <li><span className="verification-step-icon"><Mail size={18} /></span><div><strong>Open your inbox</strong><p>Look for the Teens2Inspire verification email. Check spam if needed.</p></div></li>
            <li><span className="verification-step-icon"><Check size={19} /></span><div><strong>Verify your email</strong><p>Tap the confirmation link in the message.</p></div></li>
            <li><span className="verification-step-icon"><ArrowRight size={18} /></span><div><strong>Sign in to Teens2Inspire</strong><p>Use the email and password you just created. You do not need to sign up again.</p></div></li>
          </ol>
          <div className="verification-important"><ShieldCheck size={19} aria-hidden="true"/><p>Membership access starts when payment is confirmed and your account is verified. Your payment and email confirmation are separate steps.</p></div>
          <VerificationEmailResend />
          <div className="verification-bottom-links">
            <span>Already verified your email?</span>
            <a href={mediaLogin} className="verification-primary-link">Go to sign in <ArrowRight size={17} /></a>
            <Link href="/contact" className="verification-help-link">Need help? Contact us</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
