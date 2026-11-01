import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { Header } from "@/components/site-header";
import { getMarketingSettings } from "@/lib/marketing-settings";
import { Footer } from "@/components/site";

export default async function Login({ searchParams }: { searchParams: Promise<{ next?: string; error?: string; message?: string }> }) {
  const params = await searchParams;
  const marketingSettings = await getMarketingSettings();
  const rawNext = params.next || "/app";
  const safeNext = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/app";

  // Paid checkout must stay on the marketing origin so the authenticated session
  // can be used by the checkout handoff. All normal app sign-ins happen on the
  // media origin, where the browser session will remain available to the app.
  if (safeNext.split("?", 1)[0] !== "/membership") {
    redirect(`https://media.teens2inspire.org/login?next=${encodeURIComponent(safeNext)}`);
  }

  return <>
    <Header logoSrc={marketingSettings.brand_logo_url}/>
    <main className="auth-page">
      <div className="auth-orb" />
      <section className="auth-panel">
        <div className="eyebrow"><span className="eyebrow-dot" /> WELCOME BACK</div>
        <h1>Sign in to continue.</h1>
        <p className="auth-intro">Sign in to your account to continue to secure membership checkout.</p>
        <div className="form auth-form"><AuthForm mode="login" /></div>
      </section>
    </main>
    <Footer />
  </>;
}
