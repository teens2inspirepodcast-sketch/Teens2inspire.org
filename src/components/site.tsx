import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Bookmark, Headphones, Heart, PlayCircle, Sparkles } from "lucide-react";
import { Header } from "@/components/site-header";
import { getMarketingSettings } from "@/lib/marketing-settings";
import { PartnershipCarousel } from "@/components/partnership-carousel";
import { SitePopupModal } from "@/components/site-popup";
import { readSitePopup, getPopupMediaUrl } from "@/lib/site-popup";

export async function Footer() {
  const settings = await getMarketingSettings();
  return <footer className="marketing-footer">
    <div className="footer-top">
      <Link className="wordmark-logo-wrap footer-logo-wrap" href="/" aria-label="Teens2Inspire home">
        {settings.brand_logo_url && /^https:\/\//.test(settings.brand_logo_url)
          ? <img className="wordmark-logo" src={settings.brand_logo_url} alt="Teens2Inspire" width={520} height={130}/>
          : <Image className="wordmark-logo" src="/teens2inspire-logo.png" alt="Teens2Inspire" width={520} height={130}/>}
      </Link>
      <p>{settings.footer_tagline || "Inspiring Jewish teen girls."}</p>
      <Link className="footer-cta" href="/signup">Join us <ArrowUpRight size={16}/></Link>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Teens2Inspire</span>
      <span>Made with intention.</span>
      <div><Link href="/about">About</Link><Link href="/contact">Contact</Link><Link href="/school">School access</Link><Link href="/membership">Membership</Link><Link href="/terms">Terms</Link><Link href="/privacy">Privacy</Link><Link href="/cookies">Cookies</Link><Link href="/refunds">Refunds</Link></div>
    </div>
  </footer>;
}

export async function Page({ title, children }: { title: string; children: React.ReactNode }) {
  const settings = await getMarketingSettings();
  return <><Header logoSrc={settings.brand_logo_url}/><main className="inner-page"><div className="inner-page-glow"/><div className="inner-page-content"><div className="eyebrow"><span className="eyebrow-dot"/> TEENS2INSPIRE</div><h1>{title}</h1><div className="inner-copy">{children}</div></div></main><Footer/></>;
}

/** A marketing homepage, not a public mirror of members-only media. */
export async function Home() {
  const [settings, announcement] = await Promise.all([getMarketingSettings(), readSitePopup()]);
  const popupMedia = announcement?.is_enabled ? await getPopupMediaUrl(announcement.media_path) : null;
  return <>
    {announcement?.is_enabled && <SitePopupModal settings={announcement} mediaUrl={popupMedia}/>}
    <Header logoSrc={settings.brand_logo_url}/>
    <main className="t2i-live-home">
      <section className="t2i-live-hero" aria-labelledby="t2i-live-headline">
        <div className="t2i-live-ambient" aria-hidden="true"/>
        <h1 id="t2i-live-headline">{settings.home_hero_title || "Everything you love. All in one place."}</h1>
        <Link href="/signup" className="t2i-live-join">Join Us <ArrowUpRight aria-hidden="true" size={20}/></Link>
      </section>
      <section className="t2i-home-benefits" aria-labelledby="t2i-home-benefits-title">
        <div className="t2i-home-benefits-wrap">
          <div className="t2i-home-benefits-intro">
            <span className="t2i-home-section-label"><Sparkles size={15} aria-hidden="true"/> MADE FOR YOUR EVERYDAY MOMENTS</span>
            <h2 id="t2i-home-benefits-title">{settings.home_why_title || "Inspiration that fits into real life."}</h2>
            <p>{settings.home_why_description || "Teens2Inspire brings meaningful Jewish content into one welcoming space. Whether you have five minutes or a quiet afternoon, there's something to help you feel inspired, understood, and connected."}</p>
            <Link href="/signup" className="t2i-home-text-link">Discover your space <ArrowUpRight size={18} aria-hidden="true"/></Link>
          </div>
          <div className="t2i-home-benefit-list">
            <article className="t2i-home-benefit">
              <div className="t2i-home-benefit-icon"><PlayCircle size={23} strokeWidth={1.8} aria-hidden="true"/></div>
              <div><h3>{settings.home_feature_media_title || "Watch, listen, and read"}</h3><p>{settings.home_feature_media_body || "Explore videos, podcasts, articles, and thoughtful resources in one easy-to-use library."}</p></div>
            </article>
            <article className="t2i-home-benefit">
              <div className="t2i-home-benefit-icon"><Bookmark size={23} strokeWidth={1.8} aria-hidden="true"/></div>
              <div><h3>{settings.home_feature_saved_title || "Save what speaks to you"}</h3><p>{settings.home_feature_saved_body || "Keep the stories and conversations you love close by in your own saved library."}</p></div>
            </article>
            <article className="t2i-home-benefit">
              <div className="t2i-home-benefit-icon"><Headphones size={23} strokeWidth={1.8} aria-hidden="true"/></div>
              <div><h3>{settings.home_feature_pace_title || "Enjoy it at your own pace"}</h3><p>{settings.home_feature_pace_body || "Pick up a meaningful episode, take a moment to read, or listen as you explore the app."}</p></div>
            </article>
            <article className="t2i-home-benefit">
              <div className="t2i-home-benefit-icon"><Heart size={23} strokeWidth={1.8} aria-hidden="true"/></div>
              <div><h3>{settings.home_feature_values_title || "Created for Jewish teen girls"}</h3><p>{settings.home_feature_values_body || "Real conversations about emunah, friendships, personal growth, and the things that matter in your world."}</p></div>
            </article>
          </div>
        </div>
      </section>
      <section className="t2i-home-join-story" aria-labelledby="t2i-home-join-title">
        <div className="t2i-home-join-story-inner">
          <span className="t2i-home-section-label">ONE THOUGHTFUL SPACE</span>
          <h2 id="t2i-home-join-title">{settings.home_join_title || "More than entertainment. A little inspiration to carry with you."}</h2>
          <p>{settings.home_join_description || "Find the content that makes you think, gives you strength, or simply brightens your day. Choose a personal or family membership, or learn about school access."}</p>
          <div className="t2i-home-join-actions">
            <Link href="/signup" className="t2i-live-join">Join Us <ArrowUpRight size={19} aria-hidden="true"/></Link>
            <Link href="/membership" className="t2i-home-join-outline">Explore memberships</Link>
          </div>
        </div>
      </section>
      <PartnershipCarousel/>
    </main>
    <Footer/>
  </>;
}
