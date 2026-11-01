import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/site-header";
import { Footer } from "@/components/site";
import { getMarketingSettings } from "@/lib/marketing-settings";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Email confirmation",
  description: "Continue to your Teens2Inspire account after confirming your email.",
};

export default async function EmailVerified() {
  const [settings, supabase] = await Promise.all([getMarketingSettings(), createClient()]);
  const { data: { user } } = await supabase.auth.getUser();
  const isVerified = Boolean(user?.email_confirmed_at);
  const mediaLogin = `${process.env.NEXT_PUBLIC_MEDIA_URL || "https://media.teens2inspire.org"}/login`;

  return (
    <>
      <Header logoSrc={settings.brand_logo_url} />
      <main className="auth-page verification-page">
        <section className="auth-panel verification-panel" aria-labelledby="verified-title">
          <div className="verification-icon verification-icon-success" aria-hidden="true"><CheckCircle2 size={34} strokeWidth={1.6}/></div>
          <span className="verification-eyebrow">WELCOME TO TEENS2INSPIRE</span>
          <h1 id="verified-title">{isVerified ? "Email verified!" : "Ready to sign in?"}</h1>
          <p className="verification-lead">
            {isVerified
              ? "Your email is confirmed. Your account has already been created—now sign in with the same email and password to open the media app."
              : "If you've confirmed your email, you're ready to sign in with the account you already created. If not, please check your inbox for the verification link."}
          </p>
          <div className="verification-important"><CheckCircle2 size={19} aria-hidden="true"/><p>Paid membership access becomes available once payment is confirmed. There's no need to start a second checkout or create another account.</p></div>
          <a href={mediaLogin} className="verification-primary-link verification-signin-link">Sign in to the media app <ArrowRight size={18}/></a>
          {!isVerified && <Link href="/check-email" className="verification-help-link">Still need to verify? Check your email</Link>}
          <Link href="/contact" className="verification-help-link">Need help? Contact us</Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
